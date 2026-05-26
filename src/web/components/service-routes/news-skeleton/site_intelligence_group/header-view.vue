<template>
  <div class="container serviceNav">
    <div class="columns is-mobile is-multiline is-centered">
      <div class="column is-12 is-paddingless header">
        <div class="columns is-centered is-desktop">
          <div class="column">
            <img src='./static/images/logo.png'
                 alt="image">
          </div>
          <div class="column is-half is-italic is-size-7">
            <a class="link has-text-weight-semibold has-text-white">
              HOME
            </a>
            <a class="link has-text-weight-semibold has-text-white">
              SERVICES
            </a>
            <a class="link has-text-weight-semibold has-text-white">
              PRESS
            </a>
            <a class="link has-text-weight-semibold has-text-white">
              ABOUT SITE
            </a>
            <a class="link has-text-weight-semibold has-text-white">
              CONTACT US
            </a>
          </div>
          <div class="column is-narrow">
            <div class="field">
              <button class="button subscribe has-text-white">
                SUBSCRIBE
              </button>
              <button class="button login has-text-white">
                Log In
              </button>
            </div>
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
  name: 'siteheader',
  mixins: [helpers],
  data() {
    return {
      mobileMenu: false,
      todayDate: '',
      profileLinks: [
        { id: 1, value: 'Jihadist Threat', label: 'Jihadist Threat' },
        { id: 2, value: 'inSITE Reports', label: 'inSITE Reports' },
        { id: 3, value: 'Far-Right/Far-Left', label: 'Far-Right/Far-Left' },
        { id: 4, value: 'Dark Web & Cyber', label: 'Dark Web & Cyber' },
        { id: 5, value: 'SourceFeed', label: 'SourceFeed' },
        { id: 6, value: 'Guide Tracker', label: 'Guide Tracker' },
        { id: 7, value: 'Terrorism & Finance', label: 'Terrorism & Finance' },
        { id: 8, value: 'Energy & CI', label: 'Energy & CI' },
        { id: 9, value: 'inSITE Blog', label: 'inSITE Blog' }
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
  padding-left: 0 !important;
  padding-right: 0 !important;
  .header {
    background-color: purple;
  }
  .subscribe {
    background-color: mediumorchid;
    border: 1px solid white;
  }
  .login {
    background-color: purple;
    border: 1px solid white;
  }
  .bottomNav {
    padding-bottom: 0;
  }
}

@media screen and (min-width: 1024px) {
  .navbar-start {
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
