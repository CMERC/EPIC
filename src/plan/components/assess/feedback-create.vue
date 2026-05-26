<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Feedback</p>
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
                    <span v-show="selectedTrainingObj&&feedbackCountExceeded"
                          class="help is-danger">Number of feedback cannot exceed number of injects for this training objective.</span>
                  </div>
                </div>
                <div class="field"
                     v-if="selectedParticipant && selectedTrainingObj">
                  <label class="label">
                    Select if you would like to open the form now or email the form link.
                  </label>
                  <div class="control">
                    <div class="buttons has-addons">
                      <button class="button"
                              :class="{'is-link': !sendFormNow}"
                              @click="sendFormNow=false">
                        Open Form
                      </button>
                      <button class="button"
                              :class="{'is-link': sendFormNow}"
                              @click="sendFormNow=true">
                        Email Form
                      </button>
                    </div>
                    <div v-if="sendFormNow">
                      <label class="label">
                        Email
                      </label>
                      <div class="control">
                        <input class="input"
                               type="email"
                               v-model="email"
                               placeholder="sample@sample.com"
                               v-validate="sendFormNow?'required':''|'email'"
                               data-vv-as="email"
                               name="email"
                               :class="{'is-danger': errors.has('email') }" />
                        <span v-show="errors.has('email') && fields.email.touched"
                              class="help has-text-danger">{{errors.first('email') }}</span>
                      </div>
                    </div>
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

import { PlanTrainingObjectivesRead } from '@/plan/graphql/PlanTrainingObjectives.gql'
import {
  PlanFeedbackCreate,
  PlanFeedbacksCounts
} from '@/plan/graphql/PlanFeedback.gql'

import { PlanParticipantsList } from '@/plan/graphql/PlanParticipants.gql'
import { FeedbackRequest } from '@/plan/graphql/PlanFeedbackRequests.gql'

export default {
  name: 'feedback-create',
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
    },
    planFeedbacksCount: {
      query: PlanFeedbacksCounts,
      variables() {
        return {
          where: {
            evaluation: {
              trainingObjectives: { id: this.selectedTrainingObj.id }
            }
          }
        }
      },
      update(data) {
        if (data && data.planFeedbacksConnection)
          return data.planFeedbacksConnection.aggregate.count
      },
      skip() {
        return !this.selectedTrainingObj
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
      selectedParticipant: null,
      sendFormNow: false,
      email: ''
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
    editPlanFeedback(feedbackId) {
      this.$router.push({
        name: 'editfeedbackpublic',
        params: {
          workspace: this.$store.state.activeWorkspace.name,
          id: feedbackId
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
      }
      // Create $data object
      else
        this.$apollo
          .mutate({
            mutation: PlanFeedbackCreate,
            variables: {
              data: {
                evaluation: {
                  create: {
                    complete: true,
                    trainingObjectives: {
                      connect: {
                        id: this.selectedTrainingObj.id
                      }
                    }
                  }
                }
              }
            }
          })
          .then(response => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.close()
            if (this.sendFormNow && this.email.length > 0) {
              this.$apollo
                .mutate({
                  mutation: FeedbackRequest,
                  variables: {
                    email: this.email,
                    feedbackUrl:
                      '/web/' +
                      this.$store.state.activeWorkspace.name +
                      '/feedback/edit/' +
                      response.data.createPlanFeedback.id
                  }
                })
                .then(() => {
                  this.$buefy.toast.open({
                    message: 'Email Sent',
                    type: 'is-success'
                  })
                  this.sendFormNow = false
                  this.email = ''
                })
            } else this.editPlanFeedback(response.data.createPlanFeedback.id)
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('Feedback create: ' + error)
          })
    },
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
      this.selectedTrainingObj = undefined
      this.selectedParticipant = null
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
        this.feedbackCountExceeded
      ) {
        return true
      }
    },
    feedbackCountExceeded() {
      return (
        this.planFeedbacksCount &&
        this.planFeedbacksCount >= this.selectedTrainingObj.injects.length
      )
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
