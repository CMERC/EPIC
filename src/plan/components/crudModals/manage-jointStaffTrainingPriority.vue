<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active':open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <div class="modal-card-title">
            <p class="title">Joint Staff Training Priority</p>
          </div>
          <button class="is-large delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <form data-vv-scope="jointStaffTrainingPriorityModal"
                v-on:submit.prevent>
            <div class="columns is-multiline is-mobile">
              <div class="column is-full">
                <div class="columns is-multiline is-mobile">
                  <div class="column is-full">
                    <div class="field">
                      <label class="label">
                        Title
                      </label>
                      <div class="control">
                        <input class="input"
                               v-validate="'required'"
                               :name="'title'"
                               v-model="jointStaffTrainingPriorityInfo.title"
                               type="text"
                               :class="{'input': true, 'is-danger': errors.has('jointStaffTrainingPriorityModal.title') }" />
                        <span v-show="errors.has('jointStaffTrainingPriorityModal.title')"
                              class="help has-text-danger">Joint Staff Training Priority Title Required</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-full">
                <div class="columns is-multiline is-mobile">
                  <div class="column">
                    <div class="field">
                      <label class="label">
                        Description
                      </label>
                      <div class="control">
                        <textarea class="textarea"
                                  v-validate="'required'"
                                  :name="'description'"
                                  v-model="jointStaffTrainingPriorityInfo.description"
                                  type="text"
                                  :class="{'input': true, 'is-danger': errors.has('jointStaffTrainingPriorityModal.description') }" />
                        <span v-show="errors.has('jointStaffTrainingPriorityModal.description')"
                              class="help has-text-danger">Joint Staff Training Priority Description Required</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="saveJointStaffTrainingPriority('jointStaffTrainingPriorityModal.*','jointStaffTrainingPriority',jointStaffTrainingPriorityInfo)">
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
import { PlanJointStaffTrainingPriorityRead } from '@/plan/graphql/PlanJointStaffTrainingPriorities.gql'
import PlanJointStaffTrainingPriority from '@/plan/model/planJointStaffTrainingPriority'
import helpers from '@/shared/mixins/helpers'
import processVal from '@/shared/mixins/processVal'
export default {
  name: 'manage-jointStaffTrainingPriority',
  apollo: {
    planJointStaffTrainingPriority: {
      query: PlanJointStaffTrainingPriorityRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      update(data) {
        if (data && data.planJointStaffTrainingPriority && this.id) {
          this.jointStaffTrainingPriorityInfo = JSON.parse(
            JSON.stringify(data.planJointStaffTrainingPriority),
            this.omitTypename
          )
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  props: {
    id: {},
    open: {
      default: false
    },
    isClosed: {
      default: true
    }
  },
  mixins: [helpers, processVal],
  data() {
    return {
      jointStaffTrainingPriorityInfo: new PlanJointStaffTrainingPriority()
    }
  },
  watch: {
    open() {
      if (!this.open) {
        this.jointStaffTrainingPriorityInfo = new PlanJointStaffTrainingPriority()
      }
    },
    isClosed() {
      if (this.isClosed) {
        this.errors.clear()
        this.$validator.reset()
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    saveJointStaffTrainingPriority(validateInput, name, value) {
      this.saveModal(validateInput, name, value)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
