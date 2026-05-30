<template>
  <div class="container app-home">
    <section class="section">
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

      <div class="columns is-multiline apps">
        <template v-if="checkActive('plan')">
          <template v-if="isSuperAdminEditor">
            <div class="column is-half">
              <router-link :to="{name: 'plan-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/plan.svg"
                         alt="EPIC Plan">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Plan</strong>
                        <br />
                        <small> Design, track, and assess training exercises.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="checkActive('media')">
          <template v-if="isSuperAdminEditor">
            <div class="column is-half">
              <router-link :to="{name:'media-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/media.svg"
                         alt="EPIC Media">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Media</strong>
                        <br />
                        <small> Replicate an online media environment.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="checkActive('notebook')">
          <template v-if="isSuperAdminEditor">
            <div class="column is-half">
              <router-link :to="{name:'notebook-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/notebook.svg"
                         alt="EPIC Note">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Notebook</strong>
                        <br />
                        <small> Knowledge sharing in a collaborative environment.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="checkActive('web')">
          <template>
            <div class="column is-half">
              <router-link :to="'/web/'+$store.state.activeWorkspace.name">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/web.svg"
                         alt="EPIC Web">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Web</strong>
                        <br />
                        <small> Portal for training audience to view published media content.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="checkActive('observe')">
          <template v-if="isSuper">
            <div class="column is-half">
              <router-link :to="{name:'observe-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/observe.svg"
                         alt="EPIC Observe">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Observe</strong>
                        <br />
                        <small> Record and view observations in real-time.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="checkActive('map')">
          <template v-if="isSuperAdminEditor">
            <div class="column is-half">
              <router-link :to="{name: 'map-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/map.svg"
                         alt="EPIC Map">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Map</strong>
                        <br />
                        <small> Visualize your training exercise on an interactive 3D map.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="checkActive('chat')">
          <template v-if="isSuperAdminEditor && !$store.state.showNoWorkspace">
            <div class="column is-half">
              <router-link :to="{name:'chat-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/chat.svg"
                         alt="EPIC Chat">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Chat</strong>
                        <br />
                        <small> Communicate securely with messaging and group channels.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="checkActive('resources')">
          <template v-if="isSuper">
            <div class="column is-half">
              <router-link :to="{name:'resources-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/resources.svg"
                         alt="EPIC Resources">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Resources</strong>
                        <br />
                        <small> Allocate and track resources.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="checkActive('learn')">
          <template v-if="isSuper">
            <div class="column is-half">
              <router-link :to="{name:'learn-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/learn.svg"
                         alt="EPIC Learn">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Learn</strong>
                        <br />
                        <small> Learn with interactive gameplay and test your skills.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template>
          <div class="column is-half">
            <router-link :to="{name: 'settings-home'}">
              <article class="media">
                <figure class="media-left">
                  <img src="../assets/settings.svg"
                       alt="EPIC Settings">
                </figure>
                <div class="media-content">
                  <div class="content">
                    <p class="has-text-dark">
                      <strong>Settings</strong>
                      <br />
                      <small> Manage users, workspace settings, data, and more.</small>
                    </p>
                  </div>
                </div>
                <div class="media-right">
                  <span class="icon is-small">
                    <i class="fas fa-angle-double-right"></i>
                  </span>
                </div>
              </article>
            </router-link>
          </div>
        </template>
        <template v-if="checkActive('dev')">
          <template v-if="isSuper">
            <div class="column is-half">
              <router-link :to="{name:'dev-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/dev.svg"
                         alt="EPIC Developer">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Developer</strong>
                        <br />
                        <small> Test innovative prototypes to aid in development.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
      </div>

      <div class="is-divider"
           data-content="All Workspace Apps"
           v-if="isSuper && checkActive('email') || checkActive('command')"></div>

      <div class="columns is-multiline apps">
        <template v-if="checkActive('email')">
          <template v-if="isSuper">
            <div class="column is-half">
              <router-link :to="{name: 'email-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/email.svg"
                         alt="EPIC Email">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Email</strong>
                        <br />
                        <small> Protect conversations using a secure email service.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
        <template v-if="checkActive('command')">
          <template v-if="isSuper">
            <div class="column is-half">
              <router-link :to="{name: 'command-home'}">
                <article class="media">
                  <figure class="media-left">
                    <img src="../assets/command.svg"
                         alt="EPIC Command">
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="has-text-dark">
                        <strong>Command</strong>
                        <br />
                        <small> Manage all exercises and identify trends.</small>
                      </p>
                    </div>
                  </div>
                  <div class="media-right">
                    <span class="icon is-small">
                      <i class="fas fa-angle-double-right"></i>
                    </span>
                  </div>
                </article>
              </router-link>
            </div>
          </template>
        </template>
      </div>
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

export default {
  name: 'home',
  mixins: [Permissions],
  components: {
    HelpContent
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
<style scoped lang="scss">
.app-home {
  max-width: 1180px;
}

.home-hero {
  position: relative;
  margin-bottom: 1.5rem;
  padding: 2rem;
  border: 1px solid rgba(217, 226, 236, 0.82);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(244, 249, 252, 0.92)),
    linear-gradient(135deg, rgba(51, 153, 220, 0.10), rgba(3, 129, 114, 0.10));
  box-shadow: 0 16px 40px rgba(20, 38, 60, 0.10);

  .image.logo,
  .image .logo {
    filter: drop-shadow(0 10px 18px rgba(20, 38, 60, 0.12));
  }

  .subtitle {
    margin-top: 0.75rem;
    color: #65758b;
    font-weight: 700;
  }
}

@media screen and (min-width: 1024px) {
  div.apps {
    padding-top: 25px;
  }
}
div.apps {
  .media-left img {
    height: 52px;
    width: 52px;
    filter: drop-shadow(0 8px 14px rgba(20, 38, 60, 0.12));
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
    border: 1px solid rgba(217, 226, 236, 0.82);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 2px 8px rgba(20, 38, 60, 0.08);
    transition: border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;

    &:hover,
    &:focus-within {
      border-color: rgba(51, 153, 220, 0.34);
      box-shadow: 0 16px 38px rgba(20, 38, 60, 0.12);
      transform: translateY(-2px);
    }

    .media-content {
      overflow: visible;
    }

    strong {
      color: #223044;
      font-size: 1rem;
    }

    small {
      color: #65758b;
      line-height: 1.4;
    }

    .media-right {
      color: #3399dc;
    }
  }
}

@media screen and (max-width: 768px) {
  .home-hero {
    padding: 1.25rem;
  }

  div.apps article.media {
    align-items: flex-start;
  }
}
</style>
