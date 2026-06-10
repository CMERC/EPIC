const LOGIN_WINDOW_SECONDS = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_SECONDS || 15 * 60)
const LOGIN_MAX_FAILURES = Number(process.env.LOGIN_RATE_LIMIT_MAX_FAILURES || 10)

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function clientIp(ctx) {
  const req = ctx.request || ctx.req || {}
  const headers = req.headers || {}
  const forwarded = headers['x-forwarded-for']
  if (forwarded) {
    return String(forwarded).split(',')[0].trim()
  }
  return req.ip || req.connection && req.connection.remoteAddress || 'unknown'
}

function loginFailureKey(ctx, email) {
  return `auth:login-fail:${normalizeEmail(email)}:${clientIp(ctx)}`
}

function hasRedis(ctx) {
  return ctx && ctx.redisClient && typeof ctx.redisClient.get === 'function'
}

async function assertLoginAllowed(ctx, email) {
  if (!hasRedis(ctx)) {
    return
  }

  const key = loginFailureKey(ctx, email)
  const failures = Number(await ctx.redisClient.get(key) || 0)
  if (failures >= LOGIN_MAX_FAILURES) {
    throw new Error('Too many failed login attempts. Please wait before trying again.')
  }
}

async function recordLoginFailure(ctx, email) {
  if (!hasRedis(ctx)) {
    return
  }

  const key = loginFailureKey(ctx, email)
  const failures = await ctx.redisClient.incr(key)
  if (failures === 1 && typeof ctx.redisClient.expire === 'function') {
    await ctx.redisClient.expire(key, LOGIN_WINDOW_SECONDS)
  }
}

async function clearLoginFailures(ctx, email) {
  if (!hasRedis(ctx) || typeof ctx.redisClient.del !== 'function') {
    return
  }

  await ctx.redisClient.del(loginFailureKey(ctx, email))
}

module.exports = {
  LOGIN_MAX_FAILURES,
  LOGIN_WINDOW_SECONDS,
  assertLoginAllowed,
  clearLoginFailures,
  clientIp,
  loginFailureKey,
  normalizeEmail,
  recordLoginFailure
}
