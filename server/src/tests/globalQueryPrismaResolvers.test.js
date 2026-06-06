jest.mock('graphql-authentication', () => ({
  getUserId: jest.fn(),
  getUser: jest.fn()
}))

const { getUser } = require('graphql-authentication')
const { Query } = require('../resolvers/Query')

test('appListSettings reads through Prisma Client with translated filters', async() => {
  const findMany = jest.fn().mockResolvedValue([
    { id: 'setting-1', name: 'Theme', status: 'ACTIVE' }
  ])

  const result = await Query.appListSettings(null, {
    where: {
      name_contains: 'The'
    },
    orderBy: 'name_ASC',
    first: 5,
    skip: 1
  }, {
    prisma: {
      appListSetting: {
        findMany
      }
    }
  })

  expect(findMany).toHaveBeenCalledWith({
    where: {
      name: {
        contains: 'The'
      }
    },
    orderBy: {
      name: 'asc'
    },
    take: 5,
    skip: 1
  })
  expect(result).toEqual([{ id: 'setting-1', name: 'Theme', status: 'ACTIVE' }])
})

test('appListSettingsConnection returns Prisma Client aggregate connection shape', async() => {
  const findMany = jest.fn().mockResolvedValue([
    { id: 'setting-1', name: 'Theme', status: 'ACTIVE' }
  ])
  const count = jest.fn().mockResolvedValue(7)

  const result = await Query.appListSettingsConnection(null, {
    where: {
      status: 'ACTIVE'
    }
  }, {
    prisma: {
      appListSetting: {
        findMany,
        count
      }
    }
  })

  expect(count).toHaveBeenCalledWith({
    where: {
      status: 'ACTIVE'
    }
  })
  expect(result.aggregate.count).toBe(7)
  expect(result.edges[0].node.id).toBe('setting-1')
  expect(result.pageInfo.startCursor).toBe('setting-1')
})

test('appRoles maps Prisma Client relation names to legacy user-role fields', async() => {
  const findMany = jest.fn().mockResolvedValue([
    {
      id: 'role-1',
      name: 'ADMIN',
      AppUserRole: [{
        id: 'role-link-1',
        User: [{ id: 'user-1' }],
        AppRole: [{ id: 'role-1', name: 'ADMIN' }]
      }]
    }
  ])

  const result = await Query.appRoles(null, {
    where: {
      name: 'ADMIN'
    }
  }, {
    prisma: {
      appRole: {
        findMany
      }
    }
  })

  expect(findMany).toHaveBeenCalledWith({
    where: {
      name: 'ADMIN'
    },
    orderBy: undefined,
    include: {
      AppUserRole: {
        include: {
          AppRole: true,
          User: true
        }
      }
    }
  })
  expect(result[0].users[0].user).toEqual({ id: 'user-1' })
  expect(result[0].users[0].roles[0].name).toBe('ADMIN')
})

test('appWorkspaces scopes non-super users to memberships and maps members', async() => {
  getUser.mockResolvedValue({
    id: 'user-1',
    isSuper: false
  })

  const findMany = jest.fn().mockResolvedValue([
    {
      id: 'workspace-1',
      User: [{
        id: 'user-1',
        AppUserRole: [{
          id: 'role-link-1',
          AppRole: [{ id: 'role-1', name: 'EDITOR' }],
          User: [{ id: 'user-1' }]
        }]
      }]
    }
  ])

  const result = await Query.appWorkspaces(null, {}, {
    prisma: {
      appWorkspace: {
        findMany
      }
    }
  })

  expect(findMany).toHaveBeenCalledWith({
    where: {
      User: {
        some: {
          id: 'user-1'
        }
      }
    },
    orderBy: undefined,
    include: {
      User: true
    }
  })
  expect(result[0].members[0].role.roles[0].name).toBe('EDITOR')
})
