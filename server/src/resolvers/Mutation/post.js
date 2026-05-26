
const { hasUrl, withDefaultProtocol } = require('../../utils/url')
const post = {
  async createMediaPost(parent, args, ctx, info) {
    let urlData = JSON.parse(args.data.url)
    let url =
      process.env.APP_DOMAIN +
      '/web/' +
      (info.workspaceName ? info.workspaceName + '/' : '') +
      urlData.service +
      '/' +
      urlData.profile

    // process urls to encode
    // Using split join instead of replace to avoid replacing links of same domain twice
    let tempArray = args.data.text.split(/\s+/g)
    for (let i = 0; i < tempArray.length; i++) {
      if (hasUrl(tempArray[i])) {
        // set path encode uri
        tempArray.splice(
          i,
          1,
          process.env.APP_DOMAIN +
          '/link?url=' +
          encodeURIComponent(withDefaultProtocol(tempArray[i]))
        )
      }
    }
    args.data.text = tempArray.join(' ')
    let mediaPost = await ctx.db.mutation.createMediaPost(args, info)

    // update url
    let updateURL = {
      data: {
        url: url + '/' + mediaPost.id
      },
      where: { id: mediaPost.id }
    }

    mediaPost = await ctx.db.mutation.updateMediaPost(updateURL)

    // return updated mediapost
    return mediaPost
  },
  updateMediaPost(parent, args, ctx, info) {
    return ctx.db.mutation.updateMediaPost(args, info)
  }
}

module.exports = { post }
