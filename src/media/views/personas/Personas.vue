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
               @click="toggleCreatePersona()">
              Create Persona
            </a>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <span class="has-text-weight-semibold">{{mediaPersonasCount}} Personas</span>
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
            <help-content :reference="'media.personas'"
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
      <div v-if="mediaPersonae && mediaPersonae.length > 0"
           class="columns is-desktop is-multiline">
        <div class="column is-4-desktop"
             v-for="mediaPersona in mediaPersonae"
             v-bind:key="mediaPersona.id">
          <div class="card">
            <b-dropdown class="is-pulled-right"
                        position="is-bottom-left">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="viewPersona(mediaPersona)">
                <span class="icon is-small">
                  <i class="fas fa-link"></i>
                </span>
                <span>View Persona</span>
              </b-dropdown-item>
              <b-dropdown-item @click="editPersona(mediaPersona)">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Persona</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDeletePersona(mediaPersona.id)">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete Persona</span>
              </b-dropdown-item>
            </b-dropdown>
            <div @click="viewPersona(mediaPersona)">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-96x96"
                            v-if="mediaPersona.avatar != null">
                      <img :src="mediaPersona.avatar.url.thumb"
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
                    <p class="title is-6">{{mediaPersona.name}}</p>
                    <p class="subtitle is-7">{{mediaPersona.role | truncate(25)}}</p>
                    <p class="subtitle is-7"
                       v-if="mediaPersona.profiles">{{mediaPersona.profiles.length}} Linked Profiles</p>
                  </div>
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <a @click="editPersona(mediaPersona)"
                 class="card-footer-item">
                Edit
              </a>
              <a @click="viewPersona(mediaPersona)"
                 class="card-footer-item">
                View Persona
              </a>
            </footer>
          </div>
        </div>
        <div class="column is 12"
             v-if="busyLoading">
          <div class="card-header-title is-centered">
            <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
          </div>
          <p class="subtitle has-text-centered">Loading More Personas... </p>
        </div>
      </div>
      <div v-else>
        <empty-state :data="mediaPersonae"
                     :search="searchQuery ? true : false"
                     :isLoading='$apollo.loading'>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <a class="button is-primary"
                 @click="toggleCreatePersona()">
                Create Persona
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
    </div>
    <persona-create :open="openDialog"
                    @close="toggleCreatePersona" />
  </div>
</template>

<script>
import {
  MediaPersonasList,
  MediaPersonasDelete,
  MediaPersonaSubscription,
  MediaPersonasCounts
} from '@/media/graphql/MediaPersonas.gql'

import HelpContent from '@/shared/components/helpcontent'
import PersonaCreate from '@/media/components/personas-create'
import { serverError } from '@/shared/serverError'

export default {
  name: 'Personas',
  components: {
    PersonaCreate,
    HelpContent
  },
  apollo: {
    mediaPersonasCount: {
      query: MediaPersonasCounts,
      variables() {
        let data = this.queryVariables()
        data.skip = 0
        return data
      },
      update(data) {
        if (data && data.mediaPersonaeConnection) {
          return data.mediaPersonaeConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    mediaPersonae: {
      query: MediaPersonasList,
      variables() {
        let data = this.queryVariables()
        data.skip = 0
        return data
      },
      update(data) {
        if (data && data.mediaPersonae) {
          this.$apollo.queries.mediaPersonasCount.refetch()
          return data.mediaPersonae
        }
      },
      subscribeToMore: [
        {
          document: MediaPersonaSubscription,
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
            let mutationIn = subscriptionData.data.mediaPersona.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  mediaPersonae: [
                    ...previousResult.mediaPersonae,
                    subscriptionData.data.mediaPersona.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  mediaPersonae: [
                    ...previousResult.mediaPersonae.filter(
                      obj =>
                        subscriptionData.data.mediaPersona.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedMediaPersona = JSON.parse(
                  JSON.stringify(previousResult.mediaPersona)
                )
                let index = updatedMediaPersona.findIndex(
                  x => x.id === subscriptionData.data.mediaPersona.node.id
                )
                updatedMediaPersona[index] =
                  subscriptionData.data.mediaPersona.node
                newResult = {
                  mediaPersonae: updatedMediaPersona
                }
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            this.$apollo.queries.mediaPersonasCount.refetch()
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
      mediaPersonasCount: 0,
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
      let length = this.mediaPersonae ? this.mediaPersonae.length : 0
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
        this.mediaPersonae &&
        this.mediaPersonae.length < this.mediaPersonasCount
      ) {
        this.busyLoading = true
        this.$apollo.queries.mediaPersonae.fetchMore({
          variables: this.queryVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.mediaPersonae &&
              fetchMoreResult.mediaPersonae.length > 0
            ) {
              fetchMoreResult.mediaPersonae = [
                ...this.mediaPersonae,
                ...fetchMoreResult.mediaPersonae.filter(
                  n => !this.mediaPersonae.some(p => p.id === n.id)
                )
              ]

              this.busyLoading = false
              return fetchMoreResult
            }
          }
        })
      }
    },
    viewPersona(persona) {
      this.$router.push({
        name: 'viewpersona',
        params: { id: persona.id }
      })
    },
    editPersona(persona) {
      this.$router.push({ name: 'editpersona', params: { id: persona.id } })
    },
    deletePersona(id) {
      this.$apollo
        .mutate({
          mutation: MediaPersonasDelete,
          variables: {
            where: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Persona Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Persona Deleted: ' + error)
        })
    },
    confirmDeletePersona(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Persona',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePersona(id)
      })
    },
    toggleCreatePersona() {
      this.openDialog = !this.openDialog
    }
  }
}
</script>
<style lang="scss" scoped>
.card-content {
  min-height: 155px;
  max-height: 155px;
}
</style>
