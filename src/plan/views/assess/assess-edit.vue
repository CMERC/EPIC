<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="'Assessment'" />
    <div class="columns"
         v-if="planAssessment && planAssessment.id != null">
      <div class="column is-6"
           v-if="trainingObj">
        <div centered
             class="is-size-6">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Participant Platform</th>
              </tr>
            </thead>
            <tr>
              <td>
                <span class="has-text-weight-light tooltip"
                      :data-tooltip="formatDate(trainingObj.updatedAt, 'utc-dtg')">{{formatDate(trainingObj.updatedAt, 'dtg')}}</span>
              </td>
              <td>
                {{trainingObj.participant.name}} - {{trainingObj.platform && trainingObj.platform.platform ? trainingObj.platform.platform.title +': ' + trainingObj.platform.platform.type : "None"}}
              </td>
            </tr>
          </table>
          <h4 class="title is-4">
            {{trainingObj.jmet && trainingObj.jmet.description}}
          </h4>
          <table class="table">
            <thead>
              <tr>
                <th>Requested Method</th>
                <th>Training Method</th>
                <th>Associated Inject</th>
              </tr>
            </thead>
            <tr>
              <td>
                {{ trainingObj.requestedMethodType && trainingObj.requestedMethodType.title ? trainingObj.requestedMethodType.title : "None" }}</td>
              <td>{{ trainingObj.trainedMethodType && trainingObj.trainedMethodType.title ? trainingObj.trainedMethodType.title : "None" }}</td>
              <td> {{ trainingObj.injects ? trainingObj.injects.length : 0 }}</td>
            </tr>
            <tr>
              <td colspan="3">
                <h4 class="title is-5">
                  Task
                </h4>
                <pre class="content">{{trainingObj.task}}</pre>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <h4 class="title is-5">
                  Condition
                </h4>
                <pre class="content">{{trainingObj.condition}}</pre>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <h4 class="title is-5">
                  Standard
                </h4>
                <pre class="content">{{trainingObj.standard}}</pre>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <h4 class="title is-5">
                  Injects
                </h4>
                <ul class="is-list-none">
                  <li v-for="inject in trainingObj.injects"
                      :key="inject.id">
                    <a @click="previewInject(inject.id)"
                       class="subtitle is-6 is-link inject-link">
                      #{{inject.number}} - {{inject.title}} - {{formatDate(inject.startDate, 'dtg')}}
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="column is-6"
           v-if="planAssessment">
        <div class="box">
          <div class="field">
            <label class="label">
              Was this training objective completed?
            </label>
            <div class="buttons has-addons">
              <span class="button"
                    :class="{'is-success is-selected':planAssessment.complete}"
                    @click="updateCompleteness(true)">Yes</span>
              <span class="button"
                    :class="{'is-danger is-selected':!planAssessment.complete}"
                    @click="updateCompleteness(false)">No</span>
            </div>
          </div>
          <div class="field"
               v-if="planAssessment.complete">
            <label class="label">
              To which level of effectiveness was this objective completed?
            </label>
            <div class="buttons has-addons">
              <span class="button"
                    :class="{'is-success is-selected':planAssessment.status==='TRAINED'}"
                    @click="updateEffectiveness('TRAINED')">Trained</span>
              <span class="button"
                    :class="{'is-warning is-selected':planAssessment.status==='PARTIALLY'}"
                    @click="updateEffectiveness('PARTIALLY')">Partially Trained</span>
              <span class="button"
                    :class="{'is-danger is-selected':planAssessment.status==='UNTRAINED'}"
                    @click="updateEffectiveness('UNTRAINED')">Untrained</span>
            </div>
          </div>
          <div class="field"
               v-if="showReasons">
            <label class="label">
              Why was the objective not effective?
            </label>
            <div class="control is-expanded">
              <multiselect v-model="planAssessmentReason"
                           track-by="id"
                           placeholder="Select a reason"
                           :options="planReasons"
                           :name="'Reasons'"
                           v-validate.immediate="'required'"
                           openDirection="bottom"
                           :internal-search="false"
                           @search-change="search('Reason', $event)">
                <template slot="singleLabel"
                          slot-scope="{ option }">
                  {{ option.title }}
                </template>
                <template slot="option"
                          slot-scope="{ option }">
                  {{ option.title }}
                </template>
                <template class="multiselect_element"
                          slot="beforeList">
                  <span class="multiselect__option"
                        @click="showAddValue('Reason')">
                    <span> Add new... </span>
                  </span>
                  <hr class="dropdown-divider">
                </template>
              </multiselect>
            </div>
          </div>
          <div class=" field">
            <label class="label">
              Comment
            </label>
            <div class="control">
              <div class="has-background-white"
                   style="height: 100%">
                <textarea class="textarea"
                          v-model="planAssessment.comment"
                          placeholder="Task Performance Observation"></textarea>
              </div>
            </div>
          </div>
          <div class="box"
               v-if="trainingObj && planAssessment.complete">
            <label class="label">
              Measures
            </label>
            <div class="field"
                 v-for="measureData in measuresData"
                 :key="measureData.measure.id">
              <label class="subtitle is-5">
                {{measureData.measure.title}}
              </label>
              <div class="control">
                <input class="input"
                       v-model="measureData.value"
                       type="text" />
              </div>
            </div>
          </div>
          <div class="field is-grouped is-grouped-left">
            <a class="button is-primary"
               @click="updatePlanAssessment">
              Save
            </a>
            <a class="button"
               @click="$router.go(-1)">
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <empty-state :data="planAssessment"
                   :isLoading='$apollo.loading' />
    </div>
    <inject-preview :open="previewModal"
                    :showStatusButton="false"
                    :id="selectedInject"
                    @close="closeModal"></inject-preview>
  </div>
