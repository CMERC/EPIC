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
    ...splitOrigins(process.env.CLIENT_URL)
  ]
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
