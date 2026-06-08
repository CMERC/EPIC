const { forwardTo } = require('prisma-binding')
const { addFragmentToInfo } = require('graphql-binding')
const {
  getCurrentUser,
  getCurrentUserId
} = require('../../services/authContext')
const {
  appListSettingArgsFromPrisma1,
  appListSettingWhereFromPrisma1,
  appRoleArgsFromPrisma1,
  appRoleWhereFromPrisma1,
  appUserRoleArgsFromPrisma1,
  appWorkspaceArgsFromPrisma1,
  appWorkspaceWhereFromPrisma1,
  chatMessageArgsFromPrisma1,
  chatMessageWhereFromPrisma1,
  chatRoomArgsFromPrisma1,
  chatRoomWhereFromPrisma1,
  connectionFromPrismaResults,
  emailMailboxArgsFromPrisma1,
  emailMailboxWhereFromPrisma1,
  emailMessageArgsFromPrisma1,
  emailMessageWhereFromPrisma1,
  mediaNetworkArgsFromPrisma1,
  mediaNetworkWhereFromPrisma1,
  mediaNoiseLevelArgsFromPrisma1,
  mediaNoiseLevelWhereFromPrisma1,
  mediaPersonaArgsFromPrisma1,
  mediaPersonaWhereFromPrisma1,
  mediaPostArgsFromPrisma1,
  mediaPostWhereFromPrisma1,
  mediaProfileArgsFromPrisma1,
  mediaProfileWhereFromPrisma1,
  mediaServiceArgsFromPrisma1,
  mediaServiceWhereFromPrisma1,
  mapLayerArgsFromPrisma1,
  mapLayerWhereFromPrisma1,
  orderByFromPrisma1,
  planEventArgsFromPrisma1,
  planEventWhereFromPrisma1,
  planFundingSourceArgsFromPrisma1,
  planFundingSourceWhereFromPrisma1,
  planInjectArgsFromPrisma1,
  planInjectWhereFromPrisma1,
  planMeetingArgsFromPrisma1,
  planMeetingWhereFromPrisma1,
  planMethodArgsFromPrisma1,
  planMethodWhereFromPrisma1,
  planPriorityLevelArgsFromPrisma1,
  planPriorityLevelWhereFromPrisma1,
  planReasonArgsFromPrisma1,
  planReasonWhereFromPrisma1,
  toAppRole,
  toAppUserRole,
  toAppUser,
  toAppWorkspace,
  toChatMessage,
  toChatRoom,
  toEmailMailbox,
  toEmailMessage,
  toMediaPost,
  toMediaPersona,
  toMediaProfile,
  toPlanEvent,
  toPlanInjectSlim,
  toPlanMeeting,
  userWhereFromPrisma1
} = require('../../services/prismaBridge')

const tokenize = require('../../search-tokenize')
const resolverArgs = require('../arguments')

const mediaProfileInclude = {
  Location: true,
  MediaBanner: {
    include: {
      MediaFile: true
    }
  },
  MediaFile: true,
  MediaPersona: true,
  MediaService: true
}

const mediaPostInclude = {
  Location: true,
  MediaFile: true,
  MediaProfile: {
    include: mediaProfileInclude
  },
  MediaPost_A: true,
  MediaPost_B: true
}

const mediaPersonaInclude = {
  KeyValue: true,
  Location: true,
  MediaFile: true,
  MediaProfile: {
    include: mediaProfileInclude
  },
  MediaPersonaEdge_PersonaStart: {
    include: {
      MediaPersona_PersonaStart: {
        include: {
          MediaFile: true,
          Location: true,
          MediaProfile: {
            include: mediaProfileInclude
          },
          KeyValue: true
        }
      },
      MediaPersona_PersonaEnd: {
        include: {
          MediaFile: true,
          Location: true,
          MediaProfile: {
            include: mediaProfileInclude
          },
          KeyValue: true
        }
      }
    }
  },
  MediaPersonaEdge_PersonaEnd: {
    include: {
      MediaPersona_PersonaStart: {
        include: {
          MediaFile: true,
          Location: true,
          MediaProfile: {
            include: mediaProfileInclude
          },
          KeyValue: true
        }
      },
      MediaPersona_PersonaEnd: {
        include: {
          MediaFile: true,
          Location: true,
          MediaProfile: {
            include: mediaProfileInclude
          },
          KeyValue: true
        }
      }
    }
  }
}

const planEventInclude = {
  Location: true,
  PlanOrganization: true,
  PlanInject: {
    include: {
      Location: true,
      PlanMethod: true,
      PlanInjectOwner: true,
      PlanLabel: true,
      MediaFile: true,
      PlanTrainingObjective: true,
      PlanEvent: true
    }
  }
}

const planInjectInclude = {
  Location: true,
  PlanMethod: true,
  PlanInjectOwner: true,
  PlanLabel: true,
  MediaFile: true,
  PlanTrainingObjective: true,
  PlanEvent: true
}

const passthroughArgsFromPrisma1 = (args = {}) => {
  const prismaArgs = {}
  if (args.where) {
    prismaArgs.where = args.where
  }
  if (args.orderBy) {
    prismaArgs.orderBy = orderByFromPrisma1(args.orderBy) || args.orderBy
  }
  if (Number.isInteger(args.skip)) {
    prismaArgs.skip = args.skip
  }
  if (Number.isInteger(args.first)) {
    prismaArgs.take = args.first
  }
  return prismaArgs
}

