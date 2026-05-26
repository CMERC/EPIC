import Vue from 'vue'
import VueApollo from 'vue-apollo'
import {
  createApolloClient,
  restartWebsockets
} from 'vue-cli-plugin-apollo/graphql-client'

import clientStateDefaults from './state/defaults'
import { ConnectedSet } from '@/state/graphql/user.gql'
import { typeDefs, resolvers } from '@/state/local'
import { ApolloLink } from 'apollo-link'
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
  httpEndpoint: process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000',
  // Use `null` to disable subscriptions
  wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000',
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
    wsClient.connectionParams = () => {
      return {
        workspace:
          sessionStorage.getItem('workspace') ||
          localStorage.getItem('workspace'),
        authorization: localStorage.getItem(AUTH_TOKEN)
      }
    }
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
  function setConnected(value) {
    apolloClient.mutate({
      mutation: ConnectedSet,
      variables: {
        value
      }
    })
  }

  wsClient.on('connected', () => setConnected(true))
  // eslint-disable-next-line space-before-function-paren
  wsClient.on('reconnected', async () => {
    await resetApollo(apolloClient)
    setConnected(true)
  })
  // Offline
  wsClient.on('disconnected', () => setConnected(false))
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
