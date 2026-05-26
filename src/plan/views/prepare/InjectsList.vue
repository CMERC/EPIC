<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <span class="button is-primary"
                @click="toggleQuickAdd(true)">Create MSEL Inject</span>
          <a class="card-header-icon"
             @click="toggleQuickAdd(false)">
            <span class="icon is-small">
              <i class="fas fa-plus"></i>
            </span>
          </a>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <router-link :to="{ name: 'injects-list'}">
                <button class="button"
                        title="List">
                  <span class="icon is-small">
                    <i class="fas fa-align-justify has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
            <p class="control">
              <router-link :to="{ name: 'injects-board'}">
                <button class="button"
                        title="Board">
                  <span class="icon is-small">
                    <i class="fas fa-columns has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
            <p class="control">
              <router-link :to="{ name: 'injects-calendar'}">
                <button class="button"
                        title="Calendar">
                  <span class="icon is-small">
                    <i class="fas fa-calendar-alt has-text-grey"></i>
                  </span>
                </button>
              </router-link>
            </p>
          </div>
        </div>
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
        <div class="level-item">
          <help-content :reference="'plan.prepare.injects'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <nav class="level">
      <div class="level-left">
        <div class="level-item"></div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <span class="has-text-weight-semibold">{{planInjectsCount}} MSEL Injects</span>
        </div>
        <div class="level-item"
             v-if="planEvents">
          <div class="select">
            <select v-model="eventName">
              <option value="">
                All Events
              </option>
              <option disabled>
                ──────────
              </option>
              <option v-for="event in planEvents"
                      v-bind:key="event.id"
                      :value="event.name">
                {{truncate(event.name, 25)}}
              </option>
            </select>
          </div>
        </div>
        <div class="level-item">
          <div class="select">
            <select v-model.number="perPage">
              <option value="25">
                25 per page
              </option>
              <option value="50">
                50 per page
              </option>
              <option value="75">
                75 per page
              </option>
              <option value="100">
                100 per page
              </option>
            </select>
          </div>
        </div>
        <div class="level-item">
          <b-dropdown position="is-bottom-left"
                      class="is-pulled-right">
            <a class="button is-small"
               slot="trigger">
              <span class="icon">
                <i class="fas fa-ellipsis-v"></i>
              </span>
            </a>
            <b-dropdown-item>
              <router-link :to="{name: 'status'}">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit MSEL Status Labels</span>
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item :disabled="downloadInProgress"
                             @click="downloadInjects('csv')">
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
                             @click="downloadInjects('pdf')">
              <span class="icon is-small">
                <i class="fas fa-download"></i>
              </span>
              <span> Download PDF </span>
              <span class="icon is-small"
                    v-if="downloadInProgress">
                <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
              </span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>
    <div v-if="planInjectsSearch && planInjectsSearch.length > 0">
      <b-table :data="planInjectsSearch"
               striped
               :current-page.sync="currentPage"
               :total="planInjectsCount"
               paginated
               :per-page="perPage"
               detailed
               detail-key="id"
               :pagination-simple="isPaginationSimple"
               backend-pagination
               @page-change="onPageChange" 
               backend-sorting 
               @sort="onSort" 
               :default-sort-direction="defaultSortOrder" 
               :default-sort="btableSort">
        <template slot-scope="props">
          <b-table-column field="startDate"
                          label="Date/Time"
                          sortable>
            <p class="tooltip"
               :data-tooltip="formatDate(props.row.startDate, 'utc-dtg')">{{ formatDate(props.row.startDate, 'dtg') }}</p>
            <p class="control ribbon is-small is-danger is-relative"
               v-if="isInjectPastDue(props.row, props.row.status)">Past Due</p>
            <p class="control ribbon is-small is-warning is-relative"
               :class="{'tooltip': injectAlertChecker(props.row, props.row.status)}"
               data-tooltip="Edit Date and Time"
               v-if="injectAlertChecker(props.row, props.row.status)">Alert</p>
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
                  v-if="props.row.updatedAt"> {{ formatDate(props.row.updatedAt, 'fromNow')}}</span>
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
              <b-dropdown-item @click="sendToCobra(props.row)">
                <span class="icon is-small">
                  <i class="fas fa-share-square"></i>
                </span>
                <span>Send To Cobra</span>
              </b-dropdown-item>
              <b-dropdown-item @click="duplicatePlanInject(props.row.id)">
                <span class="icon is-small">
                  <i class="fas fa-copy"></i>
                </span>
                <span>Duplicate Inject</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDelete(props.row)">
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
                <div class="field attachments">
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
                <div class="field">
                  <p class="title is-6">Response Time</p>
                  <p class="subtitle is-6">
                    <span class="tooltip"
                          :data-tooltip="formatDate(props.row.responseDate, 'utc-dtg')"
                          v-if="props.row.responseDate">
                      {{ showDiff(props.row.startDate, props.row.responseDate)}}
                    </span>
                    <span v-else>None</span>
                  </p>
                </div>
                <div class="field">
                  <p class="title is-6">Actual Response</p>
                  <p class="subtitle is-6">{{ props.row.mitigation ? props.row.mitigation : "None" }}</p>
                </div>
                <div class="field">
                  <p class="title is-6">Location</p>
                  <p class="subtitle is-6">
                    <geocode :coordinates="props.row.location.geojson.coordinates"
                             v-if="props.row.location"></geocode>
                    <span v-else>None</span>
                  </p>
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
                       @click="confirmDelete(props.row)">Delete Inject</a>
                  </p>
                </div>
              </div>
            </div>
          </article>
        </template>
      </b-table>
    </div>
    <div v-else>
      <empty-state :data="planInjectsSearch"
                   :search="searchQuery ? true : false"
                   :isLoading='$apollo.loading'>
        <template slot="action-buttons">
          <div class="buttons is-centered is-spaced">
            <span class="button is-primary"
                  @click="toggleQuickAdd(true)">Create MSEL Inject</span>
          </div>
        </template>
      </empty-state>
    </div>
    <cobra-connect v-if="openSendToCobra"
                   :open="openSendToCobra"
                   :inject="injectToCobra"
                   @close="closeSendToCobra" />
    <JMETQuickAdd :open="quickAdd"
                  :planInject="planInject"
                  :fullCreate="fullCreate"
                  @close="close"></JMETQuickAdd>
  </div>
