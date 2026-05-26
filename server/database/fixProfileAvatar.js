const fetch = require('node-fetch')
const logger = require('../src/logger')
const { Prisma } = require('prisma-binding')
const queryLimit = 600

// https://uifaces.co/api-key
// curl  https://uifaces.co/api?limit=1 -v --header Cache-Control: "no-cache" --header "Accept: application/json" --header "X-API-KEY: 5ACB707B-C9644175-8183FA47-E4CC2305"
async function queryRandomAvatarList(limit = 30)  {
  const apikey = '5ACB707B-C9644175-8183FA47-E4CC2305'

  const res = await fetch(
    'https://uifaces.co/api?' +
    'limit=' + limit,
    {
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apikey
      }
    }
  )
  const data = await res.json()
  if(data && data.length){
    let photosOnly = data.reduce(
      ( accumulator, currentValue ) => accumulator.concat(currentValue.photo),
      []
    )
    return photosOnly
  }
}


/*

avatar: {
  create: {
    name: 'Avatar',
    contentType: 'image/jpeg',
    url: {
      raw: tempAvatar,
      full: tempAvatar,
      regular: tempAvatar,
      small: tempAvatar,
      thumb: tempAvatar
    }
  }
},

*/

async function profileAvatar(workspace) {
  var countAvatars = {
    totalProfiles: 0
  }
  logger.info(workspace + ' workspace, fixing Profiles Avatar urls')
  
  // Load env variables from path
  require('dotenv').config({ path: '../.env' })

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
  let totalAvatarsInWorkspace = await getPrismaInstance().query.mediaFilesConnection(
    {where: {name: 'Avatar'}}, '{aggregate {count}}'
  )
  totalAvatarsInWorkspace = totalAvatarsInWorkspace.aggregate.count

  let prismaCycles = totalAvatarsInWorkspace > queryLimit ? Math.ceil(totalAvatarsInWorkspace / queryLimit) : 1

  for (let i = 0; i < prismaCycles; i++) {
    let avatarFiles = await getPrismaInstance().query.mediaFiles(
      {
        where: { 
          name: 'Avatar'
        },
        skip: i * queryLimit,
        first: queryLimit
      },
      `{
        id
        name
        url
      }`
    )
    
    const collectCount = queryLimit / 30 

    console.log('collectCount', collectCount)

    let randomAvatarList = []

    for (let i = 0; i < collectCount; i++) {
      console.log('count', i)
      randomAvatarList = randomAvatarList.concat( await queryRandomAvatarList() )
      console.log('randomAvatarList', randomAvatarList.length)
    }
    console.log('randomAvatarList' , randomAvatarList.length)

    avatarFiles.forEach(async avatarFile => {

      const randomAvatar = randomAvatarList.pop()
      let updateAvatarUrl = {
        data: {
          name: 'ProfileAvatar',
          url: {
            raw: randomAvatar,
            full: randomAvatar,
            regular: randomAvatar,
            small: randomAvatar,
            thumb: randomAvatar
          }
        },
        where: { id: avatarFile.id }
      }
      
      await getPrismaInstance().mutation.updateMediaFile(
        updateAvatarUrl
      )
        
    })

    countAvatars.totalProfiles = parseInt(countAvatars.totalProfiles) + parseInt(avatarFiles.length)
  }

  return countAvatars
}

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
  // Iterate through the workspaces and run the command
  for (let i = 0; i < appWorkspaces.length; i++) {
    let workspace = appWorkspaces[i].name
    
    // Fix Profile Avatars
    let updatedProfiles = await profileAvatar(workspace)
    if (updatedProfiles) {
      logger.info(
        logCyan,
        updatedProfiles.totalProfiles + ' total Profiles on ' + workspace
      )
    }
  }
}

async function main() {
  const workspace = 'global'
  let updatedProfiles = await profileAvatar(workspace)
  if (updatedProfiles) {
    logger.info(
      logCyan,
      updatedProfiles.totalProfiles + ' total Profiles on ' + workspace
    )
  }
}

//main()

//queryRandomAvatarList().then((photos) => { console.log('done', photos)})

getWorkspaces()