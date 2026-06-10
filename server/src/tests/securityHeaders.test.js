const { securityHeaders } = require('../middleware/securityHeaders')

const originalEnv = process.env.NODE_ENV

afterEach(() => {
  process.env.NODE_ENV = originalEnv
})

function runMiddleware() {
  const res = {
    setHeader: jest.fn()
  }
  const next = jest.fn()

  securityHeaders({}, res, next)

  return {
    res,
    next
  }
}

test('security headers set baseline browser protections', () => {
  process.env.NODE_ENV = 'development'
  const { res, next } = runMiddleware()

  expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff')
  expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'SAMEORIGIN')
  expect(res.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'strict-origin-when-cross-origin')
  expect(res.setHeader).toHaveBeenCalledWith('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
  expect(res.setHeader).not.toHaveBeenCalledWith('Strict-Transport-Security', expect.any(String))
  expect(next).toHaveBeenCalled()
})

test('security headers add HSTS in production', () => {
  process.env.NODE_ENV = 'production'
  const { res } = runMiddleware()

  expect(res.setHeader).toHaveBeenCalledWith('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
})
