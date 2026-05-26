const logger = require('../logger')
const faker = require('faker')
const userGen = require('username-generator')
const rwc = require('random-weighted-choice')
const { Prisma } = require('prisma-binding')
const rita = require('rita')
const Twitter = require('twitter')
const mime = require('mime-types')
const { hasUrl, withDefaultProtocol } = require('../utils/url')
const { translateText } = require('../services/translate')
const { createNewProfileVariable, updateInterval, getRandomCountsObj } = require('./helpers')
const Geohash = require('ngeohash')

let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})
const markovNfactor = 5
const maxPostLength = 280

function startNoise(workspace) {
  let noise = new NoiseGenerator(workspace)
  noise.getNoiseProfiles()
}

class NoiseGenerator {
  constructor(workspace) {
    let apolloURI = process.env.PRISMA_ENDPOINT
    if (workspace !== 'global') {
      apolloURI = process.env.WORKSPACE_ENDPOINT + workspace
    }
    const getPrismaInstance = () => {
      return new Prisma({
        typeDefs: 'src/generated/prisma.graphql', // the Prisma DB schema
        endpoint: apolloURI, // the endpoint of the Prisma DB service (value is set in .env)
        secret: process.env.PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
        debug: false // log all GraphQL queries & mutations
      })
    }
    this.db = getPrismaInstance()
    this.noiseProfiles = []
    this.noiseProfilesByService = []
    this.livePostLocations = []
    this.profileServices = {}
    this.mediaNoiseLevels = null
    this.mediaServices = null
    this.feedPercents = []
    this.servicePercents = []
    this.finalPostCount = []
    this.livePosts = []
    this.mediaUrls = []
    this.mediaSizes = []
    this.markovText = []
    this.markovSourceTexts = []
    this.feedList = {}
    this.stream = {}
    this.workspace = workspace
  }
  // gets all required information before generating posts - All profiles where isUserGenerated = false, mediaNoiseLevels, markovsources, list of all feed types(live, markov, twitter, facebook etc.)
  async getNoiseProfiles() {
    let variables = {
      where: {
        isUserGenerated: false
      },
      first: 100
    }

    // get required values for noise generation from database
    this.noiseProfiles = await this.db.query.mediaProfiles(
      variables,
      `{
        id
      service {
        name
        displayName
        type
      }
      language
      username
      name
      description
      banner {
        id
        mediaFile {
          id
          name
          url
        }
      }
      avatar {
        id
        name
        url
      }
      location {
        geojson
      }
      url
      createdTime
      isUserGenerated
    }`
    )
    for (let i = 0; i < this.noiseProfiles.length; i++) {
      let index = this.noiseProfiles[i].id
      this.profileServices[index] = this.noiseProfiles[i].service.name
    }
    this.feedList = await this.db.query.mapInts(
      { first: 100 },
      `{
        key
        value
        attributes{
          name
        }
      }`
    )
    this.markovSourceTexts = await this.db.query.mediaMarkovSources(
      { first: 100 },
      `{
        key
        sourceText
        attributes{
          name
        }
      }`
    )
    this.mediaNoiseLevels = await this.db.query.mediaNoiseLevels(
      { first: 100 },
      `{
        id
        name
        postRate
        feeds{
          key
          value
        }
        bounding{
          geojson
        }
        filterTags
      }`
    )
    this.mediaServices = await this.db.query.mediaServices(
      { first: 1000 },
      `{
       name
      }`
    )
    this.serviceArray = []
    this.feedArray = []
    this.serviceWeights = []
    for (let i = 0; i < this.mediaServices.length; i++) {
      this.serviceArray.push(this.mediaServices[i].name)
    }
    for (let i = 0; i < this.feedList.length; i++) {
      this.feedArray.push(this.feedList[i].key)
    }
    this.checkDB()
  }
  // checks for the necessary data required for noise generation to run.
  async checkDB() {
    if (this.mediaNoiseLevels.length === 0) {
      let olMapData = {
        'geojson': {
          'type': 'Box',
          'coordinates': [-118.383767, 33.762551, -68.224669, 47.066869]
        }
      }

      let inputVars = {
        data: {
          postRate: 0,
          name: 'noiselevel',
          bounding: {
            create: olMapData
          },
          filterTags: ''
        }
      }
      await this.db.mutation.createMediaNoiseLevel(
        inputVars
      )
    } else {
      if (!this.serviceArray.includes('twitter')) {
        let inputVars = {
          data: {
            name: 'twitter',
            displayName: 'Twitter',
            type: 'SOCIALMEDIA',
            icon: 'fab fa-twitter'
          }
        }
        logger.debug('creating twitter service')
        await this.db.mutation.createMediaService(inputVars)
      }
      if (!this.serviceArray.includes('facebook')) {
        let inputVars = {
          data: {
            name: 'facebook',
            displayName: 'Facebook',
            type: 'SOCIALMEDIA',
            icon: 'fab fa-facebook'
          }
        }
        logger.debug('creating facebook service')
        await this.db.mutation.createMediaService(inputVars)
      }
      if (!this.feedArray.includes('feed_markov')) {
        let inputVars = {
          data: {
            key: 'feed_markov',
            value: 10,
            attributes: {
              connect: {
                name: 'noiselevel'
              }
            }
          }
        }
        logger.debug('creating markov feed values')
        await this.db.mutation.createMapInt(inputVars)
      }
      if (!this.feedArray.includes('feed_live')) {
        let inputVars = {
          data: {
            key: 'feed_live',
            value: 90,
            attributes: {
              connect: {
                name: 'noiselevel'
              }
            }
          }
        }
        logger.debug('creating live feed values')
        await this.db.mutation.createMapInt(inputVars)
      }
      if (!this.feedArray.includes('service_facebook')) {
        let inputVars = {
          data: {
            key: 'service_facebook',
            value: 10,
            attributes: {
              connect: {
                name: 'noiselevel'
              }
            }
          }
        }
        logger.debug('creating facebook service values')
        await this.db.mutation.createMapInt(inputVars)
      }
      if (!this.feedArray.includes('service_twitter')) {
        let inputVars = {
          data: {
            key: 'service_twitter',
            value: 90,
            attributes: {
              connect: {
                name: 'noiselevel'
              }
            }
          }
        }
        logger.debug('creating twitter service values')
        await this.db.mutation.createMapInt(inputVars)
      }
    }
    if (this.mediaNoiseLevels.length !== 0 && this.mediaNoiseLevels[0].postRate !== 0) {
      // Doing nothing rightnow
      this.calcPercent()
    }
  }

