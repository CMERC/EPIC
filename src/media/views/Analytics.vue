<template>
  <div class="container">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
        </div>
      </div>
      <div class="level-right">
        <help-content :reference="'media.analytics'"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div class="columns is-multiline">
      <div class="column is-half-desktop is-half-tablet">
        <article>
          <div ref="chartInjectPosts"
               id="chartInjectPosts"></div>
          <div v-if="!mediaPostsTrackInjectsReport">
            <empty-state :isCard='false'
                         :data="mediaPostsTrackInjectsReport"
                         :isLoading='$apollo.loading' />
          </div>
        </article>
      </div>
      <div class="column is-half-desktop is-half-tablet">
        <article>
          <div ref="chartViewed"
               id="chartViewed"></div>
          <div v-if="!mediaPostsTrackInjectsReport">
            <empty-state :isCard='false'
                         :data="mediaPostsTrackInjectsReport"
                         :isLoading='$apollo.loading' />
          </div>
        </article>
      </div>
    </div>
    <div v-if="mediaPostsTrack && mediaPostsTrack.length > 0">
      <div class="is-divider"></div>
      <div class="columns is-gapless">
        <div class="column has-text-centered">
          Profile
        </div>
        <div class="column has-text-centered">
          Post
        </div>
        <div class="column has-text-centered">
          Total Views
        </div>
        <div class="column has-text-centered">
          Total Unique Visitors
        </div>
      </div>
      <div class="is-divider"></div>
      <div v-for="item in mediaPostsTrack"
           v-bind:key="item.id">
        <a @click="previewPost(item.node)"
           v-if="item.node">
          <div class="columns is-gapless">
            <div class="column">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-64x64"
                          v-if="item.node.profiles[0] && item.node.profiles[0].avatar">
                    <img :src='item.node.profiles[0].avatar?item.node.profiles[0].avatar.url.small:""'
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
                     v-if="item.node.profiles[0]">
                  <p class="title is-6"
                     v-if="item.node.profiles[0]">{{item.node.profiles[0].name}}</p>
                  <p class="subtitle is-6"> @{{item.node.profiles[0].username}}</p>
                  <span v-if="item.node.profiles[0].service">
                    <span class="icon is-small"
                          :style="'color:'+item.node.profiles[0].service.color"
                          v-if="item.node.profiles[0].service.icon">
                      <i :class="item.node.profiles[0].service.icon"></i>
                    </span>
                    <span class="icon is-small"
                          v-else>
                      <i class="fas fa-sm"></i>
                    </span>
                    <span> {{item.node.profiles[0].service.displayName}}</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="content">
                <p v-if="item.node.title">{{item.node.title | truncate(125)}}</p>
                <p>{{item.node.text | truncate(125)}}</p>
                <span v-if="item.node.publishTime"
                      class="is-6 tooltip"
                      :data-tooltip="formatDate(item.node.publishTime, 'utc-dtg')">{{formatDate(item.node.publishTime, 'shortDateTime')}}</span>
              </div>
            </div>
            <div class="column has-text-centered">
              <p class="subtitle">{{item.views}}</p>
            </div>
            <div class="column has-text-centered">
              <p class="subtitle">{{item.visitors}}</p>
            </div>
          </div>
        </a>
        <div class="columns is-gapless"
             v-else>
          <div class="column has-text-centered">
            Unknown
          </div>
          <div class="column has-text-centered">
            {{item.id}}
          </div>
          <div class="column has-text-centered">
            {{item.views}}
          </div>
          <div class="column has-text-centered">
            {{item.visitors}}
          </div>
        </div>
        <div class="is-divider"></div>
      </div>
    </div>
    <div v-else>
      <empty-state :data="mediaPostsTrack"
                   :isLoading='$apollo.loading' />
    </div>    
    <post-preview-modal v-if="previewModal"
                        :open="previewModal"
                        :postObj="postObj"
                        :post="postObj ? postObj.id: null"
                        @close="closeModal"></post-preview-modal>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'
import Plotly from 'plotly.js-dist'
import HelpContent from '@/shared/components/helpcontent'
import PostPreviewModal from '@/media/components/post-previewModal'
import PlotlyOptions from '@/shared/mixins/plotlyOptions.js'
import {
  MediaPostsTrack,
  MediaPostsTrackInjectsReport
} from '../graphql/MediaTrack.gql'

export default {
  name: 'AnalyticsView',
  mixins: [helpers, PlotlyOptions],
  components: {
    HelpContent,
    PostPreviewModal
  },
  apollo: {
    mediaPostsTrackInjectsReport: {
      query: MediaPostsTrackInjectsReport,
      variables() {
        let data = {
          data: {
            workspace: this.$store.state.activeWorkspace.name
          }
        }
        return data
      },
      update(data) {
        if (data && data.mediaPostsTrackInjectsReport) {
          let injectPosts = [data.mediaPostsTrackInjectsReport.data[0]]
          Plotly.newPlot(
            this.$refs.chartInjectPosts,
            injectPosts,
            {
              title:
                '<b>Inject Posts</b><br> Total: ' +
                data.mediaPostsTrackInjectsReport.total,
              ...this.hoverOptions
            },
            this.modeBarOptions
          )
          let totals = [
            {
              x: data.mediaPostsTrackInjectsReport.data[1].x,
              y: data.mediaPostsTrackInjectsReport.data[1].y,
              type: 'bar'
            }
          ]
          Plotly.newPlot(
            this.$refs.chartViewed,
            totals,
            {
              title: 'Totals ',
              ...this.hoverOptions
            },
            this.modeBarOptions
          )
          return data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    mediaPostsTrack: {
      query: MediaPostsTrack,
      variables() {
        let data = {
          where: {
            workspace: this.$store.state.activeWorkspace.name
          }
        }
        return data
      },
      update(data) {
        if (data && data.mediaPostsTrack) {
          return data.mediaPostsTrack
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      postObj: null,
      previewModal: false,
      mediaPostsTrack: [],
      hoverOptions: {
        hovermode: 'closest',
        hoverlabel: { bgcolor: '#FFF' },
        xaxis: {
          automargin: true,
          fixedrange: true
        },
        yaxis: {
          automargin: true,
          fixedrange: true
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.previewModal = false
      this.postObj = null
    },
    previewPost(post) {
      this.postObj = post
      this.previewModal = true
    }
  }
}
</script>

<style lang="scss" scoped>
.columns {
  .column {
    & article {
      padding: 2rem;
      background-color: #ecf0f1;
      border-radius: 8px;
      -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
        0 0 0 1px rgba(10, 10, 10, 0.1);
      box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
        0 0 0 1px rgba(10, 10, 10, 0.1);
    }
  }
}
</style>
