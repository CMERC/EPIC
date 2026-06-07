jest.mock('../../node_modules/graphql-authentication/dist/utils', () => ({
  getUser: jest.fn()
}))

jest.mock('graphql-authentication', () => ({
  getUser: jest.fn()
}))

const authUtils = require('../../node_modules/graphql-authentication/dist/utils')
const { getUser } = require('graphql-authentication')
const { authMutations } = require('../resolvers/Mutation/authMutations')
const { appUserMutations } = require('../resolvers/Mutation/appUserMutations')

beforeEach(() => {
  jest.clearAllMocks()
})

test('inviteUser creates pending users through Prisma Client', async() => {
  authUtils.getUser.mockResolvedValue({ id: 'admin-1' })
  getUser.mockResolvedValue({
    email: 'admin@example.test',
    isSuper: true
  })
  const create = jest.fn().mockResolvedValue({
    id: 'user-1',
    email: 'ada@example.test',
    inviteAccepted: false,
    inviteToken: 'invite-token'
  })
  const send = jest.fn()

  const result = await authMutations.inviteUser(null, {
    data: {
      email: 'ADA@example.test'
    }
  }, {
    prisma: {
      user: {
        findFirst: jest.fn().mockResolvedValue(null),
        create
      }
    },
    graphqlAuthentication: {
      mailAppUrl: 'https://epic.example.test',
      mailer: {
        send
      }
    }
  })

  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      email: 'ada@example.test',
      inviteAccepted: false,
      emailConfirmed: false,
      isSuper: false,
      password: '',
      name: '',
      joinedAt: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      inviteToken: expect.any(String)
    })
  })
  expect(send).toHaveBeenCalledWith(expect.objectContaining({
    template: 'inviteUser',
    message: {
      to: 'ada@example.test'
    }
  }))
  expect(result).toEqual({ id: 'user-1' })
})

test('updateCurrentUser writes through Prisma Client and maps role shape', async() => {
  authUtils.getUser.mockResolvedValue({
    id: 'user-1'
  })
  const update = jest.fn().mockResolvedValue({
    id: 'user-1',
    name: 'Ada',
    AppUserRole: [{
      id: 'role-link-1',
      User: [{ id: 'user-1' }],
      AppRole: [{ name: 'ADMIN' }]
    }]
  })

  const result = await authMutations.updateCurrentUser(null, {
    data: {
      name: 'Ada'
    }
  }, {
    prisma: {
      user: {
        update
      }
    }
  })

  expect(update).toHaveBeenCalledWith({
    where: {
      id: 'user-1'
    },
    data: expect.objectContaining({
      name: 'Ada',
      updatedAt: expect.any(Date)
    }),
    include: {
      AppUserRole: {
        include: {
          AppRole: true,
          User: true
        }
      }
    }
  })
  expect(result.role.roles[0].name).toBe('ADMIN')
})

test('logoutCurrentUser clears Prisma Client session id', async() => {
  authUtils.getUser.mockResolvedValue({
    id: 'user-1'
  })
  const update = jest.fn().mockResolvedValue({
    id: 'user-1',
    sessionId: null
  })

  const result = await authMutations.logoutCurrentUser(null, {}, {
    prisma: {
      user: {
        update
      }
    }
  })

  expect(update).toHaveBeenCalledWith({
    where: {
      id: 'user-1'
    },
    data: expect.objectContaining({
      sessionId: null,
      updatedAt: expect.any(Date)
    })
  })
  expect(result).toBe(true)
})

test('deleteAppUser soft-deletes through Prisma Client and maps role shape', async() => {
  const update = jest.fn().mockResolvedValue({
    id: 'user-1',
    deletedAt: new Date(),
    AppUserRole: [{
      id: 'role-link-1',
      User: [{ id: 'user-1' }],
      AppRole: [{ name: 'USER' }]
    }]
  })

  const result = await appUserMutations.deleteAppUser(null, {
    where: {
      id: 'user-1'
    }
  }, {
    prisma: {
      user: {
        update
      }
    }
  })

  expect(update).toHaveBeenCalledWith({
    data: expect.objectContaining({
      deletedAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }),
    where: {
      id: 'user-1'
    },
    include: {
      AppUserRole: {
        include: {
          AppRole: true,
          User: true
        }
      }
    }
  })
  expect(result.role.roles[0].name).toBe('USER')
})
