<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="planInjects ? '#'+ planInjects.number +' ' + planInjects.title : ''" />
    <div v-if="planInject && planInject.id != null">
      <stepper v-model="stepIndex"
               @previousStep="onStepChange"
               @steps-completed="onStepsCompleted">
        <stepper-item label="Inject Details"
                      :classList="{'is-danger':getError('details'), 'is-success': !getError('details'),  'is-completed':isVisited('details')}">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  Inject Details
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.inject.detail'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>
          <div class="card">
            <div class="card-content">
              <form data-vv-scope="details"
                    v-on:submit.prevent>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-two-thirds">
                        <div class="field">
                          <label class="label">
                            Title
                          </label>
                          <div class="control">
                            <input class="input"
                                   :name="'injectName'"
                                   v-model="planInject.title"
                                   v-validate="'required'"
                                   type="text"
                                   placeholder="Title"
                                   :class="{'input': true, 'is-danger': errors.has('details.injectName') }" />
                            <span v-show="errors.has('details.injectName')"
                                  class="help has-text-danger">Inject Title Required</span>
                          </div>
                        </div>
                      </div>
                      <div class="column is-one-third">
                        <div class="field">
                          <label class="label">
                            Status
                          </label>
                          <multiselect v-model="planInject.status"
                                       track-by="id"
                                       label="title"
                                       placeholder="Status"
                                       :options="planLabels"
                                       :searchable="true"
                                       openDirection="below"
                                       :internal-search="false"
                                       @search-change="search('status', $event)"
                                       @select="injectStatusCheck(planInject, $event)">
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
                    </div>
                  </div>
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-half">
                        <div class="field">
                          <label class="label">
                            Event
                          </label>
                          <multiselect v-model="planInject.events"
                                       track-by="id"
                                       label="name"
                                       placeholder="Select Event"
                                       :options="planEvents"
                                       :searchable="true"
                                       openDirection="below"
                                       :internal-search="false"
                                       @search-change="search('events', $event)">
                            <template slot="singleLabel"
                                      slot-scope="{ option }">
                              {{option.name}}
                            </template>
                            <template slot="option"
                                      slot-scope="{ option }">
                              {{option.name }}
                            </template>
                            <template class="multiselect_element"
                                      slot="afterList">
                              <div v-show="planEventsCount > 74"
                                   class="afterList">
                                <hr class="dropdown-divider">
                                <span class="multiselect__option"
                                      @click="toggleEvents(true)"
                                      v-if="planEvents.length > 74 && showAll == false">
                                  <span class="is-italic">Show more options... </span>
                                </span>

                                <span class="multiselect__option"
                                      @click="toggleEvents(false)"
                                      v-else>
                                  <span class="is-italic">Show fewer options... </span>
                                </span>
                              </div>
                            </template>
                          </multiselect>
                        </div>
                      </div>
                      <div class="column is-half">
                        <date-picker :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                                     showClear
                                     v-model="planInject.startDate"
                                     @clear="(value) => {planInject.startDate = value}"
                                     @changed="(value) => {planInject.startDate = value}" />
                      </div>
                    </div>
                  </div>
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-half">
                        <div class="field">
                          <label class="label">
                            Type
                          </label>
                          <div class="control is-expanded">
                            <multiselect v-model="planInject.type"
                                         placeholder="Select Type"
                                         :options="injectType"
                                         openDirection="below">
                              <template slot="singleLabel"
                                        slot-scope="{ option }">
                                {{option}}
                              </template>
                              <template slot="option"
                                        slot-scope="{ option }">
                                {{option }}
                              </template>
                            </multiselect>
                          </div>
                        </div>
                      </div>
                      <div class="column is-half">
                        <div class="field">
                          <div class="field">
                            <label class="label">
                              Owner
                            </label>
                            <div class="control is-expanded">
                              <multiselect v-model="injectOwner"
                                           track-by="id"
                                           placeholder="Inject Owner"
                                           :options="planInjectOwners"
                                           :searchable="true"
                                           openDirection="bottom"
                                           :close-on-select="true"
                                           :internal-search="false"
                                           @search-change="search('injectOwners', $event)">
                                <template class="multiselect_element"
                                          slot="beforeList">
                                  <span class="multiselect__option"
                                        @click="showAddValue('injectOwners')">
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-half">
                        <div class="field">
                          <label class="label">
                            From
                          </label>
                          <div class="control">
                            <input class="input"
                                   type="text"
                                   placeholder="White Cell Battle Position"
                                   v-model="planInject.from">
                          </div>
                        </div>
                      </div>
                      <div class="column is-half">
                        <div class="field">
                          <label class="label">
                            To
                          </label>
                          <div class="control">
                            <input class="input"
                                   type="text"
                                   placeholder="Training Audience Battle Position"
                                   v-model="planInject.to">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-half">
                        <div class="field">
                          <label class="label">
                            Inject Method
                          </label>
                          <div class="control is-expanded">
                            <multiselect v-model="method"
                                         track-by="id"
                                         :options="planMethods"
                                         v-if="planMethods"
                                         :internal-search="false"
                                         @search-change="search('methods', $event)">
                              <template class="multiselect_element"
                                        slot="beforeList">
                                <span class="multiselect__option"
                                      @click="openCreateMethod()">
                                  <span> Add new... </span>
                                </span>
                                <hr class="dropdown-divider">
                              </template>
                              <template slot="singleLabel"
                                        slot-scope="props">
                                <span class="icon is-small"
                                      v-if="props.option.icon"
                                      :key="props.option.icon"
                                      :style="'color:'+props.option.color">
                                  <i :class="props.option.icon"></i>
                                </span>
                                <span class="option__desc">
                                  <span class="option__title">{{ props.option.name }}</span>
                                </span>
                              </template>
                              <template slot="option"
                                        slot-scope="props">
                                <span class="icon is-small"
                                      v-if="props.option.icon"
                                      :key="props.option.icon"
                                      :style="'color:'+props.option.color">
                                  <i :class="props.option.icon"></i>
                                </span>
                                <span class="option__desc">
                                  <span class="option__title">{{ props.option.name }}</span>
                                </span>
                              </template>
                            </multiselect>
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
        <stepper-item label="Trigger &amp; Response"
                      :classList="{'is-danger':getError('triggerResponse'), 'is-success': !getError('triggerResponse'),  'is-completed':isVisited('triggerResponse')}">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  Trigger &amp; Response
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.inject.description'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>
          <div class="card">
            <div class="card-content">
              <form data-vv-scope="triggerResponse"
                    v-on:submit.prevent>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-full">
                        <div class="field">
                          <label class="label">
                            Trigger
                          </label>
                          <div class="control">
                            <textarea class="textarea"
                                      v-model="planInject.trigger"
                                      placeholder="Describe the trigger to drive the anticipated response"></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-full">
                        <div class="field">
                          <label class="label">
                            Anticipated Response
                          </label>
                          <div class="control">
                            <textarea class="textarea"
                                      v-model="planInject.response"
                                      placeholder="The expected action of the training audience"></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-full">
                        <div class="field">
                          <label class="label">
                            Remarks
                          </label>
                          <div class="control">
                            <textarea class="textarea"
                                      v-model="planInject.remarks"
                                      placeholder="Additional information to support the inject"></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-full"
                       v-if="fileList">
                    <div class="columns">
                      <div class="column is-full">
                        <div class="field">
                          <label class="label">
                            Attachments
                          </label>
                          <div class="control">
                            <FileUploader :fileList.sync="fileList" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column is-8">
                    <date-picker label="Response Time"
                                 :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                                 showClear
                                 showNow
                                 v-model="planInject.responseDate"
                                 @now="(value) => {planInject.responseDate = value}"
                                 @clear="(value) => {planInject.responseDate = value}"
                                 @changed="(value) => {planInject.responseDate = value}" />
                  </div>
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-full">
                        <div class="field">
                          <label class="label">
                            Actual Response
                          </label>
                          <div class="control">
                            <textarea class="textarea"
                                      v-model="planInject.mitigation"
                                      placeholder="Describe the response of the training audience"></textarea>
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
        <stepper-item label="Location"
                      :classList="{'is-danger':getError('location'), 'is-success': !getError('location'),  'is-completed':isVisited('location')}">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  Location
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.inject.location'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>
          <div class="card">
            <div class="card-content">
              <form data-vv-scope="location"
                    v-on:submit.prevent>
                <div class="columns is-multiline">
                  <div class="column is-half">
                    <div class="field">
                      <label class="label">
                        Training Area
                      </label>
                      <MapLocationPicker v-model="mapData" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </stepper-item>
        <stepper-item label="Objectives &amp; Methods"
                      :classList="{'is-danger':getError('injectObjectives'), 'is-success': !getError('injectObjectives'),  'is-completed':isVisited('injectObjectives')}">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  Objectives &amp; Methods
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.inject.objectives'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>
          <div class="card">
            <form data-vv-scope="injectParticipants"
                  v-on:submit.prevent>
              <div class="card-content">
                <div class="card objective-section">
                  <div class="card-header">
                    <p class="card-header-title">
                      Assigned Training Objectives: {{planInject.objectives ? planInject.objectives.length : 0}}
                    </p>
                  </div>
                  <nav class="level">
                    <div class="level-left">
                    </div>
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
                  </nav>
                  <div>
                    <b-table :data="planInject.objectives"
                             paginated
                             :per-page="perPage"
                             :current-page.sync="currentPageAssigned"
                             :pagination-simple="isPaginationSimple"
                             :default-sort-direction="defaultSortDirection"
                             detailed
                             detail-key="id"
                             default-sort="name">
                      <template slot-scope="props">
                        <b-table-column field="participant.name"
                                        label="Participant"
                                        centered
                                        sortable>
                          {{ props.row.participant ? props.row.participant.name : "None" }}
                        </b-table-column>
                        <b-table-column field="platform.platform.title"
                                        label="Platform: Type"
                                        centered
                                        sortable>
                          {{props.row.platform && props.row.platform.platform ? props.row.platform.platform.title +': ' + props.row.platform.platform.type : "None"}}
                        </b-table-column>
                        <b-table-column field="jmet.description"
                                        label="JMET"
                                        sortable>
                          <span v-if="props.row.jmet">{{ props.row.jmet.description }}</span>
                        </b-table-column>
                        <b-table-column field="priorityLevel.title"
                                        label="Priority"
                                        centered
                                        sortable>
                          <span class="tag"
                                :style="'background-color:'+props.row.priorityLevel.color"
                                v-if="props.row.priorityLevel">
                            {{ props.row.priorityLevel ? props.row.priorityLevel.title: 'None'}}
                          </span>
                        </b-table-column>
                        <b-table-column field="requiredRuns"
                                        label="Inject Count/ Required Runs">
                          {{ props.row.injects ? props.row.injects.length : "" }}/{{ props.row.requiredRuns ? props.row.requiredRuns : "" }}
                        </b-table-column>
                        <b-table-column field="requestedMethodType.title"
                                        label="Requested Method"
                                        centered
                                        sortable>
                          {{ props.row.requestedMethodType ? props.row.requestedMethodType.title : "None" }}
                        </b-table-column>
                        <b-table-column field="trainedMethodType.title"
                                        label="Training Method"
                                        centered>
                          <div class="field">
                            <div class="control is-expanded">
                              <multiselect v-model="props.row.trainedMethodType"
                                           track-by="id"
                                           label="title"
                                           placeholder="Select Method"
                                           :options="planTrainedMethodTypes"
                                           @select="updateTrainedMethodType($event, props.row.id)">
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
                        </b-table-column>
                        <b-table-column>
                          <button class="button is-small is-danger is-rounded"
                                  @click="objectiveInteraction(props.row.id, 'disconnect')">
                            <span class="icon is-small">
                              <i class="fas fa-minus"></i>
                            </span>
                          </button>
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
                                    Task
                                  </label>
                                  <pre class="content">{{props.row.task}}</pre>
                                </div>
                                <div class="column is-full">
                                  <label class="label">
                                    Condition
                                  </label>
                                  <pre class="content">{{props.row.condition}}</pre>
                                </div>
                                <div class="column is-full">
                                  <label class="label">
                                    Standard
                                  </label>
                                  <pre class="content">{{props.row.standard}}</pre>
                                </div>
                                <div class="column is-full">
                                  <label class="label">
                                    Measures
                                  </label>
                                  <ul class="bd-anchors-list"
                                      v-if="props.row.measures.length > 0">
                                    <li v-for="(measure,$index) in props.row.measures"
                                        :key="measure.id">M{{$index+1}} - {{measure.title}}</li>
                                  </ul>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                              </div>
                              <div class="columns">
                                <div class="column is-one-half">
                                  <label class="label">
                                    Command Training Priorities
                                  </label>
                                  <div v-if="props.row.commandTrainingPriority.length > 0">
                                    <ul class="bd-anchors-list">
                                      <li v-for="commandPriority in props.row.commandTrainingPriority"
                                          v-bind:key="commandPriority.id">
                                        <p>
                                          <span class="subtitle is-6">{{commandPriority.title}}</span>
                                        </p>
                                      </li>
                                    </ul>
                                  </div>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                                <div class="column is-one-half">
                                  <label class="label">
                                    Joint Staff Training Priorities
                                  </label>
                                  <div v-if="props.row.jointStaffTrainingPriority.length > 0">
                                    <ul class="bd-anchors-list">
                                      <li v-for="priority in props.row.jointStaffTrainingPriority"
                                          v-bind:key="priority.id">
                                        <p>
                                          <span class="subtitle is-6">{{priority.title}}</span>
                                        </p>
                                      </li>
                                    </ul>
                                  </div>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                              </div>
                              <div class="columns is-multiline">
                                <div class="column is-half">
                                  <label class="label">
                                    Exercise Objectives
                                  </label>
                                  <div v-if="props.row.exerciseObjective.length > 0">
                                    <ul class="bd-anchors-list">
                                      <li v-for="exerciseObjective in props.row.exerciseObjective"
                                          v-bind:key="exerciseObjective.id">
                                        <p>
                                          <span class="subtitle is-6">{{exerciseObjective.title}}</span>
                                        </p>
                                      </li>
                                    </ul>
                                  </div>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                                <div class="column is-half">
                                  <label class="label">
                                    Accredited Tasks
                                  </label>
                                  <div v-if="props.row.accreditedTask.length > 0">
                                    <ul class="bd-anchors-list">
                                      <li v-for="accTask in props.row.accreditedTask"
                                          v-bind:key="accTask.id">
                                        <p class="subtitle is-6">{{accTask.jmet.description}}</p>
                                      </li>
                                    </ul>
                                  </div>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                                <div class="column is-full">
                                  <label class="label">
                                    Associated Injects
                                  </label>

                                  <ul class="bd-anchors-list"
                                      v-if="props.row.injects.length > 0">
                                    <li v-for="inject in props.row.injects"
                                        v-bind:key="inject.id">
                                      <p class="subtitle is-6 is-link inject-link">
                                        #{{inject.number}} -
                                        {{inject.title}} -
                                        {{formatDate(inject.startDate, 'dtg')}}
                                        <span v-if="inject.status"> -
                                          <span class="tag is-rounded"
                                                :style="'background-color:'+inject.status.color"
                                                :class="lightOrDark(inject.status.color)">{{inject.status ? inject.status.title : ''}}</span>
                                        </span>
                                      </p>
                                    </li>
                                  </ul>
                                  <div v-else
                                       class="no-result apollo">
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      </template>
                      <template slot="empty">
                        <div class="content">
                          <figure>
                            <div class="card-content">
                              <div class="card-header-title is-centered">
                                <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                              </div>
                              <p class="subtitle has-text-centered"
                                 v-if="assignedTrainingObj.length < 0">
                                No Training Objectives Assigned
                              </p>
                              <p class="subtitle has-text-centered"
                                 v-else>
                                No Training Objectives found. Try a different search or add a new entry.
                              </p>
                            </div>
                          </figure>
                        </div>
                      </template>
                    </b-table>
                  </div>
                </div>
                <div class="card objective-section">
                  <div class="card-header">
                    <p class="card-header-title">
                      Available Training Objectives: {{planTrainingObjectives ? planTrainingObjectives.length : 0}}
                    </p>
                  </div>
                  <nav class="level">
                    <div class="level-left">
                      <div class="level-item">
                        <div class="field">
                          <p class="control has-icons-left has-icons-right">
                            <input class="input is-rounded is-primary"
                                   type="text"
                                   placeholder="Search..."
                                   v-model.lazy="searchQuery.unassigned">
                            <span class="icon is-small is-left">
                              <i class="fas fa-search"></i>
                            </span>
                            <span class="icon is-small is-right"
                                  @click="searchQuery.unassigned = ''">
                              <i class="fas fa-times-circle"></i>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
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
                  </nav>
                  <div>
                    <b-table :data="planTrainingObjectives"
                             :paginated="isPaginated"
                             :per-page="perPage"
                             :current-page.sync="currentPageUnassigned"
                             :pagination-simple="isPaginationSimple"
                             :default-sort-direction="defaultSortDirection"
                             detailed
                             detail-key="id"
                             default-sort="participant.name">
                      <template slot-scope="props">
                        <b-table-column field="participant.name"
                                        label="Participant"
                                        centered
                                        sortable>
                          {{ props.row.participant ? props.row.participant.name : "None" }}
                        </b-table-column>
                        <b-table-column field="platform.platform.title"
                                        label="Platform: Type"
                                        centered
                                        sortable>
                          {{props.row.platform && props.row.platform.platform && props.row.platform.platform.title ? props.row.platform.platform.title +': ' + props.row.platform.platform.type : "None"}}
                        </b-table-column>
                        <b-table-column field="jmet.description"
                                        label="JMET"
                                        sortable>
                          {{ props.row.jmet ? props.row.jmet.description : "None" }}
                        </b-table-column>
                        <b-table-column field="priorityLevel.title"
                                        label="Priority"
                                        centered
                                        sortable>
                          <span class="tag"
                                :style="'background-color:'+props.row.priorityLevel.color"
                                v-if="props.row.priorityLevel && props.row.priorityLevel.title">
                            {{ props.row.priorityLevel.title}}
                          </span>
                        </b-table-column>
                        <b-table-column field="requiredRuns"
                                        label="Inject Count/ Required Runs">
                          {{ props.row.injects ? props.row.injects.length : "" }}/{{ props.row.requiredRuns ? props.row.requiredRuns : "" }}
                        </b-table-column>
                        <b-table-column field="requestedMethodType.title"
                                        label="Requested Method"
                                        centered
                                        sortable>
                          {{ props.row.requestedMethodType ? props.row.requestedMethodType.title : "None" }}
                        </b-table-column>
                        <b-table-column>
                          <button class="button is-small is-success is-rounded"
                                  @click="objectiveInteraction(props.row.id, 'connect')">
                            <span class="icon is-small">
                              <i class="fas fa-plus"></i>
                            </span>
                          </button>
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
                                    Task
                                  </label>
                                  <pre class="content">{{props.row.task}}</pre>
                                </div>
                                <div class="column is-full">
                                  <label class="label">
                                    Condition
                                  </label>
                                  <pre class="content">{{props.row.condition}}</pre>
                                </div>
                                <div class="column is-full">
                                  <label class="label">
                                    Standard
                                  </label>
                                  <pre class="content">{{props.row.standard}}</pre>
                                </div>
                                <div class="column is-full">
                                  <label class="label">
                                    Measures
                                  </label>
                                  <ul class="bd-anchors-list"
                                      v-if="props.row.measures.length > 0">
                                    <li v-for="(measure,$index) in props.row.measures"
                                        :key="measure.id">M{{$index+1}} - {{measure.title}}</li>
                                  </ul>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                              </div>
                              <div class="columns">
                                <div class="column is-one-half">
                                  <label class="label">
                                    Command Training Priorities
                                  </label>
                                  <div v-if="props.row.commandTrainingPriority.length > 0">
                                    <ul class="bd-anchors-list">
                                      <li v-for="commandPriority in props.row.commandTrainingPriority"
                                          v-bind:key="commandPriority.id">
                                        <p>
                                          <span class="subtitle is-6">{{commandPriority.title}}</span>
                                        </p>
                                      </li>
                                    </ul>
                                  </div>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                                <div class="column is-one-half">
                                  <label class="label">
                                    Joint Staff Training Priorities
                                  </label>
                                  <div v-if="props.row.jointStaffTrainingPriority.length > 0">
                                    <ul class="bd-anchors-list">
                                      <li v-for="priority in props.row.jointStaffTrainingPriority"
                                          v-bind:key="priority.id">
                                        <p>
                                          <span class="subtitle is-6">{{priority.title}}</span>
                                        </p>
                                      </li>
                                    </ul>
                                  </div>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                              </div>
                              <div class="columns is-multiline">
                                <div class="column is-half">
                                  <label class="label">
                                    Exercise Objectives
                                  </label>
                                  <div v-if="props.row.exerciseObjective.length > 0">
                                    <ul class="bd-anchors-list">
                                      <li v-for="exerciseObjective in props.row.exerciseObjective"
                                          v-bind:key="exerciseObjective.id">
                                        <p>
                                          <span class="subtitle is-6">{{exerciseObjective.title}}</span>
                                        </p>
                                      </li>
                                    </ul>
                                  </div>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                                <div class="column is-half">
                                  <label class="label">
                                    Accredited Tasks
                                  </label>
                                  <div v-if="props.row.accreditedTask.length > 0">
                                    <ul class="bd-anchors-list">
                                      <li v-for="accTask in props.row.accreditedTask"
                                          v-bind:key="accTask.id">
                                        <p class="subtitle is-6">{{accTask.jmet.description}}</p>
                                      </li>
                                    </ul>
                                  </div>
                                  <div v-else>
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                                <div class="column is-full">
                                  <label class="label">
                                    Associated Injects
                                  </label>

                                  <ul class="bd-anchors-list"
                                      v-if="props.row.injects.length > 0">
                                    <li v-for="inject in props.row.injects"
                                        v-bind:key="inject.id">
                                      <p class="subtitle is-6 is-link inject-link">
                                        #{{inject.number}} -
                                        {{inject.title}} -
                                        {{formatDate(inject.startDate, 'dtg')}}
                                        <span v-if="inject.status"> -
                                          <span class="tag is-rounded"
                                                :style="'background-color:'+inject.status.color"
                                                :class="lightOrDark(inject.status.color)">{{inject.status ? inject.status.title : ''}}</span>
                                        </span>
                                      </p>
                                    </li>
                                  </ul>
                                  <div v-else
                                       class="no-result apollo">
                                    <p class="subtitle is-6">None</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      </template>
                      <template slot="empty">
                        <div class="content">
                          <figure>
                            <div class="card-content">
                              <div class="card-header-title is-centered">
                                <i class="fas fa-clipboard-list fa-3x has-text-primary"></i>
                              </div>
                              <p class="subtitle has-text-centered">
                                No Training Objectives found. Try a different search or add a new entry.
                              </p>
                            </div>
                          </figure>
                        </div>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </stepper-item>
        <stepper-item label="Review"
                      icon="fas fa-check">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  Review MSEL Inject
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.inject.review'"
                              toggle
                              dropdown />
              </div>
            </div>
          </nav>

          <div class="card review">
            <div class="card-content">
              <div class="columns is-multiline">
                <div class="column is-full">
                  <label class="label is-size-4">
                    Inject Details
                  </label>
                  <div class="columns is-multiline">
                    <div class="column is-one-quarter">
                      <div class="field">
                        <label class="label">
                          Title
                        </label>
                        <p class="control">{{planInject.title}}</p>
                      </div>
                    </div>
                    <div class="column is-one-quarter">
                      <div class="field">
                        <label class="label">
                          Status
                        </label>
                        <p class="control">{{planInject.status ? planInject.status.title : "None"}}</p>
                      </div>
                    </div>
                    <div class="column is-one-quarter">
                      <div class="field">
                        <label class="label">
                          Event
                        </label>
                        <p class="control">{{planInject.events ? planInject.events.name: "None"}}</p>
                      </div>
                    </div>
                    <div class="column is-one-quarter">
                      <div class="field">
                        <label class="label">
                          Date and Time
                        </label>
                        <p class="control">{{formatDate(planInject.startDate, 'dtg')}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-multiline">
                    <div class="column is-one-quarter">
                      <div class="field">
                        <label class="label">
                          Type
                        </label>
                        <p class="control">{{planInject.type ? planInject.type: "None"}}</p>
                      </div>
                    </div>
                    <div class="column is-one-quarter">
                      <div class="field">
                        <label class="label">
                          Owner
                        </label>
                        <p class="control">{{injectOwner ? injectOwner.title: "None"}}</p>
                      </div>
                    </div>
                    <div class="column is-one-quarter">
                      <div class="field">
                        <label class="label">
                          From
                        </label>
                        <p class="control">{{planInject.from ? planInject.from: "None"}}</p>
                      </div>
                    </div>
                    <div class="column is-one-quarter">
                      <div class="field">
                        <label class="label">
                          To
                        </label>
                        <p class="control">{{planInject.to ? planInject.to: "None"}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-multiline">
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Inject Method
                        </label>
                        <p class="control"
                           v-if="method">
                          <span class="icon is-small"
                                v-if="method && method.icon"
                                :key="method.icon">
                            <i :class="method.icon"
                               :style="'color:'+method.color"
                               v-if="method && method.color"></i>
                          </span>
                          <span v-if="method"> {{ method.name | truncate(50)}}</span>
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns is-multiline">
                <div class="column is-full">
                  <label class="label is-size-4">
                    Description &amp; Measures
                  </label>
                  <div class="columns">
                    <div class="column is-full">
                      <div class="field">
                        <label class="label">
                          Trigger
                        </label>
                        <p class="control">{{planInject.trigger ? planInject.trigger: "None"}}</p>
                      </div>
                      <div class="field">
                        <label class="label">
                          Anticipated Response
                        </label>
                        <p class="control">{{planInject.response ? planInject.response: "None"}}</p>
                      </div>
                      <div class="field">
                        <label class="label">
                          Remarks
                        </label>
                        <p class="control">{{planInject.remarks ? planInject.remarks: "None"}}</p>
                      </div>
                      <div class="field attachments">
                        <p class="title is-6">Attachments</p>
                        <table class="table is-6"
                               v-if="fileList && fileList.length>0">
                          <tr v-for="attachment in fileList"
                              v-bind:key="attachment.id">
                            <td><i :class="getIcon(attachment.contentType) + ' fa-2x'"></i></td>
                            <td><a class="subtitle is-6"
                                   :href="attachment.url.raw"
                                   target="_blank">
                              {{attachment.name}}
                            </a></td>
                            <td>
                              <a class="subtitle is-6"
                                 @click="generateDownloadBlob(attachment)">
                                <span class="icon is-small">
                                  <i class="fas fa-download"></i>
                                </span>
                              </a>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div class="field">
                        <label class="label">
                          Response Time
                        </label>
                        <span class="tooltip"
                              :data-tooltip="formatDate(planInject.responseDate, 'utc-dtg')"
                              v-if="planInject.responseDate">{{planInject.responseDate ? formatDate(planInject.responseDate, 'dtg') : "None"}}</span>
                      </div>
                      <div class="field">
                        <label class="label">
                          Actual Response
                        </label>
                        <p class="control">{{planInject.mitigation ? planInject.mitigation: "None"}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns is-multiline">
                <div class="column is-full">
                  <label class="label is-size-4">
                    Location
                  </label>
                  <div class="columns is-multiline">
                    <div class="column is-one-quarter">
                      <div class="field">
                        <label class="label">
                          Location
                        </label>
                        <p class="control">
                          <geocode :coordinates="planInject.location.geojson.coordinates"
                                   v-if="planInject.location"></geocode>
                          <span v-else>None</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-full">
                  <label class="label is-size-4">
                    Objectives &amp; Methods
                  </label>
                  <div v-if="planInject.objectives && planInject.objectives.length > 0">
                    <section>
                      <b-table :data="planInject.objectives">
                        <template slot-scope="props">
                          <b-table-column field="participant.name"
                                          label="Participant"
                                          class="is-size-6"
                                          centered
                                          sortable>
                            {{ props.row.participant ? props.row.participant.name : "None" }}
                          </b-table-column>
                          <b-table-column field="platform.platform.title"
                                          label="Platform: Type"
                                          class="is-size-6"
                                          centered
                                          sortable>
                            {{props.row.platform && props.row.platform.platform ? props.row.platform.platform.title +': ' + props.row.platform.platform.type : "None"}}
                          </b-table-column>
                          <b-table-column field="jmet.description"
                                          label="JMET"
                                          class="is-size-6"
                                          sortable>
                            <span v-if="props.row.jmet">{{ props.row.jmet.description }}</span>
                          </b-table-column>
                        </template>
                      </b-table>
                    </section>
                  </div>
                  <div v-else
                       class="column is-full">
                    <div class="content has-text-black has-text-centered">
                      <p>No Objectives &amp; Methods.</p>
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
      <empty-state :data="planInjects"
                   :isLoading='$apollo.loading' />
    </div>
    <method-interaction v-if="openMethodDialog"
                        :open="openMethodDialog"
                        :method="selectedMethod"
                        @close="closeMethodDialog"
                        @addRecord="value=>{method = value}"/>
  </div>
</template>

<script>
import {
  PlanMethodsRead,
  PlanMethodsSubscription
} from '@/plan/graphql/PlanMethods.gql'

import {
  PlanInjectOwnersCreate,
  PlanInjectOwnersRead,
  PlanInjectOwnersSubscription
} from '@/plan/graphql/PlanInjectOwners.gql'

import {
  PlanInjectsRead,
  PlanInjectsUpdate,
  PlanInjectsSubscription
} from '@/plan/graphql/PlanInjects.gql'

import {
  PlanTrainingObjectivesList,
  PlanTrainingObjectiveSubscription
} from '@/plan/graphql/PlanTrainingObjectives.gql'
import { PlanTrainedMethodTypesRead } from '@/plan/graphql/PlanTrainedMethodTypes.gql'
import { PlanEventsList, PlanEventsCounts } from '@/plan/graphql/PlanEvents.gql'
import { PlanLabelsRead } from '@/plan/graphql/PlanLabels.gql'

import HelpContent from '@/shared/components/helpcontent'
import MethodInteraction from '@/admin/components/method-interaction'
import MapLocationPicker from '@/shared/components/maplocationpicker'
import FileUploader from '@/shared/components/file-uploader'
import DatePicker from '@/shared/components/datepicker'
import { serverError } from '@/shared/serverError'
import Geocode from '@/shared/components/geocode'
import injectStatusCheck from '@/shared/mixins/injectStatusCheck'
import lightOrDark from '@/shared/mixins/lightOrDark'
import helpers from '@/shared/mixins/helpers'
import file from '@/shared/mixins/file'
import mediaCheck from '@/shared/mixins/mediaCheck'
import PlanInject from '@/plan/model/planinject'

export default {
  name: 'manage-inject',
  props: {
    number: null,
    type: Number
  },
  mixins: [helpers, lightOrDark, file, mediaCheck, injectStatusCheck],
  components: {
    DatePicker,
    HelpContent,
    MapLocationPicker,
    Geocode,
    FileUploader,
    MethodInteraction
  },
  apollo: {
    planLabels: {
      query: PlanLabelsRead,
      variables() {
        return {
          where: {
            title_contains: this.searchQuery.status
          }
        }
      },
      update(data) {
        if (data && data.planLabels) {
          return data.planLabels
        }
      }
    },
    planInjects: {
      query: PlanInjectsRead,
      variables() {
        return this.planInjectReadVariables()
      },
      update(data) {
        if (data && data.planInjects && data.planInjects[0] && this.number) {
          this.planInject = JSON.parse(
            JSON.stringify(data.planInjects[0]),
            this.omitTypename
          )
          if (this.planInject.location) {
            this.mapData = JSON.parse(
              JSON.stringify(data.planInjects[0].location),
              this.omitTypename
            )
          }
          if (this.planInject.objectives) {
            this.assignedTrainingObj = data.planInjects[0].objectives.map(
              obj => obj.id
            )
          }
          if (
            this.planInject.attachments &&
            this.planInject.attachments.length > 0
          )
            this.fileList = this.planInject.attachments
          else this.fileList = []
          this.injectOwner = this.planInject.owner
          this.method = this.planInject.method
          return data.planInjects[0]
        }
      },
      subscribeToMore: {
        document: PlanInjectsSubscription,
        // Mutate the previous result
        variables() {
          return {
            node: this.planInjectReadVariables()
          }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planInject.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planInjects: [
                  subscriptionData.data.planInject.node,
                  ...previousResult.planInjects
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planInjects: [
                  ...previousResult.planInjects.filter(
                    obj =>
                      subscriptionData.data.planInject.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanInjects = JSON.parse(
                JSON.stringify(previousResult.planInjects)
              )
              let index = newPlanInjects.findIndex(
                x => x.id === subscriptionData.data.planInject.node.id
              )
              newPlanInjects[index] = subscriptionData.data.planInject.node
              newResult = {
                planInjects: newPlanInjects
              }
              break
            }
            default: {
              throw new Error(`Unknown planInject mutation`)
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
            AND: [{ type: null }, { name_contains: this.searchQuery.events }]
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
    planEvents: {
      query: PlanEventsList,
      variables() {
        return {
          where: {
            AND: [{ type: null }, { name_contains: this.searchQuery.events }]
          },
          first: this.first
        }
      },
      update(data) {
        if (data && data.planEvents) {
          return data.planEvents
        }
      }
    },
    planMethods: {
      query: PlanMethodsRead,
      variables() {
        return {
          where: {
            name_contains: this.searchQuery.methods
          }
        }
      },
      update(data) {
        if (data && data.planMethods) {
          return data.planMethods
        }
      },
      subscribeToMore: {
        document: PlanMethodsSubscription,
        variables() {
          return {
            where: {
              node: { name_contains: this.searchQuery.methods }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planMethod.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planMethods: [
                  subscriptionData.data.planMethod.node,
                  ...previousResult.planMethods
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planMethods: [
                  ...previousResult.planMethods.filter(
                    obj =>
                      subscriptionData.data.planMethod.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanMethods = JSON.parse(
                JSON.stringify(previousResult.planMethods)
              )
              let index = newPlanMethods.findIndex(
                x => x.id === subscriptionData.data.planMethod.node.id
              )
              newPlanMethods[index] = subscriptionData.data.planMethod.node
              newResult = {
                planMethods: newPlanMethods
              }
              break
            }
            default: {
              throw new Error(`Unknown Reason mutation`)
            }
          }
          return newResult
        }
      }
    },
    planTrainedMethodTypes: {
      query: PlanTrainedMethodTypesRead,
      update(data) {
        if (data && data.planTrainedMethodTypes) {
          return data.planTrainedMethodTypes
        }
      }
    },
    planInjectOwners: {
      query: PlanInjectOwnersRead,
      variables() {
        return {
          where: {
            title_contains: this.searchQuery.injectOwners
          }
        }
      },
      update(data) {
        if (data && data.planInjectOwners) return data.planInjectOwners
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanInjectOwnersSubscription,
        variables() {
          return {
            node: {
              where: {
                title_contains: this.searchQuery.injectOwners
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planInjectOwner.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planInjectOwners: [
                  subscriptionData.data.planInjectOwner.node,
                  ...previousResult.planInjectOwners
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planInjectOwners: [
                  ...previousResult.planInjectOwners.filter(
                    obj =>
                      subscriptionData.data.planInjectOwner.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanInjectOwners = JSON.parse(
                JSON.stringify(previousResult.planInjectOwners)
              )
              let index = newPlanInjectOwners.findIndex(
                x => x.id === subscriptionData.data.planInjectOwner.node.id
              )
              newPlanInjectOwners[index] =
                subscriptionData.data.planInjectOwner.node
              newResult = {
                planInjectOwners: newPlanInjectOwners
              }
              break
            }
            default: {
              throw new Error(`Unknown mutation`)
            }
          }
          return newResult
        }
      }
    },
    planTrainingObjectives: {
      query: PlanTrainingObjectivesList,
      update(data) {
        if (data && data.planTrainingObjectives) {
          return data.planTrainingObjectives
        }
      },
      variables() {
        return this.trainingObjectiveReadVariables()
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanTrainingObjectiveSubscription,
        variables() {
          return {
            node: this.trainingObjectiveReadVariables()
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planTrainingObjective.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planTrainingObjectives: [
                  subscriptionData.data.planTrainingObjective.node,
                  ...previousResult.planTrainingObjectives
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planTrainingObjectives: [
                  ...previousResult.planTrainingObjectives.filter(
                    obj =>
                      subscriptionData.data.planTrainingObjective.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanTrainingObjectives = JSON.parse(
                JSON.stringify(previousResult.planTrainingObjectives)
              )
              let index = newPlanTrainingObjectives.findIndex(
                x =>
                  x.id === subscriptionData.data.planTrainingObjective.node.id
              )
              newPlanTrainingObjectives[index] =
                subscriptionData.data.planTrainingObjective.node
              newResult = {
                planTrainingObjectives: newPlanTrainingObjectives
              }
              break
            }
            default: {
              throw new Error(`Unknown trainingObjective mutation`)
            }
          }
          return newResult
        }
      }
    }
  },
  data() {
    return {
      first: 75,
      showAll: false,
      method: null,
      injectOwner: null,
      fileList: null,
      injectType: ['Key', 'Enabling', 'Supporting'],
      searchQuery: {
        methods: '',
        injectOwners: '',
        unassigned: '',
        events: '',
        status: ''
      },
      openMethodDialog: false,
      selectedMethod: null,
      assignedTrainingObj: [],
      planLabels: [],
      planInjects: [],
      planEvents: [],
      planInjectOwners: [],
      planInject: new PlanInject(),
      mapData: null,
      stepIndex: this.$route.query.step ? parseInt(this.$route.query.step) : 0,
      stepValidation: {
        details: {
          errors: false,
          visited: false,
          index: 0
        },
        triggerResponse: {
          errors: false,
          visited: false,
          index: 1
        },
        location: {
          errors: false,
          visited: false,
          index: 2
        },
        injectObjectives: {
          errors: false,
          visited: false,
          index: 3
        },
        review: {
          visited: false
        }
      },
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPageUnassigned: 1,
      currentPageAssigned: 1,
      perPage: 15
    }
  },
  methods: {
    handleSelectStatusCheck() {
      this.injectStatusCheck(this.planInject)
    },
    toggleEvents(state) {
      this.showAll = state
      if (state == true) {
        this.first = null
      } else {
        this.first = 75
      }
    },
    planInjectReadVariables() {
      let data = {
        where: {
          number: parseInt(this.number)
        }
      }
      return data
    },
    trainingObjectiveReadVariables() {
      let data = {
        where: {
          AND: [{ id_not_in: this.assignedTrainingObj }],
          OR: [
            {
              platform: {
                platform: {
                  OR: [
                    { title_contains: this.searchQuery.unassigned },
                    { type_contains: this.searchQuery.unassigned }
                  ]
                }
              }
            },
            { participant: { name_contains: this.searchQuery.unassigned } },
            { jmet: { description_contains: this.searchQuery.unassigned } },
            { task_contains: this.searchQuery.unassigned },
            { condition_contains: this.searchQuery.unassigned },
            { standard_contains: this.searchQuery.unassigned }
          ]
        }
      }
      return data
    },
    updateTrainedMethodType(trainedMethodType, objId) {
      this.$apollo
        .mutate({
          mutation: PlanInjectsUpdate,
          variables: {
            where: {
              id: this.planInject.id
            },
            data: {
              objectives: {
                update: {
                  where: {
                    id: objId
                  },
                  data: {
                    trainedMethodType: { connect: { id: trainedMethodType.id } }
                  }
                }
              }
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          this.$apollo.queries.planInjects.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Update Trained Method: ' + error)
        })
    },
    objectiveInteraction(id, action) {
      let dataVariables
      switch (action) {
        case 'disconnect':
          dataVariables = {
            where: {
              id: this.planInject.id
            },
            data: {
              objectives: {
                disconnect: {
                  id: id
                }
              }
            }
          }
          break
        case 'connect':
          dataVariables = {
            where: {
              id: this.planInject.id
            },
            data: {
              objectives: {
                connect: {
                  id: id
                }
              }
            }
          }
          break
      }
      if (dataVariables)
        this.$apollo
          .mutate({
            mutation: PlanInjectsUpdate,
            variables: dataVariables
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
            this.$apollo.queries.planInjects.refetch()
            this.$apollo.queries.planTrainingObjectives.refetch()
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('Inject Training Objective Interaction: ' + error)
          })
    },
    search(table, term) {
      switch (table) {
        case 'methods':
          this.searchQuery.methods = term
          break
        case 'injectOwners':
          this.searchQuery.injectOwners = term
          break
        case 'events':
          this.searchQuery.events = term
          break
        case 'status':
          this.searchQuery.status = term
          break
      }
    },
    showAddValue(name) {
      if (name && name === 'injectOwners') {
        this.$buefy.dialog.prompt({
          message: 'Inject Owner',
          inputAttrs: {
            placeholder: '',
            maxlength: 75
          },
          confirmText: 'Add',
          onConfirm: value => this.addValueToDB(name, value)
        })
      }
    },
    addValueToDB(name, value) {
      if (name && name === 'injectOwners') {
        this.$apollo
          .mutate({
            mutation: PlanInjectOwnersCreate,
            variables: {
              data: {
                title: value
              }
            }
          })
          .then(response => {
            this.$buefy.toast.open({
              message: 'Added new value',
              type: 'is-success'
            })
            switch (name) {
              case 'injectOwners': {
                this.injectOwner = response.data.createPlanInjectOwner
                break
              }
            }
          })
      }
    },
    getError(val) {
      return this.stepValidation[val].errors
    },
    isVisited(val) {
      return this.stepValidation[val].visited
    },
    // Executed when @completed-step event is triggered
    onStepChange(value) {
      switch (value) {
        case 0:
          this.stepValidation['details'].visited = true
          this.$validator.validate('details.*').then(result => {
            if (result) {
              this.stepValidation['details'].errors = false
              this.updatePlanInject('Details', 'continue')
              return true
            } else {
              this.stepValidation['details'].errors = true
              this.$buefy.toast.open({
                message: 'Details Missing Info!',
                type: 'is-danger'
              })
              return false
            }
          })
          break
        case 1:
          this.stepValidation['triggerResponse'].visited = true
          this.$validator.validate('triggerResponse.*').then(result => {
            if (result) {
              this.stepValidation['triggerResponse'].errors = false
              this.updatePlanInject('Trigger/Response', 'continue')
              return true
            }
            this.stepValidation['triggerResponse'].errors = true
            this.$buefy.toast.open({
              message: 'Description & Measures Missing Info!',
              type: 'is-danger'
            })
            return false
          })
          break
        case 2:
          this.stepValidation['location'].visited = true
          this.$validator.validate('location.*').then(result => {
            if (result) {
              this.stepValidation['location'].errors = false
              this.updatePlanInject('Location', 'continue')
              return true
            }
            this.stepValidation['location'].errors = true
            this.$buefy.toast.open({
              message: 'Location Missing Info!',
              type: 'is-danger'
            })
            return false
          })
          break
        case 3:
          this.stepValidation['injectObjectives'].visited = true
          this.$validator.validate('injectObjectives.*').then(result => {
            if (result) {
              this.stepValidation['injectObjectives'].errors = false
              return true
            }
            this.stepValidation['injectObjectives'].errors = true
            this.$buefy.toast.open({
              message: 'Objectives Missing Info!',
              type: 'is-danger'
            })
            return false
          })
          break
        case 5:
          this.$apollo.queries.planInjects.refetch()
          break
      }
    },
    // Executed when @stepper-finished event is triggered
    onStepsCompleted() {
      // All steps have been navigated
      this.savePlanInject(null)
    },
    updatePlanInject(section, nextStep) {
      let finalInjectData
      let dbMapData
      switch (section) {
        case 'Details':
          // Status
          if (this.planInject.status) {
            finalInjectData = {
              ...finalInjectData,
              status: {
                connect: { id: this.planInject.status.id }
              }
            }
          }
          // Event
          if (this.planInject.events) {
            finalInjectData = {
              ...finalInjectData,
              events: {
                connect: { id: this.planInject.events.id }
              }
            }
          }
          // Other
          finalInjectData = {
            ...finalInjectData,
            title: this.planInject.title,
            type: this.planInject.type,
            to: this.planInject.to,
            from: this.planInject.from,
            startDate: this.planInject.startDate
          }
          // Owner
          if (this.injectOwner) {
            finalInjectData = {
              ...finalInjectData,
              owner: {
                connect: { id: this.injectOwner.id }
              }
            }
          } else {
            if (this.planInject.owner)
              finalInjectData = {
                ...finalInjectData,
                owner: {
                  disconnect: { id: this.planInject.owner.id }
                }
              }
          }
          // Method
          if (this.method) {
            finalInjectData = {
              ...finalInjectData,
              method: {
                connect: { id: this.method.id }
              }
            }
          } else {
            if (this.planInject.method)
              finalInjectData = {
                ...finalInjectData,
                method: {
                  disconnect: { id: this.planInject.method.id }
                }
              }
          }
          break
        case 'Trigger/Response':
          finalInjectData = {
            trigger: this.planInject.trigger,
            response: this.planInject.response,
            remarks: this.planInject.remarks,
            responseDate: this.planInject.responseDate,
            mitigation: this.planInject.mitigation
          }
          // Attachments
          if (this.fileList && this.fileList.length > 0) {
            let files = this.fileList.map(file => {
              return { id: file.id }
            })
            finalInjectData = {
              ...finalInjectData,
              attachments: {
                set: files
              }
            }
          }
          break
        case 'Location':
          if (this.planInject.location) {
            if (this.mapData) {
              dbMapData = {
                update: { geojson: this.mapData.geojson }
              }
            } else {
              dbMapData = { delete: true }
            }
          } else {
            if (this.mapData)
              dbMapData = {
                create: this.mapData
              }
          }
          if (dbMapData || this.planInject.location) {
            finalInjectData = { ...finalInjectData, location: dbMapData }
          }
          break
      }
      if (finalInjectData)
        this.savePlanInject(finalInjectData, section, nextStep)
    },
    savePlanInject(injectData, section, nextStep) {
      if (injectData !== null) {
        this.$apollo
          .mutate({
            mutation: PlanInjectsUpdate,
            variables: {
              data: injectData,
              where: {
                id: this.planInject.id
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
                path: this.$route.query
                  ? this.$route.query.from
                  : '/plan/prepare/injects-list'
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
            : '/plan/prepare/injects-list'
        })
      }
    },
    openCreateMethod() {
      this.openMethodDialog = true
    },
    closeMethodDialog() {
      this.openMethodDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.multiselect {
  .icon {
    margin: 0 10px;
  }
}
.review p.control {
  padding-left: 10px;
  word-wrap: break-word;
}
.card {
  .objective-section {
    .card-header {
      background-color: #038172;
    }
    .card-header-title {
      color: rgb(255, 255, 255);
    }
  }
  .review-section {
    .card-header {
      background-color: #038172;
    }
    .card-header-title {
      color: rgb(255, 255, 255);
    }
  }
}
</style>
