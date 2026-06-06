jest.mock('node-fetch')

const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const { commandRequest } = require('../resolvers/commandRequest')

beforeEach(() => {
  jest.clearAllMocks()
})

test('sends command workspace requests with a Prisma secret bearer token', async () => {
  fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      data: {
        commandMessages: []
      }
    })
  })

  const result = await commandRequest(
    {
      db: {
        _endpoint: 'http://workspace-prisma.local/graphql',
        _secret: 'workspace-secret'
      }
    },
    'query CommandMessages { commandMessages { id } }',
    { first: 10 }
  )

  expect(result).toEqual({ commandMessages: [] })
  expect(fetch).toHaveBeenCalledWith(
    'http://workspace-prisma.local/graphql',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'content-type': 'application/json',
        authorization: expect.stringMatching(/^Bearer /)
      }),
      body: JSON.stringify({
        query: 'query CommandMessages { commandMessages { id } }',
        variables: { first: 10 }
      })
    })
  )

  const token = fetch.mock.calls[0][1].headers.authorization.replace('Bearer ', '')
  expect(jwt.verify(token, 'workspace-secret')).toEqual(expect.objectContaining({}))
})

test('throws a clear error when the workspace endpoint is unavailable', async () => {
  await expect(commandRequest({ db: {} }, 'query { ok }', {}))
    .rejects
    .toThrow('Command workspace endpoint is unavailable')

  expect(fetch).not.toHaveBeenCalled()
})

test('surfaces GraphQL errors returned by the workspace endpoint', async () => {
  fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      errors: [
        { message: 'Bad command input' },
        { message: 'Workspace offline' }
      ]
    })
  })

  await expect(commandRequest(
    { db: { _endpoint: 'http://workspace-prisma.local/graphql' } },
    'mutation { createCommandMessage { id } }',
    {}
  )).rejects.toThrow('Bad command input; Workspace offline')
})
