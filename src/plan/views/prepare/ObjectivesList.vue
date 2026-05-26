<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <span class="button is-primary"
                @click="showCreateTrainingObj()">Create Training Objective</span>
        </div>
      </div>
      <div class="level-right">
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
          <help-content :reference="'plan.prepare.trainingobjective'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <nav class="level">
      <div class="level-left">
        <div class="level-item"></div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <span class="has-text-weight-semibold">{{planTrainingObjectivesCount}} Training Objectives</span>
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

    <div v-if="planTrainingObjectives && planTrainingObjectives.length>0">
      <b-table :data="planTrainingObjectives"
               striped
               :paginated="isPaginated"
               :total="planTrainingObjectivesCount"
               :per-page="perPage"
               :current-page.sync="currentPage"
               :pagination-simple="isPaginationSimple"
               :default-sort-direction="defaultSortDirection"
               detailed
               detail-key="id"
               default-sort="participant.name" 
               backend-pagination 
               @page-change="onPageChange">
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
          <b-table-column field="participant.name"
                          label="Participant"
                          centered
                          sortable
                          class="is-size-6">
            {{ props.row.participant ? props.row.participant.name : "None" }}
          </b-table-column>
          <b-table-column field="platform.platform.title"
                          label="Platform: Type"
                          centered
                          class="is-size-6"
                          sortable>
            {{props.row.platform && props.row.platform.platform && props.row.platform.platform.title ? props.row.platform.platform.title +': ' + props.row.platform.platform.type : "None"}}
          </b-table-column>
          <b-table-column field="jmet.description"
                          label="JMET"
                          sortable
                          class="is-size-6">
            {{ props.row.jmet ? props.row.jmet.description : "None" }}
          </b-table-column>
          <b-table-column field="requestedMethodType.title"
                          label="Requested Method"
                          centered
                          class="is-size-6"
                          sortable>
            {{ props.row.requestedMethodType ? props.row.requestedMethodType.title : "None" }}
          </b-table-column>
          <b-table-column field="requiredRuns"
                          label="Required Runs"
                          centered
                          class="is-size-6"
                          sortable>
            {{ props.row.requiredRuns ? props.row.requiredRuns : "None" }}
          </b-table-column>
          <b-table-column field="injectCount"
                          label="Inject Count"
                          centered
                          class="is-size-6"
                          sortable>
            {{ props.row.injects ? props.row.injects.length : "None" }}
          </b-table-column>
          <b-table-column>
            <b-dropdown position="is-bottom-left">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="editTO(props.row, props.row.participant)">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Training Objective</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDeleteTO(props.row, props.row.participant)">
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
                    <pre class="content">{{props.row.task}}</pre>
                  </div>
                  <div class="column is-full">
                    <label class="label">
                      Condition
                    </label>
                    <pre class="content">{{props.row.condition}}</pre>
                  </div>
                  <div class="column is-full">
                    <label class="label">
                      Standard
                    </label>
                    <pre class="content">{{props.row.standard}}</pre>
                  </div>
                  <div class="column is-full">
                    <label class="label">
                      Measures
                    </label>
                    <ul class="bd-anchors-list"
                        v-if="props.row.measures.length > 0">
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
                      Command Training Priorities
                    </label>
                    <div v-if="props.row.commandTrainingPriority.length > 0">
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
                    <div v-if="props.row.jointStaffTrainingPriority.length > 0">
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
                <div class="columns is-multiline">
                  <div class="column is-half">
                    <label class="label">
                      Exercise Objectives
                    </label>
                    <div v-if="props.row.exerciseObjective.length > 0">
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
                  <div class="column is-half">
                    <label class="label">
                      Accredited Tasks
                    </label>
                    <div v-if="props.row.accreditedTask.length > 0">
                      <ul class="bd-anchors-list">
                        <li v-for="accTask in props.row.accreditedTask"
                            v-bind:key="accTask.id">
                          <p class="subtitle is-6">{{accTask.jmet.description}}</p>
                        </li>
                      </ul>
                    </div>
                    <div v-else>
                      <p class="subtitle is-6">None</p>
                    </div>
                  </div>
                  <div class="column is-full">
                    <label class="label">
                      Associated Injects
                    </label>

                    <ul class="bd-anchors-list"
                        v-if="props.row.injects.length > 0">
                      <li v-for="inject in props.row.injects"
                          v-bind:key="inject.id">
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
                         class="no-result apollo">
                      <p class="subtitle is-6">None</p>
                    </div>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-narrow">
                    <div class="field is-grouped">
                      <p class="control">
                        <a class="button is-primary"
                           @click="editTO(props.row, props.row.participant)">Edit</a>
                      </p>
                      <p class="control">
                        <a class="button is-danger is-outlined"
                           @click="confirmDeleteTO(props.row, props.row.participant)">Delete</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </template>
      </b-table>
    </div>
    <div v-else>
      <empty-state :data="planTrainingObjectives"
                   :search="searchQuery ? true : false"
                   :isLoading='$apollo.loading'>
        <template slot="action-buttons">
          <div class="buttons is-centered is-spaced">
            <span class="button is-primary"
                  @click="showCreateTrainingObj()">Create Training Objective</span>
          </div>
        </template>
      </empty-state>
    </div>

    <TrainingObjective-QuickAdd v-if="showTrainingObj"
                                :open="showTrainingObj"
                                @close="closeShowTrainingObj" />
    <inject-preview v-if="previewModal"
                    :open="previewModal"
                    :showStatusButton="false"
                    :id="selectedInject"
                    @close="closeModal"></inject-preview>
  </div>
