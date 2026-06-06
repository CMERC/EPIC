jest.mock('graphql-authentication', () => ({
  getUser: jest.fn()
}))

jest.mock('../resolvers/commandRequest', () => ({
  commandRequest: jest.fn()
}))

const { getUser } = require('graphql-authentication')
const { commandRequest } = require('../resolvers/commandRequest')
const { commandQueries } = require('../resolvers/Query/command')
const { commandMutations } = require('../resolvers/Mutation/command')

beforeEach(() => {
  jest.clearAllMocks()
})

test('commandMessages builds inbox filters from current user, search text, and status', async () => {
  getUser.mockResolvedValue({
    id: 'user-1',
    name: 'Ada Analyst',
    email: 'ada@example.test'
  })
  commandRequest.mockResolvedValue({
    commandMessages: [{ id: 'cmd-1' }]
  })

  const result = await commandQueries.commandMessages(null, {
    scope: 'INBOX',
    status: 'SENT',
    query: 'inject 4',
    first: 25,
    skip: 5
  }, {})

  expect(result).toEqual([{ id: 'cmd-1' }])
  expect(commandRequest).toHaveBeenCalledWith(
    {},
    expect.stringContaining('query CommandMessages'),
    expect.objectContaining({
      first: 25,
      skip: 5,
      orderBy: 'createdAt_DESC',
      where: {
        AND: [
          { status: 'SENT' },
          {
            OR: [
              { title_contains: 'inject 4' },
              { body_contains: 'inject 4' },
              { recipientNames_contains: 'inject 4' },
              { recipientEmails_contains: 'inject 4' },
              { planInjectTitle_contains: 'inject 4' }
            ]
          },
          {
            OR: [
              { recipientEmails_contains: 'ada@example.test' },
              { recipientNames_contains: 'Ada Analyst' }
            ]
          }
        ]
      }
    })
  )
})

test('commandMessages builds outbox filters from current user', async () => {
  getUser.mockResolvedValue({
    name: 'Ada Analyst',
    email: 'ada@example.test'
  })
  commandRequest.mockResolvedValue({
    commandMessages: []
  })

  await commandQueries.commandMessages(null, {
    scope: 'OUTBOX',
    orderBy: 'sentAt_DESC'
  }, {})

  expect(commandRequest.mock.calls[0][2]).toEqual({
    where: { fromEmail: 'ada@example.test' },
    orderBy: 'sentAt_DESC',
    first: 100,
    skip: 0
  })
})

test('createCommandMessage adds sender defaults and records activity without blocking response', async () => {
  getUser.mockResolvedValue({
    id: 'user-1',
    name: 'Ada Analyst',
    email: 'ada@example.test'
  })
  commandRequest.mockResolvedValue({
    createCommandMessage: {
      id: 'cmd-1',
      title: 'Check status'
    }
  })

  const createActivityStream = jest.fn().mockRejectedValue(new Error('activity unavailable'))
  const result = await commandMutations.createCommandMessage(null, {
    data: {
      title: 'Check status',
      body: 'Report readiness.'
    }
  }, {
    db: {
      mutation: {
        createActivityStream
      }
    }
  })

  expect(result).toEqual({
    id: 'cmd-1',
    title: 'Check status'
  })
  expect(commandRequest.mock.calls[0][2].data).toEqual(expect.objectContaining({
    title: 'Check status',
    body: 'Report readiness.',
    status: 'SENT',
    fromName: 'Ada Analyst',
    fromEmail: 'ada@example.test',
    createdBy: 'user-1',
    updatedBy: 'user-1'
  }))
  expect(commandRequest.mock.calls[0][2].data.sentAt).toEqual(expect.any(String))
  expect(createActivityStream).toHaveBeenCalled()
})

test('acknowledgeCommandMessage writes the expected status transition payload', async () => {
  getUser.mockResolvedValue({ id: 'user-1', name: 'Ada Analyst' })
  commandRequest.mockResolvedValue({
    updateCommandMessage: {
      id: 'cmd-1',
      status: 'ACKNOWLEDGED'
    }
  })

  await commandMutations.acknowledgeCommandMessage(null, {
    where: { id: 'cmd-1' }
  }, {
    db: {
      mutation: {
        createActivityStream: jest.fn()
      }
    }
  })

  expect(commandRequest.mock.calls[0][2]).toEqual({
    data: expect.objectContaining({
      status: 'ACKNOWLEDGED',
      acknowledgedAt: expect.any(String),
      updatedBy: 'user-1'
    }),
    where: { id: 'cmd-1' }
  })
})
