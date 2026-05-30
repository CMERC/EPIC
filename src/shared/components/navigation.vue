<template>
  <nav class="navbar is-fixed-top"
       role="navigation"
       aria-label="main navigation"
       :class="selectedArea">
    <div class="navbar-brand">
      <launcher :area='area' />
      <router-link class="navbar-item logo-container"
                   :to="{name:'main-home'}"
                   exact
                   v-if="area == 'base'">
        <img src="../assets/logo-white.svg"
             alt="EPIC Ready">
        <div class="epiclogo light">
          EPIC
        </div>
      </router-link>
      <router-link class="navbar-item logo-container"
                   :to="{name: 'media-home'}"
                   exact
                   v-if="isSuperAdminEditor && area == 'media'">
        <img src="../assets/media.svg"
             alt="EPIC Media">
        <div class="epiclogo light">
          Media
        </div>
      </router-link>
      <router-link class="navbar-item logo-container"
                   :to="{name: 'plan-home'}"
                   exact
                   v-if="isSuperAdminEditor && area == 'plan'">
        <img src="../assets/plan.svg"
             alt="EPIC Plan">
        <div class="epiclogo light">
          Plan
        </div>
      </router-link>
      <router-link class="navbar-item logo-container"
                   :to="{name: 'notebook-home'}"
                   exact
                   v-if="isSuperAdminEditor && area == 'note'">
        <img src="../assets/notebook.svg"
             alt="EPIC Note">
        <div class="epiclogo light">
          Notebook
        </div>
      </router-link>
      <router-link class="navbar-item logo-container"
                   :to="{name: 'dev-home'}"
                   exact
                   v-if="isSuper && area == 'dev'">
        <img src="../assets/dev.svg"
             alt="EPIC Developer">
        <div class="epiclogo light">
          Developer
        </div>
      </router-link>
      <router-link class="navbar-item logo-container"
                   :to="{name: 'settings-home'}"
                   exact
                   v-if="area == 'settings'">
        <img src="../assets/settings.svg"
             alt="EPIC Settings">
        <div class="epiclogo light">
          Settings
        </div>
      </router-link>
      <router-link class="is-hidden-mobile navbar-item logo-container"
                   :to="{name: 'observe-home'}"
                   exact
                   v-if="isSuper && area == 'observe'">
        <img src="../assets/observe.svg"
             alt="EPIC Observe">
        <div class="epiclogo dark">
          Observe
        </div>
      </router-link>
      <router-link class="navbar-item logo-container"
                   :to="{name: 'activity-home'}"
                   exact
                   v-if="isSuperAdminEditor && area == 'activity'">
        <img src="../assets/activity.svg"
             alt="EPIC Activity">
        <div class="epiclogo dark">
          Activity
        </div>
      </router-link>
      <router-link class="navbar-item logo-container"
                   :to="{name: 'map-home'}"
                   exact
                   v-if="isSuperAdminEditor && area == 'map'">
        <img src="../assets/map.svg"
             alt="EPIC Map">
        <div class="epiclogo light">
          Map
        </div>
      </router-link>
      <router-link class="navbar-item logo-container"
                   :to="{name: 'email-home'}"
                   exact
                   v-if="isUserOrAbove && area == 'email'">
        <img src="../assets/email.svg"
             alt="EPIC Email">
        <div class="epiclogo light">
          Email
        </div>
      </router-link>
      <router-link class="navbar-item logo-container"
                   :to="{name: 'chat-home'}"
                   exact
                   v-if="isUserOrAbove && area == 'chat'">
        <img src="../assets/chat.svg"
             alt="EPIC Map">
        <div class="epiclogo light">
          Chat
        </div>
      </router-link>
      <router-link class="is-hidden-mobile navbar-item logo-container"
                   :to="'/web/'+displayWorkspace.name"
                   exact
                   v-if="area == 'web'">
        <img src="../assets/web.svg"
             alt="EPIC Web">
        <div class="epiclogo dark">
          Web
        </div>
      </router-link>

      <router-link class="navbar-item logo-container"
                   :to="{name: 'learn-home'}"
                   exact
                   v-if="isUserOrAbove && area == 'learn'">
        <img src="../assets/learn.svg"
             alt="EPIC Learn">
        <div class="epiclogo light">
          Learn
        </div>
      </router-link>

      <router-link class="navbar-item logo-container"
                   :to="{name: 'resources-home'}"
                   exact
                   v-if="isUserOrAbove && area == 'resources'">
        <img src="../assets/resources.svg"
             alt="EPIC Resources">
        <div class="epiclogo light">
          Resources
        </div>
      </router-link>

      <router-link class="navbar-item logo-container"
                   :to="{name: 'command-home'}"
                   exact
                   v-if="isUserOrAbove && area == 'command'">
        <img src="../assets/command.svg"
             alt="EPIC cCmmand">
        <div class="epiclogo light">
          Command
        </div>
      </router-link>

      <button class="navbar-item theme-toggle is-hidden-desktop"
              type="button"
              :title="theme.dark ? 'Switch to light mode' : 'Switch to dark mode'"
              :aria-label="theme.dark ? 'Switch to light mode' : 'Switch to dark mode'"
              @click="toggleThemeMode">
        <span class="theme-toggle-symbol"
              aria-hidden="true">
          <i :class="theme.dark ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </span>
      </button>

      <template v-if="area=='web' || area=='observe'">
        <div class="navbar-item">
          <div class="searchField field is-grouped">
            <p class="control has-icons-left has-icons-right">
              <input class="input"
                     type="text"
                     placeholder="Search..."
                     v-model.lazy="searchQuery">
              <span class="icon is-small is-left">
                <i class="fas fa-search"></i>
              </span>
              <span class="icon is-small is-right"
                    @click="searchQuery = ''">
                <i class="fas fa-times-circle"></i>
              </span>
            </p>
          </div>
        </div>
        <a role="button"
           class="navbar-burger burger has-text-black is-large"
           :class="{'is-active': mobileMenu}"
           @click="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </a>
      </template>
      <a role="button"
         class="navbar-burger burger has-text-white is-large"
         :class="{'is-active': mobileMenu}"
         @click="toggleMobileMenu()"
         v-else>
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>
    <NoWorkspaceModal :email="user.email"
                      v-if="showNoWorkspaceDialog && user" />
    <div class="navbar-menu"
         :class="{'is-active': mobileMenu}">
      <div class="navbar-start"
           v-if="area == 'plan' && isSuperAdminEditor">

        <dropdown class="navbar-item has-dropdown">
          <template slot="header">
            <router-link :to="{name: 'prepare-home'}"
                         class="navbar-link"
                         event="">
              <span class="icon is-medium">
                <i class="fas fa-tasks fa-lg"></i>
              </span>
              <span>Prepare</span>
            </router-link>
          </template>
          <div class="navbar-dropdown">
            <router-link :to="{name: 'prepare-dash'}"
                         class="navbar-item">
              Dashboard
            </router-link>
            <router-link :to="{name: 'exercise-details'}"
                         class="navbar-item">
              Exercise Details
            </router-link>
            <router-link :to="{name: 'participants'}"
                         class="navbar-item">
              Participants
            </router-link>
            <router-link :to="{name: 'objectives-list'}"
                         class="navbar-item">
              Training Objectives
            </router-link>
            <router-link :to="{name: 'events-cards'}"
                         class="navbar-item">
              Events
            </router-link>
            <hr class="navbar-divider">
            <p class="menu-label">MSEL</p>
            <router-link :to="{name: 'injects-list'}"
                         class="navbar-item">
              List
            </router-link>
            <router-link :to="{name: 'injects-board'}"
                         class="navbar-item">
              Board
            </router-link>
            <router-link :to="{name: 'injects-calendar'}"
                         class="navbar-item">
              Calendar
            </router-link>
          </div>
        </dropdown>

        <dropdown class="navbar-item has-dropdown">
          <template slot="header">
            <router-link :to="{name: 'train-home'}"
                         class="navbar-link"
                         event="">
              <span class="icon is-medium">
                <i class="fas fa-stopwatch fa-lg"></i>
              </span>
              <span>Train</span>
            </router-link>
          </template>
          <div class="navbar-dropdown">
            <router-link :to="{name: 'train-dash'}"
                         class="navbar-item">
              Dashboard
            </router-link>
            <hr class="navbar-divider">
            <p class="menu-label">MSEL</p>
            <router-link :to="{name: 'msel-timeline', query: {event: '',b: 'Tracking'}}"
                         class="navbar-item">
              Timeline
            </router-link>
            <router-link :to="{name: 'msel-tracker', query: {b: 'Tracking'}}"
                         class="navbar-item">
              Tracker
            </router-link>
            <!-- <router-link to="/plan/train/objective-status" class="navbar-item">Objective Status</router-link> -->
          </div>
        </dropdown>

        <dropdown class="navbar-item has-dropdown">
          <template slot="header">
            <router-link :to="{name: 'assessment-home'}"
                         class="navbar-link"
                         event="">
              <span class="icon is-medium">
                <i class="fas fa-clipboard-check fa-lg"></i>
              </span>
              <span>Assess</span>
            </router-link>
          </template>
          <div class="navbar-dropdown">
            <router-link :to="{name: 'overview'}"
                         class="navbar-item">
              Overview
            </router-link>
            <router-link :to="{name: 'collect'}"
                         class="navbar-item"
                         v-if="isSuper">
              Collect
            </router-link>
            <router-link :to="{name: 'assess-list'}"
                         class="navbar-item">
              Assess List
            </router-link>
            <router-link :to="{name: 'feedbacks'}"
                         class="navbar-item">
              Feedback
            </router-link>
          </div>
        </dropdown>

        <dropdown class="navbar-item has-dropdown">
          <template slot="header">
            <router-link :to="{name: 'reports-home'}"
                         class="navbar-link"
                         event="">
              <span class="icon is-medium">
                <i class="fas fa-chart-bar fa-lg"></i>
              </span>
              <span>Reports</span>
            </router-link>
          </template>
          <div class="navbar-dropdown">
            <router-link :to="{name: 'reportsList'}"
                         class="navbar-item">
              Custom
            </router-link>
            <router-link :to="{name: 'planAnalytics'}"
                         class="navbar-item">
              Analytics
            </router-link>
            <router-link :to="{name: 'planAnalyticsExport'}"
                         class="navbar-item"
                         v-if="isSuper">
              Export
            </router-link>
          </div>
        </dropdown>
      </div>
      <div class="navbar-start"
           v-if="area == 'media' && isSuperAdminEditor">

        <dropdown class="navbar-item has-dropdown">
          <template slot="header">
            <router-link :to="{name: 'posts'}"
                         class="navbar-link"
                         event="">
              <span class="icon is-medium">
                <i class="fas fa-comment-dots fa-lg"></i>
              </span>
              <span>Posts</span>
            </router-link>
          </template>
          <div class="navbar-dropdown">
            <router-link :to="{name: 'posts-filter', params: {requestedFilter: 'all'}}"
                         class="navbar-item">
              View
            </router-link>
            <router-link :to="{name: 'post-calendar'}"
                         class="navbar-item">
              Calendar
            </router-link>
            <router-link :to="{name: 'analytics'}"
                         class="navbar-item">
              Analytics
            </router-link>
            <router-link :to="{name: 'noise'}"
                         class="navbar-item">
              Noise
            </router-link>
          </div>
        </dropdown>
        <router-link :to="{name: 'profiles'}"
                     class="navbar-item">
          <span class="icon is-medium">
            <i class="fas fa-users fa-lg"></i>
          </span>
          <span>Profiles</span>
        </router-link>
        <router-link :to="{name: 'personas'}"
                     class="navbar-item">
          <span class="icon is-medium">
            <i class="fas fa-theater-masks fa-lg"></i>
          </span>
          <span>Personas</span>
        </router-link>
        <router-link :to="{name: 'networks'}"
                     class="navbar-item">
          <span class="icon is-medium">
            <i class="fas fa-sitemap fa-lg"></i>
          </span>
          <span>Networks</span>
        </router-link>
        <router-link :to="{name: 'sites'}"
                     class="navbar-item">
          <span class="icon is-medium">
            <i class="fas fa-bookmark fa-lg"></i>
          </span>
          <span>Sites</span>
        </router-link>
      </div>

      <div class="navbar-start"
           v-if="area == 'dev' && isSuper">
        <router-link :to="{name: 'dev-users'}"
                     class="navbar-item">
          Users
        </router-link>
        <router-link :to="{name: 'dev-workspace'}"
                     class="navbar-item">
          Workspace
        </router-link>
        <dropdown class="navbar-item has-dropdown">
          <template slot="header">
            <a class="navbar-link">
              Account
            </a>
          </template>
          <div class="navbar-dropdown">
            <router-link :to="{name: 'login'}"
                         class="navbar-item">
              Login
            </router-link>
            <router-link :to="{name: 'register'}"
                         class="navbar-item">
              Register
            </router-link>
            <router-link :to="{name: 'reset'}"
                         class="navbar-item">
              Reset
            </router-link>
            <router-link :to="{name: 'error-404'}"
                         class="navbar-item">
              Error
            </router-link>
          </div>
        </dropdown>
        <dropdown class="navbar-item has-dropdown">
          <template slot="header">
            <a class="navbar-link">
              Beta Features
            </a>
          </template>
          <div class="navbar-dropdown">
            <router-link :to="{name: 'noise-option'}"
                         class="navbar-item">
              Noise
            </router-link>
          </div>
        </dropdown>
      </div>
      <div class="navbar-start"
           v-if="area == 'map' && isSuperAdminEditor">
      </div>
      <div class="navbar-start"
           v-if="area == 'admin' && isSuperAdminEditor">
      </div>
      <div class="navbar-start"
           v-if="area == 'note' && isSuperAdminEditor">
      </div>
      <div class="navbar-end">
        <button class="navbar-item theme-toggle is-hidden-touch"
                type="button"
                :title="theme.dark ? 'Switch to light mode' : 'Switch to dark mode'"
                :aria-label="theme.dark ? 'Switch to light mode' : 'Switch to dark mode'"
                @click="toggleThemeMode">
          <span class="theme-toggle-symbol"
                aria-hidden="true">
            <i :class="theme.dark ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </span>
        </button>
        <router-link :to="{name: 'timezone'}"
                     class="navbar-item is-hidden-touch">
          <div v-html="displayTimeZone"
               class="field has-text-centered"></div>
        </router-link>
        <router-link :to="{name: 'activity-home'}"
                     class="navbar-item">
          <span class="icon is-medium">
            <i class="fas fa-bell fa-lg"></i>
          </span>
        </router-link>
        <dropdown class="navbar-item has-dropdown">
          <template slot="header">
            <a class="navbar-link is-large"
               slot="trigger">
              <span class="has-text-weight-semibold workspace tooltip is-tooltip-bottom"
                    :data-tooltip="displayWorkspace.displayName"
                    v-if="displayWorkspace">{{truncate(displayWorkspace.displayName, 12)}}</span>
              <span class="profile-image">
                <span class="is-32x32">
                  <template v-if="user && user.name">
                    <avatar-letter :name='user.name'
                                   size='32'
                                   :rounded=true></avatar-letter>
                  </template>
                  <template v-else>
                    <span class="icon is-medium">
                      <i class="fas fa-user-circle has-text-grey fa-2x"></i>
                    </span>
                  </template>
                </span>
              </span>
            </a>
          </template>
          <div class="navbar-dropdown is-right">
            <div class="navbar-item"
                 v-if="area != 'web'">
              <WorkspaceList :appWorkspaces="appWorkspaces" />
              <hr class="navbar-divider">
            </div>
            <div class="navbar-item">
              <template v-if="displayWorkspace">
                <TimeDisplay :zone="displayWorkspace.timeZone" />
              </template>
            </div>
            <div v-if="user"
                 class="navbar-item">
              {{user.name}}
              <span class="tag is-rounded"
                    v-if="user.email">{{user.email}}</span>
            </div>
            <div v-else
                 class="navbar-item">
              Guest
            </div>
            <hr class="navbar-divider">
            <router-link :to="{name: 'userSettings'}"
                         class="navbar-item"
                         v-if="user">Settings
            </router-link>
            <a class="navbar-item"
               href="https://help.epicready.com/"
               target="_blank">
              Help
            </a>
            <div class="navbar-item">
              Version
              <span class="tag is-rounded">{{version}} </span>
            </div>
            <hr class="navbar-divider">
            <a v-if="user"
               class="navbar-item"
               @click="logout">
              Logout
            </a>
            <router-link v-else
                         :to="{name: 'login'}"
                         class="navbar-item">
              Login
            </router-link>
            <hr class="is-hidden-tablet is-flex-mobile navbar-divider logout-padding">
          </div>
        </dropdown>
      </div>
    </div>
  </nav>

