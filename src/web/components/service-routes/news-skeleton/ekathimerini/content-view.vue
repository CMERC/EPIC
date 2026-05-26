<template>
  <section class="section">
    <div v-if="checkUser"
         class="container">
      <div class="columns is-mobile">
        <div class="column is-10 is-offset-1">
          <div class="box">
            <div class="columns is-mobile is-multiline">
              <div class="column is-2-desktop is-hidden-touch left-content-column">
                <div class="panel">
                  <aside class="menu">
                    <ul class="menu-list"
                        v-for="social in socialLinks"
                        v-bind:key="social.id">
                      <li class="social-links">
                        <div class="media ">
                          <div :class="social.color">
                            <i :class="social.icon"></i>
                          </div>
                          <div class="media-content">
                            <p class="subtitle is-7">&nbsp;{{social.label}}</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </aside>
                </div>
              </div>
              <div class="column is-6-desktop is-12-tablet is-12-mobile"
                   v-if="allData.userPost.mediaPostPublic">
                <nav class="level mb-0">
                  <div class="level-item"
                       v-if="allData.userPost.mediaPostPublic && allData.userPost.mediaPostPublic.parent !== null"
                       @click="showCommentContent(allData.userPost.mediaPostPublic.parent)"
                       style="cursor:pointer">
                    <span class="icon is-small mr-1">
                      <i class="far fa-comment"></i>
                    </span>
                    <span class="is-size-7 has-text-underlined">In response to @{{allData.userPost.mediaPostPublic.parent ? `${allData.userPost.mediaPostPublic.parent.profiles[0].username}'s post` : null}}</span>
                  </div>
                </nav>
                <div class="card panel">
                  <div class="card-content media">
                    <div class="media-content">
                      <p class="title is-4">{{allData.userPost.mediaPostPublic.title}}</p>
                      <div class="content">
                        <a @click="showProfile(allData.userPost.mediaPostPublic.profiles[0].username)">
                          <span class="subtitle is-size-6-desktop is-size-7-tablet is-size-7-mobile tooltip"
                                v-if="allData.userPost.mediaPostPublic"
                                :data-tooltip="formatDate(allData.userPost.mediaPostPublic.publishTime, 'utc-dtg')">{{formatDate(allData.userPost.mediaPostPublic.publishTime, 'shortDate')}}</span>
                          by
                          <span class="subtitle is-size-6-desktop is-size-6-tablet is-size-6-mobile"
                                v-if="allData.userPost.mediaPostPublic">{{allData.userPost.mediaPostPublic.profiles[0].name}}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="card-image"
                       v-if="allData.userPost.mediaPostPublic.mediaFile">
                    <div>
                      <figure class="image">
                        <img v-bind:src="allData.userPost.mediaPostPublic.mediaFile.url.regular"
                             alt="Placeholder image">
                      </figure>
                    </div>
                  </div>
                  <div class="card-content">
                    <div class="content">
                      <p class="subtitle is-6"
                         v-html="parseText(allData.userPost.mediaPostPublic.text)"></p>
                    </div>
                  </div>
                  <div class="card-content">
                    <article class="comment media"
                             v-for="comment in allData.userPost.mediaPostPublic.comments"
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
                              <span>{{comment.counts ? comment.counts.likes : ''}} Like<span>{{comment.counts && comment.counts.likes ? 's' : ''}}</span></span>
                            </a>
                            <a class="level-item">
                              <span>Reply</span>
                            </a>
                            <a class="level-item">
                              <span class="tooltip"
                                    :data-tooltip="formatDate(comment.createTime)">{{formatDate(comment.createTime, 'fromNow')}}</span>
                            </a>
                          </div>
                        </nav>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
              <div class="column is-2-desktop is-12-tablet is-12-mobile left-content-column is-hidden-desktop">
                <div class="panel">
                  <aside class="menu">
                    <ul class="menu-list"
                        v-for="social in socialLinks"
                        v-bind:key="social.id">
                      <li class="social-links">
                        <div class="media ">
                          <div :class="social.color">
                            <i :class="social.icon"></i>
                          </div>
                          <div class="media-content">
                            <p class="subtitle is-7">&nbsp;{{social.label}}</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </aside>
                </div>
              </div>
              <div class="column is-4-desktop is-12-tablet is-12-mobile">
                <div class="columns is-mobile is-multiline">
                  <div class="column is-12">
                    <div class="card panel is-marginless">
                      <header class="card-header">
                        <p class="card-header-title recent-news">
                          Recent News
                        </p>
                      </header>
                    </div>
                    <div class="card panel">
                      <aside class="menu">
                        <ul class="menu-list"
                            v-for="link in recentLinks"
                            v-bind:key="link.id">
                          <li class="list-section">
                            <a class="is-size-7 has-text-black">{{link.label}}</a>
                          </li>
                        </ul>
                      </aside>
                    </div>
                  </div>
                  <div class="column is-12">
                    <div class="card panel is-marginless">
                      <header class="card-header">
                        <p class="card-header-title comments">
                          COMMENT
                        </p>
                      </header>
                    </div>
                    <div class="card panel">
                      <aside class="menu">
                        <ul class="menu-list"
                            v-for="link in commentLinks"
                            v-bind:key="link.id">
                          <li class="list-section">
                            <a class="is-size-7 has-text-black is-italic">{{link.label}}</a>
                          </li>
                        </ul>
                      </aside>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import processText from '@/shared/mixins/processText'
