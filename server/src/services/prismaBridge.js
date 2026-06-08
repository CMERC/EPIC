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

const simpleWhereFromPrisma1 = (where, fields, mapper) => {
  if (!where) {
    return undefined
  }

  return {
    ...combineLogicalFilters(where, mapper),
    ...fields.reduce((filters, field) => ({
      ...filters,
      ...scalarFilter(where, field)
    }), {})
  }
}

const simpleArgsFromPrisma1 = (args, whereMapper) => ({
  where: whereMapper(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const simpleDataFromPrisma1 = (data = {}, fields, options = {}) => {
  const modelData = {}
  fields.forEach(field => {
    if (data[field] !== undefined) {
      modelData[field] = data[field]
    }
  })

  if (options.create) {
    modelData.id = modelData.id || generatePrismaId()
    modelData.createdAt = data.createdAt || now()
  }
  modelData.updatedAt = data.updatedAt || now()

  return modelData
}

const mediaNetworkFields = ['id', 'createdAt', 'updatedAt', 'name', 'displayName', 'description', 'icon', 'color', 'template']
const mediaServiceFields = ['id', 'createdAt', 'updatedAt', 'name', 'displayName', 'type', 'description', 'icon', 'color', 'template']
const mediaNoiseLevelFields = ['id', 'createdAt', 'updatedAt', 'name', 'displayName', 'description', 'templates', 'duration', 'rate']
const mediaPostFields = ['id', 'createdAt', 'updatedAt', 'createTime', 'updateTime', 'isPublished', 'publishTime', 'title', 'text', 'url', 'isUserGenerated', 'counts']
const mediaProfileFields = ['id', 'createdAt', 'updatedAt', 'username', 'name', 'description', 'url', 'createdTime', 'isUserGenerated', 'language', 'counts']
const mediaPersonaFields = ['id', 'createdAt', 'updatedAt', 'name', 'role', 'description']
const mapLayerFields = ['id', 'createdAt', 'updatedAt', 'title', 'type', 'geojson']
const planReasonFields = ['id', 'createdAt', 'updatedAt', 'title']
const planMethodFields = ['id', 'createdAt', 'updatedAt', 'title']
const planEventFields = ['id', 'createdAt', 'updatedAt', 'name', 'type', 'method', 'startDate', 'endDate', 'description', 'color', 'exerciseGuidance']
const planInjectFields = ['id', 'createdAt', 'updatedAt', 'number', 'title', 'description', 'mitigation', 'type', 'trigger', 'response', 'responseDate', 'remarks', 'deletedAt', 'startDate', 'from', 'to']
const planMeetingFields = ['id', 'createdAt', 'updatedAt', 'name', 'location', 'startDate', 'endDate']
const planFundingSourceFields = ['id', 'createdAt', 'updatedAt', 'primarySource', 'subSource', 'amount']
const planPriorityLevelFields = ['id', 'createdAt', 'updatedAt', 'title', 'description']

const mediaNetworkWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, mediaNetworkFields, mediaNetworkWhereFromPrisma1)
const mediaServiceWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, mediaServiceFields, mediaServiceWhereFromPrisma1)
const mediaNoiseLevelWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, mediaNoiseLevelFields, mediaNoiseLevelWhereFromPrisma1)
const mapLayerWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, mapLayerFields, mapLayerWhereFromPrisma1)
const planReasonWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, planReasonFields, planReasonWhereFromPrisma1)
const planMethodWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, planMethodFields, planMethodWhereFromPrisma1)
const planEventWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, planEventFields, planEventWhereFromPrisma1)
const planMeetingWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, planMeetingFields, planMeetingWhereFromPrisma1)
const planFundingSourceWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, planFundingSourceFields, planFundingSourceWhereFromPrisma1)
const planPriorityLevelWhereFromPrisma1 = where => simpleWhereFromPrisma1(where, planPriorityLevelFields, planPriorityLevelWhereFromPrisma1)

