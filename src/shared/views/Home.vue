<template>
  <div class="app-home">
    <section class="section app-home-content">
      <div class="home-hero columns is-mobile is-vcentered">
        <div class="column has-text-centered">
          <figure class="image center-image">
            <img src="@/shared/assets/epic_logo.svg"
                 class="logo" />
          </figure>
          <p class="subtitle is-6 is-hidden-mobile">Innovation Transforming Readiness</p>
        </div>
        <div class="column is-narrow is-pulled-right">
          <help-content reference="epic.home"
                        toggle
                        dropdown />
        </div>
      </div>

      <template v-for="section in visibleLauncherSections">
        <div :key="`${section.key}-divider`"
             class="role-divider">
          <span class="role-divider-label">{{ section.label }}</span>
          <span class="role-divider-copy">{{ section.description }}</span>
        </div>

        <div :key="section.key"
             class="columns is-multiline apps role-apps">
          <div v-for="app in section.apps"
               :key="`${section.key}-${app.name}`"
               class="column is-half">
            <router-link :to="appRoute(app)">
              <article class="media">
                <figure class="media-left">
                  <img :src="app.icon"
                       :alt="`EPIC ${app.label}`">
                </figure>
                <div class="media-content">
                  <div class="content">
                    <p class="has-text-dark">
                      <strong>{{ app.label }}</strong>
                      <br />
                      <small>{{ app.description }}</small>
                    </p>
                  </div>
                </div>
                <div class="media-right">
                  <span class="icon is-small">
                    <i class="fas fa-arrow-right"></i>
                  </span>
                </div>
              </article>
            </router-link>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>


<script>
import HelpContent from '@/shared/components/helpcontent'
import Permissions from '@/shared/mixins/permissions'

import {
  AppListSettingsRead,
  AppListSettingSubscription
} from '@/shared/graphql/AppListSettings.gql'

const appCatalog = [
  {
    name: 'plan',
    label: 'Plan',
    route: { name: 'plan-home' },
    icon: require('@/shared/assets/plan.svg'),
    description: 'Design, track, and assess training exercises.'
  },
  {
    name: 'timeline',
    label: 'Timeline',
    route: { name: 'timeline-home' },
    icon: require('@/shared/assets/timeline.svg'),
    description: 'Review exercise events, injects, commands, observations, media, and chat.'
  },
  {
    name: 'map',
    label: 'Map',
    route: { name: 'map-home' },
    icon: require('@/shared/assets/map.svg'),
    description: 'Visualize your training exercise on an interactive 3D map.'
  },
  {
    name: 'resources',
    label: 'Resources',
    route: { name: 'resources-home' },
    icon: require('@/shared/assets/resources.svg'),
    description: 'Allocate and track resources.'
  },
  {
    name: 'notebook',
    label: 'Notebook',
    route: { name: 'notebook-home' },
    icon: require('@/shared/assets/notebook.svg'),
    description: 'Capture knowledge and collaborate around exercise material.'
  },
  {
    name: 'media',
    label: 'Media',
    route: { name: 'media-home' },
    icon: require('@/shared/assets/media.svg'),
    description: 'Replicate an online media environment.'
  },
  {
    name: 'observe',
    label: 'Observe',
    route: { name: 'observe-home' },
    icon: require('@/shared/assets/observe.svg'),
    description: 'Record and view observations in real time.'
  },
  {
    name: 'command',
    label: 'Command',
    route: { name: 'command-home' },
    icon: require('@/shared/assets/command.svg'),
    description: 'Send and acknowledge command traffic during execution.'
  },
  {
    name: 'email',
    label: 'Email',
    route: { name: 'email-home' },
    icon: require('@/shared/assets/email.svg'),
    description: 'Protect conversations using a secure exercise email service.'
  },
  {
    name: 'chat',
    label: 'Chat',
    route: { name: 'chat-home' },
    icon: require('@/shared/assets/chat.svg'),
    description: 'Communicate securely with messaging and group channels.'
  },
  {
    name: 'web',
    label: 'Web',
    route(workspace) {
      return `/web/${workspace.name}`
    },
    icon: require('@/shared/assets/web.svg'),
    description: 'Open the public-facing portal for simulated scenario content.',
    allowWithoutWorkspaceRole: true
  },
  {
    name: 'learn',
    label: 'Learn',
    route: { name: 'learn-home' },
    icon: require('@/shared/assets/learn.svg'),
    description: 'Learn with interactive gameplay and test your skills.'
  },
  {
    name: 'activity',
    label: 'Activity',
    route: { name: 'activity-home' },
    icon: require('@/shared/assets/activity.svg'),
    description: 'Review workspace activity and operational events.'
  },
  {
    name: 'settings',
    label: 'Settings',
    route: { name: 'settings-home' },
    icon: require('@/shared/assets/settings.svg'),
    description: 'Manage users, workspace settings, data, and more.',
    alwaysVisible: true
  },
  {
    name: 'dev',
    label: 'Developer',
    route: { name: 'dev-home' },
    icon: require('@/shared/assets/dev.svg'),
    description: 'Test innovative prototypes and development utilities.'
  }
]

