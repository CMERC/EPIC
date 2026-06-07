import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, Observable, split, from } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from 'apollo-utilities'
import { createClient } from 'graphql-ws'
import { print } from 'graphql/language/printer'

import clientStateDefaults from './state/defaults'
import { ConnectedSet } from '@/state/graphql/user.gql'
import { typeDefs, resolvers } from '@/state/local'
import { RetryLink } from 'apollo-link-retry'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'token'

// RetyrLink: default eq to below
let retyrLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 5,
    retryIf: error => !!error
  }
})
const localDataMiddleware = new ApolloLink((operation, forward) => {
  // send activeWorkspace in headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      workspace:
        sessionStorage.getItem('workspace') || localStorage.getItem('workspace')
    }
  }))
  return forward(operation)
})
// generate apllo link with custom links
let myLink = ApolloLink.from([retyrLink, localDataMiddleware])

function getAuth(tokenName) {
  const token = localStorage.getItem(tokenName)
  return token ? `Bearer ${token}` : ''
}

function getConnectionParams() {
  return {
    workspace:
      sessionStorage.getItem('workspace') || localStorage.getItem('workspace'),
    authorization: localStorage.getItem(AUTH_TOKEN)
  }
}

function createGraphqlWsLink(wsClient) {
  return new ApolloLink(operation => new Observable(observer => {
    return wsClient.subscribe(
      {
        query: print(operation.query),
        variables: operation.variables,
        operationName: operation.operationName
      },
      {
        next: value => observer.next(value),
        error: error => observer.error(error),
        complete: () => observer.complete()
      }
    )
  }))
}

function restartWebsockets(wsClient) {
  if (wsClient && typeof wsClient.dispose === 'function') {
    wsClient.dispose()
  }
}

function createApolloClient(options) {
  const cache = new InMemoryCache()
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: getAuth(options.tokenName)
      }
    }))
    return forward(operation)
  })
  const httpLink = createUploadLink({
    uri: options.httpEndpoint
  })
  const httpChain = from([authLink, options.link, httpLink])
  let link = httpChain
  let wsClient = null

  if (!options.ssr && options.wsEndpoint) {
    wsClient = createClient({
      url: options.wsEndpoint,
      lazy: true,
      retryAttempts: Infinity,
      connectionParams: getConnectionParams
    })

    const wsLink = createGraphqlWsLink(wsClient)
    link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      wsLink,
      httpChain
    )
  }

  const apolloClient = new ApolloClient({
    link,
    cache,
    ssrForceFetchDelay: 100,
    connectToDevTools: process.env.NODE_ENV !== 'production',
    typeDefs: options.typeDefs,
    resolvers: options.resolvers
  })

  if (options.onCacheInit) {
    options.onCacheInit(cache)
    apolloClient.onResetStore(() => options.onCacheInit(cache))
  }

  return {
    apolloClient,
    wsClient
  }
}

function getBrowserGraphqlEndpoints() {
  if (typeof window === 'undefined' || !window.location) {
    return {
      httpEndpoint: 'http://localhost:4000/graphql',
      wsEndpoint: 'ws://localhost:4000/graphql'
    }
  }

  const { protocol, host } = window.location
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'

  return {
    httpEndpoint: `${protocol}//${host}/graphql`,
    wsEndpoint: `${wsProtocol}//${host}/graphql`
  }
}

const browserGraphqlEndpoints = getBrowserGraphqlEndpoints()

// Config
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  },
  query: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  },
  mutate: {
    errorPolicy: 'all'
  },
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,
  httpEndpoint:
    process.env.VUE_APP_GRAPHQL_HTTP || browserGraphqlEndpoints.httpEndpoint,
  // Use `null` to disable subscriptions
  wsEndpoint:
    process.env.VUE_APP_GRAPHQL_WS || browserGraphqlEndpoints.wsEndpoint,
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,

  // Override default http link
  link: myLink,

  // Override default cache
  // cache: myCache

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data
  typeDefs,
  resolvers,
  onCacheInit: cache => {
    cache.writeData({ data: clientStateDefaults() })
  }
}

// Call this in the Vue app file
export function createProvider(options = {}, { router }) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options
  })
  // Override wsClient to send activeWorkspace
  if (wsClient) {
    wsClient.lazy = true
    wsClient.reconnect = true
    wsClient.connectionParams = getConnectionParams
  }
  apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-and-network'
      }
    },
    errorHandler(error) {
      if (isUnauthorizedError(error)) {
        // Redirect to login page
        if (!router.currentRoute.meta.skipAuth) {
          router.replace({
            name: 'login',
            params: {
              wantedRoute: router.currentRoute.fullPath
            }
          })
        }
      } else {
        // eslint-disable-next-line no-console
        console.log(
          '%cError',
          'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
          error.message
        )
      }
    }
  })

  /* Connected state */
  let hasConnected = false
  function setConnected(value) {
    apolloClient.mutate({
      mutation: ConnectedSet,
      variables: {
        value
      }
    })
  }

  wsClient.on('connected', async () => {
    if (hasConnected) {
      await resetApollo(apolloClient)
    }
    hasConnected = true
    setConnected(true)
  })
  // Offline
  wsClient.on('closed', () => setConnected(false))
  wsClient.on('error', () => setConnected(false))

  return apolloProvider
}

export async function resetApollo(apolloClient) {
  try {
    await apolloClient.resetStore()
    if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
    return true
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      // eslint-disable-next-line no-console
      console.log('%cError on cache reset', 'color: orange;', error.message)
    }
    return false
  }
}

// Manually call this when user log in
export async function onLogin(apolloClient, token) {
  localStorage.setItem(AUTH_TOKEN, token)
  return await resetApollo(apolloClient)
}

// Manually call this when user log out
export async function onLogout(apolloClient) {
  localStorage.removeItem(AUTH_TOKEN)
  await resetApollo(apolloClient)
}

//Check for the 'Not authorized' error which only comes from login with graphql-authentication library
export function isUnauthorizedError(error) {
  const { graphQLErrors } = error
  return (
    graphQLErrors &&
    graphQLErrors.length > 0 &&
    graphQLErrors.some(
      e => e.message === 'Not Authorised!' || e.message === 'Not authorized'
    )
  )
}
