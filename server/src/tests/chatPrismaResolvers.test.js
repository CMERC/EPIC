const { Query } = require('../resolvers/Query')
const { prismaForward } = require('../resolvers/Mutation/prismaForward')

test('chatMessages reads through Prisma Client and maps room field', async() => {
  const findMany = jest.fn().mockResolvedValue([{
    id: 'message-1',
    text: 'Ready',
    author: 'ada@example.test',
    ChatRoom: [{ id: 'room-1', title: 'General' }]
  }])

  const result = await Query.chatMessages(null, {
    where: {
      text_contains: 'Ready'
    },
    orderBy: 'createdAt_DESC'
  }, {
    prisma: {
      chatMessage: {
        findMany
      }
    }
  })

  expect(findMany).toHaveBeenCalledWith({
    where: {
      text: {
        contains: 'Ready'
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      ChatRoom: true
    }
  })
  expect(result[0].room.title).toBe('General')
})

test('chatRoomsConnection returns Prisma Client connection shape', async() => {
  const findMany = jest.fn().mockResolvedValue([{
    id: 'room-1',
    title: 'General',
    ChatMessage: []
  }])
  const count = jest.fn().mockResolvedValue(1)

  const result = await Query.chatRoomsConnection(null, {
    where: {
      title: 'General'
    }
  }, {
    prisma: {
      chatRoom: {
        findMany,
        count
      }
    }
  })

  expect(count).toHaveBeenCalledWith({
    where: {
      title: 'General'
    }
  })
  expect(result.aggregate.count).toBe(1)
  expect(result.edges[0].node.messages).toEqual([])
})

test('createChatMessage writes through Prisma Client and maps room field', async() => {
  const create = jest.fn().mockResolvedValue({
    id: 'message-1',
    text: 'Ready',
    author: 'ada@example.test',
    ChatRoom: [{ id: 'room-1', title: 'General' }]
  })

  const result = await prismaForward.createChatMessage(null, {
    data: {
      text: 'Ready',
      author: 'ada@example.test',
      room: {
        connect: {
          id: 'room-1'
        }
      }
    }
  }, {
    prisma: {
      chatMessage: {
        create
      }
    }
  })

  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      text: 'Ready',
      author: 'ada@example.test',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      ChatRoom: {
        connect: [{
          id: 'room-1'
        }]
      }
    }),
    include: {
      ChatRoom: true
    }
  })
  expect(result.room.title).toBe('General')
})

test('upsertChatRoom and deleteChatRoom use Prisma Client', async() => {
  const upsert = jest.fn().mockResolvedValue({
    id: 'room-1',
    title: 'General',
    ChatMessage: []
  })
  const remove = jest.fn().mockResolvedValue({
    id: 'room-1',
    title: 'General',
    ChatMessage: []
  })
  const ctx = {
    prisma: {
      chatRoom: {
        upsert,
        delete: remove
      }
    }
  }

  await prismaForward.upsertChatRoom(null, {
    where: {
      id: 'room-1'
    },
    create: {
      title: 'General'
    },
    update: {
      title: 'General Updated'
    }
  }, ctx)
  const deleted = await prismaForward.deleteChatRoom(null, {
    where: {
      id: 'room-1'
    }
  }, ctx)

  expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: 'room-1'
    },
    create: expect.objectContaining({
      id: expect.any(String),
      title: 'General',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }),
    update: expect.objectContaining({
      title: 'General Updated',
      updatedAt: expect.any(Date)
    })
  }))
  expect(remove).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: 'room-1'
    }
  }))
  expect(deleted.messages).toEqual([])
})
