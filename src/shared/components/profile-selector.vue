<template>
  <div class="field">
    <div class="control is-expanded">
      <multiselect v-model="selectedProfile"
                   name="Profile"
                   :multiple="allowMultipleSelect"
                   :close-on-select="!allowMultipleSelect"
                   :clear-on-select="!allowMultipleSelect"
                   :optionHeight="25"
                   track-by="id"
                   :options="mediaProfiles"
                   v-if="mediaProfiles"
                   :internal-search="false"
                   @search-change="(value) => {searchQuery = value}" 
                   v-validate="'required'" 
                   :class="{'input': errors.has('Profile'), 'is-danger': errors.has('Profile') }" 
                   @select="selectProfile">
        <template slot="singleLabel"
                  slot-scope="props">
          <span class="option__desc"
                :key="props.option.id">
            <span class="option__title">
              {{props.option.name}} - {{props.option.service.displayName | truncate(50)}} - @{{props.option.username}}
            </span>
          </span>
        </template>
        <template slot="option"
                  slot-scope="props">
          <div class="option__desc">
            <div class="media"
                 :key="props.option.id">
              <div class="media-left">
                <figure class="image"
                        v-if="props.option && props.option.avatar">
                  <img :src='props.option.avatar?props.option.avatar.url.small:""'
                       class="is-avatar md">
                </figure>
                <figure class="image"
                        v-else>
                  <span class="icon is-large">
                    <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                  </span>
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-6">{{props.option.name}}</p>
                <p class="subtitle is-7 has-text-weight-semibold">@{{props.option.username}}<br />
                  <span class="icon is-small"
                        :style="'color:'+props.option.service.color"
                        v-if="props.option.service.icon">
                    <i :class="props.option.service.icon"></i>
                  </span>
                  <span class="icon is-small"
                        v-else>
                    <i class="fas fa-sm"></i>
                  </span>
                  <span> {{props.option.service.displayName}}</span>
                  <span class="is-pulled-right"
                        v-if="authorID === props.option.id">Creator of Original Post</span>
                </p>
              </div>
            </div>
          </div>
        </template>
        <template class="multiselect_element"
                  slot="afterList">
          <div v-show="mediaProfilesCount > 74"
               class="afterList">
            <hr class="dropdown-divider">
            <span class="multiselect__option"
                  @click="toggleList(true)"
                  v-if="mediaProfiles.length > 74 && showAll == false">
              <span class="is-italic">Show more options... </span>
            </span>
            <span class="multiselect__option"
                  @click="toggleList(false)"
                  v-else>
              <span class="is-italic">Show fewer options... </span>
            </span>
          </div>
        </template>
      </multiselect>
    </div>
    <span v-show="errors.has('Profile')"
          class="help has-text-danger">Profile Required</span>
  </div>
</template>

<script>
import {
  MediaProfileCounts,
  MediaProfilesSelect,
  MediaProfilesSelectSubscription
} from '@/media/graphql/MediaProfiles.gql'

export default {
  name: 'profile-selector',
  props: {
    isModal: {
      type: Boolean,
      default: false
    },
    allowMultipleSelect: {
      type: Boolean,
      deafult: false
    },
    service: {
      type: String,
      default: ''
    },
    authorID: {
      type: String,
      default: ''
    }
  },
  apollo: {
    mediaProfilesCount: {
      query: MediaProfileCounts,
      variables() {
        let data = this.mediaProfilesReadVariables()
        delete data.orderBy
        delete data.first
        return data
      },
      update(data) {
        if (data && data.mediaProfilesConnection) {
          return data.mediaProfilesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    mediaProfiles: {
      query: MediaProfilesSelect,
      variables() {
        let data = this.mediaProfilesReadVariables()
        data.skip = 0
        return data
      },
      subscribeToMore: [
        {
          document: MediaProfilesSelectSubscription,
          variables() {
            let datafromread = this.mediaProfilesReadVariables()
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
      ],
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedProfile: null,
      first: 75,
      showAll: false
    }
  },
  methods: {
    toggleList(state) {
      this.showAll = state
      if (state == true) {
        this.first = null
      } else {
        this.first = 75
      }
    },
    mediaProfilesReadVariables() {
      let filteredProfiles

      if (this.service) {
        filteredProfiles = [{ service: { name_contains: this.service } }]
      }
      let data = {
        where: {
          isUserGenerated: true,
          OR: [
            { service: { name_contains: this.searchQuery } },
            { name_contains: this.searchQuery },
            { username_contains: this.searchQuery },
            { description_contains: this.searchQuery },
            { language_contains: this.searchQuery }
          ],
          AND: filteredProfiles
        },
        orderBy: 'name_ASC',
        first: this.first
      }
      return data
    },
    selectProfile(profile) {
      this.$emit('emitValue', profile)
    }
  }
}
</script>
