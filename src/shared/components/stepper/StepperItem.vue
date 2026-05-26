<template>
  <transition :name="transitionName">
    <div v-show="isActive && visible">
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'StepperItem',
  props: {
    label: String,
    icon: String,
    iconLabel: String,
    classList: [String, Object],
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isActive: false,
      transitionName: null
    }
  },
  methods: {
    /**
     * Activate item, alter animation name based on the index.
     */
    activate(oldIndex, index) {
      if (!this.$parent.animated) {
        this.transitionName = null
      } else {
        this.transitionName = index < oldIndex ? 'slide-next' : 'slide-prev'
      }
      this.isActive = true
    },
    /**
     * Deactivate item, alter animation name based on the index.
     */
    deactivate(oldIndex, index) {
      if (!this.$parent.animated) {
        this.transitionName = null
      } else {
        this.transitionName = index < oldIndex ? 'slide-next' : 'slide-prev'
      }
      this.isActive = false
    }
  },
  created() {
    if (!this.$parent.$data.isStepper) {
      this.$destroy()
      throw new Error('You should wrap StepperItem with a Stepper')
    }
    this.$parent.stepperItems.push(this)
  },
  beforeDestroy() {
    const index = this.$parent.stepperItems.indexOf(this)
    if (index >= 0) {
      this.$parent.stepperItems.splice(index, 1)
    }
  }
}
</script>
