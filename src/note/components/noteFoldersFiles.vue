<template>
  <div>
    <nav class="level"
         v-if="noteFolderID!=='root' && getFilesAndFolders">
      <div class="level-left">
        <nav class="breadcrumb is-spaced has-bullet-separator"
             aria-label="breadcrumbs">
          <ul>
            <li v-if="noteFolder.parent">
              &lt;&lt;&nbsp;
            </li>
            <li v-if="noteFolder.parent">
              <router-link :to="'/note/folder/edit/' + noteFolder.parent.id">
                {{ noteFolder.parent.name}}
              </router-link>
            </li>
            <li v-else>
              <router-link :to="'/note/'">
                <span class="icon is-small">
                  <i class="fas fa-chevron-left"
                     aria-hidden="true"></i>
                </span>
                <span>Home</span>
              </router-link>
            </li>
            <li class="is-active">
              <a aria-current="page">{{noteFolder.name}}</a>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
    <nav class="level"
         v-if="noteFolderID!=='root' && getFilesAndFolders">
      <div class="level-left">
        <figure class="image has-text-centered">
          <router-link :to="'/note/folder/edit/' + noteFolder.id">
            <div class="folder_style1"
                 :style="noteFolder.color?'background-color:'+noteFolder.color+';border-bottom-color:'+noteFolder.color:''">
            </div>
          </router-link>
          <figcaption :data-tooltip="noteFolder.name"
                      class="tooltip">
            <span>{{noteFolder.name }}</span>
          </figcaption>
        </figure>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-dropdown position="is-bottom-left">
            <a class="button is-small"
               slot="trigger">
              <span class="icon is-small">
                <i class="fas fa-ellipsis-v"></i>
              </span>
            </a>
            <b-dropdown-item @click="showEditFolder(noteFolder)">
              <span class="icon is-small">
                <i class="fas fa-pencil-alt"></i>
              </span>
              <span>Edit Folder</span>
            </b-dropdown-item>
            <b-dropdown-item @click="showMove(noteFolder, 'Folder')">
              <span class="icon is-small">
                <i class="fas fa-arrow-right"></i>
              </span>
              <span>Move Folder</span>
            </b-dropdown-item>
            <hr class="dropdown-divider">
            <b-dropdown-item @click="confirmDelete(noteFolder, 'Folder',true)">
              <span class="icon is-small">
                <i class="fas fa-times has-text-danger"></i>
              </span>
              <span>Delete Folder</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>
    <nav class="level">
      <div class="level-left">
        <div class="level-item"
             v-if="getFilesAndFolders">
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
              <a @click="showAddFolder">
                <span class="icon">
                  <i class='fas fa-folder-plus fa-2x'></i>
                </span>
                Create Folder
              </a>
            </b-dropdown-item>
            <b-dropdown-item>
              <div v-if="uploadInProgress">
                <span class="icon">
                  <i class='fas fa-spinner fa-2x'></i>
                </span>
                Uploading Files
              </div>
              <div v-else>
                <a>
                  <span class="icon">
                    <i class='fas fa-file-upload fa-2x'></i>
                  </span>
                  Upload Files
                  <input type="file"
                         class="input-file"
                         @change='uploadFileViaMutation($event)'
                         multiple>
                </a>
              </div>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <help-content :reference="'note.folder'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div class="columns is-multiline is-mobile file-list"
         v-if="getFilesAndFolders && getFilesAndFolders.length>0">
      <template v-for="noteFolderOrFile in getFilesAndFolders">
        <div class="column is-narrow-desktop is-2-tablet is-half-mobile"
             v-bind:key="noteFolderOrFile.id">
          <!-- Folder Type -->
          <article v-if="noteFolderOrFile.folders">
            <b-dropdown class="is-pulled-right">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="showEditFolder(noteFolderOrFile)">
                <span class="icon is-small">
                  <i class="fas fa-pencil-alt"></i>
                </span>
                <span>Edit Folder</span>
              </b-dropdown-item>
              <b-dropdown-item @click="showMove(noteFolderOrFile, 'Folder')">
                <span class="icon is-small">
                  <i class="fas fa-arrow-right"></i>
                </span>
                <span>Move Folder</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDelete(noteFolderOrFile, 'Folder', false)">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete Folder</span>
              </b-dropdown-item>
            </b-dropdown>
            <div class="media-preview">
              <figure class="image has-text-centered">
                <router-link :to="'/note/folder/edit/' + noteFolderOrFile.id">
                  <div class="folder_style1"
                       :style="noteFolderOrFile.color?'background-color:'+noteFolderOrFile.color+';border-bottom-color:'+noteFolderOrFile.color:''">
                  </div>
                </router-link>
                <figcaption :data-tooltip="noteFolderOrFile.name"
                            class="tooltip">
                  <span>{{noteFolderOrFile.name }}</span>
                </figcaption>
              </figure>
            </div>
          </article>
          <article v-else>
            <b-dropdown class="is-pulled-right">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="showMove(noteFolderOrFile, 'File')">
                <span class="icon is-small">
                  <i class="fas fa-arrow-right"></i>
                </span>
                <span>Move File</span>
              </b-dropdown-item>
              <b-dropdown-item @click="renameFile(noteFolderOrFile)">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
                <span>Rename File</span>
              </b-dropdown-item>
              <b-dropdown-item @click="generateDownloadBlob(noteFolderOrFile.file)">
                <span class="icon is-small">
                  <i class="fas fa-download"></i>
                </span>
                <span>Download File</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDelete(noteFolderOrFile.id, 'File')">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete File</span>
              </b-dropdown-item>
            </b-dropdown>
            <div class="media-preview">
              <figure v-if="ifImage(noteFolderOrFile.file.contentType)"
                      class="image"
                      :key="noteFolderOrFile.id">
                <img :src="noteFolderOrFile.file.url.thumb"
                     @click="mediaPreview(noteFolderOrFile.file)">
                <figcaption :data-tooltip="noteFolderOrFile.file.name"
                            class="tooltip">
                  <span>{{noteFolderOrFile.file.name}}</span>
                </figcaption>
              </figure>
              <figure class="image"
                      v-else-if="ifAudio(noteFolderOrFile.file.contentType)"
                      :key="noteFolderOrFile.file.id">
                <audio controls>
                  <source :src="noteFolderOrFile.file.url.raw"
                          :type="noteFolderOrFile.file.contentType">
                </audio>
                <figcaption :data-tooltip="noteFolderOrFile.file.name"
                            class="tooltip">
                  <span>{{noteFolderOrFile.file.name}}</span>
                </figcaption>
              </figure>
              <figure class="image"
                      v-else-if="ifVideo(noteFolderOrFile.file.contentType)"
                      @click="mediaPreview(noteFolderOrFile.file)"
                      :key="noteFolderOrFile.file.id">
                <video height="128"
                       width="128"
                       data-setup='{ "aspectRatio":"16:9" }'>
                  <source :src="noteFolderOrFile.file.url.raw+ '#t=5'">
                </video>
                <figcaption :data-tooltip="noteFolderOrFile.file.name"
                            class="tooltip">
                  <span>{{noteFolderOrFile.file.name }}</span>
                </figcaption>
              </figure>
              <figure class="image has-text-centered"
                      v-else
                      :key="noteFolderOrFile.file.id">
                <a :href="noteFolderOrFile.file.url.raw"
                   class="is-size-7 tooltip"
                   target="_blank"
                   :data-tooltip="noteFolderOrFile.file.name">
                  <i :class="getIcon(noteFolderOrFile.file.contentType) + ' fa-2x'"></i><br />
                  <span>{{noteFolderOrFile.file.name }}</span>
                </a>
              </figure>
            </div>
          </article>
        </div>
      </template>
    </div>
    <div class="columns is-multiline is-mobile file-list"
         v-else>
      <div class="column">
        <empty-state :data="getFilesAndFolders ? getFilesAndFolders : null"
                     :isLoading='$apollo.loading' />
      </div>
    </div>
    <notefolder-edit :open="showAddNoteFolder"
                     :isCreateNewFolder="isCreateNewFolder"
                     :folder="editFolder"
                     :folderType="noteFolderID"
                     @close="folderAdded" />
    <media-preview :open="mediaPreviewModal"
                   :file="selectedMedia"
                   @close="closeModal"></media-preview>
    <notefolder-list :fileType="moveType"
                     :movingFileOrFolder='moveObj'
                     :open="showNoteFolderList"
                     @close="closeFolderList"
                     @select="handleMove" />
    <file-rename :id="selectedRenameFile"
                 :fileName="fileName"
                 :open="showRenameFile"
                 @close="closeRenameFile"
                 @select="handleRenameFile" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  NoteFoldersRead,
  NoteFolderDelete,
  NoteFolderUpdate
} from '../graphql/NoteFolder.gql'
import NotefolderEdit from '@/note/components/notefolder-edit.vue'
import MediaPreview from '@/shared/components/mediaPreview'
import mediaCheck from '@/shared/mixins/mediaCheck'
import { SingleUpload } from '@/shared/graphql/Upload.gql'
import NotefolderList from '@/note/components/noteFolder-list.vue'
import FileRename from '@/shared/components/file-rename.vue'
import file from '@/shared/mixins/file'
import {
  NoteFileUpdate,
  NoteFilesRead,
  NoteFileCreate,
  NoteFileDelete
} from '../graphql/NoteFile.gql'

