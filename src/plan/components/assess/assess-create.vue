<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Assessment</p>
          <button class="delete"
                  aria-label="close"
                  @click="close"></button>
        </header>
        <section class="modal-card-body assessment-body">
          <div class="columns">
            <div class="column is-12">
              <div class="box">
                <div class="field">
                  <label class="label">
                    Select Participant
                  </label>
                  <div class="control">
                    <div class="select">
                      <select v-model="selectedParticipant"
                              @change="selectedTrainingObj=null">
                        <option value="">
                          Select Participant
                        </option>
                        <option v-for="participant in planParticipants"
                                :key="participant.id"
                                :value="participant.id">
                          {{participant.name}}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="field training-objectives-list"
                     v-if="selectedParticipant">
                  <label class="label">
                    Select Training Objective
                  </label>
                  <div class="control">
                    <multiselect name="trainingObjectives"
                                 v-model="selectedTrainingObj"
                                 track-by="id"
                                 placeholder="Select Training Objective"
                                 :options="planTrainingObjectives"
                                 :searchable="false"
                                 openDirection="bottom"
                                 :close-on-select="true"
                                 v-validate="'required'"
                                 :class="{'input': errors.has('trainingObjectives') , 'is-danger': errors.has('trainingObjectives') }">
                      <template slot="singleLabel"
                                slot-scope="{ option }">
                        {{ option.platform.platform.title }}&nbsp;{{ option.jmet.description }}
                      </template>
                      <template slot="option"
                                slot-scope="{ option }">
                        {{ option.platform.platform.title }}&nbsp;{{ option.jmet.description }}
                      </template>
                    </multiselect>
                    <span v-show="errors.has('trainingObjectives')"
                          class="help is-danger">Training Objective Required</span>
                    <span v-show="selectedTrainingObj && disableActionButton"
                          class="help is-danger">Number of assessments cannot exceed number of injects for this training objective.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <div class="field is-grouped is-grouped-left">
            <button class="button is-primary"
                    @click="validateBeforeSubmit"
                    :disabled="disableActionButton">
              Save
            </button>
            <a class="button"
               @click="close">
              Cancel
            </a>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'

import {
  PlanTrainingObjectivesRead,
  PlanTrainingObjectivesUpdate
} from '@/plan/graphql/PlanTrainingObjectives.gql'
import { PlanAssessmentCreate } from '@/plan/graphql/PlanAssessments.gql'

import { PlanParticipantsList } from '@/plan/graphql/PlanParticipants.gql'
export default {
  name: 'PlanAssessmentCreate',
  props: {
    open: {
      default: false
    }
  },
  apollo: {
    planParticipants: {
      query: PlanParticipantsList
    },
    planTrainingObjectives: {
      query: PlanTrainingObjectivesRead,
      variables() {
        return {
          where: {
            participant: {
              id: this.selectedParticipant
            }
          }
        }
      },
      update(data) {
        if (data && data.planTrainingObjectives) {
          let trainingObjectives = JSON.parse(
            JSON.stringify(data.planTrainingObjectives)
          )
          // This keeps the client side sorting from throwing an error for null values
          trainingObjectives.forEach(obj => {
            if (!obj.jmet) {
              obj.jmet = {}
            }
            if (!obj.platform) {
              obj.platform = { platform: {} }
            }
          })
          return trainingObjectives
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  mixins: [helpers],
  data() {
    return {
      selectedTrainingObj: null,
      planAssessment: {
        complete: true,
        reason: '',
        comment: ''
      },
      showTrainingObjectives: false,
      planTrainingObjectives: [],
      selectedParticipant: null
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.save()
          return
        }
      })
    },
    save() {
      if (!this.selectedTrainingObj) {
        this.$buefy.toast.open({
          message: 'No Training Objective is selected.',
          type: 'is-danger'
        })
        return
      } else {
        this.$apollo
          .mutate({
            mutation: PlanAssessmentCreate,
            variables: {
              data: {
                comment: this.planAssessment.comment,
                complete: true
              }
            }
          })
          .then(response => {
            // connect training objective
            this.$apollo
              .mutate({
                mutation: PlanTrainingObjectivesUpdate,
                variables: {
                  data: {
                    assessments: {
                      connect: {
                        id: response.data.createPlanAssessment.id
                      }
                    }
                  },
                  where: {
                    id: this.selectedTrainingObj.id
                  }
                }
              })
              .then(data => {
                if (data) {
                  this.close()
                  this.$buefy.toast.open({
                    message: 'Saving...',
                    type: 'is-success'
                  })
                  this.$router.push({
                    name: 'editassess',
                    params: { id: response.data.createPlanAssessment.id }
                  })
                }
              })
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('Plan Assessment create: ' + error)
          })
      }
    },
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
      this.planAssessment = {
        complete: true,
        reason: '',
        comment: ''
      }
      this.selectedTrainingObj = undefined
    }
  },
  mounted() {
    this.$apollo.queries.planTrainingObjectives.refetch()
  },
  computed: {
    disableActionButton() {
      if (
        (this.errors && this.errors.items && this.errors.items.length > 0) ||
        !this.selectedTrainingObj ||
        this.selectedTrainingObj.assessments.length >=
          this.selectedTrainingObj.injects.length
      ) {
        return true
      }
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
