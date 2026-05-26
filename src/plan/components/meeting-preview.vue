<template>
  <div>
    <epic-modal :open="open"
                @close="close">
      <template slot="modal-title">
        Planning Meeting
      </template>
      <template slot="modal-body"
                v-if="planMeeting && planMeeting.id != ''">
        <div class="content">
          <p class="title">{{planMeeting.name}}</p>
          <p class="subtitle is-4">{{planMeeting.location}}</p>
          <p class="subtitle">
            <span class="has-text-weight-light tooltip"
                  :data-tooltip="formatDate(planMeeting.startDate, 'utc-dtg')">{{formatDate(planMeeting.startDate, 'dtg')}}</span> - 
            <span class="has-text-weight-light tooltip"
                  :data-tooltip="formatDate(planMeeting.endDate, 'utc-dtg')">{{formatDate(planMeeting.endDate, 'dtg')}}</span>
          </p>
        </div>
      </template>
      <template slot="modal-footer-buttons">
        <p class="control">
          <button class="button is-primary"
                  @click="editMeeting">Edit</button>
        </p>
      </template>
    </epic-modal>
  </div>
</template>

<script>
import { PlanMeetingRead } from '@/plan/graphql/PlanMeetings.gql'
export default {
  name: 'meeting-preview',
  props: {
    id: {
      type: String,
      default: ''
    },
    open: {
      default: false
    }
  },
  apollo: {
    planMeeting: {
      query: PlanMeetingRead,
      variables() {
        return {
          where: {
            id: this.id || ''
          }
        }
      },
      update(data) {
        if (data && data.planMeeting && data.planMeeting.id != null) {
          return data.planMeeting
        }
      },
      skip() {
        return this.id == undefined
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    editMeeting() {
      //step set to plan meeting step in stepper
      this.$router.push({
        name: 'exercise-stepper',
        query: { from: this.$route.fullPath, step: 1 }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
