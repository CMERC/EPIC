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
        <div class="post-media column is-6-desktop is-12-tablet is-12-mobile">
          <div v-if="allData.userPost.mediaPostPublic.mediaFile && allData.userPost.mediaPostPublic.mediaFile.url">
            <figure v-if="ifImage(allData.userPost.mediaPostPublic.mediaFile.contentType)"
                    class="image is-square">
              <img class="content-image"
                   :src="allData.userPost.mediaPostPublic.mediaFile.url.regular"
                   alt="image">
            </figure>
            <video controls
                   v-else-if="ifVideo(allData.userPost.mediaPostPublic.mediaFile.contentType)"
                   :src="allData.userPost.mediaPostPublic.mediaFile.url.raw"></video>
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
          <div v-else>
            <figure class="image is-square">
              <img class="content-image"
                   src="../skeleton/static/images/not_available_light.svg"
                   alt="Not available">
            </figure>
          </div>
        </div>
        <div class="post-content column is-4-desktop ">
          <div class="is-spaced">
            <div class="card-content is-paddingless">
              <div class="media">
                <div class="media-left">
                  <figure v-if="checkAvatar">
                    <img v-bind:src="allData.userPost.mediaPostPublic.profiles[0].avatar.url.small"
                         alt="Avatar"
                         class="is-avatar sm">
                  </figure>
                  <figure class="image is-64x64"
                          v-else>
                    <span class="icon is-large">
                      <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                    </span>
                  </figure>
                </div>
                <div class="media-content">

                  <span class="title is-5">{{allData.userPost.mediaPostPublic.profiles[0].username}} </span>
                  <a @click="showProfile(allData.userPost.mediaPostPublic.profiles[0].username)">
                    <p class="is-size-7">@{{allData.userPost.mediaPostPublic.profiles[0].username}}</p>
                  </a>
                </div>
              </div>
            </div>
            <div class="content">
              <span class="is-7"
                    v-html="processPost(parseText(allData.userPost.mediaPostPublic.text), allData.userPost.mediaPostPublic.profiles[0].service, $router.currentRoute.params.workspace)"></span>
              <p class="title is-6">{{getPostCounts('likes')}} likes</p>
              <p class="subtitle is-7">
                <small class="time tooltip"
                       :data-tooltip="formatDate(allData.userPost.mediaPostPublic.publishTime, 'utc-dtg')">{{formatDate(allData.userPost.mediaPostPublic.publishTime, 'shortDate')}}</small>
              </p>
            </div>          
            <p class="subtitle is-7">
              <a>Log in</a> to like or comment.
            </p>
            
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
          </div>
        </div>
      </div>
      <div v-else>
        <div class="card-content">
          <div class="card-header-title is-centered">
            <i class="fab fa-vine fa-3x has-text-primary"></i>
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
  name: 'tiktokcontent',
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
  margin-top: 25px;
}
.list {
  border-bottom: 1px solid #efefef;
  margin-bottom: 15px;
}
@import 'styles.scss';

.commentArea {
  .card-content {
    padding: 0;
  }
  .comment {
    & + .comment {
      border-top: none;
    }
    &:not(:last-child) {
      margin: 0;
    }
    .card-image * {
      min-height: 128px;
      max-height: 128px;
      width: auto;
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
