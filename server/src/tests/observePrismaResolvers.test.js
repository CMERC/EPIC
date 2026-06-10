const { Query } = require('../resolvers/Query')
const { prismaForward } = require('../resolvers/Mutation/prismaForward')

const observePost = {
  id: 'observe-1',
  text: 'Noted activity near checkpoint',
  author: 'Evaluation Observer',
  Location: [{ id: 'location-1', geojson: { type: 'Point', coordinates: [1, 2] } }],
  MediaFile: [{ id: 'file-1', name: 'photo.jpg' }]
}

test('observe posts read through Prisma Client with legacy filters and relations', async() => {
  const findMany = jest.fn().mockResolvedValue([observePost])
  const findFirst = jest.fn().mockResolvedValue(observePost)
  const count = jest.fn().mockResolvedValue(1)

  const ctx = {
    prisma: {
      observePost: {
        findMany,
        findFirst,
        count
      }
    }
  }

  const posts = await Query.observePosts(null, {
    where: {
      text_contains: 'checkpoint'
    },
    orderBy: 'createdAt_DESC',
    first: 10
  }, ctx)
  const onePost = await Query.observePost(null, {
    where: {
      id: 'observe-1'
    }
  }, ctx)
  const connection = await Query.observePostsConnection(null, {
    where: {
      author: 'Evaluation Observer'
    }
  }, ctx)

  expect(findMany).toHaveBeenCalledWith({
    where: {
      text: {
        contains: 'checkpoint'
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10,
    include: {
      Location: true,
      MediaFile: true
    }
  })
  expect(findFirst).toHaveBeenCalledWith({
    where: {
      id: 'observe-1'
    },
    include: {
      Location: true,
      MediaFile: true
    }
  })
  expect(posts[0].location.id).toBe('location-1')
  expect(posts[0].attachments[0].name).toBe('photo.jpg')
  expect(onePost.attachments).toHaveLength(1)
  expect(connection.aggregate.count).toBe(1)
})

test('observe post mutations write through Prisma Client and map relations', async() => {
  const create = jest.fn().mockResolvedValue(observePost)
  const remove = jest.fn().mockResolvedValue(observePost)
  const ctx = {
    prisma: {
      observePost: {
        create,
        delete: remove
      }
    }
  }

  const created = await prismaForward.createObservePost(null, {
    data: {
      text: 'Noted activity near checkpoint',
      author: 'Evaluation Observer',
      attachments: {
        connect: {
          id: 'file-1'
        }
      },
      location: {
        create: {
          geojson: { type: 'Point', coordinates: [1, 2] },
          geohash: 's00'
        }
      }
    }
  }, ctx)
  const deleted = await prismaForward.deleteObservePost(null, {
    where: {
      id: 'observe-1'
    }
  }, ctx)

  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      text: 'Noted activity near checkpoint',
      author: 'Evaluation Observer',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      MediaFile: {
        connect: [{ id: 'file-1' }]
      },
      Location: {
        create: [{
          geojson: { type: 'Point', coordinates: [1, 2] },
          geohash: 's00'
        }]
      }
    }),
    include: {
      Location: true,
      MediaFile: true
    }
  })
  expect(remove).toHaveBeenCalledWith({
    where: {
      id: 'observe-1'
    },
    include: {
      Location: true,
      MediaFile: true
    }
  })
  expect(created.location.id).toBe('location-1')
  expect(deleted.attachments[0].id).toBe('file-1')
})
