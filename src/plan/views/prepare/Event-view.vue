<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="planEvent ? planEvent.name : ''" />
    <div v-if="planEvent && planEvent.id != null">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title">
              <span class="tag is-rounded"
                    :style="'background-color:'+planEvent.color"></span>
              {{planEvent.name}}</h1>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-dropdown position="is-bottom-left">
              <a class="button is-small"
                 slot="trigger">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </a>
              <b-dropdown-item @click="editEvent(planEvent)">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Event</span>
              </b-dropdown-item>
              <b-dropdown-item :disabled="downloadInProgress"
                               @click="downloadEventInjects('csv')">
                <span class="icon is-small">
                  <i class="fas fa-download"></i>
                </span>
                <span> Download Spreadsheet (CSV) </span>
                <span class="icon is-small"
                      v-if="downloadInProgress">
                  <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
                </span>
              </b-dropdown-item>
              <b-dropdown-item :disabled="downloadInProgress"
                               @click="downloadEventInjects('pdf')">
                <span class="icon is-small">
                  <i class="fas fa-download"></i>
                </span>
                <span> Download PDF </span>
                <span class="icon is-small"
                      v-if="downloadInProgress">
                  <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
                </span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDeleteEvent(planEvent)">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete Event</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="level-item">
            <help-content :reference="'plan.prepare.eventdetails'"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <div class="columns is-multiline"
           v-if="planEvent">
        <div class="column is-half">
          <p class="title is-6">Start</p>
          <p class="subtitle is-6"><span class="tooltip"
                                         :data-tooltip="formatDate(planEvent.startDate, 'utc-dtg')">{{formatDate(planEvent.startDate, 'dtg')}}</span></p>
        </div>
        <div class="column is-half">
          <p class="title is-6">End</p>
          <p class="subtitle is-6"><span class="tooltip"
                                         :data-tooltip="formatDate(planEvent.endDate, 'utc-dtg')">{{formatDate(planEvent.endDate, 'dtg')}}</span></p>
        </div>
        <div class="column is-full">
          <p class="title is-6">Overall Method</p>
          <p class="subtitle is-6">{{planEvent.method}}</p>
        </div>
        <div class="column is-half">
          <p class="title is-6">Scenario</p>
          <p class="subtitle is-6">{{planEvent.description}}</p>
        </div>
        <div class="column is-half">
          <p class="title is-6">Remarks</p>
          <p class="subtitle is-6">{{planEvent.exerciseGuidance}}</p>
        </div>

      </div>

      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <button class="button is-primary"
                    @click="toggleQuickAdd(true),toggleFullCreate(true)">
              Add MSEL Inject
            </button>
          </div>
          <div class="level-item">
            <button class="button is-outlined"
                    @click="editEvent(planEvent)">
              Edit Event
            </button>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <input class="input is-rounded is-primary"
                       type="text"
                       placeholder="Search..."
                       v-model.lazy="searchQuery">
                <span class="icon is-small is-left">
                  <i class="fas fa-search"></i>
                </span>
                <span class="icon is-small is-right"
                      @click="searchQuery = ''">
                  <i class="fas fa-times-circle"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div class="columns">
        <div class="column is-12">
          <div class="card-header has-background-plan">
            <p class="card-header-title has-text-white">
              MSEL Injects: {{planEvent.injects ? planEvent.injects.length : 0}}
            </p>
          </div>
          <div v-if="planEvent.injects && planEvent.injects.length > 0">
            <b-table :data="planEvent.injects"
                     paginated
                     :per-page="perPage"
                     detailed
                     detail-key="id"
                     :pagination-simple="isPaginationSimple"
                     :default-sort-direction="sortOrder"
                     @sort="onSort"
                     default-sort="startDate">
              <template slot-scope="props">
                <b-table-column field="startDate"
                                label="Date/Time"
                                sortable>
                  <p class="tooltip"
                     :data-tooltip="formatDate(props.row.startDate, 'utc-dtg')">{{ formatDate(props.row.startDate, 'dtg')}}</p>
                </b-table-column>
                <b-table-column field="number"
                                label="# Title"
                                sortable>
                  {{ props.row.number}} - {{ props.row.title | truncate(50)}}
                </b-table-column>
                <b-table-column field="owner"
                                label="Status Owner">
                  <p v-if="props.row.status">
                    <span class="tag is-rounded"
                          :style="'background-color:'+props.row.status.color"
                          :class="lightOrDark(props.row.status.color)">{{props.row.status.title}}</span>
                  </p>
                  <p v-if="props.row.owner">{{ props.row.owner.title | truncate(50)}}</p>
                </b-table-column>
                <b-table-column field="type"
                                label="Type Method"
                                sortable>
                  <p v-if="props.row.type">{{ props.row.type | truncate(50)}}</p>
                  <p v-if="props.row.method">
                    <span class="icon is-small"
                          v-if="props.row.method.icon"
                          :key="props.row.method.icon">
                      <i :class="props.row.method.icon"
                         :style="'color:'+props.row.method.color"
                         v-if="props.row.method.color"></i>
                    </span>
                    <span> {{ props.row.method.name | truncate(50)}}</span>
                  </p>
                </b-table-column>
                <b-table-column field="events"
                                label="Event">
                  <div v-if="props.row.events">
                    <router-link :to="{name: 'view-event', params: {id: props.row.events.id} }"
                                 v-if="props.row.events.id">
                      <span class="tag is-rounded tooltip"
                            :data-tooltip="props.row.events.name"
                            :style="'background-color:'+props.row.events.color"
                            :class="lightOrDark(props.row.events.color)">{{props.row.events.name | truncate(20)}}</span>
                    </router-link>
                  </div>
                </b-table-column>
                <b-table-column field="updatedAt"
                                label="Last Updated"
                                sortable>
                  <span class="tooltip"
                        :data-tooltip="formatDate(props.row.updatedAt, 'utc-dtg')"
                        v-if="props.row.updatedAt"> {{ formatDate(props.row.updatedAt, 'dtg')}}</span>
                </b-table-column>
                <b-table-column width="50">
                  <b-dropdown position="is-bottom-left"
                              class="is-pulled-right">
                    <a class="button is-small"
                       slot="trigger">
                      <span class="icon is-small">
                        <i class="fas fa-ellipsis-v"></i>
                      </span>
                    </a>
                    <b-dropdown-item @click="editPlanInject(props.row.number)">
                      <span class="icon is-small">
                        <i class="fas fa-pen"></i>
                      </span>
                      <span>Edit Inject</span>
                    </b-dropdown-item>
                    <b-dropdown-item @click="viewPlanInject(props.row.id)">
                      <span class="icon is-small">
                        <i class="fas fa-eye"></i>
                      </span>
                      <span>View Inject</span>
                    </b-dropdown-item>
                    <b-dropdown-item @click="duplicatePlanInject(props.row.id)">
                      <span class="icon is-small">
                        <i class="fas fa-copy"></i>
                      </span>
                      <span>Duplicate Inject</span>
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                    <b-dropdown-item @click="confirmRemoveInject(props.row.id)">
                      <span class="icon is-small">
                        <i class="fas fa-minus-circle has-text-danger"></i>
                      </span>
                      <span>Remove From Event</span>
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                    <b-dropdown-item @click="confirmDeleteInject(props.row)">
                      <span class="icon is-small">
                        <i class="fas fa-times has-text-danger"></i>
                      </span>
                      <span>Delete Inject</span>
                    </b-dropdown-item>
                  </b-dropdown>
                </b-table-column>
              </template>
              <template slot="detail"
                        slot-scope="props">
                <article class="media">
                  <div class="columns is-multiline">
                    <div class="column is-full">
                      <div class="columns">
                        <div class="column is-half">
                          <div class="field">
                            <p class="title is-6">From</p>
                            <p class="subtitle is-6">{{ props.row.from ? props.row.from : "None" }}</p>
                          </div>
                        </div>
                        <div class="column is-half">
                          <div class="field">
                            <p class="title is-6">To</p>
                            <p class="subtitle is-6">
                              {{ props.row.to ? props.row.to : "None" }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <p class="title is-6"
                           v-if="props.row.deletedAt">Deleted</p>
                        <p class="subtitle is-6"
                           v-if="props.row.deletedAt">{{props.row.deletedAt}}</p>
                      </div>
                      <div class="field">
                        <p class="title is-6">Trigger</p>
                        <p class="subtitle is-6">
                          {{ props.row.trigger ? props.row.trigger : "None" }}
                        </p>
                      </div>
                      <div class="field">
                        <p class="title is-6">Anticipated Response</p>
                        <p class="subtitle is-6">{{ props.row.response ? props.row.response : "None" }}</p>
                      </div>
                      <div class="field">
                        <p class="title is-6">Remarks</p>
                        <p class="subtitle is-6">{{ props.row.remarks ? props.row.remarks : "None" }}</p>
                      </div>
                      <div class="field">
                        <p class="title is-6">Attachments</p>
                        <table class="table is-6">
                          <tr v-for="attachment in props.row.attachments"
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
                      <div class="field responseTime">
                        <p class="title is-6">Response Time</p>
                        <span class="subtitle is-6 tooltip"
                              :data-tooltip="props.row.responseDate"
                              v-if="props.row.responseDate">
                          {{ showDiff(props.row.startDate, props.row.responseDate)}}
                        </span>
                        <span v-else>None</span>
                      </div>
                    </div>
                    <div class="column is-full">
                      <div class="field">
                        <p class="title is-6">Training Objectives & Trained Method</p>
                        <ul class="is-list-none subtitle"
                            v-if="props.row.objectives">
                          <li v-for="objective in props.row.objectives"
                              :key="objective.id">
                            <span class="subtitle is-7">
                              {{objective.participant ? objective.participant.name : ''}}
                              <template v-if="objective.platform && objective.platform.platform">
                                {{objective.platform && objective.platform.platform ? objective.platform.platform.title : ''}}
                                {{objective.platform && objective.platform.platform ? objective.platform.platform.type: ''}} -
                              </template>
                              {{objective.jmet ? objective.jmet.description : ''}}
                              ({{objective.trainedMethodType ? objective.trainedMethodType.title : '' }})
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="column is-narrow">
                      <div class="field is-grouped">
                        <p class="control">
                          <a class="button is-primary"
                             @click="editPlanInject(props.row.number)">Edit Inject</a>
                        </p>
                        <p class="control">
                          <a class="button is-primary is-outlined"
                             @click="viewPlanInject(props.row.id)">View Inject</a>
                        </p>
                        <p class="control">
                          <a class="button is-danger is-outlined"
                             @click="confirmRemoveInject(props.row.id)">Remove From Event</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </template>
            </b-table>
          </div>
          <div v-else>
            <empty-state :data="planEvent.injects"
                         :isLoading='$apollo.loading' />
          </div>
        </div>
      </div>

      <div class="modal"
           :class="{'is-active':quickAdd}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Add MSEL Inject</p>
            <button class="delete"
                    aria-label="close"
                    @click="toggleQuickAdd(false)"></button>
          </header>
          <section class="modal-card-body">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">
                  Title
                </label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control has-icon has-icon-right">
                    <input name="planInjectTitle"
                           v-model="planInjectTitle"
                           v-validate="'required'"
                           :class="{'input': true, 'is-danger': errors.has('planInjectTitle') }"
                           type="text"
                           placeholder="Title">
                    <i v-show="errors.has('planInjectTitle')"
                       class="fa fa-warning"></i>
                    <span v-show="errors.has('planInjectTitle')"
                          class="help is-danger">Please enter a title</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button v-if="!fullCreate"
                    class="button is-primary"
                    @click="addPlanInject">
              Save changes
            </button>
            <button v-if="fullCreate"
                    class="button is-primary"
                    @click="addPlanInject">
              Save &amp; Create
            </button>
            <button class="button"
                    @click="toggleQuickAdd(false),toggleFullCreate(false)">
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </div>
    <div v-else>
      <empty-state :data="planEvent"
                   :isLoading='$apollo.loading' />
    </div>
  </div>
</template>

<script>
import PlanInject from '@/plan/model/planinject'
import lightOrDark from '@/shared/mixins/lightOrDark'
import {
  PlanInjectsCreate,
  PlanInjectsUpdate,
  PlanInjectsDelete,
  DuplicatePlanInject
} from '@/plan/graphql/PlanInjects.gql'
import {
  PlanEventRead,
  PlanEventsDelete,
  PlanEventsUpdate
} from '@/plan/graphql/PlanEvents.gql'
import HelpContent from '@/shared/components/helpcontent'
import dateChecks from '@/shared/mixins/dateChecks'

import file from '@/shared/mixins/file'
import mediaCheck from '@/shared/mixins/mediaCheck'
import injectsDownload from '@/plan/mixins/injectsDownload'
export default {
  name: 'event-view',
  components: { HelpContent },
  props: ['id'],
  mixins: [lightOrDark, dateChecks, file, mediaCheck, injectsDownload],
  apollo: {
    planEvent: {
      query: PlanEventRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      update(data) {
        if (data && data.planEvent) {
          return data.planEvent
        }
      }
    }
  },
  data() {
    return {
      searchQuery: '',
      planEvent: null,
      isPaginationSimple: false,
      sortOrder: 'asc',
      perPage: '15',
      fullCreate: false,
      quickAdd: false,
      planInjectTitle: '',
      downloadInProgress: false,
      orderBy: 'startDate_ASC'
    }
  },
  methods: {
    toggleQuickAdd(value) {
      this.errors.clear()
      this.$validator.reset()
      this.planInjectTitle = ''
      this.quickAdd = value
    },
    toggleFullCreate(value) {
      this.fullCreate = value
    },
    onSort(field, order) {
      this.orderBy = field + '_' + order.toUpperCase()
    },
    addPlanInject() {
      let planInject = new PlanInject()
      planInject.title = this.planInjectTitle
      planInject.events = {
        connect: { id: this.planEvent.id }
      }
      planInject = Object.assign(planInject, {})
      this.$apollo
        .mutate({
          mutation: PlanInjectsCreate,
          variables: {
            data: planInject
          }
        })
        .then(response => {
          let injectNumber = response.data.createPlanInject.number
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          this.toggleQuickAdd(false)
          if (this.fullCreate) {
            this.editPlanInject(injectNumber)
            this.toggleFullCreate(false)
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'Sorry, Inject could not be created',
            type: 'is-danger'
          })
          console.error(error)
        })
    },
    editPlanInject(number) {
      this.$router.push({
        name: 'planInjectView',
        params: { number: number },
        query: { from: this.$route.fullPath }
      })
    },
    viewPlanInject(id) {
      this.$router.push({
        name: 'view-inject',
        params: { id: id }
      })
    },
    editEvent(event) {
      this.$router.push({
        name: 'editEvent',
        params: { event: event, id: event.id, isEdit: true }
      })
    },
    deleteEvent(event) {
      // Delete Event
      this.$apollo
        .mutate({
          mutation: PlanEventsDelete,
          variables: {
            id: {
              id: event.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Event Deleted!',
            type: 'is-success'
          })
          this.$router.go(-1)
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Event: ' + error)
        })
    },
    confirmDeleteEvent(event) {
      this.$buefy.dialog.confirm({
        title: 'Delete Event',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteEvent(event)
      })
    },
    confirmDeleteInject(inject) {
      this.$buefy.dialog.confirm({
        title: 'Delete Inject',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteInject(inject)
      })
    },
    deleteInject(inject) {
      //disconnect events
      if (inject.events) {
        this.$apollo
          .mutate({
            mutation: PlanInjectsUpdate,
            variables: {
              data: {
                events: {
                  disconnect: true
                }
              },
              where: {
                id: inject.id
              }
            }
          })
          .then(() => {})
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('Inject updated: ' + error)
          })
      }

      //Disconnect Objectives
      if (inject.objectives.length > 0) {
        let obj = []
        for (let i in inject.objectives) {
          let insideObj = {
            id: inject.objectives[i].id
          }
          obj.push(insideObj)
        }

        this.$apollo
          .mutate({
            mutation: PlanInjectsUpdate,
            variables: {
              data: {
                objectives: {
                  disconnect: obj
                }
              },
              where: {
                id: inject.id
              }
            }
          })
          .then(() => {})
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('Inject updated: ' + error)
          })
      }

      this.$apollo
        .mutate({
          mutation: PlanInjectsDelete,
          variables: {
            id: {
              id: inject.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Inject Deleted!',
            type: 'is-success'
          })
          this.$apollo.queries.planEvent.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Inject Deleted: ' + error)
        })
    },
    confirmRemoveInject(inject) {
      this.$buefy.dialog.confirm({
        title: 'Remove Inject',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.removeInject(inject)
      })
    },
    removeInject(inject) {
      this.$apollo
        .mutate({
          mutation: PlanEventsUpdate,
          variables: {
            data: {
              injects: {
                disconnect: {
                  id: inject
                }
              }
            },
            where: {
              id: this.planEvent.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Inject Removed!',
            type: 'is-success'
          })
          this.$apollo.queries.planEvent.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Inject Remove: ' + error)
        })
    },
    duplicatePlanInject(injectID) {
      this.$apollo
        .mutate({
          mutation: DuplicatePlanInject,
          variables: {
            where: { id: injectID }
          }
        })
        .then(response => {
          if (response && response.data) {
            let injectNumber = response.data.duplicatePlanInject.number
            this.$buefy.toast.open({
              message: 'Duplicating...',
              type: 'is-success'
            })
            this.$router.push({
              name: 'planInjectView',
              params: { number: injectNumber },
              query: { from: this.$route.fullPath }
            })
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'Sorry, Inject could not be duplicated',
            type: 'is-danger'
          })
          console.error(error)
        })
    },
    downloadEventInjects(type) {
      this.downloadInProgress = true
      let currentDate = this.moment().format('DDMMYYYY HHmm')
      let fileName =
        'MSEL ' +
        this.$store.state.activeWorkspace.displayName +
        ' ' +
        this.planEvent.name +
        ' ' +
        currentDate +
        '.' +
        type
      let args = {
        where: {
          event: this.planEvent.name,
          query: this.searchQuery,
          orderBy: this.orderBy,
          fileType: type
        }
      }
      this.planInjectExportFile(type, fileName, args)

      this.downloadInProgress = false
    }
  },
  computed: {
    filteredInjects() {
      return this.planEvent.injects.filter(injects => {
        let searchRegex = new RegExp(this.searchQuery, 'i')
        return searchRegex.test(JSON.stringify(injects))
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.responseTime {
  p.title {
    margin-bottom: 0;
    + span.subtitle {
      margin-top: -1.25rem;
    }
  }
}
</style>
