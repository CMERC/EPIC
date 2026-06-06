const { getUser } = require('graphql-authentication')
const { commandRequest } = require('../commandRequest')

const COMMAND_FIELDS = `{
  id
  createdAt
  updatedAt
  title
  body
  fromName
  fromEmail
  recipientNames
  recipientEmails
  priority
  status
  dueAt
  sentAt
  acknowledgedAt
  completedAt
  response
  planInjectId
  planInjectNumber
  planInjectTitle
  createdBy
  updatedBy
}`

function textFilter(query) {
  if (!query) return null
  return {
    OR: [
      { title_contains: query },
      { body_contains: query },
      { recipientNames_contains: query },
      { recipientEmails_contains: query },
      { planInjectTitle_contains: query }
    ]
  }
}

function andWhere(parts) {
  const filters = parts.filter(Boolean)
  if (filters.length === 0) return {}
  if (filters.length === 1) return filters[0]
  return { AND: filters }
}

async function currentUser(ctx) {
  try {
    return await getUser(ctx)
  } catch (error) {
    return null
  }
}

const commandQueries = {
  async commandMessages(parent, args, ctx) {
    const user = await currentUser(ctx)
    const scope = args.scope || 'INBOX'
    const filters = []

    if (args.status) {
      filters.push({ status: args.status })
    }

    if (args.query) {
      filters.push(textFilter(args.query))
    }

    if (scope === 'INBOX' && user) {
      filters.push({
        OR: [
          { recipientEmails_contains: user.email },
          { recipientNames_contains: user.name }
        ]
      })
    } else if (scope === 'OUTBOX' && user) {
      filters.push({ fromEmail: user.email })
    }

    const variables = {
      where: andWhere(filters),
      orderBy: args.orderBy || 'createdAt_DESC',
      first: args.first || 100,
      skip: args.skip || 0
    }

    return commandRequest(
      ctx,
      `query CommandMessages(
        $where: CommandMessageWhereInput
        $orderBy: CommandMessageOrderByInput
        $first: Int
        $skip: Int
      ) {
        commandMessages(where: $where, orderBy: $orderBy, first: $first, skip: $skip) ${COMMAND_FIELDS}
      }`,
      variables
    ).then(result => result.commandMessages)
  },

  commandMessage(parent, args, ctx) {
    return commandRequest(
      ctx,
      `query CommandMessage($where: CommandMessageWhereUniqueInput!) {
        commandMessage(where: $where) ${COMMAND_FIELDS}
      }`,
      args
    ).then(result => result.commandMessage)
  }
}

module.exports = {
  commandQueries,
  COMMAND_FIELDS
}
