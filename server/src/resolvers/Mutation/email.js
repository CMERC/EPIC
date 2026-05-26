const { getUser } = require('graphql-authentication')

async function createMailbox(email, ctx) {
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

    let sentMessage = await ctx.db.mutation.createEmailMessage(emailMessageData)


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

    await ctx.db.mutation.createEmailMessage(inboxMessageData)


    return sentMessage
  }
}

module.exports = { emailMutations }
