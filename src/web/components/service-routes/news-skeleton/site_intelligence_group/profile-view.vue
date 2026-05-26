<template>
  <section class="section">
    <div class="container">
      <div class="columns is-mobile">
        <div class="column is-10 is-offset-1">
          <div v-if="checkContent">
            <div class="columns is-mobile is-multiline">
              <div class="column is-3-desktop is-3-tablet is-12-mobile">
                <div class="card panel is-marginless">
                </div>
                <div class="card panel">
                  <aside class="menu">
                    <ul class="menu-list"
                        v-for="link in $options.commentLinks"
                        v-bind:key="link.id">
                      <li class="list-section">
                        <a class="is-size-7 has-text-black is-italic">{{link.label}}</a>
                      </li>
                    </ul>
                  </aside>
                </div>
              </div>
              <div class="column">
                <div class="columns is-multiline">
                  <div class="column is-4-desktop is-6-tablet is-12-mobile"
                       v-for="post in allData.serviceContent"
                       v-bind:key="post.id">
                    <div class="card panel">
                      <a @click="showContent(post)">
                        <div class="card-content">
                          <div class="media">
                            <div class="media-content">
                              <p class="title is-5">{{post.title}}</p>
                              <span class="subtitle is-7 tooltip"
                                    v-if="post.publishTime"
                                    :data-tooltip="formatDate(post.publishTime, 'utc-dtg')">{{formatDate(post.publishTime, 'shortDate')}}</span>
                            </div>
                          </div>
                          <div class="content imageArea"
                               v-if="post.mediaFile && post.mediaFile.url">
                            <img :src="post.mediaFile.url.regular"
                                 alt="image"
                                 v-if="ifImage(post.mediaFile.contentType)">
                            <div class="card-content"
                                 v-else-if="ifAudio(post.mediaFile.contentType)">
                              <div class="columns is-centered">
                                <div class="column is-half">
                                  <audio controls>
                                    <source :src="post.mediaFile.url.raw"
                                            :type="post.mediaFile.contentType">
                                  </audio>
                                </div>
                              </div>
                            </div>
                            <videoplayer v-else-if="ifVideo(post.mediaFile.contentType)"
                                         :src="post.mediaFile.url.raw"></videoplayer>
                            <a v-else
                               :href="post.mediaFile.url.raw">
                              File Link
                            </a>
                          </div>
                          <div class="content">
                            <p class="subtitle is-6"
                               v-html="truncate(processPost(post.text, post.profiles[0].service), 100)"></p>
                          </div>
                          <nav class="level">
                            <div class="level-left">
                              <p class="subtitle is-7">{{post.counts ? post.counts.likes : ''}} Like<span>{{post.counts && post.counts.likes ? 's' : ''}}</span></p>

                            </div>
                            <div class="level-right">
                              <p class="subtitle is-7">{{post.comments ? post.comments.length : 0}} Comments<span>{{post.comments && post.comments.length > 0 ? 's' : ''}}</span></p>

                            </div>
                          </nav>
                        </div>
                      </a>
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
                  <i class="fas fa-search fa-3x has-text-primary"></i>
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
  </section>
</template>
<script>
import processText from '@/shared/mixins/processText'
import helpers from '@/shared/mixins/helpers'
export default {
  commentLinks: [
    { id: 1, value: 'comment1', label: 'Jihadist News' },
    { id: 2, value: 'comment2', label: 'Southeast Asia' },
    { id: 3, value: 'comment3', label: 'Western Jihadists' },
    { id: 4, value: 'comment4', label: 'Military Manuals & Training' },
    { id: 5, value: 'comment5', label: 'Software & Tech Materials' },
    { id: 6, value: 'comment6', label: 'Articles and Analysis' },
    { id: 7, value: 'comment7', label: 'Periodicals' },
    { id: 8, value: 'comment8', label: 'Individuals' },
    { id: 9, value: 'comment9', label: 'Groups' },
    { id: 10, value: 'comment10', label: 'Media Groups' },
    { id: 11, value: 'comment11', label: 'Countries' },
    { id: 12, value: 'comment12', label: 'Browse All' },
    { id: 13, value: 'comment13', label: 'Search' }
  ],
  name: 'siteprofile',
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
      ranNum: null,
      ranNum1: null
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
    setRandoms() {
      let maxNum = this.allData.serviceContentLength - 1
      let minStat = 1
      if (maxNum === 0) {
        this.ranNum = maxNum
        this.ranNum1 = maxNum
      } else {
        this.ranNum = this.randomMediaStatNumber(minStat, maxNum)
        this.ranNum1 = this.randomMediaStatNumber(minStat, maxNum)
      }
    }
  },
  computed: {
    checkUser() {
      return this.isCurrentUser(
        this.allData.currentUser.username,
        this.$router.currentRoute.params.username
      )
    },
    checkContent() {
      let theContent =
        this.allData.serviceContent && this.allData.serviceContentLength > 0
      if (theContent) {
        this.setRandoms()
      }

      return theContent
    }
  }
}
</script>
<!-- use to style content outside component -->

<style lang="scss" scoped>
@import 'card-theme.scss';
</style>
