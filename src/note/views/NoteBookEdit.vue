<template>
  <div class="has-background-light">
    <breadcrumb />
    <div class="container section notebook">
      <nav class="level">
        <div class="level-left">
          <h1 class="subtitle has-text-bold is-4">
            {{noteBook ? noteBook.title : ''}}
          </h1>
        </div>
        <div class="level-right">
          <a class="button is-text"
             @click="saveAndClose()">
            Save and Close
          </a>
          <b-dropdown position="is-bottom-left">
            <a class="button"
               slot="trigger">
              <span class="icon is-small">
                <i class="fas fa-ellipsis-v"></i>
              </span>
            </a>
            <b-dropdown-item @click="editNotebook">
              <span class="icon is-small">
                <i class="fas fa-pen"></i>
              </span>
              <span>Edit Title</span>
            </b-dropdown-item>
            <b-dropdown-item @click="addSection">
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>
              <span>Add Section</span>
            </b-dropdown-item>
            <hr class="dropdown-divider">
            <b-dropdown-item @click="confirmNotebookDelete(noteBook)">
              <span class="icon is-small">
                <i class="fas fa-times has-text-danger"></i>
              </span>
              <span>Delete Notebook</span>
            </b-dropdown-item>
          </b-dropdown>
          <help-content reference="note.edit"
                        toggle
                        dropdown />
        </div>
      </nav>
      <div class="columns"
           v-if="noteBook && noteBook.id != null">
        <div class="column is-narrow">
          <aside class="menu">
            <template v-for="section in noteBook.sections">
              <div :key="section.id">
                <p>
                  <span class="menu-label">{{section.title}}</span>
                  <span class="is-pulled-right">
                    <b-dropdown>
                      <template slot="trigger">
                        <span class="icon is-small is-size-7">
                          <i class="fas fa-ellipsis-v"></i>
                        </span>
                      </template>
                      <b-dropdown-item @click="editSection(section)">
                        <span class="icon is-small">
                          <i class="fas fa-pen"></i>
                        </span>
                        <span>Edit Section Title</span>
                      </b-dropdown-item>
                      <b-dropdown-item @click="addSection">
                        <span class="icon is-small">
                          <i class="fas fa-plus"></i>
                        </span>
                        <span>Add Section</span>
                      </b-dropdown-item>
                      <hr class="dropdown-divider">
                      <b-dropdown-item @click="addPage(section)">
                        <span class="icon is-small">
                          <i class="fas fa-plus"></i>
                        </span>
                        <span>Add Page</span>
                      </b-dropdown-item>
                      <hr class="dropdown-divider">
                      <b-dropdown-item @click="confirmSectionDelete(section)">
                        <span class="icon is-small">
                          <i class="fas fa-times has-text-danger"></i>
                        </span>
                        <span>Delete Section and Pages</span>
                      </b-dropdown-item>
                    </b-dropdown>
                  </span>
                </p>
                <ul class="menu-list section-pages">
                  <li v-for="page in section.pages"
                      :key="page.id">
                    <a @click="checkSelectPage(page)"
                       :class="{'is-active': isPageActive(page)}">
                      {{page.title}}
                    </a>
                  </li>
                </ul>
                <b-dropdown>
                  <a class="button is-primary"
                     slot="trigger">
                    <span class="icon">
                      <i class="fas fa-plus-circle"></i>
                    </span>
                    <label>New</label>
                    <span class="icon">
                      <i class="fas fa-angle-down"></i>
                    </span>
                  </a>
                  <b-dropdown-item>
                    <a @click="addPage(section)">
                      <span class="icon">
                        <i class='fas fa-plus-circle fa-2x'></i>
                      </span>
                      Add Page
                    </a>
                  </b-dropdown-item>
                  <b-dropdown-item>
                    <a @click="addSection">
                      <span class="icon">
                        <i class='fas fa-plus-circle fa-2x'></i>
                      </span>
                      Add Section
                    </a>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </template>
          </aside>
        </div>
        <div class="column is-paddingless">
          <div ref="page-top"
               class="is-hidden-desktop" />
          <div class="box has-background-white"
               style="padding: 3vh 3vw">
            <template v-if="selectedPage">
              <button class="button"
                      @click="savePage">
                <span class="icon is-medium">
                  <i class="far fa-save fa-2x"></i>
                </span>
              </button>
              <span class="is-pulled-right">
                <b-dropdown position="is-bottom-left">
                  <template slot="trigger">
                    <button class="button">
                      <span class="icon is-medium">
                        <i class="fas fa-ellipsis-v"></i>
                      </span>
                    </button>
                  </template>
                  <b-dropdown-item @click="confirmPageDelete(selectedPage)">
                    <span class="icon is-medium">
                      <i class="fas fa-times has-text-danger"></i>
                    </span>
                    <span>Delete Page</span>
                  </b-dropdown-item>
                </b-dropdown>
              </span>
              <br>
              <br>
              <input v-model="selectedPage.title"
                     type="text"
                     class="input title"
                     @change="onChange" />

              <quill-editor class="content"
                            ref="quillText"
                            v-model="selectedPage.text"
                            :options="editorOption"
                            rows="23"
                            cols="50"
                            @change="onChange">
              </quill-editor>
            </template>
          </div>
        </div>
      </div>
      <div v-else>
        <empty-state :data="noteBook"
                     :isLoading='$apollo.loading' />
      </div>
    </div>
    <back-to-top bottom="20px"
                 right="20px">
      <button type="button"
              class="button">
        <span class="icon is-small">
          <i class="fas fa-arrow-up"></i>
        </span>
      </button>
    </back-to-top>
    <notebook-edit :open="showModal"
                   :id="notebookID"
                   @close="closeEditNotebook" />
    <title-edit v-model="selectedSection.title"
                :open="showTitleEdit"
                @save="saveSection"
                @close="closeSection" />
  </div>
