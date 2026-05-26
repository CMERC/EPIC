
const fetch = require('node-fetch')

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

async function getHealthCheckEndpoints() {
  let apolloCheck = requestUrl('http://localhost:' + (process.env.PORT || 4000) + '/.well-known/apollo/server-health')
  let minioCheck = requestUrl(process.env.S3_ENDPOINT + '/minio/health/ready')
  let prismaCheck = requestUrl(process.env.PRISMA_ENDPOINT + '/management')
  //const redisClient = new Redis(process.env.REDIS_ENDPOINT)
  let allServicesOk = true
  let apollo = {
    name: 'Apollo Server',
    timestamp: Date.now()
  }
  let prisma = {
    name: 'Prisma',
    timestamp: Date.now(),
  }
  let prismaOrm = {
    name: 'Prisma ORM',
    timestamp: Date.now(),
    message: process.env.DATABASE_URL ? 'Not checked' : 'DATABASE_URL not configured; using Prisma 1 compatibility adapter',
    status: '200'
  }
  // let redis = {
  //   name: 'Redis',
  //   timestamp: Date.now(),
  // }
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
  // Prisma
  await prismaCheck.then((result) => {
    if (result.status != '200') allServicesOk = false
    prisma = {
      ...prisma,
      ...result
    }
  })
  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = require('@prisma/client')
      const prismaClient = new PrismaClient()
      await prismaClient.$queryRaw`SELECT 1`
      await prismaClient.$disconnect()
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
  //Redis
  // await redisClient.ping().then((result) => {
  //   let redisStatus
  //   if (result == 'PONG') {
  //     redisStatus = { 'message': 'OK', 'status': '200' }
  //   } else {
  //     allServicesOk = false
  //     redisStatus = { 'message': 'Error', 'status': 'Error' }
  //   }
  //   redis = {
  //     ...redis,
  //     ...redisStatus
  //   }
  // })

  let returnData = {
    apollo,
    //db,
    prisma,
    prismaOrm,
    minio,
    //redis,
    graphqlFaker,
    status: allServicesOk ? '200' : '500'
  }

  return returnData
}

module.exports = {
  getHealthCheckEndpoints
}
