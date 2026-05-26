<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <a class="button is-primary"
           @click="toggleCreateAssessment">
          Create Assessment
        </a>
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
          <help-content :reference="'plan.assessment'"
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
    <div class="columns is-mobile">
      <div class="column"
           v-if="planAssessments && planAssessments.length > 0">
        <b-table :data="planAssessments"
                 hoverable
                 :loading="false"
                 paginated
                 :per-page="25"
                 :pagination-simple="false"
                 :default-sort-direction="'asc'"
                 default-sort="createdAt"
                 aria-next-label="Next page"
                 aria-previous-label="Previous page"
                 aria-page-label="Page" 
                 aria-current-label="Current page" 
                 @dblclick="rowClick">
          <template slot-scope="props">
            <b-table-column field="createdAt"
                            label="Created Date"
                            sortable>
              <span class="tooltip"
                    :data-tooltip="formatDate(props.row.createdAt, 'utc-dtg')">{{ formatDate(props.row.createdAt, 'dtg')}}</span>
            </b-table-column>
            <b-table-column field="updatedAt"
                            label="Updated Date"
                            sortable>
              <span class="tooltip"
                    :data-tooltip="formatDate(props.row.updatedAt, 'utc-dtg')">{{ formatDate(props.row.updatedAt, 'dtg')}}</span>
            </b-table-column>
            <b-table-column field="complete"
                            label="TO Completed"
                            sortable>
              {{props.row.complete?'Yes':'No'}}
            </b-table-column>
            <b-table-column field="status"
                            label="Status"
                            sortable>
              <span v-if="props.row.status"
                    class="is-capitalized">{{props.row.status.toLowerCase()}}</span>
            </b-table-column>
            <b-table-column field="reason"
                            label="Reason">
              <span v-if="props.row.reason">{{props.row.reason.title}}</span>
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
                <b-dropdown-item @click="viewPlanAssessment(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit Assessment</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDeleteAssessment(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Assessment</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planAssessments"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="toggleCreateAssessment">
                Create Assessment
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <assess-create :open="showDialog"
                   @close="toggleCreateAssessment" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanAssessmentDelete,
  PlanAssessmentsRead,
  PlanAssessmentSubscription
} from '@/plan/graphql/PlanAssessments.gql'

import helpers from '@/shared/mixins/helpers'
import lightOrDark from '@/shared/mixins/lightOrDark'
import AssessCreate from '@/plan/components/assess/assess-create'

export default {
  name: 'AssessList',
  mixins: [helpers, lightOrDark],
  components: { HelpContent, AssessCreate },
  apollo: {
    planAssessments: {
      query: PlanAssessmentsRead,
      variables() {
        let data = this.planAssessmentsReadVariables()
        return data
      },
      subscribeToMore: {
        document: PlanAssessmentSubscription,
        variables() {
          let datafromread = this.planAssessmentsReadVariables()
          delete datafromread.orderBy
          let data = {
            node: datafromread
          }
          return data
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planAssessment.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planAssessments: [
                  subscriptionData.data.planAssessment.node,
                  ...previousResult.planAssessments
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planAssessments: [
                  ...previousResult.planAssessments.filter(
                    obj =>
                      subscriptionData.data.planAssessment.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanAssessments = JSON.parse(
                JSON.stringify(previousResult.planAssessments)
              )
              let index = newPlanAssessments.findIndex(
                x => x.id === subscriptionData.data.planAssessment.node.id
              )
              newPlanAssessments[index] =
                subscriptionData.data.planAssessment.node
              newResult = {
                planAssessments: newPlanAssessments
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
    }
  },
  data() {
    return {
      perPage: '25',
      searchQuery: '',
      showDialog: false
    }
  },
  methods: {
    planAssessmentsReadVariables() {
      let whereData = {}
      if (this.searchQuery) {
        whereData = {
          OR: [
            { reason: { title_contains: this.searchQuery } },
            {
              measureData_some: {
                OR: [
                  { value_contains: this.searchQuery },
                  {
                    measure: {
                      OR: [{ title_contains: this.searchQuery }]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
      let data = {
        where: whereData,
        orderBy: 'createdAt_ASC'
      }
      return data
    },
    rowClick(row) {
      this.viewPlanAssessment(row.id)
    },
    toggleCreateAssessment() {
      this.showDialog = !this.showDialog
    },
    editPlanAssessment(assessmentID) {
      this.$router.push({
        name: 'editassess',
        params: { id: assessmentID }
      })
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
          this.$apollo.queries.planAssessments.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Assessment: ' + error)
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
    viewPlanAssessment(assessmentID) {
      this.$router.push({
        name: 'editassess',
        params: { id: assessmentID }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-list {
  li {
    margin: 0.25rem auto;
  }
}
</style>
