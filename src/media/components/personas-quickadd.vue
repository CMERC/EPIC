<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="cancel"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Quick Create Persona</p>
          <button class="delete"
                  aria-label="close"
                  @click="cancel"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns is-mobile is-multiline">
            <div class="column is-12">
              <div class="field">
                <label class="label">
                  Name
                </label>
                <div class="control">
                  <input type="text"
                         v-model="quickPersona.name"
                         name="name"
                         class="input"
                         v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('name') }" />
                  <span v-show="errors.has('name')"
                        class="help has-text-danger">{{errors.first('name') }}</span>
                </div>
              </div>
              <div class="field">
                <label class="label">
                  Role
                </label>
                <div class="control">
                  <input type="text"
                         v-model="quickPersona.role"
                         name="role"
                         class="input"
                         v-validate="'required'"
                         :class="{'input': true, 'is-danger': errors.has('role') }" />
                  <span v-show="errors.has('role')"
                        class="help has-text-danger">{{errors.first('role') }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             @click="save"
             :disabled="disableActionButton">
            Save
          </a>
          <a class="button"
             @click="cancel">
            Cancel
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import { MediaPersonasCreate } from '../graphql/MediaPersonas.gql'

export default {
  name: 'persona-quickadd',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      quickPersona: [{ name: '' }, { role: '' }]
    }
  },
  methods: {
    cancel() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
      this.quickPersona.name = ''
      this.quickPersona.role = ''
    },
    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let data = {
            name: this.quickPersona.name,
            role: this.quickPersona.role
          }
          // Create Network
          this.$apollo
            .mutate({
              mutation: MediaPersonasCreate,
              variables: {
                data: data
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.cancel()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: error.message,
                type: 'is-danger'
              })
              console.error('Create Persona: ' + error)
              this.cancel()
            })
          return
        }
      })
    }
  },
  computed: {
    disableActionButton() {
      return (this.errors && this.errors.items && this.errors.items.length > 0) 
    }
  }
}
</script>