  // based on the values selected on the front end, generates % values for available feeds and services for noise to be distributed.
  calcPercent() {
    let feedTotal = 0
    let serviceTotal = 0
    for (let i = 0; i < this.feedList.length; i++) {
      if (this.feedList[i].key.substring(0, 4) === 'feed') {
        feedTotal += this.feedList[i].value
      }
      if (this.feedList[i].key.substring(0, 7) === 'service') {
        serviceTotal += this.feedList[i].value
      }
      if (i === this.feedList.length - 1) {
        for (let j = 0; j < this.feedList.length; j++) {
          if (this.feedList[j].key.substring(0, 4) === 'feed') {
            this.feedPercents[this.feedList[j].key] =
              this.feedList[j].value / feedTotal
          }
          if (this.feedList[j].key.substring(0, 7) === 'service') {
            this.servicePercents[this.feedList[j].key] =
              this.feedList[j].value / serviceTotal
          }
        }
      }
    }
    let servicePercentKeys = Object.keys(this.servicePercents)
    this.serviceWeights = []
    for (let i = 0; i < servicePercentKeys.length; i++) {
      let tempObj = {
        weight: this.servicePercents[servicePercentKeys[i]],
        id: servicePercentKeys[i]
      }
      this.serviceWeights.push(tempObj)
    }
    this.generatePostCounts()
  }

  // calculates the required amount of posts to post in a 5 minute interval based on the post rate.
  // uses the percentages for each feed as weights to ranomly assign posts.
  generatePostCounts() {
    const postRatePerHour = this.mediaNoiseLevels[0].postRate
    const timeIntervalMin = 5

    // get the number of posts you will need to schedule during this interval
    const postRatePerInterval = (postRatePerHour / 60) * timeIntervalMin

    // add a 50/50 chance to add one extra post (ceil/random)
    const postsToGen = Math.ceil(postRatePerInterval - Math.random())

    this.finalPostCount = []
    let finalFeedPercents = []
    let feedPercentKeys = Object.keys(this.feedPercents)
    let mytemp = 0
    for (let i = 0; i < feedPercentKeys.length; i++) {
      if (i === 0) {
        mytemp = 0
      } else {
        mytemp += this.feedPercents[feedPercentKeys[i - 1]]
      }
      finalFeedPercents.push(this.feedPercents[feedPercentKeys[i]] + mytemp)
    }
    for (let i = 0; i < postsToGen; i++) {
      let randNum = Math.random()
      for (let j = 0; j < finalFeedPercents.length; j++) {
        if (randNum < finalFeedPercents[j]) {
          if (this.finalPostCount[feedPercentKeys[j]] === undefined) {
            this.finalPostCount[feedPercentKeys[j]] = 1
          } else {
            this.finalPostCount[feedPercentKeys[j]]++
          }
          break
        }
      }
    }
    this.createPostsController()
  }

