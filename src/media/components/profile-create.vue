<template>
  <div class="container">
    <epic-modal :open="open"
                @close="close">
      <template slot="modal-title">
        Create Profile
      </template>
      <template slot="modal-body">
        <div class="columns"
             v-if="profileInfo">
          <div class="column is-12">
            <div class="field">
              <label class="label">
                Site
              </label>
              <div class="control is-expanded">
                <multiselect v-model="selectedService"
                             name="site"
                             track-by="id"
                             :options="mediaServices"
                             v-if="mediaServices"
                             v-validate="'required'"
                             :class="{'input': errors.has('site'), 'is-danger': errors.has('site') }"
                             placeholder="Select a site"
                             :internal-search="false"
                             @search-change="(value) => {searchQuery = value}">
                  <template slot="singleLabel"
                            slot-scope="props">
                    <span class="option__desc"
                          :key="props.option.id">
                      <span class="option__title">
                        <span class="icon"
                              :style="'color:'+props.option.color">
                          <i :class="props.option.icon"></i>
                        </span>
                        <span>{{props.option.displayName | truncate(50)}}</span>
                      </span>
                    </span>
                  </template>
                  <template slot="option"
                            slot-scope="props">
                    <div class="option__desc">
                      <span class="option__desc"
                            :key="props.option.id">
                        <span class="option__title">
                          <span class="icon"
                                :style="'color:'+props.option.color">
                            <i :class="props.option.icon"></i>
                          </span>
                          <span>{{props.option.displayName | truncate(50)}}</span>
                        </span>
                      </span>
                    </div>
                  </template>
                </multiselect>
              </div>
              <span v-show="errors.has('site')"
                    class="help has-text-danger">Site Required</span>
            </div>

            <div class="field">
              <label class="label">
                Name
              </label>
              <input class="input"
                     name="name"
                     type="text"
                     v-model="profileInfo.name"
                     v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('name') }" />
              <span v-show="errors.has('name')"
                    class="help is-danger">{{errors.first('name') }}</span>

            </div>
            <div class="field">
              <label class="label">
                Username
              </label>
              <p class="control has-icons-left">
                <input class="input"
                       name="username"
                       type="text"
                       v-model="profileInfo.username"
                       v-validate="{ required: true, regex: /^([-_\u00BF-\u1FFF\u2C00-\uD7FF\w]*)$/ }"
                       :class="{'input': true, 'is-danger': errors.has('username') }" />
                <span class="icon is-small is-left">
                  <i class="fas fa-at"></i>
                </span>
              </p>
              <span v-show="errors.has('username')"
                    class="help is-danger">{{errors.first('username') }}</span>
            </div>
            <div class="field">
              <label class="label">
                Description
              </label>
              <input class="input"
                     type="text"
                     v-model="profileInfo.description" />
            </div>
            <div class="field countsData"
                 v-if="profileInfo && profileInfo.counts">
              <label class="label">
                Follower/Following
              </label>
              <social-counts :profileCounts="profileInfo.counts"
                             :service="profileInfo.service"
                             countType='profile'
                             @getValues="(value) => {profileInfo.counts = value}" />
            </div>
            <div class="field">
              <label class="label">
                Avatar
              </label>
              <input class="input"
                     type="hidden"
                     v-model="profileInfo.avatar" />
              <template v-if="open">
                <ImagePicker v-model="avatarMediaFile"
                             v-bind:rootSearch="'avatar'"
                             :mediaFile='profileInfo.avatar?profileInfo.avatar:""' />
              </template>
            </div>
            <div class="field">
              <label class="label">
                Banner
              </label>
              <input class="input"
                     type="hidden"
                     v-model="profileInfo.banner" />
              <ImagePicker v-model="bannerMediaFile"
                           :mediaFile='profileInfo.banner?profileInfo.banner.mediaFile:""' />

            </div>
          </div>
        </div>
      </template>
      <template slot="modal-footer-buttons">
        <p class="control">
          <button class="button is-primary"
                  @click="validateBeforeSubmit()">Save</button>
        </p>
      </template>
      <template slot="right-buttons">
        <p class="control">
          <button class="button"
                  @click="getFakeProfile"> 🎲 Random </button>
        </p>
      </template>
    </epic-modal>
  </div>
</template>
<script>
import helpers from '@/shared/mixins/helpers'
import {
  MediaProfilesCreate,
  MediaProfilesRead
} from '@/media/graphql/MediaProfiles.gql'
import {
  MediaServicesRead,
  MediaServicesSubscription
} from '@/media/graphql/MediaServices.gql'
import { GetRandomData } from '@/shared/graphql/FakerData.gql'
import ImagePicker from '@/shared/components/imagepicker'
import SocialCounts from '@/media/components/social-counts'
import MediaProfile from '@/media/model/mediaprofile'

