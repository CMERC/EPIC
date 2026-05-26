<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="planParticipant ? planParticipant.name : ''" />
    <div class="columns"
         v-if="currentTrainingObj && planParticipant && planParticipant.id != null">
      <div class="column is-narrow side-objective">
        <b-collapse class="card"
                    :open="true"
                    v-if="planParticipant">
          <div slot="trigger"
               class="card-header">
            <p class="card-header-title"> Exercise Details </p>
          </div>
          <div class="card-content"
               v-if="planExerciseObjectives">
            <div v-for="objective in planExerciseObjectives"
                 :key="objective.id">
              <div class="columns">
                <div class="column side-objective">
                  <b-collapse class="panel"
                              :open="false">
                    <div slot="trigger"
                         class="panel-heading">
                      <label class="label tooltip"
                             :data-tooltip="objective.title">
                        <span>{{objective.title | truncate(25)}}</span>
                        <span class="icon is-small"><i class="fas fa-angle-down"></i></span>
                      </label>
                    </div>
                    <div class="panel-block">
                      <div class="content">
                        <div class="columns is-mobile is-multiline">
                          <div class="column is-full-desktop is-full-tablet is-full-mobile">
                            <label class="label">
                              Objective:
                            </label>
                            <p class="subtitle is-6">{{objective.exerciseObjective}}</p>
                          </div>
                          <div class="column is-full-desktop is-full-tablet is-full-mobile">
                            <label class="label">
                              Measure of Performance:
                            </label>
                            <p class="subtitle is-6">{{objective.measurePerformance}}</p>
                          </div>
                          <div class="column is-full-desktop is-full-tablet is-full-mobile">
                            <label class="label">
                              Measure of Effectiveness::
                            </label>
                            <p class="subtitle is-6">{{objective.measureEffectiveness}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </b-collapse>
                </div>
              </div>
            </div>
          </div>
          <div v-else
               class="card-content">
            <div class="panel-heading">
              <strong>No Objectives</strong>
            </div>
          </div>
        </b-collapse>
      </div>
      <div class="column">
        <stepper v-model="stepIndex"
                 @previousStep="checkPrevious"
                 @steps-completed="onStepsCompleted">
          <stepper-item label="Details"
                        :classList="{'is-danger':getError('details'), 'is-success': !getError('details'),  'is-completed':isVisited('details')}">

            <nav class="level">
              <div class="level-left">
                <div class="level-item is-inline-block">
                  <h3 class="title">
                    {{planParticipant.name}} Training Objective
                  </h3>
                  <span class="subtitle">{{currentTrainingObj.platform && currentTrainingObj.platform.platform? `${currentTrainingObj.platform.platform.title} : ${currentTrainingObj.platform.platform.type}`:''}}</span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <help-content :reference="'plan.trainingobjectivesdetails'"
                                toggle
                                dropdown />
                </div>
              </div>
            </nav>

            <div class="card">
              <div class="card-content">
                <form data-vv-scope="details"
                      v-on:submit.prevent>
                  <div class="columns is-multiline">
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Platform
                        </label>
                        <multiselect v-model="currentTrainingObj.platform"
                                     track-by="id"
                                     placeholder="Select Platform"
                                     :options="planParticipant.platforms"
                                     :name="'platform'"
                                     v-validate.immediate="'required'"
                                     :class="{'input': errors.has('details.platform'), 'is-danger': errors.has('details.platform') }">
                          <template slot="singleLabel"
                                    slot-scope="{ option }">
                            <span v-if="option.platform">{{ option.platform.title }} : {{ option.platform.type }}</span>
                          </template>
                          <template slot="option"
                                    slot-scope="{ option }">
                            <span v-if="option.platform">{{ option.platform.title }} : {{ option.platform.type }}</span>
                          </template>
                        </multiselect>
                        <span v-show="errors.has('details.platform')"
                              class="help is-danger">Platform Required</span>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field"
                           v-if="planJmets">
                        <label class="label">
                          JMET ID/Description
                        </label>
                        <multiselect v-model="jmet"
                                     track-by="id"
                                     placeholder="Select JMET"
                                     :options="planJmets"
                                     :name="'jmet'"
                                     v-validate.immediate="'required'"
                                     openDirection="bottom"
                                     :class="{'input': errors.has('details.jmet'), 'is-danger': errors.has('details.jmet') }"
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
                                    slot="beforeList">
                            <span class="multiselect__option"
                                  @click="openCreateJmet()">
                              <span> Add new... </span>
                            </span>
                            <hr class="dropdown-divider">
                          </template>
                          <template class="multiselect_element"
                                    slot="afterList">
                            <div v-show="planJmetsCounts > 74"
                                 class="afterList">
                              <hr class="dropdown-divider">
                              <span class="multiselect__option"
                                    @click="toggleList(true)"
                                    v-if="planJmets.length > 74 && showAll == false">
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
                        <span v-show="errors.has('details.jmet')"
                              class="help is-danger">JMET Value Required</span>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="columns">
                        <div class="column is-one-third">
                          <div class="field">
                            <label class="label">
                              Requested Method
                            </label>
                            <multiselect v-model="requestedMethodType"
                                         track-by="id"
                                         label="title"
                                         placeholder="Select Method"
                                         :options="planRequestedMethodTypes">
                              <template slot="singleLabel"
                                        slot-scope="{ option }">
                                {{ option.title }}
                              </template>
                              <template slot="option"
                                        slot-scope="{ option }">
                                {{ option.title }}
                              </template>
                            </multiselect>
                          </div>
                        </div>
                        <div class="column is-one-third">
                          <div class="field">
                            <label class="label">
                              Training Priority
                            </label>
                            <multiselect v-model="priorityLevel"
                                         track-by="id"
                                         label="title"
                                         placeholder="Select Priority"
                                         :options="planPriorityLevels">
                              <template slot="singleLabel"
                                        slot-scope="{ option }">
                                <span class="tag"
                                      :style="'background-color:'+option.color"
                                      :class="lightOrDark(option.color)">
                                  {{ option.title}}
                                </span>
                              </template>
                              <template slot="option"
                                        slot-scope="{ option }">
                                <span class="tag"
                                      :style="'background-color:'+option.color"
                                      :class="lightOrDark(option.color)">
                                  {{ option.title}}
                                </span></template>
                            </multiselect>
                          </div>
                        </div>
                        <div class="column is-one-third">
                          <div class="field">
                            <label class="label">
                              Required Runs
                            </label>
                            <div class="control">
                              <input class="input"
                                     v-model="currentTrainingObj.requiredRuns"
                                     type="text"
                                     placeholder="1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="columns">
                        <div class="column is-two-fifths">
                          <div class="field">
                            <label class="label">
                              Classification
                            </label>
                            <div class="control is-expanded">
                              <div class="control">
                                <input class="input"
                                       v-model="currentTrainingObj.classification"
                                       type="text"
                                       placeholder="Classification"
                                       readonly />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </stepper-item>
          <stepper-item label="Performance"
                        :classList="{'is-danger':getError('performance'), 'is-success': !getError('performance'),  'is-completed':isVisited('performance')}">

            <nav class="level">
              <div class="level-left">
                <div class="level-item is-inline-block">
                  <h3 class="title">
                    {{planParticipant.name}} Training Objective Performance
                  </h3>
                  <span class="subtitle">{{currentTrainingObj.platform && currentTrainingObj.platform.platform? `${currentTrainingObj.platform.platform.title} : ${currentTrainingObj.platform.platform.type}`:''}}</span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <help-content :reference="'plan.trainingobjectivesmeasure'"
                                toggle
                                dropdown />
                </div>
              </div>
            </nav>

            <div class="card">
              <div class="card-content">
                <form data-vv-scope="performance"
                      v-on:submit.prevent>
                  <div class="columns is-multiline">
                    <div class="column is-full">
                      <div class="field">
                        <p class="title is-5">Task</p>
                        <p class="subtitle is-7">The Task (Performance Objective) defines what needs to be accomplished to complete the training objective.</p>
                        <div class="control">
                          <textarea class="textarea"
                                    v-model="currentTrainingObj.task"
                                    type="text"
                                    placeholder="Performance Objective"></textarea>
                        </div>
                      </div>
                    </div>

                    <div class="column is-full">
                      <div class="field">
                        <p class="title is-5">Condition</p>
                        <p class="subtitle is-7">The Condition (Training Situation) directly affects the ability to perform a task and challenges the training audience when completing a JMET.</p>
                        <div class="control">
                          <textarea class="textarea"
                                    v-model="currentTrainingObj.condition"
                                    type="text"
                                    placeholder="Training Situation"></textarea>
                        </div>
                      </div>
                    </div>

                    <div class="column is-full">
                      <div class="field">
                        <p class="title is-5">Standard</p>
                        <p class="subtitle is-7">The Standard (Level of Performance) is the meter of success and can be measured by the amount of days, hours, percentages, overall effectiveness, etc.</p>
                        <div class="control">
                          <textarea class="textarea"
                                    v-model="currentTrainingObj.standard"
                                    type="text"
                                    placeholder="Level of Performance"></textarea>
                        </div>
                      </div>
                    </div>

                    <div class="column is-full">
                      <div class="field">
                        <p class="title is-5">Measures</p>
                        <template v-if="selectedMeasures">
                          <div v-for="(measure,$index) in selectedMeasures"
                               :key="$index">
                            <div class="field has-addons">
                              <label class="label">
                                M{{$index+1}}
                              </label>
                              <p class="control is-expanded">
                                <input class="input"
                                       v-model="measure.title"
                                       placeholder="Title" />
                              </p>
                              <p class="control">
                                <a class="delete has-background-danger"
                                   @click="confirmDeleteMeasure($index)"></a>
                              </p>
                            </div>
                          </div>
                        </template>
                        <div class="column is-narrow">
                          <div class="field">
                            <div class="control">
                              <a class="button"
                                 @click="addMeasure()">
                                Add Measure
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </stepper-item>
          <stepper-item label="Associations"
                        :classList="{'is-danger':getError('associations'), 'is-success':!getError('associations'),  'is-completed':isVisited('associations')}">

            <nav class="level">
              <div class="level-left">
                <div class="level-item is-inline-block">
                  <h3 class="title">
                    {{planParticipant.name}} Training Objective Associations
                  </h3>
                  <span class="subtitle">{{currentTrainingObj.platform && currentTrainingObj.platform.platform? `${currentTrainingObj.platform.platform.title} : ${currentTrainingObj.platform.platform.type}`:''}}</span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <help-content :reference="'plan.trainingobjectivesassociations'"
                                toggle
                                dropdown />
                </div>
              </div>
            </nav>

            <div class="card">
              <div class="card-content">
                <form data-vv-scope="associations"
                      v-on:submit.prevent>
                  <div class="columns is-multiline">
                    <div class="column is-full">
                      <div class="card card-section">
                        <div class="card-header">
                          <p class="card-header-title">
                            Exercise Objectives Selected: {{selectedExerciseObjectives ? selectedExerciseObjectives.length : 0}}
                          </p>
                        </div>
                        <div v-if="planExerciseObjectives && planExerciseObjectives.length > 0">
                          <div class="level-right">
                            <div class="level-item">
                              <div class="select">
                                <select v-model.number="perPage">
                                  <option value="5">
                                    5 per page
                                  </option>
                                  <option value="15">
                                    15 per page
                                  </option>
                                  <option value="30">
                                    30 per page
                                  </option>
                                  <option value="60">
                                    60 per page
                                  </option>
                                  <option value="120">
                                    120 per page
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <section>
                            <b-table :data="planExerciseObjectives"
                                     paginated
                                     :per-page="perPage"
                                     :current-page.sync="currentPage"
                                     :pagination-simple="isPaginationSimple"
                                     :default-sort-direction="defaultSortDirection"
                                     checkable
                                     detailed
                                     detail-key="id"
                                     default-sort="title"
                                     :custom-is-checked="((a, b) => a.id === b.id)" 
                                     :checked-rows.sync="selectedExerciseObjectives">
                              <template slot-scope="props">
                                <b-table-column field="title"
                                                label="Title"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.title ? props.row.title : "None" }}
                                </b-table-column>
                              </template>
                              <template slot="detail"
                                        slot-scope="props">
                                <article class="media">
                                  <div class="media-content">
                                    <div class="content">
                                      <div class="columns is-multiline is-mobile">
                                        <div class="column is-full">
                                          <label class="label">
                                            Objective
                                          </label>
                                          <p class="subtitle is-6">{{props.row.exerciseObjective ? props.row.exerciseObjective : "None"}}</p>
                                        </div>
                                        <div class="column is-full">
                                          <label class="label">
                                            Measure of Performance
                                          </label>
                                          <p class="subtitle is-6">{{props.row.measurePerformance ? props.row.measurePerformance : "None"}}</p>
                                        </div>
                                        <div class="column is-full">
                                          <label class="label">
                                            Measure of Effectiveness
                                          </label>
                                          <p class="subtitle is-6">{{props.row.measureEffectiveness ? props.row.measureEffectiveness : "None"}}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </article>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="no-result apollo ">
                          <div class="content">
                            <figure>
                              <div class="card-content">
                                <div class="card-header-title is-centered">
                                  <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                                </div>
                                <p class="title has-text-centered">
                                  No Exercise Objectives
                                </p>
                              </div>
                            </figure>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="card card-section">
                        <div class="card-header">
                          <p class="card-header-title">
                            Accredited Tasks Selected: {{selectedAccreditedTasks ? selectedAccreditedTasks.length : 0}}
                          </p>
                        </div>
                        <div v-if="planAccreditedTasks && planAccreditedTasks.length > 0">
                          <div class="level-right">
                            <div class="level-item">
                              <div class="select">
                                <select v-model.number="perPage">
                                  <option value="5">
                                    5 per page
                                  </option>
                                  <option value="15">
                                    15 per page
                                  </option>
                                  <option value="30">
                                    30 per page
                                  </option>
                                  <option value="60">
                                    60 per page
                                  </option>
                                  <option value="120">
                                    120 per page
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <section>
                            <b-table :data="planAccreditedTasks"
                                     paginated
                                     :per-page="perPage"
                                     :current-page.sync="currentPage"
                                     :pagination-simple="isPaginationSimple"
                                     :default-sort-direction="defaultSortDirection"
                                     checkable
                                     default-sort="jmet.levelWar"
                                     :custom-is-checked="((a, b) => a.id === b.id)"
                                     :checked-rows.sync="selectedAccreditedTasks">
                              <template slot-scope="props">
                                <b-table-column field="jmet.levelWar"
                                                label="Level of War"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.jmet.levelWar }}
                                </b-table-column>
                                <b-table-column field="jmet.taskNumber"
                                                label="Task Number"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.jmet.taskNumber }}
                                </b-table-column>
                                <b-table-column field="jmet.taskTitle"
                                                label="Task Title"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.jmet.taskTitle }}
                                </b-table-column>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="no-result apollo ">
                          <div class="content">
                            <figure>
                              <div class="card-content">
                                <div class="card-header-title is-centered">
                                  <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                                </div>
                                <p class="title has-text-centered">
                                  No Accredited Tasks
                                </p>
                              </div>
                            </figure>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="card card-section">
                        <div class="card-header">
                          <p class="card-header-title">
                            Command Training Priorities Selected: {{selectedCommandTrainingPriorities ? selectedCommandTrainingPriorities.length : 0}}
                          </p>
                        </div>
                        <div v-if="planCommandPriorities && planCommandPriorities.length > 0">
                          <div class="level-right">
                            <div class="level-item">
                              <div class="select">
                                <select v-model.number="perPage">
                                  <option value="5">
                                    5 per page
                                  </option>
                                  <option value="15">
                                    15 per page
                                  </option>
                                  <option value="30">
                                    30 per page
                                  </option>
                                  <option value="60">
                                    60 per page
                                  </option>
                                  <option value="120">
                                    120 per page
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <section>
                            <b-table :data="planCommandPriorities"
                                     paginated
                                     :per-page="perPage"
                                     :current-page.sync="currentPage"
                                     :pagination-simple="isPaginationSimple"
                                     :default-sort-direction="defaultSortDirection"
                                     checkable
                                     detailed
                                     detail-key="id"
                                     default-sort="title"
                                     :custom-is-checked="((a, b) => a.id === b.id)" 
                                     :checked-rows.sync="selectedCommandTrainingPriorities">
                              <template slot-scope="props">
                                <b-table-column field="title"
                                                label="Title"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.title ? props.row.title : "None" }}
                                </b-table-column>
                              </template>
                              <template slot="detail"
                                        slot-scope="props">
                                <article class="media">
                                  <div class="media-content">
                                    <div class="content">
                                      <div class="columns is-multiline is-mobile">
                                        <div class="column is-full">
                                          <label class="label">
                                            Description
                                          </label>
                                          <p class="subtitle is-6">{{props.row.description ? props.row.description : "None"}}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </article>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="no-result apollo ">
                          <div class="content">
                            <figure>
                              <div class="card-content">
                                <div class="card-header-title is-centered">
                                  <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                                </div>
                                <p class="title has-text-centered">
                                  No Command Training Priorities
                                </p>
                              </div>
                            </figure>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="card card-section">
                        <div class="card-header">
                          <p class="card-header-title">
                            Joint Staff Training Priorities Selected: {{selectedJointStaffPriorities ? selectedJointStaffPriorities.length : 0}}
                          </p>
                        </div>
                        <div v-if="planJointStaffTrainingPriorities && planJointStaffTrainingPriorities.length > 0">
                          <div class="level-right">
                            <div class="level-item">
                              <div class="select">
                                <select v-model.number="perPage">
                                  <option value="5">
                                    5 per page
                                  </option>
                                  <option value="15">
                                    15 per page
                                  </option>
                                  <option value="30">
                                    30 per page
                                  </option>
                                  <option value="60">
                                    60 per page
                                  </option>
                                  <option value="120">
                                    120 per page
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <section>
                            <b-table :data="planJointStaffTrainingPriorities"
                                     paginated
                                     :per-page="perPage"
                                     :current-page.sync="currentPage"
                                     :pagination-simple="isPaginationSimple"
                                     :default-sort-direction="defaultSortDirection"
                                     checkable
                                     detailed
                                     detail-key="id"
                                     default-sort="title"
                                     :custom-is-checked="((a, b) => a.id === b.id)" 
                                     :checked-rows.sync="selectedJointStaffPriorities">
                              <template slot-scope="props">
                                <b-table-column field="title"
                                                label="Title"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.title ? props.row.title : "None" }}
                                </b-table-column>
                              </template>
                              <template slot="detail"
                                        slot-scope="props">
                                <article class="media">
                                  <div class="media-content">
                                    <div class="content">
                                      <div class="columns is-multiline is-mobile">
                                        <div class="column is-full">
                                          <label class="label">
                                            Title
                                          </label>
                                          <p class="subtitle is-6">{{props.row.title ? props.row.title : "None"}}</p>
                                        </div>
                                        <div class="column is-full">
                                          <label class="label">
                                            Description
                                          </label>
                                          <p class="subtitle is-6">{{props.row.description ? props.row.description : "None"}}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </article>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="no-result apollo">
                          <div class="content">
                            <figure>
                              <div class="card-content">
                                <div class="card-header-title is-centered">
                                  <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                                </div>
                                <p class="title has-text-centered">
                                  No Joint Staff Training Priorities
                                </p>
                              </div>
                            </figure>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </stepper-item>
          <stepper-item label="Review"
                        icon="fas fa-check">

            <nav class="level">
              <div class="level-left">
                <div class="level-item is-inline-block">
                  <h3 class="title">
                    {{planParticipant.name}} Review Training Objective
                  </h3>
                  <span class="subtitle">{{currentTrainingObj.platform && currentTrainingObj.platform.platform? `${currentTrainingObj.platform.platform.title} : ${currentTrainingObj.platform.platform.type}`:''}}</span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <help-content :reference="'plan.trainingobjectivesreview'"
                                toggle
                                dropdown />
                </div>
              </div>
            </nav>
            <div class="card">
              <div class="card-content">
                <div class="columns is-multiline">
                  <div class="column is-full">
                    <label class="label is-size-4">
                      Details
                    </label>
                    <div class="columns is-multiline">
                      <div class="column is-half">
                        <div class="field">
                          <label class="label">
                            Platform Type
                          </label>
                          <p class="control">{{currentTrainingObj.platform && currentTrainingObj.platform.platform ? currentTrainingObj.platform.platform.title +': ' + currentTrainingObj.platform.platform.type : "None"}}</p>
                        </div>
                      </div>
                      <div class="column is-half">
                        <div class="field">
                          <label class="label">
                            JMET ID/Name
                          </label>
                          <p class="control">{{this.jmet ? this.jmet.description : "None"}}</p>
                        </div>
                      </div>
                      <div class="column is-one-quarter">
                        <div class="field">
                          <label class="label">
                            Requested Method
                          </label>
                          <p class="control">{{currentTrainingObj.requestedMethodType ? currentTrainingObj.requestedMethodType.title : "None"}}</p>
                        </div>
                      </div>
                      <div class="column is-one-quarter">
                        <div class="field">
                          <label class="label">
                            Training Priority
                          </label>
                          <p class="control">{{currentTrainingObj.priorityLevel ? currentTrainingObj.priorityLevel.title : "None"}}</p>
                        </div>
                      </div>
                      <div class="column is-one-quarter">
                        <div class="field">
                          <label class="label">
                            Required Runs
                          </label>
                          <p class="control">{{currentTrainingObj.requiredRuns ? currentTrainingObj.requiredRuns : "None"}}</p>
                        </div>
                      </div>
                      <div class="column is-one-quarter">
                        <div class="field">
                          <label class="label">
                            Classification
                          </label>
                          <p class="control">{{currentTrainingObj.classification}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="columns is-multiline">
                  <div class="column is-full">
                    <label class="label is-size-4">
                      Performance
                    </label>
                    <div class="columns">
                      <div class="column is-full">
                        <div class="field">
                          <label class="label">
                            Task
                          </label>
                          <p class="control">{{currentTrainingObj.task ? currentTrainingObj.task : "None"}}</p>
                        </div>
                        <div class="field">
                          <label class="label">
                            Condition
                          </label>
                          <p class="control">{{currentTrainingObj.condition ? currentTrainingObj.condition : "None"}}</p>
                        </div>
                        <div class="field">
                          <label class="label">
                            Standard
                          </label>
                          <p class="control">{{currentTrainingObj.standard ? currentTrainingObj.standard : "None"}}</p>
                        </div>
                        <div class="field">
                          <label class="label">
                            Measures
                          </label>
                          <div v-for="(measure,$index) in selectedMeasures"
                               :key="$index">
                            <p class="control">
                              M{{$index+1}} - {{measure.title}}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="columns is-multline">
                  <div class="column is-full">
                    <label class="label is-size-4">
                      Associations
                    </label>
                    <div class="columns">
                      <div class="column is-full">
                        <label class="label is-size-5">
                          Exercise Objectives
                        </label>
                        <div v-if="selectedExerciseObjectives.length > 0">
                          <section>
                            <b-table :data="selectedExerciseObjectives">
                              <template slot-scope="props">
                                <b-table-column field="title"
                                                label="Title"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.title ? props.row.title : "None" }}
                                </b-table-column>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="column is-full">
                          <div class="content has-text-black has-text-centered">
                            <p>No Exercise Objectives</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-full">
                        <label class="label is-size-5">
                          Accredited Task
                        </label>
                        <div v-if="selectedAccreditedTasks.length > 0">
                          <section>
                            <b-table :data="selectedAccreditedTasks">
                              <template slot-scope="props">
                                <b-table-column field="jmet.levelWar"
                                                label="Level of War"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.jmet.levelWar }}
                                </b-table-column>
                                <b-table-column field="jmet.taskNumber"
                                                label="Task Number"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.jmet.taskNumber }}
                                </b-table-column>
                                <b-table-column field="jmet.taskTitle"
                                                label="Task Title"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.jmet.taskTitle }}
                                </b-table-column>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="column is-full">
                          <div class="content has-text-black has-text-centered">
                            <p>No Accredited Tasks</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-full">
                        <label class="label is-size-5">
                          Command Training Priorities
                        </label>
                        <div v-if="selectedCommandTrainingPriorities.length > 0">
                          <section>
                            <b-table :data="selectedCommandTrainingPriorities">
                              <template slot-scope="props">
                                <b-table-column field="title"
                                                label="Title"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.title ? props.row.title : "None" }}
                                </b-table-column>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="column is-full">
                          <div class="content has-text-black has-text-centered">
                            <p>No Command Training Priority</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-full">
                        <label class="label is-size-5">
                          Joint Staff Training Priorities
                        </label>
                        <div v-if="selectedJointStaffPriorities.length > 0">
                          <section>
                            <b-table :data="selectedJointStaffPriorities">
                              <template slot-scope="props">
                                <b-table-column field="title"
                                                label="Title"
                                                class="is-size-6"
                                                sortable>
                                  {{ props.row.title ? props.row.title : "None" }}
                                </b-table-column>
                              </template>
                            </b-table>
                          </section>
                        </div>
                        <div v-else
                             class="column is-full">
                          <div class="content has-text-black has-text-centered">
                            <p>No Joint Staff Training Priority</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </stepper-item>
        </stepper>
      </div>
    </div>
    <div v-else>
      <empty-state :data="planParticipant"
                   :isLoading='$apollo.loading' />
    </div>
    <jmet-interaction v-if="openJmetModal"
                      :open="openJmetModal"
                      @close="closeJmetModal"
                      @addRecord="value=>{jmet = value}" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import JmetInteraction from '@/admin/components/jmet-interaction'
