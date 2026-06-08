const { Prisma } = require('@prisma/client')

const lowerFirst = value => value.charAt(0).toLowerCase() + value.slice(1)

const models = Prisma.dmmf.datamodel.models.map(model => ({
  name: model.name,
  delegate: lowerFirst(model.name)
}))

const delegateByField = new Map()
models.forEach(model => {
  delegateByField.set(model.delegate, model.delegate)
  delegateByField.set(`${model.delegate}s`, model.delegate)
  delegateByField.set(`${model.delegate}es`, model.delegate)
})
delegateByField.set('users', 'user')
delegateByField.set('mediaPersonae', 'mediaPersona')
delegateByField.set('planJmets', 'planJmet')
delegateByField.set('planLessonsLearneds', 'planLessonsLearned')
delegateByField.set('planMeasureDatas', 'planMeasureData')

const orderByFromPrisma1 = orderBy => {
  if (!orderBy || typeof orderBy !== 'string') {
    return undefined
  }

  const [field, direction] = orderBy.split(/_(ASC|DESC)$/)
  if (!field || !direction) {
    return undefined
  }

  return { [field]: direction.toLowerCase() }
}

const scalarWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const mapped = {}
  Object.entries(where).forEach(([key, value]) => {
    if (value === undefined) {
      return
    }
    if (['AND', 'OR', 'NOT'].includes(key) && Array.isArray(value)) {
      mapped[key] = value.map(scalarWhereFromPrisma1)
      return
    }
    const match = key.match(/^(.+?)_(not|in|not_in|lt|lte|gt|gte|contains|starts_with|ends_with)$/)
    if (match) {
      const [, field, operator] = match
      const prismaOperator = {
        not: 'not',
        in: 'in',
        not_in: 'notIn',
        lt: 'lt',
        lte: 'lte',
        gt: 'gt',
        gte: 'gte',
        contains: 'contains',
        starts_with: 'startsWith',
        ends_with: 'endsWith'
      }[operator]
      mapped[field] = {
        ...(typeof mapped[field] === 'object' && mapped[field] !== null ? mapped[field] : {}),
        [prismaOperator]: value
      }
      return
    }
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      mapped[key] = scalarWhereFromPrisma1(value)
      return
    }
    mapped[key] = value
  })
  return mapped
}

const argsFromPrisma1 = (args = {}) => {
  const prismaArgs = {}
  if (args.where) {
    prismaArgs.where = scalarWhereFromPrisma1(args.where)
  }
  if (args.orderBy) {
    prismaArgs.orderBy = orderByFromPrisma1(args.orderBy)
  }
  if (Number.isInteger(args.skip)) {
    prismaArgs.skip = args.skip
  }
  if (Number.isInteger(args.first)) {
    prismaArgs.take = args.first
  }
  return prismaArgs
}

const dataFromPrisma1 = data => {
  if (!data) {
    return data
  }

  const mapped = {}
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) {
      return
    }
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      mapped[key] = dataFromPrisma1(value)
      return
    }
    mapped[key] = value
  })
  return mapped
}

const modelForOperation = field => {
  const operation = field.replace(/^(create|update|upsert|delete|updateMany|deleteMany)/, '')
  if (!operation || operation === field) {
    return null
  }
  return delegateByField.get(lowerFirst(operation))
}

const modelForQuery = field => {
  const base = field.replace(/Connection$/, '')
  return delegateByField.get(base)
}

const emptyAsyncIterator = () => ({
  async next() {
    return { value: undefined, done: true }
  },
  async return() {
    return { value: undefined, done: true }
  },
  async throw(error) {
    throw error
  },
  [Symbol.asyncIterator]() {
    return this
  }
})

const createPrismaClientBinding = prisma => ({
  _endpoint: 'prisma-client',
  _secret: process.env.JWT_SECRET || process.env.PRISMA_SECRET,
  query: new Proxy({}, {
    get(target, field) {
      return async(args = {}) => {
        const name = String(field)
        const model = modelForQuery(name)
        if (!model || !prisma[model]) {
          throw new Error(`No Prisma Client query adapter for ${name}`)
        }

        const prismaArgs = argsFromPrisma1(args)
        if (name.endsWith('Connection')) {
          const count = await prisma[model].count({ where: prismaArgs.where })
          return {
            aggregate: { count },
            edges: []
          }
        }

        const isMany = name !== model
        return isMany
          ? prisma[model].findMany(prismaArgs)
          : prisma[model].findFirst(prismaArgs)
      }
    }
  }),
  mutation: new Proxy({}, {
    get(target, field) {
      return async(args = {}) => {
        const name = String(field)
        const model = modelForOperation(name)
        if (!model || !prisma[model]) {
          throw new Error(`No Prisma Client mutation adapter for ${name}`)
        }

        if (name.startsWith('create')) {
          return prisma[model].create({ data: dataFromPrisma1(args.data) })
        }
        if (name.startsWith('updateMany')) {
          return prisma[model].updateMany({
            where: scalarWhereFromPrisma1(args.where),
            data: dataFromPrisma1(args.data)
          })
        }
        if (name.startsWith('update')) {
          return prisma[model].update({
            where: args.where,
            data: dataFromPrisma1(args.data)
          })
        }
        if (name.startsWith('upsert')) {
          return prisma[model].upsert({
            where: args.where,
            create: dataFromPrisma1(args.create),
            update: dataFromPrisma1(args.update)
          })
        }
        if (name.startsWith('deleteMany')) {
          return prisma[model].deleteMany({
            where: scalarWhereFromPrisma1(args.where)
          })
        }
        if (name.startsWith('delete')) {
          return prisma[model].delete({ where: args.where })
        }
      }
    }
  }),
  exists: new Proxy({}, {
    get(target, field) {
      return async(where = {}) => {
        const model = delegateByField.get(lowerFirst(String(field)))
        if (!model || !prisma[model]) {
          throw new Error(`No Prisma Client exists adapter for ${String(field)}`)
        }
        const count = await prisma[model].count({
          where: scalarWhereFromPrisma1(where)
        })
        return count > 0
      }
    }
  }),
  subscription: new Proxy({}, {
    get() {
      return () => emptyAsyncIterator()
    }
  })
})

module.exports = {
  createPrismaClientBinding
}
