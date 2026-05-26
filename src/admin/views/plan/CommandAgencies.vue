<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreate()">
            Create Command/Agency
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
          <help-content reference="settings.commandagency"
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
          <span class="has-text-weight-semibold">{{planParticipantCommandAgenciesCounts}} Command/Agencies</span>
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
           v-if="planParticipantCommandAgencies && planParticipantCommandAgencies.length > 0">
        <b-table :data="planParticipantCommandAgencies"
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
                  <span>Edit Command/Agency</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Command/Agency</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planParticipantCommandAgencies"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreate()">
                Create Command/Agency
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <command-agency-interaction :open="openDialog"
                                :planCommandAgency="selected"
                                @close="closeDialog" />
  </div>
</template>

<script>
import PlanCommandAgency from '@/admin/model/plancommandagency'
import HelpContent from '@/shared/components/helpcontent'
import CommandAgencyInteraction from '@/admin/components/commandAgency-interaction'
import {
  PlanParticipantCommandAgenciesCounts,
  PlanParticipantCommandAgenciesRead,
  PlanParticipantCommandAgenciesDelete,
  PlanParticipantCommandAgencySubscription
} from '@/plan/graphql/PlanParticipantCommandAgency.gql'
export default {
  name: 'planCommandyAgency',
  mixins: [],
  components: { HelpContent, CommandAgencyInteraction },
  apollo: {
    planParticipantCommandAgenciesCounts: {
      query: PlanParticipantCommandAgenciesCounts,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planParticipantCommandAgenciesConnection) {
          return data.planParticipantCommandAgenciesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planParticipantCommandAgencies: {
      query: PlanParticipantCommandAgenciesRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planParticipantCommandAgencies) {
          this.$apollo.queries.planParticipantCommandAgenciesCounts.refetch()
          return data.planParticipantCommandAgencies
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanParticipantCommandAgencySubscription,
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
            subscriptionData.data.planParticipantCommandAgency.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantCommandAgencies: [
                  subscriptionData.data.planParticipantCommandAgency.node,
                  ...previousResult.planParticipantCommandAgencies
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantCommandAgencies: [
                  ...previousResult.planParticipantCommandAgencies.filter(
                    obj =>
                      subscriptionData.data.planParticipantCommandAgency
                        .previousValues.id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantCommandAgencies = JSON.parse(
                JSON.stringify(previousResult.planParticipantCommandAgencies)
              )
              let index = newPlanParticipantCommandAgencies.findIndex(
                x =>
                  x.id ===
                  subscriptionData.data.planParticipantCommandAgency.node.id
              )
              newPlanParticipantCommandAgencies[index] =
                subscriptionData.data.planParticipantCommandAgency.node
              newResult = {
                planParticipantCommandAgencies: newPlanParticipantCommandAgencies
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
      this.selected = new PlanCommandAgency()
    },
    openCreate() {
      this.selected = new PlanCommandAgency()
      this.openDialog = true
    },
    openEdit(CommandAgency) {
      this.selected = CommandAgency
      this.openDialog = true
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Command/Agency',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.delete(id)
      })
    },
    delete(id) {
      this.$apollo
        .mutate({
          mutation: PlanParticipantCommandAgenciesDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Command/Agency Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Command/Agency: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
