<template>
  <div>
    <router-link :to="{name: 'profiles'}">
      <div class="card"
           v-if="small==false">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <span class="icon is-large">
                <i class="fas fa-users fa-3x has-text-profiles"></i>
              </span>
            </div>
            <div class="media-content">
              <p class="title has-text-right is-size-6">Profiles</p>
              <p class="subtitle has-text-right is-size-3">
                <loading-state :isLoading='isLoading' />
                <span v-if="mediaProfilesCount !== undefined">
                  {{mediaProfilesCount | formatNumber('thousands')}}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <span class="tag is-link"
            v-else>Profiles: {{mediaProfilesCount | formatNumber('thousands')}}</span>
    </router-link>
  </div>
</template>

<script>
import { MediaProfileCounts } from '@/media/graphql/MediaProfiles.gql'

export default {
  name: 'mediaprofiles-count',
  props: {
    small: {
      default: false
    },
    type: {
      default: 'Profiles'
    }
  },
  apollo: {
    mediaProfilesCount: {
      query: MediaProfileCounts,
      variables: {
        where: { isUserGenerated: true }
      },
      update(data) {
        if (data && data.mediaProfilesConnection) {
          this.isLoading = false
          return data.mediaProfilesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      mediaProfilesCount: [],
      isLoading: true
    }
  }
}
</script>
