<template>
  <div class="is-relative-mobile">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <span class="button is-primary"
                @click="openCreate()">Create Report</span>
        </div>
      </div>
      <div class="level-right">
        <help-content reference="plan.reports.custom"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div v-if="planCustomReports && planCustomReports.length > 0">
      <b-table :data="planCustomReports"
               hoverable
               :paginated="isPaginated"
               :per-page="perPage"
               :pagination-simple="isPaginationSimple"
               :default-sort-direction="defaultSortDirection"
               default-sort="title"
               @dblclick="rowClick">
        <template slot-scope="props">
          <b-table-column field="title"
                          label="Title"
                          sortable>
            {{ props.row.title  }}
          </b-table-column>
          <b-table-column field="start"
                          label="Report Dates"
                          sortable>
            <span class="tooltip"
                  :data-tooltip="formatDate(props.row.start, 'utc-dtg')">
              {{ formatDate(props.row.start, 'dtg')}}
            </span>
            <span class="tooltip"
                  :data-tooltip="formatDate(props.row.end, 'utc-dtg')"
                  v-if="props.row.start && props.row.end"> -
              {{ formatDate(props.row.end, 'dtg')}}
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
              <b-dropdown-item @click="viewReport(props.row.id)">
                <span class="icon is-small">
                  <i class="far fa-eye"></i>
                </span>
                <span>View Report</span>
              </b-dropdown-item>
              <b-dropdown-item @click="editReport(props.row)">
                <span class="icon is-small">
                  <i class="fas fa-pen"></i>
                </span>
                <span>Edit Report</span>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item @click="confirmDelete(props.row)">
                <span class="icon is-small">
                  <i class="fas fa-times has-text-danger"></i>
                </span>
                <span>Delete Report</span>
              </b-dropdown-item>
            </b-dropdown>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div v-else>
      <empty-state :data="planCustomReports"
                   :isLoading='$apollo.loading'>
        <template slot="action-buttons">
          <div class="buttons is-centered is-spaced">
            <span class="button is-primary"
                  @click="openCreate()">Create Report</span>
          </div>
        </template>
      </empty-state>
    </div>
    <report-interaction :open="openDialog"
                        :report="selectedReport"
                        @close="closeDialog"
                        :edit="edit" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import ReportInteraction from '@/plan/components/report/customReport-interaction'
import PlanCustomReport from '@/plan/model/planCustomReport'
import {
  PlanCustomReportsRead,
  PlanCustomReportsDelete,
  PlanCustomReportSubscription
} from '@/plan/graphql/PlanCustomReports.gql'
export default {
  name: 'reports-list',
  components: {
    HelpContent,
    ReportInteraction
  },
  apollo: {
    planCustomReports: {
      query: PlanCustomReportsRead,
      subscribeToMore: {
        document: PlanCustomReportSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planCustomReport.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planCustomReports: [
                  subscriptionData.data.planCustomReport.node,
                  ...previousResult.planCustomReports
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planCustomReports: [
                  ...previousResult.planCustomReports.filter(
                    obj =>
                      subscriptionData.data.planCustomReport.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanCustomReports = JSON.parse(
                JSON.stringify(previousResult.planCustomReports)
              )
              let index = newPlanCustomReports.findIndex(
                x => x.id === subscriptionData.data.planCustomReport.node.id
              )
              newPlanCustomReports[index] =
                subscriptionData.data.planCustomReport.node
              newResult = {
                planCustomReports: newPlanCustomReports
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
  data() {
    return {
      edit: false,
      openDialog: false,
      selectedReport: null,
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 15
    }
  },
  methods: {
    rowClick(row) {
      this.viewReport(row.id)
    },
    viewReport(id) {
      this.$router.push({
        name: 'viewReport',
        params: { id: id }
      })
    },
    closeDialog() {
      this.errors.clear()
      this.edit = false
      this.openDialog = false
      this.selectedReport = new PlanCustomReport()
    },
    openCreate() {
      this.selectedReport = new PlanCustomReport()
      this.openDialog = true
    },
    editReport(report) {
      this.edit = true
      this.selectedReport = report
      this.openDialog = true
    },
    confirmDelete(report) {
      this.$buefy.dialog.confirm({
        title: 'Delete Custom Report',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteReport(report.id)
      })
    },
    deleteReport(id) {
      this.$apollo
        .mutate({
          mutation: PlanCustomReportsDelete,
          variables: {
            id: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Report Deleted!',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Delete Report: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
