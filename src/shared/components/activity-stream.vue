<template>
  <div class="container"
       v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busyLoadingPosts"
       infinite-scroll-distance="50">
    <div v-if="activityStreams && activityStreams.length > 0">
      <nav class="panel activityStream">
        <template v-for="(activity) of activityStreams">
          <div v-bind:key="activity.id"
               class="panel-block streamItem">
            <div class="content">
              <span class="is-hidden-mobile">
                <avatar-letter :name='activity.name'
                               size='32'
                               :rounded=true />
              </span>
              <span class="has-text-black-ter has-text-weight-semibold is-block-mobile">{{activity.name}}</span>
              <span class="has-text-grey-darker">
                {{activity.type | formatText('camelCase')}}
              </span>

              <template v-if="activity.content">
                <div class="box"
                     v-html="activity.content"></div>
              </template>

              <ApolloQuery :query="planInjectReadQuery"
                           :variables="{where: {id: activity.referenceID}}"
                           tag="span">
                <template slot-scope="{ result: { loading, error, data } }">
                  <div v-if="loading"
                       class="loading apollo">
                    Loading...
                  </div>
                  <div v-else-if="error"
                       class="error apollo">
                    An error occurred
                  </div>
                  <template v-else-if="data">
                    <span class="tooltip"
                          :data-tooltip="'#'+data.planInject.number+' - '+data.planInject.title"
                          v-if="$route.name=='activity-home'">
                      <router-link class="has-text-link"
                                   :to="{name: 'view-inject', params: { id: activity.referenceID }}">#{{data.planInject.number}} - {{data.planInject.title }}</router-link>
                    </span>
                  </template>
                  <div v-else
                       class="no-result apollo">
                    Inject
                  </div>
                </template>
              </ApolloQuery>
              <span class="has-text-weight-ligh has-text-grey-dark is-size-7 tooltip"
                    :data-tooltip="formatDate(activity.createdAt, 'utc-dtg')"> {{formatDate(activity.createdAt, 'fromNow')}}</span>
            </div>
          </div>
        </template>
      </nav>
      <div class="column is-12"
           v-if="busyLoadingPosts">
        <div class="card-header-title is-centered">
          <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
        </div>
        <p class="subtitle has-text-centered">Loading More... </p>
      </div>
    </div>
    <div v-else>
      <empty-state :data="activityStreams"
                   :isLoading='$apollo.loading'>
        <template slot="custom-message">
          <p class="subtitle has-text-centered">No Activity Found.</p>
        </template>
      </empty-state>
    </div>
    <back-to-top bottom="50px"
                 right="10px">
      <button type="button"
              class="button">
        <span class="icon is-small"> <i class="fas fa-arrow-up"></i> </span>
      </button>
    </back-to-top>
    <template v-if="id">
      <div class="field">
        <label class="label">
          Comment
        </label>
        <div class="control">
          <form data-vv-scope="commentValue"
                v:on-submit.prevent>
            <quill-editor ref="quillText"
                          v-model="commentValue"
                          :options="editorOption"></quill-editor>
          </form>
        </div>
      </div>
      <div>
        <button class="button is-primary"
                @click="createComment(commentValue)">
          Comment
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import {
  ActivityStreamsRead,
  ActivityStreamSubscription,
  ActivityStreamsCount,
  ActivityStreamCommentCreate
} from '@/activity/graphql/ActivityStreams.gql'
import AvatarLetter from './avatar-letter'
import { PlanInjectRead } from '@/plan/graphql/PlanInjects.gql'

let toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link'],

  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }, { align: [] }] // outdent/indent
]

export default {
  name: 'activity-stream',
  components: { AvatarLetter },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  apollo: {
    activityStreamsCount: {
      query: ActivityStreamsCount,
      variables() {
        let data = this.activityReadVariables()
        // delete keys not used for count
        delete data.skip
        delete data.first
        delete data.orderBy

        return data
      },
      update(data) {
        if (data && data.activityStreamsConnection) {
          return data.activityStreamsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    activityStreams: {
      query: ActivityStreamsRead,
      variables() {
        let data = this.activityReadVariables()
        data.skip = 0
        return data
      },
      update(data) {
        if (data && data.activityStreams) {
          this.$emit(
            'createdBy',
            data && data.activityStreams && data.activityStreams[0]
              ? data.activityStreams[0].name
              : null
          )
          return data.activityStreams
        }
      },
      subscribeToMore: {
        document: ActivityStreamSubscription,
        variables() {
          let datafromread = this.activityReadVariables()
          delete datafromread.orderBy

          let data = {
            node: datafromread
          }
          return data
        },
        updateQuery(previousResult, { subscriptionData }) {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.activityStream.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              if (this.id) {
                newResult = {
                  activityStreams: [
                    ...previousResult.activityStreams,
                    subscriptionData.data.activityStream.node
                  ]
                }
              } else {
                newResult = {
                  activityStreams: [
                    subscriptionData.data.activityStream.node,
                    ...previousResult.activityStreams
                  ]
                }
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
      busyLoadingPosts: false,
      itemsPerPage: 25,
      activityStreams: [],
      planInjectReadQuery: PlanInjectRead,
      commentValue: '',
      editorOption: {
        placeholder: 'Write a comment...',
        modules: {
          toolbar: toolbarOptions
        }
      }
    }
  },
  methods: {
    loadMore() {
      if (this.activityStreams.length < this.activityStreamsCount) {
        this.busyLoadingPosts = true
        this.$apollo.queries.activityStreams.fetchMore({
          variables: this.activityReadVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.activityStreams &&
              fetchMoreResult.activityStreams.length > 0
            ) {
              fetchMoreResult.activityStreams = [
                ...this.activityStreams,
                ...fetchMoreResult.activityStreams.filter(
                  n => !this.activityStreams.some(p => p.id === n.id)
                )
              ]

              this.busyLoadingPosts = false
              return fetchMoreResult
            }
          }
        })
      }
    },
    activityReadVariables() {
      let length = this.activityStreams ? this.activityStreams.length : 0
      let orderBy = this.id ? 'createdAt_ASC' : 'createdAt_DESC'
      let lookupRecord
      let data = {
        orderBy: orderBy,
        skip: length,
        first: this.itemsPerPage
      }

      if (this.id) {
        lookupRecord = {
          where: {
            referenceID: this.id
          }
        }
        data = {
          ...data,
          ...lookupRecord
        }
      }
      return data
    },
    createComment(commentText) {
      let data = {
        summary: 'User Comment',
        actor: '',
        type: 'comment',
        referenceID: this.id,
        content: commentText
      }
      this.$apollo
        .mutate({
          mutation: ActivityStreamCommentCreate,
          variables: {
            data: { ...data }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          //Clear comment after submission
          this.commentValue = ''
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error(error.message)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.activityStream {
  padding-left: 0;
  .streamItem {
    .content {
      * {
        margin: 0 0.15rem;
      }
    }
  }
}
@media screen and (min-width: 767px) {
  .activityStream {
    .streamItem {
      .content {
        * {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
