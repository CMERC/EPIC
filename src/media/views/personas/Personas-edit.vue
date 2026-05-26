<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="persona ? persona.name : ''" />
    <nav class="level">
      <div class="level-left">
      </div>
      <div class="level-right">
        <div class="level-item">
          <help-content :reference="'media.personasview'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div v-if="persona && persona.id != null">
      <div class="columns is-centered">
        <div class="column is-full">
          <div class="card">
            <b-dropdown class="is-pulled-right"
                        position="is-bottom-left">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="viewPersona(persona)">
                <span class="icon is-small">
                  <i class="fas fa-link"></i>
                </span>
                <span>View Persona</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDeletePersona(persona.id)">
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
                            <div class="field">
                              <label class="label">
                                Name
                              </label>
                              <div class="control">
                                <input class="input"
                                       v-validate="'required'"
                                       name="personaName"
                                       v-model="persona.name"
                                       :class="{'input': true, 'is-danger': errors.has('persona.personaName')|| !(persona.name.length>0) }" />
                                <span v-show="errors.has('persona.personaName')|| !(persona.name.length>0)"
                                      class="help has-text-danger">Name is required</span>
                              </div>
                            </div>
                            <div class="field">
                              <label class="label">
                                Role
                              </label>
                              <div class="control">
                                <input type="text"
                                       v-model="persona.role"
                                       class="input"
                                       placeholder=""
                                       @change="hasEdits = true" />
                              </div>
                            </div>
                            <div class="field"> <label class="label">
                                                  Avatar
                                                </label>
                              <div class="control">
                                <ImagePicker v-model="personaMediaFile"
                                             :rootSearch="'avatar'"
                                             :mediaFile="persona.avatar"
                                             @change="hasEdits = true" />
                              </div>
                            </div>
                          </article>
                          <article class="tile is-child notification is-white"
                                   key="persona-map-tile">
                            <MapLocationPicker v-model="mapData"
                                               key="persona-map"
                                               @change="hasEdits = true" />
                          </article>
                        </div>
                      </div>
                    </div>
                    <div class="tile is-4 is-parent">
                      <article class="tile is-child notification is-white">
                        <nav class="level">
                          <div class="level-left">
                            <div class="level-item">
                              <a class="button is-primary is-outlined"
                                 @click="addCustomAttribute()">
                                Add Attribute
                              </a>
                            </div>
                          </div>
                        </nav>
                        <div v-if="attributes">
                          <div class="columns">
                            <div class="column attributes">
                              <div class="columns is-mobile"
                                   v-for="(attribute, index) in attributes"
                                   v-bind:key="attribute.id">
                                <div class="column is-5">
                                  <inline-input :label="attribute.key"
                                                v-model="attribute.key">
                                    <p class="title is-6">{{attribute.key}}: </p>
                                  </inline-input>
                                </div>
                                <div class="column is-5">
                                  <inline-input :label="attribute.value"
                                                v-model="attribute.value">
                                    <p class="subtitle is-6">{{attribute.value ? attribute.value : '__________________'}}</p>
                                  </inline-input>
                                </div>
                                <div class="column is-narrow">
                                  <span class="icon is-small removeAtributes">
                                    <a class="button is-danger is-small"
                                       @click="removeAttributes.push(attribute); $delete(attributes, index)">
                                      <i class="far fa-trash-alt"></i>
                                    </a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-if="customAttributes"
                             class="customAttributes">
                          <div class="columns is-mobile"
                               v-for="attribute in customAttributes"
                               v-bind:key="attribute.id">
                            <div class="column is-5">
                              <inline-input :label="attribute.key"
                                            v-model="attribute.key">
                                <p class="title is-6">{{attribute.key}}</p>
                              </inline-input>
                            </div>
                            <div class="column is-5">
                              <inline-input :label="attribute.value"
                                            v-model="attribute.value">
                                <p class="subtitle is-6">{{attribute.value ? attribute.value : '__________________'}}</p>
                              </inline-input>
                            </div>
                            <div class="column is-narrow">
                              <span class="icon is-small removeAtributes">
                                <a class="button is-danger is-small"
                                   @click="removeCustomAttributes(attribute.id)">
                                  <i class="far fa-trash-alt"></i>
                                </a>
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                    <div class="tile is-4 is-parent description">
                      <article class="tile is-child notification is-white">
                        <quill-editor style="min-height:30rem"
                                      ref="quillText"
                                      v-model="persona.description"
                                      :options="editorOption"
                                      @change="hasEdits = true"></quill-editor>
                      </article>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="tile is-ancestor">
                    <div class="tile is-parent is-12 is-vertical">
                      <article class="tile is-child relations notification is-white">
                        <p class="title is-6">Linked Relationships</p>
                        <nav class="level">
                          <div class="level-left">
                            <div class="level-item">
                              <span :class="{'tooltip': !(persona.name && persona.name.length>0) }"
                                    :data-tooltip="!(persona.name && persona.name.length>0) ? 'Add a name to the persona' : ''">
                                <button class="button is-primary is-outlined"
                                        :disabled="!(persona.name && persona.name.length>0)"
                                        @click="openRelation = true">Edit Relationships</button>
                              </span>
                            </div>
                          </div>
                          <div class="level-right">
                            <div class="level-item">
                              <span v-if="relationChanges"
                                    class="help has-text-danger"><i class="fas fa-asterisk"></i> Click save to apply changes</span>
                            </div>
                          </div>
                        </nav>
                        <section class="section">
                          <OrgChart :json="getChartData"
                                    @click-node="clickNode" />
                        </section>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer class="modal-card-foot">
              <span :class="{'tooltip': !(persona.name && persona.name.length>0) }"
                    :data-tooltip="!(persona.name && persona.name.length>0) ? 'Add a name to the persona' : ''">
                <button class="button is-primary"
                        :disabled="!(persona.name && persona.name.length>0)"
                        @click="validateBeforeSubmit">Save</button>
              </span>
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
               @click="toggleProfile()">
              Add Profiles
            </a>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <span v-if="profilesToAdd"
                  class="help has-text-danger"><i class="fas fa-asterisk"></i> Click save to apply changes</span>
          </div>
        </div>
      </nav>
      <div v-if="persona && persona.profiles && persona.profiles.length > 0">
        <p class="title is-6">{{persona.profiles.length}} Linked Profiles</p>
        <div class="columns is-desktop is-multiline">
          <div class="column is-3-desktop"
               v-for="mediaProfile in persona.profiles"
               :key="mediaProfile.id">
            <Profile-Card :profile="mediaProfile"
                          showEdit
                          showPermalink
                          showDeleteFromPersona/>
          </div>
        </div>
      </div>
      <div v-else>
        <empty-state :data="persona.profiles"
                     :isLoading='$apollo.loading'>
          <template slot="custom-message">
            <p class="subtitle has-text-centered">No Profiles found.</p>
          </template>
        </empty-state>
      </div>
    </div>
    <div v-else>
      <empty-state :data="persona && persona.id ? persona : null"
                   :isLoading='$apollo.loading' />
    </div>
    <persona-add-profile v-if="openProfile"
                         :open="openProfile"
                         :mediaPersona="persona"
                         @close="toggleProfile"
                         @addProfile="handleAddProfile" />
    <persona-add-relation v-if="openRelation"
                          :open="openRelation"
                          :id="persona.id"
                          @close="openRelation = false"
                          @changes="handleRelationChanges" />
  </div>
