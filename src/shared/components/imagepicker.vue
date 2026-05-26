<template>
  <div class="image-picker">
    <div class="picker-action-menu">
      <div class="columns">
        <div class="column">
          <div class="is-pulled-left media-preview"
               v-show="activePhotoURL && activePhotoURL.length>0">
            <span class="close"
                  @click="deleteMedia()">&times;</span>
            <div v-if="file && file.contentType && !file.contentType.includes('image') && !customImageUrl">
              <span class="icon is-large">
                <i :class="getIcon(file.contentType) + ' fa-4x'"></i>
              </span>
            </div>
            <img v-else
                 v-bind:src='activePhotoURL'
                 class="is-avatar xl is-rounded"
                 @click="imagePreview(activePhoto)" />
          </div>
        </div>
        <div class="column">
          <div class="is-pulled-right">
            <button class="button"
                    @click.prevent="togglePicker()">
              <span class="icon is-small">
                <i class="fas fa-images"></i>
              </span>
              <span>Choose Media...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Choose Media...</p>
          <button class="delete"
                  aria-label="close"
                  @click="togglePicker"></button>
        </header>
        <section class="modal-card-body">
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
              <div v-else>
                <div class="media-preview"
                     v-if="uploadedMediaFile && uploadedMediaFile.url && activePhotoURL">
                  <span class="close"
                        @click="deleteMedia()">&times;</span>
                  <div v-if="file && file.contentType && !file.contentType.includes('image') && !customImageUrl">
                    <span class="icon is-large">
                      <i :class="getIcon(file.contentType) + ' fa-4x'"></i>
                    </span>
                  </div>
                  <img v-else
                       v-bind:src='activePhotoURL'
                       class="is-avatar xl is-rounded"
                       @click="imagePreview(activePhoto)" />
                </div>
                <div v-else
                     class="upload-file box has-background-white-bis has-text-centered">
                  <div>
                    <p>
                      <span class="icon is-large">
                        <i class='fas fa-upload fa-2x'></i>
                      </span>
                    </p>
                    <p> Drop your file here or click to upload</p>
                  </div>
                  <input type="file"
                         @change='uploadFileViaMutation($event)'
                         class="input-file">
                </div>
              </div>
            </div>
          </div>
          <label class="label">
            Media URL
          </label>
          <div class="field is-grouped">
            <p class="control is-expanded">
              <input class="input"
                     type="text"
                     v-model="customImageUrl"
                     placeholder="Enter a media URL">
            </p>
            <p class="control">
              <a class="button"
                 @click='clearCustomImageURL'>Clear</a>
            </p>
          </div>

          <label class="label">
            Search Images
          </label>
          <div class="field has-addons">
            <div class="control is-expanded">
              <input class="input"
                     type="text"
                     v-model.lazy="searchQuery"
                     v-on:keyup.enter="applySearch"
                     placeholder="Search..."
                     icon-start="icon-search">
            </div>
            <div class="control">
              <a class="button is-link"
                 @click="applySearch">
                Search
              </a>
            </div>
          </div>
          <div class="box image-picker-body">
            <div id="image-picker-holder"
                 class="image-picker-holder"
                 v-infinite-scroll="fetchPhotos"
                 infinite-scroll-distance="10">
              <div class="avatar-holder"
                   v-bind:class="{'photo-active':activePhoto==photo}"
                   v-for="photo in photos"
                   :key="photo.id">
                <img :src="photo.urls.thumb"
                     @click.prevent="setActivePhoto(photo)"
                     :class="{'is-avatar is-rounded': rootSearch=='avatar'}">
              </div>

              <div v-if="loading">
                <div class="card-header-title is-centered">
                  <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
                </div>
                <p class="subtitle has-text-centered">Loading More Photos... </p>
              </div>
            </div>
            <div class="back-to-top"
                 v-if="photos.length > perPage">
              <button type="button"
                      class="button"
                      @click="scrollTop">
                <span class="icon is-small">
                  <i class="fas fa-arrow-up"></i>
                </span>
              </button>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="emitChanges"
                  :disabled="disableSave">
            Ok
          </button>
          <button class="button"
                  @click="cancel">
            Cancel
          </button>
        </footer>
      </div>
    </div>
    <media-preview :open="imagePreviewModal"
                   :file="selectedImage"
                   @close="closeModal"></media-preview>
  </div>
