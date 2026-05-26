const { getUser, getUserId } = require('graphql-authentication')
const { addJobToQueue } = require('../../jobs/publishPosts')
const { deployWorkspace } = require('../../jobs/deploy')
const { addNoiseQueue } = require('../../jobs/noiseScheduler')
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
const appWorkspaceMutation = {
  async requestAppWorkspace(parent, args, ctx, info) {
    // TODO: Automate this so that the admins of the workspace get notified and can grant access
    let user = await getUser(ctx)
    if (!process.env.SLACK_WORKSPACE_REQUEST_WEBHOOK) {
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
  upsertAppWorkspace(parent, args, ctx, info) {
    return ctx.db.mutation.upsertAppWorkspace(args, info)
  },
  deleteAppWorkspace(parent, args, ctx, info) {
    return ctx.db.mutation.deleteAppWorkspace(args, info)
  }
}

module.exports = {
  appWorkspaceMutation
}
