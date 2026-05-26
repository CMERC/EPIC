<template>
  <div class="container">
    <nav class="level mb-0">
      <div class="level-item"
           v-if="allData.userPost.mediaPostPublic && allData.userPost.mediaPostPublic.parent !== null"
           @click="showCommentContent(allData.userPost.mediaPostPublic.parent)"
           style="cursor:pointer">
        <span class="icon is-small">
          <i class="far fa-comment"></i>
        </span>
        <span class="is-size-7 has-text-underlined">In response to @{{allData.userPost.mediaPostPublic.parent ? `${allData.userPost.mediaPostPublic.parent.profiles[0].username}'s post` : null}}</span>
      </div>
    </nav>
    <div class="columns"
         v-if="allData.userPost.mediaPostPublic">
      <div class="column">
        <div v-if="allData.userPost.mediaPostPublic.mediaFile && allData.userPost.mediaPostPublic.mediaFile.url">
          <figure v-if="ifImage(allData.userPost.mediaPostPublic.mediaFile.contentType)"
                  class="image is-4by3">
            <img :src="allData.userPost.mediaPostPublic.mediaFile.url.small"
                 alt="image">
          </figure>
          <videoplayer v-else-if="ifVideo(allData.userPost.mediaPostPublic.mediaFile.contentType)"
                       :src="allData.userPost.mediaPostPublic.mediaFile.url.raw"></videoplayer>
          <audio controls
                 v-else-if="ifAudio(allData.userPost.mediaPostPublic.mediaFile.contentType)">
            <source :src="allData.userPost.mediaPostPublic.mediaFile.url.raw"
                    :type="allData.userPost.mediaPostPublic.mediaFile.contentType">
          </audio>
          <a v-else
             :href="allData.userPost.mediaPostPublic.mediaFile.url.raw">
            File Link
          </a>
        </div>
        <figure class="image"
                v-else>
          <img src="../skeleton/static/images/not_available_youtube.svg"
               alt="Not available">
        </figure>
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <div class="columns is-multiline">
                <div class="column is-12">
                  {{allData.userPost.mediaPostPublic.title}}
                </div>
                <div class="column is-12 has-text-grey">
                  {{getPostCounts('views')}} views
                </div>
              </div>
            </div>
          </div>
          <div class="level-right has-text-grey">
            <div class="level-item">
              <span class="icon is-small">
                <i class="fas fa-thumbs-up"></i>
              </span>
              {{getPostCounts('likes')}}
            </div>
            <div class="level-item">
              <span class="icon is-small">
                <i class="fas fa-thumbs-down"></i>
              </span>
              {{getPostCounts('dislikes')}}
            </div>
            <div class="level-item">
              <span class="icon is-small">
                <i class="fas fa-share"></i>
              </span>
              Share
            </div>
            <div class="level-item">
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>

            </div>
            <div class="level-item">
              <span class="icon is-small">
                <i class="fas fa-ellipsis-h"></i>
              </span>
            </div>
          </div>
        </nav>
        <article class="media">
          <figure class="media-left">
            <p class="image is-64x64"
               v-if="checkAvatar">
              <img v-bind:src="allData.userPost.mediaPostPublic.profiles[0].avatar.url.small"
                   class="is-avatar lg">
            </p>
            <p v-else>
              <span class="icon is-large">
                <i class="fas fa-user-circle has-text-grey fa-3x"></i>
              </span>
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <a @click="showProfile(allData.userPost.mediaPostPublic.profiles[0].username)">
                <p class="title is-6"
                   v-if="allData.userPost.mediaPostPublic">
                  {{allData.userPost.mediaPostPublic.profiles[0].name}} </p>
              </a>
              <p class="subtitle is-6 has-text-grey tooltip"
                 :data-tooltip="formatDate(allData.userPost.mediaPostPublic.publishTime, 'utc-dtg')">Published on {{formatDate(allData.userPost.mediaPostPublic.publishTime, 'shortDate')}}</p>
              <span v-html="processPost(allData.userPost.mediaPostPublic.text, allData.userPost.mediaPostPublic.profiles[0].service, $route.params.workspace)"></span>
            </div>
          </div>
          <div class="media-right">
            <a class="button is-danger">
              Subscribe {{getProfileCounts('followers')}}
            </a>
          </div>
        </article>

        <div class="commentArea">
          <div class="card-content">
            <article class="comment media"
                     v-for="comment in allData.userPost.mediaPostPublic.comments"
                     :key="comment.id"
                     @click="showCommentContent(comment)">
              <div class="media-left">
                <figure class="image"
                        v-if="comment.profiles[0] && comment.profiles[0].avatar">
                  <img :src='comment.profiles[0].avatar?comment.profiles[0].avatar.url.small:""'
                       class="is-avatar sm">
                </figure>
                <figure class="image is-32x32"
                        v-else>
                  <span class="icon is-medium">
                    <i class="fas fa-user-circle has-text-grey fa-2x"></i>
                  </span>
                </figure>
              </div>
              <div class="media-content">
                <div class="content">
                  <p class="commentBubble">
                    <span class="commentAuthor has-text-link">{{comment.profiles[0].username}}</span>
                    <span v-html="parseText(processPost(comment.text, comment.profiles[0].service, $router.currentRoute.params.workspace))"></span>
                  </p>
                </div>
                <div class="card-image">
                  <div v-if="comment.mediaFile && comment.mediaFile.url"
                       class="u-text-center">
                    <figure v-if="ifImage(comment.mediaFile.contentType)"
                            class="image">
                      <img :src='comment.mediaFile.url.small'
                           alt="image">
                    </figure>
                    <audio controls
                           v-else-if="ifAudio(comment.mediaFile.contentType)">
                      <source :src="comment.mediaFile.url.raw"
                              :type="comment.mediaFile.contentType">
                    </audio>
                    <videoplayer v-else-if="ifVideo(comment.mediaFile.contentType)"
                                 :src="comment.mediaFile.url.raw"></videoplayer>
                    <a v-else
                       :href="comment.mediaFile.url.raw">
                      File Link
                    </a>
                  </div>
                </div>
                <nav class="level is-mobile">
                  <div class="level-left">
                    <a class="level-item">
                      <span class="subtitle is-7 tooltip"
                            :data-tooltip="formatDate(comment.createTime)">{{formatDate(comment.createTime, 'fromNow')}}</span>
                    </a>
                    <a class="level-item">
                      <span>{{comment.counts ? comment.counts.likes : ''}} Like<span>{{comment.counts && comment.counts.likes ? 's' : ''}}</span></span>
                    </a>
                    <a class="level-item">
                      <span>Reply</span>
                    </a>
                  </div>
                </nav>
              </div>
            </article>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <a>Log in</a> to like or comment...
          </div>
        </div>
      </div>
      <div class="column is-3 related-posts">
        <h4>Related Videos</h4>
        <div class="columns is-multiline">
          <div class="column is-12"
               v-for="post in allData.serviceContent"
               :key="post.id">
            <div class="columns">
              <div class="column is-6">
                <figure v-if='post.mediaFile && post.mediaFile.url && post.mediaFile.contentType.includes("video")'>
                  <video class="related-post-media"
                         v-bind:src="post.mediaFile.url.regular"
                         controls
                         controlsList="nodownload"></video>
                </figure>
                <figure class="image"
                        v-else>
                  <img src="../skeleton/static/images/not_available_dark.svg"
                       alt="Not available">
                </figure>
              </div>
              <div class="column">
                <p class="title is-6">{{post.title}}</p>
                <p class="subtitle is-7">{{allData.currentUser.username}}</p>
              </div>
            </div>

          </div>
          <div class="column is-12"
               v-for="index in 10"
               :key="index">
            <figure class="image">
              <img src="../skeleton/static/images/placeholder_post.svg"
                   alt="Not available">
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'

