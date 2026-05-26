<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busyLoading"
       infinite-scroll-distance="50"
       class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="createNewEvent">
            Create Event
          </a>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <span class="has-text-weight-semibold">{{planEventsCount}} Events</span>
        </div>
        <div class="level-item">
          <div class="select">
            <select v-model="selectOrderBy">
              <optgroup label="Sort By">
                <option v-for="option in typesOrderBy"
                        :key="option.type"
                        :value="option.type">
                  {{option.name}}
                </option>
              </optgroup>
            </select>
          </div>
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <router-link :to="{ name: 'events-calendar'}">
                <button class="button"
                        title="Calendar">
                  <span class="icon is-small">
                    <i class="fas fa-calendar-alt has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
            <p class="control">
              <router-link :to="{ name: 'events-cards'}">
                <button class="button"
                        title="Cards">
                  <span class="icon is-small">
                    <i class="fas fa-th-large has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
          </div>
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
          <help-content :reference="'plan.prepare.event'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div class="columns is-multiline is-mobile"
         v-if="planEvents && planEvents.length > 0">
      <div class="column is-3-desktop is-6-tablet is-12-mobile"
           v-for="(event) in planEvents"
           v-bind:key="event.id">
        <div class="card events">
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
                  <b-dropdown-item @click="editEvent(event)">
                    <span class="icon is-small">
                      <i class="fas fa-pen"></i>
                    </span>
                    <span>Edit Event</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="viewEvent(event)">
                    <span class="icon is-small">
                      <i class="fas fa-calendar-week"></i>
                    </span>
                    <span>View Event</span>
                  </b-dropdown-item>
                  <hr class="dropdown-divider">
                  <b-dropdown-item @click="confirmDelete(event)">
                    <span class="icon is-small">
                      <i class="fas fa-times has-text-danger"></i>
                    </span>
                    <span>Delete Event</span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
          </nav>
          <div class="card-content"
               @click="viewEvent(event)">
            <div class="media mb-1">
              <div class="media-left mr-1">
                <span class="tag is-rounded"
                      :style="'background-color:'+event.color"></span>
              </div>
              <div class="media-content">
                <p class="title is-size-6">
                  <span class="tooltip"
                        :data-tooltip="event.name">{{event.name | truncate(30)}}</span>
                </p>
              </div>
            </div>
            <div class="content">
              <p class="title is-size-7">
                <span class="tooltip"
                      :data-tooltip="formatDate(event.startDate, 'utc-dtg')">{{formatDate(event.startDate, 'dtg')}}</span>
                - <span class="tooltip"
                        :data-tooltip="formatDate(event.endDate, 'utc-dtg')">{{formatDate(event.endDate, 'dtg')}}</span>
              </p>
              <p class="title is-size-7">{{event.method}}</p>
              <p class="is-size-7">{{event.injects ? event.injects.length : 0}} MSEL Injects</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="busyLoading"
           class="column is-12">
        <div class="card-header-title is-centered">
          <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
        </div>
        <p class="subtitle has-text-centered">Loading More Events... </p>
      </div>
    </div>
    <div v-else
         class="columns is-multiline is-mobile">
      <div class="column is-12">
        <empty-state :data="planEvents"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="createNewEvent">
                Create Event
              </a>
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
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanEventsList,
  PlanEventsCounts,
  PlanEventsDelete,
  PlanEventSubscription
} from '@/plan/graphql/PlanEvents.gql'
import helpers from '@/shared/mixins/helpers'

