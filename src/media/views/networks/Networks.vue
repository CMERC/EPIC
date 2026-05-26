<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busyLoading"
       infinite-scroll-distance="50">
    <div class="is-relative-mobile">
      <breadcrumb />
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <a class="button is-primary"
               @click="openCreateNetwork()">
              Create Network
            </a>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <span class="has-text-weight-semibold">{{mediaNetworksCount}} Networks</span>
          </div>
          <div class="level-item">
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <input class="input is-rounded is-primary"
                       type="text"
                       placeholder="Search..."
                       v-model.lazy="searchQuery">
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
            <help-content :reference="'media.networks'"
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
      <div v-if="mediaNetworks && mediaNetworks.length > 0"
           class="columns is-desktop is-multiline">
        <div class="column is-4-desktop"
             v-for="mediaNetwork in mediaNetworks"
             v-bind:key="mediaNetwork.id">
          <div class="card">
            <b-dropdown position="is-bottom-left"
                        class="is-pulled-right">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="viewNetwork(mediaNetwork.id)">
                <span class="icon is-small">
                  <i class="fas fa-link"></i>
                </span>
                <span>View Network</span>
              </b-dropdown-item>
              <b-dropdown-item @click="editNetwork(mediaNetwork.id)">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Network</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDeleteNetwork(mediaNetwork.id)">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete Network</span>
              </b-dropdown-item>
            </b-dropdown>
            <div class="card-content"
                 @click="viewNetwork(mediaNetwork.id)">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-96x96"
                          v-if="mediaNetwork.avatar != null">
                    <img :src="mediaNetwork.avatar.url.thumb"
                         alt="image"
                         class="is-avatar xl">
                  </figure>
                  <figure class="image is-96x96"
                          v-else>
                    <span class="icon is-xxlarge">
                      <i class="fas fa-user-circle has-text-grey fa-6x"></i>
                    </span>
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-6">{{mediaNetwork.name}}</p>
                  <p class="subtitle is-7">{{mediaNetwork.description | truncate(70)}}</p>
                  <p class="subtitle is-7"
                     v-if="mediaNetwork.personas">{{mediaNetwork.personas.length}} Linked Personas</p>
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <a @click="editNetwork(mediaNetwork.id)"
                 class="card-footer-item">
                Edit
              </a>
              <a @click="viewNetwork(mediaNetwork.id)"
                 class="card-footer-item">
                View Network
              </a>
            </footer>
          </div>
        </div>
      </div>
      <div v-else>
        <empty-state :data="mediaNetworks"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="openCreateNetwork()">
                Create Network
              </a>
            </div>
          </template>
        </empty-state>
      </div>
      <back-to-top bottom="20px"
                   right="20px">
        <button type="button"
                class="button">
          <span class="icon is-small">
            <i class="fas fa-arrow-up"></i>

          </span>
        </button>
      </back-to-top>
      <network-create :open="openDialog"
                      @close="closeDialog" />
    </div>
  </div>
</template>

<script>
import {
  MediaNetworksList,
  MediaNetworksDelete,
  MediaNetworksSubscription,
  MediaNetworksCounts
} from '@/media/graphql/MediaNetworks.gql'

import HelpContent from '@/shared/components/helpcontent'
import NetworkCreate from '@/media/components/network-create'
import { serverError } from '@/shared/serverError'

