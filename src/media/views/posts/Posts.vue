<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busyLoadingPosts"
       infinite-scroll-distance="50">
    <div class="container">
      <breadcrumb />
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <a class="button is-primary"
               @click="openProfileSelector()">
              Create Post
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
            <help-content :reference="'media.posts'"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <nav class="breadcrumb breadMenu">
              <ul>
                <li>
                  <router-link :to="{name: 'posts-filter', params: {requestedFilter: 'all'}}"
                               :class="{'is-active':requestedFilter==='all'}">All</router-link>
                  <span class="tag is-rounded tooltip"
                        v-if="allMediaPostsCounts.allPosts"
                        :data-tooltip="allMediaPostsCounts.allPosts.aggregate.count | formatNumber('thousands')">
                    <span v-if="allMediaPostsCounts.allPosts.aggregate.count < 1000">{{allMediaPostsCounts.allPosts.aggregate.count | formatNumber('thousands')}}</span>
                    <span v-else>{{allMediaPostsCounts.allPosts.aggregate.count | formatNumber('abbreviate')}}</span>
                  </span>
                </li>
                <li>
                  <router-link :to="{name: 'posts-filter', params: {requestedFilter: 'published'}}"
                               :class="{'is-active':requestedFilter==='published'}">Published</router-link>
                  <span class="tag is-rounded tooltip"
                        v-if="allMediaPostsCounts.publishedPosts"
                        :data-tooltip="allMediaPostsCounts.publishedPosts.aggregate.count | formatNumber('thousands')">
                    <span v-if="allMediaPostsCounts.publishedPosts.aggregate.count < 1000">{{allMediaPostsCounts.publishedPosts.aggregate.count | formatNumber('thousands')}}</span>
                    <span v-else>{{allMediaPostsCounts.publishedPosts.aggregate.count | formatNumber('abbreviate')}}</span>
                  </span>
                </li>
                <li>
                  <router-link :to="{name: 'posts-filter', params: {requestedFilter: 'scheduled'}}"
                               :class="{'is-active':requestedFilter==='scheduled'}">Scheduled</router-link>
                  <span class="tag is-rounded tooltip"
                        v-if="allMediaPostsCounts.scheduledPosts"
                        :data-tooltip="allMediaPostsCounts.scheduledPosts.aggregate.count | formatNumber('thousands')">
                    <span v-if="allMediaPostsCounts.scheduledPosts.aggregate.count < 1000">{{allMediaPostsCounts.scheduledPosts.aggregate.count | formatNumber('thousands')}}</span>
                    <span v-else>{{allMediaPostsCounts.scheduledPosts.aggregate.count | formatNumber('abbreviate')}}</span>
                  </span>
                </li>

                <li>
                  <router-link :to="{name: 'posts-filter', params: {requestedFilter: 'drafted'}}"
                               :class="{'is-active':requestedFilter==='drafted'}">Drafted</router-link>
                  <span class="tag is-rounded tooltip"
                        v-if="allMediaPostsCounts.draftPosts"
                        :data-tooltip="allMediaPostsCounts.draftPosts.aggregate.count | formatNumber('thousands')">
                    <span v-if="allMediaPostsCounts.draftPosts.aggregate.count < 1000">{{allMediaPostsCounts.draftPosts.aggregate.count | formatNumber('thousands')}}</span>
                    <span v-else>{{allMediaPostsCounts.draftPosts.aggregate.count | formatNumber('abbreviate')}}</span>
                  </span>

                </li>

                <li>
                  <router-link :to="{name: 'posts-filter', params: {requestedFilter: 'noise_only'}}"
                               :class="{'is-active':requestedFilter==='noise_only'}">Noise</router-link>
                  <span class="tag is-rounded tooltip"
                        v-if="allMediaPostsCounts.noisePosts"
                        :data-tooltip="allMediaPostsCounts.noisePosts.aggregate.count | formatNumber('thousands')">
                    <span v-if="allMediaPostsCounts.noisePosts.aggregate.count < 1000">{{allMediaPostsCounts.noisePosts.aggregate.count | formatNumber('thousands')}}</span>
                    <span v-else>{{allMediaPostsCounts.noisePosts.aggregate.count | formatNumber('abbreviate')}}</span>
                  </span>
                </li>

              </ul>
            </nav>
          </div>
        </div>
        <div class="level-right">
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
        </div>
      </nav>
      <div class="columns is-multiline is-mobile is-centered is-gapless"
           v-if="mediaPosts && mediaPosts.length > 0">
        <div class="column is-12"
             :key="mediaPost.id"
             v-for="mediaPost in mediaPosts">
          <post-card :post="mediaPost"
                     :commentsCount="mediaPost && mediaPost.comments ? mediaPost.comments.length : ''"
                     showEdit
                     showDelete
                     showViewProfile
                     showCreateComment
                     showPermalink/>
        </div>
        <div v-if="busyLoadingPosts">
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
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openProfileSelector()">
                Create Post
              </a>
            </div>
          </template>
        </empty-state>
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
      <!-- Add modal imports -->
      <profile-select-modal v-if="showProfileSelector"
                            :open="showProfileSelector"
                            :authorID="parentPostAuthorID"
                            :service="selectedService"
                            @close="closeProfileSelector"
                            @select="createMediaPost($event, parentPost, parentDate)" />
    </div>
  </div>
</template>

