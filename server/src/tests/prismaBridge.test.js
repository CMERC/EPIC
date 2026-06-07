const {
  appListSettingDataFromPrisma1,
  appRoleDataFromPrisma1,
  appUserRoleDataFromPrisma1,
  appWorkspaceArgsFromPrisma1,
  appWorkspaceDataFromPrisma1,
  emailMailboxDataFromPrisma1,
  emailMessageDataFromPrisma1,
  orderByFromPrisma1,
  toAppUser,
  toAppWorkspace,
  toEmailMailbox,
  toEmailMessage,
  userWhereFromPrisma1
} = require('../services/prismaBridge')

test('converts Prisma 1 orderBy values to Prisma Client orderBy objects', () => {
  expect(orderByFromPrisma1('lastLogin_DESC')).toEqual({ lastLogin: 'desc' })
  expect(orderByFromPrisma1('name_ASC')).toEqual({ name: 'asc' })
})

test('converts user filters to Prisma Client filters', () => {
  expect(userWhereFromPrisma1({
    OR: [
      { name_contains: 'Ada' },
      { email_contains: 'example.com' }
    ],
    id_not_in: ['archived']
  })).toEqual({
    OR: [
      { name: { contains: 'Ada' } },
      { email: { contains: 'example.com' } }
    ],
    id: { notIn: ['archived'] }
  })
})

test('converts workspace member filters to Prisma Client relation filters', () => {
  expect(appWorkspaceArgsFromPrisma1({
    where: {
      members_some: {
        id: 'user-1'
      }
    },
    orderBy: 'displayName_ASC',
    skip: 5,
    first: 10
  })).toEqual({
    where: {
      User: {
        some: {
          id: 'user-1'
        }
      }
    },
    orderBy: {
      displayName: 'asc'
    },
    skip: 5,
    take: 10
  })
})

test('converts workspace mutation data to Prisma Client fields and relations', () => {
  const data = appWorkspaceDataFromPrisma1({
    name: 'test-workspace',
    displayName: 'Test Workspace',
    status: 'Available',
    members: {
      connect: [{
        id: 'user-1'
      }]
    }
  }, {
    create: true
  })

  expect(data).toEqual(expect.objectContaining({
    id: expect.stringMatching(/^c/),
    name: 'test-workspace',
    displayName: 'Test Workspace',
    status: 'Available',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    User: {
      connect: [{
        id: 'user-1'
      }]
    }
  }))
  expect(data.id).toHaveLength(25)
})

test('converts list setting mutation data to Prisma Client fields', () => {
  const data = appListSettingDataFromPrisma1({
    name: 'PLAN',
    status: 'ACTIVE'
  }, {
    create: true
  })

  expect(data).toEqual({
    id: expect.stringMatching(/^c/),
    name: 'PLAN',
    status: 'ACTIVE'
  })
  expect(data.id).toHaveLength(25)
})

test('converts role mutation data to Prisma Client relation fields', () => {
  const role = appRoleDataFromPrisma1({
    name: 'ADMIN',
    displayName: 'Administrator',
    users: {
      connect: [{
        id: 'role-link-1'
      }]
    }
  }, {
    create: true
  })
  const userRole = appUserRoleDataFromPrisma1({
    user: {
      connect: {
        id: 'user-1'
      }
    },
    roles: {
      connect: [{
        id: 'role-1'
      }]
    }
  }, {
    create: true
  })

  expect(role).toEqual(expect.objectContaining({
    id: expect.stringMatching(/^c/),
    name: 'ADMIN',
    displayName: 'Administrator',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    AppUserRole: {
      connect: [{
        id: 'role-link-1'
      }]
    }
  }))
  expect(role.id).toHaveLength(25)
  expect(userRole).toEqual(expect.objectContaining({
    id: expect.stringMatching(/^c/),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    User: {
      connect: [{
        id: 'user-1'
      }]
    },
    AppRole: {
      connect: [{
        id: 'role-1'
      }]
    }
  }))
  expect(userRole.id).toHaveLength(25)
})

test('converts email mutation data and maps legacy relation names', () => {
  const mailbox = emailMailboxDataFromPrisma1({
    owner: 'ada@example.test'
  }, {
    create: true
  })
  const message = emailMessageDataFromPrisma1({
    to: 'grace@example.test',
    from: 'ada@example.test',
    subject: 'Status',
    mailbox: {
      connect: {
        owner: 'ada@example.test'
      }
    }
  }, {
    create: true
  })
  const mappedMessage = toEmailMessage({
    id: 'message-1',
    EmailMailbox: [{ id: 'mailbox-1', owner: 'ada@example.test' }],
    MediaFile: [{ id: 'file-1' }]
  })
  const mappedMailbox = toEmailMailbox({
    id: 'mailbox-1',
    EmailMessage: [mappedMessage]
  })

  expect(mailbox).toEqual(expect.objectContaining({
    id: expect.any(String),
    owner: 'ada@example.test',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
  }))
  expect(message).toEqual(expect.objectContaining({
    id: expect.any(String),
    to: 'grace@example.test',
    from: 'ada@example.test',
    subject: 'Status',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    EmailMailbox: {
      connect: [{
        owner: 'ada@example.test'
      }]
    }
  }))
  expect(mappedMessage.mailbox.owner).toBe('ada@example.test')
  expect(mappedMessage.attachments).toEqual([{ id: 'file-1' }])
  expect(mappedMailbox.messages[0].mailbox.owner).toBe('ada@example.test')
})

test('maps introspected relation names back to legacy GraphQL field names', () => {
  const user = toAppUser({
    id: 'user-1',
    AppUserRole: [{
      id: 'role-link-1',
      User: [{ id: 'user-1' }],
      AppRole: [{ id: 'role-1', name: 'ADMIN' }]
    }]
  })
  const workspace = toAppWorkspace({
    id: 'workspace-1',
    User: [user]
  })

  expect(user.role.roles).toEqual([{ id: 'role-1', name: 'ADMIN' }])
  expect(user.role.user).toEqual({ id: 'user-1' })
  expect(workspace.members[0].role.roles[0].name).toBe('ADMIN')
})