</template>

<script>
import { serverError } from '@/shared/serverError'
import InjectPreview from '@/plan/components/inject-preview'

import { PlanTrainingObjectivesRead } from '@/plan/graphql/PlanTrainingObjectives.gql'
import {
  PlanAssessmentRead,
  PlanAssessmentsUpdate
} from '@/plan/graphql/PlanAssessments.gql'
import { PublicPlanReasonCreate } from '@/web/graphql/PlanFeedback.gql'
import { PlanReasonsRead } from '@/plan/graphql/PlanReasons.gql'
export default {
  name: 'assess-edit',
  props: {
    id: {}
  },
  components: {
    InjectPreview
  },
  apollo: {
    planReasons: {
      query: PlanReasonsRead,
      variables() {
        return {
          where: {
            title_contains: this.searchQuery.reason
          }
        }
      }
    },
    planAssessment: {
      query: PlanAssessmentRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      update(data) {
        if (data && data.planAssessment) {
          if (data.planAssessment.reason)
            this.planAssessmentReason = data.planAssessment.reason
          return JSON.parse(JSON.stringify(data.planAssessment))
        }
      }
    },
    trainingObj: {
      query: PlanTrainingObjectivesRead,
      variables() {
        return {
          where: {
            assessments_some: {
              id: this.id
            }
          }
        }
      },
      update(data) {
        this.measuresData = []
        if (data && data.planTrainingObjectives) {
          let trainingObjectives = JSON.parse(
            JSON.stringify(data.planTrainingObjectives)
          )
          if (
            this.planAssessment.measureData &&
            this.planAssessment.measureData.length > 0
          )
            this.measuresData = this.planAssessment.measureData
          else if (
            trainingObjectives[0].measures &&
            trainingObjectives[0].measures.length > 0
          ) {
            trainingObjectives[0].measures.forEach(element => {
              this.measuresData.push({ measure: element, value: '' })
            })
          }
          return trainingObjectives[0]
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      previewModal: false,
      selectedInject: null,
      planAssessment: null,
      trainingObj: null,
      planAssessmentReason: null,
      measuresData: [],
      searchQuery: {
        reason: ''
      }
    }
  },
  methods: {
    previewInject(val) {
      this.previewModal = true
      this.selectedInject = val
    },
    closeModal() {
      this.previewModal = false
      this.selectedInject = null
    },
    updatePlanAssessment() {
      if (this.planAssessment.id) {
        let data = {
          complete: this.planAssessment.complete,
          comment: this.planAssessment.comment,
          status: this.planAssessment.status
        }
        let planReason
        if (
          this.planAssessment.complete &&
          this.planAssessment.status === 'TRAINED'
        ) {
          // For reports - if an assessment is Complete and Trained it should not contain a reason in db as well
          if (this.planAssessment.reason && this.planAssessment.reason.id) {
            planReason = {
              delete: {
                id: this.planAssessment.reason.id
              }
            }
          }
        } else {
          if (this.planAssessmentReason) {
            planReason = {
              connect: {
                id: this.planAssessmentReason.id
              }
            }
          }
        }

        if (planReason) {
          data = {
            ...data,
            reason: planReason
          }
        }
        // Measures Data
        let planMeasuresData
        if (
          this.planAssessment.measureData &&
          this.planAssessment.measureData.length > 0
        ) {
          //update
          let updateData = []
          if (this.planAssessment.complete) {
            this.measuresData.forEach(element => {
              updateData.push({
                where: { id: element.id },
                data: {
                  measure: {
                    connect: { id: element.measure.id }
                  },
                  value: element.value
                }
              })
            })
            planMeasuresData = {
              update: updateData
            }
          } else {
            // delete existing data
            this.measuresData.forEach(element => {
              updateData.push({
                id: element.id
              })
            })
            planMeasuresData = {
              delete: updateData
            }
          }
        } else {
          //create
          if (this.planAssessment.complete) {
            let createData = []
            this.measuresData.forEach(element => {
              createData.push({
                measure: {
                  connect: { id: element.measure.id }
                },
                value: element.value
              })
            })
            planMeasuresData = {
              create: createData
            }
          }
        }
        if (planMeasuresData)
          data = {
            ...data,
            measureData: planMeasuresData
          }
        // Update
        this.$apollo
          .mutate({
            mutation: PlanAssessmentsUpdate,
            variables: {
              data,
              where: {
                id: this.planAssessment.id
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.$router.go(-1)
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
          })
      }
    },
    updateEffectiveness(value) {
      this.planAssessment.status = value
    },
    updateCompleteness(value) {
      this.planAssessment.complete = value
    },
    showAddValue(name) {
      let msg
      switch (name) {
        case 'Reason':
          msg = 'Ineffective Reason'
          break
      }
      this.$buefy.dialog.prompt({
        message: msg,
        inputAttrs: {
          placeholder: '',
          maxlength: 75
        },
        confirmText: 'Add',
        onConfirm: value => this.addValueToDB(name, value)
      })
    },
    addValueToDB(name, value) {
      let createQuery
      let data
      switch (name) {
        case 'Reason': {
          createQuery = PublicPlanReasonCreate
          data = {
            workspace: this.$route.params.workspace,
            planReason: {
              title: value
            }
          }
          break
        }
      }
      if (createQuery && data)
        this.$apollo
          .mutate({
            mutation: createQuery,
            variables: {
              data: data
            }
          })
          .then(response => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            switch (name) {
              case 'Reason': {
                this.planAssessmentReason = response.data.createPlanReasonPublic
                this.$apollo.queries.planReasons.refetch()
                break
              }
            }
          })
    },
    search(table, term) {
      switch (table) {
        case 'Reason':
          this.searchQuery.reason = term
          break
      }
    }
  },
  computed: {
    showReasons() {
      return (
        !this.planAssessment.complete ||
        this.planAssessment.status === 'UNTRAINED' ||
        this.planAssessment.status === 'PARTIALLY'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
