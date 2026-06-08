const {
  toAppUser,
  userDataFromPrisma1
} = require('./prismaBridge')

const userInclude = {
  AppUserRole: {
    include: {
      AppRole: true,
      User: true
    }
  }
}

const prismaForContext = ctx => {
  if (!ctx.prisma) {
    throw new Error('Prisma Client is not attached to the context.')
  }
  return ctx.prisma
}

const normalizeUser = user => toAppUser(user)

const createUser = async(ctx, data) => {
  const prisma = prismaForContext(ctx)
  const user = await prisma.user.create({
    data: userDataFromPrisma1(data, { create: true }),
    include: userInclude
  })
  return normalizeUser(user)
}

const updateUser = async(ctx, userId, data) => {
  const prisma = prismaForContext(ctx)
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: userDataFromPrisma1(data),
    include: userInclude
  })
  return normalizeUser(user)
}

const createGraphqlAuthenticationAdapter = () => ({
  async findUserById(ctx, id) {
    const user = await prismaForContext(ctx).user.findUnique({
      where: {
        id
      },
      include: userInclude
    })
    return normalizeUser(user)
  },

  async findUserByEmail(ctx, email) {
    const user = await prismaForContext(ctx).user.findFirst({
      where: {
        email
      },
      include: userInclude
    })
    return normalizeUser(user)
  },

  async userExistsByEmail(ctx, email) {
    const count = await prismaForContext(ctx).user.count({
      where: {
        email
      }
    })
    return count > 0
  },

  createUser,
  createUserBySignup: createUser,
  createUserByInvite: createUser,
  updateUser,
  updateUserConfirmToken: updateUser,
  updateUserLastLogin: updateUser,
  updateUserPassword: updateUser,
  updateUserResetToken: updateUser,
  updateUserInfo: updateUser,
  updateUserCompleteInvite: updateUser
})

module.exports = {
  createGraphqlAuthenticationAdapter
}
