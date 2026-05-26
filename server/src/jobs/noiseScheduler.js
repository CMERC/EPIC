const logger = require('../logger')
var Queue = require('bull')
const { startNoise } = require('../noise/generateNoise.js')

const logGreen = '\x1b[32m%s\x1b[0m'

function addNoiseQueue(endpoint) {
  let queue = new Queue('noiseQueue' + endpoint, process.env.REDIS_ENDPOINT, {
    defaultJobOptions: { removeOnComplete: true }
  })

  //cleans all jobs that completed over 5 seconds ago.
  queue.on('cleaned', function(jobs, type) {
    logger.info(logGreen, endpoint + ': noise jobs cleaned: ' + jobs.length + ' ' + type)
  })
  queue.clean(5000, 'completed')
  queue.clean(5000, 'failed')
  queue.clean(5000, 'wait')
  queue.clean(5000, 'delayed')

  queue.process(1, processJob)
  // Repeat job every 5 min in queue
  queue.add({ endpoint: endpoint }, { repeat: { cron: '*/5 * * * *' } })
}
function processJob(job) {
  // Handle Job
  startNoise(job.data.endpoint)

  // return resolve to indicate job completion
  return Promise.resolve()
}

module.exports = {
  addNoiseQueue
}
