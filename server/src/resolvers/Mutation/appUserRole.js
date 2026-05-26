const appUserRole = {
  async upsertAppUserRole(parent, args, ctx, info) {
    let userId = args.create.user.connect.id
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
