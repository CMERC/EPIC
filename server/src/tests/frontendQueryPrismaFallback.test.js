const fs = require('fs')
const path = require('path')
const { parse } = require('graphql')
const { Query } = require('../resolvers/Query')

const repoRoot = path.resolve(__dirname, '../../..')
const frontendRoot = path.join(repoRoot, 'src')
const queryResolverPath = path.join(__dirname, '../resolvers/Query/index.js')

const walkGqlFiles = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const fullPath = path.join(dir, entry.name)
  if (entry.isDirectory()) {
    return walkGqlFiles(fullPath)
  }
  return entry.isFile() && entry.name.endsWith('.gql') ? [fullPath] : []
})

const frontendQueryRoots = () => {
  const roots = new Set()
  walkGqlFiles(frontendRoot).forEach(file => {
    const source = fs.readFileSync(file, 'utf8').replace(/^#import.*$/gm, '')
    let document
    try {
      document = parse(source)
    } catch (error) {
      return
    }

    document.definitions.forEach(definition => {
      if (definition.kind !== 'OperationDefinition' || definition.operation !== 'query') {
        return
      }
      definition.selectionSet.selections.forEach(selection => {
        if (selection.kind === 'Field' && !selection.name.value.startsWith('__')) {
          roots.add(selection.name.value)
        }
      })
    })
  })
  return roots
}

const legacyFrontendRoots = () => {
  const querySource = fs.readFileSync(queryResolverPath, 'utf8')
  return [...frontendQueryRoots()].filter(field => {
    const directForward = new RegExp(`\\b${field}\\s*:\\s*forwardTo\\('db'\\)`).test(querySource)
    const fnMatch = querySource.match(new RegExp(`\\n\\s{2}${field}\\s*\\([^)]*\\)\\s*{([\\s\\S]*?)(?=\\n\\s{2}[A-Za-z0-9_]+\\s*(?:\\(|:)|\\n})`))
    const dbOnly = Boolean(fnMatch && /ctx\\.db\\.query/.test(fnMatch[1]) && !/ctx\\.prisma/.test(fnMatch[1]))
    return directForward || dbOnly
  })
}

const prismaDelegate = {
  findFirst: jest.fn().mockResolvedValue(null),
  findMany: jest.fn().mockResolvedValue([]),
  count: jest.fn().mockResolvedValue(0)
}

const prisma = new Proxy({}, {
  get(target, prop) {
    if (!target[prop]) {
      target[prop] = prismaDelegate
    }
    return target[prop]
  }
})

test('frontend query roots do not rely on Prisma Binding-only resolvers', async() => {
  const fields = legacyFrontendRoots()
  const ctx = { prisma }

  expect(fields.length).toBeGreaterThan(0)

  for (const field of fields) {
    expect(typeof Query[field]).toBe('function')
    await Query[field](null, {}, ctx, null)
  }
})
