const { clampQueryLimit } = require('../../services/queryLimits')

const DEFAULT_LIMIT = 120

function asDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function textSummary(value, max = 220) {
  if (!value) return null
  const clean = String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}...`
}

function limitFromArgs(args) {
  return clampQueryLimit(args.first, {
    defaultValue: DEFAULT_LIMIT,
    max: 300
  })
}

async function readModel(ctx, model, args) {
  if (!ctx.prisma || !ctx.prisma[model] || !ctx.prisma[model].findMany) {
    return []
  }

  try {
    return await ctx.prisma[model].findMany(args)
  } catch (error) {
    console.error(`Hot wash evidence source ${model} failed: ${error.message}`)
    return []
  }
}

function evidenceItem(source, raw, data) {
  const occurredAt = asDate(data.occurredAt)
  if (!occurredAt) return null

  return {
    id: `${source}:${raw.id}`,
    source,
    sourceId: raw.id,
    title: data.title,
    summary: textSummary(data.summary),
    actor: data.actor || null,
    status: data.status || null,
    occurredAt,
    routePath: data.routePath || null,
    tags: data.tags || []
  }
}

const hotWashQueries = {
  async hotWashEvidence(parent, args, ctx) {
    const limit = limitFromArgs(args)
    const [observations, commands, injects, mediaPosts] = await Promise.all([
      readModel(ctx, 'observePost', {
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      }),
      readModel(ctx, 'commandMessage', {
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      }),
      readModel(ctx, 'planInject', {
        where: {
          deletedAt: null
        },
        orderBy: {
          startDate: 'desc'
        },
        take: limit
      }),
      readModel(ctx, 'mediaPost', {
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        include: {
          MediaProfile: true
        }
      })
    ])

    const items = [
      ...observations.map(row => evidenceItem('OBSERVATION', row, {
        title: 'Observation',
        summary: row.text,
        actor: row.author,
        occurredAt: row.createdAt,
        routePath: '/observe',
        tags: ['observe']
      })),
      ...commands.map(row => evidenceItem('COMMAND', row, {
        title: row.title,
        summary: row.response || row.body,
        actor: row.fromName || row.createdBy,
        status: row.status,
        occurredAt: row.completedAt || row.acknowledgedAt || row.sentAt || row.createdAt,
        routePath: `/command/${row.id}`,
        tags: ['command', row.priority].filter(Boolean)
      })),
      ...injects.map(row => evidenceItem('INJECT', row, {
        title: row.number ? `#${row.number} ${row.title}` : row.title,
        summary: row.response || row.remarks || row.mitigation || row.description,
        actor: [row.from, row.to].filter(Boolean).join(' -> ') || null,
        status: row.type,
        occurredAt: row.responseDate || row.startDate || row.createdAt,
        routePath: `/plan/prepare/injects-list/view/${row.id}`,
        tags: ['inject', row.type].filter(Boolean)
      })),
      ...mediaPosts.map(row => {
        const profile = row.MediaProfile && row.MediaProfile[0]
        return evidenceItem('MEDIA', row, {
          title: row.title,
          summary: row.text,
          actor: profile ? (profile.name || profile.username) : null,
          status: row.isPublished ? 'Published' : 'Draft',
          occurredAt: row.publishTime || row.createTime || row.createdAt,
          routePath: '/media/posts/all',
          tags: ['media', row.isPublished ? 'published' : 'draft']
        })
      })
    ]
      .filter(Boolean)
      .sort((a, b) => b.occurredAt - a.occurredAt)
      .slice(0, limit)

    return {
      generatedAt: new Date(),
      workspaceName: ctx.activeWorkspace && ctx.activeWorkspace.name,
      workspaceDisplayName: ctx.activeWorkspace && ctx.activeWorkspace.displayName,
      items
    }
  }
}

module.exports = {
  hotWashQueries
}
