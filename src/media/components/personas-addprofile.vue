<template>
  <div class="container">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Profiles to Persona</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="mediaPersona && mediaProfiles">
          <div class="columns is-centered">
            <div class="column is-10">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-96x96"
                          v-if="mediaPersona.avatar != null">
                    <img :src="mediaPersona.avatar.url.thumb"
                         alt="image"
                         class="is-avatar xl">
                  </figure>
                  <figure class="image is-48x48"
                          v-else>
                    <span class="icon is-large">
                      <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                    </span>
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-6">{{mediaPersona.name}}</p>
                </div>
                <div class="media-right"
                     v-if="selectedProfiles && selectedProfiles.length > 0">
                  <span class="icon">
                    <i class="fas fa-users has-text-primary"></i>
                  </span>
                  <span>{{selectedProfiles.length}}</span>
                </div>
              </div>
              <div class="content">
                <a class="button is-primary"
                   @click="toggleCreateProfile(true)">
                  Create Profile
                </a>
                <div class="is-divider"
                     data-content="or search existing profiles"></div>
                <div class="field">
                  <p class="control has-icons-left">
                    <input class="input is-rounded is-primary"
                           type="text"
                           placeholder="Search..."
                           v-model="searchQuery"
                           clearable
                           v-focus>
                    <span class="icon is-small is-left">
                      <i class="fas fa-search"></i>
                    </span>
                  </p>
                </div>
                <div class="field"
                     v-if="mediaProfiles && mediaProfiles.length > 0">
                  <div class="select is-multiple is-fullwidth">
                    <select multiple
                            v-model="selectedProfiles"
                            size="8">
                      <option v-for="profile in mediaProfiles"
                              v-bind:key="profile.id"
                              :value="profile.id">
                        {{profile.name}} - {{profile.service.displayName}}
                      </option>
                    </select>
                  </div>
                </div>
                <div v-else>
                  <div class="card">
                    <div class="card-content">
                      <div class="card-header-title is-centered">
                        <i class="fas fa-search fa-3x has-text-primary"></i>
                      </div>
                      <p class="subtitle has-text-centered">
                        No result found. Try a different search.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             @click="reviewChanges">
            Review
          </a>
          <a class="button"
             @click="close()">
            Cancel
          </a>
        </footer>
      </div>
    </div>
    <profile-create :open="createProfile"
                    :isEdit="false"
                    :mediaProfile="profileInfo"
                    :mediaServices="mediaServices"
                    @close="toggleCreateProfile(false)" />
  </div>
</template>

<script>
import ProfileCreate from '@/media/components/profile-create'

import { MediaServicesRead } from '@/media/graphql/MediaServices.gql'
import MediaProfile from '@/media/model/mediaprofile'

import {
  MediaProfilesRead,
  MediaProfilesSubscription
} from '@/media/graphql/MediaProfiles.gql'

export default {
  name: 'personas-addprofile',
  components: { ProfileCreate },
  props: {
    mediaPersona: {},
    open: {
      default: false
    }
  },
  apollo: {
    mediaServices: {
      query: MediaServicesRead,
      error(error) {
        console.error(error)
      }
    },
    mediaProfiles: {
      query: MediaProfilesRead,
      variables() {
        return {
          where: {
            isUserGenerated: true,
            OR: [
              { service: { name_contains: this.searchQuery } },
              { name_contains: this.searchQuery },
              { username_contains: this.searchQuery },
              { description_contains: this.searchQuery },
              { language_contains: this.searchQuery }
            ]
          }
        }
      },
      subscribeToMore: [
        {
          document: MediaProfilesSubscription,
          variables() {
            return {
              where: {
                node: {
                  isUserGenerated: true
                }
              }
            }
          },
          // Mutate the previous result
          updateQuery: (previousResult, { subscriptionData }) => {
            // Here, return the new result from the previous with the new data
            let mutationIn = subscriptionData.data.mediaProfile.mutation
            var newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaProfiles: [
                    ...previousResult.mediaProfiles,
                    subscriptionData.data.mediaProfile.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  mediaProfiles: [
                    ...previousResult.mediaProfiles.filter(
                      obj =>
                        subscriptionData.data.mediaProfile.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedMediaProfiles = JSON.parse(
                  JSON.stringify(previousResult.mediaProfiles)
                )
                updatedMediaProfiles[
                  updatedMediaProfiles.findIndex(
                    x => x.id === subscriptionData.data.mediaProfile.node.id
                  )
                ] =
                  subscriptionData.data.mediaProfile.node
                newResult = {
                  mediaProfiles: updatedMediaProfiles
                }
                break
              }

              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            return newResult
          }
        }
      ]
    }
  },
  data() {
    return {
      selectedProfiles: [],
      searchQuery: '',
      createProfile: false,
      profileInfo: new MediaProfile(),
      mediaServices: []
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.selectedProfiles = []
    },
    toggleCreateProfile(value) {
      this.createProfile = value
    },
    save() {
      let profilesArray = []
      for (let i = 0; i < this.selectedProfiles.length; i++) {
        profilesArray.push({
          id: this.selectedProfiles[i]
        })
      }

      this.$emit('addProfile', profilesArray)
      this.close()
    },
    reviewChanges() {
      this.$buefy.dialog.confirm({
        title: 'Review Profiles',
        message: `You are adding ${this.selectedProfiles.length} Profiles`,
        type: 'is-warning',
        onConfirm: () => this.save()
      })
    }
  },
  watch: {
    mediaPersona() {
      if (this.mediaPersona.profiles) {
        for (let i = 0; i < this.mediaPersona.profiles.length; i++) {
          this.selectedProfiles.push(this.mediaPersona.profiles[i].id)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content li + li {
  margin-top: 0;
}
</style>
