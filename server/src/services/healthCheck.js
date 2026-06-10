
const fetch = require('node-fetch')
const { getPrismaClient } = require('./prisma')

function requestUrl(url, params) {
  const target = new URL(url)
  if (params) {
    Object.keys(params).forEach(key => target.searchParams.set(key, params[key]))
  }

  return fetch(target.toString(), {
    headers: {
      'User-Agent': 'epic-healthcheck'
    }
  })
    .then(resp => ({
      message: resp.statusText,
      status: String(resp.status)
    }))
    .catch(err => ({
      message: err.message,
      status: '500'
    }))
}

async function redisHealth(redisClient) {
  const redis = {
    name: 'Redis',
    timestamp: Date.now(),
    message: redisClient ? 'Not checked' : 'Redis client not configured',
    status: redisClient ? '500' : '200'
  }

  if (!redisClient || typeof redisClient.ping !== 'function') {
    return redis
  }

  try {
    const result = await redisClient.ping()
    if (result === 'PONG') {
      return {
        ...redis,
        message: 'OK',
        status: '200'
      }
    }

    return {
      ...redis,
      message: 'Unexpected Redis response: ' + result,
      status: '500'
    }
  } catch (err) {
    return {
      ...redis,
      message: err.message,
      status: '500'
    }
  }
}

async function getHealthCheckEndpoints({ redisClient } = {}) {
  let apolloCheck = requestUrl('http://localhost:' + (process.env.PORT || 4000) + '/.well-known/apollo/server-health')
  let minioCheck = requestUrl(process.env.S3_ENDPOINT + '/minio/health/ready')
  let allServicesOk = true
  let apollo = {
    name: 'Apollo Server',
    timestamp: Date.now()
  }
  let prismaOrm = {
    name: 'Prisma ORM',
    timestamp: Date.now(),
    message: process.env.DATABASE_URL ? 'Not checked' : 'DATABASE_URL not configured',
    status: '200'
  }
  let redis = {
    name: 'Redis',
    timestamp: Date.now()
  }
  let minio = {
    name: 'Minio',
    timestamp: Date.now()
  }
  let graphqlFaker = {
    name: 'graphql Faker',
    timestamp: Date.now()
  }
  // db
  // let dbCheck = (await exec('docker inspect --format "{{json .State.Status}}" db')).stdout != 'running'
  // let db = {
  //   name: 'MySql db',
  //   timestamp: Date.now(),
  //   status: dbCheck ? '200' : '500',
  //   message: dbCheck ? 'OK' : 'Error'
  // }
  //if (!dbCheck) allServicesOk = false
  // This should match with schema.faker.graphql
  const query = `{
    profile{
      name
      username
      jobTitle
      company
    }
  }`
  let graphqlFakerCheck = requestUrl(process.env.FAKER_GRAPHQL_ENDPOINT, { query: query })
  // graphqlFaker
  await graphqlFakerCheck.then((result) => {
    if (result.status != '200') allServicesOk = false
    graphqlFaker = {
      ...graphqlFaker,
      ...result
    }
  })
  // Apollo
  await apolloCheck.then((result) => {
    if (result.status != '200') allServicesOk = false
    apollo = {
      ...apollo,
      ...result
    }
  })
  // minio
  await minioCheck.then((result) => {
    if (result.status != '200') allServicesOk = false
    minio = {
      ...minio,
      ...result
    }
  })
  if (process.env.DATABASE_URL) {
    try {
      const prismaClient = getPrismaClient()
      await prismaClient.$queryRaw`SELECT 1`
      prismaOrm = {
        ...prismaOrm,
        message: 'OK',
        status: '200'
      }
    } catch (err) {
      allServicesOk = false
      prismaOrm = {
        ...prismaOrm,
        message: err.message,
        status: '500'
      }
    }
  }
  redis = await redisHealth(redisClient)
  if (redis.status != '200') allServicesOk = false

  let returnData = {
    apollo,
    //db,
    prismaOrm,
    minio,
    redis,
    graphqlFaker,
    checkedAt: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    status: allServicesOk ? '200' : '500'
  }

  return returnData
}

module.exports = {
  getHealthCheckEndpoints,
  _test: {
    redisHealth
  }
}
