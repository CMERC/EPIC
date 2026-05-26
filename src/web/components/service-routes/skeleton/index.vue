<template>
  <div>
    <component :is="getServiceHeader"
               v-bind:allData="allData" />
    <component :is="getProfileView"
               v-bind:allData="allData"
               v-if="allData.page!=='user'" />
    <users-view v-bind:allData="allData"
                v-if="allData.page==='user'" />
  </div>
</template>
<script>
import UsersView from './user-view.vue'
import ProfileView from './profile-view.vue'
import ContentView from './content-view.vue'
import HeaderView from './header-view.vue'
// facebook
import facebookcontent from '../facebook/content-view.vue'
import facebookprofile from '../facebook/profile-view.vue'
import facebookheader from '../facebook/header-view.vue'
// instagram
import instagramcontent from '../instagram/content-view.vue'
import instagramprofile from '../instagram/profile-view.vue'
import instagramheader from '../instagram/header-view.vue'
// twitter
import twittercontent from '../twitter/content-view.vue'
import twitterprofile from '../twitter/profile-view.vue'
import twitterheader from '../twitter/header-view.vue'
// youtube
import youtubecontent from '../youtube/content-view.vue'
import youtubeprofile from '../youtube/profile-view.vue'
import youtubeheader from '../youtube/header-view.vue'
// vk
import vkcontent from '../vk/content-view.vue'
import vkprofile from '../vk/profile-view.vue'
import vkheader from '../vk/header-view.vue'
// chat
import telegramcontent from '../telegram/content-view.vue'
import telegramprofile from '../telegram/profile-view.vue'
import telegramheader from '../telegram/header-view.vue'
// tiktok
import tiktokcontent from '../tiktok/content-view.vue'
import tiktokprofile from '../tiktok/profile-view.vue'
import tiktokheader from '../tiktok/header-view.vue'

import helpers from '@/shared/mixins/helpers'
export default {
  name: 'SkeletonIndex',
  mixins: [helpers],
  props: {
    tempUrl: {
      type: String,
      required: false
    },
    allData: {
      type: Object,
      required: true
    }
  },
  components: {
    'users-view': UsersView,
    ProfileView,
    ContentView,
    HeaderView,
    facebookprofile,
    facebookcontent,
    facebookheader,
    instagramcontent,
    instagramprofile,
    instagramheader,
    twittercontent,
    twitterprofile,
    twitterheader,
    youtubecontent,
    youtubeprofile,
    youtubeheader,
    vkcontent,
    vkprofile,
    vkheader,
    telegramcontent,
    telegramprofile,
    telegramheader,
    tiktokcontent,
    tiktokprofile,
    tiktokheader
  },
  data() {
    return {
      logoUrl: ''
    }
  },
  computed: {
    getServiceHeader() {
      if (this.$options.components[this.$route.params.service + 'header']) {
        return this.$route.params.service + 'header'
      } else {
        return 'HeaderView'
      }
    },
    getProfileView() {
      if (
        this.$options.components[this.$route.params.service + this.allData.page]
      ) {
        return this.$route.params.service + this.allData.page
      } else {
        if (this.allData.page === 'profile') {
          return 'ProfileView'
        }
        if (this.allData.page === 'content') {
          return 'ContentView'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/main.scss';
</style>
