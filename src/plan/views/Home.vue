<template>
  <div class="container is-fullhd">
    <section class="section">
      <nav class="level">
        <div class="level-left">
          <quick-create area="plan" />
        </div>
        <div class="level-right">
          <div class="level-item">
            <help-content :reference="'plan.general'"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <div class="tile is-ancestor planDash">
        <div class="tile is-parent is-3 linkSidebar">
          <div class="tile is-child notification has-shadow"> 
            <LinkSidebar :data="links"
                         :area="'plan'" />
          </div>
        </div>
        <div class="tile is-vertical is-4">
          <div class="tile">
            <div class="tile is-parent">
              <div class="tile is-child">
                <exercise-information :bigHeader="true"/>
              </div>
            </div>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child card">
              <nav class="level is-pulled-right">
                <div class="level-right"
                     v-if="planEvents && planEvents.length > 0">
                  <div class="level-item">
                    <b-dropdown position="is-bottom-left">
                      <a class="button is-small"
                         slot="trigger">
                        <span class="icon is-small">
                          <i class="fas fa-ellipsis-v"></i>
                        </span>
                      </a>
                      <b-dropdown-item @click="editMSEL()">
                        <span class="icon is-small">
                          <i class="fas fa-pen"></i>
                        </span>
                        <span>Edit MSEL</span>
                      </b-dropdown-item>
                    </b-dropdown>
                  </div>
                </div>
              </nav>
              <p class="px-2 py-2 title">MSEL List</p>
              <div class="content mselPanel">
                <loading-state :isLoading="$apollo.queries.planInjects.loading" />
                <nav class="panel has-text-black has-background-white">
                  <div class="panel-block">
                    <p class="control has-icons-left has-icons-right">
                      <input class="input is-rounded is-small"
                             type="text"
                             placeholder="search"
                             v-model.lazy="searchQuery" />
                      <span class="icon is-small is-left">
                        <i class="fas fa-search"
                           aria-hidden="true"></i>
                      </span>
                      <span class="icon is-small is-right"
                            @click="searchQuery = ''">
                        <i class="fas fa-times-circle"></i>
                      </span>
                    </p>
                  </div>
                  <div v-if="planInjects && planInjects.length > 0">
                    <a class="panel-block"
                       v-for="inject in planInjects"
                       v-bind:key="inject.id"
                       @click="previewInject(inject)">
                      <p class="is-small">
                        <span>#{{inject.number}} </span>
                        <span v-if="inject.status != null"
                              class="tag is-rounded"
                              :style="'background-color:'+inject.status.color"
                              :class="lightOrDark(inject.status.color)">{{inject.status.title}}</span>
                        <span> {{inject.title}} </span>
                        <span class="has-text-weight-light tooltip is-tooltip-bottom is-6"
                              :data-tooltip="formatDate(inject.startDate, 'utc-dtg')">{{formatDate(inject.startDate, 'dtg')}}</span>
                      </p>
                    </a>
                  </div>
                  <div v-else
                       class="no-result apollo">
                    <div class="content">
                      <figure>
                        <p>No MSEL Injects found. Start planning by entering them now.</p>
                        <router-link :to="{name: 'planInjectNew'}">
                          <span class="button is-default is-centered">Create MSEL Inject</span>
                        </router-link>
                      </figure>
                    </div>
                  </div>
                </nav>
              </div>
            </article>
          </div>
        </div>
        <div class="tile is-parent is-5">
          <article class="tile is-child notification has-shadow">
            <div class="content">
              <p class="title">Calendar</p>
              <div class="content has-text-black has-background-white">
                <full-calendar v-bind="calendarOptions"
                               :events="filteredCalendar ? filteredCalendar: [] "
                               @eventClick="eventSelected"
                               :datesRender="viewRender"></full-calendar>
              </div>
            </div>
          </article>
        </div>
      </div>
      <inject-preview :open="injectPreviewModal"
                      :id="selectedInject"
                      @close="injectCloseModal"></inject-preview>
    </section>
  </div>
</template>

<script>
import LinkSidebar from '@/shared/components/linkSidebar'
import InjectPreview from '@/plan/components/inject-preview'
import ExerciseInformation from '@/plan/components/exercise-information'
import HelpContent from '@/shared/components/helpcontent'
import FullCalendar from '@fullcalendar/vue'
import listPlugin from '@fullcalendar/list'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import QuickCreate from '@/shared/components/quick-create'
import {
  PlanEventsCalendarRead,
  PlanEventsList,
  PlanEventSubscription,
  PlanEventCalendarSubscription
} from '@/plan/graphql/PlanEvents.gql'
import {
  PlanInjectsList,
  PlanInjectsCounts,
  PlanInjectsCalendarRead,
  PlanInjectsSubscription
} from '@/plan/graphql/PlanInjects.gql'
import { PlanExerciseObjectivesCounts } from '@/plan/graphql/PlanExerciseObjectives.gql'
import lightOrDark from '@/shared/mixins/lightOrDark'
import helpers from '@/shared/mixins/helpers'

