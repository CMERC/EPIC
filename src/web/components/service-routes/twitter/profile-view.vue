
<template>
  <div>
    <template v-if="checkUser">
      <div class="profile-container">
        <div class="profile-header">
          <div class="header-banner">
            <div v-if="checkBanner">
              <img v-bind:src="allData.currentUser.banner.mediaFile.url.regular"
                   alt="Profile Banner">
            </div>
          </div>
          <div class="header-info">
            <div class="header-avatar is-mobile">
              <div v-if="checkAvatar">
                <figure class="image is-avatar">
                  <img v-bind:src="allData.currentUser.avatar.url.small"
                       class="is-round is-avatar is-square">
                </figure>
              </div>
              <div v-else>
                <div class="fa-9x">
                  <span class="fa-layers">
                    <i class="fas fa-circle has-text-white"></i>
                    <i class="fas fa-user-circle has-text-grey"
                       data-fa-transform="shrink-2"></i>
                  </span>
                </div>
              </div>
            </div>
            <nav class="level is-hidden-mobile"
                 v-if="allData.currentUser.profile">
              <div class="level-item">
                <div class="columns is-multiline is-paddingless is-gapless">
                  <div class="column is-12">
                    Tweets
                  </div>
                  <div class="column is-12">
                    {{allData.serviceContent ? allData.serviceContentLength : 0}}
                  </div>
                </div>
              </div>
              <div class="level-item">
                <div class="columns is-multiline is-paddingless is-gapless">
                  <div class="column is-12">
                    Following
                  </div>
                  <div class="column is-12">
                    {{getProfileCounts('following')}}
                  </div>
                </div>
              </div>
              <div class="level-item">
                <div class="columns is-multiline is-paddingless is-gapless">
                  <div class="column is-12">
                    Followers
                  </div>
                  <div class="column is-12">
                    {{getProfileCounts('followers')}}
                  </div>
                </div>
              </div>
              <div class="level-item">
                <div class="columns is-multiline is-paddingless is-gapless">
                  <div class="column is-12">
                    Likes
                  </div>
                  <div class="column is-12">
                    {{getRandomNumbers()}}
                  </div>
                </div>
              </div>
              <div class="level-item">
                <a class="button is-link is-rounded is-outlined">
                  Follow
                </a>
              </div>
            </nav>
          </div>
        </div>
        <section class="section">
          <div class="columns is-desktop is-multiline is-centered">
            <div class="column">
              <div class="has-text-left">
                <div class="card"
                     v-if="allData.currentUser">
                  <div class="card-content">
                    <p class="title is-5 is-marginless"
                       v-if="allData.currentUser.profile">{{allData.currentUser.profile.fullName}}</p>
                    <p class="subtitle is-6 is-marginless"
                       v-if="allData.currentUser">@{{allData.currentUser.username}}</p><br>
                    <p class="subtitle is-7">{{allData.currentUser.description}}</p>
                    <p class="subtitle is-7 is-marginless">
                      <i class="far fa-calendar-alt"></i> Joined {{makeProfileDate(allData.currentUser.createdTime , allData.serviceContent)}}
                    </p>
                  </div>
                </div>
                <div class="thumbnails is-hidden-touch ">
                  <p class="subtitle is-6 is-marginless">
                    <i class="far fa-image"></i> Photos and Videos
                  </p>
                  <div class="columns is-multiline is-gapless">
                    <div class="column is-one-third"
                         v-for="post in viewableImages"
                         :key="post.id">
                      <template v-if="post.mediaFile && post.mediaFile.url">
                        <template v-if='post.mediaFile.contentType.includes("image")||post.mediaFile.contentType.includes("Image")'>
                          <figure class="image is-square">
                            <img v-bind:src="post.mediaFile.url.thumb"
                                 class="left-column-img"
                                 @click="showContent(post)">
                          </figure>
                        </template>
                        <template v-if='post.mediaFile.contentType.includes("video")'>
                          <video class="avatar avatar--lg avatarSquare"
                                 v-bind:src="post.mediaFile.url.regular"
                                 controls
                                 controlsList="nodownload"></video>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-half-desktop">
              <div class="columns is-mobile is-multiline">
                <div class="column is-12">
                  <div v-if="allData.serviceContent && allData.serviceContentLength > 0">
                    <div v-for="post in allData.serviceContent"
                         :key="post.id">
                      <div class="card">
                        <div @click="showContent(post)">
                          <div class="card-content">
                            <div class="media">
                              <div class="media-left">
                                <figure class="image is-64x64"
                                        v-if="allData.currentUser.avatar">
                                  <p v-if="typeof allData.currentUser.avatar.url == 'object'">
                                    <img :src="allData.currentUser.avatar.url.small"
                                         class="is-avatar lg">
                                  </p>
                                </figure>
                                <figure class="image is-64x64"
                                        v-else>
                                  <i class="fas fa-user-circle has-text-grey fa-4x"></i>
                                </figure>
                              </div>
                              <div class="media-content"
                                   v-if="allData.currentUser.profile">
                                <p>
                                  <strong>{{allData.currentUser.profile.fullName}}</strong>
                                  <small> @{{allData.currentUser.username}}</small>
                                </p>
                                <small class="time tooltip"
                                       :data-tooltip="formatDate(post.publishTime, 'utc-dtg')">
                                  {{formatDate(post.publishTime, 'convertDate')}}
                                </small>
                              </div>
                            </div>
                            <div class="content">
                              <p class="text-wrap"
                                 v-html="processPost(parseText(post.text), post.profiles[0].service, $router.currentRoute.params.workspace)"></p>
                            </div>
                          </div>
                          <div class="card-image"
                               v-if="post.mediaFile && post.mediaFile.url">
                            <figure v-if="ifImage(post.mediaFile.contentType)"
                                    class="image">
                              <img :src='post.mediaFile.url.small'
                                   alt="image">
                            </figure>
                            <audio controls
                                   v-else-if="ifAudio(post.mediaFile.contentType)">
                              <source :src="post.mediaFile.url.raw"
                                      :type="post.mediaFile.contentType">
                            </audio>
                            <videoplayer v-else-if="ifVideo(post.mediaFile.contentType)"
                                         :src="post.mediaFile.url.raw"></videoplayer>
                            <a v-else
                               :href="post.mediaFile.url.raw">
                              File Link
                            </a>
                          </div>
                          <nav class="level is-mobile">
                            <div class="level-left">
                              <a class="level-item">
                                <span class="icon is-medium is-marginless">
                                  <i class="far fa-comment"></i>
                                </span>
                                <span>{{post && post.comments ? post.comments.length : 0}}</span>
                              </a>
                              <a class="level-item">
                                <span class="icon is-medium is-marginless">
                                  <i class="fas fa-retweet"></i>
                                </span>
                                <span>{{post.counts && post.counts.shares ? post.counts.shares : 0}}</span>
                              </a>
                              <a class="level-item">
                                <span class="icon is-medium is-marginless">
                                  <i class="far fa-heart"></i>
                                </span>
                                <span>{{post.counts && post.counts.likes ? post.counts.likes : 0}}</span>
                              </a>
                            </div>
                          </nav>
                        </div>
                        <div class="card-content">
                          <article class="comment media"
                                   v-for="comment in post.comments"
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
                    </div>
                  </div>
                  <div v-else>
                    <div class="card">
                      <div class="card-content">
                        <div class="card-header-title is-centered">
                          <i class="fab fa-twitter fa-3x has-text-primary"></i>
                        </div>
                        <p class="title has-text-centered">
                          No Posts Yet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-hidden-touch">
              <div class="columns is-mobile is-multiline">
                <div class="column is-12">
                  <div class="card">
                    <div class="card-content">
                      <p>
                        <b>New To Twitter?</b>
                      </p>
                      <p>Sign up now to get your own timeline!</p>
                      <a class="button is-link is-medium is-rounded is-fullwidth">
                        Sign Up
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left has-text-danger">
                      <i class="fab fa-youtube-square fa-2x"></i>
                    </div>
                    <div class="media-content text-wrap">
                      <p class="title is-6">Youtube</p>
                      <p class="subtitle is-7">@YouTube</p>
                    </div>
                  </div>
                  <div class="media">
                    <div class="media-left has-text-danger">
                      <i class="fab fa-google fa-2x"></i>
                    </div>
                    <div class="media-content text-wrap">
                      <p class="title is-6">Google</p>
                      <p class="subtitle is-7">@Google</p>
                    </div>
                  </div>
                  <div class="media">
                    <div class="media-left has-text-link">
                      <i class="fab fa-twitter fa-2x"></i>
                    </div>
                    <div class="media-content text-wrap">
                      <p class="title is-6">Twitter Support</p>
                      <p class="subtitle is-7">@TwitterSupport</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
    <template v-else>
      <div class="card">
        <div class="card-content">
          <div class="card-header-title is-centered">
            <i class="fas fa-lock fa-3x has-text-primary"></i>
          </div>
          <p class="title has-text-centered">
            @{{this.$router.currentRoute.params.username}} profile is protected.
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'
export default {
  name: 'twitterprofile',
  mixins: [helpers, processText],
  props: {
    allData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      scrollPosition: 0,
      viewableImages: [],
      minStat: 1,
      maxStat: 100
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
    showContent(post) {
      let service = this.$router.currentRoute.params.service
      let username = this.$router.currentRoute.params.username
      let workspace = this.$router.currentRoute.params.workspace
      this.$router.push({
        path: `/web/${workspace}/${service}/${username}/${post.id}`
      })
    },
    findImages() {
      let i = 0
      this.viewableImages = []
      for (i in this.allData.serviceContent) {
        if (this.allData.serviceContent[i].mediaFile !== null) {
          this.viewableImages.push(this.allData.serviceContent[i])
        }
      }
    },
    getProfileCounts(key) {
      let value = 0
      if (
        this.allData.currentUser.profile &&
        this.allData.currentUser.profile.counts &&
        this.allData.currentUser.profile.counts[key]
      ) {
        value = this.allData.currentUser.profile.counts[key]
      }
      return value
    }
  },
  watch: {
    $route: 'findImages'
  },
  computed: {
    checkUser() {
      let isValidUser =
        this.allData.currentUser.username ===
        this.$router.currentRoute.params.username
      if (isValidUser) {
        this.findImages()
      }
      return isValidUser
    },
    checkBanner() {
      let checkBanner =
        this.allData.currentUser.banner &&
        this.allData.currentUser.banner.mediaFile !== null &&
        this.allData.currentUser.banner.mediaFile.url &&
        this.allData.currentUser.banner.mediaFile.url.regular

      return checkBanner
    },
    checkAvatar() {
      let checkAvatar =
        this.allData.currentUser.avatar &&
        this.allData.currentUser.avatar.url &&
        this.allData.currentUser.avatar.url.small

      return checkAvatar
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'styles.scss';
nav.level > div.nav-item {
  margin-top: 20px;
}
nav.level > div.nav-item > div {
  margin-left: 20px;
}
nav.level a > span {
  margin-right: 10px;
}
[v-cloak] {
  display: none;
}
.follow-btn-right {
  margin-left: 60px;
}
.left-column-img {
  width: 100%;
  height: 83px;
  cursor: pointer;
  padding: 5px;
}
</style>
