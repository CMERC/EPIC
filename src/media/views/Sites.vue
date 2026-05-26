<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busyLoading"
       infinite-scroll-distance="50">
    <div class="container">
      <breadcrumb />
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <a class="button is-primary"
               @click="addSite()">
              Create Site
            </a>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <span class="has-text-weight-semibold">{{mediaServicesCount}} Sites</span>
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
            <help-content :reference="'media.sites'"
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
      <div class="columns is-multiline"
           v-if="mediaServices && mediaServices.length > 0">
        <div class="column is-one-third"
             v-for="site in mediaServices"
             :key="site.id">
          <div class="card">
            <nav class="level is-pulled-right">
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
                    <b-dropdown-item @click="showSite(site)">
                      <span class="icon is-small">
                        <i class="fas fa-link"></i>
                      </span>
                      <span>Visit Site</span>
                    </b-dropdown-item>
                    <b-dropdown-item @click="editService(site)">
                      <span class="icon is-small">
                        <i class="fas fa-pen"></i>
                      </span>
                      <span>Edit Site</span>
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                    <b-dropdown-item @click="confirmDelete(site.name)">
                      <span class="icon is-small">
                        <i class="fas fa-times has-text-danger"></i>
                      </span>
                      <span>Delete Site</span>
                    </b-dropdown-item>
                  </b-dropdown>
                </div>

              </div>
            </nav>
            <a @click="showSite(site)">
              <div class="card-content">
                <p class="title is-6">{{site.displayName}}</p>
                <p class="subtitle is-6">{{getTypeLabel(site.type)}}</p>
                <div :style="'color:'+site.color">
                  <span class="icon is-large"
                        v-if="site.icon"
                        :key="site.icon">
                    <i :class="site.icon+ ' fa-3x'"></i>
                  </span>
                  <span class="icon is-large"
                        v-else>
                    <i class="fas fa-3x"></i>
                  </span>
                </div>
              </div>
            </a>
            <footer class="card-footer">
              <a class="card-footer-item"
                 @click="showSite(site)">
                Visit
              </a>
              <a class="card-footer-item"
                 @click="editService(site)">
                Edit
              </a>
            </footer>
          </div>
        </div>
      </div>
      <div v-else>
        <empty-state :data="mediaServices"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="addSite()">
                Create Site
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

      <site-create :open="openDialog"
                   :mediaService="selectedService"
                   @close="close" />
    </div>
  </div>
</template>

<script>
import SiteCreate from '@/media/components/site-create'
import MediaService from '@/media/model/mediaservice'

import HelpContent from '@/shared/components/helpcontent'
import helpers from '@/shared/mixins/helpers'

import { serverError } from '@/shared/serverError'

import { serviceTypeEnums } from '@/media/model/service-types'

import {
  MediaServicesRead,
  MediaServicesDelete,
  MediaServicesSubscription,
  MediaServicesCounts
} from '@/media/graphql/MediaServices.gql'

import { MediaProfilesRead } from '@/media/graphql/MediaProfiles.gql'

