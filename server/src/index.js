const logger = require('./logger')
const express = require('express')
const {
  permissions,
  globalResolvers,
  workspaceResolvers,
  trackingResolvers,
  activityResolvers
} = require('./middleware')
const createApolloServer = require('./apollo-server')
const { PubSub } = require('graphql-subscriptions')
const { getLegacyPrisma, getPrismaClient } = require('./services/prisma')

const { importSchema } = require('graphql-import')
const typeDefs = importSchema('./src/schema.graphql')
const resolvers = require('./resolvers')
const cors = require('cors')

const { getBullQueues } = require('./jobs/arena')

const { getHealthCheckEndpoints } = require('./services/healthCheck')

const {
  GraphqlAuthenticationPrismaAdapter
} = require('graphql-authentication-prisma')
const { graphqlAuthenticationConfig } = require('graphql-authentication')

const { email } = require('./email')

const Redis = require('ioredis')
const redisClient = new Redis(process.env.REDIS_ENDPOINT)
redisClient.on('connect', function() {
  logger.info('Redis client connected')
})
redisClient.on('error', function(err) {
  logger.error('Redis client error ' + err)
})

const app = express()
app.use(cors())

const connectionMiddlewares = [
  permissions,
  globalResolvers,
  workspaceResolvers,
  trackingResolvers,
  activityResolvers
]
// https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use('/healthcheck', async(req, res) => {
  let testResults
  await getHealthCheckEndpoints().then(res => {
    testResults = res
  })
  if (testResults.status) {
    res.status(Number(testResults.status))
  }
  res.send(testResults)
})

// // redirect to the url passed into the link route
// // ie. example.com/link?url=https%3A%2F%2Fwww.google.com%2F
app.use('/link', (req, res) => {
  const redirectURL = req.query.url

  if (redirectURL === undefined) {
    res
      .status(400) // HTTP status 404: NotFound
      .send('URL not defined in request')
  } else {
    let decodedURL
    try {
      decodedURL = decodeURIComponent(redirectURL)
      const parsedURL = new URL(decodedURL)
      if (!['http:', 'https:', 'ftp:'].includes(parsedURL.protocol)) {
        throw new Error('Unsupported redirect protocol')
      }
    } catch (error) {
      res.status(400).send('Invalid redirect URL')
      return
    }
    res.redirect(decodedURL)
  }
})

// Start the scheduler for posting
const { initPublishPostJobs } = require('./jobs/publishPosts')
const schedulerDisabled = String(process.env.DISABLE_SCHEDULER || '').toLowerCase() === 'true'
if (schedulerDisabled) {
  logger.warn('DISABLE_SCHEDULER variable has disabled the scheduling of future posts and noise.')
}
else {
  initPublishPostJobs()
}

// Access arena at http://localhost:4000/arena/ when bull-arena is installed
// and ENABLE_ARENA=true. Keep this off by default to reduce production surface.
if (String(process.env.ENABLE_ARENA || '').toLowerCase() === 'true') {
  try {
    const Arena = require('bull-arena')
    getBullQueues().then(res => {
      const arenaConfig = Arena({ queues: res }, { basePath: '/arena' })
      app.use('/', arenaConfig)
    })
  } catch (error) {
    logger.warn('ENABLE_ARENA=true but bull-arena is not installed.')
  }
}

async function startServer() {
  const server = await createApolloServer(app, {
    graphqlEndpoint: '/graphql',
    subscriptionsEndpoint: '/graphql',
    graphqlMiddlewares: connectionMiddlewares,
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({
      ...req,
      db: getLegacyPrisma(),
      global: getLegacyPrisma(),
      prisma: getPrismaClient(),
      pubsub: new PubSub(),
      redisClient,
      graphqlAuthentication: graphqlAuthenticationConfig({
        validatePassword: value => value.length >= 5,
        adapter: new GraphqlAuthenticationPrismaAdapter({ prismaContextName: 'global' }),
        secret: process.env.PRISMA_SECRET,
        mailer: email,
        mailAppUrl: process.env.APP_DOMAIN
      })
    })
  })

  const options = { port: process.env.PORT || 4000 }

  server.listen(options, () => {
    logger.info('Server is running on http://localhost:' + options.port)
  })
}

startServer().catch(error => {
  logger.error(error)
  process.exit(1)
})
