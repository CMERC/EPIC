<template>
  <div class="posts"
       v-if="post"
       :class="{'card': isCard, 'has-hover': hasHover}">
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item"
             v-if="post && post.parent !== null"
             @click="previewPost(post.parent)">
          <span class="icon is-small">
            <i class="far fa-comment"></i>
          </span>
          <span class="is-size-7 has-text-underlined">In response to @{{post.parent ? `${post.parent.profiles[0].username}'s post` : null}}</span>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item"
             v-if="checkIsPublished || checkIsScheduled || checkIsDraft">
          <span class="subtitle is-7"
                v-if="checkIsPublished">Published</span>
          <span class="subtitle is-7"
                v-else-if="checkIsScheduled">Scheduled</span>
          <span class="subtitle is-7"
                v-else-if="checkIsDraft">Draft</span>
          <span class="subtitle is-7"
                v-else>Unknown</span>
        </div>
        <div class="level-item"
             v-if="commentsCount && commentsCount !== 0">
          <span class="fa-layers fa-fw">
            <i class="far fa-comments"></i>
            <span class="fa-layers-counter fa-custom-counter has-background-primary">{{commentsCount}}</span>
          </span>
        </div>
        <div class="level-item"
             v-if="post.location">
          <geocode :coordinates="post.location.geojson.coordinates"
                   :display="'tooltip'"></geocode>
        </div>

        <div class="level-item"
             v-if="post.mediaFile && post.mediaFile.url">
          <i :class="getIcon(post.mediaFile.contentType)"></i>
        </div>

        <div class="level-item"
             v-if="showQuickMenu">
          <b-dropdown position="is-bottom-left">
            <a class="button is-small"
               slot="trigger">
              <span class="icon is-small">
                <i class="fas fa-ellipsis-v"></i>
              </span>
            </a>
            <b-dropdown-item v-if="showEdit"
                             @click="editPost(post)">
              <span class="icon is-small">
                <i class="fas fa-pen"></i>
              </span>
              <span>Edit {{post && post.parent == null ? 'Post': 'Comment'}}</span>
            </b-dropdown-item>
            <b-dropdown-item v-if="showCreateComment && post && post.parent == null"
                             @click="openProfileSelector(post)">
              <span class="icon is-small">
                <i class="far fa-comment"></i>
              </span>
              <span>Create Comment</span>
            </b-dropdown-item>
            <b-dropdown-item v-if="showViewProfile"
                             @click="viewProfile(post)">
              <span class="icon is-small">
                <i class="fas fa-user"></i>
              </span>
              <span>View Profile</span>
            </b-dropdown-item>
            <b-dropdown-item has-link
                             v-if="showPermalink" >
              <a :href="post.url"
                 class="dropdown-item">
                <span class="icon is-small">
                  <i class="fas fa-link"></i>
                </span>
                <span>Permalink</span>
              </a>
            </b-dropdown-item>
            <hr class="dropdown-divider">
            <b-dropdown-item v-if="showDelete"
                             @click="confirmDelete(post.id)">
              <span class="icon is-small">
                <i class="fas fa-times has-text-danger"></i>
              </span>
              <span>Delete {{post && post.parent == null ? 'Post': 'Comment'}}</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>
    <div class="card-content"
         @click="previewPost(post)"
         :class="cardContentPadding">
      <div class="media">
        <div class="media-left">
          <figure class="image is-64x64"
                  v-if="post.profiles[0] && post.profiles[0].avatar">
            <img :src='post.profiles[0].avatar?post.profiles[0].avatar.url.small:""'
                 class="is-avatar lg">
          </figure>
          <figure class="image is-64x64"
                  v-else>
            <span class="icon is-large">
              <i class="fas fa-user-circle has-text-grey fa-3x"></i>
            </span>
          </figure>
        </div>
        <div class="media-content"
             v-if="post.profiles[0]">
          <p>
            <span class="title is-6">{{post.profiles[0].name}}</span>
            <span class="subtitle is-6"> @{{post.profiles[0].username}}</span>
          </p>
          <span class="subtitle is-7 tooltip"
                :data-tooltip="formatDate(post.createTime, 'utc-dtg')">{{formatDate(post.createTime, 'convertDate')}}</span>
          <p>
            <span class="icon is-small"
                  :style="'color:'+post.profiles[0].service.color"
                  v-if="post.profiles[0].service.icon">
              <i :class="'fa-sm '+post.profiles[0].service.icon"></i>
            </span>
            <span class="icon is-small"
                  v-else>
              <i class="fas fa-sm"></i>
            </span>
            <span class="subtitle is-7">{{post.profiles[0].service.displayName}}</span>
          </p>
        </div>
      </div>
      <div class="content"
           v-if="shouldTruncate"
           :class="{'should-truncate': shouldTruncate}">
        <p class="subtitle is-6">{{post.title | truncate(70)}}</p>
        <p class="subtitle is-6"
           v-html="parseText(truncate(processPost(post.text, post.profiles[0].service)), 200)"></p>
      </div>
      <div class="content"
           v-else>
        <p class="subtitle is-6">{{post.title}}</p>
        <p class="subtitle is-6"
           v-html="parseText(processPost(post.text, post.profiles[0].service))"></p>
      </div>
    </div>
    <profile-select-modal v-if="showProfileSelector"
                          :open="showProfileSelector"
                          :authorID="parentPostAuthorID"
                          :service="selectedService"
                          @close="closeProfileSelector"
                          @select="createMediaPost($event, parentPost, parentDate)" />
    <post-preview-modal v-if="previewModal"
                        :open="previewModal"
                        :postObj="postObj"
                        :commentsCount="postObj && postObj.comments ? postObj.comments.length : 0"
                        :post="postObj.id"
                        @close="closeModal"></post-preview-modal>
  </div>
