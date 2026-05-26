<template>
  <div class="field">
    <label class="label">
      {{label}} <span v-if="label!=''">({{momentTimezone.tz(timeZone).format('z')}})</span>
    </label>
    <div class="field has-addons">
      <div class="control is-expanded">
        <flat-pickr ref="flatpicker"
                    :with-time="withoutTime"
                    v-model="date"
                    :config="config"
                    :placeholder="placeholder"
                    @on-close="onClose" />
      </div>
      <div class="control"
           v-if="showClear">
        <a :class="'button '+clearStyles"
           @click="clearDate()">
          Clear
        </a>
      </div>
      <div class="control"
           v-if="showNow">
        <a :class="'button '+nowStyles"
           @click="nowDate()">
          Now
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'date-picker',
  props: {
    label: {
      type: String,
      default: 'Date and Time'
    },
    value: {
      type: String
    },
    showNow: {
      type: Boolean,
      default: false
    },
    nowStyles: {
      //Use Bulma classes
      type: String,
      default: ''
    },
    showClear: {
      type: Boolean,
      default: false
    },
    clearStyles: {
      //Use Bulma classes
      type: String,
      default: ''
    },
    withoutTime: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxDate: {
      type: String,
      default: ''
    },
    minDate: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: function() {
        return {
          defaultDate: null,
          enableTime: this.withoutTime,
          altInput: true,
          dateFormat: 'Z',
          minDate: this.minDate,
          maxDate: this.maxDate
        }
      }
    },
    format: {
      //Use flatpickr format tokens
      type: String,
      default: 'F d, Y H:i'
    },
    timeZone: {
      type: String,
      default: function() {
        return this.momentTimezone.tz.guess(true)
      }
    }
  },
  data() {
    return {
      date: null
    }
  },
  watch: {
    value() {
      if (this.timeZone && !this.date) {
        let date = this.setDisplayFormat(this.value, this.format)
        if (date) {
          this.$refs.flatpicker.fp.setDate(date)
        }
      }
      if (!this.value) {
        this.$refs.flatpicker.fp.clear()
      }
    }
  },
  mounted() {
    if (this.value) {
      let date = this.setDisplayFormat(this.value, this.format)
      if (date) {
        this.$refs.flatpicker.fp.setDate(date)
      }
    }
  },

  methods: {
    setDisplayFormat(date, format) {
      if (!date) return
      if (this.moment(date).isValid()) {
        date = Date.parse(date)
        if (date && this.timeZone) {
          let shiftedDate = this.momentTimezone
            .tz(date, this.timeZone)
            .format('MMMM DD, YYYY HH:mm')
          this.$refs.flatpicker.fp.set('altFormat', format)
          return shiftedDate
        }
      }
    },
    onClose(localDate) {
      //reverse out local timezone
      let newDate = new Date(localDate)
      let momentDate = this.moment(newDate)

      if (momentDate && this.moment(momentDate).isValid()) {
        let localizedDate = this.momentTimezone(momentDate)
          .tz(this.momentTimezone.tz.guess(true))
          .format()
        //cast to new Timezone
        let date = this.moment
          .tz(
            this.moment(localizedDate).format('YYYY-MM-DDTHH:mm:ss'),
            'YYYY-MM-DDTHH:mm:ss',
            this.timeZone
          )
          .format()
        //convert that to UTC
        let utcDate = this.moment
          .parseZone(date)
          .utc()
          .format()
        this.$emit('changed', utcDate)
        this.date = this.setDisplayFormat(utcDate, this.format)
      }
    },
    nowDate() {
      //get now value in timezone
      this.date = this.momentTimezone(this.moment().utc())
        .tz(this.timeZone)
        .format()

      //get now values actual utc value
      let newDate = this.moment
        .parseZone(this.date)
        .utc()
        .format()

      if (this.date && newDate) {
        this.$emit('now', newDate)
        this.date = this.setDisplayFormat(newDate, this.format)
      }
    },
    clearDate() {
      this.$refs.flatpicker.fp.clear()
      this.date = null
      this.$emit('clear', this.date)
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (max-width: 1024px - 1px) {
  .field {
    flex-wrap: wrap;
  }
}
</style>
