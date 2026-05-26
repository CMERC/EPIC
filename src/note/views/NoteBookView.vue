<template>
  <div class="has-background-light">
    <breadcrumb />
    <div class="container section notebook">
      <nav class="level">
        <div class="level-left">
          <h1 class="subtitle has-text-bold is-4">
            {{noteBook ? noteBook.title: ''}}
          </h1>
        </div>
        <div class="level-right">
          <a class="button is-text"
             @click="openEdit(noteBook.id)">
            Edit
          </a>
          <help-content reference="note.view"
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
                <p class="menu-label">
                  {{section.title}}
                </p>
                <ul class="menu-list">
                  <template v-for="page in section.pages">
                    <li :key="page.id">
                      <a @click="selectPage(page)"
                         :class="{'is-active': isPageActive(page)}">
                        {{page.title}}
                      </a>
                    </li>
                  </template>
                </ul>
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
              <h1 class="title is-3">
                {{selectedPage.title}}
              </h1>
              <div class='content ql-editor'
                   v-html="selectedPage.text" />
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
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import { NoteBookRead } from '@/note/graphql/NoteBook.gql'

export default {
  name: 'notes',
  props: {
    notebookID: {
      default: '',
      type: String
    }
  },
  components: { HelpContent },
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
      selectedPage: null
    }
  },
  methods: {
    openEdit(noteBookID) {
      this.$router.push({
        name: 'notebook-editor',
        params: { notebookID: noteBookID, activePage: this.selectedPage }
      })
      this.selectedPage = null
    },
    selectPage(page) {
      this.selectedPage = page
      this.scrollMeTo('page-top')
      this.$nextTick(() => {
        this.hasEdits = false
      })
    },
    isPageActive(page) {
      let result = false
      if (this.selectedPage) {
        result = this.selectedPage.id === page.id
      }
      return result
    },
    scrollMeTo(refName) {
      var element = this.$refs[refName]
      var top = element.offsetTop

      window.scrollTo(0, top)
    }
  },
  watch: {
    noteBook() {
      //check no page is already selected
      if (!this.selectedPage || this.selectedPage.autoSelected) {
        if (
          this.noteBook &&
          this.noteBook.sections.length > 0 &&
          this.noteBook.sections[0].pages.length > 0
        ) {
          //Grab the first page of the notebook as the selected page
          this.selectedPage = this.noteBook.sections[0].pages[0]
          this.selectedPage.autoSelected = true
        }
      }
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
</style>
