class MarkovTextGenerator {
  constructor(order = 2) {
    this.order = Math.max(1, Number(order) || 2)
    this.starts = []
    this.chain = new Map()
  }

  loadText(text) {
    const tokens = String(text || '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)

    if (tokens.length <= this.order) {
      return
    }

    this.starts.push(tokens.slice(0, this.order))

    for (let i = 0; i <= tokens.length - this.order; i++) {
      const key = this.key(tokens.slice(i, i + this.order))
      const next = tokens[i + this.order]
      if (!next) continue

      if (!this.chain.has(key)) {
        this.chain.set(key, [])
      }
      this.chain.get(key).push(next)
    }
  }

  generateSentences(count = 1) {
    const sentences = []
    for (let i = 0; i < count; i++) {
      sentences.push(this.generateSentence())
    }
    return sentences
  }

  generateSentence() {
    if (!this.starts.length) {
      return ''
    }

    const words = [...this.pick(this.starts)]
    const maxWords = 45

    while (words.length < maxWords) {
      const state = words.slice(-this.order)
      const choices = this.chain.get(this.key(state))
      if (!choices || !choices.length) break

      const next = this.pick(choices)
      words.push(next)
      if (/[.!?]$/.test(next) && words.length > this.order + 4) break
    }

    return words.join(' ')
  }

  key(words) {
    return words.join('\u0001')
  }

  pick(items) {
    return items[Math.floor(Math.random() * items.length)]
  }
}

module.exports = MarkovTextGenerator
