const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const {
  generatePrismaId,
  orderByFromPrisma1
} = require('../services/prismaBridge')

const commandWhereFromPrisma1 = where => {
  if (!where) return undefined

  const mapped = {}
  Object.entries(where).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (['AND', 'OR', 'NOT'].includes(key) && Array.isArray(value)) {
      mapped[key] = value.map(commandWhereFromPrisma1)
      return
    }

    const contains = key.match(/^(.+)_contains$/)
    if (contains) {
      mapped[contains[1]] = {
        contains: value
      }
      return
    }

    mapped[key] = value
  })

  return mapped
}

const commandArgsFromPrisma1 = variables => {
  const args = {}
  if (variables.where) args.where = commandWhereFromPrisma1(variables.where)
  if (variables.orderBy) args.orderBy = orderByFromPrisma1(variables.orderBy)
  if (Number.isInteger(variables.first)) args.take = variables.first
  if (Number.isInteger(variables.skip)) args.skip = variables.skip
  return args
}

const commandDataFromInput = (data = {}, create = false) => {
  const now = new Date()
  const commandData = {}
  ;[
    'id',
    'title',
    'body',
    'fromName',
    'fromEmail',
    'recipientNames',
    'recipientEmails',
    'priority',
    'status',
    'dueAt',
    'sentAt',
    'acknowledgedAt',
    'completedAt',
    'response',
    'planInjectId',
    'planInjectNumber',
    'planInjectTitle',
    'createdBy',
    'updatedBy'
  ].forEach(field => {
    if (data[field] !== undefined) {
      commandData[field] = data[field]
    }
  })

  if (create) {
    commandData.id = commandData.id || generatePrismaId()
    commandData.createdAt = data.createdAt || now
    commandData.updatedAt = data.updatedAt || now
    commandData.priority = commandData.priority || 'ROUTINE'
    commandData.status = commandData.status || 'DRAFT'
  } else {
    commandData.updatedAt = data.updatedAt || now
  }

  return commandData
}

const localCommandRequest = async(ctx, query, variables = {}) => {
  const prisma = ctx.prisma
  if (!prisma || !prisma.commandMessage) {
    throw new Error('Command Prisma Client model is unavailable')
  }

  if (query.includes('commandMessages(')) {
    return {
      commandMessages: await prisma.commandMessage.findMany(commandArgsFromPrisma1(variables))
    }
  }

  if (query.includes('commandMessage(where:')) {
    return {
      commandMessage: await prisma.commandMessage.findUnique({
        where: variables.where
      })
    }
  }

  if (query.includes('createCommandMessage(')) {
    return {
      createCommandMessage: await prisma.commandMessage.create({
        data: commandDataFromInput(variables.data, true)
      })
    }
  }

  if (query.includes('updateCommandMessage(')) {
    return {
      updateCommandMessage: await prisma.commandMessage.update({
        where: variables.where,
        data: commandDataFromInput(variables.data)
      })
    }
  }

  if (query.includes('deleteCommandMessage(')) {
    return {
      deleteCommandMessage: await prisma.commandMessage.delete({
        where: variables.where
      })
    }
  }

  throw new Error('Unsupported command request')
}

async function commandRequest(ctx, query, variables) {
  const endpoint = ctx.db && ctx.db._endpoint
  if (!endpoint) throw new Error('Command workspace endpoint is unavailable')
  if (endpoint === 'prisma-client') {
    return localCommandRequest(ctx, query, variables)
  }

  const headers = {
    'content-type': 'application/json'
  }

  if (ctx.db._secret) {
    headers.authorization = `Bearer ${jwt.sign({}, ctx.db._secret)}`
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  })
  const result = await response.json()

  if (result.errors && result.errors.length) {
    throw new Error(result.errors.map(error => error.message).join('; '))
  }

  return result.data
}

module.exports = {
  commandRequest
}
