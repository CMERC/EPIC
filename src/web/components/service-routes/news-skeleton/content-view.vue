<template>
  <div>
    <section class="panel"
             v-bind:class="getTheme()"
             v-cloak
             v-if="allData && allData.userPost.mediaPostPublic && allData.userPost.mediaPostPublic.profiles.length > 0">
      <link rel="stylesheet"
            id="google-font-open-css"
            href="https://fonts.googleapis.com/css?family=Oswald:400,700,300|PT+Serif:400,400italic,700,700italic|Roboto:400,700"
            type="text/css"
            media="all">
      <link rel="stylesheet"
            id="lovecraft-fonts-css"
            href="https://fonts.googleapis.com/css?family=Playfair+Display%3A400%2C700%2C400italic%7CLato%3A400%2C400italic%2C700%2C700italic%2C900%2C900italic&amp;subset=latin%2Clatin-ext&amp;ver=4.8.6"
            type="text/css"
            media="all">
      <div class="card-holder-panel">
        <div class="columns is-multiline"
             :style="'background-color:'+allData.userPost.mediaPostPublic.profiles[0].service.color">
          <div class="column is-12">
            <div class="service-card-header">
              <div class="panel service-panel"
                   v-if="allData.userPost">
                <a @click="$router.go(-1)">
                  <div class="service-logo"></div>
                  <div class="title is-1 service-title"
                       v-if="allData.userPost.mediaPostPublic"
                       :style="'color:'+allData.userPost.mediaPostPublic.profiles[0].service.color">
                    <span class="icon is-large"
                          v-if="allData.userPost.mediaPostPublic.profiles[0].service.icon">
                      <i :class="'fa-3x '+allData.userPost.mediaPostPublic.profiles[0].service.icon"></i>
                    </span>
                    <span class="icon is-large"
                          v-else>
                      <i class="fas fa-3x"></i>
                    </span>
                    {{allData.userPost.mediaPostPublic.profiles[0].service.displayName}}</div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-multiline is-centered">
          <div class="column is-half card-post-body"
               v-if="allData.userPost && allData.userPost.mediaPostPublic">
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
            <div class="card">
              <div class="card-content">
                <div class="has-text-weight-bold content-title-section has-text-centered">
                  <p class="title is-3"
                     v-if="allData.userPost.mediaPostPublic">
                    {{allData.userPost.mediaPostPublic.title}}
                  </p>
                  <p class="subtitle is-6"
                     v-if="allData.userPost.mediaPostPublic">
                    Posted By: <a @click="showProfile(allData.userPost.mediaPostPublic.profiles[0].username)">{{allData.userPost.mediaPostPublic.profiles[0].name}}</a>
                  </p>
                  <p class="subtitle is-7"
                     v-if="allData.currentUser.description">
                    {{allData.currentUser.description}}
                  </p>
                  <p v-if="allData.userPost.mediaPostPublic"
                     class="subtitle is-7 tooltip"
                     :data-tooltip="formatDate(allData.userPost.mediaPostPublic.publishTime, 'utc-dtg')">{{formatDate(allData.userPost.mediaPostPublic.publishTime, 'convertDate')}}</p>
                </div>
              </div>
              <div class="card-content"
                   v-if="allData.userPost.mediaPostPublic.mediaFile && allData.userPost.mediaPostPublic.mediaFile.url">
                <figure v-if="ifImage(allData.userPost.mediaPostPublic.mediaFile.contentType)"
                        class="image">
                  <img :src='allData.userPost.mediaPostPublic.mediaFile.url.small'
                       alt="image">
                </figure>
                <audio controls
                       v-else-if="ifAudio(allData.userPost.mediaPostPublic.mediaFile.contentType)">
                  <source :src="allData.userPost.mediaPostPublic.mediaFile.url.raw"
                          :type="allData.userPost.mediaPostPublic.mediaFile.contentType">
                </audio>
                <videoplayer v-else-if="ifVideo(allData.userPost.mediaPostPublic.mediaFile.contentType)"
                             :src="allData.userPost.mediaPostPublic.mediaFile.url.raw"></videoplayer>
                <a v-else
                   :href="allData.userPost.mediaPostPublic.mediaFile.url.raw">
                  File Link
                </a>
              </div>
              <div class="card-content">
                <div class="content"
                     v-html="parseText(allData.userPost.mediaPostPublic.text)"></div>
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
      </div>
    </section>
    <section v-else></section>
  </div>
</template>
<script>
import processText from '@/shared/mixins/processText'
import helpers from '@/shared/mixins/helpers'
export default {
  name: 'ContentView',
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
      this.$router.push({
        path: `/web/${this.$router.currentRoute.params.workspace}/${
          this.$router.currentRoute.params.service
        }/${profileName}`
      })
    },
    getTheme() {
      let className = this.$router.currentRoute.params.service
      return className
    }
  },

  beforeMount() {},
  beforeUpdate() {},
  created() {}
}
</script>
<style lang="scss" scoped>
@import 'styles/main.scss';

.estonia_now {
  @import 'styles/estonia_now/card-theme.scss';
}
.athens_news_agency {
  @import 'styles/athens_news_agency/card-theme.scss';
}
.crete_news_agency {
  @import 'styles/crete_news_agency/card-theme.scss';
}
.uma {
  @import 'styles/uma/card-theme.scss';
}
.eagle_club_air_soft_club {
  @import 'styles/eagle_club_air_soft_club/card-theme.scss';
}
.global_news_network {
  @import 'styles/global_news_network/card-theme.scss';
}
.murinus_times {
  @import 'styles/murinus_times/card-theme.scss';
}
.the_messenger {
  @import 'styles/the_messenger/card-theme.scss';
}
.farmers_for_the_motherland {
  @import 'styles/farmers_for_the_motherland/card-theme.scss';
}
.human_rights_watch {
  @import 'styles/human_rights_watch/card-theme.scss';
}
.latvian_news_outlet {
  @import 'styles/latvian_news_outlet/card-theme.scss';
}
.lrt {
  @import 'styles/lrt/card-theme.scss';
}
.unhcr {
  @import 'styles/unhcr/card-theme.scss';
}
</style>
