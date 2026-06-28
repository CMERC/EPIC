<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
      </div>
      <div class="level-right">
        <div class="level-item"
             v-if="planEvents">
          <div class="select">
            <select v-model="eventID">
              <option value="">
                All Events
              </option>
              <option disabled>
                ──────────
              </option>
              <option v-for="event in planEvents"
                      v-bind:key="event.id"
                      :value="event.id">
                {{truncate(event.name, 25)}}
              </option>
            </select>
          </div>
        </div>
        <div class="level-item">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input class="input is-rounded is-primary"
                     type="text"
                     placeholder="Search..."
                     v-model.lazy="searchQuery">
              <span class="icon is-small is-left">
                <i class="fas fa-search"></i>
              </span>
              <span class="icon is-small is-right"
                    @click="searchQuery = ''">
                <i class="fas fa-times-circle"></i>
              </span>
            </p>
          </div>
        </div>
        <div class="level-item">
          <help-content :reference="'plan.overview'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>

    <nav class="level">
      <div class="level-left">
      </div>
      <div class="level-right">
        <div class="level-item">
          <date-picker label=""
                       :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                       placeholder="Start Date"
                       showClear
                       showNow
                       v-model="mselStartDate"
                       @now="(value) => { mselStartDate = value}"
                       @clear="(value) => { mselStartDate = value}"
                       @changed="(value) => {mselStartDate = value}"
                       :key="'mselStartDate'"
                       :name="'mselStartDate'" />
        </div>
        <div class="level-item">
          <date-picker label=""
                       :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                       placeholder="End Date"
                       showClear
                       showNow
                       v-model="mselEndDate"
                       @now="(value) => {mselEndDate = value}"
                       @clear="(value) => {mselEndDate = value}"
                       @changed="(value) => {mselEndDate = value}"
                       :key="'mselEndDate'"
                       :name="'mselEndDate'" />
        </div>
        <div class="level-item">
          <div class="select">
            <select v-model.number="perPage">
              <option value="25">
                25 per page
              </option>
              <option value="50">
                50 per page
              </option>
              <option value="75">
                75 per page
              </option>
              <option value="100">
                100 per page
              </option>
            </select>
          </div>
        </div>
      </div>
    </nav>
    <p v-if="endAfterStartCheck"
       class="help has-text-danger has-text-centered">{{endAfterStartCheck}}</p>
    <section class="assessment-readiness">
      <div class="readiness-header">
        <div>
          <p class="eyebrow">Assessment traceability</p>
          <h1 class="title is-4">Evidence readiness board</h1>
          <p class="subtitle is-6">
            Track whether training objectives have MSEL coverage, assessment evidence, measures, and enough runs to support hot wash and AAR findings.
          </p>
        </div>
        <div class="readiness-score"
             :class="assessmentReadinessTone">
          <span>{{ assessmentReadinessScore }}%</span>
          <small>Evidence Ready</small>
        </div>
      </div>
      <div class="readiness-metrics">
        <div v-for="metric in assessmentReadinessMetrics"
             :key="metric.key"
             class="readiness-metric"
             :class="{'is-attention': metric.attention}">
          <span class="metric-icon">
            <i :class="metric.icon"></i>
          </span>
          <span>
            <strong>{{ metric.value }}</strong>
            <small>{{ metric.label }}</small>
          </span>
        </div>
      </div>
    </section>
    <div class="columns is-mobile">
      <div class="column"
           v-if="planTrainingObjectives && planTrainingObjectives.length > 0">
        <b-table :data="planTrainingObjectives"
                 :loading="loading"
                 paginated
                 :per-page="perPage"
                 detailed
                 detail-key="id"
                 :pagination-simple="isPaginationSimple"
                 :default-sort-direction="defaultSortOrder"
                 default-sort="startDate"
                 aria-next-label="Next page"
                 aria-previous-label="Previous page" 
                 aria-page-label="Page" 
                 aria-current-label="Current page">
          <template slot-scope="props">
            <b-table-column field="participant.name"
                            label="Participant">
              {{ props.row.participant.name }}
            </b-table-column>
            <b-table-column field="platform.title"
                            label="Platform">
              <span v-if="props.row.platform && props.row.platform.platform">{{props.row.platform.platform.title}}</span>
            </b-table-column>
            <b-table-column field="jmet"
                            label="JMET">
              <span v-if="props.row.jmet">
                {{props.row.jmet.description}}
              </span>
            </b-table-column>
            <b-table-column field="requiredRuns"
                            label="Required Runs">
              {{props.row.requiredRuns ? props.row.requiredRuns : 0}}
            </b-table-column>
            <b-table-column field="inject"
                            label="Inject Count">
              {{props.row.injects ? props.row.injects.length : 0}}
            </b-table-column>
            <b-table-column field="status"
                            label="Assessment Count">
              {{props.row.assessments.length}}
            </b-table-column>
            <b-table-column label="Evidence Readiness">
              <div class="evidence-chip-wrap">
                <span v-for="item in objectiveEvidenceItems(props.row)"
                      :key="item.key"
                      class="evidence-chip"
                      :class="item.complete ? 'is-complete' : 'is-missing'"
                      :title="item.complete ? item.readyText : item.missingText">
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </span>
              </div>
            </b-table-column>
            <b-table-column label="Feedback Count">
              <ApolloQuery :query="planFeedbacksQuery"
                           :variables="{where: {evaluation: {trainingObjectives: {id: props.row.id}}}}">
                <template slot-scope="{ result: { loading, error, data } }">
                  <div v-if="loading"
                       class="loading apollo">
                    Loading...
                  </div>
                  <div v-else-if="error"
                       class="error apollo">
                    An error occurred
                  </div>
                  <div v-else-if="data && data.planFeedbacks"
                       class="result apollo">
                    <span>{{data.planFeedbacks.length}}</span>
                  </div>
                  <div v-else
                       class="no-result apollo">
                    0
                  </div>
                </template>
                <ApolloSubscribeToMore :document="planFeedbackSub"
                                       :variables="{node:{where: {evaluation: {trainingObjectives: {id: props.row.id}}}}}"
                                       :updateQuery="onFeedbackUpdate" />
              </ApolloQuery>
            </b-table-column>
            <b-table-column>
              <b-dropdown position="is-bottom-left"
                          class="is-pulled-right">
                <a class="button is-small"
                   slot="trigger">
                  <span class="icon is-small">
                    <i class="fas fa-ellipsis-v"></i>
                  </span>
                </a>
                <b-dropdown-item @click="createAssessment(props.row.participant.id, props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-clipboard-check"
                       aria-hidden="true"></i>
                  </span>
                  <span>Create Assessment</span>
                </b-dropdown-item>
                <b-dropdown-item @click="createFeedback(props.row.participant.id, props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-clipboard-check"
                       aria-hidden="true"></i>
                  </span>
                  <span>Create Feedback</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
          <template slot="detail"
                    slot-scope="props">
            <article class="media">
              <div class="columns is-multiline">
                <div class="column is-half">
                  <div class="field">
                    <p class="title is-6">Requested Method</p>
                    <p class="subtitle is-6">{{ props.row.requestedMethodType ? props.row.requestedMethodType.title : "None" }}</p>

                  </div>
                </div>
                <div class="column is-half">
                  <div class="field">
                    <p class="title is-6">Trained Method</p>
                    <p class="subtitle is-6">
                      {{ props.row.trainedMethodType ? props.row.trainedMethodType.title : "None"}}</p>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="field">
                    <p class="title is-6">Task</p>
                    <pre class="content">{{ props.row.task }}</pre>
                  </div>
                  <div class="field">
                    <p class="title is-6">Condition</p>
                    <pre class="content">{{ props.row.condition }}</pre>
                  </div>
                  <div class="field">
                    <p class="title is-6">Standard</p>
                    <pre class="content">{{ props.row.standard }}</pre>
                  </div>
                </div>

                <div class="column is-full">
                  <label class="label">
                    Measures
                  </label>
                  <div class="evidence-chip-wrap is-detail">
                    <span v-for="item in objectiveEvidenceItems(props.row)"
                          :key="item.key"
                          class="evidence-chip"
                          :class="item.complete ? 'is-complete' : 'is-missing'">
                      <i :class="item.icon"></i>
                      <span>{{ item.complete ? item.readyText : item.missingText }}</span>
                    </span>
                  </div>
                  <ul class="bd-anchors-list"
                      v-if="props.row.measures.length > 0">
                    <li v-for="(measure,$index) in props.row.measures"
                        :key="measure.id">M{{$index+1}} - {{measure.title}}</li>
                  </ul>
                  <div v-else>
                    <p class="subtitle is-6">None</p>
                  </div>
                </div>

                <div class="column is-full">
                  <h4 class="title is-6">
                    Injects
                  </h4>
                  <ul class="menu-list"
                      v-if="props.row.injects.length > 0">
                    <li v-for="inject in props.row.injects"
                        :key="inject.id">
                      <a @click="previewInject(inject.id)"
                         class="subtitle is-6 is-link inject-link">
                        #{{inject.number}} -
                        {{inject.title}} -
                        {{formatDate(inject.startDate, 'dtg')}}
                        <span v-if="inject.status"> -
                          <span class="tag is-rounded"
                                :style="'background-color:'+inject.status.color"
                                :class="lightOrDark(inject.status.color)">{{inject.status ? inject.status.title : ''}}</span>
                        </span>
                      </a>
                    </li>
                  </ul>
                  <div v-else
                       class="inline no-result apollo">
                    No Injects
                  </div>
                </div>
                <div class="column is-half">
                  <div class="field">
                    <h4 class="title is-6">
                      Assessment List
                    </h4>
                    <ul class="menu-list"
                        v-if="props.row.assessments && props.row.assessments.length>0">
                      <li v-for="(assessment,$index) in props.row.assessments"
                          :key="assessment.id">
                        #{{$index+1}} - {{assessment.complete ? "Complete" : "Incomplete"}} - {{assessment.reason ? assessment.reason.title : 'No Reason'}}
                        <div class="field has-addons assessButtons">
                          <p class="control">
                            <button class="button is-small"
                                    @click="editPlanAssessment(assessment.id)">
                              <span class="icon is-small">
                                <i class="fas fa-pen"></i>
                              </span>
                            </button>
                          </p>
                          <p class="control">
                            <button class="button is-small"
                                    @click="confirmDeleteAssessment(assessment.id)">
                              <span class="icon is-small has-text-danger">
                                <i class="fas fa-times"></i>
                              </span>
                            </button>
                          </p>
                        </div>
                      </li>
                    </ul>
                    <div v-else
                         class="inline no-result apollo">
                      No Assessments Created
                    </div>
                    <p class="control">
                      <span :class="props.row.assessments && (props.row.assessments.length>=props.row.injects.length) ? 'is-tooltip-multiline tooltip' : null"
                            :data-tooltip="props.row.assessments && (props.row.assessments.length>=props.row.injects.length) ? 'Number of assessments cannot exceed number of injects for this training objective.' : null">
                        <button class="button"
                                @click="createAssessment(props.row.participant.id, props.row.id)"
                                :disabled="props.row.assessments && (props.row.assessments.length>=props.row.injects.length)">Create Assessment</button>
                      </span>
                    </p>
                  </div>
                </div>
                <div class="column is-half">
                  <ApolloQuery :query="planFeedbacksQuery"
                               :variables="{where: {evaluation: {trainingObjectives: {id: props.row.id}}}}">
                    <template slot-scope="{ result: { loading, error, data } }">
                      <div v-if="loading"
                           class="loading apollo">
                        Loading...
                      </div>
                      <div v-else-if="error"
                           class="error apollo">
                        An error occurred
                      </div>
                      <div v-else-if="data"
                           class="result apollo">
                        <h4 class="title is-6">
                          Feedback List
                        </h4>
                        <div v-if="data.planFeedbacks && data.planFeedbacks.length>0">
                          <ul class="menu-list">
                            <li v-for="(feedback,$index) in data.planFeedbacks"
                                :key="feedback.id">
                              #{{$index+1}} - {{feedback.status}} - {{feedback.evaluation.reason ? feedback.evaluation.reason.title : 'No Reason'}} - {{feedback.evaluation.email ? feedback.evaluation.email : 'No Email'}}
                              <div class="field has-addons feedbackButtons">
                                <p class="control">
                                  <button class="button is-small"
                                          @click="viewPlanFeedback(feedback.id)">
                                    <span class="icon is-small">
                                      <i class="fas fa-eye"></i>
                                    </span>
                                  </button>
                                </p>
                                <p class="control">
                                  <button class="button is-small"
                                          @click="editPlanFeedback(feedback.id)">
                                    <span class="icon is-small">
                                      <i class="fas fa-pen"></i>
                                    </span>
                                  </button>
                                </p>
                                <p class="control">
                                  <button class="button is-small"
                                          @click="confirmDeleteFeedback(feedback.id)">
                                    <span class="icon is-small has-text-danger">
                                      <i class="fas fa-times"></i>
                                    </span>
                                  </button>
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div v-else
                             class="inline no-result apollo">
                          No Feedbacks Created
                        </div>
                        <p class="control">
                          <span :class="data.planFeedbacks && (data.planFeedbacks.length>=props.row.injects.length) ? 'is-tooltip-multiline tooltip' : null"
                                :data-tooltip="data.planFeedbacks && (data.planFeedbacks.length>=props.row.injects.length) ? 'Number of feedback cannot exceed number of injects for this training objective.' : null">
                            <button class="button"
                                    @click="createFeedback(props.row.participant.id, props.row.id)"
                                    :disabled="data.planFeedbacks && (data.planFeedbacks.length>=props.row.injects.length)">Create Feedback</button>
                          </span>
                        </p>
                      </div>
                    </template>
                    <ApolloSubscribeToMore :document="planFeedbackSub"
                                           :variables="{node:{where: {evaluation: {trainingObjectives: {id: props.row.id}}}}}"
                                           :updateQuery="onFeedbackUpdate" />
                  </ApolloQuery>
                </div>
              </div>
            </article>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planTrainingObjectives"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading' />
      </div>
    </div>
    <inject-preview :open="previewModal"
                    :id="selectedInject"
                    @close="closeModal"></inject-preview>
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanAssessmentCreate,
  PlanAssessmentDelete
} from '@/plan/graphql/PlanAssessments.gql'
import {
  PlanTrainingObjectivesAssessList,
  PlanTrainingObjectivesUpdate,
  PlanTrainingObjectiveSubscription
} from '@/plan/graphql/PlanTrainingObjectives.gql'
import {
  PlanEventRead,
  PlanEventsSelector,
  PlanEventSubscription
} from '@/plan/graphql/PlanEvents.gql'
import {
  PlanFeedbackCreate,
  PlanFeedbackDelete,
  PlanFeedbacksUpdate,
  PlanFeedbacksRead,
  PlanFeedbackSubscription
} from '@/plan/graphql/PlanFeedback.gql'
import { InjectTracker } from '@/plan/graphql/PlanInjects.gql'
import InjectPreview from '@/plan/components/inject-preview'
import helpers from '@/shared/mixins/helpers'
import lightOrDark from '@/shared/mixins/lightOrDark'
import dateChecks from '@/shared/mixins/dateChecks'
import DatePicker from '@/shared/components/datepicker'
export default {
  name: 'assessment-overview',
  mixins: [helpers, lightOrDark, dateChecks],
  components: { InjectPreview, HelpContent, DatePicker },
  apollo: {
    planTrainingObjectives: {
      query: PlanTrainingObjectivesAssessList,
      variables() {
        let data = this.trainingObjectiveReadVariables()
        return data
      },
      update(data) {
        if (data && data.planTrainingObjectives) {
          this.trainingObjectives = JSON.parse(
            JSON.stringify(data.planTrainingObjectives),
            this.omitTypename
          )
          // This keeps the client side sorting from throwing an error for null values
          this.trainingObjectives.forEach(obj => {
            if (!obj.jmet) {
              obj.jmet = {}
            }
            if (!obj.platform) {
              obj.platform = { platform: {} }
            }
          })
        }
        return data.planTrainingObjectives
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanTrainingObjectiveSubscription,
        variables() {
          let datafromread = this.trainingObjectiveReadVariables()

          let data = {
            node: datafromread
          }
          return data
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planTrainingObjective.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planTrainingObjectives: [
                  subscriptionData.data.planTrainingObjective.node,
                  ...previousResult.planTrainingObjectives
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planTrainingObjectives: [
                  ...previousResult.planTrainingObjectives.filter(
                    obj =>
                      subscriptionData.data.planTrainingObjective.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanTrainingObjectives = JSON.parse(
                JSON.stringify(previousResult.planTrainingObjectives)
              )
              let index = newPlanTrainingObjectives.findIndex(
                x =>
                  x.id === subscriptionData.data.planTrainingObjective.node.id
              )
              newPlanTrainingObjectives[index] =
                subscriptionData.data.planTrainingObjective.node
              newResult = {
                planTrainingObjectives: newPlanTrainingObjectives
              }
              break
            }
            default: {
              throw new Error(`Unknown trainingObjective mutation`)
            }
          }
          return newResult
        }
      }
    },
    planEvent: {
      query: PlanEventRead,
      variables() {
        return {
          where: {
            id: this.eventID
          }
        }
      }
    },
    planEvents: {
      query: PlanEventsSelector,
      variables() {
        return {
          where: {
            type: null
          }
        }
      },
      subscribeToMore: [
        {
          document: PlanEventSubscription,
          // Mutate the previous result
          updateQuery(previousResult, { subscriptionData }) {
            // Mutation type
            let mutationIn = subscriptionData.data.planEvent.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  planEvents: [
                    ...previousResult.planEvents,
                    subscriptionData.data.planEvent.node
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
                let updatedPlanEvents = JSON.parse(
                  JSON.stringify(previousResult.planEvents)
                )
                let index = updatedPlanEvents.findIndex(
                  x => x.id === subscriptionData.data.planEvent.node.id
                )
                updatedPlanEvents[index] = subscriptionData.data.planEvents.node
                newResult = {
                  planEvents: updatedPlanEvents
                }
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            // Here, return the new result from the previous with the new data
            return newResult
          }
        }
      ]
    }
  },
  data() {
    return {
      endAfterStartCheck: null,
      mselStartDate: null,
      mselEndDate: null,
      planFeedbacksQuery: PlanFeedbacksRead,
      planFeedbackSub: PlanFeedbackSubscription,
      eventID: this.$route.query.event ? this.$route.query.event : '',
      injectQuery: InjectTracker,
      searchQuery: '',
      loading: false,
      orderBy: 'startDate_ASC',
      defaultSortOrder: 'asc',
      isPaginationSimple: false,
      perPage: '25',
      selectedInject: null,
      previewModal: false,
      planAssessment: {
        complete: true,
        reason: '',
        comment: ''
      }
    }
  },
  computed: {
    visibleObjectives() {
      return this.planTrainingObjectives || []
    },
    assessmentReadinessScore() {
      if (!this.visibleObjectives.length) {
        return 0
      }
      let possible = this.visibleObjectives.length * this.evidenceTemplateLength
      let complete = this.visibleObjectives.reduce((count, objective) => {
        return (
          count +
          this.objectiveEvidenceItems(objective).filter(item => item.complete)
            .length
        )
      }, 0)
      return Math.round((complete / possible) * 100)
    },
    assessmentReadinessTone() {
      if (this.assessmentReadinessScore >= 80) {
        return 'is-strong'
      }
      if (this.assessmentReadinessScore >= 55) {
        return 'is-building'
      }
      return 'is-starting'
    },
    evidenceTemplateLength() {
      return 5
    },
    assessmentReadinessMetrics() {
      let objectives = this.visibleObjectives
      let total = objectives.length
      let withInjects = objectives.filter(
        objective => objective.injects && objective.injects.length > 0
      ).length
      let withMeasures = objectives.filter(
        objective => objective.measures && objective.measures.length > 0
      ).length
      let withAssessments = objectives.filter(
        objective => objective.assessments && objective.assessments.length > 0
      ).length
      let completeAssessments = objectives.filter(objective =>
        this.hasCompleteAssessment(objective)
      ).length
      let runCoverage = objectives.filter(objective =>
        this.objectiveRunCovered(objective)
      ).length

      return [
        {
          key: 'objectives',
          label: 'visible objectives',
          value: total,
          icon: 'fas fa-bullseye',
          attention: total === 0
        },
        {
          key: 'injects',
          label: 'with MSEL coverage',
          value: `${withInjects}/${total}`,
          icon: 'fas fa-stream',
          attention: total > 0 && withInjects < total
        },
        {
          key: 'measures',
          label: 'with measures',
          value: `${withMeasures}/${total}`,
          icon: 'fas fa-ruler-combined',
          attention: total > 0 && withMeasures < total
        },
        {
          key: 'assessments',
          label: 'with assessments',
          value: `${withAssessments}/${total}`,
          icon: 'fas fa-clipboard-check',
          attention: total > 0 && withAssessments < total
        },
        {
          key: 'complete',
          label: 'completed assessments',
          value: `${completeAssessments}/${total}`,
          icon: 'fas fa-check-circle',
          attention: total > 0 && completeAssessments < total
        },
        {
          key: 'runs',
          label: 'run coverage',
          value: `${runCoverage}/${total}`,
          icon: 'fas fa-redo-alt',
          attention: total > 0 && runCoverage < total
        }
      ]
    }
  },
  watch: {
    eventID() {
      this.$router.push({
        query: {
          event: this.eventID
        }
      })
    }
  },
  methods: {
    objectiveRunCovered(objective) {
      let requiredRuns = Number(
        objective && objective.requiredRuns ? objective.requiredRuns : 0
      )
      let injectCount =
        objective && objective.injects ? objective.injects.length : 0
      return requiredRuns === 0 || injectCount >= requiredRuns
    },
    hasCompleteAssessment(objective) {
      return !!(
        objective &&
        objective.assessments &&
        objective.assessments.some(assessment => assessment.complete)
      )
    },
    objectiveEvidenceItems(objective) {
      let requiredRuns = Number(
        objective && objective.requiredRuns ? objective.requiredRuns : 0
      )
      let injectCount =
        objective && objective.injects ? objective.injects.length : 0
      let assessmentCount =
        objective && objective.assessments ? objective.assessments.length : 0

      return [
        {
          key: 'injects',
          label: 'MSEL',
          icon: 'fas fa-stream',
          readyText: `${injectCount} linked injects`,
          missingText: 'No linked MSEL injects',
          complete: injectCount > 0
        },
        {
          key: 'measures',
          label: 'Measures',
          icon: 'fas fa-ruler-combined',
          readyText: 'Assessment measures linked',
          missingText: 'Needs assessment measures',
          complete: !!(objective.measures && objective.measures.length)
        },
        {
          key: 'assessments',
          label: 'Assess',
          icon: 'fas fa-clipboard-check',
          readyText: `${assessmentCount} assessment records`,
          missingText: 'Needs assessment record',
          complete: assessmentCount > 0
        },
        {
          key: 'complete',
          label: 'Complete',
          icon: 'fas fa-check-circle',
          readyText: 'At least one complete assessment',
          missingText: 'No complete assessment yet',
          complete: this.hasCompleteAssessment(objective)
        },
        {
          key: 'runs',
          label: 'Runs',
          icon: 'fas fa-redo-alt',
          readyText: requiredRuns
            ? `${injectCount}/${requiredRuns} required runs covered`
            : 'Required runs not set',
          missingText: `${injectCount}/${requiredRuns} required runs covered`,
          complete: this.objectiveRunCovered(objective)
        }
      ]
    },
    trainingObjectiveReadVariables() {
      let eventFilter
      let mselFilter
      if (this.eventID) {
        eventFilter = {
          injects_some: {
            events: {
              id: this.eventID
            }
          }
        }
      }

      if (!this.mselStartDate && !this.mselEndDate) {
        this.endAfterStartCheck = this.isEndAfterStart(
          this.mselStartDate,
          this.mselEndDate
        )
      }

      if (!this.mselStartDate && this.mselEndDate) {
        this.endAfterStartCheck = this.isEndAfterStart(
          this.mselEndDate,
          this.mselEndDate
        )
      }

      if (this.mselStartDate && !this.mselEndDate) {
        mselFilter = {
          injects_some: {
            startDate_gte: this.mselStartDate
          }
        }
      }

      if (this.mselStartDate && this.mselEndDate) {
        this.endAfterStartCheck = this.isEndAfterStart(
          this.mselStartDate,
          this.mselEndDate
        )

        if (!this.endAfterStartCheck) {
          mselFilter = {
            injects_some: {
              AND: [
                { startDate_gte: this.mselStartDate },
                { startDate_lte: this.mselEndDate }
              ]
            }
          }
        }
      }

      return {
        where: {
          ...eventFilter,
          ...mselFilter,
          OR: [
            { jmet: { description_contains: this.searchQuery } },
            { task_contains: this.searchQuery },
            { condition_contains: this.searchQuery },
            { standard_contains: this.searchQuery },
            {
              platform: {
                OR: [
                  {
                    platform: {
                      OR: [
                        { title_contains: this.searchQuery },
                        { type_contains: this.searchQuery }
                      ]
                    }
                  },
                  {
                    participant: {
                      OR: [{ name_contains: this.searchQuery }]
                    }
                  }
                ]
              }
            },
            {
              exerciseObjective_some: {
                OR: [
                  { title_contains: this.searchQuery },
                  { exerciseObjective_contains: this.searchQuery },
                  { measurePerformance_contains: this.searchQuery },
                  { measureEffectiveness_contains: this.searchQuery }
                ]
              }
            },
            {
              accreditedTask_some: {
                OR: [
                  {
                    jmet: {
                      OR: [
                        { levelWar_contains: this.searchQuery },
                        { taskNumber_contains: this.searchQuery },
                        { taskTitle_contains: this.searchQuery }
                      ]
                    }
                  }
                ]
              }
            },
            {
              commandTrainingPriority_some: {
                OR: [
                  { title_contains: this.searchQuery },
                  { description_contains: this.searchQuery }
                ]
              }
            }
          ]
        }
      }
    },
    onFeedbackUpdate(previousResult, { subscriptionData }) {
      let mutationIn = subscriptionData.data.planFeedback.mutation
      let newResult
      switch (mutationIn) {
        case 'CREATED': {
          newResult = {
            planFeedbacks: [
              subscriptionData.data.planFeedback.node,
              ...previousResult.planFeedbacks
            ]
          }
          break
        }
        case 'DELETED': {
          newResult = {
            planFeedbacks: [
              ...previousResult.planFeedbacks.filter(
                obj =>
                  subscriptionData.data.planFeedback.previousValues.id !==
                  obj.id
              )
            ]
          }
          break
        }
        case 'UPDATED': {
          let newPlanFeedbacks = JSON.parse(
            JSON.stringify(previousResult.planFeedbacks)
          )
          let index = newPlanFeedbacks.findIndex(
            x => x.id === subscriptionData.data.planFeedback.node.id
          )
          newPlanFeedbacks[index] = subscriptionData.data.planFeedback.node
          newResult = {
            planFeedbacks: newPlanFeedbacks
          }
          break
        }
        default: {
          throw new Error(`Unknown mutation`)
        }
      }
      return newResult
    },
    onSort(field, order) {
      this.orderBy = field + '_' + order.toUpperCase()
    },
    previewInject(inject) {
      this.previewModal = true
      this.selectedInject = inject
    },
    closeModal() {
      this.previewModal = false
      this.selectedInject = null
    },
    editPlanAssessment(assessmentId) {
      this.$router.push({
        name: 'editassess',
        params: { id: assessmentId }
      })
    },
    editPlanFeedback(feedbackId) {
      this.$router.push({
        name: 'editfeedbackpublic',
        params: {
          workspace: this.$store.state.activeWorkspace.name,
          id: feedbackId
        }
      })
    },
    createAssessment(participantID, trainingObjID) {
      let dataVariable = {
        comment: this.planAssessment.comment,
        complete: true
      }

      this.$apollo
        .mutate({
          mutation: PlanAssessmentCreate,
          variables: {
            data: dataVariable
          }
        })
        .then(response => {
          // connect training objective
          this.$apollo
            .mutate({
              mutation: PlanTrainingObjectivesUpdate,
              variables: {
                data: {
                  assessments: {
                    connect: {
                      id: response.data.createPlanAssessment.id
                    }
                  }
                },
                where: {
                  id: trainingObjID
                }
              }
            })
            .then(data => {
              if (data && data.data.updatePlanTrainingObjective) {
                this.$router.push({
                  name: 'editassess',
                  params: { id: response.data.createPlanAssessment.id }
                })
              }
            })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Plan Assessment create: ' + error)
        })
    },
    createFeedback(participantID, trainingObjID) {
      this.$apollo
        .mutate({
          mutation: PlanFeedbackCreate,
          variables: {
            data: {
              evaluation: {
                create: {
                  complete: true,
                  trainingObjectives: {
                    connect: {
                      id: trainingObjID
                    }
                  }
                }
              }
            }
          }
        })
        .then(response => {
          this.$router.push({
            name: 'editfeedbackpublic',
            params: {
              workspace: this.$store.state.activeWorkspace.name,
              id: response.data.createPlanFeedback.id
            }
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Plan Feedback create: ' + error)
        })
    },
    confirmDeleteAssessment(assessmentID) {
      this.$buefy.dialog.confirm({
        title: 'Delete Assessment',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePlanAssessment(assessmentID)
      })
    },
    confirmDeleteFeedback(feedbackID) {
      this.$buefy.dialog.confirm({
        title: 'Delete Feedback',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePlanFeedback(feedbackID)
      })
    },
    async disconnectTO(feedbackID) {
      let result
      await this.$apollo
        .mutate({
          mutation: PlanFeedbacksUpdate,
          variables: {
            data: {
              evaluation: {
                update: { trainingObjectives: { disconnect: true } }
              }
            },
            where: {
              id: feedbackID
            }
          }
        })
        .then(response => {
          result = response
        })
        .catch(error => {
          console.error(
            'Overview: Disconnecting TO from Feedback/Evaluation: ' + error
          )
        })
      return result
    },
    async deletePlanFeedback(feedbackID) {
      let checkDisconnectTo = await this.disconnectTO(feedbackID)

      if (checkDisconnectTo) {
        this.$apollo
          .mutate({
            mutation: PlanFeedbackDelete,
            variables: {
              id: {
                id: feedbackID
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Feedback Deleted!',
              type: 'is-success'
            })
            this.$apollo.queries.planTrainingObjectives.refetch()
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('Delete Feedback: ' + error)
          })
      }
    },
    deletePlanAssessment(assessmentID) {
      this.$apollo
        .mutate({
          mutation: PlanAssessmentDelete,
          variables: {
            id: {
              id: assessmentID
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Assessment Deleted!',
            type: 'is-success'
          })
          this.$apollo.queries.planTrainingObjectives.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Assessment: ' + error)
        })
    },
    viewPlanFeedback(feedbackId) {
      this.$router.push({
        name: 'viewfeedback',
        params: { id: feedbackId }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.assessment-readiness {
  background:
    linear-gradient(135deg, rgba(29, 78, 216, 0.12), rgba(20, 184, 166, 0.1)),
    var(--app-surface, #ffffff);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
  margin: 0 0 1.25rem;
  padding: 1rem;
}

.readiness-header {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;

  .title,
  .subtitle {
    margin-bottom: 0.25rem;
  }
}

.eyebrow {
  color: var(--app-text-muted, #64748b);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
}

.readiness-score {
  align-items: center;
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  min-height: 88px;
  min-width: 124px;
  padding: 0.75rem;

  span {
    color: var(--app-text-strong, #0f172a);
    font-size: 1.7rem;
    font-weight: 800;
    line-height: 1;
  }

  small {
    color: var(--app-text-muted, #64748b);
    font-size: 0.68rem;
    font-weight: 700;
    margin-top: 0.35rem;
    text-align: center;
    text-transform: uppercase;
  }

  &.is-strong {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.32);
  }

  &.is-building {
    background: rgba(245, 158, 11, 0.14);
    border-color: rgba(245, 158, 11, 0.34);
  }

  &.is-starting {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.28);
  }
}

.readiness-metrics {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.readiness-metric {
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  display: flex;
  gap: 0.65rem;
  min-height: 66px;
  padding: 0.7rem;

  .metric-icon {
    align-items: center;
    background: rgba(37, 99, 235, 0.1);
    border-radius: 8px;
    color: #2563eb;
    display: inline-flex;
    flex: 0 0 auto;
    height: 34px;
    justify-content: center;
    width: 34px;
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: var(--app-text-strong, #0f172a);
    font-size: 1.05rem;
    line-height: 1.05;
  }

  small {
    color: var(--app-text-muted, #64748b);
    font-size: 0.68rem;
    font-weight: 800;
    margin-top: 0.22rem;
    text-transform: uppercase;
  }

  &.is-attention {
    border-color: rgba(245, 158, 11, 0.36);

    .metric-icon {
      background: rgba(245, 158, 11, 0.14);
      color: #b45309;
    }
  }
}

.evidence-chip-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;

  &.is-detail {
    margin-bottom: 0.75rem;
  }
}

.evidence-chip {
  align-items: center;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 800;
  gap: 0.3rem;
  line-height: 1;
  min-height: 28px;
  padding: 0.32rem 0.55rem;

  &.is-complete {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.28);
    color: #047857;
  }

  &.is-missing {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.22);
    color: #b91c1c;
  }
}

.tooltip.is-tooltip-multiline::before {
  min-width: 10rem;
}

.assessButtons,
.feedbackButtons {
  display: inline;
  & p {
    display: inline;
  }
}
.menu-list {
  a {
    padding: 0;
  }
  li {
    margin: 0.25rem auto;
  }
}
.inline.no-result {
  font-style: italic;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .readiness-header {
    align-items: stretch;
    flex-direction: column;
  }

  .readiness-score {
    min-width: 100%;
  }
}
</style>
