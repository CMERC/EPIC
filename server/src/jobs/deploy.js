const logger = require('../logger')

const { Prisma } = require('prisma-binding')
// replace to do this on redis
function deployWorkspace(workspace) {
  try {
    let globalEndpoint = process.env.PRISMA_ENDPOINT
    const getPrismaInstance = () => {
      return new Prisma({
        typeDefs: 'src/generated/prisma.graphql',
        endpoint: globalEndpoint,
        secret: process.env.PRISMA_SECRET,
        debug: false
      })
    }
    prismaDeployWorkspace(getPrismaInstance(), workspace, 'Deploying')
  } catch (error) {
    logger.error(error)
  }
}
function prismaDeployWorkspace(db, workspace, status) {
  try {
    const exec = require('child_process').exec
    // Copy the env variables since the PATH env variables are needed for node apps to be called in linux environment
    // A copy is required as it will modify the current running app environment variables
    let workspaceEnv = Object.assign({}, process.env)
    if (workspace !== 'global')
      workspaceEnv.PRISMA_ENDPOINT = process.env.WORKSPACE_ENDPOINT + workspace

    logger.info('deploying workspace endpoint: ', workspaceEnv.PRISMA_ENDPOINT)
    // Deploy on new process
    exec('npx prisma deploy --force', {
      env: workspaceEnv
    }, (error, stdout, stderr) => {
      if (error) {
        logger.error(`exec error: ${error}`)
        return
      }
      logger.info(stdout.toString('utf8'))
      logger.info(stderr.toString('utf8'))

      if (db) {
        // Only make workspaces Deploying Available
        if (status && status === 'Deploying')
          makeWorkspaceAvailable(db, workspace)
      }
    })
  } catch (error) {
    logger.error(error)
  }
}
async function makeWorkspaceAvailable(db, workspace) {
  try {
    let data = await db.mutation.updateAppWorkspace({
      where: {
        name: workspace
      },
      data: {
        status: 'Available'
      }
    }, '{id}')

    if (data)
      logger.info(workspace + 'Workspace is now available')
  } catch (error) {
    logger.error(error)
  }
}
module.exports = {
  deployWorkspace,
  prismaDeployWorkspace
}
