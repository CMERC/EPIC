const jwt = require('jsonwebtoken')
const {
  getUser: getLegacyAuthUser,
  getUserId: getLegacyAuthUserId
} = require('graphql-authentication')

function getAuthorizationHeader(ctx) {
  const req = ctx.req || ctx.request
  return req && typeof req.get === 'function' ? req.get('Authorization') : null
}

async function getCurrentUserId(ctx) {
  const Authorization = getAuthorizationHeader(ctx)

  if (!ctx.prisma || !Authorization || !ctx.graphqlAuthentication) {
    return getLegacyAuthUserId(ctx)
  }

  const token = Authorization.replace('Bearer ', '')
  const { userId, sessionId } = jwt.verify(token, ctx.graphqlAuthentication.secret)
  const sessionUser = await ctx.prisma.user.findFirst({
    where: {
      id: userId,
      sessionId
    },
    select: {
      sessionId: true
    }
  })

  return sessionUser && sessionUser.sessionId ? userId : null
}

async function getCurrentUser(ctx, options = {}) {
  const userId = await getCurrentUserId(ctx)

  if (!ctx.prisma || !userId) {
    return getLegacyAuthUser(ctx)
  }

  return ctx.prisma.user.findUnique({
    where: {
      id: userId
    },
    ...options
  })
}

module.exports = {
  getAuthorizationHeader,
  getCurrentUser,
  getCurrentUserId
}
