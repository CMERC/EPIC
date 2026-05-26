<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active':open}">
      <div class="modal-background"
           v-if="openPlatformModal == false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Participant Platform</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <form data-vv-scope="participantPlatformModal"
                v-on:submit.prevent>
            <div class="columns is-multiline is-mobile">
              <div class="column is-full">
                <div class="columns">
                  <div class="column is-full">
                    <label class="label">
                      Platform
                    </label>
                    <multiselect v-model="platformInfo.platform"
                                 track-by="id"
                                 placeholder="Select Platform"
                                 :options="planPlatforms"
                                 :searchable="true"
                                 :name="'platformName'"
                                 v-validate="'required'"
                                 :class="{'input': errors.has('participantPlatformModal.platformName'), 'is-danger': errors.has('participantPlatformModal.platformName') }"
                                 :internal-search="false"
                                 @search-change="(value) => {searchQuery = value}">
                      
                      <template class="multiselect_element"
                                slot="beforeList">
                        <span class="multiselect__option"
                              @click="openCreatePlatform()">
                          <span> Add new... </span>
                        </span>
                        <hr class="dropdown-divider">
                      </template>
                      
                      <template slot="singleLabel"
                                slot-scope="{ option }">
                        {{ option.title }} : {{ option.type }}
                      </template>
                      <template slot="option"
                                slot-scope="{ option }">
                        {{ option.title }} : {{ option.type }}
                      </template>
                    </multiselect>
                    <span v-show="errors.has('participantPlatformModal.platformName')"
                          class="help has-text-danger">Platform Required</span>
                  </div>
                </div>
              </div>
              <div class="column is-full">
                <div class="columns">
                  <div class="column is-half">
                    <div class="field">
                      <label class="label">
                        Bed-down
                      </label>
                      <div class="control">
                        <input class="input"
                               v-model="platformInfo.bedDown"
                               type="text"
                               placeholder="Bed-down Location">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="savePlatform">
            Save
          </button>
          <button class="button"
                  @click="close">
            Cancel
          </button>
        </footer>
      </div>
    </div>
    <platform-interaction v-if="openPlatformModal"
                          :open="openPlatformModal"
                          @close="closePlatformModal"
                          @addRecord="value=>{platformInfo.platform = value}" />
  </div>
</template>

<script>
import { PlanParticipantPlatformRead } from '@/plan/graphql/PlanParticipantPlatforms.gql'
import { PlanPlatformsRead } from '@/plan/graphql/PlanPlatforms.gql'
import { PlanParticipantsUpdate } from '@/plan/graphql/PlanParticipants.gql'
import { serverError } from '@/shared/serverError'
import PlatformInteraction from '@/admin/components/platform-interaction'
import ParticipantPlatform from '@/plan/model/planParticipantPlatform'
import helpers from '@/shared/mixins/helpers'
export default {
  name: 'PlanManageParticipantPlatforms',
  props: {
    id: {
      type: String,
      default: ''
    },
    participantId: {
      type: String,
      default: ''
    },
    open: {
      default: false
    }
  },
  components: { PlatformInteraction },
  mixins: [helpers],
  apollo: {
    planPlatforms: {
      query: PlanPlatformsRead,
      variables() {
        return {
          where: {
            OR: [
              { title_contains: this.searchQuery },
              { type_contains: this.searchQuery }
            ]
          },
          orderBy: 'title_ASC'
        }
      },
      update(data) {
        if (data && data.planPlatforms) {
          return JSON.parse(
            JSON.stringify(data.planPlatforms),
            this.omitTypename
          )
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planParticipantPlatform: {
      query: PlanParticipantPlatformRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      skip() {
        return !this.id
      },
      update(data) {
        if (data && data.planParticipantPlatform && this.id) {
          this.platformInfo = JSON.parse(
            JSON.stringify(data.planParticipantPlatform),
            this.omitTypename
          )
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      openPlatformModal: false,
      searchQuery: '',
      planPlatforms: [],
      platformInfo: new ParticipantPlatform()
    }
  },
  watch: {
    open() {
      if (!this.open) {
        this.platformInfo = new ParticipantPlatform()
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    savePlatform() {
      let dataVariable
      let dataObj
      this.$validator.validate('participantPlatformModal.*').then(result => {
        if (result) {
          dataObj = {
            bedDown: this.platformInfo.bedDown,
            audience: this.platformInfo.audience,
            platform: { connect: { id: this.platformInfo.platform.id } }
          }
          if (!this.id) {
            dataVariable = {
              platforms: { create: dataObj }
            }
          } else {
            dataVariable = {
              platforms: {
                update: {
                  data: dataObj,
                  where: { id: this.id }
                }
              }
            }
          }
          this.$apollo
            .mutate({
              mutation: PlanParticipantsUpdate,
              variables: {
                data: dataVariable,
                where: {
                  id: this.participantId
                }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: serverError(error.message),
                type: 'is-danger'
              })
            })
          this.close()
          return true
        } else {
          this.$buefy.toast.open({
            message: 'Error with Submission',
            type: 'is-danger'
          })
          return false
        }
      })
    },
    openCreatePlatform() {
      this.openPlatformModal = true
    },
    closePlatformModal() {
      this.openPlatformModal = false
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-card,
.modal-card-body {
  overflow: visible !important;
}
</style>
