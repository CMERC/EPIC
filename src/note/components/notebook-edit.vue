<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Notebook</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">
              Title
            </label>
            <p class="control">
              <input name="Title"
                     v-model="notebook.title"
                     v-validate="{ required: true, max: 64}"
                     :class="{'input': true, 'is-danger': errors.has('Title') }"
                     type="text"
                     placeholder="Title">
              <span v-show="errors.has('Title')"
                    class="help is-danger">{{errors.first('Title') }}</span>
            </p>
          </div>
          <div class="field">
            <label class="label">
              Icon
            </label>
            <div class="control">
              <icon-picker v-model="notebook.icon"></icon-picker>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Color
            </label>
            <div class="control">
              <swatches v-model="notebook.color"
                        colors="material-dark"
                        show-fallback
                        inline></swatches>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="saveNotebook">
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
import RandomMixin from '@/shared/mixins/random'
import helpers from '@/shared/mixins/helpers'
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'
import IconPicker from '@/shared/components/iconpicker'
import {
  NoteBookEditRead,
  NoteBookCreate,
  NoteBookUpdate
} from '../graphql/NoteBook.gql'

export default {
  name: 'notebook-edit',
  props: {
    id: {
      type: String
    },
    open: {
      default: false
    }
  },
  mixins: [RandomMixin, helpers],
  components: {
    Swatches,
    IconPicker
  },
  apollo: {
    noteBook: {
      query: NoteBookEditRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      skip() {
        return this.id == undefined
      },
      update(data) {
        if (data.noteBook != null) {
          this.notebook = JSON.parse(
            JSON.stringify(data.noteBook),
            this.omitTypename
          )
          delete this.notebook.id
          delete this.notebook.createdAt
          delete this.notebook.updatedAt
        }
        return this.notebook
      }
    }
  },
  data() {
    return {
      notebook: {
        title: 'Untitled Notebook',
        color: this.getRandomColor(),
        icon: 'fas fa-book',
        sections: {
          create: {
            title: 'Untitled Section',
            pages: {
              create: {
                title: 'Untitled Page'
              }
            }
          }
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    saveNotebook() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.id !== undefined) {
            this.$apollo
              .mutate({
                mutation: NoteBookUpdate,
                variables: {
                  data: this.notebook,
                  where: { id: this.id }
                }
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
            this.$apollo
              .mutate({
                mutation: NoteBookCreate,
                variables: {
                  data: this.notebook
                }
              })
              .then(response => {
                this.close()
                this.$router.push({
                  path: '/note/' + response.data.createNoteBook.id
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
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
