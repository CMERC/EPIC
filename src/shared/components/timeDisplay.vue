<template>
  <div class="workspace-list-container">
    <p class="menu-label">
      Date & Time
    </p>
    <ul class="menu-list">
      <li>
        <span class="tooltip"
              :data-tooltip="dateUnaltered ? dateUnaltered : ''">{{date ? date : ''}}</span>
      </li>
      <li v-if="zone">
        <span>{{zone.replace(/(_)/g, ' ')}} ({{zoneOffset}})</span>
      </li>
      <li v-else>
        <span>{{guess ? guess.displayName:''}} {{guess ? '('+guess.offset+')' : ''}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'time-display',
  props: {
    zone: {
      type: String,
      default: ''
    },
    showTime: {
      default: true
    }
  },
  data() {
    return {
      guess: this.getGuessZone(),
      now: this.moment().toISOString(),
      date: '',
      dateUnaltered: '',
      zoneOffset: this.zone ? this.momentTimezone.tz(this.zone).format('Z') : ''
    }
  },
  methods: {
    getGuessZone() {
      let guess = {
        name: this.momentTimezone.tz.guess(true),
        displayName: this.momentTimezone.tz.guess(true).replace(/(_)/g, ' '),
        offset: this.momentTimezone
          .tz(this.momentTimezone.tz.guess(true))
          .format('Z')
      }
      return guess
    },

    time() {
      if (this.now) {
        this.date = this.momentTimezone
          .tz(this.now, this.zone ? this.zone : this.guess.name)
          .format('HH:mm DD MMM YY')
        this.dateUnaltered = this.momentTimezone
          .tz(this.now ? this.now : '', '')
          .toISOString()
      }
    }
  },
  mounted() {
    this.time()
  }
}
</script>

<style lang="scss" scoped>
.workspace-list-container {
  width: 100%;
  .menu-list {
    li {
      span {
        text-transform: capitalize;
        padding-left: 20px;
        padding: 0.5em 0.75em;
      }
    }
  }
}
</style>
