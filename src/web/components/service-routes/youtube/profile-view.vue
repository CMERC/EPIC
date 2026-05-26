<template>
  <div class="container is-fullwidth">
    <div class="columns is-mobile">
      <div class="column is-narrow">
        <div class="profile-left-nav">
          <nav :activeIndex="path"
               @select="onSelect">
            <ul class="bd-anchors-list">
              <li>
                <span class="icon is-small">
                  <i class="fas fa-home has-text-grey"></i>
                </span>Home</li>
              <li>
                <span class="icon is-small">
                  <i class="fas fa-fire has-text-grey"></i>
                </span>Trending</li>
              <li>
                <span class="icon is-small">
                  <i class="fab fa-youtube has-text-grey"></i>
                </span>Subscriptions</li>
              <li>
                <span class="icon is-small">
                  <i class="fab fa-youtube has-text-grey"></i>
                </span>Originals</li>
            </ul>
          </nav>
          <p class="bd-anchors-title">
            Library
          </p>
          <nav :activeIndex="path"
               @select="onSelect">
            <ul class="bd-anchors-list">
              <li>
                <span class="icon is-small">
                  <i class="fas fa-history has-text-grey"></i>
                </span>History</li>
              <li>
                <span class="icon is-small">
                  <i class="fas fa-clock has-text-grey"></i>
                </span>Watcher Later</li>
              <li>
                <span class="icon is-small">
                  <i class="fas fa-tag has-text-grey"></i>
                </span>Purchases</li>
              <li>
                <span class="icon is-small">
                  <i class="fas fa-thumbs-up has-text-grey"></i>
                </span>Liked Videos</li>
            </ul>
          </nav>
          <p class="bd-anchors-title">
            Subscriptions
          </p>
          <nav>
            <ul class="bd-anchors-list">
              <li>
                <span><img src="https://source.unsplash.com/random/250x250/?people"
                           class="is-avatar sm" /></span>Sigmund Stanton</li>
              <li>
                <span><img src="https://source.unsplash.com/random/250x250/?nature"
                           class="is-avatar sm" /></span>Darwin Malkowski</li>
              <li>
                <span><img src="https://source.unsplash.com/random/250x250/?bear"
                           class="is-avatar sm" /></span>Luke Dorsey</li>
              <li>
                <span><img src="https://source.unsplash.com/random/250x250/?city"
                           class="is-avatar sm" /></span>Heinrich Starkweather</li>
              <li>
                <span><img src="https://source.unsplash.com/random/250x250/?beach"
                           class="is-avatar sm" /></span>Sgt. Douglas Pickman</li>
              <li>
                <span><img src="https://source.unsplash.com/random/250x250/?water"
                           class="is-avatar sm" /></span>Dwight Woodville</li>
              <li>
                <span><img src="https://source.unsplash.com/random/250x250/?dog"
                           class="is-avatar sm" /></span>Orson Herrick</li>
              <li>
                <span> <img src="https://source.unsplash.com/random/250x250/?forest"
                            class="is-avatar sm" /></span>Philip Godwin</li>
              <li>
                <span><img src="https://source.unsplash.com/random/250x250/?movie"
                           class="is-avatar sm" /></span>Glenn Wyman</li>
              <li>
                <span> <img src="https://source.unsplash.com/random/250x250/?music"
                            class="is-avatar sm" /></span>Lyman Upton</li>
            </ul>
          </nav>
          <p class="bd-anchors-title">
            More From YouTube
          </p>
          <nav :activeIndex="path"
               @select="onSelect">
            <ul class="bd-anchors-list">
              <li>
                <span class="icon is-small">
                  <i class="fas fa-film has-text-grey"></i>
                </span>Movies &amp; Shows</li>
              <li>
                <span class="icon is-small">
                  <i class="fas fa-broadcast-tower has-text-grey"></i>
                </span>Live</li>
              <li>
                <span class="icon is-small">
                  <i class="fas fa-cog has-text-grey"></i>
                </span>Settings</li>
              <li>
                <span class="icon is-small">
                  <i class="fas fa-flag has-text-grey"></i>
                </span>Report History</li>
              <li>
                <span class="icon is-small">
                  <i class="fas fa-question-circle has-text-grey"></i>
                </span>Help</li>
              <li>
                <span class="icon is-small">
                  <i class="fas fa-comment-alt has-text-grey"></i>
                </span>Send Feedback</li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="column">
        <div class="columns">
          <div class="column is-12">
            <div class="columns profile-banner">
              <div class="column is-12">
                <figure class="image is-3by1">
                  <img v-bind:src="allData.currentUser.banner.mediaFile.url.regular"
                       alt="profile Banner"
                       v-if="checkBanner">
                </figure>
              </div>
            </div>
            <div class="columns is-mobile">
              <div class="column is-8 is-paddingless">
                <div class="columns">
                  <div class="column is-narrow">
                    <figure class="image is-64x64"
                            v-if="checkAvatar">
                      <img v-bind:src="allData.currentUser.avatar.url.small"
                           class="is-avatar lg">
                    </figure>
                    <figure class="image is-64x64"
                            v-else>
                      <i class="fas fa-user-circle has-text-grey fa-4x"></i>
                    </figure>
                  </div>
                  <div class="column">
                    <h6>
                      <b>{{allData.currentUser.name}}</b>
                    </h6>
                    <span>{{getProfileCounts('followers')}} subscribers</span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <a class="button is-danger">
                  Subscribe
                </a>
              </div>
            </div>

            <div class="columns is-mobile">
              <div class="column is-12 profile-posts">
                <b-tabs>
                  <b-tab-item label="Home">
                    <div class="columns is-multiline is-mobile postArea">
                      <div class="column is-2-desktop is-4-tablet is-4-mobile"
                           :key="post.id"
                           v-for="post in allData.serviceContent">
                        <div class="card"
                             @click="showContent(post)">
                          <div class="card-image has-text-centered"
                               v-if="post.mediaFile && post.mediaFile.url">
                            <div class="counts">
                              <span class="icon">
                                <i class="fas fa-heart"></i>
                              </span>
                              <span>{{post.counts && post.counts.likes?post.counts.likes:0}} </span>
                              <span class="icon">
                                <i class="fas fa-comment"></i>
                              </span>
                              <span>{{post && post.comments?post.comments.length:0}}</span>
                            </div>
                            <figure v-if="ifImage(post.mediaFile.contentType)"
                                    class="image is-4by3">
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
                          <figure class="image"
                                  v-else>
                            <img src="../skeleton/static/images/not_available_youtube.svg"
                                 alt="Not available">
                          </figure>
                          <div class="media-content">
                            <p class="title is-6">{{post.title}}</p>
                            <p class="subtitle is-6">{{allData.currentUser.username}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </b-tab-item>

                  <b-tab-item label="Videos">
                    <nav class="level">
                      <div class="level-left">
                        <div class="level-item">
                          <b-dropdown>
                            <a class="link"
                               slot="trigger">
                              <span>Uploads</span>
                              <span class="icon">
                                <i class="fas fa-chevron-down has-text-grey"></i>
                              </span>
                            </a>

                            <b-dropdown-item>All videos</b-dropdown-item>
                            <b-dropdown-item>Uploads</b-dropdown-item>
                            <b-dropdown-item>Liked videos</b-dropdown-item>
                          </b-dropdown>
                          <div class="level-item">
                            <a class="link has-text-grey">
                              PLAY ALL
                            </a>
                          </div>
                        </div>
                      </div>
                    </nav>
                    <div class="columns is-multiline is-mobile">
                      <div class="column is-2-desktop is-4-tablet is-4-mobile"
                           :key="post.id"
                           v-for="post in allData.serviceContent">
                        <div class="card"
                             @click="showContent(post)">
                          <div class="card-image has-text-centered"
                               v-if="post.mediaFile && post.mediaFile.url">
                            <figure v-if="ifImage(post.mediaFile.contentType)"
                                    class="image is-4by3">
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
                            <div class="media-content">
                              <p class="title is-6">{{post.title}}</p>
                              <p class="subtitle is-6">{{allData.currentUser.username}}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </b-tab-item>

                  <b-tab-item label="Playlists">
                    <p class="title is-5">Saved playlists</p>
                  </b-tab-item>

                  <b-tab-item label="Channels">
                    <p class="title is-5">Channels</p>
                  </b-tab-item>

                  <b-tab-item label="Discussion">
                    <p class="title is-5">Discussion</p>
                  </b-tab-item>

                  <b-tab-item label="About">
                    <p class="title is-5">Description</p>
                    <span v-html="allData.currentUser.description"></span>
                  </b-tab-item>
                </b-tabs>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'

import processText from '@/shared/mixins/processText'
export default {
  name: 'youtubeprofile',
  mixins: [helpers, processText],
  props: {
    allData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      path: 'dashboard'
    }
  },
  methods: {
    onSelect(index) {
      this.path = index
    },
    chooseVideo(video) {
      // SET VIDEO AS ACTIVE VIDEO
      this.activeVideo = video
      // INCREASE THE VIDEOS VIEWS BY 1
      video.views += 1
    },
    showContent(post) {
      let service = this.$router.currentRoute.params.service
      let username = this.$router.currentRoute.params.username
      let workspace = this.$router.currentRoute.params.workspace
      this.$router.push({
        path: `/web/${workspace}/${service}/${username}/${post.id}`
      })
    },
    getProfileCounts(key) {
      let value = 0
      if (
        this.allData.currentUser.profile &&
        this.allData.currentUser.profile.counts &&
        this.allData.currentUser.profile.counts[key]
      ) {
        value = this.allData.currentUser.profile.counts[key]
      }
      return value
    }
  },
  computed: {
    checkBanner() {
      let checkBanner =
        this.allData.currentUser.banner &&
        this.allData.currentUser.banner.mediaFile !== null &&
        this.allData.currentUser.banner.mediaFile.url &&
        this.allData.currentUser.banner.mediaFile.url.regular

      return checkBanner
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
<style lang="scss" scoped>
@import 'styles.scss';
.container {
  margin: 0 1.5rem;
  max-width: 100%;
  width: 100%;
}
nav ul.bd-anchors-list {
  border-bottom: 1px solid #8080801a;
  margin: 15px 0;
  & li:last-child {
    padding-bottom: 15px;
  }
  & li span {
    margin-right: 25px;
  }
}

.counts {
  display: none;
}
@media (hover: hover) {
  .postArea {
    & .card-image {
      position: relative;
      &:hover {
        & > .counts {
          background-color: rgba(0, 0, 0, 0.3);
          position: absolute;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          color: #fff;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          font-size: 16px;
          font-weight: 600;
          height: 100%;
          -webkit-box-pack: center;
          -webkit-justify-content: center;
          -ms-flex-pack: center;
          justify-content: center;
          width: 100%;
          z-index: 25;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
