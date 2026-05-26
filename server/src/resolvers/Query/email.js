const { getUser } = require('graphql-authentication')

const emailQueries = {
  async emailMessages(parent, args, ctx, info) {

    let user = await getUser(ctx)

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
