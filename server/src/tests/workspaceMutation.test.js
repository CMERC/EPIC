jest.mock('../jobs/publishPosts', () => ({
  addJobToQueue: jest.fn()
}))

jest.mock('../jobs/deploy', () => ({
  deployWorkspace: jest.fn()
}))

jest.mock('../jobs/noiseScheduler', () => ({
  addNoiseQueue: jest.fn()
}))

jest.mock('graphql-authentication', () => ({
  getUser: jest.fn(),
  getUserId: jest.fn()
}))

const { getUser, getUserId } = require('graphql-authentication')
const { appWorkspaceMutation } = require('../resolvers/Mutation/workspace')
const { addJobToQueue } = require('../jobs/publishPosts')
const { deployWorkspace } = require('../jobs/deploy')
const { addNoiseQueue } = require('../jobs/noiseScheduler')

beforeEach(() => {
  jest.clearAllMocks()
})

test('assignUserToWorkspace uses Prisma Client relation writes and returns legacy member shape', async() => {
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

test('assignUserToWorkspace does not email users who have not accepted invites', async() => {
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

test('requestAppWorkspace grants first workspace through Prisma Client and assigns admin role', async() => {
  getUser.mockResolvedValue({
    id: 'user-1',
    email: 'ada@example.test'
  })
  const originalWebhook = process.env.SLACK_WORKSPACE_REQUEST_WEBHOOK
  delete process.env.SLACK_WORKSPACE_REQUEST_WEBHOOK

  const update = jest.fn().mockResolvedValue({
    id: 'workspace-1'
  })
  const create = jest.fn().mockResolvedValue({
    id: 'role-link-1'
  })

  const result = await appWorkspaceMutation.requestAppWorkspace(null, {}, {
    prisma: {
      appWorkspace: {
        findMany: jest.fn().mockResolvedValue([{ id: 'workspace-1' }]),
        update
      },
      appRole: {
        findFirst: jest.fn().mockResolvedValue({ id: 'role-1', name: 'ADMIN' })
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          AppUserRole: []
        })
      },
      appUserRole: {
        create
      }
    }
  })

  if (originalWebhook === undefined) {
    delete process.env.SLACK_WORKSPACE_REQUEST_WEBHOOK
  } else {
    process.env.SLACK_WORKSPACE_REQUEST_WEBHOOK = originalWebhook
  }

  expect(update).toHaveBeenCalledWith({
    data: {
      User: {
        connect: {
          id: 'user-1'
        }
      },
      updatedAt: expect.any(Date)
    },
    where: {
      id: 'workspace-1'
    }
  })
  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      User: {
        connect: {
          id: 'user-1'
        }
      },
      AppRole: {
        connect: [{
          id: 'role-1'
        }]
      }
    })
  })
  expect(result).toBe('Workspace access granted for ada@example.test')
})

test('createAppWorkspace uses Prisma Client and deploys workspace jobs', async() => {
  getUserId.mockReturnValue('user-1')
  const create = jest.fn().mockResolvedValue({
    id: 'workspace-1',
    name: 'test',
    displayName: 'Test',
    User: []
  })
  const update = jest.fn().mockResolvedValue({
    id: 'workspace-1'
  })

  const result = await appWorkspaceMutation.createAppWorkspace(null, {
    data: {
      name: 'test',
      displayName: 'Test'
    }
  }, {
    prisma: {
      appWorkspace: {
        create,
        update
      }
    }
  })

  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      id: expect.any(String),
      name: 'test',
      displayName: 'Test',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }),
    include: {
      User: true
    }
  })
  expect(update).toHaveBeenCalledWith({
    data: {
      User: {
        connect: {
          id: 'user-1'
        }
      },
      status: 'Deploying',
      updatedAt: expect.any(Date)
    },
    where: {
      name: 'test'
    }
  })
  expect(deployWorkspace).toHaveBeenCalledWith('test')
  expect(addJobToQueue).toHaveBeenCalledWith('test')
  expect(addNoiseQueue).toHaveBeenCalledWith('test')
  expect(result.members).toEqual([])
})

test('updateAppWorkspace translates member relation writes and sends accepted-user email', async() => {
  const send = jest.fn()
  const update = jest.fn().mockResolvedValue({
    id: 'workspace-1',
    displayName: 'Exercise One',
    User: [{ id: 'user-1' }]
  })

  const result = await appWorkspaceMutation.updateAppWorkspace(null, {
    where: {
      id: 'workspace-1'
    },
    data: {
      displayName: 'Exercise One',
      members: {
        connect: [{
          id: 'user-1'
        }]
      }
    }
  }, {
    prisma: {
      appWorkspace: {
        update,
        findFirst: jest.fn().mockResolvedValue({
          id: 'workspace-1',
          displayName: 'Exercise One'
        })
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'ada@example.test',
          inviteAccepted: true
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

  expect(update).toHaveBeenCalledWith({
    data: expect.objectContaining({
      displayName: 'Exercise One',
      updatedAt: expect.any(Date),
      User: {
        connect: [{
          id: 'user-1'
        }]
      }
    }),
    where: {
      id: 'workspace-1'
    },
    include: {
      User: true
    }
  })
  expect(send).toHaveBeenCalledWith(expect.objectContaining({
    template: 'addUserToWorkspace',
    message: {
      to: 'ada@example.test'
    }
  }))
  expect(result.members).toEqual([{
    id: 'user-1',
    role: null
  }])
})

test('upsertAppWorkspace and deleteAppWorkspace use Prisma Client fallbacks', async() => {
  const upsert = jest.fn().mockResolvedValue({
    id: 'workspace-1',
    User: []
  })
  const remove = jest.fn().mockResolvedValue({
    id: 'workspace-1',
    User: []
  })
  const ctx = {
    prisma: {
      appWorkspace: {
        upsert,
        delete: remove
      }
    }
  }

  await appWorkspaceMutation.upsertAppWorkspace(null, {
    where: {
      id: 'workspace-1'
    },
    create: {
      name: 'test',
      displayName: 'Test'
    },
    update: {
      displayName: 'Test Updated'
    }
  }, ctx)
  const deleted = await appWorkspaceMutation.deleteAppWorkspace(null, {
    where: {
      id: 'workspace-1'
    }
  }, ctx)

  expect(upsert).toHaveBeenCalledWith({
    where: {
      id: 'workspace-1'
    },
    create: expect.objectContaining({
      id: expect.any(String),
      name: 'test',
      displayName: 'Test',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }),
    update: expect.objectContaining({
      displayName: 'Test Updated',
      updatedAt: expect.any(Date)
    }),
    include: {
      User: true
    }
  })
  expect(remove).toHaveBeenCalledWith({
    where: {
      id: 'workspace-1'
    },
    include: {
      User: true
    }
  })
  expect(deleted.members).toEqual([])
})
