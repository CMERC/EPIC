<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{isCreateNewFolder?'Create':'Edit'}} Folder</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="noteFolder">
          <div class="field">
            <label class="label">
              Name
            </label>
            <p class="control">
              <input name="Name"
                     v-model="noteFolder.name"
                     v-validate="{ required: true, max: 64}"
                     :class="{'input': true, 'is-danger': errors.has('Name') }"
                     type="text"
                     placeholder="Name">
              <span v-show="errors.has('Name')"
                    class="help is-danger">{{errors.first('Name') }}</span>
            </p>
          </div>
          <div class="field">
            <label class="label">
              Color
            </label>
            <div class="control">
              <swatches v-model="noteFolder.color"
                        colors="material-dark"
                        show-fallback
                        inline></swatches>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="saveNoteFolder">
            Save
          </button>
          <button class="button"
                  @click="close()">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import Swatches from 'vue-swatches'
import { NoteFolderCreate, NoteFolderUpdate } from '../graphql/NoteFolder.gql'

export default {
  name: 'notefolder-edit',
  props: {
    isCreateNewFolder: {
      default: true
    },
    open: {
      default: false
    },
    folder: {
      type: Object
    },
    folderType: {
      type: String
    }
  },
  components: {
    Swatches
  },
  data() {
    return {
      noteFolder: {
        name: null,
        color: ''
      }
    }
  },
  watch: {
    open() {
      this.noteFolder =
        this.isCreateNewFolder === true
          ? {
              name: 'Untitled Folder',
              color: ''
            }
          : this.folder
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    saveNoteFolder() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let noteFolderData = {
            name: this.noteFolder.name,
            color: this.noteFolder.color
          }
          let variablesData
          if (this.isCreateNewFolder) {
            if (this.folderType !== 'root') {
              variablesData = {
                data: {
                  folders: {
                    create: noteFolderData
                  }
                },
                where: { id: this.folderType }
              }
              this.$apollo
                .mutate({
                  mutation: NoteFolderUpdate,
                  variables: variablesData
                })
                .then(() => {
                  this.close()
                })
                .catch(error => {
                  console.error(error)
                  this.$buefy.toast.open({
                    message: error.message,
                    type: 'is-danger'
                  })
                })
            } else {
              // Create folder in root
              this.$apollo
                .mutate({
                  mutation: NoteFolderCreate,
                  variables: {
                    data: noteFolderData
                  }
                })
                .then(response => {
                  if (response) {
                    this.close()
                    this.$router.push({
                      path: '/note/'
                    })
                  }
                })
                .catch(error => {
                  console.error(error)
                  this.$buefy.toast.open({
                    message: error.message,
                    type: 'is-danger'
                  })
                })
            }
          } else {
            this.$apollo
              .mutate({
                mutation: NoteFolderUpdate,
                variables: {
                  data: noteFolderData,
                  where: { id: this.noteFolder.id }
                }
              })
              .then(() => {
                this.close()
                this.$buefy.toast.open({
                  message: 'Folder settings updated successfully.',
                  type: 'is-success'
                })
              })
              .catch(error => {
                console.error(error)
                this.$buefy.toast.open({
                  message: error.message,
                  type: 'is-danger'
                })
              })
          }
          return
        }
      })
    }
  }
}
</script>
