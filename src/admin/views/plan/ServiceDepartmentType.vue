<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreate()">
            Create Service/Department Type
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
          <help-content reference="settings.servicedepartmenttype"
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
          <span class="has-text-weight-semibold">{{planParticipantServiceTypesCounts}} Service/Department Types</span>
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
           v-if="planParticipantServiceTypes && planParticipantServiceTypes.length > 0">
        <b-table :data="planParticipantServiceTypes"
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
                <b-dropdown-item @click="openEdit(props.row)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit Service/Department Type</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Service/Department Type</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planParticipantServiceTypes"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreate()">
                Create Service/Department Type
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <service-department-type-interaction :open="openDialog"
                                         :serviceDepartmentType="selected"
                                         @close="closeDialog" />
  </div>
</template>

<script>
import PlanParticipantServiceType from '@/admin/model/planservicedepartmenttype'
import HelpContent from '@/shared/components/helpcontent'
import ServiceDepartmentTypeInteraction from '@/admin/components/serviceDepartmentType-interaction'
import {
  PlanParticipantServiceTypesCounts,
  PlanParticipantServiceTypesRead,
  PlanParticipantServiceTypesDelete,
  PlanParticipantServiceTypeSubscription
} from '@/plan/graphql/PlanParticipantServiceType.gql'
export default {
  name: 'planServiceDepartmentType',
  mixins: [],
  components: { HelpContent, ServiceDepartmentTypeInteraction },
  apollo: {
    planParticipantServiceTypesCounts: {
      query: PlanParticipantServiceTypesCounts,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planParticipantServiceTypesConnection) {
          return data.planParticipantServiceTypesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planParticipantServiceTypes: {
      query: PlanParticipantServiceTypesRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planParticipantServiceTypes) {
          this.$apollo.queries.planParticipantServiceTypesCounts.refetch()
          return data.planParticipantServiceTypes
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanParticipantServiceTypeSubscription,
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
          let mutationIn =
            subscriptionData.data.planParticipantServiceType.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantServiceTypes: [
                  subscriptionData.data.planParticipantServiceType.node,
                  ...previousResult.planParticipantServiceTypes
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantServiceTypes: [
                  ...previousResult.planParticipantServiceTypes.filter(
                    obj =>
                      subscriptionData.data.planParticipantServiceType
                        .previousValues.id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantServiceTypes = JSON.parse(
                JSON.stringify(previousResult.planParticipantServiceTypes)
              )
              let index = newPlanParticipantServiceTypes.findIndex(
                x =>
                  x.id ===
                  subscriptionData.data.planParticipantServiceType.node.id
              )
              newPlanParticipantServiceTypes[index] =
                subscriptionData.data.planParticipantServiceType.node
              newResult = {
                planParticipantServiceTypes: newPlanParticipantServiceTypes
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
      this.selected = new PlanParticipantServiceType()
    },
    openCreate() {
      this.selected = new PlanParticipantServiceType()
      this.openDialog = true
    },
    openEdit(ServiceDepartmentType) {
      this.selected = ServiceDepartmentType
      this.openDialog = true
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Service/Department Type',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.delete(id)
      })
    },
    delete(id) {
      this.$apollo
        .mutate({
          mutation: PlanParticipantServiceTypesDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Service/Department Type Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Service/Department Type: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
