jest.mock('../services/prisma', () => ({
  getLegacyPrisma: jest.fn()
}))

jest.mock('../services/authContext', () => ({
  getCurrentUserId: jest.fn()
}))

jest.mock('../authSubscription', () => ({
  getUserIdWebSocket: jest.fn()
}))

const { getLegacyPrisma } = require('../services/prisma')
const { getCurrentUserId } = require('../services/authContext')
const { workspaceMiddleware } = require('../middleware/workspace')

beforeEach(() => {
  jest.clearAllMocks()
  getLegacyPrisma.mockReturnValue({ query: {}, mutation: {} })
})

test('workspace middleware allows authenticated users only into workspaces they belong to', async() => {
  getCurrentUserId.mockResolvedValue('user-1')
  const findUnique = jest.fn().mockResolvedValue({
    isSuper: false
  })
  const findFirst = jest.fn().mockResolvedValue({
    name: 'exercise-alpha',
    displayName: 'Exercise Alpha',
    timeZone: 'America/New_York'
  })
  const resolve = jest.fn().mockResolvedValue('ok')
  const ctx = {
    request: {
      headers: {
        authorization: 'Bearer token',
        workspace: 'exercise-alpha'
      }
    },
    prisma: {
      user: {
        findUnique
      },
      appWorkspace: {
        findFirst
      }
    }
  }
  const info = {
    fieldName: 'planInjects'
  }

  const result = await workspaceMiddleware(resolve, null, {}, ctx, info)

  expect(result).toBe('ok')
  expect(findFirst).toHaveBeenCalledWith({
    where: {
      User: {
        some: {
          id: 'user-1'
        }
      },
      name: 'exercise-alpha'
    },
    select: {
      name: true,
      displayName: true,
      timeZone: true
    }
  })
  expect(ctx.activeWorkspace).toEqual({
    name: 'exercise-alpha',
    displayName: 'Exercise Alpha',
    timeZone: 'America/New_York',
    isPublic: false
  })
  expect(info.workspaceName).toBe('exercise-alpha')
})

test('workspace middleware rejects authenticated users from other workspaces', async() => {
  getCurrentUserId.mockResolvedValue('user-1')
  const resolve = jest.fn()
  const ctx = {
    request: {
      headers: {
        authorization: 'Bearer token',
        workspace: 'exercise-bravo'
      }
    },
    prisma: {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          isSuper: false
        })
      },
      appWorkspace: {
        findFirst: jest.fn().mockResolvedValue(null)
      }
    }
  }

  const result = await workspaceMiddleware(resolve, null, {}, ctx, {
    fieldName: 'planInjects'
  })

  expect(result).toBeInstanceOf(Error)
  expect(result.message).toBe('Sorry, you do not have access to this workspace')
  expect(resolve).not.toHaveBeenCalled()
})

test('workspace middleware does not allow data.workspace to bypass membership on private fields', async() => {
  getCurrentUserId.mockResolvedValue('user-1')
  const findFirst = jest.fn().mockResolvedValue(null)
  const resolve = jest.fn()
  const ctx = {
    request: {
      headers: {
        authorization: 'Bearer token'
      }
    },
    prisma: {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          isSuper: false
        })
      },
      appWorkspace: {
        findFirst
      }
    }
  }

  const result = await workspaceMiddleware(resolve, null, {
    data: {
      workspace: 'another-customer'
    }
  }, ctx, {
    fieldName: 'createPlanInject'
  })

  expect(result).toBeInstanceOf(Error)
  expect(result.message).toBe('Sorry, you do not have access to this workspace')
  expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      User: {
        some: {
          id: 'user-1'
        }
      },
      name: 'another-customer'
    }
  }))
  expect(resolve).not.toHaveBeenCalled()
})

test('workspace middleware allows workspace-by-name access only for public workspace fields', async() => {
  const resolve = jest.fn().mockResolvedValue('public-ok')
  const ctx = {
    prisma: {
      appWorkspace: {
        findFirst: jest.fn().mockResolvedValue({
          name: 'public-exercise',
          displayName: 'Public Exercise',
          timeZone: 'UTC'
        })
      }
    }
  }
  const info = {
    fieldName: 'mediaPostsPublic'
  }

  const result = await workspaceMiddleware(resolve, null, {
    data: {
      workspace: 'public-exercise'
    }
  }, ctx, info)

  expect(result).toBe('public-ok')
  expect(ctx.activeWorkspace).toEqual({
    name: 'public-exercise',
    displayName: 'Public Exercise',
    timeZone: 'UTC',
    isPublic: true
  })
})

test('workspace middleware lets super users select any existing workspace', async() => {
  getCurrentUserId.mockResolvedValue('super-1')
  const findFirst = jest.fn().mockResolvedValue({
    name: 'customer-space',
    displayName: 'Customer Space',
    timeZone: 'UTC'
  })
  const resolve = jest.fn().mockResolvedValue('ok')
  const ctx = {
    request: {
      headers: {
        authorization: 'Bearer token',
        workspace: 'customer-space'
      }
    },
    prisma: {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          isSuper: true
        })
      },
      appWorkspace: {
        findFirst
      }
    }
  }

  const result = await workspaceMiddleware(resolve, null, {}, ctx, {
    fieldName: 'exerciseTimelineItems'
  })

  expect(result).toBe('ok')
  expect(findFirst).toHaveBeenCalledWith({
    where: {
      name: 'customer-space'
    },
    select: {
      name: true,
      displayName: true,
      timeZone: true
    }
  })
})
