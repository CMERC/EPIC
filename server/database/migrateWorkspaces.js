const { Prisma } = require('prisma-binding')
const { prismaDeployWorkspace } = require('../src/jobs/deploy')

getWorkspaces()

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
    prismaDeployWorkspace(getPrismaInstance(), appWorkspaces[i].name, appWorkspaces[i].status)
  }
}
