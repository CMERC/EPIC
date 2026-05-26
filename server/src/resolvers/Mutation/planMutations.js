const PlanMutations = {
  async feedbackRequest(parent, { email, feedbackUrl }, ctx, info) {
    // Send email
    if (ctx.graphqlAuthentication.mailer && email && email.length > 0) {
      ctx.graphqlAuthentication.mailer.send({
        template: 'feedbackRequest',
        message: {
          to: email
        },
        locals: {
          mailAppUrl: ctx.graphqlAuthentication.mailAppUrl + feedbackUrl,
          email: email,
          workspaceName: info.workspaceDisplayName
        }
      })

      return true
    } else return
  }
}

module.exports = { PlanMutations }