const appUserArgsFromPrisma1 = args => ({
  where: userWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const mediaProfileWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = simpleWhereFromPrisma1(where, mediaProfileFields, mediaProfileWhereFromPrisma1)

  if (where.service) {
    filters.MediaService = { some: mediaServiceWhereFromPrisma1(where.service) }
  }
  if (where.service_some) {
    filters.MediaService = { some: mediaServiceWhereFromPrisma1(where.service_some) }
  }

  return filters
}

const mediaPersonaWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = simpleWhereFromPrisma1(where, mediaPersonaFields, mediaPersonaWhereFromPrisma1)

  if (where.profiles_some) {
    filters.MediaProfile = { some: mediaProfileWhereFromPrisma1(where.profiles_some) }
  }
  if (where.profiles_none) {
    filters.MediaProfile = { none: mediaProfileWhereFromPrisma1(where.profiles_none) }
  }
  if (where.networks_some) {
    filters.MediaNetwork = { some: mediaNetworkWhereFromPrisma1(where.networks_some) }
  }

  return filters
}

const mediaPostWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = simpleWhereFromPrisma1(where, mediaPostFields, mediaPostWhereFromPrisma1)

  if (where.profiles_some) {
    filters.MediaProfile = { some: mediaProfileWhereFromPrisma1(where.profiles_some) }
  }
  if (where.profiles_none) {
    filters.MediaProfile = { none: mediaProfileWhereFromPrisma1(where.profiles_none) }
  }
  if (where.location) {
    filters.Location = { some: simpleWhereFromPrisma1(where.location, ['id', 'geojson', 'geohash'], value => simpleWhereFromPrisma1(value, ['id', 'geojson', 'geohash'])) }
  }

  return filters
}