export default {
  name: 'events-list',
  mixins: [helpers],
  components: { HelpContent },
  apollo: {
    planEventsCount: {
      query: PlanEventsCounts,
      variables() {
        let data = this.queryVariables()
        delete data.skip
        delete data.first
        delete data.orderBy
        return data
      },
      update(data) {
        if (data && data.planEventsConnection) {
          return data.planEventsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planEvents: {
      query: PlanEventsList,
      variables() {
        let data = this.queryVariables()
        data.skip = 0
        return data
      },
      update(data) {
        if (data && data.planEvents) {
          return data.planEvents
        }
      },
      subscribeToMore: {
        document: PlanEventSubscription,
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
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planEvent.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planEvents: [
                  subscriptionData.data.planEvent.node,
                  ...previousResult.planEvents
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
              let newPlanEvents = JSON.parse(
                JSON.stringify(previousResult.planEvents)
              )
              let index = newPlanEvents.findIndex(
                x => x.id === subscriptionData.data.planEvent.node.id
              )
              newPlanEvents[index] = subscriptionData.data.planEvent.node
              newResult = {
                planEvents: newPlanEvents
              }
              break
            }
            default: {
              throw new Error(`Unknown mediaPost mutation`)
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
      planEventsCount: 0,
      planEvents: [],
      selectedEvent: null,
      selectOrderBy: this.$route.query.sort || 'startDate_ASC',
      typesOrderBy: [
        { name: 'Name', type: 'name_ASC' },
        { name: 'Latest Start Date', type: 'startDate_DESC' },
        { name: 'Earliest Start Date', type: 'startDate_ASC' }
      ],
      busyLoading: false,
      itemsPerPage: 24
    }
  },
  watch: {
    searchQuery() {
      this.$router.push({
        query: { q: this.searchQuery, sort: this.selectOrderBy }
      })
      this.planEvents = []
    },
    selectOrderBy() {
      this.$router.push({
        query: { q: this.searchQuery, sort: this.selectOrderBy }
      })
      this.planEvents = []
    }
  },
  methods: {
    queryVariables() {
      let length = this.planEvents ? this.planEvents.length : 0
      let data = {
        where: {
          OR: [
            { name_contains: this.searchQuery },
            { description_contains: this.searchQuery },
            { type_contains: this.searchQuery },
            { method_contains: this.searchQuery },
            { organization: { name_contains: this.searchQuery } },
            { organization: { group_contains: this.searchQuery } },
            { color_contains: this.searchQuery },
            { exerciseGuidance_contains: this.searchQuery }
          ],
          type: null
        },
        orderBy: this.selectOrderBy,
        first: this.itemsPerPage,
        skip: length
      }
      return data
    },
    createNewEvent() {
      this.$router.push({
        name: 'createEvent'
      })
    },
    editEvent(event) {
      this.$router.push({
        name: 'editEvent',
        params: { event: event, id: event.id, isEdit: true }
      })
    },
    viewEvent(event) {
      this.$router.push({
        name: 'view-event',
        params: { id: event.id }
      })
    },
    deleteEvent(event) {
      // Delete Event
      this.$apollo
        .mutate({
          mutation: PlanEventsDelete,
          variables: {
            id: {
              id: event.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Event Deleted!',
            type: 'is-success'
          })
          this.$apollo.queries.planEvents.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Event: ' + error)
        })
    },
    confirmDelete(event) {
      this.$buefy.dialog.confirm({
        title: 'Delete Event',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteEvent(event)
      })
    },
    loadMore() {
      if (this.planEvents && this.planEvents.length < this.planEventsCount) {
        this.busyLoading = true
        this.$apollo.queries.planEvents.fetchMore({
          variables: this.queryVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.planEvents &&
              fetchMoreResult.planEvents.length > 0
            ) {
              fetchMoreResult.planEvents = [
                ...this.planEvents,
                ...fetchMoreResult.planEvents.filter(n => {
                  !this.planEvents.some(p => p.id === n.id)
                })
              ]

              this.busyLoading = false
              return fetchMoreResult
            }
          }
        })
      }
    }
  },
  computed: {
    trainingObj() {
      // When we get training Objectives hooked up, update this
      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
.events {
  span.tag {
    height: 1rem;
    width: 1rem;
    padding: 0;
  }
  .card-content {
    min-height: 155px;
    max-height: 155px;
  }
  &:hover {
    cursor: pointer;
    background-color: #d7dcdd;
  }
}
</style>
