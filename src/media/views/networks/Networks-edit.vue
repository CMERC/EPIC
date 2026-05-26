<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="mediaNetwork ? mediaNetwork.name : ''" />
    <nav class="level">
      <div class="level-left">
      </div>
      <div class="level-right">
        <help-content reference="media.networksedit"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div v-if="mediaNetwork && mediaNetwork.id != null">
      <div class="columns is-multiline is-centered is-mobile">
        <div class="column is-8-desktop is-three-quarters-tablet is-12-mobile">
          <div class="card"
               v-if="network">
            <b-dropdown position="is-bottom-left"
                        class="is-pulled-right">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="viewNetwork(mediaNetwork.id)">
                <span class="icon is-small">
                  <i class="fas fa-link"></i>
                </span>
                <span>View Network</span>
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
                  <figure class="image is-48x48"
                          v-if="network.avatar != null">
                    <img :src="network.avatar.url.thumb"
                         alt="image"
                         class="is-avatar md">
                  </figure>
                  <figure class="image is-48x48"
                          v-else>
                    <span class="icon is-large">
                      <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                    </span>
                  </figure>
                </div>
                <div class="media-content">
                  <div class="columns is-mobile is-multiline">
                    <div class="column is-12-desktop is-12-tablet is-12-mobile">
                      <label class="label">
                        Name
                        <input type="text"
                               v-model="network.name"
                               class="input" />
                      </label>
                      <label class="label">
                        Description
                        <textarea class="textarea"
                                  v-model="network.description"></textarea>
                      </label>
                    </div>
                    <div class="column">
                      <label class="label">
                        Avatar
                      </label>
                      <ImagePicker v-model="networkMediaFile"
                                   :rootSearch="'avatar'"
                                   :mediaFile="network.avatar" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer class="modal-card-foot">
              <a class="button is-primary"
                 @click="save()">
                Save
              </a>
              <button class="button is-primary is-outlined"
                      @click="cancel()">
                Cancel
              </button>
            </footer>
          </div>
        </div>
      </div>
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <a class="button is-primary"
               @click="openAddPersona(mediaNetwork)">
              Add Personas
            </a>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <span v-if="personasToAdd"
                  class="help has-text-danger"><i class="fas fa-asterisk"></i> Pending updates</span>
          </div>
        </div>
      </nav>
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
              <b-dropdown-item @click="editPersona(mediaPersona)">
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
                 @click="openPersonaPreview(personas)">
              <div class="media">
                <div class="media-left">
                  <figure class="image"
                          v-if="personas.avatar != null">
                    <img :src="personas.avatar.url.thumb"
                         alt="image"
                         class="is-avatar lg">
                  </figure>
                  <figure class="image is-48x48"
                          v-else>
                    <span class="icon is-large">
                      <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                    </span>
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-6">{{personas.name}}</p>
                  <p class="subtitle is-7 profile-description">{{personas.role}}</p>
                  <p class="subtitle is-7"
                     v-if="personas.profiles">{{personas.profiles.length}} Linked Profiles</p>
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <a @click="editPersona(mediaPersona)"
                 class="card-footer-item">
                Edit
              </a>
              <a @click="viewPersona(mediaPersona)"
                 class="card-footer-item">
                View Persona
              </a>
            </footer>
          </div>
        </div>
      </div>
      <div v-else>
        <empty-state :data="mediaNetwork.personas"
                     :search="searchQuery ? true : false"
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
    <persona-create :open="openDialog"
                    @close="toggleCreatePersona(false)" />
    <network-add-persona :open="openPersona"
                         :mediaNetwork="selectedNetwork"
                         @addPersona="handleAddPersona"
                         @close="closeAddPersona" />
  </div>
</template>

<script>
import {
  MediaNetworkRead,
  MediaNetworksDelete,
  MediaNetworksUpdate,
  MediaNetworksSubscription,
  MediaNetworksUpdatePersonas
} from '@/media/graphql/MediaNetworks.gql'

