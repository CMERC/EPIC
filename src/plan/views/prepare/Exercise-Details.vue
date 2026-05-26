<template>
  <div class="is-relative-mobile exercise-details">
    <breadcrumb />
    <div v-if="planEvents">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title">
              {{planEvents.name}} Exercise Details
            </h1>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-dropdown position="is-bottom-left">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="editExerciseName()">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Exercise Name</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="level-item">
            <help-content :reference="'plan.prepare.exercisedetails'"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <div class="field">
        <p class="control">
          <span class="tooltip is-6 has-text-weight-bold"
                :data-tooltip="formatDate(planEvents.startDate, 'utc-dtg')">{{formatDate(planEvents.startDate, 'milDate') }}</span> -
          <span class="tooltip is-6 has-text-weight-bold"
                :data-tooltip="formatDate(planEvents.endDate, 'utc-dtg')">{{formatDate(planEvents.endDate, 'milDate') }}</span>
        </p>
        <p class="control">
          <span class="is-6 has-text-weight-bold"
                v-if="planEvents.organization && planEvents.organization.name">{{planEvents.organization.name}}</span>
          <span class="is-6 has-text-weight-bold"
                v-if="planEvents.organization && planEvents.organization.group"> - {{planEvents.organization.group}}</span>
        </p>
      </div>
      <b-tabs>
        <b-tab-item label="Guidance & Objectives">
          <div class="card">
            <div class="card-content">
              <nav class="level">
                <div class="level-left">
                  <div class="level-item">
                    <a class="button is-primary"
                       @click="editExercise(0)">
                      <span>Edit Guidance</span>
                    </a>
                  </div>
                  <div class="level-item">
                    <a class="button is-primary"
                       @click="editExercise(3)">
                      <span>Edit Objectives</span>
                    </a>
                  </div>
                </div>
              </nav>
              <div v-if="planEvents.exerciseGuidance">
                <label class="label">
                  Commander's Guidance
                </label>
                <p>{{planEvents.exerciseGuidance}}</p>
              </div>
              <div v-else
                   class="noResult">
                <div class="content">
                  <div class="card-content">
                    <div class="card-header-title is-centered">
                      <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                    </div>
                    <p class="title has-text-centered">
                      No Commanders Guidance
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="planExerciseObjectives && planExerciseObjectives.length > 0">
                <b-table :data="planExerciseObjectives"
                         paginated
                         :per-page="perPage"
                         :current-page.sync="currentPage"
                         :pagination-simple="isPaginationSimple"
                         :default-sort-direction="defaultSortDirection"
                         detailed
                         detail-key="id"
                         default-sort="title">
                  <template slot-scope="props">
                    <b-table-column field="title"
                                    label="Exercise Objective"
                                    class="is-size-6"
                                    sortable>
                      {{ props.row.title ? props.row.title : "None" }}
                    </b-table-column>
                  </template>
                  <template slot="detail"
                            slot-scope="props">
                    <article class="media">
                      <div class="media-content">
                        <div class="columns is-multiline is-mobile is-centered">
                          <div class="column is-full">
                            <label class="label">
                              Objective
                            </label>
                            <div class="control">
                              {{ props.row.exerciseObjective ? props.row.exerciseObjective : "None" }}
                            </div>
                          </div>
                          <div class="column is-full">
                            <label class="label">
                              Measure of Performance
                            </label>
                            <div class="control">
                              {{ props.row.measurePerformance ? props.row.measurePerformance : "None" }}
                            </div>
                          </div>
                          <div class="column is-full">
                            <label class="label">
                              Measure of Effectiveness
                            </label>
                            <div class="control">
                              {{props.row.measureEffectiveness ? props.row.measureEffectiveness : "None" }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </template>
                </b-table>
              </div>
              <div v-else
                   class="noResult">
                <div class="content">
                  <div class="card-content">
                    <div class="card-header-title is-centered">
                      <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                    </div>
                    <p class="title has-text-centered">
                      No Exercise Objectives
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item label="Planning Meetings">
          <div class="card">
            <div class="card-content">
              <nav class="level">
                <div class="level-left">
                  <div class="level-item">
                    <a class="button is-primary"
                       @click="editExercise(1)">
                      <span>Edit Meetings</span>
                    </a>
                  </div>
                </div>
              </nav>
              <full-calendar :events="planMeetings"
                             v-bind="calendarOptions"
                             @eventClick="showMeetingPreview"
                             @eventDrop="eventDrop"
                             :datesRender="viewRender">
              </full-calendar>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item label="Funding Sources">
          <div class="card">
            <div class="card-content">
              <nav class="level">
                <div class="level-left">
                  <div class="level-item">
                    <a class="button is-primary"
                       @click="editExercise(2)">
                      <span>Edit Funding Sources</span>
                    </a>
                  </div>
                </div>
              </nav>
              <div v-if="planFundingSources && planFundingSources.length > 0">
                <b-table :data="planFundingSources"
                         paginated
                         :per-page="perPage"
                         :current-page.sync="currentPage"
                         :pagination-simple="isPaginationSimple"
                         :default-sort-direction="defaultSortDirection"
                         default-sort="primarySource">
                  <template slot-scope="props">
                    <b-table-column field="primarySource"
                                    label="Primary Source"
                                    class="is-size-6"
                                    centered
                                    sortable>
                      {{ props.row.primarySource ? props.row.primarySource : "None" }}
                    </b-table-column>
                    <b-table-column field="subSource"
                                    label="Sub-source"
                                    class="is-size-6"
                                    centered
                                    sortable>
                      {{ props.row.subSource ? props.row.subSource : "None" }}
                    </b-table-column>
                    <b-table-column field="amount"
                                    label="Amount"
                                    class="is-size-6 has-icons-left"
                                    numeric
                                    centered
                                    sortable>
                      {{ formatNumber(props.row.amount, 'currency') }}
                    </b-table-column>
                  </template>
                  <template slot="bottom-left">
                    <b>Total Funding: {{formatNumber(fundingTotal, 'currency')}} </b>
                  </template>
                </b-table>
              </div>
              <div v-else
                   class="noResult">
                <div class="content">
                  <div class="card-content">
                    <div class="card-header-title is-centered">
                      <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                    </div>
                    <p class="title has-text-centered">
                      No Funding Sources
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item label="Tasks & Priorities">
          <div class="card">
            <div class="card-content">

              <nav class="level">
                <div class="level-left">
                  <div class="level-item">
                    <a class="button is-primary"
                       @click="editExercise(4)">
                      <span>Edit Tasks & Priorities</span>
                    </a>
                  </div>
                </div>
              </nav>

              <div v-if="planAccreditedTasks && planAccreditedTasks.length > 0">
                <label class="label">
                  Accredited Tasks
                </label>
                <b-table :data="planAccreditedTasks"
                         paginated
                         :per-page="perPage"
                         :current-page.sync="currentPage"
                         :pagination-simple="isPaginationSimple"
                         :default-sort-direction="defaultSortDirection"
                         detailed
                         detail-key="id"
                         default-sort="jmet.levelWar">
                  <template slot-scope="props">
                    <b-table-column field="jmet.levelWar"
                                    label="Level"
                                    class="is-size-6"
                                    sortable>
                      {{ props.row.jmet.levelWar ? props.row.jmet.levelWar : "None" }}
                    </b-table-column>
                    <b-table-column field="jmet.taskNumber"
                                    label="Number"
                                    class="is-size-6"
                                    sortable>
                      {{ props.row.jmet.taskNumber ? props.row.jmet.taskNumber : "None" }}
                    </b-table-column>
                    <b-table-column field="jmet.taskTitle"
                                    label="Title"
                                    class="is-size-6"
                                    sortable>
                      {{ props.row.jmet.taskTitle ? props.row.jmet.taskTitle : "None" }}
                    </b-table-column>
                  </template>
                  <template slot="detail"
                            slot-scope="props">
                    <article class="media">
                      <div class="media-content">
                        <div class="columns is-multiline is-mobile">
                          <div class="column is-full">
                            <p class="is-size-6">{{props.row.jmet.levelWar}} {{props.row.jmet.taskNumber}} {{props.row.jmet.taskTitle}}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </template>
                </b-table>
              </div>
              <div v-else
                   class="noResult">
                <div class="content">
                  <div class="card-content">
                    <div class="card-header-title is-centered">
                      <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                    </div>
                    <p class="title has-text-centered">
                      No Accredited Tasks
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="planCommandPriorities && planCommandPriorities.length > 0">
                <label class="label">
                  Command Training Priorities
                </label>
                <b-table :data="planCommandPriorities"
                         paginated
                         :per-page="perPage"
                         :current-page.sync="currentPage"
                         :pagination-simple="isPaginationSimple"
                         :default-sort-direction="defaultSortDirection"
                         detailed
                         detail-key="id"
                         default-sort="title">
                  <template slot-scope="props">
                    <b-table-column field="title"
                                    label="Title"
                                    class="is-size-6"
                                    sortable>
                      {{ props.row.title ? props.row.title : "None" }}
                    </b-table-column>
                  </template>
                  <template slot="detail"
                            slot-scope="props">
                    <article class="media">
                      <div class="media-content">
                        <div class="columns is-multiline is-mobile is-centered">
                          <div class="column is-full">
                            <label class="label">
                              Description
                            </label>
                            <div class="control">
                              {{ props.row.description ? props.row.description : "None" }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </template>
                </b-table>
              </div>
              <div v-else
                   class="noResult">
                <div class="content">
                  <div class="card-content">
                    <div class="card-header-title is-centered">
                      <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                    </div>
                    <p class="title has-text-centered">
                      No Command Priorities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>
      </b-tabs>
    </div>
    <div v-else>
      <empty-state :data="planEvents"
                   :isLoading='$apollo.loading'>
        <template slot="action-buttons">
          <div class="buttons is-centered is-spaced">
            <a class="button is-primary"
               @click="editExercise(0)">
              <span>Enter Details</span>
            </a>
          </div>
        </template>
      </empty-state>
    </div>
    <exercise-interaction :open="open"
                          :exercise="selectedExercise"
                          @close="close"/>
    <meeting-preview v-if="openMeetingPreview"
                     :open="openMeetingPreview"
                     :id="selectedMeeting"
                     @close="closeMeetingPreview" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'

import ExerciseInteraction from '@/plan/components/exercise-interaction'
import MeetingPreview from '@/plan/components/meeting-preview'
import HelpContent from '@/shared/components/helpcontent'

import helpers from '@/shared/mixins/helpers'
import processVal from '@/shared/mixins/processVal'
import PlanEvent from '@/plan/model/planevent'

import {
  PlanFundingSourcesRead,
  PlanFundingSourceSubscription
} from '@/plan/graphql/PlanFundingSources.gql'
import { PlanJmetsRead } from '@/plan/graphql/PlanJmets.gql'
import { PlanOrganizationsRead } from '@/plan/graphql/PlanOrganizations.gql'
import {
  PlanMeetingsUpdate,
  PlanMeetingsCalendarRead,
  PlanMeetingCalendarSubscription
} from '@/plan/graphql/PlanMeetings.gql'
import {
  PlanExerciseObjectivesRead,
  PlanExerciseObjectiveSubscription
} from '@/plan/graphql/PlanExerciseObjectives.gql'
import {
  PlanEventsRead,
  PlanEventSubscription
} from '@/plan/graphql/PlanEvents.gql'
import {
  PlanAccreditedTasksRead,
  PlanAccreditedTaskSubscription
} from '@/plan/graphql/PlanAccreditedTasks.gql'
import {
  PlanCommandPrioritiesRead,
  PlanCommandPrioritySubscription
} from '@/plan/graphql/PlanCommandPriorities.gql'

export default {
  name: 'Exercise-Details',
  props: {
    exercise: {
      type: Object,
      default: function() {
        return new PlanEvent()
      }
    }
  },
  mixins: [helpers, processVal],
  components: {
    MeetingPreview,
    ExerciseInteraction,
    HelpContent,
    FullCalendar
  },
  apollo: {
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
    planMeetings: {
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
    planExerciseObjectives: {
      query: PlanExerciseObjectivesRead,
      update(data) {
        if (
          data &&
          data.planExerciseObjectives &&
          data.planExerciseObjectives.length > 0
        ) {
          return data.planExerciseObjectives
        }
      },
      subscribeToMore: {
        document: PlanExerciseObjectiveSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planExerciseObjective.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planExerciseObjectives: [
                  subscriptionData.data.planExerciseObjective.node,
                  ...previousResult.planExerciseObjectives
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planExerciseObjectives: [
                  ...previousResult.planExerciseObjectives.filter(
                    obj =>
                      subscriptionData.data.planExerciseObjective.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanExerciseObjectives = JSON.parse(
                JSON.stringify(previousResult.planExerciseObjectives)
              )
              let index = newPlanExerciseObjectives.findIndex(
                x =>
                  x.id === subscriptionData.data.planExerciseObjective.node.id
              )
              newPlanExerciseObjectives[index] =
                subscriptionData.data.planExerciseObjective.node
              newResult = {
                planExerciseObjectives: newPlanExerciseObjectives
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
    planAccreditedTasks: {
      query: PlanAccreditedTasksRead,
      update(data) {
        if (
          data &&
          data.planAccreditedTasks &&
          data.planAccreditedTasks.length > 0
        ) {
          return data.planAccreditedTasks
        }
      },
      subscribeToMore: {
        document: PlanAccreditedTaskSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planAccreditedTask.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planAccreditedTasks: [
                  subscriptionData.data.planAccreditedTask.node,
                  ...previousResult.planAccreditedTasks
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planAccreditedTasks: [
                  ...previousResult.planAccreditedTasks.filter(
                    obj =>
                      subscriptionData.data.planAccreditedTask.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanAccreditedTasks = JSON.parse(
                JSON.stringify(previousResult.planAccreditedTasks)
              )
              let index = newPlanAccreditedTasks.findIndex(
                x => x.id === subscriptionData.data.planAccreditedTask.node.id
              )
              newPlanAccreditedTasks[index] =
                subscriptionData.data.planAccreditedTask.node
              newResult = {
                planAccreditedTasks: newPlanAccreditedTasks
              }
              break
            }
            default: {
              throw new Error(`Unknown Accredited Task mutation`)
            }
          }
          return newResult
        }
      }
    },
    planCommandPriorities: {
      query: PlanCommandPrioritiesRead,
      update(data) {
        if (
          data &&
          data.planCommandPriorities &&
          data.planCommandPriorities.length > 0
        ) {
          return data.planCommandPriorities
        }
      },
      subscribeToMore: {
        document: PlanCommandPrioritySubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planCommandPriority.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planCommandPriorities: [
                  subscriptionData.data.planCommandPriority.node,
                  ...previousResult.planCommandPriorities
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planCommandPriorities: [
                  ...previousResult.planCommandPriorities.filter(
                    obj =>
                      subscriptionData.data.planCommandPriority.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanCommandPriorities = JSON.parse(
                JSON.stringify(previousResult.planCommandPriorities)
              )
              let index = newPlanCommandPriorities.findIndex(
                x => x.id === subscriptionData.data.planCommandPriority.node.id
              )
              newPlanCommandPriorities[index] =
                subscriptionData.data.planCommandPriority.node
              newResult = {
                planCommandPriorities: newPlanCommandPriorities
              }
              break
            }
            default: {
              throw new Error(`Unknown Command Priority mutation`)
            }
          }
          return newResult
        }
      }
    },
    planEvents: {
      query: PlanEventsRead,
      variables() {
        return {
          where: {
            type: this.exType
          }
        }
      },
      update(data) {
        if (data && data.planEvents && data.planEvents.length > 0) {
          return data.planEvents[0]
        }
      },
      subscribeToMore: {
        document: PlanEventSubscription,
        variables() {
          return {
            where: {
              node: { type: this.exType }
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
              throw new Error(`Unknown Plan Event mutation`)
            }
          }
          return newResult
        }
      }
    },
    planJmets: {
      query: PlanJmetsRead,
      update(data) {
        if (data && data.planJmets && data.planJmets.length > 0) {
          return data.planJmets
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planOrganizations: {
      query: PlanOrganizationsRead,
      update(data) {
        if (
          data &&
          data.planOrganizations &&
          data.planOrganizations.length > 0
        ) {
          return data.planOrganizations
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
      openMeetingPreview: false,
      selectedMeeting: '',
      startMoment: null,
      endMoment: null,
      selectedExercise: null,
      open: false,
      planExerciseObjectives: [],
      planMeetings: [],
      planFundingSources: [],
      planCommandPriorities: [],
      planAccreditedTasks: [],
      planOrganizations: [],
      planJmets: [],
      exType: 'primary',
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 15
    }
  },
  computed: {
    fundingTotal() {
      let sum = 0
      if (this.planFundingSources && this.planFundingSources.length > 0) {
        sum = this.planFundingSources.reduce((accumulator, currentFunding) => {
          return accumulator + currentFunding.amount
        }, 0)
      }
      return sum
    }
  },
  methods: {
    editExercise(step) {
      this.$router.push({
        name: 'exercise-stepper',
        query: { from: this.$route.fullPath, step: step }
      })
    },
    close() {
      this.selectedExercise = null
      this.open = false
    },
    editExerciseName() {
      this.selectedExercise = this.planEvents
      this.open = true
    },
    showMeetingPreview(event) {
      this.openMeetingPreview = true
      this.selectedMeeting = event.event.id
    },
    closeMeetingPreview() {
      this.openMeetingPreview = false
      this.selectedMeeting = ''
    },
    eventDrop(event, delta, revertFunc) {
      this.$buefy.dialog.confirm({
        title: 'Move Planning Meeting',
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
          mutation: PlanMeetingsUpdate,
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
          console.error('Plan Meeting Calendar Update: ' + error)
        })
    },
    viewRender(view) {
      // Get start and end dates from calendar
      this.startMoment = view.view.currentStart.toISOString()
      this.endMoment = view.view.currentEnd.toISOString()

      // get data for the interval
    }
  }
}
</script>

<style lang="scss" scoped>
.exercise-details {
  h1.title,
  .noResult .title {
    font-size: clamp(1rem, 2.5vw, 2rem);
  }
  .b-tabs .tab-content {
    padding: 1rem;
  }
  .card-content {
    padding: 1rem;
  }
  .card {
    .tasks-priorities-section {
      .card-header {
        background-color: #038172;
      }
      .card-header-title {
        color: #ffffff;
      }
    }
    .objective-section {
      .card-header {
        background-color: #038172;
      }
      .card-header-title {
        color: #ffffff;
      }
    }
    .meeting-section {
      .card-header {
        background-color: #038172;
      }
      .card-header-title {
        color: #ffffff;
      }
    }
  }
}
@media screen and (max-width: 1024px - 1px) {
  .modal-card-foot {
    flex-wrap: wrap;
    & * {
      margin-bottom: 0.75rem;
    }
  }
}
</style>
