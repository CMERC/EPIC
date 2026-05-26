export default {
  methods: {
    injectStatusCheck(inject, status) {
      if (!inject) return
      if (inject)
        switch (status.title) {
          case 'Unscheduled':
          case 'Deferred':
            if (inject.startDate !== null) {
              this.$buefy.toast.open({
                message: 'Remove the Date Time',
                type: 'is-danger'
              })
            }
            break
          case 'Scheduled':
            if (inject.startDate == null) {
              this.$buefy.toast.open({
                message: 'Add a Date Time',
                type: 'is-danger'
              })
            }
            break
          case 'Complete':
            if (inject.responseDate == null) {
              this.$buefy.toast.open({
                message: 'Add a response time',
                type: 'is-danger'
              })
            }
            break
        }
    },
    injectAlertChecker(inject, status) {
      if (!inject) return
      if (!status) return
      if (inject)
        switch (status.title) {
          case 'Unscheduled':
          case 'Deferred':
            if (inject.startDate !== null) {
              return '<span class="has-text-warning">Remove the Date Time</span>'
            }
            break
          case 'Scheduled':
            if (inject.startDate == null) {
              return '<span class="has-text-warning">Add a Date Time</span>'
            }
            break
          case 'Complete':
            if (inject.responseDate == null) {
              return '<span class="has-text-warning">Add a response time</span>'
            }
            break
        }
    },
    isInjectPastDue(inject, status) {
      let pastDue = false
      if (!inject) return
      if (
        inject &&
        inject.startDate &&
        status &&
        status.title &&
        this.moment().isAfter(inject.startDate) &&
        status.title == 'Scheduled'
      ) {
        pastDue = true
      }
      return pastDue
    }
  }
}
