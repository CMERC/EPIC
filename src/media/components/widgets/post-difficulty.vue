<template>
  <div>
    <div class="card"
         v-if="small==false">
      <nav class="level is-pulled-right"
           v-if="mediaPostsCount !== undefined">
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
      <router-link :to="{name: 'noise'}">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <span class="icon is-large">
                <i class="fas fa-puzzle-piece fa-3x has-text-difficulty"></i>
              </span>
            </div>
            <div class="media-content">
              <p class="title has-text-right is-size-6">{{type}}</p>
              <p class="subtitle has-text-right is-size-3">
                <loading-state :isLoading='isLoading' />
                <span v-if="mediaPostsAll">
                  {{(1-mediaPostsCount / mediaPostsAll) | formatNumber('percent')}}
                </span>
                <span class="subtitle has-text-right is-size-3 is-marginless"
                      v-else>0%</span>
              </p>
              <p class="subtitle has-text-right is-size-6 unitOfTime">of all posts in the last {{unitOfTime}} were noise</p>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <span class="tag is-success"
          v-else>Posts: {{(1-mediaPostsCount / mediaPostsAll) | formatNumber('percent')}}</span>
  </div>
</template>

<script>
import { MediaPostsCounts } from '@/media/graphql/MediaPosts.gql'
export default {
  name: 'post-difficulty',
  props: {
    small: {
      default: false
    },
    type: {
      default: 'Difficulty'
    }
  },
  apollo: {
    mediaPostsAll: {
      query: MediaPostsCounts,
      variables() {
        return {
          where: {
            createTime_gte: this.beginDate,
            createTime_lte: this.moment()
          }
        }
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
    },
    mediaPostsCount: {
      query: MediaPostsCounts,
      variables() {
        let variables
        variables = {
          where: {
            isUserGenerated: true,
            isPublished: true,
            createTime_gte: this.beginDate,
            createTime_lte: this.moment()
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
