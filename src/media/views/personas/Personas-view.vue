<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="mediaPersona ? mediaPersona.name : ''" />
    <nav class="level">
      <div class="level-left">
        <div class="level-item"
             v-if="mediaPersona">
          <button @click="editPersona(mediaPersona)"
                  class="button is-primary">
            <span>Edit Persona</span>
          </button>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <help-content :reference="'media.personasview'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div v-if="mediaPersona && mediaPersona.id != null">
      <div class="columns is-centered">
        <div class="column is-full"
             v-if="mediaPersona">
          <div class="card">
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
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDeletePersona(mediaPersona.id)">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete Persona</span>
              </b-dropdown-item>
            </b-dropdown>
            <div class="card-content conOp">
              <div class="columns is-multiline is-gapless">
                <div class="column is-full">
                  <div class="tile is-ancestor">
                    <div class="tile is-vertical is-4">
                      <div class="tile">
                        <div class="tile is-parent is-vertical has-text-centered personaLeft">
                          <article class="tile is-child notification is-success personaClass">
                            <p class="title is-5 has-text-white has-text-bold">UNCLASSIFIED</p>
                          </article>
                          <article class="tile is-child notification is-white">
                            <div class="content">
                              <p class="title is-5">
                                {{mediaPersona.name}}
                              </p>
                              <p class="subtitle is-7">
                                {{mediaPersona.role}}
                              </p>
                              <img :src="mediaPersona.avatar.url.thumb"
                                   alt="image"
                                   class="is-avatar xxl"
                                   v-if="mediaPersona.avatar != null"
                                   @click="imagePreview(mediaPersona.avatar)">
                              <span class="icon is-xxlarge"
                                    v-else>
                                <i class="fas fa-user-circle has-text-grey fa-6x"></i>
                              </span>
                            </div>
                          </article>
                          <article class="tile is-child notification is-white">
                            <geocode :coordinates="mediaPersona.location.geojson.coordinates"
                                     v-if="mediaPersona.location"></geocode>
                          </article>
                        </div>
                      </div>
                    </div>
                    <div class="tile is-4 is-parent">
                      <article class="tile notification is-white">
                        <div v-if="mediaPersona && mediaPersona.attributes.length > 0">
                          <p v-for="attributes in mediaPersona.attributes"
                             v-bind:key="attributes.id">
                            <span class="title is-6">{{attributes.key}}</span>: {{attributes.value}}</p>
                        </div>
                        <div v-else>
                          <p>Edit this Persona to create Attributes</p>
                        </div>
                      </article>
                    </div>
                    <div class="tile is-4 is-parent description">
                      <article class="tile notification is-white content">
                        <div v-html="mediaPersona.description"
                             v-if="mediaPersona.description"></div>
                        <div v-else>
                          <h3>Description</h3>
                          <p>None</p>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="tile is-ancestor">
                    <div class="tile is-parent is-12 is-vertical">
                      <article class="tile is-child relations notification is-white">
                        <nav class="level">
                          <div class="level-left">
                            <div class="level-item">
                              <p class="title is-6">Linked Relationships</p>
                            </div>
                          </div>
                          <div class="level-right">
                            <div class="level-item">
                              <div class="field has-addons">
                                <p class="control">
                                  <button class="button"
                                          title="Tree"
                                          @click="relationsView = 'tree'">
                                    <span class="icon is-small">
                                      <i class="fas fa-sitemap has-text-grey"></i>
                                    </span>
                                  </button>
                                </p>
                                <p class="control">
                                  <button class="button"
                                          title="List"
                                          @click="relationsView = 'list'">
                                    <span class="icon is-small">
                                      <i class="fas fa-align-justify has-text-grey"></i>
                                    </span>
                                  </button>
                                </p>
                              </div>
                            </div>
                          </div>
                        </nav>
                        <section class="section">
                          <div v-if="relationsView=='tree'">
                            <OrgChart :json="treeChart"
                                      @click-node="clickNode" />
                          </div>
                          <div v-if="relationsView=='list'">
                            <ul class="bd-anchors-list"
                                v-if="mediaPersona.relatesTo">
                              <li v-for="relation in mediaPersona.relatesTo"
                                  v-bind:key="relation.id">
                                <p>
                                  <span class="title is-6">{{relation.start.name}}</span> is
                                  <span class="title is-italic is-6">{{relation.name}}</span> of
                                  <span class="title is-6">{{relation.end.name}}</span>
                                </p>

                              </li>
                            </ul>
                            <ul class="bd-anchors-list"
                                v-if="mediaPersona.relatesFrom">
                              <li v-for="relation in mediaPersona.relatesFrom"
                                  v-bind:key="relation.id">
                                <p>
                                  <span class="title is-6">{{relation.start.name}}</span> is
                                  <span class="title is-italic is-6">{{relation.name}}</span> of
                                  <span class="title is-6">{{relation.end.name}}</span>
                                </p>

                              </li>
                            </ul>
                          </div>

                        </section>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="mediaPersona && mediaPersona.profiles && mediaPersona.profiles.length > 0">
        <p class="title is-6">{{mediaPersona.profiles.length}} Linked Profiles</p>
        <div class="columns is-desktop is-multiline">
          <div class="column is-3-desktop"
               v-for="mediaProfile in mediaPersona.profiles"
               :key="mediaProfile.id">
            <Profile-Card :profile="mediaProfile"
                          showEdit
                          showPermalink
                          showDeleteFromPersona/>
          </div>
        </div>
      </div>
      <div v-else>
        <empty-state :data="mediaPersona.profiles"
                     :isLoading='$apollo.loading'>
          <template slot="custom-message">
            <p class="subtitle has-text-centered">No Profiles found.</p>
          </template>
        </empty-state>
      </div>
      <div v-if="mediaPersona">
        <media-preview :open="imagePreviewModal"
                       :file="selectedImage"
                       @close="closeModal"></media-preview>
      </div>
    </div>
    <div v-else>
      <empty-state :data="mediaPersona"
                   :isLoading='$apollo.loading' />
    </div>
  </div>
