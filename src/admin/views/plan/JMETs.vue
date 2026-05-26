<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreateJmet()">
            Create JMET
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
          <help-content reference="settings.jmets"
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
          <span class="has-text-weight-semibold">{{planJmetsCounts}} JMETs</span>
        </div>
        <div class="level-item">
          <div class="select">
            <select v-model.number="perPage">
              <option value="25">
                25 per page
              </option>
              <option value="50">
                50 per page
              </option>
              <option value="75">
                75 per page
              </option>
              <option value="100">
                100 per page
              </option>
            </select>
          </div>
        </div>
      </div>
    </nav>
    <div class="columns is-centered">
      <div class="column"
           v-if="planJmets && planJmets.length > 0">
        <b-table :data="planJmets"
                 striped
                 :total="planJmetsCounts"
                 :current-page.sync="currentPage"
                 paginated
                 :pagination-simple="isPaginationSimple"
                 :per-page="perPage"
                 backend-pagination
                 @page-change="onPageChange"
                 backend-sorting
                 @sort="onSort"
                 :default-sort-direction="defaultSortDirection" 
                 default-sort="levelWar">
          <template slot-scope="props">
            <b-table-column field="levelWar"
                            label="Level of War"
                            class="is-size-6"
                            sortable>
              {{ props.row.levelWar }}
            </b-table-column>
            <b-table-column field="taskNumber"
                            label="Task Number"
                            class="is-size-6"
                            sortable>
              {{ props.row.taskNumber }}
            </b-table-column>
            <b-table-column field="taskTitle"
                            label="Task Title"
                            class="is-size-6"
                            sortable>
              {{ props.row.taskTitle }}
            </b-table-column>
            <b-table-column width="200">
              <b-dropdown position="is-bottom-left">
                <a class="button is-small"
                   slot="trigger">
                  <span class="icon is-small">
                    <i class="fas fa-ellipsis-v"></i>
                  </span>
                </a>
                <b-dropdown-item @click="openEditJmet(props.row)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit JMET</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete JMET</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planJmets"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreateJmet()">
                Create JMET
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <jmet-interaction :open="openJmetModal"
                      :jmet="selectedJmet"
                      @close="closeJmetModal" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanJmetsCounts,
  PlanJmetsRead,
  PlanJmetsDelete,
  PlanJmetSubscription
} from '@/plan/graphql/PlanJmets.gql'
import JmetInteraction from '@/admin/components/jmet-interaction.vue'

export default {
  name: 'jmets',
  apollo: {
    planJmetsCounts: {
      query: PlanJmetsCounts,
      variables() {
        return {
          where: {
            description_contains: this.searchQuery
          }
        }
      },
      update(data) {
        if (data && data.planJmetsConnection) {
          return data.planJmetsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planJmets: {
      query: PlanJmetsRead,
      variables() {
        return {
          where: {
            description_contains: this.searchQuery
          },
          orderBy: this.orderBy,
          skip: this.skip,
          first: this.perPage
        }
      },
      update(data) {
        if (data && data.planJmets) {
          this.$apollo.queries.planJmetsCounts.refetch()
          return data.planJmets
        }
      },
      subscribeToMore: {
        document: PlanJmetSubscription,
        variables() {
          return {
            node: {
              where: {
                description_contains: this.searchQuery
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planJmet.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planJmets: [
                  subscriptionData.data.planJmet.node,
                  ...previousResult.planJmets
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planJmets: [
                  ...previousResult.planJmets.filter(
                    (obj) =>
                      subscriptionData.data.planJmet.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanJmets = JSON.parse(
                JSON.stringify(previousResult.planJmets)
              )
              let index = newPlanJmets.findIndex(
                (x) => x.id === subscriptionData.data.planJmet.node.id
              )
              newPlanJmets[index] = subscriptionData.data.planJmet.node
              newResult = {
                planJmets: newPlanJmets
              }
              break
            }
            default: {
              throw new Error(`Unknown Jmet mutation`)
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
    JmetInteraction,
    HelpContent
  },
  data() {
    return {
      openJmetModal: false,
      selectedJmet: null,
      searchQuery: '',
      orderBy: 'levelWar_ASC',
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 25,
      currentPage: 1,
      skip: 0
    }
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this.skip = (this.currentPage - 1) * this.perPage
    },
    onSort(field, order) {
      this.orderBy = field + '_' + order.toUpperCase()
    },
    openCreateJmet() {
      this.openJmetModal = true
    },
    closeJmetModal() {
      this.openJmetModal = false
    },
    openEditJmet(jmet) {
      this.selectedJmet = jmet
      this.openJmetModal = true
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Jmet',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteJmet(id)
      })
    },
    deleteJmet(id) {
      this.$apollo
        .mutate({
          mutation: PlanJmetsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Jmet Deleted!',
            type: 'is-success'
          })
        })
        .catch((error) => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Jmet: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
