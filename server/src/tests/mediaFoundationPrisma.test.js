const { Query } = require('../resolvers/Query')
const { prismaForward } = require('../resolvers/Mutation/prismaForward')
const { MediaService } = require('../resolvers/Mutation/mediaService')

test('mediaServices reads through Prisma Client with filters and ordering', async() => {
  const findMany = jest.fn().mockResolvedValue([{
    id: 'service-1',
    name: 'sparrow',
    displayName: 'Sparrow',
    type: 'SOCIAL'
  }])

  const result = await Query.mediaServices(null, {
    where: {
      type: 'SOCIAL',
      name_contains: 'spar'
    },
    orderBy: 'name_ASC',
    first: 10
  }, {
    prisma: {
      mediaService: {
        findMany
      }
    }
  })

  expect(findMany).toHaveBeenCalledWith({
    where: {
      type: 'SOCIAL',
      name: {
        contains: 'spar'
      }
    },
    orderBy: {
      name: 'asc'
    },
    take: 10
  })
  expect(result[0].displayName).toBe('Sparrow')
})

test('mediaNetworksConnection returns Prisma Client connection shape', async() => {
  const findMany = jest.fn().mockResolvedValue([{
    id: 'network-1',
    name: 'open',
    displayName: 'Open Network'
  }])
  const count = jest.fn().mockResolvedValue(1)

  const result = await Query.mediaNetworksConnection(null, {
    where: {
      displayName_contains: 'Open'
    }
  }, {
    prisma: {
      mediaNetwork: {
        findMany,
        count
      }
    }
  })

  expect(count).toHaveBeenCalledWith({
    where: {
      displayName: {
        contains: 'Open'
      }
    }
  })
  expect(result.aggregate.count).toBe(1)
  expect(result.edges[0].node.name).toBe('open')
})

test('media foundation mutations write through Prisma Client', async() => {
  const create = jest.fn().mockResolvedValue({
    id: 'network-1',
    name: 'open'
  })
  const remove = jest.fn().mockResolvedValue({
    id: 'noise-1',
    name: 'busy'
  })

  const ctx = {
    prisma: {
      mediaNetwork: {
        create
      },
      mediaNoiseLevel: {
        delete: remove
      }
    }
  }

  await prismaForward.createMediaNetwork(null, {
    data: {
      name: 'open',
      displayName: 'Open Network'
    }
  }, ctx)
  const deleted = await prismaForward.deleteMediaNoiseLevel(null, {
    where: {
      id: 'noise-1'
    }
  }, ctx)

  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      name: 'open',
      displayName: 'Open Network',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
  expect(remove).toHaveBeenCalledWith({
    where: {
      id: 'noise-1'
    }
  })
  expect(deleted.name).toBe('busy')
})

test('updateMediaService uses Prisma Client and preserves profile URL refresh when db binding exists', async() => {
  const update = jest.fn().mockResolvedValue({
    id: 'service-1',
    name: 'sparrow',
    displayName: 'Sparrow Updated'
  })
  const mediaProfilesConnection = jest.fn().mockResolvedValue({
    aggregate: {
      count: 0
    }
  })
  const mediaProfiles = jest.fn().mockResolvedValue([])

  const result = await MediaService.updateMediaService(null, {
    where: {
      id: 'service-1'
    },
    data: {
      displayName: 'Sparrow Updated'
    }
  }, {
    prisma: {
      mediaService: {
        update
      }
    },
    db: {
      query: {
        mediaProfilesConnection,
        mediaProfiles
      },
      mutation: {
        updateMediaProfile: jest.fn()
      }
    }
  }, {
    workspaceName: 'test'
  })

  expect(update).toHaveBeenCalledWith({
    where: {
      id: 'service-1'
    },
    data: expect.objectContaining({
      displayName: 'Sparrow Updated',
      updatedAt: expect.any(Date)
    })
  })
  expect(mediaProfilesConnection).toHaveBeenCalled()
  expect(result.displayName).toBe('Sparrow Updated')
})
