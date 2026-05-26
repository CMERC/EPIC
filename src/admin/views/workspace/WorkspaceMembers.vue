<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item"></div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <help-content reference="settings.workspace"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div class="columns">
      <div class="column is-half">
        <div class="card">
          <div class="card-content">
            <div class="field">
              <label class="label">Invite User By Email to {{$store.state.activeWorkspace.displayName}} Workspace
                <input class="input"
                       name="email"
                       v-model="email"
                       v-validate="'required|email'"
                       :class="{'input': true, 'is-danger': errors.has('email') }"
                       type="email"
                       placeholder="Email" />
                <span v-show="errors.has('email') && fields.email.touched"
                      class="help has-text-danger">{{errors.first('email') }}</span>
              </label>
            </div>
            <div class="columns is-mobile"
                 v-if="!notSuperorAdmin">
              <div class="column is-half">
                <div class="filed">
                  <label class="label">
                    Select Role for User
                  </label>
                  <div class="level-left">
                    <div class="level-item">
                      <div class="select is-fullwidth">
                        <select v-model="inviteUserRole">
                          <option value="null">
                            None
                          </option>
                          <option v-for="roles in appRoles"
                                  v-bind:key="roles.id"
                                  :value="roles.name">
                            {{roles.displayName}}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="level-item">
                      <help-content reference="settings.userroles"
                                    toggle
                                    dropdown />
                    </div>
                  </div>
                  <span v-show="inviteUserRole"
                        class="help has-text-warning">Selected role will apply to all workspaces the user belongs to</span>

                </div>

              </div>
            </div>
          </div>
          <footer class="modal-card-foot">
            <div class="field">
              <p class="control">
                <a class="button is-primary"
                   @click="validateBeforeSubmit"
                   id="invite">Invite New User</a>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
    <div v-if="isSuperAdmin">
      <nav class="level">
        <div class="level-left"></div>
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
      <nav class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item">
            <span class="has-text-weight-semibold"> {{appUsersCount}} Workspace Users</span>
          </div>
          <div class="level-item">
            <div class="select">
              <select v-model.number="perPage"
                      @change="onPerPageChange($event)">
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
        </div>
      </nav>
      <div class="columns">
        <div class="column"
             v-if="appUsers && appUsers.length > 0">
          <label class="label">
            Members of {{$store.state.activeWorkspace.displayName}}
          </label>
          <b-table :data="appUsers"
                   :current-page.sync="currentPage"
                   :total="appUsersCount"
                   paginated
                   detailed
                   detail-key="id"
                   :per-page="perPage"
                   :pagination-simple="isPaginationSimple"
                   backend-pagination
                   @page-change="onPageChange"
                   backend-sorting 
                   @sort="onSort" 
                   :default-sort-direction="defaultSortOrder" 
                   :default-sort="btableSort">
            <template slot-scope="props">
              <b-table-column field="name"
                              label="Name"
                              sortable>
                {{ props.row.name}}
              </b-table-column>
              <b-table-column field="email"
                              label="Email"
                              sortable>
                {{ props.row.email }}
              </b-table-column>
              <b-table-column field="role"
                              label="Role(s)">
                <ul class="rolesList"
                    v-if="props.row.role != null">
                  <li v-for="roles in props.row.role.roles"
                      v-bind:key="roles.id">{{roles.displayName}}</li>
                </ul>
                <p v-else>No Assigned Roles</p>
              </b-table-column>
              <b-table-column field="lastLogin"
                              label="Last Login"
                              sortable>
                <span class="tooltip"
                      :data-tooltip="formatDate(props.row.lastLogin, 'utc-dtg')">{{formatDate(props.row.lastLogin, 'fromNow')}}</span>
              </b-table-column>
            </template>
            <template slot="detail"
                      slot-scope="props">
              <article class="media">
                <div class="columns is-multiline">
                  <div class="column is-half">
                    <div class="field">
                      <label class="label">
                        Name
                      </label>
                      <p class="subtitle is-6">{{props.row.name}}</p>
                    </div>
                    <div class="field">
                      <label class="label">
                        Email
                      </label>
                      <p class="subtitle is-6">{{props.row.email}}</p>
                    </div>
                    <div class="field">
                      <label class="label">
                        Invite Accepted
                      </label>
                      <p class="subtitle is-6"
                         v-if="props.row.inviteAccepted"> Yes</p>
                      <p class="subtitle is-6"
                         v-else> No</p>
                    </div>

                    <div class="field">
                      <label class="label">
                        Email Confirmed
                      </label>
                      <p class="subtitle is-6"
                         v-if="props.row.emailConfirmed"> Yes</p>
                      <p class="subtitle is-6"
                         v-else> No</p>
                    </div>

                    <div class="field">
                      <label class="label">
                        Joined At
                      </label>
                      <p class="subtitle is-6">
                        <span class="tooltip"
                              :data-tooltip="formatDate(props.row.joinedAt, 'utc-dtg')">
                          {{formatDate(props.row.joinedAt, 'dtg')}}
                        </span>
                      </p>

                    </div>
                    <div class="field">
                      <label class="label">
                        Last Login At
                      </label>
                      <p class="subtitle is-6">
                        <span class="tooltip"
                              :data-tooltip="formatDate(props.row.lastLogin, 'utc-dtg')">
                          {{formatDate(props.row.lastLogin, 'dtg')}}
                        </span>
                      </p>
                    </div>
                    <div class="field">
                      <label class="label"
                             v-if="props.row.deletedAt">
                        Deleted At
                      </label>
                      <p class="subtitle is-6">{{props.row.deletedAt}}</p>
                    </div>
                  </div>
                  <div class="column is-half">
                    <label class="label">
                      Available Roles
                    </label>
                    <div class="select">
                      <select v-model="selectedRole">
                        <option v-for="roles in appRoles"
                                v-bind:key="roles.id"
                                :value="roles.name">
                          {{roles.displayName}}
                        </option>
                        <option value="noRole">
                          Guest
                        </option>
                      </select>
                    </div>

                    <div class="field">
                      <label class="label">
                        Assigned roles
                      </label>
                      <div class="tags"
                           v-if="props.row.role">
                        <span class="tag"
                              v-for="role in props.row.role.roles"
                              v-bind:key="role.id">{{role.displayName}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="column is-narrow">
                    <div class="field is-grouped">
                      <p class="control">
                        <button class="button is-primary"
                                @click="addRoleToUser(props.row, selectedRole)"
                                :disabled="notSuperorAdmin">Save</button>
                      </p>
                      <p class="control">
                        <button class="button is-danger"
                                @click="confirmRevoke(props.row.role.id)"
                                :disabled="notSuperorAdmin">Revoke Permissions</button>
                      </p>
                      <p class="control">
                        <button class="button is-danger is-outlined"
                                @click="removeFromWorkspace(props.row.id)"
                                :disabled="notSuperorAdmin">Remove from Workspace</button>
                      </p>
                      <p class="control"
                         v-if="!props.row.inviteAccepted">
                        <button class="button is-primary is-outlined"
                                @click="reinviteUser(props.row.email)"
                                :disabled="notSuperorAdmin">Resend Invite</button>
                      </p>
                      <p class="control"
                         v-if="!props.row.inviteAccepted">
                        <ApolloQuery :query="getAppUserInviteLinkQuery"
                                     :variables="{where: {id: props.row.id}}"
                                     v-if="!notSuperorAdmin">
                          <template slot-scope="{ result: { loading, error, data } }">
                            <div v-if="loading"
                                 class="loading apollo">Loading...</div>
                            <div v-else-if="error"
                                 class="error apollo">An error occurred</div>
                            <button v-else-if="data"
                                    class="button is-primary"
                                    @click="showInviteLinkDialog(data.getAppUserInviteLink.url)">Share Invite Link</button>
                            <div v-else
                                 class="no-result apollo">No invite token found</div>
                          </template>
                        </ApolloQuery>
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </template>
          </b-table>
        </div>
        <div v-else
             class="column">
          <empty-state :data="appUsers"
                       :search="searchQuery ? true : false"
                       :isLoading='$apollo.loading' />
        </div>
      </div>
    </div>

    <div class="modal"
         :class="{'is-active': showUserInviteLink}">
      <div class="modal-background"
           @click="toggleUserInviteLink"></div>
      <div class="modal-card invite-link">
        <header class="modal-card-head">
          <p class="modal-card-title">Share Invite Link</p>
          <button class="delete"
                  aria-label="close"
                  @click="toggleUserInviteLink"></button>
        </header>
        <section class="modal-card-body">
          <span class="input">{{activeUserInviteUrl}}</span>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             v-clipboard:copy="activeUserInviteUrl"
             v-clipboard:success="copyToClipboard">
            Copy to Clipboard
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import { AppRolesRead } from '@/shared/graphql/AppRoles.gql'
import {
  UpsertAppUserRole,
  AppUserRolesDelete
} from '@/shared/graphql/AppUserRoles.gql'
import {
  AppWorkspaceUpdate,
  AppWorkspaceAssignUser,
  GetWorkspaceMembers,
  GetWorkspaceMembersCount
} from '@/shared/graphql/AppWorkspaces.gql'
import { GetAppUserInviteLink } from '@/shared/graphql/AppUsers.gql'
import helpers from '@/shared/mixins/helpers'
import { serverError } from '@/shared/serverError'
import { InviteUser } from '@/shared/graphql/Auth.gql'
import Permissions from '@/shared/mixins/permissions'
export default {
  name: 'workspace-members',
  components: { HelpContent },
  mixins: [helpers, Permissions],
  apollo: {
    appRoles: {
      query: AppRolesRead,
      skip() {
        return this.notSuperorAdmin
      }
    },
    appUsersCount: {
      query: GetWorkspaceMembersCount,
      variables() {
        return {
          where: {
            AND: [{ name: this.$store.state.activeWorkspace.name }]
          },
          members_where: {
            OR: [
              { name_contains: this.searchQuery },
              { email_contains: this.searchQuery }
            ]
          }
        }
      },
      skip() {
        return this.notSuperorAdmin
      },
      update(data) {
        if (
          data &&
          data.getWorkspaceMembers &&
          data.getWorkspaceMembers[0] &&
          data.getWorkspaceMembers.length > 0
        )
          return data.getWorkspaceMembers[0].members.length
      }
    },
    appUsers: {
      query: GetWorkspaceMembers,
      variables() {
        return {
          where: {
            AND: [{ name: this.$store.state.activeWorkspace.name }]
          },
          members_where: {
            OR: [
              { name_contains: this.searchQuery },
              { email_contains: this.searchQuery }
            ]
          },
          members_skip: this.skip,
          members_first: this.perPage,
          members_orderBy: this.orderBy
        }
      },
      skip() {
        return this.notSuperorAdmin
      },
      update(data) {
        if (
          data &&
          data.getWorkspaceMembers &&
          data.getWorkspaceMembers[0] &&
          data.getWorkspaceMembers.length > 0
        )
          return JSON.parse(JSON.stringify(data.getWorkspaceMembers[0].members))
      }
    }
  },
  data() {
    return {
      searchQuery: '',
      skip: 0,
      currentPage: parseInt(this.$route.query.currentPage) || 1,
      orderBy: this.$route.query.orderBy || 'lastLogin_ASC',
      perPage: this.$route.query.perPage || 25,
      disabled: false,
      selectedRole: '',
      isPaginationSimple: false,
      defaultSortOrder: 'asc',
      email: '',
      inviteUserRole: null,
      getAppUserInviteLinkQuery: GetAppUserInviteLink,
      showUserInviteLink: false,
      activeUserInviteUrl: null,
      appUsers: null,
      btableSort: 'lastLogin'
    }
  },
  mounted() {
    if (this.$route.query.orderBy) {
      let btableData = this.$route.query.orderBy.split('_')
      this.btableSort = btableData[0]
      this.defaultSortOrder = btableData[1].toLowerCase()
    }
  },
  methods: {
    onPerPageChange(event) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          perPage: event.target.value
        })
      })
    },
    onPageChange(page) {
      this.currentPage = page
      this.skip = (this.currentPage - 1) * this.perPage

      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          currentPage: this.currentPage
        })
      })
    },
    onSort(field, order) {
      this.btableSort = field
      this.orderBy = field + '_' + order.toUpperCase()

      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          orderBy: this.orderBy
        })
      })
    },
    showInviteLinkDialog(url) {
      this.activeUserInviteUrl = url
      this.showUserInviteLink = true
    },
    toggleUserInviteLink() {
      this.showUserInviteLink = !this.showUserInviteLink
    },
    clearUserInput() {
      this.email = ''
      this.$validator.reset()
    },
    confirmRevoke(roleID) {
      this.$buefy.dialog.confirm({
        title: 'Revoke Permissions',
        message: `This will revoke this user from all workspaces they belong to. Are you sure you want to revoke permissions?`,
        type: 'is-danger',
        onConfirm: () => {
          this.revokePermissions(roleID)
        }
      })
    },
    revokePermissions(id) {
      this.$apollo
        .mutate({
          mutation: AppUserRolesDelete,
          variables: {
            where: {
              id: id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Permissions Revoked!',
            type: 'is-success'
          })
          this.$apollo.queries.appUsers.refetch()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error('Revoke Permissions: ' + error)
        })
    },
    async addRoleToUser(user, role) {
      let createRoles
      if (role !== '') {
        if (role !== 'noRole') {
          // create
          switch (role) {
            case 'ADMIN': {
              createRoles = [
                { name: 'ADMIN' },
                { name: 'EDITOR' },
                { name: 'AUTHOR' },
                { name: 'USER' }
              ]
              break
            }
            case 'EDITOR': {
              createRoles = [
                { name: 'EDITOR' },
                { name: 'AUTHOR' },
                { name: 'USER' }
              ]
              break
            }
            case 'AUTHOR': {
              createRoles = [{ name: 'AUTHOR' }, { name: 'USER' }]
              break
            }
            case 'USER': {
              createRoles = [{ name: 'USER' }]
              break
            }
          }
          this.$apollo
            .mutate({
              mutation: UpsertAppUserRole,
              variables: {
                create: {
                  user: { connect: { id: user.id } },
                  roles: { connect: createRoles }
                },
                update: { roles: { connect: createRoles } },
                where: { id: user.role ? user.role.id : '' }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.$apollo.queries.appUsers.refetch()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: serverError(error.message),
                type: 'is-danger'
              })
              console.error('Add Role to User: ' + error)
            })
        }
      } else {
        // If selectedRole has no value
        this.$buefy.toast.open({
          message: 'No Role Selected',
          type: 'is-danger'
        })
      }
    },
    confirmDelete(user) {
      this.$buefy.dialog.confirm({
        title: 'Delete User',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.remove(user)
      })
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.inviteUser(this.email)
          return
        }
        this.$buefy.toast.open({
          message: 'Correct errors!',
          type: 'is-danger'
        })
      })
    },
    reinviteUser(userEmail) {
      this.$buefy.dialog.confirm({
        title: 'Resend Invite',
        message: 'Are you sure you want to do this?',
        type: 'is-success',
        onConfirm: () => this.inviteUser(userEmail)
      })
    },
    inviteUser(userEmail) {
      this.$apollo
        .mutate({
          mutation: InviteUser,
          variables: {
            data: {
              email: userEmail
            }
          }
        })
        .then(response => {
          if (
            this.$store.state.activeWorkspace &&
            this.$store.state.activeWorkspace.name &&
            response &&
            response.data &&
            response.data.inviteUser
          ) {
            if (this.$store.state.activeWorkspace) {
              // Assign workspace
              this.$apollo
                .mutate({
                  mutation: AppWorkspaceAssignUser,
                  variables: {
                    data: {
                      connect: {
                        id: response.data.inviteUser.id
                      }
                    },
                    where: {
                      name: this.$store.state.activeWorkspace.name
                    }
                  }
                })
                .then(response => {
                  if (response)
                    this.$buefy.toast.open({
                      message:
                        'Email sent to user to join and has been given access to ' +
                        this.$store.state.activeWorkspace.displayName,
                      type: 'is-success'
                    })
                  this.clearUserInput()
                  this.$apollo.queries.appUsers.refetch()
                  this.$apollo.queries.appUsersCount.refetch()
                })
            }
            if (this.inviteUserRole !== null) {
              // Assign roles
              this.addRoleToUser(response.data.inviteUser, this.inviteUserRole)
              this.inviteUserRole = null
            }
          } else {
            this.$buefy.toast.open({
              message: 'Email sent to user to join',
              type: 'is-success'
            })
            this.clearUserInput()
            this.$apollo.queries.appUsers.refetch()
            this.$apollo.queries.appUsersCount.refetch()
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    },
    removeFromWorkspace(id) {
      this.$buefy.dialog.confirm({
        title: 'Remove User from Workspace',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => {
          this.$apollo
            .mutate({
              mutation: AppWorkspaceUpdate,
              variables: {
                data: {
                  members: {
                    disconnect: {
                      id: id
                    }
                  }
                },
                where: {
                  name: this.$store.state.activeWorkspace.name
                }
              }
            })
            .then(response => {
              if (response)
                this.$buefy.toast.open({
                  message:
                    'User has been removed from ' +
                    this.$store.state.activeWorkspace.displayName,
                  type: 'is-success'
                })
              this.$apollo.queries.appUsers.refetch()
              this.$apollo.queries.appUsersCount.refetch()
            })
        }
      })
    },
    copyToClipboard() {
      this.$buefy.toast.open({
        message: 'Copied to Clipboard!',
        type: 'is-success'
      })
    }
  },
  computed: {
    notSuperorAdmin() {
      return !(
        this.$store.state.userRole === 'Super' ||
        this.$store.state.userRole === 'Admin'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.rolesList {
  padding-left: 0;
  li {
    display: inline;
    list-style-type: none;
  }
  li + li:before {
    content: ',';
    padding-right: 5px;
  }
}
.invite-link {
  .input {
    height: 3rem;
  }
}
</style>
