const logger = require('../logger')
const { getCurrentUser } = require('./authContext')

function referenceId(args, result) {
  return args && args.where && args.where.id ||
    result && result.id ||
    args && args.data && args.data.id ||
    null
}

function actorName(user) {
  if (!user) return 'unknown user'
  return user.name || user.email || user.id || 'unknown user'
}

async function recordAuditEvent(ctx, info, args, result) {
  if (!ctx.db || !ctx.db.mutation || !ctx.db.mutation.createActivityStream) {
    return
  }

  try {
    const user = await getCurrentUser(ctx).catch(() => null)
    const fieldName = info && info.fieldName ? info.fieldName : 'unknownAction'
    const objectId = referenceId(args, result)
    const name = actorName(user)
    await ctx.db.mutation.createActivityStream({
      data: {
        summary: `user: ${name} action: ${fieldName}${objectId ? ` objectID: ${objectId}` : ''}`,
        type: fieldName,
        actor: user && user.id,
        name,
        referenceID: objectId
      }
    })
  } catch (error) {
    logger.error(error.message)
  }
}

module.exports = {
  recordAuditEvent,
  _test: {
    referenceId,
    actorName
  }
}
