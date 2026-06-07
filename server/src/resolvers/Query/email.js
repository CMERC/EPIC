const { getUser } = require('graphql-authentication')
const {
  emailMessageArgsFromPrisma1,
  generatePrismaId,
  toEmailMessage
} = require('../../services/prismaBridge')

const emailQueries = {
  async emailMessages(parent, args, ctx, info) {

    let user = await getUser(ctx)
    if (ctx.prisma) {
      let mailbox = await ctx.prisma.emailMailbox.findFirst({
        where: {
          owner: user.email
        }
      })

      if (!mailbox) {
        mailbox = await ctx.prisma.emailMailbox.create({
          data: {
            id: generatePrismaId(),
            owner: user.email,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      }

      let emailMessageData = {
        ...args,
        where: {
          ...args.where,
          mailbox: {
            owner: user.email
          }
        }
      }

      const messages = await ctx.prisma.emailMessage.findMany({
        ...emailMessageArgsFromPrisma1(emailMessageData),
        include: {
          EmailMailbox: true,
          MediaFile: true
        }
      })
      return messages.map(toEmailMessage)
    }

    let ownerMailbox = {
      where: {
        owner: user.email
      }
    }

    let mailbox = await ctx.db.query.emailMailbox(ownerMailbox)

    if (!mailbox) {
      // Create the user mailbox if it doesn't exist
      let mailboxData = {
        data: {
          owner: user.email
        }
      }
      mailbox = await ctx.db.mutation.createEmailMailbox(mailboxData)
    }

    let emailMessageData = {
      ...args,
      where: {
        ...args.where,
        mailbox: {
          owner: user.email
        }
      }
    }

    return await ctx.db.query.emailMessages(emailMessageData, info)
  }
}

module.exports = { emailQueries }
