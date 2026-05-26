const logger = require('../src/logger')
const { Prisma } = require('prisma-binding')
const queryLimit = 500

getWorkspaces()

const logGreen = '\x1b[32m%s\x1b[0m'
const logCyan = '\x1b[36m%s\x1b[0m'

async function getWorkspaces() {
  // Load env variables from path
  require('dotenv').config({ path: '../.env' })
  const getPrismaInstance = () => {
    return new Prisma({
      typeDefs: '../src/generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
      debug: false
    })
  }
  // Query the appWorkspaces resolver for all created workspaces on the global endpoint
  let appWorkspaces = await getPrismaInstance().query.appWorkspaces()
  // Iterate through the workspaces and run the 'prisma deploy' command
  for (let i = 0; i < appWorkspaces.length; i++) {
    let workspace = appWorkspaces[i].name
    // Fix Posts url
    let updatedPosts = await postUrls(workspace)
    if (updatedPosts) {
      logger.info(
        logCyan,
        updatedPosts.totalPosts + ' total posts on ' + workspace
      )
      logger.info(logGreen, updatedPosts.updatedPosts + ' posts have been updated')
      logger.info(logGreen, updatedPosts.deletedPosts + ' posts have been deleted')
    }
    // Fix Profile Urls
    let updatedProfiles = await profileUrls(workspace)
    if (updatedProfiles) {
      logger.info(
        logCyan,
        updatedProfiles.totalProfiles + ' total Profiles on ' + workspace
      )
      logger.info(logGreen, updatedProfiles.updatedProfiles + ' Profiles have been updated')
      logger.info(logGreen, updatedProfiles.deletedProfiles + ' Profiles have been deleted')
    }
  }
}
// replace to do this on redis
async function postUrls(workspace) {
  var count = {
    totalPosts: 0,
    deletedPosts: 0,
    updatedPosts: 0
  }
  logger.info(workspace + ' workspace, fixing post urls')
  // Fix post URLs
  // Get prisma endpoint to query
  let endpoint = process.env.PRISMA_ENDPOINT
  if (workspace !== 'global') {
    endpoint = process.env.WORKSPACE_ENDPOINT + workspace
  }
  const getPrismaInstance = () => {
    return new Prisma({
      typeDefs: '../src/generated/prisma.graphql',
      endpoint: endpoint,
      secret: process.env.PRISMA_SECRET,
      debug: false
    })
  }
  const totalPostsInWorkspace = await getPrismaInstance().query.mediaPostsConnection(
    {}, '{aggregate {count}}'
  )
  let prismaCycles = totalPostsInWorkspace.aggregate.count > queryLimit ? Math.ceil(totalPostsInWorkspace.aggregate.count / queryLimit) : 1

  for (let i = 0; i < prismaCycles; i++) {
    let pubPosts = await getPrismaInstance().query.mediaPosts(
      {
        skip: i * queryLimit,
        first: queryLimit
      },
      `{
        id
        url
        profiles{
          username
          service{
            name
          }
        }
      }`
    )
    for (let x = 0; x < pubPosts.length; x++) {
      if (pubPosts[x].profiles[0]) {
        // If post has profile attached
        let whatItShouldBe =
          process.env.APP_DOMAIN +
          '/web/' +
          workspace +
          '/' +
          pubPosts[x].profiles[0].service.name +
          '/' +
          pubPosts[x].profiles[0].username +
          '/' +
          pubPosts[x].id
        // Convert to string to avoid typecast errors
        if ('' + whatItShouldBe !== '' + pubPosts[x].url) {
          let updateURL = {
            data: {
              url: whatItShouldBe
            },
            where: { id: pubPosts[x].id }
          }
          let updatedMediaPost = await getPrismaInstance().mutation.updateMediaPost(
            updateURL
          )
          if (updatedMediaPost) {
            count.updatedPosts++
          }
        }
      } else {
        // delete posts without profile
        await getPrismaInstance().mutation.deleteMediaPost(
          { where: { id: pubPosts[x].id } }
        )
        count.deletedPosts++
      }

    }
    count.totalPosts = parseInt(count.totalPosts) + parseInt(pubPosts.length)
  }

  return count
}
async function profileUrls(workspace) {
  var countProfiles = {
    totalProfiles: 0,
    deletedProfiles: 0,
    updatedProfiles: 0
  }
  logger.info(workspace + ' workspace, fixing Profiles urls')
  // Fix Profile URLs
  // Get prisma endpoint to query
  let endpoint = process.env.PRISMA_ENDPOINT
  if (workspace !== 'global') {
    endpoint = process.env.WORKSPACE_ENDPOINT + workspace
  }
  const getPrismaInstance = () => {
    return new Prisma({
      typeDefs: '../src/generated/prisma.graphql',
      endpoint: endpoint,
      secret: process.env.PRISMA_SECRET,
      debug: false
    })
  }
  const totalProfilesInWorkspace = await getPrismaInstance().query.mediaProfilesConnection(
    {}, '{aggregate {count}}'
  )
  let prismaCycles = totalProfilesInWorkspace.aggregate.count > queryLimit ? Math.ceil(totalProfilesInWorkspace.aggregate.count / queryLimit) : 1

  for (let i = 0; i < prismaCycles; i++) {
    let pubProfiles = await getPrismaInstance().query.mediaProfiles(
      {
        skip: i * queryLimit,
        first: queryLimit
      },
      `{
        id
        url
        username
        service{
          name
        }        
      }`
    )
    for (let x = 0; x < pubProfiles.length; x++) {
      if (pubProfiles[x].service) {
        // If Profile has service attached
        let whatItShouldBe =
          process.env.APP_DOMAIN +
          '/web/' +
          workspace +
          '/' +
          pubProfiles[x].service.name +
          '/' +
          pubProfiles[x].username
        // Convert to string to avoid typecast errors
        if ('' + whatItShouldBe !== '' + pubProfiles[x].url) {
          let updateURL = {
            data: {
              url: whatItShouldBe
            },
            where: { id: pubProfiles[x].id }
          }
          let updatedMediaProfile = await getPrismaInstance().mutation.updateMediaProfile(
            updateURL
          )
          if (updatedMediaProfile) {
            countProfiles.updatedProfiles++
          }
        }
      } else {
        // delete Profiles without service
        await getPrismaInstance().mutation.deleteMediaProfile(
          { where: { id: pubProfiles[x].id } }
        )
        countProfiles.deletedProfiles++
      }

    }
    countProfiles.totalProfiles = parseInt(countProfiles.totalProfiles) + parseInt(pubProfiles.length)
  }

  return countProfiles
}
