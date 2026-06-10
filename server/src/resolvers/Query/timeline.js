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

function clampLimit(first) {
  if (!first) return 160
  return Math.min(Math.max(first, 1), 300)
}

function textSummary(value, max = 180) {
  if (!value) return null
  const clean = String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}...`
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

const timelineQueries = {
  async exerciseTimelineItems(parent, args, ctx) {
    const limit = clampLimit(args.first)
    const sources = selectedSources(args.sources)
    const reads = []

    if (sources.includes('PLAN_EVENT')) {
      reads.push(readModel(ctx, 'planEvent', {
        orderBy: {
          startDate: 'asc'
        },
        take: limit
      }).then(rows => rows.map(row => makeItem('PLAN_EVENT', row, {
        title: row.name || 'Plan event',
        summary: row.description || row.exerciseGuidance,
        status: row.type || row.method,
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
        where: {
          deletedAt: null
        },
        orderBy: {
          startDate: 'asc'
        },
        take: limit
      }).then(rows => rows.map(row => makeItem('PLAN_INJECT', row, {
        title: row.number ? `#${row.number} ${row.title}` : row.title,
        summary: row.description || row.trigger || row.response,
        actor: [row.from, row.to].filter(Boolean).join(' -> ') || null,
        status: row.type,
        start: row.startDate || row.createdAt,
        end: row.responseDate,
        metadata: {
          number: row.number,
          trigger: row.trigger,
          response: row.response
        }
      }))))
    }

    if (sources.includes('COMMAND')) {
      reads.push(readModel(ctx, 'commandMessage', {
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      }).then(rows => rows.map(row => makeItem('COMMAND', row, {
        title: row.title,
        summary: row.body || row.response,
        actor: row.fromName || row.createdBy,
        status: row.status,
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
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      }).then(rows => rows.map(row => makeItem('OBSERVE', row, {
        title: 'Observation',
        summary: row.text,
        actor: row.author,
        start: row.createdAt
      }))))
    }

    if (sources.includes('MEDIA')) {
      reads.push(readModel(ctx, 'mediaPost', {
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
