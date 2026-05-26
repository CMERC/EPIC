<template>
  <div>
    <div v-if="!isCustomSite">
      <section>
        <users-view v-bind:allData="allData"
                    v-if="allData.page==='user'" />
        <profile-view v-bind:allData="allData"
                      v-if="allData.page==='profile'" />
        <content-view v-bind:allData="allData"
                      v-if="allData.page==='content'" />
      </section>
    </div>
    <div v-else>
      <section>
        <div>
          <component :is="getServiceHeader" />
          <component :is="getProfileView"
                     v-bind:allData="allData"
                     v-if="allData.page!=='user'" />
        </div>
      </section>
    </div>
  </div>
</template>
<script>
// Default new-sites
import UsersView from '../skeleton/user-view.vue'
import ContentView from './content-view.vue'
import ProfileView from './profile-view.vue'
// Custom sites
import ekathimerinicontent from './ekathimerini/content-view.vue'
import ekathimeriniprofile from './ekathimerini/profile-view.vue'
import ekathimeriniheader from './ekathimerini/header-view.vue'

import site_intelligence_groupcontent from './site_intelligence_group/content-view.vue'
import site_intelligence_groupprofile from './site_intelligence_group/profile-view.vue'
import site_intelligence_groupheader from './site_intelligence_group/header-view.vue'

import helpers from '@/shared/mixins/helpers'
export default {
  name: 'NewsSkeletonIndex',
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
  watch: {
    $route: 'checkSite'
  },
  components: {
    'users-view': UsersView,
    'content-view': ContentView,
    'profile-view': ProfileView,
    ekathimerinicontent,
    ekathimeriniprofile,
    ekathimeriniheader,
    site_intelligence_groupcontent,
    site_intelligence_groupprofile,
    site_intelligence_groupheader
  },
  data() {
    return {
      isCustomSite: false
    }
  },
  methods: {
    checkSite() {
      // This will eventually change to check against a list of custom sites
      switch (this.$router.currentRoute.params.service) {
        case 'ekathimerini': {
          this.isCustomSite = true
          break
        }
        case 'site_intelligence_group': {
          this.isCustomSite = true
          break
        }
        default: {
          this.isCustomSite = false
        }
      }
    }
  },
  created() {
    this.checkSite()
  },
  computed: {
    getServiceHeader() {
      if (this.$options.components[this.$route.params.service + 'header']) {
        return this.$route.params.service + 'header'
      }
    },
    getProfileView() {
      if (
        this.$options.components[this.$route.params.service + this.allData.page]
      ) {
        return this.$route.params.service + this.allData.page
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/main.scss';
</style>
