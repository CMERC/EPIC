const faker = require('faker')
const userGen = require('username-generator')
const fetch = require('node-fetch')
const { queryRandomAvatar } = require('../../noise/helpers')

async function fetchGraphql(uri, query) {
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({ query })
  })

  if (!response.ok) {
    throw new Error(`GraphQL Faker returned ${response.status}`)
  }

  return response.json()
}

const randomDataQueries = {
  async getRandomData(parent, args, ctx, info) {
    let query
    let type
    if (args && args.where && args.where.type) {
      type = args.where.type
      switch (type) {
      case 'profile': {
        query = `{
                profile{
                  name
                  username
                  jobTitle
                  company
                }
              }`
        break
      }
      case 'post': {
        query = `{
                post{
                  text
                  longitude
                  latitude
                  publishTime
                }
              }`
        break
      }
      }
    }
    // Get query based on requested data type
    if (query) {
      let data = await fetchGraphql(process.env.FAKER_GRAPHQL_ENDPOINT, query).then(async res => {
        let response = {}
        switch (type) {
        case 'profile': {
          response.name = res.data.profile.name
          response.username = userGen.generateUsername()
          response.description = ''
          let tempAvatar = await queryRandomAvatar()
          response.avatar = {

            name: 'Avatar',
            contentType: 'image/jpeg',
            url: {
              raw: tempAvatar,
              full: tempAvatar,
              regular: tempAvatar,
              small: tempAvatar,
              thumb: tempAvatar
            }
          }
          let tempBanner = 'https://source.unsplash.com/1500x500/weekly?' + encodeURI(faker.random.word())
          response.banner = {
            name: 'Banner',
            contentType: 'image/jpeg',
            url: {
              raw: tempBanner,
              full: tempBanner,
              regular: tempBanner,
              small: tempBanner,
              thumb: tempBanner
            }
          }
          break
        }
        case 'post': {
          response.text = res.data.post.text
          response.publishTime = res.data.post.publishTime

          // location
          if (Math.random() > 0.2) {
            response.location = null
          }
          else {
            response.location = {
              geojson: {
                coordinates: [parseFloat(res.data.post.longitude), parseFloat(res.data.post.latitude)],
                type: 'Point'
              }
            }
          }
        }
        }

        return response
      })
      return {
        data: data
      }
    }
  }
}

module.exports = { randomDataQueries }
