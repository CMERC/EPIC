const fetch = require('node-fetch')

async function translateText(text, options = {}) {
  const targetLanguage = options.to
  const endpoint = process.env.LIBRETRANSLATE_ENDPOINT

  if (!text || !targetLanguage || !endpoint) {
    return { text }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source: options.from || 'auto',
      target: targetLanguage,
      format: 'text',
      api_key: process.env.LIBRETRANSLATE_API_KEY || undefined
    })
  })

  if (!response.ok) {
    throw new Error(`Translation service returned ${response.status}`)
  }

  const body = await response.json()
  return { text: body.translatedText || text }
}

module.exports = { translateText }
