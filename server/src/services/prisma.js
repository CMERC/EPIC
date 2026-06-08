const { createPrismaClientBinding } = require('./prismaClientBinding')

let prismaClient
let prismaClientBinding

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

const getLegacyPrisma = () => {
  const prisma = getPrismaClient()
  if (!prisma) {
    return null
  }

  if (!prismaClientBinding) {
    prismaClientBinding = createPrismaClientBinding(prisma)
  }

  return prismaClientBinding
}

module.exports = {
  getLegacyPrisma,
  getPrismaClient
}
