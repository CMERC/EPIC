const { getUser } = require('graphql-authentication')
const {
  emailMailboxDataFromPrisma1,
  emailMessageDataFromPrisma1,
  toEmailMessage
} = require('../../services/prismaBridge')

async function createMailbox(email, ctx) {
  if (ctx.prisma) {
    let mailbox = await ctx.prisma.emailMailbox.findFirst({
      where: {
        owner: email
      }
    })

    if (!mailbox) {
      mailbox = await ctx.prisma.emailMailbox.create({
        data: emailMailboxDataFromPrisma1({
          owner: email
        }, {
          create: true
        })
      })
    }
    return mailbox
  }

  let ownerMailbox = {
    where: {
      owner: email
    }
  }
  let mailbox = await ctx.db.query.emailMailbox(ownerMailbox)

  if (!mailbox) {
    // Create the user mailbox if it doesn't exist
    let mailboxData = {
      data: {
        owner: email
      }
    }

    mailbox = await ctx.db.mutation.createEmailMailbox(mailboxData)
  }
}
const emailMutations = {
  async composeEmailMessage(parent, args, ctx, info) {

    let user = await getUser(ctx)

    await createMailbox(user.email, ctx)

    //Store the email message in current users mailbox as sent
    let emailMessageData = {
      data: {
        ...args.data,
        status: 'READ',
        folder: 'SENT',
        mailbox: { connect: { owner: user.email } }
      }
    }

    let sentMessage
    if (ctx.prisma) {
      sentMessage = await ctx.prisma.emailMessage.create({
        data: emailMessageDataFromPrisma1(emailMessageData.data, { create: true }),
        include: {
          EmailMailbox: true,
          MediaFile: true
        }
      })
    } else {
      sentMessage = await ctx.db.mutation.createEmailMessage(emailMessageData)
    }


    //Store the email message in outgoing "to:" user inbox

    await createMailbox(args.data.to, ctx)

    let inboxMessageData = {
      data: {
        ...args.data,
        status: 'UNREAD',
        folder: 'INBOX',
        mailbox: { connect: { owner: args.data.to } }
      }
    }

    if (ctx.prisma) {
      await ctx.prisma.emailMessage.create({
        data: emailMessageDataFromPrisma1(inboxMessageData.data, { create: true })
      })
    } else {
      await ctx.db.mutation.createEmailMessage(inboxMessageData)
    }


    return ctx.prisma ? toEmailMessage(sentMessage) : sentMessage
  }
}

module.exports = { emailMutations, _test: { createMailbox } }
