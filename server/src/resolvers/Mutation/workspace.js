const { getUser, getUserId } = require('graphql-authentication')
const { addJobToQueue } = require('../../jobs/publishPosts')
const { deployWorkspace } = require('../../jobs/deploy')
const { addNoiseQueue } = require('../../jobs/noiseScheduler')
const {
  appUserRoleCreateData,
  appWorkspaceDataFromPrisma1,
  appWorkspaceWhereFromPrisma1,
  toAppWorkspace
} = require('../../services/prismaBridge')
const axios = require('axios')

async function createWorkspaceEndpoint(ctx, args) {
  let name = args.data.name
  // Deploy workspace endpoint
  deployWorkspace(name)
  // Add job to publishPosts Queue
  addJobToQueue(name)
  // Add noise schduler for workspace
  addNoiseQueue(name)
}

async function ensureEvaluationAdminRole(ctx, userId) {
  if (ctx.prisma) {
    const adminRole = await ctx.prisma.appRole.findFirst({
      where: {
        name: 'ADMIN'
      }
    })
    if (!adminRole) {
      return
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        AppUserRole: {
          include: {
            AppRole: true
          }
        }
      }
    })
    const roleLinks = user && Array.isArray(user.AppUserRole) ? user.AppUserRole : []
    if (roleLinks.some(roleLink => Array.isArray(roleLink.AppRole) && roleLink.AppRole.some(role => role.name === 'ADMIN'))) {
      return
    }

    if (roleLinks[0] && roleLinks[0].id) {
      await ctx.prisma.appUserRole.delete({
        where: {
          id: roleLinks[0].id
        }
      })
    }

    await ctx.prisma.appUserRole.create({
      data: appUserRoleCreateData(userId, adminRole.id)
    })
    return
  }

  const adminRole = await ctx.db.query.appRole({ where: { name: 'ADMIN' } }, '{ id }')
  if (!adminRole) {
    return
  }

  const user = await ctx.db.query.user(
    { where: { id: userId } },
    '{ role { id roles { name } } }'
  )

  if (
    user &&
    user.role &&
    user.role.roles &&
    user.role.roles.some(role => role.name === 'ADMIN')
  ) {
    return
  }

  if (user && user.role && user.role.id) {
    await ctx.db.mutation.deleteAppUserRole({
      where: {
        id: user.role.id
      }
    })
  }

  await ctx.db.mutation.createAppUserRole({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      roles: {
        connect: [
          {
            id: adminRole.id
          }
        ]
      }
    }
  })
}

