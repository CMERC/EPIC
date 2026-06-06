jest.mock('../jobs/publishPosts', () => ({
  addJobToQueue: jest.fn()
}))

jest.mock('../jobs/deploy', () => ({
  deployWorkspace: jest.fn()
}))

jest.mock('../jobs/noiseScheduler', () => ({
  addNoiseQueue: jest.fn()
}))

const { appWorkspaceMutation } = require('../resolvers/Mutation/workspace')

test('assignUserToWorkspace uses Prisma Client relation writes and returns legacy member shape', async () => {
  const update = jest.fn().mockResolvedValue({
    id: 'workspace-1',
    displayName: 'Exercise One',
    User: [{
      id: 'user-1',
      email: 'ada@example.test',
      AppUserRole: []
    }]
  })
  const findUnique = jest.fn().mockResolvedValue({
    id: 'user-1',
    email: 'ada@example.test',
    inviteAccepted: true
  })
  const findFirst = jest.fn().mockResolvedValue({
    id: 'workspace-1',
    displayName: 'Exercise One'
  })
  const send = jest.fn()

  const result = await appWorkspaceMutation.assignUserToWorkspace(null, {
    where: { id: 'workspace-1' },
    data: {
      connect: {
        id: 'user-1'
      }
    }
  }, {
    prisma: {
      appWorkspace: {
        update,
        findFirst
      },
      user: {
        findUnique
      }
    },
    graphqlAuthentication: {
      mailer: {
        send
      },
      mailAppUrl: 'https://epic.example.test'
    }
  })

  expect(update).toHaveBeenCalledWith({
    data: {
      User: {
        connect: {
          id: 'user-1'
        }
      }
    },
    where: { id: 'workspace-1' },
    include: {
      User: true
    }
  })
  expect(findUnique).toHaveBeenCalledWith({
    where: {
      id: 'user-1'
    }
  })
  expect(findFirst).toHaveBeenCalledWith({
    where: {
      id: 'workspace-1'
    }
  })
  expect(send).toHaveBeenCalledWith(expect.objectContaining({
    template: 'addUserToWorkspace',
    message: {
      to: 'ada@example.test'
    }
  }))
  expect(result.members).toEqual([expect.objectContaining({
    id: 'user-1',
    email: 'ada@example.test'
  })])
})

test('assignUserToWorkspace does not email users who have not accepted invites', async () => {
  const send = jest.fn()

  await appWorkspaceMutation.assignUserToWorkspace(null, {
    where: { id: 'workspace-1' },
    data: {
      connect: {
        id: 'user-1'
      }
    }
  }, {
    prisma: {
      appWorkspace: {
        update: jest.fn().mockResolvedValue({
          id: 'workspace-1',
          User: []
        }),
        findFirst: jest.fn().mockResolvedValue({
          id: 'workspace-1',
          displayName: 'Exercise One'
        })
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'ada@example.test',
          inviteAccepted: false
        })
      }
    },
    graphqlAuthentication: {
      mailer: {
        send
      },
      mailAppUrl: 'https://epic.example.test'
    }
  })

  expect(send).not.toHaveBeenCalled()
})
