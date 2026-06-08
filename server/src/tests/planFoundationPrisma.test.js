const { Query } = require('../resolvers/Query')
const { prismaForward } = require('../resolvers/Mutation/prismaForward')

test('planReasonsPublic reads through Prisma Client with public input shape', async() => {
  const findMany = jest.fn().mockResolvedValue([{
    id: 'reason-1',
    title: 'Training Objective'
  }])

  const result = await Query.planReasonsPublic(null, {
    data: {
      planReason: {
        title_contains: 'Training'
      }
    },
    orderBy: 'title_ASC'
  }, {
    prisma: {
      planReason: {
        findMany
      }
    }
  })

  expect(findMany).toHaveBeenCalledWith({
    where: {
      title: {
        contains: 'Training'
      }
    },
    orderBy: {
      title: 'asc'
    }
  })
  expect(result[0].title).toBe('Training Objective')
})

test('planFundingSourcesConnection returns Prisma Client connection shape', async() => {
  const findMany = jest.fn().mockResolvedValue([{
    id: 'funding-1',
    primarySource: 'Federal',
    subSource: 'Grant',
    amount: '1000'
  }])
  const count = jest.fn().mockResolvedValue(1)

  const result = await Query.planFundingSourcesConnection(null, {
    where: {
      primarySource: 'Federal'
    }
  }, {
    prisma: {
      planFundingSource: {
        findMany,
        count
      }
    }
  })

  expect(count).toHaveBeenCalledWith({
    where: {
      primarySource: 'Federal'
    }
  })
  expect(result.aggregate.count).toBe(1)
  expect(result.edges[0].node.subSource).toBe('Grant')
})

test('plan events read through Prisma Client for calendar and counts', async() => {
  const event = {
    id: 'event-1',
    name: 'Training Window',
    startDate: new Date('2026-06-01T12:00:00.000Z'),
    endDate: new Date('2026-06-01T13:00:00.000Z'),
    color: '#2299ff',
    Location: [{ id: 'location-1' }],
    PlanOrganization: [{ id: 'org-1', name: 'Ops' }],
    PlanInject: [{
      id: 'inject-1',
      title: 'Inject',
      Location: [],
      PlanMethod: [],
      PlanInjectOwner: [],
      PlanLabel: [],
      MediaFile: [],
      PlanTrainingObjective: [],
      PlanEvent: []
    }]
  }
  const findMany = jest.fn().mockResolvedValue([event])
  const findFirst = jest.fn().mockResolvedValue(event)
  const count = jest.fn().mockResolvedValue(1)
  const ctx = {
    prisma: {
      planEvent: {
        findMany,
        findFirst,
        count
      }
    }
  }

  const events = await Query.planEvents(null, {}, ctx)
  const oneEvent = await Query.planEvent(null, {
    where: {
      id: 'event-1'
    }
  }, ctx)
  const connection = await Query.planEventsConnection(null, {}, ctx)

  expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
    where: undefined,
    include: expect.any(Object)
  }))
  expect(events[0].title).toBe('Training Window')
  expect(events[0].start).toEqual(event.startDate)
  expect(events[0].organization.name).toBe('Ops')
  expect(oneEvent.injects[0].title).toBe('Inject')
  expect(connection.aggregate.count).toBe(1)
})

test('plan calendar injects and meetings read through Prisma Client', async() => {
  const inject = {
    id: 'inject-1',
    title: 'Weather inject',
    startDate: new Date('2026-06-01T14:00:00.000Z'),
    PlanLabel: [{ id: 'label-1', title: 'Ready', color: '#20a464' }],
    Location: [],
    PlanMethod: [],
    PlanInjectOwner: [],
    MediaFile: [],
    PlanTrainingObjective: [],
    PlanEvent: []
  }
  const meeting = {
    id: 'meeting-1',
    name: 'Controller sync',
    location: 'Room 3',
    startDate: new Date('2026-06-01T15:00:00.000Z'),
    endDate: new Date('2026-06-01T15:30:00.000Z')
  }
  const ctx = {
    prisma: {
      planInject: {
        findMany: jest.fn().mockResolvedValue([inject]),
        findFirst: jest.fn().mockResolvedValue(inject),
        count: jest.fn().mockResolvedValue(1)
      },
      planMeeting: {
        findMany: jest.fn().mockResolvedValue([meeting]),
        findFirst: jest.fn().mockResolvedValue(meeting),
        count: jest.fn().mockResolvedValue(1)
      }
    }
  }

  const injects = await Query.planInjects(null, {}, ctx)
  const injectConnection = await Query.planInjectsConnection(null, {}, ctx)
  const meetings = await Query.planMeetings(null, {}, ctx)
  const meetingConnection = await Query.planMeetingsConnection(null, {}, ctx)

  expect(ctx.prisma.planInject.findMany).toHaveBeenCalledWith(expect.objectContaining({
    where: { deletedAt: null },
    include: expect.any(Object)
  }))
  expect(injects[0].startDate).toEqual(inject.startDate)
  expect(injects[0].status.title).toBe('Ready')
  expect(injectConnection.aggregate.count).toBe(1)
  expect(meetings[0].title).toBe('Controller sync')
  expect(meetings[0].start).toEqual(meeting.startDate)
  expect(meetingConnection.aggregate.count).toBe(1)
})

test('plan foundation mutations write through Prisma Client', async() => {
  const upsert = jest.fn().mockResolvedValue({
    id: 'method-1',
    title: 'Seminar'
  })
  const create = jest.fn().mockResolvedValue({
    id: 'reason-1',
    title: 'Training Objective'
  })
  const remove = jest.fn().mockResolvedValue({
    id: 'priority-1',
    title: 'High'
  })
  const ctx = {
    prisma: {
      planMethod: {
        upsert
      },
      planReason: {
        create
      },
      planPriorityLevel: {
        delete: remove
      }
    }
  }

  await prismaForward.upsertPlanMethod(null, {
    where: {
      id: 'method-1'
    },
    create: {
      title: 'Seminar'
    },
    update: {
      title: 'Workshop'
    }
  }, ctx)
  await prismaForward.createPlanReasonPublic(null, {
    data: {
      planReason: {
        title: 'Training Objective'
      }
    }
  }, ctx)
  const deleted = await prismaForward.deletePlanPriorityLevel(null, {
    where: {
      id: 'priority-1'
    }
  }, ctx)

  expect(upsert).toHaveBeenCalledWith({
    where: {
      id: 'method-1'
    },
    create: expect.objectContaining({
      id: expect.any(String),
      title: 'Seminar',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }),
    update: expect.objectContaining({
      title: 'Workshop',
      updatedAt: expect.any(Date)
    })
  })
  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      title: 'Training Objective',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
  expect(remove).toHaveBeenCalledWith({
    where: {
      id: 'priority-1'
    }
  })
  expect(deleted.title).toBe('High')
})
