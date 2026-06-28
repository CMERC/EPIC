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
    <section class="msel-control-overview">
      <div class="control-overview-header">
        <div>
          <p class="eyebrow">Exercise control</p>
          <h1 class="title is-4">MSEL readiness board</h1>
          <p class="subtitle is-6">
            Review the control details that make each inject playable, observable, and useful during assessment.
          </p>
        </div>
        <div class="control-score"
             :class="controlScoreTone">
          <span>{{ controlReadinessScore }}%</span>
          <small>Ready on this page</small>
        </div>
      </div>
      <div class="control-metrics">
        <div v-for="metric in controlMetrics"
             :key="metric.key"
             class="control-metric"
             :class="{'is-attention': metric.attention}">
          <span class="metric-icon">
            <i :class="metric.icon"></i>
          </span>
          <span>
            <strong>{{ metric.value }}</strong>
            <small>{{ metric.label }}</small>
          </span>
        </div>
      </div>
    </section>
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
          <b-table-column label="Control Readiness">
            <div class="control-chip-wrap">
              <span v-for="item in injectReadinessItems(props.row)"
                    :key="item.key"
                    class="control-chip"
                    :class="item.complete ? 'is-complete' : 'is-missing'"
                    :title="item.complete ? item.readyText : item.missingText">
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
              </span>
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
                  <p class="title is-6">Controller Readiness</p>
                  <div class="control-chip-wrap is-detail">
                    <span v-for="item in injectReadinessItems(props.row)"
                          :key="item.key"
                          class="control-chip"
                          :class="item.complete ? 'is-complete' : 'is-missing'">
                      <i :class="item.icon"></i>
                      <span>{{ item.complete ? item.readyText : item.missingText }}</span>
                    </span>
                  </div>
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
  computed: {
    visibleInjects() {
      return this.planInjectsSearch || []
    },
    controlReadinessScore() {
      if (!this.visibleInjects.length) {
        return 0
      }
      let possible = this.visibleInjects.length * this.readinessTemplate().length
      let complete = this.visibleInjects.reduce((count, inject) => {
        return (
          count +
          this.injectReadinessItems(inject).filter(item => item.complete).length
        )
      }, 0)
      return Math.round((complete / possible) * 100)
    },
    controlScoreTone() {
      if (this.controlReadinessScore >= 80) {
        return 'is-strong'
      }
      if (this.controlReadinessScore >= 55) {
        return 'is-building'
      }
      return 'is-starting'
    },
    controlMetrics() {
      let total = this.visibleInjects.length
      let missingOwner = this.visibleInjects.filter(inject => !inject.owner || !inject.owner.title).length
      let missingTiming = this.visibleInjects.filter(inject => !inject.startDate).length
      let missingTrigger = this.visibleInjects.filter(inject => !inject.trigger).length
      let missingObjectives = this.visibleInjects.filter(inject => !inject.objectives || inject.objectives.length === 0).length
      let noResponseCapture = this.visibleInjects.filter(inject => !inject.response && !inject.mitigation).length

      return [
        {
          key: 'total',
          label: 'visible injects',
          value: total,
          icon: 'fas fa-stream',
          attention: false
        },
        {
          key: 'owner',
          label: 'missing controller',
          value: missingOwner,
          icon: 'fas fa-headset',
          attention: missingOwner > 0
        },
        {
          key: 'timing',
          label: 'missing timing',
          value: missingTiming,
          icon: 'fas fa-clock',
          attention: missingTiming > 0
        },
        {
          key: 'trigger',
          label: 'missing trigger',
          value: missingTrigger,
          icon: 'fas fa-bolt',
          attention: missingTrigger > 0
        },
        {
          key: 'objectives',
          label: 'without TO link',
          value: missingObjectives,
          icon: 'fas fa-bullseye',
          attention: missingObjectives > 0
        },
        {
          key: 'response',
          label: 'missing response capture',
          value: noResponseCapture,
          icon: 'fas fa-clipboard-check',
          attention: noResponseCapture > 0
        }
      ]
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
    readinessTemplate() {
      return [
        {
          key: 'owner',
          label: 'Owner',
          icon: 'fas fa-headset',
          readyText: 'Controller assigned',
          missingText: 'Needs controller',
          complete: inject => !!(inject.owner && inject.owner.title)
        },
        {
          key: 'timing',
          label: 'Time',
          icon: 'fas fa-clock',
          readyText: 'Start time set',
          missingText: 'Needs start time',
          complete: inject => !!inject.startDate
        },
        {
          key: 'method',
          label: 'Method',
          icon: 'fas fa-share-alt',
          readyText: 'Delivery method set',
          missingText: 'Needs delivery method',
          complete: inject => !!inject.method
        },
        {
          key: 'trigger',
          label: 'Trigger',
          icon: 'fas fa-bolt',
          readyText: 'Trigger defined',
          missingText: 'Needs trigger',
          complete: inject => !!inject.trigger
        },
        {
          key: 'objectives',
          label: 'TO',
          icon: 'fas fa-bullseye',
          readyText: 'Training objective linked',
          missingText: 'Needs training objective',
          complete: inject => !!(inject.objectives && inject.objectives.length)
        },
        {
          key: 'response',
          label: 'Response',
          icon: 'fas fa-clipboard-check',
          readyText: 'Expected or actual response captured',
          missingText: 'Needs response capture',
          complete: inject => !!(inject.response || inject.mitigation)
        }
      ]
    },
    injectReadinessItems(inject) {
      return this.readinessTemplate().map(item => {
        return Object.assign({}, item, {
          complete: item.complete(inject || {})
        })
      })
    },
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
.msel-control-overview {
  background:
    linear-gradient(135deg, rgba(29, 78, 216, 0.12), rgba(20, 184, 166, 0.1)),
    var(--app-surface, #ffffff);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
  margin: 0 0 1.25rem;
  padding: 1rem;
}

.control-overview-header {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;

  .title,
  .subtitle {
    margin-bottom: 0.25rem;
  }
}

.eyebrow {
  color: var(--app-text-muted, #64748b);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
}

.control-score {
  align-items: center;
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  min-height: 88px;
  min-width: 116px;
  padding: 0.75rem;

  span {
    color: var(--app-text-strong, #0f172a);
    font-size: 1.7rem;
    font-weight: 800;
    line-height: 1;
  }

  small {
    color: var(--app-text-muted, #64748b);
    font-size: 0.68rem;
    font-weight: 700;
    margin-top: 0.35rem;
    text-align: center;
    text-transform: uppercase;
  }

  &.is-strong {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.32);
  }

  &.is-building {
    background: rgba(245, 158, 11, 0.14);
    border-color: rgba(245, 158, 11, 0.34);
  }

  &.is-starting {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.28);
  }
}

.control-metrics {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.control-metric {
  align-items: center;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 8px;
  display: flex;
  gap: 0.65rem;
  min-height: 66px;
  padding: 0.7rem;

  .metric-icon {
    align-items: center;
    background: rgba(15, 23, 42, 0.06);
    border-radius: 8px;
    color: #2563eb;
    display: inline-flex;
    height: 34px;
    justify-content: center;
    width: 34px;
  }

  strong,
  small {
    display: block;
  }

  strong {
    color: var(--app-text-strong, #0f172a);
    font-size: 1.15rem;
    line-height: 1.05;
  }

  small {
    color: var(--app-text-muted, #64748b);
    font-size: 0.72rem;
    font-weight: 700;
    margin-top: 0.2rem;
    text-transform: uppercase;
  }

  &.is-attention {
    border-color: rgba(245, 158, 11, 0.38);

    .metric-icon {
      background: rgba(245, 158, 11, 0.14);
      color: #b45309;
    }
  }
}

.control-chip-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;

  &.is-detail {
    gap: 0.5rem;
  }
}

.control-chip {
  align-items: center;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 700;
  gap: 0.3rem;
  line-height: 1;
  min-height: 28px;
  padding: 0.32rem 0.55rem;

  &.is-complete {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.28);
    color: #047857;
  }

  &.is-missing {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.22);
    color: #b91c1c;
  }
}

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

@media (max-width: 768px) {
  .control-overview-header {
    align-items: stretch;
    flex-direction: column;
  }

  .control-score {
    min-width: 100%;
  }
}
</style>
