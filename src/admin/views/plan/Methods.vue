<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreateMethod()">
            Create Method
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
          <help-content reference="settings.method"
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
          <span class="has-text-weight-semibold">{{planMethodsCounts}} Methods</span>
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
           v-if="planMethods && planMethods.length > 0">
        <b-table :data="planMethods"
                 :paginated="isPaginated"
                 :per-page="perPage"
                 :pagination-simple="isPaginationSimple"
                 :default-sort-direction="defaultSortDirection"
                 default-sort="name">
          <template slot-scope="props">
            <b-table-column field="name"
                            label="Name"
                            sortable>
              {{ props.row.name }}
            </b-table-column>
            <b-table-column field="icon"
                            label="Icon & Color">
              <div :style="'color:'+props.row.color">
                <span class="icon is-small"
                      v-if="props.row.icon"
                      :key="props.row.icon">
                  <i :class="props.row.icon"></i>
                </span>
              </div>
            </b-table-column>
            <b-table-column width="50">
              <b-dropdown position="is-bottom-left">
                <a class="button is-small"
                   slot="trigger">
                  <span class="icon is-small">
                    <i class="fas fa-ellipsis-v"></i>
                  </span>
                </a>
                <b-dropdown-item @click="openEditMethod(props.row)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit Method</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Method</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planMethods"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreateMethod()">
                Create Method
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <method-interaction :open="openDialog"
                        :method="selectedMethod"
                        @close="closeDialog" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import PlanMethod from '@/plan/model/planMethods'
import MethodInteraction from '@/admin/components/method-interaction'
import {
  PlanMethodsCounts,
  PlanMethodsRead,
  PlanMethodsSubscription,
  PlanMethodsDelete
} from '@/plan/graphql/PlanMethods.gql'
export default {
  name: 'inject-methods',
  components: { MethodInteraction, HelpContent },
  apollo: {
    planMethodsCounts: {
      query: PlanMethodsCounts,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planMethodsConnection) {
          return data.planMethodsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planMethods: {
      query: PlanMethodsRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planMethods) {
          this.$apollo.queries.planMethodsCounts.refetch()
          return data.planMethods
        }
      },
      subscribeToMore: {
        document: PlanMethodsSubscription,
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
          let mutationIn = subscriptionData.data.planMethod.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planMethods: [
                  subscriptionData.data.planMethod.node,
                  ...previousResult.planMethods
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planMethods: [
                  ...previousResult.planMethods.filter(
                    obj =>
                      subscriptionData.data.planMethod.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanMethods = JSON.parse(
                JSON.stringify(previousResult.planMethods)
              )
              let index = newPlanMethods.findIndex(
                x => x.id === subscriptionData.data.planMethod.node.id
              )
              newPlanMethods[index] = subscriptionData.data.planMethod.node
              newResult = {
                planMethods: newPlanMethods
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
      openDialog: false,
      selectedMethod: null,
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
          name_contains: this.searchQuery
        }
      }
      return data
    },
    openCreateMethod() {
      this.selectedMethod = new PlanMethod()
      this.openDialog = true
    },
    openEditMethod(method) {
      this.selectedMethod = method
      this.openDialog = true
    },
    closeDialog() {
      this.errors.clear()
      this.openDialog = false
      this.selectedMethod = new PlanMethod()
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Method',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteMethod(id)
      })
    },
    deleteMethod(id) {
      this.$apollo
        .mutate({
          mutation: PlanMethodsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Method Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Method: ' + error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
