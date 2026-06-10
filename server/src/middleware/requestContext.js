const { v4: uuid } = require('uuid')
const logger = require('../logger')

function requestContextMiddleware(req, res, next) {
  const requestId = req.headers['x-request-id'] || uuid()
  req.requestId = requestId

  if (typeof res.setHeader === 'function') {
    res.setHeader('x-request-id', requestId)
  }

  const startedAt = Date.now()
  if (typeof res.on === 'function') {
    res.on('finish', () => {
      const path = req.originalUrl || req.url || ''
      if (path.startsWith('/healthcheck')) {
        return
      }

      logger.info(JSON.stringify({
        type: 'http_request',
        requestId,
        method: req.method,
        path,
        status: res.statusCode,
        durationMs: Date.now() - startedAt
      }))
    })
  }

  next()
}

module.exports = {
  requestContextMiddleware
}
