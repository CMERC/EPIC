const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')

async function commandRequest(ctx, query, variables) {
  const endpoint = ctx.db && ctx.db._endpoint
  if (!endpoint) throw new Error('Command workspace endpoint is unavailable')

  const headers = {
    'content-type': 'application/json'
  }

  if (ctx.db._secret) {
    headers.authorization = `Bearer ${jwt.sign({}, ctx.db._secret)}`
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  })
  const result = await response.json()

  if (result.errors && result.errors.length) {
    throw new Error(result.errors.map(error => error.message).join('; '))
  }

  return result.data
}

module.exports = {
  commandRequest
}
