const { Query } = require('./Query/')
const { track } = require('./Query/track')
const { appUserQueries } = require('./Query/appUserQueries')
const { emailQueries } = require('./Query/email')
const { commandQueries } = require('./Query/command')

const { planReportQueries } = require('./Query/planReports')
const { geocode } = require('./Query/geocode')
const { cobraQueries } = require('./Query/cobraQueries')

const { randomDataQueries } = require('./Query/randomData')
const { downloadPlanInjects } = require('./Query/downloadPlanInjects')

const { Subscription } = require('./Subscription')

const { appUserMutations } = require('./Mutation/appUserMutations')
const { emailMutations } = require('./Mutation/email')
const { commandMutations } = require('./Mutation/command')

const { appUserRole } = require('./Mutation/appUserRole')
const { post } = require('./Mutation/post')
const { profile } = require('./Mutation/profile')
const { MediaService } = require('./Mutation/mediaService')
const { PlanMutations } = require('./Mutation/planMutations')
const { Inject } = require('./Mutation/inject')
const { appWorkspaceMutation } = require('./Mutation/workspace')
const { prismaForward } = require('./Mutation/prismaForward')
const { authQueries } = require('graphql-authentication')
const { authMutations } = require('./Mutation/authMutations')
const { upload } = require('./Mutation/upload')
const { mapLayer } = require('./Mutation/mapLayer')
const { comment } = require('./Mutation/comment')
const { cobraMutations } = require('./Mutation/cobraMutations')

module.exports = {
  Query: {
    ...Query,
    ...track,
    ...appUserQueries,
    ...authQueries,
    ...emailQueries,
    ...commandQueries,
    ...planReportQueries,
    ...randomDataQueries,
    ...geocode,
    ...cobraQueries,
    ...downloadPlanInjects
  },
  Mutation: {
    ...appUserMutations,
    ...emailMutations,
    ...commandMutations,
    ...post,
    ...profile,
    ...MediaService,
    ...PlanMutations,
    ...Inject,
    ...prismaForward,
    ...appWorkspaceMutation,
    ...authMutations,
    ...appUserRole,
    ...upload,
    ...mapLayer,
    ...comment,
    ...cobraMutations
  },
  Subscription
}
