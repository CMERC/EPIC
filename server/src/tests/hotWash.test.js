const { hotWashQueries } = require('../resolvers/Query/hotWash')

test('hot wash evidence normalizes and sorts exercise artifacts', async() => {
  const ctx = {
    activeWorkspace: {
      name: 'alpha',
      displayName: 'Exercise Alpha'
    },
    prisma: {
      observePost: {
        findMany: jest.fn().mockResolvedValue([{
          id: 'observe-1',
          text: 'Observer finding',
          author: 'Observer',
          createdAt: new Date('2026-06-09T13:00:00Z')
        }])
      },
      commandMessage: {
        findMany: jest.fn().mockResolvedValue([{
          id: 'command-1',
          title: 'Acknowledge inject',
          body: 'Command body',
          response: 'Acknowledged',
          fromName: 'Controller',
          status: 'COMPLETED',
          priority: 'PRIORITY',
          completedAt: new Date('2026-06-09T15:00:00Z'),
          createdAt: new Date('2026-06-09T12:00:00Z')
        }])
      },
      planInject: {
        findMany: jest.fn().mockResolvedValue([{
          id: 'inject-1',
          number: 42,
          title: 'Inject title',
          response: 'Training audience response',
          type: 'MSEL',
          responseDate: new Date('2026-06-09T14:00:00Z'),
          createdAt: new Date('2026-06-09T11:00:00Z')
        }])
      },
      mediaPost: {
        findMany: jest.fn().mockResolvedValue([{
          id: 'media-1',
          title: 'Media post',
          text: 'Media evidence',
          isPublished: true,
          publishTime: new Date('2026-06-09T16:00:00Z'),
          MediaProfile: [{ username: 'public-affairs' }]
        }])
      }
    }
  }

  const result = await hotWashQueries.hotWashEvidence(null, {
    first: 10
  }, ctx)

  expect(result.workspaceName).toBe('alpha')
  expect(result.items.map(item => item.source)).toEqual([
    'MEDIA',
    'COMMAND',
    'INJECT',
    'OBSERVATION'
  ])
  expect(result.items[0]).toEqual(expect.objectContaining({
    id: 'MEDIA:media-1',
    actor: 'public-affairs',
    status: 'Published',
    tags: ['media', 'published']
  }))
  expect(ctx.prisma.planInject.findMany).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      deletedAt: null
    }
  }))
})
