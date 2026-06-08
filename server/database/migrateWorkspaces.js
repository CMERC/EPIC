const { getLegacyPrisma } = require('../src/services/prisma')
const { prismaDeployWorkspace } = require('../src/jobs/deploy')

getWorkspaces()

async function getWorkspaces() {
  // Load env variables from path
  require('dotenv').config({ path: '../.env' })
  const getPrismaInstance = () => getLegacyPrisma()
  // Query the appWorkspaces resolver for all created workspaces on the global endpoint
  let appWorkspaces = await getPrismaInstance().query.appWorkspaces()
  // Iterate through the workspaces and run the 'prisma deploy' command
  for (let i = 0; i < appWorkspaces.length; i++) {
    prismaDeployWorkspace(getPrismaInstance(), appWorkspaces[i].name, appWorkspaces[i].status)
  }
}
