<template>
  <div class="container">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
        </div>
      </div>
      <div class="level-right">
        <help-content :reference="'media.calendar'"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div class="columns is-mobile">
      <div class="column is-12">
        <full-calendar :events="mediaPosts"
                       v-bind="calendarOptions"
                       :datesRender="viewRender"
                       @eventClick="eventSelected"></full-calendar>
      </div>
    </div>
    <post-preview-modal v-if="previewModal"
                        :open="previewModal"
                        :postObj="postObj"
                        :post="postObj ? postObj.id : null"
                        @close="closeModal"></post-preview-modal>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import PostPreviewModal from '@/media/components/post-previewModal'
import {
  MediaPostsCalendarRead,
  MediaPostRead,
  MediaPostsCalendarSubscription
} from '@/media/graphql/MediaPosts.gql'
import helpers from '@/shared/mixins/helpers'
import HelpContent from '@/shared/components/helpcontent'

export default {
  name: 'Calendar',
  mixins: [helpers],
  components: {
    HelpContent,
    FullCalendar,
    PostPreviewModal
  },
  apollo: {
    mediaPosts: {
      query: MediaPostsCalendarRead,
      variables() {
        return {
          where: {
            isUserGenerated: true,
            createTime_not: null,
            publishTime_gte: this.startMoment,
            publishTime_lte: this.endMoment
          },
          orderBy: 'createTime_ASC'
        }
      },
      update(data) {
        if (data && data.mediaPosts) {
          let posts = JSON.parse(JSON.stringify(data.mediaPosts))
          for (let i = 0; i < posts.length; i++) {
            posts[i].title = this.truncate(this.htmlDecode(posts[i].title), 50)
          }
          return posts
        }
      },
      subscribeToMore: {
        document: MediaPostsCalendarSubscription,
        variables() {
          return {
            where: {
              node: {
                isUserGenerated: true,
                createTime_not: null,
                publishTime_gte: this.startMoment,
                publishTime_lte: this.endMoment
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.mediaPost.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                mediaPosts: [
                  subscriptionData.data.mediaPost.node,
                  ...previousResult.mediaPosts
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                mediaPosts: [
                  ...previousResult.mediaPosts.filter(
                    obj =>
                      subscriptionData.data.mediaPost.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newMediaPosts = JSON.parse(
                JSON.stringify(previousResult.mediaPosts)
              )
              let index = newMediaPosts.findIndex(
                x => x.id === subscriptionData.data.mediaPost.node.id
              )
              newMediaPosts[index] = subscriptionData.data.mediaPost.node
              newResult = {
                mediaPosts: newMediaPosts
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
      calendarOptions: {
        timeZone: this.$store.state.activeWorkspace.timeZone,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
        },
        editable: true,
        handleWindowResize: false,
        contentHeight: 750,
        eventLimit: 5,
        displayEventTime: false,
        nowIndicator: true,
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          momentTimezonePlugin
        ]
      },
      postObj: null,
      previewModal: false,
      startMoment: null,
      endMoment: null
    }
  },
  methods: {
    closeModal() {
      this.previewModal = false
      this.postObj = null
    },
    eventSelected(e) {
      this.$apollo
        .query({
          query: MediaPostRead,
          variables: {
            where: {
              id: e.event.id
            }
          }
        })
        .then(response => {
          if (response && response.data) {
            this.postObj = response.data.mediaPost
          }
        })
      this.previewModal = true
    },
    viewRender(view) {
      // Get start and end dates from calendar
      this.startMoment = view.view.currentStart.toISOString()
      this.endMoment = view.view.currentEnd.toISOString()
      // get data for the interval
      this.$apollo.queries.mediaPosts.refetch()
    },
    htmlDecode(input) {
      let doc = new DOMParser().parseFromString(input, 'text/html')
      return doc.documentElement.textContent
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
</style>
