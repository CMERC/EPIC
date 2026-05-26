<template>
  <div class="file-uploader">
    <div class="file-list field">
      <div class="media-preview"
           v-for="(file, $index) in fileListProxy"
           :key="$index">
        <span class="close"
              @click="removedUploadedFile(file)">&times;</span>
        <span v-if="file && file.contentType && !file.contentType.includes('image')">
          <i :class="getIcon(file.contentType) + ' fa-4x'"></i><br />
          {{file.name}}
        </span>
        <img v-else
             v-bind:src='file.url.raw'
             class="image is-96x96"
             @click="imagePreview(file)" />
      </div>
      <media-preview :open="imagePreviewModal"
                     :file="selectedImage"
                     @close="closeModal"></media-preview>
    </div>
    <div class="field">
      <label class="label">
        Upload Media
      </label>
      <div class="control">
        <div v-if="uploadingFile">
          <div class="card-header-title is-centered">
            <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
          </div>
          <p class="subtitle has-text-centered">Uploading File...</p>
        </div>
        <div v-else
             class="upload-file box has-background-white-bis has-text-centered">
          <div>
            <p>
              <span class="icon is-large">
                <i class='fas fa-upload fa-2x'></i>
              </span>
            </p>
            <p> Drop your files here or click to upload</p>
          </div>
          <input type="file"
                 @change='uploadFileViaMutation($event)'
                 class="input-file"
                 multiple>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MediaFileDelete } from '@/shared/graphql/MediaFile.gql'
import { SingleUpload } from '@/shared/graphql/Upload.gql'
import MediaCheck from '@/shared/mixins/mediaCheck'
import MediaPreview from '@/shared/components/mediaPreview'
export default {
  name: 'FileUploader',
  mixins: [MediaCheck],
  components: {
    MediaPreview
  },
  props: {
    fileList: Array
  },
  data() {
    return {
      uploadingFile: false,
      imagePreviewModal: false,
      selectedImage: null,
    }
  },
  methods: {
    imagePreview(image) {
      this.imagePreviewModal = true
      this.selectedImage = image
    },
    closeModal() {
      this.imagePreviewModal = false
      this.selectedImage = null
    },
    removedUploadedFile(fileToBeDeleted) {
      if (fileToBeDeleted && fileToBeDeleted.id)
        this.$apollo
          .mutate({
            mutation: MediaFileDelete,
            variables: {
              id: {
                id: fileToBeDeleted.id
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'File Deleted!',
              type: 'is-success'
            })
            this.fileListProxy = this.fileList.filter(
              el => el.id !== fileToBeDeleted.id
            )
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('File Delete: ' + error)
          })
    },
    uploadFileViaMutation(event) {
      if (event.target.files && event.target.files.length > 0)
        for (let i = 0; i < event.target.files.length; i++) {
          this.uploadingFile = true
          this.$apollo
            .mutate({
              mutation: SingleUpload,
              variables: {
                file: event.target.files[i]
              }
            })
            .then(response => {
              this.fileList.push(response.data.singleUpload)
              this.uploadingFile = false
            })
            .catch(error => {
              this.$buefy.toast.open({
                message:
                  'There was an error uploading ' +
                  event.target.files[i].name +
                  ', Please try again',
                type: 'is-danger'
              })
              this.uploadingFile = false
              console.error(error)
            })
        }
    }
  },
  computed: {
    fileListProxy: {
      get() {
        return this.fileList
      },
      set(value) {
        this.$emit('update:fileList', value)
      }
    }
  }
}
</script>
<style lang="scss">
.file-uploader {
  .upload-file {
    outline: 1px dashed lightgrey !important;
    border-radius: unset;
    &:hover {
      cursor: pointer;
      outline: 1px dashed grey !important;
    }
    .input-file {
      opacity: 0; /* invisible but it's there! */
      width: 100%;
      height: 112px;
      position: absolute;
      cursor: pointer;
      margin-top: -136px;
      left: 0;
      bottom: 0;
    }
  }
  .file-list {
    padding-top: 10px;
    .media-preview {
      width: 96px;
      font-size: 12px;
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
      }
      margin-left: 25px;
    }
    .media-preview {
      position: relative;
      display: inline-block;
    }
    .media-preview .close {
      position: absolute;
      top: -15px;
      right: -15px;
      z-index: 15;
      background-color: #000;
      padding: 5px;
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      opacity: 0.6;
      text-align: center;
      font-size: 14px;
      line-height: 10px;
      border-radius: 70%;
    }
    .media-preview:hover .close {
      opacity: 1;
    }
  }
}
</style>
