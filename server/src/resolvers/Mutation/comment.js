const { getUser } = require('graphql-authentication')

const comment = {
  async createActivityStreamComment(parent, args, ctx, info) {

    let user = await getUser(ctx)

    const activityData = {
      data: {
        summary: ' user: ' + user.name + ' action: ' + info.fieldName + ' objectID: ' + args.data.id,
        type: 'comment',
        actor: user.id,
        name: user.name,
        referenceID: args.data.referenceID,
        content: args.data.content
      }
    }
    //console.log(activityData)
    return await ctx.db.mutation.createActivityStream(activityData, info)
  }
}

module.exports = { comment }
