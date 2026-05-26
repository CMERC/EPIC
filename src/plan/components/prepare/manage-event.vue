<template>
  <div class="container">
    <breadcrumb :currentPage="currentEvent ? currentEvent.name : ''" />
    <nav class="level is-mobile">
      <div class="level-left">
        <h1 class="title">
          <span v-if="!isEdit">Create Event</span>
          <span v-if="isEdit">Edit Event</span>
        </h1>
      </div>
      <div class="level-right">
        <div class="level-item">
          <help-content :reference="'plan.event'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div v-if="planEvent && planEvent.id != null || $route.name == 'createEvent'"
         class="card">
      <div class="card-content">
        <div class="content">
          <div class="columns is-multiline">
            <div class="column is-6">
              <div class="field">
                <label class="label">
                  Name
                </label>
                <div class="control">
                  <input class="input"
                         name="event_name"
                         v-model="currentEvent.name"
                         v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('event_name') }"
                         type="text" />
                  <span v-show="errors.has('event_name') && fields.event_name.touched"
                        class="help has-text-danger">{{errors.first('Event Name') }}</span>
                </div>
              </div>
            </div>
            <div class="column is-narrow">
            </div>
            <div class="column is-6">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <date-picker label="Start Date"
                               :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                               showClear
                               v-model="currentEvent.startDate"
                               @clear="(value) => {currentEvent.startDate = value}"
                               @changed="(value) => {currentEvent.startDate = value}"
                               :key="'startDate'" />
                </div>
                <div class="column is-12">
                  <date-picker label="End Date"
                               :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                               showClear
                               v-model="currentEvent.endDate"
                               @clear="(value) => {currentEvent.endDate = value}"
                               @changed="(value) => {currentEvent.endDate = value}"
                               :key="'endDate'" />
                </div>
              </div>
            </div>
            <div class="column is-6">
              <div class="field">
                <label class="label">
                  Overall Method
                </label>
                <div class="control">
                  <div class="select">
                    <select v-model="currentEvent.method">
                      <option v-for="method in methodTypes"
                              v-bind:key="method.id"
                              :value="method.value">
                        {{method.label}}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="field">
                <label class="label">
                  Color
                </label>
                <div class="field is-grouped">
                  <div class="control">
                    <swatches v-model="currentEvent.color"
                              colors="material-dark"
                              row-length="10"
                              show-border
                              popover-to="right"
                              show-fallback></swatches>
                  </div>
                  <a class="control is-centered"
                     v-if="currentEvent.color"
                     @click="removeColor()">
                    <span class="icon">
                      <i class="fas fa-times-circle has-text-danger"></i>
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div class="column is-12">
              <div class="field">
                <label class="label">
                  Scenario
                </label>
                <div class="control">
                  <textarea v-model="currentEvent.description"
                            class="textarea"
                            rows="10"></textarea>
                </div>
              </div>
            </div>
            <div class="column is-12">
              <div class="field">
                <label class="label">
                  Remarks
                </label>
                <div class="control">
                  <textarea v-model="currentEvent.exerciseGuidance"
                            class="textarea"
                            rows="10"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="modal-card-foot">
        <div class="field is-grouped">
          <p class="control">
            <a class="button is-primary"
               @click="validateBeforeSubmit">Save</a>
          </p>
          <p class="control">
            <a class="button"
               @click="close">
              Cancel
            </a>
          </p>
        </div>
      </footer>
    </div>
    <div v-else>
      <empty-state :data="planEvent"
                   :isLoading='$apollo.loading' />
    </div>
  </div>
</template>

<script>
import PlanEvent from '@/plan/model/planevent'
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'
import HelpContent from '@/shared/components/helpcontent'
import DatePicker from '@/shared/components/datepicker'
import helpers from '@/shared/mixins/helpers'

import {
  PlanEventRead,
  PlanEventsUpdate,
  PlanEventsCreate
} from '@/plan/graphql/PlanEvents.gql'

export default {
  name: 'manage-event',
  components: {
    DatePicker,
    Swatches,
    HelpContent
  },
  mixins: [helpers],
  props: {
    id: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  apollo: {
    planEvent: {
      query: PlanEventRead,
      variables() {
        return {
          where: { id: this.id }
        }
      }
    }
  },
  watch: {
    planEvent() {
      if (!this.currentEvent.id && this.planEvent) {
        this.currentEvent = JSON.parse(
          JSON.stringify(this.planEvent),
          this.omitTypename
        )
      }
    }
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      currentEvent: new PlanEvent(),
      methodTypes: [
        { id: 1, value: 'Live', label: 'Live' },
        { id: 2, value: 'Virtual', label: 'Virtual' },
        { id: 3, value: 'Constructive', label: 'Constructive' },
        { id: 4, value: 'Integrated LVC', label: 'Integrated LVC' }
      ]
    }
  },
  methods: {
    removeColor() {
      this.currentEvent.color = ''
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.save()
          return
        }
        this.$buefy.toast.open({
          message: 'Correct errors!',
          type: 'is-danger'
        })
      })
    },
    save() {
      delete this.currentEvent.id
      delete this.currentEvent.injects
      delete this.currentEvent.organization
      if (this.currentEvent.startDate === '') {
        this.currentEvent.startDate = null
      }
      if (this.currentEvent.endDate === '') {
        this.currentEvent.endDate = null
      }
      let dataVariable = {
        ...this.currentEvent
      }
      if (this.id === (null || '')) {
        this.$apollo
          .mutate({
            mutation: PlanEventsCreate,
            variables: {
              data: dataVariable
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.$validator.reset()
            this.$router.go(-1)
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('Event Create: ' + error)
          })
      } else {
        this.$apollo
          .mutate({
            mutation: PlanEventsUpdate,
            variables: {
              data: dataVariable,
              where: {
                id: this.id
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.$validator.reset()
            this.$router.go(-1)
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('Event Updated: ' + error)
          })
      }
    },
    close() {
      this.$validator.reset()
      this.$router.go(-1)
    }
  }
}
</script>