const appWorkspaceMutation = {
  async requestAppWorkspace(parent, args, ctx, info) {
    // TODO: Automate this so that the admins of the workspace get notified and can grant access
    let user = await getUser(ctx)
    if (!process.env.SLACK_WORKSPACE_REQUEST_WEBHOOK) {
      if (ctx.prisma) {
        const workspaces = await ctx.prisma.appWorkspace.findMany({
          take: 1
        })
        if (workspaces && workspaces[0]) {
          await ctx.prisma.appWorkspace.update({
            data: {
              User: {
                connect: {
                  id: user.id
                }
              },
              updatedAt: new Date()
            },
            where: {
              id: workspaces[0].id
            }
          })
          await ensureEvaluationAdminRole(ctx, user.id)
          return 'Workspace access granted for ' + user.email
        }

        return 'Workspace access request received for ' + user.email
      }

      const workspaces = await ctx.db.query.appWorkspaces({ first: 1 })
      if (workspaces && workspaces[0]) {
        await ctx.db.mutation.updateAppWorkspace({
          data: {
            members: {
              connect: {
                id: user.id
              }
            }
          },
          where: {
            id: workspaces[0].id
          }
        })
        await ensureEvaluationAdminRole(ctx, user.id)
        return 'Workspace access granted for ' + user.email
      }

      return 'Workspace access request received for ' + user.email
    }

    let payload = {
      text:
        user.email +
        ' is requesting access to a workspace on ' +
        process.env.APP_DOMAIN
    }

    let result = await axios.post(
      process.env.SLACK_WORKSPACE_REQUEST_WEBHOOK,
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    return result.data
  },
  // assignUserToWorkspace
  async assignUserToWorkspace(parent, args, ctx, info) {
    if (args && args.data && args.data.connect) {
      if (ctx.prisma) {
        const appWorkspace = await ctx.prisma.appWorkspace.update({
          data: {
            User: {
              connect: {
                id: args.data.connect.id
              }
            }
          },
          where: args.where,
          include: {
            User: true
          }
        })

        // Send email
        if (ctx.graphqlAuthentication.mailer) {
          let user = await ctx.prisma.user.findUnique({
            where: {
              id: args.data.connect.id
            }
          })
          let workspace = await ctx.prisma.appWorkspace.findFirst({
            where: appWorkspaceWhereFromPrisma1(args.where)
          })
          if (user && user.inviteAccepted)
            ctx.graphqlAuthentication.mailer.send({
              template: 'addUserToWorkspace',
              message: {
                to: user.email
              },
              locals: {
                mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
                email: user.email,
                workspaceName: workspace.displayName
              }
            })
        }

        return toAppWorkspace(appWorkspace)
      }

      let variables = {
        data: {
          members: {
            connect: {
              id: args.data.connect.id
            }
          }
        },
        where: args.where
      }
      let appWorkspace = await ctx.db.mutation.updateAppWorkspace(variables)

      // Send email
      if (ctx.graphqlAuthentication.mailer) {
        let user = await ctx.db.query.user({
          where: {
            id: args.data.connect.id
          }
        })
        let workspace = await ctx.db.query.appWorkspace({
          where: args.where
        })
        if (user && user.inviteAccepted)
          ctx.graphqlAuthentication.mailer.send({
            template: 'addUserToWorkspace',
            message: {
              to: user.email
            },
            locals: {
              mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
              email: user.email,
              workspaceName: workspace.displayName
            }
          })
      }

      return appWorkspace
    }

  },
  async createAppWorkspace(parent, args, ctx, info) {
    if (ctx.prisma) {
      const appWorkspace = await ctx.prisma.appWorkspace.create({
        data: appWorkspaceDataFromPrisma1(args.data, { create: true }),
        include: {
          User: true
        }
      })
      createWorkspaceEndpoint(ctx, args)
      await ctx.prisma.appWorkspace.update({
        data: {
          User: {
            connect: {
              id: getUserId(ctx)
            }
          },
          status: 'Deploying',
          updatedAt: new Date()
        },
        where: {
          name: appWorkspace.name
        }
      })

      return toAppWorkspace(appWorkspace)
    }

    // Insert into AppWorkspace
    let appWorkspace = await ctx.db.mutation.createAppWorkspace(args, info)
    // If everything went well, create and deploy endpoint
    createWorkspaceEndpoint(ctx, args)
    // Add user to workspace & Update Workspace status
    let variables = {
      data: {
        members: {
          connect: {
            id: getUserId(ctx)
          }
        },
        status: 'Deploying'
      },
      where: {
        name: appWorkspace.name
      }
    }
    await ctx.db.mutation.updateAppWorkspace(variables)

    // return workspace
    return appWorkspace
  },
  async updateAppWorkspace(parent, args, ctx, info) {
    if (ctx.prisma) {
      const data = await ctx.prisma.appWorkspace.update({
        data: appWorkspaceDataFromPrisma1(args.data),
        where: args.where,
        include: {
          User: true
        }
      })
      const connectedUsers = args && args.data && args.data.members
        ? args.data.members.connect
        : null
      const firstConnectedUser = Array.isArray(connectedUsers) ? connectedUsers[0] : connectedUsers
      if (firstConnectedUser && ctx.graphqlAuthentication && ctx.graphqlAuthentication.mailer) {
        let user = await ctx.prisma.user.findUnique({
          where: {
            id: firstConnectedUser.id
          }
        })
        let workspace = await ctx.prisma.appWorkspace.findFirst({
          where: appWorkspaceWhereFromPrisma1(args.where)
        })
        if (user && user.inviteAccepted)
          ctx.graphqlAuthentication.mailer.send({
            template: 'addUserToWorkspace',
            message: {
              to: user.email
            },
            locals: {
              mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
              email: user.email,
              workspaceName: workspace.displayName
            }
          })
      }

      return toAppWorkspace(data)
    }

    let data = await ctx.db.mutation.updateAppWorkspace(args, info)
    if (args && args.data && args.data.members && args.data.members.connect) {
      // Send email when users are assigned to a workspace
      if (ctx.graphqlAuthentication.mailer) {
        let user = await ctx.db.query.user({
          where: {
            id: args.data.members.connect[0].id
          }
        })
        let workspace = await ctx.db.query.appWorkspace({
          where: args.where
        })
        if (user && user.inviteAccepted)
          // send email
          ctx.graphqlAuthentication.mailer.send({
            template: 'addUserToWorkspace',
            message: {
              to: user.email
            },
            locals: {
              mailAppUrl: ctx.graphqlAuthentication.mailAppUrl,
              email: user.email,
              workspaceName: workspace.displayName
            }
          })
      }
    }

    return data
  },
  async upsertAppWorkspace(parent, args, ctx, info) {
    if (ctx.prisma) {
      const appWorkspace = await ctx.prisma.appWorkspace.upsert({
        where: args.where,
        create: appWorkspaceDataFromPrisma1(args.create, { create: true }),
        update: appWorkspaceDataFromPrisma1(args.update),
        include: {
          User: true
        }
      })
      return toAppWorkspace(appWorkspace)
    }

    return ctx.db.mutation.upsertAppWorkspace(args, info)
  },
  async deleteAppWorkspace(parent, args, ctx, info) {
    if (ctx.prisma) {
      const appWorkspace = await ctx.prisma.appWorkspace.delete({
        where: args.where,
        include: {
          User: true
        }
      })
      return toAppWorkspace(appWorkspace)
    }

    return ctx.db.mutation.deleteAppWorkspace(args, info)
  }
}

module.exports = {
  appWorkspaceMutation
}
