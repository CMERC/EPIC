<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink"
       xml:space="preserve"
       style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
       viewBox="0 0 32 32"
       :style='svgStyle'>
    <text x="50%"
          y="50%"
          text-anchor="middle"
          dy=".3em"
          :style='textStyle'>
      {{ avatarLetter }}
    </text>
  </svg>
</template>
<script>
export default {
  name: 'avatar-letter',
  props: {
    size: {
      type: String,
      default: '50'
    },

    rounded: {
      type: Boolean,
      default: false
    },

    name: {
      type: String,
      required: true
    }
  },
  methods: {
    initial(username) {
      let parts = username.split(/[ -]/)
      let initials = ''
      if (parts) {
        for (let i = 0; i < parts.length; i++) {
          initials += parts[i].charAt(0)
        }
        if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
          initials = initials.replace(/[a-z]+/g, '')
        }
        initials = initials.substr(0, 3).toUpperCase()
      }
      return initials
    },
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
  },
  computed: {
    avatarLetter() {
      return this.initial(this.name)
    },

    svgStyle() {
      const backgroundColor = this.stringToColor(this.name)

      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        borderRadius: this.rounded ? '100%' : '0',
        background: backgroundColor
      }
    },
    textStyle() {
      return {
        fill: 'rgba(255, 255, 255, .7)',
        fontFamily: "'Lucida Console', Monaco, monospace",
        fontSize: '1.2em'
      }
    }
  }
}
</script>
