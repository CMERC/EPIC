async function countModel(ctx, model, args = {}) {
  if (!ctx.prisma || !ctx.prisma[model] || !ctx.prisma[model].count) {
    return 0
  }

  try {
    return await ctx.prisma[model].count(args)
  } catch (error) {
    console.error(`Exercise lifecycle count failed for ${model}: ${error.message}`)
    return 0
  }
}

async function findCurrentExercise(ctx) {
  if (!ctx.prisma || !ctx.prisma.planEvent || !ctx.prisma.planEvent.findFirst) {
    return null
  }

  const now = new Date()
  const activeExercise = await ctx.prisma.planEvent.findFirst({
    where: {
      startDate: {
        lte: now
      },
      OR: [
        {
          endDate: null
        },
        {
          endDate: {
            gte: now
          }
        }
      ]
    },
    orderBy: {
      startDate: 'desc'
    }
  })

  if (activeExercise) {
    return activeExercise
  }

  return ctx.prisma.planEvent.findFirst({
    orderBy: {
      startDate: 'asc'
    }
  })
}

function statusForExercise(exercise) {
  if (!exercise) {
    return 'NOT_CONFIGURED'
  }

  const now = Date.now()
  const start = exercise.startDate ? new Date(exercise.startDate).getTime() : null
  const end = exercise.endDate ? new Date(exercise.endDate).getTime() : null

  if (start && start > now) {
    return 'PLANNING'
  }
  if (end && end < now) {
    return 'COMPLETE'
  }
  return 'ACTIVE'
}

const exerciseLifecycleQueries = {
  async currentExerciseLifecycle(parent, args, ctx) {
    const exercise = await findCurrentExercise(ctx)
    const counts = await Promise.all([
      countModel(ctx, 'planEvent'),
      countModel(ctx, 'planInject', {
        where: {
          deletedAt: null
        }
      }),
      countModel(ctx, 'observePost'),
      countModel(ctx, 'commandMessage'),
      countModel(ctx, 'mediaPost'),
      countModel(ctx, 'chatMessage')
    ])

    return {
      id: exercise && exercise.id,
      name: exercise && exercise.name,
      status: statusForExercise(exercise),
      start: exercise && exercise.startDate,
      end: exercise && exercise.endDate,
      workspaceName: ctx.activeWorkspace && ctx.activeWorkspace.name,
      workspaceDisplayName: ctx.activeWorkspace && ctx.activeWorkspace.displayName,
      counts: {
        events: counts[0],
        injects: counts[1],
        observations: counts[2],
        commands: counts[3],
        mediaPosts: counts[4],
        chatMessages: counts[5]
      }
    }
  }
}

module.exports = {
  exerciseLifecycleQueries,
  _test: {
    statusForExercise
  }
}
