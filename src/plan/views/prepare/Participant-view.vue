<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="planParticipant ? planParticipant.name : ''" />
    <div v-if="planParticipant && planParticipant.id != null">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <span class="icon is-large"
                  :key="planParticipant.icon"
                  v-if="planParticipant.icon">
              <i :class="planParticipant.icon+ ' fa-2x'"></i>
            </span>
            <h1 class="title">
              {{planParticipant.name}}
            </h1>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button is-primary is-inverted"
                    @click="editParticipant(planParticipant)">
              <span class="icon is-small">
                <i class="fas fa-pen"></i>
              </span>
              <span>Edit</span>
            </button>
          </div>
          <div class="level-item">
            <help-content :reference="'plan.prepare.participantdetails'"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <div class="columns is-multiline">
        <div class="column is-full">
          <div class="card">
            <nav class="level is-pulled-right">
              <div class="level-left"></div>
              <div class="level-right">
                <div class="level-item">
                  <b-dropdown position="is-bottom-left">
                    <a class="button is-small"
                       slot="trigger">
                      <span class="icon is-small">
                        <i class="fas fa-ellipsis-v"></i>
                      </span>
                    </a>
                    <b-dropdown-item @click="editParticipant(planParticipant)">
                      <span class="icon is-small">
                        <i class="fas fa-pen"></i>
                      </span>
                      <span>Edit Participant</span>
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                    <b-dropdown-item @click="confirmDeleteParticipant(planParticipant.id)">
                      <span class="icon is-small">
                        <i class="fas fa-times has-text-danger"></i>
                      </span>
                      <span>Delete Participant</span>
                    </b-dropdown-item>
                  </b-dropdown>
                </div>
              </div>
            </nav>
            <div class="card-content">
              <div class="columns">
                <div class="column is-one-third">
                  <div class="columns is-multiline">
                    <div class="column is-full">
                      <p class="title is-size-6">Type</p>
                      <p class="subtitle is-size-6">{{planParticipant.participantType?planParticipant.participantType.title:''}}</p>
                    </div>
                    <div class="column is-full">
                      <p class="title is-6">Service/Department Type</p>
                      <p class="subtitle is-6">{{planParticipant.serviceType? planParticipant.serviceType.title : ''}}</p>
                    </div>
                    <div class="column is-full">
                      <p class="title is-size-6">Service/Department</p>
                      <p class="subtitle is-size-6">{{planParticipant.service? planParticipant.service.title : ''}}</p>
                    </div>
                    <div class="column is-full">
                      <p class="title is-6">Command/Agency</p>
                      <p class="subtitle is-6">{{planParticipant.commandAgency? planParticipant.commandAgency.title : ''}}</p>
                    </div>
                    <div class="column is-full">
                      <p class="title is-6">Home Station</p>
                      <p class="subtitle is-6">{{planParticipant.homeStation}}</p>
                    </div>
                    <div class="column is-full">
                      <p class="title is-6">Total Training Audience</p>
                      <p class="subtitle is-6">{{planParticipant.totalAudience}}</p>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="columns is-multiline">
                    <div class="column">
                      <div class="card">
                        <div class="card-header">
                          <h3 class="card-header-title">
                            Participant Platforms: {{planParticipant.platforms ? planParticipant.platforms.length : 0}}
                          </h3>
                        </div>
                        <div v-if="planParticipant.platforms && planParticipant.platforms.length > 0">
                          <section>
                            <b-table :data="planParticipant.platforms"
                                     detail-key="id">
                              <template slot-scope="props">
                                <b-table-column field="platform.title"
                                                label="Platform Title"
                                                class="is-size-6"
                                                centered
                                                sortable>
                                  <span v-if="props.row.platform">{{ props.row.platform.title }}</span>
                                </b-table-column>
                                <b-table-column field="platform.type"
                                                label="Platform Type"
                                                class="is-size-6"
                                                centered
                                                sortable>
                                  <span v-if="props.row.platform"> {{ props.row.platform.type }}</span>
                                </b-table-column>
                                <b-table-column field="bedDown"
                                                label="Bed-down"
                                                class="is-size-6"
                                                centered
                                                sortable>
                                  <span v-if="props.row.bedDown"> {{props.row.bedDown }}</span>
                                </b-table-column>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="column is-full">
                          <div class="content has-text-black has-text-centered">
                            <p>No Platforms.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-mobile is-multiline">
                    <div class="column is-full-desktop is-full-tablet is-12-mobile">
                      <div class="card">
                        <div class="card-header">
                          <h3 class="card-header-title">
                            Participant Planners: {{planParticipant.planners ? planParticipant.planners.length : 0}}
                          </h3>
                        </div>
                        <div v-if="planParticipant.planners && planParticipant.planners.length > 0">
                          <section>
                            <b-table :data="planParticipant.planners">
                              <template slot-scope="props">
                                <b-table-column field="name"
                                                label="Name"
                                                class="is-size-6"
                                                centered>
                                  {{ props.row.name }}
                                </b-table-column>
                                <b-table-column field="email"
                                                label="Email"
                                                class="is-size-6"
                                                centered>
                                  {{ props.row.email }}
                                </b-table-column>
                                <b-table-column field="phoneNumber"
                                                label="Phone Number"
                                                class="is-size-6"
                                                centered>
                                  {{ props.row.phoneNumber }}
                                </b-table-column>
                                <b-table-column field="isPrimary"
                                                label="Primary Contact"
                                                class="is-size-6"
                                                centered>
                                  <span v-if="props.row.isPrimary"
                                        class="primary-check">
                                    <i class="fas fa-check fa-lg"></i>
                                  </span>
                                </b-table-column>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="column is-full">
                          <div class="content has-text-black has-text-centered">
                            <p>No Planners.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-mobile is-multiline">
                    <div class="column is-full-desktop is-full-tablet is-12-mobile">
                      <div class="card">
                        <div class="card-header">
                          <h3 class="card-header-title">
                            Participant Funding:
                            {{ participantFundingTotal | formatNumber('currency')}}
                          </h3>
                        </div>
                        <div v-if="planParticipant.fundings && planParticipant.fundings.length > 0">
                          <section>
                            <b-table :data="planParticipant.fundings">
                              <template slot-scope="props">
                                <b-table-column field="primarySource"
                                                label="Primary Source"
                                                class="is-size-6"
                                                centered
                                                sortable>
                                  {{ props.row.primarySource }}
                                </b-table-column>
                                <b-table-column field="subSource"
                                                label="Sub-source"
                                                class="is-size-6"
                                                centered
                                                sortable>
                                  {{ props.row.subSource }}
                                </b-table-column>
                                <b-table-column field="amount"
                                                label="Amount"
                                                class="is-size-6 has-icons-left"
                                                numeric
                                                centered
                                                sortable>
                                  {{ props.row.amount | formatNumber('currency') }}
                                </b-table-column>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="column is-full">
                          <div class="content has-text-black has-text-centered">
                            <p>No Funding Sources.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-full">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <span class="button is-primary"
                      @click="createThenRoute(planParticipant.id)">Create T.O.</span>
              </div>
            </div>
          </nav>
          <div class="card">
            <div v-if="planParticipant && planParticipant && planParticipant.trainingObjectives.length > 0">
              <section>
                <div class="level-right">
                  <div class="level-item">
                    <div class="select">
                      <select v-model.number="perPage">
                        <option value="5">
                          5 per page
                        </option>
                        <option value="10">
                          10 per page
                        </option>
                        <option value="15">
                          15 per page
                        </option>
                        <option value="20">
                          20 per page
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <b-table :data="planParticipant.trainingObjectives"
                         :paginated="isPaginated"
                         :per-page="perPage"
                         :current-page.sync="currentPage"
                         :pagination-simple="isPaginationSimple"
                         :default-sort-direction="defaultSortDirection"
                         detailed
                         detail-key="id"
                         default-sort="priorityLevel.title">
                  <template slot-scope="props">
                    <b-table-column field="priorityLevel.title"
                                    label="Priority"
                                    centered
                                    sortable>
                      <span class="tag"
                            :style="'background-color:'+props.row.priorityLevel.color"
                            v-if="props.row.priorityLevel && props.row.priorityLevel.title"
                            :class="lightOrDark(props.row.priorityLevel.color)">
                        {{ props.row.priorityLevel.title}}
                      </span>
                    </b-table-column>
                    <b-table-column field="platform.title"
                                    label="Platform"
                                    sortable>
                      <span v-if="props.row.platform">{{ props.row.platform.platform.title }}</span>
                    </b-table-column>
                    <b-table-column field="platform.type"
                                    label="Platform Type"
                                    sortable>
                      <span v-if="props.row.platform">{{ props.row.platform.platform.type }}</span>
                    </b-table-column>
                    <b-table-column field="jmet.description"
                                    label="JMET"
                                    class="is-size-6"
                                    sortable>
                      <span v-if="props.row.jmet">{{ props.row.jmet.description }}</span>
                    </b-table-column>
                    <b-table-column field="requestedMethodType"
                                    label="Requested Method">
                      <span v-if="props.row.requestedMethodType">{{ props.row.requestedMethodType.title }}</span>
                    </b-table-column>
                    <b-table-column field="requiredRuns"
                                    label="Required Runs"
                                    sortable>
                      {{ props.row.requiredRuns }}
                    </b-table-column>
                    <b-table-column field="injectCount"
                                    label="Inject Count"
                                    centered
                                    class="is-size-6"
                                    sortable>
                      {{ props.row.injects ? props.row.injects.length : "0" }}
                    </b-table-column>
                    <b-table-column>
                      <b-dropdown position="is-bottom-left">
                        <a class="button is-small"
                           slot="trigger">
                          <span class="icon is-small">
                            <i class="fas fa-ellipsis-v"></i>
                          </span>
                        </a>
                        <b-dropdown-item @click="editTO(props.row.id, planParticipant.id)">
                          <span class="icon is-small">
                            <i class="fas fa-pen"></i>
                          </span>
                          <span>Edit Training Objective</span>
                        </b-dropdown-item>
                        <hr class="dropdown-divider">
                        <b-dropdown-item @click="confirmDeleteTO(props.row, planParticipant)">
                          <span class="icon is-small">
                            <i class="fas fa-times has-text-danger"></i>
                          </span>
                          <span>Delete Training Objective</span>
                        </b-dropdown-item>
                      </b-dropdown>
                    </b-table-column>
                  </template>
                  <template slot="detail"
                            slot-scope="props">
                    <article class="media">
                      <div class="media-content">
                        <div class="content">
                          <div class="columns is-multiline is-mobile">
                            <div class="column is-full">
                              <label class="label">
                                Task
                              </label>
                              <pre class="content">{{props.row.task }}</pre>
                            </div>
                            <div class="column is-full">
                              <label class="label">
                                Condition
                              </label>
                              <pre class="content">{{props.row.condition }}</pre>
                            </div>
                            <div class="column is-full">
                              <label class="label">
                                Standard
                              </label>
                              <pre class="content">{{props.row.standard }}</pre>
                            </div>
                            <div class="column is-full">
                              <label class="label">
                                Measures
                              </label>
                              <ul class="bd-anchors-list"
                                  v-if="props.row.measures && props.row.measures.length > 0">
                                <li v-for="(measure,$index) in props.row.measures"
                                    :key="measure.id">M{{$index+1}} - {{measure.title}}</li>
                              </ul>
                              <div v-else>
                                <p class="subtitle is-6">None</p>
                              </div>
                            </div>
                          </div>
                          <div class="columns">
                            <div class="column is-one-half">
                              <label class="label">
                                Exercise Objectives
                              </label>
                              <div v-if="props.row.exerciseObjective && props.row.exerciseObjective.length > 0">
                                <ul class="bd-anchors-list">
                                  <li v-for="exerciseObjective in props.row.exerciseObjective"
                                      v-bind:key="exerciseObjective.id">
                                    <p>
                                      <span class="subtitle is-6">{{exerciseObjective.title}}</span>
                                    </p>
                                  </li>
                                </ul>
                              </div>
                              <div v-else>
                                <p class="subtitle is-6">None</p>
                              </div>
                            </div>
                            <div class="column is-one-half">
                              <label class="label">
                                Accredited Tasks
                              </label>
                              <div v-if="props.row.accreditedTask && props.row.accreditedTask.length > 0">
                                <ul class="bd-anchors-list">
                                  <li v-for="accTask in props.row.accreditedTask"
                                      v-bind:key="accTask.id">
                                    <p>
                                      <span class="subtitle is-6">{{accTask.jmet.levelWar +' '+ accTask.jmet.taskNumber +' '+ accTask.jmet.taskTitle}}</span>
                                    </p>
                                  </li>
                                </ul>
                              </div>
                              <div v-else>
                                <p class="subtitle is-6">None</p>
                              </div>
                            </div>
                          </div>
                          <div class="columns">
                            <div class="column is-one-half">
                              <label class="label">
                                Command Training Priorities
                              </label>
                              <div v-if="props.row.commandTrainingPriority && props.row.commandTrainingPriority.length > 0">
                                <ul class="bd-anchors-list">
                                  <li v-for="commandPriority in props.row.commandTrainingPriority"
                                      v-bind:key="commandPriority.id">
                                    <p>
                                      <span class="subtitle is-6">{{commandPriority.title}}</span>
                                    </p>
                                  </li>
                                </ul>
                              </div>
                              <div v-else>
                                <p class="subtitle is-6">None</p>
                              </div>
                            </div>
                            <div class="column is-one-half">
                              <label class="label">
                                Joint Staff Training Priorities
                              </label>
                              <div v-if="props.row.jointStaffTrainingPriority && props.row.jointStaffTrainingPriority.length > 0">
                                <ul class="bd-anchors-list">
                                  <li v-for="priority in props.row.jointStaffTrainingPriority"
                                      v-bind:key="priority.id">
                                    <p>
                                      <span class="subtitle is-6">{{priority.title}}</span>
                                    </p>
                                  </li>
                                </ul>
                              </div>
                              <div v-else>
                                <p class="subtitle is-6">None</p>
                              </div>
                            </div>
                          </div>
                          <div class="columns">
                            <div class="column is-narrow">
                              <div class="field is-grouped">
                                <p class="control">
                                  <a class="button is-primary"
                                     @click="editTO(props.row.id, planParticipant.id)">Edit</a>
                                </p>
                                <p class="control">
                                  <a class="button is-danger is-outlined"
                                     @click="confirmDeleteTO(props.row, planParticipant)">Delete</a>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </template>
                </b-table>
              </section>
            </div>
            <div v-else>
              <empty-state :data="planParticipant.trainingObjectives"
                           :isLoading='$apollo.loading' />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <empty-state :data="planParticipant"
                   :isLoading='$apollo.loading' />
    </div>
  </div>
