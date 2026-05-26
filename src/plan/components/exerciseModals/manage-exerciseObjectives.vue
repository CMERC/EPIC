<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active':open}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Exercise Objective</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns is-multiline is-mobile">
            <div class="column is-full">
              <div class="field">
                <label class="label">
                  Objective Title
                </label>
                <div class="control">
                  <input class="input"
                         v-validate="'required'"
                         :name="'objectiveTitle'"
                         v-model="objectiveInfo.title"
                         type="text"
                         :class="{'input': true, 'is-danger': errors.has('objectiveTitle') }" />
                  <span v-show="errors.has('objectiveTitle')"
                        class="help has-text-danger">Title is Required</span>
                </div>
              </div>
            </div>
            <div class="column is-full">
              <div class="field">
                <label class="label">
                  Objective
                </label>
                <div class="control">
                  <textarea class="textarea"
                            v-model="objectiveInfo.exerciseObjective"
                            placeholder="Objective"></textarea>
                </div>
              </div>
            </div>
            <div class="column is-full">
              <div class="field">
                <label class="label">
                  Measure Of Performance
                </label>
                <div class="control">
                  <textarea class="textarea"
                            v-model="objectiveInfo.measurePerformance"
                            placeholder="Performance"></textarea>
                </div>
              </div>
            </div>
            <div class="column is-full">
              <div class="field">
                <label class="label">
                  Measure of Effectiveness
                </label>
                <div class="control">
                  <textarea class="textarea"
                            v-model="objectiveInfo.measureEffectiveness"
                            placeholder="Effectiveness"></textarea>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="saveExerciseObjective('objectiveTitle','objectives',objectiveInfo)">
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
import { PlanExerciseObjectiveRead } from '@/plan/graphql/PlanExerciseObjectives.gql'
import PlanExerciseObjective from '@/plan/model/planExerciseObjective'
import helpers from '@/shared/mixins/helpers'
import processVal from '@/shared/mixins/processVal'
export default {
  name: 'PlanManageExerciseObjectives',
  apollo: {
    planExerciseObjective: {
      query: PlanExerciseObjectiveRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      skip() {
        return !this.id
      },
      update(data) {
        if (data && data.planExerciseObjective && this.id) {
          this.objectiveInfo = JSON.parse(
            JSON.stringify(data.planExerciseObjective),
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
    exerciseObjective: {
      type: Object,
      default: function() {
        return new PlanExerciseObjective()
      }
    }
  },
  mixins: [helpers, processVal],
  data() {
    return {
      objectiveInfo: Object.assign({}, this.exerciseObjective)
    }
  },
  watch: {
    open() {
      if (!this.open) {
        this.objectiveInfo = {}
      }
    }
  },
  methods: {
    close() {
      this.objectiveInfo = {}
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    saveExerciseObjective(validateInput, name, value) {
      this.saveModal(validateInput, name, value)
    }
  }
}
</script>