</template>

<script>
import {
  MediaPersonaRead,
  MediaPersonasDelete,
  MediaPersonasUpdate
} from '@/media/graphql/MediaPersonas.gql'

import mediaPost from '@/shared/mixins/mediaPost'
import helpers from '@/shared/mixins/helpers'

import ImagePicker from '@/shared/components/imagepicker'
import ProfileCard from '@/shared/components/profile-card'
import PersonaAddProfile from '@/media/components/personas-addprofile'
import PersonaAddRelation from '@/media/components/personas-addrelation'
import HelpContent from '@/shared/components/helpcontent'
import InlineInput from '@/shared/components/inline-input.vue'
import OrgChart from '@/shared/components/orgchart.vue'
import MapLocationPicker from '@/shared/components/maplocationpicker'

import { serverError } from '@/shared/serverError'

let toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link'],

  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }, { align: [] }] // outdent/indent
]

export default {
  name: 'PersonaEdit',
  mixins: [helpers, mediaPost],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    ProfileCard,
    HelpContent,
    ImagePicker,

    PersonaAddProfile,
    PersonaAddRelation,
    InlineInput,
    OrgChart,
    MapLocationPicker
  },
  apollo: {
    mediaPersona: {
      query: MediaPersonaRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      update(data) {
        if (data && data.mediaPersona) {
          this.persona = Object.assign(
            {},
            data.mediaPersona ? data.mediaPersona : null
          )

          if (this.persona.attributes && this.persona.attributes.length > 0) {
            this.attributes = JSON.parse(
              JSON.stringify(this.persona.attributes),
              this.omitTypename
            )
          }

          if (this.persona.location) {
            delete this.persona.location.id
            this.mapData = JSON.parse(
              JSON.stringify(this.persona.location),
              this.omitTypename
            )
          }
          return data.mediaPersona
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      persona: [],
      hasEdits: false,
      mediaPersona: null,
      mapData: null,
      editorOption: {
        modules: {
          toolbar: toolbarOptions
        }
      },
      attributes: [],
      removeAttributes: [],
      customAttributes: [],
      personaMediaFile: null,
      openProfile: false,
      openRelation: false,
      profilesToAdd: null,
      relationChanges: false
    }
  },
  methods: {
    handleRelationChanges() {
      this.relationChanges = true
    },
    handleAddProfile(profiles) {
      this.profilesToAdd = profiles
    },
    cancel() {
      this.hasEdits = false
      this.$router.go(-1)
    },
    clickNode: function(node) {
      this.$router.push({
        name: 'viewpersona',
        params: { id: node.id }
      })
    },
    viewPersona(persona) {
      this.$router.push({
        name: 'viewpersona',
        params: { id: persona.id }
      })
    },
    toggleProfile() {
      this.openProfile = !this.openProfile
    },
    addCustomAttribute() {
      this.hasEdits = true
      let count = this.customAttributes ? this.customAttributes.length : 0
      this.customAttributes.push({
        id: this.customAttributes.length,
        key: 'Trait ' + count,
        value: ''
      })
    },
    removeCustomAttributes(id) {
      this.customAttributes = this.customAttributes.filter(attribute => {
        if (attribute.id !== id) {
          return attribute
        }
      })
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.save()
          return
        }
        this.$buefy.toast.open({
          message: 'Correct errors!',
          type: 'is-danger'
        })
      })
    },
    async save(goBack = true) {
      this.hasEdits = false

      let data = {
        name: this.persona.name,
        role: this.persona.role,
        description: this.persona.description
      }
      let updateAttributes = []
      let createAttributes = []
      let personaAttributes = {}

      // Handle Deletes first, then fire rest
      if (this.removeAttributes && this.removeAttributes.length > 0) {
        await this.deleteAttributes(this.removeAttributes)
      }

      // Generate Update attribute list
      if (this.attributes && this.attributes.length > 0) {
        for (let i in this.attributes) {
          let insideObj = {
            data: {
              key: this.attributes[i].key,
              value: this.attributes[i].value
            },
            where: {
              id: this.attributes[i].id
            }
          }
          updateAttributes.push(insideObj)
        }
        personaAttributes = {
          update: updateAttributes
        }
      }

      // Generate Create attribute list
      if (this.customAttributes && this.customAttributes.length > 0) {
        for (let i in this.customAttributes) {
          let insideObj = {
            key: this.customAttributes[i].key,
            value: this.customAttributes[i].value
          }
          createAttributes.push(insideObj)
        }
        personaAttributes = {
          ...personaAttributes,
          create: createAttributes
        }
      }
      // add attributes key to data obj
      data = {
        ...data,
        attributes: personaAttributes
      }
      // avatar
      let avatarData
      if (this.personaMediaFile) {
        // mediaFile added
        if (this.personaMediaFile.create || this.personaMediaFile.connect) {
          avatarData = this.personaMediaFile
        } else {
          // if Persona already has avatar, delete
          if (this.personaMediaFile.delete && this.persona.avatar)
            avatarData = { delete: true }
        }
        if (avatarData)
          data = {
            ...data,
            avatar: avatarData
          }
      }
      let dbMapData
      if (this.persona.location) {
        if (this.mapData) {
          // update
          dbMapData = {
            location: {
              update: this.mapData
            }
          }
        } else {
          // delete location
          dbMapData = {
            location: { delete: true }
          }
        }
      } else {
        // create
        if (this.mapData)
          dbMapData = {
            location: {
              create: this.mapData
            }
          }
      }

      if (this.mapData || this.persona.location) {
        data = Object.assign(data, dbMapData)
      }

      if (this.profilesToAdd) {
        let profiles = {
          profiles: { connect: this.profilesToAdd }
        }
        data = {
          ...data,
          ...profiles
        }
      }

      if (this.relationToRemove) {
        data = {
          ...data,
          ...this.relationToRemove
        }
      }
      //update Persona
      this.$apollo
        .mutate({
          mutation: MediaPersonasUpdate,
          variables: {
            data,
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
          this.personaMediaFile = null
          if (goBack) {
            this.$router.go(-1)
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Update Persona: ' + error)
        })
    },
    deleteAttributes(attributes) {
      for (let i = 0; i < attributes.length; i++) {
        this.$apollo
          .mutate({
            mutation: MediaPersonasUpdate,
            variables: {
              data: {
                attributes: {
                  delete: { id: attributes[i].id }
                }
              },
              where: {
                id: this.id
              }
            }
          })
          .then(() => {})
          .catch(error => {
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
            console.error('Update Persona: ' + error)
          })
      }
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
  computed: {
    getChartData() {
      let children
      children = [
        ...(this.persona.relatesFrom || []),
        ...(this.persona.relatesTo || [])
      ]
      //modify and reduce the tree to match the shape of the TreeChart component
      children = children.map(relates => {
        let name = relates.name
        let edge_name = this.persona.name + ' is ' + name + ' of...'
        let node = relates.end
        if (node.id === this.persona.id) {
          node = relates.start
          edge_name = ' ...is ' + name + ' of ' + this.persona.name
        }
        return {
          id: node.id,
          name: node.name,
          image_url: node.avatar ? node.avatar.url.regular : null,
          edge_name
        }
      })
      return {
        edge_name: this.persona.name,
        id: this.persona.id,
        name: this.persona.name,
        image_url: this.persona.avatar ? this.persona.avatar.url.regular : null,
        children: children || []
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasEdits) {
      this.$buefy.dialog.confirm({
        title: 'Unsaved Changes',
        message:
          'Would you like to keep editing this page? Leaving this page will discard unsaved changes.',
        type: 'is-primary',
        confirmText: 'Keep Editing',
        cancelText: 'Discard',
        // eslint-disable-next-line space-before-function-paren
        onConfirm: async () => {
          await next(false)
        },
        onCancel: () => {
          next()
        }
      })
    } else {
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
.field-label .label {
  font-size: 0.85rem;
}
.customAttributes {
  margin-top: 25px;
}
.modal-card-foot *:not(:last-child) {
  margin-right: 0.5em;
}
</style>
