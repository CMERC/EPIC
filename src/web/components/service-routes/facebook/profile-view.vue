<template>
  <section class="section">
    <div class="container">
      <template v-if="checkUser">
        <div class="columns is-mobile">
          <div class="column is-offset-2-mobile is-hidden-touch">
            <div class="columns is-multiline is-mobile"
                 v-if="allData.currentUser">
              <div class="column is-10 is-offset-1">
                <div v-if="checkAvatar">
                  <figure class="image">
                    <img v-bind:src="allData.currentUser.avatar.url.small"
                         alt="Avatar">
                  </figure>
                </div>
                <figure class="image"
                        v-else>
                  <div class="fa-9x">
                    <span class="fa-layers">
                      <i class="far fa-square has-text-grey"></i>
                      <i class="fas fa-user-circle has-text-grey"
                         data-fa-transform="shrink-6"></i>
                    </span>
                  </div>
                </figure>
              </div>
              <div class="column is-10 is-offset-1">
                <div class="is-size-5-desktop is-size-6-tablet is-size-6-mobile has-text-black has-text-weight-normal"
                     v-if="allData.currentUser.profile">
                  {{allData.currentUser.profile.fullName}}
                </div>
                <div class="is-size-7-desktop is-size-7-tablet is-size-7-mobile has-text-grey has-text-weight-bold"
                     v-if="allData.currentUser">
                  @{{allData.currentUser.username}}
                </div>
              </div>
              <div class="column is-10">
                <aside class="menu">
                  <ul class="menu-list"
                      v-for="link in profileLinks"
                      v-bind:key="link.id">
                    <li>
                      <a class="is-size-6-desktop is-size-7-tablet is-size-7-mobile has-text-black">{{link.label}}</a>
                    </li>
                  </ul>
                </aside>
              </div>
            </div>
          </div>
          <div class="column is-10-desktop is-12-tablet is-12-mobile">
            <div class="columns is-multiline is-mobile">
              <div class="column is-12 is-paddingless">
                <div v-if="checkBanner"
                     class="profile-banner">
                  <figure class="image">
                    <img v-bind:src="allData.currentUser.banner.mediaFile.url.regular"
                         alt="profile Banner">
                  </figure>
                </div>
              </div>
              <div class="column is-12 is-paddingless">
                <div class="box has-background-white is-paddingless">
                  <div class="columns is-mobile is-multiline">
                    <div class="column is-8-desktop is-12-tablet is-12-mobile is-spaced">
                      <div class="field has-addons is-centered">
                        <p class="control">
                          <a class="button is-small has-text-grey-dark has-text-weight-semibold has-background-white-ter">
                            <span class="icon is-small">
                              <i class="fas fa-thumbs-up"></i>
                            </span>
                            <span>Like</span>
                          </a>
                        </p>
                        <p class="control">
                          <a class="button is-small has-text-grey-dark has-text-weight-semibold has-background-white-ter">
                            <span class="icon is-small">
                              <i class="fas fa-share"></i>
                            </span>
                            <span>Share</span>
                          </a>
                        </p>
                        <p class="control">
                          <a class="button is-small has-text-grey-dark has-text-weight-semibold has-background-white-ter">
                            <span class="icon is-small">
                              <i class="fas fa-pencil-alt"></i>
                            </span>
                            <span>Suggest Edits</span>
                          </a>
                        </p>
                        <p class="control">
                          <a class="button is-small has-text-grey-dark has-text-weight-semibold has-background-white-ter">
                            <span>...</span>
                          </a>
                        </p>
                      </div>
                    </div>
                    <div class="column is-3-desktop is-12-tablet is-12-mobile is-spaced">
                      <a class="button is-small is-fullwidth fb-btns">
                        <span class="icon has-text-white">
                          <i class="fab fa-facebook-messenger fa-lg"></i>
                        </span>
                        <span class="has-text-white has-text-weight-bold">Send Message</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-8-desktop is-12-tablet is-12-mobile is-paddingless post-section">
                <div v-if="allData.serviceContent && allData.serviceContentLength > 0">
                  <div class="card">
                    <p class="card-header-title">
                      Posts
                    </p>
                    <div class="card-content">
                      <div v-for="post in allData.serviceContent"
                           :key="post.id"
                           class="card">
                        <div @click="showContent(post)">
                          <div class="card">
                            <div class="card-content">
                              <div class="media">
                                <div class="media-left is-marginless">
                                  <figure class="media-left"
                                          v-if="allData.currentUser.avatar && allData.currentUser.avatar.url">
                                    <p class="image">
                                      <img :src="allData.currentUser.avatar.url.small"
                                           class="is-avatar md">
                                    </p>
                                  </figure>
                                </div>
                                <div class="media-content"
                                     v-if="allData.currentUser.profile">
                                  <a class="link is-link is-text has-text-weight-bold is-size-6-desktop is-size-6-tablet is-size-7-mobile">
                                    {{allData.currentUser.profile.fullName}}
                                  </a>
                                  <p>
                                    <small class="time has-text-grey is-size-7-desktop is-size-7-tablet is-size-7-mobile tooltip"
                                           :data-tooltip="formatDate(post.publishTime, 'utc-dtg')">{{formatDate(post.publishTime, 'shortDate')}}</small>
                                  </p>
                                </div>
                              </div>
                              <div class="content has-text-black">
                                <p class="is-size-6"
                                   v-html="processPost(parseText(post.text), post.profiles[0].service, $router.currentRoute.params.workspace)"></p>
                              </div>
                            </div>
                            <div class="card-image">
                              <div v-if="post.mediaFile && post.mediaFile.url"
                                   class="u-text-center">
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
                            </div>
                          </div>
                          <nav class="level-right is-mobile stats-area">
                            <a class="level-item">
                              <span>{{post.counts && post.counts.likes?post.counts.likes:0}} Likes</span>
                            </a>
                            <a class="level-item">
                              <span>{{post.counts && post.counts.shares?post.counts.shares:0}} Shares</span>
                            </a>
                            <a class="level-item">
                              <span>{{post && post.comments?post.comments.length:0}} Comments</span>
                            </a>
                          </nav>
                          <footer class="card-footer post-footer-buttons">
                            <p class="buttons">
                              <a class="button is-white has-text-grey is-size-6-desktop is-size-7-tablet is-size-7-mobile">
                                <span class="icon is-small">
                                  <i class="fas fa-thumbs-up"></i>
                                </span>
                                <span>Like</span>
                              </a>
                              <a class="button is-white has-text-grey is-size-6-desktop is-size-7-tablet is-size-7-mobile">
                                <span class="icon">
                                  <i class="far fa-comment-alt"></i>
                                </span>
                                <span>Comment</span>
                              </a>
                              <a class="button is-white has-text-grey is-size-6-desktop is-size-7-tablet is-size-7-mobile">
                                <span class="icon is-small">
                                  <i class="fas fa-share"></i>
                                </span>
                                <span>Share</span>
                              </a>
                            </p>
                          </footer>
                        </div>
                        <div class="card-content">
                          <article class="comment media"
                                   v-for="comment in post.comments"
                                   :key="comment.id"
                                   @click="showCommentContent(comment)">
                            <div class="media-left">
                              <figure class="image is-32x32"
                                      v-if="comment.profiles[0] && comment.profiles[0].avatar">
                                <img :src='comment.profiles[0].avatar?comment.profiles[0].avatar.url.small:""'
                                     class="is-avatar">
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
                                    <span>Like</span>
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
                        <div class="commentArea">
                          <div class="columns">
                            <div class="column is-narrow">
                              <figure class="image">
                                <span class="icon is-large">
                                  <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                                </span>
                              </figure>
                            </div>
                            <div class="column">
                              <div class="field">
                                <div class="control has-icons-right">
                                  <input class="input is-rounded"
                                         type="text"
                                         placeholder="Write a comment...">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="card">
                    <div class="card-content">
                      <div class="card-header-title is-centered">
                        <i class="fab fa-facebook fa-3x has-text-primary"></i>
                      </div>
                      <p class="title has-text-centered">
                        No Posts Yet
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-4 is-hidden-touch">
                <div class="control has-icons-left">
                  <input class="input is-small is-fullwidth has-text-grey-dark"
                         type="text"
                         placeholder="Search for posts">
                  <span class="icon is-small is-left">
                    <i class="fas fa-search fa-sm"></i>
                  </span>
                </div>
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">
                      Community
                    </p>
                  </header>
                  <div class="card-content">
                    <div class="content">
                      No Community at this time.
                    </div>
                  </div>
                </div>
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">
                      About
                    </p>
                  </header>
                  <div class="card-content">
                    <div class="content">
                      <div class="columns is-multiline is-mobile">
                        <div class="column has-text-centered">
                          <p class="is-size-7">{{allData.currentUser.description}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  </section>
</template>
<script>
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'

export default {
  name: 'facebookprofile',
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
      profileLinks: [
        { id: 1, value: 'home', label: 'Home' },
        { id: 2, value: 'posts', label: 'Posts' },
        { id: 3, value: 'videos', label: 'Videos' },
        { id: 4, value: 'photos', label: 'Photos' },
        { id: 5, value: 'about', label: 'About' },
        { id: 6, value: 'community', label: 'Community' },
        { id: 7, value: 'infoads', label: 'Info/Ads' },
        { id: 8, value: 'events', label: 'Events' }
      ]
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
      let workspace = this.$router.currentRoute.params.workspace
      let service = this.$router.currentRoute.params.service
      let username = this.$router.currentRoute.params.username
      this.$router.push({
        path: `/web/${workspace}/${service}/${username}/${post.id}`
      })
    },
    handleScroll() {
      // THIS DOESN'T WORK YET!
      return false
    }
  },
  computed: {
    checkUser() {
      return (
        this.allData.currentUser.username ===
        this.$router.currentRoute.params.username
      )
    },
    checkBanner() {
      let checkBanner =
        this.allData &&
        this.allData.currentUser &&
        this.allData.currentUser.banner &&
        this.allData.currentUser.banner.mediaFile !== null &&
        this.allData.currentUser.banner.mediaFile.url &&
        this.allData.currentUser.banner.mediaFile.url.regular

      return checkBanner
    },
    checkAvatar() {
      let checkAvatar =
        this.allData &&
        this.allData.currentUser &&
        this.allData.currentUser.avatar &&
        this.allData.currentUser.avatar.url &&
        this.allData.currentUser.avatar.url.small

      return checkAvatar
    }
  }
}
</script>
<!-- use to style content outside component -->
<style lang="scss" scoped>
@import 'styles.scss';
.edge-section {
  background-color: #e6e6e6;
}
figure.image div {
  margin-top: -50px;
  margin-bottom: -30px;
}
</style>
