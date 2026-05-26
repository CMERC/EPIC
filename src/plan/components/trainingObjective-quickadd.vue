<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Training Objective</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="open">
          <div class="field">
            <label class="label">
              Choose Participant to add this Training Objective
            </label>
            <multiselect name="participantID"
                         v-model="selectedParticipant"
                         v-validate="'required'"
                         :class="{'input': errors.has('participantID'), 'is-danger': errors.has('participantID') }"
                         label="name"
                         track-by="id"
                         placeholder="Select Participant"
                         :options="planParticipants"
                         openDirection="bottom">
              <template slot="singleLabel"
                        slot-scope="{ option }">
                {{ option.name }}
              </template>
              <template slot="option"
                        slot-scope="{ option }">
                {{ option.name }}
              </template>
            </multiselect>
            <span v-show="errors.has('participantID')"
                  class="help is-danger">Training Objective Participant Required</span>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             @click="createThenRoute()">
            Save &amp; Create
          </a>
          <a class="button"
             @click="close()">
            Cancel
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import {
  PlanParticipantsList,
  PlanParticipantSubscription
} from '@/plan/graphql/PlanParticipants.gql'

import { PlanTrainingObjectivesCreate } from '@/plan/graphql/PlanTrainingObjectives.gql'

import { serverError } from '@/shared/serverError'

export default {
  name: 'trainingObjective-quickadd',
  props: {
    open: {
      default: false
    }
  },
  apollo: {
    planParticipants: {
      query: PlanParticipantsList,
      update(data) {
        if (data && data.planParticipants && data.planParticipants.length > 0) {
          return data.planParticipants
        }
      },
      skip() {
        return this.open == false
      },
      subscribeToMore: {
        document: PlanParticipantSubscription,

        updateQuery: (previousResult, { subscriptionData }) => {
          let mutationIn = subscriptionData.data.planParticipant.mutation
          var newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipants: [
                  subscriptionData.data.planParticipant.node,
                  ...previousResult.planParticipants
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipants: [
                  ...previousResult.planParticipants.filter(
                    obj =>
                      subscriptionData.data.planParticipant.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipants = JSON.parse(
                JSON.stringify(previousResult.planParticipants)
              )
              let index = newPlanParticipants.findIndex(
                x => x.id === subscriptionData.data.planParticipant.node.id
              )
              newPlanParticipants[index] =
                subscriptionData.data.planParticipant.node
              newResult = {
                planParticipants: newPlanParticipants
              }
              break
            }
            default: {
              throw new Error(`Unknown PlanParticipant mutation`)
            }
          }
          return newResult
        }
      }
    }
  },
  data() {
    return {
      planParticipants: [],
      saveInProgress: false,
      selectedParticipant: null
    }
  },
  methods: {
    async createThenRoute() {
      let createTrainingObj = await this.createTO(this.selectedParticipant.id)

      if (createTrainingObj != null) {
        this.routeTo(createTrainingObj, this.selectedParticipant.id)
      }
    },
    createTO(participantId) {
      if (!participantId) return
      return this.$apollo
        .mutate({
          mutation: PlanTrainingObjectivesCreate,
          variables: {
            data: {
              requiredRuns: '1',
              classification: 'Unclassified',
              participant: {
                connect: { id: participantId }
              }
            }
          }
        })
        .then(response => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          if (
            response &&
            response.data &&
            response.data.createPlanTrainingObjective &&
            response.data.createPlanTrainingObjective.id
          ) {
            return response.data.createPlanTrainingObjective.id
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    },
    routeTo(trainingObjId, participantId) {
      this.$router.push({
        name: 'planTrainingObjectiveView',
        params: {
          id: participantId,
          trainingObjID: trainingObjId,
          isEdit: true
        },
        query: { from: this.$route.fullPath }
      })
    },
    close() {
      this.particpantName = null
      this.$emit('close')
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
