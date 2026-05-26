import {
  PlanCommandPrioritiesCreate,
  PlanCommandPrioritiesDelete,
  PlanCommandPrioritiesUpdate
} from '@/plan/graphql/PlanCommandPriorities.gql'
import {
  PlanMeetingsCreate,
  PlanMeetingsUpdate,
  PlanMeetingsDelete
} from '@/plan/graphql/PlanMeetings.gql'
import {
  PlanFundingSourcesCreate,
  PlanFundingSourcesUpdate,
  PlanFundingSourcesDelete
} from '@/plan/graphql/PlanFundingSources.gql'
import {
  PlanExerciseObjectivesCreate,
  PlanExerciseObjectivesDelete,
  PlanExerciseObjectivesUpdate
} from '@/plan/graphql/PlanExerciseObjectives.gql'
import {
  PlanJmetsCreate,
  PlanJmetsUpdate,
  PlanJmetsDelete
} from '@/plan/graphql/PlanJmets.gql'
import {
  PlanOrganizationsCreate,
  PlanOrganizationsUpdate,
  PlanOrganizationsDelete
} from '@/plan/graphql/PlanOrganizations.gql'
import { PlanAccreditedTasksDelete } from '@/plan/graphql/PlanAccreditedTasks.gql'
import {
  PlanPlatformsCreate,
  PlanPlatformsUpdate,
  PlanPlatformsDelete
} from '@/plan/graphql/PlanPlatforms.gql'
import {
  PlanJointStaffTrainingPrioritiesCreate,
  PlanJointStaffTrainingPrioritiesDelete,
  PlanJointStaffTrainingPrioritiesUpdate
} from '@/plan/graphql/PlanJointStaffTrainingPriorities.gql'
import helpers from '@/shared/mixins/helpers'

import { serverError } from '@/shared/serverError'
export default {
  name: 'PlanExerciseFunctions',
  mixins: [helpers],
  data() {
    return {
      modalFunctions: {
        meetings: {
          create: PlanMeetingsCreate,
          update: PlanMeetingsUpdate,
          delete: PlanMeetingsDelete
        },
        tasksPriority: {
          create: PlanCommandPrioritiesCreate,
          update: PlanCommandPrioritiesUpdate,
          delete: PlanCommandPrioritiesDelete
        },
        fundings: {
          create: PlanFundingSourcesCreate,
          update: PlanFundingSourcesUpdate,
          delete: PlanFundingSourcesDelete
        },
        objectives: {
          create: PlanExerciseObjectivesCreate,
          update: PlanExerciseObjectivesUpdate,
          delete: PlanExerciseObjectivesDelete
        },
        tasks: {
          delete: PlanAccreditedTasksDelete
        },
        jmets: {
          create: PlanJmetsCreate,
          update: PlanJmetsUpdate,
          delete: PlanJmetsDelete
        },
        platforms: {
          create: PlanPlatformsCreate,
          update: PlanPlatformsUpdate,
          delete: PlanPlatformsDelete
        },
        organizations: {
          create: PlanOrganizationsCreate,
          update: PlanOrganizationsUpdate,
          delete: PlanOrganizationsDelete
        },
        jointStaffTrainingPriority: {
          create: PlanJointStaffTrainingPrioritiesCreate,
          update: PlanJointStaffTrainingPrioritiesUpdate,
          delete: PlanJointStaffTrainingPrioritiesDelete
        }
      }
    }
  },
  methods: {
    saveModal(validateInput, name, value) {
      this.$validator.validate(validateInput).then(result => {
        if (result) {
          if (name === 'fundings') {
            if (!value.amount) {
              value.amount = null
            } else value.amount = parseFloat(value.amount)
          }
          if (!value.id) {
            this.$apollo
              .mutate({
                mutation: this.modalFunctions[name].create,
                variables: {
                  data: value
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
          } else {
            let injectID = value.id
            delete value.id
            this.$apollo
              .mutate({
                mutation: this.modalFunctions[name].update,
                variables: {
                  data: value,
                  where: {
                    id: injectID
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
          }
          this.$emit('close')
          return true
        } else {
          return false
        }
      })
    },
    confirmValueDelete(item, name, displayName) {
      this.$buefy.dialog.confirm({
        title: 'Delete ' + displayName,
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteTableValue(item, name)
      })
    },
    deleteTableValue(item, name) {
      if (item.row.id) {
        this.$apollo
          .mutate({
            mutation: this.modalFunctions[name].delete,
            variables: {
              id: {
                id: item.row.id
              }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Deleted',
              type: 'is-success'
            })
          })
          .catch(error => {
            this.$buefy.toast.open({
              message: 'There was an error',
              type: 'is-danger'
            })
            console.error('Delete: ' + error)
          })
      }
    }
  }
}
