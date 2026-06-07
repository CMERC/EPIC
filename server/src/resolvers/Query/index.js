const { forwardTo } = require('prisma-binding')
const { addFragmentToInfo } = require('graphql-binding')
const { getUserId, getUser } = require('graphql-authentication')
const {
  appListSettingArgsFromPrisma1,
  appListSettingWhereFromPrisma1,
  appRoleArgsFromPrisma1,
  appRoleWhereFromPrisma1,
  appUserRoleArgsFromPrisma1,
  appWorkspaceArgsFromPrisma1,
  appWorkspaceWhereFromPrisma1,
  connectionFromPrismaResults,
  emailMailboxArgsFromPrisma1,
  emailMailboxWhereFromPrisma1,
  emailMessageArgsFromPrisma1,
  emailMessageWhereFromPrisma1,
  orderByFromPrisma1,
  toAppRole,
  toAppUserRole,
  toAppUser,
  toAppWorkspace,
  toEmailMailbox,
  toEmailMessage,
  userWhereFromPrisma1
} = require('../../services/prismaBridge')

const tokenize = require('../../search-tokenize')
const resolverArgs = require('../arguments')
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
  planInjectsSearch(parent, args, ctx, info) {
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
  planInjectsSearchCount(parent, args, ctx, info) {
    args = resolverArgs.planInjectArgs(args)
    return ctx.db.query.planInjectsConnection(args, info)
  },
  mediaSearchPublic(parent, args, ctx, info) {

    if (args.data.siteType) {
      args.data.service = {
        ...args.data.service,
        type: args.data.siteType
      }
    }

    let content_filter
    if (args.data.contentType) {
      content_filter = { mediaFile: { contentType_starts_with: args.data.contentType } }
    }

    let searchQuery = args.data.query
    let tokens = tokenize(searchQuery)

    let list_terms = {}
    tokens.forEach(token => {
      let term = token.term

      if (token.exclude) {
        list_terms.NOT = list_terms.NOT ? list_terms.NOT : []
        list_terms.NOT.push({ OR: [{ text_contains: term }, { title_contains: term }] })
      }
      else if (token.either) {
        list_terms.OR = list_terms.OR ? list_terms.OR : []
        list_terms.OR.push({ OR: [{ text_contains: term }, { title_contains: term }] })
      }
      else {
        list_terms.AND = list_terms.AND ? list_terms.AND : []
        list_terms.AND.push({ OR: [{ text_contains: term }, { title_contains: term }] })
      }
    })



    args = {
      ...args,
      where: {
        isPublished: true,
        profiles_some: {
          service: {
            ...args.data.service
          }
        },
        ...content_filter,
        ...list_terms
      }
    }

    return ctx.db.query.mediaPosts(args, info)
  },
  mediaFeeds(parent, args, ctx, info) {
    // Only show {where: {isPublished: true}}
    args.where = { ...args.where, isPublished: true }
    return ctx.db.query.mediaPosts(args, info)
  },
  mediaServicePublic(parent, args, ctx, info) {
    if (args.data && args.data.service) {
      args = { where: args.data.service }
    }
    return ctx.db.query.mediaService(args, info)
  },
  mediaPostsPublic(parent, args, ctx, info) {
    if (args.data && args.data.post) {
      args = { where: args.data.post }
    } else {
      args.where = {}
    }

    // Only show published posts to the public
    args.where = Object.assign(args.where, {
      isPublished: true
    })
    return ctx.db.query.mediaPosts(args, info)
  },
  mediaPostsPublicConnection(parent, args, ctx, info) {
    if (args.data && args.data.post) {
      args = { where: args.data.post }
    }
    return ctx.db.query.mediaPostsConnection(args, info)
  },
  mediaPostPublic(parent, args, ctx, info) {
    if (args.data && args.data.post) {
      args = { where: args.data.post }
    }
    return ctx.db.query.mediaPost(args, info)
  },
  mediaProfilesPublic(parent, args, ctx, info) {
    if (args.data && args.data.profile) {
      args = { where: args.data.profile }
    }
    return ctx.db.query.mediaProfiles(args, info)
  },
  mediaProfilesPublicConnection(parent, args, ctx, info) {
    if (args.data && args.data.profile) {
      args = { where: args.data.profile }
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

  mediaNetwork: forwardTo('db'),
  mediaNetworks: forwardTo('db'),
  mediaNetworksConnection: forwardTo('db'),

  mediaPersonae: forwardTo('db'),
  mediaPersona: forwardTo('db'),
  mediaPersonaeConnection: forwardTo('db'),

  mediaPost: forwardTo('db'),
  mediaPosts: forwardTo('db'),
  mediaPostsConnection: forwardTo('db'),

  mediaProfiles: forwardTo('db'),
  mediaProfile: forwardTo('db'),
  mediaProfilesConnection: forwardTo('db'),

  planReasons: forwardTo('db'),
  planReason: forwardTo('db'),
  planReasonsConnection: forwardTo('db'),

  planReasonsPublic(parent, args, ctx, info) {
    if (args.data && args.data.planReason) {
      args = { where: args.data.planReason }
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

  mediaServices: forwardTo('db'),
  mediaService: forwardTo('db'),
  mediaServicesConnection: forwardTo('db'),

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
    let userId = await getUserId(ctx)
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
    let userId = await getUserId(ctx)
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
    let user = await getUser(ctx)
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

  mediaNoiseLevels: forwardTo('db'),
  mapInts: forwardTo('db'),
  mediaMarkovSources: forwardTo('db'),

  planLabel: forwardTo('db'),
  planLabels: forwardTo('db'),
  planLabelsConnection: forwardTo('db'),

  planEvent: forwardTo('db'),
  planEvents: forwardTo('db'),
  planEventsConnection: forwardTo('db'),

  planInject: forwardTo('db'),
  planInjects(parent, args, ctx, info) {
    args.where = {
      ...args.where,
      deletedAt: null
    }
    return ctx.db.query.planInjects(args, info)
  },
  planInjectsConnection: forwardTo('db'),

  planMethod: forwardTo('db'),
  planMethods: forwardTo('db'),
  planMethodsConnection: forwardTo('db'),

  planCustomReport: forwardTo('db'),
  planCustomReports: forwardTo('db'),
  planCustomReportsConnection: forwardTo('db'),

  planEvaluations: forwardTo('db'),

  planFeedbackRequest: forwardTo('db'),
  planFeedbackRequests: forwardTo('db'),
  planFeedbackRequestsConnection: forwardTo('db'),

  planFundingSource: forwardTo('db'),
  planFundingSources: forwardTo('db'),
  planFundingSourcesConnection: forwardTo('db'),

  planMeeting: forwardTo('db'),
  planMeetings: forwardTo('db'),
  planMeetingsConnection: forwardTo('db'),

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

  planPriorityLevel: forwardTo('db'),
  planPriorityLevels: forwardTo('db'),
  planPriorityLevelsConnection: forwardTo('db'),

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

  chatMessage: forwardTo('db'),
  chatMessages: forwardTo('db'),
  chatMessagesConnection: forwardTo('db'),

  chatRoom: forwardTo('db'),
  chatRooms: forwardTo('db'),
  chatRoomsConnection: forwardTo('db'),

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

  planFeedbacksPublic(parent, args, ctx, info) {
    if (args.data && args.data.feedback) {
      args = { where: args.data.feedback }
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

  planMissionTasksPublic(parent, args, ctx, info) {
    if (args.data && args.data.planMissionTask) {
      args = { where: args.data.planMissionTask }
    }
    return ctx.db.query.planMissionTasks(args, info)
  },

  planQualification: forwardTo('db'),
  planQualifications: forwardTo('db'),
  planQualificationsConnection: forwardTo('db'),

  planQualificationsPublic(parent, args, ctx, info) {
    if (args.data && args.data.planQualification) {
      args = { where: args.data.planQualification }
    }
    return ctx.db.query.planQualifications(args, info)
  },

  planMeasure: forwardTo('db'),
  planMeasures: forwardTo('db'),
  planMeasuresConnection: forwardTo('db'),

  planMeasureData: forwardTo('db'),
  planMeasureDatas: forwardTo('db'),
  planMeasureDatasConnection: forwardTo('db'),

  mapLayers: forwardTo('db'),
  mapLayer: forwardTo('db'),
  mapLayersConnection: forwardTo('db'),
}

module.exports = {
  Query
}