import helpers from '@/shared/mixins/helpers'
export default {
  name: 'ekathimerinicontent',
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
      socialLinks: [
        {
          id: 1,
          value: 'print',
          label: 'PRINT',
          icon: 'fas fa-print',
          color: 'has-text-black'
        },
        {
          id: 2,
          value: 'comment',
          label: 'COMMENT',
          icon: 'fas fa-comment',
          color: 'has-text-blue'
        },
        {
          id: 3,
          value: 'mail',
          label: 'MAIL',
          icon: 'fas fa-envelope',
          color: 'has-text-black'
        },
        {
          id: 4,
          value: 'twitter',
          label: 'TWITTER',
          icon: 'fab fa-twitter',
          color: 'has-text-link'
        },
        {
          id: 5,
          value: 'facebook',
          label: 'FACEBOOK',
          icon: 'fab fa-facebook-f',
          color: 'has-text-link'
        },
        {
          id: 6,
          value: 'inshare',
          label: 'INSHARE',
          icon: 'fab fa-linkedin-in',
          color: 'has-text-link'
        },
        {
          id: 7,
          value: 'googleplus',
          label: 'GOOGLE PLUS',
          icon: 'fab fa-google-plus',
          color: 'has-text-danger'
        }
      ],
      recentLinks: [
        { id: 1, value: 'recent1', label: 'Greek beaches rated Top 10.' },
        { id: 2, value: 'recent2', label: 'Who knew Greece was this cool!' },
        { id: 3, value: 'recent3', label: 'Nice Places to go in Greece' },
        { id: 4, value: 'recent4', label: 'Can you make money around here?' },
        { id: 5, value: 'recent5', label: 'Who is the richest guy in Greece?' },
        { id: 6, value: 'recent6', label: 'Look how nice the roads are.' },
        { id: 7, value: 'recent7', label: 'Everyday is a Good Day!' },
        { id: 8, value: 'recent8', label: 'There are some events coming soon!' }
      ],
      commentLinks: [
        { id: 1, value: 'comment1', label: 'Greece is on the energy map.' },
        { id: 2, value: 'comment2', label: 'Tax limit has been reached' },
        { id: 3, value: 'comment3', label: 'A bizarre political landscape' },
        { id: 4, value: 'comment4', label: 'The right business mix' },
        { id: 5, value: 'comment5', label: 'What is missing?' },
        {
          id: 6,
          value: 'comment6',
          label: 'Promises to a disenchanted society'
        },
        { id: 7, value: 'comment7', label: 'The appointment in Thessaloniki' },
        { id: 8, value: 'comment8', label: 'Where did it go wrong?' }
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
      let service = this.$router.currentRoute.params.service
      let username = this.$router.currentRoute.params.username
      let workspace = this.$router.currentRoute.params.workspace
      this.$router.push({
        path: `/web/${workspace}/${service}/${username}/${post.id}`
      })
    },
    showProfile() {
      let service = this.$router.currentRoute.params.service
      let username = this.$router.currentRoute.params.username
      let workspace = this.$router.currentRoute.params.workspace
      this.$router.push({
        path: `/web/${workspace}/${service}/${username}`
      })
    }
  },
  computed: {
    checkUser() {
      return this.isCurrentUser(
        this.allData.currentUser.username,
        this.$router.currentRoute.params.username
      )
    },
    checkAvatar() {
      let checkAvatar =
        this.allData.userPost.mediaPostPublic.profiles[0] &&
        this.allData.userPost.mediaPostPublic.profiles[0].avatar
      return checkAvatar
    }
  }
}
</script>
<!-- use to style content outside component -->

<style lang="scss" scoped>
@import 'card-theme.scss';
.left-content-column {
  margin-top: 50px;
}
.social-links {
  border-bottom: 1px dashed #dddddd;
  padding-bottom: 5px;
  padding-top: 5px;
}
</style>