<script>
import Permissions from '@/shared/mixins/permissions'
import helpers from '@/shared/mixins/helpers'
import HelpContent from '@/shared/components/helpcontent'
import ProfileSelectModal from '@/shared/components/profile-selectModal'
import mediaPost from '@/shared/mixins/mediaPost'

import {
  MediaPostsRead,
  MediaPostsSubscription,
  MediaPostsCounts,
  allMediaPostsCounts
} from '@/media/graphql/MediaPosts.gql'

export default {
  name: 'PostsView',
  props: ['requestedFilter'],
  components: {
    ProfileSelectModal,
    HelpContent
  },
  mixins: [helpers, mediaPost, Permissions],
  apollo: {
    mediaPostsCount: {
      query: MediaPostsCounts,
      variables() {
        let data = this.mediaPostsReadVariables()
        // delete keys not used for count
        delete data.skip
        delete data.first
        delete data.orderBy

        return data
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
    allMediaPostsCounts: {
      query: allMediaPostsCounts,
      variables() {
        return {
          query: this.searchQuery
        }
      },
      update(data) {
        if (data) {
          return data
        }
      }
    },
    mediaPosts: {
      query: MediaPostsRead,
      variables() {
        let data = this.mediaPostsReadVariables()
        data.skip = 0
        return data
      },
      subscribeToMore: {
        document: MediaPostsSubscription,
        variables() {
          let datafromread = this.mediaPostsReadVariables()
          delete datafromread.skip
          delete datafromread.first
          delete datafromread.orderBy

          let data = {
            node: datafromread
          }
          return data
        },
        updateQuery() {
          this.$apollo.queries.mediaPosts.refetch()
          this.$apollo.queries.mediaPostsCount.refetch()
          this.$apollo.queries.allMediaPostsCounts.refetch()
        }
      }
    }
  },
  data() {
    return {
      allMediaPostsCounts: [],
      previewModal: false,
      value: null,
      PostModal: false,
      mediaPosts: [],
      files: [],
      searchQuery: this.$route.query.q,
      selectOrderBy: this.$route.query.sort
        ? this.$route.query.sort
        : 'updatedAt_DESC',
      typesOrderBy: [
        { name: 'Last Updated', type: 'updatedAt_DESC' },
        { name: 'Last Created', type: 'createdAt_DESC' },
        { name: 'Last Published', type: 'publishTime_DESC' },
        { name: 'Oldest Created', type: 'createdAt_ASC' },
        { name: 'Oldest Updated', type: 'updatedAt_ASC' },
        { name: 'Oldest Published', type: 'publishTime_ASC' }
      ],
      selectProfile: '',
      selectedService: '',
      parentPostAuthorID: '',
      parentPost: '',
      parentDate: '',
      itemsPerPage: 10,
      busyLoadingPosts: false,
      showProfileSelector: false
    }
  },
  watch: {
    searchQuery() {
      this.$router.push({
        query: { q: this.searchQuery, sort: this.selectOrderBy }
      })
      this.mediaPosts = []
    },
    selectOrderBy() {
      this.$router.push({
        query: { q: this.searchQuery, sort: this.selectOrderBy }
      })
    }
  },
  methods: {
    mediaPostsReadVariables() {
      let length = this.mediaPosts ? this.mediaPosts.length : 0
      let data = {
        where: {
          isUserGenerated: true,
          OR: [
            { text_contains: this.searchQuery },
            { title_contains: this.searchQuery },
            {
              profiles_some: {
                OR: [
                  { name_contains: this.searchQuery },
                  { username_contains: this.searchQuery },
                  { service: { name_contains: this.searchQuery } }
                ]
              }
            }
          ]
        },
        orderBy: this.selectOrderBy,
        skip: length,
        first: this.itemsPerPage
      }

      switch (this.requestedFilter) {
        case 'published': {
          data.where = Object.assign(data.where, {
            isPublished: true,
            publishTime_not: null
          })
          break
        }
        case 'scheduled': {
          data.where = Object.assign(data.where, {
            isPublished: false,
            publishTime_not: null
          })
          break
        }
        case 'drafted': {
          data.where = Object.assign(data.where, {
            isPublished: false,
            publishTime: null
          })
          break
        }
        case 'noise_only': {
          data.where = Object.assign(data.where, {
            isUserGenerated: false,
            isPublished: true,
            publishTime_not: null
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
          variables: this.mediaPostsReadVariables(),
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
    openProfileSelector(parentPost) {
      if (parentPost) {
        this.selectedService = parentPost.profiles[0].service.name
        this.parentPostAuthorID = parentPost.profiles[0].id
        this.parentPost = parentPost.id
        this.parentDate = parentPost.publishTime
      }
      this.showProfileSelector = true
    },
    closeProfileSelector() {
      this.selectedService = ''
      this.parentPostAuthorID = ''
      this.parentPost = ''
      this.showProfileSelector = false
    }
  }
}
</script>
<style lang="scss" scoped>
.breadcrumb {
  & li + li::before {
    content: '';
  }
  & a {
    padding: 0 0.25rem 0 1rem;
  }
}
.posts {
  & .field.is-grouped {
    margin-bottom: 0;
  }
  & .content {
    width: 100%;
    * {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-height: 2rem;
    }
  }
  &:hover {
    cursor: pointer;
    background-color: #d7dcdd;
  }
}
</style>
