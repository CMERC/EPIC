<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-distance="10">
    <div class="container">
      <nav class="breadcrumb is-spaced"
           aria-label="breadcrumbs">
        <ul>
          <li>
            <a @click="$router.go(-1)">
              <span class="icon is-small">
                <i class="fas fa-chevron-left"></i>
              </span>Back</a>
          </li>
          <li>
            <a>
              <span class="icon is-small">
                <i class="fas fa-comment-dots"
                   aria-hidden="true"></i>
              </span>
              <span>News</span>
            </a>
          </li>
          <li class="is-active"
              v-if="query">
            <a aria-current="page">{{query}}</a>
          </li>
        </ul>
      </nav>
      <div class="media-news-list"
           v-if="mediaPostsPublic">
        <h5 class="subtitle">
          News
        </h5>
        <div class="columns is-multiline">
          <div class='column is-4'
               v-for="mediaPost in mediaPostsPublic"
               v-bind:key="mediaPost.id">
            <router-link :to="'/web/'+$route.params.workspace+'/'+mediaPost.profiles[0].service.name+'/'+mediaPost.profiles[0].username+'/'+mediaPost.id">
              <div class="card">
                <div class="card-image">
                  <div v-if="mediaPost.mediaFile && mediaPost.mediaFile.url">
                    <figure v-if="ifImage(mediaPost.mediaFile.contentType)"
                            class="image">
                      <img :src='mediaPost.mediaFile?mediaPost.mediaFile.url.full:""'
                           alt="image">
                    </figure>
                    <audio controls
                           v-else-if="ifAudio(mediaPost.mediaFile.contentType)">
                      <source :src="mediaPost.mediaFile.url.raw"
                              :type="mediaPost.mediaFile.contentType">
                    </audio>
                    <videoplayer v-else-if="ifVideo(mediaPost.mediaFile.contentType)"
                                 :src="mediaPost.mediaFile.url.raw"></videoplayer>
                    <a v-else
                       :href="mediaPost.mediaFile.url.raw">
                      File Link
                    </a>
                  </div>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="subtitle is-4">{{truncate(mediaPost.title,70)}}</p>
                    </div>
                  </div>
                  <div class="content">
                    <span v-html="truncate(processPost(mediaPost.text, mediaPost.profiles[0].service), 200)" />
                    <br>
                    <p class="subtitle is-6">
                      <span class="icon is-small"
                            :style="'color:'+mediaPost.profiles[0].service.color"
                            v-if="mediaPost.profiles && mediaPost.profiles[0].service.icon">
                        <i :class="mediaPost.profiles[0].service.icon"></i>
                      </span>
                      <span class="icon is-small"
                            v-else>
                        <i class="fas fa-sm"></i>
                      </span>
                      <small> {{mediaPost.profiles[0].service.displayName}}</small>
                      <small class="tooltip"
                             :data-tooltip="formatDate(mediaPost.publishTime, 'utc-dtg')"> - {{formatDate(mediaPost.publishTime, 'convertDate')}}</small>
                    </p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <back-to-top bottom="20px"
                     right="20px">
          <button type="button"
                  class="button">
            <span class="icon is-small"> <i class="fas fa-arrow-up"></i> </span>
          </button>
        </back-to-top>

        <div v-if="$apollo.loading">
          <div class="card-header-title is-centered">
            <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
          </div>
          <p class="subtitle has-text-centered">Loading...
          </p>
        </div>
      </div>
      <div v-else>
        <h5>No results found.</h5>
      </div>
      <div class="error-message"
           v-if="invalidWorkspace">
        <h5 class="title">
          {{invalidWorkspace}}
        </h5>
      </div>
    </div>
  </div>
</template>
<script>
import helpers from '@/shared/mixins/helpers'
import { PublicMediaPostsRead } from '@/media/graphql/MediaPosts.gql'

import processText from '@/shared/mixins/processText'
export default {
  name: 'WebNewsHome',
  mixins: [helpers, processText],
  props: ['query', 'workspace'],
  apollo: {
    mediaPostsPublic: {
      query: PublicMediaPostsRead,
      variables() {
        let varaiables = this.newsPublicQueryVariables()
        // delete skip
        delete varaiables.skip
        return varaiables
      }
    }
  },
  data() {
    return {
      searchQuery: this.query,
      invalidWorkspace: null,
      doneLoading: false
    }
  },
  methods: {
    loadMore() {
      if (
        this.mediaPostsPublic &&
        this.mediaPostsPublic.length > 0 &&
        !this.doneLoading
      ) {
        this.$apollo.queries.mediaPostsPublic.fetchMore({
          variables: this.newsPublicQueryVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.mediaPostsPublic &&
              fetchMoreResult.mediaPostsPublic.length > 0
            ) {
              let newPosts = [
                ...this.mediaPostsPublic,
                ...fetchMoreResult.mediaPostsPublic.filter(
                  n => !this.mediaPostsPublic.some(p => p.id === n.id)
                )
              ]
              fetchMoreResult.mediaPostsPublic = newPosts
              return fetchMoreResult
            } else {
              this.doneLoading = true
            }
          }
        })
      }
    },
    newsPublicQueryVariables() {
      let length = this.mediaPostsPublic ? this.mediaPostsPublic.length : 0
      let postsVariables = {
        post: {
          isPublished: true,
          profiles_some: { service: { type: 'NEWS' } }
        },
        workspace: this.$route.params.workspace
      }
      if (this.searchQuery && this.searchQuery.length > 0) {
        postsVariables.post = {
          ...postsVariables.post,
          OR: [
            { text_contains: this.searchQuery },
            { title_contains: this.searchQuery }
          ]
        }
      }
      return {
        where: postsVariables,
        skip: length,
        first: 6,
        orderBy: 'publishTime_DESC'
      }
    }
  },
  watch: {
    query() {
      this.searchQuery = this.query
    },
    searchQuery() {
      this.$router.push({ query: { q: this.searchQuery } })
    }
  }
}
</script>

<style lang="scss" scoped>
.content * {
  word-wrap: break-word;
}
.error-message {
  margin: 10%;
}
.has-fixed-nav {
  padding-top: 3.25rem;
}
.media-news-list {
  margin-bottom: 1em;
}
</style>
