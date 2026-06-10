const {
  _test,
  exerciseLifecycleQueries
} = require('../resolvers/Query/exerciseLifecycle')

test('exercise lifecycle status reflects planning, active, complete, and missing exercises', () => {
  const now = Date.now()

  expect(_test.statusForExercise(null)).toBe('NOT_CONFIGURED')
  expect(_test.statusForExercise({
    startDate: new Date(now + 60 * 60 * 1000)
  })).toBe('PLANNING')
  expect(_test.statusForExercise({
    startDate: new Date(now - 60 * 60 * 1000),
    endDate: new Date(now + 60 * 60 * 1000)
  })).toBe('ACTIVE')
  expect(_test.statusForExercise({
    startDate: new Date(now - 2 * 60 * 60 * 1000),
    endDate: new Date(now - 60 * 60 * 1000)
  })).toBe('COMPLETE')
})

test('current exercise lifecycle summarizes workspace exercise artifacts', async() => {
  const activeExercise = {
    id: 'event-1',
    name: 'Exercise Alpha',
    startDate: new Date(Date.now() - 60 * 1000),
    endDate: new Date(Date.now() + 60 * 1000)
  }
  const ctx = {
    activeWorkspace: {
      name: 'alpha',
      displayName: 'Exercise Alpha Workspace'
    },
    prisma: {
      planEvent: {
        findFirst: jest.fn().mockResolvedValue(activeExercise),
        count: jest.fn().mockResolvedValue(2)
      },
      planInject: {
        count: jest.fn().mockResolvedValue(3)
      },
      observePost: {
        count: jest.fn().mockResolvedValue(4)
      },
      commandMessage: {
        count: jest.fn().mockResolvedValue(5)
      },
      mediaPost: {
        count: jest.fn().mockResolvedValue(6)
      },
      chatMessage: {
        count: jest.fn().mockResolvedValue(7)
      }
    }
  }

  const result = await exerciseLifecycleQueries.currentExerciseLifecycle(null, {}, ctx)

  expect(ctx.prisma.planEvent.findFirst).toHaveBeenCalledWith(expect.objectContaining({
    where: expect.objectContaining({
      startDate: expect.any(Object)
    })
  }))
  expect(ctx.prisma.planInject.count).toHaveBeenCalledWith({
    where: {
      deletedAt: null
    }
  })
  expect(result).toEqual({
    id: 'event-1',
    name: 'Exercise Alpha',
    status: 'ACTIVE',
    start: activeExercise.startDate,
    end: activeExercise.endDate,
    workspaceName: 'alpha',
    workspaceDisplayName: 'Exercise Alpha Workspace',
    counts: {
      events: 2,
      injects: 3,
      observations: 4,
      commands: 5,
      mediaPosts: 6,
      chatMessages: 7
    }
  })
})
