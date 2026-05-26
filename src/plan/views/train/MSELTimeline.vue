<template>
  <div v-infinite-scroll="loadMore" 
       infinite-scroll-disabled="busyLoading" 
       infinite-scroll-distance="50" 
       class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <date-picker label="" 
                       :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)" 
                       placeholder="Start Date" 
                       showClear 
                       showNow 
                       v-model="mselStartDate" 
                       @clear="(value) => {mselStartDate = value}"
                       @now="(value) => {mselStartDate = value}"
                       @changed="(value) => {mselStartDate = value}" 
                       :key="'mselStartDate'" 
                       :name="'mselStartDate'" />
        </div>
        <div class="level-item">
          <date-picker label="" 
                       :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)" 
                       placeholder="End Date" 
                       showClear 
                       showNow 
                       v-model="mselEndDate"
                       @now="(value) => {mselEndDate = value}" 
                       @clear="(value) => {mselEndDate = value}" 
                       @changed="(value) => {mselEndDate = value}" 
                       :key="'mselEndDate'" 
                       :name="'mselEndDate'" />
        </div>
        <div class="level-item">
          <router-link class="button is-primary is-outlined" 
                       :to="{name: 'msel-timeline', query: {event: eventID} }" 
                       target="_blank">
            <span class="icon">
              <i class="fas fa-external-link-alt"></i>
            </span>
          </router-link>
        </div>
        <div class="level-item">
          <button class="button is-primary" 
                  @click="openFullScreen" 
                  :disabled="planInjects && planInjects.length == 0">
            <span class="icon">
              <i class="fas fa-expand-arrows-alt"></i>
            </span>
          </button>
        </div>
        <div class="level-item">
          <help-content :reference="'plan.train'" 
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
          <span class="has-text-weight-semibold">{{planInjectsCount}} MSEL Injects</span>
        </div>
        <div class="level-item" 
             v-if="planEvents">
          <div class="select">
            <select v-model="eventID">
              <option value="">
                All Events
              </option>
              <option disabled>
                ──────────
              </option>
              <option v-for="event in planEvents" 
                      v-bind:key="event.id" 
                      :value="event.id"> {{truncate(event.name, 25)}}</option>
            </select>
          </div>
        </div>
        <div class="level-item" 
             v-if="planLabelGroups">
          <div class="select">
            <select v-model="statusGroup">
              <option value="">
                All Boards
              </option>
              <option disabled>
                ──────────
              </option>
              <option v-for="board in planLabelGroups" 
                      v-bind:key="board.id" 
                      :value="board"> {{truncate(board.title, 25)}}</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
    <p v-if="endAfterStartCheck" 
       class="help has-text-danger has-text-centered">{{endAfterStartCheck}}</p>
    <div class="columns is-mobile is-multiline is-centered" 
         v-if="planInjects && planInjects.length > 0">
      <div class="column is-three-quarters">
        <div class="container is-relative"
             id="timeline">
          <nav class="level is-pulled-right">
            <div class="level-item">
              <button class="delete"
                      @click="closeFullScreen"></button>
            </div>
          </nav>
          <div class="timeline">
            <header class="timeline-header">
              <span class="tag is-medium is-primary tooltip"
                    :data-tooltip="planInjects ? planInjects[0].startDate : ''">{{planInjects ? formatDate(planInjects[0].startDate, 'shortDate') : ''}}</span>
            </header>
            <template v-for="(inject, index) in planInjects">
              <article :key="inject.id">
                <template v-if="index > 0 && !moment(inject.startDate).isSame(planInjects[index - 1].startDate, 'day')">
                  <div :key="index" 
                       class="timeline-divider columns is-variable is-vcentered">
                    <div class="column is-narrow is-1 is-paddingless">
                      <span class="tag is-size-7 is-inverted is-white">{{formatDate(inject.startDate, 'monthDay')}}</span>
                    </div>
                    <div class="column is-paddingless">
                      <hr class="dropdown-divider">
                    </div>
                  </div>
                </template>
                <div class="timeline-item" 
                     v-bind:key="inject.id" 
                     @click="previewInject(inject)">
                  <div class="timeline-marker is-icon">
                    <div v-if="inject.status" 
                         class="tag" 
                         :style="'background-color:'+injectColorChecker(inject.status) + ';border-color:'+injectColorChecker(inject.status)" 
                         :class="lightOrDark(injectColorChecker(inject.status))">
                      {{inject.status.title}}
                    </div>
                    <div v-else 
                         class="tag">
                      No Status
                    </div>
                  </div>

                  <div class="timeline-content">
                    <div class="card inject" 
                         :style="'background-color:'+injectColorChecker(inject.status)" 
                         :class="lightOrDark(injectColorChecker(inject.status))">
                      <div class="card-content"
                           :class="{'has-ribbon-left is-small': isInjectPastDue(inject, inject.status)}">
                        <div class="content">
                          <nav class="level">
                            <div class="level-left">
                              <div class="level-item">
                                <span class="title is-6 tooltip is-tooltip-long"
                                      :data-tooltip="`#${inject.number} ${inject.title}`">#{{inject.number}} - {{truncate(inject.title, 25)}}</span>
                              </div>
                            </div>
                            <div class="level-right">
                              <div class="level-item">
                                <span class="subtitle is-6">{{inject.owner ? inject.owner.title : null}}</span>
                              </div>
                            </div>
                          </nav>
                          <div class="ribbon is-small is-danger"
                               v-if="isInjectPastDue(inject, inject.status)">
                            Past Due
                          </div>
                          <nav class="level">
                            <div class="level-left">
                              <div class="level-item">
                                <span class="subtitle is-7 tooltip"
                                      :data-tooltip="formatDate(inject.startDate, 'utc-dtg')">{{formatDate(inject.startDate, 'dtg')}}</span>
                              </div>
                            </div>
                            <div class="level-right">
                              <div class="level-item" 
                                   v-if="inject.events">
                                <span class="tooltip" 
                                      :data-tooltip="inject.events.name">{{inject.events.name | truncate(20)}}</span>
                              </div>
                            </div>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-content response">
                    <span class="icon"><i class="fas fa-chevron-right"></i></span>
                  </div>
                  <div class="timeline-content">
                    <div class="card response" 
                         :style="'background-color:'+responseChecker(inject.status)">
                      <div class="card-content" 
                           :class="lightOrDark(responseChecker(inject.status))">
                        <nav class="level" 
                             v-if="inject.responseDate">
                          <div class="level-left">
                            <span class="tag is-white is-7 tooltip"
                                  :data-tooltip="showDiff(inject.startDate, inject.responseDate)">
                              <i>{{formatDate(inject.responseDate, 'dtg')}}</i>
                            </span>
                          </div>
                        </nav>
                        <div class="content">
                          <span v-if="inject.response && !inject.mitigation">
                            <p class="subtitle is-7">{{inject.response | truncate(25)}}</p>
                          </span>
                          <span v-else-if="inject.mitigation">
                            <p class="subtitle is-7">{{inject.mitigation | truncate(25)}}</p>
                          </span>
                          <p class="subtitle is-7"
                             v-else>No Response Entered</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </template>
          </div>
        </div>
      </div>
      <div v-if="busyLoading" 
           class="column is-12">
        <div class="card-header-title is-centered">
          <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
        </div>
        <p class="subtitle has-text-centered">Loading More Injects... </p>
      </div>
    </div>
    <div v-else 
         class="column is-12 no-result apollo">
      <empty-state :data="planInjects" 
                   :isLoading='$apollo.loading' />
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
    <inject-preview :open="previewModal" 
                    :id="selectedInject" 
                    @close="closeModal"></inject-preview>
  </div>
