<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="'Feedback'" />
    <div v-if="planFeedback && planFeedback.id != null">
      <div class="columns">
        <div class="column">
          <div class="columns is-centered">
            <div class="column is-half">
              <p class="title is-size-6">Feedback for
                {{planFeedback.evaluation.trainingObjectives.participant.name}}
                {{planFeedback.evaluation.trainingObjectives.participant.platforms[0].platform.title}}
                {{planFeedback.evaluation.trainingObjectives.participant.platforms[0].platform.type}}</p>
              <p class="subtitle is-size-6"> Provided by: {{planFeedback.evaluation.email}}</p>
            </div>
          </div>
          <hr class="dropdown-divider">
          <div class="card">
            <div class="card-content">
              <div class="field">
                <p class="title is-size-5">Training Objectives</p>
                <div class="columns is-multiline">
                  <div class="column is-half">
                    <div class="box"
                         v-if="planFeedback.evaluation.trainingObjectives">
                      <p class="title is-size-6"
                         v-if="planFeedback.evaluation.trainingObjectives.jmet">
                        {{planFeedback.evaluation.trainingObjectives.jmet.levelWar}} {{planFeedback.evaluation.trainingObjectives.jmet.taskNumber}} {{planFeedback.evaluation.trainingObjectives.jmet.taskTitle}}
                      </p>
                      <div class="field">
                        <label class="label">
                          Task
                        </label>
                        <pre class="content">{{planFeedback.evaluation.trainingObjectives.task }}</pre>
                      </div>
                      <div class="field">
                        <label class="label">
                          Condition
                        </label>
                        <pre class="content">{{planFeedback.evaluation.trainingObjectives.condition }}</pre>
                      </div>
                      <div class="field">
                        <label class="label">
                          Standard
                        </label>
                        <pre class="content">{{planFeedback.evaluation.trainingObjectives.standard}}</pre>
                      </div>
                    </div>
                  </div>
                  <div class="column is-half">
                    <div class="field">
                      <label class="label">
                        Was this training objective completed?
                      </label>
                      <span class="tag is-rounded is-success"
                            v-if="planFeedback.evaluation.complete">Yes</span>
                      <span class="tag is-danger is-success"
                            v-else>No</span>
                    </div>
                    <div class="field"
                         v-if="planFeedback.evaluation.complete">
                      <label class="label">
                        To which level of effectiveness was this objective completed?
                      </label>
                      <div v-if="planFeedback.evaluation.status==='TRAINED'">
                        <span class="tag is-rounded is-success">Trained</span>
                      </div>
                      <div v-else-if="planFeedback.evaluation.status==='PARTIALLY'">
                        <span class="tag is-rounded is-warning">Partially Trained</span>
                      </div>
                      <div v-else-if="planFeedback.evaluation.status==='UNTRAINED'">
                        <span class="tag is-rounded is-danger">Untrained</span>
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">
                        Why was the objective not completed?
                      </label>
                      <p class="subtitle is-6">{{planFeedback.evaluation.reason ? planFeedback.evaluation.reason.title: 'No Reason'}}</p>
                    </div>
                    <div class="field">
                      <label class="label">
                        Comment
                      </label>
                      <p class="subtitle is-6">{{planFeedback.evaluation.comment}}</p>
                    </div>
                    <div class="field"
                         v-if="planFeedback.evaluation.complete && planFeedback.evaluation.measureData && planFeedback.evaluation.measureData.length">
                      <label class="label">
                        Measures
                      </label>
                      <div class="field"
                           v-for="measureData in planFeedback.evaluation.measureData"
                           :key="measureData.measure.id">
                        <label class="subtitle is-5">
                          {{measureData.measure.title}}
                        </label>
                        <div class="control">
                          <p class="subtitle is-6">{{measureData.value}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-full">
              <div class="field">
                <label class="label">
                  Remarks
                </label>
                <p class="subtitle is-6"
                   v-if="planFeedback.evaluation.remark">{{planFeedback.evaluation.remark}}</p>
                <p class="subtitle is-6"
                   v-else>No remarks</p>
              </div>
            </div>
            <div v-if="planFeedback.evaluation.trainingObjectives.participant.participantType">
              <div v-if="planFeedback.evaluation.trainingObjectives.participant.participantType.title==='Air'">
                <div class="column is-full"
                     v-if="planFeedback.metrics">
                  <label class="label">
                    Air Metrics
                  </label>
                  <div class="box">
                    <div class="columns is-multiline">
                      <div class="column is-one-third">
                        <div class="field">
                          <label class="label">
                            Flight Hours
                          </label>
                          <p class="subtitle">
                            {{planFeedback.metrics.flightHours}}
                          </p>
                        </div>
                      </div>
                      <div class="column is-one-third">
                        <div class="field">
                          <label class="label">
                            Sorties (Number)
                          </label>
                          <p class="subtitle">
                            {{planFeedback.metrics.numOfStories}}
                          </p>
                        </div>
                      </div>
                      <div class="column is-one-third">
                        <div class="field">
                          <label class="label">
                            Passengers Carried (Number)
                          </label>
                          <p class="subtitle">
                            {{planFeedback.metrics.numOfPassesngers}}
                          </p>
                        </div>
                      </div>
                      <div class="column is-one-third">
                        <div class="field">
                          <label class="label">
                            Cargo Weight (lbs)
                          </label>
                          <p class="subtitle">
                            {{planFeedback.metrics.cargoWeight}}
                          </p>
                        </div>
                      </div>
                      <div class="column is-one-third">
                        <div class="field">
                          <label class="label">
                            Fuel Passed (lbs)
                          </label>
                          <p class="subtitle">
                            {{planFeedback.metrics.fuelPassed}}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="planFeedback.evaluation.trainingObjectives.participant.participantType.title==='Ground'">
                <div class="column is-full"
                     v-if="planFeedback.metrics">
                  <label class="label">
                    Ground Metrics
                  </label>
                  <div class="box">
                    <div class="columns is-multiline">
                      <div class="column is-one-third">
                        <div class="field">
                          <label class="label">
                            Miles Traveled
                          </label>
                          <p class="subtitle">
                            {{planFeedback.metrics.milesTraveled}}
                          </p>
                        </div>
                      </div>
                      <div class="column is-one-third">
                        <div class="field">
                          <label class="label">
                            Gallons Gas Used
                          </label>
                          <p class="subtitle">
                            {{planFeedback.metrics.gallonsGasUsed}}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-full"
                 v-if="planFeedback.tasks && planFeedback.tasks.length>0">
              <div class="field">
                <label class="label">
                  Mission Tasks
                </label>
              </div>
              <ul class="menu-list">
                <li v-for="(feedbackTask,$index) in  planFeedback.tasks"
                    :key="feedbackTask.id">
                  #{{$index+1}} - {{feedbackTask.task.title}} - {{feedbackTask.numberCompleted}}
                </li>
              </ul>
            </div>
            <div class="column is-full"
                 v-if="planFeedback.qualifications && planFeedback.qualifications.length>0">
              <div class="field">
                <label class="label">
                  Qualifications
                </label>
              </div>
              <ul class="menu-list">
                <li v-for="(feedbackQualification,$index) in  planFeedback.qualifications"
                    :key="feedbackQualification.id">
                  #{{$index+1}} - {{feedbackQualification.qualification.title}} - {{feedbackQualification.numberCompleted}}
                </li>
              </ul>
            </div>
            <div class="column is-full">
              <div class="field">
                <label class="label">
                  Lessons Learned
                </label>
              </div>
              <template v-if="planFeedback.lessonsLearned.length > 0">
                <div class="box lessonsLearned"
                     v-for="lesson in planFeedback.lessonsLearned"
                     :key="lesson.id">
                  <div class="columns is-multiline">
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Potential OPR
                        </label>
                        <p class="subtitle is-size-6">{{lesson.potentialOPR}}</p>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Classification
                        </label>
                        <p class="subtitle is-size-6">{{lesson.classification}}</p>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Title
                        </label>
                        <p class="subtitle is-size-6">{{lesson.title}}</p>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Observation
                        </label>
                        <p class="subtitle is-size-6">{{lesson.observation}}</p>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Discussion
                        </label>
                        <p class="subtitle is-size-6">{{lesson.discussion}}</p>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Recommendation
                        </label>
                        <p class="subtitle is-size-6">{{lesson.recommendation}}</p>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Implications
                        </label>
                        <p class="subtitle is-size-6">{{lesson.implications}}</p>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Event Description
                        </label>
                        <p class="subtitle is-size-6">{{lesson.eventDescription}}</p>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Comments
                        </label>
                        <p class="subtitle is-size-6">{{lesson.comments}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <p class="subtitle is-6">No Lessons Learned</p>
              </template>
            </div>
          </div>
        </div>
      </div>
      <nav class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <button class="button"
                  @click="$router.go(-1)">
            Close
          </button>
        </div>
      </nav>
    </div>
    <div v-else>
      <empty-state :data="planFeedback"
                   :isLoading='$apollo.loading' />
    </div>
  </div>
</template>

<script>
import helpers from '@/shared/mixins/helpers'
import { PlanFeedbackRead } from '@/plan/graphql/PlanFeedback.gql'
import lightOrDark from '@/shared/mixins/lightOrDark'
export default {
  name: 'view-feedback',
  props: {
    id: String
  },
  mixins: [helpers, lightOrDark],
  apollo: {
    planFeedback: {
      query: PlanFeedbackRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
