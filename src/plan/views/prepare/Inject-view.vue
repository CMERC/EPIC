<template>
  <div class="is-relative-mobile">
    <breadcrumb :currentPage="planInject ? '#'+ planInject.number +' ' + truncate(planInject.title, 30) : ''" />
    <div v-if="planInject">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <div class="field">
              <label class="title is-4">
                {{planInject ? '#'+ planInject.number +' ' + truncate(planInject.title, 30) : ''}}
              </label>
              <p class="control tooltip is-size-6"
                 :data-tooltip="formatDate(planInject.startDate, 'utc-dtg')">
                {{ formatDate(planInject.startDate, 'dtg') }}
              </p>
              <p class="control ribbon is-small is-danger is-relative"
                 v-if="isInjectPastDue(planInject, planInject.status)">Past Due</p>
              <p class="control ribbon is-small is-warning is-relative"
                 :class="{'tooltip': injectAlertChecker(planInject, planInject.status)}"
                 data-tooltip="Edit Date and Time"
                 v-if="injectAlertChecker(planInject, planInject.status)">Alert</p>
            </div>
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
              <b-dropdown-item @click="editPlanInject(planInject.number)">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Inject</span>
              </b-dropdown-item>
              <b-dropdown-item @click="sendToCobra(planInject)">
                <span class="icon is-small">
                  <i class="fas fa-share-square"></i>
                </span>
                <span>Send To Cobra</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="level-item">
            <help-content :reference="'plan.prepare.viewinject'"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <div class="columns is-multiline">
        <div class="column">
          <div class="card">
            <div class="card-content">
              <article class="media">
                <div class="columns is-multiline">
                  <div class="column is-full">
                    <div class="field">
                      <p class="title is-6">Trigger</p>
                      <p class="subtitle is-6">
                        {{ planInject.trigger ? planInject.trigger : "None" }}
                      </p>
                    </div>
                    <div class="field">
                      <p class="title is-6">Anticipated Response</p>
                      <p class="subtitle is-6">{{ planInject.response ? planInject.response : "None" }}</p>
                    </div>
                    <div class="field">
                      <p class="title is-6">Remarks</p>
                      <p class="subtitle is-6">{{ planInject.remarks ? planInject.remarks : "None" }}</p>
                    </div>
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
                    <div class="field">
                      <p class="title is-6">Response Time</p>
                      <p class="subtitle is-6">
                        <span class="tooltip"
                              :data-tooltip="formatDate(planInject.responseDate ,'utc-dtg')"
                              v-if="planInject.responseDate">
                          {{ showDiff(planInject.startDate, planInject.responseDate)}}
                        </span>
                        <span v-else>None</span>
                      </p>
                    </div>
                    <div class="field">
                      <p class="title is-6">Actual Response</p>
                      <p class="subtitle is-6">{{ planInject.mitigation ? planInject.mitigation : "None" }}</p>
                    </div>
                    <div class="field">
                      <p class="title is-6">Location</p>
                      <p class="subtitle is-6">
                        <geocode :coordinates="planInject.location.geojson.coordinates"
                                 v-if="planInject.location"></geocode>
                        <span v-else>None</span>
                      </p>
                    </div>
                  </div>
                  <div class="column is-full">
                    <div class="field">
                      <p class="title is-6">Training Objectives &amp; Trained Method</p>
                      <ul class="is-list-none subtitle"
                          v-if="planInject.objectives">
                        <li v-for="objective in planInject.objectives"
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
                </div>
              </article>
            </div>
          </div>
        </div>
        <div class="column is-narrow">
          <div class="card sideMenu">
            <div class="card-content">
              <div class="field"><label class="label">
                                   Status
                                 </label>
                <p v-if="planInject.status"
                   class="control"><span class="tag is-rounded"
                                         :style="'background-color:'+planInject.status.color"
                                         :class="lightOrDark(planInject.status.color)">{{planInject.status.title}}</span></p>
              </div>
              <hr class="dropdown-divider">
              <div class="field"><label class="label">
                                   Event
                                 </label>
                <div class="control"
                     v-if="planInject.events">
                  <router-link :to="{name: 'view-event', params: {id: planInject.events.id} }"
                               v-if="planInject.events.id">
                    <span class="tag is-rounded tooltip"
                          :data-tooltip="planInject.events.name"
                          :style="'background-color:'+planInject.events.color"
                          :class="lightOrDark(planInject.events.color)">{{planInject.events.name | truncate(20)}}</span>
                  </router-link>
                </div>
              </div>
              <hr class="dropdown-divider">
              <div class="field"><label class="label">
                                   Owner
                                 </label>
                <p class="control"
                   v-if="planInject.owner">{{ planInject.owner.title | truncate(50)}}</p>
              </div>
              <hr class="dropdown-divider">
              <div class="field"><label class="label">
                                   Type/Method
                                 </label>
                <div class="control">
                  <p v-if="planInject.type">{{ planInject.type | truncate(50)}}</p>
                  <p v-if="planInject.method">
                    <span class="icon is-small"
                          v-if="planInject.method.icon"
                          :key="planInject.method.icon">
                      <i :class="planInject.method.icon"
                         :style="'color:'+planInject.method.color"
                         v-if="planInject.method.color"></i>
                    </span>
                    <span> {{ planInject.method.name | truncate(50)}}</span>
                  </p>
                </div>
              </div>
              <hr class="dropdown-divider">
              <div class="field"><label class="label">
                                   From > To
                                 </label>
                <div class="control">
                  <span v-if="planInject.from">{{ planInject.from | truncate(50)}}</span> > <span v-if="planInject.to">{{ planInject.to | truncate(50)}}</span>
                </div>
              </div>
              <hr class="dropdown-divider">
              <div class="field"><label class="label">
                                   Created at
                                 </label>
                <div class="control">
                  <span class="tooltip"
                        :data-tooltip="formatDate(planInject.createdAt, 'utc-dtg')">{{ formatDate(planInject.createdAt, 'dtg')}}</span>
                </div>
              </div>
              <div class="field"><label class="label">
                                   Created by
                                 </label>
                <div class="control">
                  <span v-if="injectCreatedBy">{{ injectCreatedBy }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-full">
          <section class="section">
            <label class="label">
              Activity Log
            </label>
            <activity-stream :id="planInject ? planInject.id:''"
                             @createdBy="value=>{injectCreatedBy = value}"/>
          </section>
        </div>
      </div>
    </div>
    <div v-else>
      <empty-state :data="planInject"
                   :isLoading='$apollo.loading' />
    </div>
    <cobra-connect v-if="openSendToCobra"
                   :open="openSendToCobra"
                   :inject="injectToCobra"
                   @close="closeSendToCobra" />
  </div>
</template>

<script>
import lightOrDark from '@/shared/mixins/lightOrDark'
import { PlanInjectRead } from '@/plan/graphql/PlanInjects.gql'
import Geocode from '@/shared/components/geocode'
import HelpContent from '@/shared/components/helpcontent'
import dateChecks from '@/shared/mixins/dateChecks'
import file from '@/shared/mixins/file'
import mediaCheck from '@/shared/mixins/mediaCheck'
import ActivityStream from '@/shared/components/activity-stream'
import injectStatusCheck from '@/shared/mixins/injectStatusCheck'
import CobraConnect from '@/plan/components/cobra-connect'
export default {
  name: 'inject-view',
  components: { HelpContent, ActivityStream, Geocode, CobraConnect },
  props: ['id'],
  mixins: [lightOrDark, dateChecks, file, mediaCheck, injectStatusCheck],
  apollo: {
    planInject: {
      query: PlanInjectRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      }
    }
  },
  data() {
    return { 
      injectCreatedBy: null,      
      openSendToCobra: false,
      injectToCobra: null
      }
  },
  methods: {
    editPlanInject(number) {
      this.$router.push({
        name: 'planInjectView',
        params: { number: number },
        query: { from: this.$route.fullPath }
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
</style>
