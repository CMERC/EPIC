<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <span class="button is-primary"
                @click="toggleQuickAdd(true)">Create MSEL Inject</span>
          <a class="card-header-icon"
             @click="toggleQuickAdd(false)"
             title="Quick Add">
            <span class="icon is-small">
              <i class="fas fa-plus"></i>
            </span>
          </a>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <span class="has-text-weight-semibold">{{planInjects ? planInjects.length : 0}} MSEL Injects</span>
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <router-link :to="{ name: 'injects-list'}">
                <button class="button"
                        title="List">
                  <span class="icon">
                    <i class="fas fa-align-justify has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
            <p class="control">
              <router-link :to="{ name: 'injects-board'}">
                <button class="button"
                        title="Board">
                  <span class="icon">
                    <i class="fas fa-columns has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
            <p class="control">
              <router-link :to="{ name: 'injects-calendar'}">
                <button class="button"
                        title="Calendar">
                  <span class="icon">
                    <i class="fas fa-calendar-alt has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
          </div>
        </div>
        <div class="level-item">
          <help-content :reference="'plan.inject.calendar'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div class="columns is-relative">
      <loading-state :isLoading='$apollo.loading' />
      <div class="columns is-mobile">
        <div class="column is-full">
          <full-calendar :events="allInjects"
                         v-bind="calendarOptions"
                         @eventDrop="eventDrop"
                         @eventClick="previewInject"
                         :datesRender="viewRender"></full-calendar>
        </div>
      </div>
    </div>
    <JMETQuickAdd :open="quickAdd"
                  :planInject="planInject"
                  :fullCreate="fullCreate"
                  @close="close"></JMETQuickAdd>
    <inject-preview :open="injectPreviewModal"
                    :id="selectedInject"
                    @close="injectCloseModal"></inject-preview>
  </div>
</template>
<script>
import JMETQuickAdd from '@/plan/components/jmet-quickadd'
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanInjectsSubscription,
  PlanInjectsCalendarRead,
  PlanInjectsUpdate
} from '@/plan/graphql/PlanInjects.gql'

import helpers from '@/shared/mixins/helpers'
import lightOrDark from '@/shared/mixins/lightOrDark'
import PlanInject from '@/plan/model/planinject'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import InjectPreview from '@/plan/components/inject-preview'
import Vue from 'vue'
export default {
  name: 'injects-calendar',
  mixins: [helpers, lightOrDark],
  components: {
    JMETQuickAdd,
    HelpContent,
    FullCalendar,
    InjectPreview
  },
  apollo: {
    planInjects: {
      query: PlanInjectsCalendarRead,
      variables() {
        return {
          where: {
            deletedAt: null,
            startDate_gte: this.startMoment,
            startDate_lte: this.endMoment
          },
          orderBy: this.orderBy
        }
      },
      update(data) {
        if (data && data.planInjects) {
          //Used to add status color to top level object for calendar display
          this.allInjects = JSON.parse(
            JSON.stringify(data.planInjects),
            this.omitTypename
          ).map(function(inject) {
            return Vue.util.extend(inject, {
              color: inject.status ? inject.status.color : ''
            })
          })
        }
        return data.planInjects
      },
      subscribeToMore: {
        document: PlanInjectsSubscription,
        variables() {
          return {
            where: {
              node: {
                deletedAt: null,
                startDate_gte: this.startMoment,
                startDate_lte: this.endMoment
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planInject.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planInjects: [
                  subscriptionData.data.planInject.node,
                  ...previousResult.planInjects
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planInjects: [
                  ...previousResult.planInjects.filter(
                    obj =>
                      subscriptionData.data.planInject.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanInjects = JSON.parse(
                JSON.stringify(previousResult.planInjects)
              )
              let index = newPlanInjects.findIndex(
                x => x.id === subscriptionData.data.planInject.node.id
              )
              newPlanInjects[index] = subscriptionData.data.planInject.node
              newResult = {
                planInjects: newPlanInjects
              }
              break
            }
            default: {
              throw new Error(`Unknown mediaPost mutation`)
            }
          }
          return newResult
        }
      }
    }
  },
  data() {
    return {
      calendarOptions: {
        timeZone: this.$store.state.activeWorkspace.timeZone,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
        },
        eventColor: '#424ef4',
        editable: true,
        handleWindowResize: false,
        contentHeight: 750,
        eventLimit: 5,
        displayEventTime: false,
        nowIndicator: true,
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          momentTimezonePlugin
        ]
      },
      orderBy: 'startDate_ASC',
      allInjects: [],
      planInjects: [],
      quickAdd: false,
      planInject: new PlanInject(),
      fullCreate: false,
      planInjectsCalendar: [],
      startMoment: null,
      endMoment: null,
      injectPreviewModal: false,
      selectedInject: null,
      dateConfig: {
        enableTime: true,
        altInput: true,
        altFormat: 'd M y H:i (Z)',
        dateFormat: 'Z'
      }
    }
  },
  computed: {
    filteredCalendar() {
      return [...this.planInjects]
    }
  },
  methods: {
    eventDrop(event, delta, revertFunc) {
      this.$buefy.dialog.confirm({
        title: 'Move Event',
        message: 'Move to ' + event.event.start.toLocaleString() + ' ?',
        type: 'is-danger',
        onConfirm: () => this.updateInject(event.event.id, event.event.start),
        onCancel: () => revertFunc()
      })
    },
    updateInject(id, startVal) {
      this.$apollo
        .mutate({
          mutation: PlanInjectsUpdate,
          variables: {
            data: {
              startDate: startVal
            },
            where: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Status Update: ' + error)
        })
    },
    previewInject(inject) {
      this.injectPreviewModal = true
      this.selectedInject = inject.event.id
    },
    viewRender(view) {
      this.startMoment = view.view.currentStart.toISOString()
      this.endMoment = view.view.currentEnd.toISOString()
    },
    injectCloseModal() {
      this.injectPreviewModal = false
      this.selectedInject = null
    },
    close() {
      this.quickAdd = false
      this.fullCreate = false
      this.errors.clear()
      this.$validator.reset()
      this.planInject = new PlanInject()
    },
    toggleQuickAdd(fullValue) {
      this.quickAdd = true
      this.errors.clear()
      this.$validator.reset()
      this.planInject = new PlanInject()
      if (fullValue) {
        this.fullCreate = fullValue
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
</style>