import { PlanJmetsList, PlanJmetsCounts } from '@/plan/graphql/PlanJmets.gql'
import { PlanExerciseObjectivesRead } from '@/plan/graphql/PlanExerciseObjectives.gql'
import {
  PlanParticipantRead,
  PlanParticipantsUpdate,
  PlanParticipantSubscription
} from '@/plan/graphql/PlanParticipants.gql'
import { PlanAccreditedTasksRead } from '@/plan/graphql/PlanAccreditedTasks.gql'
import { PlanCommandPrioritiesRead } from '@/plan/graphql/PlanCommandPriorities.gql'
import { PlanPriorityLevelsRead } from '@/plan/graphql/PlanPriorityLevels.gql'
import { PlanRequestedMethodTypesRead } from '@/plan/graphql/PlanRequestedMethodTypes.gql'
import { serverError } from '@/shared/serverError'
import { PlanJointStaffTrainingPrioritiesRead } from '@/plan/graphql/PlanJointStaffTrainingPriorities.gql'
import helpers from '@/shared/mixins/helpers'
import lightOrDark from '@/shared/mixins/lightOrDark'
export default {
  name: 'manage-trainingobjective',
  mixins: [helpers, lightOrDark],
  props: {
    id: {
      type: String,
      default: ''
    },
    trainingObjID: {
      type: String,
      default: ''
    }
  },
  components: {
    HelpContent,
    JmetInteraction
  },
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
    planPriorityLevels: {
      query: PlanPriorityLevelsRead,
      update(data) {
        if (data && data.planPriorityLevels) {
          return data.planPriorityLevels
        }
      }
    },
    planRequestedMethodTypes: {
      query: PlanRequestedMethodTypesRead,
      update(data) {
        if (data && data.planRequestedMethodTypes) {
          return data.planRequestedMethodTypes
        }
      }
    },
    planJointStaffTrainingPriorities: {
      query: PlanJointStaffTrainingPrioritiesRead,
      update(data) {
        if (data && data.planJointStaffTrainingPriorities) {
          return data.planJointStaffTrainingPriorities
        }
      }
    },
    planExerciseObjectives: {
      query: PlanExerciseObjectivesRead,
      update(data) {
        if (data && data.planExerciseObjectives) {
          return data.planExerciseObjectives
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planParticipant: {
      query: PlanParticipantRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      update(data) {
        if (data && data.planParticipant) {
          let planParticipant = JSON.parse(
            JSON.stringify(data.planParticipant ? data.planParticipant : null),
            this.omitTypename
          )

          if (this.trainingObjID) {
            this.currentTrainingObj = planParticipant.trainingObjectives.filter(
              option => {
                return option.id.indexOf(this.trainingObjID) > -1
              }
            )[0]
            if (this.currentTrainingObj && this.currentTrainingObj.jmet) {
              this.jmet = this.currentTrainingObj.jmet
            }
            if (
              this.currentTrainingObj &&
              this.currentTrainingObj.jointStaffTrainingPriority &&
              this.currentTrainingObj.jointStaffTrainingPriority.length > 0
            ) {
              this.selectedJointStaffPriorities = this.currentTrainingObj.jointStaffTrainingPriority
            }
            if (
              this.currentTrainingObj &&
              this.currentTrainingObj.commandTrainingPriority &&
              this.currentTrainingObj.commandTrainingPriority.length > 0
            ) {
              this.selectedCommandTrainingPriorities = this.currentTrainingObj.commandTrainingPriority
            }
            if (
              this.currentTrainingObj &&
              this.currentTrainingObj.exerciseObjective &&
              this.currentTrainingObj.exerciseObjective.length > 0
            ) {
              this.selectedExerciseObjectives = this.currentTrainingObj.exerciseObjective
            }
            if (
              this.currentTrainingObj &&
              this.currentTrainingObj.accreditedTask &&
              this.currentTrainingObj.accreditedTask.length > 0
            ) {
              this.selectedAccreditedTasks = this.currentTrainingObj.accreditedTask
            }
            if (
              this.currentTrainingObj &&
              this.currentTrainingObj.measures &&
              this.currentTrainingObj.measures.length > 0
            ) {
              this.selectedMeasures = JSON.parse(
                JSON.stringify(this.currentTrainingObj.measures)
              )
            }

            if (
              this.currentTrainingObj &&
              this.currentTrainingObj.priorityLevel
            ) {
              this.priorityLevel = this.currentTrainingObj.priorityLevel
            }
            if (
              this.currentTrainingObj &&
              this.currentTrainingObj.requestedMethodType
            ) {
              this.requestedMethodType = this.currentTrainingObj.requestedMethodType
            }
          }
          return planParticipant
        }
      },
      subscribeToMore: {
        document: PlanParticipantSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          if (
            subscriptionData &&
            subscriptionData.data &&
            subscriptionData.data.planParticipant
          ) {
            let mutationIn = subscriptionData.data.planParticipant.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED':
              case 'UPDATED': {
                newResult = {
                  planParticipant: subscriptionData.data.planParticipant.node
                }
                break
              }
              case 'DELETED': {
                newResult = null
                break
              }
              default: {
                throw new Error(`Unknown Participant mutation`)
              }
            }
            return newResult
          }
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planAccreditedTasks: {
      query: PlanAccreditedTasksRead,
      update(data) {
        if (data && data.planAccreditedTasks) {
          return data.planAccreditedTasks
        }
      }
    },
    planCommandPriorities: {
      query: PlanCommandPrioritiesRead,
      update(data) {
        if (data && data.planCommandPriorities) {
          return data.planCommandPriorities
        }
      }
    }
  },
  data() {
    return {
      requestedMethodType: '',
      priorityLevel: '',
      searchQuery: '',
      planParticipant: null,
      selectedJointStaffPriorities: [],
      selectedCommandTrainingPriorities: [],
      selectedAccreditedTasks: [],
      selectedExerciseObjectives: [],
      stepIndex: this.$route.query.step ? parseInt(this.$route.query.step) : 0,
      planExerciseObjectives: [],
      planCommandPriorities: [],
      planAccreditedTasks: [],
      currentTrainingObj: null,
      stepValidation: {
        details: {
          errors: false,
          visited: false,
          index: 0
        },
        performance: {
          errors: false,
          visited: false,
          index: 1
        },
        associations: {
          errors: false,
          visited: false,
          index: 2
        },
        review: {
          visited: false
        }
      },
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 15,
      selectedMeasures: [],
      first: 75,
      showAll: false,
      openJmetModal: false,
      jmet: null
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
    getError(val) {
      return this.stepValidation[val].errors
    },
    isVisited(val) {
      return this.stepValidation[val].visited
    },
    checkPrevious(value) {
      switch (value) {
        case 0:
          {
            this.stepValidation['details'].visited = true
            this.$validator.validate('details.*').then(result => {
              if (result) {
                this.stepValidation['details'].errors = false
                return true
              } else {
                this.stepValidation['details'].errors = true
                this.$buefy.toast.open({
                  message: 'Details Section Missing Info!',
                  type: 'is-danger'
                })
                return false
              }
            })
            this.updateTrainingObjective('Details', 'continue')
          }
          break
        case 1:
          {
            this.stepValidation['performance'].visited = true
            this.$validator.validate('performance.*').then(result => {
              if (result) {
                this.stepValidation['performance'].errors = false
                return true
              }
              this.stepValidation['performance'].errors = true
              this.$buefy.toast.open({
                message: 'Performance Section Missing Info!',
                type: 'is-danger'
              })
              return false
            })
            this.updateTrainingObjective('Performance', 'continue')
          }
          break
        case 2:
          {
            this.stepValidation['associations'].visited = true
            this.$validator.validate('associations.*').then(result => {
              if (result) {
                this.stepValidation['associations'].errors = false
                return true
              }
              this.stepValidation['associations'].errors = true
              this.$buefy.toast.open({
                message: 'associations Section Missing Info!',
                type: 'is-danger'
              })
              return false
            })
            this.updateTrainingObjective('Associations', 'continue')
          }
          break
      }
    },
    openCreateJmet() {
      this.openJmetModal = true
    },
    closeJmetModal() {
      this.openJmetModal = false
    },
    // Executed when @stepper-finished event is triggered
    onStepsCompleted() {
      this.saveTrainingObjective(null, null)
    },
    getDisconnectIds(existsIn, notExistsIn) {
      let tempArr = existsIn.filter(obj => {
        return !notExistsIn.some(obj2 => obj.id == obj2.id)
      })
      return tempArr.map(x => {
        return { id: x.id }
      })
    },
    addMeasure() {
      this.selectedMeasures.push({ title: '' })
    },
    confirmDeleteMeasure(index) {
      this.$buefy.dialog.confirm({
        title: 'Delete Measure',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.updateMeasuresList(index)
      })
    },
    updateMeasuresList(indexToDelete) {
      this.selectedMeasures.splice(indexToDelete, 1)
    },
    updateTrainingObjective(section, nextStep) {
      let trainingVariable = {}
      let jointStaffData = {
        disconnectIds: [],
        connectIds: []
      }
      let commandPriorityData = {
        disconnectIds: [],
        connectIds: []
      }
      let exObjData = {
        disconnectIds: [],
        connectIds: []
      }
      let accTaskData = {
        disconnectIds: [],
        connectIds: []
      }
      let measuresData = {
        deleteIds: [],
        createIds: [],
        updateIds: []
      }
      switch (section) {
        case 'Details':
          {
            if (this.currentTrainingObj.platform) {
              trainingVariable.platform = {
                connect: { id: this.currentTrainingObj.platform.id }
              }
            }
            if (this.jmet) {
              trainingVariable.jmet = {
                connect: { id: this.jmet.id }
              }
            }
            ['requiredRuns', 'classification'].forEach(
              val => (trainingVariable[val] = this.currentTrainingObj[val])
            )

            // Priority
            if (this.priorityLevel) {
              trainingVariable.priorityLevel = {
                connect: { id: this.priorityLevel.id }
              }
            } else {
              if (this.currentTrainingObj.priorityLevel)
                trainingVariable.priorityLevel = {
                  disconnect: { id: this.currentTrainingObj.priorityLevel.id }
                }
            }

            // Request Method
            if (this.requestedMethodType) {
              trainingVariable.requestedMethodType = {
                connect: { id: this.requestedMethodType.id }
              }
            } else {
              if (this.currentTrainingObj.requestedMethodType)
                trainingVariable.requestedMethodType = {
                  disconnect: {
                    id: this.currentTrainingObj.requestedMethodType.id
                  }
                }
            }
          }
          this.saveTrainingObjective(trainingVariable, section, nextStep)
          break
        case 'Performance':
          {
            ['task', 'condition', 'standard'].forEach(
              val => (trainingVariable[val] = this.currentTrainingObj[val])
            )
          }
          if (
            this.currentTrainingObj.measures &&
            this.currentTrainingObj.measures.length > 0
          ) {
            measuresData.deleteIds = this.getDisconnectIds(
              this.currentTrainingObj.measures,
              this.selectedMeasures
            )
          }
          for (let i = 0; i < this.selectedMeasures.length; i++) {
            if (!('id' in this.selectedMeasures[i]))
              measuresData.createIds.push(this.selectedMeasures[i])
            else {
              // update
              let updateData = {
                where: { id: this.selectedMeasures[i].id },
                data: { title: this.selectedMeasures[i].title }
              }
              measuresData.updateIds.push(updateData)
            }
          }
          trainingVariable = {
            ...trainingVariable,
            measures: {
              create: measuresData.createIds,
              delete: measuresData.deleteIds,
              update: measuresData.updateIds
            }
          }
          this.saveTrainingObjective(trainingVariable, section, nextStep)
          break
        case 'Associations':
          {
            // Exercise Objectives
            if (
              this.currentTrainingObj.exerciseObjective &&
              this.currentTrainingObj.exerciseObjective.length > 0
            ) {
              exObjData.disconnectIds = this.getDisconnectIds(
                this.currentTrainingObj.exerciseObjective,
                this.selectedExerciseObjectives
              )
            }
            if (this.selectedExerciseObjectives.length > 0) {
              exObjData.connectIds = this.selectedExerciseObjectives.map(
                exerciseObjective => {
                  return { id: exerciseObjective.id }
                }
              )
            }
            trainingVariable.exerciseObjective = {
              disconnect: [...exObjData.disconnectIds],
              connect: [...exObjData.connectIds]
            }

            // Accredited Tasks
            if (
              this.currentTrainingObj.accreditedTask &&
              this.currentTrainingObj.accreditedTask.length > 0
            ) {
              accTaskData.disconnectIds = this.getDisconnectIds(
                this.currentTrainingObj.accreditedTask,
                this.selectedAccreditedTasks
              )
            }
            if (this.selectedAccreditedTasks.length > 0) {
              accTaskData.connectIds = this.selectedAccreditedTasks.map(
                accreditedTask => {
                  return { id: accreditedTask.id }
                }
              )
            }
            trainingVariable.accreditedTask = {
              disconnect: [...accTaskData.disconnectIds],
              connect: [...accTaskData.connectIds]
            }

            // Command Training Priorities
            if (
              this.currentTrainingObj.commandTrainingPriority &&
              this.currentTrainingObj.commandTrainingPriority.length > 0
            ) {
              commandPriorityData.disconnectIds = this.getDisconnectIds(
                this.currentTrainingObj.commandTrainingPriority,
                this.selectedCommandTrainingPriorities
              )
            }
            if (this.selectedCommandTrainingPriorities.length > 0) {
              commandPriorityData.connectIds = this.selectedCommandTrainingPriorities.map(
                commandTrainingPriority => {
                  return { id: commandTrainingPriority.id }
                }
              )
            }
            trainingVariable.commandTrainingPriority = {
              disconnect: [...commandPriorityData.disconnectIds],
              connect: [...commandPriorityData.connectIds]
            }

            // Joint Staff Priorities
            if (
              this.currentTrainingObj.jointStaffTrainingPriority &&
              this.currentTrainingObj.jointStaffTrainingPriority.length > 0
            ) {
              jointStaffData.disconnectIds = this.getDisconnectIds(
                this.currentTrainingObj.jointStaffTrainingPriority,
                this.selectedJointStaffPriorities
              )
            }
            if (this.selectedJointStaffPriorities.length > 0) {
              jointStaffData.connectIds = this.selectedJointStaffPriorities.map(
                jointStaffTrainingPriority => {
                  return { id: jointStaffTrainingPriority.id }
                }
              )
            }
            trainingVariable.jointStaffTrainingPriority = {
              disconnect: [...jointStaffData.disconnectIds],
              connect: [...jointStaffData.connectIds]
            }
          }
          if (Object.keys(trainingVariable).length > 0) {
            this.saveTrainingObjective(trainingVariable, section, nextStep)
          }
          break
      }
    },
    saveTrainingObjective(injectData, section, nextStep) {
      if (injectData !== null) {
        let dataVariable = {
          trainingObjectives: {
            update: {
              data: injectData,
              where: { id: this.trainingObjID }
            }
          }
        }
        this.$apollo
          .mutate({
            mutation: PlanParticipantsUpdate,
            variables: {
              data: dataVariable,
              where: {
                id: this.planParticipant.id
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            if (nextStep === 'final') {
              this.$router.push({
                path: this.$route.query.from || '/plan/prepare/objectives-list'
              })
            }
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
          })
      } else {
        this.$router.push({
          path: this.$route.query
            ? this.$route.query.from
            : '/plan/prepare/objectives-list'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
p.control {
  padding-left: 10px;
  word-wrap: break-word;
}
p.subtitle {
  margin-bottom: 0.5rem;
}
.is-skipped {
  background-color: #a9afb7;
}
.card {
  .card-section {
    .card-header {
      background-color: #038172;
    }
    .card-header-title {
      color: rgb(255, 255, 255);
    }
  }
}
.side-objective {
  max-width: 300px;
  margin: 0 auto;
  .tabs {
    max-width: 300px;
  }
  .panel-heading {
    background-color: whitesmoke;
  }
}
</style>
