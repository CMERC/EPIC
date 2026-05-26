<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{this.workspaceID?'Edit Workspace':'Add Workspace'}}</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section ref="workspaceEditBody"
                 class="modal-card-body"
                 v-infinite-scroll="loadMore"
                 infinite-scroll-distance="10">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">
                Name
              </label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control has-icon has-icon-right">
                  <input name="workspaceName"
                         v-model="appWorkspace.displayName"
                         v-validate="{ required: true, regex: /^([a-z|A-Z|0-9|\s]*)$/}"
                         :class="{'input': true, 'is-danger': errors.has('workspaceName') }"
                         type="text"
                         placeholder="Name">
                  <span v-show="errors.has('workspaceName')"
                        class="help is-danger">{{errors.first('workspaceName')}}</span>                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">
                Short Name
              </label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control has-icon has-icon-right">
                  <input name="workspaceSlug"
                         v-model="appWorkspace.name"
                         v-validate="{required: true, alpha_num: true, max:4, regex: /^[A-Za-z][A-Za-z0-9]*$/}"
                         :class="{'input': true, 'is-danger': errors.has('workspaceSlug') }"
                         type="text"
                         placeholder="e.g. ab12"
                         :disabled="appWorkspace.id">
                  <span v-show="errors.has('workspaceSlug')"
                        class="help is-danger">
                    <ul class="is-list-none pl-0">
                      <li v-for="error in errors.collect('workspaceSlug')"
                          :key="error">{{ error }}</li>
                    </ul>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal"
               v-if="this.workspaceID">
            <div class="field-label is-normal">
              <label class="label">
                Status
              </label>
            </div>
            <div class="field-body">
              <div class="field">
                <div v-if="appWorkspace.status==='Deploying'">
                  Deploying
                </div>
                <div v-else
                     class="select">
                  <select v-model="appWorkspace.status">
                    <option value="Available">
                      Available
                    </option>
                    <option value="Archived">
                      Archived
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div v-if="appWorkspace && appWorkspace.id">
            <h3>Current Members</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in appWorkspace.members"
                    :key="user.id"
                    class='user-selected'>
                  <td>{{user.name}}</td>
                  <td>
                    <a :mailto="user.email">
                      {{user.email}}
                    </a>
                  </td>
                  <td>
                    <nav class="level">
                      <div class="level-item">
                        <a class="button is-small tooltip"
                           data-tooltip="Remove user from workspace"
                           @click="removeUserWorkspace(user)">
                          <span class="icon">
                            <i class="fas fa-minus"></i>
                          </span>
                        </a>
                      </div>
                    </nav>
                  </td>
                </tr>
              </tbody>
            </table>
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <h3>Add Members</h3>
                </div>
              </div>
              <div class="level-right">
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
            </nav>
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="user in appUsers">
                  <tr :key="user.id">
                    <td>{{user.name}}</td>
                    <td>
                      <a :mailto="user.email">
                        {{user.email}}
                      </a>
                    </td>
                    <td>
                      <nav class="level">
                        <div class="level-item">
                          <a class="button is-small tooltip"
                             data-tooltip="Add user to workspace with email notification"
                             @click="addUserWorkspace(user)">
                            <span class="icon">
                              <i class="fas fa-plus"></i>
                            </span>
                          </a>
                        </div>
                      </nav>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div v-if="deployInProgress"
               class="label is-success">
            Just one moment, your workspace is being created.
          </div>
        </section>

        <footer class="modal-card-foot">
          <button class="button is-success"
                  @click="validateBeforeSubmit"
                  :disabled="disableActionButton">
            {{appWorkspace.id?'Update':'Add'}} Workspace
          </button>
          <button class="button"
                  @click="close">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
const dict = {
  custom: {
    workspaceName: {
      required: 'Name is Required.',
      regex: 'Name can only contain alphanumeric characters.'
    },
    workspaceSlug: {
      required: 'Short Name is Required.',
      max: 'Short Name can only contain up to 4 characters.',
      regex: 'Short Name cannot start with a number.',
      alpha_num: 'Short Name can only contain alphanumeric characters.'
    }
  }
}

import {
  AppWorkspaceRead,
  AppWorkspaceCreate,
  AppWorkspaceUpdate
} from '@/shared/graphql/AppWorkspaces.gql'
import { AppUsersRead } from '@/shared/graphql/AppUsers.gql'
import AppWorkspace from '@/dev/model/appWorkspace'

