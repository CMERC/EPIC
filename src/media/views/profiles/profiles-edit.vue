<template>
  <div class="container">
    <breadcrumb :currentPage="mediaProfile? mediaProfile.name: ''" />
    <nav class="level is-pulled-right">
      <div class="level-left"></div>
      <div class="level-right">
        <div class="level-item">
          <help-content :reference="'media.editprofiles'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div class="columns is-centered"
         v-if="mediaProfile && mediaProfile.id != null">
      <div class="column is-three-quarters">
        <div class="card">
          <b-dropdown position="is-bottom-left"
                      class="is-pulled-right">
            <a class="button is-small"
               slot="trigger">
              <span class="icon is-small">
                <i class="fas fa-ellipsis-v"></i>
              </span>
            </a>
            <b-dropdown-item has-link>
              <a :href="mediaProfile.url">
                <span class="icon is-small">
                  <i class="fas fa-link"></i>
                </span>
                <span>Permalink</span>
              </a>
            </b-dropdown-item>
            <hr class="dropdown-divider">
            <b-dropdown-item @click="confirmDelete(mediaProfile.id)">
              <span class="icon is-small">
                <i class="fas fa-times has-text-danger"></i>
              </span>
              <span>Delete Profile</span>
            </b-dropdown-item>
          </b-dropdown>
          <div class="card-content">
            <label class="label">
              Site
            </label>
            <div class="control">
              <input type="text"
                     class="input is-disabled"
                     v-model="mediaProfile.service.displayName"
                     disabled>
            </div>
            <label class="label">Name
              <input class="input"
                     name="name"
                     type="text"
                     v-model="mediaProfile.name"
                     v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('name') }" />
              <span v-show="errors.has('name')"
                    class="help is-danger">{{errors.first('name') }}</span>
            </label>
            <label class="label">Username
              <p class="control has-icons-left">
                <input class="input is-disabled"
                       name="username"
                       type="text"
                       v-model="mediaProfile.username"
                       disabled />
                <span class="icon is-small is-left">
                  <i class="fas fa-at"></i>
                </span>
              </p>
            </label>
            <label class="label">Description
              <input class="input"
                     type="text"
                     v-model="mediaProfile.description" />
            </label>
            <div class="countsData"
                 v-if="mediaProfile && mediaProfile.counts">
              <label class="label">
                Follower/Following
              </label>
              <social-counts :profileCounts="mediaProfile.counts"
                             :service="mediaProfile.service"
                             countType='profile'
                             @getValues="(value) => {mediaProfile.counts = value}" />
            </div>
            <div class="columns is-multiline">
              <div class="column is-half-desktop is-12-tablet">
                <div class="box">
                  <label class="label">
                    Avatar
                  </label>
                  <ImagePicker v-model="avatarMediaFile"
                               v-bind:rootSearch="'avatar'"
                               :mediaFile='mediaProfile.avatar?mediaProfile.avatar:""' />
                </div>
              </div>
              <div class="column">
                <div class="box">
                  <label class="label">
                    Banner
                  </label>
                  <ImagePicker v-model="bannerMediaFile"
                               :mediaFile='mediaProfile.banner?mediaProfile.banner.mediaFile:""' />
                </div>
              </div>
            </div>
          </div>
          <footer class="modal-card-foot">
            <a class="button is-primary"
               @click="save()">
              Save
            </a>
            <button class="button is-primary is-outlined"
                    @click="cancel()">
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </div>
    <div v-else>
      <empty-state :data="mediaProfile"
                   :isLoading='$apollo.loading' />
    </div>
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import Vue from 'vue'
import SocialCounts from '@/media/components/social-counts'
import helpers from '@/shared/mixins/helpers'
import { serverError } from '@/shared/serverError'
import {
  MediaProfileRead,
  MediaProfilesUpdate,
  MediaProfilesDelete
} from '@/media/graphql/MediaProfiles.gql'
import ImagePicker from '@/shared/components/imagepicker'

export default {
  name: 'ProfileEdit',
  components: {
    SocialCounts,
    ImagePicker,
    HelpContent
  },
  props: {
    profile: {},
    service: {},
    id: {}
  },
  mixins: [helpers],
  apollo: {
    mediaProfile: {
      query: MediaProfileRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      update(data) {
        let counts
        // check if profile has counts
        if (data.mediaProfile.counts && data.mediaProfile.counts.followers) {
          counts = JSON.parse(
            JSON.stringify(data.mediaProfile.counts),
            this.omitTypename
          )
        } else {
          counts = this.getRandomCountsObj('profile')
        }
        return Vue.util.extend({}, { ...data.mediaProfile, counts })
      }
    }
  },
  data() {
    return {
      mediaProfile: null,
      bannerMediaFile: null,
      avatarMediaFile: null
    }
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
    save() {
      let data = {
        name: this.mediaProfile.name,
        description: this.mediaProfile.description,
        isUserGenerated: true,
        counts: this.mediaProfile.counts
      }

      if (this.avatarMediaFile) {
        // avatar added
        data = Object.assign(data, {
          avatar: this.avatarMediaFile
        })
      }
      if (this.bannerMediaFile) {
        if (this.bannerMediaFile.delete && this.mediaProfile.banner) {
          data = Object.assign(data, {
            banner: { delete: true }
          })
        } else {
          // banner added
          data = Object.assign(data, {
            banner: { create: { mediaFile: this.bannerMediaFile } }
          })
        }
      }

      this.$apollo
        .mutate({
          mutation: MediaProfilesUpdate,
          variables: {
            data: data,
            where: {
              id: this.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          this.$router.go(-1)
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Update Profile: ' + error)
        })
    },
    deleteMediaProfile(profile) {
      // Delete Media Profile
      this.$apollo
        .mutate({
          mutation: MediaProfilesDelete,
          variables: {
            id: {
              id: profile
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Profile Deleted!',
            type: 'is-success'
          })
          this.selectedProfile = ''
          this.$router.go(-1)
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Delete Profile: ' + error)
        })
    },
    confirmDelete(profile) {
      this.$buefy.dialog.confirm({
        title: 'Delete Profile',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteMediaProfile(profile)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.countsData {
  .dropdown {
    padding-bottom: 10px;
  }
  .dropdown-content {
    .field-label {
      padding-right: 3.5rem;
    }
    .icon {
      justify-content: left;
    }
  }
}
</style>
