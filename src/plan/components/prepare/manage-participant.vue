<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="participant ? participant.name : ''" />
    <div v-if="participant && participant.id != null">
      <stepper v-model="stepIndex" 
               @previousStep="checkPrevious" 
               @steps-completed="onStepsCompleted" 
               @saveAndRoute="handleSaveAndRoute">
        <stepper-item label="Participant Details" 
                      :classList="{'is-danger':getError('details'), 'is-success': !getError('details'),  'is-completed':isVisited('details')}">

          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  {{planParticipant ? participant.name : ''}} Participant Details
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.participant.details'" 
                              toggle 
                              dropdown />
              </div>
            </div>
          </nav>

          <div class="card">
            <div class="card-content">
              <form data-vv-scope="details" 
                    v-on:submit.prevent>
                <div class="content">
                  <div class="columns is-multiline is-mobile">
                    <div class="column is-full">
                      <div class="columns">
                        <div class="column is-one-third">
                          <div class="field">
                            <label class="label">
                              Name
                            </label>
                            <div class="control">
                              <input class="input" 
                                     :name="'participantName'" 
                                     v-model="participant.name" 
                                     v-validate="'required'" 
                                     type="text" 
                                     placeholder="Participant Name" 
                                     :class="{'input': true, 'is-danger': errors.has('details.participantName') }" />
                              <span v-show="errors.has('details.participantName')" 
                                    class="help has-text-danger">Participant Name Required</span>
                            </div>
                          </div>
                        </div>
                        <div class="column is-one-third">
                          <div class="field">
                            <label class="label">
                              Participant Type
                            </label>
                            <div class="control is-expanded">
                              <multiselect v-model="participantType" 
                                           track-by="id" 
                                           placeholder="Participant Type" 
                                           :options="planParticipantTypes" 
                                           :searchable="true" 
                                           openDirection="bottom" 
                                           :close-on-select="true" 
                                           :internal-search="false" 
                                           @search-change="search('participantType', $event)">
                                <template class="multiselect_element" 
                                          slot="beforeList">
                                  <span class="multiselect__option" 
                                        @click="showAddValue('participantType')">
                                    <span> Add new... </span>
                                  </span>
                                  <hr class="dropdown-divider">
                                </template>
                                <template slot="singleLabel" 
                                          slot-scope="props">{{ props.option.title }}</template>
                                <template slot="option" 
                                          slot-scope="props">{{ props.option.title }}</template>
                                <template slot="noResult">
                                  No results found.
                                </template>
                              </multiselect>
                            </div>
                          </div>
                        </div>
                        <div class="column is-one-third">
                          <div class="field">
                            <label class="label">
                              Select an Icon
                            </label>
                            <div class="control">
                              <icon-picker v-model="participant.icon" 
                                           :position="'is-bottom-left'"></icon-picker>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="columns">
                        <div class="column is-4">
                          <div class="field">
                            <label class="label">
                              Service or Department
                            </label>
                            <div class="control is-expanded">
                              <multiselect v-model="service" 
                                           track-by="id" 
                                           placeholder="Service/Department" 
                                           :options="planParticipantServices" 
                                           :searchable="true" 
                                           openDirection="bottom" 
                                           :close-on-select="true" 
                                           :internal-search="false" 
                                           @search-change="search('serviceDepartment', $event)">
                                <template class="multiselect_element" 
                                          slot="beforeList">
                                  <span class="multiselect__option" 
                                        @click="showAddValue('serviceDepartment')">
                                    <span> Add new... </span>
                                  </span>
                                  <hr class="dropdown-divider">
                                </template>
                                <template slot="singleLabel" 
                                          slot-scope="props">{{ props.option.title }}</template>
                                <template slot="option" 
                                          slot-scope="props">{{ props.option.title }}</template>
                                <template slot="noResult">
                                  No results found.
                                </template>
                              </multiselect>
                            </div>
                          </div>
                        </div>
                        <div class="column is-4">
                          <div class="field">
                            <label class="label">
                              Service/Department Type
                            </label>
                            <div class="control is-expanded">
                              <multiselect v-model="serviceType" 
                                           track-by="id" 
                                           placeholder="Service/Department Type" 
                                           :options="planParticipantServiceTypes" 
                                           :searchable="true" 
                                           openDirection="bottom" 
                                           :close-on-select="true" 
                                           :internal-search="false" 
                                           @search-change="search('serviceDepartmentType', $event)">
                                <template class="multiselect_element" 
                                          slot="beforeList">
                                  <span class="multiselect__option" 
                                        @click="showAddValue('serviceDepartmentType')">
                                    <span> Add new... </span>
                                  </span>
                                  <hr class="dropdown-divider">
                                </template>
                                <template slot="singleLabel" 
                                          slot-scope="props">{{ props.option.title }}</template>
                                <template slot="option" 
                                          slot-scope="props">{{ props.option.title }}</template>
                                <template slot="noResult">
                                  No results found.
                                </template>
                              </multiselect>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="columns">
                        <div class="column is-4">
                          <div class="field">
                            <label class="label">
                              Command or Agency
                            </label>
                            <div class="control is-expanded">
                              <multiselect v-model="commandAgency" 
                                           label="title" 
                                           track-by="id" 
                                           placeholder="Command/Agency" 
                                           :options="planParticipantCommandAgencies" 
                                           :searchable="true" 
                                           openDirection="bottom" 
                                           :close-on-select="true" 
                                           :internal-search="false" 
                                           @search-change="search('commandAgency', $event)">
                                <template class="multiselect_element" 
                                          slot="beforeList">
                                  <span class="multiselect__option" 
                                        @click="showAddValue('commandAgency')">
                                    <span> Add new... </span>
                                  </span>
                                  <hr class="dropdown-divider">
                                </template>
                                <template slot="option" 
                                          slot-scope="props">{{ props.option.title }}</template>
                                <template slot="noResult">
                                  No results found.
                                </template>
                              </multiselect>
                            </div>
                          </div>
                        </div>
                        <div class="column is-4">
                          <div class="field">
                            <label class="label">
                              Home Station
                            </label>
                            <div class="control">
                              <input class="input" 
                                     v-model="participant.homeStation" 
                                     type="text" 
                                     placeholder="Home Station Location" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="columns">
                        <div class="column is-4">
                          <div class="field">
                            <label class="label">
                              Total Training Audience
                            </label>
                            <div class="control">
                              <input class="input" 
                                     v-validate="'numeric'" 
                                     :name="'totalAudience'" 
                                     v-model="participant.totalAudience" 
                                     type="text" 
                                     placeholder="Number of Trainees" 
                                     :class="{'input': true, 'is-danger': errors.has('details.totalAudience') }" />
                              <span v-show="errors.has('details.totalAudience')" 
                                    class="help has-text-danger">Numeric Values Only</span>
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
        <stepper-item label="Participant Platforms" 
                      :classList="{'is-danger':getError('platforms'), 'is-success': !getError('platforms'),  'is-completed':isVisited('platforms')}">

          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  {{planParticipant ? participant.name : ''}} Participant Platforms
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.participant.platforms'" 
                              toggle 
                              dropdown />
              </div>
            </div>
          </nav>

          <div class="card">
            <div class="card-content">
              <form data-vv-scope="platforms" 
                    v-on:submit.prevent>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-full">
                        <section class="level">
                          <div class="level-left">
                            <div class="level-item">
                              <span class="button is-primary" 
                                    @click="toggleTableModal(true,'new', 'platforms')">Add Platform</span>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-full">
                        <div class="card platform-section">
                          <div class="card-header">
                            <p class="card-header-title">
                              Participant Platforms: {{participant.platforms ? participant.platforms.length : 0}}
                            </p>
                          </div>
                          <div v-if="participant.platforms && participant.platforms.length > 0">
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
                              <b-table :data="participant.platforms" 
                                       paginated 
                                       :per-page="perPage" 
                                       :current-page.sync="currentPage" 
                                       :pagination-simple="isPaginationSimple" 
                                       :default-sort-direction="defaultSortDirection" 
                                       default-sort="platform.title">
                                <template slot-scope="props">
                                  <b-table-column field="platform.title" 
                                                  label="Platform Title"  
                                                  class="is-size-6" 
                                                  sortable>
                                    {{ props.row.platform.title }}
                                  </b-table-column>
                                  <b-table-column field="platform.type" 
                                                  label="Platform Type" 
                                                  sortable 
                                                  class="is-size-6">
                                    {{ props.row.platform.type }}
                                  </b-table-column>
                                  <b-table-column field="bedDown" 
                                                  label="Bed-down" 
                                                  sortable 
                                                  class="is-size-6">
                                    {{ props.row.bedDown ? props.row.bedDown : "None" }}
                                  </b-table-column>
                                  <b-table-column>
                                    <b-dropdown position="is-bottom-left" 
                                                class="is-pulled-right">
                                      <a class="button is-small" 
                                         slot="trigger">
                                        <span class="icon is-small">
                                          <i class="fas fa-ellipsis-v"></i>
                                        </span>
                                      </a>
                                      <b-dropdown-item @click="editTableValue('platforms',props.row)">
                                        <span class="icon is-small">
                                          <i class="fas fa-pen"></i>
                                        </span>
                                        <span>Edit Platform</span>
                                      </b-dropdown-item>
                                      <hr class="dropdown-divider">
                                      <b-dropdown-item @click="confirmDeleteValue('Platform', props.row)">
                                        <span class="icon is-small">
                                          <i class="fas fa-times has-text-danger"></i>
                                        </span>
                                        <span>Delete Platform</span>
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
                                    No Platforms
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
        <stepper-item label="Participant Planners" 
                      :classList="{'is-danger':getError('planners'), 'is-success': !getError('planners'),  'is-completed':isVisited('planners')}">

          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  {{planParticipant ? participant.name : ''}} Participant Planner(s)
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.participant.planners'" 
                              toggle 
                              dropdown />
              </div>
            </div>
          </nav>

          <div class="card">
            <div class="card-content">
              <form data-vv-scope="planners" 
                    v-on:submit.prevent>
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="columns">
                      <div class="column is-full">
                        <section class="level">
                          <div class="level-left">
                            <div class="level-item">
                              <span class="button is-primary" 
                                    @click="toggleTableModal(true,'new','planners')">Add Planner</span>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                    <div class="columns">
                      <div class="column is-full">
                        <div class="card funding-section">
                          <div class="card-header">
                            <p class="card-header-title">
                              Planners: {{participant.planners ? participant.planners.length : 0}}
                            </p>
                          </div>
                          <div v-if="participant.planners && participant.planners.length > 0">
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
                              <b-table :data="participant.planners" 
                                       paginated 
                                       :per-page="perPage" 
                                       :current-page.sync="currentPage" 
                                       :pagination-simple="isPaginationSimple">
                                <template slot-scope="props">
                                  <b-table-column field="name" 
                                                  label="Name" 
                                                  class="is-size-6" 
                                                  centered 
                                                  sortable>
                                    {{ props.row.name }}
                                  </b-table-column>
                                  <b-table-column field="email" 
                                                  label="Email" 
                                                  class="is-size-6" 
                                                  centered 
                                                  sortable>
                                    {{ props.row.email }}
                                  </b-table-column>
                                  <b-table-column field="phoneNumber" 
                                                  label="Phone Number" 
                                                  class="is-size-6" 
                                                  centered>
                                    {{ props.row.phoneNumber }}
                                  </b-table-column>
                                  <b-table-column field="isPrimary" 
                                                  label="Primary Contact " 
                                                  centered>
                                    <span v-if="props.row.isPrimary" 
                                          class="primary-check">
                                      <i class="fas fa-check fa-lg"></i>
                                    </span>
                                  </b-table-column>
                                  <b-table-column>
                                    <b-dropdown position="is-bottom-left" 
                                                class="is-pulled-right">
                                      <a class="button is-small" 
                                         slot="trigger">
                                        <span class="icon is-small">
                                          <i class="fas fa-ellipsis-v"></i>
                                        </span>
                                      </a>
                                      <b-dropdown-item @click="editTableValue('planners',props.row)">
                                        <span class="icon is-small">
                                          <i class="fas fa-pen"></i>
                                        </span>
                                        <span>Edit Planner</span>
                                      </b-dropdown-item>
                                      <hr class="dropdown-divider">
                                      <b-dropdown-item @click="confirmDeleteValue('Planner', props.row)">
                                        <span class="icon is-small">
                                          <i class="fas fa-times has-text-danger"></i>
                                        </span>
                                        <span>Delete Planner</span>
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
                                    No Planners
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
                  {{planParticipant ? participant.name : ''}} Funding Sources
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.participant.fundingsources'" 
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
                        <div class="card funding-section">
                          <div class="card-header">
                            <div class="card-header-title">
                              <nav class="level">
                                <div class="level-left">
                                  <div class="level-item">
                                    <span>Funding Sources: {{participant.fundings ? participant.fundings.length : 0}}</span>
                                  </div>
                                </div>
                                <div class="level-right">
                                  <div class="level-item">
                                    <span>Available Exercise Funding: {{ (availableFundingTotal - participantFundingAllocated) | formatNumber('currency')}} </span>
                                  </div>
                                </div>
                              </nav>      
                            </div>
                          </div>
                          <div v-if="participant.fundings && participant.fundings.length > 0">
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
                              <b-table :data="participant.fundings" 
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
                                    {{ props.row.primarySource }}
                                  </b-table-column>
                                  <b-table-column field="subSource" 
                                                  label="Sub-source" 
                                                  class="is-size-6" 
                                                  centered 
                                                  sortable>
                                    {{ props.row.subSource }}
                                  </b-table-column>
                                  <b-table-column field="amount" 
                                                  label="Amount" 
                                                  class="is-size-6 has-icons-left" 
                                                  numeric 
                                                  centered 
                                                  sortable>
                                    {{ props.row.amount | formatNumber('currency') }}
                                  </b-table-column>
                                  <b-table-column>
                                    <b-dropdown position="is-bottom-left" 
                                                class="is-pulled-right">
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
                                        <span>Edit Funding</span>
                                      </b-dropdown-item>
                                      <hr class="dropdown-divider">
                                      <b-dropdown-item @click="confirmDeleteValue('Funding Source', props.row)">
                                        <span class="icon is-small">
                                          <i class="fas fa-times has-text-danger"></i>
                                        </span>
                                        <span>Delete Funding</span>
                                      </b-dropdown-item>
                                    </b-dropdown>
                                  </b-table-column>
                                </template>
                                <template slot="bottom-left">
                                  <b>Total Participant Funding: {{participantFundingTotal | formatNumber('currency')}} </b>
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
                                    No Participant Funding Sources
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
        <stepper-item label="Review" 
                      icon="fas fa-check">

          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title">
                  Review Participant
                </h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <help-content :reference="'plan.participant.review'" 
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
                    <div class="column is-one-third">
                      <div class="field">
                        <label class="label">
                          Participant
                        </label>
                        <p class="control">{{participant.name}}</p>
                      </div>
                    </div>
                    <div class="column is-one-third">
                      <div class="field">
                        <label class="label">
                          Participant Type
                        </label>
                        <p class="control">{{participant.participantType ? participant.participantType.title:''}}</p>
                      </div>
                    </div>
                    <div class="column is-one-third">
                      <div class="field">
                        <label class="label">
                          Icon
                        </label>
                        <span class="icon is-large" 
                              v-if="participant.icon" 
                              :key="participant.icon">
                          <i :class="participant.icon+ ' fa-2x'"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-multiline">
                    <div class="column is-one-third">
                      <div class="field">
                        <label class="label">
                          Service Type
                        </label>
                        <p class="control">{{participant.serviceType?participant.serviceType.title:''}}</p>
                      </div>
                    </div>
                    <div class="column is-one-third">
                      <div class="field">
                        <label class="label">
                          Service or Department
                        </label>
                        <p class="control">{{participant.service?participant.service.title:''}}</p>
                      </div>
                    </div>
                    <div class="column is-one-third">
                      <div class="field">
                        <label class="label">
                          Command or Agency
                        </label>
                        <p class="control">{{participant.commandAgency?participant.commandAgency.title:''}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-multiline">
                    <div class="column is-one-third">
                      <div class="field">
                        <label class="label">
                          Home Station
                        </label>
                        <p class="control">{{participant.homeStation}}</p>
                      </div>
                    </div>
                    <div class="column is-one-third">
                      <div class="field">
                        <label class="label">
                          Total Training Audience
                        </label>
                        <p class="control">{{participant.totalAudience}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-full">
                  <label class="label is-size-4">
                    Participant Platforms
                  </label>
                  <div v-if="participant.platforms && participant.platforms.length > 0">
                    <section>
                      <b-table :data="participant.platforms">
                        <template slot-scope="props">
                          <b-table-column field="platform.title" 
                                          label="Platform Title" 
                                          class="is-size-6">
                            {{ props.row.platform.title }}
                          </b-table-column>
                          <b-table-column field="platform.type" 
                                          label="Platform Type" 
                                          class="is-size-6">
                            {{ props.row.platform.type }}
                          </b-table-column>
                          <b-table-column field="bedDown" 
                                          label="Bed-down" 
                                          class="is-size-6">
                            {{ props.row.bedDown ? props.row.bedDown : "None" }}
                          </b-table-column>
                        </template>
                      </b-table>
                    </section>
                  </div>
                  <div v-else 
                       class="column is-full">
                    <div class="content has-text-black has-text-centered">
                      <p>No Platforms.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-full">
                  <label class="label is-size-4">
                    Participant Planners
                  </label>
                  <div v-if="participant.planners && participant.planners.length > 0">
                    <section>
                      <b-table :data="participant.planners">
                        <template slot-scope="props">
                          <b-table-column field="name" 
                                          label="Name" 
                                          class="is-size-6" 
                                          centered>
                            {{ props.row.name }}
                          </b-table-column>
                          <b-table-column field="email" 
                                          label="Email" 
                                          class="is-size-6" 
                                          centered>
                            {{ props.row.email }}
                          </b-table-column>
                          <b-table-column field="phoneNumber" 
                                          label="Phone Number" 
                                          class="is-size-6" 
                                          centered>
                            {{ props.row.phoneNumber }}
                          </b-table-column>
                          <b-table-column field="isPrimary" 
                                          label="Primary Contact " 
                                          centered>
                            <span v-if="props.row.isPrimary" 
                                  class="primary-check">
                              <i class="fas fa-check fa-lg"></i>
                            </span>
                          </b-table-column>
                        </template>
                      </b-table>
                    </section>
                  </div>
                  <div v-else 
                       class="column is-full">
                    <div class="content has-text-black has-text-centered">
                      <p>No Planners.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-full">
                  <label class="label is-size-4">
                    Funding Sources: ${{participantFundingTotal}}
                  </label>
                  <div v-if="participant.fundings && participant.fundings.length > 0">
                    <section>
                      <b-table :data="participant.fundings">
                        <template slot-scope="props">
                          <b-table-column field="primarySource" 
                                          label="Primary Source" 
                                          class="is-size-6" 
                                          centered>
                            {{ props.row.primarySource }}
                          </b-table-column>
                          <b-table-column field="subSource" 
                                          label="Sub-source" 
                                          class="is-size-6" 
                                          centered>
                            {{ props.row.subSource }}
                          </b-table-column>
                          <b-table-column field="amount" 
                                          label="Amount" 
                                          class="is-size-6 has-icons-left" 
                                          numeric 
                                          centered>
                            {{ props.row.amount | formatNumber('currency')}}
                          </b-table-column>
                        </template>
                        <template slot="bottom-left">
                          <b>Total Funding: {{participantFundingTotal | formatNumber('currency')}} </b>
                        </template>
                      </b-table>
                    </section>
                  </div>
                  <div v-else 
                       class="column is-full">
                    <div class="content has-text-black has-text-centered">
                      <p>No Funding Sources.</p>
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
      <empty-state :data="participant && participant.id ? participant : null" 
                   :isLoading='$apollo.loading' />
    </div>
    <participant-funding v-if="openParticipantFunding" 
                         :open="openParticipantFunding" 
                         :participantId="participant.id" 
                         :id="participantFundingSourceId" 
                         @close="closeParticipantFundingSourceModal"></participant-funding>
    <participant-planner v-if="openParticipantPlanner" 
                         :open="openParticipantPlanner" 
                         :participantId="participant.id" 
                         :id="participantPlannerId" 
                         @close="closeParticipantPlannerModal"></participant-planner>
    <participant-platform v-if="openParticipantPlatform" 
                          :open="openParticipantPlatform" 
                          :participantId="participant.id" 
                          :id="participantPlatformId" 
                          @close="closeParticipantPlatformModal"></participant-platform>
  </div>
</template>
<script>
import IconPicker from '@/shared/components/iconpicker.vue'
import HelpContent from '@/shared/components/helpcontent'
import { serverError } from '@/shared/serverError'
import ParticipantFunding from '@/plan/components/participantModals/manage-participantFundings.vue'
import ParticipantPlanner from '@/plan/components/participantModals/manage-participantPlanners.vue'
import ParticipantPlatform from '@/plan/components/participantModals/manage-participantPlatforms.vue'

import {
  PlanFundingSourcesRead,
  PlanFundingSourceSubscription
} from '@/plan/graphql/PlanFundingSources.gql'

import {
  PlanParticipantFundingSourcesRead,
  PlanParticipantFundingSourceSubscription
} from '@/plan/graphql/PlanParticipantFundingSources.gql'

import {
  PlanParticipantsUpdate,
  PlanParticipantRead
} from '@/plan/graphql/PlanParticipants.gql'
import {
  PlanParticipantTypesCreate,
  PlanParticipantTypesRead,
  PlanParticipantTypeSubscription
} from '@/plan/graphql/PlanParticipantType.gql'
import {
  PlanParticipantServiceTypesCreate,
  PlanParticipantServiceTypesRead,
  PlanParticipantServiceTypeSubscription
} from '@/plan/graphql/PlanParticipantServiceType.gql'
import {
  PlanParticipantServicesCreate,
  PlanParticipantServicesRead,
  PlanParticipantServiceSubscription
} from '@/plan/graphql/PlanParticipantService.gql'
import {
  PlanParticipantCommandAgenciesCreate,
  PlanParticipantCommandAgenciesRead,
  PlanParticipantCommandAgencySubscription
} from '@/plan/graphql/PlanParticipantCommandAgency.gql'

import PlanTrainingObjective from '@/plan/model/planTrainingObjective'

export default {
  name: 'manage-participant',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  apollo: {
    planParticipantTypes: {
      query: PlanParticipantTypesRead,
      variables() {
        return {
          where: {
            title_contains: this.searchQuery.participantType
          }
        }
      },
      skip() {
        return !this.id
      },
      update(data) {
        if (
          data &&
          data.planParticipantTypes &&
          data.planParticipantTypes.length > 0
        )
          return data.planParticipantTypes
      },
      error(error) {
        console.error(error)
      },
      subscribeToMore: {
        document: PlanParticipantTypeSubscription,
        variables() {
          return {
            node: {
              where: {
                title_contains: this.searchQuery.participantType
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planParticipantType.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantTypes: [
                  subscriptionData.data.planParticipantType.node,
                  ...previousResult.planParticipantTypes
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantServiceTypes: [
                  ...previousResult.planParticipantTypes.filter(
                    obj =>
                      subscriptionData.data.planParticipantType.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantTypes = JSON.parse(
                JSON.stringify(previousResult.planParticipantTypes)
              )
              let index = newPlanParticipantTypes.findIndex(
                x => x.id === subscriptionData.data.planParticipantType.node.id
              )
              newPlanParticipantTypes[index] =
                subscriptionData.data.planParticipantType.node
              newResult = {
                planParticipantServiceTypes: newPlanParticipantTypes
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
    planParticipantServiceTypes: {
      query: PlanParticipantServiceTypesRead,
      variables() {
        return {
          where: {
            title_contains: this.searchQuery.serviceDepartmentType
          }
        }
      },
      update(data) {
        if (
          data &&
          data.planParticipantServiceTypes &&
          data.planParticipantServiceTypes.length > 0
        )
          return data.planParticipantServiceTypes
      },
      error(error) {
        console.error(error)
      },
      skip() {
        return !this.id
      },
      subscribeToMore: {
        document: PlanParticipantServiceTypeSubscription,
        variables() {
          return {
            node: {
              title_contains: this.searchQuery.serviceDepartmentType
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn =
            subscriptionData.data.planParticipantServiceType.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantServiceTypes: [
                  subscriptionData.data.planParticipantServiceType.node,
                  ...previousResult.planParticipantServiceTypes
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantServiceTypes: [
                  ...previousResult.planParticipantServiceTypes.filter(
                    obj =>
                      subscriptionData.data.planParticipantServiceType
                        .previousValues.id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantServiceTypes = JSON.parse(
                JSON.stringify(previousResult.planParticipantServiceTypes)
              )
              let index = newPlanParticipantServiceTypes.findIndex(
                x =>
                  x.id ===
                  subscriptionData.data.planParticipantServiceType.node.id
              )
              newPlanParticipantServiceTypes[index] =
                subscriptionData.data.planParticipantServiceType.node
              newResult = {
                planParticipantServiceTypes: newPlanParticipantServiceTypes
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
    planParticipantServices: {
      query: PlanParticipantServicesRead,
      variables() {
        return {
          where: {
            title_contains: this.searchQuery.serviceDepartment
          }
        }
      },
      update(data) {
        if (
          data &&
          data.planParticipantServices &&
          data.planParticipantServices.length > 0
        )
          return data.planParticipantServices
      },
      error(error) {
        console.error(error)
      },
      skip() {
        return !this.id
      },
      subscribeToMore: {
        document: PlanParticipantServiceSubscription,
        variables() {
          return {
            node: {
              where: {
                title_contains: this.searchQuery.serviceDepartment
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planParticipantService.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantServices: [
                  subscriptionData.data.planParticipantService.node,
                  ...previousResult.planParticipantServices
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantServices: [
                  ...previousResult.planParticipantServices.filter(
                    obj =>
                      subscriptionData.data.planParticipantService
                        .previousValues.id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantServices = JSON.parse(
                JSON.stringify(previousResult.planParticipantServices)
              )
              let index = newPlanParticipantServices.findIndex(
                x =>
                  x.id === subscriptionData.data.planParticipantService.node.id
              )
              newPlanParticipantServices[index] =
                subscriptionData.data.planParticipantService.node
              newResult = {
                planParticipantServices: newPlanParticipantServices
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
    planParticipantCommandAgencies: {
      query: PlanParticipantCommandAgenciesRead,
      variables() {
        return {
          where: {
            title_contains: this.searchQuery.commandAgency
          }
        }
      },
      update(data) {
        if (
          data &&
          data.planParticipantCommandAgencies &&
          data.planParticipantCommandAgencies.length > 0
        )
          return data.planParticipantCommandAgencies
      },
      error(error) {
        console.error(error)
      },
      skip() {
        return !this.id
      },
      subscribeToMore: {
        document: PlanParticipantCommandAgencySubscription,
        variables() {
          return {
            node: {
              where: {
                title_contains: this.searchQuery.commandAgency
              }
            }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn =
            subscriptionData.data.planParticipantCommandAgency.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantCommandAgencies: [
                  subscriptionData.data.planParticipantCommandAgency.node,
                  ...previousResult.planParticipantCommandAgencies
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantCommandAgencies: [
                  ...previousResult.planParticipantCommandAgencies.filter(
                    obj =>
                      subscriptionData.data.planParticipantCommandAgency
                        .previousValues.id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantCommandAgencies = JSON.parse(
                JSON.stringify(previousResult.planParticipantCommandAgencies)
              )
              let index = newPlanParticipantCommandAgencies.findIndex(
                x =>
                  x.id ===
                  subscriptionData.data.planParticipantCommandAgency.node.id
              )
              newPlanParticipantCommandAgencies[index] =
                subscriptionData.data.planParticipantCommandAgency.node
              newResult = {
                planParticipantCommandAgencies: newPlanParticipantCommandAgencies
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
    planParticipant: {
      query: PlanParticipantRead,
      variables() {
        return {
          where: {
            id: this.id ? this.id : ''
          }
        }
      },
      update(data) {
        if (data && data.planParticipant && data.planParticipant.id != '') {
          this.participant = JSON.parse(
            JSON.stringify(data.planParticipant ? data.planParticipant : null),
            this.omitTypename
          )
          this.participantType = data.planParticipant.participantType
          this.service = data.planParticipant.service
          this.serviceType = data.planParticipant.serviceType
          this.commandAgency = data.planParticipant.commandAgency
          return data.planParticipant
        }
      },
      error(error) {
        console.error(error)
      },
      skip() {
        return !this.id
      }
    },
    planFundingSources: {
      query: PlanFundingSourcesRead,
      update(data) {
        if (data && data.planFundingSources) {
          return data.planFundingSources
        }
      },
      error(error) {
        console.error(error)
      },
      skip() {
        return !this.id
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
              throw new Error(`Unknown mutation`)
            }
          }
          return newResult
        }
      }
    },
    planParticipantFundingSources: {
      query: PlanParticipantFundingSourcesRead,
      update(data) {
        if (data && data.planParticipantFundingSources) {
          return data.planParticipantFundingSources
        }
      },
      error(error) {
        console.error(error)
      },
      skip() {
        return !this.id
      },
      subscribeToMore: {
        document: PlanParticipantFundingSourceSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn =
            subscriptionData.data.planParticipantFundingSource.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantFundingSources: [
                  subscriptionData.data.planParticipantFundingSource.node,
                  ...previousResult.planParticipantFundingSources
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantFundingSources: [
                  ...previousResult.planParticipantFundingSources.filter(
                    obj =>
                      subscriptionData.data.planParticipantFundingSource
                        .previousValues.id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantFundingSources = JSON.parse(
                JSON.stringify(previousResult.planParticipantFundingSources)
              )
              let index = newPlanParticipantFundingSources.findIndex(
                x =>
                  x.id ===
                  subscriptionData.data.planParticipantFundingSource.node.id
              )
              newPlanParticipantFundingSources[index] =
                subscriptionData.data.planParticipantFundingSource.node
              newResult = {
                planParticipantFundingSources: newPlanParticipantFundingSources
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
    }
  },
  components: {
    HelpContent,
    IconPicker,
    ParticipantFunding,
    ParticipantPlanner,
    ParticipantPlatform
  },
  data() {
    return {
      service: null,
      serviceType: null,
      commandAgency: null,
      participantType: null,
      planParticipantTypes: [],
      planParticipantServiceTypes: [],
      planParticipantServices: [],
      planParticipantCommandAgencies: [],
      searchQuery: {
        participantType: '',
        serviceDepartment: '',
        serviceDepartmentType: '',
        commandAgency: ''
      },
      selectedParticipantPlatform: {},
      openParticipantPlatform: false,
      participantPlatformId: '',
      selectedParticipantFunding: {},
      openParticipantFunding: false,
      participantFundingSourceId: '',
      selectedParticipantPlanner: {},
      openParticipantPlanner: false,
      participantPlannerId: '',
      stepIndex: this.$route.query.step ? parseInt(this.$route.query.step) : 0,
      stepValidation: {
        details: {
          errors: false,
          visited: false,
          index: 0
        },
        platforms: {
          errors: false,
          visited: false,
          index: 1
        },
        planners: {
          errors: false,
          visited: false,
          index: 2
        },
        fundings: {
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
      currentPage: 1,
      perPage: 5,
      participant: [],
      saveInProgress: false
    }
  },
  computed: {
    participantFundingAllocated() {
      let sum = 0
      if (
        this.planParticipantFundingSources &&
        this.planParticipantFundingSources.length > 0
      ) {
        sum = this.planParticipantFundingSources.reduce(
          (accumulator, currentTotal) => {
            return accumulator + currentTotal.amount
          },
          0
        )
      }
      return sum
    },
    availableFundingTotal() {
      let sum = 0
      if (this.planFundingSources && this.planFundingSources.length > 0) {
        sum = this.planFundingSources.reduce((accumulator, currentTotal) => {
          return accumulator + currentTotal.amount
        }, 0)
      }
      return sum
    },
    participantFundingTotal() {
      let sum = 0
      if (this.participant.fundings && this.participant.fundings.length > 0) {
        sum = this.participant.fundings.reduce(
          (accumulator, currentFunding) => {
            return accumulator + currentFunding.amount
          },
          0
        )
      }
      return sum
    }
  },
  methods: {
    removeValue(table) {
      //fired when select option is de-selected
      let dataVariable
      switch (table) {
        case 'commandAgency':
          dataVariable = {
            commandAgency: {
              disconnect: true
            }
          }
          break

        case 'serviceDepartment':
          dataVariable = {
            service: {
              disconnect: true
            }
          }
          break

        case 'serviceDepartmentType':
          dataVariable = {
            serviceType: {
              disconnect: true
            }
          }
          break

        case 'participantType':
          dataVariable = {
            participantType: {
              disconnect: true
            }
          }
          break
      }

      this.$apollo
        .mutate({
          mutation: PlanParticipantsUpdate,
          variables: {
            where: {
              id: this.id
            },
            data: dataVariable
          }
        })
        .then(() => {})
    },
    search(table, term) {
      switch (table) {
        case 'commandAgency':
          this.searchQuery.commandAgency = term
          break
        case 'serviceDepartment':
          this.searchQuery.serviceDepartment = term
          break
        case 'serviceDepartmentType':
          this.searchQuery.serviceDepartmentType = term
          break
        case 'participantType':
          this.searchQuery.participantType = term
          break
      }
    },
    refetchQuery() {
      this.$apollo.queries.planParticipant.refetch()
      this.$apollo.queries.planFundingSources.refetch()
      this.$apollo.queries.planParticipantFundingSources.refetch()
    },
    closeParticipantPlatformModal() {
      this.refetchQuery()
      this.toggleTableModal(false, 'close', 'platforms')
    },
    closeParticipantFundingSourceModal() {
      this.refetchQuery()
      this.toggleTableModal(false, 'close', 'fundings')
    },
    closeParticipantPlannerModal() {
      this.refetchQuery()
      this.toggleTableModal(false, 'close', 'planners')
    },
    toggleTableModal(value, type, section, info) {
      if (type && type === 'close') {
        this.stepValidation[section].errors = false
      }
      switch (section) {
        case 'platforms':
          {
            switch (type) {
              case 'new':
              case 'close':
                this.participantPlatformId = ''
                break
              case 'edit':
                this.participantPlatformId = info.id
                break
            }
            this.openParticipantPlatform = value
          }
          break
        case 'fundings':
          {
            switch (type) {
              case 'new':
              case 'close':
                this.participantFundingSourceId = ''
                break
              case 'edit':
                this.participantFundingSourceId = info.id
                break
            }
            this.openParticipantFunding = value
          }
          break
        case 'planners':
          {
            switch (type) {
              case 'new':
              case 'close':
                this.participantPlannerId = ''
                break
              case 'edit':
                this.participantPlannerId = info.id
                break
            }
            this.openParticipantPlanner = value
          }
          break
      }
    },
    editTableValue(name, val) {
      this.toggleTableModal(true, 'edit', name, val)
    },
    showAddValue(name) {
      let msg
      switch (name) {
        case 'commandAgency':
          msg = 'Command or Agency'
          break
        case 'serviceDepartment':
          msg = 'Service or Department'
          break
        case 'serviceDepartmentType':
          msg = 'Service or Department Type'
          break
        case 'participantType':
          msg = 'Participant Type'
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
      switch (name) {
        case 'commandAgency': {
          createQuery = PlanParticipantCommandAgenciesCreate
          break
        }
        case 'serviceDepartment': {
          createQuery = PlanParticipantServicesCreate

          break
        }
        case 'serviceDepartmentType': {
          createQuery = PlanParticipantServiceTypesCreate

          break
        }
        case 'participantType': {
          createQuery = PlanParticipantTypesCreate
          break
        }
      }

      this.$apollo
        .mutate({
          mutation: createQuery,
          variables: {
            data: {
              title: value
            }
          }
        })
        .then(response => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          switch (name) {
            case 'commandAgency': {
              this.commandAgency =
                response.data.createPlanParticipantCommandAgency
              break
            }
            case 'serviceDepartment': {
              this.service = response.data.createPlanParticipantService

              break
            }
            case 'serviceDepartmentType': {
              this.serviceType = response.data.createPlanParticipantServiceType

              break
            }
            case 'participantType': {
              this.participantType = response.data.createPlanParticipantType
              break
            }
          }
        })
    },
    getError(val) {
      return this.stepValidation[val].errors
    },
    isVisited(val) {
      return this.stepValidation[val].visited
    },
    confirmDeleteValue(section, value) {
      this.$buefy.dialog.confirm({
        title: 'Delete ' + section,
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteTableValue(section, value)
      })
    },
    deleteTableValue(section, value) {
      let dataVariable
      switch (section) {
        case 'Funding Source':
          {
            dataVariable = {
              fundings: { delete: { id: value.id } }
            }
          }
          break
        case 'Planner':
          {
            dataVariable = {
              planners: { delete: { id: value.id } }
            }
          }
          break
        case 'Platform':
          {
            dataVariable = {
              platforms: { delete: { id: value.id } }
            }
          }
          break
      }
      this.$apollo
        .mutate({
          mutation: PlanParticipantsUpdate,
          variables: {
            data: dataVariable,
            where: {
              id: this.participant.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: section + ' Deleted!',
            type: 'is-success'
          })
          this.refetchQuery()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    },
    // Executed when @previousStep event is triggered
    checkPrevious(value) {
      switch (value) {
        case 0:
          this.stepValidation['details'].visited = true
          this.$validator.validate('details.*').then(result => {
            if (result) {
              this.stepValidation['details'].errors = false
              this.updateParticipantInfo('continue')
              return
            }
            this.stepValidation['details'].errors = true
            this.$buefy.toast.open({
              message: 'Participant Details Missing Info!',
              type: 'is-danger'
            })
          })
          break
        case 1:
          {
            this.stepValidation['platforms'].visited = true
          }
          break
        case 2:
          {
            this.stepValidation['planners'].visited = true
          }
          break
        case 3:
          this.stepValidation['fundings'].visited = true
          break
        case 4:
          this.$apollo.queries.planParticipant.refetch()
          break
      }
    },
    // Executed when @stepper-finished event is triggered
    onStepsCompleted() {
      // // All steps have been navigated
      let dataErrorCount = 0
      for (let key in this.stepValidation) {
        if (this.stepValidation[key].errors) {
          dataErrorCount++
        }
      }
      if (!this.stepValidation['details'].errors) {
        if (dataErrorCount > 0) {
          this.$buefy.dialog.confirm({
            title: 'Proceed With ' + dataErrorCount + ' Errors?',
            message: `Sections marked in RED have errors and will be saved AS IS.`,
            type: 'is-danger',
            onConfirm: () => this.saveParticipantInfo('final')
          })
        } else {
          this.saveParticipantInfo(null)
        }
      } else {
        this.$buefy.toast.open({
          message: 'Can Not Save Without Participant Name',
          type: 'is-danger'
        })
      }
    },
    updateParticipantInfo(nextStep) {
      let dataVariable = {
        name: this.participant.name,
        homeStation: this.participant.homeStation,
        bedDown: this.participant.bedDown,
        totalAudience: this.participant.totalAudience,
        icon: this.participant.icon
      }

      // commandAgency
      if (this.commandAgency) {
        dataVariable = {
          ...dataVariable,
          commandAgency: {
            connect: { id: this.commandAgency.id }
          }
        }
      } else {
        if (this.participant.commandAgency)
          dataVariable = {
            ...dataVariable,
            commandAgency: {
              disconnect: true
            }
          }
      }

      // service
      if (this.service) {
        dataVariable = {
          ...dataVariable,
          service: {
            connect: { id: this.service.id }
          }
        }
      } else {
        if (this.participant.service)
          dataVariable = {
            ...dataVariable,
            service: {
              disconnect: true
            }
          }
      }

      // serviceType
      if (this.serviceType) {
        dataVariable = {
          ...dataVariable,
          serviceType: {
            connect: { id: this.serviceType.id }
          }
        }
      } else {
        if (this.participant.serviceType)
          dataVariable = {
            ...dataVariable,
            serviceType: {
              disconnect: true
            }
          }
      }

      // ParticipantType
      if (this.participantType) {
        dataVariable = {
          ...dataVariable,
          participantType: {
            connect: { id: this.participantType.id }
          }
        }
      } else {
        if (this.participant.participantType)
          dataVariable = {
            ...dataVariable,
            participantType: {
              disconnect: true
            }
          }
      }
      if (dataVariable) this.saveParticipantInfo(dataVariable, nextStep)
    },
    saveParticipantInfo(participantData, nextStep) {
      if (participantData !== null) {
        this.$apollo
          .mutate({
            mutation: PlanParticipantsUpdate,
            variables: {
              data: participantData,
              where: {
                id: this.participant.id
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
                  : '/plan/prepare/participants/'
              })
            }
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
            console.error('Participant Update: ' + error)
          })
      } else {
        this.$router.push({
          path: this.$route.query
            ? this.$route.query.from
            : '/plan/prepare/participants/'
        })
      }
    },
    async handleSaveAndRoute() {
      if (this.saveInProgress == false) {
        this.saveInProgress = true
        this.saveTime = this.moment().toISOString()
        await this.$validator.validate('*').then(result => {
          if (result) {
            let planTrainingObjective = new PlanTrainingObjective()
            planTrainingObjective.requiredRuns = '1'
            planTrainingObjective.classification = 'Unclassified'
            let dataVariable = {
              trainingObjectives: { create: planTrainingObjective }
            }
            this.$apollo
              .mutate({
                mutation: PlanParticipantsUpdate,
                variables: {
                  data: dataVariable,
                  where: {
                    id: this.id
                  }
                }
              })
              .then(response => {
                if (
                  response &&
                  response.data &&
                  response.data.updatePlanParticipant &&
                  response.data.updatePlanParticipant.trainingObjectives
                ) {
                  let trainingObj = response.data.updatePlanParticipant.trainingObjectives.filter(
                    trainObj => {
                      return (
                        this.moment(trainObj.createdAt).isAfter(
                          this.saveTime
                        ) && trainObj.jmet === null
                      )
                    }
                  )
                  this.$buefy.toast.open({
                    message: 'Saving...',
                    type: 'is-success'
                  })
                  if (response && trainingObj && trainingObj[0].id && this.id) {
                    this.$router.push({
                      name: 'planTrainingObjectiveView',
                      params: {
                        id: this.id,
                        trainingObjID: trainingObj[0].id,
                        isEdit: true
                      },
                      query: { from: this.$route.fullPath }
                    })
                    this.saveInProgress = false
                  }
                }
              })
              .catch(error => {
                this.$buefy.toast.open({
                  message: serverError(error.message),
                  type: 'is-danger'
                })
              })
          } else {
            this.$buefy.toast.open({
              message: 'Participant Info Required!',
              type: 'is-danger'
            })
            this.saveInProgress = false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.funding-section {
  .card-header-title {
    display: block;
  }
}
p.control {
  padding-left: 10px;
  word-wrap: break-word;
}
.card {
  .card-header {
    background-color: #038172;
  }
  .card-header-title {
    color: #ffffff;
  }
  .primary-check {
    color: #038172;
  }
}
.is-skipped {
  background-color: #a9afb7;
}
</style>