export default {
  name: 'WebView',
  mixins: [helpers],
  components: {
    HelpContent,
    SiteCreate
  },
  apollo: {
    mediaServicesCount: {
      query: MediaServicesCounts,
      variables() {
        let data = this.queryVariables()
        data.skip = 0
        return data
      },

      update(data) {
        if (data && data.mediaServicesConnection) {
          return data.mediaServicesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    mediaServices: {
      query: MediaServicesRead,
      variables() {
        let data = this.queryVariables()
        data.skip = 0
        return data
      },
      update(data) {
        if (data && data.mediaServices) {
          this.$apollo.queries.mediaServicesCount.refetch()
          return data.mediaServices
        }
      },
      subscribeToMore: [
        {
          document: MediaServicesSubscription,
          variables() {
            let datafromread = this.queryVariables()
            delete datafromread.skip
            delete datafromread.orderBy
            delete datafromread.first

            let data = {
              node: datafromread
            }
            return data
          },
          // Mutate the previous result
          updateQuery: (previousResult, { subscriptionData }) => {
            // Here, return the new result from the previous with the new data
            let mutationIn = subscriptionData.data.mediaService.mutation
            var newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaServices: [
                    ...previousResult.mediaServices,
                    subscriptionData.data.mediaService.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  mediaServices: [
                    ...previousResult.mediaServices.filter(
                      obj =>
                        subscriptionData.data.mediaService.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedMediaServices = JSON.parse(
                  JSON.stringify(previousResult.mediaServices)
                )
                let index = updatedMediaServices.findIndex(
                  x => x.id === subscriptionData.data.mediaService.node.id
                )
                updatedMediaServices[index] =
                  subscriptionData.data.mediaService.node
                newResult = {
                  mediaServices: updatedMediaServices
                }
                break
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
      searchQuery: '',
      selectOrderBy: 'displayName_ASC',
      itemsPerPage: 24,
      busyLoading: false,
      typesOrderBy: [
        { name: 'Name', type: 'displayName_ASC' },
        { name: 'Type', type: 'type_ASC' },
        { name: 'Last Updated', type: 'updatedAt_DESC' },
        { name: 'Last Created', type: 'createdAt_DESC' },
        { name: 'Oldest Updated', type: 'updatedAt_ASC' },
        { name: 'Oldest Created', type: 'createdAt_ASC' }
      ],
      mediaSites: [],
      openDialog: false,
      mediaServices: [],
      selectedService: new MediaService(),
      serviceTypes: serviceTypeEnums
    }
  },
  methods: {
    queryVariables() {
      let length = this.mediaServices ? this.mediaServices.length : 0
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
        this.mediaServices &&
        this.mediaServices.length < this.mediaServicesCount
      ) {
        this.busyLoading = true
        this.$apollo.queries.mediaServices.fetchMore({
          variables: this.queryVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.mediaServices &&
              fetchMoreResult.mediaServices.length > 0
            ) {
              fetchMoreResult.mediaServices = [
                ...this.mediaServices,
                ...fetchMoreResult.mediaServices.filter(
                  n => !this.mediaServices.some(p => p.id === n.id)
                )
              ]

              this.busyLoading = false
              return fetchMoreResult
            }
          }
        })
      }
    },
    checkIfServiceHasProfiles(serviceName) {
      return this.$apollo
        .query({
          query: MediaProfilesRead,
          variables: {
            where: {
              service: {
                name: serviceName
              }
            }
          }
        })
        .then(response => {
          return (
            response &&
            response.data &&
            response.data.mediaProfiles &&
            response.data.mediaProfiles.length > 0
          )
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Check Service for Profiles: ' + error)
        })
    },
    getTypeLabel(type) {
      let typeEnum = this.serviceTypes.find(typeEnum => typeEnum.value == type)
      let label = ''
      if (typeEnum && typeEnum.label) {
        label = typeEnum.label
      }
      return label
    },
    showSite(site) {
      let workspace = this.$store.state.activeWorkspace.name
      this.$router.push({ path: `/web/${workspace}/${site.name}` })
    },
    addSite() {
      this.openDialog = true
    },
    editService(service) {
      this.selectedService = JSON.parse(
        JSON.stringify(service),
        this.omitTypename
      )
      this.openDialog = true
    },
    async deleteService(service) {
      let serviceHasProfiles = await this.checkIfServiceHasProfiles(service)
      if (serviceHasProfiles) {
        this.$buefy.toast.open({
          message: 'Sites with profiles cannot be deleted.',
          type: 'is-danger',
          duration: 5000
        })
        return
      } else {
        // deletes a service
        this.$apollo
          .mutate({
            mutation: MediaServicesDelete,
            variables: {
              name: {
                name: service
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Site Deleted!',
              type: 'is-success'
            })
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
            console.error(error)
          })
      }
    },
    confirmDelete(service) {
      this.$buefy.dialog.confirm({
        title: 'Delete Site',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteService(service)
      })
    },
    close() {
      this.openDialog = false
      this.selectedService = new MediaService()
    }
  }
}
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
