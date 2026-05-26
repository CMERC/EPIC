<template>
  <div class="container contentMain">
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
    <div class="card ">
      <div class="post-content-container columns is-gapless is-marginless is-mobile is-multiline"
           v-if="allData.userPost.mediaPostPublic">
        <div class="post-content column">
          <div class="is-spaced">
            <div class="card-content is-paddingless">
              <div class="media">
                <div class="media-left is-spaced content">
                  <a @click="showProfile(allData.userPost.mediaPostPublic.profiles[0].username)">
                    <figure class="image is-96x96 "
                            v-if="checkAvatar">
                      <img v-bind:src="allData.userPost.mediaPostPublic.profiles[0].avatar.url.small"
                           alt="Avatar"
                           class="is-avatar xl">
                    </figure>
                    <figure class="image is-96x96"
                            v-else>
                      <i class="fas fa-user-circle has-text-grey fa-6x"></i>
                    </figure>
                    <p class="title is-size-5">{{allData.userPost.mediaPostPublic.profiles[0].name}}</p>
                    <p class="subtitle is-size-6">@{{allData.userPost.mediaPostPublic.profiles[0].username}}</p>
                  </a>
                </div>
                <div class="media-content">
                  <span class="title is-7 article-title">{{allData.userPost.mediaPostPublic.title}} - </span>
                  <span class="subtitle is-7 article-subtitle tooltip"
                        :data-tooltip="formatDate(allData.userPost.mediaPostPublic.publishTime, 'utc-dtg')">
                    {{formatDate(allData.userPost.mediaPostPublic.publishTime, 'shortDate')}}
                  </span>
                  <span class="subtitle is-5"
                        v-html="processPost(parseText(allData.userPost.mediaPostPublic.text), allData.userPost.mediaPostPublic.profiles[0].service, $router.currentRoute.params.workspace)"></span>

                  <div v-if="allData.userPost.mediaPostPublic.mediaFile && allData.userPost.mediaPostPublic.mediaFile.url">
                    <figure v-if="ifImage(allData.userPost.mediaPostPublic.mediaFile.contentType)"
                            class="image">
                      <img class="content-image"
                           :src="allData.userPost.mediaPostPublic.mediaFile.url.regular"
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
      </div>
      <div v-else>
        <div class="card-content">
          <div class="card-header-title is-centered">
            <i class="fab fa-telegram fa-3x has-text-primary"></i>
          </div>
          <p class="title has-text-centered">
            Post Not Found
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'
export default {
  name: 'chatcontent',
  mixins: [helpers, processText],
  props: {
    allData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
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
  },
  computed: {
    checkAvatar() {
      let checkAvatar =
        this.allData.userPost.mediaPostPublic &&
        this.allData.userPost.mediaPostPublic.profiles[0].avatar
      return checkAvatar
    }
  }
}
</script>
<!-- use to style content outside component -->
<style lang="scss" scoped>
.card {
  margin-top: 50px;
}
.list {
  border-bottom: 1px solid #efefef;
  margin-bottom: 15px;
}
@import 'styles.scss';
</style>