export default {
  name: 'noteFoldersFiles',
  components: {
    HelpContent,
    NotefolderEdit,
    MediaPreview,
    NotefolderList,
    FileRename
  },
  props: {
    noteFolderID: {
      default: 'root',
      type: String
    }
  },
  mixins: [mediaCheck, file],
  apollo: {
    noteFolders: {
      query: NoteFoldersRead,
      variables() {
        if (this.noteFolderID !== 'root')
          return {
            where: {
              id: this.noteFolderID
            }
          }
        else
          return {
            where: {
              parent: null
            }
          }
      },
      update(data) {
        if (data && data.noteFolders) {
          this.noteFolder = data.noteFolders[0]
          return data.noteFolders
        }
      }
    },
    noteFiles: {
      query: NoteFilesRead,
      variables() {
        let data = {
          where: {
            folder: null
          }
        }
        return data
      },
      update(data) {
        if (data && data.noteFiles) {
          return data.noteFiles
        }
      },
      skip() {
        return this.noteFolderID !== 'root'
      }
    }
  },
  data() {
    return {
      showNoteFolderList: false,
      showAddNoteFolder: false,
      showRenameFile: false,
      selectedRenameFile: '',
      fileName: '',
      uploadInProgress: false,
      noteFolder: null,
      noteFiles: [],
      noteFolders: [],
      mediaPreviewModal: false,
      selectedMedia: null,
      isCreateNewFolder: true,
      moveObj: null,
      moveType: null,
      editFolder: null
    }
  },
  methods: {
    handleMove(response) {
      if (response.fileType === 'Folder') {
        this.moveFolder(response.fileId, response.selectedFolder)
      } else {
        this.moveFile(response.fileId, response.selectedFolder)
      }
    },
    showMove(fileorFolder, type) {
      this.showNoteFolderList = true
      this.moveObj = fileorFolder
      this.moveType = type
    },
    moveFile(fileId, dest) {
      let data
      if (dest !== 'Root') {
        data = {
          folder: {
            connect: {
              id: dest
            }
          }
        }
      } else {
        data = {
          folder: {
            disconnect: true
          }
        }
      }
      this.$apollo
        .mutate({
          mutation: NoteFileUpdate,
          variables: {
            data: data,
            where: {
              id: fileId
            }
          }
        })
        .then(response => {
          this.refetchQueries()
          if (response && response.data && response.data.updateNoteFile) {
            this.$buefy.toast.open({
              message: 'Moving...',
              type: 'is-success'
            })
          }
        })
    },
    moveFolder(folderId, dest) {
      let data
      if (dest !== 'Root') {
        data = {
          parent: {
            connect: {
              id: dest
            }
          }
        }
      } else {
        data = {
          parent: {
            disconnect: true
          }
        }
      }
      this.$apollo
        .mutate({
          mutation: NoteFolderUpdate,
          variables: {
            data: data,
            where: {
              id: folderId
            }
          }
        })
        .then(response => {
          this.refetchQueries()
          if (response && response.data && response.data.updateNoteFolder) {
            this.$buefy.toast.open({
              message: 'Moving...',
              type: 'is-success'
            })
          }
        })
    },
    refetchQueries() {
      this.$apollo.queries.noteFolders.refetch()
      this.$apollo.queries.noteFiles.refetch()
    },
    renameFile(fileorFolder) {
      this.showRenameFile = true
      this.selectedRenameFile = fileorFolder.id
      this.fileName = fileorFolder.file.name
    },
    handleRenameFile(response) {
      if (response) {
        this.$apollo
          .mutate({
            mutation: NoteFileUpdate,
            variables: {
              data: { file: { update: { name: response.name } } },
              where: {
                id: response.id
              }
            }
          })
          .then(response => {
            if (response && response.data) {
              this.refetchQueries()
            }
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('File Rename: ' + error)
          })
      }
    },
    folderAdded() {
      this.showAddNoteFolder = false
      this.$apollo.queries.noteFolders.refetch()
    },
    showEditFolder(folder) {
      this.showAddNoteFolder = true
      this.isCreateNewFolder = false
      this.editFolder = folder
    },
    showAddFolder() {
      this.showAddNoteFolder = true
      this.isCreateNewFolder = true
    },
    confirmDelete(deleteFolderOrFile, type, viewingFolder) {
      let message = 'Are you sure you want to do this?'
      if (type === 'Folder')
        message =
          'Are you sure you want to delete this folder and its contents?'
      this.$buefy.dialog.confirm({
        title: 'Delete ' + type,
        message: message,
        type: 'is-danger',
        onConfirm: () => {
          if (type === 'Folder')
            this.deleteFolder(deleteFolderOrFile, viewingFolder)
          else this.deleteFile(deleteFolderOrFile)
        }
      })
    },
    uploadFileViaMutation(event) {
      if (event.target.files && event.target.files.length > 0) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.uploadInProgress = true
          this.$apollo
            .mutate({
              mutation: SingleUpload,
              variables: {
                file: event.target.files[i]
              }
            })
            .then(response => {
              let file = response.data.singleUpload
              let fileCreateData = {
                file: { connect: { id: file.id } }
              }
              // Upload to specific folder
              if (this.noteFolderID && this.noteFolderID !== 'root') {
                fileCreateData = {
                  ...fileCreateData,
                  folder: {
                    connect: { id: this.noteFolder.id }
                  }
                }
              }
              this.$apollo
                .mutate({
                  mutation: NoteFileCreate,
                  variables: {
                    data: fileCreateData
                  }
                })
                .then(response => {
                  if (response) {
                    if (this.noteFolderID && this.noteFolderID !== 'root')
                      this.$apollo.queries.noteFolders.refetch()
                    else this.$apollo.queries.noteFiles.refetch()
                  }
                })
                .catch(error => {
                  console.error(error)
                  this.$buefy.toast.open({
                    message: error.message,
                    type: 'is-danger'
                  })
                })
            })
            .catch(error => {
              this.$buefy.toast.open({
                message:
                  'There was an error uploading ' +
                  event.target.files[i].name +
                  ', Please try again',
                type: 'is-danger'
              })
              console.error(error)
            })
        }
        this.uploadInProgress = false
      }
    },
    deleteFile(fileId) {
      this.$apollo
        .mutate({
          mutation: NoteFileDelete,
          variables: {
            id: {
              id: fileId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'File Deleted!',
            type: 'is-success'
          })
          if (this.noteFolderID === 'root')
            this.$apollo.queries.noteFiles.refetch()
          else this.$apollo.queries.noteFolders.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('File Deleted: ' + error)
        })
    },
    deleteFolder(folder, viewingFolder) {
      this.$apollo
        .mutate({
          mutation: NoteFolderDelete,
          variables: {
            id: {
              id: folder.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Folder Deleted!',
            type: 'is-success'
          })
          if (viewingFolder) {
            if (folder.parent)
              this.$router.push({
                path: '/note/folder/edit/' + folder.parent.id
              })
            else
              this.$router.push({
                path: '/note'
              })
          } else this.$apollo.queries.noteFolders.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Folder Deleted: ' + error)
        })
    },
    mediaPreview(media) {
      this.mediaPreviewModal = true
      this.selectedMedia = media
    },
    closeFolderList() {
      this.showNoteFolderList = false
      this.moveObj = null
      this.moveType = null
    },
    closeModal() {
      this.mediaPreviewModal = false
      this.selectedMedia = null
    },
    closeRenameFile() {
      this.showRenameFile = false
    }
  },
  computed: {
    getFilesAndFolders() {
      if (this.noteFolderID === 'root') {
        if (this.noteFolders && this.noteFiles) {
          return [...this.noteFolders, ...this.noteFiles]
        }
      } else {
        if (this.noteFolder)
          return [
            ...(this.noteFolder.folders || []),
            ...(this.noteFolder.files || [])
          ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.file-list {
  article {
    width: calc(12vw);
    height: calc(19vh);
    max-width: 8rem;
    display: inline-block;
    &:hover {
      cursor: pointer;
    }
  }
  figure {
    min-width: 128px;
    max-width: 128px;
    video {
      object-fit: cover;
      min-height: 100px;
      max-height: 100px;
    }
    audio {
      min-width: 100px;
      max-width: 100px;
    }
  }
  figcaption {
    span {
      font-size: 0.75rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
  }
  .media-preview {
    text-align: center;
    svg {
      vertical-align: baseline;
    }
    img {
      position: relative !important;
      display: inline-block !important;
      margin: 0 !important;
      -o-object-fit: cover !important;
      object-fit: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      width: 100px;
      height: 100px;
    }
  }
  .media-preview {
    position: relative;
    display: inline-block;
  }
  .media-preview .close {
    position: absolute;
    top: -20px;
    right: -30px;
    padding: 5px;
    text-align: center;
    border-radius: 70%;
  }
}
.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  left: 0;
  bottom: 0;
}
@media screen and (max-width: 1024px - 1px) {
  .file-list {
    article {
      display: inline;
    }
  }
}
</style>
