<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Persona</p>
          <button class="delete"
                  aria-label="close"
                  @click="close"></button>
        </header>
        <section class="modal-card-body"
                 v-if="PersonaInfo">
          <div>
            <div class="columns is-multiline">
              <div class="column is-12">
                <p>Default attributes will provide default biodata fields to fill out, while also allowing you to create your own. Use a blank persona to custom label and fill every field.</p>
              </div>
            </div>
            <nav class="level">
              <div class="level-item">
                <button class="button is-primary"
                        @click="useDefault = true; save()">
                  Use Default Attributes
                </button>
              </div>
              <div class="level-item">
                <button class="button is-primary is-outlined"
                        @click="useBlank = true; save()">
                  Use Blank Persona
                </button>
              </div>
              <div class="level-item">
                <a class="button is-primary is-outlined"
                   @click="openQuickPersona()">
                  Quick Create Persona
                </a>
              </div>
            </nav>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button"
             @click="close">
            Cancel
          </a>
        </footer>
      </div>
    </div>
    <persona-quick-add :open="quickAdd"
                       @close="closeQuickPersona" />
  </div>

</template>
<script>
import { MediaPersonasCreate } from '../graphql/MediaPersonas.gql'
import PersonaQuickAdd from '@/media/components/personas-quickadd'

import Vue from 'vue'

export default {
  name: 'persona-create',
  components: {
    PersonaQuickAdd
  },
  props: {
    mediaPersona: {},
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      quickAdd: false,
      searchQuery: '',
      useDefault: false,
      useBlank: false,
      useQuick: false,
      customAttributes: [],
      defaultAttributes: [
        { key: 'Aliases', value: '' },
        { key: 'Sex', value: '' },
        { key: 'Birth Date', value: '' },
        { key: 'Age', value: '' },
        { key: 'Hair Color', value: '' },
        { key: 'Eye Color', value: '' },
        { key: 'Height', value: '' },
        { key: 'Religion', value: '' },
        { key: 'Ethnicity', value: '' },
        { key: 'Current Residence', value: '' },
        { key: 'Hometown', value: '' }
      ],
      PersonaInfo: Vue.util.extend({}, this.mediaPersona),
      PersonaMediaFile: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
      ;(this.customAttributes = []),
        (this.defaultAttributes = [
          { key: 'Aliases', value: '' },
          { key: 'Sex', value: '' },
          { key: 'Birth Date', value: '' },
          { key: 'Age', value: '' },
          { key: 'Hair Color', value: '' },
          { key: 'Eye Color', value: '' },
          { key: 'Height', value: '' },
          { key: 'Religion', value: '' },
          { key: 'Ethnicity', value: '' },
          { key: 'Current Residence', value: '' },
          { key: 'Hometown', value: '' }
        ]),
        (this.useDefault = false)
      this.useBlank = false
      this.PersonaMediaFile = null
    },
    save() {
      let dataAttributes
      if (this.useDefault) {
        dataAttributes = [...this.defaultAttributes, ...this.customAttributes]
      }

      if (this.useBlank) {
        dataAttributes = [...this.customAttributes]
      }

      let data = {
        name: '',
        role: '',
        attributes: {
          create: dataAttributes
        }
      }
      if (this.PersonaMediaFile) {
        // avatar added
        data = Object.assign(data, {
          avatar: this.PersonaMediaFile
        })
      }
      // Create Persona
      this.$apollo
        .mutate({
          mutation: MediaPersonasCreate,
          variables: {
            data: data
          }
        })
        .then(response => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          ;(this.defaultAttributes = [
            { key: 'Aliases', value: '' },
            { key: 'Sex', value: '' },
            { key: 'Birth Date', value: '' },
            { key: 'Age', value: '' },
            { key: 'Hair Color', value: '' },
            { key: 'Eye Color', value: '' },
            { key: 'Height', value: '' },
            { key: 'Religion', value: '' },
            { key: 'Ethnicity', value: '' },
            { key: 'Current Residence', value: '' },
            { key: 'Hometown', value: '' }
          ]),
            (this.PersonaInfo = {})
          this.close()
          this.$router.push({
            name: 'editpersona',
            params: { id: response.data.createMediaPersona.id }
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
          console.error('Create Persona: ' + error)
        })
      return
    },
    openQuickPersona() {
      this.quickAdd = true
    },
    closeQuickPersona() {
      this.quickAdd = false
    }
  }
}
</script>
