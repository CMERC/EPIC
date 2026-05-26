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
    // migrate requested TO requested, trained method, priority
    let countTOs = await migrateTOFields(workspace)
    if (countTOs) {
      logger.info(
        logCyan,
        countTOs.totalTOs + ' total TOs on ' + workspace
      )
      logger.info(logGreen, countTOs.updatedTOs + ' TOs have been updated')
    }

  }
}
async function migrateTOFields(workspace) {
  var count = {
    totalTOs: 0,
    updatedTOs: 0
  }
  logger.info(workspace + ' workspace, migrate TO requested, trained method, priority')
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
  try {
    // get requestedMethodsTypes
    const requestedMethodsTypesList = await getPrismaInstance().query.planRequestedMethodTypes(
      {}, '{id title}'
    )
    // get trainedMethodTypes
    const trainedMethodTypesList = await getPrismaInstance().query.planTrainedMethodTypes(
      {}, '{id title}'
    )
    // get priorityLevelsList
    const priorityLevelsList = await getPrismaInstance().query.planPriorityLevels(
      {}, '{id title}'
    )

    const totalTOsInWorkspace = await getPrismaInstance().query.planTrainingObjectivesConnection(
      {}, '{aggregate {count}}'
    )
    let prismaCycles = totalTOsInWorkspace.aggregate.count > queryLimit ? Math.ceil(totalTOsInWorkspace.aggregate.count / queryLimit) : 1

    for (let i = 0; i < prismaCycles; i++) {
      let pubTOs = await getPrismaInstance().query.planTrainingObjectives(
        {
          skip: i * queryLimit,
          first: queryLimit
        },
        `{
        id
        requestedMethod
        requestedMethodType{ id }
        trainedMethod
        trainedMethodType{ id }
        priority
        priorityLevel{ id }
      }`
      )
      for (let to of pubTOs) {
        let updateDataofTO
        // Only update if new field is empty
        if (to.requestedMethod && to.requestedMethod.title.length > 0 && !to.requestedMethodType) {
          updateDataofTO = {
            requestedMethodType: {
              connect: {
                id: requestedMethodsTypesList.find(obj => obj['title'] == to.requestedMethod.title).id
              }
            }
          }
        }
        // Only update if new field is empty
        if (to.trainedMethod && to.trainedMethod.title.length > 0 && !to.trainedMethodType) {
          updateDataofTO = {
            ...updateDataofTO,
            trainedMethodType: {
              connect: {
                id: trainedMethodTypesList.find(obj => obj['title'] == to.trainedMethod.title).id
              }
            }
          }
        }
        // Only update if new field is empty
        if (to.priority && to.priority.title.length > 0 && !to.priorityLevel) {
          updateDataofTO = {
            ...updateDataofTO,
            priorityLevel: {
              connect: {
                id: priorityLevelsList.find(obj => obj['title'] == to.priority.title).id
              }
            }
          }
        }
        if (updateDataofTO) {
          let updatedTO = await getPrismaInstance().mutation.updatePlanTrainingObjective({
            data: updateDataofTO,
            where: { id: to.id }
          })
          if (updatedTO) {
            count.updatedTOs++
          }
        }
      }
      count.totalTOs = totalTOsInWorkspace.aggregate.count
    }
    return count
  } catch (err) {
    logger.info(err)
  }
}
