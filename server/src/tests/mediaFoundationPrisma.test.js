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

test('media posts and profiles read through Prisma Client', async() => {
  const postFindMany = jest.fn().mockResolvedValue([{
    id: 'post-1',
    title: 'Update',
    text: 'Hello',
    MediaProfile: [{
      id: 'profile-1',
      username: 'speaker',
      MediaService: [{ id: 'service-1', name: 'sparrow' }]
    }],
    Location: [{ id: 'location-1' }],
    MediaFile: [{ id: 'file-1' }],
    MediaPost_A: [],
    MediaPost_B: []
  }])
  const profileFindMany = jest.fn().mockResolvedValue([{
    id: 'profile-1',
    username: 'speaker',
    MediaService: [{ id: 'service-1', name: 'sparrow' }],
    Location: [],
    MediaFile: [],
    MediaBanner: [],
    MediaPersona: []
  }])

  const ctx = {
    prisma: {
      mediaPost: {
        findMany: postFindMany
      },
      mediaProfile: {
        findMany: profileFindMany
      }
    }
  }

  const posts = await Query.mediaPosts(null, {}, ctx)
  const profiles = await Query.mediaProfiles(null, {}, ctx)

  expect(postFindMany).toHaveBeenCalledWith(expect.objectContaining({
    where: undefined,
    include: expect.any(Object)
  }))
  expect(posts[0].profiles[0].service.name).toBe('sparrow')
  expect(posts[0].location.id).toBe('location-1')
  expect(profiles[0].service.name).toBe('sparrow')
})

test('media personas read through Prisma Client', async() => {
  const persona = {
    id: 'persona-1',
    name: 'Operator',
    role: 'Controller',
    KeyValue: [{ id: 'attribute-1', key: 'team', value: 'blue' }],
    Location: [{ id: 'location-1' }],
    MediaFile: [{ id: 'file-1' }],
    MediaProfile: [{
      id: 'profile-1',
      username: 'operator',
      MediaService: [{ id: 'service-1', name: 'sparrow' }],
      Location: [],
      MediaFile: [],
      MediaBanner: [],
      MediaPersona: []
    }],
    MediaPersonaEdge_PersonaStart: [],
    MediaPersonaEdge_PersonaEnd: []
  }
  const findMany = jest.fn().mockResolvedValue([persona])
  const findFirst = jest.fn().mockResolvedValue(persona)
  const count = jest.fn().mockResolvedValue(1)

  const ctx = {
    prisma: {
      mediaPersona: {
        findMany,
        findFirst,
        count
      }
    }
  }

  const personas = await Query.mediaPersonae(null, {}, ctx)
  const onePersona = await Query.mediaPersona(null, {
    where: {
      id: 'persona-1'
    }
  }, ctx)
  const connection = await Query.mediaPersonaeConnection(null, {}, ctx)

  expect(personas[0].attributes[0].key).toBe('team')
  expect(personas[0].avatar.id).toBe('file-1')
  expect(onePersona.profiles[0].service.name).toBe('sparrow')
  expect(connection.aggregate.count).toBe(1)
})

test('map layers read through Prisma Client', async() => {
  const findFirst = jest.fn().mockResolvedValue({
    id: 'map-1',
    title: 'Test',
    type: 'SATELLITE'
  })
  const findMany = jest.fn().mockResolvedValue([{
    id: 'map-1',
    title: 'Test'
  }])

  const ctx = {
    prisma: {
      mapLayer: {
        findFirst,
        findMany
      }
    }
  }

  const layer = await Query.mapLayer(null, {
    where: {
      id: 'map-1'
    }
  }, ctx)
  const layers = await Query.mapLayers(null, {}, ctx)

  expect(findFirst).toHaveBeenCalledWith({
    where: {
      id: 'map-1'
    }
  })
  expect(layer.title).toBe('Test')
  expect(layers).toHaveLength(1)
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
