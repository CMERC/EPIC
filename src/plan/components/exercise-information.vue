<template>
  <article :class="{'card': isCard}">
    <nav class="level is-pulled-right">
      <div class="level-right"
           v-if="planEvents && planEvents.length > 0">
        <div class="level-item">
          <b-dropdown position="is-bottom-left">
            <a class="button is-small"
               slot="trigger">
              <span class="icon is-small">
                <i class="fas fa-ellipsis-v"></i>
              </span>
            </a>
            <b-dropdown-item @click="editExercise()">
              <span class="icon is-small">
                <i class="fas fa-pen"></i>
              </span>
              <span>Edit Exercise Details</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>
    <p class="px-2 py-2 title"
       v-if="bigHeader">Exercise Details</p>
    <label class="label"
           v-else>
      Exercise Details
    </label>
    <div class="content">
      <div v-if="planEvents && planEvents.length > 0">
        <div class="card-content">
          <div class="content">
            <span>
              <p class="subtitle"
                 :class="bigHeader ? 'is-size-5' : 'is-size-6'">
                <strong>{{truncate(currentExercise.name, 30)}}</strong>
              </p>
              <p class="subtitle"
                 :class="bigHeader ? 'is-size-5' : 'is-size-6'">
                <strong>
                  <span class="tooltip"
                        :data-tooltip="formatDate(currentExercise.startDate, 'utc-dtg')">{{formatDate(currentExercise.startDate, 'milDate')}}</span>
                  -
                  <span class="tooltip"
                        :data-tooltip="formatDate(currentExercise.endDate, 'utc-dtg')">{{formatDate(currentExercise.endDate, 'milDate')}}</span>
                </strong>
              </p>
            </span>
            <br />
            <span>
              <p class="subtitle is-size-6">{{planExerciseObjectiveCount}} Exercise Objectives</p>
              <p class="subtitle is-size-6">{{participantsCount}} Participants with {{platformsCount}} Platforms</p>
              <p class="subtitle is-size-6">{{planTrainingObjectivesCount}} Training Objectives</p>
              <p class="subtitle is-size-6">{{planEventsCount}} Events</p>
              <p class="subtitle is-size-6">{{planInjectsCount}} MSEL Injects</p>
            </span>
          </div>
        </div>
      </div>
      <div v-else
           class="py-1 px-1">
        <empty-state :data="currentExercise"
                     :isLoading='$apollo.loading'
                     :isCard='false'>
          <template slot="custom-message">
            <p class="subtitle has-text-centered">No exercise details found. Start planning by entering them now.</p>
          </template>
          <template slot="action-buttons">
            <div class="buttons is-centered is-spaced">
              <button class="button is-primary"
                      @click="editExercise()">
                Enter Details
              </button>
            </div>
          </template>
        </empty-state>
      </div>
    </div>
  </article>
</template>

<script>
import {
  PlanEventsList,
  PlanEventsCounts,
  PlanEventSubscription
} from '@/plan/graphql/PlanEvents.gql'
import { PlanTrainingObjectiveCounts } from '@/plan/graphql/PlanTrainingObjectives.gql'
import { PlanInjectsCounts } from '@/plan/graphql/PlanInjects.gql'

import { PlanExerciseObjectivesCounts } from '@/plan/graphql/PlanExerciseObjectives.gql'
import { participantsAndPlatforms } from '@/plan/graphql/PlanParticipants.gql'

export default {
  name: 'exercise-information',
  props: {
    bigHeader: { type: Boolean, default: false },
    isCard: {
      type: Boolean,
      default: true
    }
  },
  apollo: {
    planEvents: {
      query: PlanEventsList,
      variables() {
        return {
          where: {
            type: this.exType
          },
          orderBy: 'startDate_ASC'
        }
      },
      update(data) {
        if (data && data.planEvents && data.planEvents[0]) {
          this.currentExercise = JSON.parse(
            JSON.stringify(data.planEvents[0]),
            this.omitTypename
          )
          return data.planEvents
        }
      },
      subscribeToMore: {
        document: PlanEventSubscription,
        variables() {
          return {
            where: {
              node: {
                type: this.exType
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planEvent.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planEvents: [
                  subscriptionData.data.planEvent.node,
                  ...previousResult.planEvents
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planEvents: [
                  ...previousResult.planEvents.filter(
                    obj =>
                      subscriptionData.data.planEvent.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanEvents = JSON.parse(
                JSON.stringify(previousResult.planEvents)
              )
              let index = newPlanEvents.findIndex(
                x => x.id === subscriptionData.data.planEvent.node.id
              )
              newPlanEvents[index] = subscriptionData.data.planEvent.node
              newResult = {
                planEvents: newPlanEvents
              }
              break
            }
            default: {
              throw new Error(`Unknown mediaPost mutation`)
            }
          }
          return newResult
        }
      }
    },
    planEventsCount: {
      query: PlanEventsCounts,
      variables() {
        return {
          where: {
            type: null
          }
        }
      },
      update(data) {
        if (data && data.planEventsConnection) {
          return data.planEventsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planInjectsCount: {
      query: PlanInjectsCounts,
      variables() {
        return {
          where: {
            deletedAt: null
          }
        }
      },
      update(data) {
        if (data && data.planInjectsConnection) {
          return data.planInjectsConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planExerciseObjectiveCount: {
      query: PlanExerciseObjectivesCounts,
      variables: {},
      update(data) {
        if (data && data.planExerciseObjectivesConnection) {
          return data.planExerciseObjectivesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planTrainingObjectivesCount: {
      query: PlanTrainingObjectiveCounts,
      update(data) {
        if (
          data &&
          data.planTrainingObjectivesConnection &&
          data.planTrainingObjectivesConnection.aggregate
        ) {
          return data.planTrainingObjectivesConnection.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    participantsAndPlatforms: {
      query: participantsAndPlatforms,
      update(data) {
        if (data) {
          return data
        }
      }
    }
  },
  data() {
    return {
      exType: 'primary',
      currentExercise: {
        name: '',
        command: null,
        startDate: null,
        endDate: null,
        exerciseGuidance: ''
      }
    }
  },
  methods: {
    editExercise() {
      this.$router.push({
        name: 'exercise-stepper',
        query: { from: this.$route.fullPath }
      })
    }
  },
  computed: {
    participantsCount() {
      if (
        this.participantsAndPlatforms &&
        this.participantsAndPlatforms.participantsCount
      ) {
        return this.participantsAndPlatforms.participantsCount.aggregate.count
      }
    },
    platformsCount() {
      if (
        this.participantsAndPlatforms &&
        this.participantsAndPlatforms.platformsCount
      ) {
        return this.participantsAndPlatforms.platformsCount.aggregate.count
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
