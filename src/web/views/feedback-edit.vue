<template>
  <div class="container">
    <div class="columns"
         v-if="planFeedback && planFeedback.id != null">
      <div class="column">
        <div v-if="prevRoute&&prevRoute.name"
             class="backButton">
          <button class="button is-rounded"
                  @click="$router.go(-1)">
            <span class="icon is-small">
              <i class="fas fa-arrow-left"></i>
            </span>
          </button>
        </div>
        <div class="column">
          <nav class="level">
            <div class="level-item">
              <figure class="media-center">
                <p class="image is-64x64">
                  <img src="@/shared/assets/logo.svg">
                </p>
              </figure>
              <label class="title">
                Feedback
              </label>
            </div>
          </nav>
        </div>
        <div class="column has-text-centered"
             v-if="planFeedback && planFeedback.status == 'SUBMITTED'">
          <h4 class="title is-4">
            Thank You!
          </h4>
          <h5 class="subtitle is-5">
            Your feedback has been submitted.
          </h5>
          <button v-if="prevRoute&&prevRoute.name"
                  class="button is-primary"
                  @click="$router.go(-1)">
            Epic Ready
          </button>
          <router-link v-else
                       :to="{name: 'login'}"
                       class="button is-primary">
            Epic Ready
          </router-link>
        </div>
        <div class="columns">
          <div class="column">
            <form data-vv-scope="trainingObj"
                  v-on:submit.prevent>
              <div class="columns is-multiline">
                <div class="column is-full">
                  <div class="columns">
                    <div class="column is-one-third">
                      <div class="field">
                        <label class="label">
                          Participant Platform
                        </label>
                        <p class="control">
                          {{planFeedback.evaluation.trainingObjectives.participant.name}} -
                          {{planFeedback.evaluation.trainingObjectives.platform?planFeedback.evaluation.trainingObjectives.platform.platform.title:''}}
                        </p>
                      </div>
                    </div>
                    <div class="column is-one-third">
                      <label class="label">
                        Date
                      </label>
                      <p class="control">
                        {{moment().format('DD MMM YY')}}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="column is-6 is-size-12-tablet">
                  <div class="columns">
                    <div class="column is-half">
                      <div class="field">
                        <label class="label">
                          Training Objective
                        </label>
                        <p class="control">
                          <span v-if="planFeedback.evaluation.trainingObjectives.jmet">
                            {{planFeedback.evaluation.trainingObjectives.jmet.levelWar}} {{planFeedback.evaluation.trainingObjectives.jmet.taskNumber}} {{planFeedback.evaluation.trainingObjectives.jmet.taskTitle}}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-multiline">
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Task
                        </label>
                        <pre class="content">
                                {{planFeedback.evaluation.trainingObjectives.task}}
                        </pre>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Condition
                        </label>
                        <pre class="content">
                                {{planFeedback.evaluation.trainingObjectives.condition}}
                        </pre>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Standard
                        </label>
                        <pre class="content">
                                {{planFeedback.evaluation.trainingObjectives.standard}}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-6 is-size-12-tablet">
                  <div class="card">
                    <div class="card-content">
                      <label class="label">
                        Self Assessment
                      </label>
                      <div class="field">
                        <label class="label">
                          Status
                        </label>
                        <div class="buttons has-addons">
                          <span class="button"
                                :class="{'is-success is-selected':planFeedback.evaluation.complete}"
                                @click="updateCompleteness(true)">Complete</span>
                          <span class="button"
                                :class="{'is-danger is-selected':!planFeedback.evaluation.complete}"
                                @click="updateCompleteness(false)">Incomplete</span>
                        </div>
                      </div>
                      <div class="field"
                           v-if="planFeedback.evaluation.complete">
                        <label class="label">
                          To which level of effectiveness was this objective completed?
                        </label>
                        <div class="buttons has-addons">
                          <span class="button"
                                :class="{'is-success is-selected':planFeedback.evaluation.status==='TRAINED'}"
                                @click="updateEffectiveness('TRAINED')">Trained</span>
                          <span class="button"
                                :class="{'is-warning is-selected':planFeedback.evaluation.status==='PARTIALLY'}"
                                @click="updateEffectiveness('PARTIALLY')">Partially Trained</span>
                          <span class="button"
                                :class="{'is-danger is-selected':planFeedback.evaluation.status==='UNTRAINED'}"
                                @click="updateEffectiveness('UNTRAINED')">Untrained</span>
                        </div>
                      </div>
                      <div class="field"
                           v-if="showReasons">
                        <label class="label">
                          Why was the objective not effective?
                        </label>
                        <div class="control is-expanded">
                          <multiselect v-model="planFeedbackEvaluationReason"
                                       track-by="id"
                                       placeholder="Select a reason"
                                       :options="planReasons"
                                       :name="'Reasons'"
                                       v-validate.immediate="'required'"
                                       openDirection="bottom"
                                       :internal-search="false"
                                       @search-change="search('Reason', $event)">
                            <template slot="singleLabel"
                                      slot-scope="{ option }">
                              {{ option.title }}
                            </template>
                            <template slot="option"
                                      slot-scope="{ option }">
                              {{ option.title }}
                            </template>
                            <template class="multiselect_element"
                                      slot="beforeList">
                              <span class="multiselect__option"
                                    @click="showAddValue('Reason')">
                                <span> Add new... </span>
                              </span>
                              <hr class="dropdown-divider">
                            </template>
                          </multiselect>
                        </div>
                      </div>
                      <div class="field">
                        <label class="label">
                          Comment
                        </label>
                        <div class="control">
                          <div class="has-background-white"
                               style="height: 100%">
                            <textarea class="textarea"
                                      v-model="planFeedback.evaluation.comment"
                                      placeholder="Task Performance Observation"></textarea>
                          </div>
                        </div>
                      </div>
                      <div class="field"
                           v-if="showMeasures">
                        <label class="label">
                          Measures
                        </label>
                        <div class="field"
                             v-for="measureData in measuresData"
                             :key="measureData.measure.id">
                          <label class="subtitle is-6">
                            {{measureData.measure.title}}
                          </label>
                          <div class="control">
                            <input class="input"
                                   v-model="measureData.value"
                                   type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="card">
                    <div class="card-content">
                      <div class="field">
                        <label class="label">
                          Overall Remarks
                        </label>
                        <div class="control">
                          <textarea class="textarea"
                                    placeholder="Remarks if required"
                                    v-model="planFeedback.evaluation.remark"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-full"
                     v-if="planFeedback.evaluation.trainingObjectives.participant.participantType">
                  <div class="card">
                    <div class="card-content">
                      <div class="field"
                           v-if="planFeedback.evaluation.trainingObjectives.participant.participantType.title==='Air'">
                        <label class="label">
                          Air Metrics
                        </label>
                        <p class="subtitle is-size-6">Do you have metrics to record for this day?</p>
                        <div class="buttons has-addons">
                          <a class="button"
                             @click="toggleAirMetricsSection"
                             :class="{'is-success is-selected':showAirMetrics}">
                            Yes
                          </a>
                          <a class="button"
                             @click="toggleAirMetricsSection"
                             :class="{'is-danger is-selected':!showAirMetrics}">
                            No
                          </a>
                        </div>
                      </div>
                      <div class="column is-full"
                           v-if="showAirMetrics">
                        <div class="box">
                          <div class="columns is-multiline">
                            <div class="column is-one-third">
                              <div class="field">
                                <label class="label">
                                  Flight Hours
                                </label>
                                <div class="control">
                                  <input class="input"
                                         v-validate="'required|numeric'"
                                         name="flightHours"
                                         v-model="planFeedbackMetrics.flightHours"
                                         :class="{'input': true, 'is-danger': errors.has('trainingObj.flightHours') }" />
                                  <span v-show="errors.has('trainingObj.flightHours')"
                                        class="help has-text-danger">Whole Numeric Values Only</span>
                                </div>
                              </div>
                            </div>
                            <div class="column is-one-third">
                              <div class="field">
                                <label class="label">
                                  Sorties (Number)
                                </label>
                                <div class="control">
                                  <input class="input"
                                         v-validate="'required|numeric'"
                                         name="sorties"
                                         v-model="planFeedbackMetrics.numOfStories"
                                         :class="{'input': true, 'is-danger': errors.has('trainingObj.sorties') }" />
                                  <span v-show="errors.has('trainingObj.sorties')"
                                        class="help has-text-danger">Whole Numeric Values Only</span>
                                </div>
                              </div>
                            </div>
                            <div class="column is-one-third">
                              <div class="field">
                                <label class="label">
                                  Passengers Carried (Number)
                                </label>
                                <div class="control">
                                  <input class="input"
                                         v-validate="'required|numeric'"
                                         name="passengers"
                                         v-model="planFeedbackMetrics.numOfPassesngers"
                                         :class="{'input': true, 'is-danger': errors.has('trainingObj.passengers') }" />
                                  <span v-show="errors.has('trainingObj.passengers')"
                                        class="help has-text-danger">Whole Numeric Values Only</span>

                                </div>
                              </div>
                            </div>
                            <div class="column is-one-third">
                              <div class="field">
                                <label class="label">
                                  Cargo Weight (lbs)
                                </label>
                                <div class="control">
                                  <input class="input"
                                         v-validate="'required|decimal:2'"
                                         name="cargoWeight"
                                         v-model="planFeedbackMetrics.cargoWeight"
                                         :class="{'input': true, 'is-danger': errors.has('trainingObj.cargoWeight') }" />
                                  <span v-show="errors.has('trainingObj.cargoWeight')"
                                        class="help has-text-danger">Numeric Values Only with up to 2 decimal places</span>

                                </div>
                              </div>
                            </div>
                            <div class="column is-one-third">
                              <div class="field">
                                <label class="label">
                                  Fuel Passed (lbs)
                                </label>
                                <div class="control">
                                  <input class="input"
                                         v-validate="'required|decimal:2'"
                                         name="fuelPassed"
                                         v-model="planFeedbackMetrics.fuelPassed"
                                         :class="{'input': true, 'is-danger': errors.has('trainingObj.fuelPassed') }" />
                                  <span v-show="errors.has('trainingObj.fuelPassed')"
                                        class="help has-text-danger">Numeric Values Only with up to 2 decimal places</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="field"
                           v-if="planFeedback.evaluation.trainingObjectives.participant.participantType.title==='Ground'">
                        <label class="label">
                          Ground Metrics
                        </label>
                        <p class="subtitle is-size-6">Do you have metrics to record for this day?</p>
                        <div class="buttons has-addons">
                          <a class="button"
                             @click="toggleGroundMetricsSection"
                             :class="{'is-success is-selected':showGroundMetrics}">
                            Yes
                          </a>
                          <a class="button"
                             @click="toggleGroundMetricsSection"
                             :class="{'is-danger is-selected':!showGroundMetrics}">
                            No
                          </a>
                        </div>
                      </div>
                      <div class="column is-full"
                           v-if="showGroundMetrics">
                        <div class="box">
                          <div class="columns is-multiline">
                            <div class="column is-one-third">
                              <div class="field">
                                <label class="label">
                                  Miles Traveled
                                </label>
                                <div class="control">
                                  <input class="input"
                                         v-validate="'required|decimal:2'"
                                         name="milesTraveled"
                                         v-model="planFeedbackMetrics.milesTraveled"
                                         :class="{'input': true, 'is-danger': errors.has('trainingObj.milesTraveled') }" />
                                  <span v-show="errors.has('trainingObj.milesTraveled')"
                                        class="help has-text-danger">Numeric Values Only with up to 2 decimal places</span>

                                </div>
                              </div>
                            </div>
                            <div class="column is-one-third">
                              <div class="field">
                                <label class="label">
                                  Gallons Gas Used
                                </label>
                                <div class="control">
                                  <input class="input"
                                         v-validate="'required|decimal:2'"
                                         name="gallonsGas"
                                         v-model="planFeedbackMetrics.gallonsGasUsed"
                                         :class="{'input': true, 'is-danger': errors.has('trainingObj.gallonsGas') }" />
                                  <span v-show="errors.has('trainingObj.gallonsGas')"
                                        class="help has-text-danger">Numeric Values Only with up to 2 decimal places</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="card">
                    <div class="card-content">
                      <label class="label">
                        Mission Tasks
                      </label>
                      <div v-if="feedbackTasks.length>0">
                        <ul class="menu-list">
                          <li v-for="(feedbackTask,$index) in  feedbackTasks"
                              :key="$index">
                            #{{$index+1}} - {{feedbackTask.task.title}} -
                            <input class="input task-number-completed"
                                   v-validate="'required|decimal:2'"
                                   :name="feedbackTask.task.id"
                                   v-model="feedbackTask.numberCompleted"
                                   :class="{'input': true, 'is-danger': errors.has(`trainingObj.${feedbackTask.task.id}`) }" />
                            <div class="field has-addons action-buttons">
                              <p class="control">
                                <button class="button is-small"
                                        @click="confirmDeleteFeedbackTask(feedbackTask.task.title)">
                                  <span class="icon is-small has-text-danger">
                                    <i class="fas fa-times"></i>
                                  </span>
                                </button>
                              </p>
                            </div>
                            <span v-show="errors.has(`trainingObj.${feedbackTask.task.id}`)"
                                  class="help has-text-danger">Numeric Values Only with up to 2 decimal places</span>
                          </li>
                        </ul>
                      </div>
                      <button class="button"
                              :disabled="allowAddMissionTask"
                              @click="showAddTaskDialog=true">
                        Add Mission Task
                      </button>
                      <span v-show="allowAddMissionTask"
                            class="help has-text-danger">Mission tasks cannot be added for participants without a type</span>
                      <div class="column is-full">
                        <div class="box"
                             v-show="showAddTaskDialog">
                          <div class="field">
                            <label class="label">
                              Mission Task
                            </label>
                            <div class="control is-expanded">
                              <multiselect v-model="newFeedbackTask.task"
                                           track-by="id"
                                           placeholder="Mission Task"
                                           :options="getPlanMissionTasks"
                                           :searchable="true"
                                           openDirection="bottom"
                                           :close-on-select="true"
                                           :internal-search="false"
                                           @search-change="search('MissionTask', $event)">
                                <template class="multiselect_element"
                                          slot="beforeList">
                                  <span class="multiselect__option"
                                        @click="showAddValue('MissionTask')">
                                    <span> Add new... </span>
                                  </span>
                                  <hr class="dropdown-divider">
                                </template>
                                <template slot="singleLabel"
                                          slot-scope="props">
                                  {{ props.option.title }}
                                </template>
                                <template slot="option"
                                          slot-scope="props">
                                  {{ props.option.title }}
                                </template>
                                <template slot="noResult">
                                  No results found.
                                </template>
                              </multiselect>
                            </div>
                          </div>
                          <div class="field">
                            <label class="label">
                              Number Completed
                            </label>
                            <div class="control">
                              <form data-vv-scope="missionTask"
                                    v-on:submit.prevent>
                                <input class="input"
                                       v-validate="'required|decimal:2'"
                                       name="numberCompleted"
                                       v-model="newFeedbackTask.numberCompleted"
                                       :class="{'input': true, 'is-danger': errors.has('missionTask.numberCompleted') }" />
                                <span v-show="errors.has('missionTask.numberCompleted')"
                                      class="help has-text-danger">Numeric Values Only with up to 2 decimal places</span>
                              </form>
                            </div>
                          </div>
                          <div>
                            <button class="button is-primary"
                                    @click="validateBeforeSubmit('missionTask')">
                              Save
                            </button>
                            <button class="button"
                                    @click="showAddTaskDialog=false">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="card">
                    <div class="card-content">
                      <label class="label">
                        Qualifications
                      </label>
                      <div v-if="feedbackQualifications.length>0">
                        <ul class="menu-list">
                          <li v-for="(feedbackQualification,$index) in  feedbackQualifications"
                              :key="$index">
                            #{{$index+1}} - {{feedbackQualification.qualification.title}} -
                            <input class="input task-number-completed"
                                   v-validate="'required|decimal:2'"
                                   :name="feedbackQualification.qualification.id"
                                   v-model="feedbackQualification.numberCompleted"
                                   :class="{'input': true, 'is-danger': errors.has(`trainingObj.${feedbackQualification.qualification.id}`) }" />
                            <div class="field has-addons action-buttons">
                              <p class="control">
                                <button class="button is-small"
                                        @click="confirmDeleteFeedbackQualification(feedbackQualification.qualification.title)">
                                  <span class="icon is-small has-text-danger">
                                    <i class="fas fa-times"></i>
                                  </span>
                                </button>
                              </p>
                            </div>
                            <span v-show="errors.has(`trainingObj.${feedbackQualification.qualification.id}`)"
                                  class="help has-text-danger">Numeric Values Only with up to 2 decimal places</span>
                          </li>
                        </ul>
                      </div>
                      <button class="button"
                              @click="showAddFeedbackQualification=true">
                        Add Qualification
                      </button>
                      <div class="column is-full">
                        <div class="box"
                             v-show="showAddFeedbackQualification">
                          <div class="field">
                            <label class="label">
                              Qualification
                            </label>
                            <div class="control is-expanded">
                              <multiselect v-model="newQualification.qualification"
                                           track-by="id"
                                           placeholder="Qualification"
                                           :options="getQualifications"
                                           :searchable="true"
                                           openDirection="bottom"
                                           :close-on-select="true"
                                           :internal-search="false"
                                           @search-change="search('Qualification', $event)">
                                <template class="multiselect_element"
                                          slot="beforeList">
                                  <span class="multiselect__option"
                                        @click="showAddValue('Qualification')">
                                    <span> Add new... </span>
                                  </span>
                                  <hr class="dropdown-divider">
                                </template>
                                <template slot="singleLabel"
                                          slot-scope="props">
                                  {{ props.option.title }}
                                </template>
                                <template slot="option"
                                          slot-scope="props">
                                  {{ props.option.title }}
                                </template>
                                <template slot="noResult">
                                  No results found.
                                </template>
                              </multiselect>
                            </div>
                          </div>
                          <div class="field">
                            <label class="label">
                              Number Completed
                            </label>
                            <div class="control">
                              <form data-vv-scope="qualifications"
                                    v:on-submit.prevent>
                                <input class="input"
                                       v-validate="'required|numeric'"
                                       name="numberCompleted"
                                       v-model="newQualification.numberCompleted"
                                       :class="{'input': true, 'is-danger': errors.has('qualifications.numberCompleted') }" />
                                <span v-show="errors.has('qualifications.numberCompleted')"
                                      class="help has-text-danger">Whole Numeric Values Only</span>
                              </form>
                            </div>
                          </div>
                          <div>
                            <button class="button is-primary"
                                    @click="validateBeforeSubmit('qualifications')">
                              Save
                            </button>
                            <button class="button"
                                    @click="showAddFeedbackQualification=false">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="column is-full">
                  <div class="card">
                    <div class="card-content">
                      <div class="field">
                        <label class="label">
                          Lessons Learned
                        </label>
                        <p class="subtitle is-size-6">Do you have lessons learned to record for this day?</p>
                        <div class="buttons has-addons">
                          <a class="button"
                             @click="toggleLessonsLearned"
                             :class="{'is-success is-selected':showLessonsLearned}">
                            Yes
                          </a>
                          <a class="button"
                             @click="toggleLessonsLearned"
                             :class="{'is-danger is-selected':!showLessonsLearned}">
                            No
                          </a>
                        </div>
                      </div>
                      <div class="box lessonsLearned"
                           v-for="lesson in planFeedback.lessonsLearned"
                           :key="lesson.id">
                        <nav class="level is-pulled-right">
                          <div class="level-left">
                            <div class="level-item"></div>
                          </div>
                          <div class="level-right">
                            <div class="level-item">
                              <a class="delete has-background-danger"
                                 @click="confirmDeleteFeedback(lesson.id)"></a>
                            </div>
                          </div>
                        </nav>
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
                      <template v-if="lessonsLearned && showLessonsLearned">
                        <div class="box"
                             v-for="(lesson,$index) in lessonsLearned"
                             :key="lesson.id">
                          <nav class="level is-pulled-right">
                            <div class="level-left">
                              <div class="level-item"></div>
                            </div>
                            <div class="level-right">
                              <div class="level-item">
                                <a class="delete has-background-danger"
                                   @click="confirmDeleteLesson($index)"></a>
                              </div>
                            </div>
                          </nav>
                          <div class="columns is-multiline">
                            <div class="column is-half">
                              <div class="field"><label class="label">
                                                   Potential OPR
                                                 </label>
                                <div class="control">
                                  <input class="input"
                                         v-model="lesson.potentialOPR"
                                         placeholder="Office of Primary Responsibility" />
                                </div>
                              </div>
                            </div>
                            <div class="column is-half">
                              <div class="field"><label class="label">
                                                   Classification
                                                 </label>
                                <div class="control">
                                  <input class="input"
                                         v-model="lesson.classification"
                                         placeholder="Unclassified"
                                         disabled />
                                </div>
                              </div>
                            </div>
                            <div class="column is-full">
                              <div class="field"><label class="label">
                                                   Title
                                                 </label>
                                <div class="control">
                                  <input class="input"
                                         v-model="lesson.title"
                                         placeholder="Short, descriptive title of topic, issue, or lesson" />
                                </div>
                              </div>
                            </div>
                            <div class="column is-full">
                              <div class="field"><label class="label">
                                                   Observation
                                                 </label>
                                <div class="control">
                                  <textarea class="textarea"
                                            v-model="lesson.observation"
                                            placeholder="What is the issue? Provide a direct statement concerning the topic/issue."></textarea>
                                </div>
                              </div>
                            </div>
                            <div class="column is-full">
                              <div class="field"><label class="label">
                                                   Discussion
                                                 </label>
                                <div class="control">
                                  <textarea class="textarea"
                                            v-model="lesson.discussion"
                                            placeholder="Discuss the issue and provide a thorough and detailed explanation of the topic/issue."></textarea>
                                </div>
                              </div>
                            </div>
                            <div class="column is-full">
                              <div class="field"><label class="label">
                                                   Recommendation
                                                 </label>
                                <div class="control">
                                  <textarea class="textarea"
                                            v-model="lesson.recommendation"
                                            placeholder="Provide any recommendation to rectify or mitigate the issue, if applicable."></textarea>
                                </div>
                              </div>
                            </div>
                            <div class="column is-full">
                              <div class="field"><label class="label">
                                                   Implications
                                                 </label>
                                <div class="control">
                                  <textarea class="textarea"
                                            v-model="lesson.implications"
                                            placeholder="Provide a statement concerning your view of what the issue effects and how."></textarea>
                                </div>
                              </div>
                            </div>
                            <div class="column is-full">
                              <div class="field"><label class="label">
                                                   Event Description
                                                 </label>
                                <div class="control">
                                  <textarea class="textarea"
                                            v-model="lesson.eventDescription"
                                            placeholder="Describe the specific event(s) or situation in which the issue occurred."></textarea>
                                </div>
                              </div>
                            </div>
                            <div class="column is-full">
                              <div class="field"><label class="label">
                                                   Comments
                                                 </label>
                                <div class="control">
                                  <textarea class="textarea"
                                            v-model="lesson.comments"
                                            placeholder="Is this an item for higher HQ action?"></textarea>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="column is-narrow">
                          <div class="field">
                            <div class="control">
                              <a class="button"
                                 @click="addLessonsLearned()">
                                Add Another
                              </a>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <button class="button is-primary"
                      @click="validateBeforeSubmit('SUBMITTED')">
                Submit
              </button>
            </div>
            <div class="level-item">
              <button class="button is-primary is-outlined"
                      @click="validateBeforeSubmit('DRAFT')">
                Save Draft
              </button>
            </div>
            <div class="level-item">
              <button class="button"
                      @click="$router.go(-1)">
                Close
              </button>
            </div>
          </div>
          <div class="level-right"></div>
        </nav>
      </div>
    </div>
    <div v-else>
      <empty-state :data="planFeedback"
                   :isLoading='$apollo.loading' />
    </div>
  </div>
