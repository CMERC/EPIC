
const {
  mediaServiceDataFromPrisma1
} = require('../../services/prismaBridge')

const MediaService = {
  updateMediaService(parent, args, ctx, info) {
    if (ctx.prisma) {
      if (ctx.db && ctx.db.query && ctx.db.query.mediaProfilesConnection && ctx.db.query.mediaProfiles && info && info.workspaceName) {
        updateServiceProfileUrls(args, ctx, info.workspaceName)
      }
      return ctx.prisma.mediaService.update({
        where: args.where,
        data: mediaServiceDataFromPrisma1(args.data)
      })
    }

    // Update url of profiles with this service
    updateServiceProfileUrls(args, ctx, info && info.workspaceName)
    return ctx.db.mutation.updateMediaService(args, info)
  }
}
async function updateServiceProfileUrls(args, ctx, workspace) {
  const queryLimit = 500
  const totalProfilesInWorkspace = await ctx.db.query.mediaProfilesConnection(
    {}, '{aggregate {count}}'
  )
  let prismaCycles = totalProfilesInWorkspace.aggregate.count > queryLimit ? Math.ceil(totalProfilesInWorkspace.aggregate.count / queryLimit) : 1

  for (let i = 0; i < prismaCycles; i++) {
    let pubProfiles = await ctx.db.query.mediaProfiles(
      {
        where: {
          service: {
            id: args.where.id
          }
        },
        skip: i * queryLimit,
        first: queryLimit
      },
      `{
        id
        url
        username
        service{
          name
        }
      }`
    )
    for (let x = 0; x < pubProfiles.length; x++) {
      if (pubProfiles[x].service) {
        // If Profile has service attached
        let whatItShouldBe =
          process.env.APP_DOMAIN +
          '/web/' +
          workspace +
          '/' +
          pubProfiles[x].service.name +
          '/' +
          pubProfiles[x].username
        // Convert to string to avoid typecast errors
        if ('' + whatItShouldBe !== '' + pubProfiles[x].url) {
          let updateURL = {
            data: {
              url: whatItShouldBe
            },
            where: { id: pubProfiles[x].id }
          }
          await ctx.db.mutation.updateMediaProfile(
            updateURL
          )
        }
      }
    }
  }
}

module.exports = { MediaService }