import ImagePicker from '@/shared/components/imagepicker'
import HelpContent from '@/shared/components/helpcontent'
import Vue from 'vue'
import {
  MediaPersonasList,
  MediaPersonaSubscription
} from '@/media/graphql/MediaPersonas.gql'
import PersonaCreate from '@/media/components/personas-create'
import NetworkAddPersona from '@/media/components/networks-addpersona'
import { serverError } from '@/shared/serverError'

export default {
  name: 'NetworkEdit',
  props: ['id'],
  components: {
    HelpContent,
    ImagePicker,
    PersonaCreate,
    NetworkAddPersona
  },
  apollo: {
    mediaNetwork: {
      query: MediaNetworkRead,
      variables() {
        return {
          where: { id: this.id }
        }
      },
      update(data) {
        this.selectedPersonae = data.mediaNetwork.personas
        this.network = Vue.util.extend({}, data.mediaNetwork)
        return data.mediaNetwork
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
    },
    mediaPersonae: {
      query: MediaPersonasList,
      variables() {
        return {
          skip: this.itemsPerPage * (this.paged - 1),
          first: this.itemsPerPage
        }
      },
      subscribeToMore: [
        {
          document: MediaPersonaSubscription,

          // Mutate the previous result
          updateQuery: (previousResult, { subscriptionData }) => {
            // Here, return the new result from the previous with the new data
            let mutationIn = subscriptionData.data.mediaPersona.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaPersonae: [
                    ...previousResult.mediaPersonae,
                    subscriptionData.data.mediaPersona.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  mediaPersonae: [
                    ...previousResult.mediaPersonae.filter(
                      obj =>
                        subscriptionData.data.mediaPersona.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedMediaPersonae = JSON.parse(
                  JSON.stringify(previousResult.mediaPersonae)
                )
                let index = updatedMediaPersonae.findIndex(
                  x => x.id === subscriptionData.data.mediaPersona.node.id
                )
                updatedMediaPersonae[index] =
                  subscriptionData.data.mediaPersona.node
                newResult = {
                  mediaPersonae: updatedMediaPersonae
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
      searchQuery: '',
      selectedPersonae: null,
      openPersona: false,
      selectedNetwork: '',
      networkMediaFile: null,
      network: null,
      mediaPersonae: [],
      openDialog: false,
      personasToAdd: null
    }
  },
  watch: {
    networkMediaFile() {
      if (this.networkMediaFile != null) {
        this.network.avatar = this.networkMediaFile.create
      }
    }
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    viewPersona(persona) {
      this.$router.push({
        name: 'viewpersona',
        params: { id: persona.id }
      })
    },
    editPersona(persona) {
      this.$router.push({ name: 'editpersona', params: { id: persona.id } })
    },
    viewNetwork(id) {
      this.$router.push({ name: 'viewnetwork', params: { id: id } })
    },
    handleAddPersona(persona) {
      this.personasToAdd = persona
    },
    openAddPersona(network) {
      this.selectedNetwork = network
      this.openPersona = true
    },
    closeAddPersona() {
      this.openPersona = false
      this.selectedNetwork = ''
    },
    save() {
      let data = {
        name: this.network.name,
        description: this.network.description
      }
      if (this.networkMediaFile) {
        // avatar added
        data = Object.assign(data, {
          avatar: this.networkMediaFile
        })
      }
      if (this.personasToAdd) {
        let personas = { personas: { connect: this.personasToAdd } }

        data = {
          ...data,
          ...personas
        }
      }
      this.$apollo
        .mutate({
          mutation: MediaNetworksUpdate,
          variables: {
            data: data,
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
          this.networkMediaFile = null
          this.$emit('close')
          this.$router.go(-1)
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Update Network: ' + error)
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
    toggleCreatePersona(value) {
      this.openDialog = value
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
.networks {
  border: 1px solid #e4e4e4;
  & div.column {
    padding: 5px;
  }
}
.is-selected {
  background-color: rgba(63, 65, 191, 0.33);
}
</style>
