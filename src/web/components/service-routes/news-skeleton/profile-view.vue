<template>
  <section v-bind:class="getTheme()">
    <template v-if="allData.currentUser && allData.currentUser.service"
              v-cloak>
      <div class="card-holder-panel">
        <div class="columns is-mobile"
             :style="'background-color:'+allData.currentUser.service.color">
          <div class="column is-12">
            <div class="service-card-header">
              <section v-if="allData.currentUser && allData.currentUser.service">
                <a @click="$router.go(-1)">
                  <div class="service-logo"></div>
                  <div class="title is-1 service-title"
                       :style="'color:'+allData.currentUser.service.color">
                    <span class="icon is-large"
                          v-if="allData.currentUser.service.icon">
                      <i :class="'fa-3x '+allData.currentUser.service.icon"></i>
                    </span>
                    <span class="icon is-large"
                          v-else>
                      <i class="fas fa-3x"></i>
                    </span>
                    {{allData.currentUser.service.displayName}}</div>
                </a>
              </section>
            </div>
            <section class="banner-row">
              <div class="column">
                <div class="service-banner"></div>
              </div>
            </section>
          </div>
        </div>

        <div class="columns card-body">
          <div class="column is-9">
            <div class="card"
                 v-for="post in allData.serviceContent"
                 :key="post.id">
              <div class="card-content">
                <div class="columns">
                  <div class="column is-3 service-media-container">
                    <div class="service-post-media"
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
                  </div>
                  <div class="column is-8">
                    <div class="content service-post-content">
                      <p class="title is-3 is-marginless">{{post.title}}</p>
                      <p class="subtitle is-6 is-marginless">By: {{allData.currentUser.name}}</p>
                      <p class="subtitle is-6 tooltip"
                         :data-tooltip="formatDate(post.publishTime, 'utc-dtg')">{{formatDate(post.publishTime, 'convertDate')}}</p>
                      <div class="service-font"
                           v-html="truncate(processPost(post.text, post.profiles[0].service), 500)"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-content">
                <span class="subtitle is-7 mr-1">{{post.counts ? post.counts.likes : ''}} Like<span>{{post.counts && post.counts.likes ? 's' : ''}}</span></span>
                <span class="subtitle is-7">{{post.comments ? post.comments.length : 0}} Comments<span>{{post.comments && post.comments.length > 0 ? 's' : ''}}</span></span>
                <button class="button is-link is-pulled-right"
                        @click="showContent(post)">
                  Read More
                </button>
              </div>
            </div>
          </div>
          <div class="column is-3 is-hidden-mobile right-nav-container">
            <div class="card">
              <div class="right-nav">
                <section class="u-text-center right-nav-panel">
                  <div class="right-nav-content-search">
                    <div class="field has-addons">
                      <div class="control">
                        <input class="input"
                               type="text"
                               placeholder="Search...">
                      </div>
                      <div class="control">
                        <a class="button is-link">
                          Search
                        </a>
                      </div>
                    </div>
                  </div>
                  <hr>
                  <div class="right-nav-content-posts">
                    <p class="subtitle is-6">
                      <b>Recent Posts</b>
                    </p>
                    <div class="recent-post-content">
                      <ul class="bd-anchors-list">
                        <li v-for="post in allData.serviceContent"
                            :key="post.id">
                          <a class="link post-title "
                             @click="showContent(post)">{{post.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <hr>
                  <div class="right-nav-content-comments">
                    <p class="subtitle is-6">
                      <b>Recent Comments</b>
                    </p>
                  </div>
                  <hr>
                  <div class="right-nav-content-archives">
                    <p class="subtitle is-6">
                      <b>Archives</b>
                    </p>
                    <div class="archive-content">
                      <ul class="bd-anchors-list">
                        <li v-for="post in allData.serviceContent"
                            :key="post.id">
                          <a class="link archive-title"
                             @click="showContent(post)">{{post.title}}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="service-footer">
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
  </section>
</template>

<script>
import processText from '@/shared/mixins/processText'
import helpers from '@/shared/mixins/helpers'
export default {
  name: 'ProfileView',
  mixins: [helpers, processText],
  props: {
    allData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      vidObj: null
    }
  },
  methods: {
    showContent(post) {
      let service = this.$router.currentRoute.params.service
      let username = this.$router.currentRoute.params.username
      let workspace = this.$router.currentRoute.params.workspace
      this.$router.push({
        path: `/web/${workspace}/${service}/${username}/${post.id}`
      })
    },
    getTheme() {
      let className = this.$router.currentRoute.params.service
      return className
    }
  }
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
