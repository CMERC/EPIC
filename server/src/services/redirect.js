function safeRedirectUrl(rawUrl) {
  if (rawUrl === undefined) {
    return {
      ok: false,
      status: 400,
      message: 'URL not defined in request'
    }
  }

  try {
    const decodedURL = decodeURIComponent(rawUrl)
    const parsedURL = new URL(decodedURL)
    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      throw new Error('Unsupported redirect protocol')
    }

    return {
      ok: true,
      url: decodedURL
    }
  } catch (error) {
    return {
      ok: false,
      status: 400,
      message: 'Invalid redirect URL'
    }
  }
}

module.exports = {
  safeRedirectUrl
}
