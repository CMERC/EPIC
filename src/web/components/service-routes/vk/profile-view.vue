<template>
  <section class="section">
    <div v-if="checkUser"
         class="container">
      <div class="columns is-mobile is-multiline">
        <div class="column is-4-desktop is-12-tablet is-12-mobile">
          <div class="columns is-mobile is-multiline">
            <div class="column is-5-desktop is-5-tablet is-12-mobile">
              <div class="columns is-multiline is-mobile">
                <div class="column is-12 is-paddingless">
                  <label class="label is-size-7">
                    Phone or Email
                  </label>
                  <input class="input"
                         autocomplete="off"
                         type="text"
                         disabled />
                </div>
                <div class="column is-12 is-paddingless">
                  <label class="label is-size-7">
                    Password
                  </label>
                  <input class="input"
                         autocomplete="off"
                         type="password"
                         disabled />
                </div>
                <div class="column is-12">
                  <a class="button is-link is-fullwidth">
                    Log in
                  </a>
                </div>
                <div class="column is-12 is-marginless">
                  <a class="button is-link is-fullwidth">
                    Sign Up
                  </a>
                </div>
                <div class="column is-12 is-size-7">
                  <p>Forgot your password?</p>
                </div>
              </div>
            </div>
            <div class="column is-7-desktop is-7-tablet is-12-mobile">
              <div class="columns is-mobile is-multiline is-centered">
                <div class="column is-12">
                  <div class="card">
                    <div class="card-image is-2"
                         v-if="checkAvatar">
                      <figure class="image is-1by1">
                        <img v-bind:src="allData.currentUser.avatar.url.small">
                      </figure>
                    </div>
                    <div v-else>
                      <div class="fa-8x fa-fw">
                        <span class="fa-layers">
                          <i class="far fa-square has-text-grey"></i>
                          <i class="fas fa-user-circle has-text-grey"
                             data-fa-transform="shrink-6"></i>
                        </span>
                      </div>
                    </div>
                    <div class="card-content">
                      <div class="content is-size-7">
                        <p>
                          <b>Join VK now</b> to stay in touch with Igor and millions of others. Or
                          <b>log in</b>, if you have a
                          <b>VK</b> account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-12 is-narrow">
                  <div class="card">
                    <header class="card-header">
                      <p class="card-header-title is-size-7">
                        Gifts
                        <span class="has-text-grey">&nbsp; 3</span>
                      </p>
                    </header>
                    <div class="card-content">
                      <div class="content">
                        <span class="icon is-medium">
                          <i class="fas fa-birthday-cake"></i>
                        </span>
                        <span class="icon is-medium">
                          <i class="fab fa-sticker-mule"></i>
                        </span>
                        <span class="icon is-medium">
                          <i class="fas fa-rocket"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-12">
                  <div class="card">
                    <header class="card-header">
                      <p class="card-header-title is-size-7">
                        Noteworthy Pages
                      </p>
                    </header>
                    <div class="card-content">
                      <div class="content">
                        <div class="media">
                          <div class="media-left has-text-danger">
                            <i class="fab fa-youtube-square fa-lg"></i>
                          </div>
                          <div class="media-content">
                            <p class="title is-6">Youtube</p>
                            <p class="subtitle is-7">@YouTube</p>
                          </div>
                        </div>
                        <div class="media">
                          <div class="media-left has-text-danger">
                            <i class="fab fa-google fa-lg"></i>
                          </div>
                          <div class="media-content">
                            <p class="title is-6">Google</p>
                            <p class="subtitle is-7">@Google</p>
                          </div>
                        </div>
                        <div class="media">
                          <div class="media-left has-text-link">
                            <i class="fab fa-vk fa-lg"></i>
                          </div>
                          <div class="media-content">
                            <p class="title is-6">VK</p>
                            <p class="subtitle is-7">@VK</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-6-desktop is-12-tablet is-12-mobile">
          <div class="columns is-mobile is-multiline">
            <div class="column is-12">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">
                    {{allData.currentUser.name}}
                  </p>
                  <a class="card-header-icon"
                     aria-label="more options">
                    <span class="icon">
                      online
                    </span>
                  </a>
                </header>
                <div class="card-content">
                  <div class="content has-text-centered">
                    {{allData.currentUser.description}}
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-12">
              <div v-if="allData.serviceContent && allData.serviceContentLength > 0">
                <div v-for="post in allData.serviceContent"
                     :key="post.id">
                  <div class="columns is-mobile is-multiline">
                    <div class="column is-12">
                      <div class="card">
                        <div @click="showContent(post)">
                          <div class="card-content">
                            <div class="media">
                              <div class="media-left"
                                   v-if="checkAvatar">
                                <figure class="image is-64x64"
                                        v-if="allData.currentUser.avatar">
                                  <p v-if="typeof allData.currentUser.avatar.url == 'object'">
                                    <img :src="allData.currentUser.avatar.url.small"
                                         class="is-avatar lg">
                                  </p>
                                </figure>
                              </div>
                              <div v-else
                                   class="media-left">
                                <figure class="image is-64x64">
                                  <span class="icon is-large">
                                    <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                                  </span>
                                </figure>
                              </div>
                              <div class="media-content"
                                   v-if="allData.currentUser.profile">
                                <p>
                                  <strong>{{allData.currentUser.profile.fullName}}</strong>
                                </p>
                                <p>
                                  <small class="time tooltip"
                                         :data-tooltip="formatDate(post.publishTime)">{{formatDate(post.publishTime, 'shortDateTime')}}</small>
                                </p>
                              </div>
                            </div>
                            <div class="content has-text-left">
                              <p class="text-wrap"
                                 v-html="processPost(parseText(post.text), allData.currentUser.service, $router.currentRoute.params.workspace)"></p>
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
                          <footer class="card-footer">
                            <nav class="level is-mobile footer-icons">
                              <div class="level-left">
                                <a class="level-item footer-icons">
                                  <span class="icon is-medium">
                                    <i class="far fa-heart"></i>
                                  </span>
                                  <span>{{post.counts && post.counts.likes ? post.counts.likes : 0}}</span>
                                </a>
                                <a class="level-item footer-icons">
                                  <span class="icon is-medium">
                                    <i class="fa fa-share"></i>
                                  </span>
                                  <span>{{post.counts && post.counts.shares ? post.counts.shares : 0}}</span>
                                </a>
                                <a class="level-item footer-icons">
                                  <span class="icon is-medium">
                                    <i class="fa fa-comment"></i>
                                  </span>
                                  <span>{{post.comments ? post.comments.length : 0}}</span>
                                </a>
                              </div>
                            </nav>
                          </footer>
                        </div>
                        <div class="commentArea">
                          <div class="card-content">
                            <article class="comment media"
                                     v-for="comment in post.comments"
                                     :key="comment.id"
                                     @click="showCommentContent(comment)">
                              <div class="media-left">
                                <figure class="image is-64x64"
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
              </div>
              <div v-else>
                <div class="card">
                  <div class="card-content">
                    <div class="card-header-title is-centered">
                      <span class="icon">
                        <i class="fab fa-vk"></i>
                      </span>
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
      </div>
    </div>
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
  </section>
</template>
<script>
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'
export default {
  name: 'vkprofile',
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
    handleScroll() {
      // THIS DOESN'T WORK YET!
      return false
    }
  },
  computed: {
    checkUser() {
      return (
        this.allData.currentUser.username ==
        this.$router.currentRoute.params.username
      )
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
<!-- use to style content outside component -->

<style lang="scss" scoped>
@import 'styles.scss';
</style>
