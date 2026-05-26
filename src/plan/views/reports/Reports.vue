<template>
  <div class="is-relative-mobile plan-reports">
    <breadcrumb :currentPage="planCustomReport ? planCustomReport.title : ''" />
    <nav class="level">
      <div class="level-left">
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <label class="label">
                  Source
                </label>
              </div>
            </div>
            <div class="field is-narrow">
              <div class="control">
                <div class="select">
                  <select v-model="selectedTOsSource">
                    <option v-for="source in assessSourceType"
                            :key="source">
                      {{source}}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="level-item"
           v-if="planCustomReport">
        <p class="has-text-centered">
          <span class="title is-6">{{planCustomReport.title}}</span><br />
          <span class="subtitle is-7">
            <span class="tooltip"
                  :data-tooltip="formatDate(planCustomReport.start, 'utc-dtg')"> {{ formatDate(planCustomReport.start, 'dtg')}}</span>
            <span class="tooltip"
                  :data-tooltip="formatDate(planCustomReport.end, 'utc-dtg')"
                  v-if="planCustomReport.start && planCustomReport.end"> -
              {{ formatDate(planCustomReport.end, 'dtg')}}</span>
          </span>
        </p>
      </div>
      <div class="level-right">
        <div class="level-item">
          <help-content :reference="'plan.reports'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div class="columns is-multiline">
      <div class="column is-half-desktop is-12-tablet">
        <article>
          <div ref="requestedvsplannedTOs"
               id="requestedvsplannedTOs"></div>
        </article>
      </div>
      <div class="column is-half-desktop is-12-tablet">
        <article>
          <div ref="plannedVSAssessedTOs"
               id="plannedVSAssessedTOs"></div>
        </article>
      </div>
      <div class="column is-one-third-desktop is-12-tablet">
        <article>
          <div ref="trainingObjectivesReport"
               id="trainingObjectivesReport"></div>
        </article>
      </div>
      <div class="column is-one-third-desktop is-12-tablet">
        <article>
          <div ref="tpu"
               id="tpu"></div>
        </article>
      </div>
      <div class="column is-one-third-desktop is-12-tablet">
        <article>
          <div ref="ineffectiveReasons"
               id="ineffectiveReasons"></div>
        </article>
      </div>
      <div class="column is-12">
        <article>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <label class="label">
                    Training Objective Data
                  </label>
                </div>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select">
                    <select v-model="selectedPerTrainingObjType">
                      <option value="Exercise Objectives">
                        Exercise Objectives
                      </option>
                      <option value="Accredited Task">
                        Accredited Task
                      </option>
                      <option value="Joint Staff Training Priority">
                        Joint Staff Training Priority
                      </option>
                      <option value="Command Priority">
                        Command Training Priority
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-half-desktop is-12-tablet">
              <div ref="ObjsPerTrainingObjs"
                   id="ObjsPerTrainingObjs"></div>
            </div>
            <div class="column is-half-desktop is-12-tablet">
              <div ref="ObjsPerTrainingObjsCount"
                   id="ObjsPerTrainingObjsCount"></div>
            </div>
          </div>
        </article>
      </div>
      <div class="column is-12">
        <article>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <label class="label">
                    Training Objective per Participant Category
                  </label>
                </div>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select">
                    <select v-model="selectedParticipantTypePerTOs">
                      <option value="Participant Type">
                        Participant Type
                      </option>
                      <option value="Command/Agency">
                        Command/Agency
                      </option>
                      <option value="Service/Department">
                        Service/Department
                      </option>
                      <option value="Service/Department Type">
                        Service/Department Type
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-half-desktop is-12-tablet">
              <div ref="ParticipantTypePerTOs"
                   id="ParticipantTypePerTOs"></div>
            </div>
            <div class="column is-half-desktop is-12-tablet">
              <div ref="ParticipantTypePerTOsCount"
                   id="ParticipantTypePerTOsCount"></div>
            </div>
          </div>
        </article>
      </div>
      <div class="column is-half-desktop is-12-tablet">
        <article>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <label class="label">
                    Training Audience per Participant Category
                  </label>
                </div>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select">
                    <select v-model="selectedParticipantAudiencePerTOs">
                      <option value="Participant Type">
                        Participant Type
                      </option>
                      <option value="Command/Agency">
                        Command/Agency
                      </option>
                      <option value="Service/Department">
                        Service/Department
                      </option>
                      <option value="Service/Department Type">
                        Service/Department Type
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref="ParticipantAudiencePerTOsCount"
               id="ParticipantAudiencePerTOsCount"></div>
        </article>
      </div>
      <div class="column is-half-desktop is-12-tablet">
        <article>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <label class="label">
                    Participants per Participant Category
                  </label>
                </div>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select">
                    <select v-model="selectedParticipantsPerTOs">
                      <option value="Participant Type">
                        Participant Type
                      </option>
                      <option value="Command/Agency">
                        Command/Agency
                      </option>
                      <option value="Service/Department">
                        Service/Department
                      </option>
                      <option value="Service/Department Type">
                        Service/Department Type
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref="ParticipantsPerTOsCount"
               id="ParticipantsPerTOsCount"></div>
        </article>
      </div>
      <div class="column is-half-desktop is-12-tablet">
        <article>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <label class="label">
                    Tasks per Participant Type
                  </label>
                </div>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select">
                    <select v-model="selectedTaskParticipantType">
                      <option value="All">
                        All
                      </option>
                      <option v-for="type in planParticipantTypes"
                              :key="type.id">
                        {{type.title}}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref="ParticipantTypeFeedbackTasks"
               id="ParticipantTypeFeedbackTasks"></div>
        </article>
      </div>
      <div class="column is-half-desktop is-12-tablet">
        <article>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <label class="label">
                    Participant Funding Source
                  </label>
                </div>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select">
                    <select v-model="selectedPrimarySource">
                      <option v-for="primaryFunding in planFundingSources"
                              :key="primaryFunding">
                        {{primaryFunding}}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="jepFundingAllocPerParticipant"
               ref="jepFundingAllocPerParticipant"></div>
        </article>
      </div>
      <div class="column is-half-desktop is-12-tablet">
        <article>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field is-narrow">
                <div class="control">
                  <label class="label">
                    Allocated Funding Source
                  </label>
                </div>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select">
                    <select v-model="selectedPSFundAlloc">
                      <option v-for="primaryFunding in planFundingSources"
                              :key="primaryFunding">
                        {{primaryFunding}}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref="jepFundingAllocation"
               id="jepFundingAllocation"></div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { PlanCustomReportRead } from '@/plan/graphql/PlanCustomReports.gql'
