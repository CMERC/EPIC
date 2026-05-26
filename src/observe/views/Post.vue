<template>
  <div class="container post-create">
    <div class="level is-mobile navbar is-fixed-top post-create-actions">
      <div class="level-item">
        <button class="button"
                @click="$router.go(-1)">
          Cancel
        </button>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <h1 class="title">
            Post
          </h1>
        </div>
      </div>
      <div class="level-item">
        <button class="button is-primary"
                @click="save()">
          Post
        </button>
      </div>
    </div>
    <div class="section post-create-body">
      <div class="field">
        <label class="label">
          Message:
        </label>
        <div class="control">
          <textarea name="body"
                    v-focus
                    v-model="post.text"
                    v-validate="'required|min:2'"
                    :class="{'textarea': true, 'is-danger': errors.has('body') }"
                    type="text"
                    placeholder="Message" />
          <span v-show="errors.has('body')"
                class="help is-danger">
            {{errors.first('body') }}
          </span>
        </div>
      </div>
      <FileUploader :fileList.sync="post.fileList" />
      <div class="field"
           v-if="currentPosition">
        <span class="icon is-small is-left">
          <i class="fas fa-location-arrow"></i>
        </span>
        <span>
          <Geocode :coordinates="[currentPosition.coords.longitude, currentPosition.coords.latitude]"> </Geocode>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import FileUploader from '@/shared/components/file-uploader'
import Geocode from '@/shared/components/geocode'
import { GetCurrentPosition } from '@/state/graphql/user.gql'
import { ObservePostCreate } from '../graphql/ObservePost.gql'
const Geohash = require('ngeohash')

export default {
  name: 'ObservePost',
  components: {
    FileUploader,
    Geocode
  },
  apollo: {
    currentPosition: {
      query: GetCurrentPosition
    }
  },
  data() {
    return {
      post: {
        author: this.$store.state.currentUser.email,
        text: '',
        fileList: [],
        location: null
      }
    }
  },
  methods: {
    close() {
      this.errors.clear()
      this.$validator.reset()
      this.post.text = ''
      this.$router.go(-1)
    },
    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let observePostData = {
            text: this.post.text,
            author: this.$store.state.currentUser.name
          }
          // Attachments
          if (this.post.fileList && this.post.fileList.length > 0) {
            let files = this.post.fileList.map(file => {
              return { id: file.id }
            })
            observePostData = {
              ...observePostData,
              attachments: {
                connect: files
              }
            }
          }
          // Location
          if (this.currentPosition) {
            let olMapData = {
              geojson: {
                type: 'Point',
                coordinates: [
                  this.currentPosition.coords.longitude,
                  this.currentPosition.coords.latitude
                ]
              },
              geohash: Geohash.encode(
                this.currentPosition.coords.latitude,
                this.currentPosition.coords.longitude
              )
            }
            observePostData = {
              ...observePostData,
              location: {
                create: olMapData
              }
            }
          }
          // Create
          this.$apollo
            .mutate({
              mutation: ObservePostCreate,
              variables: {
                data: observePostData
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.close()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Observe Post: ' + error)
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.post-create {
  min-height: calc(100vh - 94px);
  overflow-y: auto;
  .post-create-body {
    margin-top: 25px;
  }
  .post-create-actions {
    top: 45px;
    // hack to show action button on top of dropzone
    z-index: 1000;
  }
}
</style>
