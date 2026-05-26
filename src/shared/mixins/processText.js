import { findUrls, hasProtocol, withDefaultProtocol } from '@/shared/utils/url'
export default {
  data() {
    return {}
  },
  methods: {
    processPost(text, service, workspace) {
      // If not web route, get workspace from store
      if (!workspace || workspace.length === 0) {
        workspace = this.$store.state.activeWorkspace.name
      }
      return this.replaceLinks(
        this.parseHashTag(
          this.parseUsername(text, service, workspace),
          workspace
        )
      )
    },
    getUrlRegex() {
      const v4 =
        '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}'
      const protocol = '(?:(?:[a-z]+:)?//)'
      const auth = '(?:\\S+(?::\\S*)?@)?'
      let ipRegexv4 = new RegExp(`${v4}`, 'g')
      let ip = ipRegexv4.source
      const host =
        '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)'
      const domain =
        '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*'

      const port = '(?::\\d{2,5})?'
      const path = '(?:[/?#][^\\s"]*)?'
      const regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ip}|${host}${domain})${port}${path}`

      return new RegExp(regex, 'ig')
    },
    replaceLinks(text) {
      let detectedUrls = text.match(this.getUrlRegex())
      let newText = ''
      if (detectedUrls) {
        for (let i = 0; i < detectedUrls.length; i++) {
          if (detectedUrls[i]) {
            let decodedUrl = decodeURIComponent(
              this.urlSearchParams(detectedUrls[i], 'url')
            )

            let protocol = detectedUrls[i].match('(http|ftp|https)://')
            let addtoUrl = ''
            if (protocol == null) {
              addtoUrl = 'http://'
            }
            let htmlElement = ''
            if (decodedUrl) {
              htmlElement =
                "<a href='" +
                addtoUrl +
                detectedUrls[i] +
                "' onmouseover='this.href=&apos;" +
                decodedUrl +
                "&apos;' onclick='this.href=&apos;" +
                addtoUrl +
                detectedUrls[i] +
                "&apos;' target='_blank'>" +
                decodedUrl +
                '</a> '
            } else {
              // url without link? redirect
              htmlElement =
                "<a href='" +
                addtoUrl +
                detectedUrls[i] +
                "' onmouseover='this.href=&apos;" +
                addtoUrl +
                detectedUrls[i] +
                "&apos;' onclick='this.href=&apos;" +
                window.location.origin +
                '/link?url=' +
                addtoUrl +
                detectedUrls[i] +
                "&apos;' target='_blank'>" +
                addtoUrl +
                detectedUrls[i] +
                '</a> '
            }
            newText += text.substr(0, text.indexOf(detectedUrls[i]))
            newText += htmlElement
            text = text.substr(
              text.indexOf(detectedUrls[i]) + detectedUrls[i].length,
              text.length
            )
          }
        }
        return newText + text
      } else return text
    },
    replaceChatLinks(text) {
      let detectedUrls = findUrls(text)
      if (detectedUrls) {
        for (let i = 0; i < detectedUrls.length; i++) {
          if (detectedUrls[i]) {
            let addtoUrl = hasProtocol(detectedUrls[i]) ? '' : 'http://'
            let href = withDefaultProtocol(detectedUrls[i])
            let htmlElement = ''
            // url without link? redirect
            htmlElement =
              "<a href='" +
              href +
              "' onmouseover='this.href=&apos;" +
              href +
              "&apos;' onclick='this.href=&apos;" +
              window.location.origin +
              '/link?url=' +
              href +
              "&apos;' target='_blank'>" +
              addtoUrl +
              detectedUrls[i] +
              '</a>'
            text = text.replace(detectedUrls[i], htmlElement)
          }
        }
      }
      return text
    },
    urlSearchParams(url, name) {
      name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
      let results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url)

      if (results) return results[1]
      else return ''
    },

    parseHashTag(text, workspace) {
      return text.replace(/[#]+[A-Za-z0-9_-]+/g, t => {
        let tag = t.replace('#', '%23')
        let hashtagURL = '/web/' + workspace + '?q=' + tag
        let htmlElement =
          "<a href='" + hashtagURL + "' target='_self'>" + t + '</a>'
        return htmlElement
      })
    },
    parseUsername(text, service, workspace) {
      return text.replace(/[@]+[\u00BF-\u1FFF\u2C00-\uD7FF\w_-]+/g, u => {
        let usernameURL =
          '/web/' + workspace + '/' + service.name + '/' + u.replace('@', '')
        return "<a href='" + usernameURL + "' target='_self'>" + u + '</a>'
      })
    }
  }
}
