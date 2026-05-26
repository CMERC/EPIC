<template>
  <div class="container contentMain">
    <template v-if="checkUser">
      <section class="section">
        <div class="columns is-mobile is-centered">
          <div class="column is-narrow">
            <div v-if="checkAvatar">
              <figure class="image">
                <img v-bind:src="allData.currentUser.avatar.url.small"
                     alt="Avatar"
                     class="is-avatar xxl">
              </figure>
            </div>
            <div v-else>
              <figure class="image is-256x256">
                <i class="fas fa-user-circle has-text-grey fa-10x"></i>
              </figure>
            </div>
          </div>
          <div class="column">
            <div class="columns is-multiline is-mobile">
              <div class="column is-12-desktop is-12-mobile is-marginless">
                <div class="level">
                  <div class="level-left">
                    <h1 class="title">
                      {{allData.currentUser.profile.fullName}}
                    </h1>
                  </div>
                </div>
              </div>

              <div class="column is-12-desktop is-12-mobile is-marginless">
                <p v-if="allData.currentUser.profile">
                  @{{allData.currentUser.username}}
                </p>
              </div>
              <div class="column is-marginless">
                <div class="columns is-multiline is-0">
                  <div v-if="allData.currentUser.profile"
                       class="column is-narrow content-count">
                    <b>{{getProfileCounts('following')}}</b>&nbsp;Following
                  </div>
                  <div v-if="allData.currentUser.profile"
                       class="column is-narrow content-count">
                    <b>{{getProfileCounts('followers')}}</b>&nbsp;Followers
                  </div>
                  <div v-if="allData.serviceContent"
                       class="column is-narrow content-count">
                    <b>{{allData.serviceContentLength}}</b>&nbsp;Likes
                  </div>
                </div>
              </div>
              <div class="column is-12-desktop is-12-mobile is-marginless">
                <div v-if="allData.currentUser">
                  {{allData.currentUser.description}}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      <hr>
      <div class="columns is-multiline is-mobile is-gapless postArea"
           v-if="allData.serviceContent && allData.serviceContentLength > 0">
        <div class="column is-one-third"
             v-for="post in allData.serviceContent"
             :key="post.id"
             @click="showContent(post)">
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
          <div v-if="post.mediaFile !== null && post.mediaFile.url">
            <figure v-if="ifImage(post.mediaFile.contentType)"
                    class="image is-square">
              <img class="content-image"
                   :src="post.mediaFile.url.small"
                   alt="image">
            </figure>
            <videoplayer v-else-if="ifVideo(post.mediaFile.contentType)"
                         :src="post.mediaFile.url.raw"></videoplayer>
            <div></div>
          </div>
          <div v-else>
            <a @click="showContent(post)">
              <figure class="image is-square">
                <img class="content-image"
                     src="../skeleton/static/images/not_available_light.svg"
                     alt="Not available">
              </figure>
            </a>
          </div>
          <div v-html="checkVideo(post.text)"></div>
        </div>
      </div>
      <div v-else>
        <div>
          <div class="card-content">
            <div class="card-header-title is-centered">
              <i class="fab fa-vine fa-3x has-text-primary"></i>
            </div>
            <p class="title has-text-centered">
              No Posts Yet
            </p>
          </div>
        </div>
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
  </div>
</template>
<script>
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'
export default {
  name: 'tiktokprofile',
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
    checkUser() {
      return this.isCurrentUser(
        this.allData.currentUser.username,
        this.$router.currentRoute.params.username
      )
    },
    checkAvatar() {
      return this.isCurrentAvatar(this.allData)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'styles.scss';

.counts {
  display: none;
}
@media (hover: hover) {
  .postArea {
    & .column {
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
