<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Custom Report</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="report">
          <div class="field">
            <label class="label">
              Title
            </label>
            <div class="control">
              <input v-model="reportInfo.title"
                     class="input"
                     type="text"
                     name="title"
                     v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('title') }">
              <span v-show="errors.has('title')"
                    class="help has-text-danger">{{errors.first('title') }}</span>
            </div>
          </div>
          <div class="field">

            <date-picker label="Start"
                         :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                         showClear
                         showNow
                         v-model="reportInfo.start"
                         @now="(value) => {reportInfo.start = value}"
                         @clear="(value) => {reportInfo.start = value}"
                         @changed="(value) => {reportInfo.start = value}"
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
                         v-model="reportInfo.end"
                         @now="(value) => {reportInfo.end = value}"
                         @clear="(value) => {reportInfo.end = value}"
                         @changed="(value) => {reportInfo.end = value}"
                         :key="'end'"
                         :name="'end'"
                         v-validate="'required'" 
                         :class="{'is-danger': errors.has('end') }" />
            <span v-show="errors.has('end')"
                  class="help has-text-danger">{{errors.first('end') }}</span>
            <span v-if="endAfterStartCheck"
                  class="help has-text-danger">{{endAfterStartCheck}}</span>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             @click="validateBeforeSubmit()">
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
import PlanCustomReport from '@/plan/model/planCustomReport'
import { PlanCustomReportsUpsert } from '@/plan/graphql/PlanCustomReports.gql'
import dateChecks from '@/shared/mixins/dateChecks'
export default {
  name: 'customReport-interaction',
  mixins: [dateChecks],
  props: {
    report: {
      type: Object
    },
    open: {
      default: false
    }
  },
  components: { DatePicker },
  data() {
    return {
      endAfterStartCheck: null,
      sources: ['Feedback', 'Assessments'],
      reportInfo: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    async validateBeforeSubmit() {
      this.endAfterStartCheck = await this.isEndAfterStart(
        this.reportInfo.start,
        this.reportInfo.end
      )
      this.$validator.validateAll().then(result => {
        if (result && !this.endAfterStartCheck) {
          this.save()
          return
        }
      })
    },
    save() {
      // Update
      this.$apollo
        .mutate({
          mutation: PlanCustomReportsUpsert,
          variables: {
            update: {
              title: this.reportInfo.title,
              start: this.reportInfo.start,
              end: this.reportInfo.end,
              source: this.reportInfo.source
            },
            create: {
              title: this.reportInfo.title,
              start: this.reportInfo.start,
              end: this.reportInfo.end,
              source: this.reportInfo.source
            },
            where: {
              id: this.reportInfo.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          this.reportInfo = new PlanCustomReport()
          this.close()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Update Report: ' + error)
        })
    }
  },
  watch: {
    report() {
      this.reportInfo = Object.assign({}, this.report)
    }
  }
}
</script>
