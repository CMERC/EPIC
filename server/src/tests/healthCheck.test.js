const { _test } = require('../services/healthCheck')

test('redis health reports OK on PONG', async() => {
  const redisClient = {
    ping: jest.fn().mockResolvedValue('PONG')
  }

  await expect(_test.redisHealth(redisClient)).resolves.toEqual(expect.objectContaining({
    name: 'Redis',
    message: 'OK',
    status: '200'
  }))
})

test('redis health reports failure on ping error', async() => {
  const redisClient = {
    ping: jest.fn().mockRejectedValue(new Error('connection refused'))
  }

  await expect(_test.redisHealth(redisClient)).resolves.toEqual(expect.objectContaining({
    name: 'Redis',
    message: 'connection refused',
    status: '500'
  }))
})

test('redis health is non-fatal when the client is not configured', async() => {
  await expect(_test.redisHealth()).resolves.toEqual(expect.objectContaining({
    name: 'Redis',
    message: 'Redis client not configured',
    status: '200'
  }))
})
