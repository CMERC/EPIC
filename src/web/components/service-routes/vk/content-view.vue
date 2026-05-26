<template>
  <section class="section">
    <div class="columns is-mobile is-multiline is-centered"
         v-if="allData.userPost.mediaPostPublic">
      <div class="column is-two-thirds">
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
        <div class="card">
          <div v-if="allData.userPost.mediaPostPublic">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <div v-if="checkAvatar">
                    <figure class="image is-48x48">
                      <img :src="allData.userPost.mediaPostPublic.profiles[0].avatar.url.small"
                           class="is-avatar md">
                    </figure>
                  </div>
                  <div v-else>
                    <figure class="image is-64x64">
                      <span class="icon is-large">
                        <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                      </span>
                    </figure>
                  </div>
                </div>
                <div class="media-content">
                  <a @click="showProfile(allData.userPost.mediaPostPublic.profiles[0].username)">
                    <p class="title is-size-5-desktop is-size-6-tablet is-size-6-mobile"
                       v-if="allData.userPost.mediaPostPublic">{{allData.userPost.mediaPostPublic.profiles[0].name}}</p>
                  </a>
                  <p class="subtitle is-size-6-desktop is-size-7-tablet is-size-7-mobile tooltip"
                     :data-tooltip="formatDate(allData.userPost.mediaPostPublic.publishTime, 'utc-dtg')"
                     v-if="allData.userPost.mediaPostPublic">{{formatDate(allData.userPost.mediaPostPublic.publishTime, 'shortDate')}}</p>
                </div>
              </div>
              <div class="content"
                   v-if="allData.userPost.mediaPostPublic">
                <span v-html="parseText(processPost(allData.userPost.mediaPostPublic.text, allData.userPost.mediaPostPublic.profiles[0].service, $router.currentRoute.params.workspace))"></span>
              </div>
            </div>
          </div>
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
          <nav class="level-right is-mobile stats-area">
            <a class="level-item">
              <span>{{allData.userPost.mediaPostPublic.counts && allData.userPost.mediaPostPublic.counts.likes?allData.userPost.mediaPostPublic.counts.likes:0}} Likes</span>
            </a>
            <a class="level-item">
              <span>{{allData.userPost.mediaPostPublic.counts && allData.userPost.mediaPostPublic.counts.shares?allData.userPost.mediaPostPublic.counts.shares:0}} Shares</span>
            </a>
            <a class="level-item">
              <span>{{allData.userPost.mediaPostPublic && allData.userPost.mediaPostPublic.comments?allData.userPost.mediaPostPublic.comments.length:0}} Comments</span>
            </a>
          </nav>
          <footer class="card-footer post-footer-buttons">
            <p class="buttons">
              <a class="button has-text-grey is-size-6-desktop is-size-7-tablet is-size-7-mobile">
                <span class="icon is-small">
                  <i class="fas fa-thumbs-up"></i>
                </span>
                <span>Like</span>
              </a>
              <a class="button has-text-grey is-size-6-desktop is-size-7-tablet is-size-7-mobile">
                <span class="icon">
                  <i class="far fa-comment-alt"></i>
                </span>
                <span>Comment</span>
              </a>
            </p>
          </footer>
          <div class="commentArea">
            <div class="card-content">
              <article class="comment media"
                       v-for="comment in allData.userPost.mediaPostPublic.comments"
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
  </section>
</template>

<script>
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'

export default {
  name: 'vkcontent',
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
        this.allData.userPost.mediaPostPublic.profiles[0] &&
        this.allData.userPost.mediaPostPublic.profiles[0].avatar
      return checkAvatar
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'styles.scss';
</style>
