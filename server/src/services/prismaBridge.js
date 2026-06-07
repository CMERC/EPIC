const orderByFromPrisma1 = orderBy => {
  if (!orderBy || typeof orderBy !== 'string') {
    return undefined
  }

  const [field, direction] = orderBy.split(/_(ASC|DESC)$/)
  if (!field || !direction) {
    return undefined
  }

  return { [field]: direction.toLowerCase() }
}

const generatePrismaId = () => {
  const seed = Date.now().toString(36) + Math.random().toString(36).slice(2)
  return ('c' + seed).slice(0, 25).padEnd(25, '0')
}

const now = () => new Date()

const asArray = value => {
  if (!value) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

const relationInputFromPrisma1 = input => {
  if (!input) {
    return undefined
  }

  const relation = {}
  ;['connect', 'disconnect', 'set', 'create', 'delete', 'update', 'upsert'].forEach(action => {
    const values = asArray(input[action])
    if (values.length > 0) {
      relation[action] = values
    }
  })

  return Object.keys(relation).length > 0 ? relation : undefined
}

const paginationFromPrisma1 = args => {
  const pagination = {}
  if (Number.isInteger(args.skip)) {
    pagination.skip = args.skip
  }
  if (Number.isInteger(args.first)) {
    pagination.take = args.first
  }
  return pagination
}

const scalarFilter = (where, field, prismaField = field) => {
  const filter = {}
  const operators = {
    [field]: 'equals',
    [`${field}_not`]: 'not',
    [`${field}_in`]: 'in',
    [`${field}_not_in`]: 'notIn',
    [`${field}_lt`]: 'lt',
    [`${field}_lte`]: 'lte',
    [`${field}_gt`]: 'gt',
    [`${field}_gte`]: 'gte',
    [`${field}_contains`]: 'contains',
    [`${field}_starts_with`]: 'startsWith',
    [`${field}_ends_with`]: 'endsWith'
  }

  Object.keys(operators).forEach(key => {
    if (where[key] !== undefined && where[key] !== null) {
      filter[operators[key]] = where[key]
    }
  })

  if (Object.keys(filter).length === 0) {
    return {}
  }

  return {
    [prismaField]: Object.keys(filter).length === 1 && filter.equals !== undefined
      ? filter.equals
      : filter
  }
}

const combineLogicalFilters = (where, mapper) => {
  const filters = {}
  ;['AND', 'OR', 'NOT'].forEach(operator => {
    if (Array.isArray(where[operator]) && where[operator].length > 0) {
      filters[operator] = where[operator].map(mapper)
    }
  })
  return filters
}

const userWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  return {
    ...combineLogicalFilters(where, userWhereFromPrisma1),
    ...scalarFilter(where, 'id'),
    ...scalarFilter(where, 'email'),
    ...scalarFilter(where, 'name'),
    ...scalarFilter(where, 'deletedAt'),
    ...scalarFilter(where, 'inviteAccepted'),
    ...scalarFilter(where, 'emailConfirmed'),
    ...scalarFilter(where, 'isSuper'),
    ...scalarFilter(where, 'sessionId')
  }
}

const appListSettingWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  return {
    ...combineLogicalFilters(where, appListSettingWhereFromPrisma1),
    ...scalarFilter(where, 'id'),
    ...scalarFilter(where, 'name'),
    ...scalarFilter(where, 'status')
  }
}

const appRoleWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  return {
    ...combineLogicalFilters(where, appRoleWhereFromPrisma1),
    ...scalarFilter(where, 'id'),
    ...scalarFilter(where, 'name'),
    ...scalarFilter(where, 'displayName')
  }
}

const appUserRoleWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = {
    ...combineLogicalFilters(where, appUserRoleWhereFromPrisma1),
    ...scalarFilter(where, 'id')
  }

  if (where.user) {
    filters.User = { some: userWhereFromPrisma1(where.user) }
  }
  if (where.roles_some) {
    filters.AppRole = { some: appRoleWhereFromPrisma1(where.roles_some) }
  }
  if (where.roles_none) {
    filters.AppRole = { none: appRoleWhereFromPrisma1(where.roles_none) }
  }
  if (where.roles_every) {
    filters.AppRole = { every: appRoleWhereFromPrisma1(where.roles_every) }
  }

  return filters
}

const appWorkspaceWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = {
    ...combineLogicalFilters(where, appWorkspaceWhereFromPrisma1),
    ...scalarFilter(where, 'id'),
    ...scalarFilter(where, 'name'),
    ...scalarFilter(where, 'displayName'),
    ...scalarFilter(where, 'timeZone'),
    ...scalarFilter(where, 'status'),
    ...scalarFilter(where, 'isTemplate')
  }

  if (where.members_some) {
    filters.User = { some: userWhereFromPrisma1(where.members_some) }
  }
  if (where.members_none) {
    filters.User = { none: userWhereFromPrisma1(where.members_none) }
  }
  if (where.members_every) {
    filters.User = { every: userWhereFromPrisma1(where.members_every) }
  }

  return filters
}

const emailMailboxWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = {
    ...combineLogicalFilters(where, emailMailboxWhereFromPrisma1),
    ...scalarFilter(where, 'id'),
    ...scalarFilter(where, 'createdAt'),
    ...scalarFilter(where, 'updatedAt'),
    ...scalarFilter(where, 'owner')
  }

  if (where.messages_some) {
    filters.EmailMessage = { some: emailMessageWhereFromPrisma1(where.messages_some) }
  }
  if (where.messages_none) {
    filters.EmailMessage = { none: emailMessageWhereFromPrisma1(where.messages_none) }
  }
  if (where.messages_every) {
    filters.EmailMessage = { every: emailMessageWhereFromPrisma1(where.messages_every) }
  }

  return filters
}

const emailMessageWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = {
    ...combineLogicalFilters(where, emailMessageWhereFromPrisma1),
    ...scalarFilter(where, 'id'),
    ...scalarFilter(where, 'createdAt'),
    ...scalarFilter(where, 'updatedAt'),
    ...scalarFilter(where, 'to'),
    ...scalarFilter(where, 'from'),
    ...scalarFilter(where, 'subject'),
    ...scalarFilter(where, 'content'),
    ...scalarFilter(where, 'status'),
    ...scalarFilter(where, 'folder')
  }

  if (where.mailbox) {
    filters.EmailMailbox = { some: emailMailboxWhereFromPrisma1(where.mailbox) }
  }

  return filters
}

const chatRoomWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = {
    ...combineLogicalFilters(where, chatRoomWhereFromPrisma1),
    ...scalarFilter(where, 'id'),
    ...scalarFilter(where, 'createdAt'),
    ...scalarFilter(where, 'updatedAt'),
    ...scalarFilter(where, 'title')
  }

  if (where.messages_some) {
    filters.ChatMessage = { some: chatMessageWhereFromPrisma1(where.messages_some) }
  }
  if (where.messages_none) {
    filters.ChatMessage = { none: chatMessageWhereFromPrisma1(where.messages_none) }
  }
  if (where.messages_every) {
    filters.ChatMessage = { every: chatMessageWhereFromPrisma1(where.messages_every) }
  }

  return filters
}

const chatMessageWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = {
    ...combineLogicalFilters(where, chatMessageWhereFromPrisma1),
    ...scalarFilter(where, 'id'),
    ...scalarFilter(where, 'createdAt'),
    ...scalarFilter(where, 'updatedAt'),
    ...scalarFilter(where, 'text'),
    ...scalarFilter(where, 'author')
  }

  if (where.room) {
    filters.ChatRoom = { some: chatRoomWhereFromPrisma1(where.room) }
  }

  return filters
}