</template>
<script>
import {
  PlanEventsSelector,
  PlanEventSubscription
} from '@/plan/graphql/PlanEvents.gql'
import JMETQuickAdd from '@/plan/components/jmet-quickadd'
import CobraConnect from '@/plan/components/cobra-connect'
import HelpContent from '@/shared/components/helpcontent'
import {
  PlanInjectsSearchCount,
  PlanInjectsDelete,
  PlanInjectsSearch,
  PlanInjectsUpdate,
  PlanInjectsSearchSubscription,
  DuplicatePlanInject
} from '@/plan/graphql/PlanInjects.gql'
import helpers from '@/shared/mixins/helpers'
import lightOrDark from '@/shared/mixins/lightOrDark'
import PlanInject from '@/plan/model/planinject'
import Geocode from '@/shared/components/geocode'
import dateChecks from '@/shared/mixins/dateChecks'

import file from '@/shared/mixins/file'
import mediaCheck from '@/shared/mixins/mediaCheck'
import injectsDownload from '@/plan/mixins/injectsDownload'
import injectStatusCheck from '@/shared/mixins/injectStatusCheck'
export default {
  name: 'injects-list',
  mixins: [
    helpers,
    lightOrDark,
    dateChecks,
    file,
    mediaCheck,
    injectsDownload,
    injectStatusCheck
  ],
  components: {
    HelpContent,
    JMETQuickAdd,
    CobraConnect,
    Geocode
  },
  apollo: {
    planInjectsCount: {
      query: PlanInjectsSearchCount,
      variables() {
        return {
          event: this.eventName,
          query: this.searchQuery
        }
      },
      update(data) {
        if (data && data.planInjectsSearchCount) {
          return data.planInjectsSearchCount.aggregate.count
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planInjectsSearch: {
      query: PlanInjectsSearch,
      variables() {
        return {
          event: this.eventName,
          query: this.searchQuery,
          orderBy: this.orderBy,
          skip: this.skip,
          first: this.perPage
        }
      },
      error(error) {
        console.error(error)
      },
      update(data) {
        if (data && data.planInjectsSearch) {
          this.$apollo.queries.planInjectsCount.refetch()
          return data.planInjectsSearch
        }
      },

      subscribeToMore: {
        document: PlanInjectsSearchSubscription,
        variables() {
          return {
            event: this.eventName,
            query: this.searchQuery,
            orderBy: this.orderBy
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planInjectsSearch.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planInjectsSearch: [
                  subscriptionData.data.planInjectsSearch.node,
                  ...previousResult.planInjectsSearch
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planInjectsSearch: [
                  ...previousResult.planInjectsSearch.filter(
                    obj =>
                      subscriptionData.data.planInjectsSearch.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanInjects = JSON.parse(
                JSON.stringify(previousResult.planInjectsSearch)
              )
              let index = newPlanInjects.findIndex(
                x => x.id === subscriptionData.data.planInjectsSearch.node.id
              )
              newPlanInjects[index] =
                subscriptionData.data.planInjectsSearch.node
              newResult = {
                planInjectsSearch: newPlanInjects
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
    planEvents: {
      query: PlanEventsSelector,
      variables: {
        where: {
          type: null
        }
      },
      subscribeToMore: [
        {
          document: PlanEventSubscription,
          variables: {
            node: {
              where: {
                type: null
              }
            }
          },
          // Mutate the previous result
          updateQuery(previousResult, { subscriptionData }) {
            // Mutation type
            let mutationIn = subscriptionData.data.planEvent.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  planEvents: [
                    ...previousResult.planEvents,
                    subscriptionData.data.planEvent.node
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
                let updatedPlanEvents = JSON.parse(
                  JSON.stringify(previousResult.planEvents)
                )
                let index = updatedPlanEvents.findIndex(
                  x => x.id === subscriptionData.data.planEvent.node.id
                )
                updatedPlanEvents[index] = subscriptionData.data.planEvents.node
                newResult = {
                  planEvents: updatedPlanEvents
                }
                break
              }
              default: {
                throw new Error(`Unknown Subscription Mutation`)
              }
            }
            // Here, return the new result from the previous with the new data
            return newResult
          }
        }
      ]
    }
  },
  data() {
    return {
      scroll: parseInt(this.$route.query.scroll) || 0,
      eventName: this.$route.query.eventName || '',
      skip: 0,
      orderBy: this.$route.query.orderBy || 'startDate_ASC',
      defaultSortOrder: 'asc',
      isPaginationSimple: false,
      currentPage: parseInt(this.$route.query.currentPage) || 1,
      perPage: this.$route.query.perPage || 25,
      searchQuery: this.$route.query.q || '',
      planInjects: [],
      quickAdd: false,
      openSendToCobra: false,
      injectToCobra: null,
      planInject: new PlanInject(),
      previewModal: false,
      isEdit: false,
      displayGroup: {
        title: ''
      },
      selectedGroupLabel: null,
      fullCreate: false,
      downloadInProgress: false,
      btableSort: 'startDate'
    }
  },
  updated() {
    if (
      this.scroll &&
      this.planInjectsSearch &&
      this.planInjectsSearch.length > 0
    ) {
      window.scrollTo(0, this.scroll)
    }
  },
  mounted() {
    if (this.$route.query.orderBy) {
      let btableData = this.$route.query.orderBy.split('_')
      this.btableSort = btableData[0]
      this.defaultSortOrder = btableData[1].toLowerCase()
    }
  },
  watch: {
    eventName() {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          eventName: this.eventName
        })
      })
    },
    orderBy() {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          orderBy: this.orderBy
        })
      })
    },
    searchQuery() {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { q: this.searchQuery })
      })
    },
    currentPage() {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          currentPage: this.currentPage
        })
      })
    },
    perPage() {
      this.$router.push({
        query: Object.assign({}, this.$route.query, { perPage: this.perPage })
      })
    }
  },
  methods: {
    downloadInjects(type) {
      this.downloadInProgress = true
      let currentDate = this.moment().format('DDMMYYYY HHmm')
      let fileName =
        'MSEL ' +
        this.$store.state.activeWorkspace.displayName +
        ' ' +
        currentDate +
        '.' +
        type
      let args = {
        where: {
          event: this.eventName,
          query: this.searchQuery,
          orderBy: this.orderBy,
          fileType: type
        }
      }
      this.planInjectExportFile(type, fileName, args)
      this.downloadInProgress = false
    },
    onSort(field, order) {
      this.btableSort = field
      this.orderBy = field + '_' + order.toUpperCase()
    },
    onPageChange(page) {
      this.currentPage = page
      this.skip = (this.currentPage - 1) * this.perPage
    },
    editPlanInject(number) {
      let scrollPos = window.scrollY
      this.$router.push({
        query: Object.assign({}, this.$route.query, { scroll: scrollPos })
      })
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
    close() {
      this.quickAdd = false
      this.fullCreate = false
      this.errors.clear()
      this.$validator.reset()
      this.planInject = new PlanInject()
    },
    toggleQuickAdd(fullValue) {
      this.quickAdd = true
      this.errors.clear()
      this.$validator.reset()
      this.planInject = new PlanInject()
      if (fullValue) {
        this.fullCreate = fullValue
      }
    },
    confirmDelete(inject) {
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
          this.$apollo.queries.planInjectsSearch.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Inject Deleted: ' + error)
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
    sendToCobra(inject) {
      this.injectToCobra = inject
      this.openSendToCobra = true
    },
    closeSendToCobra() {
      this.openSendToCobra = false
    }
  }
}
</script>

<style lang="scss" scoped>
.inject-deleted {
  background: #cccccc;
}
.attachments {
  .fa-2x {
    font-size: 1em;
  }
}
.b-table .table {
  width: auto;
}
</style>