export default {
  name: 'workspace-edit',
  props: {
    open: {
      default: false,
      type: Boolean
    },
    workspaceID: {
      default: null,
      type: String
    }
  },
  apollo: {
    appWorkspace: {
      query: AppWorkspaceRead,
      variables() {
        return {
          where: { id: this.workspaceID }
        }
      },
      skip() {
        return !this.workspaceID
      },
      update(data) {
        if (data && data.appWorkspace) {
          // convert to editable obj
          return JSON.parse(JSON.stringify(data.appWorkspace))
        }
      }
    },
    appUsers: {
      query: AppUsersRead,
      skip() {
        return !this.workspaceID
      },
      variables() {
        let variables = this.usersVariables()
        // delete skip
        delete variables.skip
        return variables
      }
    }
  },
  data() {
    return {
      appWorkspace: new AppWorkspace(),
      deployInProgress: false,
      searchQuery: ''
    }
  },
  methods: {
    async validateBeforeSubmit() {
      let isUniqueCheck = await this.checkUniqueWorkspace()
      this.$validator.validateAll().then(result => {
        if (result && isUniqueCheck == true) {
          this.addWorkspace()
          return
        }
      })
    },
    async checkUniqueWorkspace() {
      let result = true
      await this.$apollo
        .query({
          query: AppWorkspaceRead,
          variables: {
            where: {
              name: this.appWorkspace.name
            }
          }
        })
        .then(response => {
          if (response.data.appWorkspace && !this.appWorkspace) {
            this.$buefy.toast.open({
              message: 'A workspace with that short name already exists.',
              type: 'is-danger',
              duration: 5000
            })
            result = false
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Check Unique username on service: ' + error)
        })
      return result
    },
    close() {
      this.$emit('close')
      this.errors.clear()
      this.appWorkspace = new AppWorkspace()
      this.$validator.reset()
      this.$refs.workspaceEditBody.scrollTop = 0
    },
    addUserWorkspace(user) {
      if (user !== null) {
        let data = {
          members: {
            connect: {
              id: user.id
            }
          }
        }
        this.updateWorkspace(data)
      }
    },
    removeUserWorkspace(user) {
      if (user !== null) {
        let data = {
          members: {
            disconnect: {
              id: user.id
            }
          }
        }
        this.updateWorkspace(data)
      }
    },
    updateWorkspace(data) {
      this.$apollo
        .mutate({
          mutation: AppWorkspaceUpdate,
          variables: {
            data: data,
            where: {
              id: this.appWorkspace.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Your workspace has been updated',
            type: 'is-success'
          })
        })
        .catch(error => {
          console.error(error)
          this.$buefy.toast.open({
            message: 'Sorry, Workspace could not be updated',
            type: 'is-danger'
          })
        })
    },
    addWorkspace() {
      if (this.appWorkspace.id) {
        // Update
        let data = {
          name: this.appWorkspace.name,
          displayName: this.appWorkspace.displayName,
          timeZone: this.appWorkspace.timeZone,
          status: this.appWorkspace.status
        }
        this.updateWorkspace(data)
        this.close()
      } else {
        // Add
        this.deployInProgress = true
        if (!this.appWorkspace.id) {
          this.$buefy.toast.open({
            message:
              'Your workspace is being created, please check back in a few moments',
            type: 'is-success',
            duration: 4500
          })
          this.$apollo
            .mutate({
              mutation: AppWorkspaceCreate,
              variables: {
                data: {
                  name: this.appWorkspace.name,
                  displayName: this.appWorkspace.displayName,
                  timeZone: this.appWorkspace.timeZone
                }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
            })
            .catch(() => {
              this.deployInProgress = false
              this.$buefy.toast.open({
                message: 'Sorry, Workspace could not be created',
                type: 'is-danger'
              })
            })
          this.deployInProgress = false
        }
        this.close()
      }
    },
    usersVariables() {
      let length = this.appUsers ? this.appUsers.length : 0
      let id_not_in
      if (
        this.appWorkspace &&
        this.appWorkspace.members &&
        this.appWorkspace.members.length
      ) {
        id_not_in = this.appWorkspace.members.map(user => user.id)
      }
      return {
        where: {
          id_not_in,
          OR: [
            { name_contains: this.searchQuery },
            { email_contains: this.searchQuery }
          ]
        },
        orderBy: 'createdAt_ASC',
        skip: length,
        first: 15
      }
    },
    loadMore() {
      if (this.appUsers && this.appUsers.length > 0) {
        this.$apollo.queries.appUsers.fetchMore({
          variables: this.usersVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              fetchMoreResult &&
              fetchMoreResult.appUsers &&
              fetchMoreResult.appUsers.length > 0
            ) {
              let newUsers = [
                ...this.appUsers,
                ...fetchMoreResult.appUsers.filter(
                  n => !this.appUsers.some(p => p.id === n.id)
                )
              ]
              fetchMoreResult.appUsers = newUsers
              return fetchMoreResult
            }
          }
        })
      }
    }
  },
  computed: {
    disableActionButton() {
      // TODO: Temporary work around for global slugs being longer than four characters
      if (this.appWorkspace.name === 'global') {
        return false
      } else {
        return (
          this.deployInProgress ||
          this.errors.has('displayName') ||
          this.errors.has('workspaceSlug')
        )
      }
    }
  },
  mounted() {
    this.$validator.localize('en', dict)
  }
}
</script>

<style lang="scss">
.user-selected {
  background: #ccc;
}
</style>
