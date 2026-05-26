const jwt = require('jsonwebtoken')

function getUserIdWebSocket(ctx) {
  const Authorization = ctx.connection.authorization
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, ctx.graphqlAuthentication.secret)
    return userId
  }
  return ''
}

module.exports = {
  getUserIdWebSocket
}