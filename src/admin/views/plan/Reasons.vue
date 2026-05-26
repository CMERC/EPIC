<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreateReason()">
            Create Assessment Reason
          </a>
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
          <help-content reference="settings.reasons"
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
          <span class="has-text-weight-semibold">{{planReasonsCounts}} Assessment Reasons</span>
        </div>
        <div class="level-item">
          <div class="select">
            <select v-model.number="perPage">
              <option value="15">
                15 per page
              </option>
              <option value="30">
                30 per page
              </option>
              <option value="60">
                60 per page
              </option>
              <option value="120">
                120 per page
              </option>
            </select>
          </div>
        </div>
      </div>
    </nav>
    <div class="columns">
      <div class="column"
           v-if="planReasons && planReasons.length > 0">
        <b-table :data="planReasons"
                 :paginated="isPaginated"
                 :per-page="perPage"
                 :pagination-simple="isPaginationSimple"
                 :default-sort-direction="defaultSortDirection"
                 default-sort="title">
          <template slot-scope="props">
            <b-table-column field="title"
                            label="Title"
                            sortable>
              {{ props.row.title }}
            </b-table-column>
            <b-table-column>
              <b-dropdown position="is-bottom-left">
                <a class="button is-small"
                   slot="trigger">
                  <span class="icon is-small">
                    <i class="fas fa-ellipsis-v"></i>
                  </span>
                </a>
                <b-dropdown-item @click="openEditReason(props.row)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit Reason</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Reason</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planReasons"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreateReason()">
                Create Assessment Reason
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <reason-interaction :open="openDialog"
                        :reason="selectedReason"
                        @close="closeDialog"
                        :edit="edit" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import PlanReason from '@/plan/model/planReason'
import ReasonInteraction from '@/admin/components/reason-interaction'
import {
  PlanReasonsCounts,
  PlanReasonsRead,
  PlanReasonSubscription,
  PlanReasonsDelete
} from '@/plan/graphql/PlanReasons.gql'
export default {
  name: 'plan-reasons',
  components: {
    ReasonInteraction,
    HelpContent
  },
  apollo: {
    planReasonsCounts: {
      query: PlanReasonsCounts,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planReasonsConnection) {
          return data.planReasonsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planReasons: {
      query: PlanReasonsRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planReasons) {
          this.$apollo.queries.planReasonsCounts.refetch()
          return data.planReasons
        }
      },
      subscribeToMore: {
        document: PlanReasonSubscription,
        variables() {
          let datafromread = this.queryVariables()
          let data = {
            node: datafromread
          }
          return data
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planReason.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planReasons: [
                  subscriptionData.data.planReason.node,
                  ...previousResult.planReasons
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planReasons: [
                  ...previousResult.planReasons.filter(
                    obj =>
                      subscriptionData.data.planReason.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanReasons = JSON.parse(
                JSON.stringify(previousResult.planReasons)
              )
              let index = newPlanReasons.findIndex(
                x => x.id === subscriptionData.data.planReason.node.id
              )
              newPlanReasons[index] = subscriptionData.data.planReason.node
              newResult = {
                planReasons: newPlanReasons
              }
              break
            }
            default: {
              throw new Error(`Unknown Reason mutation`)
            }
          }
          return newResult
        }
      }
    }
  },
  data() {
    return {
      searchQuery: '',
      edit: false,
      openDialog: false,
      selectedReason: null,
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 15
    }
  },
  methods: {
    queryVariables() {
      let data = {
        where: {
          title_contains: this.searchQuery
        }
      }
      return data
    },
    closeDialog() {
      this.errors.clear()
      this.edit = false
      this.openDialog = false
      this.selectedStatus = new PlanReason()
    },
    openCreateReason() {
      this.selectedReason = new PlanReason()
      this.openDialog = true
    },
    openEditReason(reason) {
      this.edit = true
      this.selectedReason = reason
      this.openDialog = true
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Reason',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteReason(id)
      })
    },
    deleteReason(id) {
      this.$apollo
        .mutate({
          mutation: PlanReasonsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Reason Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Reason: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