export default {
  name: 'PlanView',
  mixins: [helpers, lightOrDark],
  components: {
    ExerciseInformation,
    LinkSidebar,
    HelpContent,
    FullCalendar,
    InjectPreview,
    QuickCreate
  },
  apollo: {
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
    planInjects: {
      query: PlanInjectsList,
      variables() {
        return {
          where: {
            AND: [{ deletedAt: null }],
            OR: [
              { title_contains: this.searchQuery },
              { description_contains: this.searchQuery },
              { type_contains: this.searchQuery },
              {
                method: {
                  OR: [{ name_contains: this.searchQuery }]
                }
              },
              { trigger_contains: this.searchQuery },
              { response_contains: this.searchQuery },
              { remarks_contains: this.searchQuery },
              {
                status: {
                  title_contains: this.searchQuery
                }
              }
            ]
          },
          first: 10,
          orderBy: 'updatedAt_DESC'
        }
      },
      subscribeToMore: {
        document: PlanInjectsSubscription,
        variables() {
          return {
            where: {
              node: {
                AND: [{ deletedAt: null }],
                OR: [
                  { title_contains: this.searchQuery },
                  { description_contains: this.searchQuery },
                  { type_contains: this.searchQuery },
                  {
                    method: {
                      name_contains: this.searchQuery
                    }
                  },
                  { trigger_contains: this.searchQuery },
                  { response_contains: this.searchQuery },
                  { remarks_contains: this.searchQuery },
                  {
                    status: {
                      title_contains: this.searchQuery
                    }
                  }
                ]
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
        if (data && data.planEvents && data.planEvents.length > 0) {
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
        if (data && data.planEvents && data.planEvents.length > 0) {
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
      searchQuery: '',
      injectPreviewModal: false,
      selectedInject: null,
      requestedFilter: '',
      exType: 'primary',
      planEventsCalendar: [],
      planInjectsCalendar: [],
      planEvents: [],
      currentExercise: {
        name: '',
        command: null,
        startDate: null,
        endDate: null,
        exerciseGuidance: ''
      },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      startMoment: null,
      endMoment: null,
      links: [
        {
          name: 'Prepare',
          icon: 'fas fa-tasks',
          links: [
            {
              name: 'Dashboard',
              url: '/plan/prepare/dashboard'
            },
            {
              name: 'Exercise Details',
              url: '/plan/prepare/exercise-details'
            },
            { name: 'Participants', url: '/plan/prepare/participants' },
            {
              name: 'Training Objectives',
              url: '/plan/prepare/objectives-list'
            },
            { name: 'Events', url: '/plan/prepare/events' }
          ]
        },
        {
          name: 'MSEL',
          icon: '',
          links: [
            { name: 'List', url: '/plan/prepare/injects-list' },
            { name: 'Board', url: '/plan/prepare/injects-board' },
            { name: 'Calendar', url: '/plan/prepare/injects-calendar' }
          ]
        },
        {
          name: 'Train',
          icon: 'fas fa-stopwatch',
          links: [
            {
              name: 'Dashboard',
              url: '/plan/train/dashboard'
            },
            {
              name: 'MSEL Timeline',
              url: '/plan/train/msel-timeline?event=&b=Tracking'
            },
            { name: 'MSEL Tracker', url: '/plan/train/msel-tracker?b=Tracking' }
          ]
        },
        {
          name: 'Assess',
          icon: 'fas fa-clipboard-check',
          links: [
            { name: 'Overview', url: '/plan/assessment/overview' },
            { name: 'Collect', url: '/plan/feedback/collect', beta: true },
            { name: 'Assessment List', url: '/plan/assessment/assess-list' },
            { name: 'Feedback', url: '/plan/feedback/feedbacks' }
          ]
        },
        {
          name: 'Reports',
          icon: 'fas fa-chart-bar',
          links: [
            { name: 'Custom', url: '/plan/reports/custom' },
            { name: 'Analytics', url: '/plan/reports/analytics' },
            { name: 'Export', url: '/plan/reports/export' }
          ]
        }
      ]
    }
  },
  computed: {
    filteredCalendar() {
      if (this.planEventsCalendar && this.planInjectsCalendar) {
        return [...this.planEventsCalendar, ...this.planInjectsCalendar]
      }
    }
  },
  methods: {
    editExercise() {
      this.$router.push({
        name: 'exercise-stepper',
        query: { from: this.$route.fullPath }
      })
    },
    editMSEL() {
      this.$router.push({
        name: 'injects-list'
      })
    },
    previewInject(inject) {
      this.injectPreviewModal = true
      this.selectedInject = inject.id
    },
    injectCloseModal() {
      this.injectPreviewModal = false
      this.selectedInject = null
    },
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
      } else {
        this.injectPreviewModal = true
        this.selectedInject = e.event.id
      }
    },
    viewRender(view) {
      // Get start and end dates from calendar
      this.startMoment = view.view.currentStart.toISOString()
      this.endMoment = view.view.currentEnd.toISOString()

      // get data for the interval
      this.$apollo.queries.planEventsCalendar.refetch()
      this.$apollo.queries.planInjectsCalendar.refetch()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/list/main.css';
.planDash {
  justify-content: center;
  .mselPanel {
    .panel {
      box-shadow: unset;
      border-radius: 0;
    }
  }
}
</style>