export default {
  name: 'Networks',
  components: {
    NetworkCreate,
    HelpContent
  },
  apollo: {
    mediaNetworksCount: {
      query: MediaNetworksCounts,
      variables() {
        let data = this.queryVariables()
        data.skip = 0
        return data
      },
      update(data) {
        if (data && data.mediaNetworksConnection) {
          return data.mediaNetworksConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    mediaNetworks: {
      query: MediaNetworksList,
      variables() {
        let data = this.queryVariables()
        data.skip = 0
        return data
      },
      update(data) {
        if (data && data.mediaNetworks) {
          this.$apollo.queries.mediaNetworksCount.refetch()
          return data.mediaNetworks
        }
      },
      subscribeToMore: [
        {
          document: MediaNetworksSubscription,
          variables() {
            let datafromread = this.queryVariables()
            delete datafromread.skip
            delete datafromread.first

            let data = {
              node: datafromread
            }
            return data
          },
          // Mutate the previous result
          updateQuery(previousResult, { subscriptionData }) {
            // Mutation type
            let mutationIn = subscriptionData.data.mediaNetwork.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaNetworks: [
                    ...previousResult.mediaNetworks,
                    subscriptionData.data.mediaNetwork.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  mediaNetworks: [
                    ...previousResult.mediaNetworks.filter(
                      obj =>
                        subscriptionData.data.mediaNetwork.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedMediaNetworks = JSON.parse(
                  JSON.stringify(previousResult.mediaNetworks)
                )
                let index = updatedMediaNetworks.findIndex(
                  x => x.id === subscriptionData.data.mediaNetwork.node.id
                )
                updatedMediaNetworks[index] =
                  subscriptionData.data.mediaNetwork.node
                newResult = {
                  mediaNetworks: updatedMediaNetworks
                }
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            // Here, return the new result from the previous with the new data
            return newResult
          }
        }
      ]
    }
  },
  data() {
    return {
      searchQuery: this.$route.query.q,
      mediaNetworks: [],
      mediaNetworksCount: 0,
      openDialog: false,
      itemsPerPage: 24,
      busyLoading: false,
      selectOrderBy: this.$route.query.sort
        ? this.$route.query.sort
        : 'name_ASC',
      typesOrderBy: [
        { name: 'Name', type: 'name_ASC' },
        { name: 'Last Updated', type: 'updatedAt_DESC' },
        { name: 'Last Created', type: 'createdAt_DESC' },
        { name: 'Oldest Created', type: 'createdAt_ASC' },
        { name: 'Oldest Updated', type: 'updatedAt_ASC' }
      ]
    }
  },
  watch: {
    searchQuery() {
      this.$router.push({
        query: { q: this.searchQuery, sort: this.selectOrderBy }
      })
      this.mediaPosts = []
    },
    selectOrderBy() {
      this.$router.push({
        query: { q: this.searchQuery, sort: this.selectOrderBy }
      })
    }
  },
  methods: {
    queryVariables() {
      let length = this.mediaNetworks ? this.mediaNetworks.length : 0
      let data = {
        where: { name_contains: this.searchQuery },
        skip: length,
        orderBy: this.selectOrderBy,
        first: this.itemsPerPage
      }
      return data
    },
    loadMore() {
      if (
        this.mediaNetworks &&
        this.mediaNetworks.length < this.mediaNetworksCount
      ) {
        this.busyLoading = true
        this.$apollo.queries.mediaNetworks.fetchMore({
          variables: this.queryVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.mediaNetworks &&
              fetchMoreResult.mediaNetworks.length > 0
            ) {
              fetchMoreResult.mediaNetworks = [
                ...this.mediaNetworks,
                ...fetchMoreResult.mediaNetworks.filter(
                  n => !this.mediaNetworks.some(p => p.id === n.id)
                )
              ]

              this.busyLoading = false
              return fetchMoreResult
            }
          }
        })
      }
    },
    editNetwork(id) {
      this.$router.push({ name: 'editnetwork', params: { id: id } })
    },
    viewNetwork(id) {
      this.$router.push({ name: 'viewnetwork', params: { id: id } })
    },
    openCreateNetwork() {
      this.openDialog = true
    },
    confirmDeleteNetwork(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Network',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteNetwork(id)
      })
    },
    deleteNetwork(Network) {
      // Delete Network
      this.$apollo
        .mutate({
          mutation: MediaNetworksDelete,
          variables: {
            id: {
              id: Network
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Network Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Delete Network: ' + error)
        })
    },
    closeDialog() {
      this.openDialog = false
    }
  }
}
</script>
