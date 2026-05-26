const appUserMutations = {
  async deleteAppUser(parent, args, ctx) {
    var dateNow = new Date()
    var dateISO = dateNow.toISOString()

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