  // controls the actual creation of posts to the database based on values generated from generatePostCounts()
  createPostsController() {
    let liveCount = this.finalPostCount['feed_live']
    let markovCount = this.finalPostCount['feed_markov']
    let postCountKeys = Object.keys(this.finalPostCount)
    // feed types have different logic for creating post data. Needs separate functions to create these posts
    postCountKeys.forEach(element => {
      if (element === 'feed_live') {
        this.postLiveFeeds(liveCount, true)
      } else if (element === 'feed_markov') {
        if (this.markovSourceTexts) {
          logger.verbose(
            'No markov sources in database -- Cannot generate markov posts'
          )
        } else {
          this.postMarkovFeeds(markovCount, true)
        }
      }
    })
  }
  // gets live feeds from twitter and posts them.
  postLiveFeeds(postNum) {
    logger.verbose('creating ' + postNum + ' posts using live feeds')
    this.livePosts = []
    let liveCount = postNum
    let locationBounds = '-118.383767, 33.762551, -68.224669, 47.066869'
    if (this.mediaNoiseLevels[0].bounding && this.mediaNoiseLevels[0].bounding.geojson) {
      // convert array to string to match api
      locationBounds = this.mediaNoiseLevels[0].bounding.geojson.coordinates.toString()
    }
    this.stream = client.stream('statuses/filter', {
      track: this.mediaNoiseLevels[0].filterTags,
      locations: locationBounds
    })
    this.stream.on('error', function(error) {
      console.error(error)
    })

    this.stream.on('data', async event => {
      let tweetText = event.text

      if (event.truncated) {
        tweetText = event.extended_tweet.full_text
      }
      if (tweetText === undefined) {
        logger.error(event)
      }
      if (tweetText !== undefined && !event.hasOwnProperty('retweeted_status')) {
        let tempArray = tweetText.split(' ')
        for (let i = 0; i < tempArray.length; i++) {
          if (tempArray[i].charAt(0) === '@') {
            let username = ''
            let index = Math.floor(Math.random() * this.noiseProfiles.length)

            if (this.noiseProfiles[index] && this.noiseProfiles[index].username) {
              username = this.noiseProfiles[index].username
            } else {
              username = userGen.generateUsername()
            }

            // replaces live user handles with existing profiles from workspace username
            tempArray.splice(i, 1, '@' + username)
          }
          if (hasUrl(tempArray[i])) {
            // set path encode uri
            tempArray.splice(
              i,
              1,
              process.env.APP_DOMAIN +
              '/link?url=' +
              encodeURIComponent(withDefaultProtocol(tempArray[i]))
            )
          }
        }
        this.livePosts.push(tempArray.join(' '))
        this.livePostLocations.push(event.coordinates)
        let mediaUrl = 'none'
        if (event.entities && event.entities.media) {
          mediaUrl = event.entities.media[0].media_url_https
        }
        this.mediaUrls.push(mediaUrl)
        liveCount--
        if (liveCount === 0) {
          this.stream.destroy()
          let tempServiceName = ''
          for (let i = 0; i < this.livePosts.length; i++) {
            // post each twitter post of these to a random or new profile
            let randNum = Math.random()
            tempServiceName = rwc(this.serviceWeights).substring(8, 100)
            let variables = null
            if (randNum > 0.8 || this.noiseProfiles.length === 0) {
              variables = await createNewProfileVariable(
                '',
                this.livePosts[i],
                this.mediaUrls[i],
                tempServiceName,
                this.livePostLocations[i],
                this.workspace
              )
              if (variables) {
                this.createMediaPost(variables)
              }
            } else {
              // post to an existing profile.
              let randIntInRange = Math.floor(
                Math.random() * this.noiseProfiles.length
              )
              if (
                this.noiseProfiles[randIntInRange].language !== null
              ) {
                translateText(this.livePosts[i], {
                  to: this.noiseProfiles[randIntInRange].language
                })
                  .then(res => {
                    variables = this.createExistingProfileVariable(
                      '',
                      res.text,
                      false,
                      randIntInRange,
                      this.mediaUrls[i],
                      tempServiceName,
                      this.livePostLocations[i]
                    )
                  })
                  .catch(err => {
                    console.error(err)
                  })
              } else {
                variables = this.createExistingProfileVariable(
                  '',
                  this.livePosts[i],
                  true,
                  randIntInRange,
                  this.mediaUrls[i],
                  tempServiceName,
                  this.livePostLocations[i]
                )
              }
              if (variables) {
                this.createMediaPost(variables)
              }
            }
          }
        }
      }
    })
  }
  // generates markov posts and posts them to profiles.
  async postMarkovFeeds(postNum) {
    logger.verbose('creating ' + postNum + ' posts using markov chains')
    let markov = new rita.RiMarkov(markovNfactor)
    this.markovText = []
    for (let i = postNum; i >= 0; i--) {
      let randIntInRange = Math.floor(
        Math.random() * this.markovSourceTexts.length
      )
      markov.loadText(this.markovSourceTexts[randIntInRange].sourceText) // uses a random markov source text
      const sentence = markov
        .generateSentences(1)
        .toString()
        .substring(0, maxPostLength)
      this.markovText.push(sentence)
      if (i === 0) {
        let tempServiceName = rwc(this.serviceWeights).substring(8, 100)
        let variables

        for (let i = 0; i < this.markovText.length; i++) {
          // post each twitter post of these to a random or new profile
          let randNum = Math.random()
          if (randNum > 0.8 || this.noiseProfiles.length === 0) {
            // create new profile with text
            variables = await createNewProfileVariable(
              '',
              this.markovText[i],
              'none',
              tempServiceName,
              null,
              this.workspace
            )
          } else {
            variables = this.createExistingProfileVariable(
              '',
              this.markovText[i],
              true,
              0,
              'none',
              tempServiceName,
              null
            )
          }
          if (variables) {
            this.createMediaPost(variables)
          }
        }
      }
    }
  }

