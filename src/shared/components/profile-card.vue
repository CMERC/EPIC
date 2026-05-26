<template>
  <div class="card article profile-card">
    <nav class="level is-pulled-right"
         v-if="showQuickMenu">
      <div class="level-left"></div>
      <div class="level-right">
        <div class="level-item">
          <b-dropdown position="is-bottom-left">
            <a class="button is-small"
               slot="trigger">
              <span class="icon is-small">
                <i class="fas fa-ellipsis-v"></i>
              </span>
            </a>
            <b-dropdown-item @click="editProfile(profile)"
                             v-if="showEdit">
              <span class="icon is-small">
                <i class="fas fa-pen"></i>
              </span>
              <span>Edit Profile</span>
            </b-dropdown-item>
            <b-dropdown-item has-link
                             v-if="showPermalink">
              <a :href="profile.url">
                <span class="icon is-small">
                  <i class="fas fa-link"></i>
                </span>
                <span>Permalink</span>
              </a>
            </b-dropdown-item>
            <hr class="dropdown-divider">
            <b-dropdown-item @click="confirmDelete(profile.id)"
                             v-if="showDelete">
              <span class="icon is-small">
                <i class="fas fa-times has-text-danger"></i>
              </span>
              <span>Delete Profile</span>
            </b-dropdown-item>
            <b-dropdown-item @click="removeProfile(profile.id)"
                             v-if="showDeleteFromPersona">
              <span class="icon is-small">
                <i class="fas fa-minus-circle has-text-danger"></i>
              </span>
              <span>Remove from Persona</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>

      </div>
    </nav>
    <div @click="viewProfile(profile)">
      <div class="card-image"
           v-if="profile.banner">
        <img :src='profile.banner.mediaFile?profile.banner.mediaFile.url.thumb:""'
             alt="Banner">
      </div>
      <div class="card-image"
           :style="'background: '+stringToColor(profile.username)"
           v-else>
      </div>
      <div class="card-content">
        <div class="columns is-centered is-desktop">
          <div class="column is-12">
            <div class="media-center"
                 v-if="profile.avatar">
              <img :src='profile.avatar?profile.avatar.url.thumb:""'
                   alt="image"
                   class="is-avatar xxl author-image">
            </div>
            <div class="media-center"
                 v-else>
              <div class="fa-9x">
                <span class="fa-layers author-image">
                  <i class="fas fa-circle has-text-grey-light"
                     data-fa-transform="grow-1"></i>
                  <i class="fas fa-user-circle has-text-white"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="media-content has-text-centered">
          <p class="title is-6">{{profile.name}}</p>
          <p class="subtitle is-7 has-text-weight-semibold">@{{profile.username}}<br />
            <span class="icon is-small"
                  :style="'color:'+profile.service.color"
                  v-if="profile.service.icon">
              <i :class="profile.service.icon"></i>
            </span>
            <span class="icon is-small"
                  v-else>
              <i class="fas fa-sm"></i>
            </span>
            <span> {{profile.service.displayName}}</span>
          </p>
          <p class="subtitle is-7"
             v-if="profile.description">{{profile.description | truncate(75)}}</p>
        </div>
      </div>
    </div>
    <footer class="card-footer">
      <a @click="createMediaPost(profile)"
         class="card-footer-item">
        Create Post
      </a>
      <a @click="viewProfile(profile)"
         class="card-footer-item">
        View Posts
      </a>
    </footer>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'
import stringcolor from '@/shared/mixins/stringColor'
import mediaPost from '@/shared/mixins/mediaPost'
import { serverError } from '@/shared/serverError'
import { MediaProfilesDelete } from '@/media/graphql/MediaProfiles.gql'
import { MediaPersonasUpdateProfile } from '@/media/graphql/MediaPersonas.gql'

export default {
  name: 'profile-card',
  props: {
    profile: {
      type: Object,
      default: null
    },
    showQuickMenu: {
      type: Boolean,
      default: true
    },
    showEdit: {
      type: Boolean,
      default: false
    },
    showPermalink: {
      type: Boolean,
      default: false
    },
    showDelete: {
      type: Boolean,
      default: false
    },
    showDeleteFromPersona: {
      type: Boolean,
      default: false
    }
  },
  mixins: [helpers, stringcolor, mediaPost],
  data() {
    return {}
  },
  methods: {
    viewProfile(profile) {
      this.$router.push({
        name: 'viewprofile',
        params: { service: profile.service.name, profile: profile.username }
      })
    },
    editProfile(profile) {
      this.$router.push({
        name: 'editprofile',
        params: {
          service: profile.service.name,
          profile: profile.username,
          id: profile.id
        }
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
          this.confirmBox = false
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
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
    },
    removeProfile(profileid) {
      this.$apollo
        .mutate({
          mutation: MediaPersonasUpdateProfile,
          variables: {
            data: {
              profiles: {
                disconnect: {
                  id: profileid
                }
              }
            },
            where: {
              id: this.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Profile Removed from Persona!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Remove Profile from Persona: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.card .media:not(:last-child) {
  height: 0;
}

@media screen and (max-width: 768px - 1px) {
  .profile-card .media-center {
    height: calc(11vh);
  }
}
</style>
