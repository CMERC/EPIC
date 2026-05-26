const urlPattern = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s<>"']+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}(?::\d{2,5})?(?:[/?#][^\s<>"']*)?/ig

export function findUrls(text) {
  if (!text || typeof text !== 'string') {
    return []
  }
  return text.match(urlPattern) || []
}

export function hasUrl(text) {
  return findUrls(text).length > 0
}

export function hasProtocol(url) {
  return /^(?:https?|ftp):\/\//i.test(url)
}

export function withDefaultProtocol(url) {
  return hasProtocol(url) ? url : `http://${url}`
}
