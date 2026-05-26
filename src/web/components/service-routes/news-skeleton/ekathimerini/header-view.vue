<template>
  <div class="container serviceNav">
    <div class="columns is-mobile is-multiline">
      <div class="column is-12 is-paddingless">
        <div class="columns is-desktop">
          <div class="column is-italic is-size-7">
            <a class="link has-text-weight-semibold has-text-link">
              {{todayDate}}
            </a>
            <a class="link has-text-weight-semibold has-text-link">
              GREEK EDITION
            </a>
            <a class="link has-text-weight-semibold has-text-link">
              CLASSIFIEDS
            </a>
            <a class="link has-text-weight-semibold has-text-link">
              SUBSCRIPTIONS
            </a>

            <a class="link has-text-weight-semibold has-text-link">
              FAVORITES
            </a>
          </div>
          <div class="column is-narrow">
            <div class="field">
              <p class="control has-icons-right">
                <input class="input is-small"
                       type="text"
                       placeholder="Search">
                <span class="icon is-small is-right has-text-success">
                  <i class="fas fa-search fa-sm"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-12 bottomNav">
        <div class="columns is-desktop">
          <div class="column is-half">
            <a @click="$router.go(-1)">
              <img src='./static/images/logo.png'
                   alt="image">
            </a>
          </div>
          <div class="column is-hidden-touch"></div>
          <div class="column is-narrow is-hidden-touch">
            <img src='./static/images/smImage.png'
                 alt="image">
          </div>
        </div>

      </div>
      <div class="column is-12 is-paddingless">
        <nav class="navbar mainNav"
             role="navigation"
             aria-label="main navigation">
          <div class="navbar-brand">
            <a role="button"
               class="navbar-burger"
               aria-label="menu"
               aria-expanded="false"
               :class="{'is-active': mobileMenu}"
               @click="toggleMobileMenu()">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div class="navbar-menu"
               :class="{'is-active': mobileMenu}"
               @click="switchMobileMenu(false)">
            <div class="navbar-start">
              <a class="navbar-item is-size-7"
                 v-for="link in profileLinks"
                 v-bind:key="link.id">
                {{link.label}}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'
export default {
  name: 'ekathimeriniheader',
  mixins: [helpers],
  data() {
    return {
      mobileMenu: false,
      todayDate: '',
      profileLinks: [
        { id: 1, value: 'news', label: 'NEWS' },
        { id: 2, value: 'business', label: 'BUSINESS' },
        { id: 3, value: 'comment', label: 'COMMENT' },
        { id: 4, value: 'life', label: 'LIFE' },
        { id: 5, value: 'whatson', label: 'WHATS ON' },
        { id: 6, value: 'sports', label: 'SPORTS' },
        { id: 7, value: 'community', label: 'COMMUNITY' },
        { id: 8, value: 'survival', label: 'SURVIVAL' },
        { id: 9, value: 'specialreport', label: 'SPECIAL REPORT' },
        { id: 10, value: 'multimedia', label: 'MULTIMEDIA' }
      ]
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu
    },
    switchMobileMenu(display) {
      this.mobileMenu = display
    },
    getTodayDate() {
      this.todayDate = this.moment().format('dddd MMMM Do, YYYY')
    }
  },
  watch: {
    $route: 'getTodayDate'
  },
  created() {
    this.getTodayDate()
  }
}
</script>
<style lang="scss" scoped>
.control.has-icons-right {
  .icon.is-right svg {
    display: block;
  }
}
.serviceNav {
  height: 100px;
  .topNav {
    background: #fff;
    height: 20px;
    vertical-align: middle;
    font-family: 'Segoe UI', Arial, sans-serif;
    img {
      max-height: 25px;
    }
    .input {
      border: 1px solid #a8aeb7;
    }
  }
  .bottomNav {
    padding-bottom: 0;
  }
}
</style>
