jest.mock('graphql-authentication', () => ({
  getUser: jest.fn()
}))

const { getUser } = require('graphql-authentication')
const { emailMutations } = require('../resolvers/Mutation/email')
const { emailQueries } = require('../resolvers/Query/email')
const { prismaForward } = require('../resolvers/Mutation/prismaForward')

beforeEach(() => {
  jest.clearAllMocks()
})

test('emailMessages creates the current user mailbox and reads through Prisma Client', async() => {
  getUser.mockResolvedValue({
    email: 'ada@example.test'
  })
  const findFirst = jest.fn().mockResolvedValue(null)
  const createMailbox = jest.fn().mockResolvedValue({
    id: 'mailbox-1',
    owner: 'ada@example.test'
  })
  const findMany = jest.fn().mockResolvedValue([{
    id: 'message-1',
    EmailMailbox: [{ id: 'mailbox-1', owner: 'ada@example.test' }],
    MediaFile: []
  }])

  const result = await emailQueries.emailMessages(null, {
    where: {
      folder: 'INBOX'
    },
    orderBy: 'createdAt_DESC'
  }, {
    prisma: {
      emailMailbox: {
        findFirst,
        create: createMailbox
      },
      emailMessage: {
        findMany
      }
    }
  })

  expect(createMailbox).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      owner: 'ada@example.test',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
  expect(findMany).toHaveBeenCalledWith({
    where: {
      folder: 'INBOX',
      EmailMailbox: {
        some: {
          owner: 'ada@example.test'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      EmailMailbox: true,
      MediaFile: true
    }
  })
  expect(result[0].mailbox.owner).toBe('ada@example.test')
})

test('composeEmailMessage stores sent and inbox copies through Prisma Client', async() => {
  getUser.mockResolvedValue({
    email: 'ada@example.test'
  })
  const createMailbox = jest.fn()
    .mockResolvedValueOnce({ id: 'mailbox-1', owner: 'ada@example.test' })
    .mockResolvedValueOnce({ id: 'mailbox-2', owner: 'grace@example.test' })
  const createMessage = jest.fn()
    .mockResolvedValueOnce({
      id: 'sent-message',
      folder: 'SENT',
      EmailMailbox: [{ owner: 'ada@example.test' }],
      MediaFile: []
    })
    .mockResolvedValueOnce({
      id: 'inbox-message',
      folder: 'INBOX'
    })

  const result = await emailMutations.composeEmailMessage(null, {
    data: {
      to: 'grace@example.test',
      from: 'ada@example.test',
      subject: 'Status',
      content: 'Ready'
    }
  }, {
    prisma: {
      emailMailbox: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: createMailbox
      },
      emailMessage: {
        create: createMessage
      }
    }
  })

  expect(createMailbox).toHaveBeenCalledTimes(2)
  expect(createMessage).toHaveBeenNthCalledWith(1, {
    data: expect.objectContaining({
      id: expect.any(String),
      to: 'grace@example.test',
      from: 'ada@example.test',
      status: 'READ',
      folder: 'SENT',
      EmailMailbox: {
        connect: [{
          owner: 'ada@example.test'
        }]
      },
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }),
    include: {
      EmailMailbox: true,
      MediaFile: true
    }
  })
  expect(createMessage).toHaveBeenNthCalledWith(2, {
    data: expect.objectContaining({
      status: 'UNREAD',
      folder: 'INBOX',
      EmailMailbox: {
        connect: [{
          owner: 'grace@example.test'
        }]
      }
    })
  })
  expect(result.id).toBe('sent-message')
  expect(result.mailbox.owner).toBe('ada@example.test')
})

test('email forward mutations use Prisma Client and map legacy fields', async() => {
  const update = jest.fn().mockResolvedValue({
    id: 'message-1',
    status: 'READ',
    EmailMailbox: [{ owner: 'ada@example.test' }],
    MediaFile: []
  })
  const createMailbox = jest.fn().mockResolvedValue({
    id: 'mailbox-1',
    owner: 'ada@example.test',
    EmailMessage: []
  })
  const ctx = {
    prisma: {
      emailMessage: {
        update
      },
      emailMailbox: {
        create: createMailbox
      }
    }
  }

  const message = await prismaForward.updateEmailMessage(null, {
    where: {
      id: 'message-1'
    },
    data: {
      status: 'READ'
    }
  }, ctx)
  const mailbox = await prismaForward.createEmailMailbox(null, {
    data: {
      owner: 'ada@example.test'
    }
  }, ctx)

  expect(update).toHaveBeenCalledWith({
    where: {
      id: 'message-1'
    },
    data: expect.objectContaining({
      status: 'READ',
      updatedAt: expect.any(Date)
    }),
    include: {
      EmailMailbox: true,
      MediaFile: true
    }
  })
  expect(createMailbox).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      owner: 'ada@example.test',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }),
    include: {
      EmailMessage: {
        include: {
          EmailMailbox: true,
          MediaFile: true
        }
      }
    }
  })
  expect(message.mailbox.owner).toBe('ada@example.test')
  expect(mailbox.messages).toEqual([])
})
