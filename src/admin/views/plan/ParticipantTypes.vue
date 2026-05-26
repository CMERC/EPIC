<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreate()">
            Create Participant Type
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
          <help-content reference="settings.participanttype"
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
          <span class="has-text-weight-semibold">{{planParticipantTypesCounts}} Participant Types</span>
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
           v-if="planParticipantTypes && planParticipantTypes.length > 0">
        <b-table :data="planParticipantTypes"
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
                  <span>Edit Participant Type</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Participant Type</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planParticipantTypes"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreate()">
                Create Participant Type
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <type-interaction :open="openDialog"
                      :edit="edit"
                      :participantType="selectedParticipantType"
                      @close="closeDialog" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import PlanParticipantType from '@/plan/model/planParticipantType'
import TypeInteraction from '@/admin/components/participantType-interaction.vue'

import {
  PlanParticipantTypesCounts,
  PlanParticipantTypesRead,
  PlanParticipantTypeSubscription,
  PlanParticipantTypesDelete
} from '@/plan/graphql/PlanParticipantType.gql'
export default {
  name: 'participant-types',
  components: { HelpContent, TypeInteraction },
  apollo: {
    planParticipantTypesCounts: {
      query: PlanParticipantTypesCounts,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planParticipantTypesConnection) {
          return data.planParticipantTypesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planParticipantTypes: {
      query: PlanParticipantTypesRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planParticipantTypes) {
          this.$apollo.queries.planParticipantTypesCounts.refetch()
          return data.planParticipantTypes
        }
      },
      subscribeToMore: {
        document: PlanParticipantTypeSubscription,
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
          let mutationIn = subscriptionData.data.planParticipantType.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantTypes: [
                  subscriptionData.data.planParticipantType.node,
                  ...previousResult.planParticipantTypes
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantTypes: [
                  ...previousResult.planParticipantTypes.filter(
                    obj =>
                      subscriptionData.data.planParticipantType.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantType = JSON.parse(
                JSON.stringify(previousResult.planParticipantTypes)
              )
              let index = newPlanParticipantType.findIndex(
                x => x.id === subscriptionData.data.planParticipantType.node.id
              )
              newPlanParticipantType[index] =
                subscriptionData.data.planParticipantType.node
              newResult = {
                planParticipantTypes: newPlanParticipantType
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
      edit: false,
      openDialog: false,
      selectedParticipantType: null,
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
      this.selectedParticipantType = new PlanParticipantType()
      this.openDialog = true
    },
    closeDialog() {
      this.errors.clear()
      this.edit = false
      this.openDialog = false
      this.selectedParticipantType = new PlanParticipantType()
    },
    openEdit(type) {
      this.edit = true
      this.selectedParticipantType = type
      this.openDialog = true
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Participant Type',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteParticipantType(id)
      })
    },
    deleteParticipantType(id) {
      this.$apollo
        .mutate({
          mutation: PlanParticipantTypesDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Participant Type Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Participant Type: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
