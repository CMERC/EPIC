<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreate()">
            Create MSEL Status Board
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
          <help-content reference="settings.boards"
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
          <span class="has-text-weight-semibold">{{planLabelGroupsCounts}} Boards</span>
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
           v-if="planLabelGroups && planLabelGroups.length > 0">
        <b-table :data="planLabelGroups"
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
            <b-table-column field="groupLabels"
                            label="Status List">
              <span v-if="props.row.groupLabels">
                <template v-for="groupLabels in props.row.groupLabels">
                  <span class="tag is-rounded"
                        v-bind:key="groupLabels.id"
                        :style="'background-color:'+groupLabels.color"
                        :class="lightOrDark(groupLabels.color)">{{groupLabels.title}}</span>
                </template>
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
                  <span>Edit Board</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Board</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planLabelGroups"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreate()">
                Create MSEL Status Board
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <group-interaction :open="openDialog"
                       :edit="edit"
                       :labelGroupInfo="selectedGroupLabel"
                       @close="closeDialog" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import PlanGroupLabel from '@/plan/model/planGroupLabel'
import GroupInteraction from '@/admin/components/labelGroup-interaction.vue'

import lightOrDark from '@/shared/mixins/lightOrDark'

import {
  PlanLabelGroupsCounts,
  PlanLabelGroupsRead,
  PlanLabelGroupSubscription,
  PlanLabelGroupsDelete
} from '@/plan/graphql/PlanLabelGroups.gql'

export default {
  name: 'status-boards',
  mixins: [lightOrDark],
  components: {
    GroupInteraction,
    HelpContent
  },
  apollo: {
    planLabelGroupsCounts: {
      query: PlanLabelGroupsCounts,
      variables() {
        let data = this.queryVariables()
        return data
      },
      update(data) {
        if (data && data.planLabelGroupsConnection) {
          return data.planLabelGroupsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planLabelGroups: {
      query: PlanLabelGroupsRead,
      variables() {
        let data = this.queryVariables()

        return data
      },
      update(data) {
        if (data && data.planLabelGroups) {
          this.$apollo.queries.planLabelGroupsCounts.refetch()
          return data.planLabelGroups
        }
      },
      subscribeToMore: {
        document: PlanLabelGroupSubscription,
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
          let mutationIn = subscriptionData.data.planLabelGroup.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planLabelGroups: [
                  ...previousResult.planLabelGroups,
                  subscriptionData.data.planLabelGroup.node
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planLabelGroups: [
                  ...previousResult.planLabelGroups.filter(
                    obj =>
                      subscriptionData.data.planLabelGroup.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanLabelGroups = JSON.parse(
                JSON.stringify(previousResult.planLabelGroups)
              )
              let index = newPlanLabelGroups.findIndex(
                x => x.id === subscriptionData.data.planLabelGroup.node.id
              )
              newPlanLabelGroups[index] =
                subscriptionData.data.planLabelGroup.node
              newResult = {
                planLabelGroups: newPlanLabelGroups
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
      selectedGroupLabel: null,
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
          OR: [
            { title_contains: this.searchQuery },
            {
              groupLabels_some: {
                OR: [
                  { title_contains: this.searchQuery },
                  { description_contains: this.searchQuery }
                ]
              }
            }
          ]
        }
      }
      return data
    },
    closeDialog() {
      this.errors.clear()
      this.edit = false
      this.openDialog = false
      this.selectedGroupLabel = new PlanGroupLabel()
    },
    openCreate() {
      this.selectedGroupLabel = new PlanGroupLabel()
      this.openDialog = true
    },
    openEdit(board) {
      this.edit = true
      this.selectedGroupLabel = board
      this.openDialog = true
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Board',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteBoard(id)
      })
    },
    deleteBoard(id) {
      this.$apollo
        .mutate({
          mutation: PlanLabelGroupsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Board Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Board: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
