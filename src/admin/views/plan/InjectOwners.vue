<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreate()">
            Create Inject Owner
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
          <help-content reference="settings.injectowner"
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
          <span class="has-text-weight-semibold">{{planInjectOwnersCounts}} Owners</span>
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
           v-if="planInjectOwners && planInjectOwners.length > 0">
        <b-table :data="planInjectOwners"
                 :paginated="isPaginated"
                 :per-page="perPage"
                 :pagination-simple="isPaginationSimple"
                 :default-sort-direction="defaultSortDirection"
                 default-sort="name">
          <template slot-scope="props">
            <b-table-column field="title"
                            label="Title"
                            sortable>
              {{ props.row.title }}
            </b-table-column>
            <b-table-column width="50">
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
                  <span>Edit Inject Owner</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Inject Owner</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planInjectOwners"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreate()">
                Create Inject Owner
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <inject-owner-interaction :open="openDialog"
                              :owner="selectedOwner"
                              @close="closeDialog"
                              :edit="edit" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import PlanInjectOwner from '@/admin/model/planinjectowner'
import InjectOwnerInteraction from '@/admin/components/injectOwner-interaction'
import {
  PlanInjectOwnersCounts,
  PlanInjectOwnersRead,
  PlanInjectOwnersSubscription,
  PlanInjectOwnersDelete
} from '@/plan/graphql/PlanInjectOwners.gql'
export default {
  name: 'inject-owner',
  components: { InjectOwnerInteraction, HelpContent },
  apollo: {
    planInjectOwnersCounts: {
      query: PlanInjectOwnersCounts,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planInjectOwnersConnection) {
          return data.planInjectOwnersConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planInjectOwners: {
      query: PlanInjectOwnersRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planInjectOwners) {
          this.$apollo.queries.planInjectOwnersCounts.refetch()
          return data.planInjectOwners
        }
      },
      subscribeToMore: {
        document: PlanInjectOwnersSubscription,
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
          let mutationIn = subscriptionData.data.planInjectOwner.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planInjectOwners: [
                  subscriptionData.data.planInjectOwner.node,
                  ...previousResult.planInjectOwners
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planInjectOwners: [
                  ...previousResult.planInjectOwners.filter(
                    obj =>
                      subscriptionData.data.planInjectOwner.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanInjectOwners = JSON.parse(
                JSON.stringify(previousResult.planInjectOwners)
              )
              let index = newPlanInjectOwners.findIndex(
                x => x.id === subscriptionData.data.planInjectOwner.node.id
              )
              newPlanInjectOwners[index] =
                subscriptionData.data.planInjectOwner.node
              newResult = {
                planInjectOwners: newPlanInjectOwners
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
      edit: false,
      selectedOwner: null,
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
    openCreate() {
      this.selectedOwner = new PlanInjectOwner()
      this.openDialog = true
    },
    openEdit(owner) {
      this.edit = true
      this.selectedOwner = owner
      this.openDialog = true
    },
    closeDialog() {
      this.errors.clear()
      this.edit = false
      this.openDialog = false
      this.selectedOwner = new PlanInjectOwner()
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Inject Owner',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.delete(id)
      })
    },
    delete(id) {
      this.$apollo
        .mutate({
          mutation: PlanInjectOwnersDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Inject Owner Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Inject Owner: ' + error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
