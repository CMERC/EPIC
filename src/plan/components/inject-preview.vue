<template>
  <div class="modal"
       :class="{'is-active': open}">
    <div class="modal-background"
         @click="cancel()"></div>
    <div class="modal-card"
         v-if="planInject"
         :class="{'has-ribbon-left is-small': isInjectPastDue(planInject, planInject.status)}">
      <div class="ribbon is-small is-danger"
           v-if="isInjectPastDue(planInject, planInject.status)">
        Past Due
      </div>
      <header class="modal-card-head">
        <div class="modal-card-title">
          <p class="title">{{planInject.title}}</p>
          <p class="subtitle">#{{planInject.number}} - <span class="has-text-weight-light tooltip is-tooltip-bottom"
                                                             :data-tooltip="formatDate(planInject.startDate, 'utc-dtg')">{{formatDate(planInject.startDate, 'dtg')}}</span></p>
          <p class="subtitle"
             v-if="planInject.status != null"><span class="tag is-rounded"
                                                    :style="'background-color:'+planInject.status.color"
                                                    :class="lightOrDark(planInject.status.color)">{{planInject.status.title}}</span></p>
        </div>
        <b-dropdown position="is-bottom-left">
          <a class="button is-small"
             slot="trigger">
            <span class="icon is-small">
              <i class="fas fa-ellipsis-v"></i>
            </span>
          </a>
          <b-dropdown-item @click="editPlanInject(planInject.number, '0')">
            <span class="icon is-small">
              <i class="fas fa-pen"></i>
            </span>
            <span>Edit Inject</span>
          </b-dropdown-item>
          <b-dropdown-item @click="viewPlanInject(planInject.id)">
            <span class="icon is-small">
              <i class="fas fa-eye"></i>
            </span>
            <span>View Inject</span>
          </b-dropdown-item>
          <b-dropdown-item @click="sendToCobra(planInject)">
            <span class="icon is-small">
              <i class="fas fa-share-square"></i>
            </span>
            <span>Send To Cobra</span>
          </b-dropdown-item>
          <b-dropdown-item @click="duplicatePlanInject(planInject.id)">
            <span class="icon is-small">
              <i class="fas fa-copy"></i>
            </span>
            <span>Duplicate Inject</span>
          </b-dropdown-item>
          <hr class="dropdown-divider">
          <b-dropdown-item @click="confirmDeleteInject(planInject.id)">
            <span class="icon is-small">
              <i class="fas fa-times has-text-danger"></i>
            </span>
            <span>Delete Inject</span>
          </b-dropdown-item>
        </b-dropdown>
        <button class="is-large delete"
                aria-label="close"
                @click="cancel()"></button>
      </header>
      <section class="modal-card-body">
        <b-tabs>
          <b-tab-item label="Inject Details"
                      class="injectDetails">
            <div class="columns">
              <div class="column">
                <p class="title is-6">Owner</p>
                <p class="subtitle is-6">{{planInject.owner ? planInject.owner.title : ''}}</p>
              </div>
              <div class="column">
                <p class="title is-6">From</p>
                <p class="subtitle is-6">{{planInject.from}}</p>
              </div>
              <div class="column">
                <p class="title is-6">To</p>
                <p class="subtitle is-6">{{planInject.to}}</p>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <p class="title is-6">Type</p>
                <p class="subtitle is-6">{{planInject.type}}</p>
              </div>
              <div class="column">
                <p class="title is-6">Inject Method</p>
                <p class="subtitle is-6"
                   v-if="planInject.method">
                  <span class="icon is-small"
                        v-if="planInject.method && planInject.method.icon"
                        :key="planInject.method.icon">
                    <i :class="planInject.method.icon"
                       :style="'color:'+planInject.method.color"
                       v-if="planInject.method && planInject.method.color"></i>
                  </span>
                  <span v-if="planInject.method"> {{ truncate(planInject.method.name, 50)}}</span>
                </p>
              </div>
              <div class="column">
                <p class="title is-6">Event</p>
                <p class="subtitle is-6"
                   v-if="planInject.events">
                  <router-link :to="{name: 'view-event', params: {id: planInject.events.id} }"
                               v-if="planInject.events.id">
                    <span class="tag is-rounded"
                          :style="'background-color:'+planInject.events.color"
                          :class="lightOrDark(planInject.events.color)">{{truncate(planInject.events.name, 25)}}</span>
                  </router-link>
                </p>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <p class="title is-6">Last Updated</p>
                <p class="subtitle is-6">
                  <span class="tooltip"
                        :data-tooltip="formatDate(planInject.updatedAt, 'utc-dtg')">{{formatDate(planInject.updatedAt, 'fromNow')}}</span>
                </p>
              </div>
            </div>
            <hr class="hr" />
            <div class="columns is-multiline">
              <div class="column is-12">
                <div class="field">
                  <p class="title is-6">Trigger</p>
                  <p class="subtitle is-6">{{planInject.trigger ? planInject.trigger : "None"}}</p>
                </div>
              </div>
              <div class="column is-12">
                <div class="field">
                  <p class="title is-6">Anticipated Response</p>
                  <p class="subtitle is-6">{{planInject.response ? planInject.response : "None"}}</p>
                </div>
              </div>
              <div class="column is-12">
                <div class="field">
                  <p class="title is-6">Admin Remarks</p>
                  <p class="subtitle is-6">{{planInject.remarks ? planInject.remarks : "None"}}</p>
                </div>
              </div>
              <div class="column is-12">
                <div class="field attachments">
                  <p class="title is-6">Attachments</p>
                  <table class="table is-6">
                    <tr v-for="attachment in planInject.attachments"
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
              </div>
              <div class="column is-12">
                <div class="field responseTime">
                  <p class="title is-6">Response Time</p>
                  <span class="subtitle is-6 tooltip"
                        :data-tooltip="formatDate(planInject.responseDate, 'utc-dtg')"
                        v-if="planInject.responseDate">
                    {{ showDiff(planInject.startDate, planInject.responseDate)}}
                  </span>
                  <span v-else>None</span>
                </div>
              </div>
              <div class="column is-12">
                <div class="field">
                  <p class="title is-6">Actual Response</p>
                  <p class="subtitle is-6">{{ planInject.mitigation ? planInject.mitigation : "None" }}</p>
                </div>
              </div>
              <div class="column is-12">
                <div class="field">
                  <p class="title is-6">Location</p>
                  <p class="subtitle is-6">
                    <geocode :coordinates="planInject.location.geojson.coordinates"
                             v-if="planInject.location"></geocode>
                    <span v-else>None</span>
                  </p>
                </div>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item class="trainingObjectives">
            <template slot="header">
              <span style="margin-right:5px;">Training Objectives</span> <span class="tag is-rounded">{{formatNumber(planInject.objectives.length, 'thousands')}}</span>
            </template>
            <b-table :data="planInject.objectives"
                     :loading="loading"
                     paginated
                     :per-page="perPage"
                     detailed
                     detail-key="id"
                     :pagination-simple="isPaginationSimple"
                     :default-sort-direction="defaultSortOrder"
                     default-sort="participant.name">
              <template slot-scope="props">
                <b-table-column field="participant"
                                label="Participant"
                                sortable>
                  {{ props.row.participant.name}}
                </b-table-column>
                <b-table-column field="platform.platform.title"
                                label="Platform: Type"
                                sortable>
                  {{props.row.platform && props.row.platform.platform ? props.row.platform.platform.title +': ' + props.row.platform.platform.type : "None"}}
                </b-table-column>
                <b-table-column field="jmet"
                                label="JMET"
                                centered
                                sortable>
                  <span v-if="props.row.jmet">{{ props.row.jmet.description }}</span>
                </b-table-column>
              </template>
              <template slot="detail"
                        slot-scope="props">
                <article class="media">
                  <div class="columns is-multiline">
                    <div class="column is-12">
                      <div class="field is-grouped">
                        <div class="control">
                          <p class="title is-6">Requested Method</p>
                          <p class="subtitle is-6">{{ props.row.requestedMethodType ? props.row.requestedMethodType.title : "None" }}</p>
                        </div>
                        <div class="control">
                          <p class="title is-6">Training Method</p>
                          <p class="subtitle is-6">{{ props.row.trainedMethodType ? props.row.trainedMethodType.title : "None" }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="field is-grouped">
                        <div class="control">
                          <p class="title is-6">Priority</p>
                          <p class="subtitle is-6">
                            <span class="tag"
                                  :style="'background-color:'+props.row.priorityLevel.color"
                                  v-if="props.row.priorityLevel && props.row.priorityLevel.title"
                                  :class="lightOrDark(props.row.priorityLevel.color)">{{ props.row.priorityLevel.title}}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="field">
                        <p class="title is-6">Task</p>
                        <pre class="content">{{props.row.task}}</pre>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="field">
                        <p class="title is-6">Condition</p>
                        <pre class="content">{{props.row.condition}}</pre>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="field">
                        <p class="title is-6">Standard</p>
                        <pre class="content">{{props.row.standard}}</pre>
                      </div>
                    </div>

                    <div class="column is-12">
                      <div class="field">
                        <p class="title is-6">Measures</p>
                        <ul class="bd-anchors-list"
                            v-if="props.row.measures.length > 0">
                          <li v-for="measure in props.row.measures"
                              :key="measure.id">{{measure.title}}</li>
                        </ul>
                        <div v-else>
                          <p class="subtitle is-6">None</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </template>
            </b-table>
          </b-tab-item>
          <b-tab-item label="Activity Log">
            <activity-stream :id="planInject ? planInject.id:''"
                             @createdBy="value=>{injectCreatedBy = value}"/>
          </b-tab-item>
          <b-tab-item label="Alerts"
                      v-if="injectAlertChecker(planInject, planInject.status) || isInjectPastDue(planInject, planInject.status)">
            <span class="has-text-danger"
                  v-if="isInjectPastDue(planInject, planInject.status)">Inject is currently Past Due</span>
            <div v-html="injectAlertChecker(planInject, planInject.status)"></div>
          </b-tab-item>
        </b-tabs>
      </section>
      <footer class="modal-card-foot">
        <b-dropdown v-if="showStatusButton"
                    position="is-top-right"
                    v-model="selectedStatus">
          <a class="button is-primary"
             slot="trigger"
             :style="'background-color:'+selectedStatus.color"
             :class="lightOrDark(selectedStatus.color)">
            <span>{{selectedStatus ? selectedStatus.title : 'Status'}}</span>
            <span class="icon">
              <i class="fas fa-caret-down"></i>
            </span>
          </a>
          <b-dropdown-item v-for="status in filteredStatus"
                           v-bind:key="status.id"
                           @click="setStatus(planInject.id, status)"
                           paddingless>
            <span class="tag is-rounded"
                  :style="'background-color:'+status.color"
                  :class="lightOrDark(status.color)">{{status.title}}</span>
            <hr class="dropdown-divider">
          </b-dropdown-item>
        </b-dropdown>
        <a class="button is-primary is-outlined"
           @click="editPlanInject(planInject.number, '0')">
          Edit Inject
        </a>
        <a class="button is-primary is-outlined"
           @click="viewPlanInject(planInject.id, '0')">
          View Inject
        </a>
        <a class="button"
           @click="editPlanInject(planInject.number, '1')">
          Edit Response
        </a>
      </footer>
      <cobra-connect v-if="openSendToCobra"
                     :open="openSendToCobra"
                     :inject="injectToCobra"
                     @close="closeSendToCobra" />
    </div>
  </div>
</template>

<script>
import {
  PlanLabelsRead,
  PlanLabelSubscription
} from '@/plan/graphql/PlanLabels.gql'
import {
  PlanInjectRead,
  PlanInjectsUpdate,
  PlanInjectsDelete,
  DuplicatePlanInject
} from '@/plan/graphql/PlanInjects.gql'
import lightOrDark from '@/shared/mixins/lightOrDark'
import helpers from '@/shared/mixins/helpers'
import file from '@/shared/mixins/file'
import Geocode from '@/shared/components/geocode'
import dateChecks from '@/shared/mixins/dateChecks'
import ActivityStream from '@/shared/components/activity-stream'
import injectStatusCheck from '@/shared/mixins/injectStatusCheck'
import CobraConnect from '@/plan/components/cobra-connect'
export default {
  name: 'inject-preview',

  mixins: [helpers, lightOrDark, dateChecks, file, injectStatusCheck],
  components: { Geocode, ActivityStream, CobraConnect },
  props: {
    id: {
      type: String,
      default: ''
    },
    open: {
      default: false
    },
    showStatusButton: {
      default: true
    }
  },
  apollo: {
    planLabels: {
      query: PlanLabelsRead,
      update(data) {
        if (data && data.planLabels && data.planLabels.length > 0) {
          return data.planLabels
        }
      },
      skip() {
        return !this.id
      },
      subscribeToMore: [
        {
          document: PlanLabelSubscription,
          // Mutate the previous result
          updateQuery(previousResult, { subscriptionData }) {
            // Mutation type
            let mutationIn = subscriptionData.data.planLabel.mutation
            let newResult
            switch (mutationIn) {
              case 'CREATED': {
                newResult = {
                  planLabels: [
                    ...previousResult.planLabels,
                    subscriptionData.data.planLabel.node
                  ]
                }
                break
              }
              case 'DELETED': {
                newResult = {
                  planLabels: [
                    ...previousResult.planLabels.filter(
                      obj =>
                        subscriptionData.data.planLabel.previousValues.id !==
                        obj.id
                    )
                  ]
                }
                break
              }
              case 'UPDATED': {
                let updatedPlanLabels = JSON.parse(
                  JSON.stringify(previousResult.planLabels)
                )
                let index = updatedPlanLabels.findIndex(
                  x => x.id === subscriptionData.data.planLabel.node.id
                )
                updatedPlanLabels[index] = subscriptionData.data.planLabel.node
                newResult = {
                  planLabels: updatedPlanLabels
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
    },
    planInject: {
      query: PlanInjectRead,
      variables() {
        return {
          where: {
            id: this.id || ''
          }
        }
      },
      skip() {
        return !this.id
      },
      update(data) {
        if (data && data.planInject) {
          if (data.planInject.status != null)
            this.selectedStatus = data.planInject.status
          return data.planInject
        }
      }
    }
  },
  data() {
    return {
      injectCreatedBy: null,
      planInject: null,
      filter: '',
      selectedStatus: '',
      planLabels: [],
      loading: false,
      defaultSortOrder: 'asc',
      isPaginationSimple: false,
      perPage: '25',
      openSendToCobra: false,
      injectToCobra: null,
    }
  },
  methods: {
    setStatus(id, status) {
      this.selectedStatus = status
      this.injectStatusCheck(this.planInject, this.selectedStatus)

      this.$apollo
        .mutate({
          mutation: PlanInjectsUpdate,
          variables: {
            data: {
              status: {
                connect: {
                  id: status.id
                }
              }
            },
            where: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          this.$apollo.queries.planInject.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Status Update: ' + error)
        })
    },
    cancel() {
      this.$emit('close')
    },
    confirmDeleteInject(inject) {
      this.$buefy.dialog.confirm({
        title: 'Remove Inject',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteInject(inject)
      })
    },
    deleteInject(inject) {
      this.$apollo
        .mutate({
          mutation: PlanInjectsDelete,
          variables: {
            id: {
              id: inject
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Inject Deleted!',
            type: 'is-success'
          })
          this.cancel()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Inject Deleted: ' + error)
        })
    },
    editPlanInject(id, step) {
      this.$router.push({
        name: 'planInjectView',
        params: { number: id },
        query: { from: this.$route.fullPath, step: step }
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
    viewPlanInject(id) {
      this.$router.push({
        name: 'view-inject',
        params: { id: id }
      })
    },
    sendToCobra(inject) {
      this.injectToCobra = inject
      this.openSendToCobra = true
    },
    closeSendToCobra() {
      this.openSendToCobra = false
    }
  },
  computed: {
    filteredStatus() {
      return this.planLabels.filter(label => {
        let searchRegex = new RegExp(this.filter, 'i')
        return searchRegex.test(JSON.stringify(label))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title:not(.is-spaced) + .subtitle + .subtitle {
  margin-top: -1.25rem;
}

.responseTime {
  p.title {
    margin-bottom: 0;
    + span.subtitle {
      margin-top: -1.25rem;
    }
  }
}
.hr {
  margin: 1rem 0;
}
.injectHeader {
  margin-bottom: 1rem;
  span {
    margin: 0 0.5rem;
    color: #363636;
    font-weight: 600;
    line-height: 1.125;
    text-decoration: none;
  }
}
.b-tabs .title {
  text-decoration: underline;
}
.modal {
  .modal-card-foot {
    .dropdown {
      margin-right: 10px;
    }
  }
  .modal-card-head {
    .dropdown {
      margin-right: 1rem;
    }
  }
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
