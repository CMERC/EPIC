<template>
  <div class="profile-container">
    <template v-if="allData.currentUser && allData.currentUser.service">
      <section class="hero is-medium is-bold"
               :style="'background-color:'+allData.currentUser.service.color">
        <div class="hero-body">
          <div class="container has-text-centered">
          </div>
        </div>
      </section>
      <div class="profiles-body"
           v-if="allData.serviceContent != ''">
        <div class="profile-posts">
          <section title="Posts"
                   class="articles">
            <div class="column is-8 is-offset-2">
              <div class="card article"
                   v-for="post in allData.serviceContent"
                   :key="post.id">
                <div class="card-content"
                     v-if="post.profiles">
                  <div @click="showContent(post)">
                    <div class="media">
                      <div class="media-center"
                           v-if="post.profiles[0].avatar">
                        <img v-bind:src="post.profiles[0].avatar.url.small"
                             class="author-image"
                             alt="Placeholder image"
                             @click="showContent(post)">
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
                    </div>
                    <div class="media-content has-text-centered">
                      <h2 class="has-text-centered article-title">
                        {{post.title}}
                      </h2>
                      <span class="subtitle is-7">
                        @{{post.profiles[0].username}}
                      </span>
                      <span class="subtitle is-7 tooltip"
                            :data-tooltip="formatDate(post.publishTime, 'utc-dtg')">{{formatDate(post.publishTime, 'convertDate')}}</span>
                    </div>
                    <div class="content">
                      <p class="article-copy"
                         v-html="truncate(processPost(post.text, post.profiles[0].service), 280)"></p>
                    </div>
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
          </section>
        </div>
      </div>
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
import processText from '@/shared/mixins/processText'
import helpers from '@/shared/mixins/helpers'
export default {
  name: 'skeleton-profile',
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
    showContent(post) {
      let workspace = this.$router.currentRoute.params.workspace
      let service = this.$router.currentRoute.params.service
      let username = this.$router.currentRoute.params.username
      this.$router.push({
        path: `/web/${workspace}/${service}/${username}/${post.id}`
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
.showPointer {
  cursor: pointer;
}
.bannerImage {
  height: 450px;
  width: 100%;
  object-fit: cover;
}
div.card.article {
  cursor: pointer;
}
</style>
