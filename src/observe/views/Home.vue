<template>
  <div class="container is-fullheight posts-container"
       v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busyLoadingPosts"
       infinite-scroll-distance="50">
    <nav class="level is-mobile">
      <div class="level-left">
        <h2 class="subtitle">
          Observations
        </h2>
      </div>
      <div class="level-right">
        <help-content reference="observe.home"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div v-if="observePosts && observePosts.length > 0">
      <template v-for="(post,index) of observePosts">
        <template v-if="index == 0 || index > 0 && !moment(post.createdAt).isSame(observePosts[index - 1].createdAt, 'day')">
          <div class="is-divider has-text-bold"
               v-bind:key="index"
               style="position: sticky;top: 0;z-index:1;">
            <div class="tag tooltip">
              {{formatDate(post.createdAt, 'monthDay')}}
            </div>
          </div>
        </template>
        <div class="columns is-multiline is-mobile "
             :key="post.id">
          <div class="column is-full">
            <div class="card">
              <b-dropdown position="is-bottom-left"
                          class="is-pulled-right">
                <a class="button is-small"
                   slot="trigger">
                  <span class="icon is-small">
                    <i class="fas fa-ellipsis-v"></i>
                  </span>
                </a>
                <b-dropdown-item @click="confirmDeletePost(post.id)"
                                 v-if="user && post.author && (post.author===user.name)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Post</span>
                </b-dropdown-item>
                <b-dropdown-item v-else>
                  <span class="icon is-small">
                    <i class="fas fa-lock"></i>
                  </span>
                  <span>Protected</span>
                </b-dropdown-item>
              </b-dropdown>
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <span v-if="post.author">
                      <avatar-letter :name='post.author'
                                     size='32'
                                     :rounded=true />
                    </span>
                  </div>
                  <div class="media-content">
                    <span class="title is-6"
                          v-if="post.author">
                      {{ post.author }}
                    </span>
                    <span class="tooltip has-text-weight-light is-7"
                          :data-tooltip="formatDate(post.createdAt, 'utc-dtg')">{{ formatDate(post.createdAt, 'convertDate') }}</span>
                  </div>
                </div>
                <div class="content">
                  <p class="title is-6 has-text-weight-normal"
                     v-html="post.text"></p>
                </div>
                <div class="attachmentList">
                  <template v-for="file in post.attachments">
                    <figure v-if="ifImage(file.contentType)"
                            class="image is-128x128"
                            :key="file.id">
                      <img :src="file.url.thumb"
                           @click="imagePreview(file)">
                    </figure>
                    <figure class="image is-128x128"
                            v-else-if="ifAudio(file.contentType)"
                            :key="file.id">
                      <audio controls>
                        <source :src="file.url.raw"
                                :type="file.contentType">
                      </audio>
                    </figure>
                    <figure class="image is-128x128"
                            v-else-if="ifVideo(file.contentType)"
                            :key="file.id"
                            @click="imagePreview(file)">
                      <video height="128"
                             width="128"
                             preload="autoload"
                             data-setup='{ "aspectRatio":"16:9" }'>
                        <source :src="file.url.raw+ '#t=5'">
                      </video>
                    </figure>
                    <figure class="image is-128x128 has-text-centered"
                            v-else
                            :key="file.id">
                      <a :href="file.url.raw"
                         class="is-size-7"
                         target="_blank">
                        <i :class="getIcon(file.contentType) + ' fa-2x'"></i><br />
                        {{file.name}}
                      </a>
                    </figure>
                  </template>
                </div>
                <div v-if="post.location">
                  <Geocode :coordinates="post.location.geojson.coordinates"
                           :display="'inline'">
                  </Geocode>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="column is-12"
           v-if="busyLoadingPosts">
        <div class="card-header-title is-centered">
          <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
        </div>
        <p class="subtitle has-text-centered">Loading More Posts... </p>
      </div>
    </div>
    <div v-else>
      <empty-state :isCard="false"
                   :data="observePosts"
                   :search="searchQuery ? true : false"
                   :isLoading='$apollo.loading' />
    </div>
    <back-to-top bottom="50px"
                 right="10px">
      <button type="button"
              class="button">
        <span class="icon is-small"> <i class="fas fa-arrow-up"></i> </span>
      </button>
    </back-to-top>

    <media-preview :open="imagePreviewModal"
                   :file="selectedImage"
                   @close="closeModal"></media-preview>
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import AvatarLetter from '@/shared/components/avatar-letter'
import MediaPreview from '@/shared/components/mediaPreview'
import mediaCheck from '@/shared/mixins/mediaCheck'
import Geocode from '@/shared/components/geocode'
import { LocalGetSelf } from '@/state/graphql/user.gql'
import {
  ObservePostsRead,
  ObservePostSubscription,
  ObservePostDelete,
  ObservePostsCount
} from '../graphql/ObservePost.gql'

