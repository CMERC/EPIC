<template>
  <div class="field">
    <div class="control is-expanded">
      <multiselect v-model="selectedPersona"
                   name="Persona"
                   :multiple="allowMultipleSelect"
                   :close-on-select="!allowMultipleSelect"
                   :clear-on-select="!allowMultipleSelect"
                   :optionHeight="25"
                   track-by="id"
                   :options="mediaPersonae"
                   v-if="mediaPersonae"
                   :internal-search="false"
                   @search-change="(value) => {searchQuery = value}" 
                   @select="selectPersona" 
                   openDirection="below" 
                   :class="{'input': errorMessage, 'is-danger': errorMessage }">
        <template slot="singleLabel"
                  slot-scope="props">
          <span class="option__desc"
                :key="props.option.id">
            <span class="option__title">
              {{props.option.name}}{{props.option.role ? ` - ${props.option.role}` : null | truncate(50)}}
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
                <p class="subtitle is-7 has-text-weight-semibold">{{props.option.role | truncate(50)}}</p>
              </div>
            </div>
          </div>
        </template>
        <template class="multiselect_element"
                  slot="afterList">
          <div v-show="mediaPersonasCount > 74"
               class="afterList">
            <hr class="dropdown-divider">
            <span class="multiselect__option"
                  @click="toggleList(true)"
                  v-if="mediaPersonae.length > 74 && showAll == false">
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
      <span v-show="errorMessage"
            class="help has-text-danger">Persona Required</span> 
    </div>
  </div>
</template>

<script>
import {
  MediaPersonasList,
  MediaPersonaSubscription,
  MediaPersonasCounts
} from '@/media/graphql/MediaPersonas.gql'

export default {
  name: 'persona-relationselector',
  props: {
    errorMessage: {
      type: Boolean,
      default: false
    },
    isModal: {
      type: Boolean,
      default: false
    },
    allowMultipleSelect: {
      type: Boolean,
      deafult: false
    }
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
      searchQuery: '',
      selectedPersona: '',
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
    queryVariables() {
      let data = {
        where: {
          OR: [
            { name_contains: this.searchQuery },
            { role_contains: this.searchQuery }
          ]
        },
        orderBy: 'name_ASC',
        first: this.first
      }
      return data
    },
    selectPersona(persona) {
      this.$emit('emitValue', persona)
    }
  }
}
</script>

<style lang="scss" scoped>
.content figure {
  margin-left: 0.5rem;
  margin-right: 0;
  text-align: center;
}
</style>
