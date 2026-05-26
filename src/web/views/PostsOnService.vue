<template>
  <div class="container"
       v-infinite-scroll="loadMore"
       infinite-scroll-distance="10">
    <section class="section">
      <nav class="level">
        <div class="level-left">
        </div>
        <div class="level-right">
          <div class="level-item">
            <help-content reference="web.general"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <div class="columns">
        <div class="column is-half">
          <div class="card focus"
               v-if="mediaServicePublic">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image">
                    <div :style="'color:'+mediaServicePublic.color">
                      <span class="icon is-large"
                            v-if="mediaServicePublic.icon"
                            :key="mediaServicePublic.icon">
                        <i :class="mediaServicePublic.icon+ ' fa-3x'"></i>
                      </span>
                      <span class="icon is-large"
                            v-else
                            :key="mediaServicePublic.name">
                        <i :class="'fab fa-'+mediaServicePublic.name+ ' fa-3x'">
                        </i>
                      </span>
                    </div>
                  </figure>
                </div>
                <div class="media-content">
                  <h1 class="is-size-4">
                    {{mediaServicePublic.displayName}}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div v-else></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="columns is-multiline"
           v-if="mediaPostsPublic && mediaPostsPublic.length">
        <div class="column">
          <article class="media"
                   v-for="post in mediaPostsPublic"
                   :key="post.id"
                   @click="viewPost(post.profiles[0].username, post.profiles[0].service.name, post.id)">
            <figure class="media-left">
              <p class="image is-64x64"
                 v-if="post.profiles[0].avatar">
                <img :src="post.profiles[0].avatar.url.thumb">
              </p>
              <figure class="image is-64x64"
                      v-else>
                <span class="icon is-large">
                  <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                </span>
              </figure>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{post.profiles[0].name}}</strong>
                  <small> - @{{post.profiles[0].username}} </small>
                  <small class="tooltip"
                         :data-tooltip="formatDate(post.publishTime, 'utc-dtg')"> - {{formatDate(post.publishTime, 'convertDate')}} - </small>
                  <sentiment :text="truncate(processPost(post.text, post.profiles[0].service), 100)" />
                  <br>
                  <span v-html="truncate(processPost(post.text, post.profiles[0].service), 200)" />
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
      <div v-else
           class="no-result apollo">
        <empty-state :data="mediaPostsPublic"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading' />
      </div>
    </section>
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'
import sentiment from '@/shared/components/sentiment'

import { PublicMediaServiceWhere } from '@/media/graphql/MediaServices.gql'
import { PublicMediaPostsRead } from '@/media/graphql/MediaPosts.gql'
export default {
  name: 'all-posts-service',
  props: ['workspace', 'service', 'query'],
  mixins: [helpers, processText],
  components: { sentiment, HelpContent },
  apollo: {
    mediaServicePublic: {
      query: PublicMediaServiceWhere,
      variables() {
        return {
          data: {
            service: {
              name: this.service
            },
            workspace: this.workspace
          }
        }
      }
    },
    mediaPostsPublic: {
      query: PublicMediaPostsRead,
      variables() {
        let varaiables = this.postsPublicQueryVariables()
        // delete skip
        delete varaiables.skip
        return varaiables
      }
    }
  },
  data() {
    return {
      searchQuery: this.query,
      doneLoading: false
    }
  },
  watch: {
    query: function() {
      this.searchQuery = this.query
    },
    searchQuery: function() {
      this.$router.push({ query: { q: this.searchQuery } })
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
          variables: this.postsPublicQueryVariables(),
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
    postsPublicQueryVariables() {
      let length = this.mediaPostsPublic ? this.mediaPostsPublic.length : 0
      let postsVariables = {
        post: {
          isPublished: true
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
      if (this.service) {
        postsVariables.post = {
          ...postsVariables.post,
          profiles_some: { service: { name: this.service } }
        }
      }
      return {
        where: postsVariables,
        skip: length,
        first: 10,
        orderBy: 'publishTime_DESC'
      }
    },
    viewPost(user, service, postid) {
      this.$router.push({
        name: 'getPost',
        params: {
          service: service,
          username: user,
          postID: postid
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
article {
  &.media {
    cursor: pointer;
    .media-content * {
      pointer-events: none;
    }
  }
}
</style>
