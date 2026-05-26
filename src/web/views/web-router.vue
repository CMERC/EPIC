<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-distance="10"
       class="web-container">
    <div v-if="showBack"
         class="backButton">
      <button class="button is-rounded"
              @click="$router.go(-1)">
        <span class="icon is-small">
          <i class="fas fa-arrow-left"></i>
        </span>
      </button>
    </div>
    <div v-if="$apollo.loading">
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
          <section class="modal-card-body has-text-centered">
            <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
          </section>
        </div>
      </div>
    </div>
    <component :is="myComponent"
               :allData="allData" />
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
import skeleton from '../components/service-routes/skeleton/index.vue'
import newsSkeleton from '../components/service-routes/news-skeleton/index.vue'

import { PublicMediaProfilesRead } from '../graphql/MediaProfiles.gql'
import {
  PublicMediaPostsRead,
  PublicMediaPostsWithComments,
  MediaFeedSubscription,
  PublicMediaPostsCounts
} from '@/media/graphql/MediaPosts.gql'

import helpers from '@/shared/mixins/helpers'
export default {
  name: 'WebRouter',
  mixins: [helpers],
  apollo: {
    mediaProfilesPublic: {
      query: PublicMediaProfilesRead,
      variables() {
        return {
          where: {
            profile: {
              username: this.$route.params.username,
              service: { name: this.$route.params.service }
            },
            workspace: this.$route.params.workspace
          }
        }
      },
      result({ data }) {
        if (data) {
          switch (this.allData.page) {
            case 'user': {
              this.allData.serviceUsers = data.mediaProfilesPublic
              break
            }
            case 'content':
            case 'profile': {
              if (
                data.mediaProfilesPublic &&
                data.mediaProfilesPublic.length > 0
              ) {
                if (
                  data.mediaProfilesPublic[0].service &&
                  data.mediaProfilesPublic[0].service.type === 'NEWS'
                ) {
                  this.myComponent = newsSkeleton
                } else {
                  this.myComponent = skeleton
                }
                // No pagination needed
                const newProfile = {
                  profile: {
                    fullName: data.mediaProfilesPublic[0].name || '',
                    counts: data.mediaProfilesPublic[0].counts || ''
                  }
                }
                this.allData.currentUser = Object.assign(
                  newProfile,
                  data.mediaProfilesPublic[0]
                )
              }
              break
            }
          }
        }
      }
    },
    mediaPostsPublic: {
      query() {
        let data
        switch (this.allData.page) {
          case 'profile': {
            data = PublicMediaPostsRead
            break
          }
          case 'content': {
            data = PublicMediaPostsWithComments
            break
          }
          case 'user': {
            this.$apollo.queries.mediaPostsPublic.skip = true
            break
          }
        }
        return data
      },
      skip() {
        return this.skipPost
      },
      variables() {
        let data = {}
        switch (this.allData.page) {
          case 'profile': {
            data = this.mediaPostsPublicReadVariables()
            data.skip = 0
            break
          }
          case 'content': {
            data = {
              where: {
                post: {
                  isPublished: true,
                  parent: {
                    id: this.$route.params.postID
                  }
                },
                workspace: this.$route.params.workspace
              },
              orderBy: 'publishTime_DESC',
              data1: {
                post: {
                  id: this.$route.params.postID
                },
                workspace: this.$route.params.workspace
              }
            }
            break
          }
        }
        return data
      },
      result({ data }) {
        if (data) {
          switch (this.allData.page) {
            case 'profile': {
              this.allData.serviceContent = data.mediaPostsPublic
              break
            }
            case 'content': {
              this.allData.userPost = data
              if (this.allData.page === 'content') {
                const commentInfo = {
                  comments: []
                }
                if (
                  this.allData.userPost &&
                  this.allData.userPost.mediaPostsPublic
                ) {
                  for (
                    let i = 0;
                    i < this.allData.userPost.mediaPostsPublic.length;
                    i++
                  ) {
                    let tempInfo = {
                      id: '',
                      text: '',
                      counts: {},
                      profile: {}
                    }
                    let tempId = this.allData.userPost.mediaPostsPublic[i].id
                    let tempText = this.allData.userPost.mediaPostsPublic[i]
                      .text
                    let tempProfile = this.allData.userPost.mediaPostsPublic[i]
                      .profiles
                      ? this.allData.userPost.mediaPostsPublic[i].profiles[0]
                      : ''
                    let tempCounts = this.allData.userPost.mediaPostsPublic[i]
                      ? this.allData.userPost.mediaPostsPublic[i].counts
                      : ''
                    tempInfo.id = tempId
                    tempInfo.counts = tempCounts
                    tempInfo.text = this.parseComment(tempText)
                    tempInfo.profile = tempProfile
                    commentInfo.comments.push(tempInfo)
                  }
                }
                this.allData.userPost = Object.assign(commentInfo, data)
              }
              break
            }
          }
        }
      },
      subscribeToMore: [
        {
          document: MediaFeedSubscription,
          // Mutate the previous result
          updateQuery: (previousResult, { subscriptionData }) => {
            // Here, return the new result from the previous with the new data
            let mutationIn = subscriptionData.data.mediaPost.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaPostsPublic: [
                    ...previousResult.mediaPostsPublic,
                    subscriptionData.data.mediaPost.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  mediaPostsPublic: [
                    ...previousResult.mediaPostsPublic.filter(
                      obj =>
                        subscriptionData.data.mediaPost.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let newmediaPostsPublic = JSON.parse(
                  JSON.stringify(previousResult.mediaPostsPublic)
                )
                let index = newmediaPostsPublic.findIndex(
                  x => x.id === subscriptionData.data.mediaPost.node.id
                )
                newmediaPostsPublic[index] =
                  subscriptionData.data.mediaPost.node
                newResult = {
                  mediaPostsPublic: newmediaPostsPublic
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

    mediaPostsPublicConnection: {
      query: PublicMediaPostsCounts,
      skip() {
        return this.skipPost
      },
      variables() {
        let post = this.mediaPostsPublicReadVariables().where
        return {
          where: {
            ...post,
            workspace: this.$route.params.workspace
          }
        }
      },
      result({ data }) {
        if (data && data.mediaPostsPublicConnection) {
          this.allData.serviceContentLength =
            data.mediaPostsPublicConnection.aggregate.count
          return data.mediaPostsPublicConnection.aggregate.count
        }
      }
    }
  },
  data() {
    return {
      skipPost: true,
      skipProfile: false,
      mediaServiceType: '',
      myComponent: newsSkeleton,
      allData: {
        currentUser: {},
        page: {},
        userPost: {},
        serviceContent: [],
        serviceContentLength: 0,
        serviceUsers: []
      },
      skipService: false,
      runService: false,
      itemsPerPage: 10,
      mediaPostsPublicConnection: null
    }
  },
  components: {
    newsSkeleton,
    skeleton
  },
  methods: {
    loadMore() {
      if (this.allData.page === 'profile') {
        if (
          this.allData.serviceContent.length !==
          this.allData.serviceContentLength
        )
          this.$apollo.queries.mediaPostsPublic.fetchMore({
            variables: this.mediaPostsPublicReadVariables(),
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (
                fetchMoreResult &&
                fetchMoreResult.mediaPostsPublic &&
                fetchMoreResult.mediaPostsPublic.length > 0
              ) {
                fetchMoreResult.mediaPostsPublic = [
                  ...this.allData.serviceContent,
                  ...fetchMoreResult.mediaPostsPublic.filter(
                    n => !this.allData.serviceContent.some(p => p.id === n.id)
                  )
                ]
                return fetchMoreResult
              }
            }
          })
      }
    },
    mediaPostsPublicReadVariables() {
      let length = this.allData.serviceContent
        ? this.allData.serviceContent.length
        : 0
      let data = {
        where: {
          post: {
            isPublished: true,
            AND: {
              profiles_some: {
                username: this.$route.params.username,
                service: { name: this.$route.params.service }
              }
            }
          },
          workspace: this.$route.params.workspace
        },
        orderBy: 'publishTime_DESC',
        skip: length,
        first: this.itemsPerPage
      }
      return data
    },
    parseComment(text) {
      let patterns = {
        link: /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi,
        user: /(^|\s)@(\w+)/g,
        hash: /(^|\s)#(\w+)/g
      }
      return text
        .replace(patterns.link, '<a href="$1" target="_blank">$1</a>')
        .replace(patterns.user, '$1<a href="" target="_blank">@$2</a>')
        .replace(patterns.hash, '$1<a href="" target="_blank">#$2</a>')
    },
    changeData() {
      this.runService = true
      try {
        if (
          this.$route.params.username === undefined &&
          this.$route.params.postID === undefined
        ) {
          this.allData.page = 'user'
          this.skipPost = true
          this.skipProfile = false
        } else if (
          this.$route.params.username !== undefined &&
          this.$route.params.postID === undefined
        ) {
          this.allData.page = 'profile'
          this.skipPost = false
          this.skipProfile = false
        } else {
          if (this.allData.userPost.mediaPostPublic) {
            this.allData.userPost = {}
          }
          this.allData.page = 'content'
          this.skipPost = false
          this.skipProfile = true
        }
      } catch (err) {
        console.error(err)
        return null
      }
    }
  },
  watch: {
    $route: 'changeData'
  },
  computed: {
    showBack() {
      let showBack =
        this.$route.name == 'getUser' || this.$route.name == 'getPost'
      return showBack
    }
  },
  created() {
    this.changeData()
  }
}
</script>

<style lang="scss" scoped>
.backButton {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 500;
}
@media screen and (min-width: 769px), print {
  .modal-background {
    background: transparent;
  }
  .modal-content,
  .modal-card {
    width: auto;
    & .modal-card-body {
      background: transparent;
    }
  }
}
.site-pagination {
  margin: 40px;
  margin-top: -75px;
  display: block;
  width: 100%;
  text-align: center;
  .pagination-container {
    display: inline-block;
  }
}
.myMain {
  padding: 0px;
}
</style>
