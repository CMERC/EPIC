const logger = require('../logger')
const { getUser } = require('graphql-authentication')


const activityStream = async(resolve, parent, args, ctx, info) => {
  try {
    let user = await getUser(ctx)

    const activityData = {
      data: {
        summary: ' user: ' + user.name + ' action: ' + info.fieldName + ' objectID: ' + args.where.id,
        type: info.fieldName,
        actor: user.id,
        name: user.name,
        referenceID: args.where.id
      }
    }
    //console.log(activityData)
    await ctx.db.mutation.createActivityStream(activityData)
  } catch (error) {
    logger.error(error.message)
  }

  return await resolve(parent, args, ctx, info)
}

//Whitelist the activity we wish to track
const activityMiddleware = {
  //createPlanInject: activityStream,
  updatePlanInject: activityStream,
  //createPlanParticipant: activityStream,
  //updatePlanParticipant: activityStream,
  //createPlanEvent: activityStream,
  //updatePlanEvent: activityStream,
  //createPlanTrainingObjective: activityStream,
  //updatePlanTrainingObjective: activityStream
}

module.exports = {
  activityMiddleware
}
