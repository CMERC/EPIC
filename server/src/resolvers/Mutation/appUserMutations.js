const {
  toAppUser,
  userDataFromPrisma1
} = require('../../services/prismaBridge')

const appUserMutations = {
  async deleteAppUser(parent, args, ctx) {
    var dateNow = new Date()
    var dateISO = dateNow.toISOString()

    if (ctx.prisma) {
      const user = await ctx.prisma.user.update({
        data: userDataFromPrisma1({
          deletedAt: dateNow
        }),
        where: {
          id: args.where.id
        },
        include: {
          AppUserRole: {
            include: {
              AppRole: true,
              User: true
            }
          }
        }
      })
      return toAppUser(user)
    }

    let deleteUserArgs = {
      data: {
        deletedAt: dateISO
      },
      where: { id: args.where.id }
    }
    return await ctx.db.mutation.updateUser(deleteUserArgs)
  }
}

module.exports = { appUserMutations }
