const { getUser } = require('graphql-authentication')
const { COMMAND_FIELDS } = require('../Query/command')
const { commandRequest } = require('../commandRequest')

async function currentUser(ctx) {
  try {
    return await getUser(ctx)
  } catch (error) {
    return null
  }
}

async function writeActivity(ctx, user, command, action) {
  if (!command || !command.id) return

  try {
    await ctx.db.mutation.createActivityStream({
      data: {
        summary: `user: ${user ? user.name : 'Unknown'} action: ${action} objectID: ${command.id}`,
        type: action,
        actor: user ? user.id : '',
        name: user ? user.name : '',
        referenceID: command.id,
        url: `/command/${command.id}`,
        content: command.title
      }
    })
  } catch (error) {
    // Activity should not block command traffic.
  }
}

function sendDefaults(data, user) {
  const now = new Date().toISOString()
  const status = data.status || 'SENT'
  return {
    ...data,
    status,
    sentAt: status === 'DRAFT' ? null : now,
    fromName: user ? user.name : data.fromName,
    fromEmail: user ? user.email : data.fromEmail,
    createdBy: user ? user.id : null,
    updatedBy: user ? user.id : null
  }
}

const commandMutations = {
  async createCommandMessage(parent, args, ctx) {
    const user = await currentUser(ctx)
    const data = sendDefaults(args.data, user)
    const result = await commandRequest(
      ctx,
      `mutation CreateCommandMessage($data: CommandMessageCreateInput!) {
        createCommandMessage(data: $data) ${COMMAND_FIELDS}
      }`,
      { data }
    ).then(response => response.createCommandMessage)

    await writeActivity(ctx, user, result, 'createCommandMessage')
    return result
  },

  async updateCommandMessage(parent, args, ctx) {
    const user = await currentUser(ctx)
    const data = {
      ...args.data,
      updatedBy: user ? user.id : null
    }

    const result = await commandRequest(
      ctx,
      `mutation UpdateCommandMessage(
        $data: CommandMessageUpdateInput!
        $where: CommandMessageWhereUniqueInput!
      ) {
        updateCommandMessage(data: $data, where: $where) ${COMMAND_FIELDS}
      }`,
      { data, where: args.where }
    ).then(response => response.updateCommandMessage)

    await writeActivity(ctx, user, result, 'updateCommandMessage')
    return result
  },

  async acknowledgeCommandMessage(parent, args, ctx) {
    const user = await currentUser(ctx)
    const data = {
      status: 'ACKNOWLEDGED',
      acknowledgedAt: new Date().toISOString(),
      updatedBy: user ? user.id : null
    }

    const result = await commandRequest(
      ctx,
      `mutation AcknowledgeCommandMessage(
        $data: CommandMessageUpdateInput!
        $where: CommandMessageWhereUniqueInput!
      ) {
        updateCommandMessage(data: $data, where: $where) ${COMMAND_FIELDS}
      }`,
      { data, where: args.where }
    ).then(response => response.updateCommandMessage)

    await writeActivity(ctx, user, result, 'acknowledgeCommandMessage')
    return result
  },

  async completeCommandMessage(parent, args, ctx) {
    const user = await currentUser(ctx)
    const data = {
      response: args.data.response,
      status: args.data.status || 'COMPLETED',
      completedAt: new Date().toISOString(),
      updatedBy: user ? user.id : null
    }

    const result = await commandRequest(
      ctx,
      `mutation CompleteCommandMessage(
        $data: CommandMessageUpdateInput!
        $where: CommandMessageWhereUniqueInput!
      ) {
        updateCommandMessage(data: $data, where: $where) ${COMMAND_FIELDS}
      }`,
      { data, where: args.where }
    ).then(response => response.updateCommandMessage)

    await writeActivity(ctx, user, result, 'completeCommandMessage')
    return result
  },

  async deleteCommandMessage(parent, args, ctx) {
    const user = await currentUser(ctx)
    const result = await commandRequest(
      ctx,
      `mutation DeleteCommandMessage($where: CommandMessageWhereUniqueInput!) {
        deleteCommandMessage(where: $where) ${COMMAND_FIELDS}
      }`,
      args
    ).then(response => response.deleteCommandMessage)

    await writeActivity(ctx, user, result, 'deleteCommandMessage')
    return result
  }
}

module.exports = {
  commandMutations
}
