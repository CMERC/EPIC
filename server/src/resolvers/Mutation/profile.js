const profile = {
  async createMediaProfile(parent, args, ctx, info) {
    let url = process.env.APP_DOMAIN + '/web/' +
      (info.workspaceName ? info.workspaceName : 'global') +
      '/' +
      args.data.service.connect.name +
      '/' +
      args.data.username
    // Update profile url
    args.data = { ...args.data, url }
    return ctx.db.mutation.createMediaProfile(args, info)
  },
  updateMediaProfile(parent, args, ctx, info) {
    // Update url with new username
    return ctx.db.mutation.updateMediaProfile(args, info)
  }
}

module.exports = { profile }
