<template>
  <div class="steps">
    <div v-for="(stepperItem, index) in stepperItems"
         :key="index"
         v-show="stepperItem.visible"
         :class="['step-item', {'is-active': activeStep === index}, stepperItem.classList ]">
      <a @click="changeStep(index)">
        <template>
          <div class="step-marker">
            <i v-if="stepperItem.icon"
               :class="stepperItem.icon"></i>
            <span v-else>{{index+1}}</span>
          </div>
          <div class="step-details">
            <p class="step-title">{{ stepperItem.label }}</p>
          </div>
        </template>
      </a>
    </div>
    <div class="steps-content">

      <slot />

    </div>
    <div class="level steps-actions">
      <div class="level-left steps-action">
        <div class="level-item">
          <a data-nav="previous"
             class="button is-outlined"
             v-if="activeStep != 0"
             @click="changeStep(activeStep-1)">
            Previous
          </a>
        </div>
      </div>
      <div class="level-right steps-action">
        <div class="level-item"
             v-if="$route.name == 'planParticipantEdit' && activeStep == 4">
          <a class="button is-text"
             @click="saveAndRoute">
            Save & Create TO
          </a>
        </div>
        <div class="level-item"
             v-if="(stepperItems.length-1) != activeStep">
          <a class="button is-text"
             @click="changeStep(activeStep); stepsCompleted()">
            Save and Exit
          </a>
          <a data-nav="next"
             class="button is-primary"
             @click="changeStep(activeStep+1)">
            Next
          </a>
        </div>
        <template v-else>
          <div class="level-item">
            <a data-nav="next"
               class="button is-primary"
               @click.once="stepsCompleted()">
              Complete
            </a>
          </div>
        </template>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Stepper',
  props: {
    value: [String, Number],
    expanded: Boolean,
    type: String,
    position: String,
    animated: {
      type: Boolean,
      default: true
    },
    isValid: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeStep: this.value || 0,
      stepperItems: [],
      contentHeight: 0,
      pendingStepRoute: null,
      isStepper: true // Used internally by StepperItem
    }
  },
  computed: {
    navClasses() {
      return [
        this.type,
        this.position,
        {
          'is-fullwidth': this.expanded,
          'is-toggle-rounded is-toggle': this.type === 'is-toggle-rounded'
        }
      ]
    }
  },
  watch: {
    /**
     * When v-model is changed set the new active step.
     */
    value(value) {
      this.changeStep(value)
    },
    activeStep() {
      this.$emit('activeStep', this.activeStep)
    },
    /**
     * When step-items are updated, set active one.
     */
    stepperItems() {
      if (this.stepperItems.length) {
        this.stepperItems[this.activeStep].isActive = true
      }
    }
  },
  methods: {
    isSameRouteQuery(targetQuery) {
      const currentQuery = this.$route.query || {}
      const currentKeys = Object.keys(currentQuery).sort()
      const targetKeys = Object.keys(targetQuery).sort()

      return currentKeys.length === targetKeys.length &&
        currentKeys.every((key, index) => (
          key === targetKeys[index] &&
          String(currentQuery[key]) === String(targetQuery[key])
        ))
    },

    /**
     * Change the active step and emit change event.
     */
    changeStep(newIndex) {
      // Added isValid to track if step is Valid prior to changing
      // First used in manage-trainingObjectives.vue
      if (this.isValid) {
        this.$emit('previousStep', this.activeStep)
        this.stepperItems[this.activeStep].deactivate(this.activeStep, newIndex)
        this.stepperItems[newIndex].activate(this.activeStep, newIndex)
        this.activeStep = newIndex
        this.$emit('change', newIndex)

        const query = Object.assign({}, this.$route.query, { step: newIndex })
        const target = { path: this.$route.path, query }
        const targetRoute = this.$router.resolve(target).route
        const alreadyOnTargetRoute =
          targetRoute.path === this.$route.path &&
          this.isSameRouteQuery(query)

        if (
          !alreadyOnTargetRoute &&
          targetRoute.fullPath !== this.pendingStepRoute
        ) {
          this.pendingStepRoute = targetRoute.fullPath
          this.$router.push(target).catch(error => {
            const isDuplicateNavigation = error && (
              error.name === 'NavigationDuplicated' ||
              error._name === 'NavigationDuplicated' ||
              /Avoided redundant navigation/.test(error.message || '')
            )
            if (!isDuplicateNavigation) {
              throw error
            }
          }).finally(() => {
            if (this.pendingStepRoute === targetRoute.fullPath) {
              this.pendingStepRoute = null
            }
          })
        }
      } else {
        this.$buefy.toast.open({
          message: 'Error In Step',
          type: 'is-danger'
        })
      }
    },

    /**
     * Step click listener, emit input event and change active step.
     */
    stepClick(value) {
      this.$emit('input', value)
      this.changeStep(value)
    },

    /**
     * Step complete listener, emit input event at the end of all steps.
     */
    stepsCompleted() {
      this.$emit('steps-completed')
    },
    /**
     * added to allow a save then route to somewhere/something after
     */
    saveAndRoute() {
      this.$emit('saveAndRoute')
    }
  },
  mounted() {
    if (this.stepperItems.length) {
      this.stepperItems[this.activeStep].isActive = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
