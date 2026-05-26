const { promisify } = require('util')

const track = {
  async mediaPostsTrackInjectsReport(parent, args, ctx) {
    let totalUserGeneratedPosts = await ctx.db.query.mediaPostsConnection(
      {
        where: {
          isUserGenerated: true,
          isPublished: true
        }
      },
      '{aggregate {count}}'
    )
    let regisData = await getRedisScanData(parent, args, ctx)
    let viewedCount = 0
    let totalViews = 0
    for (let i = 0; i < regisData.length; i++) {
      let postObj = await ctx.db.query.mediaPost(
        {
          where: { id: regisData[i].id }
        },
        '{ isUserGenerated}'
      )
      if (postObj && postObj.isUserGenerated)
        viewedCount++

      if (regisData[i].views) totalViews += regisData[i].views
    }

    let chartData = [{
      values: [totalUserGeneratedPosts.aggregate.count - viewedCount, viewedCount],
      labels: ['Unviewed', 'Views'],
      type: 'pie',
      marker: {
        colors: ['rgb(126,223,126)', 'rgb(240, 228, 66)']
      }
    },
    {
      x: ['Views', 'Unique Views'],
      y: [totalViews, regisData.length],
      type: 'bar'
    }
    ]
    return {
      data: chartData,
      total: totalUserGeneratedPosts.aggregate.count
    }
  },
  async mediaPostsTrackConnection(parent, args, ctx) {
    const limit = 50

    let result = {
      count: 0,
      views: 0,
      visitors: 0
    }

    let nodes = await getRedisScanData(parent, args, ctx)

    //Count the number of pages viewd
    result.count = nodes.length

    //Count the total views
    let initialValue = 0
    result.views = nodes.reduce(
      (accumulator, currentValue) => accumulator + currentValue.views,
      initialValue)

    //Count the total visitors
    result.visitors = nodes.reduce(
      (accumulator, currentValue) => accumulator + 1,
      initialValue)


    //trucate array
    if (result.length > limit) {
      result.length = limit
    }
    return result
  },
  async mediaPostsTrack(parent, args, ctx) {
    let result = await getRedisScanData(parent, args, ctx)
    // Lookup post node for each id
    result = result.map(postObj => {
      postObj.node = ctx.db.query.mediaPost(
        {
          where: { id: postObj.id }
        },
        // TODO: Figure out how to pull the "node" selection from 'info' variable for a full MediaPost instead of hard coding
        '{ id title text publishTime mediaFile { id name contentType url } profiles { id username name avatar { id url } service { id name displayName type icon color } }}'
      )

      return postObj
    })

    // Sort by number of page views by default
    result = result.sort(function(a, b) {
      return a.views < b.views
    })

    return result
  }
}
async function getRedisScanData(parent, args, ctx) {
  let activeWorkspace = 'global'
  if (args.data && args.data.workspace) {
    activeWorkspace = args.data.workspace
  }

  let resultViews = []
  // Make call to redis promise
  const scanAsync = promisify(ctx.redisClient.scan).bind(ctx.redisClient)
  const getAsync = promisify(ctx.redisClient.get).bind(ctx.redisClient)

  const count = '10000'
  let pattern = 'media:trackViews:' + activeWorkspace + '*'

  let iterator = '0'
  do {
    iterator = await scanAsync(
      iterator,
      'MATCH',
      pattern,
      'COUNT',
      count
    ).then(data => {
      let nextIterator = data[0]
      let scanKeys = data[1]

      for (let i = 0, len = scanKeys.length; i < len; i++) {
        let key = scanKeys[i]
        getAsync(key).then(count => {
          let subKeys = key.split(':')
          resultViews.push({
            id: subKeys[3],
            views: parseInt(count),
            visitors: 0
          })
        })
      }

      return nextIterator
    })
  } while (iterator !== '0')

  let resultVisitors = []
  // Make call to redis promise
  const pfcountAsync = promisify(ctx.redisClient.pfcount).bind(
    ctx.redisClient
  )
  pattern = 'media:trackVisitors:' + activeWorkspace + '*'
  do {
    iterator = await scanAsync(
      iterator,
      'MATCH',
      pattern,
      'COUNT',
      count
    ).then(data => {
      let nextIterator = data[0]
      let scanKeys = data[1]
      if (scanKeys && scanKeys.length > 0) {
        for (let i = 0, len = scanKeys.length; i < len; i++) {
          let key = scanKeys[i]

          pfcountAsync(key).then(count => {
            let subKeys = key.split(':')
            resultVisitors.push({
              id: subKeys[3],
              visitors: parseInt(count),
              views: 0
            })
          })
        }
      }

      return nextIterator
    })
  } while (iterator !== '0')

  // Merge views and visitors
  let result = resultViews
  resultVisitors.forEach((item) => {
    let f = result.find((i) => { return item.id === i.id })
    if (f) {
      f.visitors = item.visitors
    } else {
      result.push(item)
    }
  })

  return result
}

module.exports = {
  track
}