</template>

<script>
import Launcher from './launcher.vue'
import WorkspaceList from './workspace-list.vue'
import AvatarLetter from './avatar-letter'
import Dropdown from './dropdown'
import TimeDisplay from '@/shared/components/timeDisplay'
import Permissions from '@/shared/mixins/permissions'

import {
  LocalGetSelf,
  LocalSetSelf,
  LogoutCurrentUser
} from '@/state/graphql/user.gql'

import { resetApollo } from '@/vue-apollo'
import {
  AppUserWorkspaces,
  AppWorkspacePublicRead,
  AppWorkspacesSubscription,
  AppWorkspacesPublicSubscription
} from '@/shared/graphql/AppWorkspaces.gql'
import NoWorkspaceModal from './no-workspaces'
import auth from '../mixins/auth'
import { onLogout } from '@/vue-apollo'
import packageInfo from '../../../package.json'
import { themeState, toggleTheme } from '@/shared/theme'

export default {
  name: 'TopNav',
  mixins: [auth, Permissions],
  props: ['area', 'query', 'tab'],
  components: {
    Dropdown,
    AvatarLetter,
    Launcher,
    WorkspaceList,
    NoWorkspaceModal,
    TimeDisplay
  },
  apollo: {
    user: {
      query: LocalGetSelf
    },
    appWorkspaces: {
      query: AppUserWorkspaces,
      variables() {
        return {
          orderBy: 'displayName_ASC'
        }
      },
      update(data) {
        if (
          data.currentUserWorkspaces &&
          data.currentUserWorkspaces.length > 0
        ) {
          this.setActiveWorkspace(data.currentUserWorkspaces)
        } else {
          this.$store.commit('setShowNoWorkspace', true)
          this.$store.commit('setActiveWorkspace', {
            name: '',
            displayName: ''
          })
        }
        return data.currentUserWorkspaces
      },
      subscribeToMore: {
        document: AppWorkspacesSubscription,
        updateQuery(previousResult, { subscriptionData }) {
          if (!subscriptionData.data) {
            return previousResult
          }
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.appWorkspace.mutation
          switch (mutationIn) {
            case 'CREATED': {
              this.$apollo.queries.appWorkspaces.refetch()
              break
            }
            case 'DELETED': {
              this.$apollo.queries.appWorkspaces.refetch()
              break
            }
            case 'UPDATED': {
              let updatedWorkspaces = JSON.parse(
                JSON.stringify(this.appWorkspaces)
              )
              let index = updatedWorkspaces.findIndex(
                x => x.id === subscriptionData.data.appWorkspace.node.id
              )
              if (index !== -1) {
                updatedWorkspaces[index] =
                  subscriptionData.data.appWorkspace.node
                this.appWorkspaces = updatedWorkspaces
              }
              break
            }
            default: {
              throw new Error('Unknown appWorkspace mutation')
            }
          }
        }
      }
    },
    appWorkspacePublic: {
      query: AppWorkspacePublicRead,
      variables() {
        let data = this.queryVariables()
        return data
      },
      subscribeToMore: {
        document: AppWorkspacesPublicSubscription,
        variables() {
          let datafromread = this.queryVariables()
          let data = {
            node: datafromread
          }
          return data
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.appWorkspacePub.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                appWorkspacePublic: [
                  subscriptionData.data.appWorkspacePub.node,
                  ...previousResult.appWorkspacePublic
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                appWorkspacePublic: [
                  ...previousResult.appWorkspacePublic.filter(
                    obj =>
                      subscriptionData.data.appWorkspacePub.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              newResult = {
                appWorkspacePublic: subscriptionData.data.appWorkspacePub.node
              }
              break
            }
            default: {
              throw new Error('Unknown mutation')
            }
          }
          return newResult
        }
      },
      skip() {
        return !this.$route.params.workspace
      }
    }
  },
  data() {
    return {
      zone: this.momentTimezone.tz.guess(true),
      mobileMenu: false,
      version: packageInfo.version,
      searchQuery: this.query,
      guestSkip: false,
      appWorkspaces: [],
      appWorkspacePublic: null,
      datenow: this.getDateNow(),
      theme: themeState
    }
  },
  methods: {
    getDateNow() {
      let zone = this.$store.state.activeWorkspace.timeZone

      if (
        this.$store.state.activeWorkspace.timeZone == '' ||
        this.$store.state.activeWorkspace.timeZone == null
      ) {
        zone = this.momentTimezone.tz.guess(true)
      }

      let date = this.momentTimezone
        .tz(this.moment().toISOString(), zone)
        .format('HH:mm')

      return date
    },
    async setActiveWorkspace(workspaces) {
      this.$store.commit('setShowNoWorkspace', false)

      let activeWorkspace
      let storageKey
      if (
        sessionStorage.getItem('workspace') &&
        sessionStorage.getItem('workspace').length > 0
      ) {
        storageKey = sessionStorage.getItem('workspace')
        if (!localStorage.getItem('workspace'))
          localStorage.setItem('workspace', storageKey)
      } else if (
        localStorage.getItem('workspace') &&
        localStorage.getItem('workspace').length > 0
      ) {
        storageKey = localStorage.getItem('workspace')
      }
      if (storageKey) {
        activeWorkspace = workspaces.find(({ name }) => name === storageKey)
      }
      if (!activeWorkspace) {
        //Either user logging in for first time or no longer has access to workspace
        activeWorkspace = workspaces[0]
        sessionStorage.setItem('workspace', activeWorkspace.name)
        localStorage.setItem('workspace', activeWorkspace.name)
        // Clear the client side cache to load the new workspace data
        await resetApollo(this.$apollo.provider.defaultClient)
      }

      this.$store.commit('setActiveWorkspace', activeWorkspace)
    },
    queryVariables() {
      let data
      data = {
        where: {
          name: this.$route.params.workspace
        }
      }
      return data
    },
    async hasNewUserRole() {
      await new Promise(resolve => {
        if (this.$store.state.userRole === '') {
          const unwatch = this.$store.watch(
            () => this.$store.state.userRole,
            value => {
              unwatch()
              resolve(value)
            }
          )
        } else {
          resolve(this.$store.state.userRole)
        }
      })
      return true
    },
    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu
    },
    toggleThemeMode() {
      toggleTheme()
    },
    gotoSettings(userid) {
      this.$router.push({
        name: 'userSettings',
        params: { id: userid }
      })
    },
    logout() {
      this.$apollo
        .mutate({
          mutation: LogoutCurrentUser
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Logout successful',
            type: 'is-success'
          })
          this.$apollo
            .mutate({
              mutation: LocalSetSelf
            })
            .catch(error => {
              console.error(error.message)
            })

          const apolloClient = this.$apollo.provider.defaultClient
          onLogout(apolloClient)
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'An Error has occured',
            type: 'is-danger'
          })
          console.error('Logout User: ' + error)
        })
      this.$router.push({
        name: 'login'
      })
    },
    time() {
      let zone = this.$store.state.activeWorkspace.timeZone

      if (
        this.$store.state.activeWorkspace.timeZone == '' ||
        this.$store.state.activeWorkspace.timeZone == null
      ) {
        zone = this.momentTimezone.tz.guess(true)
      }

      this.datenow = this.momentTimezone
        .tz(this.moment().toISOString(), zone)
        .format('HH:mm')
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  mounted() {
    this.interval = setInterval(this.time, 1000)
    document.body.classList.add('has-navbar-fixed-top')
    window.addEventListener('storage', async event => {
      // Olny reset if different user logged in on new tab
      if (event.key === 'token' && event.oldValue !== event.newValue) {
        await resetApollo(this.$apollo.provider.defaultClient)
        this.$router.push({
          path: '/'
        })
      }
    })
    this.hasNewUserRole()
  },
  computed: {
    displayTimeZone() {
      let zone = this.$store.state.activeWorkspace.timeZone
      let tooltipMsg = this.$store.state.activeWorkspace.timeZone
        ? `Time Zone: 
          ${this.$store.state.activeWorkspace.timeZone.replace(/(_)/g, ' ')} `
        : ''

      if (
        this.$store.state.activeWorkspace.timeZone == '' ||
        this.$store.state.activeWorkspace.timeZone == null
      ) {
        zone = this.momentTimezone.tz.guess(true)
        tooltipMsg = 'No Time Zone Set - Displays Your Local Time Zone'
      }

      if (zone) {
        return `
        <p class="is-size-7 is-family-monospace has-text-weight-bold">${
          this.datenow
        }</p>
        <p class="is-size-7">
                <span class="tooltip is-tooltip-bottom is-family-monospace has-text-weight-bold" data-tooltip="${tooltipMsg}">
        ${this.momentTimezone.tz(zone).format('z')} (${this.momentTimezone
          .tz(zone)
          .format('Z')})<span><p>`
      }
    },
    displayWorkspace() {
      let result = this.$store.state.activeWorkspace
      if (
        this.area === 'web' &&
        this.$route.params.workspace &&
        this.appWorkspacePublic
      ) {
        let activeWorkspace = this.appWorkspacePublic
        if (!activeWorkspace.timeZone || !activeWorkspace.timeZone.length > 0)
          activeWorkspace.timeZone = this.momentTimezone.tz.guess(true)
        this.$store.commit('setActiveWorkspace', activeWorkspace)

        result = activeWorkspace
      }
      return result
    },
    selectedArea() {
      let areaLabel = ''
      switch (this.area) {
        case 'media':
          areaLabel = 'is-media'
          break
        case 'web':
          areaLabel = 'is-web'
          break
        case 'plan':
          areaLabel = 'is-plan'
          break
        case 'map':
          areaLabel = 'is-map'
          break
        case 'note':
          areaLabel = 'is-note'
          break
        case 'observe':
          areaLabel = 'is-observe'
          break
        case 'admin':
          areaLabel = 'is-admin'
          break
        case 'dev':
          areaLabel = 'is-dev'
          break
        case 'email':
          areaLabel = 'is-email'
          break
        case 'chat':
          areaLabel = 'is-chat'
          break
        case 'activity':
          areaLabel = 'is-activity'
          break
        case 'base':
          areaLabel = 'is-base'
          break
        default:
          areaLabel = 'is-base'
          break
      }
      return areaLabel
    }
  },
  watch: {
    $route() {
      this.mobileMenu = false
    },
    query: function() {
      this.searchQuery = this.query
    },
    searchQuery: function() {
      this.$router.push({ query: { q: this.searchQuery, t: this.tab } })
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar-menu {
  p.menu-label {
    margin: 0 0.5rem;
  }
}
.profile-image {
  padding-left: 10px;
}
.workspace {
  text-transform: capitalize;
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
.logout-padding {
  padding-bottom: 1rem;
}
.theme-toggle {
  align-items: center;
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  font: inherit;
  justify-content: center;
  min-width: 3rem;
}
.theme-toggle:focus {
  outline: 2px solid rgba(255, 255, 255, 0.65);
  outline-offset: -0.35rem;
}
.theme-toggle-symbol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.95rem;
  line-height: 1;
}

@media screen and (max-width: 1023px) {
  .navbar-menu.is-active {
    overflow-x: scroll;
    max-height: calc(85vh - 2.25rem);
  }
}
</style>
