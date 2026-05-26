<template>
  <div class="is-relative-mobile plan-reports">
    <breadcrumb :currentPage="'Export'" />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <button class="button is-primary"
                  @click="imageExport">
            <span class="icon">
              <i class="fas fa-images"></i>
            </span>
            <span>Export All Graphs</span>
          </button>
        </div>
      </div>
      <div class="level-right"></div>
    </nav>
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
          <button class="button"
                  @click="JSONToCSVConvertor(downloadPieChartDataAsCSV(requestedvsplannedTOs), 'Requested VS planned TOs Report', true)">
            <span class="icon is-small">
              <i class="fas fa-download"></i>
            </span>
          </button>
          <div ref="requestedvsplannedTOs"
               id="requestedvsplannedTOs"></div>
        </article>
      </div>
      <div class="column is-half-desktop is-12-tablet">
        <article>
          <button class="button"
                  @click="JSONToCSVConvertor(downloadPieChartDataAsCSV(plannedVSAssessedTOs), 'Planned VS Assessed TOs Report', true)">
            <span class="icon is-small">
              <i class="fas fa-download"></i>
            </span>
          </button>
          <div ref="plannedVSAssessedTOs"
               id="plannedVSAssessedTOs"></div>
        </article>
      </div>
      <div class="column is-one-third-desktop is-12-tablet">
        <article>
          <div class="control">
            <button class="button"
                    @click="JSONToCSVConvertor(downloadPieChartDataAsCSV(trainingObjectivesReport), 'Training Objective Completion Report', true)">
              <span class="icon is-small">
                <i class="fas fa-download"></i>
              </span>
            </button>
          </div>
          <div ref="trainingObjectivesReport"
               id="trainingObjectivesReport"></div>
        </article>
      </div>
      <div class="column is-one-third-desktop is-12-tablet">
        <article>
          <div class="control">
            <button class="button"
                    @click="JSONToCSVConvertor(downloadTPUasCSV(tpuData), 'T,P,U Status of all JMETs Report', true)">
              <span class="icon is-small">
                <i class="fas fa-download"></i>
              </span>
            </button>
          </div>
          <div ref="tpu"
               id="tpu"></div>
        </article>
      </div>
      <div class="column is-one-third-desktop is-12-tablet">
        <article>
          <button class="button"
                  @click="JSONToCSVConvertor(downloadTypeWithCountasCSV(ineffectiveReasons,'Reasons'), 'Reasons Report', true)">
            <span class="icon is-small">
              <i class="fas fa-download"></i>
            </span>
          </button>
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
              <div class="control">
                <button class="button"
                        @click="JSONToCSVConvertor(getCompleteIncompleteExcel(ObjsPerTrainingObjs), 'Training Objectives Completion per '+selectedPerTrainingObjType, true)">
                  <span class="icon is-small">
                    <i class="fas fa-download"></i>
                  </span>
                </button>
              </div>
              <div ref="ObjsPerTrainingObjs"
                   id="ObjsPerTrainingObjs"></div>
            </div>
            <div class="column is-half-desktop is-12-tablet">
              <div class="control">
                <button class="button"
                        @click="JSONToCSVConvertor(downloadTypeCountAsCSV(ObjsPerTrainingObjs), 'Training Objectives per '+selectedPerTrainingObjType, true)">
                  <span class="icon is-small">
                    <i class="fas fa-download"></i>
                  </span>
                </button>
              </div>
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
              <div class="control">
                <button class="button"
                        @click="JSONToCSVConvertor(getCompleteIncompleteExcel(participantTypePerTOs), 'Training Objectives Completion per '+selectedParticipantTypePerTOs, true)">
                  <span class="icon is-small">
                    <i class="fas fa-download"></i>
                  </span>
                </button>
              </div>
              <div ref="ParticipantTypePerTOs"
                   id="ParticipantTypePerTOs"></div>
            </div>
            <div class="column is-half-desktop is-12-tablet">
              <div class="control">
                <button class="button"
                        @click="JSONToCSVConvertor(downloadTypeCountAsCSV(participantTypePerTOs), 'Training Objectives per '+selectedParticipantTypePerTOs, true)">
                  <span class="icon is-small">
                    <i class="fas fa-download"></i>
                  </span>
                </button>
              </div>
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
              <div class="field is-narrow">
                <div class="control">
                  <button class="button"
                          @click="JSONToCSVConvertor(downloadTypeWithCountasCSV(ParticipantAudiencePerTOs,'Audience'), 'Training Audience per '+selectedParticipantAudiencePerTOs+' Report', true)">
                    <span class="icon is-small">
                      <i class="fas fa-download"></i>
                    </span>
                  </button>
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
            <div class="control">
              <button class="button"
                      @click="JSONToCSVConvertor(downloadTypeWithCountasCSV(ParticipantsPerTOs,'Participants'), selectedParticipantsPerTOs+' Participants per Participant Category Report', true)">
                <span class="icon is-small">
                  <i class="fas fa-download"></i>
                </span>
              </button>
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
              <div class="field is-narrow">
                <div class="control">
                  <button class="button"
                          @click="JSONToCSVConvertor(downloadTypeWithCountasCSV(ParticipantTypeFeedbackTasks, 'Tasks'), selectedTaskParticipantType+' Tasks per Participant Type Report', true)">
                    <span class="icon is-small">
                      <i class="fas fa-download"></i>
                    </span>
                  </button>
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
              <div class="field is-narrow">
                <div class="control">
                  <button class="button"
                          @click="JSONToCSVConvertor(downloadJEPperParticipantAsCSV(jepFundingAllocPerParticipant), selectedPrimarySource+' Funding Allocation Per Participant Report', true)">
                    <span class="icon is-small">
                      <i class="fas fa-download"></i>
                    </span>
                  </button>
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
              <div class="field is-narrow">
                <div class="control">
                  <button class="button"
                          @click="JSONToCSVConvertor(downloadJEPFundingasCSV(jepFundingAllocation), selectedPSFundAlloc+' Allocated Funding Source Report', true)">
                    <span class="icon is-small">
                      <i class="fas fa-download"></i>
                    </span>
                  </button>
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
import HelpContent from '@/shared/components/helpcontent'
import Plotly from 'plotly.js-dist'
import { GetPlanReport } from '@/plan/graphql/PlanReports.gql'
import { PlanFundingSourcesRead } from '@/plan/graphql/PlanFundingSources.gql'
import { PlanParticipantTypesRead } from '@/plan/graphql/PlanParticipantType.gql'
import numeral from 'numeral'
const JSZip = require('jszip')
import file from '@/shared/mixins/file'
import PlotlyOptions from '@/shared/mixins/plotlyOptions.js'

