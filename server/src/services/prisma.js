const { Prisma } = require('prisma-binding')

const clients = new Map()
let prismaClient

const getLegacyPrisma = (endpoint = process.env.PRISMA_ENDPOINT) => {
  const cacheKey = `${endpoint || ''}:${process.env.PRISMA_SECRET || ''}`
  if (!clients.has(cacheKey)) {
    const client = new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint,
      secret: process.env.PRISMA_SECRET,
      debug: false
    })
    client._endpoint = endpoint
    client._secret = process.env.PRISMA_SECRET
    clients.set(cacheKey, client)
  }

  return clients.get(cacheKey)
}

const getPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    return null
  }

  if (!prismaClient) {
    const { PrismaClient } = require('@prisma/client')
    prismaClient = new PrismaClient()
  }

  return prismaClient
}

module.exports = {
  getLegacyPrisma,
  getPrismaClient
}
