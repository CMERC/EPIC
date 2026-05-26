<template>
  <div class="modal"
       :class="{'is-active':open}">
    <div class="modal-background"></div>
    <div class="modal-card"
         v-if="planInject">
      <header class="modal-card-head">
        <p v-if="fullCreate"
           class="modal-card-title">Create MSEL Inject</p>
        <p v-else
           class="modal-card-title">Quick Create MSEL Inject</p>
        <button class="delete"
                aria-label="close"
                @click="cancel()"></button>
      </header>
      <section class="modal-card-body">
        <div class="columns is-multiline is-mobile">
          <div class="column is-full">
            <div class="field">
              <label class="label">
                Title
              </label>
              <div class="control">
                <input name="planInjectTitle"
                       v-model="planInject.title"
                       v-validate="'required'"
                       :class="{'input': true, 'is-danger': errors.has('planInjectTitle') }"
                       type="text"
                       placeholder="Title">
                <span v-show="errors.has('planInjectTitle')"
                      class="help is-danger">Title is Required</span>
              </div>
            </div>
          </div>
          <div class="column is-full">
            <date-picker :timeZone="$store.state.activeWorkspace.timeZone || momentTimezone.tz.guess(true)"
                         showClear
                         v-model="planInject.startDate"
                         @clear="(value) => {planInject.startDate = value}"
                         @changed="(value) => {planInject.startDate = value}" />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button v-if="fullCreate"
                class="button is-primary"
                @click.once="addPlanInject">
          Save
        </button>
        <button v-else
                class="button is-primary"
                @click="addPlanInject">
          Save
        </button>
        <button class="button"
                @click="cancel()">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import DatePicker from '@/shared/components/datepicker'
import { PlanInjectsCreate } from '@/plan/graphql/PlanInjects.gql'
export default {
  name: 'jmet-quickadd',
  components: {
    DatePicker
  },
  props: {
    planInject: {},
    fullCreate: {
      default: false
    },
    open: {
      default: false
    }
  },
  methods: {
    cancel() {
      this.$emit('close')
    },
    addPlanInject() {
      this.$validator.validate('*').then(result => {
        if (result) {
          this.$apollo
            .mutate({
              mutation: PlanInjectsCreate,
              variables: {
                data: this.planInject
              }
            })
            .then(response => {
              let injectNumber = response.data.createPlanInject.number
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              if (this.fullCreate) {
                this.$router.push({
                  name: 'planInjectView',
                  params: { number: injectNumber },
                  query: { from: this.$route.fullPath }
                })
              }
              this.cancel()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'Sorry, Inject could not be created',
                type: 'is-danger'
              })
              console.error(error)
            })
          return true
        } else {
          this.$buefy.toast.open({
            message: 'Title is Required',
            type: 'is-danger'
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
