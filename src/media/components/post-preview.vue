<template>
  <div class="field"
       v-if="post!=null">
    <loading-state :isLoading='isLoading'
                   :isFullPage='false' />
    <div class="control">
      <post-card :post="mediaPostWithComments"
                 :commentsCount="commentsCount"
                 :isHead="true"
                 cardContentPadding="px-1 py-1"
                 :hasHover="false"
                 :isCard="false"
                 :showQuickMenu="false"
                 :shouldTruncate="false"/>
      <div class="content"
           v-if="mediaPostWithComments && mediaPostWithComments.mediaFile && mediaPostWithComments.mediaFile.url">
        <figure v-if="ifImage(mediaPostWithComments.mediaFile.contentType)"
                class="image">
          <img :src="mediaPostWithComments.mediaFile.url.small"
               alt="image">
        </figure>
        <div class="card-content"
             v-else-if="ifAudio(mediaPostWithComments.mediaFile.contentType)">
          <div class="columns is-centered">
            <div class="column is-half">
              <audio controls>
                <source :src="mediaPostWithComments.mediaFile.url.raw"
                        :type="mediaPostWithComments.mediaFile.contentType">
              </audio>
            </div>
          </div>
        </div>
        <videoplayer v-else-if="ifVideo(mediaPostWithComments.mediaFile.contentType)"
                     :src="mediaPostWithComments.mediaFile.url.raw"></videoplayer>
        <a v-else
           :href="mediaPostWithComments.mediaFile.url.raw">
          File Link
        </a>
      </div>
      <nav class="level">
        <div class="level-item">
          <nav class="breadcrumb breadMenu pb-0">
            <ul>
              <li @click="handleFilterChange('all')"
                  :class="{'is-active':requestedFilter==='all'}">All Comments</li>
              <li @click="handleFilterChange('published')"
                  :class="{'is-active':requestedFilter==='published'}">Published</li>
              <li @click="handleFilterChange('scheduled')"
                  :class="{'is-active':requestedFilter==='scheduled'}">Scheduled</li>
              <li @click="handleFilterChange('drafted')"
                  :class="{'is-active':requestedFilter==='drafted'}">Drafted</li>
            </ul>
          </nav>
        </div>
      </nav>
      <div class="control"
           v-if="mediaPostWithComments && mediaPostWithComments.comments && mediaPostWithComments.comments.length > 0">
        <div class="field">
          <template v-for="comment in mediaPostWithComments.comments">
            <post-card :post="comment"
                       showEdit
                       showDelete
                       :key="comment.id"
                       @deletePost="handleDelete()"/>
          </template>
        </div>
      </div>
      <div class="control"
           v-else>
        <empty-state :data="mediaPostWithComments && mediaPostWithComments.comments ? mediaPostWithComments.comments : null"
                     :isLoading='$apollo.loading'>
          <template slot="custom-message">
            <p class="subtitle has-text-centered">No Comments found.</p>
          </template>
        </empty-state>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'
import { MediaPostReadWithComments } from '@/media/graphql/MediaPosts.gql'

export default {
  name: 'post-preview',
  mixins: [helpers, processText],
  props: {
    post: {
      type: String,
      default: ''
    },
    commentsCount: {
      type: Number,
      default: 0
    }
  },
  apollo: {
    mediaPostWithComments: {
      query: MediaPostReadWithComments,
      variables() {
        let data = this.mediaPostsReadVariables()
        return data
      },
      update(data) {
        this.isLoading = true
        if (
          data &&
          data.mediaPostWithComments &&
          data.mediaPostWithComments[0] &&
          data.mediaPostWithComments[0].id != null
        ) {
          this.isLoading = false
          return data.mediaPostWithComments[0]
        }
      },
      skip() {
        return !this.post
      }
    }
  },
  data() {
    return {
      requestedFilter: 'all',
      isLoading: true
    }
  },
  methods: {
    handleFilterChange(filter) {
      this.requestedFilter = filter
    },
    mediaPostsReadVariables() {
      let data = {
        where: {
          id: this.post
        },
        comments_where: {
          isUserGenerated: true
        },
        orderBy: 'updatedAt_ASC'
      }

      switch (this.requestedFilter) {
        case 'published': {
          data.comments_where = Object.assign(data.comments_where, {
            isPublished: true,
            publishTime_not: null
          })
          break
        }
        case 'scheduled': {
          data.comments_where = Object.assign(data.comments_where, {
            isPublished: false,
            publishTime_not: null
          })
          break
        }
        case 'drafted': {
          data.comments_where = Object.assign(data.comments_where, {
            isPublished: false,
            publishTime: null
          })
          break
        }
      }
      return data
    },
    handleDelete() {
      this.$apollo.queries.mediaPostWithComments.refetch()
    },
    viewProfile(mediaPost) {
      let profile = mediaPost.profiles[0].username
      let service = mediaPost.profiles[0].service.name

      this.$router.push({
        name: 'viewprofile',
        params: { service: service, profile: profile }
      })
    },
    cancel() {
      this.$emit('close')
    }
  },
  computed: {
    checkIsPublished() {
        return (this.mediaPostWithComments.publishTime &&
          this.mediaPostWithComments.isPublished == true)
    },
    checkIsScheduled() {
      return (this.mediaPostWithComments.publishTime &&
          this.mediaPostWithComments.isPublished == false)
    },
    checkIsDraft() {
      return (this.mediaPostWithComments.createTime == null ||
          (this.mediaPostWithComments.isPublished == false &&
            this.mediaPostWithComments.publishTime == null))
    }
  }
}
</script>
<style lang="scss" scoped>
.breadMenu li {
  &.is-active {
    text-decoration: underline;
    font-weight: bold;
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
</style>
