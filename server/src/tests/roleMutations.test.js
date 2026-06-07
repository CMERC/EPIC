const { prismaForward } = require('../resolvers/Mutation/prismaForward')
const { appUserRole } = require('../resolvers/Mutation/appUserRole')

test('createAppRole writes through Prisma Client and maps legacy users field', async() => {
  const create = jest.fn().mockResolvedValue({
    id: 'role-1',
    name: 'ADMIN',
    displayName: 'Administrator',
    AppUserRole: [{
      id: 'role-link-1',
      User: [{ id: 'user-1' }],
      AppRole: [{ id: 'role-1', name: 'ADMIN' }]
    }]
  })

  const result = await prismaForward.createAppRole(null, {
    data: {
      name: 'ADMIN',
      displayName: 'Administrator'
    }
  }, {
    prisma: {
      appRole: {
        create
      }
    }
  })

  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      name: 'ADMIN',
      displayName: 'Administrator',
      createdAt: expect.any(Date),
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
  expect(result.users[0].user).toEqual({ id: 'user-1' })
  expect(result.users[0].roles[0].name).toBe('ADMIN')
})

test('updateAppRole, upsertAppRole, and deleteAppRole use Prisma Client', async() => {
  const update = jest.fn().mockResolvedValue({
    id: 'role-1',
    name: 'EDITOR',
    AppUserRole: []
  })
  const upsert = jest.fn().mockResolvedValue({
    id: 'role-1',
    name: 'EDITOR',
    AppUserRole: []
  })
  const remove = jest.fn().mockResolvedValue({
    id: 'role-1',
    name: 'EDITOR',
    AppUserRole: []
  })
  const ctx = {
    prisma: {
      appRole: {
        update,
        upsert,
        delete: remove
      }
    }
  }

  await prismaForward.updateAppRole(null, {
    where: {
      id: 'role-1'
    },
    data: {
      displayName: 'Editor'
    }
  }, ctx)
  await prismaForward.upsertAppRole(null, {
    where: {
      id: 'role-1'
    },
    create: {
      name: 'EDITOR'
    },
    update: {
      displayName: 'Editor'
    }
  }, ctx)
  const deleted = await prismaForward.deleteAppRole(null, {
    where: {
      id: 'role-1'
    }
  }, ctx)

  expect(update).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: 'role-1'
    },
    data: expect.objectContaining({
      displayName: 'Editor',
      updatedAt: expect.any(Date)
    })
  }))
  expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: 'role-1'
    },
    create: expect.objectContaining({
      id: expect.any(String),
      name: 'EDITOR',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }),
    update: expect.objectContaining({
      displayName: 'Editor',
      updatedAt: expect.any(Date)
    })
  }))
  expect(remove).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: 'role-1'
    }
  }))
  expect(deleted.users).toEqual([])
})

test('deleteAppUserRole uses Prisma Client and maps legacy fields', async() => {
  const remove = jest.fn().mockResolvedValue({
    id: 'role-link-1',
    User: [{ id: 'user-1' }],
    AppRole: [{ id: 'role-1', name: 'USER' }]
  })

  const result = await prismaForward.deleteAppUserRole(null, {
    where: {
      id: 'role-link-1'
    }
  }, {
    prisma: {
      appUserRole: {
        delete: remove
      }
    }
  })

  expect(remove).toHaveBeenCalledWith({
    where: {
      id: 'role-link-1'
    },
    include: {
      AppRole: true,
      User: true
    }
  })
  expect(result.user).toEqual({ id: 'user-1' })
  expect(result.roles[0].name).toBe('USER')
})

test('upsertAppUserRole replaces an existing role link before Prisma Client upsert', async() => {
  const remove = jest.fn().mockResolvedValue({
    id: 'old-role-link'
  })
  const upsert = jest.fn().mockResolvedValue({
    id: 'new-role-link',
    User: [{ id: 'user-1' }],
    AppRole: [{ id: 'role-1', name: 'ADMIN' }]
  })

  const result = await appUserRole.upsertAppUserRole(null, {
    where: {
      id: 'new-role-link'
    },
    create: {
      user: {
        connect: {
          id: 'user-1'
        }
      },
      roles: {
        connect: [{
          id: 'role-1'
        }]
      }
    },
    update: {
      roles: {
        set: [{
          id: 'role-1'
        }]
      }
    }
  }, {
    prisma: {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          AppUserRole: [{
            id: 'old-role-link',
            AppRole: [{ name: 'USER' }]
          }]
        })
      },
      appUserRole: {
        delete: remove,
        upsert
      }
    }
  })

  expect(remove).toHaveBeenCalledWith({
    where: {
      id: 'old-role-link'
    }
  })
  expect(upsert).toHaveBeenCalledWith({
    where: {
      id: 'new-role-link'
    },
    create: expect.objectContaining({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      User: {
        connect: [{
          id: 'user-1'
        }]
      },
      AppRole: {
        connect: [{
          id: 'role-1'
        }]
      }
    }),
    update: expect.objectContaining({
      updatedAt: expect.any(Date),
      AppRole: {
        set: [{
          id: 'role-1'
        }]
      }
    }),
    include: {
      AppRole: true,
      User: true
    }
  })
  expect(result.user).toEqual({ id: 'user-1' })
  expect(result.roles[0].name).toBe('ADMIN')
})
