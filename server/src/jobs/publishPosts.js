const logger = require('../logger')
const { Prisma } = require('prisma-binding')
const { addNoiseQueue } = require('./noiseScheduler')
const schedule = require('node-schedule')
var Queue = require('bull')

const logCyan = '\x1b[36m%s\x1b[0m'

async function initPublishPostJobs() {
  logger.verbose('Scheduled posts job publisher started')
  // Start Scheduler for global db on init
  addJobToQueue('global')
  // Strat Noise Scheduler for workspaces
  addNoiseQueue('global')
  const getPrismaInstance = () => {
    return new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
      debug: false
    })
  }
  // Start Scheduler for all workspace endpoint
  let appWorkspaces = await getPrismaInstance().query.appWorkspaces()
  for (let i = 0; i < appWorkspaces.length; i++) {
    addJobToQueue(appWorkspaces[i].name)
    // Add Noise Scheduler for each workspace
    addNoiseQueue(appWorkspaces[i].name)
  }
}
function addJobToQueue(endpoint) {
  let queue = new Queue('queue' + endpoint, process.env.REDIS_ENDPOINT, {
    defaultJobOptions: { removeOnComplete: true }
  })

  //cleans all jobs that completed over 5 seconds ago.
  queue.on('cleaned', function(jobs, type) {
    logger.info(logCyan, endpoint + ': publish jobs cleaned: ' + jobs.length + ' ' + type)
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
  handle(job)
  // Do Something on Job done
  return Promise.resolve()
}
function handle(job) {
  if (job.data.endpoint) {
    // Get workspace prisma instance
    let endpoint = process.env.PRISMA_ENDPOINT
    if (job.data.endpoint !== 'global') {
      endpoint = process.env.WORKSPACE_ENDPOINT + job.data.endpoint
    }
    const getPrismaInstance = () => {
      return new Prisma({
        typeDefs: 'src/generated/prisma.graphql',
        endpoint: endpoint,
        secret: process.env.PRISMA_SECRET,
        debug: false
      })
    }
    publishSchedule(5, getPrismaInstance())
  }
}
async function publishedPosts(db, first, skipCount = 0) {
  // Query then Mutation is required as subscription don't fire 
  // when using batch mutations: https://github.com/prisma/prisma/issues/2327
  const pubPosts = await db.query.mediaPosts(
    {
      where: {
        publishTime_lte: new Date().toISOString(),
        isPublished: false
      },
      first: first,
      skip: skipCount
    },
    '{id}'
  )

  for (let x = 0; x < pubPosts.length; x++) {
    await db.mutation.updateMediaPost(
      {
        where: {
          id: pubPosts[x].id
        },
        data: {
          isPublished: true
        }
      },
      '{id}'
    )
  }
  if (pubPosts.length > 0) {
    logger.verbose(pubPosts.length + ' posts have been published')
  }
  return pubPosts.length
}

function publishHistory(db) {
  let first = 100
  publishedPosts(db, first)
}

function publishSchedule(interval, db) {
  // Cleanup and publish all history posts that need to have isPublished set to true
  publishHistory(db)

  // every interval mins, get current date and interval mins later
  let currentDate = new Date().toISOString()
  let intervalEnd = new Date()
  intervalEnd.setMinutes(intervalEnd.getMinutes() + interval)
  // get posts between now and interval mins later
  db.query
    .mediaPosts(
      {
        where: {
          publishTime_gte: currentDate,
          publishTime_lte: intervalEnd
        }
      },
      `{
        id
        publishTime
        title
        isPublished
      }`
    )
    .then(data => {
      // schedule jobs to publish posts
      if (data.length > 0) {
        logger.verbose(data.length + ' posts have been scheduled')
      }

      for (let i = 0; i < data.length; i++) {
        let datVariable = data[i]
        // schedule jobs to publish at publishTime
        if (!datVariable.isPublished) {
          schedule.scheduleJob(
            datVariable.publishTime,
            function() {
              db.mutation
                .updateMediaPost(
                  {
                    where: {
                      id: datVariable.id
                    },
                    data: {
                      isPublished: true
                    }
                  },
                  '{id}'
                )
                .then(data => {
                  // logger.verbose(datVariable.title + ' Post has been published')
                })
            }
          )
        }
      }
    })
}

module.exports = {
  addJobToQueue,
  initPublishPostJobs
}
