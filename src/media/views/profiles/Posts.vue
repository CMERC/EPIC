<template>
  <div class="container"
       v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busyLoadingPosts"
       infinite-scroll-distance="50">
    <breadcrumb :currentPage="mediaProfile ? 'Posts by '+mediaProfile.name : ''" />
    <div v-if="mediaProfile && mediaProfile.id != null">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <a class="button is-primary"
               @click="createMediaPost(mediaProfile)">
              Create Post
            </a>
          </div>
          <div class="level-item">
            <a :href="mediaProfile.url"
               class="button is-primary is-outlined"
               target="_blank">
              View Profile
            </a>
          </div>
          <div class="level-item">
            <a class="button is-primary is-outlined"
               @click="toggleShareProfile()">
              Share Profile
            </a>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <span class="has-text-weight-semibold">{{mediaPostsCount}} {{filterFriendly}} posts</span>
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
            <help-content :reference="'media.profileposts'"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <nav class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item">
            <nav class="breadcrumb breadMenu">
              <ul>
                <li>
                  <router-link :to="{name: 'profilefilter', params: {requestedFilter: 'all'}}"
                               :class="{'is-active':requestedFilter==='all'}">All</router-link>
                </li>
                <li>
                  <router-link :to="{name: 'profilefilter', params: {requestedFilter: 'published'}}"
                               :class="{'is-active':requestedFilter==='published'}">Published</router-link>
                </li>
                <li>
                  <router-link :to="{name: 'profilefilter', params: {requestedFilter: 'scheduled'}}"
                               :class="{'is-active':requestedFilter==='scheduled'}">Scheduled</router-link>
                </li>

                <li>
                  <router-link :to="{name: 'profilefilter', params: {requestedFilter: 'drafted'}}"
                               :class="{'is-active':requestedFilter==='drafted'}">Drafted</router-link>
                </li>

                <li>
                  <router-link :to="{name: 'profilefilter', params: {requestedFilter: 'noise_only'}}"
                               :class="{'is-active':requestedFilter==='noise_only'}">Noise</router-link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </nav>
      <div class="columns">
        <div class="column is-4 is-narrow">
          <Profile-Card :profile="mediaProfile"
                        showEdit
                        showPermalink
                        showDelete/>
        </div>
        <div class="column is-8">
          <div class="columns is-multiline is-gapless"
               v-if="mediaPosts && mediaPosts.length > 0">
            <div class="column is-12"
                 v-for="mediaPost in mediaPosts"
                 v-bind:key="mediaPost.id">
              <post-card :post="mediaPost"
                         showEdit
                         showCreateComment
                         showDelete
                         showPermalink/>
            </div>
            <div class="column is-12"
                 v-if="busyLoadingPosts">
              <div class="card-header-title is-centered">
                <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
              </div>
              <p class="subtitle has-text-centered">Loading More Posts... </p>
            </div>
          </div>
          <div v-else>
            <empty-state :data="mediaPosts"
                         :search="searchQuery ? true : false"
                         :isLoading='$apollo.loading'>
              <template slot="custom-message">
                <p class="subtitle has-text-centered">No Posts found.</p>
              </template>

              <template slot="action-buttons">
                <div class="buttons is-centered">
                  <a class="button is-primary"
                     @click="createMediaPost(mediaProfile)">
                    Create Post
                  </a>
                </div>
              </template>
            </empty-state>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <empty-state :data="mediaProfile"
                   :isLoading='$apollo.loading' />
    </div>
    <back-to-top bottom="20px"
                 right="10px">
      <button type="button"
              class="button">
        <span class="icon is-small"> <i class="fas fa-arrow-up"></i> </span>
      </button>
    </back-to-top>
    <div class="modal"
         :class="{'is-active': shareProfileModal}"
         v-if="mediaProfile">
      <div class="modal-background"
           @click="toggleShareProfile"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Share Profile</p>
          <button class="delete"
                  aria-label="close"
                  @click="toggleShareProfile"></button>
        </header>
        <section class="modal-card-body">
          <span class="input"
                id="mediaProfileURL">{{mediaProfile.url}}</span>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             v-clipboard:copy="mediaProfile.url"
             v-clipboard:success="copyToClipboard">
            Copy to Clipboard
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'
import ProfileCard from '@/shared/components/profile-card'
import HelpContent from '@/shared/components/helpcontent'
import processText from '@/shared/mixins/processText'
import mediaPost from '@/shared/mixins/mediaPost'

