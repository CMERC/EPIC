const DEV_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/

function splitOrigins(value) {
  return String(value || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
}

function configuredOrigins() {
  return [
    ...splitOrigins(process.env.CORS_ALLOWED_ORIGINS),
    ...splitOrigins(process.env.APP_DOMAIN),
    ...splitOrigins(process.env.CLIENT_URL),
    ...localDevelopmentOrigins()
  ]
}

function localDevelopmentOrigins() {
  const appDomains = splitOrigins(process.env.APP_DOMAIN)
  const appDomainAllowsLocal = appDomains.some(origin => {
    const normalized = origin.replace(/^https?:\/\//, '').split(':')[0]
    return ['localhost', '127.0.0.1', '::1'].includes(normalized)
  })

  if (process.env.NODE_ENV !== 'production' || appDomainAllowsLocal) {
    return [
      'http://localhost:4467',
      'http://127.0.0.1:4467',
      'http://localhost:4173',
      'http://127.0.0.1:4173'
    ]
  }

  return []
}

function isOriginAllowed(origin, allowedOrigins = configuredOrigins()) {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true
  if (process.env.NODE_ENV !== 'production' && DEV_ORIGIN_PATTERN.test(origin)) return true
  return false
}

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Origin not allowed by CORS policy'))
  }
}

module.exports = {
  configuredOrigins,
  corsOptions,
  isOriginAllowed
}
