export default {
  methods: {
    stringToColor(str) {
      // use hsl to define the background color.
      let hash = 0
      if (str.length == 0) return hash
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
        hash = hash & hash // Convert to 32bit integer
      }

      let hue = hash % 360
      return `hsl(${hue}, 68%, 48%)`
    }
  }
}