</template>

<script>
import {
  PlanParticipantRead,
  PlanParticipantsUpdate,
  PlanParticipantsDelete
} from '@/plan/graphql/PlanParticipants.gql'

import {
  PlanEvaluationsRead,
  PlanEvaluationsDelete
} from '@/plan/graphql/PlanEvaluations.gql'

import {
  PlanFeedbacksRead,
  PlanFeedbackDelete
} from '@/plan/graphql/PlanFeedback.gql'
import { PlanTrainingObjectivesCreate } from '@/plan/graphql/PlanTrainingObjectives.gql'
import lightOrDark from '@/shared/mixins/lightOrDark'
import { serverError } from '@/shared/serverError'
import HelpContent from '@/shared/components/helpcontent'
export default {
  name: 'participant-view',
  mixins: [lightOrDark],
  apollo: {
    planParticipant: {
      query: PlanParticipantRead,
      variables() {
        return {
          where: {
            id: this.id ? this.id : ''
          }
        }
      },
      skip() {
        return !this.id
      },
      update(data) {
        if (data && data.planParticipant) {
          return data.planParticipant
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    HelpContent
  },
  data() {
    return {
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 15
    }
  },
  computed: {
    hasTrainingObjectives() {
      return this.planParticipant.trainingObjectives.length > 0
    },
    participantFundingTotal() {
      let sum = 0
      if (
        this.planParticipant.fundings &&
        this.planParticipant.fundings.length > 0
      ) {
        sum = this.planParticipant.fundings.reduce(
          (accumulator, currentFunding) => {
            return accumulator + currentFunding.amount
          },
          0
        )
      }
      return sum
    }
  },
  methods: {
    async createThenRoute(participantId) {
      let createTrainingObj = await this.createTO(participantId)

      if (createTrainingObj != null) {
        this.editTO(createTrainingObj, participantId)
      }
    },
    createTO(participantId) {
      if (!participantId) return
      return this.$apollo
        .mutate({
          mutation: PlanTrainingObjectivesCreate,
          variables: {
            data: {
              requiredRuns: '1',
              classification: 'Unclassified',
              participant: {
                connect: { id: participantId }
              }
            }
          }
        })
        .then(response => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          if (
            response &&
            response.data &&
            response.data.createPlanTrainingObjective &&
            response.data.createPlanTrainingObjective.id
          ) {
            return response.data.createPlanTrainingObjective.id
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    },
    editTO(trainingObjId, participantId) {
      this.$router.push({
        name: 'planTrainingObjectiveView',
        params: {
          id: participantId,
          trainingObjID: trainingObjId,
          isEdit: true
        },
        query: { from: this.$route.fullPath }
      })
    },
    confirmDeleteTO(trainingObj, participant) {
      this.$buefy.dialog.confirm({
        title: 'Delete Training Objective',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.checkTO(trainingObj, participant)
      })
    },
    async checkTO(trainingObj, participant) {
      if (!trainingObj && !participant) return
      let checkEvaluations
      let checkFeedbacks = await this.checkFeedback(trainingObj)

      if (checkFeedbacks == null) {
        checkEvaluations = await this.checkEvaluation(trainingObj)
      }

      if (checkFeedbacks != null) {
        this.deleteFeedback(checkFeedbacks)
      } else if (checkFeedbacks == null && checkEvaluations != null) {
        await this.deleteEvaluation(checkEvaluations)
      } else if (checkFeedbacks == null && checkEvaluations == null) {
        await this.deleteTrainObj(trainingObj, participant)
      }
    },
    checkFeedback(trainingObj) {
      return this.$apollo
        .query({
          query: PlanFeedbacksRead,
          variables: {
            where: {
              evaluation: {
                trainingObjectives: {
                  id: trainingObj.id
                }
              }
            }
          }
        })
        .then(response => {
          if (
            response &&
            response.data &&
            response.data.planFeedbacks.length > 0
          ) {
            return response.data.planFeedbacks
          } else {
            return null
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    },
    checkEvaluation(trainingObj) {
      return this.$apollo
        .query({
          query: PlanEvaluationsRead,
          variables: {
            where: {
              trainingObjectives: {
                id: trainingObj.id
              }
            }
          }
        })
        .then(response => {
          if (
            response &&
            response.data &&
            response.data.planEvaluations.length > 0
          ) {
            return response.data.planEvaluations
          } else {
            return null
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    },
    refetchQuery() {
      this.$apollo.queries.planParticipant.refetch()
    },
    deleteTrainObj(trainingObj, participant) {
      if (!trainingObj && !participant) return
      let dataVariable = {
        trainingObjectives: { delete: { id: trainingObj.id } }
      }
      this.$apollo
        .mutate({
          mutation: PlanParticipantsUpdate,
          variables: {
            data: dataVariable,
            where: {
              id: participant.id
            }
          }
        })
        .then(response => {
          if (response) {
            this.$buefy.toast.open({
              message: 'Training Objective Deleted!',
              type: 'is-success'
            })
            this.cancel()
            this.refetchQuery()
          }
        })
    },
    deleteFeedback(record) {
      for (let i = 0; i < record.length; i++) {
        this.$apollo
          .mutate({
            mutation: PlanFeedbackDelete,
            variables: {
              id: {
                id: record[i].id
              }
            }
          })
          .then(response => {
            if (response) {
              this.$buefy.toast.open({
                message: 'Training Objective Deleted!',
                type: 'is-success'
              })
              this.refetchQuery()
            }
          })
      }
    },
    deleteEvaluation(record) {
      for (let i = 0; i < record.length; i++) {
        this.$apollo
          .mutate({
            mutation: PlanEvaluationsDelete,
            variables: {
              id: {
                id: record[i].id
              }
            }
          })
          .then(response => {
            if (response) {
              this.$buefy.toast.open({
                message: 'Training Objective Deleted!',
                type: 'is-success'
              })
              this.refetchQuery()
            }
          })
      }
    },
    cancel() {
      this.$emit('close')
    },
    editParticipant(participant) {
      this.$router.push({
        name: 'planParticipantEdit',
        params: { id: participant.id },
        query: { from: this.$route.fullPath }
      })
    },
    confirmDeleteParticipant(participantId) {
      this.$buefy.dialog.confirm({
        title: 'Delete Participant',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteParticipant(participantId)
      })
    },
    deleteParticipant(participantId) {
      this.$apollo
        .mutate({
          mutation: PlanParticipantsDelete,
          variables: {
            id: {
              id: participantId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Participant Deleted!',
            type: 'is-success'
          })
          this.refetchQuery()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Participant Deleted: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  .card-header {
    background-color: #038172;
  }
  .card-header-title {
    color: #ffffff;
  }
  .primary-check {
    color: #038172;
  }
}
</style>
