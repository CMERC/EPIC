const { isOriginAllowed } = require('../services/corsPolicy')

const originalEnv = process.env.NODE_ENV
const originalAppDomain = process.env.APP_DOMAIN

afterEach(() => {
  process.env.NODE_ENV = originalEnv
  process.env.APP_DOMAIN = originalAppDomain
})

test('cors policy allows same-origin and configured SaaS origins', () => {
  expect(isOriginAllowed(undefined, ['https://customer.epic-ready.test'])).toBe(true)
  expect(isOriginAllowed('https://customer.epic-ready.test', ['https://customer.epic-ready.test'])).toBe(true)
})

test('cors policy allows localhost origins outside production', () => {
  process.env.NODE_ENV = 'development'

  expect(isOriginAllowed('http://localhost:4467', [])).toBe(true)
  expect(isOriginAllowed('http://127.0.0.1:4173', [])).toBe(true)
})

test('cors policy rejects unknown origins in production', () => {
  process.env.NODE_ENV = 'production'

  expect(isOriginAllowed('http://localhost:4467', [])).toBe(false)
  expect(isOriginAllowed('https://unknown.example.test', ['https://known.example.test'])).toBe(false)
})

test('cors policy allows localhost dev client when production app domain is localhost', () => {
  process.env.NODE_ENV = 'production'
  process.env.APP_DOMAIN = 'localhost'

  jest.resetModules()
  const { isOriginAllowed: isLocalOriginAllowed } = require('../services/corsPolicy')

  expect(isLocalOriginAllowed('http://localhost:4467')).toBe(true)
  expect(isLocalOriginAllowed('http://127.0.0.1:4467')).toBe(true)
  expect(isLocalOriginAllowed('https://unknown.example.test')).toBe(false)
})