  // create a mediaPost with passed vars.
  async createMediaPost(inputVars) {

    try {
      let mediaPost = await this.db.mutation.createMediaPost(inputVars)
      let updateURL = {
        data: {
          url: inputVars.data.url + '/' + mediaPost.id
        },
        where: { id: mediaPost.id }
      }
      mediaPost = await this.db.mutation.updateMediaPost(updateURL)
    } catch (error) {
      console.error(error)
    }
  }

  // chooses a random profile out of existing profiles and posts to that profile
  createExistingProfileVariable(
    title,
    text,
    isRandom,
    profileNum,
    mediaUrl,
    service,
    location
  ) {
    this.noiseProfilesByService = []
    for (let i = 0; i < this.noiseProfiles.length; i++) {
      if (this.noiseProfiles[i].service.name === service) {
        this.noiseProfilesByService.push(this.noiseProfiles[i])
      }
    }
    if (this.noiseProfilesByService.length === 0) {
      return null
    } else {
      let tempTime = faker.date.future(updateInterval)
      let randIntInRange = 0

      if (isRandom) {
        randIntInRange = Math.floor(Math.random() * this.noiseProfilesByService.length)
      } else {
        randIntInRange = profileNum
      }
      let randomProfile = this.noiseProfilesByService[randIntInRange]
      let url = process.env.APP_DOMAIN + '/web/' +
        (this.workspace || 'global') +
        '/' +
        randomProfile.service.name +
        '/' +
        randomProfile.username

      let variables = {
        data: {
          title: title,
          text: text,
          isUserGenerated: false,
          url: url,
          profiles: {
            connect: {
              id: randomProfile.id
            }
          },
          location: null,
          createTime: tempTime,
          updateTime: tempTime,
          isPublished: false,
          publishTime: tempTime,
          counts: getRandomCountsObj()
        }
      }

      // has Media
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
            geojson: location,
            geohash: Geohash.encode(location.coordinates[1], location.coordinates[0])
          }
        }
      }
      return variables
    }
  }
}

module.exports = {
  startNoise
}
