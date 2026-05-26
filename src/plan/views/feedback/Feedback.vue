<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <a class="button is-primary"
           @click="showCreateFeedbackDialog()">
          Create Feedback
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
          <help-content :reference="'plan.feedback'"
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
    <div v-if="planFeedbacks && planFeedbacks.length > 0">
      <b-table :data="planFeedbacks"
               hoverable
               :loading="loading"
               paginated
               :per-page="perPage"
               :pagination-simple="isPaginationSimple"
               :default-sort-direction="defaultSortOrder"
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
          <b-table-column field="evaluation.trainingObjectives.participant.name"
                          label="Participant"
                          centered
                          class="is-size-6">
            <span v-if="props.row.evaluation.trainingObjectives">
              {{ props.row.evaluation.trainingObjectives.participant ? props.row.evaluation.trainingObjectives.participant.name : "None" }}
            </span>
          </b-table-column>
          <b-table-column field="evaluation.trainingObjectives.platform.platform.title"
                          label="Platform: Type"
                          centered
                          class="is-size-6">
            <span v-if="props.row.evaluation.trainingObjectives && props.row.evaluation.trainingObjectives.platform">
              {{props.row.evaluation.trainingObjectives.platform.platform && props.row.evaluation.trainingObjectives.platform.platform.title ? props.row.evaluation.trainingObjectives.platform.platform.title +': ' + props.row.evaluation.trainingObjectives.platform.platform.type : "None"}}
            </span>
          </b-table-column>
          <b-table-column field="lessonsLearned"
                          label="Lessons Learned">
            {{props.row.lessonsLearned ? props.row.lessonsLearned.length : 0}}
          </b-table-column>
          <b-table-column field="metrics"
                          label="Metrics">
            {{props.row.metrics ? 'Yes' : 'No'}}
          </b-table-column>
          <b-table-column field="qualifications"
                          label="Qualifications">
            {{props.row.qualifications ? props.row.qualifications.length : 0}}
          </b-table-column>
          <b-table-column field="tasks"
                          label="Tasks">
            {{props.row.tasks ? props.row.tasks.length : 0}}
          </b-table-column>
          <b-table-column field="status"
                          label="Status">
            <span class="tag is-rounded"
                  v-if="props.row.status ==='DRAFT'">Draft</span>
            <span class="tag is-rounded is-warning"
                  v-else-if="props.row.status ==='SENT'">Sent</span>
            <span class="tag is-rounded is-success"
                  v-else-if="props.row.status ==='SUBMITTED'">Submitted</span>
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
              <b-dropdown-item @click="viewPlanFeedback(props.row.id)">
                <span class="icon is-small">
                  <i class="fas fa-eye"></i>
                </span>
                <span>View Feedback</span>
              </b-dropdown-item>
              <b-dropdown-item @click="editPlanFeedback(props.row.id)">
                <span class="icon is-small">
                  <i class="fas fa-eye"></i>
                </span>
                <span>Edit Feedback</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDeleteFeedback(props.row.id)">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete Feedback</span>
              </b-dropdown-item>
            </b-dropdown>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div v-else>
      <empty-state :data="planFeedbacks"
                   :search="searchQuery ? true : false"
                   :isLoading='$apollo.loading'>
        <template slot="action-buttons">
          <div class="buttons is-centered is-spaced">
            <a class="button is-primary"
               @click="showCreateFeedbackDialog()">
              Create Feedback
            </a>
          </div>
        </template>
      </empty-state>
    </div>
    <feedback-create :open="showFeedbackDialog"
                     @close="closeCreateFeedback" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanFeedbackDelete,
  PlanFeedbacksRead,
  PlanFeedbacksUpdate,
  PlanFeedbackSubscription
} from '@/plan/graphql/PlanFeedback.gql'

import helpers from '@/shared/mixins/helpers'
import lightOrDark from '@/shared/mixins/lightOrDark'
import FeedbackCreate from '@/plan/components/assess/feedback-create'

export default {
  name: 'Feedback',
  mixins: [helpers, lightOrDark],
  components: { HelpContent, FeedbackCreate },
  apollo: {
    planFeedbacks: {
      query: PlanFeedbacksRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planFeedbacks) {
          return data.planFeedbacks
        }
      },
      subscribeToMore: {
        document: PlanFeedbackSubscription,
        variables() {
          let datafromread = this.queryVariables()
          delete datafromread.orderBy

          let data = {
            node: datafromread
          }
          return data
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
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
        }
      }
    }
  },
  data() {
    return {
      eventID: this.$route.query.event ? this.$route.query.event : '',
      selectedParticipant: null,
      searchQuery: '',
      loading: false,
      orderBy: 'createdAt_ASC',
      defaultSortOrder: 'asc',
      isPaginationSimple: false,
      perPage: '25',
      selectedInject: null,
      previewModal: false,
      showFeedbackDialog: false,
      planFeedback: {
        complete: true,
        reason: '',
        comment: ''
      }
    }
  },
  methods: {
    queryVariables() {
      let data = {
        where: {
          OR: [
            {
              evaluation: {
                trainingObjectives: {
                  OR: [
                    {
                      platform: {
                        platform: {
                          OR: [
                            { title_contains: this.searchQuery },
                            { type_contains: this.searchQuery }
                          ]
                        }
                      }
                    },
                    {
                      participant: {
                        OR: [{ name_contains: this.searchQuery }]
                      }
                    }
                  ]
                }
              }
            }
          ]
        },
        orderBy: 'createdAt_ASC'
      }
      return data
    },
    rowClick(row) {
      this.viewPlanFeedback(row.id)
    },
    showCreateFeedbackDialog() {
      this.showFeedbackDialog = true
    },
    closeCreateFeedback() {
      this.showFeedbackDialog = false
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
            'Feedback: Disconnecting TO from Feedback/Evaluation: ' + error
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
            this.$apollo.queries.planFeedbacks.refetch()
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
    confirmDeleteFeedback(feedbackID) {
      this.$buefy.dialog.confirm({
        title: 'Delete Feedback',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePlanFeedback(feedbackID)
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
.menu-list {
  li {
    margin: 0.25rem auto;
  }
}
</style>
