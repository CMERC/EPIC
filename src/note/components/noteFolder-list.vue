<template>
  <div class="container is-fluid noteFolderselect">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card"
           v-if="open">
        <header class="modal-card-head">
          <p class="modal-card-title">Move {{fileType}} - {{movingFileOrFolder.name?movingFileOrFolder.name:movingFileOrFolder.file.name}}</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <div class="field"
               v-if="showSubFolders == false"
               :set="isParentRoot=(fileType==='Folder'?!movingFileOrFolder.parent:!movingFileOrFolder.folder)">
            <div class="has-addons has-hoverable topLevel tooltip is-tooltip-bottom"
                 :class="{'is-active': selectedFolder === 'Root'}"
                 :data-tooltip="isParentRoot ? 'The folder/file is currently located here':'Select Folder'">
              <a class="control is-expanded"
                 :class="{'no-allowed-cursor':isParentRoot}">
                <div @click="selectedFolder = 'Root'"
                     :disabled="isParentRoot">
                  <span class="icon">
                    <i class="fas fa-folder-open"></i>
                  </span>
                  <span><em>{{$store.state.activeWorkspace.displayName}} Files</em></span>
                </div>
              </a>
            </div>
          </div>
          <div class="field"
               v-else-if='noteFolder'>
            <div class="control is-expanded"
                 :set="isSameFlagNode= isSameFolderOrParent(noteFolder, false)">
              <div class="field has-addons has-hoverable topLevel"
                   :set="isParentNode=isSameFolderOrParent(noteFolder, true)"
                   :class="{'is-active': isActive(noteFolder.id)}">
                <div class="control">
                  <a v-if="noteFolder"
                     @click="openFolder(noteFolder.parent)">
                    <span class="icon">
                      <i class="fas fa-chevron-left"></i>
                    </span>
                  </a>
                  <a @click="showRootLevel"
                     v-else>
                    <span class="icon">
                      <i class="fas fa-chevron-left"></i>
                    </span>
                  </a>
                </div>
                <a class="control is-expanded tooltip is-tooltip-bottom"
                   :class="{'no-allowed-cursor':isSameFlagNode||isParentNode}"
                   :data-tooltip="isSameFlagNode ? toolTips.sameFolder:(isParentNode?toolTips.parentFolder: toolTips.selectFolder)">
                  <div @click="selectedFolder = noteFolder"
                       :disabled="isSameFlagNode||isParentNode">
                    <span class="icon"
                          :style="noteFolder.color?'color:'+noteFolder.color:''">
                      <i class="fas fa-folder-open"></i>
                    </span>
                    <span><em>{{noteFolder.name}}</em></span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <ul class="is-list-none subFolders"
              v-if="getFoldersList && getFoldersList.length>0">
            <li v-for="subFolder in getFoldersList"
                :key='subFolder.id'
                :class="{'is-active': isActive(subFolder.id)}"
                :set="isSameFlag = isSameFolderOrParent(subFolder, false)">
              <div class="field has-addons has-hoverable"
                   :set="isParent=isSameFolderOrParent(subFolder, true)">
                <a class="control is-expanded tooltip"
                   :class="{'no-allowed-cursor':isSameFlag||isParent}"
                   :data-tooltip="isSameFlag ? toolTips.sameFolder:(isParent?toolTips.parentFolder: toolTips.selectFolder)">
                  <div @click="selectedFolder = subFolder"
                       :disabled="isSameFlag||isParent">
                    <span class="icon"
                          :style="subFolder.color?'color:'+subFolder.color:''">
                      <i class="fas fa-folder"></i>
                    </span>
                    <span>{{subFolder.name}}</span>
                  </div>
                </a>
                <div class="has-show-on-hover control"
                     :class="{'tooltip is-tooltip-left':!isSameFlag}"
                     :data-tooltip="'Go to Folder '+subFolder.name">
                  <button class="button is-small"
                          :disabled="isSameFlag"
                          @click="openFolder(subFolder)">></button>
                </div>
              </div>
            </li>
          </ul>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="select"
                  :disabled="!(selectedFolder&&(selectedFolder.id||selectedFolder==='Root'))">
            Move
          </button>
          <button class="button"
                  @click="close">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { NoteFoldersRead, NoteFolderRead } from '../graphql/NoteFolder.gql'

