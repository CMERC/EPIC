import MediaCheck from '@/shared/mixins/mediaCheck'
export default {
  mixins: [MediaCheck],
  methods: {
    omitTypename(key, value) {
      return key === '__typename' ? undefined : value
    },
    random(arr) {
      const n = Math.floor(Math.random() * arr.length)
      return arr[n]
    },
    getRandomNumbers() {
      return Math.floor(Math.random() * 10000).toLocaleString()
    },
    getTodayDate() {
      return this.moment().format('dddd MMMM Do, YYYY')
    },
    currentYear() {
      let currentTime = new Date()
      let year = currentTime.getFullYear()
      return year
    },
    setIcon(icon) {
      // Update Services favicon
      let $favicon = document.querySelector('link[rel="icon"]')
      if (!$favicon) $favicon = document.createElement('link')
      $favicon.rel = 'icon'
      $favicon.href = icon
      document.head.appendChild($favicon)
    },
    keepTag(text) {
      let start = text.indexOf('<p>')
      let end = text.indexOf('</p>')

      let final = text.slice(start, end)

      return final
    },
    checkVideo(text) {
      let start = text.indexOf('<iframe ')
      let end = text.indexOf('</iframe>')

      let final = text.slice(start, end)

      return final
    },
    removeVideo(text) {
      let start = text.indexOf('<iframe ')
      let end = text.indexOf('</iframe>')

      let vid = text.slice(start, end)
      let final = text.split(vid).pop()

      return final
    },
    removeTag(text) {
      let start = text.indexOf('</p>')
      let end = text.length
      let final = text.slice(start + 4, end)

      return final
    },
    parseText(text) {
      let patterns = {
        user: /(^|\s)@(\w+)/g,
        hash: /(^|\s)#(\w+)/g
      }
      if (text)
        return text
          .replace(patterns.user, '$1<a href="javascript:void(0)">@$2</a>')
          .replace(patterns.hash, '$1<a href="javascript:void(0)">#$2</a>')
      else return ''
    },
    removeSpaces(item) {
      item = item.replace(/\s+/g, '_')
      return item
    },
    makeProfileDate(date, allPosts) {
      if (this.moment(date).isValid()) {
        return this.moment(date).format('MM/DD/YY HH:mm')
      } else {
        let earliestDate = this.getEarliestPostDate(allPosts)
        let startDate = new Date(2007, 0, 1).getTime()
        let endDate = new Date(earliestDate)
        let finalDate = new Date(
          startDate + Math.random() * (endDate - startDate)
        )
        return this.moment(finalDate).format('MMMM YYYY')
      }
    },
    getEarliestPostDate(posts) {
      if (posts.length === 0) {
        return null
      } else {
        let tempEarliestDate = posts[0].createdAt
        for (let i = 1; i < posts.length; i++) {
          let tempDate = posts[i].createdAt
          if (tempDate < tempEarliestDate) {
            tempEarliestDate = tempDate
          }
        }
        return tempEarliestDate
      }
    },
    convertCase(str) {
      let lower = String(str).toLowerCase()
      return lower.replace(/(^| )(\w)/g, function(x) {
        return x.toUpperCase()
      })
    },
    isCurrentUser(username, currentUserName) {
      return username === currentUserName
    },
    isCurrentAvatar(item) {
      let checkAvatar =
        item.currentUser.avatar &&
        item.currentUser.avatar.url &&
        item.currentUser.avatar.url.small

      return checkAvatar
    },
    randomMediaStatNumber(min, max) {
      return Math.floor(Math.random() * max + min)
    },
    getRandomCountsObj(type) {
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
  }
}
