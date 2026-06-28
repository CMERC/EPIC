<template>
  <div class="container is-fullhd">
    <section class="section">
      <section class="plan-dashboard">
        <div class="dashboard-hero">
          <div>
            <p class="eyebrow">Plan workspace</p>
            <h1 class="title is-3">Exercise planning dashboard</h1>
            <p class="subtitle is-6">
              See active exercise plans, completeness, open planning work, and the next actions needed to move each plan toward execution.
            </p>
          </div>
          <div class="dashboard-actions">
            <router-link class="button is-primary"
                         :to="{name: 'exercise-details'}">
              <span class="icon is-small">
                <i class="fas fa-clipboard-list"></i>
              </span>
              <span>Open Plan Details</span>
            </router-link>
            <help-content :reference="'plan.general'"
                          toggle
                          dropdown />
          </div>
        </div>

        <div class="plan-summary-grid">
          <article v-for="plan in planCards"
                   :key="plan.id"
                   class="plan-card">
            <div class="plan-card-header">
              <div>
                <p class="eyebrow">Exercise plan</p>
                <h2 class="title is-4">{{ plan.name }}</h2>
                <p class="subtitle is-6">{{ plan.dateRange }}</p>
              </div>
              <span class="plan-status"
                    :class="plan.statusClass">{{ plan.status }}</span>
            </div>

            <div class="plan-readiness-row">
              <div class="readiness-score"
                   :class="readinessTone"
                   :style="readinessStyle">
                <span>{{ readinessScore }}%</span>
                <small>Complete</small>
              </div>
              <div class="plan-context">
                <p>{{ plan.guidance }}</p>
                <strong>{{ plan.nextAction }}</strong>
              </div>
            </div>

            <div class="plan-card-metrics">
              <router-link v-for="metric in dashboardMetrics"
                           :key="metric.key"
                           class="plan-metric"
                           :class="{'is-empty': metric.value === 0}"
                           :to="metric.to">
                <span class="metric-icon">
                  <i :class="metric.icon"></i>
                </span>
                <span>
                  <strong>{{ metric.value }}</strong>
                  <small>{{ metric.label }}</small>
                </span>
              </router-link>
            </div>

            <div class="plan-card-actions">
              <router-link class="button is-small is-primary"
                           :to="{name: 'exercise-details'}">Review Plan</router-link>
              <router-link class="button is-small is-primary is-outlined"
                           :to="{name: 'injects-list'}">Open MSEL</router-link>
              <router-link class="button is-small is-primary is-outlined"
                           :to="{name: 'overview'}">Assess</router-link>
            </div>
          </article>
        </div>

        <div class="dashboard-grid">
          <section class="dashboard-panel">
            <div class="panel-heading">
              <div>
                <p class="eyebrow">Readiness checks</p>
                <h2 class="title is-5">What needs attention</h2>
              </div>
              <span class="panel-count">{{ openReadinessChecks.length }} open</span>
            </div>

            <div class="readiness-checks">
              <router-link v-for="check in prioritizedReadinessChecks"
                           :key="check.key"
                           class="readiness-check"
                           :class="{'is-complete': check.complete}"
                           :to="check.to">
                <span class="check-status">
                  <i :class="check.complete ? 'fas fa-check' : 'fas fa-arrow-right'"></i>
                </span>
                <span>
                  <strong>{{ check.label }}</strong>
                  <small>{{ check.copy }}</small>
                </span>
              </router-link>
            </div>
          </section>

          <section class="dashboard-panel">
            <div class="panel-heading">
              <div>
                <p class="eyebrow">Lifecycle</p>
                <h2 class="title is-5">Plan sections</h2>
              </div>
            </div>

            <div class="lifecycle-list">
              <router-link v-for="phase in lifecyclePhases"
                           :key="phase.key"
                           class="lifecycle-row"
                           :to="phase.to">
                <span class="phase-icon">
                  <i :class="phase.icon"></i>
                </span>
                <span>
                  <strong>{{ phase.label }}</strong>
                  <small>{{ phase.value }} - {{ phase.copy }}</small>
                </span>
              </router-link>
            </div>
          </section>

          <section class="dashboard-panel">
            <div class="panel-heading">
              <div>
                <p class="eyebrow">Recent MSEL</p>
                <h2 class="title is-5">Latest inject work</h2>
              </div>
              <router-link class="button is-small is-primary is-outlined"
                           :to="{name: 'injects-list'}">View All</router-link>
            </div>

            <div v-if="recentInjects.length"
                 class="activity-list">
              <button v-for="inject in recentInjects"
                      :key="inject.id"
                      type="button"
                      class="activity-item"
                      @click="previewInject(inject)">
                <span class="activity-number">#{{ inject.number }}</span>
                <span>
                  <strong>{{ inject.title }}</strong>
                  <small>{{ formatDate(inject.startDate, 'dtg') }} - {{ inject.status ? inject.status.title : 'No status' }}</small>
                </span>
              </button>
            </div>
            <div v-else
                 class="empty-panel">
              <p>No MSEL injects yet.</p>
              <router-link class="button is-small is-primary"
                           :to="{name: 'planInjectNew'}">Create MSEL Inject</router-link>
            </div>
          </section>

          <section class="dashboard-panel">
            <div class="panel-heading">
              <div>
                <p class="eyebrow">Schedule</p>
                <h2 class="title is-5">Upcoming plan activity</h2>
              </div>
            </div>

            <div v-if="upcomingTimelineItems.length"
                 class="activity-list">
              <button v-for="item in upcomingTimelineItems"
                      :key="`${item.__typename}-${item.id}`"
                      type="button"
                      class="activity-item"
                      @click="openTimelineItem(item)">
                <span class="activity-number">
                  <i :class="item.__typename === 'PlanEvent' ? 'fas fa-calendar-alt' : 'fas fa-stream'"></i>
                </span>
                <span>
                  <strong>{{ item.title || item.name }}</strong>
                  <small>{{ formatDate(item.startDate || item.start, 'dtg') }}</small>
                </span>
              </button>
            </div>
            <div v-else
                 class="empty-panel">
              <p>No scheduled events or injects in the current calendar window.</p>
            </div>
          </section>
        </div>
      </section>

      <section v-if="!planCards.length"
               class="empty-plan-state">
        <div>
          <p class="eyebrow">No plan found</p>
          <h2 class="title is-4">Create the primary exercise plan to begin.</h2>
          <p class="subtitle is-6">
            Once an exercise plan exists, this page will track completeness, MSEL work, assessment readiness, and reporting progress.
          </p>
          <router-link class="button is-primary"
                       :to="{name: 'exercise-details'}">Start Plan Setup</router-link>
        </div>
      </section>

      <inject-preview :open="injectPreviewModal"
                      :id="selectedInject"
                      @close="injectCloseModal"></inject-preview>
    </section>
  </div>
