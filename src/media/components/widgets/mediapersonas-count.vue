<template>
  <div>
    <router-link :to="{name: 'personas'}">
      <div class="card"
           v-if="small==false">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <span class="icon is-large">
                <i class="fas fa-theater-masks fa-3x has-text-personas"></i>
              </span>
            </div>
            <div class="media-content">
              <p class="title has-text-right is-size-6">Personas</p>
              <p class="subtitle has-text-right is-size-3">
                <loading-state :isLoading='isLoading' />
                <span v-if="mediaPersonasCount !== undefined">
                  {{mediaPersonasCount | formatNumber('thousands')}}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <span class="tag is-link"
            v-else>Personas: {{mediaPersonasCount | formatNumber('thousands')}}</span>
    </router-link>
  </div>
</template>

<script>
import { MediaPersonasCounts } from '@/media/graphql/MediaPersonas.gql'

export default {
  name: 'mediapersonas-count',
  props: {
    small: {
      default: false
    },
    type: {
      default: 'Personas'
    }
  },
  apollo: {
    mediaPersonasCount: {
      query: MediaPersonasCounts,
      update(data) {
        if (data && data.mediaPersonaeConnection) {
          this.isLoading = false
          return data.mediaPersonaeConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      mediaPersonasCount: [],
      isLoading: true
    }
  }
}
</script>