</template>

<script>
import ProfileCard from '@/shared/components/profile-card'

import {
  MediaPersonaRead,
  MediaPersonasDelete
} from '@/media/graphql/MediaPersonas.gql'
import helpers from '@/shared/mixins/helpers'

import mediaPost from '@/shared/mixins/mediaPost'
import { serverError } from '@/shared/serverError'
import MediaPreview from '@/shared/components/mediaPreview'
import HelpContent from '@/shared/components/helpcontent'
import OrgChart from '@/shared/components/orgchart.vue'
import Geocode from '@/shared/components/geocode'
export default {
  name: 'PersonasView',
  mixins: [helpers, mediaPost],
  props: ['id'],
  components: {
    ProfileCard,
    HelpContent,
    MediaPreview,
    OrgChart,
    Geocode
  },
  apollo: {
    mediaPersona: {
      query: MediaPersonaRead,
      variables() {
        return {
          where: { id: this.id }
        }
      }
    }
  },
  data() {
    return {
      relationsView: 'tree',
      imagePreviewModal: false,
      selectedImage: null,
      open: false,
      openPost: false
    }
  },
  methods: {
    viewPersona(persona) {
      this.$router.push({
        name: 'viewpersona',
        params: { id: persona.id }
      })
    },
    editPersona(persona) {
      this.$router.push({ name: 'editpersona', params: { id: persona.id } })
    },
    clickNode: function(node) {
      this.$router.push({
        name: 'viewpersona',
        params: { id: node.id }
      })
    },
    imagePreview(image) {
      this.imagePreviewModal = true
      this.selectedImage = image
    },
    closeModal() {
      this.imagePreviewModal = false
      this.selectedImage = null
    },
    deletePersona(id) {
      this.$apollo
        .mutate({
          mutation: MediaPersonasDelete,
          variables: {
            where: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Persona Deleted!',
            type: 'is-success'
          })
          this.$router.go(-1)
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Persona Deleted: ' + error)
        })
    },
    confirmDeletePersona(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Persona',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePersona(id)
      })
    }
  },
  watch: {
    mediaPersona() {
      if (!this.mediaPersona) return

      this.treeChart = [
        ...(this.mediaPersona.relatesFrom || []),
        ...(this.mediaPersona.relatesTo || [])
      ]

      //modify and reduce the tree to match the shape of the TreeChart component
      this.treeChart = this.treeChart.map(relates => {
        let name = relates.name
        let edge_name = this.mediaPersona.name + ' is ' + name + ' of...'
        let node = relates.end
        if (node.id === this.mediaPersona.id) {
          node = relates.start
          edge_name = ' ...is ' + name + ' of ' + this.mediaPersona.name
        }
        return {
          id: node.id,
          name: node.name,
          image_url: node.avatar ? node.avatar.url.regular : null,
          edge_name
        }
      })

      this.treeChart = {
        edge_name: this.mediaPersona.name,
        id: this.mediaPersona.id,
        name: this.mediaPersona.name,
        image_url: this.mediaPersona.avatar
          ? this.mediaPersona.avatar.url.regular
          : null,
        children: this.treeChart
      }
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
.label {
  .subtitle {
    text-indent: 10px;
  }
}
</style>
