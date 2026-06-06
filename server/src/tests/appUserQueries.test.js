const { appUserQueries } = require('../resolvers/Query/appUserQueries')

test('appUsers reads through Prisma Client and maps legacy role shape', async () => {
  const findMany = jest.fn().mockResolvedValue([
    {
      id: 'user-1',
      email: 'ada@example.test',
      AppUserRole: [{
        id: 'role-link-1',
        User: [{ id: 'user-1' }],
        AppRole: [{ id: 'role-1', name: 'ADMIN' }]
      }]
    }
  ])

  const result = await appUserQueries.appUsers(null, {
    where: {
      email_contains: 'example.test'
    },
    orderBy: 'email_ASC',
    first: 10,
    skip: 2
  }, {
    prisma: {
      user: {
        findMany
      }
    }
  })

  expect(findMany).toHaveBeenCalledWith({
    where: {
      email: {
        contains: 'example.test'
      }
    },
    orderBy: {
      email: 'asc'
    },
    take: 10,
    skip: 2,
    include: {
      AppUserRole: {
        include: {
          AppRole: true,
          User: true
        }
      }
    }
  })
  expect(result[0].role.roles).toEqual([{ id: 'role-1', name: 'ADMIN' }])
})

test('getAppUserInviteLink returns a registration URL only for pending invites', async () => {
  const findFirst = jest.fn().mockResolvedValue({
    id: 'user-1',
    email: 'ada@example.test',
    inviteAccepted: false,
    inviteToken: 'invite-token'
  })

  const result = await appUserQueries.getAppUserInviteLink(null, {
    where: {
      email: 'ada@example.test'
    }
  }, {
    prisma: {
      user: {
        findFirst
      }
    },
    graphqlAuthentication: {
      mailAppUrl: 'https://epic.example.test'
    }
  })

  expect(result).toEqual({
    id: 'user-1',
    url: 'https://epic.example.test/register/ada@example.test/invite-token'
  })
})

test('getAppUserInviteLink hides accepted invites', async () => {
  const findFirst = jest.fn().mockResolvedValue({
    id: 'user-1',
    email: 'ada@example.test',
    inviteAccepted: true,
    inviteToken: 'invite-token'
  })

  const result = await appUserQueries.getAppUserInviteLink(null, {
    where: {
      email: 'ada@example.test'
    }
  }, {
    prisma: {
      user: {
        findFirst
      }
    },
    graphqlAuthentication: {
      mailAppUrl: 'https://epic.example.test'
    }
  })

  expect(result).toBeNull()
})
