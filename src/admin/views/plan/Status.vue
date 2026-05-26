<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreateStatus()">
            Create Status
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
          <help-content reference="settings.labels"
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
          <span class="has-text-weight-semibold">{{planLabelsCounts}} Labels</span>
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
           v-if="planLabels && planLabels.length > 0">
        <b-table :data="planLabels"
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
            <b-table-column field="description"
                            label="Description"
                            sortable>
              {{ props.row.description }}
            </b-table-column>
            <b-table-column field="color"
                            label="Color">
              <span class="tag is-rounded"
                    :style="'background-color:'+props.row.color"
                    :class="lightOrDark(props.row.color)">
                {{props.row.title}}
              </span>
            </b-table-column>
            <b-table-column>
              <b-dropdown position="is-bottom-left">
                <a class="button is-small"
                   slot="trigger">
                  <span class="icon is-small">
                    <i class="fas fa-ellipsis-v"></i>
                  </span>
                </a>
                <b-dropdown-item @click="openEditStatus(props.row)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit Status</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Status</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planLabels"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreateStatus()">
                Create Status
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <label-interaction :open="openDialog"
                       :status="selectedStatus"
                       @close="closeDialog"
                       :edit="edit" />
  </div>

</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import LabelInteraction from '@/admin/components/label-interaction'
import {
  PlanLabelsCounts,
  PlanLabelsRead,
  PlanLabelsDelete,
  PlanLabelSubscription
} from '@/plan/graphql/PlanLabels.gql'
import PlanLabel from '@/plan/model/planlabel'
import lightOrDark from '@/shared/mixins/lightOrDark'

export default {
  name: 'status-labels',
  components: {
    LabelInteraction,
    HelpContent
  },
  mixins: [lightOrDark],
  apollo: {
    planLabelsCounts: {
      query: PlanLabelsCounts,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planLabelsConnection) {
          return data.planLabelsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planLabels: {
      query: PlanLabelsRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planLabels) {
          this.$apollo.queries.planLabelsCounts.refetch()
          return data.planLabels
        }
      },
      subscribeToMore: {
        document: PlanLabelSubscription,
        variables() {
          let datafromread = this.queryVariables()
          let data = {
            node: datafromread
          }
          return data
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planLabel.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planLabels: [
                  subscriptionData.data.planLabel.node,
                  ...previousResult.planLabels
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planLabels: [
                  ...previousResult.planLabels.filter(
                    obj =>
                      subscriptionData.data.planLabel.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanLabels = JSON.parse(
                JSON.stringify(previousResult.planLabels)
              )
              let index = newPlanLabels.findIndex(
                x => x.id === subscriptionData.data.planLabel.node.id
              )
              newPlanLabels[index] = subscriptionData.data.planLabel.node
              newResult = {
                planLabels: newPlanLabels
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
      searchQuery: '',
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 15,
      edit: false,
      selectedStatus: null,
      openDialog: false
    }
  },
  methods: {
    queryVariables() {
      let data = {
        where: {
          OR: [
            { title_contains: this.searchQuery },
            { description_contains: this.searchQuery }
          ]
        }
      }
      return data
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Status',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteStatus(id)
      })
    },
    deleteStatus(id) {
      this.$apollo
        .mutate({
          mutation: PlanLabelsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Status Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Status: ' + error)
        })
    },
    openCreateStatus() {
      this.selectedStatus = new PlanLabel()
      this.openDialog = true
    },
    openEditStatus(status) {
      this.edit = true
      this.selectedStatus = status
      this.openDialog = true
    },
    closeDialog() {
      this.errors.clear()
      this.edit = false
      this.openDialog = false
      this.selectedStatus = new PlanLabel()
    }
  },
  computed: {
    checkLoading() {
      return this.$apollo.loading
    },
    checkEmpty() {
      if (this.planLabels && this.planLabels.length > 0) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style>
</style>
