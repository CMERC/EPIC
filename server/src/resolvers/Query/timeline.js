const { clampQueryLimit, dateRangeWhere, mergeWhere } = require('../../services/queryLimits')

const DEFAULT_SOURCES = [
  'PLAN_EVENT',
  'PLAN_INJECT',
  'COMMAND',
  'OBSERVE',
  'MEDIA',
  'CHAT'
]

const SOURCE_CONFIG = {
  PLAN_EVENT: {
    lane: 'Plan Events',
    accent: '#38bdf8',
    routePath: item => `/plan/prepare/events/view/${item.id}`
  },
  PLAN_INJECT: {
    lane: 'Injects',
    accent: '#f59e0b',
    routePath: item => `/plan/prepare/injects-list/view/${item.id}`
  },
  COMMAND: {
    lane: 'Commands',
    accent: '#ef4444',
    routePath: item => `/command/${item.id}`
  },
  OBSERVE: {
    lane: 'Observations',
    accent: '#22c55e',
    routePath: () => '/observe'
  },
  MEDIA: {
    lane: 'Media',
    accent: '#8b5cf6',
    routePath: () => '/media/posts/all'
  },
  CHAT: {
    lane: 'Chat',
    accent: '#14b8a6',
    routePath: () => '/chat'
  }
}

function selectedSources(sources) {
  if (!sources || sources.length === 0) return DEFAULT_SOURCES
  return DEFAULT_SOURCES.filter(source => sources.includes(source))
}

