jest.mock('graphql-authentication', () => ({
  getUserId: jest.fn(),
  getUser: jest.fn()
}))

const jwt = require('jsonwebtoken')
const { getUserId } = require('graphql-authentication')
const { _test } = require('../middleware/auth')

test('getCurrentUserId validates sessions through Prisma Client', async() => {
  const token = jwt.sign({
    userId: 'user-1',
    sessionId: 'session-1'
  }, 'test-secret')
  const findFirst = jest.fn().mockResolvedValue({
    sessionId: 'session-1'
  })

  const result = await _test.getCurrentUserId({
    req: {
      get: jest.fn().mockReturnValue(`Bearer ${token}`)
    },
    graphqlAuthentication: {
      secret: 'test-secret'
    },
    prisma: {
      user: {
        findFirst
      }
    }
  })

  expect(findFirst).toHaveBeenCalledWith({
    where: {
      id: 'user-1',
      sessionId: 'session-1'
    },
    select: {
      sessionId: true
    }
  })
  expect(result).toBe('user-1')
})

test('getCurrentUserId returns null when the Prisma Client session is missing', async() => {
  const token = jwt.sign({
    userId: 'user-1',
    sessionId: 'session-1'
  }, 'test-secret')

  const result = await _test.getCurrentUserId({
    req: {
      get: jest.fn().mockReturnValue(`Bearer ${token}`)
    },
    graphqlAuthentication: {
      secret: 'test-secret'
    },
    prisma: {
      user: {
        findFirst: jest.fn().mockResolvedValue(null)
      }
    }
  })

  expect(result).toBeNull()
})

test('checkRole reads Prisma Client role relations', async() => {
  getUserId.mockResolvedValue('user-1')
  const findUnique = jest.fn().mockResolvedValue({
    id: 'user-1',
    AppUserRole: [{
      AppRole: [{ name: 'ADMIN' }]
    }]
  })

  const result = await _test.checkRole({
    prisma: {
      user: {
        findUnique
      }
    }
  }, 'ADMIN')

  expect(findUnique).toHaveBeenCalledWith({
    where: {
      id: 'user-1'
    },
    include: {
      AppUserRole: {
        include: {
          AppRole: true
        }
      }
    }
  })
  expect(result).toBe(true)
})

test('checkHasRole accepts super users from Prisma Client', async() => {
  getUserId.mockResolvedValue('user-1')

  const result = await _test.checkHasRole({
    prisma: {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          isSuper: true,
          AppUserRole: []
        })
      }
    }
  })

  expect(result).toBe(true)
})

test('checkHasRole rejects Prisma Client users without roles', async() => {
  getUserId.mockResolvedValue('user-1')

  const result = await _test.checkHasRole({
    prisma: {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          isSuper: false,
          AppUserRole: []
        })
      }
    }
  })

  expect(result).toBe(false)
})