</template>

<script>
import { serverError } from '@/shared/serverError'
import {
  PublicPlanFeedbacksRead,
  PublicPlanFeedbacksUpdate,
  PublicPlanReasonsRead,
  PublicPlanReasonCreate,
  PublicPlanMissionTasksRead,
  PublicPlanMissionTaskCreate,
  PublicPlanQualificationsRead,
  PublicPlanQualificationCreate
} from '@/web/graphql/PlanFeedback.gql'
import PlanLessonsLearned from '@/plan/model/feedback/lessonsLearned'
import PlanMetric from '@/plan/model/feedback/planMetric'
export default {
  name: 'PublicPlanFeedbackEdit',
  props: {
    id: String
  },
  apollo: {
    planMissionTasks: {
      query: PublicPlanMissionTasksRead,
      variables() {
        return {
          where: {
            workspace: this.$route.params.workspace,
            planMissionTask: {
              participantType: {
                title: this.planFeedback.evaluation.trainingObjectives
                  .participant.participantType.title
              },
              title_contains: this.searchQuery.missionTask
            }
          }
        }
      },
      skip() {
        return !(
          this.planFeedback &&
          this.planFeedback.evaluation.trainingObjectives.participant
            .participantType
        )
      },
      update(data) {
        if (data && data.planMissionTasksPublic)
          return data.planMissionTasksPublic
      }
    },
    planReasons: {
      query: PublicPlanReasonsRead,
      variables() {
        return {
          where: {
            workspace: this.$route.params.workspace,
            planReason: {
              title_contains: this.searchQuery.reason
            }
          }
        }
      },
      update(data) {
        if (data && data.planReasonsPublic) return data.planReasonsPublic
      }
    },
    planQualifications: {
      query: PublicPlanQualificationsRead,
      variables() {
        return {
          where: {
            workspace: this.$route.params.workspace,
            planQualification: {
              title_contains: this.searchQuery.qualification
            }
          }
        }
      },
      update(data) {
        if (data && data.planQualificationsPublic)
          return data.planQualificationsPublic
      }
    },
    planFeedback: {
      query: PublicPlanFeedbacksRead,
      variables() {
        return {
          where: {
            workspace: this.$route.params.workspace,
            feedback: {
              id: this.id
            }
          }
        }
      },
      update(data) {
        this.measuresData = []
        this.feedbackQualifications = []
        this.feedbackTasks = []
        if (
          data &&
          data.planFeedbacksPublic &&
          data.planFeedbacksPublic.length > 0
        ) {
          let planFeedbackData = JSON.parse(
            JSON.stringify(data.planFeedbacksPublic[0])
          )

          this.showLessonsLearned =
            planFeedbackData.lessonsLearned > 0 &&
            planFeedbackData.lessonsLearned.length > 0

          if (planFeedbackData.metrics && planFeedbackData.metrics.id) {
            this.showAirMetrics =
              planFeedbackData.evaluation.trainingObjectives.participant
                .participantType.title === 'Air'
            this.showGroundMetrics =
              planFeedbackData.evaluation.trainingObjectives.participant
                .participantType.title === 'Ground'
            this.planFeedbackMetrics = planFeedbackData.metrics
          }
          if (planFeedbackData.evaluation.reason)
            this.planFeedbackEvaluationReason =
              planFeedbackData.evaluation.reason

          if (planFeedbackData.tasks)
            this.feedbackTasks = planFeedbackData.tasks
          if (planFeedbackData.qualifications)
            this.feedbackQualifications = planFeedbackData.qualifications
          if (
            planFeedbackData.evaluation.measureData &&
            planFeedbackData.evaluation.measureData.length > 0
          )
            this.measuresData = planFeedbackData.evaluation.measureData
          else if (
            planFeedbackData.evaluation.trainingObjectives.measures &&
            planFeedbackData.evaluation.trainingObjectives.measures.length > 0
          ) {
            planFeedbackData.evaluation.trainingObjectives.measures.forEach(
              element => {
                this.measuresData.push({ measure: element, value: '' })
              }
            )
          }
          return planFeedbackData
        }
      }
    }
  },
  data() {
    return {
      showLessonsLearned: false,
      showAirMetrics: false,
      showGroundMetrics: false,
      planFeedback: null,
      lessonsLearned: [],
      planFeedbackEvaluationReason: '',
      showAddTaskDialog: false,
      newFeedbackTask: {
        task: {},
        numberCompleted: 0
      },
      planMissionTasks: [],
      feedbackTasks: [],
      showAddFeedbackQualification: false,
      showReason: false,
      newQualification: {
        qualification: {},
        numberCompleted: 0
      },
      planQualifications: [],
      feedbackQualifications: [],
      searchQuery: {
        qualification: '',
        missionTask: '',
        reason: ''
      },
      measuresData: [],
      planFeedbackMetrics: new PlanMetric(),
      prevRoute: null
    }
  },
  methods: {
    validateBeforeSubmit(scope) {
      this.$validator.validateAll(scope).then(result => {
        if (result) {
          switch (scope) {
            case 'missionTask':
              this.addTask()
              break
            case 'qualifications':
              this.addQualification()
              break
            default:
              this.updatePlanFeedback(scope)
              break
          }
          return
        }
        this.$buefy.toast.open({
          message: 'Correct errors!',
          type: 'is-danger'
        })
      })
    },
    addLessonsLearned() {
      this.lessonsLearned.push(new PlanLessonsLearned())
    },
    toggleLessonsLearned() {
      this.showLessonsLearned = !this.showLessonsLearned
      this.lessonsLearned.push(new PlanLessonsLearned())
    },
    toggleAirMetricsSection() {
      this.showAirMetrics = !this.showAirMetrics
      if (this.showAirMetrics && !this.planFeedbackMetrics) {
        this.planFeedbackMetrics = new PlanMetric()
      }
    },
    toggleGroundMetricsSection() {
      this.showGroundMetrics = !this.showGroundMetrics
      if (this.showGroundMetrics && !this.planFeedbackMetrics) {
        this.planFeedbackMetrics = new PlanMetric()
      }
    },
    updateEffectiveness(value) {
      this.planFeedback.evaluation.status = value
    },
    updateCompleteness(value) {
      this.planFeedback.evaluation.complete = value
    },
    confirmDeleteLesson(index) {
      this.$buefy.dialog.confirm({
        title: 'Delete Feedback Lesson',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.updateLessonsList(index)
      })
    },
    updateLessonsList(indexToDelete) {
      this.lessonsLearned.splice(indexToDelete, 1)
    },
    getMeasuresData() {
      // Measures Data
      let planMeasuresData
      if (
        this.planFeedback.evaluation.measureData &&
        this.planFeedback.evaluation.measureData.length > 0
      ) {
        //update
        let updateData = []
        if (this.planFeedback.evaluation.complete) {
          this.measuresData.forEach(element => {
            updateData.push({
              where: { id: element.id },
              data: {
                measure: {
                  connect: { id: element.measure.id }
                },
                value: element.value
              }
            })
          })
          planMeasuresData = {
            update: updateData
          }
        } else {
          // delete existing data
          this.measuresData.forEach(element => {
            updateData.push({
              id: element.id
            })
          })
          planMeasuresData = {
            delete: updateData
          }
        }
      } else {
        //create
        if (this.planFeedback.evaluation.complete) {
          let createData = []
          this.measuresData.forEach(element => {
            createData.push({
              measure: {
                connect: { id: element.measure.id }
              },
              value: element.value
            })
          })
          planMeasuresData = {
            create: createData
          }
        }
      }
      return planMeasuresData
    },
    getReasonsData() {
      let planReason
      if (
        this.planFeedback.evaluation.complete &&
        this.planFeedback.evaluation.status === 'TRAINED'
      ) {
        // For reports - if an assessment is Complete and Trained it should not contain a reason in db as well
        if (
          this.planFeedback.evaluation.reason &&
          this.planFeedback.evaluation.reason.id
        ) {
          planReason = {
            disconnect: true
          }
        }
      } else {
        if (this.planFeedbackEvaluationReason) {
          planReason = {
            connect: {
              id: this.planFeedbackEvaluationReason.id
            }
          }
        }
      }
      return planReason
    },
    getDisconnectIds(existsIn, notExistsIn) {
      let tempArr = existsIn.filter(obj => {
        return !notExistsIn.some(obj2 => obj.id == obj2.id)
      })
      return tempArr.map(x => {
        return { id: x.id }
      })
    },
    updatePlanFeedback(status) {
      if (this.planFeedback.id) {
        let data = { status: status }
        let evaluation
        let lessonsLearned
        let metrics
        if (this.planFeedback.evaluation && this.planFeedback.evaluation.id) {
          evaluation = {
            complete: this.planFeedback.evaluation.complete,
            comment: this.planFeedback.evaluation.comment,
            status: this.planFeedback.evaluation.status,
            remark: this.planFeedback.evaluation.remark
          }
          // Reasons
          let planReason = this.getReasonsData()
          if (planReason) {
            evaluation = {
              ...evaluation,
              reason: planReason
            }
          }
          //Measures Data
          let planMeasuresData = this.getMeasuresData()
          if (planMeasuresData)
            evaluation = {
              ...evaluation,
              measureData: planMeasuresData
            }
        }
        data = {
          ...data,
          evaluation: { update: { ...evaluation } }
        }
        // metrics create vs update
        if (this.showAirMetrics || this.showGroundMetrics) {
          let metricsData = {
            flightHours: parseInt(this.planFeedbackMetrics.flightHours),
            numOfStories: parseInt(this.planFeedbackMetrics.numOfStories),
            numOfPassesngers: parseInt(
              this.planFeedbackMetrics.numOfPassesngers
            ),
            cargoWeight: parseFloat(this.planFeedbackMetrics.cargoWeight),
            fuelPassed: parseFloat(this.planFeedbackMetrics.fuelPassed),
            milesTraveled: parseFloat(this.planFeedbackMetrics.milesTraveled),
            gallonsGasUsed: parseFloat(this.planFeedbackMetrics.gallonsGasUsed)
          }
          if (this.planFeedback.metrics && this.planFeedback.metrics.id) {
            // update
            metrics = { update: { ...metricsData } }
          } else {
            metrics = { create: { ...metricsData } }
          }
        } else {
          //delete
          if (this.planFeedback.metrics && this.planFeedback.metrics.id) {
            metrics = { delete: { id: this.planFeedback.metrics.id } }
          }
        }
        if (metrics)
          data = {
            ...data,
            metrics: metrics
          }
        // Lessons learned
        if (this.lessonsLearned && this.showLessonsLearned == true) {
          lessonsLearned = this.lessonsLearned
          data = {
            ...data,
            lessonsLearned: {
              create: [...lessonsLearned]
            }
          }
        }
        // Feedback Mission tasks
        let missionTasksData = this.getMissionTasksData()
        data = {
          ...data,
          tasks: {
            create: missionTasksData.createIds,
            delete: missionTasksData.deleteIds,
            update: missionTasksData.updateIds
          }
        }
        // Qualifications
        let qualificationsData = this.getQualificationsData()
        data = {
          ...data,
          qualifications: {
            create: qualificationsData.createIds,
            delete: qualificationsData.deleteIds,
            update: qualificationsData.updateIds
          }
        }

        // Update
        this.$apollo
          .mutate({
            mutation: PublicPlanFeedbacksUpdate,
            variables: {
              data: {
                feedback: data,
                where: {
                  id: this.planFeedback.id
                },
                workspace: this.$route.params.workspace
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            if (status == 'DRAFT' && this.prevRoute && this.prevRoute.name) {
              this.$router.go(-1)
            } else this.$apollo.queries.planFeedback.refetch()
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
          })
      }
    },
    confirmDeleteFeedback(lesson) {
      this.$buefy.dialog.confirm({
        title: 'Delete Feedback',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteFeedbackLesson(lesson)
      })
    },
    deleteFeedbackLesson(lesson) {
      this.$apollo
        .mutate({
          mutation: PublicPlanFeedbacksUpdate,
          variables: {
            data: {
              feedback: {
                lessonsLearned: {
                  delete: {
                    id: lesson
                  }
                }
              },
              where: {
                id: this.planFeedback.id
              },
              workspace: this.$route.params.workspace
            }
          }
        })
        .then(() => {
          if (this.planFeedback.lessonsLearned.length <= 0) {
            this.showLessonsLearned = false
          }
          this.$apollo.queries.planFeedback.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Inject updated: ' + error)
        })
    },
    addTask() {
      // Update tasks list
      if (
        this.newFeedbackTask.task &&
        this.newFeedbackTask.task.title.length > 0
      ) {
        this.feedbackTasks.push(this.newFeedbackTask)
        this.newFeedbackTask = {
          task: {},
          numberCompleted: parseFloat(0)
        }
        this.showAddTaskDialog = false
      }
    },
    confirmDeleteFeedbackTask(taskTitle) {
      this.$buefy.dialog.confirm({
        title: 'Delete Feedback Task',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () =>
          (this.feedbackTasks = this.feedbackTasks.filter(
            item => item.task.title !== taskTitle
          ))
      })
    },
    addQualification() {
      if (
        this.newQualification.qualification &&
        this.newQualification.qualification.title.length > 0
      ) {
        this.feedbackQualifications.push(this.newQualification)
        this.newQualification = {
          qualification: {},
          numberCompleted: parseInt(0)
        }
        this.showAddFeedbackQualification = false
      }
    },
    confirmDeleteFeedbackQualification(title) {
      this.$buefy.dialog.confirm({
        title: 'Delete Feedback Qualification',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () =>
          (this.feedbackQualifications = this.feedbackQualifications.filter(
            item => item.qualification.title !== title
          ))
      })
    },
    showAddValue(name) {
      let msg
      switch (name) {
        case 'Reason':
          msg = 'Ineffective Reason'
          break
        case 'Qualification':
          msg = 'Qualification'
          break
        case 'MissionTask':
          msg = 'Mission Task'
          break
      }
      this.$buefy.dialog.prompt({
        message: msg,
        inputAttrs: {
          placeholder: '',
          maxlength: 75
        },
        confirmText: 'Add',
        onConfirm: value => this.addValueToDB(name, value)
      })
    },
    addValueToDB(name, value) {
      let createQuery
      let data
      switch (name) {
        case 'Reason': {
          createQuery = PublicPlanReasonCreate
          data = {
            workspace: this.$route.params.workspace,
            planReason: {
              title: value
            }
          }
          break
        }
        case 'Qualification': {
          createQuery = PublicPlanQualificationCreate
          data = {
            workspace: this.$route.params.workspace,
            planQualification: {
              title: value
            }
          }
          break
        }
        case 'MissionTask': {
          createQuery = PublicPlanMissionTaskCreate
          data = {
            workspace: this.$route.params.workspace,
            planMissionTask: {
              title: value,
              participantType: {
                connect: {
                  title: this.planFeedback.evaluation.trainingObjectives
                    .participant.participantType.title
                }
              }
            }
          }
          break
        }
      }
      if (createQuery && data)
        this.$apollo
          .mutate({
            mutation: createQuery,
            variables: {
              data: data
            }
          })
          .then(response => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            switch (name) {
              case 'Reason': {
                this.planFeedbackEvaluationReason =
                  response.data.createPlanReasonPublic
                this.$apollo.queries.planReasons.refetch()
                break
              }
              case 'Qualification': {
                this.newQualification.qualification =
                  response.data.createPlanQualificationPublic
                this.$apollo.queries.planQualifications.refetch()
                break
              }
              case 'MissionTask': {
                this.newFeedbackTask.task =
                  response.data.createPlanMissionTaskPublic
                this.$apollo.queries.planMissionTasks.refetch()
                break
              }
            }
          })
    },
    search(table, term) {
      switch (table) {
        case 'Reason':
          this.searchQuery.reason = term
          break
        case 'Qualification':
          this.searchQuery.qualification = term
          break
        case 'MissionTask':
          this.searchQuery.missionTask = term
          break
      }
    },
    getQualificationsData() {
      // Feedback Qualifications
      let qualificationsData = {
        deleteIds: [],
        createIds: [],
        updateIds: []
      }
      if (
        this.planFeedback.qualifications &&
        this.planFeedback.qualifications.length > 0
      ) {
        qualificationsData.deleteIds = this.getDisconnectIds(
          this.planFeedback.qualifications,
          this.feedbackQualifications
        )
      }
      for (let i = 0; i < this.feedbackQualifications.length; i++) {
        if ('id' in this.feedbackQualifications[i])
          qualificationsData.updateIds.push({
            data: {
              numberCompleted: parseInt(
                this.feedbackQualifications[i].numberCompleted
              )
            },
            where: {
              id: this.feedbackQualifications[i].id
            }
          })
        else
          qualificationsData.createIds.push({
            numberCompleted: parseInt(
              this.feedbackQualifications[i].numberCompleted
            ),
            qualification: {
              connect: {
                title: this.feedbackQualifications[i].qualification.title
              }
            }
          })
      }
      return qualificationsData
    },
    getMissionTasksData() {
      let tasksData = {
        deleteIds: [],
        createIds: [],
        updateIds: []
      }
      if (this.planFeedback.tasks && this.planFeedback.tasks.length > 0) {
        tasksData.deleteIds = this.getDisconnectIds(
          this.planFeedback.tasks,
          this.feedbackTasks
        )
      }
      for (let i = 0; i < this.feedbackTasks.length; i++) {
        if ('id' in this.feedbackTasks[i])
          tasksData.updateIds.push({
            data: {
              numberCompleted: parseFloat(this.feedbackTasks[i].numberCompleted)
            },
            where: {
              id: this.feedbackTasks[i].id
            }
          })
        else
          tasksData.createIds.push({
            numberCompleted: parseFloat(this.feedbackTasks[i].numberCompleted),
            task: {
              connect: { title: this.feedbackTasks[i].task.title }
            }
          })
      }
      return tasksData
    }
  },
  computed: {
    showReasons() {
      return (
        !this.planFeedback.evaluation.complete ||
        this.planFeedback.evaluation.status === 'UNTRAINED' ||
        this.planFeedback.evaluation.status === 'PARTIALLY'
      )
    },
    showMeasures() {
      return (
        this.planFeedback.evaluation.trainingObjectives &&
        this.planFeedback.evaluation.complete &&
        this.planFeedback.evaluation.trainingObjectives.measures &&
        this.planFeedback.evaluation.trainingObjectives.measures.length > 0
      )
    },
    getPlanMissionTasks() {
      // Only show options not already added
      let tempArr = this.planMissionTasks.filter(obj => {
        return !this.feedbackTasks.some(obj2 => obj.id == obj2.task.id)
      })
      return tempArr
    },
    getQualifications() {
      // Only show options not already added
      let tempArr = this.planQualifications.filter(obj => {
        return !this.feedbackQualifications.some(
          obj2 => obj.id == obj2.qualification.id
        )
      })
      return tempArr
    },
    allowAddMissionTask() {
      return !(
        this.planFeedback &&
        this.planFeedback.evaluation.trainingObjectives.participant
          .participantType
      )
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  }
}
</script>

<style lang="scss" scoped>
pre.content {
  white-space: pre-line;
}
p.control,
.lessonsLearned p.subtitle {
  text-indent: 10px;
  & > ul {
    text-indent: 25px;
  }
}
.action-buttons {
  display: inline;
  & p {
    display: inline;
  }
}
.task-number-completed {
  width: auto;
  vertical-align: middle;
}
</style>
