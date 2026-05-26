<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busyLoading"
       infinite-scroll-distance="50"
       class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <span class="button is-primary"
                @click="showCreateParticipant()">Create Participant</span>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <span class="has-text-weight-semibold">{{planParticipantsCount}} Participants</span>
        </div>
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
          <help-content :reference="'plan.prepare.participants'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>

    <div class="columns is-multiline participants"
         v-if="planParticipants && planParticipants.length > 0">
      <div class="column is-3-desktop is-6-tablet is-12-mobile"
           v-for="participant in planParticipants"
           v-bind:key="participant.id">
        <div class="card">
          <nav class="level is-pulled-right">
            <div class="level-left"></div>
            <div class="level-right">
              <div class="level-item">
                <b-dropdown position="is-bottom-left">
                  <a class="button is-small"
                     slot="trigger">
                    <span class="icon is-small">
                      <i class="fas fa-ellipsis-v"></i>
                    </span>
                  </a>
                  <b-dropdown-item @click="editParticipant(participant)">
                    <span class="icon is-small">
                      <i class="fas fa-pen"></i>
                    </span>
                    <span>Edit Participant</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="viewParticipant(participant)">
                    <span class="icon is-small">
                      <i class="fas fa-users"></i>
                    </span>
                    <span>View Participant</span>
                  </b-dropdown-item>
                  <hr class="dropdown-divider">
                  <b-dropdown-item @click="confirmDelete(participant.id)">
                    <span class="icon is-small">
                      <i class="fas fa-times has-text-danger"></i>
                    </span>
                    <span>Delete Participant</span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
          </nav>
          <div class="card-content"
               @click="viewParticipant(participant)">
            <div class="media">
              <div class="media-left"
                   v-if="participant.icon">
                <span class="icon is-large"
                      :key="participant.icon">
                  <i :class="participant.icon+ ' fa-2x'"></i>
                </span>
              </div>
              <div class="media-content">
                <p class="title is-size-6">
                  <span class="tooltip"
                        :data-tooltip="participant.name">{{participant.name | truncate(25) }}</span>
                </p>
                <p class="subtitle is-size-6">{{participant.commandAgency?participant.commandAgency.title:''}}</p>
              </div>
            </div>
            <div class="content">
              <p class="subtitle is-size-7">{{participant.trainingObjectives.length}} Total TOs</p>
              <p class="subtitle is-size-7">{{participant.totalAudience ? participant.totalAudience : 0}} Total Training Audience</p>
              <p class="subtitle is-size-7"
                 v-if="participant.fundings">{{totalFunding(participant.fundings) | formatNumber('currency')}} Funding</p>
              <div class="platforms">
                <template v-for="item in participant.platforms">
                  <p class="has-text-weight-semibold is-size-7 mb-0"
                     :key="item.id"
                     v-if="item.platform && item.platform.title">{{item.platform.title}} - {{item.platform.type}}</p>
                </template>
              </div>
              <template v-if="participant.platforms && participant.platforms.length > 2">
                <div class="showMore">
                  <span class="icon is-small">
                    <i class="fas fa-chevron-down"></i>
                  </span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-if="busyLoading"
           class="column is-12">
        <div class="card-header-title is-centered">
          <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
        </div>
        <p class="subtitle has-text-centered">Loading More Participants... </p>
      </div>
    </div>
    <div v-else
         class="columns no-result apollo">
      <div class="column is-full">
        <empty-state :data="planParticipants"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <span class="button is-primary"
                    @click="showCreateParticipant()">Create Participant</span>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <back-to-top bottom="20px"
                 right="20px">
      <button type="button"
              class="button">
        <span class="icon is-small">
          <i class="fas fa-arrow-up"></i>
        </span>
      </button>
    </back-to-top>
    <Participant-QuickAdd :open="showParticipant"
                          @close="closeShowParticipant" />
  </div>
</template>

<script>
import ParticipantQuickAdd from '@/plan/components/participant-quickadd'
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanParticipantsDelete,
  PlanParticipantsList,
  PlanParticipantSubscription,
  PlanParticipantsCounts
} from '@/plan/graphql/PlanParticipants.gql'
import helpers from '@/shared/mixins/helpers'
import { serverError } from '@/shared/serverError'

