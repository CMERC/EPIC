const { recordAuditEvent } = require('../services/auditLog')

const activityStream = async(resolve, parent, args, ctx, info) => {
  const result = await resolve(parent, args, ctx, info)
  await recordAuditEvent(ctx, info, args, result)
  return result
}

//Whitelist the activity we wish to track
const activityMiddleware = {
  createPlanInject: activityStream,
  updatePlanInject: activityStream,
  deletePlanInject: activityStream,
  createPlanEvent: activityStream,
  updatePlanEvent: activityStream,
  deletePlanEvent: activityStream,
  createCommandMessage: activityStream,
  updateCommandMessage: activityStream,
  acknowledgeCommandMessage: activityStream,
  completeCommandMessage: activityStream,
  deleteCommandMessage: activityStream,
  createObservePost: activityStream,
  updateObservePost: activityStream,
  deleteObservePost: activityStream,
  createMediaPost: activityStream,
  updateMediaPost: activityStream,
  deleteMediaPost: activityStream
}

module.exports = {
  activityMiddleware
}