</template>
<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanTrainingObjectiveCounts,
  PlanTrainingObjectivesDelete,
  PlanTrainingObjectivesList,
  PlanTrainingObjectiveSubscription
} from '@/plan/graphql/PlanTrainingObjectives.gql'
import TrainingObjectiveQuickAdd from '@/plan/components/trainingObjective-quickadd'

import {
  PlanEvaluationsRead,
  PlanEvaluationsDelete
} from '@/plan/graphql/PlanEvaluations.gql'

import {
  PlanFeedbacksRead,
  PlanFeedbackDelete
} from '@/plan/graphql/PlanFeedback.gql'

import InjectPreview from '@/plan/components/inject-preview'
import helpers from '@/shared/mixins/helpers'

import { serverError } from '@/shared/serverError'
import lightOrDark from '@/shared/mixins/lightOrDark'
export default {
  name: 'objectives-list',
  mixins: [helpers, lightOrDark],
  components: {
    HelpContent,
    InjectPreview,
    TrainingObjectiveQuickAdd
  },
  apollo: {
    planTrainingObjectivesCount: {
      query: PlanTrainingObjectiveCounts,
      variables() {
        let data = this.trainingObjectiveReadVariables()
        delete data.skip
        delete data.first
        return data
      },
      update(data) {
        if (
          data &&
          data.planTrainingObjectivesConnection &&
          data.planTrainingObjectivesConnection.aggregate
        ) {
          return data.planTrainingObjectivesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planTrainingObjectives: {
      query: PlanTrainingObjectivesList,
      variables() {
        let data = this.trainingObjectiveReadVariables()
        return data
      },
      update(data) {
        if (
          data &&
          data.planTrainingObjectives &&
          data.planTrainingObjectives.length > 0
        ) {
          this.$apollo.queries.planTrainingObjectivesCount.refetch()
          return data.planTrainingObjectives
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanTrainingObjectiveSubscription,
        variables() {
          let datafromread = this.trainingObjectiveReadVariables()
          delete datafromread.skip
          delete datafromread.first
          delete datafromread.orderBy
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
    }
  },
  data() {
    return {
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 25,
      skip: 0,
      searchQuery: '',
      planTrainingObjectives: [],
      isEdit: false,
      showTrainingObj: false,
      previewModal: false,
      selectedInject: null
    }
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this.skip = (this.currentPage - 1) * this.perPage
    },
    trainingObjectiveReadVariables() {
      let data = {
        where: {
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
        },
        skip: this.skip,
        first: this.perPage
      }
      return data
    },
    previewInject(val) {
      this.previewModal = true
      this.selectedInject = val
    },
    closeModal() {
      this.previewModal = false
      this.selectedInject = null
    },
    showCreateTrainingObj() {
      this.showTrainingObj = true
    },
    closeShowTrainingObj() {
      this.showTrainingObj = false
    },
    editTO(trainingObj, participant) {
      this.$router.push({
        name: 'planTrainingObjectiveView',
        params: {
          id: participant.id,
          trainingObjID: trainingObj.id,
          isEdit: true
        },
        query: { from: this.$route.fullPath }
      })
    },
    confirmDeleteTO(trainingObj) {
      this.$buefy.dialog.confirm({
        title: 'Delete Training Objective',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.checkTO(trainingObj)
      })
    },
    deleteTrainObj(trainObj) {
      this.$apollo
        .mutate({
          mutation: PlanTrainingObjectivesDelete,
          variables: {
            id: {
              id: trainObj.id
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
    },
    async checkTO(trainingObj) {
      if (!trainingObj) return
      let checkEvaluations
      let checkFeedbacks = await this.checkFeedback(trainingObj)

      if (checkFeedbacks == null) {
        checkEvaluations = await this.checkEvaluation(trainingObj)
      }

      if (checkFeedbacks != null) {
        await this.deleteFeedback(checkFeedbacks)
      } else if (checkFeedbacks == null && checkEvaluations != null) {
        await this.deleteEvaluation(checkEvaluations)
      } else if (checkFeedbacks == null && checkEvaluations == null) {
        await this.deleteTrainObj(trainingObj)
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
      this.$apollo.queries.planTrainingObjectives.refetch()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  .objectives-section {
    .card-header {
      background-color: #038172;
    }
    .card-header-title {
      color: rgb(255, 255, 255);
    }
    .inject-link {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.modal-card,
.modal-card-body {
  overflow: visible !important;
}
</style>
