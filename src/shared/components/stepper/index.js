import Stepper from './Stepper'
import StepperItem from './StepperItem'

export default {
  install(Vue) {
    Vue.component('stepper', Stepper)
    Vue.component('stepper-item', StepperItem)
  }
}

export { Stepper, StepperItem }
