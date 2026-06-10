const { isOriginAllowed } = require('../services/corsPolicy')

const originalEnv = process.env.NODE_ENV

afterEach(() => {
  process.env.NODE_ENV = originalEnv
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
