<template>
  <div class="container">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Personas to Network</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="mediaNetwork && mediaPersonae">
          <div class="columns is-centered">
            <div class="column is-10">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-96x96"
                          v-if="mediaNetwork.avatar != null">
                    <img :src="mediaNetwork.avatar.url.thumb"
                         alt="image"
                         class="is-avatar xl">
                  </figure>
                  <figure class="image is-48x48"
                          v-else>
                    <span class="icon is-large">
                      <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                    </span>
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-6">{{mediaNetwork.name}}</p>
                </div>
                <div class="media-right"
                     v-if="selectedPersonas && selectedPersonas.length > 0">
                  <span class="icon">
                    <i class="fas fa-users has-text-primary"></i>
                  </span>
                  <span>{{selectedPersonas.length}}</span>
                </div>
              </div>
              <div class="content">
                <a class="button is-primary"
                   @click="toggleQuickPersona()">
                  Create Quick Persona
                </a>
                <div class="is-divider"
                     data-content="or search existing personas"></div>
                <div class="field">
                  <p class="control has-icons-left">
                    <input class="input is-rounded is-primary"
                           type="text"
                           placeholder="Search..."
                           v-model="searchQuery"
                           clearable
                           v-focus>
                    <span class="icon is-small is-left">
                      <i class="fas fa-search"></i>
                    </span>
                  </p>
                </div>
                <div class="field"
                     v-if="mediaPersonae && mediaPersonae.length > 0">
                  <div class="select is-multiple is-fullwidth">
                    <select multiple
                            v-model="selectedPersonas"
                            size="8">
                      <option v-for="persona in mediaPersonae"
                              v-bind:key="persona.id"
                              :value="persona.id">
                        {{persona.name}} - {{persona.role}}
                      </option>
                    </select>
                  </div>
                </div>
                <div v-else>
                  <div class="card">
                    <div class="card-content">
                      <div class="card-header-title is-centered">
                        <i class="fas fa-search fa-3x has-text-primary"></i>
                      </div>
                      <p class="subtitle has-text-centered">
                        No result found. Try a different search.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             @click="reviewChanges">
            Review
          </a>
          <a class="button"
             @click="close()">
            Cancel
          </a>
        </footer>
      </div>
    </div>
    <persona-quick-add :open="quickAdd"
                       @close="toggleQuickPersona" />
  </div>
</template>

<script>
import PersonaQuickAdd from '@/media/components/personas-quickadd'
import {
  MediaPersonasList,
  MediaPersonaSubscription
} from '@/media/graphql/MediaPersonas.gql'
export default {
  name: 'networks-addpersona',
  components: { PersonaQuickAdd },
  props: {
    mediaNetwork: {},
    open: {
      default: false
    }
  },
  apollo: {
    mediaPersonae: {
      query: MediaPersonasList,
      variables() {
        return {
          where: {
            name_contains: this.searchQuery
          },
          orderBy: 'name_DESC'
        }
      },
      subscribeToMore: [
        {
          document: MediaPersonaSubscription,
          // Mutate the previous result
          updateQuery(previousResult, { subscriptionData }) {
            // Mutation type
            let mutationIn = subscriptionData.data.mediaPersona.mutation
            var newResult
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
            // Here, return the new result from the previous with the new data
            return newResult
          }
        }
      ]
    }
  },
  data() {
    return {
      selectedPersonas: [],
      searchQuery: '',
      quickAdd: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.selectedPersonas = []
    },
    toggleQuickPersona() {
      this.quickAdd = !this.quickAdd
    },
    save() {
      let personasArray = []
      for (let i = 0; i < this.selectedPersonas.length; i++) {
        personasArray.push({
          id: this.selectedPersonas[i]
        })
      }
      this.$emit('addPersona', personasArray)
      this.close()
    },
    reviewChanges() {
      this.$buefy.dialog.confirm({
        title: 'Review Personas',
        message: `You are adding ${this.selectedPersonas.length} Personas`,
        type: 'is-warning',
        onConfirm: () => this.save()
      })
    }
  },
  watch: {
    mediaNetwork() {
      if (this.mediaNetwork.personas) {
        for (let i = 0; i < this.mediaNetwork.personas.length; i++) {
          this.selectedPersonas.push(this.mediaNetwork.personas[i].id)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