const mediaPostArgsFromPrisma1 = args => ({
  where: mediaPostWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const mediaProfileArgsFromPrisma1 = args => ({
  where: mediaProfileWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const mediaPersonaArgsFromPrisma1 = args => ({
  where: mediaPersonaWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const mapLayerArgsFromPrisma1 = args => ({
  where: mapLayerWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const planInjectWhereFromPrisma1 = where => {
  if (!where) {
    return undefined
  }

  const filters = simpleWhereFromPrisma1(where, planInjectFields, planInjectWhereFromPrisma1)

  if (where.deletedAt === null) {
    filters.deletedAt = null
  }
  if (where.events_some) {
    filters.PlanEvent = { some: planEventWhereFromPrisma1(where.events_some) }
  }
  if (where.events_none) {
    filters.PlanEvent = { none: planEventWhereFromPrisma1(where.events_none) }
  }
  if (where.objectives_some) {
    filters.PlanTrainingObjective = { some: simpleWhereFromPrisma1(where.objectives_some, ['id']) }
  }
  if (where.status) {
    filters.PlanLabel = { some: simpleWhereFromPrisma1(where.status, ['id', 'title', 'description', 'color']) }
  }

  return filters
}

const planInjectArgsFromPrisma1 = args => ({
  where: planInjectWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const userDataFromPrisma1 = (data = {}, options = {}) => {
  const userData = {}
  ;[
    'id',
    'email',
    'password',
    'name',
    'inviteToken',
    'inviteAccepted',
    'emailConfirmed',
    'emailConfirmToken',
    'resetToken',
    'resetExpires',
    'deletedAt',
    'lastLogin',
    'joinedAt',
    'isSuper',
    'sessionId'
  ].forEach(field => {
    if (data[field] !== undefined) {
      userData[field] = data[field]
    }
  })

  if (options.create) {
    userData.id = userData.id || generatePrismaId()
    userData.createdAt = data.createdAt || now()
    userData.updatedAt = data.updatedAt || now()
    userData.inviteAccepted = userData.inviteAccepted === undefined ? false : userData.inviteAccepted
    userData.emailConfirmed = userData.emailConfirmed === undefined ? false : userData.emailConfirmed
    userData.isSuper = userData.isSuper === undefined ? false : userData.isSuper
  } else {
    userData.updatedAt = data.updatedAt || now()
  }

  return userData
}

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

const mediaNetworkArgsFromPrisma1 = args => simpleArgsFromPrisma1(args, mediaNetworkWhereFromPrisma1)
const mediaServiceArgsFromPrisma1 = args => simpleArgsFromPrisma1(args, mediaServiceWhereFromPrisma1)
const mediaNoiseLevelArgsFromPrisma1 = args => simpleArgsFromPrisma1(args, mediaNoiseLevelWhereFromPrisma1)
const planReasonArgsFromPrisma1 = args => simpleArgsFromPrisma1(args, planReasonWhereFromPrisma1)
const planMethodArgsFromPrisma1 = args => simpleArgsFromPrisma1(args, planMethodWhereFromPrisma1)
const planEventArgsFromPrisma1 = args => simpleArgsFromPrisma1(args, planEventWhereFromPrisma1)
const planMeetingArgsFromPrisma1 = args => simpleArgsFromPrisma1(args, planMeetingWhereFromPrisma1)
const planFundingSourceArgsFromPrisma1 = args => simpleArgsFromPrisma1(args, planFundingSourceWhereFromPrisma1)
const planPriorityLevelArgsFromPrisma1 = args => simpleArgsFromPrisma1(args, planPriorityLevelWhereFromPrisma1)

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

const mediaNetworkDataFromPrisma1 = (data = {}, options = {}) => simpleDataFromPrisma1(data, mediaNetworkFields, options)
const mediaServiceDataFromPrisma1 = (data = {}, options = {}) => simpleDataFromPrisma1(data, mediaServiceFields, options)
const mediaNoiseLevelDataFromPrisma1 = (data = {}, options = {}) => simpleDataFromPrisma1(data, mediaNoiseLevelFields, options)
const planReasonDataFromPrisma1 = (data = {}, options = {}) => simpleDataFromPrisma1(data, planReasonFields, options)
const planMethodDataFromPrisma1 = (data = {}, options = {}) => simpleDataFromPrisma1(data, planMethodFields, options)
const planFundingSourceDataFromPrisma1 = (data = {}, options = {}) => simpleDataFromPrisma1(data, planFundingSourceFields, options)
const planPriorityLevelDataFromPrisma1 = (data = {}, options = {}) => simpleDataFromPrisma1(data, planPriorityLevelFields, options)

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

const toMediaProfile = profile => {
  if (!profile) {
    return null
  }

  return {
    ...profile,
    location: Array.isArray(profile.Location) ? profile.Location[0] : profile.Location,
    banner: Array.isArray(profile.MediaBanner) ? profile.MediaBanner[0] : profile.MediaBanner,
    avatar: Array.isArray(profile.MediaFile) ? profile.MediaFile[0] : profile.MediaFile,
    service: Array.isArray(profile.MediaService) ? profile.MediaService[0] : profile.MediaService,
    persona: Array.isArray(profile.MediaPersona) ? profile.MediaPersona[0] : profile.MediaPersona
  }
}

const toMediaPost = post => {
  if (!post) {
    return null
  }

  return {
    ...post,
    profiles: Array.isArray(post.MediaProfile) ? post.MediaProfile.map(toMediaProfile) : [],
    location: Array.isArray(post.Location) ? post.Location[0] : post.Location,
    mediaFile: Array.isArray(post.MediaFile) ? post.MediaFile[0] : post.MediaFile,
    comments: Array.isArray(post.MediaPost_A) ? post.MediaPost_A.map(toMediaPost) : [],
    parent: Array.isArray(post.MediaPost_B) ? post.MediaPost_B[0] : post.MediaPost_B
  }
}

const toMediaPersonaSlim = persona => {
  if (!persona) {
    return null
  }

  return {
    ...persona,
    avatar: Array.isArray(persona.MediaFile) ? persona.MediaFile[0] : persona.MediaFile,
    location: Array.isArray(persona.Location) ? persona.Location[0] : persona.Location,
    profiles: Array.isArray(persona.MediaProfile) ? persona.MediaProfile.map(toMediaProfile) : [],
    attributes: Array.isArray(persona.KeyValue) ? persona.KeyValue : []
  }
}

const toMediaPersonaEdge = edge => {
  if (!edge) {
    return null
  }

  return {
    ...edge,
    start: Array.isArray(edge.MediaPersona_PersonaStart)
      ? edge.MediaPersona_PersonaStart.map(toMediaPersonaSlim)
      : [],
    end: Array.isArray(edge.MediaPersona_PersonaEnd)
      ? edge.MediaPersona_PersonaEnd.map(toMediaPersonaSlim)
      : []
  }
}

const toMediaPersona = persona => {
  if (!persona) {
    return null
  }

  return {
    ...toMediaPersonaSlim(persona),
    relatesTo: Array.isArray(persona.MediaPersonaEdge_PersonaStart)
      ? persona.MediaPersonaEdge_PersonaStart.map(toMediaPersonaEdge)
      : [],
    relatesFrom: Array.isArray(persona.MediaPersonaEdge_PersonaEnd)
      ? persona.MediaPersonaEdge_PersonaEnd.map(toMediaPersonaEdge)
      : []
  }
}

const toPlanInjectSlim = inject => {
  if (!inject) {
    return null
  }

  return {
    ...inject,
    location: Array.isArray(inject.Location) ? inject.Location[0] : inject.Location,
    method: Array.isArray(inject.PlanMethod) ? inject.PlanMethod[0] : inject.PlanMethod,
    owner: Array.isArray(inject.PlanInjectOwner) ? inject.PlanInjectOwner[0] : inject.PlanInjectOwner,
    status: Array.isArray(inject.PlanLabel) ? inject.PlanLabel[0] : inject.PlanLabel,
    attachments: Array.isArray(inject.MediaFile) ? inject.MediaFile : [],
    events: Array.isArray(inject.PlanEvent) ? inject.PlanEvent.map(toPlanEvent) : [],
    objectives: Array.isArray(inject.PlanTrainingObjective) ? inject.PlanTrainingObjective : []
  }
}

const toPlanEvent = event => {
  if (!event) {
    return null
  }

  return {
    ...event,
    title: event.name,
    start: event.startDate,
    end: event.endDate,
    locations: Array.isArray(event.Location) ? event.Location : [],
    organization: Array.isArray(event.PlanOrganization) ? event.PlanOrganization[0] : event.PlanOrganization,
    injects: Array.isArray(event.PlanInject) ? event.PlanInject.map(toPlanInjectSlim) : []
  }
}

const toPlanMeeting = meeting => {
  if (!meeting) {
    return null
  }

  return {
    ...meeting,
    title: meeting.name,
    start: meeting.startDate,
    end: meeting.endDate
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
  mediaNetworkArgsFromPrisma1,
  mediaNetworkDataFromPrisma1,
  mediaNetworkWhereFromPrisma1,
  mediaNoiseLevelArgsFromPrisma1,
  mediaNoiseLevelDataFromPrisma1,
  mediaNoiseLevelWhereFromPrisma1,
  mediaPersonaArgsFromPrisma1,
  mediaPersonaWhereFromPrisma1,
  mediaPostArgsFromPrisma1,
  mediaPostWhereFromPrisma1,
  mediaProfileArgsFromPrisma1,
  mediaProfileWhereFromPrisma1,
  mediaServiceArgsFromPrisma1,
  mediaServiceDataFromPrisma1,
  mediaServiceWhereFromPrisma1,
  mapLayerArgsFromPrisma1,
  mapLayerWhereFromPrisma1,
  orderByFromPrisma1,
  paginationFromPrisma1,
  planFundingSourceArgsFromPrisma1,
  planFundingSourceDataFromPrisma1,
  planFundingSourceWhereFromPrisma1,
  planEventArgsFromPrisma1,
  planEventWhereFromPrisma1,
  planInjectArgsFromPrisma1,
  planInjectWhereFromPrisma1,
  planMeetingArgsFromPrisma1,
  planMeetingWhereFromPrisma1,
  planMethodArgsFromPrisma1,
  planMethodDataFromPrisma1,
  planMethodWhereFromPrisma1,
  planPriorityLevelArgsFromPrisma1,
  planPriorityLevelDataFromPrisma1,
  planPriorityLevelWhereFromPrisma1,
  planReasonArgsFromPrisma1,
  planReasonDataFromPrisma1,
  planReasonWhereFromPrisma1,
  toAppRole,
  toAppUser,
  toAppUserRole,
  toAppWorkspace,
  toChatMessage,
  toChatRoom,
  toEmailMailbox,
  toEmailMessage,
  toMediaPost,
  toMediaPersona,
  toMediaPersonaEdge,
  toMediaProfile,
  toPlanEvent,
  toPlanInjectSlim,
  toPlanMeeting,
  userDataFromPrisma1,
  userWhereFromPrisma1
}