</template>

<script>
import MediaCheck from '@/shared/mixins/mediaCheck'
import MediaPreview from '@/shared/components/mediaPreview'
import { SingleUpload } from '@/shared/graphql/Upload.gql'

const UNSPLASH_ACCESS_KEY =
  process.env.VUE_APP_UNSPLASH_ACCESS_KEY ||
  '811d91ac9f0dbbf858b7abb5050bb3edabc7a473a5f89bb8757bce7c9f728932'
const UNSPLASH_API_URL = 'https://api.unsplash.com'

export default {
  name: 'ImagePicker',
  mixins: [MediaCheck],
  components: {
    MediaPreview
  },
  props: {
    rootSearch: {
      type: String
    },
    value: Object,
    mediaFile: {}
  },
  watch: {
    value(newVal) {
      if (newVal === null) {
        // reset search
        this.searchQuery = ''
        this.activePhoto = { ...newVal }
        this.activePhotoURL = newVal ? newVal.url.thumb : ''
        this.uploadedMediaFile = {}
      }
    },
    mediaFile(value) {
      this.activePhoto = { ...value }
      this.activePhotoURL = value ? value.url.thumb : ''
    }
  },
  data() {
    return {
      file: { ...this.mediaFile },
      imagePreviewModal: false,
      selectedImage: null,
      photos: [],
      perPage: 12,
      currentPage: 0,
      loading: false,
      searchQuery: '',
      activePhoto: { ...this.mediaFile },
      activePhotoURL: this.mediaFile ? this.mediaFile.url.thumb : '',
      customImageUrl: '',
      open: false,
      uploadedMediaFile: {},
      uploadingFile: false
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
    emitChanges() {
      if (this.customImageUrl.length > 0) {
        this.activePhoto = {}
        this.activePhotoURL = this.customImageUrl
      } else if (this.activePhoto.urls) {
        this.activePhotoURL = this.activePhoto.urls.thumb
      }
      let mediaFileData = this.generateMediaFile()
      // Emit changes to v-model bind object of the parent component
      Object.assign({}, this.value, mediaFileData)
      this.$emit('input', mediaFileData)
      this.togglePicker()
    },
    cancel() {
      // reset search
      this.searchQuery = ''
      this.applySearch()
      this.togglePicker()
    },
    togglePicker() {
      this.open = !this.open
    },
    applySearch() {
      // When searching clear previous photos list and go to first page
      this.currentPage = 1
      this.photos = []
      this.fetchPhotos()
    },
    uploadFileViaMutation(event) {
      this.uploadingFile = true
      let file = event.target.files[0]
      this.$apollo
        .mutate({
          mutation: SingleUpload,
          variables: {
            file: file
          }
        })
        .then(response => {
          this.resetData()
          // Save response from upload mutation
          this.uploadedMediaFile = response.data.singleUpload
          if (this.uploadedMediaFile && this.uploadedMediaFile.contentType) {
            setTimeout(() => {
              this.activePhotoURL = this.uploadedMediaFile.url.thumb
              this.file = this.uploadedMediaFile
              this.uploadingFile = false
            }, 1300)
          }
          this.generateMediaFile()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error, Please try again',
            type: 'is-danger'
          })
          this.uploadingFile = false
          this.resetData()
          console.error(error)
        })
    },
    removedUploadedFile() {
      this.uploadedMediaFile = {}
    },
    setActivePhoto(photo) {
      this.activePhoto = photo
      this.customImageUrl = ''
      this.uploadedMediaFile = {}
    },
    resetData() {
      this.customImageUrl = ''
      this.activePhoto = {}
      this.activePhotoURL = ''
    },
    deleteMedia() {
      this.resetData()
      this.uploadedMediaFile = {}
      // Emit changes to v-model bind object of the parent component
      Object.assign({}, this.value, { delete: true })
      this.$emit('input', { delete: true })
    },
    generateMediaFile() {
      // generate MediaFile for listening components
      let mediaFileData = {}
      let currentDate = new Date().toISOString()

      // Create a MediaFileData
      if (this.activePhoto && this.activePhoto.urls) {
        mediaFileData = {
          create: {
            name: this.activePhoto.description
              ? this.activePhoto.description
              : 'Photo',
            url: this.activePhoto.urls,
            contentType: 'image/jpg',
            createTime: this.activePhoto.created_at,
            updateTime: this.activePhoto.updated_at
          }
        }
      } else if (this.customImageUrl.length > 0) {
        mediaFileData = {
          create: {
            name: 'Photo',
            url: {
              thumb: this.customImageUrl,
              full: this.customImageUrl,
              regular: this.customImageUrl,
              small: this.customImageUrl,
              raw: this.customImageUrl
            },
            contentType: 'image/jpg',
            createTime: currentDate,
            updateTime: currentDate
          }
        }
      } else if (this.uploadedMediaFile.id) {
        mediaFileData = {
          connect: {
            id: this.uploadedMediaFile.id
          }
        }
      } else {
        mediaFileData = {}
      }

      return mediaFileData
    },
    clearCustomImageURL() {
      this.customImageUrl = ''
      this.activePhoto = this.mediaFile
      this.activePhotoURL = this.mediaFile.url.thumb
    },
    fetchPhotos() {
      this.currentPage++
      this.loading = true
      let search = this.searchQuery
      if (this.rootSearch !== '') {
        switch (this.rootSearch) {
          case 'avatar': {
            // append search on avatars
            search = 'portrait'
            if (this.searchQuery !== '') {
              search += ',' + this.searchQuery
            }
            break
          }
          default: {
            search = this.searchQuery
            break
          }
        }
      }

      this.fetchUnsplashPhotos(search)
        .then(photos => {
          this.photos = [
            ...this.photos,
            ...photos.filter(n => !this.photos.some(p => p.id === n.id))
          ]
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'Image search failed',
            type: 'is-danger'
          })
          console.error('failed image search: ' + error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchUnsplashPhotos(search) {
      const hasSearch = search && search.length > 0
      const params = new URLSearchParams({
        page: this.currentPage,
        per_page: this.perPage
      })

      if (hasSearch) {
        params.set('query', search)
      }

      const endpoint = hasSearch ? '/search/photos' : '/photos'
      return fetch(`${UNSPLASH_API_URL}${endpoint}?${params.toString()}`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Unsplash returned ${response.status}`)
          }
          return response.json()
        })
        .then(json => (hasSearch ? json.results || [] : json || []))
    },
    scrollTop() {
      document.getElementById('image-picker-holder').scrollTop = 0
    }
  },
  computed: {
    disableSave() {
      if (
        this.uploadedMediaFile.id ||
        this.activePhoto.urls ||
        this.customImageUrl.length > 0
      )
        return false
      else return true
    }
  }
}
</script>

<style lang="scss">
.image-picker {
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
}
.image-picker {
  .modal {
    .modal-card {
      box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
        0 0 0 1px rgba(10, 10, 10, 0.02);
    }
  }
  .card-content {
    text-align: left;
  }
  .picker-action-menu {
    display: flex;
    cursor: pointer;
  }
  .image-picker-holder {
    display: flex;
    flex-wrap: wrap;
    max-height: 200px;
    overflow: auto;
    padding: 10px;
    .avatar-holder {
      margin: 10px;
      img {
        width: 80px;
        height: 80px;
      }
    }
    .photo-active {
      border: 2px solid #ff4612;
      border-radius: 4px;
    }
    padding-bottom: 0px;
  }
  a {
    cursor: pointer;
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

  .back-to-top {
    float: right;
  }
}
// Fix for toast appears behind modal
.notices {
  z-index: 4010 !important;
}

//IE 11 Fixes, do not remove
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .picker-action-menu {
    .column {
      flex-basis: auto;
    }
  }
}
</style>
