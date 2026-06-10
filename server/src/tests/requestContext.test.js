jest.mock('../logger', () => ({
  info: jest.fn()
}))

const logger = require('../logger')
const { requestContextMiddleware } = require('../middleware/requestContext')

function createResponse() {
  const listeners = {}
  return {
    res: {
      statusCode: 204,
      setHeader: jest.fn(),
      on: jest.fn((event, callback) => {
        listeners[event] = callback
      })
    },
    listeners
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('request context propagates an incoming request id', () => {
  const req = {
    headers: {
      'x-request-id': 'request-123'
    },
    method: 'POST',
    originalUrl: '/graphql'
  }
  const { res, listeners } = createResponse()
  const next = jest.fn()

  requestContextMiddleware(req, res, next)
  listeners.finish()

  expect(req.requestId).toBe('request-123')
  expect(res.setHeader).toHaveBeenCalledWith('x-request-id', 'request-123')
  expect(next).toHaveBeenCalled()
  expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('"requestId":"request-123"'))
})

test('request context skips noisy healthcheck completion logs', () => {
  const req = {
    headers: {},
    method: 'GET',
    originalUrl: '/healthcheck'
  }
  const { res, listeners } = createResponse()

  requestContextMiddleware(req, res, jest.fn())
  listeners.finish()

  expect(req.requestId).toEqual(expect.any(String))
  expect(logger.info).not.toHaveBeenCalled()
})