export default {
  name: 'ObserveHome',
  components: {
    AvatarLetter,
    HelpContent,
    MediaPreview,
    Geocode
  },
  mixins: [mediaCheck],
  apollo: {
    user: {
      query: LocalGetSelf,
      update(data) {
        if (data && data.user) {
          return data.user
        }
      }
    },
    observePostsCount: {
      query: ObservePostsCount,
      variables() {
        let data = this.postReadVariables()
        // delete keys not used for count
        delete data.skip
        delete data.first
        delete data.orderBy

        return data
      },
      update(data) {
        if (data && data.observePostsConnection) {
          return data.observePostsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    observePosts: {
      query: ObservePostsRead,
      variables() {
        let data = this.postReadVariables()
        data.skip = 0
        return data
      },
      subscribeToMore: {
        document: ObservePostSubscription,
        variables() {
          let datafromread = this.postReadVariables()
          delete datafromread.orderBy

          let data = {
            node: datafromread
          }
          return data
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.observePost.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                observePosts: [
                  subscriptionData.data.observePost.node,
                  ...previousResult.observePosts
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                observePosts: [
                  ...previousResult.observePosts.filter(
                    obj =>
                      subscriptionData.data.observePost.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newObservePosts = JSON.parse(
                JSON.stringify(previousResult.observePosts)
              )
              let index = newObservePosts.findIndex(
                x => x.id === subscriptionData.data.observePost.node.id
              )
              newObservePosts[index] = subscriptionData.data.observePost.node
              newResult = {
                observePosts: newObservePosts
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
      searchQuery: '',
      imagePreviewModal: false,
      selectedImage: null,
      busyLoadingPosts: false,
      itemsPerPage: 10,
      observePosts: []
    }
  },
  methods: {
    loadMore() {
      if (this.observePosts.length < this.observePostsCount) {
        this.busyLoadingPosts = true
        this.$apollo.queries.observePosts.fetchMore({
          variables: this.postReadVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.observePosts &&
              fetchMoreResult.observePosts.length > 0
            ) {
              fetchMoreResult.observePosts = [
                ...this.observePosts,
                ...fetchMoreResult.observePosts.filter(
                  n => !this.observePosts.some(p => p.id === n.id)
                )
              ]

              this.busyLoadingPosts = false
              return fetchMoreResult
            }
          }
        })
      }
    },
    postReadVariables() {
      let length = this.observePosts ? this.observePosts.length : 0
      let data = {
        where: {
          text_contains: this.searchQuery || ''
        },
        orderBy: 'createdAt_DESC',
        skip: length,
        first: this.itemsPerPage
      }
      return data
    },
    confirmDeletePost(postId) {
      this.$buefy.dialog.confirm({
        title: 'Delete Post',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteObservePost(postId)
      })
    },
    imagePreview(image) {
      this.imagePreviewModal = true
      this.selectedImage = image
    },
    closeModal() {
      this.imagePreviewModal = false
      this.selectedImage = null
    },
    deleteObservePost(postId) {
      this.$apollo
        .mutate({
          mutation: ObservePostDelete,
          variables: {
            id: {
              id: postId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Post Deleted!',
            type: 'is-success'
          })
          this.$apollo.queries.observePosts.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Observe Post: ' + error)
        })
    }
  },
  mounted() {
    if (
      this.$route.query &&
      this.$route.query.q &&
      this.$route.query.q.length > 0
    )
      this.searchQuery = this.$route.query.q
    else this.searchQuery = ''
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query && to.query.q && to.query.q.length > 0)
      this.searchQuery = to.query.q
    else this.searchQuery = ''
    next()
  }
}
</script>
<style lang="scss" scoped>
.posts-container {
  margin-bottom: 20px;
  min-height: calc(100vh - 94px);
}
</style>
