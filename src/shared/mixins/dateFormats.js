export default {
  methods: {
    formatDate(value, args) {
      let timeZone = this.$store.state.activeWorkspace.timeZone
      if (!timeZone) {
        timeZone = this.momentTimezone.tz.guess(true)
      }
      if (value) {
        switch (args) {
          case 'displayTime':
            return this.momentTimezone.tz(value, timeZone).format('hh:mm a')
          case 'milDateTime':
            return this.momentTimezone
              .tz(value, timeZone)
              .format('DD MMM YY HH:mm (Z)')
          case 'longDatePicker':
            return (
              this.momentTimezone
                .tz(value, timeZone)
                .format('MMMM DD, YYYY HH:mm') +
              ' ' +
              '(' +
              this.moment(value).toISOString() +
              ')'
            )
          case 'shortDatePicker':
            return this.momentTimezone.tz(value, timeZone).format('DD MMM YY')
          case 'milTimeDate':
            return this.momentTimezone
              .tz(value, timeZone)
              .format('HH:mm (Z) DD MMM YY')
          case 'milDate':
            return this.momentTimezone.tz(value, timeZone).format('DD MMM YY')
          case 'shortDate':
            return this.momentTimezone
              .tz(value, timeZone)
              .format('MMM Do, YYYY')
          case 'shortDateTime':
            return this.momentTimezone
              .tz(value, timeZone)
              .format('DD MMM [at] HH:mm (Z)')
          case 'monthDay':
            return this.momentTimezone.tz(value, timeZone).format('MMM Do')
          case 'convertDate':
            return (
              this.momentTimezone.tz(value, timeZone).fromNow() +
              ' at ' +
              this.momentTimezone
                .tz(value, timeZone)
                .format('MMM Do YYYY HH:mm (Z)')
            )
          case 'fromNow':
            return this.momentTimezone.tz(value, timeZone).fromNow()
          case 'dtg':
            return this.momentTimezone
              .tz(value, timeZone)
              .format('DD MMM YY - HHmm (z)')
          case 'utc-dtg':
            return this.moment(value)
              .utc()
              .format('DD MMM YY - HHmm (z)')
          default:
            return this.momentTimezone.tz(value, timeZone)
        }
      }
    }
  }
}
