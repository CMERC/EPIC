<template>
  <div class="is-relative-mobile prepareDash">
    <nav class="level mt-5">
      <div class="level-left">
        <breadcrumb />
      </div>
      <div class="level-right">
        <div class="level-item">
          <help-content :reference="'plan.prepare.dash'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>


    <div class="tile is-ancestor planDash">
      <div class="tile is-vertical is-4">
        <div class="tile">
          <div class="tile is-parent">
            <div class="tile is-child notification has-shadow">
              <exercise-information :isCard='false'/>
            </div>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child notification has-shadow">
            <div class="field">
              <label class="label">
                MSEL Injects
              </label>
              <div class="control">
                <div class="columns is-mobile is-multiline">
                  <div class="column is-half">
                    <div class="field">
                      <div class="control is-expanded">
                        <div class="select">
                          <select v-model="selectedPlanLabelGroup">
                            <option v-for="planLabelGroup in planLabelGroups"
                                    :key="planLabelGroup.id">
                              {{planLabelGroup.title}}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <div class="control is-expanded">
                        <div class="select">
                          <select v-model="selectedPlanInjectOwner">
                            <option>All</option>
                            <option v-for="planInjectOwner in planInjectOwners"
                                    :key="planInjectOwner.id">
                              {{planInjectOwner.title}}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div ref="InjectsCountPerBoard"
                 id="InjectsCountPerBoard"></div>
          </article>
        </div>
      </div>
      <div class="tile is-vertical is-4">
        <div class="tile">
          <div class="tile is-parent">
            <article class="tile is-child notification has-shadow">
              <div ref="requestedvsplannedTOs"
                   id="requestedvsplannedTOs"></div>
            </article>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child notification has-shadow">
            <div ref="totalBudget"
                 id="totalBudget"></div>
          </article>
        </div>
      </div>
      <div class="tile is-parent is-4">
        <article class="tile is-child box prepareCalendar">
          <div class="content">
            <label class="label">
              Calendar
            </label>
            <div class="content has-text-black has-background-white">
              <full-calendar v-bind="calendarOptions"
                             :events="filteredCalendar ? filteredCalendar: [] "
                             @eventClick="eventSelected"
                             :datesRender="viewRender" />
            </div>
          </div>
        </article>
      </div>
    </div>

    <meeting-preview v-if="openMeetingPreview"
                     :open="openMeetingPreview"
                     :id="selectedMeeting"
                     @close="closeMeetingPreview" />
    <inject-preview :open="injectPreviewModal"
                    :id="selectedInject"
                    @close="injectCloseModal" />
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist'
import { GetPlanReport } from '@/plan/graphql/PlanReports.gql'
import { PlanLabelGroupsRead } from '@/plan/graphql/PlanLabelGroups.gql'
import { PlanInjectOwnersRead } from '@/plan/graphql/PlanInjectOwners.gql'
import PlotlyOptions from '@/shared/mixins/plotlyOptions.js'

import FullCalendar from '@fullcalendar/vue'
import listPlugin from '@fullcalendar/list'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import MeetingPreview from '@/plan/components/meeting-preview'
import InjectPreview from '@/plan/components/inject-preview'
import ExerciseInformation from '@/plan/components/exercise-information'
import {
  PlanEventsList,
  PlanEventSubscription,
  PlanEventsCalendarRead,
  PlanEventCalendarSubscription
} from '@/plan/graphql/PlanEvents.gql'

import {
  PlanFundingSourcesRead,
  PlanFundingSourceSubscription
} from '@/plan/graphql/PlanFundingSources.gql'

import {
  PlanParticipantFundingSourcesRead,
  PlanParticipantFundingSourceSubscription
} from '@/plan/graphql/PlanParticipantFundingSources.gql'

import {
  PlanInjectsCounts,
  PlanInjectsCalendarRead,
  PlanInjectsCalendarSubscription
} from '@/plan/graphql/PlanInjects.gql'

import { PlanExerciseObjectivesCounts } from '@/plan/graphql/PlanExerciseObjectives.gql'

import {
  PlanMeetingsCalendarRead,
  PlanMeetingCalendarSubscription
} from '@/plan/graphql/PlanMeetings.gql'
import helpers from '@/shared/mixins/helpers'
import HelpContent from '@/shared/components/helpcontent'

