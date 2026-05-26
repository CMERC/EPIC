const faker = require('faker')

const userGen = require('username-generator')
const mime = require('mime-types')
const fetch = require('node-fetch')

// https://uifaces.co/api-key
// curl  https://uifaces.co/api?limit=1 -v --header Cache-Control: "no-cache" --header "Accept: application/json" --header "X-API-KEY: 5ACB707B-C9644175-8183FA47-E4CC2305"
async function queryRandomAvatar()  {
  const apikey = '5ACB707B-C9644175-8183FA47-E4CC2305'
  const limit = 1
  const res = await fetch(
    'https://uifaces.co/api?' +
    'limit=' + limit,
    {
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': apikey
      }
    }
  )
  const data = await res.json()
  if(data && data.length){
    return data[0].photo
  }
}

// faker.data.future takes parameter in years. .00000951 means .00000951 of 1 year this is equal to 5 minutes.
const updateInterval = 0.00000951
// creates a new profile variable with passed values.
async function createNewProfileVariable(title, text, mediaUrl, service, location, workspace) {
  let variables
  let tempAvatar = await queryRandomAvatar()
  let tempTime = faker.date.future(updateInterval)
  let tempBanner =
    'https://source.unsplash.com/1500x500/weekly?' +
    encodeURI(faker.random.word())
  let username = userGen.generateUsername()
  let profileUrl = process.env.APP_DOMAIN + '/web/' +
    (workspace || 'global') +
    '/' +
    service +
    '/' +
    username

  variables = {
    data: {
      title: title,
      text: text,
      url: profileUrl,
      isUserGenerated: false,
      profiles: {
        create: {
          username: username,
          name: faker.name.firstName() + ' ' + faker.name.lastName(),
          service: {
            connect: {
              name: service
            }
          },
          url: profileUrl,
          banner: {
            create: {
              mediaFile: {
                create: {
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
              }
            }
          },
          avatar: {
            create: {
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
          },
          isUserGenerated: false,
          description: title,
          counts: getRandomCountsObj('profile')
        }
      },
      location: null,
      createTime: tempTime,
      updateTime: tempTime,
      isPublished: false,
      publishTime: tempTime
    }
  }
  if (mediaUrl !== 'none') {
    let mimeType = mime.lookup(mediaUrl)
    let imageName = mediaUrl.split('%')
    imageName = imageName[imageName.length - 1]
    let mediaFile = {
      create: {
        name: imageName,
        contentType: mimeType,
        createTime: tempTime,
        updateTime: tempTime,
        url: {
          raw:
            process.env.APP_DOMAIN +
            '/link?url=' +
            encodeURIComponent(mediaUrl),
          full:
            process.env.APP_DOMAIN +
            '/link?url=' +
            encodeURIComponent(mediaUrl + ':large'),
          regular:
            process.env.APP_DOMAIN +
            '/link?url=' +
            encodeURIComponent(mediaUrl + ':medium'),
          small:
            process.env.APP_DOMAIN +
            '/link?url=' +
            encodeURIComponent(mediaUrl + ':small'),
          thumb:
            process.env.APP_DOMAIN +
            '/link?url=' +
            encodeURIComponent(mediaUrl + ':thumb')
        }
      }
    }
    variables.data = {
      ...variables.data,
      mediaFile
    }
  }
  if (location) {
    variables.data.location = {
      create: {
        geojson: location
      }
    }
  }
  return variables
}
function getRandomCountsObj(type) {
  let counts = {
    likes: Math.floor(Math.random() * 150 + 1),
    views: Math.floor(Math.random() * 150 + 1),
    comments: Math.floor(Math.random() * 150 + 1),
    shares: Math.floor(Math.random() * 150 + 1)
  }
  if (type && type === 'profile') {
    counts = {
      followers: Math.floor(Math.random() * 150 + 1),
      following: Math.floor(Math.random() * 150 + 1)
    }
  }
  return counts
}
module.exports = {
  createNewProfileVariable,
  updateInterval,
  getRandomCountsObj,
  queryRandomAvatar
}
