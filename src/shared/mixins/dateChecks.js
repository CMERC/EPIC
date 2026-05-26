export default {
  methods: {
    isStartBeforeEnd(start, end) {
      let returnedValue
      if (!start || !end) return null
      if (this.moment(start).isBefore(end)) {
        returnedValue = null
      } else {
        returnedValue = 'Start Date must be before End Date'
      }
      return returnedValue
    },
    isEndAfterStart(start, end) {
      let returnedValue
      if (!start || !end) return null
      if (this.moment(end).isAfter(start)) {
        returnedValue = null
      } else {
        returnedValue = 'End Date must be after Start Date'
      }
      return returnedValue
    },
    showDiff(start, response) {
      let returnedValue
      if (start && response) {
        returnedValue =
          'Response time of ' + this.moment(start).to(response, true)
      }
      if (this.moment(response).isBefore(start)) {
        returnedValue = 'Error: Time should occur after start time.'
      }
      if (response && !start) {
        returnedValue = 'Error: Edit to add start time.'
      }
      return returnedValue
    }
  }
}
