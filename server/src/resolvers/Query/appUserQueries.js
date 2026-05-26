const appUserQueries = {
  async appUsers(parent, args, ctx, info) {
    let returnData = `{
      id
      name
      email
      isSuper
      inviteAccepted
      emailConfirmed
      lastLogin
      joinedAt
      deletedAt
      role {
        id
        user { id name email }
        roles { id name displayName  }
      }
    }`
    return await ctx.db.query.users(args, returnData)
  },
  async getAppUserInviteLink(parent, args, ctx, info) {
    let user = await ctx.db.query.users(args)
    let emailLink
    if (user && !user[0].inviteAccepted && user[0].inviteToken)
      emailLink = {
        id: user.id,
        url: ctx.graphqlAuthentication.mailAppUrl + '/register/' + user[0].email + '/' + user[0].inviteToken
      }

    return emailLink

  }
}

module.exports = { appUserQueries }
