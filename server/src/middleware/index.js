const { permissions } = require('./auth')
const { globalMiddleware } = require('./global')
const { workspaceMiddleware } = require('./workspace')
const { trackingMiddleware } = require('./tracking')
const { activityMiddleware } = require('./activity')

// mark resolvers for global db
const globalResolvers = {
  Query: {
    // General
    appUsers: globalMiddleware,
    getAppUserInviteLink: globalMiddleware,
    appWorkspacePublic: globalMiddleware,
    appWorkspaces: globalMiddleware,
    appWorkspace: globalMiddleware,
    appWorkspacesConnection: globalMiddleware,

    appRoles: globalMiddleware,
    appRole: globalMiddleware,
    appRolesConnection: globalMiddleware,

    emailMessage: globalMiddleware,
    emailMessages: globalMiddleware,
    emailMessagesConnection: globalMiddleware,

    emailMailbox: globalMiddleware,
    emailMailboxes: globalMiddleware,
    emailMailboxesConnection: globalMiddleware
  },
  Mutation: {
    // General
    deleteAppUser: globalMiddleware,
    logoutCurrentUser: globalMiddleware,

    createAppWorkspace: globalMiddleware,
    updateAppWorkspace: globalMiddleware,
    upsertAppWorkspace: globalMiddleware,
    deleteAppWorkspace: globalMiddleware,
    requestAppWorkspace: globalMiddleware,

    createAppRole: globalMiddleware,
    updateAppRole: globalMiddleware,
    upsertAppRole: globalMiddleware,
    deleteAppRole: globalMiddleware,

    upsertAppUserRole: globalMiddleware,

    composeEmailMessage: globalMiddleware,
    updateEmailMessage: globalMiddleware,
    upsertEmailMessage: globalMiddleware,
    deleteEmailMessage: globalMiddleware,

    createEmailMailbox: globalMiddleware,
    updateEmailMailbox: globalMiddleware,
    upsertEmailMailbox: globalMiddleware,
    deleteEmailMailbox: globalMiddleware
  },
  Subscription: {
    appRole: globalMiddleware,
    appWorkspace: globalMiddleware,
    emailMessage: globalMiddleware,
    emailMailbox: globalMiddleware,
    currentUserWorkspace: globalMiddleware,
    appWorkspacePub: globalMiddleware,
  }
}

// Tracking resolvers
const trackingResolvers = {
  Query: {
    mediaPostPublic: trackingMiddleware
  }
}

// Activity resolvers
const activityResolvers = {
  Mutation: activityMiddleware
}

