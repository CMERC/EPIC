<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-distance="10">
    <div class="container">
      <nav class="breadcrumb is-spaced"
           aria-label="breadcrumbs">
        <ul>
          <li>
            <a @click="$router.go(-1)">
              <span class="icon is-small">
                <i class="fas fa-chevron-left"></i>
              </span>Back</a>
          </li>
          <li>
            <a>
              <span class="icon is-small">
                <i class="fas fa-users"
                   aria-hidden="true"></i>
              </span>
              <span>Profiles</span>
            </a>
          </li>
          <li class="is-active"
              v-if="query">
            <a aria-current="page">{{query}}</a>
          </li>
        </ul>
      </nav>
      <h5 class="subtitle profiles-title">
        Profiles
      </h5>
      <div class="columns is-multiline media-profiles"
           v-if="mediaProfilesPublic && mediaProfilesPublic.length>0">
        <div class="column is-4"
             v-for="mediaProfile in mediaProfilesPublic"
             v-bind:key="mediaProfile.id">
          <router-link :to="'/web/'+$route.params.workspace+'/'+mediaProfile.service.name+'/'+mediaProfile.username+'/'">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48"
                            v-if="mediaProfile.avatar">
                      <img :src='mediaProfile.avatar?mediaProfile.avatar.url.thumb:""'
                           class="is-avatar md">
                    </figure>
                    <figure class="image is-48x48"
                            v-else>
                      <span class="icon is-large">
                        <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                      </span>
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-6">{{mediaProfile.name}}</p>
                    <p class="subtitle is-7 has-text-weight-semibold">@{{mediaProfile.username}}<br />
                      <span class="icon is-small"
                            :style="'color:'+mediaProfile.service.color"
                            v-if="mediaProfile.service.icon">
                        <i :class="mediaProfile.service.icon"></i>
                      </span>
                      <span class="icon is-small"
                            v-else>
                        <i class="fas fa-sm"></i>
                      </span>

                      <span> {{mediaProfile.service.displayName}}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <back-to-top bottom="20px"
                     right="20px">
          <button type="button"
                  class="button">
            <span class="icon is-small"> <i class="fas fa-arrow-up"></i> </span>
          </button>
        </back-to-top>
        <div class="column is-12"
             v-if="$apollo.loading">
          <div class="card-header-title is-centered">
            <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
          </div>
          <p class="subtitle has-text-centered">Loading...
          </p>
        </div>
      </div>
      <div v-else>
        <h5>No results found.</h5>
      </div>
      <div class="error-message"
           v-if="invalidWorkspace">
        <h5 class="title">
          {{invalidWorkspace}}
        </h5>
      </div>
    </div>
  </div>
</template>
<script>
import { PublicMediaProfilesRead } from '../graphql/MediaProfiles.gql'

import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'

export default {
  name: 'WebProfilesHome',
  mixins: [helpers, processText],
  props: ['query', 'workspace'],
  apollo: {
    mediaProfilesPublic: {
      query: PublicMediaProfilesRead,
      variables() {
        let varaiables = this.profilesPublicReadVariables()
        // delete skip
        delete varaiables.skip
        return varaiables
      },
      update(data) {
        if (data) {
          return data.mediaProfilesPublic
        }
      },
      error(error) {
        this.invalidWorkspace = error.message
      }
    }
  },
  data() {
    return {
      searchQuery: this.query,
      invalidWorkspace: null,
      mediaProfilesPublic: null,
      itemsPerFetch: 30,
      doneLoading: false
    }
  },
  methods: {
    loadMore() {
      if (
        this.mediaProfilesPublic &&
        this.mediaProfilesPublic.length > 0 &&
        !this.doneLoading
      ) {
        this.$apollo.queries.mediaProfilesPublic.fetchMore({
          variables: this.profilesPublicReadVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.mediaProfilesPublic &&
              fetchMoreResult.mediaProfilesPublic.length > 0
            ) {
              let newProfilesList = [
                ...this.mediaProfilesPublic,
                ...fetchMoreResult.mediaProfilesPublic.filter(
                  n => !this.mediaProfilesPublic.some(p => p.id === n.id)
                )
              ]
              fetchMoreResult.mediaProfilesPublic = newProfilesList
              return fetchMoreResult
            } else {
              this.doneLoading = true
            }
          }
        })
      }
    },
    profilesPublicReadVariables() {
      let length = this.mediaProfilesPublic
        ? this.mediaProfilesPublic.length
        : 0
      let data = {
        where: {
          workspace: this.$route.params.workspace
        },
        skip: length,
        first: this.itemsPerFetch
      }
      if (this.searchQuery && this.searchQuery.length > 0) {
        data.where = {
          ...data.where,
          profile: {
            OR: [
              { service: { name_contains: this.searchQuery } },
              { name_contains: this.searchQuery },
              { username_contains: this.searchQuery },
              { description_contains: this.searchQuery },
              { language_contains: this.searchQuery }
            ]
          }
        }
      }
      return data
    }
  },
  watch: {
    query() {
      this.searchQuery = this.query
    },
    searchQuery() {
      this.$router.push({ query: { q: this.searchQuery } })
    }
  }
}
</script>

<style lang="scss" scoped>
.content * {
  word-wrap: break-word;
}
.error-message {
  margin: 10%;
}
.has-fixed-nav {
  padding-top: 3.25rem;
}
.media-profiles {
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
