<template>
  <div class="container"
       v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busyLoadingProfiles"
       infinite-scroll-distance="50">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a @click="openAddProfile()"
             class="button is-primary">
            Create Profile
          </a>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <span class="has-text-weight-semibold">{{mediaProfilesCount}} Profiles</span>
        </div>
        <div class="level-item">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input class="input is-rounded is-primary"
                     type="text"
                     placeholder="Search..."
                     v-model.lazy="searchQuery"
                     clearable>
              <span class="icon is-small is-left">
                <i class="fas fa-search"></i>
              </span>
              <span class="icon is-small is-right"
                    @click="searchQuery = ''">
                <i class="fas fa-times-circle"></i>
              </span>
            </p>
          </div>
        </div>
        <div class="level-item">
          <help-content :reference="'media.profiles'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <nav class="level">
      <div class="level-left"></div>
      <div class="level-right">
        <div class="level-item">
          <div class="select">
            <select v-model="selectOrderBy">
              <optgroup label="Sort By">
                <option v-for="option in typesOrderBy"
                        :key="option.type"
                        :value="option.type">
                  {{option.name}}
                </option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>
    </nav>
    <div class="columns is-multiline is-mobile articles"
         v-if="mediaProfiles && mediaProfiles.length > 0">
      <div class="column is-3-desktop is-6-tablet is-12-mobile"
           v-for="mediaProfile in mediaProfiles"
           v-bind:key="mediaProfile.id">
        <Profile-Card :profile="mediaProfile"
                      showEdit
                      showPermalink
                      showDelete/>
      </div>
      <div class="column is-12"
           v-if="busyLoadingProfiles">
        <div class="card-header-title is-centered">
          <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
        </div>
        <p class="subtitle has-text-centered">Loading More Profiles... </p>
      </div>
    </div>
    <div v-else>
      <empty-state :data="mediaProfiles"
                   :search="searchQuery ? true : false"
                   :isLoading='$apollo.loading'>
        <template slot="action-buttons">
          <div class="buttons is-centered is-spaced">
            <a @click="openAddProfile()"
               class="button is-primary">
              Create Profile
            </a>
          </div>
        </template>
      </empty-state>
    </div>
    <back-to-top bottom="20px"
                 right="10px">
      <button type="button"
              class="button">
        <span class="icon is-small"> <i class="fas fa-arrow-up"></i> </span>
      </button>
    </back-to-top>
    <profile-create v-if="openProfile"
                    :open="openProfile"
                    @close="closeProfile" />
  </div>
</template>

<script>
import ProfileCard from '@/shared/components/profile-card'
import ProfileCreate from '@/media/components/profile-create'
import helpers from '@/shared/mixins/helpers'
import mediaPost from '@/shared/mixins/mediaPost'

import HelpContent from '@/shared/components/helpcontent'

import {
  MediaProfilesSlim,
  MediaProfilesSlimSubscription,
  MediaProfileCounts
} from '@/media/graphql/MediaProfiles.gql'

export default {
  name: 'MediaProfiles',
  mixins: [helpers, mediaPost],
  components: {
    ProfileCard,
    ProfileCreate,
    HelpContent
  },
  apollo: {
    mediaProfilesCount: {
      query: MediaProfileCounts,
      variables() {
        let data = this.mediaProfilesReadVariables()
        // delete keys not used for count
        delete data.skip
        delete data.first
        delete data.orderBy

        return data
      },
      update(data) {
        if (
          data &&
          data.mediaProfilesConnection &&
          data.mediaProfilesConnection.aggregate
        ) {
          return data.mediaProfilesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    mediaProfiles: {
      query: MediaProfilesSlim,
      variables() {
        let data = this.mediaProfilesReadVariables()
        data.skip = 0
        return data
      },
      update(data) {
        if (data && data.mediaProfiles) {
          this.$apollo.queries.mediaProfilesCount.refetch()
          return data.mediaProfiles
        }
      },
      subscribeToMore: [
        {
          document: MediaProfilesSlimSubscription,
          variables() {
            let datafromread = this.mediaProfilesReadVariables()
            delete datafromread.orderBy
            delete datafromread.skip
            delete datafromread.first
            let data = {
              node: datafromread
            }
            return data
          },
          // Mutate the previous result
          updateQuery: (previousResult, { subscriptionData }) => {
            // Here, return the new result from the previous with the new data
            let mutationIn = subscriptionData.data.mediaProfile.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaProfiles: [
                    ...previousResult.mediaProfiles,
                    subscriptionData.data.mediaProfile.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  mediaProfiles: [
                    ...previousResult.mediaProfiles.filter(
                      obj =>
                        subscriptionData.data.mediaProfile.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedMediaProfiles = JSON.parse(
                  JSON.stringify(previousResult.mediaProfiles)
                )
                let index = updatedMediaProfiles.findIndex(
                  x => x.id === subscriptionData.data.mediaProfile.node.id
                )
                updatedMediaProfiles[index] =
                  subscriptionData.data.mediaProfile.node
                newResult = {
                  mediaProfiles: updatedMediaProfiles
                }
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            return newResult
          }
        }
      ]
    }
  },
  data() {
    return {
      searchQuery: this.$route.query.q,
      selectOrderBy: this.$route.query.sort
        ? this.$route.query.sort
        : 'name_ASC',
      typesOrderBy: [
        { name: 'Name', type: 'name_ASC' },
        { name: 'Username', type: 'username_ASC' },
        { name: 'Last Updated', type: 'updatedAt_DESC' },
        { name: 'Last Created', type: 'createdAt_DESC' },
        { name: 'Oldest Updated', type: 'updatedAt_ASC' },
        { name: 'Oldest Created', type: 'createdAt_ASC' }
      ],
      mediaProfiles: [],
      mediaProfilesCount: 0,
      itemsPerPage: 24,
      openProfile: false,
      busyLoadingProfiles: false
    }
  },
  watch: {
    searchQuery() {
      this.$router.push({
        query: { q: this.searchQuery, sort: this.selectOrderBy }
      })
    },
    selectOrderBy() {
      this.$router.push({
        query: { q: this.searchQuery, sort: this.selectOrderBy }
      })
    }
  },
  methods: {
    mediaProfilesReadVariables() {
      let length = this.mediaProfiles ? this.mediaProfiles.length : 0
      let data = {
        where: {
          isUserGenerated: true,
          OR: [
            { service: { name_contains: this.searchQuery } },
            { name_contains: this.searchQuery },
            { username_contains: this.searchQuery },
            { description_contains: this.searchQuery },
            { language_contains: this.searchQuery }
          ]
        },
        orderBy: this.selectOrderBy,
        skip: length,
        first: this.itemsPerPage
      }
      return data
    },
    loadMore() {
      if (this.mediaProfiles.length < this.mediaProfilesCount) {
        this.busyLoadingProfiles = true
        this.$apollo.queries.mediaProfiles.fetchMore({
          variables: this.mediaProfilesReadVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.mediaProfiles &&
              fetchMoreResult.mediaProfiles.length > 0
            ) {
              fetchMoreResult.mediaProfiles = [
                ...this.mediaProfiles,
                ...fetchMoreResult.mediaProfiles.filter(
                  n => !this.mediaProfiles.some(p => p.id === n.id)
                )
              ]

              this.busyLoadingProfiles = false
              return fetchMoreResult
            }
          }
        })
      }
    },
    openAddProfile() {
      this.openProfile = true
    },
    closeProfile() {
      this.openProfile = false
    }
  }
}
</script>
<style lang="scss" scoped>
.card .media:not(:last-child) {
  height: 0;
}
</style>
