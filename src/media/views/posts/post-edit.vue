<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="mediaPost ? mediaPost.profiles[0].name : ''" />
    <div class="columns is-centered postEdit">
      <div class="column"
           v-if="mediaPost && mediaPost.id != null">
        <div class="columns is-multiline is-centered">
          <div class="column"
               :class="mediaPost.id || parentPostID && mediaPost ? 'is-half-desktop is-12-tablet' : 'is-three-quarters-desktop is-12-tablet'">
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
                  <a :href="mediaPost.url">
                    <span class="icon is-small">
                      <i class="fas fa-link"></i>
                    </span>
                    <span>Permalink</span>
                  </a>
                </b-dropdown-item>
                <hr class="dropdown-divider">
                <b-dropdown-item @click="confirmDelete(mediaPost.id)">
                  <span class="icon is-small">
                    <i class="fas fa-times has-text-danger"></i>
                  </span>
                  <span>Delete Post</span>
                </b-dropdown-item>
              </b-dropdown>
              <div class="card-content">
                <div class="columns is-multiline">
                  <div class="column is-full">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-64x64"
                                v-if="mediaPost.profiles[0] && mediaPost.profiles[0].avatar">
                          <img :src='mediaPost.profiles[0].avatar?mediaPost.profiles[0].avatar.url.small:""'
                               class="is-avatar lg">
                        </figure>
                        <figure class="image is-64x64"
                                v-else>
                          <span class="icon is-large">
                            <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                          </span>
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-6">{{mediaPost.profiles[0].name}}</p>
                        <p class="subtitle is-7 has-text-weight-semibold">@{{mediaPost.profiles[0].username}}<br />
                          <span class="icon is-small"
                                :style="'color:'+mediaPost.profiles[0].service.color"
                                v-if="mediaPost.profiles[0].service.icon">
                            <i :class="mediaPost.profiles[0].service.icon"></i>
                          </span>
                          <span class="icon"
                                v-else>
                            <i class="fas fa-sm"></i>
                          </span>
                          <span> {{mediaPost.profiles[0].service.displayName}}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="column is-full"
                       v-if="mediaPost.profiles && mediaPost.profiles[0].description">
                    <p class="subtitle is-6">
                      {{mediaPost.profiles[0].description}}</p>
                  </div>
                  <div class="column is-full">
                    <div v-if="checkProfile">
                      <label class="label">Title
                        <input class="input"
                               type="text"
                               v-model="mediaPost.title" />
                      </label>
                    </div>
                    <label class="label">
                      Text
                    </label>
                    <div v-if="checkProfile">
                      <div class="has-background-white">
                        <quill-editor ref="quillText"
                                      v-model="mediaPost.text"
                                      :options="editorOption">
                        </quill-editor>
                      </div>
                    </div>
                    <div v-else>
                      <textarea class="textarea"
                                placeholder="Insert Text Here"
                                v-model="mediaPost.text"
                                rows="5"
                                cols="50"
                                ref="textArea"></textarea>
                    </div>

                    <nav class="level">
                      <div class="level-left">
                        <div class="level-item">
                          <custom-emoji-picker v-model="selectedEmoji" />
                        </div>
                        <div class="level-item">
                          <social-counts :postCounts="mediaPost.counts"
                                         :service="mediaPost.profiles[0].service"
                                         countType='post'
                                         @getValues="(value) => {mediaPost.counts = value}" />
                        </div>
                      </div>
                      <div class="level-right">
                        <span class="has-text-grey-light is-pulled-right"
                              v-text="mediaPost.text ? mediaPost.text.length : 0"></span>
                      </div>
                    </nav>

                  </div>
                  <div class="column is-full">
                    <div class="box">
                      <div class="columns is-multiline">
                        <div class="column"
                             :class="mediaPost.id || parentPostID && mediaPost ? 'is-12' : 'is-6'">
                          <label class="label">
                            Media
                          </label>
                          <ImagePicker v-model="postMediaFile"
                                       :mediaFile="mediaPost.mediaFile" />
                        </div>
                        <div class="column">
                          <label class="label">
                            Location
                          </label>
                          <MapLocationPicker v-model="mapData" />
                        </div>
                      </div>
                    </div>
                    <div class="box datePicker">
                      <date-picker :minDate="parentDate"
                                   :label="checkScheduleTime ? 'Scheduled Time': 'Back Date'"
                                   :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                                   showNow
                                   showClear
                                   v-model="mediaPost.publishTime"
                                   @clear="(value) => {mediaPost.publishTime = value}"
                                   @now="(value) => {mediaPost.publishTime = value}"
                                   @changed="(value) => {mediaPost.publishTime = value}"
                                   :placeholder="'Select a time for your post to publish'" />
                    </div>
                  </div>
                </div>
              </div>
              <footer class="modal-card-foot post-footer">
                <div class="field is-grouped is-grouped-left">
                  <a class="button is-primary"
                     @click="confirm('publishNow')"
                     v-if="checkPublishNow">
                    Publish Now
                  </a>
                  <a class="button is-primary"
                     @click="confirm('schedule')"
                     v-else-if="checkScheduleTime">
                    Schedule Post
                  </a>
                  <a class="button is-primary"
                     @click="confirm('publishNow')"
                     v-else>
                    Back Date Post
                  </a>
                  <a class="button is-primary is-outlined"
                     @click="confirm('draft')"
                     v-if="mediaPost.isPublished == false">
                    Save Draft
                  </a>
                  <a class="button"
                     @click="$router.go(-1)">
                    Cancel
                  </a>
                </div>
                <div class="field is-grouped is-grouped-right">
                  <button class="button"
                          @click="getFakePost">
                    🎲 Random
                  </button>
                </div>
              </footer>
            </div>
          </div>
          <div class="column"
               v-if="parentPostID || mediaPost.id && mediaPost">
            <div class="card">
              <div class="card-content">
                <PostPreview :post="parentPostID || mediaPost.id"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column"
           v-else>
        <empty-state :data="mediaPost && mediaPost.id ? mediaPost : null"
                     :isLoading='isLoading' />
      </div>
    </div>
  </div>