</template>

<script>
import InjectPreview from '@/plan/components/inject-preview'
import HelpContent from '@/shared/components/helpcontent'
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
import { PlanParticipantsCounts } from '@/plan/graphql/PlanParticipants.gql'
import { PlanTrainingObjectiveCounts } from '@/plan/graphql/PlanTrainingObjectives.gql'
import { PlanAssessmentsCounts } from '@/plan/graphql/PlanAssessments.gql'
import { PlanFeedbacksCounts } from '@/plan/graphql/PlanFeedback.gql'
import { PlanFeedbackRequestsCounts } from '@/plan/graphql/PlanFeedbackRequests.gql'
import { PlanCustomReportsCounts } from '@/plan/graphql/PlanCustomReports.gql'
import lightOrDark from '@/shared/mixins/lightOrDark'
import helpers from '@/shared/mixins/helpers'

export default {
  name: 'PlanView',
  mixins: [helpers, lightOrDark],
  components: {
    HelpContent,
    InjectPreview
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
    },
    planParticipantCount: {
      query: PlanParticipantsCounts,
      variables: {},
      update(data) {
        if (data && data.planParticipantsConnection) {
          return data.planParticipantsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planTrainingObjectiveCount: {
      query: PlanTrainingObjectiveCounts,
      variables: {},
      update(data) {
        if (data && data.planTrainingObjectivesConnection) {
          return data.planTrainingObjectivesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planAssessmentCount: {
      query: PlanAssessmentsCounts,
      variables: {},
      update(data) {
        if (data && data.planAssessmentsConnection) {
          return data.planAssessmentsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planFeedbackCount: {
      query: PlanFeedbacksCounts,
      variables: {},
      update(data) {
        if (data && data.planFeedbacksConnection) {
          return data.planFeedbacksConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planFeedbackRequestCount: {
      query: PlanFeedbackRequestsCounts,
      variables: {},
      update(data) {
        if (data && data.planFeedbackRequestsConnection) {
          return data.planFeedbackRequestsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planCustomReportCount: {
      query: PlanCustomReportsCounts,
      variables: {},
      update(data) {
        if (data && data.planCustomReportsConnection) {
          return data.planCustomReportsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      searchQuery: '',
      injectPreviewModal: false,
      selectedInject: null,
      requestedFilter: '',
      exType: 'primary',
      planEventsCalendar: [],
      planInjectsCalendar: [],
      planEvents: [],
      planParticipantCount: 0,
      planTrainingObjectiveCount: 0,
      planAssessmentCount: 0,
      planFeedbackCount: 0,
      planFeedbackRequestCount: 0,
      planCustomReportCount: 0,
      currentExercise: {
        name: '',
        command: null,
        startDate: null,
        endDate: null,
        exerciseGuidance: ''
      },
      startMoment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endMoment: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
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
    planCards() {
      const plans = this.planEvents && this.planEvents.length
        ? this.planEvents
        : this.currentExercise && this.currentExercise.name
          ? [this.currentExercise]
          : []

      return plans.map(plan => {
        const status = this.planStatus(plan)
        const next = this.openReadinessChecks[0]
        return {
          id: plan.id || 'current-exercise',
          name: plan.name || 'Untitled exercise plan',
          dateRange: this.planDateRange(plan),
          guidance: plan.exerciseGuidance
            ? this.truncate(plan.exerciseGuidance, 180)
            : 'No command guidance has been captured for this plan yet.',
          status: status.label,
          statusClass: status.className,
          nextAction: next
            ? `Next action: ${next.label}`
            : 'All tracked readiness checks are complete.'
        }
      })
    },
    dashboardMetrics() {
      return [
        {
          key: 'exercise-objectives',
          label: 'exercise objectives',
          value: this.countText(this.planExerciseObjectiveCount),
          icon: 'fas fa-flag-checkered',
          to: { name: 'exercise-stepper', query: { step: 2 } }
        },
        {
          key: 'participants',
          label: 'participants',
          value: this.countText(this.planParticipantCount),
          icon: 'fas fa-users',
          to: { name: 'participants' }
        },
        {
          key: 'training-objectives',
          label: 'training objectives',
          value: this.countText(this.planTrainingObjectiveCount),
          icon: 'fas fa-bullseye',
          to: { name: 'objectives-list' }
        },
        {
          key: 'injects',
          label: 'MSEL injects',
          value: this.countText(this.planInjectsCount),
          icon: 'fas fa-stream',
          to: { name: 'injects-list' }
        },
        {
          key: 'assessments',
          label: 'assessments',
          value: this.countText(this.planAssessmentCount),
          icon: 'fas fa-clipboard-check',
          to: { name: 'overview' }
        },
        {
          key: 'feedback',
          label: 'feedback records',
          value: this.countText(this.planFeedbackCount),
          icon: 'fas fa-comments',
          to: { name: 'feedbacks' }
        },
        {
          key: 'reports',
          label: 'reports',
          value: this.countText(this.planCustomReportCount),
          icon: 'fas fa-chart-bar',
          to: { name: 'reportsList' }
        }
      ]
    },
    openReadinessChecks() {
      return this.readinessChecks.filter(check => !check.complete)
    },
    prioritizedReadinessChecks() {
      const open = this.openReadinessChecks
      return open.length ? open : this.readinessChecks.slice(0, 4)
    },
    recentInjects() {
      return (this.planInjects || []).slice(0, 5)
    },
    upcomingTimelineItems() {
      return (this.filteredCalendar || [])
        .filter(item => item.startDate || item.start)
        .slice()
        .sort((a, b) => {
          const aDate = new Date(a.startDate || a.start).getTime()
          const bDate = new Date(b.startDate || b.start).getTime()
          return aDate - bDate
        })
        .slice(0, 6)
    },
    filteredCalendar() {
      if (this.planEventsCalendar && this.planInjectsCalendar) {
        return [...this.planEventsCalendar, ...this.planInjectsCalendar]
      }
      return []
    },
    lifecyclePhases() {
      return [
        {
          key: 'design',
          label: 'Design',
          value: `${this.countText(this.planExerciseObjectiveCount)} objectives`,
          copy: 'Senior intent, exercise objectives, and planning structure.',
          icon: 'fas fa-drafting-compass',
          to: { name: 'exercise-details' }
        },
        {
          key: 'audience',
          label: 'Audience',
          value: `${this.countText(this.planParticipantCount)} participants`,
          copy: 'Training audience, platforms, planners, and funding data.',
          icon: 'fas fa-users',
          to: { name: 'participants' }
        },
        {
          key: 'objectives',
          label: 'Training',
          value: `${this.countText(this.planTrainingObjectiveCount)} TOs`,
          copy: 'JMET-linked tasks, conditions, standards, and measures.',
          icon: 'fas fa-bullseye',
          to: { name: 'objectives-list' }
        },
        {
          key: 'msel',
          label: 'MSEL',
          value: `${this.countText(this.planInjectsCount)} injects`,
          copy: 'Scenario events and injects that drive exercise play.',
          icon: 'fas fa-stream',
          to: { name: 'injects-list' }
        },
        {
          key: 'evaluate',
          label: 'Evaluate',
          value: `${this.countText(this.planAssessmentCount)} assessments`,
          copy: 'Evaluator observations, ratings, measures, and evidence.',
          icon: 'fas fa-clipboard-check',
          to: { name: 'overview' }
        },
        {
          key: 'improve',
          label: 'Improve',
          value: `${this.countText(this.planFeedbackCount)} feedback items`,
          copy: 'Feedback, lessons learned, reports, and future actions.',
          icon: 'fas fa-chart-line',
          to: { name: 'feedbacks' }
        }
      ]
    },
    readinessChecks() {
      return [
        {
          key: 'exercise',
          label: 'Define exercise dates and guidance',
          copy: this.currentExercise && this.currentExercise.startDate && this.currentExercise.endDate
            ? 'STARTEX, ENDEX, and exercise guidance are present.'
            : 'Add STARTEX, ENDEX, primary organization, and command guidance.',
          complete: Boolean(this.currentExercise && this.currentExercise.startDate && this.currentExercise.endDate),
          to: { name: 'exercise-details' }
        },
        {
          key: 'objectives',
          label: 'Create exercise objectives',
          copy: this.planExerciseObjectiveCount
            ? `${this.planExerciseObjectiveCount} exercise objectives are available.`
            : 'Capture commander priorities and measurable exercise objectives.',
          complete: this.planExerciseObjectiveCount > 0,
          to: { name: 'exercise-stepper', query: { step: 2 } }
        },
        {
          key: 'participants',
          label: 'Add participants and training audience',
          copy: this.planParticipantCount
            ? `${this.planParticipantCount} participants are in the exercise.`
            : 'Add organizations, platforms, planners, and audience counts.',
          complete: this.planParticipantCount > 0,
          to: { name: 'participants' }
        },
        {
          key: 'training-objectives',
          label: 'Map training objectives to JMETs',
          copy: this.planTrainingObjectiveCount
            ? `${this.planTrainingObjectiveCount} training objectives are mapped.`
            : 'Connect participants to JMETs, tasks, conditions, standards, and measures.',
          complete: this.planTrainingObjectiveCount > 0,
          to: { name: 'objectives-list' }
        },
        {
          key: 'msel',
          label: 'Build MSEL inject coverage',
          copy: this.planInjectsCount
            ? `${this.planInjectsCount} MSEL injects are ready for review.`
            : 'Create injects, events, methods, owners, expected responses, and timings.',
          complete: this.planInjectsCount > 0,
          to: { name: 'injects-list' }
        },
        {
          key: 'assessment',
          label: 'Prepare evaluation collection',
          copy: this.planAssessmentCount
            ? `${this.planAssessmentCount} assessments have been created.`
            : 'Create evaluator assessments tied to objectives and measures.',
          complete: this.planAssessmentCount > 0,
          to: { name: 'overview' }
        },
        {
          key: 'feedback',
          label: 'Set up feedback and hot wash capture',
          copy: this.planFeedbackRequestCount || this.planFeedbackCount
            ? `${this.planFeedbackRequestCount} requests and ${this.planFeedbackCount} feedback records exist.`
            : 'Request feedback and prepare lessons-learned collection.',
          complete: this.planFeedbackRequestCount > 0 || this.planFeedbackCount > 0,
          to: { name: 'collect' }
        },
        {
          key: 'reports',
          label: 'Create report or AAR workspace',
          copy: this.planCustomReportCount
            ? `${this.planCustomReportCount} custom report windows are configured.`
            : 'Create a report window for analytics, AAR, and export products.',
          complete: this.planCustomReportCount > 0,
          to: { name: 'reportsList' }
        }
      ]
    },
    readinessScore() {
      if (!this.readinessChecks.length) return 0
      const complete = this.readinessChecks.filter(check => check.complete).length
      return Math.round((complete / this.readinessChecks.length) * 100)
    },
    readinessTone() {
      if (this.readinessScore >= 75) return 'is-strong'
      if (this.readinessScore >= 45) return 'is-building'
      return 'is-starting'
    },
    readinessStyle() {
      return {
        '--score': this.readinessScore
      }
    }
  },
  methods: {
    countText(value) {
      return Number.isFinite(Number(value)) ? Number(value) : 0
    },
    planDateRange(plan) {
      if (plan && plan.startDate && plan.endDate) {
        return `${this.formatDate(plan.startDate, 'dtg')} to ${this.formatDate(plan.endDate, 'dtg')}`
      }
      if (plan && plan.startDate) {
        return `Starts ${this.formatDate(plan.startDate, 'dtg')}`
      }
      if (plan && plan.endDate) {
        return `Ends ${this.formatDate(plan.endDate, 'dtg')}`
      }
      return 'Schedule not set'
    },
    planStatus(plan) {
      if (this.readinessScore >= 85) {
        return { label: 'Ready', className: 'is-ready' }
      }
      if (plan && plan.startDate && new Date(plan.startDate) <= new Date()) {
        return { label: 'In Progress', className: 'is-active' }
      }
      if (this.readinessScore >= 45) {
        return { label: 'Building', className: 'is-building' }
      }
      return { label: 'Draft', className: 'is-draft' }
    },
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
    openTimelineItem(item) {
      if (!item) return
      if (item.__typename === 'PlanEvent') {
        if (item.type === 'primary') {
          this.$router.push({ name: 'exercise-details' })
        } else {
          this.$router.push({
            name: 'view-event',
            params: { id: item.id }
          })
        }
      } else {
        this.injectPreviewModal = true
        this.selectedInject = item.id
      }
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
.plan-dashboard {
  display: grid;
  gap: 1rem;
}

.dashboard-hero,
.plan-card,
.dashboard-panel,
.empty-plan-state {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(246, 249, 252, 0.92)),
    rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(151, 167, 184, 0.24);
  border-radius: 8px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
}

.dashboard-hero .title,
.plan-card .title,
.dashboard-panel .title,
.empty-plan-state .title {
  line-height: 1.14;
  overflow-wrap: anywhere;
}

.dashboard-hero .title + .subtitle,
.plan-card-header .title + .subtitle,
.empty-plan-state .title + .subtitle {
  margin-top: 0;
}

.dashboard-hero {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1.25rem;

  .title {
    margin-bottom: 0.35rem;
    max-width: 48rem;
  }

  .subtitle {
    color: #5d6b7c;
    margin-bottom: 0;
    max-width: 58rem;
  }
}

.dashboard-actions,
.plan-card-actions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  flex: 0 0 auto;
  gap: 0.55rem;
}

.eyebrow {
  color: #1f7a8c;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
}

.plan-summary-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr);
}

.plan-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.plan-card-header,
.plan-readiness-row,
.panel-heading {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.plan-card-header .title,
.plan-card-header .subtitle,
.panel-heading .title {
  margin-bottom: 0;
}

.plan-card-header > div,
.panel-heading > div,
.dashboard-hero > div:first-child {
  min-width: 0;
}

.plan-status,
.panel-count {
  align-items: center;
  border: 1px solid rgba(151, 167, 184, 0.24);
  border-radius: 999px;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 0.74rem;
  font-weight: 800;
  min-height: 30px;
  padding: 0.3rem 0.7rem;
  text-transform: uppercase;
}

.plan-status.is-ready {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: #047857;
}

.plan-status.is-active,
.plan-status.is-building {
  background: rgba(245, 158, 11, 0.14);
  border-color: rgba(245, 158, 11, 0.34);
  color: #b45309;
}

.plan-status.is-draft {
  background: rgba(100, 116, 139, 0.1);
  color: #475569;
}

.readiness-score {
  align-items: center;
  background: conic-gradient(#1f7a8c calc(var(--score, 0) * 1%), rgba(226, 232, 240, 0.88) 0);
  border: 1px solid rgba(31, 122, 140, 0.18);
  border-radius: 50%;
  box-shadow: inset 0 0 0 0.65rem #ffffff;
  color: #17324d;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  height: 6.25rem;
  justify-content: center;
  width: 6.25rem;

  span {
    font-size: 1.45rem;
    font-weight: 900;
    line-height: 1;
  }

  small {
    color: #64748b;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  &.is-starting {
    background: conic-gradient(#c2410c calc(var(--score, 0) * 1%), rgba(226, 232, 240, 0.88) 0);
  }

  &.is-building {
    background: conic-gradient(#b7791f calc(var(--score, 0) * 1%), rgba(226, 232, 240, 0.88) 0);
  }

  &.is-strong {
    background: conic-gradient(#038172 calc(var(--score, 0) * 1%), rgba(226, 232, 240, 0.88) 0);
  }
}

.plan-context {
  flex: 1 1 auto;

  p {
    color: #526174;
    margin-bottom: 0.35rem;
  }

  strong {
    color: #172033;
  }
}

.plan-card-metrics,
.dashboard-grid {
  display: grid;
  gap: 0.85rem;
}

.plan-card-metrics {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.dashboard-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.plan-metric,
.lifecycle-row,
.activity-item,
.readiness-check {
  align-items: center;
  background: rgba(248, 250, 252, 0.72);
  border: 1px solid rgba(151, 167, 184, 0.2);
  border-radius: 8px;
  color: inherit;
  display: flex;
  gap: 0.65rem;
  padding: 0.75rem;
  text-align: left;
  width: 100%;

  &:hover,
  &:focus {
    border-color: rgba(31, 122, 140, 0.32);
    color: inherit;
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: #1f2937;
    font-size: 0.92rem;
  }

  small {
    color: #64748b;
    line-height: 1.35;
  }
}

.plan-metric.is-empty {
  opacity: 0.72;
}

.metric-icon,
.phase-icon,
.check-status,
.activity-number {
  align-items: center;
  border-radius: 8px;
  display: inline-flex;
  flex: 0 0 auto;
  height: 2.25rem;
  justify-content: center;
  width: 2.25rem;
}

.metric-icon,
.phase-icon {
  background: rgba(31, 122, 140, 0.1);
  color: #1f7a8c;
}

.dashboard-panel {
  padding: 1rem;
}

.panel-heading {
  margin-bottom: 0.75rem;
}

.panel-count {
  background: rgba(31, 122, 140, 0.1);
  color: #1f7a8c;
}

.readiness-checks,
.lifecycle-list,
.activity-list {
  display: grid;
  gap: 0.55rem;
}

.readiness-check {
  align-items: flex-start;
}

.readiness-check.is-complete .check-status {
  background: rgba(3, 129, 114, 0.12);
  color: #038172;
}

.check-status {
  background: rgba(183, 121, 31, 0.14);
  border-radius: 999px;
  color: #b7791f;
  font-size: 0.72rem;
  height: 1.75rem;
  width: 1.75rem;
}

.activity-item {
  cursor: pointer;
}

.activity-number {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  font-size: 0.8rem;
  font-weight: 900;
}

.empty-panel,
.empty-plan-state {
  color: #64748b;
  padding: 1rem;
}

.empty-panel p {
  margin-bottom: 0.75rem;
}

.empty-plan-state {
  margin-top: 1rem;
  text-align: center;
}

.theme-dark .dashboard-hero,
.theme-dark .plan-card,
.theme-dark .dashboard-panel,
.theme-dark .empty-plan-state {
  background:
    linear-gradient(135deg, rgba(31, 41, 55, 0.96), rgba(23, 32, 51, 0.94)),
    #172033;
  border-color: #3b4658;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
}

.theme-dark .dashboard-hero .subtitle,
.theme-dark .plan-context p,
.theme-dark .plan-metric small,
.theme-dark .lifecycle-row small,
.theme-dark .activity-item small,
.theme-dark .readiness-check small,
.theme-dark .empty-panel,
.theme-dark .empty-plan-state {
  color: #b7c2d0;
}

.theme-dark .dashboard-hero .title,
.theme-dark .plan-card .title,
.theme-dark .dashboard-panel .title,
.theme-dark .empty-plan-state .title,
.theme-dark .plan-context strong,
.theme-dark .plan-metric strong,
.theme-dark .lifecycle-row strong,
.theme-dark .activity-item strong,
.theme-dark .readiness-check strong {
  color: #edf2f7;
}

.theme-dark .plan-metric,
.theme-dark .lifecycle-row,
.theme-dark .activity-item,
.theme-dark .readiness-check {
  background: #1f2937;
  border-color: #3b4658;
}

.theme-dark .plan-metric:hover,
.theme-dark .plan-metric:focus,
.theme-dark .lifecycle-row:hover,
.theme-dark .lifecycle-row:focus,
.theme-dark .activity-item:hover,
.theme-dark .activity-item:focus,
.theme-dark .readiness-check:hover,
.theme-dark .readiness-check:focus {
  background: #263447;
  border-color: #536277;
}

.theme-dark .readiness-score {
  box-shadow: inset 0 0 0 0.65rem #172033;
  color: #edf2f7;
}

.theme-dark .readiness-score small {
  color: #b7c2d0;
}

@media screen and (max-width: 1023px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-hero,
  .plan-card-header,
  .plan-readiness-row,
  .panel-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