const prismaModelQueryResolvers = ({ model, field, manyField, connectionField, map = value => value, argsMapper = passthroughArgsFromPrisma1 }) => ({
  [field]: async(parent, args, ctx, info) => {
    if (ctx.prisma && ctx.prisma[model]) {
      const item = await ctx.prisma[model].findFirst({
        where: argsMapper(args).where
      })
      return map(item)
    }
    return ctx.db.query[field](args, info)
  },
  [manyField]: async(parent, args, ctx, info) => {
    if (ctx.prisma && ctx.prisma[model]) {
      const items = await ctx.prisma[model].findMany(argsMapper(args))
      return items.map(map)
    }
    return ctx.db.query[manyField](args, info)
  },
  [connectionField]: async(parent, args, ctx, info) => {
    if (ctx.prisma && ctx.prisma[model]) {
      const prismaArgs = argsMapper(args)
      const [items, count] = await Promise.all([
        ctx.prisma[model].findMany(prismaArgs),
        ctx.prisma[model].count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(map), count)
    }
    return ctx.db.query[connectionField](args, info)
  }
})

const prismaModelListResolvers = ({ model, manyField, connectionField, map = value => value, argsMapper = passthroughArgsFromPrisma1 }) => ({
  [manyField]: async(parent, args, ctx, info) => {
    if (ctx.prisma && ctx.prisma[model]) {
      const items = await ctx.prisma[model].findMany(argsMapper(args))
      return items.map(map)
    }
    return ctx.db.query[manyField](args, info)
  },
  ...(connectionField ? { [connectionField]: async(parent, args, ctx, info) => {
    if (ctx.prisma && ctx.prisma[model]) {
      const prismaArgs = argsMapper(args)
      const [items, count] = await Promise.all([
        ctx.prisma[model].findMany(prismaArgs),
        ctx.prisma[model].count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(map), count)
    }
    return ctx.db.query[connectionField](args, info)
  } } : {})
})

const planInjectSearchArgsFromPrisma1 = (args = {}) => {
  const where = {
    deletedAt: null
  }

  if (args.event) {
    where.PlanEvent = {
      some: {
        name: {
          contains: args.event
        }
      }
    }
  }

  if (args.query) {
    const query = args.query
    where.OR = [
      { id: { contains: query } },
      { title: { contains: query } },
      { description: { contains: query } },
      { type: { contains: query } },
      { trigger: { contains: query } },
      { response: { contains: query } },
      { remarks: { contains: query } },
      { from: { contains: query } },
      { to: { contains: query } },
      { PlanMethod: { some: { name: { contains: query } } } },
      { PlanInjectOwner: { some: { title: { contains: query } } } },
      {
        PlanLabel: {
          some: {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } }
            ]
          }
        }
      },
      {
        PlanEvent: {
          some: {
            OR: [
              { name: { contains: query } },
              { type: { contains: query } },
              { method: { contains: query } },
              { exerciseGuidance: { contains: query } },
              { description: { contains: query } }
            ]
          }
        }
      }
    ]

    if (!isNaN(query)) {
      where.OR.push({ number: parseInt(query) })
    }
  }

  return {
    where,
    ...passthroughArgsFromPrisma1(args),
    orderBy: orderByFromPrisma1(args.orderBy)
  }
}

const mediaSearchWhereFromPublicInput = (data = {}) => {
  const where = {
    isPublished: true
  }

  const serviceWhere = {
    ...(data.service || {})
  }
  if (data.siteType) {
    serviceWhere.type = data.siteType
  }
  if (Object.keys(serviceWhere).length > 0) {
    where.MediaProfile = {
      some: {
        MediaService: {
          some: mediaServiceWhereFromPrisma1(serviceWhere)
        }
      }
    }
  }

  if (data.contentType) {
    where.MediaFile = {
      some: {
        contentType: {
          startsWith: data.contentType
        }
      }
    }
  }

  const tokens = tokenize(data.query || '')
  tokens.forEach(token => {
    const termFilter = {
      OR: [
        { text: { contains: token.term } },
        { title: { contains: token.term } }
      ]
    }
    if (token.exclude) {
      where.NOT = where.NOT || []
      where.NOT.push(termFilter)
    } else if (token.either) {
      where.OR = where.OR || []
      where.OR.push(termFilter)
    } else {
      where.AND = where.AND || []
      where.AND.push(termFilter)
    }
  })

  return where
}

