<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="toggleTableModal(true,'new')">
            Create Priority
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
          <help-content reference="settings.priorities"
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
          <span class="has-text-weight-semibold">{{planJointStaffTrainingPrioritiesCounts}} Priorities</span>
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
           v-if="planJointStaffTrainingPriorities && planJointStaffTrainingPriorities.length > 0">
        <b-table :data="planJointStaffTrainingPriorities"
                 paginated
                 :pagination-simple="isPaginationSimple"
                 :per-page="perPage"
                 detailed
                 detail-key="id"
                 backend-sorting
                 @sort="onSort"
                 :default-sort-direction="defaultSortDirection"
                 default-sort="title">
          <template slot-scope="props">
            <b-table-column field="title"
                            label="Title"
                            class="is-size-6"
                            sortable>
              {{ props.row.title }}
            </b-table-column>
            <b-table-column width="200">
              <b-dropdown position="is-bottom-left">
                <a class="button is-small"
                   slot="trigger">
                  <span class="icon is-small">
                    <i class="fas fa-ellipsis-v"></i>
                  </span>
                </a>
                <b-dropdown-item @click="toggleTableModal(true, 'edit', props.row)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit Joint Staff Training Priority</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="tableValueDelete(props, 'jointStaffTrainingPriority','Joint Staff Training Priority')">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Joint Staff Training Priority</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
          <template slot="detail"
                    slot-scope="props">
            <article class="media">
              <div class="media-content">
                <div class="content">
                  <div class="columns is-multiline is-mobile">
                    <div class="column is-full">
                      <label class="label">
                        Title
                      </label>
                      <p class="subtitle is-6">{{props.row.title ? props.row.title : "None"}}</p>
                    </div>
                    <div class="column is-full">
                      <label class="label">
                        Description
                      </label>
                      <p class="subtitle is-6">{{props.row.description ? props.row.description : "None"}}</p>
                    </div>
                    <div class="column is-narrow">
                      <div class="field is-grouped">
                        <p class="control">
                          <a class="button is-primary"
                             @click="toggleTableModal(true, 'edit', props.row)">Edit</a>
                        </p>
                        <p class="control">
                          <a class="button is-danger is-outlined"
                             @click="tableValueDelete(props, 'jointStaffTrainingPriority','Joint Staff Training Priority')">Delete</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </template>
        </b-table>
      </div>
      <div v-else
           class="column no-result apollo">
        <empty-state :data="planJointStaffTrainingPriorities"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="toggleTableModal(true,'new')">
                Create Priority
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <jointstaff-modal :open="openJointStaffTrainingPriorityModal"
                      :isClosed="!openJointStaffTrainingPriorityModal"
                      :id="jointStaffPriorityId"
                      @close="closeJointStaffTrainingPriorityModal"></jointstaff-modal>
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanJointStaffTrainingPrioritiesSearch,
  PlanJointStaffTrainingPrioritiesCounts,
  PlanJointStaffTrainingPrioritySubscription
} from '@/plan/graphql/PlanJointStaffTrainingPriorities.gql'
import JointstaffModal from '@/plan/components/crudModals/manage-jointStaffTrainingPriority.vue'
import processVal from '@/shared/mixins/processVal'
export default {
  name: 'organizations',
  apollo: {
    planJointStaffTrainingPrioritiesCounts: {
      query: PlanJointStaffTrainingPrioritiesCounts,
      variables() {
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
      update(data) {
        if (data && data.planJointStaffTrainingPrioritiesConnection) {
          return data.planJointStaffTrainingPrioritiesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planJointStaffTrainingPriorities: {
      query: PlanJointStaffTrainingPrioritiesSearch,
      variables() {
        return {
          query: this.searchQuery,
          orderBy: this.orderBy
        }
      },
      update(data) {
        if (data && data.planJointStaffTrainingPriorities) {
          this.$apollo.queries.planJointStaffTrainingPrioritiesCounts.refetch()
          return data.planJointStaffTrainingPriorities
        }
      },
      subscribeToMore: {
        document: PlanJointStaffTrainingPrioritySubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn =
            subscriptionData.data.planJointStaffTrainingPriority.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planJointStaffTrainingPriorities: [
                  subscriptionData.data.planJointStaffTrainingPriority.node,
                  ...previousResult.planJointStaffTrainingPriorities
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planJointStaffTrainingPriorities: [
                  ...previousResult.planJointStaffTrainingPriorities.filter(
                    obj =>
                      subscriptionData.data.planJointStaffTrainingPriority
                        .previousValues.id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanJointStaffTrainingPriorities = JSON.parse(
                JSON.stringify(previousResult.planJointStaffTrainingPriorities)
              )
              let index = newPlanJointStaffTrainingPriorities.findIndex(
                x =>
                  x.id ===
                  subscriptionData.data.planJointStaffTrainingPriority.node.id
              )
              newPlanJointStaffTrainingPriorities[index] =
                subscriptionData.data.planJointStaffTrainingPriority.node
              newResult = {
                planJointStaffTrainingPriorities: newPlanJointStaffTrainingPriorities
              }
              break
            }
            default: {
              throw new Error(`Unknown Joint Staff Training Priority mutation`)
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
  mixins: [processVal],
  components: {
    JointstaffModal,
    HelpContent
  },
  data() {
    return {
      searchQuery: '',
      orderBy: 'title_ASC',
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 30,
      openJointStaffTrainingPriorityModal: false,
      jointStaffPriorityId: ''
    }
  },
  methods: {
    onSort(field, order) {
      this.orderBy = field + '_' + order.toUpperCase()
    },
    closeJointStaffTrainingPriorityModal() {
      this.toggleTableModal(false, 'close')
    },
    toggleTableModal(value, type, info) {
      switch (type) {
        case 'new':
        case 'close':
          this.jointStaffPriorityId = ''
          break
        case 'edit':
          this.jointStaffPriorityId = info.id
          break
      }
      this.openJointStaffTrainingPriorityModal = value
    },
    tableValueDelete(item, name, displayName) {
      this.confirmValueDelete(item, name, displayName)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
