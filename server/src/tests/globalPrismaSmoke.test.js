jest.mock('graphql-authentication', () => ({
  getUser: jest.fn(),
  getUserId: jest.fn()
}))

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUser } = require('graphql-authentication')
const { authMutations } = require('../resolvers/Mutation/authMutations')
const { appWorkspaceMutation } = require('../resolvers/Mutation/workspace')
const { emailMutations } = require('../resolvers/Mutation/email')
const { prismaForward } = require('../resolvers/Mutation/prismaForward')
const { Query } = require('../resolvers/Query')

test('global Prisma smoke path covers auth, workspace, roles, settings, email, and chat', async() => {
  const password = await bcrypt.hash('correct-password', 4)
  const user = {
    id: 'user-1',
    email: 'ada@example.test',
    password,
    inviteAccepted: true,
    deletedAt: null,
    sessionId: null,
    AppUserRole: []
  }
  getUser.mockResolvedValue({
    id: 'user-1',
    email: 'ada@example.test',
    isSuper: false
  })

  const appWorkspaceFindMany = jest.fn().mockResolvedValue([{
    id: 'workspace-1',
    displayName: 'Exercise One',
    User: [{ id: 'user-1', AppUserRole: [] }]
  }])
  const appRoleUpsert = jest.fn().mockResolvedValue({
    id: 'role-1',
    name: 'ADMIN',
    AppUserRole: []
  })
  const appListSettingUpsert = jest.fn().mockResolvedValue({
    id: 'setting-1',
    name: 'PLAN',
    status: 'ACTIVE'
  })
  const emailMailboxCreate = jest.fn()
    .mockResolvedValueOnce({ id: 'mailbox-1', owner: 'ada@example.test' })
    .mockResolvedValueOnce({ id: 'mailbox-2', owner: 'grace@example.test' })
  const emailMessageCreate = jest.fn()
    .mockResolvedValueOnce({
      id: 'sent-message',
      EmailMailbox: [{ owner: 'ada@example.test' }],
      MediaFile: []
    })
    .mockResolvedValueOnce({ id: 'inbox-message' })
  const chatMessageCreate = jest.fn().mockResolvedValue({
    id: 'chat-message-1',
    text: 'Ready',
    author: 'ada@example.test',
    ChatRoom: [{ id: 'room-1', title: 'General' }]
  })
  const userUpdate = jest.fn()
    .mockResolvedValueOnce({ ...user, lastLogin: new Date() })
    .mockResolvedValueOnce({ ...user, sessionId: 'session-1' })

  const ctx = {
    graphqlAuthentication: {
      secret: 'test-secret'
    },
    prisma: {
      user: {
        findFirst: jest.fn().mockResolvedValue(user),
        findUnique: jest.fn().mockResolvedValue(user),
        update: userUpdate
      },
      appWorkspace: {
        findMany: appWorkspaceFindMany
      },
      appRole: {
        upsert: appRoleUpsert
      },
      appListSetting: {
        upsert: appListSettingUpsert
      },
      emailMailbox: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: emailMailboxCreate
      },
      emailMessage: {
        create: emailMessageCreate
      },
      chatMessage: {
        create: chatMessageCreate
      }
    }
  }

  const login = await authMutations.login(null, {
    email: 'ada@example.test',
    password: 'correct-password'
  }, ctx)
  const workspaces = await Query.appWorkspaces(null, {}, ctx)
  const role = await prismaForward.upsertAppRole(null, {
    where: { name: 'ADMIN' },
    create: { name: 'ADMIN', displayName: 'Administrator' },
    update: { displayName: 'Administrator' }
  }, ctx)
  const setting = await prismaForward.upsertAppListSetting(null, {
    where: { name: 'PLAN' },
    create: { name: 'PLAN', status: 'ACTIVE' },
    update: { status: 'ACTIVE' }
  }, ctx)
  const email = await emailMutations.composeEmailMessage(null, {
    data: {
      to: 'grace@example.test',
      from: 'ada@example.test',
      subject: 'Status',
      content: 'Ready'
    }
  }, ctx)
  const chat = await prismaForward.createChatMessage(null, {
    data: {
      text: 'Ready',
      author: 'ada@example.test',
      room: {
        connect: {
          id: 'room-1'
        }
      }
    }
  }, ctx)

  expect(jwt.verify(login.token, 'test-secret').sessionId).toBe('session-1')
  expect(workspaces[0].members[0].id).toBe('user-1')
  expect(role.name).toBe('ADMIN')
  expect(setting.status).toBe('ACTIVE')
  expect(email.mailbox.owner).toBe('ada@example.test')
  expect(chat.room.title).toBe('General')

  expect(userUpdate).toHaveBeenCalledTimes(2)
  expect(appWorkspaceFindMany).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      User: {
        some: {
          id: 'user-1'
        }
      }
    }
  }))
  expect(appRoleUpsert).toHaveBeenCalled()
  expect(appListSettingUpsert).toHaveBeenCalled()
  expect(emailMessageCreate).toHaveBeenCalledTimes(2)
  expect(chatMessageCreate).toHaveBeenCalled()
})
