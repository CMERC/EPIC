<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreateOrganization()">
            Create Organization
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
          <help-content reference="settings.organizations"
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
          <span class="has-text-weight-semibold">{{planOrganizationsCounts}} Organizations</span>
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
    <div class="columns is-centered">
      <div class="column"
           v-if="planOrganizations && planOrganizations.length > 0">
        <b-table :data="planOrganizations"
                 paginated
                 :pagination-simple="isPaginationSimple"
                 :per-page="perPage"
                 backend-sorting
                 @sort="onSort"
                 :default-sort-direction="defaultSortDirection"
                 default-sort="name">
          <template slot-scope="props">
            <b-table-column field="name"
                            label="Name"
                            class="is-size-6"
                            sortable>
              {{ props.row.name }}
            </b-table-column>
            <b-table-column field="group"
                            label="Group"
                            class="is-size-6"
                            sortable>
              {{ props.row.group }}
            </b-table-column>
            <b-table-column width="200">
              <b-dropdown position="is-bottom-left">
                <a class="button is-small"
                   slot="trigger">
                  <span class="icon is-small">
                    <i class="fas fa-ellipsis-v"></i>
                  </span>
                </a>
                <b-dropdown-item @click="openEditOrganization(props.row)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit Organization</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Organization</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planOrganizations"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreateOrganization()">
                Create Organization
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <organization-interaction :open="openOrganizationModal"
                              :organization="selectedOrganization"
                              @close="closeOrganizationModal" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanOrganizationsSearch,
  PlanOrganizationsCounts,
  PlanOrganizationsDelete,
  PlanOrganizationSubscription
} from '@/plan/graphql/PlanOrganizations.gql'
import OrganizationInteraction from '@/admin/components/organization-interaction'

export default {
  name: 'organizations',
  apollo: {
    planOrganizationsCounts: {
      query: PlanOrganizationsCounts,
      variables() {
        let data = {
          where: {
            OR: [
              { name_contains: this.searchQuery },
              { group_contains: this.searchQuery }
            ]
          }
        }
        return data
      },
      update(data) {
        if (data && data.planOrganizationsConnection) {
          return data.planOrganizationsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planOrganizations: {
      query: PlanOrganizationsSearch,
      variables() {
        return {
          query: this.searchQuery,
          orderBy: this.orderBy
        }
      },
      update(data) {
        if (data && data.planOrganizations) {
          this.$apollo.queries.planOrganizationsCounts.refetch()
          return data.planOrganizations
        }
      },
      subscribeToMore: {
        document: PlanOrganizationSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planOrganization.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planOrganizations: [
                  subscriptionData.data.planOrganization.node,
                  ...previousResult.planOrganizations
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planOrganizations: [
                  ...previousResult.planOrganizations.filter(
                    obj =>
                      subscriptionData.data.planOrganization.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanOrganizations = JSON.parse(
                JSON.stringify(previousResult.planOrganizations)
              )
              let index = newPlanOrganizations.findIndex(
                x => x.id === subscriptionData.data.planOrganization.node.id
              )
              newPlanOrganizations[index] =
                subscriptionData.data.planOrganization.node
              newResult = {
                planOrganizations: newPlanOrganizations
              }
              break
            }
            default: {
              throw new Error(`Unknown Organization mutation`)
            }
          }
          return newResult
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  components: {
    OrganizationInteraction,
    HelpContent
  },
  data() {
    return {
      selectedOrganization: null,
      searchQuery: '',
      orderBy: 'name_ASC',
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 30,
      openOrganizationModal: false,
      organizationId: ''
    }
  },
  methods: {
    onSort(field, order) {
      this.orderBy = field + '_' + order.toUpperCase()
    },
    closeOrganizationModal() {
      this.openOrganizationModal = false
    },
    openCreateOrganization() {
      this.openOrganizationModal = true
    },
    openEditOrganization(organization) {
      this.selectedOrganization = organization
      this.openOrganizationModal = true
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Organization',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteOrganization(id)
      })
    },
    deleteOrganization(id) {
      this.$apollo
        .mutate({
          mutation: PlanOrganizationsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Organization Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Organization: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
