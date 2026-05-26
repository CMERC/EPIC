<template>
  <b-dropdown class="launcher"
              scrollable
              max-height="505">
    <a class="navbar-item"
       slot="trigger">
      <img class="launcherTrigger"
           src="../assets/grid.svg"
           alt="EPIC Launcher"
           v-if="area !='web' && area!='observe' && area!='activity'">
      <img class="launcherTrigger"
           src="../assets/grid dark.svg"
           v-else />
    </a>
    <div class="columns is-vcentered is-centered has-text-centered">
      <b-dropdown-item custom
                       class="column is-12">
        <router-link :to="{name: 'main-home'}">
          <img src="../assets/epic_logo.svg"
               alt="EPIC Ready" />
        </router-link>
      </b-dropdown-item>
    </div>
    <div class="columns is-multiline apps is-mobile">
      <template v-if="checkActive('plan')">
        <template v-if="isSuperAdminEditor">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'plan-home'}">
              <img src="../assets/plan.svg"
                   alt="EPIC Plan">
              <p class="title is-7">Plan</p>
            </router-link>
          </b-dropdown-item>

        </template>
      </template>
      <template v-if="checkActive('media')">
        <template v-if="isSuperAdminEditor">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'media-home'}">
              <img src="../assets/media.svg"
                   alt="EPIC Media">
              <p class="title is-7">Media</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>
      <template v-if="checkActive('notebook')">
        <template v-if="isSuperAdminEditor">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'notebook-home'}">
              <img src="../assets/notebook.svg"
                   alt="EPIC Note">
              <p class="title is-7">Notebook</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>
      <template v-if="checkActive('web')">
        <b-dropdown-item custom
                         :class="classList">
          <router-link :to="{path: '/web/'+$store.state.activeWorkspace.name}">
            <img src="../assets/web.svg"
                 alt="EPIC Web">
            <p class="title is-7">Web</p>
          </router-link>
        </b-dropdown-item>
      </template>
      <template v-if="checkActive('observe')">
        <template v-if="isSuper">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'observe-home'}">
              <img src="../assets/observe.svg"
                   alt="EPIC Observe">
              <p class="title is-7">Observe</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>
      <template v-if="checkActive('map')">
        <template v-if="isSuperAdminEditor">
          <b-dropdown-item custom
                           :class="classList"
                           v-if="isSuperAdminEditor">
            <router-link :to="{name: 'map-home'}">
              <img src="../assets/map.svg"
                   alt="EPIC Map">
              <p class="title is-7">Map</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>
      <template v-if="checkActive('chat')">
        <template v-if="isSuperAdminEditor && !$store.state.showNoWorkspace">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'chat-home'}">
              <img src="../assets/chat.svg"
                   alt="EPIC Chat">
              <p class="title is-7">Chat</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>
      <template v-if="checkActive('resources')">
        <template v-if="isSuper">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'resources-home'}">
              <img src="../assets/resources.svg"
                   alt="EPIC Resources">
              <p class="title is-7">Resources</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>
      <template v-if="checkActive('learn')">
        <template v-if="isSuper">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'learn-home'}">
              <img src="../assets/learn.svg"
                   alt="EPIC Learn">
              <p class="title is-7">Learn</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>

      <template>
        <b-dropdown-item custom
                         :class="classList">
          <router-link :to="{name: 'settings-home'}">
            <img src="../assets/settings.svg"
                 alt="EPIC Settings">
            <p class="title is-7">Settings</p>
          </router-link>
        </b-dropdown-item>
      </template>
      <template v-if="checkActive('dev')">
        <template v-if="isSuper">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'dev-home'}">
              <img src="../assets/dev.svg"
                   alt="EPIC Developer">
              <p class="title is-7">Developer</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>
    </div>

    <div class="is-divider"
         data-content="All Workspace Apps"
         v-if="isSuper && checkActive('email') || checkActive('command')"></div>
    <div class="columns is-multiline is-mobile apps">
      <template v-if="checkActive('email')">
        <template v-if="isSuper">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'email-home'}">
              <img src="../assets/email.svg"
                   alt="EPIC Email">
              <p class="title is-7">Email</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>
      <template v-if="checkActive('command')">
        <template v-if="isSuper">
          <b-dropdown-item custom
                           :class="classList">
            <router-link :to="{name: 'command-home'}">
              <img src="../assets/command.svg"
                   alt="EPIC Command">
              <p class="title is-7">Command</p>
            </router-link>
          </b-dropdown-item>
        </template>
      </template>
    </div>
  </b-dropdown>
</template>

<script>
import {
  AppListSettingsRead,
  AppListSettingSubscription
} from '@/shared/graphql/AppListSettings.gql'

import Permissions from '@/shared/mixins/permissions'
export default {
  name: 'LauncherView',
  mixins: [Permissions],
  props: ['area'],
  apollo: {
    appListSettings: {
      query: AppListSettingsRead,
      update(data) {
        return data.appListSettings
      },
      subscribeToMore: {
        document: AppListSettingSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.appListSetting.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                appListSettings: [
                  subscriptionData.data.appListSetting.node,
                  ...previousResult.appListSettings
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                appListSettings: [
                  ...previousResult.appListSettings.filter(
                    obj =>
                      subscriptionData.data.appListSetting.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newAppListSettings = JSON.parse(
                JSON.stringify(previousResult.appListSettings)
              )
              let index = newAppListSettings.findIndex(
                x => x.id === subscriptionData.data.appListSetting.node.id
              )
              newAppListSettings[index] =
                subscriptionData.data.appListSetting.node
              newResult = {
                appListSettings: newAppListSettings
              }
              break
            }
            default: {
              throw new Error(`Unknown App List Setting mutation`)
            }
          }
          return newResult
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      classList: 'column is-one-third-mobile is-one-third-tablet is-6-desktop',
      showInactiveApps: false
    }
  },
  mounted() {
    this.hasNewUserRole()
  },
  methods: {
    checkActive(name) {
      if (!name) return
      let checkApp
      if (this.appListSettings && this.appListSettings.length > 0) {
        checkApp = this.appListSettings.filter(app => {
          if (app.name == name.toUpperCase()) {
            return app
          }
        })
        if (checkApp && checkApp[0] && checkApp[0].status === 'INACTIVE') {
          checkApp = false
        }
      } else {
        checkApp = true
      }

      return checkApp
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
    }
  }
}
</script>

<style lang="scss" scoped>
.launcher {
  & .launcherTrigger {
    height: 50px;
  }
  & .dropdown-menu {
    z-index: 250;
  }
  & .columns.is-gapless .column {
    padding: 0.375rem 1rem;
  }
  .columns {
    margin: 0;
  }
  a.button {
    border: 0;
  }
  .apps {
    margin-bottom: 1rem;
    .dropdown-item {
      text-align: center;
      padding: 0;
      a {
        padding: 0.65rem;
        display: inline-block;
        img {
          height: 44px;
          width: 44px;
          & + p {
            font-size: 0.85rem;
            display: block;
            color: #363636;
            font-weight: 600;
            line-height: 1.125;
          }
        }
      }
    }
  }
  .dropdown-item {
    &:hover,
    & > div:hover {
      cursor: pointer;
      background-color: #f5f5f5;
    }
  }
}
</style>
