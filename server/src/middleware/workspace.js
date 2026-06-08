const { getLegacyPrisma } = require('../services/prisma')
const { getCurrentUserId } = require('../services/authContext')

const { getUserIdWebSocket } = require('../authSubscription')

const workspaceMiddleware = async(resolve, parent, args, ctx, info) => {
  let activeUserDB
  let userId
  let workspaceDisplayName
  let workspaceTimeZone
  let activeWorkspaceFromClient

  if (ctx.connection && ctx.connection.authorization) {
    // Subscriptions
    activeWorkspaceFromClient = ctx.connection.workspace
    userId = await getUserIdWebSocket(ctx)
  } else if (ctx.request && ctx.request.headers.authorization) {
    activeWorkspaceFromClient = ctx.request.headers.workspace
    userId = await getCurrentUserId(ctx)
  }
  let workspaceError

  // Public Resolvers: workspace is passed in with query
  if (args.data && args.data.workspace) {
    // check if workspace is valid
    let appWorkspaces
    if (ctx.prisma) {
      appWorkspaces = await ctx.prisma.appWorkspace.findMany({
        where: {
          name: args.data.workspace
        },
        select: {
          name: true
        }
      })
    } else {
      appWorkspaces = await ctx.db.query.appWorkspaces({
        where: {
          name: args.data.workspace
        }
      }, '{name}'
      )
    }

    if (appWorkspaces && appWorkspaces.length > 0)
      activeUserDB = args.data.workspace
    else
      workspaceError = 'invalid workspace'

  } else if (userId) {
    //Auth: replace with AppUser activeWorkspace endpoint
    if (activeWorkspaceFromClient) {
      // check if user has access to workspace
      let args = {
        where: {
          members_some: {
            id: userId
          },
          name: activeWorkspaceFromClient
        }
      }
      let appWorkspaces
      if (ctx.prisma) {
        const activeUser = await ctx.prisma.user.findUnique({
          where: {
            id: userId
          },
          select: {
            isSuper: true
          }
        })
        const workspaceWhere = activeUser && activeUser.isSuper
          ? {
            name: activeWorkspaceFromClient
          }
          : {
            User: {
              some: {
                id: userId
              }
            },
            name: activeWorkspaceFromClient
          }

        appWorkspaces = await ctx.prisma.appWorkspace.findMany({
          where: workspaceWhere,
          select: {
            name: true,
            displayName: true,
            timeZone: true
          }
        })
      } else {
        appWorkspaces = await ctx.db.query.appWorkspaces(args, '{name displayName timeZone}')
      }
      if (appWorkspaces && appWorkspaces.length > 0) {
        activeUserDB = appWorkspaces[0].name
        workspaceDisplayName = appWorkspaces[0].displayName
        workspaceTimeZone = appWorkspaces[0].timeZone
      } else
        workspaceError = 'Sorry, you do not have access to this workspace'
    }
  }

  if (workspaceError)
    return new Error(workspaceError)

  if (activeUserDB) {
    // Pass workspace name for post url generation
    info.workspaceName = activeUserDB
    // Pass workspace display name for email
    if (workspaceDisplayName)
      info.workspaceDisplayName = workspaceDisplayName
    // Pass for injectDownload
    if (workspaceTimeZone)
      info.workspaceTimeZone = workspaceTimeZone

    ctx.db = getLegacyPrisma()
    const res = await resolve(parent, args, ctx, info)
    return res
  } else
    return new Error('Sorry, no workspace has been selected')
}

module.exports = {
  workspaceMiddleware
}
