<template>
  <div v-if="allData.userPost.mediaPostPublic">
    <section class="hero is-medium is-bold"
             :style="'background-color:'+allData.userPost.mediaPostPublic.profiles[0].service.color">
      <div class="hero-body">
        <div class="container has-text-centered">
        </div>
      </div>
    </section>
    <section title="Posts"
             class="articles"
             v-if="allData.userPost.mediaPostPublic != ''">
      <div class="column is-8 is-offset-2">
        <nav class="level mb-0">
          <div class="level-item"
               v-if="allData.userPost.mediaPostPublic && allData.userPost.mediaPostPublic.parent !== null"
               @click="showCommentContent(allData.userPost.mediaPostPublic.parent)"
               style="cursor:pointer">
            <span class="icon is-small mr-1"
                  :class="lightOrDark(allData.userPost.mediaPostPublic.profiles[0].service.color)">
              <i class="far fa-comment"></i>
            </span>
            <span class="is-size-7 has-text-underlined"
                  :class="lightOrDark(allData.userPost.mediaPostPublic.profiles[0].service.color)">In response to @{{allData.userPost.mediaPostPublic.parent ? `${allData.userPost.mediaPostPublic.parent.profiles[0].username}'s post` : null}}</span>
          </div>
        </nav>
        <div class="card article">
          <div class="card-content">
            <div class="media">
              <div class="media-center"
                   v-if="allData.userPost.mediaPostPublic.profiles[0].avatar">
                <img v-bind:src="allData.userPost.mediaPostPublic.profiles[0].avatar.url.small"
                     class="author-image"
                     alt="Placeholder image">
              </div>
              <div class="media-center"
                   v-else>
                <div class="fa-3x">
                  <span class="fa-layers author-image">
                    <i class="fas fa-circle has-text-grey-light"
                       data-fa-transform="grow-3"></i>
                    <i class="fas fa-user-circle has-text-white"></i>
                  </span>
                </div>
              </div>
              <div class="media-content has-text-centered">
                <h2 class="has-text-centered article-title">
                  {{allData.userPost.mediaPostPublic.title}}
                </h2>
                <span class="subtitle is-7 userBack"
                      @click="showProfile(allData.userPost.mediaPostPublic.profiles[0].username)">
                  @{{allData.userPost.mediaPostPublic.profiles[0].username}}
                </span>
                <span class="subtitle is-7 tooltip"
                      :data-tooltip="formatDate(allData.userPost.mediaPostPublic.publishTime,'utc-dtg')">
                  {{formatDate(allData.userPost.mediaPostPublic.publishTime, 'convertDate')}}
                </span>
              </div>
            </div>
            <div class="content article-body">
              <p class="article-copy"
                 v-html="parseText(allData.userPost.mediaPostPublic.text)"></p>
            </div>
            <div class="card-image has-text-centered">
              <div v-if="allData.userPost.mediaPostPublic.mediaFile && allData.userPost.mediaPostPublic.mediaFile.url">
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
    </section>
    <section v-else>
      <div class="card">
        <div class="card-content">
          <div class="card-header-title is-centered">
            <i class="fas fa-question fa-3x has-text-primary"></i>
          </div>
          <p class="title has-text-centered">
            Post Not Found
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import processText from '@/shared/mixins/processText'
import helpers from '@/shared/mixins/helpers'
import lightOrDark from '@/shared/mixins/lightOrDark'
export default {
  name: 'skeleton-content',
  mixins: [helpers, processText, lightOrDark],
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/main.scss';
</style>
<style lang="scss" scoped>
@import 'styles.scss';
.showPointer,
.userBack {
  cursor: pointer;
}
.bannerImage {
  height: 450px;
  width: 100%;
  object-fit: cover;
}
</style>
