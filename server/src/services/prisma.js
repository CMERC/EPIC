const { Prisma } = require('prisma-binding')

const clients = new Map()

const getLegacyPrisma = (endpoint = process.env.PRISMA_ENDPOINT) => {
  const cacheKey = `${endpoint || ''}:${process.env.PRISMA_SECRET || ''}`
  if (!clients.has(cacheKey)) {
    clients.set(cacheKey, new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint,
      secret: process.env.PRISMA_SECRET,
      debug: false
    }))
  }

  return clients.get(cacheKey)
}

module.exports = {
  getLegacyPrisma
}
