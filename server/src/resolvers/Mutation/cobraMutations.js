const axios = require('axios')

const cobraMutations = {
  async pushInjectToCobraMultiLog(/*parent, args, ctx, info*/) {
    let response = await axios.get(process.env.COBRA_MULTILOG_API)
    return response

  },
  async pushInjectToCobraRequestManager(parent, args, ctx, info) {
    var data = {
      'IncidentName': args.data.incidentName,
      'Details': args.data.details,
      'Title': args.data.title,
      'RequestType': args.data.requestType,
      'Organization': args.data.organization,
      'Status': args.data.status,
      'Priority': args.data.priority
    }


    var config = {
      method: 'post',
      url: process.env.COBRA_BASE_API + '/api/ResourceReqAPI/AddRequest',
      headers: {
        'Authorization': 'Bearer ' + args.data.token,
        'Content-Type': 'application/json',
        'access-control-expose-headers': 'Request-Context',
        'cache-control': 'no-cache',
        'content-type': 'application/json;charset=UTF-8',
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
      'status': null,
      'error': null
    }
    await axios(config)
      .then((response) => {
        res.status = response.status
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
  cobraMutations
}