import processText from '@/shared/mixins/processText'
export default {
  name: 'youtubecontent',
  mixins: [helpers, processText],
  props: {
    allData: {
      type: Object,
      required: true
    }
  },
  methods: {
    showCommentContent(post) {
      let service = post.profiles[0].service.name
      let username = post.profiles[0].username
      let postID = post.id
      let workspace = this.$router.currentRoute.params.workspace
      window.location = `/web/${workspace}/${service}/${username}/${postID}`
    },
    showProfile(profileName) {
      let service = this.$router.currentRoute.params.service
      let username = profileName
      let workspace = this.$router.currentRoute.params.workspace
      this.$router.push({
        path: `/web/${workspace}/${service}/${username}`
      })
    },
    getPostCounts(key) {
      let value = 0
      if (
        this.allData.userPost.mediaPostPublic.counts &&
        this.allData.userPost.mediaPostPublic.counts[key]
      ) {
        value = this.allData.userPost.mediaPostPublic.counts[key]
      }
      return value
    },
    getProfileCounts(key) {
      let value = 0
      if (
        this.allData.userPost.mediaPostPublic.profiles[0] &&
        this.allData.userPost.mediaPostPublic.profiles[0].counts &&
        this.allData.userPost.mediaPostPublic.profiles[0].counts[key]
      ) {
        value = this.allData.userPost.mediaPostPublic.profiles[0].counts[key]
      }
      return value
    }
  },
  computed: {
    checkAvatar() {
      let checkAvatar =
        this.allData.userPost.mediaPostPublic.profiles[0] &&
        this.allData.userPost.mediaPostPublic.profiles[0].avatar
      return checkAvatar
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'styles.scss';
nav {
  border-bottom: 1px solid hsl(0, 0%, 48%);
}

.commentArea {
  nav {
    border: none !important;
  }
  .card-content {
    padding: 0;
  }
  .comment {
    cursor: pointer;
    & + .comment {
      border-top: none;
    }
    &:not(:last-child) {
      margin: 0;
    }
    .content {
      p.commentBubble {
        padding: 0.65rem;
        .commentAuthor {
          margin-right: 0.5rem;
        }
      }
    }
  }
}
</style>
