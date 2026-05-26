const axios = require('axios')
var qs = require('qs')

const cobraQueries = {
  async getCobraIncidentsByUser(/*parent, args, ctx, info*/) {

    let response = await axios.get(process.env.COBRA_INCIDENT_API)
    return response

  },
  async getCobraAuthorization(parent, args, ctx, info) {
    var data = qs.stringify({
      'grant_type': 'password',
      'username': args.username,
      'password': args.password
    })

    var config = {
      method: 'post',
      url: process.env.COBRA_BASE_API + '/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'access-control-expose-headers': 'Request-Context',
        'cache-control': 'no-cache',
        'date': new Date().toString(),
        'expires': '-1',
        'pragma': 'no-cache',
        'request-context': 'appId=cid-v1:af1107c2-7374-4829-b0f6-215a5054f9e7',
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'SameOrigin',
        'x-robots-tag': 'noindex, nofollow'
      },
      data: data
    }

    let res = {
      'access_token': null,
      'error': ''
    }

    await axios(config)
      .then((response) => {
        if (response) {
          res.access_token = response.data.access_token
        }
      })
      .catch((error) => {
        if (error.response) {
          res.error = error.response.data
        }
      })
    return res
  }
}

module.exports = {
  cobraQueries
}