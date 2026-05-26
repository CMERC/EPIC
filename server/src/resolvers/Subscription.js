/* eslint-disable space-before-function-paren */

const { getUserIdWebSocket } = require('../authSubscription')
const resolverArgs = require('./arguments')

const Subscription = {
  appListSetting: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.appListSetting(args, info)
    }
  },
  mediaFeed: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.mediaPost(
        {
          where: {
            node: {
              isPublished: true
            }
          }
        },
        info
      )
    }
  },
  mediaPost: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.mediaPost(args, info)
    }
  },
  mediaProfile: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.mediaProfile(args, info)
    }
  },
  mediaNetwork: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.mediaNetwork(args, info)
    }
  },
  mediaPersona: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.mediaPersona(args, info)
    }
  },
  mediaService: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.mediaService(args, info)
    }
  },
  appWorkspace: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.appWorkspace(args, info)
    }
  },
  appRole: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.appRole(args, info)
    }
  },
  planLabel: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planLabel(args, info)
    }
  },
  planLabelGroup: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planLabelGroup(args, info)
    }
  },
  planInject: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planInject(args, info)
    }
  },
  planInjectsSearch: {
    subscribe: async (parent, args, ctx, info) => {
      args = resolverArgs.planInjectArgs(args)

      args = { node: { ...args } }

      return ctx.db.subscription.planInject(args, info)
    }
  },
  planEvent: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planEvent(args, info)
    }
  },
  noteBook: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.noteBook(args, info)
    }
  },
  notePage: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.notePage(args, info)
    }
  },
  noteFolder: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.noteFolder(args, info)
    }
  },
  noteFile: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.noteFile(args, info)
    }
  },
  mapLayer: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.mapLayer(args, info)
    }
  },
  planParticipant: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planParticipant(args, info)
    }
  },
  planAccreditedTask: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planAccreditedTask(args, info)
    }
  },
  planExerciseObjective: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planExerciseObjective(args, info)
    }
  },
  planMeeting: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planMeeting(args, info)
    }
  },
  planFundingSource: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planFundingSource(args, info)
    }
  },
  planCommandPriority: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planCommandPriority(args, info)
    }
  },
  planInjectOwner: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planInjectOwner(args, info)
    }
  },
  planTrainingObjective: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planTrainingObjective(args, info)
    }
  },
  planJmet: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planJmet(args, info)
    }
  },
  planMethod: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planMethod(args, info)
    }
  },
  planReason: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planReason(args, info)
    }
  },
  planCustomReport: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planCustomReport(args, info)
    }
  },
  planFeedbackRequest: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planFeedbackRequest(args, info)
    }
  },
  planParticipantService: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planParticipantService(args, info)
    }
  },
  planParticipantServiceType: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planParticipantServiceType(args, info)
    }
  },
  planParticipantType: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planParticipantType(args, info)
    }
  },
  planParticipantCommandAgency: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planParticipantCommandAgency(args, info)
    }
  },
  planAssessment: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planAssessment(args, info)
    }
  },
  planFeedback: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planFeedback(args, info)
    }
  },
  planLessonsLearned: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planLessonsLearned(args, info)
    }
  },
  planMetric: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planMetric(args, info)
    }
  },
  planFeedbackQualification: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planFeedbackQualification(args, info)
    }
  },
  planFeedbackTask: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planFeedbackTask(args, info)
    }
  },
  planMissionTask: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planMissionTask(args, info)
    }
  },
  planQualification: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planQualification(args, info)
    }
  },
  planMeasure: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planMeasure(args, info)
    }
  },
  planMeasureData: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planMeasureData(args, info)
    }
  },
  observePost: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.observePost(args, info)
    }
  },
  activityStream: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.activityStream(args, info)
    }
  },
  chatMessage: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.chatMessage(args, info)
    }
  },
  chatRoom: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.chatRoom(args, info)
    }
  },
  emailMessage: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.emailMessage(args, info)
    }
  },
  emailMailbox: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.emailMailbox(args, info)
    }
  },
  planParticipantFundingSource: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planParticipantFundingSource(args, info)
    }
  },
  planParticipantPlanner: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planParticipantPlanner(args, info)
    }
  },
  planPlatform: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planPlatform(args, info)
    }
  },
  planParticipantPlatform: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planParticipantPlatform(args, info)
    }
  },
  planPriorityLevel: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planPriorityLevel(args, info)
    }
  },
  planRequestedMethodType: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planRequestedMethodType(args, info)
    }
  },
  planTrainedMethodType: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planTrainedMethodType(args, info)
    }
  },
  planOrganization: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planOrganization(args, info)
    }
  },
  planJointStaffTrainingPriority: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.planJointStaffTrainingPriority(args, info)
    }
  },
  currentUserWorkspace: {
    subscribe: async (parent, args, ctx, info) => {
      const userId = await getUserIdWebSocket(ctx)
      return ctx.db.subscription.appWorkspace(
        {
          where: {
            node: {
              members_some: {
                id: userId
              }
            }
          }
        },
        info)
    }
  },
  appWorkspacePub: {
    subscribe: async (parent, args, ctx, info) => {
      return ctx.db.subscription.appWorkspace(args, info)
    }
  },
}

module.exports = {
  Subscription
}
