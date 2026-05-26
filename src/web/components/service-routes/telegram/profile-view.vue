<template>
  <div class="container contentMain">
    <template v-if="checkUser">
      <template v-if="allData.serviceContent && allData.serviceContentLength > 0">
        <div class="columns is-multiline is-mobile is-gapless"
             style="height: 100%; margin-top: 0; margin-bottom: 0;">
          <div class="column is-3"
               style="min-height: 500px;">
            <div class="media-center is-spaced content">
              <figure class="image is-96x96 "
                      v-if="allData.currentUser.avatar">
                <img v-bind:src="allData.currentUser.avatar.url.small"
                     class="is-avatar xl author-image"
                     alt="Avatar">
              </figure>
              <figure class="image is-96x96"
                      v-else>
                <i class="fas fa-user-circle has-text-grey fa-6x"></i>
              </figure>
              <p class="title is-5">{{allData.currentUser.name}}</p>
              <p class="subtitle is-6">@{{allData.currentUser.username}}</p>
            </div>
          </div>

          <div class="column"
               style="overflow: auto;">
            <div class="card article"
                 v-for="post in allData.serviceContent"
                 :key="post.id"
                 @click="showContent(post)">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <span class="title is-7 article-title">{{post.title}} - </span>
                    <span class="subtitle is-7 article-subtitle tooltip"
                          :data-tooltip="formatDate(post.publishTime, 'utc-dtg')">
                      {{formatDate(post.publishTime, 'shortDate')}}
                    </span>
                  </div>
                </div>
                <div class="content article-body"
                     v-html="parseText(post.text)">
                </div>
                <div v-if="post.mediaFile"
                     class="card-image has-text-centered">
                  <figure v-if="typeof post.mediaFile.url == 'object'">
                    <img v-bind:src="post.mediaFile.url.small"
                         class="bannerImage showPointer"
                         @click="showContent(post)">
                  </figure>
                </div>
              </div>
              <div class="card-content">
                <nav class="level">
                  <div class="level-left">
                    <p class="subtitle is-7">{{post.counts ? post.counts.likes : ''}} Like<span>{{post.counts && post.counts.likes ? 's' : ''}}</span></p>

                  </div>
                  <div class="level-right">
                    <p class="subtitle is-7">{{post.comments ? post.comments.length : 0}} Comments<span>{{post.comments && post.comments.length > 0 ? 's' : ''}}</span></p>

                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div>
          <div class="card-content">
            <div class="card-header-title is-centered">
              <i class="fab fa-telegram fa-3x has-text-primary"></i>
            </div>
            <p class="title has-text-centered">
              No Posts Yet
            </p>
          </div>
        </div>
      </template>
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
  name: 'chatprofile',
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
</style>
