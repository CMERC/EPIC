const Redis = require('ioredis')

async function getBullQueues() {
  const redisClient = new Redis(process.env.REDIS_ENDPOINT)
  // console.log('getting queues')
  var queueNameRegExp = new RegExp('(.*):(.*):id')
  const keys = await redisClient.keys('*:*:id')
  let queues = keys.map(function(key) {
    let match = queueNameRegExp.exec(key)
    // console.log(match)
    if (match) {
      return {
        name: match[2],
        hostId: match[2].startsWith('noise') ? 'noisePosts' : 'publishPosts',
        url: process.env.REDIS_ENDPOINT
      }
    }
  })

  return queues
}
module.exports = {
  getBullQueues
}
