<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="currentExercise ? currentExercise.name : ''" />
    <div v-if="planEvents && currentExercise">
      <stepper v-model="stepIndex"
               @previousStep="savePrevious"
               @steps-completed="onStepsCompleted"
               @activeStep="activeStep">
        <stepper-item label="Exercise Details"
                      :classList="{'is-danger':getError('exDetails'), 'is-success':!getError('exDetails'), 'is-completed':isVisited('exDetails')}">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  {{currentExercise ? currentExercise.name : ''}} Exercise Details
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.exercisedetails'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>
          <div class="card">
            <div class="card-content">
              <form data-vv-scope="exDetails"
                    v-on:submit.prevent>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-half">
                        <date-picker label="STARTEX Date"
                                     :withoutTime='false'
                                     :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                                     showClear
                                     v-model="currentExercise.startDate"
                                     :format="format"
                                     @clear="(value) => {currentExercise.startDate = value}"
                                     @changed="(value) => {currentExercise.startDate = value}"
                                     :key="'start'"
                                     :name="'StartDate'"
                                     v-validate="'required'" 
                                     :class="{'is-danger': errors.has('exDetails.StartDate') }" />
                        <span v-show="errors.has('exDetails.StartDate')"
                              class="help has-text-danger">{{errors.first('exDetails.StartDate') }}</span>
                      </div>
                      <div class="column is-half">
                        <date-picker label="ENDEX Date"
                                     :withoutTime='false'
                                     :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                                     showClear
                                     v-model="currentExercise.endDate"
                                     :format="format"
                                     @clear="(value) => {currentExercise.endDate = value}"
                                     @changed="(value) => {currentExercise.endDate = value}"
                                     :key="'end'"
                                     :name="'EndDate'"
                                     v-validate="'required'" 
                                     :class="{'is-danger': errors.has('exDetails.EndDate') }" />
                        <span v-show="errors.has('exDetails.EndDate')"
                              class="help has-text-danger">{{errors.first('exDetails.EndDate') }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="column is-half">
                    <div class="field">
                      <label class="label">
                        Primary Organization
                      </label>
                      <multiselect v-if="planOrganizations"
                                   v-model="organization"
                                   track-by="id"
                                   placeholder="Select Organization"
                                   :options="planOrganizations"
                                   :searchable="true"
                                   openDirection="bottom"
                                   :internal-search="false"
                                   @search-change="value => {searchQuery = value}">
                        <template class="multiselect_element"
                                  slot="beforeList">
                          <span class="multiselect__option"
                                @click="openCreateOrganization()">
                            <span> Add new... </span>
                          </span>
                          <hr class="dropdown-divider">
                        </template>
                        <template slot="singleLabel"
                                  slot-scope="{ option }">
                          <span>{{ option.name }}</span>
                          <span v-if="option.group">-{{ option.group }}</span>
                        </template>
                        <template slot="option"
                                  slot-scope="{ option }">
                          <span>{{ option.name }}</span>
                          <span v-if="option.group">-{{ option.group }}</span>
                        </template>
                      </multiselect>
                    </div>
                  </div>
                  <div class="column is-12">
                    <div class="field">
                      <label class="label">
                        Commander's Guidance
                      </label>
                      <div class="control">
                        <textarea class="textarea"
                                  v-model="currentExercise.exerciseGuidance"
                                  placeholder="Enter Commander's Guidance"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </stepper-item>
        <stepper-item label="Planning Meetings"
                      :classList="{'is-danger':getError('meetings'), 'is-success': !getError('meetings'),  'is-completed':isVisited('meetings')}">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  {{currentExercise ? currentExercise.name : ''}} Planning Meetings
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.exerciseplanningmeetings'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>


          <div class="card">
            <div class="card-content">
              <form data-vv-scope="meetings"
                    v-on:submit.prevent>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-full">
                        <section class="level">
                          <div class="level-left">
                            <div class="level-item">
                              <span class="button is-primary"
                                    @click="toggleTableModal(true,'new','meetings')">Add Planning Meeting</span>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-full">
                        <div class="card meeting-section">
                          <div class="card-header">
                            <p class="card-header-title">
                              Plan Meetings: {{planMeetings ? planMeetings.length : 0}}
                            </p>
                          </div>
                          <div v-if="planMeetings && planMeetings.length > 0">
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
                              <b-table :data="planMeetings"
                                       paginated
                                       :per-page="perPage"
                                       :current-page.sync="currentPage"
                                       :pagination-simple="isPaginationSimple"
                                       :default-sort-direction="defaultSortDirection"
                                       default-sort="startDate">
                                <template slot-scope="props">
                                  <b-table-column field="name"
                                                  label="Name"
                                                  class="is-size-6"
                                                  centered
                                                  sortable>
                                    {{ props.row.name ? props.row.name : "None" }}
                                  </b-table-column>
                                  <b-table-column field="location"
                                                  label="Location"
                                                  class="is-size-6"
                                                  centered
                                                  sortable>
                                    {{ props.row.location ? props.row.location : "None" }}
                                  </b-table-column>
                                  <b-table-column field="startDate"
                                                  label="Start Date"
                                                  class="is-size-6"
                                                  centered
                                                  sortable>
                                    {{ formatDate(props.row.startDate, 'dtg') }}
                                  </b-table-column>
                                  <b-table-column field="endDate"
                                                  label="End Date"
                                                  class="is-size-6"
                                                  centered
                                                  sortable>
                                    {{ formatDate(props.row.endDate, 'dtg') }}
                                  </b-table-column>
                                  <b-table-column>
                                    <b-dropdown position="is-bottom-left">
                                      <a class="button is-small"
                                         slot="trigger">
                                        <span class="icon is-small">
                                          <i class="fas fa-ellipsis-v"></i>
                                        </span>
                                      </a>
                                      <b-dropdown-item @click="editTableValue('meetings',props.row)">
                                        <span class="icon is-small">
                                          <i class="fas fa-pen"></i>
                                        </span>
                                        <span>Edit Meeting</span>
                                      </b-dropdown-item>
                                      <hr class="dropdown-divider">
                                      <b-dropdown-item @click="tableValueDelete(props, 'meetings','Meeting')">
                                        <span class="icon is-small">
                                          <i class="fas fa-times has-text-danger"></i>
                                        </span>
                                        <span>Delete Meeting</span>
                                      </b-dropdown-item>
                                    </b-dropdown>
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
                                    No Planning Meetings
                                  </p>
                                </div>
                              </figure>
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
        <stepper-item label="Funding Sources"
                      :classList="{'is-danger':getError('fundings'), 'is-success': !getError('fundings'),  'is-completed':isVisited('fundings')}">

          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  {{currentExercise ? currentExercise.name : ''}} Funding Sources
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.exercisefundingsources'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>

          <div class="card">
            <div class="card-content">
              <form data-vv-scope="fundings"
                    v-on:submit.prevent>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-full">
                        <section class="level">
                          <div class="level-left">
                            <div class="level-item">
                              <span class="button is-primary"
                                    @click="toggleTableModal(true,'new','fundings')">Add Funding Source</span>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-full">
                        <div class="card meeting-section">
                          <div class="card-header">
                            <p class="card-header-title">
                              Funding Sources: {{planFundingSources ? planFundingSources.length : 0}}
                            </p>
                          </div>
                          <div v-if="planFundingSources && planFundingSources.length > 0">
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
                              <b-table :data="planFundingSources"
                                       paginated
                                       :per-page="perPage"
                                       :current-page.sync="currentPage"
                                       :pagination-simple="isPaginationSimple"
                                       :default-sort-direction="defaultSortDirection"
                                       default-sort="primarySource">
                                <template slot-scope="props">
                                  <b-table-column field="primarySource"
                                                  label="Primary Source"
                                                  class="is-size-6"
                                                  centered
                                                  sortable>
                                    {{ props.row.primarySource ? props.row.primarySource : "None" }}
                                  </b-table-column>
                                  <b-table-column field="subSource"
                                                  label="Sub-source"
                                                  class="is-size-6"
                                                  centered
                                                  sortable>
                                    {{ props.row.subSource ? props.row.subSource : "None" }}
                                  </b-table-column>
                                  <b-table-column field="amount"
                                                  label="Amount"
                                                  class="is-size-6 has-icons-left"
                                                  numeric
                                                  centered
                                                  sortable>
                                    {{ props.row.amount | formatNumber('currency') }}
                                  </b-table-column>
                                  <b-table-column centered>
                                    <b-dropdown position="is-bottom-left">
                                      <a class="button is-small"
                                         slot="trigger">
                                        <span class="icon is-small">
                                          <i class="fas fa-ellipsis-v"></i>
                                        </span>
                                      </a>
                                      <b-dropdown-item @click="editTableValue('fundings',props.row)">
                                        <span class="icon is-small">
                                          <i class="fas fa-pen"></i>
                                        </span>
                                        <span>Edit Funding Source</span>
                                      </b-dropdown-item>
                                      <hr class="dropdown-divider">
                                      <b-dropdown-item @click="tableValueDelete(props, 'fundings', 'Funding Source')">
                                        <span class="icon is-small">
                                          <i class="fas fa-times has-text-danger"></i>
                                        </span>
                                        <span>Delete Funding Source</span>
                                      </b-dropdown-item>
                                    </b-dropdown>
                                  </b-table-column>
                                </template>
                                <template slot="bottom-left">
                                  <b>Total Funding: {{fundingTotal | formatNumber('currency')}} </b>
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
                                    No Funding Sources
                                  </p>
                                </div>
                              </figure>
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
        <stepper-item label="Objectives"
                      :classList="{'is-danger':getError('objectives'), 'is-success': !getError('objectives'),  'is-completed':isVisited('objectives')}">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  {{currentExercise ? currentExercise.name : ''}} Exercise Objectives
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.exerciseobjectives'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>

          <div class="card">
            <div class="card-content">
              <form data-vv-scope="objectives"
                    v-on:submit.prevent>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-full">
                        <section class="level">
                          <div class="level-left">
                            <div class="level-item">
                              <span class="button is-primary"
                                    @click="toggleTableModal(true,'new','objectives')">Add Objective</span>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-full">
                        <div class="card objective-section">
                          <div class="card-header">
                            <p class="card-header-title">
                              Exercise Objectives: {{planExerciseObjectives ? planExerciseObjectives.length : 0}}
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
                                  </select></div>
                              </div>
                            </div>
                            <section>
                              <b-table :data="planExerciseObjectives"
                                       paginated
                                       :per-page="perPage"
                                       :current-page.sync="currentPage"
                                       :pagination-simple="isPaginationSimple"
                                       :default-sort-direction="defaultSortDirection"
                                       detailed
                                       detail-key="id"
                                       default-sort="title">
                                <template slot-scope="props">
                                  <b-table-column field="title"
                                                  label="Objective Title"
                                                  class="is-size-6"
                                                  sortable>
                                    {{ props.row.title ? props.row.title : "None" }}
                                  </b-table-column>
                                  <b-table-column centered>
                                    <b-dropdown position="is-bottom-left">
                                      <a class="button is-small"
                                         slot="trigger">
                                        <span class="icon is-small">
                                          <i class="fas fa-ellipsis-v"></i>
                                        </span>
                                      </a>
                                      <b-dropdown-item @click="editTableValue('objectives',props.row)">
                                        <span class="icon is-small">
                                          <i class="fas fa-pen"></i>
                                        </span>
                                        <span>Edit Exercise Objective</span>
                                      </b-dropdown-item>
                                      <hr class="dropdown-divider">
                                      <b-dropdown-item @click="tableValueDelete(props, 'objectives', 'Exercise Objective')">
                                        <span class="icon is-small">
                                          <i class="fas fa-times has-text-danger"></i>
                                        </span>
                                        <span>Delete Exercise Objective</span>
                                      </b-dropdown-item>
                                    </b-dropdown>
                                  </b-table-column>
                                </template>
                                <template slot="detail"
                                          slot-scope="props">
                                  <article class="media">
                                    <div class="media-content">
                                      <div class="columns is-multiline is-mobile is-centered">
                                        <div class="column is-full">
                                          <label class="label">
                                            Exercise Objective
                                          </label>
                                          <div class="control">
                                            {{ props.row.exerciseObjective ? props.row.exerciseObjective : "None" }}
                                          </div>
                                        </div>
                                        <div class="column is-full">
                                          <label class="label">
                                            Measure of Performance
                                          </label>
                                          <div class="control">
                                            {{ props.row.measurePerformance ? props.row.measurePerformance : "None" }}
                                          </div>
                                        </div>
                                        <div class="column is-full">
                                          <label class="label">
                                            Measure of Effectiveness
                                          </label>
                                          <div class="control">
                                            {{props.row.measureEffectiveness ? props.row.measureEffectiveness : "None" }}
                                          </div>
                                        </div>
                                      </div>
                                      <div class="columns">
                                        <div class="column is-narrow">
                                          <div class="field is-grouped">
                                            <p class="control">
                                              <a class="button is-primary"
                                                 @click="editTableValue('objectives',props.row)">Edit</a>
                                            </p>
                                            <p class="control">
                                              <a class="button is-danger is-outlined"
                                                 @click="tableValueDelete(props, 'objectives', 'Exercise Objective')">Delete</a>
                                            </p>
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
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </stepper-item>
        <stepper-item label="Tasks &amp; Priorities"
                      :classList="{'is-danger':getError('tasksPriority'), 'is-success':!getError('tasksPriority'),  'is-completed':isVisited('tasksPriority')}">

          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  {{currentExercise ? currentExercise.name : ''}} Tasks &amp; Priorities
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.exercisetaskspriorities'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>

          <div class="card">
            <div class="card-content">
              <form data-vv-scope="tasksPriority"
                    v-on:submit.prevent>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="columns is-multiline is-mobile">
                      <div class="column is-full">
                        <div class="columns">
                          <div class="column is-full">
                            <div class="card tasks-priorities-section">
                              <div class="card-header">
                                <p class="card-header-title">
                                  Accredited Tasks - {{planAccreditedTasks ? planAccreditedTasks.length : 0}}
                                </p>
                              </div>
                              <div class="column is-full">
                                <section class="level">
                                  <div class="level-left">
                                    <div class="level-item">
                                      <span class="button is-primary"
                                            @click="toggleTableModal(true,'new','tasks')">Add Accredited Task</span>
                                    </div>
                                  </div>
                                </section>
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
                                           default-sort="jmet.levelWar">
                                    <template slot-scope="props">
                                      <b-table-column field="jmet.levelWar"
                                                      label="Level"
                                                      class="is-size-6"
                                                      sortable>
                                        {{ props.row.jmet.levelWar ? props.row.jmet.levelWar : "None" }}
                                      </b-table-column>
                                      <b-table-column field="jmet.taskNumber"
                                                      label="Number"
                                                      class="is-size-6"
                                                      sortable>
                                        {{ props.row.jmet.taskNumber ? props.row.jmet.taskNumber : "None" }}
                                      </b-table-column>
                                      <b-table-column field="jmet.taskTitle"
                                                      label="Title"
                                                      class="is-size-6"
                                                      sortable>
                                        {{ props.row.jmet.taskTitle ? props.row.jmet.taskTitle : "None" }}
                                      </b-table-column>
                                      <b-table-column centered>
                                        <b-dropdown position="is-bottom-left">
                                          <a class="button is-small"
                                             slot="trigger">
                                            <span class="icon is-small">
                                              <i class="fas fa-ellipsis-v"></i>
                                            </span>
                                          </a>
                                          <b-dropdown-item @click="editTableValue('tasks',props.row)">
                                            <span class="icon is-small">
                                              <i class="fas fa-pen"></i>
                                            </span>
                                            <span>Edit Accredited Task</span>
                                          </b-dropdown-item>
                                          <hr class="dropdown-divider">
                                          <b-dropdown-item @click="tableValueDelete(props, 'tasks','Accredited Task')">
                                            <span class="icon is-small">
                                              <i class="fas fa-times has-text-danger"></i>
                                            </span>
                                            <span>Delete Accredited Task</span>
                                          </b-dropdown-item>
                                        </b-dropdown>
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-full">
                    <div class="columns is-multiline is-mobile">
                      <div class="column is-full">
                        <div class="columns">
                          <div class="column is-full">
                            <div class="card tasks-priorities-section">
                              <div class="card-header">
                                <p class="card-header-title">
                                  Command Training Priorities - {{planCommandPriorities ? planCommandPriorities.length : 0}}
                                </p>
                              </div>
                              <div class="column is-full">
                                <section class="level">
                                  <div class="level-left">
                                    <div class="level-item">
                                      <span class="button is-primary"
                                            @click="toggleTableModal(true,'new','tasksPriority')">Add Command Priority</span>
                                    </div>
                                  </div>
                                </section>
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
                                           detailed
                                           detail-key="id"
                                           default-sort="title">
                                    <template slot-scope="props">
                                      <b-table-column field="title"
                                                      label="Title"
                                                      class="is-size-6"
                                                      sortable>
                                        {{ props.row.title ? props.row.title : "None" }}
                                      </b-table-column>
                                      <b-table-column centered>
                                        <b-dropdown position="is-bottom-left">
                                          <a class="button is-small"
                                             slot="trigger">
                                            <span class="icon is-small">
                                              <i class="fas fa-ellipsis-v"></i>
                                            </span>
                                          </a>
                                          <b-dropdown-item @click="editTableValue('tasksPriority',props.row)">
                                            <span class="icon is-small">
                                              <i class="fas fa-pen"></i>
                                            </span>
                                            <span>Edit Command Training Priority</span>
                                          </b-dropdown-item>
                                          <hr class="dropdown-divider">
                                          <b-dropdown-item @click="tableValueDelete(props, 'tasksPriority','Command Priority')">
                                            <span class="icon is-small">
                                              <i class="fas fa-times has-text-danger"></i>
                                            </span>
                                            <span>Delete Command Training Priority</span>
                                          </b-dropdown-item>
                                        </b-dropdown>
                                      </b-table-column>
                                    </template>
                                    <template slot="detail"
                                              slot-scope="props">
                                      <article class="media">
                                        <div class="media-content">
                                          <div class="columns is-multiline is-mobile is-centered">
                                            <div class="column is-full">
                                              <label class="label">
                                                Description
                                              </label>
                                              <div class="control">
                                                {{ props.row.description ? props.row.description : "None" }}
                                              </div>
                                            </div>
                                          </div>
                                          <div class="columns">
                                            <div class="column is-narrow">
                                              <div class="field is-grouped">
                                                <p class="control">
                                                  <a class="button is-primary"
                                                     @click="editTableValue('tasksPriority',props.row)">Edit</a>
                                                </p>
                                                <p class="control">
                                                  <a class="button is-danger is-outlined"
                                                     @click="tableValueDelete(props, 'tasksPriority','Command Priority')">Delete</a>
                                                </p>
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
                                        No Command Priorities
                                      </p>
                                    </div>
                                  </figure>
                                </div>
                              </div>
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
        <stepper-item label="Review"
                      icon="fas fa-check">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  Review Initial Exercise Design
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.exercisereview'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>

          <div class="card">
            <div class="card-content">
              <div class="content">
                <div class="columns is-multiline is-mobile">
                  <div class="column is-12">
                    <div class="columns">
                      <div class="column is-4">
                        <span class="is-size-4 has-text-weight-bold">Exercise Details</span>
                      </div>
                      <div class="column is-4 ">
                        <a class="button is-large is-fullwidth"
                           @click="showStep(0)"
                           v-bind:class="{'is-danger':getError('exDetails'), 'is-success':!getError('exDetails')}">
                          Review
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="column is-12">
                    <div class="columns">
                      <div class="column is-4">
                        <span class="is-size-4 has-text-weight-bold">Planning Meetings</span>
                      </div>
                      <div class="column is-4">
                        <a class="button is-large is-fullwidth"
                           @click="showStep(1)"
                           v-bind:class="{'is-danger':getError('meetings'), 'is-success': !getError('meetings'),  'is-completed':isVisited('meetings'), 'is-skipped':!isVisited('meetings')}">
                          Review
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="column is-12">
                    <div class="columns">
                      <div class="column is-4">
                        <span class="is-size-4 has-text-weight-bold">Funding Sources</span>
                      </div>
                      <div class="column is-4">
                        <a class="button is-large is-fullwidth"
                           @click="showStep(2)"
                           v-bind:class="{'is-danger':getError('fundings'), 'is-success':!getError('fundings'),  'is-completed':isVisited('fundings'),'is-skipped':!isVisited('fundings')}">
                          Review
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="column is-12">
                    <div class="columns">
                      <div class="column is-4">
                        <span class="is-size-4 has-text-weight-bold">Objectives</span>
                      </div>
                      <div class="column is-4">
                        <a class="button is-large is-fullwidth"
                           @click="showStep(3)"
                           v-bind:class="{'is-danger':getError('objectives'), 'is-success': !getError('objectives'),  'is-completed':isVisited('objectives'), 'is-skipped':!isVisited('objectives')}">
                          Review
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="column is-12">
                    <div class="columns">
                      <div class="column is-4">
                        <span class="is-size-4 has-text-weight-bold">Tasks &amp; Priorities</span>
                      </div>
                      <div class="column is-4">
                        <a class="button is-large is-fullwidth"
                           @click="showStep(4)"
                           v-bind:class="{'is-danger':getError('tasksPriority'), 'is-success':!getError('tasksPriority'),  'is-completed':isVisited('tasksPriority'), 'is-skipped':!isVisited('tasksPriority')}">
                          Review
                        </a>
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
    <div v-else>
      <empty-state :data="currentExercise"
                   :isLoading='$apollo.loading' />
    </div>
    <accredited-task v-if="openAccreditedTask"
                     :open="openAccreditedTask"
                     :jmetValues="planJmets"
                     :existingIds="originalJmetIds"
                     :id="accTaskID"
                     @close="closeAccreditedTaskModal"></accredited-task>
    <plan-meeting v-if="openMeeting"
                  :open="openMeeting"
                  :id="meetingId"
                  @close="closeMeetingModal"></plan-meeting>
    <funding-sources v-if="openFunding"
                     :open="openFunding"
                     :id="fundingSourceId"
                     @close="closeFundingSourceModal"></funding-sources>
    <exercise-objectives v-if="openObjective"
                         :open="openObjective"
                         :id="exerciseObjectiveId"
                         @close="closeExerciseObjectiveModal"></exercise-objectives>
    <command-priority v-if="openCommandPriority"
                      :open="openCommandPriority"
                      :isClosed="!openCommandPriority"
                      :id="commandPriorityId"
                      @close="closeCommandPriorityModal"></command-priority>
    <organization-interaction v-if="openOrganizationModal"
                              :open="openOrganizationModal"
                              @close="closeOrganizationModal"
                              @addRecord="value=>{organization = value}"/>
  </div>
</template>

<script>
import AccreditedTask from '@/plan/components/exerciseModals/manage-accreditedTask.vue'
import PlanMeeting from '@/plan/components/exerciseModals/manage-meetings.vue'
import FundingSources from '@/plan/components/exerciseModals/manage-fundings.vue'
import ExerciseObjectives from '@/plan/components/exerciseModals/manage-exerciseObjectives.vue'
import CommandPriority from '@/plan/components/exerciseModals/manage-commandPriority.vue'

import OrganizationInteraction from '@/admin/components/organization-interaction'

import {
  PlanFundingSourcesRead,
  PlanFundingSourceSubscription
} from '@/plan/graphql/PlanFundingSources.gql'
import { PlanJmetsList } from '@/plan/graphql/PlanJmets.gql'
import {
  PlanOrganizationsRead,
  PlanOrganizationSubscription
} from '@/plan/graphql/PlanOrganizations.gql'
import {
  PlanMeetingsRead,
  PlanMeetingSubscription
} from '@/plan/graphql/PlanMeetings.gql'
import {
  PlanExerciseObjectivesRead,
  PlanExerciseObjectiveSubscription
} from '@/plan/graphql/PlanExerciseObjectives.gql'
import {
  PlanEventsRead,
  PlanEventsCreate,
  PlanEventsUpdate,
  PlanEventSubscription
} from '@/plan/graphql/PlanEvents.gql'
import DatePicker from '@/shared/components/datepicker'
import HelpContent from '@/shared/components/helpcontent'
import helpers from '@/shared/mixins/helpers'
import processVal from '@/shared/mixins/processVal'
import { serverError } from '@/shared/serverError'
import {
  PlanAccreditedTasksRead,
  PlanAccreditedTaskSubscription
} from '@/plan/graphql/PlanAccreditedTasks.gql'
import {
  PlanCommandPrioritiesRead,
  PlanCommandPrioritySubscription
} from '@/plan/graphql/PlanCommandPriorities.gql'
import PlanEvent from '@/plan/model/planevent'

import Vue from 'vue'
export default {
  name: 'manage-exercise',
  apollo: {
    planFundingSources: {
      query: PlanFundingSourcesRead,
      update(data) {
        if (data && data.planFundingSources) {
          return data.planFundingSources
        }
      },
      subscribeToMore: {
        document: PlanFundingSourceSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planFundingSource.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planFundingSources: [
                  subscriptionData.data.planFundingSource.node,
                  ...previousResult.planFundingSources
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planFundingSources: [
                  ...previousResult.planFundingSources.filter(
                    obj =>
                      subscriptionData.data.planFundingSource.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanFundingSources = JSON.parse(
                JSON.stringify(previousResult.planFundingSources)
              )
              let index = newPlanFundingSources.findIndex(
                x => x.id === subscriptionData.data.planFundingSource.node.id
              )
              newPlanFundingSources[index] =
                subscriptionData.data.planFundingSource.node
              newResult = {
                planFundingSources: newPlanFundingSources
              }
              break
            }
            default: {
              throw new Error(`Unknown Exercise Objective mutation`)
            }
          }
          return newResult
        }
      }
    },
    planMeetings: {
      query: PlanMeetingsRead,
      update(data) {
        if (data && data.planMeetings) {
          return data.planMeetings
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanMeetingSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planMeeting.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planMeetings: [
                  subscriptionData.data.planMeeting.node,
                  ...previousResult.planMeetings
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planMeetings: [
                  ...previousResult.planMeetings.filter(
                    obj =>
                      subscriptionData.data.planMeeting.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanMeetings = JSON.parse(
                JSON.stringify(previousResult.planMeetings)
              )
              let index = newPlanMeetings.findIndex(
                x => x.id === subscriptionData.data.planMeeting.node.id
              )
              newPlanMeetings[index] = subscriptionData.data.planMeeting.node
              newResult = {
                planMeetings: newPlanMeetings
              }
              break
            }
            default: {
              throw new Error(`Unknown Exercise Objective mutation`)
            }
          }
          return newResult
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
      },
      subscribeToMore: {
        document: PlanExerciseObjectiveSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planExerciseObjective.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planExerciseObjectives: [
                  subscriptionData.data.planExerciseObjective.node,
                  ...previousResult.planExerciseObjectives
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planExerciseObjectives: [
                  ...previousResult.planExerciseObjectives.filter(
                    obj =>
                      subscriptionData.data.planExerciseObjective.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanExerciseObjectives = JSON.parse(
                JSON.stringify(previousResult.planExerciseObjectives)
              )
              let index = newPlanExerciseObjectives.findIndex(
                x =>
                  x.id === subscriptionData.data.planExerciseObjective.node.id
              )
              newPlanExerciseObjectives[index] =
                subscriptionData.data.planExerciseObjective.node
              newResult = {
                planExerciseObjectives: newPlanExerciseObjectives
              }
              break
            }
            default: {
              throw new Error(`Unknown Exercise Objective mutation`)
            }
          }
          return newResult
        }
      }
    },
    planAccreditedTasks: {
      query: PlanAccreditedTasksRead,
      update(data) {
        if (data && data.planAccreditedTasks) {
          this.originalJmetIds = data.planAccreditedTasks.map(function(task) {
            return task.jmet.id
          })
        }
        return data.planAccreditedTasks
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanAccreditedTaskSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planAccreditedTask.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planAccreditedTasks: [
                  subscriptionData.data.planAccreditedTask.node,
                  ...previousResult.planAccreditedTasks
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planAccreditedTasks: [
                  ...previousResult.planAccreditedTasks.filter(
                    obj =>
                      subscriptionData.data.planAccreditedTask.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanAccreditedTasks = JSON.parse(
                JSON.stringify(previousResult.planAccreditedTasks)
              )
              let index = newPlanAccreditedTasks.findIndex(
                x => x.id === subscriptionData.data.planAccreditedTask.node.id
              )
              newPlanAccreditedTasks[index] =
                subscriptionData.data.planAccreditedTask.node
              newResult = {
                planAccreditedTasks: newPlanAccreditedTasks
              }
              break
            }
            default: {
              throw new Error(`Unknown Accredited Task mutation`)
            }
          }
          return newResult
        }
      }
    },
    planCommandPriorities: {
      query: PlanCommandPrioritiesRead,
      update(data) {
        if (data && data.planCommandPriorities) {
          return data.planCommandPriorities
        }
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanCommandPrioritySubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planCommandPriority.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planCommandPriorities: [
                  subscriptionData.data.planCommandPriority.node,
                  ...previousResult.planCommandPriorities
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planCommandPriorities: [
                  ...previousResult.planCommandPriorities.filter(
                    obj =>
                      subscriptionData.data.planCommandPriority.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanCommandPriorities = JSON.parse(
                JSON.stringify(previousResult.planCommandPriorities)
              )
              let index = newPlanCommandPriorities.findIndex(
                x => x.id === subscriptionData.data.planCommandPriority.node.id
              )
              newPlanCommandPriorities[index] =
                subscriptionData.data.planCommandPriority.node
              newResult = {
                planCommandPriorities: newPlanCommandPriorities
              }
              break
            }
            default: {
              throw new Error(`Unknown Command Priority mutation`)
            }
          }
          return newResult
        }
      }
    },
    planEvents: {
      query: PlanEventsRead,
      variables() {
        return {
          where: {
            type: this.exType
          }
        }
      },
      update(data) {
        if (data && data.planEvents && data.planEvents.length) {
          this.currentExercise = Object.assign(
            {},
            JSON.parse(JSON.stringify(data.planEvents[0]), this.omitTypename)
          )
          if (
            this.currentExercise.organization &&
            this.currentExercise.organization.id
          ) {
            this.organization = this.currentExercise.organization
            this.originalCommandId = this.currentExercise.organization.id
          }
        } else {
          this.currentExercise = new PlanEvent()
          this.currentExercise.name = this.$store.state.activeWorkspace.displayName
        }
        return data.planEvents
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanEventSubscription,
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
              throw new Error(`Unknown Plan Event mutation`)
            }
          }
          return newResult
        }
      }
    },
    planJmets: {
      query: PlanJmetsList,
      update(data) {
        if (data && data.planJmets) {
          return data.planJmets
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planOrganizations: {
      query: PlanOrganizationsRead,
      variables() {
        return {
          where: {
            OR: [
              { name_contains: this.searchQuery },
              { group_contains: this.searchQuery }
            ]
          }
        }
      },
      update(data) {
        if (data && data.planOrganizations) {
          return data.planOrganizations
        }
      },
      subscribeToMore: {
        document: PlanOrganizationSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planOrganization.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planOrganizations: [
                  subscriptionData.data.planOrganization.node,
                  ...previousResult.planOrganizations
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planOrganizations: [
                  ...previousResult.planOrganizations.filter(
                    obj =>
                      subscriptionData.data.planOrganization.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanOrganizations = JSON.parse(
                JSON.stringify(previousResult.planOrganizations)
              )
              let index = newPlanOrganizations.findIndex(
                x => x.id === subscriptionData.data.planOrganization.node.id
              )
              newPlanOrganizations[index] =
                subscriptionData.data.planOrganization.node
              newResult = {
                planOrganizations: newPlanOrganizations
              }
              break
            }
            default: {
              throw new Error(`Unknown Organization mutation`)
            }
          }
          return newResult
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  props: {
    exercise: {
      type: Object,
      default: function() {
        return new PlanEvent()
      }
    }
  },
  mixins: [helpers, processVal],
  components: {
    DatePicker,
    HelpContent,
    AccreditedTask,
    PlanMeeting,
    FundingSources,
    ExerciseObjectives,
    CommandPriority,
    OrganizationInteraction
  },
  data() {
    return {
      searchQuery: '',
      openOrganizationModal: false,
      organizationId: null,
      organization: null,
      planExerciseObjectives: [],
      openObjective: false,
      exerciseObjectiveId: '',
      planMeetings: [],
      openMeeting: false,
      meetingId: '',
      planFundingSources: [],
      openFunding: false,
      fundingSourceId: '',
      planCommandPriorities: [],
      openCommandPriority: false,
      commandPriorityId: '',
      planAccreditedTasks: [],
      openAccreditedTask: false,
      accTaskID: '',
      originalJmetIds: [],
      originalCommandId: null,
      planJmets: [],
      stepIndex: this.$route.query.step ? parseInt(this.$route.query.step) : 0,
      exType: 'primary',
      currentExercise: Vue.util.extend({}, this.exercise),
      format: 'M J Y',
      stepValidation: {
        exDetails: {
          errors: false,
          visited: false,
          index: 0
        },
        meetings: {
          errors: false,
          visited: false,
          index: 1
        },
        fundings: {
          errors: false,
          visited: false,
          index: 2
        },
        objectives: {
          errors: false,
          visited: false,
          index: 3
        },
        tasksPriority: {
          errors: false,
          visited: false,
          index: 4
        },
        tasks: {
          errors: false,
          visited: false,
          index: 4
        },
        review: {
          visited: false
        }
      },
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 15
    }
  },
  computed: {
    fundingTotal() {
      let sum = 0
      if (this.planFundingSources && this.planFundingSources.length > 0) {
        sum = this.planFundingSources.reduce((accumulator, currentFunding) => {
          return accumulator + currentFunding.amount
        }, 0)
      }
      return sum
    }
  },
  methods: {
    activeStep(event) {
      this.stepIndex = event
    },
    closeAccreditedTaskModal() {
      this.toggleTableModal(false, 'close', 'tasks')
    },
    closeMeetingModal() {
      this.toggleTableModal(false, 'close', 'meetings')
    },
    closeFundingSourceModal() {
      this.toggleTableModal(false, 'close', 'fundings')
    },
    closeExerciseObjectiveModal() {
      this.toggleTableModal(false, 'close', 'objectives')
    },
    closeCommandPriorityModal() {
      this.toggleTableModal(false, 'close', 'tasksPriority')
    },
    closeOrganizationModal() {
      this.openOrganizationModal = false
    },
    openCreateOrganization() {
      this.openOrganizationModal = true
    },
    toggleTableModal(value, type, section, info) {
      if (type && type === 'close') {
        this.stepValidation[section].errors = false
      }
      switch (section) {
        case 'exDetails':
          {
            switch (type) {
              case 'new':
              case 'close':
                this.organizationId = ''
                break
              case 'edit':
                this.organizationId = info.id
                break
            }
            this.openOrganizationModal = value
          }
          break
        case 'meetings':
          {
            switch (type) {
              case 'new':
              case 'close':
                this.meetingId = ''
                break
              case 'edit':
                this.meetingId = info.id
                break
            }
            this.openMeeting = value
          }
          break
        case 'objectives':
          {
            switch (type) {
              case 'new':
              case 'close':
                this.exerciseObjectiveId = ''
                break
              case 'edit':
                this.exerciseObjectiveId = info.id
                break
            }
            this.openObjective = value
          }
          break
        case 'fundings':
          {
            switch (type) {
              case 'new':
              case 'close':
                this.fundingSourceId = ''
                break
              case 'edit':
                this.fundingSourceId = info.id
                break
            }
            this.openFunding = value
          }
          break
        case 'tasksPriority':
          {
            switch (type) {
              case 'new':
              case 'close':
                this.commandPriorityId = ''
                break
              case 'edit':
                this.commandPriorityId = info.id
                break
            }
            this.openCommandPriority = value
          }
          break
        case 'tasks':
          {
            switch (type) {
              case 'new':
              case 'close':
                this.accTaskID = ''
                break
              case 'edit':
                this.accTaskID = info.id
                break
            }
            this.openAccreditedTask = value
          }
          break
      }
    },
    editTableValue(name, val) {
      this.toggleTableModal(true, 'edit', name, val)
    },
    tableValueDelete(item, name, displayName) {
      this.confirmValueDelete(item, name, displayName)
    },
    getError(val) {
      return this.stepValidation[val].errors
    },
    isVisited(val) {
      return this.stepValidation[val].visited
    },
    showStep(val) {
      this.stepIndex = val
    },
    // Executed when @previousStep event is triggered
    savePrevious(value) {
      switch (value) {
        case 0:
          this.stepValidation['exDetails'].visited = true
          this.$validator.validate('exDetails.*').then(result => {
            if (result) {
              this.stepValidation['exDetails'].errors = false
              this.saveExerciseInfo()
              return
            }
            this.stepValidation['exDetails'].errors = true
            this.$buefy.toast.open({
              message: 'Exercise Missing Info!',
              type: 'is-danger'
            })
          })
          break
        case 1:
          this.stepValidation['meetings'].visited = true
          break
        case 2:
          this.stepValidation['fundings'].visited = true
          break
        case 3:
          this.stepValidation['objectives'].visited = true
          break
        case 4:
          this.stepValidation['tasksPriority'].visited = true
          break
      }
    },
    saveExerciseInfo() {
      let organization = {}
      let dataVariable = {
        name: this.currentExercise.name,
        startDate: this.currentExercise.startDate,
        endDate: this.currentExercise.endDate,
        exerciseGuidance: this.currentExercise.exerciseGuidance,
        type: this.exType
      }
      if (this.currentExercise.organization === null) {
        if (this.originalCommandId !== null) {
          organization = Vue.util.extend(organization, {
            disconnect: { id: this.originalCommandId }
          })
        }
      }

      if (this.organization && this.organization.id) {
        organization = Vue.util.extend(organization, {
          connect: { id: this.organization.id }
        })
      }
      if (organization.connect || organization.disconnect) {
        dataVariable = Vue.util.extend(dataVariable, {
          organization
        })
      }
      if (!this.currentExercise.id) {
        this.$apollo
          .mutate({
            mutation: PlanEventsCreate,
            variables: {
              data: dataVariable
            }
          })
          .then(response => {
            this.currentExercise = response.data.createPlanEvent

            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: error.message,
              type: 'is-danger'
            })
            console.error('Exercise Create: ' + error)
          })
      } else {
        let injectID = this.currentExercise.id
        this.$apollo
          .mutate({
            mutation: PlanEventsUpdate,
            variables: {
              data: dataVariable,
              where: {
                id: injectID
              }
            }
          })
          .then(response => {
            this.currentExercise = response.data.updatePlanEvent
            if (
              response.data.updatePlanEvent.organization &&
              response.data.updatePlanEvent.organization.id
            ) {
              this.originalCommandId =
                response.data.updatePlanEvent.organization.id
            }
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
            console.error('Exercise Updated: ' + error)
          })
      }
    },
    // Executed when @stepper-finished event is triggered
    onStepsCompleted() {
      // All steps have been navigated
      let dataErrorCount = 0
      for (let key in this.stepValidation) {
        if (this.stepValidation[key].errors) {
          dataErrorCount++
        }
      }
      if (dataErrorCount >= 1) {
        this.$buefy.dialog.confirm({
          title: 'Proceed With ' + dataErrorCount + ' Errors?',
          message: `Sections marked in RED have errors and will NOT be saved.`,
          type: 'is-danger',
          onConfirm: () => this.$router.go(-1)
        })
      } else {
        this.$buefy.toast.open({
          message: 'Saving...',
          type: 'is-success'
        })
        this.$router.push({
          path: this.$route.query
            ? this.$route.query.from
            : '/plan/prepare/exercise-details'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  .tasks-priorities-section {
    .card-header {
      background-color: #038172;
    }
    .card-header-title {
      color: #ffffff;
    }
  }
  .objective-section {
    .card-header {
      background-color: #038172;
    }
    .card-header-title {
      color: #ffffff;
    }
  }
  .meeting-section {
    .card-header {
      background-color: #038172;
    }
    .card-header-title {
      color: #ffffff;
    }
  }
}
.is-skipped {
  background-color: #a9afb7;
}
</style>
