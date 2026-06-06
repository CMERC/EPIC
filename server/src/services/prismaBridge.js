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

const appWorkspaceArgsFromPrisma1 = args => ({
  where: appWorkspaceWhereFromPrisma1(args.where),
  orderBy: orderByFromPrisma1(args.orderBy),
  ...paginationFromPrisma1(args)
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
  appUserArgsFromPrisma1,
  appWorkspaceArgsFromPrisma1,
  appWorkspaceWhereFromPrisma1,
  orderByFromPrisma1,
  paginationFromPrisma1,
  toAppUser,
  toAppWorkspace,
  userWhereFromPrisma1
}