import HelpContent from '@/shared/components/helpcontent'
import Plotly from 'plotly.js-dist'
import { GetPlanReport } from '@/plan/graphql/PlanReports.gql'
import { PlanFundingSourcesRead } from '@/plan/graphql/PlanFundingSources.gql'
import PlotlyOptions from '@/shared/mixins/plotlyOptions.js'
import { PlanParticipantTypesRead } from '@/plan/graphql/PlanParticipantType.gql'
import numeral from 'numeral'

export default {
  name: 'plan-reports',
  props: { id: { type: String, default: '' } },
  mixins: [PlotlyOptions],
  components: { HelpContent },
  apollo: {
    planCustomReport: {
      query: PlanCustomReportRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      }
    },
    plannedVSAssessedTOs: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'plannedVSAssessedTOs',
            evaluationType: this.selectedTOsSource
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let chartData = [
            {
              labels: data.getPlanReport.data[0].labels,
              values: data.getPlanReport.data[0].values,
              type: data.getPlanReport.data[0].type,
              marker: data.getPlanReport.data[0].marker,
              textinfo: 'value+percent'
            }
          ]
          Plotly.newPlot(
            this.$refs.plannedVSAssessedTOs,
            chartData,
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Training Objectives <br>Planned vs Assessed</b> <br>Total Planned: ' +
                data.getPlanReport.total,
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    requestedvsplannedTOs: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'requestedvsplannedTOs'
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let chartData = [
            {
              labels: data.getPlanReport.data[0].labels,
              values: data.getPlanReport.data[0].values,
              type: data.getPlanReport.data[0].type,
              marker: data.getPlanReport.data[0].marker,
              textinfo: 'value+percent'
            }
          ]
          Plotly.newPlot(
            this.$refs.requestedvsplannedTOs,
            chartData,
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Training Objectives <br>Requested vs Planned</b> <br>Total Requested: ' +
                data.getPlanReport.total,
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planParticipantTypes: {
      query: PlanParticipantTypesRead,
      error(error) {
        console.error(error)
      }
    },
    planFundingSources: {
      query: PlanFundingSourcesRead,
      update(data) {
        if (data && data.planFundingSources) {
          return [
            ...new Set(
              data.planFundingSources.map(funding => {
                return funding.primarySource
              })
            )
          ]
        }
      },
      error(error) {
        console.error(error)
      }
    },
    trainingObjectivesReport: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'trainingObjectives',
            ...this.getDateRangeVariable(),
            evaluationType: this.selectedTOsSource
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let chartData = [
            {
              labels: data.getPlanReport.data[0].labels,
              values: data.getPlanReport.data[0].values,
              type: data.getPlanReport.data[0].type,
              marker: data.getPlanReport.data[0].marker,
              textinfo: 'value+percent'
            }
          ]

          Plotly.newPlot(
            this.$refs.trainingObjectivesReport,
            chartData,
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Training Objective Completion</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    tpuData: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'tpu',
            ...this.getDateRangeVariable(),
            evaluationType: this.selectedTOsSource
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          Plotly.newPlot(
            this.$refs.tpu,
            JSON.parse(JSON.stringify(data.getPlanReport.data)),
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>T,P,U <br>Status of all JMETs</b> <br>Total: ' +
                data.getPlanReport.total,
              barmode: 'stack',
              showlegend: false,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    ineffectiveReasons: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'ineffectiveReasons',
            ...this.getDateRangeVariable(),
            evaluationType: this.selectedTOsSource
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let reportData = JSON.parse(JSON.stringify(data.getPlanReport.data))
          // Delete keys added by input type to match Ploty data structure
          delete reportData[0].marker
          delete reportData[0].name
          Plotly.newPlot(
            this.$refs.ineffectiveReasons,
            reportData,
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Partially or Untrained <br>Reasons for <br>Training Objectives</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    ParticipantTypePerTOs: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'ParticipantTypePerTOs',
            dataSourceType: this.selectedParticipantTypePerTOs,
            ...this.getDateRangeVariable(),
            evaluationType: this.selectedTOsSource
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let allData = JSON.parse(JSON.stringify(data.getPlanReport.data))
          Plotly.newPlot(
            this.$refs.ParticipantTypePerTOs,
            [allData[0], allData[1]],
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Training Objective Completion per <br>' +
                this.selectedParticipantTypePerTOs +
                '</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          let dataForCount = allData[2]
          // Delete keys added by input type to match Ploty data structure
          delete dataForCount.marker
          delete dataForCount.name
          Plotly.newPlot(
            this.$refs.ParticipantTypePerTOsCount,
            [dataForCount],
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Training Objectives per <br>' +
                this.selectedParticipantTypePerTOs +
                '</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    ParticipantAudiencePerTOs: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'ParticipantAudiencePerTOs',
            dataSourceType: this.selectedParticipantAudiencePerTOs,
            ...this.getDateRangeVariable()
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let allData = JSON.parse(JSON.stringify(data.getPlanReport.data))
          // Delete keys added by input type to match Ploty data structure
          delete allData[0].marker
          delete allData[0].name
          Plotly.newPlot(
            this.$refs.ParticipantAudiencePerTOsCount,
            allData,
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Training Audience per <br>' +
                this.selectedParticipantAudiencePerTOs +
                '</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    ParticipantTypeFeedbackTasks: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'ParticipantTypeFeedbackTasks',
            dataSourceType: this.selectedTaskParticipantType
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let allData = JSON.parse(JSON.stringify(data.getPlanReport.data))
          // Delete keys added by input type to match Ploty data structure
          delete allData[0].marker
          delete allData[0].name
          Plotly.newPlot(
            this.$refs.ParticipantTypeFeedbackTasks,
            allData,
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Task Metrics <br>' +
                this.selectedTaskParticipantType +
                '</b> <br>Total # Tasks Completed: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    ParticipantsPerTOs: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'ParticipantsPerTOs',
            dataSourceType: this.selectedParticipantsPerTOs,
            ...this.getDateRangeVariable()
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let allData = JSON.parse(JSON.stringify(data.getPlanReport.data))
          // Delete keys added by input type to match Ploty data structure
          delete allData[0].marker
          delete allData[0].name
          Plotly.newPlot(
            this.$refs.ParticipantsPerTOsCount,
            allData,
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Participants per <br>' +
                this.selectedParticipantsPerTOs +
                '</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    ObjsPerTrainingObjs: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'ObjsPerTrainingObjs',
            dataSourceType: this.selectedPerTrainingObjType,
            ...this.getDateRangeVariable(),
            evaluationType: this.selectedTOsSource
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          let allData = JSON.parse(JSON.stringify(data.getPlanReport.data))
          let maxLabelLength = Math.max.apply(
            null,
            allData[0].y.map(label => label.length)
          )
          Plotly.newPlot(
            this.$refs.ObjsPerTrainingObjs,
            [allData[0], allData[1]],
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Training Objective Completion per<br>' +
                this.selectedPerTrainingObjType +
                ' </b><br>Total: ' +
                data.getPlanReport.total,
              ...this.stackLayoutOptions,
              margin: {
                l: maxLabelLength * 6,
                r: 20
              }
            },
            this.modeBarOptions
          )
          let dataForCount = allData[2]
          // Delete keys added by input type to match Ploty data structure
          delete dataForCount.marker
          delete dataForCount.name
          Plotly.newPlot(
            this.$refs.ObjsPerTrainingObjsCount,
            [dataForCount],
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>Training Objectives per<br>' +
                this.selectedPerTrainingObjType +
                ' </b><br>Total: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions,
              margin: {
                l: maxLabelLength * 6,
                r: 20
              }
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    jepFundingAllocation: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'jepFundingAllocation',
            dataSourceType: this.selectedPSFundAlloc,
            ...this.getDateRangeVariable()
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          Plotly.newPlot(
            this.$refs.jepFundingAllocation,
            JSON.parse(JSON.stringify(data.getPlanReport.data)),
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>% ' +
                this.selectedPSFundAlloc +
                ' <br>Funding Allocation</b><br> Total: ' +
                numeral(String(data.getPlanReport.total)).format('$0,0'),
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    },
    jepFundingAllocPerParticipant: {
      query: GetPlanReport,
      variables() {
        return {
          where: {
            type: 'jepFundingAllocPerParticipant',
            dataSourceType: this.selectedPrimarySource,
            ...this.getDateRangeVariable()
          }
        }
      },
      update(data) {
        if (data && data.getPlanReport && data.getPlanReport.data) {
          Plotly.newPlot(
            this.$refs.jepFundingAllocPerParticipant,
            JSON.parse(JSON.stringify(data.getPlanReport.data)),
            {
              titlefont: {
                size: this.chartTitleSize
              },
              title:
                '<b>' +
                this.selectedPrimarySource +
                ' <br>Funding per <br>Participant</b><br> Total: ' +
                numeral(String(data.getPlanReport.total)).format('$0,0'),
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport.data
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      chartTitleSize: 14,
      trainingObjectivesReport: [],
      ObjsPerTrainingObjs: [],
      jepFundingAllocation: [],
      jepFundingAllocPerParticipant: [],
      tpuData: [],
      ineffectiveReasons: [],
      selectedPrimarySource: 'JEP',
      selectedPerTrainingObjType: 'Exercise Objectives',
      selectedParticipantTypePerTOs: 'Participant Type',
      selectedParticipantAudiencePerTOs: 'Participant Type',
      selectedParticipantsPerTOs: 'Participant Type',
      selectedPSFundAlloc: 'JEP',
      stackLayoutOptions: {
        barmode: 'stack',
        showlegend: true,
        legend: { orientation: 'h' },
        hoverlabel: { bgcolor: '#FFF' },
        hovermode: 'closest',
        xaxis: {
          tickformat: ',.0%',
          range: [0, 1],
          automargin: true,
          fixedrange: true
        },
        yaxis: {
          automargin: true,
          fixedrange: true
        }
      },
      defaultMarginOptions: {
        hovermode: 'closest',
        hoverlabel: { bgcolor: '#FFF' },
        xaxis: {
          automargin: true,
          fixedrange: true
        },
        yaxis: {
          automargin: true,
          fixedrange: true
        }
      },
      selectedTOsSource: 'Assessment',
      assessSourceType: ['Assessment', 'Feedback'],
      selectedTaskParticipantType: 'All'
    }
  },
  methods: {
    getDateRangeVariable() {
      let dateRange
      if (this.planCustomReport) {
        dateRange = {
          endDate: this.planCustomReport.end,
          startDate: this.planCustomReport.start
        }
      }
      return dateRange
    }
  }
}
</script>