</template>

<script>
import {
  PlanEventRead,
  PlanEventsSelector,
  PlanEventSubscription
} from '@/plan/graphql/PlanEvents.gql'
import {
  PlanInjectsList,
  PlanInjectsCounts,
  PlanInjectsSubscription
} from '@/plan/graphql/PlanInjects.gql'
import {
  PlanLabelGroupsRead,
  PlanLabelGroupSubscription
} from '@/plan/graphql/PlanLabelGroups.gql'
import HelpContent from '@/shared/components/helpcontent'
import helpers from '@/shared/mixins/helpers'
import lightOrDark from '@/shared/mixins/lightOrDark'
import InjectPreview from '@/plan/components/inject-preview'
import dateChecks from '@/shared/mixins/dateChecks'
import injectStatusCheck from '@/shared/mixins/injectStatusCheck'
import DatePicker from '@/shared/components/datepicker'
export default {
  name: 'msel-timeline',
  components: {
    HelpContent,
    InjectPreview,
    DatePicker
  },
  mixins: [helpers, lightOrDark, dateChecks, injectStatusCheck],
  apollo: {
    planEvent: {
      query: PlanEventRead,
      variables() {
        return {
          where: {
            id: this.eventID
          }
        }
      },
      skip() {
        return !this.eventID
      },
      update(data) {
        if (data && data.planEvent) {
          return data.planEvent
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planEvents: {
      query: PlanEventsSelector,
      variables: {
        where: {
          type: null
        }
      },
      update(data) {
        if (data && data.planEvents && data.planEvents.length > 0) {
          return data.planEvents
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: [
        {
          document: PlanEventSubscription,
          variables: {
            node: {
              where: {
                type: null
              }
            }
          },
          // Mutate the previous result
          updateQuery(previousResult, { subscriptionData }) {
            // Mutation type
            let mutationIn = subscriptionData.data.planEvent.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  planEvents: [
                    ...previousResult.planEvents,
                    subscriptionData.data.planEvent.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  planEvents: [
                    ...previousResult.planEvents.filter(
                      obj =>
                        subscriptionData.data.planEvent.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedPlanEvents = JSON.parse(
                  JSON.stringify(previousResult.planEvents)
                )
                let index = updatedPlanEvents.findIndex(
                  x => x.id === subscriptionData.data.planEvent.node.id
                )
                updatedPlanEvents[index] = subscriptionData.data.planEvent.node
                newResult = {
                  planEvents: updatedPlanEvents
                }
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            // Here, return the new result from the previous with the new data
            return newResult
          }
        }
      ]
    },
    planInjects: {
      query: PlanInjectsList,
      variables() {
        let data = this.injectsReadVariables()
        data.skip = 0
        return data
      },
      update(data) {
        return data.planInjects
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: [
        {
          document: PlanInjectsSubscription,
          variables() {
            let datafromread = this.injectsReadVariables()
            delete datafromread.skip
            delete datafromread.first
            delete datafromread.orderBy
            let data = {
              node: datafromread
            }
            return data
          },
          // Mutate the previous result
          updateQuery() {
            this.refetchQueries()
          }
        }
      ]
    },
    planInjectsCount: {
      query: PlanInjectsCounts,
      variables() {
        let data = this.injectsReadVariables()
        delete data.skip
        delete data.first
        delete data.orderBy
        return data
      },
      update(data) {
        if (
          data &&
          data.planInjectsConnection &&
          data.planInjectsConnection.aggregate
        ) {
          return data.planInjectsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planLabelGroups: {
      query: PlanLabelGroupsRead,
      update(data) {
        if (data && data.planLabelGroups && data.planLabelGroups.length > 0) {
          if (this.board && this.board.length > 0)
            this.statusGroup = data.planLabelGroups.find(
              label => label.title === this.board
            )

          return data.planLabelGroups
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: [
        {
          document: PlanLabelGroupSubscription,
          // Mutate the previous result
          updateQuery(previousResult, { subscriptionData }) {
            // Mutation type
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
                        subscriptionData.data.planLabelGroup.previousValues
                          .id !== obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedPlanLabelGroups = JSON.parse(
                  JSON.stringify(previousResult.planLabelGroups)
                )
                let index = updatedPlanLabelGroups.findIndex(
                  x => x.id === subscriptionData.data.planEvent.node.id
                )
                updatedPlanLabelGroups[index] =
                  subscriptionData.data.planLabelGroup.node
                newResult = {
                  planLabelGroups: updatedPlanLabelGroups
                }
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            // Here, return the new result from the previous with the new data
            return newResult
          }
        }
      ]
    }
  },
  data() {
    return {
      board: this.$route.query.b ? this.$route.query.b : '',
      statusGroup: '',
      selectedInject: null,
      previewModal: false,
      eventID: this.$route.query.event ? this.$route.query.event : '',
      endAfterStartCheck: null,
      mselStartDate: null,
      mselEndDate: null,
      busyLoading: false,
      itemsPerPage: 10,
      planInjectsCount: 0
    }
  },
  methods: {
    clearSelection() {
      this.eventID = ''
    },
    refetchQueries() {
      this.$apollo.queries.planInjects.refetch()
      this.$apollo.queries.planInjectsCount.refetch()
    },
    injectsReadVariables() {
      let length = this.planInjects ? this.planInjects.length : 0
      let data = {
        where: {
          AND: [{ startDate_not: null }, { deletedAt: null }]
        },
        orderBy: 'startDate_ASC',
        first: this.itemsPerPage,
        skip: length
      }

      if (!this.mselStartDate && !this.mselEndDate) {
        this.endAfterStartCheck = this.isEndAfterStart(
          this.mselStartDate,
          this.mselEndDate
        )
      }

      if (!this.mselStartDate && this.mselEndDate) {
        this.endAfterStartCheck = this.isEndAfterStart(
          this.mselEndDate,
          this.mselEndDate
        )
      }

      if (this.mselStartDate && !this.mselEndDate) {
        data.where.AND.push({
          startDate_gte: this.mselStartDate
        })
      }

      if (this.mselStartDate && this.mselEndDate) {
        this.endAfterStartCheck = this.isEndAfterStart(
          this.mselStartDate,
          this.mselEndDate
        )

        if (!this.endAfterStartCheck) {
          data.where.AND.push({
            startDate_gte: this.mselStartDate,
            startDate_lte: this.mselEndDate
          })
        }
      }

      if (this.eventID) {
        data.where.AND.push({
          events: {
            id: this.eventID
          }
        })
      }
      if (
        this.statusGroup &&
        this.statusGroup.groupLabels &&
        this.statusGroup.groupLabels.length > 0
      ) {
        data.where.AND.push({
          status: {
            title_in: this.statusGroup.groupLabels.map(label => label.title)
          }
        })
      }
      return data
    },

    previewInject(inject) {
      this.previewModal = true
      this.selectedInject = inject.id
    },
    closeModal() {
      this.previewModal = false
      this.selectedInject = null
    },
    openFullScreen() {
      let elem = document.getElementById('timeline')
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen()
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen()
      }
    },
    closeFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen()
      }
    },
    injectColorChecker(status) {
      if (status && status.color) {
        return status.color
      }
    },
    responseChecker(status) {
      let colorReturn = ''
      if (status && status.title && status.color) {
        if (status.title === 'Complete' || status.title === 'Incomplete') {
          colorReturn = status.color
        }
      }
      return colorReturn
    },
    loadMore() {
      if (this.planInjects && this.planInjects.length < this.planInjectsCount) {
        this.busyLoading = true
        this.$apollo.queries.planInjects.fetchMore({
          variables: this.injectsReadVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.planInjects &&
              fetchMoreResult.planInjects.length > 0
            ) {
              fetchMoreResult.planInjects = [
                ...this.planInjects,
                ...fetchMoreResult.planInjects.filter(
                  n => !this.planInjects.some(p => p.id === n.id)
                )
              ]

              this.busyLoading = false
              return fetchMoreResult
            }
          }
        })
      } else {
        this.refetchQueries()
      }
    }
  },
  watch: {
    eventID() {
      this.$router.push({
        query: {
          event: this.eventID,
          b:
            this.statusGroup && this.statusGroup.title.length > 0
              ? this.statusGroup.title
              : ''
        }
      })
      this.planInjects = []
    },
    statusGroup() {
      this.$router.push({
        query: {
          event: this.eventID,
          b:
            this.statusGroup && this.statusGroup.title.length > 0
              ? this.statusGroup.title
              : ''
        }
      })
      this.planInjects = []
    }
  }
}
</script>

<style lang="scss" scoped>
#timeline {
  .delete {
    display: none;
  }
  &:fullscreen {
    padding: 2.5rem;
    background-color: white;
    .delete {
      display: block;
    }
  }
}
.timeline {
  .timeline-item {
    cursor: pointer;
    padding-bottom: 0;
    .timeline-content {
      .ribbon {
        transform: translate(0px, 100%);
      }
      &.response {
        display: flex;
        padding: 0;
        & .icon {
          align-self: center;
          align-items: center;
          justify-content: center;
        }
        & + div.timeline-content {
          padding-left: 0;
        }
      }
      .card {
        width: 30vw;
        max-width: 30vw;
        border-radius: 0;
        .card-content {
          padding: 0.5rem;
        }
      }
    }
  }
  & .timeline-marker {
    &.is-icon {
      &.tag {
        border-radius: 0.4em;
        height: 2em;
        width: auto;
        padding-left: 0.75em;
        padding-right: 0.75em;
        left: -1.7em;
      }
    }
  }
  & .timeline-divider {
    margin: 0.75rem 0;
  }
}

@media screen and (min-width: 1024px) {
  #timeline {
    .card {
      &.response,
      &.inject {
        .card-content {
          max-height: 80px;
          min-height: 80px;
        }
      }
      &.response .card-content .content {
        overflow: hidden;
      }
    }
  }
}
</style>
