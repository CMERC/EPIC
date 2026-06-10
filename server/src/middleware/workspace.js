const { getLegacyPrisma } = require('../services/prisma')
const { getCurrentUserId } = require('../services/authContext')
const { workspaceAccessError } = require('../services/workspaceProvisioning')

const { getUserIdWebSocket } = require('../authSubscription')

const publicWorkspaceFields = new Set([
  'mediaSearchPublic',
  'mediaPostPublic',
  'mediaPostsPublic',
  'mediaPostsPublicConnection',
  'mediaProfilesPublic',
  'mediaProfilesPublicConnection',
  'mediaServicePublic',
  'planFeedbacksPublic',
  'planReasonsPublic',
  'planMissionTasksPublic',
  'planQualificationsPublic',
  'updatePlanFeedbackPublic',
  'createPlanMissionTaskPublic',
  'createPlanQualificationPublic',
  'createPlanReasonPublic'
])

function workspaceFromArgs(args) {
  return args && args.data && args.data.workspace
}

function setWorkspaceContext(ctx, info, workspace) {
  const activeWorkspace = {
    name: workspace.name,
    displayName: workspace.displayName,
    timeZone: workspace.timeZone,
    status: workspace.status,
    isTemplate: workspace.isTemplate,
    isPublic: Boolean(workspace.isPublic)
  }

  ctx.activeWorkspace = activeWorkspace
  ctx.workspace = activeWorkspace
  ctx.tenant = activeWorkspace

  info.workspaceName = activeWorkspace.name
  if (activeWorkspace.displayName) {
    info.workspaceDisplayName = activeWorkspace.displayName
  }
  if (activeWorkspace.timeZone) {
    info.workspaceTimeZone = activeWorkspace.timeZone
  }
}

async function findWorkspaceByName(ctx, name, select = {}) {
  if (!name) {
    return null
  }

  if (ctx.prisma) {
    return ctx.prisma.appWorkspace.findFirst({
      where: {
        name
      },
      select: {
        name: true,
        displayName: true,
        timeZone: true,
        status: true,
        isTemplate: true,
        ...select
      }
    })
  }

  const fields = ['name', 'displayName', 'timeZone', 'status', 'isTemplate'].concat(Object.keys(select))
  return ctx.db.query.appWorkspace({
    where: {
      name
    }
  }, `{${fields.join(' ')}}`)
}

async function findAuthorizedWorkspace(ctx, userId, name) {
  if (!userId || !name) {
    return null
  }

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
        name
      }
      : {
        User: {
          some: {
            id: userId
          }
        },
        name
      }

    return ctx.prisma.appWorkspace.findFirst({
      where: workspaceWhere,
      select: {
        name: true,
        displayName: true,
        timeZone: true,
        status: true,
        isTemplate: true
      }
    })
  }

  return ctx.db.query.appWorkspace({
    where: {
      members_some: {
        id: userId
      },
      name
    }
  }, '{name displayName timeZone}')
}

const workspaceMiddleware = async(resolve, parent, args, ctx, info) => {
  let userId
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
  let activeWorkspace

  const argsWorkspace = workspaceFromArgs(args)
  const fieldName = info && info.fieldName
  const isPublicWorkspaceField = publicWorkspaceFields.has(fieldName)

  if (argsWorkspace && isPublicWorkspaceField) {
    activeWorkspace = await findWorkspaceByName(ctx, argsWorkspace)
    if (activeWorkspace) {
      activeWorkspace.isPublic = true
    } else {
      workspaceError = 'invalid workspace'
    }
  } else if (userId) {
    //Auth: replace with AppUser activeWorkspace endpoint
    const requestedWorkspace = activeWorkspaceFromClient || argsWorkspace
    if (requestedWorkspace) {
      // check if user has access to workspace
      activeWorkspace = await findAuthorizedWorkspace(ctx, userId, requestedWorkspace)
      if (!activeWorkspace) {
        workspaceError = 'Sorry, you do not have access to this workspace'
      }
    }
  }

  if (workspaceError)
    return new Error(workspaceError)

  const lifecycleError = workspaceAccessError(activeWorkspace)
  if (activeWorkspace && lifecycleError) {
    return new Error(lifecycleError)
  }

  if (activeWorkspace) {
    setWorkspaceContext(ctx, info, activeWorkspace)

    ctx.db = getLegacyPrisma()
    const res = await resolve(parent, args, ctx, info)
    return res
  } else
    return new Error('Sorry, no workspace has been selected')
}

module.exports = {
  workspaceMiddleware,
  _test: {
    publicWorkspaceFields,
    workspaceFromArgs,
    setWorkspaceContext,
    findAuthorizedWorkspace,
    findWorkspaceByName
  }
}
