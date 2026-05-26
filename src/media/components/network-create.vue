<template>
  <div class="container is-fluid">
    <!-- <a role="button" @click="onOpen">
      <slot></slot>
    </a> -->
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="cancel()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Network</p>
          <button class="delete"
                  aria-label="close"
                  @click="cancel()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="NetworkInfo">
          <label class="label">
            Name
            <input type="text"
                   name="name"
                   v-model="NetworkInfo.name"
                   class="input"
                   v-focus
                   v-validate="'required'"
                   :class="{'input': true, 'is-danger': errors.has('name') }" />
            <span v-show="errors.has('name')"
                  class="help has-text-danger">{{errors.first('name') }}</span>
          </label>
          <label class="label">
            Description
            <input type="text"
                   v-model="NetworkInfo.description"
                   class="input" />
          </label>
          <label class="label">
            Avatar
          </label>
          <ImagePicker v-model="NetworkMediaFile"
                       :rootSearch="'avatar'"
                       :mediaFile="NetworkInfo.avatar" />
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             @click="save()"
             :disabled="disableActionButton">
            Save
          </a>
          <a class="button"
             @click="cancel()">
            Cancel
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import { MediaNetworksCreate } from '../graphql/MediaNetworks.gql'
import ImagePicker from '@/shared/components/imagepicker'
import { serverError } from '../../shared/serverError'
import Vue from 'vue'

export default {
  name: 'network-create',
  components: {
    ImagePicker
  },
  props: {
    mediaNetwork: {},
    open: {
      default: false
    }
  },
  data() {
    return {
      searchQuery: '',
      mediaNetworks: [],
      NetworkInfo: Vue.util.extend({}, this.mediaNetwork),
      NetworkMediaFile: null
    }
  },
  methods: {
    cancel() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
      this.NetworkInfo = {}
      this.NetworkMediaFile = null
    },
    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let data = {
            name: this.NetworkInfo.name,
            description: this.NetworkInfo.description
          }
          if (this.NetworkMediaFile) {
            // avatar added
            data = Object.assign(data, {
              avatar: this.NetworkMediaFile
            })
          }
          // Create Network
          this.$apollo
            .mutate({
              mutation: MediaNetworksCreate,
              variables: {
                data: data
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.cancel()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: serverError(error.message),
                type: 'is-danger'
              })
              console.error('Create Site: ' + error)
            })
          return
        }
      })
    }
  },
  computed: {
    disableActionButton() {
      return (this.errors && this.errors.items && this.errors.items.length > 0)
    }
  }
}
</script>