export default {
  name: 'profile-create',
  components: {
    SocialCounts,
    ImagePicker
  },
  props: {
    open: {
      default: false
    }
  },
  apollo: {
    mediaServices: {
      query: MediaServicesRead,
      variables() {
        return {
          where: {
            OR: [{ name_contains: this.searchQuery }]
          }
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: [
        {
          document: MediaServicesSubscription,
          variables() {
            return {
              where: {
                node: { name_contains: this.searchQuery }
              }
            }
          },
          // Mutate the previous result
          updateQuery: (previousResult, { subscriptionData }) => {
            // Here, return the new result from the previous with the new data
            let mutationIn = subscriptionData.data.mediaService.mutation
            var newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaServices: [
                    ...previousResult.mediaServices,
                    subscriptionData.data.mediaService.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  mediaServices: [
                    ...previousResult.mediaServices.filter(
                      obj =>
                        subscriptionData.data.mediaService.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedMediaServices = JSON.parse(
                  JSON.stringify(previousResult.mediaServices)
                )
                let index = updatedMediaServices.findIndex(
                  x => x.id === subscriptionData.data.mediaService.node.id
                )
                updatedMediaServices[index] =
                  subscriptionData.data.mediaService.node
                newResult = {
                  mediaServices: updatedMediaServices
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
  mixins: [helpers],
  data() {
    return {
      selectedService: null,
      searchQuery: '',
      profileInfo: new MediaProfile(),
      bannerMediaFile: null,
      avatarMediaFile: null
    }
  },
  created() {
    this.profileInfo = JSON.parse(JSON.stringify(this.profileInfo))
    // add random counts
    this.profileInfo.counts = this.getRandomCountsObj('profile')
  },
  methods: {
    getFakeProfile() {
      this.$apollo
        .query({
          query: GetRandomData,
          variables: {
            where: {
              type: 'profile'
            }
          },
          // disable cache for query
          fetchPolicy: 'network-only'
        })
        .then(response => {
          if (response && response.data && response.data.getRandomData) {
            this.profileInfo.name = response.data.getRandomData.data.name
            this.profileInfo.username =
              response.data.getRandomData.data.username
            this.profileInfo.description =
              response.data.getRandomData.data.description

            this.profileInfo.avatar = response.data.getRandomData.data.avatar

            this.avatarMediaFile = {
              create: response.data.getRandomData.data.avatar
            }

            this.profileInfo.banner = {
              mediaFile: response.data.getRandomData.data.banner
            }
            this.bannerMediaFile = {
              create: response.data.getRandomData.data.banner
            }
          }
        })
    },
    async validateBeforeSubmit() {
      let isUniqueCheck = await this.checkUniqueUsernameService()
      this.$validator.validateAll().then(result => {
        if (result && isUniqueCheck == true) {
          this.save()
          return
        }
      })
    },
    save() {
      // this function will be for both insert and update
      if (this.profileInfo.id === '') {
        // Add Profile
        let data = {
          service: {
            connect: {
              name: this.selectedService.name
            }
          },
          username: this.profileInfo.username,
          name: this.profileInfo.name,
          description: this.profileInfo.description,
          isUserGenerated: true,
          counts: this.profileInfo.counts
        }
        if (this.avatarMediaFile) {
          // avatar added
          data = Object.assign(data, {
            avatar: this.avatarMediaFile
          })
        }
        if (this.bannerMediaFile) {
          if (this.bannerMediaFile.create || this.bannerMediaFile.connect) {
            // new banner exists
            data = Object.assign(data, {
              banner: { create: { mediaFile: this.bannerMediaFile } }
            })
          } else {
            if (this.bannerMediaFile.delete && this.profileInfo.banner) {
              data = Object.assign(data, {
                banner: { delete: { mediaFile: this.bannerMediaFile } }
              })
            }
          }
        }

        this.$apollo
          .mutate({
            mutation: MediaProfilesCreate,
            variables: {
              data: data
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
            console.error('Create Profile: ' + error)
          })
      }
    },
    close() {
      this.errors.clear()
      this.$validator.reset()
      this.$emit('close')
      this.profileInfo = new MediaProfile()
      // add random counts
      this.profileInfo.counts = this.getRandomCountsObj('profile')
      this.selectedService = null
      this.bannerMediaFile = null
      this.avatarMediaFile = null
    },
    async checkUniqueUsernameService() {
      let result = true
      await this.$apollo
        .query({
          query: MediaProfilesRead,
          variables: {
            where: {
              username: this.profileInfo.username,
              service: { name: this.profileInfo.service.name }
            }
          }
        })
        .then(response => {
          if (response.data.mediaProfiles.length > 0) {
            //Existing user on service with same username
            this.$buefy.toast.open({
              message:
                'A profile with that username already exists on that site.',
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
          console.error('Check Unique username on service: ' + error)
        })
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.countsData {
  .dropdown-content {
    .field {
      margin-bottom: 0px;
    }
    .field-label {
      padding-right: 3.5rem;
    }
    .icon {
      justify-content: left;
      svg {
        margin-right: 5px;
      }
    }
  }
}
</style>
