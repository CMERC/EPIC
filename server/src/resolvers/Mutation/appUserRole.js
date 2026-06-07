const {
  appUserRoleDataFromPrisma1,
  toAppUserRole
} = require('../../services/prismaBridge')

const appUserRole = {
  async upsertAppUserRole(parent, args, ctx, info) {
    let userId = args.create.user.connect.id
    if (ctx.prisma) {
      const activeUser = await ctx.prisma.user.findUnique({
        where: {
          id: userId
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
      const roleLinks = activeUser && Array.isArray(activeUser.AppUserRole)
        ? activeUser.AppUserRole
        : []
      if (roleLinks[0] && roleLinks[0].id) {
        await ctx.prisma.appUserRole.delete({
          where: {
            id: roleLinks[0].id
          }
        })
      }

      const role = await ctx.prisma.appUserRole.upsert({
        where: args.where,
        create: appUserRoleDataFromPrisma1(args.create, { create: true }),
        update: appUserRoleDataFromPrisma1(args.update),
        include: {
          AppRole: true,
          User: true
        }
      })
      return toAppUserRole(role)
    }

    const activeUser = await ctx.db.query.user({ where: { id: userId } }, '{role { id roles {name}}}')
    if (activeUser.role && activeUser.role.roles && activeUser.role.roles.length > 0) {
      // Remove existing list
      let deleteUserArgs = {
        where: {
          id: activeUser.role.id
        }
      }
      await ctx.db.mutation.deleteAppUserRole(deleteUserArgs)
    }
    // Update with new list
    return await ctx.db.mutation.upsertAppUserRole(args, info)
  }
}

module.exports = { appUserRole }
