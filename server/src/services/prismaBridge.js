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
  ;['connect', 'disconnect', 'set'].forEach(action => {
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

const appRoleArgsFromPrisma1 = args => ({
  where: appRoleWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const appUserRoleArgsFromPrisma1 = args => ({
  where: appUserRoleWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
})

const appWorkspaceArgsFromPrisma1 = args => ({
  where: appWorkspaceWhereFromPrisma1(args.where),
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

module.exports = {
  appListSettingArgsFromPrisma1,
  appListSettingWhereFromPrisma1,
  appRoleArgsFromPrisma1,
  appRoleWhereFromPrisma1,
  appUserArgsFromPrisma1,
  appUserRoleCreateData,
  appUserRoleArgsFromPrisma1,
  appUserRoleWhereFromPrisma1,
  appWorkspaceArgsFromPrisma1,
  appWorkspaceDataFromPrisma1,
  appWorkspaceWhereFromPrisma1,
  connectionFromPrismaResults,
  generatePrismaId,
  orderByFromPrisma1,
  paginationFromPrisma1,
  toAppRole,
  toAppUser,
  toAppUserRole,
  toAppWorkspace,
  userWhereFromPrisma1
}
