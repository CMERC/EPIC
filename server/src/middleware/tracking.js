const logger = require('../logger')

const trackingMiddleware = async(resolve, parent, args, ctx, info) => {
  // Track the access counts of objects in a redis HyperLogLog
  // redis: PFADD visitors alice bob carol

  let ipAddress = ctx.request.headers['x-forwarded-for']
  if (ipAddress === undefined) {
    ipAddress = ctx.request.ip
  }
  let trackVisitors =
    'media:trackVisitors:' + args.data.workspace + ':' + args.data.post.id
  logger.info(trackVisitors + ' ipAddress: ' + ipAddress)
  ctx.redisClient.pfadd(trackVisitors, ipAddress, function(err) {
    if (err) console.error(err)
  })

  let trackViews =
    'media:trackViews:' + args.data.workspace + ':' + args.data.post.id
  ctx.redisClient.incr(trackViews, function(err) {
    if (err) console.error(err)
  })

  return await resolve(parent, args, ctx, info)
}

module.exports = {
  trackingMiddleware
}