import {
  MediaPostsDelete,
  MediaPostsRead,
  MediaPostsSubscription,
  MediaPostsCounts
} from '@/media/graphql/MediaPosts.gql'

import {
  MediaProfilesRead,
  MediaProfilesSubscription
} from '@/media/graphql/MediaProfiles.gql'

export default {
  name: 'Posts',
  components: { HelpContent, ProfileCard },
  props: ['profile', 'service', 'requestedFilter'],
  mixins: [helpers, processText, mediaPost],
  apollo: {
    mediaPostsCount: {
      query: MediaPostsCounts,
      variables() {
        let variableData = this.mediaPostsQueryVariable()
        // delete keys not used for count
        delete variableData.skip
        delete variableData.first
        return variableData
      },
      update(data) {
        if (data && data.mediaPostsConnection) {
          return data.mediaPostsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    mediaProfile: {
      query: MediaProfilesRead,
      variables() {
        return {
          where: {
            username: this.profile,
            service: { name: this.service }
          }
        }
      },
      update(data) {
        if (data && data.mediaProfiles && data.mediaProfiles.length > 0) {
          return data.mediaProfiles[0]
        }
      },
      subscribeToMore: [
        {
          document: MediaProfilesSubscription,
          variables() {
            return {
              where: {
                node: {
                  username: this.profile,
                  service: { name: this.service }
                }
              }
            }
          },
          // Mutate the previous result
          updateQuery: (previousResult, { subscriptionData }) => {
            // Here, return the new result from the previous with the new data
            let mutationIn = subscriptionData.data.mediaProfile.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaProfiles: [
                    ...previousResult.mediaProfiles,
                    subscriptionData.data.mediaProfile.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  mediaProfiles: [
                    ...previousResult.mediaProfiles.filter(
                      obj =>
                        subscriptionData.data.mediaProfile.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedMediaProfiles = JSON.parse(
                  JSON.stringify(previousResult.mediaProfiles)
                )
                let index = updatedMediaProfiles.findIndex(
                  x => x.id === subscriptionData.data.mediaProfile.node.id
                )
                updatedMediaProfiles[index] =
                  subscriptionData.data.mediaProfile.node
                newResult = {
                  mediaProfiles: updatedMediaProfiles
                }
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            return newResult
          }
        }
      ]
    },
    mediaPosts: {
      query: MediaPostsRead,
      variables() {
        let variableData = this.mediaPostsQueryVariable()
        variableData.skip = 0
        return variableData
      },
      update(data) {
        if (data && data.mediaPosts) {
          return data.mediaPosts
        }
      },
      subscribeToMore: {
        document: MediaPostsSubscription,
        variables() {
          let datafromread = this.mediaPostsQueryVariable()
          delete datafromread.orderBy
          delete datafromread.skip
          delete datafromread.first
          let data = {
            node: datafromread
          }
          return data
        },
        // Mutate the previous result
        updateQuery(previousResult, { subscriptionData }) {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.mediaPost.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED':
              this.$apollo.queries.mediaPosts.refetch()
              break
            case 'DELETED':
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
            case 'UPDATED':
              this.$apollo.queries.mediaPosts.refetch()
              break
            default:
              throw new Error(`Unknown mediaPost mutation`)
          }
          return newResult
        }
      }
    }
  },
  data() {
    return {
      shareProfileModal: false,
      filterFriendly: 'All',
      previewModal: false,
      searchQuery: '',
      mediaPosts: [],
      mediaPostsCount: 0,
      mediaProfile: null,
      selectedPost: null,
      itemsPerPage: 10,
      busyLoadingPosts: false
    }
  },
  methods: {
    mediaPostsQueryVariable() {
      let length = this.mediaPosts ? this.mediaPosts.length : 0
      let data = {
        where: {
          isUserGenerated: true,
          profiles_some: {
            username: this.profile,
            service: { name: this.service }
          },
          OR: [
            { text_contains: this.searchQuery },
            { title_contains: this.searchQuery }
          ]
        },
        orderBy: 'updatedAt_DESC',
        skip: length,
        first: this.itemsPerPage
      }
      switch (this.requestedFilter) {
        case 'published': {
          data.where = Object.assign(data.where, {
            isPublished: true,
            text_contains: this.searchQuery
          })
          break
        }
        case 'scheduled': {
          data.where = Object.assign(data.where, {
            isPublished: false,
            publishTime_not: null,
            text_contains: this.searchQuery
          })
          break
        }
        case 'drafted': {
          data.where = Object.assign(data.where, {
            isPublished: false,
            publishTime: null,
            text_contains: this.searchQuery
          })
          break
        }
        case 'noise_only': {
          data.where = Object.assign(data.where, {
            isUserGenerated: false,
            publishTime_not: null,
            text_contains: this.searchQuery
          })
          break
        }
      }
      return data
    },
    loadMore() {
      if (this.mediaPosts && this.mediaPosts.length < this.mediaPostsCount) {
        this.busyLoadingPosts = true
        this.$apollo.queries.mediaPosts.fetchMore({
          variables: this.mediaPostsQueryVariable(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.mediaPosts &&
              fetchMoreResult.mediaPosts.length > 0
            ) {
              fetchMoreResult.mediaPosts = [
                ...this.mediaPosts,
                ...fetchMoreResult.mediaPosts.filter(
                  n => !this.mediaPosts.some(p => p.id === n.id)
                )
              ]

              this.busyLoadingPosts = false
              return fetchMoreResult
            }
          }
        })
      }
    },
    copyToClipboard() {
      this.$buefy.toast.open({
        message: 'Copied to Clipboard!',
        type: 'is-success'
      })
    },
    toggleShareProfile() {
      this.shareProfileModal = !this.shareProfileModal
    },
    closeModal() {
      this.previewModal = false
      this.selectedPost = null
      this.postObj = null
    },
    previewPost(post) {
      this.selectedPostID = post.id
      this.postObj = post
      this.previewModal = true
    },
    permalinkPost(profile, service, postID) {
      this.$router.push({
        name: 'getPost',
        params: {
          workspace: this.$store.state.activeWorkspace.name,
          profile: this.profile,
          service: this.service,
          id: postID
        }
      })
    },
    editPost(postID) {
      this.$router.push({
        name: 'editpost',
        params: { profile: this.profile, service: this.service, id: postID }
      })
    },
    deletePost(post) {
      // delete post
      this.$apollo
        .mutate({
          mutation: MediaPostsDelete,
          variables: {
            id: {
              id: post
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Post Deleted!',
            type: 'is-success'
          })
          this.selectPost = null
          this.selectProfile = ''
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Post Deleted: ' + error)
        })
    },
    confirmPostDelete(post) {
      this.$buefy.dialog.confirm({
        title: 'Delete Post',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePost(post)
      })
    }
  },
  watch: {
    mediaProfile() {
      if (this.mediaProfile && this.mediaProfile.isUserGenerated == false) {
        this.$router.push({
          path: 'noise_only'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.posts {
  & .content {
    width: 100%;
    * {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-height: 2rem;
    }
  }
  &:hover {
    cursor: pointer;
    background-color: #d7dcdd;
  }
}
</style>