export default {
  name: 'prepare-dash',
  props: {},
  components: {
    ExerciseInformation,
    FullCalendar,
    InjectPreview,
    MeetingPreview,
    HelpContent
  },
  mixins: [helpers, PlotlyOptions],
  apollo: {
    planLabelGroups: {
      query: PlanLabelGroupsRead,
      update(data) {
        if (data && data.planLabelGroups) {
          return data.planLabelGroups
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planInjectOwners: {
      query: PlanInjectOwnersRead,
      update(data) {
        if (data && data.planInjectOwners) {
          return data.planInjectOwners
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planFundingSources: {
      query: PlanFundingSourcesRead,
      update(data) {
        if (
          data &&
          data.planFundingSources &&
          data.planFundingSources.length > 0
        ) {
          return data.planFundingSources
        }
      },
      subscribeToMore: {
        document: PlanFundingSourceSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planFundingSource.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planFundingSources: [
                  subscriptionData.data.planFundingSource.node,
                  ...previousResult.planFundingSources
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planFundingSources: [
                  ...previousResult.planFundingSources.filter(
                    obj =>
                      subscriptionData.data.planFundingSource.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanFundingSources = JSON.parse(
                JSON.stringify(previousResult.planFundingSources)
              )
              let index = newPlanFundingSources.findIndex(
                x => x.id === subscriptionData.data.planFundingSource.node.id
              )
              newPlanFundingSources[index] =
                subscriptionData.data.planFundingSource.node
              newResult = {
                planFundingSources: newPlanFundingSources
              }
              break
            }
            default: {
              throw new Error(`Unknown Exercise Objective mutation`)
            }
          }
          return newResult
        }
      }
    },
    planParticipantFundingSources: {
      query: PlanParticipantFundingSourcesRead,
      update(data) {
        if (
          data &&
          data.planParticipantFundingSources &&
          data.planParticipantFundingSources.length > 0
        ) {
          return data.planParticipantFundingSources
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanParticipantFundingSourceSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn =
            subscriptionData.data.planParticipantFundingSource.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantFundingSources: [
                  subscriptionData.data.planParticipantFundingSource.node,
                  ...previousResult.planParticipantFundingSources
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantFundingSources: [
                  ...previousResult.planParticipantFundingSources.filter(
                    obj =>
                      subscriptionData.data.planParticipantFundingSource
                        .previousValues.id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantFundingSources = JSON.parse(
                JSON.stringify(previousResult.planParticipantFundingSources)
              )
              let index = newPlanParticipantFundingSources.findIndex(
                x =>
                  x.id ===
                  subscriptionData.data.planParticipantFundingSource.node.id
              )
              newPlanParticipantFundingSources[index] =
                subscriptionData.data.planParticipantFundingSource.node
              newResult = {
                planParticipantFundingSources: newPlanParticipantFundingSources
              }
              break
            }
            default: {
              throw new Error(`Unknown mutation`)
            }
          }
          return newResult
        }
      }
    },
    injectsCountPerBoard: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'InjectsCountPerBoard',
            dataSourceType: this.selectedPlanLabelGroup,
            evaluationType: this.selectedPlanInjectOwner
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let chartData = [
            {
              x: data.getPlanReport.data[0].x,
              y: data.getPlanReport.data[0].y,
              type: 'bar',
              marker: data.getPlanReport.data[0].marker
            }
          ]
          Plotly.newPlot(
            this.$refs.InjectsCountPerBoard,
            chartData,
            {
              title:
                '<b>MSEL Injects</b> <br>Total: ' + data.getPlanReport.total,
              ...this.hoverOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    requestedvsplannedTOs: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'requestedvsplannedTOs'
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let chartData = [
            {
              labels: data.getPlanReport.data[0].labels,
              values: data.getPlanReport.data[0].values,
              type: data.getPlanReport.data[0].type,
              marker: data.getPlanReport.data[0].marker,
              textinfo: 'value+percent'
            }
          ]
          Plotly.newPlot(
            this.$refs.requestedvsplannedTOs,
            chartData,
            {
              title:
                '<b>Training Objectives <br>Requested vs Planned</b> <br>Total Requested: ' +
                data.getPlanReport.total,
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    totalBudget: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'totalBudget'
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let chartData = [
            {
              labels: data.getPlanReport.data[0].labels,
              values: data.getPlanReport.data[0].values,
              type: data.getPlanReport.data[0].type,
              marker: data.getPlanReport.data[0].marker,
              textinfo: 'value+percent'
            }
          ]

          let percentAllocated =
            (parseInt(data.getPlanReport.data[0].values[0]) +
              parseInt(data.getPlanReport.data[0].values[1])) /
            parseInt(data.getPlanReport.total).toFixed(2)

          Plotly.newPlot(
            this.$refs.totalBudget,
            chartData,
            {
              title:
                '<b>Budget</b><br> ' +
                'Total Budget: ' +
                this.formatNumber(data.getPlanReport.total, 'currency') +
                '<br> ' +
                this.formatNumber(percentAllocated, 'percent') +
                ' Allocated',
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planEventsCalendar: {
      query: PlanEventsCalendarRead,
      variables() {
        return {
          where: {
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
      update(data) {
        if (data && data.planEvents) {
          return data.planEvents
        }
      },
      subscribeToMore: {
        document: PlanEventCalendarSubscription,
        variables() {
          return {
            where: {
              node: {
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
    },
    planInjectsCalendar: {
      query: PlanInjectsCalendarRead,
      variables() {
        return {
          where: {
            deletedAt: null,
            startDate_gte: this.startMoment,
            startDate_lte: this.endMoment
          },
          orderBy: 'startDate_ASC'
        }
      },
      update(data) {
        if (data && data.planInjects) {
          return data.planInjects
        }
      },
      subscribeToMore: {
        document: PlanInjectsCalendarSubscription,
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
    },
    planMeetingsCalendar: {
      query: PlanMeetingsCalendarRead,
      variables() {
        return {
          where: {
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
      update(data) {
        if (data && data.planMeetings) {
          return data.planMeetings
        }
      },
      subscribeToMore: {
        document: PlanMeetingCalendarSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planMeeting.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planMeetings: [
                  subscriptionData.data.planMeeting.node,
                  ...previousResult.planMeetings
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planMeetings: [
                  ...previousResult.planMeetings.filter(
                    obj =>
                      subscriptionData.data.planMeeting.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanMeetings = JSON.parse(
                JSON.stringify(previousResult.planMeetings)
              )
              let index = newPlanMeetings.findIndex(
                x => x.id === subscriptionData.data.planMeeting.node.id
              )
              newPlanMeetings[index] = subscriptionData.data.planMeeting.node
              newResult = {
                planMeetings: newPlanMeetings
              }
              break
            }
            default: {
              throw new Error(`Unknown Exercise Objective mutation`)
            }
          }
          return newResult
        }
      }
    },
    planEvents: {
      query: PlanEventsList,
      variables() {
        return {
          where: {
            type: this.exType
          },
          orderBy: 'startDate_ASC'
        }
      },
      update(data) {
        if (data && data.planEvents) {
          this.currentExercise = JSON.parse(
            JSON.stringify(data.planEvents[0]),
            this.omitTypename
          )
          return data.planEvents
        }
      },
      subscribeToMore: {
        document: PlanEventSubscription,
        variables() {
          return {
            where: {
              node: {
                type: this.exType
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
    },
    planInjectsCount: {
      query: PlanInjectsCounts,
      variables() {
        return {
          where: {
            deletedAt: null
          }
        }
      },
      update(data) {
        if (data && data.planInjectsConnection) {
          return data.planInjectsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planExerciseObjectiveCount: {
      query: PlanExerciseObjectivesCounts,
      variables: {},
      update(data) {
        if (data && data.planExerciseObjectivesConnection) {
          return data.planExerciseObjectivesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      calendarOptions: {
        theme: true,
        timeZone: this.$store.state.activeWorkspace.timeZone,
        header: {
          left: 'prev,next today',
          center: '',
          right: 'title'
        },
        eventColor: '#424ef4',
        editable: true,
        handleWindowResize: false,
        contentHeight: 640,
        displayEventTime: true,
        nowIndicator: true,
        plugins: [listPlugin, momentTimezonePlugin],
        defaultView: 'listMonth'
      },
      calendarPlugins: [listPlugin],
      planEventsCalendar: [],
      planInjectsCalendar: [],
      planMeetingsCalendar: [],
      startMoment: null,
      endMoment: null,
      selectedPlanLabelGroup: 'Development',
      selectedPlanInjectOwner: 'All',
      hoverOptions: {
        hovermode: 'closest',
        hoverlabel: { bgcolor: '#FFF' },
        xaxis: {
          automargin: true,
          fixedrange: true
        },
        yaxis: {
          automargin: true,
          fixedrange: true
        }
      },
      stackLayoutOptions: {
        barmode: 'stack',
        showlegend: true,
        legend: { orientation: 'h' },
        hovermode: 'closest',
        hoverlabel: { bgcolor: '#FFF' },
        xaxis: {
          tickformat: ',.0%',
          range: [0, 1],
          automargin: true,
          fixedrange: true
        },
        yaxis: {
          automargin: true,
          fixedrange: true
        }
      },
      exType: 'primary',
      openMeetingPreview: false,
      injectPreviewModal: false,
      selectedInject: null,
      selectedMeeting: null
    }
  },
  methods: {
    eventSelected(e) {
      if (!e) return
      if (e && e.event && e.event.extendedProps.__typename == 'PlanEvent') {
        if (e && e.event && e.event.extendedProps.type === 'primary') {
          this.$router.push({
            name: 'exercise-details'
          })
        } else {
          this.$router.push({
            name: 'view-event',
            params: { id: e.event.id }
          })
        }
      } else if (
        e &&
        e.event &&
        e.event.extendedProps.__typename == 'PlanInject'
      ) {
        this.injectPreviewModal = true
        this.selectedInject = e.event.id
      } else if (
        e &&
        e.event &&
        e.event.extendedProps.__typename == 'PlanMeeting'
      ) {
        this.openMeetingPreview = true
        this.selectedMeeting = e.event.id
      }
    },
    viewRender(view) {
      // Get start and end dates from calendar
      this.startMoment = view.view.currentStart.toISOString()
      this.endMoment = view.view.currentEnd.toISOString()

      // get data for the interval
      this.$apollo.queries.planEventsCalendar.refetch()
      this.$apollo.queries.planInjectsCalendar.refetch()
      this.$apollo.queries.planMeetingsCalendar.refetch()
    },
    closeMeetingPreview() {
      this.openMeetingPreview = false
      this.selectedMeeting = ''
    },
    injectCloseModal() {
      this.injectPreviewModal = false
      this.selectedInject = null
    },
    editExercise() {
      this.$router.push({
        name: 'exercise-stepper',
        query: { from: this.$route.fullPath }
      })
    }
  },
  computed: {
    availableFundingTotal() {
      let sum = 0
      if (this.planFundingSources && this.planFundingSources.length > 0) {
        sum = this.planFundingSources.reduce((accumulator, currentFunding) => {
          return accumulator + currentFunding.amount
        }, 0)
      }
      return sum
    },
    participantFundingAllocated() {
      let sum = 0
      if (
        this.planParticipantFundingSources &&
        this.planParticipantFundingSources.length > 0
      ) {
        sum = this.planParticipantFundingSources.reduce(
          (accumulator, currentTotal) => {
            return accumulator + currentTotal.amount
          },
          0
        )
        if (this.planParticipantFundingSource != null) {
          sum = sum - this.planParticipantFundingSource.amount
        }
      }
      return sum
    },
    nonAllocatedFunding() {
      if (
        this.planFundingSources &&
        this.planFundingSources.length > 0 &&
        this.planParticipantFundingSources &&
        this.planParticipantFundingSources.length > 0
      ) {
        return this.availableFundingTotal - this.participantFundingAllocated
      }
    },
    filteredCalendar() {
      if (
        this.planEventsCalendar &&
        this.planInjectsCalendar &&
        this.planMeetingsCalendar
      ) {
        return [
          ...this.planEventsCalendar,
          ...this.planInjectsCalendar,
          ...this.planMeetingsCalendar
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
