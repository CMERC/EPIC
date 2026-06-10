jest.mock('../services/authContext', () => ({
  getCurrentUser: jest.fn()
}))

const { getCurrentUser } = require('../services/authContext')
const { recordAuditEvent, _test } = require('../services/auditLog')
const { activityMiddleware } = require('../middleware/activity')

beforeEach(() => {
  jest.clearAllMocks()
})

test('audit log derives reference ids from mutation args and results', () => {
  expect(_test.referenceId({
    where: {
      id: 'arg-id'
    }
  }, {
    id: 'result-id'
  })).toBe('arg-id')

  expect(_test.referenceId({}, {
    id: 'result-id'
  })).toBe('result-id')
})

test('recordAuditEvent writes an activity stream entry', async() => {
  getCurrentUser.mockResolvedValue({
    id: 'user-1',
    name: 'Ada Lovelace',
    email: 'ada@example.test'
  })
  const createActivityStream = jest.fn().mockResolvedValue({
    id: 'activity-1'
  })
  const ctx = {
    db: {
      mutation: {
        createActivityStream
      }
    }
  }

  await recordAuditEvent(ctx, {
    fieldName: 'completeCommandMessage'
  }, {
    where: {
      id: 'command-1'
    }
  }, {
    id: 'command-1'
  })

  expect(createActivityStream).toHaveBeenCalledWith({
    data: {
      summary: 'user: Ada Lovelace action: completeCommandMessage objectID: command-1',
      type: 'completeCommandMessage',
      actor: 'user-1',
      name: 'Ada Lovelace',
      referenceID: 'command-1'
    }
  })
})

test('activity middleware audits create-style mutations after resolving', async() => {
  getCurrentUser.mockResolvedValue({
    id: 'user-1',
    name: 'Ada Lovelace'
  })
  const createActivityStream = jest.fn().mockResolvedValue({
    id: 'activity-1'
  })
  const resolve = jest.fn().mockResolvedValue({
    id: 'observe-1'
  })
  const ctx = {
    db: {
      mutation: {
        createActivityStream
      }
    }
  }

  const result = await activityMiddleware.createObservePost(resolve, null, {
    data: {
      text: 'Observation'
    }
  }, ctx, {
    fieldName: 'createObservePost'
  })

  expect(result).toEqual({
    id: 'observe-1'
  })
  expect(createActivityStream).toHaveBeenCalledWith(expect.objectContaining({
    data: expect.objectContaining({
      type: 'createObservePost',
      referenceID: 'observe-1'
    })
  }))
})