// Workspace resolvers
const workspaceResolvers = {
  Query: {
    //App
    appListSetting: workspaceMiddleware,
    appListSettings: workspaceMiddleware,
    appListSettingsConnection: workspaceMiddleware,

    // Media
    mediaNetwork: workspaceMiddleware,
    mediaNetworks: workspaceMiddleware,
    mediaNetworksConnection: workspaceMiddleware,

    mediaPersonae: workspaceMiddleware,
    mediaPersona: workspaceMiddleware,
    mediaPersonaeConnection: workspaceMiddleware,

    mediaPost: workspaceMiddleware,
    mediaPostWithComments: workspaceMiddleware,
    mediaPosts: workspaceMiddleware,
    mediaPostsConnection: workspaceMiddleware,

    mediaProfiles: workspaceMiddleware,
    mediaProfile: workspaceMiddleware,
    mediaProfilesConnection: workspaceMiddleware,

    mediaServices: workspaceMiddleware,
    mediaService: workspaceMiddleware,
    mediaServicesConnection: workspaceMiddleware,

    mediaFiles: workspaceMiddleware,
    mediaFile: workspaceMiddleware,
    mediaFilesConnection: workspaceMiddleware,

    mediaPostsTrackConnection: workspaceMiddleware,
    mediaPostsTrack: workspaceMiddleware,
    mediaPostsTrackInjectsReport: workspaceMiddleware,

    // Media Noise
    mediaNoiseLevels: workspaceMiddleware,
    mapInts: workspaceMiddleware,
    mediaMarkovSource: workspaceMiddleware,

    // Media Web
    mediaSearchPublic: workspaceMiddleware,

    mediaPostPublic: workspaceMiddleware,
    mediaPostsPublic: workspaceMiddleware,
    mediaPostsPublicConnection: workspaceMiddleware,

    mediaProfilesPublic: workspaceMiddleware,
    mediaProfilesPublicConnection: workspaceMiddleware,

    mediaServicePublic: workspaceMiddleware,

    // Notebook
    noteBooks: workspaceMiddleware,
    noteBook: workspaceMiddleware,
    noteBooksConnection: workspaceMiddleware,

    noteSections: workspaceMiddleware,
    noteSection: workspaceMiddleware,
    noteSectionsConnection: workspaceMiddleware,

    notePages: workspaceMiddleware,
    notePage: workspaceMiddleware,
    notePagesConnection: workspaceMiddleware,

    noteFolders: workspaceMiddleware,
    noteFolder: workspaceMiddleware,
    noteFoldersConnection: workspaceMiddleware,

    noteFiles: workspaceMiddleware,
    noteFile: workspaceMiddleware,
    noteFilesConnection: workspaceMiddleware,

    // Plan
    planEvents: workspaceMiddleware,
    planEvent: workspaceMiddleware,
    planEventsConnection: workspaceMiddleware,

    planInjectsSearch: workspaceMiddleware,
    planInjectsSearchCount: workspaceMiddleware,
    planInjects: workspaceMiddleware,
    planInject: workspaceMiddleware,
    planInjectsConnection: workspaceMiddleware,
    downloadPlanInjects: workspaceMiddleware,

    planMethods: workspaceMiddleware,
    planMethod: workspaceMiddleware,
    planMethodsConnection: workspaceMiddleware,

    planLabels: workspaceMiddleware,
    planLabel: workspaceMiddleware,
    planLabelsConnection: workspaceMiddleware,

    planFundingSources: workspaceMiddleware,
    planFundingSource: workspaceMiddleware,
    planFundingSourcesConnection: workspaceMiddleware,

    planMeetings: workspaceMiddleware,
    planMeeting: workspaceMiddleware,
    planMeetingsConnection: workspaceMiddleware,

    planExerciseObjectives: workspaceMiddleware,
    planExerciseObjective: workspaceMiddleware,
    planExerciseObjectivesConnection: workspaceMiddleware,

    planLabelGroups: workspaceMiddleware,
    planLabelGroup: workspaceMiddleware,
    planLabelGroupsConnection: workspaceMiddleware,

    planParticipants: workspaceMiddleware,
    planParticipant: workspaceMiddleware,
    planParticipantsConnection: workspaceMiddleware,

    planTrainingObjectives: workspaceMiddleware,
    planTrainingObjective: workspaceMiddleware,
    planTrainingObjectivesConnection: workspaceMiddleware,

    planAccreditedTasks: workspaceMiddleware,
    planAccreditedTask: workspaceMiddleware,
    planAccreditedTasksConnection: workspaceMiddleware,

    planCommandPriorities: workspaceMiddleware,
    planCommandPriority: workspaceMiddleware,
    planCommandPrioritiesConnection: workspaceMiddleware,

    planJmets: workspaceMiddleware,
    planJmet: workspaceMiddleware,
    planJmetsConnection: workspaceMiddleware,

    planReasons: workspaceMiddleware,
    planReason: workspaceMiddleware,
    planReasonsConnection: workspaceMiddleware,
    planReasonsPublic: workspaceMiddleware,

    planCustomReports: workspaceMiddleware,
    planCustomReport: workspaceMiddleware,
    planCustomReportsConnection: workspaceMiddleware,

    planFeedbackRequests: workspaceMiddleware,
    planFeedbackRequest: workspaceMiddleware,
    planFeedbackRequestsConnection: workspaceMiddleware,

    planParticipantServices: workspaceMiddleware,
    planParticipantService: workspaceMiddleware,
    planParticipantServicesConnection: workspaceMiddleware,

    planParticipantServiceTypes: workspaceMiddleware,
    planParticipantServiceType: workspaceMiddleware,
    planParticipantServiceTypesConnection: workspaceMiddleware,

    planParticipantTypes: workspaceMiddleware,
    planParticipantType: workspaceMiddleware,
    planParticipantTypesConnection: workspaceMiddleware,

    planParticipantCommandAgencies: workspaceMiddleware,
    planParticipantCommandAgency: workspaceMiddleware,
    planParticipantCommandAgenciesConnection: workspaceMiddleware,

    planInjectOwners: workspaceMiddleware,
    planInjectOwner: workspaceMiddleware,
    planInjectOwnersConnection: workspaceMiddleware,

    planAssessments: workspaceMiddleware,
    planAssessment: workspaceMiddleware,
    planAssessmentsConnection: workspaceMiddleware,

    planEvaluations: workspaceMiddleware,

    planFeedback: workspaceMiddleware,
    planFeedbacks: workspaceMiddleware,
    planFeedbacksConnection: workspaceMiddleware,
    planFeedbacksPublic: workspaceMiddleware,

    planLessonsLearned: workspaceMiddleware,
    planLessonsLearneds: workspaceMiddleware,
    planLessonsLearnedsConnection: workspaceMiddleware,

    planMetric: workspaceMiddleware,
    planMetrics: workspaceMiddleware,
    planMetricsConnection: workspaceMiddleware,

    planFeedbackQualification: workspaceMiddleware,
    planFeedbackQualifications: workspaceMiddleware,
    planFeedbackQualificationsConnection: workspaceMiddleware,

    planFeedbackTask: workspaceMiddleware,
    planFeedbackTasks: workspaceMiddleware,
    planFeedbackTasksConnection: workspaceMiddleware,

    planMissionTask: workspaceMiddleware,
    planMissionTasks: workspaceMiddleware,
    planMissionTasksConnection: workspaceMiddleware,
    planMissionTasksPublic: workspaceMiddleware,

    planQualification: workspaceMiddleware,
    planQualifications: workspaceMiddleware,
    planQualificationsConnection: workspaceMiddleware,
    planQualificationsPublic: workspaceMiddleware,

    planMeasure: workspaceMiddleware,
    planMeasures: workspaceMiddleware,
    planMeasuresConnection: workspaceMiddleware,

    planMeasureData: workspaceMiddleware,
    planMeasureDatas: workspaceMiddleware,
    planMeasureDatasConnection: workspaceMiddleware,

    planPriorityLevel: workspaceMiddleware,
    planPriorityLevels: workspaceMiddleware,
    planPriorityLevelsConnection: workspaceMiddleware,

    planRequestedMethodType: workspaceMiddleware,
    planRequestedMethodTypes: workspaceMiddleware,
    planRequestedMethodTypesConnection: workspaceMiddleware,

    planTrainedMethodType: workspaceMiddleware,
    planTrainedMethodTypes: workspaceMiddleware,
    planTrainedMethodTypesConnection: workspaceMiddleware,

    planOrganizations: workspaceMiddleware,
    planOrganization: workspaceMiddleware,
    planOrganizationsConnection: workspaceMiddleware,

    observePost: workspaceMiddleware,
    observePosts: workspaceMiddleware,
    observePostsConnection: workspaceMiddleware,

    activityStream: workspaceMiddleware,
    activityStreams: workspaceMiddleware,
    activityStreamsConnection: workspaceMiddleware,

    chatMessage: workspaceMiddleware,
    chatMessages: workspaceMiddleware,
    chatMessagesConnection: workspaceMiddleware,

    chatRoom: workspaceMiddleware,
    chatRooms: workspaceMiddleware,
    chatRoomsConnection: workspaceMiddleware,

    commandMessage: workspaceMiddleware,
    commandMessages: workspaceMiddleware,

    planParticipantFundingSources: workspaceMiddleware,
    planParticipantFundingSource: workspaceMiddleware,
    planParticipantFundingSourcesConnection: workspaceMiddleware,

    planParticipantPlanners: workspaceMiddleware,
    planParticipantPlanner: workspaceMiddleware,
    planParticipantPlannersConnection: workspaceMiddleware,

    planPlatforms: workspaceMiddleware,
    planPlatform: workspaceMiddleware,
    planPlatformsConnection: workspaceMiddleware,

    planParticipantPlatforms: workspaceMiddleware,
    planParticipantPlatform: workspaceMiddleware,
    planParticipantPlatformsConnection: workspaceMiddleware,

    planJointStaffTrainingPriority: workspaceMiddleware,
    planJointStaffTrainingPriorities: workspaceMiddleware,
    planJointStaffTrainingPrioritiesConnection: workspaceMiddleware,

    mapLocationName: workspaceMiddleware,

    getPlanReport: workspaceMiddleware,

    mapLayers: workspaceMiddleware,
    mapLayer: workspaceMiddleware,
    mapLayersConnection: workspaceMiddleware,

    //Cobra
    getCobraIncidentsByUser: workspaceMiddleware,
    getCobraAuthorization: workspaceMiddleware,
  },
  Mutation: {
    singleUpload: workspaceMiddleware,

    //App
    createAppListSetting: workspaceMiddleware,
    updateAppListSetting: workspaceMiddleware,
    upsertAppListSetting: workspaceMiddleware,
    deleteAppListSetting: workspaceMiddleware,

    //Activity
    createActivityStreamComment: workspaceMiddleware,

    //Media
    updateManyMediaPosts: workspaceMiddleware,

    createMediaNetwork: workspaceMiddleware,
    updateMediaNetwork: workspaceMiddleware,
    deleteMediaNetwork: workspaceMiddleware,

    createMediaPersona: workspaceMiddleware,
    createMediaPersonaEdge: workspaceMiddleware,
    updateMediaPersona: workspaceMiddleware,
    deleteMediaPersona: workspaceMiddleware,
    deleteMediaPersonaEdge: workspaceMiddleware,

    createMediaProfile: workspaceMiddleware,
    updateMediaProfile: workspaceMiddleware,
    deleteMediaProfile: workspaceMiddleware,

    createMediaPost: workspaceMiddleware,
    updateMediaPost: workspaceMiddleware,
    deleteMediaPost: workspaceMiddleware,

    createMediaService: workspaceMiddleware,
    updateMediaService: workspaceMiddleware,
    upsertMediaService: workspaceMiddleware,
    deleteMediaService: workspaceMiddleware,

    createMediaFile: workspaceMiddleware,
    deleteMediaFile: workspaceMiddleware,
    updateMediaFile: workspaceMiddleware,

    // Media Noise
    createMediaNoiseLevel: workspaceMiddleware,
    deleteMediaNoiseLevel: workspaceMiddleware,
    updateMediaNoiseLevel: workspaceMiddleware,

    createMapInt: workspaceMiddleware,
    updateMapInt: workspaceMiddleware,
    createMediaMarkovSource: workspaceMiddleware,

    // Notebook
    createNoteBook: workspaceMiddleware,
    deleteNoteBook: workspaceMiddleware,
    updateNoteBook: workspaceMiddleware,

    createNoteSection: workspaceMiddleware,
    deleteNoteSection: workspaceMiddleware,
    updateNoteSection: workspaceMiddleware,

    createNotePage: workspaceMiddleware,
    deleteNotePage: workspaceMiddleware,
    updateNotePage: workspaceMiddleware,

    createNoteFolder: workspaceMiddleware,
    deleteNoteFolder: workspaceMiddleware,
    updateNoteFolder: workspaceMiddleware,

    createNoteFile: workspaceMiddleware,
    deleteNoteFile: workspaceMiddleware,
    updateNoteFile: workspaceMiddleware,

    // Plan
    feedbackRequest: workspaceMiddleware,

    createPlanEvent: workspaceMiddleware,
    updatePlanEvent: workspaceMiddleware,
    deletePlanEvent: workspaceMiddleware,

    createPlanInject: workspaceMiddleware,
    updatePlanInject: workspaceMiddleware,
    deletePlanInject: workspaceMiddleware,
    duplicatePlanInject: workspaceMiddleware,

    createPlanMethod: workspaceMiddleware,
    updatePlanMethod: workspaceMiddleware,
    upsertPlanMethod: workspaceMiddleware,
    deletePlanMethod: workspaceMiddleware,

    createPlanLabel: workspaceMiddleware,
    updatePlanLabel: workspaceMiddleware,
    deletePlanLabel: workspaceMiddleware,

    createPlanFundingSource: workspaceMiddleware,
    updatePlanFundingSource: workspaceMiddleware,
    deletePlanFundingSource: workspaceMiddleware,

    createPlanMeeting: workspaceMiddleware,
    updatePlanMeeting: workspaceMiddleware,
    deletePlanMeeting: workspaceMiddleware,

    createPlanExerciseObjective: workspaceMiddleware,
    updatePlanExerciseObjective: workspaceMiddleware,
    deletePlanExerciseObjective: workspaceMiddleware,

    createPlanLabelGroup: workspaceMiddleware,
    updatePlanLabelGroup: workspaceMiddleware,
    deletePlanLabelGroup: workspaceMiddleware,

    createPlanParticipant: workspaceMiddleware,
    updatePlanParticipant: workspaceMiddleware,
    deletePlanParticipant: workspaceMiddleware,

    createPlanTrainingObjective: workspaceMiddleware,
    updatePlanTrainingObjective: workspaceMiddleware,
    deletePlanTrainingObjective: workspaceMiddleware,

    createPlanAccreditedTask: workspaceMiddleware,
    updatePlanAccreditedTask: workspaceMiddleware,
    deletePlanAccreditedTask: workspaceMiddleware,

    createPlanCommandPriority: workspaceMiddleware,
    updatePlanCommandPriority: workspaceMiddleware,
    deletePlanCommandPriority: workspaceMiddleware,

    createPlanJmet: workspaceMiddleware,
    updatePlanJmet: workspaceMiddleware,
    upsertPlanJmet: workspaceMiddleware,
    deletePlanJmet: workspaceMiddleware,

    createPlanOrganization: workspaceMiddleware,
    updatePlanOrganization: workspaceMiddleware,
    upsertPlanOrganization: workspaceMiddleware,
    deletePlanOrganization: workspaceMiddleware,

    createPlanAssessment: workspaceMiddleware,
    updatePlanAssessment: workspaceMiddleware,
    upsertPlanAssessment: workspaceMiddleware,
    deletePlanAssessment: workspaceMiddleware,

    createObservePost: workspaceMiddleware,
    updateObservePost: workspaceMiddleware,
    upsertObservePost: workspaceMiddleware,
    deleteObservePost: workspaceMiddleware,

    createChatMessage: workspaceMiddleware,
    updateChatMessage: workspaceMiddleware,
    upsertChatMessage: workspaceMiddleware,
    deleteChatMessage: workspaceMiddleware,

    createChatRoom: workspaceMiddleware,
    updateChatRoom: workspaceMiddleware,
    upsertChatRoom: workspaceMiddleware,
    deleteChatRoom: workspaceMiddleware,

    createCommandMessage: workspaceMiddleware,
    updateCommandMessage: workspaceMiddleware,
    acknowledgeCommandMessage: workspaceMiddleware,
    completeCommandMessage: workspaceMiddleware,
    deleteCommandMessage: workspaceMiddleware,

    createPlanParticipantFundingSource: workspaceMiddleware,
    updatePlanParticipantFundingSource: workspaceMiddleware,
    upsertPlanParticipantFundingSource: workspaceMiddleware,
    deletePlanParticipantFundingSource: workspaceMiddleware,

    createPlanParticipantPlanner: workspaceMiddleware,
    updatePlanParticipantPlanner: workspaceMiddleware,
    upsertPlanParticipantPlanner: workspaceMiddleware,
    deletePlanParticipantPlanner: workspaceMiddleware,

    createPlanPlatform: workspaceMiddleware,
    updatePlanPlatform: workspaceMiddleware,
    upsertPlanPlatform: workspaceMiddleware,
    deletePlanPlatform: workspaceMiddleware,

    createPlanReason: workspaceMiddleware,
    updatePlanReason: workspaceMiddleware,
    upsertPlanReason: workspaceMiddleware,
    deletePlanReason: workspaceMiddleware,
    createPlanReasonPublic: workspaceMiddleware,

    createPlanCustomReport: workspaceMiddleware,
    updatePlanCustomReport: workspaceMiddleware,
    upsertPlanCustomReport: workspaceMiddleware,
    deletePlanCustomReport: workspaceMiddleware,

    createPlanFeedbackRequest: workspaceMiddleware,
    updatePlanFeedbackRequest: workspaceMiddleware,
    upsertPlanFeedbackRequest: workspaceMiddleware,
    deletePlanFeedbackRequest: workspaceMiddleware,

    createPlanParticipantService: workspaceMiddleware,
    updatePlanParticipantService: workspaceMiddleware,
    upsertPlanParticipantService: workspaceMiddleware,
    deletePlanParticipantService: workspaceMiddleware,

    createPlanParticipantServiceType: workspaceMiddleware,
    updatePlanParticipantServiceType: workspaceMiddleware,
    upsertPlanParticipantServiceType: workspaceMiddleware,
    deletePlanParticipantServiceType: workspaceMiddleware,

    createPlanParticipantType: workspaceMiddleware,
    updatePlanParticipantType: workspaceMiddleware,
    upsertPlanParticipantType: workspaceMiddleware,
    deletePlanParticipantType: workspaceMiddleware,

    createPlanParticipantCommandAgency: workspaceMiddleware,
    updatePlanParticipantCommandAgency: workspaceMiddleware,
    upsertPlanParticipantCommandAgency: workspaceMiddleware,
    deletePlanParticipantCommandAgency: workspaceMiddleware,

    createPlanInjectOwner: workspaceMiddleware,
    updatePlanInjectOwner: workspaceMiddleware,
    upsertPlanInjectOwner: workspaceMiddleware,
    deletePlanInjectOwner: workspaceMiddleware,

    createPlanParticipantPlatform: workspaceMiddleware,
    updatePlanParticipantPlatform: workspaceMiddleware,
    upsertPlanParticipantPlatform: workspaceMiddleware,
    deletePlanParticipantPlatform: workspaceMiddleware,

    createPlanJointStaffTrainingPriority: workspaceMiddleware,
    updatePlanJointStaffTrainingPriority: workspaceMiddleware,
    upsertPlanJointStaffTrainingPriority: workspaceMiddleware,
    deletePlanJointStaffTrainingPriority: workspaceMiddleware,

    deletePlanEvaluation: workspaceMiddleware,

    createPlanFeedback: workspaceMiddleware,
    updatePlanFeedback: workspaceMiddleware,
    upsertPlanFeedback: workspaceMiddleware,
    deletePlanFeedback: workspaceMiddleware,
    updatePlanFeedbackPublic: workspaceMiddleware,

    createPlanLessonsLearned: workspaceMiddleware,
    updatePlanLessonsLearned: workspaceMiddleware,
    upsertPlanLessonsLearned: workspaceMiddleware,
    deletePlanLessonsLearned: workspaceMiddleware,

    createPlanMetric: workspaceMiddleware,
    updatePlanMetric: workspaceMiddleware,
    upsertPlanMetric: workspaceMiddleware,
    deletePlanMetric: workspaceMiddleware,

    createPlanFeedbackQualification: workspaceMiddleware,
    updatePlanFeedbackQualification: workspaceMiddleware,
    upsertPlanFeedbackQualification: workspaceMiddleware,
    deletePlanFeedbackQualification: workspaceMiddleware,

    createPlanFeedbackTask: workspaceMiddleware,
    updatePlanFeedbackTask: workspaceMiddleware,
    upsertPlanFeedbackTask: workspaceMiddleware,
    deletePlanFeedbackTask: workspaceMiddleware,

    createPlanMissionTask: workspaceMiddleware,
    updatePlanMissionTask: workspaceMiddleware,
    upsertPlanMissionTask: workspaceMiddleware,
    deletePlanMissionTask: workspaceMiddleware,
    createPlanMissionTaskPublic: workspaceMiddleware,

    createPlanQualification: workspaceMiddleware,
    updatePlanQualification: workspaceMiddleware,
    upsertPlanQualification: workspaceMiddleware,
    deletePlanQualification: workspaceMiddleware,
    createPlanQualificationPublic: workspaceMiddleware,

    createPlanMeasure: workspaceMiddleware,
    updatePlanMeasure: workspaceMiddleware,
    upsertPlanMeasure: workspaceMiddleware,
    deletePlanMeasure: workspaceMiddleware,

    createPlanMeasureData: workspaceMiddleware,
    updatePlanMeasureData: workspaceMiddleware,
    upsertPlanMeasureData: workspaceMiddleware,
    deletePlanMeasureData: workspaceMiddleware,

    createPlanPriorityLevel: workspaceMiddleware,
    updatePlanPriorityLevel: workspaceMiddleware,
    upsertPlanPriorityLevel: workspaceMiddleware,
    deletePlanPriorityLevel: workspaceMiddleware,

    createPlanRequestedMethodType: workspaceMiddleware,
    updatePlanRequestedMethodType: workspaceMiddleware,
    upsertPlanRequestedMethodType: workspaceMiddleware,
    deletePlanRequestedMethodType: workspaceMiddleware,

    createPlanTrainedMethodType: workspaceMiddleware,
    updatePlanTrainedMethodType: workspaceMiddleware,
    upsertPlanTrainedMethodType: workspaceMiddleware,
    deletePlanTrainedMethodType: workspaceMiddleware,


    // Map
    createMapLayer: workspaceMiddleware,
    updateMapLayer: workspaceMiddleware,
    upsertMapLayer: workspaceMiddleware,
    deleteMapLayer: workspaceMiddleware,
    duplicateMapLayer: workspaceMiddleware,

    //Cobra
    pushInjectToCobraMultiLog: workspaceMiddleware,
    pushInjectToCobraRequestManager: workspaceMiddleware,
  },
  Subscription: {
    //App
    appListSetting: workspaceMiddleware,
    // Media
    mediaFeed: workspaceMiddleware,
    mediaPost: workspaceMiddleware,
    mediaProfile: workspaceMiddleware,
    mediaNetwork: workspaceMiddleware,
    mediaPersona: workspaceMiddleware,
    mediaService: workspaceMiddleware,
    // Plan
    planParticipant: workspaceMiddleware,
    planTrainingObjective: workspaceMiddleware,
    planAccreditedTask: workspaceMiddleware,
    planCommandPriority: workspaceMiddleware,
    planJmet: workspaceMiddleware,
    planInject: workspaceMiddleware,
    planInjectsSearch: workspaceMiddleware,
    planOrganization: workspaceMiddleware,
    planLabel: workspaceMiddleware,
    planLabelGroup: workspaceMiddleware,
    planEvent: workspaceMiddleware,
    planMeeting: workspaceMiddleware,
    planExerciseObjective: workspaceMiddleware,
    planFundingSource: workspaceMiddleware,
    planParticipantFundingSource: workspaceMiddleware,
    planParticipantPlanner: workspaceMiddleware,
    planPlatform: workspaceMiddleware,
    planParticipantCommandAgency: workspaceMiddleware,
    planInjectOwner: workspaceMiddleware,
    planParticipantPlatform: workspaceMiddleware,
    planParticipantType: workspaceMiddleware,
    planParticipantService: workspaceMiddleware,
    planParticipantServiceType: workspaceMiddleware,
    planJointStaffTrainingPriority: workspaceMiddleware,
    planPriorityLevel: workspaceMiddleware,
    planRequestedMethodType: workspaceMiddleware,
    planTrainedMethodType: workspaceMiddleware,
    planReason: workspaceMiddleware,
    planCustomReport: workspaceMiddleware,
    planMethod: workspaceMiddleware,
    // Feedback
    planFeedbackRequest: workspaceMiddleware,
    planMissionTask: workspaceMiddleware,
    planFeedbackTask: workspaceMiddleware,
    planMetric: workspaceMiddleware,
    planLessonsLearned: workspaceMiddleware,
    planEvaluation: workspaceMiddleware,
    planFeedbackQualification: workspaceMiddleware,
    planFeedback: workspaceMiddleware,
    planQualification: workspaceMiddleware,
    planMeasure: workspaceMiddleware,
    planMeasureData: workspaceMiddleware,
    // Observe
    observePost: workspaceMiddleware,
    // Activity
    activityStream: workspaceMiddleware,
    // Chat
    chatMessage: workspaceMiddleware,
    chatRoom: workspaceMiddleware,
    // Notebook
    noteBook: workspaceMiddleware,
    // Map
    mapLayer: workspaceMiddleware,
  }
}
module.exports = {
  permissions,
  globalResolvers,
  workspaceResolvers,
  trackingResolvers,
  activityResolvers
}
