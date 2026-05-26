<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="mediaNetwork ? mediaNetwork.name : ''" />
    <nav class="level is-pulled-right">
      <div class="level-left"></div>
      <div class="level-right">
        <div class="level-item">
          <help-content :reference="'media.networksview'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div v-if="mediaNetwork && mediaNetwork.id != null">
      <div class="columns is-multiline is-centered is-mobile">
        <div class="column is-half-desktop is-half-tablet is-12-mobile">
          <div class="card focus">
            <b-dropdown class="is-pulled-right"
                        position="is-bottom-left">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="editNetwork(mediaNetwork.id)">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Network</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDeleteNetwork(mediaNetwork.id)">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete Network</span>
              </b-dropdown-item>
            </b-dropdown>
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-96x96"
                          v-if="mediaNetwork.avatar != null"
                          @click="imagePreview(mediaNetwork.avatar)">
                    <img :src="mediaNetwork.avatar.url.thumb"
                         alt="image"
                         class="is-avatar xl">
                  </figure>
                  <figure class="image is-96x96"
                          v-else>
                    <span class="icon is-xxlarge">
                      <i class="fas fa-user-circle has-text-grey fa-6x"></i>
                    </span>
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-5">{{mediaNetwork.name}}</p>
                  <p class="subtitle is-7">{{mediaNetwork.description}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="columns is-desktop is-multiline is-centered"
           v-if="mediaNetwork && mediaNetwork.personas.length > 0">
        <div class="column is-4-desktop"
             v-for="personas in mediaNetwork.personas"
             :key="personas.id">
          <div class="card persona">
            <b-dropdown class="is-pulled-right"
                        position="is-bottom-left">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="editPersona(personas.id)">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Persona</span>
              </b-dropdown-item>
              <b-dropdown-item @click="removePersona(personas.id)">
                <span class="icon is-small">
                  <i class="fas fa-minus-circle has-text-danger"></i>
                </span>
                <span>Remove from Network</span>
              </b-dropdown-item>
            </b-dropdown>
            <div class="card-content"
                 @click="viewPersona(personas.id)">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-96x96"
                          v-if="personas.avatar != null">
                    <img :src="personas.avatar.url.thumb"
                         alt="image"
                         class="is-avatar xl">
                  </figure>
                  <figure class="image is-96x96"
                          v-else>
                    <span class="icon is-xxlarge">
                      <i class="fas fa-user-circle has-text-grey fa-6x"></i>
                    </span>
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-6">{{personas.name}}</p>
                  <p class="subtitle is-7 profile-description">{{personas.role | truncate(70)}}</p>
                  <p class="subtitle is-7"
                     v-if="personas.profiles">{{personas.profiles.length}} Linked Profiles</p>
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <a @click="editPersona(personas.id)"
                 class="card-footer-item">
                Edit
              </a>
              <a @click="viewPersona(personas.id)"
                 class="card-footer-item">
                View Persona
              </a>
            </footer>
          </div>
        </div>
      </div>
      <div v-else>
        <empty-state :data="mediaNetwork.personas"
                     :isLoading='$apollo.loading'>
          <template slot="custom-message">
            <p class="subtitle has-text-centered">No Personas found.</p>
          </template>
        </empty-state>
      </div>
    </div>
    <div v-else>
      <empty-state :data="mediaNetwork"
                   :isLoading='$apollo.loading' />
    </div>
    <media-preview :open="imagePreviewModal"
                   :file="selectedImage"
                   @close="closeModal"></media-preview>
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  MediaNetworkRead,
  MediaNetworksDelete,
  MediaNetworksSubscription,
  MediaNetworksUpdatePersonas,
  MediaNetworksUpdateProfile
} from '@/media/graphql/MediaNetworks.gql'

import { serverError } from '@/shared/serverError'
import MediaPreview from '@/shared/components/mediaPreview'

export default {
  name: 'NetworkView',
  props: ['id'],
  components: {
    MediaPreview,
    HelpContent
  },
  apollo: {
    mediaNetwork: {
      query: MediaNetworkRead,
      variables() {
        return {
          where: { id: this.id }
        }
      },
      subscribeToMore: [
        {
          document: MediaNetworksSubscription,
          // Mutate the previous result
          updateQuery(previousResult, { subscriptionData }) {
            // Mutation type
            let mutationIn = subscriptionData.data.mediaNetwork.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaNetworks: [
                    ...previousResult.mediaNetworks,
                    subscriptionData.data.mediaNetwork.node
                  ]
                }
                break
              }
              case 'DELETED': {
                this.$apollo.queries.mediaNetwork.refetch()
                break
              }
              case 'UPDATED': {
                this.$apollo.queries.mediaNetwork.refetch()
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            // Here, return the new result from the previous with the new data
            return newResult
          }
        }
      ]
    }
  },
  data() {
    return {
      imagePreviewModal: false,
      selectedImage: null,
      open: false
    }
  },
  methods: {
    editNetwork(id) {
      this.$router.push({ name: 'editnetwork', params: { id: id } })
    },
    viewPersona(personaId) {
      this.$router.push({ name: 'viewpersona', params: { id: personaId } })
    },
    editPersona(personaId) {
      this.$router.push({ name: 'editpersona', params: { id: personaId } })
    },
    imagePreview(image) {
      this.imagePreviewModal = true
      this.selectedImage = image
    },
    closeModal() {
      this.imagePreviewModal = false
      this.selectedImage = null
    },
    addToNetwork(profileid) {
      this.$apollo
        .mutate({
          mutation: MediaNetworksUpdateProfile,
          variables: {
            data: {
              profiles: {
                connect: {
                  id: profileid
                }
              }
            },
            where: {
              id: this.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Update Network with Profile: ' + error)
        })
    },
    removePersona(personaid) {
      this.$apollo
        .mutate({
          mutation: MediaNetworksUpdatePersonas,
          variables: {
            data: {
              personas: {
                disconnect: {
                  id: personaid
                }
              }
            },
            where: {
              id: this.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Persona Removed from Network!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Persona Removed from Network: ' + error)
        })
    },
    confirmDeleteNetwork(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Network',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteNetwork(id)
      })
    },
    deleteNetwork(Network) {
      // Delete Network
      this.$apollo
        .mutate({
          mutation: MediaNetworksDelete,
          variables: {
            id: {
              id: Network
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Network Deleted!',
            type: 'is-success'
          })
          this.$router.go(-1)
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Delete Network: ' + error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.focus {
  .card-content figure {
    cursor: pointer;
  }
}
.persona * {
  cursor: pointer;
}
.label {
  .subtitle {
    text-indent: 10px;
  }
}
</style>
