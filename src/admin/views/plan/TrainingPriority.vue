<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreate()">
            Create Training Priority
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
          <help-content reference="settings.priorityLevels"
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
          <span class="has-text-weight-semibold">{{planPriorityLevelsCounts}} Training Priorities</span>
        </div>
        <div class="level-item">
          <div class="select">
            <select v-model="perPage">
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
           v-if="planPriorityLevels && planPriorityLevels.length > 0">
        <b-table :data="planPriorityLevels"
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
            <b-table-column field="color"
                            label="Color"
                            centered
                            sortable>
              <span class="tag"
                    :style="'background-color:'+props.row.color"
                    :class="lightOrDark(props.row.color)">
                {{ props.row.title}}
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
                <b-dropdown-item @click="openEdit(props.row)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit Training Priority</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Training Priority</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planPriorityLevels"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreate()">
                Create Training Priority
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <priority-level-interaction :open="openDialog"
                                :planPriorityLevel="selected"
                                @close="closeDialog" />
  </div>
</template>

<script>
import PlanPriorityLevel from '@/admin/model/planprioritylevel'
import HelpContent from '@/shared/components/helpcontent'
import PriorityLevelInteraction from '@/admin/components/priorityLevel-interaction'
import {
  PlanPriorityLevelsCounts,
  PlanPriorityLevelsRead,
  PlanPriorityLevelsDelete,
  PlanPriorityLevelsSubscription
} from '@/plan/graphql/PlanPriorityLevels.gql'
import lightOrDark from '@/shared/mixins/lightOrDark'
export default {
  name: 'planPriorityLevel',
  mixins: [lightOrDark],
  components: { HelpContent, PriorityLevelInteraction },
  apollo: {
    planPriorityLevelsCounts: {
      query: PlanPriorityLevelsCounts,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planPriorityLevelsConnection) {
          return data.planPriorityLevelsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planPriorityLevels: {
      query: PlanPriorityLevelsRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planPriorityLevels) {
          this.$apollo.queries.planPriorityLevelsCounts.refetch()
          return data.planPriorityLevels
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanPriorityLevelsSubscription,
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
          let mutationIn = subscriptionData.data.planPriorityLevel.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planPriorityLevels: [
                  subscriptionData.data.planPriorityLevel.node,
                  ...previousResult.planPriorityLevels
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planPriorityLevels: [
                  ...previousResult.planPriorityLevels.filter(
                    obj =>
                      subscriptionData.data.planPriorityLevel.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanPriorityLevels = JSON.parse(
                JSON.stringify(previousResult.planPriorityLevels)
              )
              let index = newPlanPriorityLevels.findIndex(
                x => x.id === subscriptionData.data.planPriorityLevel.node.id
              )
              newPlanPriorityLevels[index] =
                subscriptionData.data.planPriorityLevel.node
              newResult = {
                planPriorityLevels: newPlanPriorityLevels
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
      openDialog: false,
      selected: null,
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
      this.openDialog = false
      this.selected = new PlanPriorityLevel()
    },
    openCreate() {
      this.selected = new PlanPriorityLevel()
      this.openDialog = true
    },
    openEdit(priority) {
      this.selected = priority
      this.openDialog = true
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Training Priority',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.delete(id)
      })
    },
    delete(id) {
      this.$apollo
        .mutate({
          mutation: PlanPriorityLevelsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Training Priority Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Training Priority: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