export default {
  name: 'plan-reports-export',
  props: { id: { type: String, default: '' } },
  components: { HelpContent },
  mixins: [file, PlotlyOptions],
  apollo: {
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
              title:
                '<b>Training Objective Completion</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
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
          let reportData = data.getPlanReport.data
          Plotly.newPlot(
            this.$refs.tpu,
            JSON.parse(JSON.stringify(reportData)),
            {
              title:
                '<b>T,P,U Status of all JMETs</b> <br>Total: ' +
                data.getPlanReport.total,
              barmode: 'stack',
              showlegend: false,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
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
              title:
                '<b>Partially or Untrained Reasons<br> for Training Objectives</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
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
              title:
                '<b>%' +
                this.selectedPSFundAlloc +
                ' Funding Allocation</b><br> Total: ' +
                numeral(String(data.getPlanReport.total)).format('$0,0'),
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
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
              title:
                '<b>' +
                this.selectedPrimarySource +
                ' Funding per Participant</b><br> Total: ' +
                numeral(String(data.getPlanReport.total)).format('$0,0'),
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
        }
      },
      error(error) {
        console.error(error)
      }
    },
    participantTypePerTOs: {
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
          let completeCount = [allData[0], allData[1]]
          Plotly.newPlot(
            this.$refs.ParticipantTypePerTOs,
            completeCount,
            {
              title:
                '<b>Training Objective Completion per ' +
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
              title:
                '<b>Training Objectives per ' +
                this.selectedParticipantTypePerTOs +
                '</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
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
          let completeCount = [allData[0], allData[1]]
          let maxLabelLength = Math.max.apply(
            null,
            allData[0].y.map(label => label.length)
          )
          Plotly.newPlot(
            this.$refs.ObjsPerTrainingObjs,
            completeCount,
            {
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
          return data.getPlanReport
        }
      },
      error(error) {
        console.error(error)
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
              title:
                '<b>Training Objectives Planned vs Assessed</b> <br>Total Planned: ' +
                data.getPlanReport.total,
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
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
              title:
                '<b>Training Objectives Requested vs Planned</b> <br>Total Requested: ' +
                data.getPlanReport.total,
              ...this.stackLayoutOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
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
              title:
                '<b>Training Audience per ' +
                this.selectedParticipantAudiencePerTOs +
                '</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
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
              title:
                '<b>Participants per ' +
                this.selectedParticipantsPerTOs +
                '</b> <br>Total: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
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
              title:
                '<b>Task Metrics <br>' +
                this.selectedTaskParticipantType +
                '</b> <br>Total # Tasks Completed: ' +
                data.getPlanReport.total,
              ...this.defaultMarginOptions
            },
            this.modeBarOptions
          )
          return data.getPlanReport
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
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
        hovermode: 'closest',
        hoverlabel: { bgcolor: '#FFF' },
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
    async imageExport() {
      let zip = new JSZip()
      for (let ref in this.$refs) {
        await Plotly.toImage(ref).then(async responseData => {
          await fetch(responseData).then(async response => {
            await response.blob().then(blobData => {
              zip.file(ref + '.png', blobData)
            })
          })
        })
      }
      zip.generateAsync({ type: 'blob' }).then(blob => {
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'file'
        link.click()
      })
    },
    getDateRangeVariable() {
      let dateRange
      if (this.planCustomReport) {
        dateRange = {
          endDate: this.planCustomReport.end,
          startDate: this.planCustomReport.start
        }
      }
      return dateRange
    },
    getCompleteIncompleteExcel(reportData) {
      let completeCount = [reportData.data[0], reportData.data[1]]
      let dataForExcel = []
      for (let i = 0; i < completeCount[0].y.length; i++) {
        let completeStats = completeCount[0].text[i].split('<br>')
        let inCompleteStats = completeCount[1].text[i].split('<br>')
        dataForExcel.push({
          Type: completeCount[0].y[i],
          'Complete %': completeStats[0],
          'Complete #': completeStats[1],
          'In Complete %': inCompleteStats[0],
          'In Complete #': inCompleteStats[1]
        })
      }
      dataForExcel.push({
        Type: 'Total: ' + reportData.total,
        Complete: '',
        'In Complete': ''
      })
      return dataForExcel
    },
    downloadPieChartDataAsCSV(reportData, totalTitle) {
      let dataForExcel = []
      let chartData = reportData.data[0]
      for (let i = 0; i < chartData.labels.length; i++) {
        dataForExcel.push({
          Type: chartData.labels[i],
          Percentage:
            ((chartData.values[i] / reportData.total) * 100).toFixed(2) + '%',
          Count: chartData.values[i]
        })
      }
      dataForExcel.push({
        Type: totalTitle || 'Total',
        Percentage: '',
        Count: reportData.total
      })
      return dataForExcel
    },
    downloadTypeCountAsCSV(reportData, totalTitle) {
      let excelData = []
      // Generate Data for download
      for (let i = 0; i < reportData.data[2].x.length; i++) {
        excelData.push({
          Type: reportData.data[2].y[i],
          Count: reportData.data[2].x[i]
        })
      }
      excelData.push({
        Type: totalTitle || 'Total',
        Count: reportData.total
      })
      return excelData
    },
    downloadTPUasCSV(reportData) {
      let tpuExcel = []
      for (let i = 0; i < reportData.data.length; i++) {
        tpuExcel.push({
          Status: reportData.data[i].y[0],
          Count: reportData.data[i].x[0]
        })
      }
      tpuExcel.push({
        Status: 'Total',
        Count: reportData.total
      })
      return tpuExcel
    },
    downloadTypeWithCountasCSV(reportData, type) {
      let ineffectiveReasonsDataForExcel = []
      let labels = []
      switch (type) {
        case 'Reasons': {
          labels = ['Reason', 'Count']
          break
        }
        case 'Audience': {
          labels = ['Type', 'Audience']
          break
        }
        case 'Participants': {
          labels = ['Type', 'Participants']
          break
        }
        case 'Tasks': {
          labels = ['Type', 'Task']
          break
        }
      }
      // Generate Data for download
      for (let i = 0; i < reportData.data[0].x.length; i++) {
        let data = {}
        data['' + labels[0]] = reportData.data[0].y[i]
        data['' + labels[1]] = reportData.data[0].x[i]
        ineffectiveReasonsDataForExcel.push(data)
      }
      let totalObj = {}
      totalObj['' + labels[0]] = 'Total'
      totalObj['' + labels[1]] = reportData.total

      ineffectiveReasonsDataForExcel.push(totalObj)
      return ineffectiveReasonsDataForExcel
    },
    downloadJEPFundingasCSV(reportData) {
      let jepFundingAllocationExcel = []
      for (let i = 0; i < reportData.data[0].x.length; i++) {
        jepFundingAllocationExcel.push({
          Type: reportData.data[0].y[i].replace('<br>', ' '),
          SOF: reportData.data[0].text[i],
          'NON-SOF': reportData.data[1].text[i],
          'Non-Allocated': reportData.data[2].text[i]
        })
      }
      jepFundingAllocationExcel.push({
        Type: '',
        SOF: '',
        'NON-SOF': 'Total',
        'Non-Allocated': numeral(String(reportData.total)).format('$0,0')
      })
      return jepFundingAllocationExcel
    },
    downloadJEPperParticipantAsCSV(reportData) {
      let jepFundingAllocPerParticipantExcel = []
      for (let i = 0; i < reportData.data[0].x.length; i++) {
        jepFundingAllocPerParticipantExcel.push({
          Participant: reportData.data[0].y[i],
          Amount: '$' + reportData.data[0].x[i]
        })
      }
      jepFundingAllocPerParticipantExcel.push({
        Participant: 'Total',
        Amount: numeral(String(reportData.total)).format('$0,0')
      })

      return jepFundingAllocPerParticipantExcel
    }
  }
}
</script>
