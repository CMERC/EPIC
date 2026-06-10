const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { authMutations } = require('../resolvers/Mutation/authMutations')

function loginContext(user, dbUser = user) {
  return {
    graphqlAuthentication: {
      secret: 'test-secret',
      adapter: {
        findUserByEmail: jest.fn().mockResolvedValue(user),
        updateUserLastLogin: jest.fn(),
        updateUserInfo: jest.fn().mockImplementation((ctx, id, data) => Promise.resolve({
          ...user,
          ...data
        }))
      }
    },
    db: {
      query: {
        user: jest.fn().mockResolvedValue(dbUser)
      }
    }
  }
}

test('login rejects users who have not accepted invites', async() => {
  const password = await bcrypt.hash('correct-password', 4)
  const ctx = loginContext({
    id: 'user-1',
    email: 'ada@example.test',
    password,
    inviteAccepted: false
  })

  await expect(authMutations.login(null, {
    email: 'ada@example.test',
    password: 'correct-password'
  }, ctx)).rejects.toThrow()
})

test('login rejects deleted users', async() => {
  const password = await bcrypt.hash('correct-password', 4)
  const ctx = loginContext({
    id: 'user-1',
    email: 'ada@example.test',
    password,
    inviteAccepted: true,
    deletedAt: '2026-01-01T00:00:00.000Z'
  })

  await expect(authMutations.login(null, {
    email: 'ada@example.test',
    password: 'correct-password'
  }, ctx)).rejects.toThrow()
})

test('login creates a session when the stored user does not have one', async() => {
  const password = await bcrypt.hash('correct-password', 4)
  const user = {
    id: 'user-1',
    email: 'ada@example.test',
    password,
    inviteAccepted: true,
    deletedAt: null
  }
  const ctx = loginContext(user, {
    ...user,
    sessionId: null
  })

  const result = await authMutations.login(null, {
    email: 'ada@example.test',
    password: 'correct-password'
  }, ctx)

  expect(ctx.graphqlAuthentication.adapter.updateUserLastLogin).toHaveBeenCalledWith(
    ctx,
    'user-1',
    {
      lastLogin: expect.any(String)
    }
  )
  expect(ctx.graphqlAuthentication.adapter.updateUserInfo).toHaveBeenCalledWith(
    ctx,
    'user-1',
    {
      sessionId: expect.any(String)
    }
  )

  const decoded = jwt.verify(result.token, 'test-secret')
  expect(decoded.userId).toBe('user-1')
  expect(decoded.sessionId).toBe(result.user.sessionId)
})

test('login creates a session through Prisma Client when available', async() => {
  const password = await bcrypt.hash('correct-password', 4)
  const user = {
    id: 'user-1',
    email: 'ada@example.test',
    password,
    inviteAccepted: true,
    deletedAt: null,
    sessionId: null
  }
  const update = jest.fn()
    .mockResolvedValueOnce({ ...user, lastLogin: new Date() })
    .mockResolvedValueOnce({ ...user, sessionId: 'session-1', AppUserRole: [] })
  const ctx = {
    graphqlAuthentication: {
      secret: 'test-secret'
    },
    prisma: {
      user: {
        findFirst: jest.fn().mockResolvedValue(user),
        findUnique: jest.fn().mockResolvedValue(user),
        update
      }
    }
  }

  const result = await authMutations.login(null, {
    email: 'ada@example.test',
    password: 'correct-password'
  }, ctx)

  expect(update).toHaveBeenNthCalledWith(1, {
    where: {
      id: 'user-1'
    },
    data: expect.objectContaining({
      lastLogin: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
  expect(update).toHaveBeenNthCalledWith(2, expect.objectContaining({
    where: {
      id: 'user-1'
    },
    data: expect.objectContaining({
      sessionId: expect.any(String),
      updatedAt: expect.any(Date)
    })
  }))

  const decoded = jwt.verify(result.token, 'test-secret')
  expect(decoded.userId).toBe('user-1')
  expect(decoded.sessionId).toBe('session-1')
  expect(result.user.role).toBeNull()
})

test('login records failed attempts for SaaS rate limiting', async() => {
  const incr = jest.fn().mockResolvedValue(1)
  const expire = jest.fn().mockResolvedValue(1)
  const ctx = {
    graphqlAuthentication: {
      secret: 'test-secret',
      adapter: {
        findUserByEmail: jest.fn().mockResolvedValue(null)
      }
    },
    request: {
      ip: '192.0.2.10',
      headers: {}
    },
    redisClient: {
      get: jest.fn().mockResolvedValue('0'),
      incr,
      expire
    }
  }

  await expect(authMutations.login(null, {
    email: 'ada@example.test',
    password: 'wrong-password'
  }, ctx)).rejects.toThrow()

  expect(incr).toHaveBeenCalledWith('auth:login-fail:ada@example.test:192.0.2.10')
  expect(expire).toHaveBeenCalledWith('auth:login-fail:ada@example.test:192.0.2.10', 900)
})

test('login blocks accounts over the failed-attempt threshold', async() => {
  const ctx = {
    graphqlAuthentication: {
      secret: 'test-secret',
      adapter: {
        findUserByEmail: jest.fn()
      }
    },
    request: {
      ip: '192.0.2.10',
      headers: {}
    },
    redisClient: {
      get: jest.fn().mockResolvedValue('10')
    }
  }

  await expect(authMutations.login(null, {
    email: 'ada@example.test',
    password: 'wrong-password'
  }, ctx)).rejects.toThrow('Too many failed login attempts')

  expect(ctx.graphqlAuthentication.adapter.findUserByEmail).not.toHaveBeenCalled()
})