const Query = {

  appListSetting(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.appListSetting.findFirst({
        where: appListSettingWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.appListSetting(args, info)
  },
  appListSettings(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.appListSetting.findMany(appListSettingArgsFromPrisma1(args))
    }

    return ctx.db.query.appListSettings(args, info)
  },
  async appListSettingsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = appListSettingArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.appListSetting.findMany(prismaArgs),
        ctx.prisma.appListSetting.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items, count)
    }

    return ctx.db.query.appListSettingsConnection(args, info)
  },


  appWorkspacePublic(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.appWorkspace.findFirst({
        where: appWorkspaceWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.appWorkspace(args, info)
  },
  async planInjectsSearch(parent, args, ctx, info) {
    if (ctx.prisma) {
      const injects = await ctx.prisma.planInject.findMany({
        ...planInjectSearchArgsFromPrisma1(args),
        include: planInjectInclude
      })
      return injects.map(toPlanInjectSlim)
    }

    let first
    let skip = {
      skip: args.skip
    }
    let orderBy

    if (args.orderBy) {
      orderBy = {
        orderBy: args.orderBy
      }
    }

    if (args.first) {
      first = {
        first: args.first
      }
    }

    args = resolverArgs.planInjectArgs(args)
    args = { ...args, ...orderBy }

    if (first) {
      args = { ...args, ...first }
    }

    if (skip) {
      args = { ...args, ...skip }
    }

    return ctx.db.query.planInjects(args, info)
  },
  async planInjectsSearchCount(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = planInjectSearchArgsFromPrisma1(args)
      const count = await ctx.prisma.planInject.count({ where: prismaArgs.where })
      return connectionFromPrismaResults([], count)
    }

    args = resolverArgs.planInjectArgs(args)
    return ctx.db.query.planInjectsConnection(args, info)
  },
  async mediaSearchPublic(parent, args, ctx, info) {
    if (ctx.prisma) {
      const posts = await ctx.prisma.mediaPost.findMany({
        where: mediaSearchWhereFromPublicInput(args.data),
        ...passthroughArgsFromPrisma1(args),
        orderBy: orderByFromPrisma1(args.orderBy),
        include: mediaPostInclude
      })
      return posts.map(toMediaPost)
    }

    return ctx.db.query.mediaPosts(args, info)
  },
  async mediaFeeds(parent, args, ctx, info) {
    // Only show {where: {isPublished: true}}
    args.where = { ...args.where, isPublished: true }
    if (ctx.prisma) {
      const posts = await ctx.prisma.mediaPost.findMany({
        ...mediaPostArgsFromPrisma1(args),
        include: mediaPostInclude
      })
      return posts.map(toMediaPost)
    }

    return ctx.db.query.mediaPosts(args, info)
  },
  async mediaServicePublic(parent, args, ctx, info) {
    if (args.data && args.data.service) {
      args = { where: args.data.service }
    }
    if (ctx.prisma) {
      return ctx.prisma.mediaService.findFirst({
        where: mediaServiceWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.mediaService(args, info)
  },
  async mediaPostsPublic(parent, args, ctx, info) {
    if (args.data && args.data.post) {
      args = { where: args.data.post }
    } else {
      args.where = {}
    }

    // Only show published posts to the public
    args.where = Object.assign(args.where, {
      isPublished: true
    })
    if (ctx.prisma) {
      const posts = await ctx.prisma.mediaPost.findMany({
        ...mediaPostArgsFromPrisma1(args),
        include: mediaPostInclude
      })
      return posts.map(toMediaPost)
    }

    return ctx.db.query.mediaPosts(args, info)
  },
  async mediaPostsPublicConnection(parent, args, ctx, info) {
    if (args.data && args.data.post) {
      args = { where: args.data.post }
    }
    args.where = {
      ...args.where,
      isPublished: true
    }
    if (ctx.prisma) {
      const prismaArgs = mediaPostArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.mediaPost.findMany({
          ...prismaArgs,
          include: mediaPostInclude
        }),
        ctx.prisma.mediaPost.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toMediaPost), count)
    }

    return ctx.db.query.mediaPostsConnection(args, info)
  },
  async mediaPostPublic(parent, args, ctx, info) {
    if (args.data && args.data.post) {
      args = { where: args.data.post }
    }
    args.where = {
      ...args.where,
      isPublished: true
    }
    if (ctx.prisma) {
      const post = await ctx.prisma.mediaPost.findFirst({
        where: mediaPostWhereFromPrisma1(args.where),
        include: mediaPostInclude
      })
      return toMediaPost(post)
    }

    return ctx.db.query.mediaPost(args, info)
  },
  async mediaProfilesPublic(parent, args, ctx, info) {
    if (args.data && args.data.profile) {
      args = { where: args.data.profile }
    }
    if (ctx.prisma) {
      const profiles = await ctx.prisma.mediaProfile.findMany({
        ...mediaProfileArgsFromPrisma1(args),
        include: mediaProfileInclude
      })
      return profiles.map(toMediaProfile)
    }

    return ctx.db.query.mediaProfiles(args, info)
  },
  async mediaProfilesPublicConnection(parent, args, ctx, info) {
    if (args.data && args.data.profile) {
      args = { where: args.data.profile }
    }
    if (ctx.prisma) {
      const prismaArgs = mediaProfileArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.mediaProfile.findMany({
          ...prismaArgs,
          include: mediaProfileInclude
        }),
        ctx.prisma.mediaProfile.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toMediaProfile), count)
    }

    return ctx.db.query.mediaProfilesConnection(args, info)
  },

  async appUserRoles(parent, args, ctx, info) {
    if (ctx.prisma) {
      const roles = await ctx.prisma.appUserRole.findMany({
        ...appUserRoleArgsFromPrisma1(args),
        include: {
          AppRole: true,
          User: true
        }
      })
      return roles.map(toAppUserRole)
    }

    return ctx.db.query.appUserRoles(args, info)
  },

  async appRoles(parent, args, ctx, info) {
    if (ctx.prisma) {
      const roles = await ctx.prisma.appRole.findMany({
        ...appRoleArgsFromPrisma1(args),
        include: {
          AppUserRole: {
            include: {
              AppRole: true,
              User: true
            }
          }
        }
      })
      return roles.map(toAppRole)
    }

    return ctx.db.query.appRoles(args, info)
  },
  async appRole(parent, args, ctx, info) {
    if (ctx.prisma) {
      const role = await ctx.prisma.appRole.findFirst({
        where: appRoleWhereFromPrisma1(args.where),
        include: {
          AppUserRole: {
            include: {
              AppRole: true,
              User: true
            }
          }
        }
      })
      return toAppRole(role)
    }

    return ctx.db.query.appRole(args, info)
  },
  async appRolesConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = appRoleArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.appRole.findMany(prismaArgs),
        ctx.prisma.appRole.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toAppRole), count)
    }

    return ctx.db.query.appRolesConnection(args, info)
  },

  mediaNetwork(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNetwork.findFirst({
        where: mediaNetworkWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.mediaNetwork(args, info)
  },
  mediaNetworks(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNetwork.findMany(mediaNetworkArgsFromPrisma1(args))
    }

    return ctx.db.query.mediaNetworks(args, info)
  },
  async mediaNetworksConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = mediaNetworkArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.mediaNetwork.findMany(prismaArgs),
        ctx.prisma.mediaNetwork.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items, count)
    }

    return ctx.db.query.mediaNetworksConnection(args, info)
  },

  async mediaPersonae(parent, args, ctx, info) {
    if (ctx.prisma) {
      const personas = await ctx.prisma.mediaPersona.findMany({
        ...mediaPersonaArgsFromPrisma1(args),
        include: mediaPersonaInclude
      })
      return personas.map(toMediaPersona)
    }

    return ctx.db.query.mediaPersonae(args, info)
  },
  async mediaPersona(parent, args, ctx, info) {
    if (ctx.prisma) {
      const persona = await ctx.prisma.mediaPersona.findFirst({
        where: mediaPersonaWhereFromPrisma1(args.where),
        include: mediaPersonaInclude
      })
      return toMediaPersona(persona)
    }

    return ctx.db.query.mediaPersona(args, info)
  },
  async mediaPersonaeConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = mediaPersonaArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.mediaPersona.findMany({
          ...prismaArgs,
          include: mediaPersonaInclude
        }),
        ctx.prisma.mediaPersona.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toMediaPersona), count)
    }

    return ctx.db.query.mediaPersonaeConnection(args, info)
  },

  async mediaPost(parent, args, ctx, info) {
    if (ctx.prisma) {
      const post = await ctx.prisma.mediaPost.findFirst({
        where: mediaPostWhereFromPrisma1(args.where),
        include: mediaPostInclude
      })
      return toMediaPost(post)
    }

    return ctx.db.query.mediaPost(args, info)
  },
  async mediaPosts(parent, args, ctx, info) {
    if (ctx.prisma) {
      const posts = await ctx.prisma.mediaPost.findMany({
        ...mediaPostArgsFromPrisma1(args),
        include: mediaPostInclude
      })
      return posts.map(toMediaPost)
    }

    return ctx.db.query.mediaPosts(args, info)
  },
  async mediaPostsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = mediaPostArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.mediaPost.findMany({
          ...prismaArgs,
          include: mediaPostInclude
        }),
        ctx.prisma.mediaPost.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toMediaPost), count)
    }

    return ctx.db.query.mediaPostsConnection(args, info)
  },

  async mediaProfiles(parent, args, ctx, info) {
    if (ctx.prisma) {
      const profiles = await ctx.prisma.mediaProfile.findMany({
        ...mediaProfileArgsFromPrisma1(args),
        include: mediaProfileInclude
      })
      return profiles.map(toMediaProfile)
    }

    return ctx.db.query.mediaProfiles(args, info)
  },
  async mediaProfile(parent, args, ctx, info) {
    if (ctx.prisma) {
      const profile = await ctx.prisma.mediaProfile.findFirst({
        where: mediaProfileWhereFromPrisma1(args.where),
        include: mediaProfileInclude
      })
      return toMediaProfile(profile)
    }

    return ctx.db.query.mediaProfile(args, info)
  },
  async mediaProfilesConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = mediaProfileArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.mediaProfile.findMany({
          ...prismaArgs,
          include: mediaProfileInclude
        }),
        ctx.prisma.mediaProfile.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toMediaProfile), count)
    }

    return ctx.db.query.mediaProfilesConnection(args, info)
  },

  planReasons(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planReason.findMany(planReasonArgsFromPrisma1(args))
    }

    return ctx.db.query.planReasons(args, info)
  },
  planReason(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planReason.findFirst({
        where: planReasonWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.planReason(args, info)
  },
  async planReasonsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = planReasonArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.planReason.findMany(prismaArgs),
        ctx.prisma.planReason.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items, count)
    }

    return ctx.db.query.planReasonsConnection(args, info)
  },

  planReasonsPublic(parent, args, ctx, info) {
    if (args.data && args.data.planReason) {
      args = { ...args, where: args.data.planReason }
      delete args.data
    }
    if (ctx.prisma) {
      return ctx.prisma.planReason.findMany(planReasonArgsFromPrisma1(args))
    }

    return ctx.db.query.planReasons(args, info)
  },

  planParticipantServices: forwardTo('db'),
  planParticipantService: forwardTo('db'),
  planParticipantServicesConnection: forwardTo('db'),

  planParticipantServiceTypes: forwardTo('db'),
  planParticipantServiceType: forwardTo('db'),
  planParticipantServiceTypesConnection: forwardTo('db'),

  planParticipantTypes: forwardTo('db'),
  planParticipantType: forwardTo('db'),
  planParticipantTypesConnection: forwardTo('db'),

  planParticipantCommandAgencies: forwardTo('db'),
  planParticipantCommandAgency: forwardTo('db'),
  planParticipantCommandAgenciesConnection: forwardTo('db'),

  planInjectOwners: forwardTo('db'),
  planInjectOwner: forwardTo('db'),
  planInjectOwnersConnection: forwardTo('db'),

  mediaServices(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaService.findMany(mediaServiceArgsFromPrisma1(args))
    }

    return ctx.db.query.mediaServices(args, info)
  },
  mediaService(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaService.findFirst({
        where: mediaServiceWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.mediaService(args, info)
  },
  async mediaServicesConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = mediaServiceArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.mediaService.findMany(prismaArgs),
        ctx.prisma.mediaService.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items, count)
    }

    return ctx.db.query.mediaServicesConnection(args, info)
  },

  mediaFiles: forwardTo('db'),
  mediaFilesConnection: forwardTo('db'),

  noteBooks: forwardTo('db'),
  noteBook: forwardTo('db'),
  noteBooksConnection: forwardTo('db'),

  noteSections: forwardTo('db'),
  noteSectionsConnection: forwardTo('db'),

  notePages: forwardTo('db'),
  notePage: forwardTo('db'),
  notePagesConnection: forwardTo('db'),

  noteFolders: forwardTo('db'),
  noteFolder: forwardTo('db'),
  noteFoldersConnection: forwardTo('db'),

  noteFiles: forwardTo('db'),
  noteFile: forwardTo('db'),
  noteFilesConnection: forwardTo('db'),

  async currentUserWorkspaces(parent, args, ctx, info) {
    let userId = await getCurrentUserId(ctx)
    if (userId) {
      if (ctx.prisma) {
        const workspaces = await ctx.prisma.appWorkspace.findMany({
          ...appWorkspaceArgsFromPrisma1({
            ...args,
            where: {
              ...args.where,
              members_some: {
                id: userId
              }
            }
          })
        })
        return workspaces.map(toAppWorkspace)
      }

      args.where = {
        ...args.where,
        members_some: {
          id: userId
        }
      }
      // add return obj so members(type User) data is returned
      let returnData = `{
                      id
                      name
                      displayName
                      timeZone
                      status
                      updatedAt
                      createdAt
                      }`
      return await ctx.db.query.appWorkspaces(args, returnData)

    }
  },
  async getWorkspaceMembers(parent, args, ctx, info) {
    let userId = await getCurrentUserId(ctx)
    if (userId) {
      if (ctx.prisma) {
        const workspaces = await ctx.prisma.appWorkspace.findMany({
          ...appWorkspaceArgsFromPrisma1({
            ...args,
            where: {
              ...args.where,
              members_some: {
                id: userId
              }
            }
          }),
          include: {
            User: {
              where: userWhereFromPrisma1(args.members_where),
              orderBy: orderByFromPrisma1(args.members_orderBy),
              skip: args.members_skip,
              take: args.members_first,
              include: {
                AppUserRole: {
                  include: {
                    AppRole: true,
                    User: true
                  }
                }
              }
            }
          }
        })
        return workspaces.map(toAppWorkspace)
      }

      args.where = {
        ...args.where,
        members_some: {
          id: userId
        }
      }
      //use this method to add fragments or pass variables to other parts of query
      const returnData = `fragment WorkspaceQueryFields on AppWorkspaceMembers {
        id
        name
        displayName
        timeZone
        members(where: $members_where, first: $members_first, skip: $members_skip, orderBy: $members_orderBy) 
        { id
          name
          email
          isSuper
          inviteAccepted
          emailConfirmed
          lastLogin
          joinedAt
          deletedAt
          role {
            id
            user { id name email }
            roles { id name displayName  }
          } 
        }
        status
        updatedAt
        createdAt
      }`
      return await ctx.db.query.appWorkspaces(args, addFragmentToInfo(info, returnData))
    }
  },
  async mediaPostWithComments(parent, args, ctx, info){
    const returnData = `fragment PostFieldsCommentsWhere on MediaPostWithCommentsFiltered {
      id createdAt updatedAt createTime
      isPublished publishTime title
      text
      mediaFile { id name createTime createdAt updateTime updatedAt contentType url }
      url
      isUserGenerated
      parent { 
        id createdAt updatedAt createTime 
        isPublished publishTime title text mediaFile { 
          id name createTime createdAt 
          updateTime updatedAt contentType url 
        }
        url
        isUserGenerated
        profiles { id
          service { id name displayName type description icon color template }
          username
          name
          description
          banner { id mediaFile { id name createTime createdAt updateTime updatedAt contentType url } }
          avatar { id name createTime createdAt updateTime updatedAt contentType url }
          location { id geojson geohash }
          url
          createdTime
          isUserGenerated
          language
          counts
        }
        location { id geojson geohash }
        comments(orderBy: updatedAt_ASC) { id }
        counts
      }
      profiles { id
        service { id name displayName type description icon color template }
        username
        name
        description
        banner { id mediaFile { id name createTime createdAt updateTime updatedAt contentType url } }
        avatar { id name createTime createdAt updateTime updatedAt contentType url }
        location { id geojson geohash }
        url
        createdTime
        isUserGenerated
        language
        counts
      }
      location { id geojson geohash }
      comments(where: $comments_where, first: $comments_first, skip: $comments_skip, orderBy: $comments_orderBy) { id
        createdAt updatedAt createTime
        isPublished publishTime
        title text
        parent { id createdAt updatedAt createTime 
          isPublished publishTime title text mediaFile { 
            id name createTime createdAt 
            updateTime updatedAt contentType url 
          }
          url
          isUserGenerated
          profiles { id
            service { id name displayName type description icon color template }
            username
            name
            description
            banner { id mediaFile { id name createTime createdAt updateTime updatedAt contentType url } }
            avatar { id name createTime createdAt updateTime updatedAt contentType url }
            location { id geojson geohash }
            url
            createdTime
            isUserGenerated
            language
            counts
          }
          location { id geojson geohash }
          comments(orderBy: updatedAt_ASC) { id }
          counts }
        mediaFile { id name createTime createdAt updateTime updatedAt contentType url }
        url
        isUserGenerated
        profiles { id
          service { id name displayName type description icon color template }
          username
          name
          description
          banner { id mediaFile { id name createTime createdAt updateTime updatedAt contentType url } }
          avatar { id name createTime createdAt updateTime updatedAt contentType url }
          location { id geojson geohash }
          url
          createdTime
          isUserGenerated
          language
          counts }
          location { id geojson geohash }
        counts}
      counts
    }`
    return await ctx.db.query.mediaPosts(args, addFragmentToInfo(info, returnData))
  },
  async appWorkspaces(parent, args, ctx, info) {
    let user = await getCurrentUser(ctx)
    if (user) {
      if (ctx.prisma) {
        let prismaArgs = args
        if (!user.isSuper) {
          prismaArgs = {
            where: {
              members_some: {
                id: user.id
              }
            }
          }
        }

        const workspaces = await ctx.prisma.appWorkspace.findMany({
          ...appWorkspaceArgsFromPrisma1(prismaArgs),
          include: {
            User: true
          }
        })
        return workspaces.map(toAppWorkspace)
      }

      // Return workspaces Admin belongs to
      if (!user.isSuper) {
        args = {
          where: {
            members_some: {
              id: user.id
            }
          }
        }
      }
      // If super user return all workspaces
      return ctx.db.query.appWorkspaces(args, info)
    }
  },
  async appWorkspace(parent, args, ctx, info) {
    if (ctx.prisma) {
      const workspace = await ctx.prisma.appWorkspace.findFirst({
        where: appWorkspaceWhereFromPrisma1(args.where),
        include: {
          User: true
        }
      })
      return toAppWorkspace(workspace)
    }

    return ctx.db.query.appWorkspace(args, info)
  },
  async appWorkspacesConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = appWorkspaceArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.appWorkspace.findMany(prismaArgs),
        ctx.prisma.appWorkspace.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toAppWorkspace), count)
    }

    return ctx.db.query.appWorkspacesConnection(args, info)
  },

  mediaNoiseLevel(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNoiseLevel.findFirst({
        where: mediaNoiseLevelWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.mediaNoiseLevel(args, info)
  },
  mediaNoiseLevels(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNoiseLevel.findMany(mediaNoiseLevelArgsFromPrisma1(args))
    }

    return ctx.db.query.mediaNoiseLevels(args, info)
  },
  async mediaNoiseLevelsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = mediaNoiseLevelArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.mediaNoiseLevel.findMany(prismaArgs),
        ctx.prisma.mediaNoiseLevel.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items, count)
    }

    return ctx.db.query.mediaNoiseLevelsConnection(args, info)
  },
  mapInts: forwardTo('db'),
  mediaMarkovSources: forwardTo('db'),

  planLabel: forwardTo('db'),
  planLabels: forwardTo('db'),
  planLabelsConnection: forwardTo('db'),

  async planEvent(parent, args, ctx, info) {
    if (ctx.prisma) {
      const event = await ctx.prisma.planEvent.findFirst({
        where: planEventWhereFromPrisma1(args.where),
        include: planEventInclude
      })
      return toPlanEvent(event)
    }

    return ctx.db.query.planEvent(args, info)
  },
  async planEvents(parent, args, ctx, info) {
    if (ctx.prisma) {
      const events = await ctx.prisma.planEvent.findMany({
        ...planEventArgsFromPrisma1(args),
        include: planEventInclude
      })
      return events.map(toPlanEvent)
    }

    return ctx.db.query.planEvents(args, info)
  },
  async planEventsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = planEventArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.planEvent.findMany({
          ...prismaArgs,
          include: planEventInclude
        }),
        ctx.prisma.planEvent.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toPlanEvent), count)
    }

    return ctx.db.query.planEventsConnection(args, info)
  },

  async planInject(parent, args, ctx, info) {
    if (ctx.prisma) {
      const inject = await ctx.prisma.planInject.findFirst({
        where: planInjectWhereFromPrisma1(args.where),
        include: planInjectInclude
      })
      return toPlanInjectSlim(inject)
    }

    return ctx.db.query.planInject(args, info)
  },
  async planInjects(parent, args, ctx, info) {
    args.where = {
      ...args.where,
      deletedAt: null
    }

    if (ctx.prisma) {
      const injects = await ctx.prisma.planInject.findMany({
        ...planInjectArgsFromPrisma1(args),
        include: planInjectInclude
      })
      return injects.map(toPlanInjectSlim)
    }

    return ctx.db.query.planInjects(args, info)
  },
  async planInjectsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = planInjectArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.planInject.findMany({
          ...prismaArgs,
          include: planInjectInclude
        }),
        ctx.prisma.planInject.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toPlanInjectSlim), count)
    }

    return ctx.db.query.planInjectsConnection(args, info)
  },

  planMethod(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planMethod.findFirst({
        where: planMethodWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.planMethod(args, info)
  },
  planMethods(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planMethod.findMany(planMethodArgsFromPrisma1(args))
    }

    return ctx.db.query.planMethods(args, info)
  },
  async planMethodsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = planMethodArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.planMethod.findMany(prismaArgs),
        ctx.prisma.planMethod.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items, count)
    }

    return ctx.db.query.planMethodsConnection(args, info)
  },

  planCustomReport: forwardTo('db'),
  planCustomReports: forwardTo('db'),
  planCustomReportsConnection: forwardTo('db'),

  planEvaluations: forwardTo('db'),

  planFeedbackRequest: forwardTo('db'),
  planFeedbackRequests: forwardTo('db'),
  planFeedbackRequestsConnection: forwardTo('db'),

  planFundingSource(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planFundingSource.findFirst({
        where: planFundingSourceWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.planFundingSource(args, info)
  },
  planFundingSources(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planFundingSource.findMany(planFundingSourceArgsFromPrisma1(args))
    }

    return ctx.db.query.planFundingSources(args, info)
  },
  async planFundingSourcesConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = planFundingSourceArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.planFundingSource.findMany(prismaArgs),
        ctx.prisma.planFundingSource.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items, count)
    }

    return ctx.db.query.planFundingSourcesConnection(args, info)
  },

  async planMeeting(parent, args, ctx, info) {
    if (ctx.prisma) {
      const meeting = await ctx.prisma.planMeeting.findFirst({
        where: planMeetingWhereFromPrisma1(args.where)
      })
      return toPlanMeeting(meeting)
    }

    return ctx.db.query.planMeeting(args, info)
  },
  async planMeetings(parent, args, ctx, info) {
    if (ctx.prisma) {
      const meetings = await ctx.prisma.planMeeting.findMany(planMeetingArgsFromPrisma1(args))
      return meetings.map(toPlanMeeting)
    }

    return ctx.db.query.planMeetings(args, info)
  },
  async planMeetingsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = planMeetingArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.planMeeting.findMany(prismaArgs),
        ctx.prisma.planMeeting.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toPlanMeeting), count)
    }

    return ctx.db.query.planMeetingsConnection(args, info)
  },

  planExerciseObjective: forwardTo('db'),
  planExerciseObjectives: forwardTo('db'),
  planExerciseObjectivesConnection: forwardTo('db'),

  planLabelGroup: forwardTo('db'),
  planLabelGroups: forwardTo('db'),
  planLabelGroupsConnection: forwardTo('db'),

  planParticipant: forwardTo('db'),
  planParticipants: forwardTo('db'),
  planParticipantsConnection: forwardTo('db'),

  planTrainingObjective: forwardTo('db'),
  planTrainingObjectives: forwardTo('db'),
  planTrainingObjectivesConnection: forwardTo('db'),

  planAccreditedTask: forwardTo('db'),
  planAccreditedTasks: forwardTo('db'),
  planAccreditedTasksConnection: forwardTo('db'),

  planCommandPriority: forwardTo('db'),
  planCommandPriorities: forwardTo('db'),
  planCommandPrioritiesConnection: forwardTo('db'),

  planJmet: forwardTo('db'),
  planJmets: forwardTo('db'),
  planJmetsConnection: forwardTo('db'),

  planOrganization: forwardTo('db'),
  planOrganizations: forwardTo('db'),
  planOrganizationsConnection: forwardTo('db'),

  planPriorityLevel(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planPriorityLevel.findFirst({
        where: planPriorityLevelWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.planPriorityLevel(args, info)
  },
  planPriorityLevels(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planPriorityLevel.findMany(planPriorityLevelArgsFromPrisma1(args))
    }

    return ctx.db.query.planPriorityLevels(args, info)
  },
  async planPriorityLevelsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = planPriorityLevelArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.planPriorityLevel.findMany(prismaArgs),
        ctx.prisma.planPriorityLevel.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items, count)
    }

    return ctx.db.query.planPriorityLevelsConnection(args, info)
  },

  planRequestedMethodType: forwardTo('db'),
  planRequestedMethodTypes: forwardTo('db'),
  planRequestedMethodTypesConnection: forwardTo('db'),

  planTrainedMethodType: forwardTo('db'),
  planTrainedMethodTypes: forwardTo('db'),
  planTrainedMethodTypesConnection: forwardTo('db'),


  observePost: forwardTo('db'),
  observePosts: forwardTo('db'),
  observePostsConnection: forwardTo('db'),

  activityStream: forwardTo('db'),
  activityStreams: forwardTo('db'),
  activityStreamsConnection: forwardTo('db'),

  async chatMessage(parent, args, ctx, info) {
    if (ctx.prisma) {
      const message = await ctx.prisma.chatMessage.findFirst({
        where: chatMessageWhereFromPrisma1(args.where),
        include: {
          ChatRoom: true
        }
      })
      return toChatMessage(message)
    }

    return ctx.db.query.chatMessage(args, info)
  },
  async chatMessages(parent, args, ctx, info) {
    if (ctx.prisma) {
      const messages = await ctx.prisma.chatMessage.findMany({
        ...chatMessageArgsFromPrisma1(args),
        include: {
          ChatRoom: true
        }
      })
      return messages.map(toChatMessage)
    }

    return ctx.db.query.chatMessages(args, info)
  },
  async chatMessagesConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = chatMessageArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.chatMessage.findMany({
          ...prismaArgs,
          include: {
            ChatRoom: true
          }
        }),
        ctx.prisma.chatMessage.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toChatMessage), count)
    }

    return ctx.db.query.chatMessagesConnection(args, info)
  },

  async chatRoom(parent, args, ctx, info) {
    if (ctx.prisma) {
      const room = await ctx.prisma.chatRoom.findFirst({
        where: chatRoomWhereFromPrisma1(args.where),
        include: {
          ChatMessage: {
            include: {
              ChatRoom: true
            }
          }
        }
      })
      return toChatRoom(room)
    }

    return ctx.db.query.chatRoom(args, info)
  },
  async chatRooms(parent, args, ctx, info) {
    if (ctx.prisma) {
      const rooms = await ctx.prisma.chatRoom.findMany({
        ...chatRoomArgsFromPrisma1(args),
        include: {
          ChatMessage: {
            include: {
              ChatRoom: true
            }
          }
        }
      })
      return rooms.map(toChatRoom)
    }

    return ctx.db.query.chatRooms(args, info)
  },
  async chatRoomsConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = chatRoomArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.chatRoom.findMany({
          ...prismaArgs,
          include: {
            ChatMessage: {
              include: {
                ChatRoom: true
              }
            }
          }
        }),
        ctx.prisma.chatRoom.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toChatRoom), count)
    }

    return ctx.db.query.chatRoomsConnection(args, info)
  },

  async emailMessage(parent, args, ctx, info) {
    if (ctx.prisma) {
      const message = await ctx.prisma.emailMessage.findFirst({
        where: emailMessageWhereFromPrisma1(args.where),
        include: {
          EmailMailbox: true,
          MediaFile: true
        }
      })
      return toEmailMessage(message)
    }

    return ctx.db.query.emailMessage(args, info)
  },
  async emailMessagesConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = emailMessageArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.emailMessage.findMany({
          ...prismaArgs,
          include: {
            EmailMailbox: true,
            MediaFile: true
          }
        }),
        ctx.prisma.emailMessage.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toEmailMessage), count)
    }

    return ctx.db.query.emailMessagesConnection(args, info)
  },

  async emailMailbox(parent, args, ctx, info) {
    if (ctx.prisma) {
      const mailbox = await ctx.prisma.emailMailbox.findFirst({
        where: emailMailboxWhereFromPrisma1(args.where),
        include: {
          EmailMessage: {
            include: {
              EmailMailbox: true,
              MediaFile: true
            }
          }
        }
      })
      return toEmailMailbox(mailbox)
    }

    return ctx.db.query.emailMailbox(args, info)
  },
  async emailMailboxes(parent, args, ctx, info) {
    if (ctx.prisma) {
      const mailboxes = await ctx.prisma.emailMailbox.findMany({
        ...emailMailboxArgsFromPrisma1(args),
        include: {
          EmailMessage: {
            include: {
              EmailMailbox: true,
              MediaFile: true
            }
          }
        }
      })
      return mailboxes.map(toEmailMailbox)
    }

    return ctx.db.query.emailMailboxes(args, info)
  },
  async emailMailboxesConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = emailMailboxArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.emailMailbox.findMany({
          ...prismaArgs,
          include: {
            EmailMessage: {
              include: {
                EmailMailbox: true,
                MediaFile: true
              }
            }
          }
        }),
        ctx.prisma.emailMailbox.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items.map(toEmailMailbox), count)
    }

    return ctx.db.query.emailMailboxesConnection(args, info)
  },

  planParticipantFundingSource: forwardTo('db'),
  planParticipantFundingSources: forwardTo('db'),
  planParticipantFundingSourcesConnection: forwardTo('db'),

  planParticipantPlanner: forwardTo('db'),
  planParticipantPlanners: forwardTo('db'),
  planParticipantPlannersConnection: forwardTo('db'),

  planPlatforms: forwardTo('db'),
  planPlatform: forwardTo('db'),
  planPlatformsConnection: forwardTo('db'),

  planParticipantPlatform: forwardTo('db'),
  planParticipantPlatforms: forwardTo('db'),
  planParticipantPlatformsConnection: forwardTo('db'),

  planJointStaffTrainingPriority: forwardTo('db'),
  planJointStaffTrainingPriorities: forwardTo('db'),
  planJointStaffTrainingPrioritiesConnection: forwardTo('db'),

  planAssessment: forwardTo('db'),
  planAssessments: forwardTo('db'),
  planAssessmentsConnection: forwardTo('db'),

  planFeedback: forwardTo('db'),
  planFeedbacks: forwardTo('db'),
  planFeedbacksConnection: forwardTo('db'),

  async planFeedbacksPublic(parent, args, ctx, info) {
    if (args.data && args.data.feedback) {
      args = { where: args.data.feedback }
    }
    if (ctx.prisma) {
      return ctx.prisma.planFeedback.findMany(passthroughArgsFromPrisma1(args))
    }

    return ctx.db.query.planFeedbacks(args, info)
  },

  planLessonsLearned: forwardTo('db'),
  planLessonsLearneds: forwardTo('db'),
  planLessonsLearnedsConnection: forwardTo('db'),

  planMetric: forwardTo('db'),
  planMetrics: forwardTo('db'),
  planMetricsConnection: forwardTo('db'),

  planFeedbackQualification: forwardTo('db'),
  planFeedbackQualifications: forwardTo('db'),
  planFeedbackQualificationsConnection: forwardTo('db'),

  planFeedbackTask: forwardTo('db'),
  planFeedbackTasks: forwardTo('db'),
  planFeedbackTasksConnection: forwardTo('db'),

  planMissionTask: forwardTo('db'),
  planMissionTasks: forwardTo('db'),
  planMissionTasksConnection: forwardTo('db'),

  async planMissionTasksPublic(parent, args, ctx, info) {
    if (args.data && args.data.planMissionTask) {
      args = { where: args.data.planMissionTask }
    }
    if (ctx.prisma) {
      return ctx.prisma.planMissionTask.findMany(passthroughArgsFromPrisma1(args))
    }

    return ctx.db.query.planMissionTasks(args, info)
  },

  planQualification: forwardTo('db'),
  planQualifications: forwardTo('db'),
  planQualificationsConnection: forwardTo('db'),

  async planQualificationsPublic(parent, args, ctx, info) {
    if (args.data && args.data.planQualification) {
      args = { where: args.data.planQualification }
    }
    if (ctx.prisma) {
      return ctx.prisma.planQualification.findMany(passthroughArgsFromPrisma1(args))
    }

    return ctx.db.query.planQualifications(args, info)
  },

  planMeasure: forwardTo('db'),
  planMeasures: forwardTo('db'),
  planMeasuresConnection: forwardTo('db'),

  planMeasureData: forwardTo('db'),
  planMeasureDatas: forwardTo('db'),
  planMeasureDatasConnection: forwardTo('db'),

  async mapLayers(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mapLayer.findMany(mapLayerArgsFromPrisma1(args))
    }

    return ctx.db.query.mapLayers(args, info)
  },
  async mapLayer(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mapLayer.findFirst({
        where: mapLayerWhereFromPrisma1(args.where)
      })
    }

    return ctx.db.query.mapLayer(args, info)
  },
  async mapLayersConnection(parent, args, ctx, info) {
    if (ctx.prisma) {
      const prismaArgs = mapLayerArgsFromPrisma1(args)
      const [items, count] = await Promise.all([
        ctx.prisma.mapLayer.findMany(prismaArgs),
        ctx.prisma.mapLayer.count({ where: prismaArgs.where })
      ])
      return connectionFromPrismaResults(items, count)
    }

    return ctx.db.query.mapLayersConnection(args, info)
  },
}

