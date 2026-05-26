<template>
  <div class="container noteBook">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <a class="button is-primary"
           @click="showModal = true">
          Create Notebook
        </a>
      </div>
      <div class="level-right">
        <help-content :reference="'note.home'"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div class="columns is-multiline is-mobile"
         v-if="noteBooks && noteBooks.length > 0">
      <template v-for="notebook in noteBooks">
        <div class="column is-2-desktop is-2-tablet is-half-mobile"
             v-bind:key="notebook.id">
          <router-link :to="'/note/' + notebook.id">
            <div class="transformWrap">
              <figure>
                <div class="card book cover"
                     :style="'background-color:'+notebook.color">
                  <div class="card-content title has-text-white has-text-centered has-text-shadow">
                    <p>
                      <span class="icon is-large"
                            v-if="notebook.icon"
                            :key="notebook.icon">
                        <i :class="notebook.icon+ ' fa-2x'"></i>
                      </span>
                      <span class="icon is-large"
                            v-else
                            key="book">
                        <i :class="'fas fa-book fa-2x'">
                        </i>
                      </span>
                    </p>
                  </div>
                </div>
                <figcaption :data-tooltip="notebook.title"
                            class="tooltip">
                  <span>{{notebook.title}}</span>
                </figcaption>
              </figure>
            </div>
          </router-link>
        </div>
      </template>
    </div>
    <div class="columns"
         v-else>
      <div class="column">
        <empty-state :data="noteBooks"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="showModal = true">
                Create Notebook
              </a>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
    <NoteFoldersFiles />
    <notebook-edit :open="showModal"
                   @close="showModal = false" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import RandomMixin from '@/shared/mixins/random'
import { NoteBooksRead, NoteBookSubscription } from '../graphql/NoteBook.gql'
import NotebookEdit from '@/note/components/notebook-edit.vue'
import NoteFoldersFiles from '@/note/components/noteFoldersFiles.vue'

export default {
  name: 'notes',
  mixins: [RandomMixin],
  components: {
    HelpContent,
    NotebookEdit,
    NoteFoldersFiles
  },
  apollo: {
    noteBooks: {
      query: NoteBooksRead,
      subscribeToMore: [
        {
          document: NoteBookSubscription,
          // Mutate the previous result
          updateQuery: (previousResult, { subscriptionData }) => {
            // Here, return the new result from the previous with the new data
            let mutationIn = subscriptionData.data.noteBook.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  noteBooks: [
                    ...previousResult.noteBooks,
                    subscriptionData.data.noteBook.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  noteBooks: [
                    ...previousResult.noteBooks.filter(
                      obj =>
                        subscriptionData.data.noteBook.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedResults = JSON.parse(
                  JSON.stringify(previousResult.noteBooks)
                )
                let index = updatedResults.findIndex(
                  x => x.id === subscriptionData.data.noteBook.node.id
                )
                updatedResults[index] = subscriptionData.data.noteBook.node
                newResult = {
                  noteBooks: updatedResults
                }
                break
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
      itemsPerPageNote: 10,
      pagedNote: 1,
      totalNote: 50,
      notes: [],
      notesCount: 0,
      activeNote: {},
      showModal: false
    }
  },
  computed: {
    disableActionButton() {
      return this.errors.has('noteName')
    }
  }
}
</script>


<style lang="scss">
@import '@/styles/ffolders.scss';

.cover {
  width: calc(30vw);
  height: calc(19vh);
  margin: 0 auto;
}

.has-text-shadow {
  text-shadow: -1px -1px 0px rgba(255, 255, 255, 0.3),
    1px 1px 0px rgba(0, 0, 0, 0.8);
}
.cover-empty {
  border-color: grey;
  border-style: dashed;
}

.noteBook {
  figure {
    min-width: 128px;
    max-width: 128px;
  }

  figcaption {
    span {
      font-size: 0.75rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      text-align: center;
    }
  }
}

@media only screen and (min-width: 640px) {
  .cover {
    width: calc(12vw);
    height: calc(19vh);
  }

  .book {
    transform: perspective(100) rotateY(-1deg);
    box-shadow: none;
    margin: 0;
  }

  .book:before,
  .book:after {
    position: absolute;
    top: 2%;
    height: 96%;
    content: ' ';
  }

  .book:before {
    width: 100%;
    left: 7.5%;
  }

  .book:after {
    width: 5%;
    left: 100%;
    background-color: #efefef;
    box-shadow: inset 0px 0px 5px #aaa;
    transform: rotateY(20deg);
    border-radius: 0 6px 6px 0;
  }

  .book:hover {
    transform: perspective(100) rotateY(-3deg);
  }
}

.folder_style1 {
  @include ffolder($small, $pink);
}

.folder_style2 {
  @include ffolder($medium, $yellow);
}

.folder_custom {
  @include ffolder(200px, #a192c3);
}
</style>
