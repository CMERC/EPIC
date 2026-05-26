
<template>
  <div class="container is-fluid">
    <epic-modal :open="open"
                @close="close">
      <template slot="modal-title">
        Create Site
      </template>
      <template slot="modal-body">
        <div class="field">
          <label class="label">
            Site Name
          </label>
          <div class="control">
            <input name="site name"
                   v-model="mediaService.displayName"
                   v-validate="'required|min:2'"
                   :class="{'input': true, 'is-danger': errors.has('site name') }"
                   type="text"
                   placeholder="Site Name"
                   v-focus>
            <span v-show="errors.has('site name')"
                  class="help is-danger">{{errors.first('site name') }}</span>
          </div>
        </div>
        <div class="field">
          <label class="label">
            Site Type
          </label>
          <div class="control select">
            <select name="site type"
                    v-model="mediaService.type"
                    v-validate="'required'"
                    :class="{'input': true, 'is-danger': errors.has('site type') }"
                    type="text">
              <option v-for="serviceType in serviceTypes"
                      :key="serviceType.value"
                      :value="serviceType.value">
                {{serviceType.label}}
              </option>
            </select>
            <span v-show="errors.has('site type')"
                  class="help is-danger">{{errors.first('site type') }}</span>
          </div>
        </div>
        <div class="field">
          <label class="label">
            Icon
          </label>
          <div class="control">
            <icon-picker v-model="mediaService.icon"></icon-picker>
          </div>
        </div>
        <div class="field">
          <label class="label">
            Color
          </label>
          <div class="control">
            <swatches v-model="mediaService.color"
                      colors="material-dark"
                      show-fallback
                      inline></swatches>
          </div>
        </div>
      </template>
      <template slot="modal-footer-buttons">
        <p class="control">
          <button class="button is-primary"
                  @click="validateBeforeSubmit()" >Save</button>
        </p>
      </template>
    </epic-modal>

  </div>
</template>

<script>
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'
import IconPicker from '@/shared/components/iconpicker'
import { serverError } from '../../shared/serverError'
import helpers from '@/shared/mixins/helpers'
import MediaService from '@/media/model/mediaservice'
import { serviceTypeEnums } from '@/media/model/service-types'

import {
  MediaServicesCreate,
  MediaServicesRead,
  MediaServicesUpdate
} from '../graphql/MediaServices.gql'

export default {
  name: 'site-create',
  mixins: [helpers],
  components: {
    Swatches,
    IconPicker
  },
  props: {
    mediaService: {
      type: Object,
      default: function() {
        return new MediaService()
      }
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      serviceTypes: serviceTypeEnums
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    async validateBeforeSubmit() {
      let isUniqueCheck = await this.checkUniqueServiceName()
      this.$validator.validateAll().then(result => {
        if (result && isUniqueCheck == true) {
          this.addEditServices()
          return
        }
      })
    },
    async checkUniqueServiceName() {
      let result = true
      await this.$apollo
        .query({
          query: MediaServicesRead,
          variables: {
            where: {
              OR: [
                { name: this.mediaService.displayName },
                { displayName: this.mediaService.displayName }
              ]
            }
          }
        })
        .then(response => {
          if (
            response.data.mediaServices.length > 0 &&
            this.mediaService.id == null
          ) {
            this.$buefy.toast.open({
              message: 'A site with that name already exists.',
              type: 'is-danger',
              duration: 5000
            })
            result = false
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Check Unique Service: ' + error)
        })
      return result
    },
    addEditServices() {
      this.mediaService.name = this.removeSpaces(
        this.mediaService.displayName.toLowerCase()
      )

      let serviceID = this.mediaService.id
      delete this.mediaService.id

      // this function will be for both insert and update
      if (serviceID === undefined) {
        // create services
        this.$apollo
          .mutate({
            mutation: MediaServicesCreate,
            variables: {
              data: Object.assign({}, this.mediaService)
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.mediaService.name = ''
            this.close()
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
            console.error('Create Site: ' + error)
          })
      } else {
        this.$apollo
          .mutate({
            mutation: MediaServicesUpdate,
            variables: {
              where: {
                id: serviceID
              },
              data: Object.assign({}, this.mediaService)
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.name = ''
            this.close()
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
            console.error('Create Site: ' + error)
          })
      }
    }
  }
}
</script>
