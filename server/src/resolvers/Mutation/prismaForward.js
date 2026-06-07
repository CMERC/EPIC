const { forwardTo } = require('prisma-binding')
const {
  appListSettingDataFromPrisma1,
  appRoleDataFromPrisma1,
  chatMessageDataFromPrisma1,
  chatRoomDataFromPrisma1,
  emailMailboxDataFromPrisma1,
  emailMessageDataFromPrisma1,
  mediaNetworkDataFromPrisma1,
  mediaNoiseLevelDataFromPrisma1,
  mediaServiceDataFromPrisma1,
  planFundingSourceDataFromPrisma1,
  planMethodDataFromPrisma1,
  planPriorityLevelDataFromPrisma1,
  planReasonDataFromPrisma1,
  toAppRole,
  toAppUserRole,
  toChatMessage,
  toChatRoom,
  toEmailMailbox,
  toEmailMessage
} = require('../../services/prismaBridge')

const prismaForward = {

  async createAppListSetting(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.appListSetting.create({
        data: appListSettingDataFromPrisma1(args.data, { create: true })
      })
    }

    return ctx.db.mutation.createAppListSetting(args, info)
  },
  async updateAppListSetting(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.appListSetting.update({
        where: args.where,
        data: appListSettingDataFromPrisma1(args.data)
      })
    }

    return ctx.db.mutation.updateAppListSetting(args, info)
  },
  async upsertAppListSetting(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.appListSetting.upsert({
        where: args.where,
        create: appListSettingDataFromPrisma1(args.create, { create: true }),
        update: appListSettingDataFromPrisma1(args.update)
      })
    }

    return ctx.db.mutation.upsertAppListSetting(args, info)
  },
  async deleteAppListSetting(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.appListSetting.delete({
        where: args.where
      })
    }

    return ctx.db.mutation.deleteAppListSetting(args, info)
  },

  updateManyMediaPosts: forwardTo('db'),
  async deleteAppUserRole(parent, args, ctx, info) {
    if (ctx.prisma) {
      const role = await ctx.prisma.appUserRole.delete({
        where: args.where,
        include: {
          AppRole: true,
          User: true
        }
      })
      return toAppUserRole(role)
    }

    return ctx.db.mutation.deleteAppUserRole(args, info)
  },

  async createAppRole(parent, args, ctx, info) {
    if (ctx.prisma) {
      const role = await ctx.prisma.appRole.create({
        data: appRoleDataFromPrisma1(args.data, { create: true }),
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

    return ctx.db.mutation.createAppRole(args, info)
  },
  async upsertAppRole(parent, args, ctx, info) {
    if (ctx.prisma) {
      const role = await ctx.prisma.appRole.upsert({
        where: args.where,
        create: appRoleDataFromPrisma1(args.create, { create: true }),
        update: appRoleDataFromPrisma1(args.update),
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

    return ctx.db.mutation.upsertAppRole(args, info)
  },
  async updateAppRole(parent, args, ctx, info) {
    if (ctx.prisma) {
      const role = await ctx.prisma.appRole.update({
        where: args.where,
        data: appRoleDataFromPrisma1(args.data),
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

    return ctx.db.mutation.updateAppRole(args, info)
  },
  async deleteAppRole(parent, args, ctx, info) {
    if (ctx.prisma) {
      const role = await ctx.prisma.appRole.delete({
        where: args.where,
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

    return ctx.db.mutation.deleteAppRole(args, info)
  },

  async createMediaNetwork(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNetwork.create({
        data: mediaNetworkDataFromPrisma1(args.data, { create: true })
      })
    }

    return ctx.db.mutation.createMediaNetwork(args, info)
  },
  async updateMediaNetwork(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNetwork.update({
        where: args.where,
        data: mediaNetworkDataFromPrisma1(args.data)
      })
    }

    return ctx.db.mutation.updateMediaNetwork(args, info)
  },
  async deleteMediaNetwork(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNetwork.delete({
        where: args.where
      })
    }

    return ctx.db.mutation.deleteMediaNetwork(args, info)
  },

  createMediaPersona: forwardTo('db'),
  createMediaPersonaEdge: forwardTo('db'),
  updateMediaPersona: forwardTo('db'),
  upsertMediaPersona: forwardTo('db'),
  deleteMediaPersona: forwardTo('db'),
  deleteMediaPersonaEdge: forwardTo('db'),

  deleteMediaProfile: forwardTo('db'),

  deleteMediaPost: forwardTo('db'),

  async createMediaService(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaService.create({
        data: mediaServiceDataFromPrisma1(args.data, { create: true })
      })
    }

    return ctx.db.mutation.createMediaService(args, info)
  },
  async upsertMediaService(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaService.upsert({
        where: args.where,
        create: mediaServiceDataFromPrisma1(args.create, { create: true }),
        update: mediaServiceDataFromPrisma1(args.update)
      })
    }

    return ctx.db.mutation.upsertMediaService(args, info)
  },
  async deleteMediaService(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaService.delete({
        where: args.where
      })
    }

    return ctx.db.mutation.deleteMediaService(args, info)
  },

  createMediaFile: forwardTo('db'),
  deleteMediaFile: forwardTo('db'),
  updateMediaFile: forwardTo('db'),

  createNoteBook: forwardTo('db'),
  deleteNoteBook: forwardTo('db'),
  updateNoteBook: forwardTo('db'),

  createNoteSection: forwardTo('db'),
  deleteNoteSection: forwardTo('db'),
  updateNoteSection: forwardTo('db'),

  createNotePage: forwardTo('db'),
  deleteNotePage: forwardTo('db'),
  updateNotePage: forwardTo('db'),

  createNoteFolder: forwardTo('db'),
  deleteNoteFolder: forwardTo('db'),
  updateNoteFolder: forwardTo('db'),

  createNoteFile: forwardTo('db'),
  deleteNoteFile: forwardTo('db'),
  updateNoteFile: forwardTo('db'),

  async createMediaNoiseLevel(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNoiseLevel.create({
        data: mediaNoiseLevelDataFromPrisma1(args.data, { create: true })
      })
    }

    return ctx.db.mutation.createMediaNoiseLevel(args, info)
  },
  async deleteMediaNoiseLevel(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNoiseLevel.delete({
        where: args.where
      })
    }

    return ctx.db.mutation.deleteMediaNoiseLevel(args, info)
  },
  async updateMediaNoiseLevel(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.mediaNoiseLevel.update({
        where: args.where,
        data: mediaNoiseLevelDataFromPrisma1(args.data)
      })
    }

    return ctx.db.mutation.updateMediaNoiseLevel(args, info)
  },

  createMapInt: forwardTo('db'),
  updateMapInt: forwardTo('db'),
  createMediaMarkovSource: forwardTo('db'),
  deleteMediaMarkovSource: forwardTo('db'),

  createPlanLabel: forwardTo('db'),
  updatePlanLabel: forwardTo('db'),
  upsertPlanLabel: forwardTo('db'),
  deletePlanLabel: forwardTo('db'),

  async createPlanReason(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planReason.create({
        data: planReasonDataFromPrisma1(args.data, { create: true })
      })
    }

    return ctx.db.mutation.createPlanReason(args, info)
  },
  async updatePlanReason(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planReason.update({
        where: args.where,
        data: planReasonDataFromPrisma1(args.data)
      })
    }

    return ctx.db.mutation.updatePlanReason(args, info)
  },
  async upsertPlanReason(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planReason.upsert({
        where: args.where,
        create: planReasonDataFromPrisma1(args.create, { create: true }),
        update: planReasonDataFromPrisma1(args.update)
      })
    }

    return ctx.db.mutation.upsertPlanReason(args, info)
  },
  async deletePlanReason(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planReason.delete({
        where: args.where
      })
    }

    return ctx.db.mutation.deletePlanReason(args, info)
  },

  createPlanReasonPublic(parent, args, ctx, info) {
    if (args.data && args.data.planReason) {
      args = { data: args.data.planReason }
    }
    if (ctx.prisma) {
      return ctx.prisma.planReason.create({
        data: planReasonDataFromPrisma1(args.data, { create: true })
      })
    }

    return ctx.db.mutation.createPlanReason(args, info)
  },

  createPlanCustomReport: forwardTo('db'),
  updatePlanCustomReport: forwardTo('db'),
  upsertPlanCustomReport: forwardTo('db'),
  deletePlanCustomReport: forwardTo('db'),

  deletePlanEvaluation: forwardTo('db'),

  createPlanFeedbackRequest: forwardTo('db'),
  updatePlanFeedbackRequest: forwardTo('db'),
  upsertPlanFeedbackRequest: forwardTo('db'),
  deletePlanFeedbackRequest: forwardTo('db'),

  createPlanParticipantService: forwardTo('db'),
  updatePlanParticipantService: forwardTo('db'),
  upsertPlanParticipantService: forwardTo('db'),
  deletePlanParticipantService: forwardTo('db'),

  createPlanParticipantServiceType: forwardTo('db'),
  updatePlanParticipantServiceType: forwardTo('db'),
  upsertPlanParticipantServiceType: forwardTo('db'),
  deletePlanParticipantServiceType: forwardTo('db'),

  createPlanParticipantType: forwardTo('db'),
  updatePlanParticipantType: forwardTo('db'),
  upsertPlanParticipantType: forwardTo('db'),
  deletePlanParticipantType: forwardTo('db'),

  createPlanParticipantCommandAgency: forwardTo('db'),
  updatePlanParticipantCommandAgency: forwardTo('db'),
  upsertPlanParticipantCommandAgency: forwardTo('db'),
  deletePlanParticipantCommandAgency: forwardTo('db'),

  createPlanInjectOwner: forwardTo('db'),
  updatePlanInjectOwner: forwardTo('db'),
  upsertPlanInjectOwner: forwardTo('db'),
  deletePlanInjectOwner: forwardTo('db'),

  createPlanAssessment: forwardTo('db'),
  updatePlanAssessment: forwardTo('db'),
  upsertPlanAssessment: forwardTo('db'),
  deletePlanAssessment: forwardTo('db'),

  createPlanEvent: forwardTo('db'),
  updatePlanEvent: forwardTo('db'),
  upsertPlanEvent: forwardTo('db'),
  deletePlanEvent: forwardTo('db'),

  updatePlanInject: forwardTo('db'),
  upsertPlanInject: forwardTo('db'),

  async createPlanMethod(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planMethod.create({
        data: planMethodDataFromPrisma1(args.data, { create: true })
      })
    }

    return ctx.db.mutation.createPlanMethod(args, info)
  },
  async updatePlanMethod(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planMethod.update({
        where: args.where,
        data: planMethodDataFromPrisma1(args.data)
      })
    }

    return ctx.db.mutation.updatePlanMethod(args, info)
  },
  async upsertPlanMethod(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planMethod.upsert({
        where: args.where,
        create: planMethodDataFromPrisma1(args.create, { create: true }),
        update: planMethodDataFromPrisma1(args.update)
      })
    }

    return ctx.db.mutation.upsertPlanMethod(args, info)
  },
  async deletePlanMethod(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planMethod.delete({
        where: args.where
      })
    }

    return ctx.db.mutation.deletePlanMethod(args, info)
  },

  async createPlanFundingSource(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planFundingSource.create({
        data: planFundingSourceDataFromPrisma1(args.data, { create: true })
      })
    }

    return ctx.db.mutation.createPlanFundingSource(args, info)
  },
  async updatePlanFundingSource(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planFundingSource.update({
        where: args.where,
        data: planFundingSourceDataFromPrisma1(args.data)
      })
    }

    return ctx.db.mutation.updatePlanFundingSource(args, info)
  },
  async upsertPlanFundingSource(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planFundingSource.upsert({
        where: args.where,
        create: planFundingSourceDataFromPrisma1(args.create, { create: true }),
        update: planFundingSourceDataFromPrisma1(args.update)
      })
    }

    return ctx.db.mutation.upsertPlanFundingSource(args, info)
  },
  async deletePlanFundingSource(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planFundingSource.delete({
        where: args.where
      })
    }

    return ctx.db.mutation.deletePlanFundingSource(args, info)
  },

  async createPlanPriorityLevel(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planPriorityLevel.create({
        data: planPriorityLevelDataFromPrisma1(args.data, { create: true })
      })
    }

    return ctx.db.mutation.createPlanPriorityLevel(args, info)
  },
  async updatePlanPriorityLevel(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planPriorityLevel.update({
        where: args.where,
        data: planPriorityLevelDataFromPrisma1(args.data)
      })
    }

    return ctx.db.mutation.updatePlanPriorityLevel(args, info)
  },
  async upsertPlanPriorityLevel(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planPriorityLevel.upsert({
        where: args.where,
        create: planPriorityLevelDataFromPrisma1(args.create, { create: true }),
        update: planPriorityLevelDataFromPrisma1(args.update)
      })
    }

    return ctx.db.mutation.upsertPlanPriorityLevel(args, info)
  },
  async deletePlanPriorityLevel(parent, args, ctx, info) {
    if (ctx.prisma) {
      return ctx.prisma.planPriorityLevel.delete({
        where: args.where
      })
    }

    return ctx.db.mutation.deletePlanPriorityLevel(args, info)
  },

  createPlanRequestedMethodType: forwardTo('db'),
  updatePlanRequestedMethodType: forwardTo('db'),
  upsertPlanRequestedMethodType: forwardTo('db'),
  deletePlanRequestedMethodType: forwardTo('db'),

  createPlanTrainedMethodType: forwardTo('db'),
  updatePlanTrainedMethodType: forwardTo('db'),
  upsertPlanTrainedMethodType: forwardTo('db'),
  deletePlanTrainedMethodType: forwardTo('db'),


  createPlanMeeting: forwardTo('db'),
  updatePlanMeeting: forwardTo('db'),
  upsertPlanMeeting: forwardTo('db'),
  deletePlanMeeting: forwardTo('db'),

  createPlanExerciseObjective: forwardTo('db'),
  updatePlanExerciseObjective: forwardTo('db'),
  upsertPlanExerciseObjective: forwardTo('db'),
  deletePlanExerciseObjective: forwardTo('db'),

  createPlanLabelGroup: forwardTo('db'),
  updatePlanLabelGroup: forwardTo('db'),
  upsertPlanLabelGroup: forwardTo('db'),
  deletePlanLabelGroup: forwardTo('db'),

  createPlanParticipant: forwardTo('db'),
  updatePlanParticipant: forwardTo('db'),
  upsertPlanParticipant: forwardTo('db'),
  deletePlanParticipant: forwardTo('db'),

  createPlanTrainingObjective: forwardTo('db'),
  updatePlanTrainingObjective: forwardTo('db'),
  upsertPlanTrainingObjective: forwardTo('db'),
  deletePlanTrainingObjective: forwardTo('db'),

  createPlanAccreditedTask: forwardTo('db'),
  updatePlanAccreditedTask: forwardTo('db'),
  upsertPlanAccreditedTask: forwardTo('db'),
  deletePlanAccreditedTask: forwardTo('db'),

  createPlanCommandPriority: forwardTo('db'),
  updatePlanCommandPriority: forwardTo('db'),
  upsertPlanCommandPriority: forwardTo('db'),
  deletePlanCommandPriority: forwardTo('db'),

  createPlanJmet: forwardTo('db'),
  updatePlanJmet: forwardTo('db'),
  upsertPlanJmet: forwardTo('db'),
  deletePlanJmet: forwardTo('db'),

  createPlanOrganization: forwardTo('db'),
  updatePlanOrganization: forwardTo('db'),
  upsertPlanOrganization: forwardTo('db'),
  deletePlanOrganization: forwardTo('db'),

  createObservePost: forwardTo('db'),
  updateObservePost: forwardTo('db'),
  upsertObservePost: forwardTo('db'),
  deleteObservePost: forwardTo('db'),

  async createChatMessage(parent, args, ctx, info) {
    if (ctx.prisma) {
      const message = await ctx.prisma.chatMessage.create({
        data: chatMessageDataFromPrisma1(args.data, { create: true }),
        include: {
          ChatRoom: true
        }
      })
      return toChatMessage(message)
    }

    return ctx.db.mutation.createChatMessage(args, info)
  },
  async updateChatMessage(parent, args, ctx, info) {
    if (ctx.prisma) {
      const message = await ctx.prisma.chatMessage.update({
        where: args.where,
        data: chatMessageDataFromPrisma1(args.data),
        include: {
          ChatRoom: true
        }
      })
      return toChatMessage(message)
    }

    return ctx.db.mutation.updateChatMessage(args, info)
  },
  async upsertChatMessage(parent, args, ctx, info) {
    if (ctx.prisma) {
      const message = await ctx.prisma.chatMessage.upsert({
        where: args.where,
        create: chatMessageDataFromPrisma1(args.create, { create: true }),
        update: chatMessageDataFromPrisma1(args.update),
        include: {
          ChatRoom: true
        }
      })
      return toChatMessage(message)
    }

    return ctx.db.mutation.upsertChatMessage(args, info)
  },
  async deleteChatMessage(parent, args, ctx, info) {
    if (ctx.prisma) {
      const message = await ctx.prisma.chatMessage.delete({
        where: args.where,
        include: {
          ChatRoom: true
        }
      })
      return toChatMessage(message)
    }

    return ctx.db.mutation.deleteChatMessage(args, info)
  },

  async createChatRoom(parent, args, ctx, info) {
    if (ctx.prisma) {
      const room = await ctx.prisma.chatRoom.create({
        data: chatRoomDataFromPrisma1(args.data, { create: true }),
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

    return ctx.db.mutation.createChatRoom(args, info)
  },
  async updateChatRoom(parent, args, ctx, info) {
    if (ctx.prisma) {
      const room = await ctx.prisma.chatRoom.update({
        where: args.where,
        data: chatRoomDataFromPrisma1(args.data),
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

    return ctx.db.mutation.updateChatRoom(args, info)
  },
  async upsertChatRoom(parent, args, ctx, info) {
    if (ctx.prisma) {
      const room = await ctx.prisma.chatRoom.upsert({
        where: args.where,
        create: chatRoomDataFromPrisma1(args.create, { create: true }),
        update: chatRoomDataFromPrisma1(args.update),
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

    return ctx.db.mutation.upsertChatRoom(args, info)
  },
  async deleteChatRoom(parent, args, ctx, info) {
    if (ctx.prisma) {
      const room = await ctx.prisma.chatRoom.delete({
        where: args.where,
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

    return ctx.db.mutation.deleteChatRoom(args, info)
  },

  async updateEmailMessage(parent, args, ctx, info) {
    if (ctx.prisma) {
      const message = await ctx.prisma.emailMessage.update({
        where: args.where,
        data: emailMessageDataFromPrisma1(args.data),
        include: {
          EmailMailbox: true,
          MediaFile: true
        }
      })
      return toEmailMessage(message)
    }

    return ctx.db.mutation.updateEmailMessage(args, info)
  },
  async upsertEmailMessage(parent, args, ctx, info) {
    if (ctx.prisma) {
      const message = await ctx.prisma.emailMessage.upsert({
        where: args.where,
        create: emailMessageDataFromPrisma1(args.create, { create: true }),
        update: emailMessageDataFromPrisma1(args.update),
        include: {
          EmailMailbox: true,
          MediaFile: true
        }
      })
      return toEmailMessage(message)
    }

    return ctx.db.mutation.upsertEmailMessage(args, info)
  },
  async deleteEmailMessage(parent, args, ctx, info) {
    if (ctx.prisma) {
      const message = await ctx.prisma.emailMessage.delete({
        where: args.where,
        include: {
          EmailMailbox: true,
          MediaFile: true
        }
      })
      return toEmailMessage(message)
    }

    return ctx.db.mutation.deleteEmailMessage(args, info)
  },

  createPlanParticipantFundingSource: forwardTo('db'),
  updatePlanParticipantFundingSource: forwardTo('db'),
  upsertPlanParticipantFundingSource: forwardTo('db'),
  deletePlanParticipantFundingSource: forwardTo('db'),

  createPlanParticipantPlanner: forwardTo('db'),
  updatePlanParticipantPlanner: forwardTo('db'),
  upsertPlanParticipantPlanner: forwardTo('db'),
  deletePlanParticipantPlanner: forwardTo('db'),

  createPlanPlatform: forwardTo('db'),
  updatePlanPlatform: forwardTo('db'),
  upsertPlanPlatform: forwardTo('db'),
  deletePlanPlatform: forwardTo('db'),

  createPlanParticipantPlatform: forwardTo('db'),
  updatePlanParticipantPlatform: forwardTo('db'),
  upsertPlanParticipantPlatform: forwardTo('db'),
  deletePlanParticipantPlatform: forwardTo('db'),

  createPlanJointStaffTrainingPriority: forwardTo('db'),
  updatePlanJointStaffTrainingPriority: forwardTo('db'),
  upsertPlanJointStaffTrainingPriority: forwardTo('db'),
  deletePlanJointStaffTrainingPriority: forwardTo('db'),

  createPlanFeedback: forwardTo('db'),
  updatePlanFeedback: forwardTo('db'),
  upsertPlanFeedback: forwardTo('db'),
  deletePlanFeedback: forwardTo('db'),

  updatePlanFeedbackPublic(parent, args, ctx, info) {
    if (args.data && args.data.feedback && args.data.where) {
      args = { where: args.data.where, data: args.data.feedback }
    }
    return ctx.db.mutation.updatePlanFeedback(args, info)
  },

  createPlanLessonsLearned: forwardTo('db'),
  updatePlanLessonsLearned: forwardTo('db'),
  upsertPlanLessonsLearned: forwardTo('db'),
  deletePlanLessonsLearned: forwardTo('db'),

  createPlanMetric: forwardTo('db'),
  updatePlanMetric: forwardTo('db'),
  upsertPlanMetric: forwardTo('db'),
  deletePlanMetric: forwardTo('db'),

  createPlanFeedbackQualification: forwardTo('db'),
  updatePlanFeedbackQualification: forwardTo('db'),
  upsertPlanFeedbackQualification: forwardTo('db'),
  deletePlanFeedbackQualification: forwardTo('db'),

  createPlanFeedbackTask: forwardTo('db'),
  updatePlanFeedbackTask: forwardTo('db'),
  upsertPlanFeedbackTask: forwardTo('db'),
  deletePlanFeedbackTask: forwardTo('db'),

  createPlanMissionTask: forwardTo('db'),
  updatePlanMissionTask: forwardTo('db'),
  upsertPlanMissionTask: forwardTo('db'),
  deletePlanMissionTask: forwardTo('db'),

  createPlanMissionTaskPublic(parent, args, ctx, info) {
    if (args.data && args.data.planMissionTask) {
      args = { data: args.data.planMissionTask }
    }
    return ctx.db.mutation.createPlanMissionTask(args, info)
  },

  createPlanQualification: forwardTo('db'),
  updatePlanQualification: forwardTo('db'),
  upsertPlanQualification: forwardTo('db'),
  deletePlanQualification: forwardTo('db'),

  createPlanQualificationPublic(parent, args, ctx, info) {
    if (args.data && args.data.planQualification) {
      args = { data: args.data.planQualification }
    }
    return ctx.db.mutation.createPlanQualification(args, info)
  },

  createPlanMeasure: forwardTo('db'),
  updatePlanMeasure: forwardTo('db'),
  upsertPlanMeasure: forwardTo('db'),
  deletePlanMeasure: forwardTo('db'),

  createPlanMeasureData: forwardTo('db'),
  updatePlanMeasureData: forwardTo('db'),
  upsertPlanMeasureData: forwardTo('db'),
  deletePlanMeasureData: forwardTo('db'),

  async createEmailMailbox(parent, args, ctx, info) {
    if (ctx.prisma) {
      const mailbox = await ctx.prisma.emailMailbox.create({
        data: emailMailboxDataFromPrisma1(args.data, { create: true }),
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

    return ctx.db.mutation.createEmailMailbox(args, info)
  },
  async updateEmailMailbox(parent, args, ctx, info) {
    if (ctx.prisma) {
      const mailbox = await ctx.prisma.emailMailbox.update({
        where: args.where,
        data: emailMailboxDataFromPrisma1(args.data),
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

    return ctx.db.mutation.updateEmailMailbox(args, info)
  },
  async upsertEmailMailbox(parent, args, ctx, info) {
    if (ctx.prisma) {
      const mailbox = await ctx.prisma.emailMailbox.upsert({
        where: args.where,
        create: emailMailboxDataFromPrisma1(args.create, { create: true }),
        update: emailMailboxDataFromPrisma1(args.update),
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

    return ctx.db.mutation.upsertEmailMailbox(args, info)
  },
  async deleteEmailMailbox(parent, args, ctx, info) {
    if (ctx.prisma) {
      const mailbox = await ctx.prisma.emailMailbox.delete({
        where: args.where,
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

    return ctx.db.mutation.deleteEmailMailbox(args, info)
  },

  createMapLayer: forwardTo('db'),
  updateMapLayer: forwardTo('db'),
  upsertMapLayer: forwardTo('db'),
  deleteMapLayer: forwardTo('db'),
}

module.exports = {
  prismaForward
}