const appByName = appCatalog.reduce((apps, app) => {
  apps[app.name] = app
  return apps
}, {})

const productRoleSections = [
  {
    key: 'planner',
    label: 'Planner',
    description: 'Exercise design, structure, objectives, resources, and planned activity.',
    apps: ['plan', 'timeline', 'map', 'resources', 'notebook', 'learn']
  },
  {
    key: 'staff',
    label: 'Staff',
    description: 'Exercise control, inject execution, observations, communications, and media play.',
    apps: ['timeline', 'command', 'observe', 'media', 'map', 'email', 'chat', 'notebook']
  },
  {
    key: 'participant',
    label: 'Participant',
    description: 'Training audience tools for consuming scenario content and responding in exercise channels.',
    apps: ['web', 'email', 'chat', 'map', 'notebook', 'learn']
  },
  {
    key: 'leadership',
    label: 'Leadership',
    description: 'Commander and senior-leader views for execution status, key events, and outcomes.',
    apps: ['command', 'timeline', 'activity', 'map', 'learn']
  },
  {
    key: 'developer',
    label: 'Developer',
    description: 'Workspace administration, platform setup, diagnostics, and prototype access.',
    apps: ['settings', 'dev', 'activity']
  }
]

export default {
  name: 'MainHome',
  mixins: [Permissions],
  components: {
    HelpContent
  },
  computed: {
    rawRoleNames() {
      const user = this.$store.state.currentUser
      if (!user || !user.role || !Array.isArray(user.role.roles)) {
        return []
      }
      return user.role.roles.map(role => role.name && role.name.toUpperCase()).filter(Boolean)
    },
    isDeveloperLauncher() {
      return (
        this.isSuper ||
        this.$store.state.userRole === 'Super' ||
        this.$store.state.userRole === 'Admin' ||
        this.rawRoleNames.includes('DEVELOPER')
      )
    },
    visibleLauncherSections() {
      if (this.isDeveloperLauncher) {
        return this.buildSections(productRoleSections)
      }

      const roleKeys = productRoleSections
        .map(section => section.key)
        .filter(role => this.rawRoleNames.includes(role.toUpperCase()))

      if (roleKeys.length > 0) {
        return this.buildSections(
          productRoleSections.filter(section => roleKeys.includes(section.key))
        )
      }

      return this.buildSections([
        {
          key: 'workspace',
          label: 'Workspace Apps',
          description: 'Apps available to your current workspace and account role.',
          apps: appCatalog.map(app => app.name)
        }
      ])
    }
  },
  apollo: {
    appListSettings: {
      query: AppListSettingsRead,
      update(data) {
        if (data && data.appListSettings && data.appListSettings.length > 0) {
          return data.appListSettings
        }
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
  mounted() {
    this.hasNewUserRole()
  },
  methods: {
    appRoute(app) {
      if (typeof app.route === 'function') {
        return app.route(this.$store.state.activeWorkspace || {})
      }
      return app.route
    },
    appIsVisible(app) {
      if (!app) return false
      if (app.alwaysVisible) return true
      if (!this.checkActive(app.name)) return false
      return app.allowWithoutWorkspaceRole || this.canOpenWorkspaceApps
    },
    buildSections(sections) {
      return sections
        .map(section => ({
          ...section,
          apps: section.apps
            .map(appName => appByName[appName])
            .filter(app => this.appIsVisible(app))
        }))
        .filter(section => section.apps.length > 0)
    },
    checkActive(name) {
      if (!name) return
      if (this.appListSettings && this.appListSettings.length > 0) {
        const checkApp = this.appListSettings.find(app => {
          return app.name && app.name.toUpperCase() === name.toUpperCase()
        })
        return !checkApp || checkApp.status !== 'INACTIVE'
      }
      return true
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
<style scoped lang="scss">
.app-home {
  position: relative;
  min-height: calc(100vh - 3.25rem);
  padding: 1.5rem;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 18%, rgba(51, 153, 220, 0.12), transparent 34rem),
    linear-gradient(90deg, rgba(4, 10, 18, 0.52) 0%, rgba(6, 16, 26, 0.30) 50%, rgba(5, 10, 18, 0.54) 100%),
    url("~@/shared/assets/launcher-training-scene.jpg") center / cover no-repeat fixed;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(4, 10, 18, 0.04), rgba(4, 10, 18, 0.18));
  }
}

.app-home-content {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  background: transparent !important;
}

.home-hero {
  position: relative;
  margin-bottom: 1.5rem;
  padding: 2rem;
  border: 1px solid rgba(180, 205, 225, 0.28);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(9, 19, 31, 0.54), rgba(15, 31, 44, 0.38)),
    linear-gradient(135deg, rgba(51, 153, 220, 0.10), rgba(3, 129, 114, 0.08)) !important;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(16px) saturate(128%);

  .image.logo,
  .image .logo {
    filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.34));
  }

  .subtitle {
    margin-top: 0.75rem;
    color: rgba(226, 238, 248, 0.82);
    font-weight: 700;
  }
}

