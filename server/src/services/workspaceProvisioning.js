const WORKSPACE_STATUS = {
  AVAILABLE: 'Available',
  DEPLOYING: 'Deploying',
  SUSPENDED: 'Suspended',
  ARCHIVED: 'Archived'
}

function workspaceAccessError(workspace) {
  if (!workspace) {
    return 'Sorry, no workspace has been selected'
  }

  if (!workspace.status || workspace.status === WORKSPACE_STATUS.AVAILABLE) {
    return null
  }

  if (workspace.status === WORKSPACE_STATUS.DEPLOYING) {
    return 'Workspace is still deploying'
  }

  if (workspace.status === WORKSPACE_STATUS.SUSPENDED) {
    return 'Workspace subscription is suspended'
  }

  if (workspace.status === WORKSPACE_STATUS.ARCHIVED) {
    return 'Workspace is archived'
  }

  return `Workspace is not available: ${workspace.status}`
}

module.exports = {
  WORKSPACE_STATUS,
  workspaceAccessError
}