const appUserArgsFromPrisma1 = args => ({
  where: userWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const appListSettingArgsFromPrisma1 = args => ({
  where: appListSettingWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const appListSettingDataFromPrisma1 = (data = {}, options = {}) => {
  const settingData = {}
  ;['id', 'name', 'status'].forEach(field => {
    if (data[field] !== undefined) {
      settingData[field] = data[field]
    }
  })

  if (options.create) {
    settingData.id = settingData.id || generatePrismaId()
  }

  return settingData
}

const appRoleArgsFromPrisma1 = args => ({
  where: appRoleWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const appRoleDataFromPrisma1 = (data = {}, options = {}) => {
  const roleData = {}
  ;['id', 'name', 'displayName'].forEach(field => {
    if (data[field] !== undefined) {
      roleData[field] = data[field]
    }
  })

  const users = relationInputFromPrisma1(data.users)
  if (users) {
    roleData.AppUserRole = users
  }

  if (options.create) {
    roleData.id = roleData.id || generatePrismaId()
    roleData.createdAt = data.createdAt || now()
  }
  roleData.updatedAt = data.updatedAt || now()

  return roleData
}

const appUserRoleArgsFromPrisma1 = args => ({
  where: appUserRoleWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const appUserRoleDataFromPrisma1 = (data = {}, options = {}) => {
  const roleData = {}
  if (data.id !== undefined) {
    roleData.id = data.id
  }

  const user = relationInputFromPrisma1(data.user)
  if (user) {
    roleData.User = user
  }

  const roles = relationInputFromPrisma1(data.roles)
  if (roles) {
    roleData.AppRole = roles
  }

  if (options.create) {
    roleData.id = roleData.id || generatePrismaId()
    roleData.createdAt = data.createdAt || now()
  }
  roleData.updatedAt = data.updatedAt || now()

  return roleData
}

const appWorkspaceArgsFromPrisma1 = args => ({
  where: appWorkspaceWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const emailMailboxArgsFromPrisma1 = args => ({
  where: emailMailboxWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const emailMessageArgsFromPrisma1 = args => ({
  where: emailMessageWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const chatRoomArgsFromPrisma1 = args => ({
  where: chatRoomWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const chatMessageArgsFromPrisma1 = args => ({
  where: chatMessageWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const appWorkspaceDataFromPrisma1 = (data = {}, options = {}) => {
  const workspaceData = {}
  ;['id', 'name', 'displayName', 'timeZone', 'isTemplate', 'status'].forEach(field => {
    if (data[field] !== undefined) {
      workspaceData[field] = data[field]
    }
  })

  const members = relationInputFromPrisma1(data.members)
  if (members) {
    workspaceData.User = members
  }

  if (options.create) {
    workspaceData.id = workspaceData.id || generatePrismaId()
    workspaceData.createdAt = data.createdAt || now()
  }
  workspaceData.updatedAt = data.updatedAt || now()

  return workspaceData
}

const appUserRoleCreateData = (userId, roleId) => ({
  id: generatePrismaId(),
  createdAt: now(),
  updatedAt: now(),
  User: {
    connect: {
      id: userId
    }
  },
  AppRole: {
    connect: [{
      id: roleId
    }]
  }
})

const emailMailboxDataFromPrisma1 = (data = {}, options = {}) => {
  const mailboxData = {}
  ;['id', 'owner'].forEach(field => {
    if (data[field] !== undefined) {
      mailboxData[field] = data[field]
    }
  })

  const messages = relationInputFromPrisma1(data.messages)
  if (messages) {
    mailboxData.EmailMessage = messages
  }

  if (options.create) {
    mailboxData.id = mailboxData.id || generatePrismaId()
    mailboxData.createdAt = data.createdAt || now()
  }
  mailboxData.updatedAt = data.updatedAt || now()

  return mailboxData
}

const emailMessageDataFromPrisma1 = (data = {}, options = {}) => {
  const messageData = {}
  ;['id', 'to', 'from', 'subject', 'content', 'status', 'folder'].forEach(field => {
    if (data[field] !== undefined) {
      messageData[field] = data[field]
    }
  })

  const mailbox = relationInputFromPrisma1(data.mailbox)
  if (mailbox) {
    messageData.EmailMailbox = mailbox
  }
  const attachments = relationInputFromPrisma1(data.attachments)
  if (attachments) {
    messageData.MediaFile = attachments
  }

  if (options.create) {
    messageData.id = messageData.id || generatePrismaId()
    messageData.createdAt = data.createdAt || now()
  }
  messageData.updatedAt = data.updatedAt || now()

  return messageData
}

const chatRoomDataFromPrisma1 = (data = {}, options = {}) => {
  const roomData = {}
  ;['id', 'title'].forEach(field => {
    if (data[field] !== undefined) {
      roomData[field] = data[field]
    }
  })

  const messages = relationInputFromPrisma1(data.messages)
  if (messages) {
    roomData.ChatMessage = messages
  }

  if (options.create) {
    roomData.id = roomData.id || generatePrismaId()
    roomData.createdAt = data.createdAt || now()
  }
  roomData.updatedAt = data.updatedAt || now()

  return roomData
}

const chatMessageDataFromPrisma1 = (data = {}, options = {}) => {
  const messageData = {}
  ;['id', 'text', 'author'].forEach(field => {
    if (data[field] !== undefined) {
      messageData[field] = data[field]
    }
  })

  const room = relationInputFromPrisma1(data.room)
  if (room) {
    messageData.ChatRoom = room
  }

  if (options.create) {
    messageData.id = messageData.id || generatePrismaId()
    messageData.createdAt = data.createdAt || now()
  }
  messageData.updatedAt = data.updatedAt || now()

  return messageData
}

const connectionFromPrismaResults = (items, count) => ({
  aggregate: {
    count
  },
  edges: (items || []).map(item => ({
    node: item,
    cursor: item && item.id ? item.id : ''
  })),
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: items && items[0] && items[0].id ? items[0].id : null,
    endCursor: items && items.length && items[items.length - 1].id ? items[items.length - 1].id : null
  }
})

const toAppUserRole = role => {
  if (!role) {
    return null
  }

  return {
    ...role,
    user: Array.isArray(role.User) ? role.User[0] : role.User,
    roles: role.AppRole || []
  }
}

const toAppUser = user => {
  if (!user) {
    return null
  }

  return {
    ...user,
    role: toAppUserRole(Array.isArray(user.AppUserRole) ? user.AppUserRole[0] : user.AppUserRole)
  }
}

const toAppRole = role => {
  if (!role) {
    return null
  }

  return {
    ...role,
    users: Array.isArray(role.AppUserRole) ? role.AppUserRole.map(toAppUserRole) : []
  }
}

const toAppWorkspace = workspace => {
  if (!workspace) {
    return null
  }

  return {
    ...workspace,
    members: Array.isArray(workspace.User) ? workspace.User.map(toAppUser) : []
  }
}

const toEmailMessage = message => {
  if (!message) {
    return null
  }

  return {
    ...message,
    mailbox: Array.isArray(message.EmailMailbox) ? message.EmailMailbox[0] : message.EmailMailbox,
    attachments: Array.isArray(message.MediaFile) ? message.MediaFile : []
  }
}

const toEmailMailbox = mailbox => {
  if (!mailbox) {
    return null
  }

  return {
    ...mailbox,
    messages: Array.isArray(mailbox.EmailMessage) ? mailbox.EmailMessage.map(toEmailMessage) : []
  }
}

const toChatMessage = message => {
  if (!message) {
    return null
  }

  return {
    ...message,
    room: Array.isArray(message.ChatRoom) ? message.ChatRoom[0] : message.ChatRoom
  }
}

const toChatRoom = room => {
  if (!room) {
    return null
  }

  return {
    ...room,
    messages: Array.isArray(room.ChatMessage) ? room.ChatMessage.map(toChatMessage) : []
  }
}

module.exports = {
  appListSettingArgsFromPrisma1,
  appListSettingDataFromPrisma1,
  appListSettingWhereFromPrisma1,
  appRoleArgsFromPrisma1,
  appRoleDataFromPrisma1,
  appRoleWhereFromPrisma1,
  appUserArgsFromPrisma1,
  appUserRoleCreateData,
  appUserRoleArgsFromPrisma1,
  appUserRoleDataFromPrisma1,
  appUserRoleWhereFromPrisma1,
  appWorkspaceArgsFromPrisma1,
  appWorkspaceDataFromPrisma1,
  appWorkspaceWhereFromPrisma1,
  chatMessageArgsFromPrisma1,
  chatMessageDataFromPrisma1,
  chatMessageWhereFromPrisma1,
  chatRoomArgsFromPrisma1,
  chatRoomDataFromPrisma1,
  chatRoomWhereFromPrisma1,
  connectionFromPrismaResults,
  emailMailboxArgsFromPrisma1,
  emailMailboxDataFromPrisma1,
  emailMailboxWhereFromPrisma1,
  emailMessageArgsFromPrisma1,
  emailMessageDataFromPrisma1,
  emailMessageWhereFromPrisma1,
  generatePrismaId,
  orderByFromPrisma1,
  paginationFromPrisma1,
  toAppRole,
  toAppUser,
  toAppUserRole,
  toAppWorkspace,
  toChatMessage,
  toChatRoom,
  toEmailMailbox,
  toEmailMessage,
  userWhereFromPrisma1
}
