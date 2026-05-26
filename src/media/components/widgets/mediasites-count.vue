<template>
  <div>
    <router-link :to="{name: 'sites'}">
      <div class="card"
           v-if="small==false">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <span class="icon is-large">
                <i class="fas fa-bookmark fa-3x has-text-sites"></i>
              </span>
            </div>
            <div class="media-content">
              <p class="title has-text-right is-size-6">Sites</p>
              <p class="subtitle has-text-right is-size-3">
                <loading-state :isLoading='isLoading' />
                <span v-if="mediaServicesCount !== undefined">
                  {{mediaServicesCount | formatNumber('thousands')}}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <span class="tag is-link"
            v-else>Sites: {{mediaServicesCount | formatNumber('thousands')}}</span>
    </router-link>
  </div>
</template>

<script>
import { MediaServicesCounts } from '@/media/graphql/MediaServices.gql'

export default {
  name: 'mediasites-count',
  props: {
    small: {
      default: false
    }
  },
  apollo: {
    mediaServicesCount: {
      query: MediaServicesCounts,
      update(data) {
        if (
          data &&
          data.mediaServicesConnection &&
          data.mediaServicesConnection.aggregate
        ) {
          this.isLoading = false
          return data.mediaServicesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      mediaServicesCount: [],
      isLoading: true
    }
  }
}
</script>
