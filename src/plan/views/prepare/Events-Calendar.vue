<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="createNewEvent">
            Create Event
          </a>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <router-link :to="{ name: 'events-calendar'}">
                <button class="button"
                        title="Calendar">
                  <span class="icon is-small">
                    <i class="fas fa-calendar-alt has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
            <p class="control">
              <router-link :to="{ name: 'events-cards'}">
                <button class="button"
                        title="Cards">
                  <span class="icon is-small">
                    <i class="fas fa-th-large has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </nav>
    <div class="columns is-relative">
      <loading-state :isLoading='$apollo.loading' />
      <div class="column is-12">
        <full-calendar :events="planEvents"
                       v-bind="calendarOptions"
                       @eventClick="eventSelected"
                       @eventDrop="eventDrop"
                       :datesRender="viewRender">
        </full-calendar>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import {
  PlanEventsCalendarRead,
  PlanEventsDelete,
  PlanEventsUpdate,
  PlanEventCalendarSubscription
} from '@/plan/graphql/PlanEvents.gql'
import helpers from '@/shared/mixins/helpers'

export default {
  name: 'events-calendar',
  mixins: [helpers],
  apollo: {
    planEvents: {
      query: PlanEventsCalendarRead,
      variables() {
        return {
          where: {
            type: null,
            OR: [
              {
                startDate_gte: this.startMoment,
                startDate_lte: this.endMoment
              },
              {
                endDate_gte: this.startMoment,
                endDate_lte: this.endMoment
              },
              {
                startDate_lte: this.startMoment,
                endDate_gte: this.endMoment
              }
            ]
          },
          orderBy: 'startDate_ASC'
        }
      },
      subscribeToMore: {
        document: PlanEventCalendarSubscription,
        variables() {
          return {
            where: {
              node: {
                type: null,
                OR: [
                  {
                    startDate_gte: this.startMoment,
                    startDate_lte: this.endMoment
                  },
                  {
                    endDate_gte: this.startMoment,
                    endDate_lte: this.endMoment
                  },
                  {
                    startDate_lte: this.startMoment,
                    endDate_gte: this.endMoment
                  }
                ]
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planEvent.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planEvents: [
                  subscriptionData.data.planEvent.node,
                  ...previousResult.planEvents
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planEvents: [
                  ...previousResult.planEvents.filter(
                    obj =>
                      subscriptionData.data.planEvent.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanEvents = JSON.parse(
                JSON.stringify(previousResult.planEvents)
              )
              let index = newPlanEvents.findIndex(
                x => x.id === subscriptionData.data.planEvent.node.id
              )
              newPlanEvents[index] = subscriptionData.data.planEvent.node
              newResult = {
                planEvents: newPlanEvents
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
  components: {
    FullCalendar
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
        eventColor: '#378006',
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
      startMoment: null,
      endMoment: null,
      searchQuery: '',
      planEventsCount: 0,
      planEvents: []
    }
  },
  methods: {
    eventDrop(event, delta, revertFunc) {
      this.$buefy.dialog.confirm({
        title: 'Move Event',
        message: 'Move to ' + event.event.start.toLocaleString() + ' ?',
        type: 'is-danger',
        onConfirm: () =>
          this.updateEvent(event.event.id, event.event.start, event.event.end),
        onCancel: () => revertFunc()
      })
    },
    updateEvent(id, startVal, endVal) {
      this.$apollo
        .mutate({
          mutation: PlanEventsUpdate,
          variables: {
            data: {
              startDate: startVal,
              endDate: endVal
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
    createNewEvent() {
      this.$router.push({
        name: 'createEvent'
      })
    },
    editEvent(event) {
      this.$router.push({
        name: 'editEvent',
        params: { event: event, id: event.id, isEdit: true }
      })
    },
    deleteEvent(event) {
      // Delete Event
      this.$apollo
        .mutate({
          mutation: PlanEventsDelete,
          variables: {
            id: {
              id: event.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Event Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Event: ' + error)
        })
    },
    confirmDelete(event) {
      this.$buefy.dialog.confirm({
        title: 'Delete Event',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteEvent(event)
      })
    },
    eventSelected(event) {
      this.$router.push({ name: 'view-event', params: { id: event.event.id } })
    },
    viewRender(view) {
      // Get start and end dates from calendar
      this.startMoment = view.view.currentStart.toISOString()
      this.endMoment = view.view.currentEnd.toISOString()

      // get data for the interval
    }
  },
  computed: {
    filteredEvents() {
      return this.planEvents.filter(events => {
        let searchRegex = new RegExp(this.searchQuery, 'i')
        return searchRegex.test(JSON.stringify(events))
      })
    },
    hasEvents() {
      if (this.filteredEvents && this.filteredEvents.length > 0) {
        return this.filteredEvents
      }
    },
    trainingObj() {
      // When we get training Objectives hooked up, update this
      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
.subtitle span.tag {
  margin-right: 5px;
}
.events {
  &:hover {
    cursor: pointer;
    background-color: #d7dcdd;
  }
}
</style>