</template>

<script>
import {
  NoteBookRead,
  NoteBookUpdate,
  NoteBookDelete
} from '../graphql/NoteBook.gql'
import {
  NoteSectionDelete,
  NoteSectionUpdate
} from '../graphql/NoteSection.gql'
import {
  NotePageCreate,
  NotePageUpdate,
  NotePageDelete
} from '../graphql/NotePage.gql'
import HelpContent from '@/shared/components/helpcontent'
import NotebookEdit from '@/note/components/notebook-edit.vue'

import TitleEdit from '@/note/components/title-edit.vue'

let toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link'],

  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }, { align: [] }] // outdent/indent
]

export default {
  name: 'notes',
  props: {
    notebookID: {
      default: '',
      type: String
    },
    activePage: Object
  },
  components: {
    HelpContent,
    NotebookEdit,
    TitleEdit
  },
  apollo: {
    noteBook: {
      query: NoteBookRead,
      variables() {
        return {
          where: {
            id: this.notebookID
          }
        }
      },
      update(data) {
        return JSON.parse(JSON.stringify(data.noteBook), this.omitTypename)
      }
    }
  },
  data() {
    return {
      selectedPage: null,
      hasEdits: false,
      editorOption: {
        modules: {
          toolbar: toolbarOptions
        }
      },
      showModal: false,
      showTitleEdit: false,
      selectedSection: {
        id: '',
        title: 'Untitled'
      },
      undoClicked: false
    }
  },
  methods: {
    async saveAndClose() {
      await this.savePage()
      this.hasEdits = false
      this.$apollo.queries.noteBook.refetch()
      this.$router.push({
        path: '/note/' + this.notebookID
      })
    },
    isPageActive(page) {
      let result = false
      if (this.selectedPage) {
        result = this.selectedPage.id === page.id
      }
      return result
    },
    onChange() {
      this.hasEdits = true
    },
    openEdit(noteBookID) {
      this.$router.push({
        name: 'notebook-edit',
        params: { notebookID: noteBookID }
      })
    },
    async savePage() {
      let data = {
        title: this.selectedPage.title,
        text: this.selectedPage.text
      }
      await this.$apollo
        .mutate({
          mutation: NotePageUpdate,
          variables: {
            data: data,
            where: {
              id: this.selectedPage.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          this.hasEdits = false
          this.$apollo.queries.noteBook.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
        })
    },
    checkSelectPage(page) {
      if (this.hasEdits) {
        this.$buefy.dialog.confirm({
          title: 'Unsaved Changes',
          message: `Would you like to save your changes?`,
          type: 'is-primary',
          confirmText: 'Save',
          // eslint-disable-next-line space-before-function-paren
          onConfirm: async () => {
            await this.savePage()
            this.selectPage(page)
          }
        })
      } else {
        this.selectPage(page)
      }
    },
    selectPage(page) {
      this.selectedPage = page
      this.scrollMeTo('page-top')
      this.$nextTick(() => {
        this.hasEdits = false
      })
    },
    scrollMeTo(refName) {
      var element = this.$refs[refName]
      var top = element.offsetTop

      window.scrollTo(0, top)
    },
    editNotebook() {
      this.showModal = true
    },
    closeEditNotebook() {
      this.showModal = false
      this.$apollo.queries.noteBook.refetch()
    },
    addPage(section) {
      let data = {
        title: 'Untitled',
        section: {
          connect: {
            id: section.id
          }
        }
      }
      this.$apollo
        .mutate({
          mutation: NotePageCreate,
          variables: {
            data: data
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          this.$apollo.queries.noteBook.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
        })
    },
    addSection() {
      this.selectedSection = {
        id: '',
        title: 'Untitled'
      }
      this.showTitleEdit = true
    },
    editSection(section) {
      this.selectedSection = section
      this.showTitleEdit = true
    },
    closeSection() {
      this.showTitleEdit = false
      this.$apollo.queries.noteBook.refetch()
    },
    saveSection() {
      if (!this.selectedSection.id) {
        //Create Section
        this.$apollo
          .mutate({
            mutation: NoteBookUpdate,
            variables: {
              data: {
                sections: {
                  create: {
                    title: this.selectedSection.title,
                    pages: {
                      create: {
                        title: 'Untitled'
                      }
                    }
                  }
                }
              },
              where: {
                id: this.noteBook.id
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.$apollo.queries.noteBook.refetch()
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: error.message,
              type: 'is-danger'
            })
          })
      } else {
        //Update Section
        this.$apollo
          .mutate({
            mutation: NoteSectionUpdate,
            variables: {
              where: {
                id: this.selectedSection.id
              },
              data: {
                title: this.selectedSection.title
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.$apollo.queries.noteBook.refetch()
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: error.message,
              type: 'is-danger'
            })
          })
      }
    },
    confirmSectionDelete(section) {
      this.$buefy.dialog.confirm({
        title: 'Delete Section',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteNoteSection(section.id)
      })
    },
    deleteNoteSection(sectionId) {
      this.$apollo
        .mutate({
          mutation: NoteSectionDelete,
          variables: {
            id: {
              id: sectionId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Note Section Deleted!',
            type: 'is-success'
          })
          this.$apollo.queries.noteBook.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
        })
    },
    confirmPageDelete(page) {
      this.$buefy.dialog.confirm({
        title: 'Delete Page',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePage(page.id)
      })
    },
    async deletePage(pageId) {
      this.$apollo
        .mutate({
          mutation: NotePageDelete,
          variables: {
            id: {
              id: pageId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Page Deleted',
            type: 'is-success'
          })
          this.selectedPage.autoSelected = true
          this.$apollo.queries.noteBook.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
          console.error('Error deleting page: ' + error)
        })
    },
    confirmNotebookDelete(notebook) {
      this.$buefy.dialog.confirm({
        title: 'Delete Notebook "' + notebook.title + '"',
        message: `This will delete all sections and pages out of this notebook. Are you sure you want to do this?`,
        type: 'is-danger',
        onConfirm: () => this.deleteNotebook(notebook.id)
      })
    },
    deleteNotebook() {
      this.$apollo
        .mutate({
          mutation: NoteBookDelete,
          variables: {
            where: {
              id: this.notebookID
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Deleted',
            type: 'is-warning'
          })
          this.$router.push('/note')
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
          console.error(error)
        })
    }
  },
  watch: {
    noteBook() {
      //check no page is already selected
      if (!this.selectedPage || this.selectedPage.autoSelected) {
        if (this.activePage) this.selectedPage = this.activePage
        else {
          if (
            this.noteBook &&
            this.noteBook.sections.length > 0 &&
            this.noteBook.sections[0].pages.length > 0
          ) {
            //Grab the first page of the notebook as the selected page
            this.selectedPage = this.noteBook.sections[0].pages[0]
          }
        }
        this.selectedPage.autoSelected = true
        this.hasEdits = false
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
ul.menu-list a.is-active {
  background-color: #34495e;
}

.notebook {
  min-height: calc(100vh - 52px);
}
.section-pages {
  .is-active {
    margin-bottom: 5px;
  }
}
</style>
