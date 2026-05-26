<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <span class="button is-primary"
                @click="openCreate()">Request Feedback</span>
        </div>
      </div>
      <div class="level-right">
        <help-content reference="plan.collect"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div v-if="planFeedbackRequests && planFeedbackRequests.length > 0">
      <b-table :data="planFeedbackRequests"
               hoverable
               :paginated="isPaginated"
               :per-page="perPage"
               :pagination-simple="isPaginationSimple"
               :default-sort-direction="defaultSortDirection"
               @dblclick="rowClick">
        <template slot-scope="props">
          <b-table-column field="feedbacks"
                          label="Feedback Count"
                          sortable>
            {{ props.row.feedbacks.count || 0}}
          </b-table-column>
          <b-table-column field="start"
                          label="Feedback Dates"
                          sortable>
            <span class="tooltip"
                  :data-tooltip="formatDate(props.row.start, 'utc-dtg')">{{ formatDate(props.row.start, 'dtg')}}</span>
            <span class="tooltip"
                  :data-tooltip="formatDate(props.row.end, 'utc-dtg')"
                  v-if="props.row.start && props.row.end"> - 
              {{ formatDate(props.row.end, 'dtg')}}
            </span>
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
              <b-dropdown-item @click="editFeedbackRequest(props.row)">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Feedback Request</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDelete(props.row)">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete Feedback Request</span>
              </b-dropdown-item>
            </b-dropdown>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div v-else>
      <empty-state :data="planFeedbackRequests"
                   :isLoading='$apollo.loading'>
        <template slot="action-buttons">
          <div class="buttons is-centered is-spaced">
            <span class="button is-primary"
                  @click="openCreate()">Request Feedback</span>
          </div>
        </template>
      </empty-state>
    </div>
    <request-interaction :open="openDialog"
                         :request="selectedFeedbackRequest"
                         @close="closeDialog"
                         :edit="edit" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import RequestInteraction from '@/plan/components/assess/request-interaction'
import PlanFeedbackRequest from '@/plan/model/planFeedbackRequest'
import {
  PlanFeedbackRequestsRead,
  PlanFeedbackRequestsDelete,
  PlanFeedbackRequestSubscription
} from '@/plan/graphql/PlanFeedbackRequests.gql'
export default {
  name: 'requests-list',
  components: {
    HelpContent,
    RequestInteraction
  },
  apollo: {
    planFeedbackRequests: {
      query: PlanFeedbackRequestsRead,
      subscribeToMore: {
        document: PlanFeedbackRequestSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planFeedbackRequest.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planFeedbackRequests: [
                  subscriptionData.data.planFeedbackRequest.node,
                  ...previousResult.planFeedbackRequests
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planFeedbackRequests: [
                  ...previousResult.planFeedbackRequests.filter(
                    obj =>
                      subscriptionData.data.planFeedbackRequest.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanFeedbackRequests = JSON.parse(
                JSON.stringify(previousResult.planFeedbackRequests)
              )
              let index = newPlanFeedbackRequests.findIndex(
                x => x.id === subscriptionData.data.planFeedbackRequest.node.id
              )
              newPlanFeedbackRequests[index] =
                subscriptionData.data.planFeedbackRequest.node
              newResult = {
                planFeedbackRequests: newPlanFeedbackRequests
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
      edit: false,
      openDialog: false,
      selectedFeedbackRequest: null,
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 15
    }
  },
  methods: {
    rowClick(row) {
      this.editFeedbackRequest(row)
    },
    closeDialog() {
      this.errors.clear()
      this.edit = false
      this.openDialog = false
      this.selectedFeedbackRequest = new PlanFeedbackRequest()
    },
    openCreate() {
      this.selectedFeedbackRequest = new PlanFeedbackRequest()
      this.openDialog = true
    },
    editFeedbackRequest(request) {
      this.edit = true
      this.selectedFeedbackRequest = request
      this.openDialog = true
    },
    confirmDelete(request) {
      this.$buefy.dialog.confirm({
        title: 'Delete Feedback Request',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteRequest(request.id)
      })
    },
    deleteRequest(id) {
      this.$apollo
        .mutate({
          mutation: PlanFeedbackRequestsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Request Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Request: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
