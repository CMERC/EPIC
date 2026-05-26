const { getLegacyPrisma } = require('../services/prisma')
const globalMiddleware = async(resolve, parent, args, ctx, info) => {
  ctx.db = getLegacyPrisma()
  const res = await resolve(parent, args, ctx, info)
  return res
}
module.exports = {
  globalMiddleware
}
