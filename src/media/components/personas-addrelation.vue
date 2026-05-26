<template>
  <div class="container is-fluid">
    <epic-modal :open="open"
                @close="close"
                :shouldOverflow="true">
      <template slot="modal-title">
        Add Relationships
      </template>
      <template slot="modal-body"
                v-if="mediaPersona">
        <div class="content">
          <div class="columns is-multiline">
            <div class="column is-8">
              <div class="field">
                <div class="control">
                  <p class="title is-6">{{mediaPersona.name}}</p>
                  <span class="title is-6"> is the </span>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input class="input"
                         name="Relation Type"
                         type="text"
                         placeholder="e.g. mother, father, son, daughter"
                         v-model="relationship"
                         v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('Relation Type') }">
                  <span v-show="errors.has('Relation Type')"
                        class="help is-danger">{{errors.first('Relation Type') }}</span>
                </div>
              </div>
              <div class="field">
                <p class="title is-6">of</p>
                <persona-relation-selector :isModal='true'
                                           @emitValue="setValue($event)"
                                           :errorMessage="showRelationError" />                   
              </div>
            </div>
            <div class="column is-half"
                 v-if="pendingChanges.length > 0">
              <label class="label is-italic">
                Pending Changes
              </label>
              <ul class="bd-anchors-list">
                <li v-for="change in pendingChanges"
                    :key="change.id">
                  <p>
                    <span class="icon">
                      <i :class="change.icon"></i>
                    </span>
                    <span class="title is-6">{{mediaPersona.name}}</span> is
                    <span class="title is-italic is-6">{{change.relationship}}</span> of
                    <span class="title is-6">{{change.name}}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content">
          <label class="label is-italic">
            Linked Relationships
          </label>
          <ul class="bd-anchors-list"
              v-if="mediaPersona.relatesTo">
            <li v-for="relation in mediaPersona.relatesTo"
                :key="relation.id"
                :id="relation.id">
              <p>
                <span class="title is-6">{{relation.start.name}}</span> is
                <span class="title is-italic is-6">{{relation.name}}</span> of
                <span class="title is-6">{{relation.end.name}}</span>
                <span class="icon has-text-grey"
                      @click="removeRelation(relation.id, relation.name, relation.end.name)">
                  <i class="fas fa-times-circle"></i>
                </span>
              </p>

            </li>
          </ul>
          <ul class="bd-anchors-list"
              v-if="mediaPersona.relatesFrom">
            <li v-for="relation in mediaPersona.relatesFrom"
                :key="relation.id"
                :id="relation.id">
              <p>
                <span class="title is-6">{{relation.start.name}}</span> is
                <span class="title is-italic is-6">{{relation.name}}</span> of
                <span class="title is-6">{{relation.end.name}}</span>
                <span class="icon has-text-grey"
                      @click="removeRelation(relation.id, relation.name, relation.end.name)">
                  <i class="fas fa-times-circle"></i>
                </span>
              </p>

            </li>
          </ul>
        </div>
      </template>
      <template slot="modal-footer-buttons">
        <p class="control">
          <a class="button is-primary"
             @click="validateBeforeSubmit(false)">Save</a>
        </p>
        <p class="control">
          <a class="button is-primary is-outlined"
             @click="validateBeforeSubmit(true)">Save &amp; add another</a>
        </p>
      </template>
    </epic-modal>


  </div>
</template>

<script>
import {
  MediaPersonaRead,
  MediaPersonasList,
  MediaPersonasEdgeCreate,
  MediaPersonasEdgeDelete
} from '@/media/graphql/MediaPersonas.gql'

import PersonaRelationSelector from '@/media/components/persona-relationselector'

export default {
  name: 'personas-addrelation',
  components: { PersonaRelationSelector },
  props: {
    id: { type: String },
    open: {
      type: Boolean,
      default: false
    }
  },
  apollo: {
    mediaPersonae: {
      query: MediaPersonasList
    },
    mediaPersona: {
      query: MediaPersonaRead,
      variables() {
        return {
          where: { id: this.id }
        }
      },
      update(data) {
        if (data && data.mediaPersona) {
          return data.mediaPersona
        }
      }
    }
  },
  data() {
    return {
      showRelationError: false,
      pendingChanges: [],
      relationship: '',
      selectedPersona: ''
    }
  },
  methods: {
    clearInputs() {
      this.selectedPersona = ''
      this.relationship = ''
      this.$validator.reset()
    },
    setValue(e) {
      this.showRelationError = false
      this.selectedPersona = e
    },
    close() {
      this.$emit('close')
      this.pendingChanges = []
      this.clearInputs()
    },
    validateBeforeSubmit(multiple) {
      this.$validator.validateAll().then(result => {
        if (result && this.selectedPersona) {
          this.showRelationError = false
          this.addRelation(multiple)
          return
        } else {
          this.showRelationError = true
        }
      })
    },
    addRelation(multiple) {
      let addRelationData = {
        name: this.relationship,
        start: {
          connect: {
            id: this.mediaPersona.id
          }
        },
        end: {
          connect: {
            id: this.selectedPersona.id
          }
        }
      }

      this.$apollo
        .mutate({
          mutation: MediaPersonasEdgeCreate,
          variables: {
            data: addRelationData
          }
        })
        .then(response => {
          if (response && response.data.createMediaPersonaEdge) {
            this.pendingChanges.push({
              id: response.data.createMediaPersonaEdge.id,
              icon: 'fas fa-plus-circle has-text-success',
              name: this.selectedPersona.name,
              relationship: this.relationship
            })
            this.$emit('changes')
            if (multiple == true) {
              this.clearInputs()
            } else {
              this.clearInputs()
              this.close()
            }
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
          console.error('Create Persona: ' + error)
        })
    },
    removeRelation(id, relation, name) {
      this.$apollo
        .mutate({
          mutation: MediaPersonasEdgeDelete,
          variables: {
            where: {
              id: id
            }
          }
        })
        .then(response => {
          if (response && response.data.deleteMediaPersonaEdge) {
            this.pendingChanges.push({
              id: response.data.deleteMediaPersonaEdge.id,
              icon: 'fas fa-minus-circle has-text-danger',
              name: name,
              relationship: relation
            })
            this.$emit('changes')
            document.getElementById(id).style.display = 'none'
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
          console.error('Create Persona: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
ul.bd-anchors-list {
  list-style: none;
  span.icon {
    cursor: pointer;
  }
}
</style>
