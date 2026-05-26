<template>
  <div>
    <label class="label">
      Recent Posts
      <span class="tooltip is-tooltip-right"
            data-tooltip="Shows the 5 most recent posts added by the noise generation">
        <i class="far fa-question-circle"></i>
      </span>
    </label>
    <div v-if="mediaPosts">
      <template v-for="(post) in mediaPosts">
        <post-card :post="post"
                   :showQuickMenu="false"
                   v-bind:key="post.id"/>
      </template>
    </div>
  </div>
</template>

<script>
import {
  MediaPostsRead,
  MediaPostsSubscription
} from '@/media/graphql/MediaPosts.gql'
import processText from '@/shared/mixins/processText'
import helpers from '@/shared/mixins/helpers'

export default {
  name: 'RecentPosts',
  props: {
    postNum: {
      default: 5
    }
  },
  mixins: [processText, helpers],
  apollo: {
    mediaPosts: {
      query: MediaPostsRead,
      variables() {
        return {
          where: {
            isPublished: true,
            isUserGenerated: false
          },
          orderBy: 'publishTime_DESC',
          first: this.postNum
        }
      },
      subscribeToMore: {
        document: MediaPostsSubscription,
        variables() {
          return {
            where: {
              node: {
                isPublished: true,
                isUserGenerated: false
              }
            }
          }
        },
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
              newMediaPosts.push(subscriptionData.data.mediaPost.node)
              newMediaPosts.sort(function(a, b) {
                let dateA = new Date(a.publishTime)
                let dateB = new Date(b.publishTime)
                return dateB - dateA
              })
              newMediaPosts = newMediaPosts.slice(0, 5)
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
      },
      error(error) {
        console.error(error)
      }
    }
  }
}
</script>

<style>
</style>
