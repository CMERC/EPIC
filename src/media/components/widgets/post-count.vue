<template>
  <div>
    <div class="card"
         v-if="small==false">
      <nav class="level is-pulled-right"
           v-if="type =='Posted' && mediaPostsCount !== undefined">
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
              <b-dropdown-item has-link>
                <a @click="setDate('hour')">
                  <span class="icon is-small">
                    <i class="fas fa-stopwatch"></i>
                  </span>
                  <span>Hour</span>
                </a>
              </b-dropdown-item>
              <b-dropdown-item has-link>
                <a @click="setDate('day')">
                  <span class="icon is-small">
                    <i class="fas fa-clock"></i>
                  </span>
                  <span>Day</span>
                </a>
              </b-dropdown-item>
              <b-dropdown-item has-link>
                <a @click="setDate('week')">
                  <span class="icon is-small">
                    <i class="fas fa-calendar"></i>
                  </span>
                  <span>Week</span>
                </a>
              </b-dropdown-item>
              <b-dropdown-item has-link>
                <a @click="setDate('month')">
                  <span class="icon is-small">
                    <i class="fas fa-calendar"></i>
                  </span>
                  <span>Month</span>
                </a>
              </b-dropdown-item>
              <b-dropdown-item has-link>
                <a @click="setDate('ever')">
                  <span class="icon is-small">
                    <i class="fas fa-calendar"></i>
                  </span>
                  <span>Ever</span>
                </a>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </nav>
      <a @click="viewSection(type)">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <span class="icon is-large"
                    v-if="type =='All Posts'">
                <i class="far fa-comment-dots fa-3x has-text-posts"></i>
              </span>
              <span class="icon is-large"
                    v-if="type =='Published'">
                <i class="far fa-file fa-3x has-text-published"></i>
              </span>
              <span class="icon is-large"
                    v-if="type =='Drafted'">
                <i class="fas fa-pencil-ruler fa-3x has-text-drafts"></i>
              </span>
              <span class="icon is-large"
                    v-if="type =='Scheduled'">
                <i class="far fa-clock fa-3x has-text-scheduled"></i>
              </span>
              <span class="icon is-large"
                    v-if="type =='Posted'">
                <i class="fas fa-chart-line fa-3x has-text-posted"></i>
              </span>
            </div>
            <div class="media-content">
              <p class="title has-text-right is-size-6">{{type}}</p>
              <p class="subtitle has-text-right is-size-3">
                <loading-state :isLoading='isLoading' />
                <span v-if="mediaPostsCount !== undefined"
                      class="tooltip"
                      :data-tooltip="mediaPostsCount | formatNumber('thousands')">
                  <span v-if="mediaPostsCount < 10000">{{mediaPostsCount | formatNumber('thousands')}}</span>
                  <span v-else>{{mediaPostsCount | formatNumber('abbreviate')}}</span>
                </span>
              </p>
              <p class="subtitle has-text-right is-size-6 unitOfTime"
                 v-if="type =='Posted'">last {{unitOfTime}}</p>
            </div>
          </div>
        </div>
      </a>
    </div>
    <span class="tag is-success"
          v-else>Posts: {{mediaPostsCount | formatNumber('thousands')}}</span>
  </div>
</template>

<script>
import { MediaPostsCounts } from '@/media/graphql/MediaPosts.gql'
export default {
  name: 'post-count',
  props: {
    small: {
      default: false
    },
    type: {
      default: 'All Posts'
    }
  },
  apollo: {
    mediaPostsCount: {
      query: MediaPostsCounts,
      variables() {
        let variables
        switch (this.type) {
          case 'All Posts': {
            variables = {}
            break
          }
          case 'Drafted': {
            variables = {
              where: {
                isPublished: false,
                publishTime: null,
                isUserGenerated: true
              }
            }
            break
          }
          case 'Published': {
            variables = {
              where: { isUserGenerated: true, isPublished: true }
            }
            break
          }
          case 'Scheduled': {
            variables = {
              where: {
                isPublished: false,
                publishTime_not: null,
                isUserGenerated: true
              }
            }
            break
          }
          case 'Posted': {
            variables = {
              where: {
                createTime_gte: this.beginDate,
                createTime_lte: this.moment()
              }
            }
          }
        }
        return variables
      },
      update(data) {
        if (data && data.mediaPostsConnection) {
          this.isLoading = false
          return data.mediaPostsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      isLoading: true,
      mediaPostsCount: [],
      unitOfTime: 'hour',
      beginDate: this.moment()
        .subtract(1, 'h')
        .toISOString()
    }
  },
  methods: {
    viewSection(area) {
      switch (area) {
        case 'All Posts':
          this.$router.push({
            name: 'posts-filter',
            params: { requestedFilter: 'all' }
          })
          break
        case 'Published':
          this.$router.push({
            name: 'posts-filter',
            params: { requestedFilter: 'published' }
          })
          break
        case 'Drafted':
          this.$router.push({
            name: 'posts-filter',
            params: { requestedFilter: 'drafted' }
          })
          break
        case 'Scheduled':
          this.$router.push({
            name: 'posts-filter',
            params: { requestedFilter: 'scheduled' }
          })
          break
        case 'Posted':
          this.$router.push({
            name: 'posts-filter',
            params: { requestedFilter: 'noise' }
          })
          break
      }
    },
    setDate(timeframe) {
      switch (timeframe) {
        case 'hour':
          this.unitOfTime = 'hour'
          this.beginDate = this.moment()
            .subtract(1, 'h')
            .toISOString()
          break
        case 'day':
          this.unitOfTime = 'day'
          this.beginDate = this.moment()
            .subtract(1, 'd')
            .toISOString()
          break
        case 'week':
          this.unitOfTime = 'week'
          this.beginDate = this.moment()
            .subtract(1, 'w')
            .toISOString()
          break
        case 'month':
          this.unitOfTime = 'month'
          this.beginDate = this.moment()
            .subtract(1, 'M')
            .toISOString()
          break
        case 'ever':
          this.unitOfTime = 'ever'
          this.beginDate = this.moment(0).toISOString()
          break
      }
    }
  }
}
</script>
