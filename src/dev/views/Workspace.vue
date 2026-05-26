<template>
  <div class="container">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="editWorkspace()">
            Add Workspace
          </a>
        </div>
      </div>
      <div class="level-right"></div>
    </nav>
    <div v-if="appWorkspaces && appWorkspaces.length > 0">
      <b-table :data="appWorkspaces"
               paginated
               :per-page="perPage"
               :pagination-simple="isPaginationSimple"
               :default-sort-direction="defaultSortDirection"
               default-sort="name">
        <template slot-scope="props">
          <b-table-column field="displayName"
                          label="Title"
                          sortable>
            {{ props.row.displayName}}
          </b-table-column>
          <b-table-column field="Status"
                          label="Status"
                          sortable>
            <span :class="{'has-text-success': props.row.status==='Available','has-text-warning': props.row.status==='Archived', 'has-text-grey': props.row.status==='Deploying'}">
              {{ props.row.status}}
            </span>
          </b-table-column>
          <b-table-column field="updatedAt"
                          label="Last Updated"
                          sortable>
            <span class="tooltip"
                  :data-tooltip="formatDate(props.row.updatedAt, 'utc-dtg')">{{formatDate(props.row.updatedAt, 'fromNow')}}</span>
          </b-table-column>
          <b-table-column>
            <a class="button is-small"
               @click="editWorkspace(props.row.id)">
              <span class="icon is-small">
                <i class="fas fa-pencil-alt"></i>
              </span>
            </a>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div v-else>
      <empty-state :data="appWorkspaces"
                   :isLoading='$apollo.loading' />
    </div>
    <workspace-edit :open="openDialog"
                    :workspaceID="selectedWorkspaceID"
                    @close="closeDialog" />
  </div>
</template>

<script>
import {
  AppWorkspacesRead,
  AppWorkspacesSubscription
} from '@/shared/graphql/AppWorkspaces.gql'
import WorkspaceEdit from '@/dev/views/WorkspaceEdit.vue'

export default {
  name: 'DevWorkspaces',
  components: {
    WorkspaceEdit
  },
  apollo: {
    appWorkspaces: {
      query: AppWorkspacesRead,
      variables() {
        return {
          orderBy: 'name_ASC'
        }
      },
      subscribeToMore: {
        document: AppWorkspacesSubscription,
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.appWorkspace.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                appWorkspaces: [
                  subscriptionData.data.appWorkspace.node,
                  ...previousResult.appWorkspaces
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                appWorkspaces: [
                  ...previousResult.appWorkspaces.filter(
                    obj =>
                      subscriptionData.data.appWorkspace.previousValues.id !==
                      obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newAppWorkspaces = JSON.parse(
                JSON.stringify(previousResult.appWorkspaces)
              )
              let index = newAppWorkspaces.findIndex(
                x => x.id === subscriptionData.data.appWorkspace.node.id
              )
              newAppWorkspaces[index] = subscriptionData.data.appWorkspace.node
              newResult = {
                appWorkspaces: newAppWorkspaces
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
      openDialog: false,
      selectedWorkspaceID: '',
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      perPage: 25
    }
  },
  methods: {
    editWorkspace(workspaceID) {
      this.selectedWorkspaceID = workspaceID
      this.errors.clear()
      this.$validator.reset()
      this.openDialog = true
    },
    closeDialog() {
      this.selectedWorkspaceID = null
      this.openDialog = false
    }
  }
}
</script>
