<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column">
        <h1 class="title">
          Invite Planners
        </h1>
        <div class="card">
          <div class="card-content">
            <form data-vv-scope="planners">
              <div class="content">
                <div class="columns is-multiline is-mobile">
                  <div class="column is-6">
                    <div class="columns is-multiline is-mobile"
                         v-for="(planner, index) in allExercisePlanners"
                         :key="index">
                      <div class="column">
                        <div class="field">
                          <label class="label">
                            Email
                          </label>
                          <div class="control">
                            <input class="input"
                                   :name="'PlannerEmail'+index"
                                   v-model="planner.email"
                                   v-validate="'required'"
                                   :class="{'input': true, 'is-danger': errors.has('planners.PlannerEmail'+index) }"
                                   type="text" />
                            <span v-show="errors.has('planners.PlannerEmail'+index)"
                                  class="help has-text-danger">Planner Email is Required</span>
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <label class="label">
                            Role
                          </label>
                          <div class="control is-expanded">
                            <div class="select is-fullwidth">
                              <select v-model="planner.role"
                                      @change="validateInput('planners.PlannerEmail'+index, planner.role)">
                                <option v-for="role in appRoles"
                                        :key="role.id"
                                        :value="role.name">
                                  {{role.displayName}}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="level-right">
                        <div class="level-item">
                          <a class="invite-planner-deleteBtn has-text-danger"
                             @click="confirmDeletePanel('Invite Planner', index)">
                            <i class="fas fa-times-circle fa-lg"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="level-left">
                      <div class="level-item">
                        <a class="panel-buttons has-text-success"
                           @click="addPanel('Invite Planner')">
                          <i class="fas fa-plus-circle fa-2x"></i>
                        </a>
                        <span class="has-text-success">&nbsp;Add Planner</span>
                      </div>
                    </div>
                  </div>
                  <div class="column is-6">
                    <label class="label">
                      Invited Planners
                    </label>
                    <b-table :data="workspaceUsers"
                             focusable
                             striped
                             narrowed
                             mobile-cards>
                      <template slot-scope="props">
                        <b-table-column field="email"
                                        label="Email">
                          {{ props.row.email }}
                        </b-table-column>
                        <b-table-column field="inviteAccepted"
                                        label="Invite Accepted">
                          {{ props.row.inviteAccepted ? "Yes" : "No" }}
                        </b-table-column>
                      </template>
                    </b-table>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <help-content :reference="'plan.exerciseinviteplanners'"
                      toggle />
      </div>
    </div>
  </div>
</template>

<script>
//This code was just moved from Exercise.vue. It will need to be refactored to work the way we want.
import { serverError } from '@/shared/serverError'
import { AppRolesRead } from '@/shared/graphql/AppRoles.gql'
import { InviteUser } from '@/shared/graphql/Auth.gql'
import { UpsertAppUserRole } from '@/shared/graphql/AppUserRoles.gql'
import {
  AppWorkspacesRead,
  AppWorkspaceUpdate
} from '@/shared/graphql/AppWorkspaces.gql'
import helpers from '@/shared/mixins/helpers'

export default {
  name: 'PlanManagePlanners',
  apollo: {
    appRoles: {
      query: AppRolesRead
    },
    appWorkspaces: {
      query: AppWorkspacesRead,
      variables() {
        return {
          where: {
            name: this.$store.state.activeWorkspace.name
          }
        }
      },
      update(data) {
        if (data && data.appWorkspaces && data.appWorkspaces[0]) {
          this.workspace = JSON.parse(
            JSON.stringify(data.appWorkspaces[0]),
            this.omitTypename
          )
          this.workspaceUsers = this.workspace.members
          this.currentExercise.name = this.workspace.displayName
          return data.appWorkspaces
        }
      }
    }
  },
  props: {},
  mixins: [helpers],
  data() {
    return {
      workspace: '',
      workspaceUsers: [],
      allExercisePlanners: [],
      exercisePlannerObj: {
        email: '',
        role: ''
      },
      activePlanner: 0
    }
  },
  methods: {
    invitePlanner(item) {
      for (let i in item) {
        let plannerEmail = item[i].email
        let roleData = item[i].role
        let idx = i
        this.$apollo
          .mutate({
            mutation: InviteUser,
            variables: {
              data: {
                email: plannerEmail
              }
            }
          })
          .then(response => {
            let userID = response.data.inviteUser.id
            this.$apollo
              .mutate({
                mutation: UpsertAppUserRole,
                variables: {
                  create: {
                    user: { connect: { id: userID } },
                    roles: { connect: { name: roleData } }
                  },
                  update: { roles: { connect: { name: roleData } } },
                  where: { id: '' }
                }
              })
              .then(() => {
                let data = {
                  members: {
                    connect: {
                      id: userID
                    }
                  }
                }
                this.$apollo
                  .mutate({
                    mutation: AppWorkspaceUpdate,
                    variables: {
                      data: data,
                      where: {
                        id: this.workspace.id
                      }
                    }
                  })
                  .then(() => {
                    this.$apollo.queries.appWorkspaces.refetch()
                  })
                  .catch(error => {
                    this.$buefy.toast.open({
                      message: serverError(error.message),
                      type: 'is-danger'
                    })
                    console.error('Add User to Workspace: ' + error)
                  })
              })
              .catch(error => {
                this.$buefy.toast.open({
                  message: serverError(error.message),
                  type: 'is-danger'
                })
                console.error('Add Role to User: ' + error)
              })
            this.$buefy.toast.open({
              message: 'Email sent to new user to join',
              type: 'is-success'
            })
            this.allExercisePlanners.splice(idx, 1)
          })
          .catch(error => {
            this.plannerErrors = true
            this.$buefy.toast.open({
              message: serverError(error.message),
              type: 'is-danger'
            })
          })
      }
    }
  }
}
</script>