function textSummary(value, max = 180) {
  if (!value) return null
  const clean = String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}...`
}

function firstRelated(row, relationName) {
  const value = row && row[relationName]
  return Array.isArray(value) && value.length ? value[0] : null
}

function titleFromRelated(row, relationName, field = 'title') {
  const related = firstRelated(row, relationName)
  return related && related[field] ? related[field] : null
}

function injectCategory(row) {
  const type = String(row.type || '').toLowerCase()
  if (type.includes('contingency')) return 'Contingency Inject'
  if (type.includes('expected')) return 'Expected Action'
  if (type.includes('context')) return 'Contextual Inject'
  if (type.includes('information') || type.includes('info')) return 'Information Update'
  return row.type || 'Inject'
}

function releaseStatus(row) {
  const status = titleFromRelated(row, 'PlanLabel') || row.status
  if (status) return status
  if (asDate(row.responseDate)) return 'Completed'
  if (asDate(row.startDate) && asDate(row.startDate) < new Date()) return 'Due'
  return 'Planned'
}

function objectiveSummary(row) {
  const objectives = Array.isArray(row.PlanTrainingObjective) ? row.PlanTrainingObjective : []
  const titles = objectives
    .map(objective => {
      const exerciseObjective = firstRelated(objective, 'PlanExerciseObjective')
      return exerciseObjective && (exerciseObjective.title || exerciseObjective.exerciseObjective)
    })
    .filter(Boolean)

  return titles.length ? titles.join(', ') : null
}

function exerciseScopeWhere(exercise) {
  if (!exercise) return null
  return dateRangeWhere(['startDate', 'endDate', 'createdAt'], exercise.startDate, exercise.endDate)
}

function sourceExerciseRange(fields, exercise) {
  if (!exercise) return null
  if (!exercise.startDate && !exercise.endDate) return null
  return dateRangeWhere(fields, exercise.startDate, exercise.endDate)
}

function asDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function inRequestedRange(item, start, end) {
  const itemStart = asDate(item.start)
  if (!itemStart) return false
  const itemEnd = asDate(item.end) || itemStart
  const startDate = asDate(start)
  const endDate = asDate(end)

  if (startDate && itemEnd < startDate) return false
  if (endDate && itemStart > endDate) return false
  return true
}

function makeItem(source, raw, overrides) {
  const config = SOURCE_CONFIG[source]
  const start = asDate(overrides.start)
  if (!start) return null

  return {
    id: `${source}:${raw.id}`,
    source,
    sourceId: raw.id,
    lane: config.lane,
    title: overrides.title || config.lane,
    summary: textSummary(overrides.summary),
    actor: overrides.actor || null,
    status: overrides.status || null,
    category: overrides.category || null,
    releaseStatus: overrides.releaseStatus || overrides.status || null,
    visibility: overrides.visibility || null,
    objective: overrides.objective || null,
    expectedAction: textSummary(overrides.expectedAction, 260),
    controller: overrides.controller || null,
    recipient: overrides.recipient || null,
    exerciseId: overrides.exerciseId || null,
    exerciseName: overrides.exerciseName || null,
    parentId: overrides.parentId || null,
    parentTitle: overrides.parentTitle || null,
    plannedTime: asDate(overrides.plannedTime),
    actualTime: asDate(overrides.actualTime),
    mapPath: overrides.mapPath || null,
    keyEvent: Boolean(overrides.keyEvent),
    start,
    end: asDate(overrides.end),
    routeName: overrides.routeName || null,
    routePath: overrides.routePath || config.routePath(raw),
    accent: overrides.accent || config.accent,
    metadata: overrides.metadata || {}
  }
}

async function readModel(ctx, model, args) {
  if (!ctx.prisma || !ctx.prisma[model] || !ctx.prisma[model].findMany) {
    return []
  }

  try {
    return await ctx.prisma[model].findMany(args)
  } catch (error) {
    console.error(`Timeline source ${model} failed: ${error.message}`)
    return []
  }
}

async function findExercise(ctx, exerciseId) {
  if (!exerciseId || !ctx.prisma || !ctx.prisma.planEvent || !ctx.prisma.planEvent.findFirst) {
    return null
  }

  try {
    return await ctx.prisma.planEvent.findFirst({
      where: {
        id: exerciseId
      }
    })
  } catch (error) {
    console.error(`Timeline exercise scope failed: ${error.message}`)
    return null
  }
}

const timelineQueries = {
  async exerciseTimelineItems(parent, args, ctx) {
    const limit = clampQueryLimit(args.first, {
      defaultValue: 160,
      max: 300
    })
    const sources = selectedSources(args.sources)
    const exercise = await findExercise(ctx, args.exerciseId)
    const reads = []

    if (sources.includes('PLAN_EVENT')) {
      reads.push(readModel(ctx, 'planEvent', {
        where: mergeWhere(
          args.exerciseId ? { id: args.exerciseId } : null,
          exerciseScopeWhere(exercise),
          dateRangeWhere(['startDate', 'endDate', 'createdAt'], args.start, args.end)
        ),
        orderBy: {
          startDate: 'asc'
        },
        take: limit
      }).then(rows => rows.map(row => makeItem('PLAN_EVENT', row, {
        title: row.name || 'Plan event',
        summary: row.description || row.exerciseGuidance,
        status: row.type || row.method,
        category: row.type || 'Exercise Event',
        releaseStatus: 'Scheduled',
        visibility: 'Controller/Evaluator',
        expectedAction: row.exerciseGuidance || row.description,
        exerciseId: row.id,
        exerciseName: row.name,
        plannedTime: row.startDate,
        actualTime: row.startDate,
        keyEvent: true,
        start: row.startDate || row.createdAt,
        end: row.endDate,
        accent: row.color || SOURCE_CONFIG.PLAN_EVENT.accent,
        metadata: {
          type: row.type,
          method: row.method
        }
      }))))
    }

    if (sources.includes('PLAN_INJECT')) {
      reads.push(readModel(ctx, 'planInject', {
        where: mergeWhere({
          deletedAt: null
        },
        args.exerciseId ? {
          OR: [
            {
              PlanEvent: {
                some: {
                  id: args.exerciseId
                }
              }
            },
            sourceExerciseRange(['startDate', 'responseDate', 'createdAt'], exercise)
          ].filter(Boolean)
        } : null,
        dateRangeWhere(['startDate', 'responseDate', 'createdAt'], args.start, args.end)),
        orderBy: {
          startDate: 'asc'
        },
        take: limit,
        include: {
          PlanEvent: true,
          PlanInjectOwner: true,
          PlanLabel: true,
          PlanMethod: true,
          PlanTrainingObjective: {
            include: {
              PlanExerciseObjective: true
            }
          },
          Location: true
        }
      }).then(rows => rows.map(row => makeItem('PLAN_INJECT', row, {
        title: row.number ? `#${row.number} ${row.title}` : row.title,
        summary: row.description || row.trigger || row.response,
        actor: [row.from, row.to].filter(Boolean).join(' -> ') || null,
        status: releaseStatus(row),
        category: injectCategory(row),
        releaseStatus: releaseStatus(row),
        visibility: 'Controller/Evaluator',
        objective: objectiveSummary(row),
        expectedAction: row.response || row.mitigation || row.trigger,
        controller: titleFromRelated(row, 'PlanInjectOwner'),
        recipient: row.to,
        exerciseId: (firstRelated(row, 'PlanEvent') && firstRelated(row, 'PlanEvent').id) || args.exerciseId || null,
        exerciseName: (firstRelated(row, 'PlanEvent') && firstRelated(row, 'PlanEvent').name) || (exercise && exercise.name),
        plannedTime: row.startDate,
        actualTime: row.responseDate,
        mapPath: row.Location && row.Location.length ? '/map' : null,
        keyEvent: Boolean(row.number && row.number % 10 === 0),
        start: row.startDate || row.createdAt,
        end: row.responseDate,
        metadata: {
          number: row.number,
          trigger: row.trigger,
          response: row.response,
          method: titleFromRelated(row, 'PlanMethod', 'name'),
          remarks: row.remarks
        }
      }))))
    }

    if (sources.includes('COMMAND')) {
      reads.push(readModel(ctx, 'commandMessage', {
        where: mergeWhere(
          sourceExerciseRange(['sentAt', 'createdAt', 'completedAt', 'acknowledgedAt', 'dueAt'], exercise),
          dateRangeWhere(['sentAt', 'createdAt', 'completedAt', 'acknowledgedAt', 'dueAt'], args.start, args.end)
        ),
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      }).then(rows => rows.map(row => makeItem('COMMAND', row, {
        title: row.title,
        summary: row.body || row.response,
        actor: row.fromName || row.createdBy,
        status: row.status,
        category: row.priority || 'Command',
        releaseStatus: row.status,
        visibility: 'Controller/Participant',
        expectedAction: row.body,
        controller: row.fromName || row.createdBy,
        recipient: row.recipientNames,
        exerciseId: args.exerciseId || null,
        exerciseName: exercise && exercise.name,
        parentId: row.planInjectId ? `PLAN_INJECT:${row.planInjectId}` : null,
        parentTitle: row.planInjectNumber ? `#${row.planInjectNumber} ${row.planInjectTitle || ''}`.trim() : row.planInjectTitle,
        plannedTime: row.dueAt || row.sentAt || row.createdAt,
        actualTime: row.completedAt || row.acknowledgedAt || row.sentAt,
        start: row.sentAt || row.createdAt,
        end: row.completedAt || row.acknowledgedAt || row.dueAt,
        metadata: {
          priority: row.priority,
          recipients: row.recipientNames,
          planInjectId: row.planInjectId
        }
      }))))
    }

    if (sources.includes('OBSERVE')) {
      reads.push(readModel(ctx, 'observePost', {
        where: mergeWhere(
          sourceExerciseRange(['createdAt'], exercise),
          dateRangeWhere(['createdAt'], args.start, args.end)
        ),
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      }).then(rows => rows.map(row => makeItem('OBSERVE', row, {
        title: 'Observation',
        summary: row.text,
        actor: row.author,
        category: 'Observation',
        releaseStatus: 'Captured',
        visibility: 'Evaluator',
        exerciseId: args.exerciseId || null,
        exerciseName: exercise && exercise.name,
        actualTime: row.createdAt,
        start: row.createdAt
      }))))
    }

    if (sources.includes('MEDIA')) {
      reads.push(readModel(ctx, 'mediaPost', {
        where: mergeWhere(
          sourceExerciseRange(['publishTime', 'createTime', 'createdAt'], exercise),
          dateRangeWhere(['publishTime', 'createTime', 'createdAt'], args.start, args.end)
        ),
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        include: {
          MediaProfile: true
        }
      }).then(rows => rows.map(row => {
        const profile = row.MediaProfile && row.MediaProfile[0]
        return makeItem('MEDIA', row, {
          title: row.title,
          summary: row.text,
          actor: profile ? (profile.name || profile.username) : null,
          status: row.isPublished ? 'Published' : 'Draft',
          category: row.isUserGenerated ? 'User Media' : 'Simulated Media',
          releaseStatus: row.isPublished ? 'Published' : 'Draft',
          visibility: row.isPublished ? 'Player/Public' : 'Controller',
          exerciseId: args.exerciseId || null,
          exerciseName: exercise && exercise.name,
          actualTime: row.publishTime || row.createTime || row.createdAt,
          mapPath: row.location ? '/map' : null,
          start: row.publishTime || row.createTime || row.createdAt,
          metadata: {
            url: row.url,
            isUserGenerated: row.isUserGenerated
          }
        })
      })))
    }

    if (sources.includes('CHAT')) {
      reads.push(readModel(ctx, 'chatMessage', {
        where: mergeWhere(
          sourceExerciseRange(['createdAt'], exercise),
          dateRangeWhere(['createdAt'], args.start, args.end)
        ),
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        include: {
          ChatRoom: true
        }
      }).then(rows => rows.map(row => makeItem('CHAT', row, {
        title: row.ChatRoom && row.ChatRoom[0] ? row.ChatRoom[0].title : 'Chat message',
        summary: row.text,
        actor: row.author,
        category: 'Chat',
        releaseStatus: 'Posted',
        visibility: 'Participant',
        exerciseId: args.exerciseId || null,
        exerciseName: exercise && exercise.name,
        actualTime: row.createdAt,
        start: row.createdAt
      }))))
    }

    const results = await Promise.all(reads)
    return results
      .flat()
      .filter(Boolean)
      .filter(item => inRequestedRange(item, args.start, args.end))
      .sort((a, b) => asDate(a.start) - asDate(b.start))
      .slice(0, limit)
  }
}

module.exports = { timelineQueries }
