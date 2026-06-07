const { Query } = require('../resolvers/Query')
const { prismaForward } = require('../resolvers/Mutation/prismaForward')

test('planReasonsPublic reads through Prisma Client with public input shape', async() => {
  const findMany = jest.fn().mockResolvedValue([{
    id: 'reason-1',
    title: 'Training Objective'
  }])

  const result = await Query.planReasonsPublic(null, {
    data: {
      planReason: {
        title_contains: 'Training'
      }
    },
    orderBy: 'title_ASC'
  }, {
    prisma: {
      planReason: {
        findMany
      }
    }
  })

  expect(findMany).toHaveBeenCalledWith({
    where: {
      title: {
        contains: 'Training'
      }
    },
    orderBy: {
      title: 'asc'
    }
  })
  expect(result[0].title).toBe('Training Objective')
})

test('planFundingSourcesConnection returns Prisma Client connection shape', async() => {
  const findMany = jest.fn().mockResolvedValue([{
    id: 'funding-1',
    primarySource: 'Federal',
    subSource: 'Grant',
    amount: '1000'
  }])
  const count = jest.fn().mockResolvedValue(1)

  const result = await Query.planFundingSourcesConnection(null, {
    where: {
      primarySource: 'Federal'
    }
  }, {
    prisma: {
      planFundingSource: {
        findMany,
        count
      }
    }
  })

  expect(count).toHaveBeenCalledWith({
    where: {
      primarySource: 'Federal'
    }
  })
  expect(result.aggregate.count).toBe(1)
  expect(result.edges[0].node.subSource).toBe('Grant')
})

test('plan foundation mutations write through Prisma Client', async() => {
  const upsert = jest.fn().mockResolvedValue({
    id: 'method-1',
    title: 'Seminar'
  })
  const create = jest.fn().mockResolvedValue({
    id: 'reason-1',
    title: 'Training Objective'
  })
  const remove = jest.fn().mockResolvedValue({
    id: 'priority-1',
    title: 'High'
  })
  const ctx = {
    prisma: {
      planMethod: {
        upsert
      },
      planReason: {
        create
      },
      planPriorityLevel: {
        delete: remove
      }
    }
  }

  await prismaForward.upsertPlanMethod(null, {
    where: {
      id: 'method-1'
    },
    create: {
      title: 'Seminar'
    },
    update: {
      title: 'Workshop'
    }
  }, ctx)
  await prismaForward.createPlanReasonPublic(null, {
    data: {
      planReason: {
        title: 'Training Objective'
      }
    }
  }, ctx)
  const deleted = await prismaForward.deletePlanPriorityLevel(null, {
    where: {
      id: 'priority-1'
    }
  }, ctx)

  expect(upsert).toHaveBeenCalledWith({
    where: {
      id: 'method-1'
    },
    create: expect.objectContaining({
      id: expect.any(String),
      title: 'Seminar',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }),
    update: expect.objectContaining({
      title: 'Workshop',
      updatedAt: expect.any(Date)
    })
  })
  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      title: 'Training Objective',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
  expect(remove).toHaveBeenCalledWith({
    where: {
      id: 'priority-1'
    }
  })
  expect(deleted.title).toBe('High')
})