@media screen and (min-width: 1024px) {
  div.apps {
    padding-top: 0.6rem;
  }
}

.role-divider {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin: 1.75rem 0 0.35rem;
  color: rgba(226, 238, 248, 0.82);

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(117, 199, 245, 0.42), rgba(180, 205, 225, 0));
  }
}

.role-divider-label {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.22rem 0.7rem;
  border: 1px solid rgba(117, 199, 245, 0.26);
  border-radius: 999px;
  background: rgba(8, 17, 28, 0.42);
  color: #f8fbff;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
}

.role-divider-copy {
  max-width: 48rem;
  color: rgba(218, 231, 242, 0.74);
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.35;
}

div.apps {
  .media-left img {
    height: 52px;
    width: 52px;
    filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
  }
}
div.apps {
  & .column > a {
    display: block;
    height: 100%;
    color: inherit;
  }

  article.media {
    height: 100%;
    align-items: center;
    padding: 1.15rem;
    border: 1px solid rgba(180, 205, 225, 0.24);
    border-radius: 8px;
    background:
      linear-gradient(135deg, rgba(12, 24, 38, 0.54), rgba(8, 17, 28, 0.42)),
      rgba(8, 17, 28, 0.38) !important;
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(8px) saturate(124%);
    transition: border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease, background 140ms ease;

    &:hover,
    &:focus-within {
      border-color: rgba(74, 185, 240, 0.52);
      background:
        linear-gradient(135deg, rgba(16, 34, 52, 0.70), rgba(10, 23, 36, 0.58)),
        rgba(8, 17, 28, 0.52) !important;
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.30), 0 0 0 1px rgba(74, 185, 240, 0.10);
      transform: translateY(-3px);
    }

    .media-content {
      overflow: visible;
    }

    strong {
      color: #f8fbff;
      font-size: 1rem;
    }

    small {
      color: rgba(218, 231, 242, 0.82);
      line-height: 1.4;
    }

    .media-right {
      color: #75c7f5;
    }

    .media-left {
      background: rgba(117, 199, 245, 0.12) !important;
      border-color: rgba(117, 199, 245, 0.18) !important;
    }

    .media-right .icon {
      background: rgba(8, 17, 28, 0.24) !important;
      border-color: rgba(180, 205, 225, 0.20) !important;
      color: #75c7f5 !important;
    }
  }
}

.is-divider {
  border-top-color: rgba(180, 205, 225, 0.24);

  &[data-content]::after {
    background: rgba(8, 17, 28, 0.86);
    border: 1px solid rgba(180, 205, 225, 0.24);
    border-radius: 999px;
    color: rgba(226, 238, 248, 0.84);
    letter-spacing: 0.02em;
  }
}

@media screen and (max-width: 768px) {
  .app-home {
    padding: 0.75rem;
    background-position: 35% center;
  }

  .home-hero {
    padding: 1.25rem;
  }

  .role-divider {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.45rem;

    &::after {
      width: 100%;
    }
  }

  div.apps article.media {
    align-items: flex-start;
  }
}
</style>
