<template>
  <section class="section has-background-light">
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
    <div class="card"
         v-if="checkProfile">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-64x64"
                    v-if="checkAvatar">
              <p v-if="typeof allData.userPost.mediaPostPublic.profiles[0].avatar.url == 'object'">
                <img :src="allData.userPost.mediaPostPublic.profiles[0].avatar.url.small"
                     class="is-avatar lg">
              </p>
            </figure>
            <figure class="image is-64x64"
                    v-else>
              <span class="icon is-large">
                <i class="fas fa-user-circle has-text-grey fa-3x"></i>
              </span>
            </figure>
          </div>
          <div class="media-content"
               v-if="allData.userPost.mediaPostPublic.profiles[0]">
            <p>
              <a @click="showProfile(allData.userPost.mediaPostPublic.profiles[0].username)">
                <p class="title is-6">{{allData.userPost.mediaPostPublic.profiles[0].name}}</p>
              </a>
              <small> @{{allData.userPost.mediaPostPublic.profiles[0].username}}</small>
            </p>
            <small class="tooltip"
                   :data-tooltip="formatDate(allData.userPost.mediaPostPublic.publishTime, 'utc-dtg')">
              {{formatDate(allData.userPost.mediaPostPublic.publishTime, 'shortDate')}}
            </small>
          </div>
        </div>
        <div class="content">
          <p class="text-wrap"
             v-html="parseText(processPost(allData.userPost.mediaPostPublic.text, allData.userPost.mediaPostPublic.profiles[0].service, $router.currentRoute.params.workspace))"></p>
        </div>
      </div>
      <div class="card-image"
           v-if="allData.userPost.mediaPostPublic.mediaFile && allData.userPost.mediaPostPublic.mediaFile.url">
        <figure v-if="ifImage(allData.userPost.mediaPostPublic.mediaFile.contentType)"
                class="image">
          <img :src="allData.userPost.mediaPostPublic.mediaFile.url.regular"
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
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-medium is-marginless">
              <i class="far fa-comment"></i>
            </span>
            <span>{{allData.userPost.mediaPostPublic && allData.userPost.mediaPostPublic.comments ? allData.userPost.mediaPostPublic.comments.length : 0}}</span>
          </a>
          <a class="level-item">
            <span class="icon is-medium is-marginless">
              <i class="fas fa-retweet"></i>
            </span>
            <span>{{allData.userPost.mediaPostPublic.counts && allData.userPost.mediaPostPublic.counts.shares ? allData.userPost.mediaPostPublic.counts.shares : 0}}</span>
          </a>
          <a class="level-item">
            <span class="icon is-medium is-marginless">
              <i class="far fa-heart"></i>
            </span>
            <span>{{allData.userPost.mediaPostPublic.counts && allData.userPost.mediaPostPublic.counts.likes ? allData.userPost.mediaPostPublic.counts.likes : 0}}</span>
          </a>
        </div>
      </nav>

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
                <span class="commentAuthor has-text-link">{{comment.profiles[0].name}}</span>
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
                  <span>{{comment.counts ? comment.counts.likes : ''}} Like<span>{{comment.counts && comment.counts.likes ? 's' : ''}}</span></span>
                </a>
                <a class="level-item">
                  <span>Reply</span>
                </a>
                <a class="level-item">
                  <span class="subtitle is-7 tooltip"
                        :data-tooltip="formatDate(comment.createTime)">{{formatDate(comment.createTime, 'fromNow')}}</span>
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
    </div>
    <div v-else>
      <div class="card">
        <div class="card-content">
          <div class="card-header-title is-centered">
            <i class="fab fa-twitter fa-3x has-text-primary"></i>
          </div>
          <p class="title has-text-centered">
            Post Not Found
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'
export default {
  name: 'twittercontent',
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
        this.allData &&
        this.allData.userPost &&
        this.allData.userPost.mediaPostPublic &&
        this.allData.userPost.mediaPostPublic.counts &&
        this.allData.userPost.mediaPostPublic.counts[key]
      ) {
        value = this.allData.userPost.mediaPostPublic.counts[key]
      }
      return value
    }
  },
  computed: {
    checkAvatar() {
      let checkAvatar =
        this.allData &&
        this.allData.userPost &&
        this.allData.userPost.mediaPostPublic &&
        this.allData.userPost.mediaPostPublic.profiles[0] &&
        this.allData.userPost.mediaPostPublic.profiles[0].avatar
      return checkAvatar
    },
    checkProfile() {
      let showProfile =
        this.allData &&
        this.allData.userPost &&
        this.allData.userPost.mediaPostPublic &&
        this.allData.userPost.mediaPostPublic.profiles.length > 0
      return showProfile
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'styles.scss';
@media only screen and (min-width: 640px) {
  .card {
    text-align: left;
    box-shadow: initial;
    left: 50%;
    width: 640px;
    margin-left: -320px;
  }
}
@media only screen and (max-width: 640px) {
  .card {
    min-width: 320px;
  }
}
</style>
