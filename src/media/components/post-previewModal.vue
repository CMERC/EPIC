<template>
  <div class="container">
    <epic-modal :open="open"
                @close="close"
                v-if="postObj"
                :showBackground="!showProfileSelector">
      <template slot="modal-title">
        <p class="modal-card-title">
          <span class="icon is-small"
                :style="'color:'+postObj.profiles[0].service.color"
                v-if="postObj.profiles[0].service.icon">
            <i :class="postObj.profiles[0].service.icon"></i>
          </span>
          <span class="icon"
                v-else>
            <i class="fas fa-sm"></i>
          </span>
          <span> {{postObj.profiles[0].service.displayName}}</span>
        </p>
      </template>
      <template slot="modal-body">
        <PostPreview :post="post"
                     :commentsCount="commentsCount"/>
      </template>
      <template slot="modal-footer-buttons">
        <p class="control">
          <button class="button is-primary"
                  @click="editPost(postObj)">Edit Post</button>
        </p>
        <p class="control">
          <button class="button is-primary is-outlined"
                  @click="permalinkPost(postObj)">View Post</button>
        </p>
        <p class="control"
           v-if="postObj && postObj.parent == null">
          <button class="button is-primary is-outlined"
                  @click="openProfileSelector(postObj)">Create Comment</button>
        </p>
      </template>
    </epic-modal>
    <profile-select-modal v-if="showProfileSelector"
                          :open="showProfileSelector"
                          :authorID="parentPostAuthorID"
                          :service="selectedService"
                          @close="closeProfileSelector"
                          @select="createMediaPost($event, parentPost, parentDate)" />
  </div>
</template>

<script>
import ProfileSelectModal from '@/shared/components/profile-selectModal'
import PostPreview from '@/media/components/post-preview'
import mediaPost from '@/shared/mixins/mediaPost'
export default {
  name: 'post-previewModal',
  components: { PostPreview, ProfileSelectModal },
  mixins: [mediaPost],
  props: {
    open: {
      default: false
    },
    postObj: {
      type: Object,
      default: null
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    post: {
      type: String,
      default: ''
    },
    service: {
      type: String,
      default: ''
    },
    authorID: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showProfileSelector: false,
      selectedService: '',
      parentPostAuthorID: '',
      parentPost: '',
      parentDate: '',
      selectedProfile: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    editPost(mediaPost) {
      let queryParam
      if (mediaPost.parent) {
        queryParam = {
          c: mediaPost.parent.id,
          min: mediaPost.parent.publishTime
        }
      }

      let profile = mediaPost.profiles[0].username
      let service = mediaPost.profiles[0].service.name
      let postId = mediaPost.id
      this.$router.push({
        name: 'editpost',
        params: {
          profile: profile,
          service: service,
          id: postId
        },
        query: queryParam
      })
    },
    permalinkPost(mediaPost) {
      let profile = mediaPost.profiles[0].username
      let service = mediaPost.profiles[0].service.name
      let postId = mediaPost.id
      this.$router.push({
        path: `/web/${
          this.$store.state.activeWorkspace.name
        }/${service}/${profile}/${postId}`
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
  }
}
</script>
