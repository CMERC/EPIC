const logger = require('../src/logger')
const { getLegacyPrisma } = require('../src/services/prisma')
const queryLimit = 500
const Geohash = require('ngeohash')

getWorkspaces()

const logGreen = '\x1b[32m%s\x1b[0m'
const logCyan = '\x1b[36m%s\x1b[0m'

async function getWorkspaces() {
  // Load env variables from path
  require('dotenv').config({ path: '../.env' })
  const getPrismaInstance = () => getLegacyPrisma()
  // Query the appWorkspaces resolver for all created workspaces on the global endpoint
  let appWorkspaces = await getPrismaInstance().query.appWorkspaces()
  // Iterate through the workspaces and run the 'prisma deploy' command
  for (let i = 0; i < appWorkspaces.length; i++) {
    let workspace = appWorkspaces[i].name
    // add Locations geohash
    let updatedLocations = await addGeohashToLocation(workspace)
    if (updatedLocations) {
      logger.info(
        logCyan,
        updatedLocations.totalLocations + ' total locations on ' + workspace
      )
      logger.info(logGreen, updatedLocations.updatedLocations + ' Locations have been updated')
      logger.info(logGreen, updatedLocations.badLocations + ' locations are malformed')
    }
  }
}

async function addGeohashToLocation(workspace) {
  var count = {
    totalLocations: 0,
    updatedLocations: 0,
    badLocations: 0
  }
  logger.info(workspace + ' workspace, adding Location geohash')
  const getPrismaInstance = () => getLegacyPrisma()
  const totalLocationsInWorkspace = await getPrismaInstance().query.locationsConnection(
    {}, '{aggregate {count}}'
  )
  let prismaCycles = totalLocationsInWorkspace.aggregate.count > queryLimit ? Math.ceil(totalLocationsInWorkspace.aggregate.count / queryLimit) : 1

  for (let i = 0; i < prismaCycles; i++) {
    let workspaceLocations = await getPrismaInstance().query.locations(
      {
        skip: i * queryLimit,
        first: queryLimit
      },
      `{
        id
        geojson
        geohash
      }`
    )
    for (let x = 0; x < workspaceLocations.length; x++) {
      if (workspaceLocations[x].geojson && workspaceLocations[x].geojson.coordinates && workspaceLocations[x].geojson.coordinates.length !== 0) {
        if (!workspaceLocations[x].geohash || workspaceLocations[x].geohash.length === 0) {
          let updatedLocation = await getPrismaInstance().mutation.updateLocation(
            {
              data: {
                geohash: Geohash.encode(workspaceLocations[x].geojson.coordinates[1], workspaceLocations[x].geojson.coordinates[0])
              },
              where: { id: workspaceLocations[x].id }
            }
          )
          if (updatedLocation) {
            count.updatedLocations++
          }
        }
      }
      else
        count.badLocations++
    }
    count.totalLocations = parseInt(count.totalLocations) + parseInt(workspaceLocations.length)
  }

  return count
}
