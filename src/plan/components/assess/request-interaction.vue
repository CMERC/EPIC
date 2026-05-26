<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Feedback Request</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="request">
          <date-picker label="Start"
                       :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                       showClear
                       showNow
                       v-model="feedbackRequestInfo.start"
                       @now="(value) => {feedbackRequestInfo.start = value}"
                       @clear="(value) => {feedbackRequestInfo.start = value}"
                       @changed="(value) => {feedbackRequestInfo.start = value}"
                       :key="'start'"
                       :name="'start'"
                       v-validate="'required'" 
                       :class="{'is-danger': errors.has('start') }" />
          <span v-show="errors.has('start')"
                class="help has-text-danger">{{errors.first('start') }}</span>
          <date-picker label="End"
                       :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                       showClear
                       showNow
                       v-model="feedbackRequestInfo.end"
                       @now="(value) => {feedbackRequestInfo.end = value}"
                       @clear="(value) => {feedbackRequestInfo.end = value}"
                       @changed="(value) => {feedbackRequestInfo.end = value}"
                       :key="'end'"
                       :name="'end'"
                       v-validate="'required'" 
                       :class="{'is-danger': errors.has('end') }" />
          <span v-show="errors.has('end')"
                class="help has-text-danger">{{errors.first('end') }}</span>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             @click="save()">
            Save
          </a>
          <a class="button"
             @click="close()">
            Cancel
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from '@/shared/components/datepicker'
import PlanFeedbackRequest from '@/plan/model/planFeedbackRequest'
import { PlanFeedbackRequestsUpsert } from '@/plan/graphql/PlanFeedbackRequests.gql'
export default {
  name: 'request-interaction',
  props: {
    request: {
      type: Object
    },
    open: {
      default: false
    }
  },
  components: { DatePicker },
  data() {
    return {
      sources: ['Feedback', 'Assessments'],
      feedbackRequestInfo: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          // Update
          this.$apollo
            .mutate({
              mutation: PlanFeedbackRequestsUpsert,
              variables: {
                update: {
                  start: this.feedbackRequestInfo.start,
                  end: this.feedbackRequestInfo.end
                },
                create: {
                  start: this.feedbackRequestInfo.start,
                  end: this.feedbackRequestInfo.end
                },
                where: {
                  id: this.feedbackRequestInfo.id
                }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.feedbackRequestInfo = new PlanFeedbackRequest()
              this.close()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Request: ' + error)
            })
          return
        }
        this.$buefy.toast.open({
          message: 'All inputs are required',
          type: 'is-danger'
        })
      })
    }
  },
  watch: {
    request() {
      this.feedbackRequestInfo = Object.assign({}, this.request)
    }
  }
}
</script>
