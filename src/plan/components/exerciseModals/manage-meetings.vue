<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active':open}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Planning Meeting</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns is-multiline is-mobile">
            <div class="column is-full">
              <div class="columns">
                <div class="column is-half">
                  <div class="field">
                    <label class="label">
                      Name
                    </label>
                    <div class="control">
                      <input class="input"
                             v-validate="'required'"
                             :name="'meetingName'"
                             v-model="meetingInfo.name"
                             type="text"
                             :class="{'input': true, 'is-danger': errors.has('meetingName') }" />
                      <span v-show="errors.has('meetingName')"
                            class="help has-text-danger">Name is Required</span>
                    </div>
                  </div>
                </div>
                <div class="column is-half">
                  <div class="field">
                    <label class="label">
                      Location
                    </label>
                    <div class="control">
                      <input class="input"
                             v-model="meetingInfo.location"
                             type="text"
                             placeholder="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-full">
              <div class="columns">
                <div class="column is-half">
                  <date-picker label="Start Date"
                               :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                               showClear
                               v-model="meetingInfo.startDate"
                               @clear="(value) => {meetingInfo.startDate = value}"
                               @changed="(value) => {meetingInfo.startDate = value}" />
                </div>
                <div class="column is-half">
                  <date-picker label="End Date"
                               :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                               showClear
                               v-model="meetingInfo.endDate"
                               @clear="(value) => {meetingInfo.startDate = value}"
                               @changed="(value) => {meetingInfo.endDate = value}" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="saveMeeting('meetingName','meetings', meetingInfo)">
            Save
          </button>
          <button class="button"
                  @click="close()">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { PlanMeetingRead } from '@/plan/graphql/PlanMeetings.gql'
import PlanMeeting from '@/plan/model/planMeeting'
import helpers from '@/shared/mixins/helpers'
import processVal from '@/shared/mixins/processVal'
import DatePicker from '@/shared/components/datepicker'
export default {
  name: 'PlanManageMeetings',
  components: {
    DatePicker
  },
  apollo: {
    planMeeting: {
      query: PlanMeetingRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      skip() {
        return !this.id
      },
      update(data) {
        if (data && data.planMeeting && this.id) {
          this.meetingInfo = JSON.parse(
            JSON.stringify(data.planMeeting),
            this.omitTypename
          )
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  props: {
    id: {},
    open: {
      default: false
    },
    isClosed: {
      default: false
    },
    meeting: {
      type: Object,
      default: function() {
        return new PlanMeeting()
      }
    }
  },
  mixins: [helpers, processVal],
  data() {
    return {
      meetingInfo: Object.assign({}, this.meeting)
    }
  },
  watch: {
    open() {
      if (!this.open) {
        this.meetingInfo = {}
      }
    }
  },
  methods: {
    close() {
      this.meetingInfo = {}
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    saveMeeting(validateInput, name, value) {
      this.saveModal(validateInput, name, value)
    }
  }
}
</script>
