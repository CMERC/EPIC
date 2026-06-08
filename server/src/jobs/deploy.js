const logger = require('../logger')
const { getLegacyPrisma } = require('../services/prisma')

function deployWorkspace(workspace) {
  try {
    prismaDeployWorkspace(getLegacyPrisma(), workspace, 'Deploying')
  } catch (error) {
    logger.error(error)
  }
}
function prismaDeployWorkspace(db, workspace, status) {
  try {
    logger.info('Prisma 1 workspace deploy skipped for Prisma Client runtime: ' + workspace)
    if (db && status && status === 'Deploying')
      makeWorkspaceAvailable(db, workspace)
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
