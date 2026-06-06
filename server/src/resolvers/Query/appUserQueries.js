const {
  appUserArgsFromPrisma1,
  toAppUser,
  userWhereFromPrisma1
} = require('../../services/prismaBridge')

const appUserQueries = {
  async appUsers(parent, args, ctx, info) {
    if (ctx.prisma) {
      const users = await ctx.prisma.user.findMany({
        ...appUserArgsFromPrisma1(args),
        include: {
          AppUserRole: {
            include: {
              AppRole: true,
              User: true
            }
          }
        }
      })
      return users.map(toAppUser)
    }

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
    if (ctx.prisma) {
      const user = await ctx.prisma.user.findFirst({
        where: userWhereFromPrisma1(args.where)
      })
      if (user && !user.inviteAccepted && user.inviteToken) {
        return {
          id: user.id,
          url: ctx.graphqlAuthentication.mailAppUrl + '/register/' + user.email + '/' + user.inviteToken
        }
      }

      return null
    }

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
