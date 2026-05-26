<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openCreatePlatform()">
            Create Platform
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
          <help-content reference="settings.platforms" 
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
          <span class="has-text-weight-semibold">{{planPlatformsCounts}} Platforms</span>
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
           v-if="planPlatforms && planPlatforms.length > 0">
        <b-table :data="planPlatforms" 
                 paginated 
                 :pagination-simple="isPaginationSimple" 
                 :per-page="perPage" 
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
            <b-table-column field="type" 
                            label="Type" 
                            class="is-size-6" 
                            sortable>
              {{ props.row.type }}
            </b-table-column>
            <b-table-column width="200">
              <b-dropdown position="is-bottom-left">
                <a class="button is-small" 
                   slot="trigger">
                  <span class="icon is-small">
                    <i class="fas fa-ellipsis-v"></i>
                  </span>
                </a>
                <b-dropdown-item @click="editPlatform(props.row)">
                  <span class="icon is-small">
                    <i class="fas fa-pen"></i>
                  </span>
                  <span>Edit Platform</span>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(props.row.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Platform</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else 
           class="column">
        <empty-state :data="planPlatforms" 
                     :search="searchQuery ? true : false" 
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreatePlatform()">
                Create Platform
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <platform-interaction :open="openPlatformModal"
                          :platform="selectedPlatform"
                          @close="closePlatformModal" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanPlatformsRead,
  PlanPlatformsCounts,
  PlanPlatformsDelete,
  PlanPlatformSubscription
} from '@/plan/graphql/PlanPlatforms.gql'

import {
  PlanParticipantPlatformsRead,
  PlanParticipantPlatformsDelete
} from '@/plan/graphql/PlanParticipantPlatforms.gql'

import PlatformInteraction from '@/admin/components/platform-interaction'

import { serverError } from '@/shared/serverError'
export default {
  name: 'platforms',
  apollo: {
    planPlatformsCounts: {
      query: PlanPlatformsCounts,
      variables() {
        let data = {
          where: {
            OR: [
              { title_contains: this.searchQuery },
              { type_contains: this.searchQuery }
            ]
          }
        }
        return data
      },
      update(data) {
        if (
          data &&
          data.planPlatformsConnection &&
          data.planPlatformsConnection.aggregate
        ) {
          return data.planPlatformsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planPlatforms: {
      query: PlanPlatformsRead,
      variables() {
        return {
          where: {
            OR: [
              { title_contains: this.searchQuery },
              { type_contains: this.seearchQuery }
            ]
          },
          orderBy: this.orderBy
        }
      },
      update(data) {
        if (data && data.planPlatforms) {
          this.$apollo.queries.planPlatformsCounts.refetch()
          return data.planPlatforms
        }
      },
      subscribeToMore: {
        document: PlanPlatformSubscription,
        variables() {
          return {
            node: {
              where: {
                OR: [
                  { title_contains: this.searchQuery },
                  { type_contains: this.seearchQuery }
                ]
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planPlatform.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planPlatforms: [
                  subscriptionData.data.planPlatform.node,
                  ...previousResult.planPlatforms
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planPlatforms: [
                  ...previousResult.planPlatforms.filter(
                    obj =>
                      subscriptionData.data.planPlatform.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanPlatforms = JSON.parse(
                JSON.stringify(previousResult.planPlatforms)
              )
              let index = newPlanPlatforms.findIndex(
                x => x.id === subscriptionData.data.planPlatform.node.id
              )
              newPlanPlatforms[index] = subscriptionData.data.planPlatform.node
              newResult = {
                planPlatforms: newPlanPlatforms
              }
              break
            }
            default: {
              throw new Error(`Unknown Platform mutation`)
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
    PlatformInteraction,
    HelpContent
  },
  data() {
    return {
      searchQuery: '',
      orderBy: 'title_ASC',
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 30,
      openPlatformModal: false,
      selectedPlatform: null,
      platformId: ''
    }
  },
  methods: {
    onSort(field, order) {
      this.orderBy = field + '_' + order.toUpperCase()
    },
    closePlatformModal() {
      this.openPlatformModal = false
    },
    openCreatePlatform() {
      this.openPlatformModal = true
    },
    editPlatform(platform) {
      this.selectedPlatform = platform
      this.openPlatformModal = true
    },
    confirmDelete(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Platform',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.checkPlatform(id)
      })
    },
    async checkPlatform(id) {
      if (!id) return
      let checkParticipant = await this.checkParticipantPlatform(id)

      if (checkParticipant.length != 0) {
        await this.deleteParticipantPlatform(checkParticipant)
      } else {
        await this.deletePlanPlatform(id)
      }
      this.refetchQueries()
    },
    checkParticipantPlatform(id) {
      return this.$apollo
        .query({
          query: PlanParticipantPlatformsRead,
          variables: {
            where: {
              platform: {
                id: id
              }
            }
          }
        })
        .then(response => {
          if (
            response &&
            response.data &&
            response.data.planParticipantPlatforms
          ) {
            return response.data.planParticipantPlatforms
          } else {
            return null
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    },
    deleteParticipantPlatform(record) {
      for (let i = 0; i < record.length; i++) {
        this.$apollo.mutate({
          mutation: PlanParticipantPlatformsDelete,
          variables: {
            id: {
              id: record[i].id
            }
          }
        })
      }
    },
    deletePlanPlatform(id) {
      this.$apollo
        .mutate({
          mutation: PlanPlatformsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(response => {
          if (response) {
            this.$buefy.toast.open({
              message: 'Platform Deleted!',
              type: 'is-success'
            })
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    },
    refetchQueries() {
      this.$apollo.queries.planPlatformsCounts.refetch()
      this.$apollo.queries.planPlatforms.refetch()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
