<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active':open}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Participant Planner</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <div class="columns is-multiline">
                <div class="column is-half">
                  <div class="field">
                    <label class="label">
                      Name
                    </label>
                    <input class="input"
                           v-model="plannerInfo.name"
                           type="text"
                           placeholder="Name" />
                  </div>
                </div>
                <div class="column is-half">
                  <div class="field">
                    <label class="label">
                      Email
                    </label>
                    <div v-if="id">
                      <div class="control"
                           v-if="plannerInfo">
                        <input class="input"
                               type="text"
                               v-model="plannerInfo.email"
                               disabled>
                      </div>
                    </div>
                    <div v-else>
                      <div class="field">
                        <input class="input"
                               type="email"
                               v-model="plannerInfo.email"
                               placeholder="sample@sample.com"
                               v-validate="'email'"
                               data-vv-as="email"
                               name="email"
                               :class="{'is-danger': errors.has('email') }" />
                        <span v-show="errors.has('email') && fields.email.touched"
                              class="help has-text-danger">{{errors.first('email') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-half">
                  <div class="field">
                    <label class="label">
                      Phone Number
                    </label>
                    <div class="control">
                      <input class="input"
                             v-model="plannerInfo.phoneNumber"
                             placeholder="1234567890"
                             type="tel"
                             :name="'phoneNumber'" />
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="columns">
                    <div class="column is-half">
                      <div class="field">
                        <label class="label">
                          Primary Contact
                        </label>
                        <div class="control">
                          <input type="checkbox"
                                 v-model="plannerInfo.isPrimary"
                                 size="is-medium"
                                 :class="{'input': primaryError, 'is-danger': primaryError }" />
                          <span v-show="primaryError"
                                class="help has-text-danger">Another Contact Already Designated Primary</span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-half">
                      <div class="field">
                        <label class="label">
                          Invite User
                        </label>
                        <div class="control">
                          <input type="checkbox"
                                 v-model="inviteUserCheck"
                                 size="is-medium" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="validateBeforeSubmit()">
            Save
          </button>
          <button class="button"
                  @click="close()">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import {
  AppWorkspacesRead,
  AppWorkspaceUpdate
} from '@/shared/graphql/AppWorkspaces.gql'
import {
  PlanParticipantPlannerRead,
  PlanParticipantPlannersRead
} from '@/plan/graphql/PlanParticipantPlanners.gql'
import { PlanParticipantsUpdate } from '@/plan/graphql/PlanParticipants.gql'
import { InviteUser } from '@/shared/graphql/Auth.gql'
import { serverError } from '@/shared/serverError'
import ParticipantPlanner from '@/plan/model/planParticipantPlanner'
import helpers from '@/shared/mixins/helpers'
import processVal from '@/shared/mixins/processVal'
export default {
  name: 'PlanManageParticipantPlanners',
  apollo: {
    workspaceUsers: {
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
          return JSON.parse(
            JSON.stringify(data.appWorkspaces[0]),
            this.omitTypename
          ).members
        }
      }
    },
    planParticipantPlanner: {
      query: PlanParticipantPlannerRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      update(data) {
        if (data && data.planParticipantPlanner && this.id) {
          this.plannerInfo = JSON.parse(
            JSON.stringify(data.planParticipantPlanner),
            this.omitTypename
          )
        }
      },
      error(error) {
        console.error(error)
      }
    },
    planParticipantPlanners: {
      query: PlanParticipantPlannersRead,
      error(error) {
        console.error(error)
      }
    }
  },
  props: {
    id: {},
    participantId: {},
    open: {
      default: false
    },
    isClosed: {
      default: false
    }
  },
  mixins: [helpers, processVal],
  data() {
    return {
      inviteUserCheck: false,
      workspaceUsers: [],
      userInfo: [{ name: '' }, { email: '' }],
      planParticipantPlanners: [],
      plannerInfo: new ParticipantPlanner(),
      primaryError: false
    }
  },
  watch: {
    open() {
      if (!this.open) {
        this.plannerInfo = new ParticipantPlanner()
        this.userInfo = [{ name: '' }, { email: '' }]
        this.primaryError = false
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.inviteUserCheck = false
      this.errors.clear()
      this.$validator.reset()
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result && !this.primaryError) {
          this.savePlanner()
        }
        return
      })
    },
    savePlanner() {
      let dataVariable
      if (!this.id) {
        dataVariable = {
          planners: {
            create: {
              phoneNumber: this.plannerInfo.phoneNumber,
              name: this.plannerInfo.name,
              isPrimary: this.plannerInfo.isPrimary,
              email: this.plannerInfo.email
            }
          }
        }
      } else {
        dataVariable = {
          planners: {
            update: {
              data: {
                phoneNumber: this.plannerInfo.phoneNumber,
                name: this.plannerInfo.name,
                isPrimary: this.plannerInfo.isPrimary,
                email: this.plannerInfo.email
              },
              where: {
                id: this.plannerInfo.id
              }
            }
          }
        }
      }
      this.$apollo
        .mutate({
          mutation: PlanParticipantsUpdate,
          variables: {
            data: dataVariable,
            where: {
              id: this.participantId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
      if (this.inviteUserCheck == true) {
        this.inviteUser(this.plannerInfo.email)
      }
      this.close()
      return true
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
          if (response && response.data && response.data.inviteUser) {
            // Assign workspace
            this.$apollo
              .mutate({
                mutation: AppWorkspaceUpdate,
                variables: {
                  data: {
                    members: {
                      connect: {
                        id: response.data.inviteUser.id
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
                      'Email sent to user to join and has been given access to ' +
                      this.$store.state.activeWorkspace.name,
                    type: 'is-success'
                  })
              })
          } else {
            this.$buefy.toast.open({
              message: 'Email sent to user to join',
              type: 'is-success'
            })
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-card,
.modal-card-body {
  overflow: visible !important;
}
</style>