Object.assign(Query,
  prismaModelListResolvers({
    model: 'activityStream',
    manyField: 'activityStreams',
    connectionField: 'activityStreamsConnection'
  }),
  prismaModelListResolvers({
    model: 'mapInt',
    manyField: 'mapInts'
  }),
  prismaModelListResolvers({
    model: 'mediaMarkovSource',
    manyField: 'mediaMarkovSources'
  }),
  prismaModelListResolvers({
    model: 'mediaFile',
    manyField: 'mediaFiles',
    connectionField: 'mediaFilesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'noteBook',
    field: 'noteBook',
    manyField: 'noteBooks',
    connectionField: 'noteBooksConnection'
  }),
  prismaModelListResolvers({
    model: 'noteSection',
    manyField: 'noteSections',
    connectionField: 'noteSectionsConnection'
  }),
  prismaModelListResolvers({
    model: 'notePage',
    manyField: 'notePages',
    connectionField: 'notePagesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'noteFolder',
    field: 'noteFolder',
    manyField: 'noteFolders',
    connectionField: 'noteFoldersConnection'
  }),
  prismaModelListResolvers({
    model: 'noteFile',
    manyField: 'noteFiles',
    connectionField: 'noteFilesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'observePost',
    field: 'observePost',
    manyField: 'observePosts',
    connectionField: 'observePostsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planParticipantService',
    field: 'planParticipantService',
    manyField: 'planParticipantServices',
    connectionField: 'planParticipantServicesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planParticipantServiceType',
    field: 'planParticipantServiceType',
    manyField: 'planParticipantServiceTypes',
    connectionField: 'planParticipantServiceTypesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planParticipantType',
    field: 'planParticipantType',
    manyField: 'planParticipantTypes',
    connectionField: 'planParticipantTypesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planParticipantCommandAgency',
    field: 'planParticipantCommandAgency',
    manyField: 'planParticipantCommandAgencies',
    connectionField: 'planParticipantCommandAgenciesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planInjectOwner',
    field: 'planInjectOwner',
    manyField: 'planInjectOwners',
    connectionField: 'planInjectOwnersConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planLabel',
    field: 'planLabel',
    manyField: 'planLabels',
    connectionField: 'planLabelsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planCustomReport',
    field: 'planCustomReport',
    manyField: 'planCustomReports',
    connectionField: 'planCustomReportsConnection'
  }),
  prismaModelListResolvers({
    model: 'planEvaluation',
    manyField: 'planEvaluations'
  }),
  prismaModelQueryResolvers({
    model: 'planFeedbackRequest',
    field: 'planFeedbackRequest',
    manyField: 'planFeedbackRequests',
    connectionField: 'planFeedbackRequestsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planExerciseObjective',
    field: 'planExerciseObjective',
    manyField: 'planExerciseObjectives',
    connectionField: 'planExerciseObjectivesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planLabelGroup',
    field: 'planLabelGroup',
    manyField: 'planLabelGroups',
    connectionField: 'planLabelGroupsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planParticipant',
    field: 'planParticipant',
    manyField: 'planParticipants',
    connectionField: 'planParticipantsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planTrainingObjective',
    field: 'planTrainingObjective',
    manyField: 'planTrainingObjectives',
    connectionField: 'planTrainingObjectivesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planAccreditedTask',
    field: 'planAccreditedTask',
    manyField: 'planAccreditedTasks',
    connectionField: 'planAccreditedTasksConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planCommandPriority',
    field: 'planCommandPriority',
    manyField: 'planCommandPriorities',
    connectionField: 'planCommandPrioritiesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planJmet',
    field: 'planJmet',
    manyField: 'planJmets',
    connectionField: 'planJmetsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planOrganization',
    field: 'planOrganization',
    manyField: 'planOrganizations',
    connectionField: 'planOrganizationsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planRequestedMethodType',
    field: 'planRequestedMethodType',
    manyField: 'planRequestedMethodTypes',
    connectionField: 'planRequestedMethodTypesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planTrainedMethodType',
    field: 'planTrainedMethodType',
    manyField: 'planTrainedMethodTypes',
    connectionField: 'planTrainedMethodTypesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planParticipantFundingSource',
    field: 'planParticipantFundingSource',
    manyField: 'planParticipantFundingSources',
    connectionField: 'planParticipantFundingSourcesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planParticipantPlanner',
    field: 'planParticipantPlanner',
    manyField: 'planParticipantPlanners',
    connectionField: 'planParticipantPlannersConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planPlatform',
    field: 'planPlatform',
    manyField: 'planPlatforms',
    connectionField: 'planPlatformsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planParticipantPlatform',
    field: 'planParticipantPlatform',
    manyField: 'planParticipantPlatforms',
    connectionField: 'planParticipantPlatformsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planJointStaffTrainingPriority',
    field: 'planJointStaffTrainingPriority',
    manyField: 'planJointStaffTrainingPriorities',
    connectionField: 'planJointStaffTrainingPrioritiesConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planAssessment',
    field: 'planAssessment',
    manyField: 'planAssessments',
    connectionField: 'planAssessmentsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planFeedback',
    field: 'planFeedback',
    manyField: 'planFeedbacks',
    connectionField: 'planFeedbacksConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planLessonsLearned',
    field: 'planLessonsLearned',
    manyField: 'planLessonsLearneds',
    connectionField: 'planLessonsLearnedsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planMetric',
    field: 'planMetric',
    manyField: 'planMetrics',
    connectionField: 'planMetricsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planFeedbackQualification',
    field: 'planFeedbackQualification',
    manyField: 'planFeedbackQualifications',
    connectionField: 'planFeedbackQualificationsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planFeedbackTask',
    field: 'planFeedbackTask',
    manyField: 'planFeedbackTasks',
    connectionField: 'planFeedbackTasksConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planMissionTask',
    field: 'planMissionTask',
    manyField: 'planMissionTasks',
    connectionField: 'planMissionTasksConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planQualification',
    field: 'planQualification',
    manyField: 'planQualifications',
    connectionField: 'planQualificationsConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planMeasure',
    field: 'planMeasure',
    manyField: 'planMeasures',
    connectionField: 'planMeasuresConnection'
  }),
  prismaModelQueryResolvers({
    model: 'planMeasureData',
    field: 'planMeasureData',
    manyField: 'planMeasureDatas',
    connectionField: 'planMeasureDatasConnection'
  })
)

module.exports = {
  Query
}
