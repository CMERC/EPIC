<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active':open}">
      <div class="modal-background"></div>
      <div class="modal-card accreditedTask-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">Accredited Task</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="planJmets && planJmets.length > 0">
          <div class="columns is-multiline is-mobile">
            <div class="column is-full">
              <div class="columns">
                <div class="column is-full">
                  <div class="field">
                    <label class="label">
                      Select Accredited Task
                    </label>
                    <multiselect name="accreditedTaskID"
                                 v-model="accreditedTaskInfo.jmet"
                                 v-validate="'required'"
                                 :class="{accTaskError, 'is-danger': errors.has('accreditedTaskID') || accTaskError }"
                                 track-by="id"
                                 placeholder="Select Task"
                                 @select="checkExistingJmet"
                                 @remove="accTaskError = false"
                                 :options="planJmets"
                                 :searchable="true"
                                 openDirection="bottom" 
                                 :close-on-select="true" 
                                 :internal-search="false" 
                                 @search-change="search">
                      <template slot="singleLabel"
                                slot-scope="{ option }">
                        {{ option.description }}
                      </template>
                      <template slot="option"
                                slot-scope="{ option }">
                        {{ option.description }}
                      </template>
                      <template class="multiselect_element"
                                slot="afterList">
                        <div v-show="planJmetsCounts > 74"
                             class="afterList">
                          <hr class="dropdown-divider">
                          <span class="multiselect__option"
                                @click="toggleList(true)"
                                v-if="planJmets && planJmets.length > 74 && showAll == false">
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
                    <span v-show="errors.has('accreditedTaskID')"
                          class="help is-danger">Accredited Task Required</span>
                    <span v-show="accTaskError"
                          class="help is-danger">Accredited Task Already Exists</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="saveAccreditedTask('accreditedTaskID','tasks',accreditedTaskInfo)">
            Save
          </button>
          <button class="button"
                  @click="close()">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import {
  PlanAccreditedTasksCreate,
  PlanAccreditedTaskRead,
  PlanAccreditedTasksUpdate
} from '@/plan/graphql/PlanAccreditedTasks.gql'

import { PlanJmetsList, PlanJmetsCounts } from '@/plan/graphql/PlanJmets.gql'

import PlanAccreditedTask from '@/plan/model/planAccreditedTask'
import { serverError } from '@/shared/serverError'
import helpers from '@/shared/mixins/helpers'
export default {
  name: 'PlanManageAccreditedTask',
  apollo: {
    planJmetsCounts: {
      query: PlanJmetsCounts,
      variables() {
        return {
          where: {
            description_contains: this.searchQuery
          }
        }
      },
      update(data) {
        if (data && data.planJmetsConnection) {
          return data.planJmetsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planJmets: {
      query: PlanJmetsList,
      variables() {
        let data = {
          where: {
            OR: [{ description_contains: this.searchQuery }]
          },
          first: this.first
        }
        return data
      }
    },
    planAccreditedTask: {
      query: PlanAccreditedTaskRead,
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
        if (data && data.planAccreditedTask) {
          this.accreditedTaskInfo = JSON.parse(
            JSON.stringify(data.planAccreditedTask),
            this.omitTypename
          )
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  props: {
    id: {},
    open: {
      default: false
    },
    existingIds: {
      type: Array
    },
    accTask: {
      type: Object,
      default: function() {
        return new PlanAccreditedTask()
      }
    }
  },
  mixins: [helpers],
  data() {
    return {
      orderBy: 'levelWar_ASC',
      first: 75,
      showAll: false,
      searchQuery: '',
      accTaskError: false,
      accreditedTaskInfo: Object.assign({}, this.accTask)
    }
  },
  watch: {
    open() {
      if (!this.open) {
        this.accreditedTaskInfo = {}
      }
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
    search(val) {
      this.searchQuery = val
    },
    checkExistingJmet(selectedOption) {
      if (this.existingIds.indexOf(selectedOption.id) > -1) {
        this.accTaskError = true
      } else {
        this.accTaskError = false
      }
    },
    close() {
      this.accreditedTaskInfo = {}
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    saveAccreditedTask(validateInput, name, value) {
      let injectData = {}
      this.$validator.validate(validateInput).then(result => {
        if (result && !this.accTaskError) {
          if (!value.id) {
            injectData = Object.assign(injectData, {
              jmet: {
                connect: { id: value.jmet.id }
              }
            })
            this.$apollo
              .mutate({
                mutation: PlanAccreditedTasksCreate,
                variables: {
                  data: injectData
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
          } else {
            let injectID = value.id
            injectData = Object.assign(injectData, {
              jmet: {
                connect: { id: value.jmet.id }
              }
            })
            this.$apollo
              .mutate({
                mutation: PlanAccreditedTasksUpdate,
                variables: {
                  data: injectData,
                  where: {
                    id: injectID
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
          }
          this.close()
          return true
        } else {
          this.$buefy.toast.open({
            message: 'Error with Selection',
            type: 'is-danger'
          })
          return false
        }
      })
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
