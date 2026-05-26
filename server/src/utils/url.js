const urlPattern = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s<>"']+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}(?::\d{2,5})?(?:[/?#][^\s<>"']*)?/ig

function findUrls(text) {
  if (!text || typeof text !== 'string') {
    return []
  }
  return text.match(urlPattern) || []
}

function hasUrl(text) {
  return findUrls(text).length > 0
}

function hasProtocol(url) {
  return /^(?:https?|ftp):\/\//i.test(url)
}

function withDefaultProtocol(url) {
  return hasProtocol(url) ? url : `http://${url}`
}

module.exports = {
  findUrls,
  hasUrl,
  hasProtocol,
  withDefaultProtocol
}