</template>

<script>
import PostPreviewModal from '@/media/components/post-previewModal'
import ProfileSelectModal from '@/shared/components/profile-selectModal'
import Geocode from '@/shared/components/geocode'
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'
import mediaPost from '@/shared/mixins/mediaPost'

import { MediaPostsDelete } from '@/media/graphql/MediaPosts.gql'
export default {
  name: 'post-card',
  props: {
    post: {
      type: Object,
      default: null
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    isPostPreview: {
      type: Boolean,
      default: false
    },
    isCard: {
      type: Boolean,
      default: true
    },
    cardContentPadding: {
      type: String,
      default: 'px-5 py-5'
    },
    hasHover: {
      type: Boolean,
      default: true
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
    showCreateComment: {
      type: Boolean,
      default: false
    },
    showViewProfile: {
      type: Boolean,
      default: false
    },
    shouldTruncate: {
      type: Boolean,
      default: true
    }
  },
  components: {
    PostPreviewModal,
    ProfileSelectModal,
    Geocode
  },
  mixins: [helpers, processText, mediaPost],
  data() {
    return {
      previewModal: false,
      selectedService: '',
      parentPostAuthorID: '',
      parentPost: '',
      parentDate: '',
      postObj: null,
      selectedPostID: null,
      showProfileSelector: false
    }
  },
  methods: {
    closeModal() {
      this.previewModal = false
      this.postObj = null
    },
    previewPost(post, location) {
      if (this.isPostPreview && location == 'parent') return
      this.selectedPostID = post.id
      this.postObj = post
      this.previewModal = true
    },
    editPost(mediaPost) {
      let queryParam
      if (mediaPost.parent) {
        queryParam = {
          c: mediaPost.parent.id,
          min: mediaPost.parent.publishTime
        }
      }

      this.$router.push({
        name: 'editpost',
        params: {
          profile: mediaPost.profiles[0].username,
          service: mediaPost.profiles[0].service.name,
          id: mediaPost.id
        },
        query: queryParam
      })
    },
    viewProfile(mediaPost) {
      this.$router.push({
        name: 'viewprofile',
        params: {
          service: mediaPost.profiles[0].service.name,
          profile: mediaPost.profiles[0].username
        }
      })
    },
    deletePost(post) {
      // delete post
      this.$apollo
        .mutate({
          mutation: MediaPostsDelete,
          variables: {
            id: {
              id: post
            }
          }
        })
        .then(response => {
          if (response && response.data.deleteMediaPost) {
            this.$buefy.toast.open({
              message: 'Post Deleted!',
              type: 'is-success'
            })
            this.$emit('deletePost')
          }
          this.selectProfile = ''
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Post Deleted: ' + error)
        })
    },
    confirmDelete(post) {
      this.$buefy.dialog.confirm({
        title: 'Delete Post',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePost(post)
      })
    },
    openProfileSelector(parentPost) {
      if (parentPost) {
        this.selectedService = parentPost.profiles[0].service.name
        this.parentPostAuthorID = parentPost.profiles[0].id
        this.parentPost = parentPost.id
        this.parentDate = parentPost.publishTime
      }
      this.showProfileSelector = true
    },
    closeProfileSelector() {
      this.selectedService = ''
      this.parentPostAuthorID = ''
      this.parentPost = ''
      this.showProfileSelector = false
    }
  },
  computed: {
    checkIsPublished() {
      if (this.post) {
        let checkPublished =
          this.post.publishTime && this.post.isPublished == true

        return checkPublished
      }
    },
    checkIsScheduled() {
      if (this.post) {
        let checkScheduled =
          this.post.publishTime && this.post.isPublished == false
        return checkScheduled
      }
    },
    checkIsDraft() {
      if (this.post) {
        let checkDraft =
          this.post.createTime == null ||
          (this.post.isPublished == false && this.post.publishTime == null)
        return checkDraft
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.posts {
  .fa-custom-counter {
    transform: scale(0.5) translateX(50%) translateY(-50%);
    position: absolute;
    top: 2px;
  }
  & nav.level {
    margin-bottom: 0;
    & .level-left {
      .level-item .icon {
        margin: 0 0.5rem;
      }
    }
  }
  .should-truncate.content {
    width: 100%;
    * {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &.has-hover:hover {
    cursor: pointer;
    background-color: #d7dcdd;
  }
}

.content {
  word-wrap: break-word;
}
.card-content {
  padding: 0;
  & .column {
    padding: 0;
  }
  & .content figure {
    margin-left: 0;
    margin-right: 0;
  }
}

@media screen and (max-width: 768px) {
  .posts {
    & nav.level {
      span.is-size-7 {
        font-size: 0.5rem !important;
      }
    }
  }
}
</style>
