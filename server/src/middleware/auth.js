/* eslint-disable space-before-function-paren */

const { rule, shield, and, or, not, deny } = require('graphql-shield')
const { getUserId, getUser } = require('graphql-authentication')
const jwt = require('jsonwebtoken')

async function getCurrentUserId(ctx) {
  // For Apollo Server 2.0+ it is ctx.req and for GraphQL Yoga ctx.request. Maybe there is a better way...
  const Authorization = (ctx.req || ctx.request).get('Authorization')

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    // check if session exists for user
    const { userId, sessionId } = jwt.verify(token, ctx.graphqlAuthentication.secret)
    const sessionUser = await ctx.db.query.users(
      { where: { id: userId, sessionId: sessionId } },
      `{
        sessionId
      }`
    )
    // Check if session is stored in db
    if (sessionUser[0] && sessionUser[0].sessionId)
      return userId
    else
      return null
  } else
    return null
}

function isAuthResolver(parent, args, ctx) {
  return getCurrentUserId(ctx)
}
const isAuthenticated = rule()(isAuthResolver)

async function checkSuper(ctx) {
  let user = await getUser(ctx)
  return user.isSuper
}

async function checkRole(ctx, roleName) {
  let userId = await getUserId(ctx)
  const activeUser = await ctx.db.query.user(
    { where: { id: userId } },
    '{role {roles {name}}}'
  )

  let hasRole = false
  // check if role is assigned - hasRole rule
  if (
    activeUser.role &&
    activeUser.role.roles &&
    activeUser.role.roles.length > 0
  ) {
    // check if role matches to roleName
    hasRole = activeUser.role.roles.some(role => role['name'] === roleName)
  }
  return hasRole
}

// check if user has been assigned any role
async function checkHasRole(ctx) {
  let userId = await getUserId(ctx)
  const activeUser = await ctx.db.query.user(
    { where: { id: userId } },
    `{
      isSuper
      role {roles {name}}
    }`
  )
  // Has any Role assigned or isSuper
  if (
    (activeUser.role &&
      activeUser.role.roles &&
      activeUser.role.roles.length > 0) ||
    activeUser.isSuper
  ) {
    return true
  }

  return false
}

const isAuthenticatedWithRole = rule()(async (parent, args, ctx) => {
  return isAuthenticated && (await checkHasRole(ctx))
})

const isSuper = rule()(async (parent, args, ctx) => {
  return await checkSuper(ctx)
})

const isAdmin = rule()(async (parent, args, ctx) => {
  return await checkRole(ctx, 'ADMIN')
})

const isEditor = rule()(async (parent, args, ctx) => {
  return await checkRole(ctx, 'EDITOR')
})

const isAuthor = rule()(async (parent, args, ctx) => {
  return await checkRole(ctx, 'AUTHOR')
})

const isUser = rule()(async (parent, args, ctx) => {
  return await checkRole(ctx, 'USER')
})

