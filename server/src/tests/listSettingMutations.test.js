const { prismaForward } = require('../resolvers/Mutation/prismaForward')

test('createAppListSetting writes through Prisma Client with a generated id', async() => {
  const create = jest.fn().mockResolvedValue({
    id: 'setting-1',
    name: 'PLAN',
    status: 'ACTIVE'
  })

  const result = await prismaForward.createAppListSetting(null, {
    data: {
      name: 'PLAN',
      status: 'ACTIVE'
    }
  }, {
    prisma: {
      appListSetting: {
        create
      }
    }
  })

  expect(create).toHaveBeenCalledWith({
    data: {
      id: expect.any(String),
      name: 'PLAN',
      status: 'ACTIVE'
    }
  })
  expect(create.mock.calls[0][0].data.id).toHaveLength(25)
  expect(result).toEqual({
    id: 'setting-1',
    name: 'PLAN',
    status: 'ACTIVE'
  })
})

test('updateAppListSetting writes through Prisma Client', async() => {
  const update = jest.fn().mockResolvedValue({
    id: 'setting-1',
    name: 'PLAN',
    status: 'INACTIVE'
  })

  const result = await prismaForward.updateAppListSetting(null, {
    where: {
      id: 'setting-1'
    },
    data: {
      status: 'INACTIVE'
    }
  }, {
    prisma: {
      appListSetting: {
        update
      }
    }
  })

  expect(update).toHaveBeenCalledWith({
    where: {
      id: 'setting-1'
    },
    data: {
      status: 'INACTIVE'
    }
  })
  expect(result.status).toBe('INACTIVE')
})

test('upsertAppListSetting writes through Prisma Client', async() => {
  const upsert = jest.fn().mockResolvedValue({
    id: 'setting-1',
    name: 'PLAN',
    status: 'ACTIVE'
  })

  await prismaForward.upsertAppListSetting(null, {
    where: {
      name: 'PLAN'
    },
    create: {
      name: 'PLAN',
      status: 'ACTIVE'
    },
    update: {
      status: 'ACTIVE'
    }
  }, {
    prisma: {
      appListSetting: {
        upsert
      }
    }
  })

  expect(upsert).toHaveBeenCalledWith({
    where: {
      name: 'PLAN'
    },
    create: {
      id: expect.any(String),
      name: 'PLAN',
      status: 'ACTIVE'
    },
    update: {
      status: 'ACTIVE'
    }
  })
  expect(upsert.mock.calls[0][0].create.id).toHaveLength(25)
})

test('deleteAppListSetting writes through Prisma Client', async() => {
  const remove = jest.fn().mockResolvedValue({
    id: 'setting-1',
    name: 'PLAN',
    status: 'ACTIVE'
  })

  const result = await prismaForward.deleteAppListSetting(null, {
    where: {
      id: 'setting-1'
    }
  }, {
    prisma: {
      appListSetting: {
        delete: remove
      }
    }
  })

  expect(remove).toHaveBeenCalledWith({
    where: {
      id: 'setting-1'
    }
  })
  expect(result.id).toBe('setting-1')
})