export default {
  name: 'notefolder-list',
  props: {
    open: {
      default: false
    },
    movingFileOrFolder: {
      type: Object,
      default: null
    },
    fileType: {
      type: String,
      default: 'Folder'
    }
  },
  apollo: {
    noteFolders: {
      query: NoteFoldersRead,
      variables() {
        return {
          where: {
            OR: [{ name_contains: this.searchQuery }],
            AND: [{ parent: null }]
          },
          orderBy: 'name_ASC',
          first: this.first
        }
      },
      update(data) {
        if (data && data.noteFolders) {
          return data.noteFolders
        }
      }
    },
    noteFolder: {
      query: NoteFolderRead,
      variables() {
        return {
          where: {
            id: this.browseFolder.id
          }
        }
      },
      update(data) {
        if (data && data.noteFolder) {
          return data.noteFolder
        }
      },
      skip() {
        return !this.showSubFolders
      }
    }
  },
  data() {
    return {
      browseFolder: null,
      showSubFolders: false,
      searchQuery: '',
      selectedFolder: null,
      first: 75,
      showAll: false,
      toolTips: {
        sameFolder: 'Cannot move the folder onto itself',
        parentFolder: 'The folder/file is currently located here',
        selectFolder: 'Select Folder'
      }
    }
  },
  watch: {
    movingFileOrFolder() {
      let parentFolder
      if (this.movingFileOrFolder) {
        if (this.movingFileOrFolder.parent)
          parentFolder = this.movingFileOrFolder
        else if (this.movingFileOrFolder.folder)
          parentFolder = this.movingFileOrFolder.folder
      }
      if (parentFolder) {
        this.openFolder(parentFolder)
      }
    }
  },
  updated() {
    this.$apollo.queries.noteFolders.refetch()
  },
  methods: {
    isSameFolderOrParent(folder, checkingIsParent) {
      let disabled = false
      if (this.movingFileOrFolder && folder) {
        if (checkingIsParent) {
          if (this.fileType === 'Folder')
            return (
              this.movingFileOrFolder.parent &&
              this.movingFileOrFolder.parent.id === folder.id
            )
          else
            return (
              this.movingFileOrFolder.folder &&
              this.movingFileOrFolder.folder.id === folder.id
            )
        } else
          return (
            this.fileType === 'Folder' &&
            folder.id === this.movingFileOrFolder.id
          )
      }
      return disabled
    },
    isActive(id) {
      let active = false
      if (!id || !this.selectedFolder) return active
      else if (id === 'Root' || this.selectedFolder.id === id) return true

      return active
    },
    showRootLevel() {
      this.noteFolder = null
      this.showSubFolders = false
    },
    openFolder(folder) {
      this.showSubFolders = true
      if (!folder) this.showRootLevel()
      else this.browseFolder = folder
    },
    //Feature not currently implemented
    toggleList(state) {
      this.showAll = state
      if (state == true) {
        this.first = null
      } else {
        this.first = 75
      }
    },
    close() {
      this.$emit('close')
      this.selectedFolder = null
    },
    select() {
      let data = {
        fileId: this.movingFileOrFolder.id,
        fileType: this.fileType,
        selectedFolder: this.selectedFolder.id || this.selectedFolder
      }
      this.$emit('select', data)
      this.close()
    }
  },
  computed: {
    getFoldersList() {
      if (this.showSubFolders == false) return this.noteFolders
      else if (this.noteFolder) return this.noteFolder.folders

      return []
    }
  }
}
</script>

<style lang="scss">
.noteFolderselect {
  .no-allowed-cursor {
    cursor: not-allowed;
  }
  div[disabled] {
    pointer-events: none;
  }
  ul.rootLevel,
  ul.subFolders {
    text-indent: 0.5rem;
    & li {
      padding: 0.5rem;
      &:hover {
        cursor: pointer;
        background-color: #d7dcdd;
      }
      &.is-active {
        background-color: #d7dcdd;
      }
    }
  }
  .has-hoverable.topLevel {
    padding: 0.5rem;
    &:hover {
      cursor: pointer;
      background-color: #d7dcdd;
    }
    &.is-active {
      background-color: #d7dcdd;
    }
  }
}
</style>