// Apply shield rules to resolvers
const permissions = shield({
  Query: {
    // General
    appUsers: and(isAuthenticated, or(isAdmin, isSuper)),

    appWorkspaces: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    currentUserWorkspaces: isAuthenticated,
    getWorkspaceMembers: and(isAuthenticated, or(isAdmin, isSuper)),
    appWorkspace: and(isAuthenticated, isSuper),
    appWorkspacesConnection: and(isAuthenticated, isAdmin),

    appRolesConnection: and(isAuthenticated, or(isAdmin, isSuper)),

    appRoles: and(isAuthenticated, or(isAdmin, isSuper)),
    appRole: and(isAuthenticated, or(isAdmin, isSuper)),
    getAppUserInviteLink: and(isAuthenticated, or(isAdmin, isSuper)),

    getRandomData: isAuthenticatedWithRole,

    // Media
    mediaPost: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaPostWithComments: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaPosts: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaPostsConnection: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaPostsTrackInjectsReport: and(isAuthenticated, or(isAdmin, isEditor)),

    mediaProfile: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaProfiles: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaProfilesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    mediaPersona: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaPersonae: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaPersonaeConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    mediaNetwork: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaNetworks: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaNetworksConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    mediaServices: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaService: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaServicesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    // Media Noise
    mediaMarkovSources: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaMarkovSource: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaMarkovSourcesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    mediaNoiseLevels: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaNoiseLevel: and(isAuthenticated, or(isAdmin, isEditor)),
    mediaNoiseLevelsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    // Media Web is not authenticated

    // Notebook
    noteBooks: and(isAuthenticated, or(isAdmin, isEditor)),
    noteBook: and(isAuthenticated, or(isAdmin, isEditor)),
    noteBooksConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    noteSections: and(isAuthenticated, or(isAdmin, isEditor)),
    noteSection: and(isAuthenticated, or(isAdmin, isEditor)),
    noteSectionsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    notePages: and(isAuthenticated, or(isAdmin, isEditor)),
    notePage: and(isAuthenticated, or(isAdmin, isEditor)),
    notePagesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    noteFolders: and(isAuthenticated, or(isAdmin, isEditor)),
    noteFolder: and(isAuthenticated, or(isAdmin, isEditor)),
    noteFoldersConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    noteFiles: and(isAuthenticated, or(isAdmin, isEditor)),
    noteFile: and(isAuthenticated, or(isAdmin, isEditor)),
    noteFilesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    // Plan
    planEvents: and(isAuthenticated, or(isAdmin, isEditor)),
    planEvent: and(isAuthenticated, or(isAdmin, isEditor)),
    planEventsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planInjectsSearch: and(isAuthenticated, or(isAdmin, isEditor)),
    planInjectsSearchCount: and(isAuthenticated, or(isAdmin, isEditor)),
    planInjects: and(isAuthenticated, or(isAdmin, isEditor)),
    planInject: and(isAuthenticated, or(isAdmin, isEditor)),
    planInjectsConnection: and(isAuthenticated, or(isAdmin, isEditor)),
    downloadPlanInjects: and(isAuthenticated, or(isAdmin, isEditor)),

    planMethod: and(isAuthenticated, or(isAdmin, isEditor)),
    planMethods: and(isAuthenticated, or(isAdmin, isEditor)),
    planMethodsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planReasons: and(isAuthenticated, or(isAdmin, isEditor)),
    planReason: and(isAuthenticated, or(isAdmin, isEditor)),
    planReasonsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planCustomReports: and(isAuthenticated, or(isAdmin, isEditor)),
    planCustomReport: and(isAuthenticated, or(isAdmin, isEditor)),
    planCustomReportsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planEvaluations: isAuthenticatedWithRole,

    planFeedbackRequests: and(isAuthenticated, or(isAdmin, isEditor)),
    planFeedbackRequest: and(isAuthenticated, or(isAdmin, isEditor)),
    planFeedbackRequestsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planParticipantServices: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipantService: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipantServicesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planParticipantServiceTypes: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipantServiceType: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipantServiceTypesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planParticipantTypes: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipantType: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipantTypesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planParticipantCommandAgencies: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipantCommandAgency: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipantCommandAgenciesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planInjectOwners: and(isAuthenticated, or(isAdmin, isEditor)),
    planInjectOwner: and(isAuthenticated, or(isAdmin, isEditor)),
    planInjectOwnersConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planLabels: and(isAuthenticated, or(isAdmin, isEditor)),
    planLabel: and(isAuthenticated, or(isAdmin, isEditor)),
    planLabelsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planFundingSources: and(isAuthenticated, or(isAdmin, isEditor)),
    planFundingSource: and(isAuthenticated, or(isAdmin, isEditor)),
    planFundingSourcesConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planMeetings: and(isAuthenticated, or(isAdmin, isEditor)),
    planMeeting: and(isAuthenticated, or(isAdmin, isEditor)),
    planMeetingsConnection: and(isAuthenticated, or(isAdmin, isEditor)),
    planExerciseObjectives: and(isAuthenticated, or(isAdmin, isEditor)),
    planExerciseObjective: and(isAuthenticated, or(isAdmin, isEditor)),
    planExerciseObjectivesConnection: and(
      isAuthenticated,
      or(isAdmin, isEditor)
    ),

    planLabelGroups: and(isAuthenticated, or(isAdmin, isEditor)),
    planLabelGroup: and(isAuthenticated, or(isAdmin, isEditor)),
    planLabelGroupsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planParticipants: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipant: and(isAuthenticated, or(isAdmin, isEditor)),
    planParticipantsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planTrainingObjectives: and(isAuthenticated, or(isAdmin, isEditor)),
    planTrainingObjective: and(isAuthenticated, or(isAdmin, isEditor)),
    planTrainingObjectivesConnection: and(
      isAuthenticated,
      or(isAdmin, isEditor)
    ),

    planAccreditedTasks: and(isAuthenticated, or(isAdmin, isEditor)),
    planAccreditedTask: and(isAuthenticated, or(isAdmin, isEditor)),
    planAccreditedTasksConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planCommandPriorities: and(isAuthenticated, or(isAdmin, isEditor)),
    planCommandPriority: and(isAuthenticated, or(isAdmin, isEditor)),
    planCommandPrioritiesConnection: and(
      isAuthenticated,
      or(isAdmin, isEditor)
    ),

    planJmets: and(isAuthenticated, or(isAdmin, isEditor)),
    planJmet: and(isAuthenticated, or(isAdmin, isEditor)),
    planJmetsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planOrganizations: and(isAuthenticated, or(isAdmin, isEditor)),
    planOrganization: and(isAuthenticated, or(isAdmin, isEditor)),
    planOrganizationsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planAssessments: and(isAuthenticated, or(isAdmin, isEditor)),
    planAssessment: and(isAuthenticated, or(isAdmin, isEditor)),
    planAssessmentsConnection: and(isAuthenticated, or(isAdmin, isEditor)),

    planFeedback: isAuthenticatedWithRole,
    planFeedbacks: isAuthenticatedWithRole,
    planFeedbacksConnection: isAuthenticatedWithRole,

    planLessonsLearned: isAuthenticatedWithRole,
    planLessonsLearneds: isAuthenticatedWithRole,
    planLessonsLearnedsConnection: isAuthenticatedWithRole,

    planMetric: isAuthenticatedWithRole,
    planMetrics: isAuthenticatedWithRole,
    planMetricsConnection: isAuthenticatedWithRole,

    planFeedbackQualification: isAuthenticatedWithRole,
    planFeedbackQualifications: isAuthenticatedWithRole,
    planFeedbackQualificationsConnection: isAuthenticatedWithRole,

    planFeedbackTask: isAuthenticatedWithRole,
    planFeedbackTasks: isAuthenticatedWithRole,
    planFeedbackTasksConnection: isAuthenticatedWithRole,

    planMissionTask: isAuthenticatedWithRole,
    planMissionTasks: isAuthenticatedWithRole,
    planMissionTasksConnection: isAuthenticatedWithRole,

    planQualification: isAuthenticatedWithRole,
    planQualifications: isAuthenticatedWithRole,
    planQualificationsConnection: isAuthenticatedWithRole,

    planMeasure: isAuthenticatedWithRole,
    planMeasures: isAuthenticatedWithRole,
    planMeasuresConnection: isAuthenticatedWithRole,

    planMeasureData: isAuthenticatedWithRole,
    planMeasureDatas: isAuthenticatedWithRole,
    planMeasureDatasConnection: isAuthenticatedWithRole,

    observePost: isAuthenticatedWithRole,
    observePosts: isAuthenticatedWithRole,
    observePostsConnection: isAuthenticatedWithRole,

    activityStream: isAuthenticatedWithRole,
    activityStreams: isAuthenticatedWithRole,
    activityStreamsConnection: isAuthenticatedWithRole,

    chatMessage: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    chatMessages: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    chatMessagesConnection: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),

    chatRoom: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    chatRooms: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    chatRoomsConnection: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),

    emailMessage: isAuthenticatedWithRole,
    emailMessages: isAuthenticatedWithRole,
    emailMessagesConnection: isAuthenticatedWithRole,

    emailMailbox: isAuthenticatedWithRole,
    emailMailboxes: isAuthenticatedWithRole,
    emailMailboxesConnection: isAuthenticatedWithRole,

    planParticipantFundingSource: isAuthenticatedWithRole,
    planParticipantFundingSources: isAuthenticatedWithRole,
    planParticipantFundingSourcesConnection: isAuthenticatedWithRole,

    planParticipantPlanner: isAuthenticatedWithRole,
    planParticipantPlanners: isAuthenticatedWithRole,
    planParticipantPlannersConnection: isAuthenticatedWithRole,

    planPlatform: isAuthenticatedWithRole,
    planPlatforms: isAuthenticatedWithRole,
    planPlatformsConnection: isAuthenticatedWithRole,

    planParticipantPlatform: isAuthenticatedWithRole,
    planParticipantPlatforms: isAuthenticatedWithRole,
    planParticipantPlatformsConnection: isAuthenticatedWithRole,

    planJointStaffTrainingPriority: isAuthenticatedWithRole,
    planJointStaffTrainingPriorities: isAuthenticatedWithRole,
    planJointStaffTrainingPrioritiesConnection: isAuthenticatedWithRole,

    planPriorityLevel: isAuthenticatedWithRole,
    planPriorityLevels: isAuthenticatedWithRole,
    planPriorityLevelsConnection: isAuthenticatedWithRole,

    planRequestedMethodType: isAuthenticatedWithRole,
    planRequestedMethodTypes: isAuthenticatedWithRole,
    planRequestedMethodTypesConnection: isAuthenticatedWithRole,

    planTrainedMethodType: isAuthenticatedWithRole,
    planTrainedMethodTypes: isAuthenticatedWithRole,
    planTrainedMethodTypesConnection: isAuthenticatedWithRole,

    mapLocationName: isAuthenticatedWithRole,

    getPlanReport: isAuthenticatedWithRole,

    //Map
    mapLayers: isAuthenticatedWithRole,
    mapLayer: isAuthenticatedWithRole,
    mapLayersConnection: isAuthenticatedWithRole,

    // Cobra
    getCobraIncidentsByUser: isAuthenticatedWithRole,
    getCobraAuthorization: isAuthenticatedWithRole,
  },
  Mutation: {
    // General
    deleteAppUser: and(isAuthenticated, isAdmin),
    inviteUser: isAuthenticatedWithRole,
    updateCurrentUser: isAuthenticated,

    createAppWorkspace: and(isAuthenticated, or(isAdmin, isSuper)),
    updateAppWorkspace: and(isAuthenticated, or(isAdmin, isSuper)),
    deleteAppWorkspace: and(isAuthenticated, isSuper),
    requestAppWorkspace: isAuthenticated,
    assignUserToWorkspace: isAuthenticatedWithRole,

    createAppRole: and(isAuthenticated, isSuper),
    updateAppRole: and(isAuthenticated, isSuper),
    upsertAppRole: and(isAuthenticated, isSuper),
    deleteAppRole: and(isAuthenticated, isSuper),

    createAppListSetting: and(isAuthenticated, isSuper),
    updateAppListSetting: and(isAuthenticated, isSuper),
    upsertAppListSetting: isAuthenticatedWithRole,
    deleteAppListSetting: and(isAuthenticated, isSuper),

    deleteAppUserRole: and(isAuthenticated, or(isAdmin, isSuper)),
    // Assign roles to user
    upsertAppUserRole: and(isAuthenticated, or(isAdmin, isSuper)),

    // Activity
    createActivityStreamComment: isAuthenticatedWithRole,

    // Media
    updateManyMediaPosts: and(isAuthenticated, isSuper),

    createMediaNetwork: and(isAuthenticated, or(isAdmin, isEditor)),
    updateMediaNetwork: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteMediaNetwork: and(isAuthenticated, or(isAdmin, isEditor)),

    createMediaPersona: and(isAuthenticated, or(isAdmin, isEditor)),
    createMediaPersonaEdge: and(isAuthenticated, or(isAdmin, isEditor)),
    updateMediaPersona: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteMediaPersona: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteMediaPersonaEdge: and(isAuthenticated, or(isAdmin, isEditor)),

    createMediaProfile: and(isAuthenticated, or(isAdmin, isEditor)),
    updateMediaProfile: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteMediaProfile: and(isAuthenticated, or(isAdmin, isEditor)),

    createMediaPost: and(isAuthenticated, or(isAdmin, isEditor)),
    updateMediaPost: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteMediaPost: and(isAuthenticated, or(isAdmin, isEditor)),

    createMediaService: and(isAuthenticated, or(isAdmin, isEditor)),
    updateMediaService: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteMediaService: and(isAuthenticated, or(isAdmin, isEditor)),

    createMediaFile: and(isAuthenticatedWithRole, not(isUser)),
    deleteMediaFile: and(isAuthenticatedWithRole),
    updateMediaFile: and(isAuthenticatedWithRole, not(isUser)),

    // Media Noise
    createMediaNoiseLevel: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteMediaNoiseLevel: and(isAuthenticated, or(isAdmin, isEditor)),
    updateMediaNoiseLevel: and(isAuthenticated, or(isAdmin, isEditor)),

    createMapInt: and(isAuthenticated, or(isAdmin, isEditor)),
    updateMapInt: and(isAuthenticated, or(isAdmin, isEditor)),
    createMediaMarkovSource: and(isAuthenticated, or(isAdmin, isEditor)),

    // Media Web is not authenticated

    // Notebook
    createNoteBook: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteNoteBook: and(isAuthenticated, or(isAdmin, isEditor)),
    updateNoteBook: and(isAuthenticated, or(isAdmin, isEditor)),

    createNoteSection: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteNoteSection: and(isAuthenticated, or(isAdmin, isEditor)),
    updateNoteSection: and(isAuthenticated, or(isAdmin, isEditor)),

    createNotePage: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteNotePage: and(isAuthenticated, or(isAdmin, isEditor)),
    updateNotePage: and(isAuthenticated, or(isAdmin, isEditor)),

    // Plan

    feedbackRequest: isAuthenticated, //TODO: validate access level

    createPlanEvent: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanEvent: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanEvent: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanEvent: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanInject: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanInject: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanInject: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanInject: and(isAuthenticated, or(isAdmin, isEditor)),
    duplicatePlanInject: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanMethod: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanMethod: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanMethod: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanMethod: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanLabel: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanLabel: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanLabel: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanLabel: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanReason: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanReason: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanReason: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanReason: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanCustomReport: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanCustomReport: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanCustomReport: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanCustomReport: and(isAuthenticated, or(isAdmin, isEditor)),

    deletePlanEvaluation: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanFeedbackRequest: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanFeedbackRequest: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanFeedbackRequest: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanFeedbackRequest: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanParticipantService: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanParticipantService: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanParticipantService: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanParticipantService: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanParticipantServiceType: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanParticipantServiceType: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanParticipantServiceType: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanParticipantServiceType: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanParticipantType: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanParticipantType: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanParticipantType: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanParticipantType: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanParticipantCommandAgency: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanParticipantCommandAgency: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanParticipantCommandAgency: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanParticipantCommandAgency: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanFundingSource: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanFundingSource: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanFundingSource: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanFundingSource: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanMeeting: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanMeeting: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanMeeting: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanMeeting: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanExerciseObjective: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanExerciseObjective: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanExerciseObjective: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanExerciseObjective: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanLabelGroup: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanLabelGroup: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanLabelGroup: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanLabelGroup: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanParticipant: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanParticipant: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanParticipant: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanParticipant: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanTrainingObjective: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanTrainingObjective: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanTrainingObjective: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanTrainingObjective: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanAccreditedTask: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanAccreditedTask: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanAccreditedTask: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanAccreditedTask: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanCommandPriority: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanCommandPriority: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanCommandPriority: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanCommandPriority: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanJmet: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanJmet: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanJmet: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanJmet: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanPriorityLevel: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanPriorityLevel: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanPriorityLevel: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanPriorityLevel: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanRequestedMethodType: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanRequestedMethodType: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanRequestedMethodType: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanRequestedMethodType: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanTrainedMethodType: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanTrainedMethodType: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanTrainedMethodType: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanTrainedMethodType: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanOrganization: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanOrganization: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanOrganization: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanOrganization: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanAssessment: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanAssessment: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertPlanAssessment: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanAssessment: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanFeedback: and(isAuthenticated, or(isAdmin, isEditor)),
    updatePlanFeedback: isAuthenticatedWithRole,
    upsertPlanFeedback: and(isAuthenticated, or(isAdmin, isEditor)),
    deletePlanFeedback: and(isAuthenticated, or(isAdmin, isEditor)),

    createPlanLessonsLearned: isAuthenticatedWithRole,
    updatePlanLessonsLearned: isAuthenticatedWithRole,
    upsertPlanLessonsLearned: isAuthenticatedWithRole,
    deletePlanLessonsLearned: isAuthenticatedWithRole,

    createPlanMetric: isAuthenticatedWithRole,
    updatePlanMetric: isAuthenticatedWithRole,
    upsertPlanMetric: isAuthenticatedWithRole,
    deletePlanMetric: isAuthenticatedWithRole,

    createPlanFeedbackQualification: isAuthenticatedWithRole,
    updatePlanFeedbackQualification: isAuthenticatedWithRole,
    upsertPlanFeedbackQualification: isAuthenticatedWithRole,
    deletePlanFeedbackQualification: isAuthenticatedWithRole,

    createPlanFeedbackTask: isAuthenticatedWithRole,
    updatePlanFeedbackTask: isAuthenticatedWithRole,
    upsertPlanFeedbackTask: isAuthenticatedWithRole,
    deletePlanFeedbackTask: isAuthenticatedWithRole,

    createPlanMissionTask: isAuthenticatedWithRole,
    updatePlanMissionTask: isAuthenticatedWithRole,
    upsertPlanMissionTask: isAuthenticatedWithRole,
    deletePlanMissionTask: isAuthenticatedWithRole,

    createPlanQualification: isAuthenticatedWithRole,
    updatePlanQualification: isAuthenticatedWithRole,
    upsertPlanQualification: isAuthenticatedWithRole,
    deletePlanQualification: isAuthenticatedWithRole,

    createPlanMeasure: isAuthenticatedWithRole,
    updatePlanMeasure: isAuthenticatedWithRole,
    upsertPlanMeasure: isAuthenticatedWithRole,
    deletePlanMeasure: isAuthenticatedWithRole,

    createPlanMeasureData: isAuthenticatedWithRole,
    updatePlanMeasureData: isAuthenticatedWithRole,
    upsertPlanMeasureData: isAuthenticatedWithRole,
    deletePlanMeasureData: isAuthenticatedWithRole,

    createObservePost: isAuthenticatedWithRole,
    updateObservePost: isAuthenticatedWithRole,
    upsertObservePost: isAuthenticatedWithRole,
    deleteObservePost: isAuthenticatedWithRole,

    createChatMessage: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    updateChatMessage: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    upsertChatMessage: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    deleteChatMessage: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),

    createChatRoom: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    updateChatRoom: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    upsertChatRoom: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),
    deleteChatRoom: and(isAuthenticated, or(isAdmin, isEditor, isSuper)),

    composeEmailMessage: isAuthenticatedWithRole,
    updateEmailMessage: isAuthenticatedWithRole,
    upsertEmailMessage: isAuthenticatedWithRole,
    deleteEmailMessage: isAuthenticatedWithRole,

    createEmailMailbox: isAuthenticatedWithRole,
    updateEmailMailbox: isAuthenticatedWithRole,
    upsertEmailMailbox: isAuthenticatedWithRole,
    deleteEmailMailbox: isAuthenticatedWithRole,

    createPlanParticipantFundingSource: isAuthenticatedWithRole,
    updatePlanParticipantFundingSource: isAuthenticatedWithRole,
    upsertPlanParticipantFundingSource: isAuthenticatedWithRole,
    deletePlanParticipantFundingSource: isAuthenticatedWithRole,

    createPlanParticipantPlanner: isAuthenticatedWithRole,
    updatePlanParticipantPlanner: isAuthenticatedWithRole,
    upsertPlanParticipantPlanner: isAuthenticatedWithRole,
    deletePlanParticipantPlanner: isAuthenticatedWithRole,

    createPlanPlatform: isAuthenticatedWithRole,
    updatePlanPlatform: isAuthenticatedWithRole,
    upsertPlanPlatform: isAuthenticatedWithRole,
    deletePlanPlatform: isAuthenticatedWithRole,

    createPlanParticipantPlatform: isAuthenticatedWithRole,
    updatePlanParticipantPlatform: isAuthenticatedWithRole,
    upsertPlanParticipantPlatform: isAuthenticatedWithRole,
    deletePlanParticipantPlatform: isAuthenticatedWithRole,

    createPlanJointStaffTrainingPriority: isAuthenticatedWithRole,
    updatePlanJointStaffTrainingPriority: isAuthenticatedWithRole,
    upsertPlanJointStaffTrainingPriority: isAuthenticatedWithRole,
    deletePlanJointStaffTrainingPriority: isAuthenticatedWithRole,

    //  Map
    createMapLayer: and(isAuthenticated, or(isAdmin, isEditor)),
    updateMapLayer: and(isAuthenticated, or(isAdmin, isEditor)),
    upsertMapLayer: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteMapLayer: and(isAuthenticated, or(isAdmin, isEditor)),
    duplicateMapLayer: and(isAuthenticated, or(isAdmin, isEditor)),

    //Cobra
    pushInjectToCobraRequestManager: isAuthenticatedWithRole,
    pushInjectToCobraMultiLog: isAuthenticatedWithRole,
  }
})
module.exports = {
  permissions
}
