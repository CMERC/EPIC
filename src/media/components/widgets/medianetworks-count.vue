<template>
  <div>
    <router-link :to="{name: 'networks'}">
      <div class="card"
           v-if="small==false">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <span class="icon is-large">
                <i class="fas fa-sitemap fa-3x has-text-networks"></i>
              </span>
            </div>
            <div class="media-content">
              <p class="title has-text-right is-size-6">Networks</p>
              <p class="subtitle has-text-right is-size-3">
                <loading-state :isLoading='isLoading' />
                <span v-if="mediaNetworksCount !== undefined">
                  {{mediaNetworksCount | formatNumber('thousands')}}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <span class="tag is-link"
            v-else>Networks: {{mediaNetworksCount | formatNumber('thousands')}}</span>
    </router-link>
  </div>
</template>

<script>
import { MediaNetworksCounts } from '@/media/graphql/MediaNetworks.gql'

export default {
  name: 'medianetworks-count',
  props: {
    small: {
      default: false
    },
    type: {
      default: 'Networks'
    }
  },
  apollo: {
    mediaNetworksCount: {
      query: MediaNetworksCounts,
      update(data) {
        if (data && data.mediaNetworksConnection) {
          this.isLoading = false
          return data.mediaNetworksConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      mediaNetworksCount: [],
      isLoading: true
    }
  }
}
</script>