</template>

<script>
import { serverError } from '@/shared/serverError'
import PostPreview from '@/media/components/post-preview'
import CustomEmojiPicker from '@/shared/components/emojipicker.vue'
import MapLocationPicker from '@/shared/components/maplocationpicker'
import SocialCounts from '@/media/components/social-counts'
import ImagePicker from '@/shared/components/imagepicker'
import helpers from '@/shared/mixins/helpers'
import DatePicker from '@/shared/components/datepicker'
import { GetRandomData } from '@/shared/graphql/FakerData.gql'
import {
  MediaPostRead,
  MediaPostsDelete,
  MediaPostsUpdate
} from '@/media/graphql/MediaPosts.gql'
import Vue from 'vue'

let toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link'],

  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }, { align: [] }] // outdent/indent
]

export default {
  name: 'edit-post',
  mixins: [helpers],
  components: {
    DatePicker,
    MapLocationPicker,
    ImagePicker,
    CustomEmojiPicker,
    PostPreview,
    SocialCounts
  },
  props: {
    profile: {
      type: String,
      default: ''
    },
    service: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  apollo: {
    mediaPost: {
      query: MediaPostRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      skip() {
        return !this.id
      },
      update(data) {
        if (data && data.mediaPost) {
          this.quillText = data.mediaPost.text
          let counts
          if (data.mediaPost.location) {
            delete data.mediaPost.location.id
            this.mapData = JSON.parse(
              JSON.stringify(data.mediaPost.location),
              this.omitTypename
            )
          }
          // check if post has counts
          if (!data.mediaPost.counts || !data.mediaPost.counts.likes) {
            counts = this.getRandomCountsObj('post')
            if (data.mediaPost.profiles[0].service.type === 'VIDEO') {
              counts.dislikes = Math.floor(Math.random() * 150 + 1)
            }
          } else {
            counts = JSON.parse(
              JSON.stringify(data.mediaPost.counts),
              this.omitTypename
            )
          }
          this.isLoading = false
          return Vue.util.extend({}, { ...data.mediaPost, counts })
        } else {
          this.isLoading = false
        }
      }
    }
  },
  data() {
    return {
      parentDate: this.$route.query.min,
      parentPostID: this.$route.query.c,
      isLoading: true,
      selectedEmoji: null,
      currDate: this.moment().toISOString(),
      loadingState: 0,
      htmlSet: false,
      mediaPost: null,
      quillText: '',
      selectedProfile: null,
      editorOption: {
        modules: {
          toolbar: toolbarOptions
        }
      },
      postMediaFile: null,
      mapData: null
    }
  },
  watch: {
    selectedEmoji: function() {
      this.insertEmoji(this.selectedEmoji)
    }
  },
  methods: {
    save() {
      let currentDate = new Date().toISOString()
      if (this.mediaPost.id) {
        // Create $data object
        let data = {
          isPublished: this.mediaPost.isPublished,
          title: this.mediaPost.title,
          text: this.htmlSet === true ? this.quillText : this.mediaPost.text,
          createTime: this.mediaPost.publishTime,
          updateTime: currentDate === '' ? null : currentDate,
          publishTime: this.mediaPost.publishTime,
          counts: this.mediaPost.counts
        }

        let dbMapData
        if (this.mediaPost.location) {
          if (this.mapData) {
            // update
            dbMapData = {
              location: {
                update: this.mapData
              }
            }
          } else {
            // delete location
            dbMapData = {
              location: { delete: true }
            }
          }
        } else {
          // create
          if (this.mapData)
            dbMapData = {
              location: {
                create: this.mapData
              }
            }
        }

        if (this.mapData || this.mediaPost.location) {
          data = Object.assign(data, dbMapData)
        }

        if (this.postMediaFile) {
          // mediaFile added
          if (this.postMediaFile.create || this.postMediaFile.connect) {
            data = Object.assign(data, {
              mediaFile: this.postMediaFile
            })
          } else {
            // if post already has an image, delete
            if (this.postMediaFile.delete && this.mediaPost.mediaFile)
              data = Object.assign(data, {
                mediaFile: { delete: true }
              })
          }
        }

        // Update post in database
        this.$apollo
          .mutate({
            mutation: MediaPostsUpdate,
            variables: {
              data,
              where: {
                id: this.mediaPost.id
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.open = false
            this.postMediaFile = null
            this.mapData = null
            this.$router.go(-1)
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
            console.error('Post Updated: ' + error)
          })
      }
    },
    confirm(type) {
      switch (type) {
        case 'draft':
          if (
            this.mediaPost.publishTime !== null ||
            this.mediaPost.publishTime !== ''
          ) {
            this.$buefy.dialog.confirm({
              title: 'Are you Sure?',
              message: `This post will save as a draft and will not be published. Continue?`,
              type: 'is-warning',
              onConfirm: () => {
                this.mediaPost.isPublished = false
                this.mediaPost.publishTime = null
                this.save()
              }
            })
          }

          break
        case 'schedule':
          this.$buefy.dialog.confirm({
            title: 'Are you Sure?',
            message: `This will post will publish automatically at the time selected, are you sure?`,
            type: 'is-warning',
            onConfirm: () => {
              this.mediaPost.isPublished = false
              this.save()
            }
          })
          break
        case 'publishNow':
          this.$buefy.dialog.confirm({
            title: 'Are you Sure?',
            message: `This will publish your post immediately and cannot be undone, are you sure?`,
            type: 'is-warning',
            onConfirm: () => {
              this.mediaPost.isPublished = true
              if (
                this.mediaPost.publishTime === null ||
                this.mediaPost.publishTime === ''
              ) {
                this.mediaPost.createTime = this.moment().toISOString()
                this.mediaPost.publishTime = this.moment().toISOString()
              }
              this.save()
            }
          })
          break
      }
    },
    insertEmoji(emoji) {
      let txtarea = this.$refs.textArea
      let quillTxt = this.$refs.quillText

      if (quillTxt === undefined) {
        // get cursor's position:
        let cursorPos = txtarea.selectionStart
        let tmpStr = txtarea.value
        // insert:
        this.mediaPost.text =
          tmpStr.substring(0, txtarea.selectionStart) +
          emoji +
          tmpStr.substring(txtarea.selectionEnd, tmpStr.length)

        // move cursor:
        setTimeout(() => {
          cursorPos += emoji ? emoji.length : 0
          txtarea.selectionStart = txtarea.selectionEnd = cursorPos
        }, 10)
      } else {
        if (emoji) this.mediaPost.text += emoji
      }
    },
    confirmDelete(post) {
      this.$buefy.dialog.confirm({
        title: 'Delete Post',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePost(post)
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
        .then(() => {
          this.$buefy.toast.open({
            message: 'Post Deleted!',
            type: 'is-success'
          })
          this.$router.go(-1)
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Post Deleted: ' + error)
        })
    },
    getFakePost() {
      this.$apollo
        .query({
          query: GetRandomData,
          variables: {
            where: {
              type: 'post'
            }
          },
          // disable cache for query
          fetchPolicy: 'network-only'
        })
        .then(response => {
          if (response && response.data && response.data.getRandomData) {
            this.mediaPost.text = response.data.getRandomData.data.text
            this.mapData = response.data.getRandomData.data.location

            let timeZone = this.$store.state.activeWorkspace.timeZone
            if (!timeZone) {
              timeZone = this.momentTimezone.tz.guess(true)
            }

            let publishDate = response.data.getRandomData.data.publishTime
            //reverse out local timezone
            let newDate
            if (isNaN(publishDate)) {
              newDate = new Date(publishDate)
            } else {
              newDate = new Date(parseInt(publishDate))
            }

            let momentDate = this.moment(newDate)

            let localizedDate = this.momentTimezone(momentDate)
              .tz(this.momentTimezone.tz.guess(true))
              .format()
            //cast to new Timezone
            let date = this.moment
              .tz(
                this.moment(localizedDate).format('YYYY-MM-DDTHH:mm:ss'),
                'YYYY-MM-DDTHH:mm:ss',
                timeZone
              )
              .format()
            //convert that to UTC
            let utcDate = this.moment
              .parseZone(date)
              .utc()
              .format()

            this.mediaPost.publishTime = utcDate
          }
        })
    }
  },
  mounted() {
    this.$apollo.queries.mediaPost.refetch()
  },
  computed: {
    checkProfile() {
      let checkProfile =
        this.mediaPost &&
        this.mediaPost.profiles[0] &&
        this.mediaPost.profiles[0].service &&
        this.mediaPost.profiles[0].service.type !== 'SOCIALMEDIA'

      return checkProfile
    },
    checkComment() {
      let checkComment =
        this.addComment &&
        this.addComment.profiles[0] &&
        this.addComment.profiles[0].name

      return checkComment
    },
    checkScheduleTime() {
      let checkScheduleTime =
        this.mediaPost.publishTime >= this.currDate ||
        this.mediaPost.publishTime === null ||
        this.mediaPost.publishTime === ''

      return checkScheduleTime
    },
    checkPublishNow() {
      return (
        this.mediaPost.publishTime == null || this.mediaPost.publishTime == ''
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1024px - 1px) {
  .postEdit {
    .post-footer {
      flex-wrap: wrap;
    }
  }
}
.postEdit {
  .panel {
    margin-bottom: initial;
  }
  .column.is-narrow {
    padding: initial;
    margin: initial;
  }
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

  .post-footer {
    justify-content: space-between;
    .is-grouped-right {
      margin-bottom: 0.75rem;
    }
  }
}
</style>
