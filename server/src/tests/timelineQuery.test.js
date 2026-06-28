const { timelineQueries } = require('../resolvers/Query/timeline')

test('exercise timeline aggregates workspace activity by time', async() => {
  const ctx = {
    prisma: {
      planEvent: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'event-1',
            name: 'Start exercise',
            type: 'STARTEX',
            description: 'Training begins',
            startDate: new Date('2026-06-09T13:00:00Z'),
            endDate: new Date('2026-06-09T13:30:00Z')
          }
        ])
      },
      planInject: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'inject-1',
            number: 12,
            title: 'Inject title',
            description: 'A planned inject',
            type: 'Contingency Inject',
            startDate: new Date('2026-06-09T14:00:00Z'),
            response: 'Expected player response',
            createdAt: new Date('2026-06-09T12:00:00Z'),
            deletedAt: null,
            PlanEvent: [{ id: 'event-1', name: 'Start exercise' }],
            PlanInjectOwner: [{ title: 'Lead Controller' }],
            PlanLabel: [{ title: 'Pending' }],
            PlanTrainingObjective: [{
              PlanExerciseObjective: [{ title: 'Exercise objective one' }]
            }]
          }
        ])
      },
      commandMessage: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'cmd-1',
            title: 'Command task',
            body: 'Do the thing',
            status: 'SENT',
            priority: 'PRIORITY',
            fromName: 'Controller',
            createdAt: new Date('2026-06-09T14:30:00Z'),
            sentAt: new Date('2026-06-09T14:35:00Z')
          }
        ])
      },
      observePost: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'observe-1',
            text: 'Observer note',
            author: 'Observer',
            createdAt: new Date('2026-06-09T15:00:00Z')
          }
        ])
      },
      mediaPost: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'media-1',
            title: 'Media post',
            text: 'Published media',
            isPublished: true,
            publishTime: new Date('2026-06-09T16:00:00Z'),
            createdAt: new Date('2026-06-09T15:45:00Z'),
            MediaProfile: [{ username: 'media-user' }]
          }
        ])
      },
      chatMessage: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'chat-1',
            text: 'Chat note',
            author: 'Chatter',
            createdAt: new Date('2026-06-09T17:00:00Z'),
            ChatRoom: [{ title: 'Ops' }]
          }
        ])
      }
    }
  }

  const items = await timelineQueries.exerciseTimelineItems(null, {
    first: 20
  }, ctx)

  expect(items).toHaveLength(6)
  expect(items.map(item => item.source)).toEqual([
    'PLAN_EVENT',
    'PLAN_INJECT',
    'COMMAND',
    'OBSERVE',
    'MEDIA',
    'CHAT'
  ])
  expect(items[1]).toEqual(expect.objectContaining({
    lane: 'Injects',
    title: '#12 Inject title',
    routePath: '/plan/prepare/injects-list/view/inject-1',
    category: 'Contingency Inject',
    releaseStatus: 'Pending',
    controller: 'Lead Controller',
    objective: 'Exercise objective one',
    expectedAction: 'Expected player response',
    exerciseId: 'event-1',
    exerciseName: 'Start exercise'
  }))
  expect(ctx.prisma.mediaPost.findMany).toHaveBeenCalledWith(expect.objectContaining({
    include: {
      MediaProfile: true
    }
  }))
})

test('exercise timeline scopes selected exercise queries and links related command activity', async() => {
  const exercise = {
    id: 'exercise-1',
    name: 'Selected exercise',
    startDate: new Date('2026-06-09T12:00:00Z'),
    endDate: new Date('2026-06-09T18:00:00Z')
  }
  const ctx = {
    prisma: {
      planEvent: {
        findFirst: jest.fn().mockResolvedValue(exercise)
      },
      commandMessage: {
        findMany: jest.fn().mockResolvedValue([{
          id: 'cmd-1',
          title: 'Command task',
          body: 'Do the thing',
          status: 'SENT',
          priority: 'PRIORITY',
          fromName: 'Controller',
          recipientNames: 'Blue Cell',
          planInjectId: 'inject-1',
          planInjectNumber: 14,
          planInjectTitle: 'Inject title',
          dueAt: new Date('2026-06-09T14:30:00Z'),
          createdAt: new Date('2026-06-09T14:00:00Z')
        }])
      }
    }
  }

  const items = await timelineQueries.exerciseTimelineItems(null, {
    exerciseId: 'exercise-1',
    sources: ['COMMAND'],
    first: 20
  }, ctx)

  expect(ctx.prisma.planEvent.findFirst).toHaveBeenCalledWith({
    where: {
      id: 'exercise-1'
    }
  })
  expect(ctx.prisma.commandMessage.findMany).toHaveBeenCalledWith(expect.objectContaining({
    where: expect.objectContaining({
      OR: expect.arrayContaining([
        {
          createdAt: {
            gte: exercise.startDate,
            lte: exercise.endDate
          }
        }
      ])
    })
  }))
  expect(items[0]).toEqual(expect.objectContaining({
    parentId: 'PLAN_INJECT:inject-1',
    parentTitle: '#14 Inject title',
    exerciseId: 'exercise-1',
    exerciseName: 'Selected exercise',
    recipient: 'Blue Cell'
  }))
})

test('exercise timeline applies source and date filters', async() => {
  const ctx = {
    prisma: {
      commandMessage: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'cmd-old',
            title: 'Old command',
            body: '',
            status: 'SENT',
            createdAt: new Date('2026-06-08T12:00:00Z')
          },
          {
            id: 'cmd-new',
            title: 'New command',
            body: '',
            status: 'SENT',
            createdAt: new Date('2026-06-09T12:00:00Z')
          }
        ])
      }
    }
  }

  const items = await timelineQueries.exerciseTimelineItems(null, {
    sources: ['COMMAND'],
    start: new Date('2026-06-09T00:00:00Z')
  }, ctx)

  expect(items).toHaveLength(1)
  expect(items[0].sourceId).toBe('cmd-new')
  expect(ctx.prisma.commandMessage.findMany).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      OR: expect.arrayContaining([
        {
          createdAt: {
            gte: new Date('2026-06-09T00:00:00Z')
          }
        }
      ])
    }
  }))
})

test('exercise timeline caps oversized first values before database reads', async() => {
  const ctx = {
    prisma: {
      observePost: {
        findMany: jest.fn().mockResolvedValue([])
      }
    }
  }

  await timelineQueries.exerciseTimelineItems(null, {
    sources: ['OBSERVE'],
    first: 10000
  }, ctx)

  expect(ctx.prisma.observePost.findMany).toHaveBeenCalledWith(expect.objectContaining({
    take: 300
  }))
})