export default {
  name: 'participant-view',
  mixins: [helpers],
  components: { HelpContent, ParticipantQuickAdd },
  apollo: {
    planParticipantsCount: {
      query: PlanParticipantsCounts,
      variables() {
        let data = this.queryVariables()
        delete data.skip
        delete data.first
        delete data.orderBy
        return data
      },
      update(data) {
        if (
          data &&
          data.planParticipantsConnection &&
          data.planParticipantsConnection.aggregate
        ) {
          return data.planParticipantsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planParticipants: {
      query: PlanParticipantsList,
      variables() {
        let data = this.queryVariables()
        data.skip = 0
        return data
      },
      update(data) {
        if (data && data.planParticipants) {
          this.$apollo.queries.planParticipantsCount.refetch()
          return data.planParticipants
        }
      },
      subscribeToMore: {
        document: PlanParticipantSubscription,
        variables() {
          let datafromread = this.queryVariables()
          delete datafromread.skip
          delete datafromread.first
          delete datafromread.orderBy
          let data = {
            node: datafromread
          }
          return data
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          let mutationIn = subscriptionData.data.planParticipant.mutation
          var newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipants: [
                  subscriptionData.data.planParticipant.node,
                  ...previousResult.planParticipants
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipants: [
                  ...previousResult.planParticipants.filter(
                    obj =>
                      subscriptionData.data.planParticipant.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipants = JSON.parse(
                JSON.stringify(previousResult.planParticipants)
              )
              let index = newPlanParticipants.findIndex(
                x => x.id === subscriptionData.data.planParticipant.node.id
              )
              newPlanParticipants[index] =
                subscriptionData.data.planParticipant.node
              newResult = {
                planParticipants: newPlanParticipants
              }
              break
            }
            default: {
              throw new Error(`Unknown PlanParticipant mutation`)
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
      showParticipant: false,
      busyLoading: false,
      itemsPerPage: 24
    }
  },
  methods: {
    queryVariables() {
      let length = this.planParticipants ? this.planParticipants.length : 0
      let data = {
        where: {
          OR: [
            { name_contains: this.searchQuery },
            { commandAgency: { OR: [{ title_contains: this.searchQuery }] } },
            { participantType: { OR: [{ title_contains: this.searchQuery }] } },
            { serviceType: { title_contains: this.searchQuery } },
            { service: { title_contains: this.searchQuery } },
            {
              platforms_some: {
                OR: [
                  {
                    platform: {
                      OR: [
                        { title_contains: this.searchQuery },
                        { type_contains: this.searchQuery }
                      ]
                    }
                  },
                  {
                    participant: {
                      OR: [{ name_contains: this.searchQuery }]
                    }
                  }
                ]
              }
            }
          ]
        },
        orderBy: 'name_ASC',
        first: this.itemsPerPage,
        skip: length
      }
      return data
    },
    totalFunding(funding) {
      if (!funding) return
      let sum = 0

      for (let i = 0; i < funding.length; i++) {
        sum += funding[i].amount
      }
      return sum
    },
    showCreateParticipant() {
      this.showParticipant = true
    },
    closeShowParticipant() {
      this.showParticipant = false
    },
    confirmDelete(participant) {
      this.$buefy.dialog.confirm({
        title: 'Delete Participant',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteParticipant(participant)
      })
    },
    viewParticipant(participant) {
      this.$router.push({
        name: 'view-participant',
        params: { id: participant.id }
      })
    },
    editParticipant(participant) {
      this.$router.push({
        name: 'planParticipantEdit',
        params: { id: participant.id },
        query: { from: this.$route.fullPath }
      })
    },
    deleteParticipant(participant) {
      this.$apollo
        .mutate({
          mutation: PlanParticipantsDelete,
          variables: {
            id: {
              id: participant
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Participant Deleted!',
            type: 'is-success'
          })
          this.$apollo.queries.planParticipants.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Participant Deleted: ' + error)
        })
    },
    loadMore() {
      if (
        this.planParticipants &&
        this.planParticipants.length < this.planParticipantsCount
      ) {
        this.busyLoading = true
        this.$apollo.queries.planParticipants.fetchMore({
          variables: this.queryVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.planParticipants &&
              fetchMoreResult.planParticipants.length > 0
            ) {
              fetchMoreResult.planParticipants = [
                ...this.planParticipants,
                ...fetchMoreResult.planParticipants.filter(
                  n => !this.planParticipants.some(p => p.id === n.id)
                )
              ]

              this.busyLoading = false
              return fetchMoreResult
            }
          }
        })
      }
    }
  },
  watch: {
    searchQuery() {
      this.planParticipants = []
    }
  }
}
</script>

<style lang="scss" scoped>
.participants {
  .card {
    .card-content {
      min-height: 215px;
      max-height: 215px;
      .platforms {
        min-height: 50px;
        max-height: 50px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .content {
      p {
        & * {
          display: inline;
        }
        &.subtitle {
          margin-top: 15px;
          margin-bottom: 0;
        }
        &.subtitle + .subtitle:not(:last-child) {
          margin-top: 0;
          margin-bottom: 0;
        }
      }
    }
    &:hover {
      cursor: pointer;
      background-color: #d7dcdd;
    }
    .showMore {
      position: absolute;
      bottom: 11px;
      left: 0px;
      height: 20px;
      width: 50%;
      margin-left: 25px;
      margin-right: 25px;
      text-align: center;
    }
  }
}
</style>
