const http = require('http')
const express = require('express')
const corsMiddleware = require('cors')
const { execute, subscribe } = require('graphql')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@as-integrations/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { applyMiddleware } = require('graphql-middleware')
const { useServer } = require('graphql-ws/lib/use/ws')
const { WebSocketServer } = require('ws')
const { logger } = require('./logger')

function pruneMiddlewareToSchema(schema, middleware) {
  if (typeof middleware === 'function') {
    return middleware
  }

  return Object.keys(middleware).reduce((types, typeName) => {
    const type = schema.getType(typeName)
    if (!type || typeof type.getFields !== 'function') {
      return types
    }

    const fields = type.getFields()
    const fieldMiddleware = Object.keys(middleware[typeName]).reduce((resolvers, fieldName) => {
      if (fields[fieldName]) {
        resolvers[fieldName] = middleware[typeName][fieldName]
      }
      return resolvers
    }, {})

    if (Object.keys(fieldMiddleware).length > 0) {
      types[typeName] = fieldMiddleware
    }

    return types
  }, {})
}

/**
 *
 * @description Creates an Apollo Server. Setup based on `vue-cli-plugin-apollo`.
 * @param {Object} app Express application
 * @param {Object} options Apollo options
 * @returns {Object} HTTP Server
 */
async function createApolloServer(
  app,
  {
    // Main options
    graphqlEndpoint = '',
    typeDefs = {},
    resolvers = {},
    graphqlMiddlewares = [],
    dataSources = () => ({}),
    context = () => ({}),
    // Subscriptions
    subscriptionsEndpoint = '',
    wsMiddlewares = [],
    // Mocks
    mocks,
    // Apollo Engine
    engineKey = '',
    // HTTP options
    cors = false,
    timeout = 120000,
    // Extra options for Apollo Server
    apolloServerOptions = {
      introspection: true
    }
  }
) {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      allowResolversNotInSchema: true,
      requireResolversForResolveType: false,
    },
  })
  const prunedGraphqlMiddlewares = graphqlMiddlewares.map(middleware => pruneMiddlewareToSchema(schema, middleware))
  const applyGraphQLMiddleware = applyMiddleware
  const executableSchema = applyGraphQLMiddleware(schema, ...prunedGraphqlMiddlewares)
  const httpServer = http.createServer(app)
  httpServer.setTimeout(timeout)

  const buildContext = async requestData => {
    let contextData
    try {
      contextData = await context(requestData)
    } catch (error) {
      logger.error(error)
      throw error
    }

    return contextData
  }

  const subscriptionServer = subscriptionsEndpoint
    ? useServer({
      schema: executableSchema,
      execute,
      subscribe,
      context: async(ctx) => {
        const connection = ctx.connectionParams || {}
        const headers = {
          ...ctx.extra.request.headers,
          ...connection
        }
        const req = {
          ...ctx.extra.request,
          headers,
          get: name => headers[name] || headers[name.toLowerCase()]
        }

        try {
          await new Promise((resolve, reject) =>
            wsMiddlewares.reduceRight(
              (acc, m) => err => (err ? reject(err) : m(req, null, acc)),
              err => (err ? reject(err) : resolve())
            )()
          )

          return await buildContext({
            connection,
            websocket: ctx.extra.socket,
            request: req,
            req
          })
        } catch (error) {
          if (error.status !== 401) {
            logger.error(error)
          }

          throw error
        }
      }
    }, new WebSocketServer({
      server: httpServer,
      path: subscriptionsEndpoint
    }))
    : null

  // Apollo server options
  const options = {
    ...apolloServerOptions,
    schema: executableSchema,
    dataSources,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              if (subscriptionServer) {
                await subscriptionServer.dispose()
              }
            }
          }
        }
      }
    ]
  }

  if (engineKey) {
    options.apollo = {
      key: engineKey
    }
  }

  // Automatic mocking
  if (mocks) {
    options.mocks = mocks

    if (process.env.NODE_ENV === 'production') {
      logger.warn('⚠️  Automatic mocking is enabled in production')
    } else {
      logger.info('✔️  Automatic mocking is enabled')
    }
  }

  // Apollo Server
  const server = new ApolloServer(options)
  await server.start()

  app.get('/.well-known/apollo/server-health', (req, res) => {
    res.json({ status: 'pass' })
  })

  const middlewares = []
  if (cors) {
    middlewares.push(corsMiddleware(typeof cors === 'object' ? cors : undefined))
  }
  middlewares.push(express.json({ limit: '50mb' }))
  middlewares.push(expressMiddleware(server, {
    context: async({ req, res }) => buildContext({ req, res, request: req })
  }))
  app.use(graphqlEndpoint, ...middlewares)

  return httpServer
}

module.exports = createApolloServer
