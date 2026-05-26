<template>
  <div class="modal"
       :class="{'is-active': open}">
    <div class="modal-background"
         @click="cancel()"></div>
    <div class="modal-card"
         v-if="exercise">
      <header class="modal-card-head">
        <div class="level-left">
          <div class="level-item participant-icon">
          </div>
        </div>
        <div class="modal-card-title">
          <p class="title">Exercise Name</p>
          <p class="subtitle align-subtitle"></p>
        </div>
        <button class="is-large delete"
                aria-label="close"
                @click="cancel()"></button>
      </header>
      <section class="modal-card-body">
        <input class="input"
               v-model="exerciseInfo.name" />
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary"
                @click="save()">
          Save
        </button>
        <button class="button is-outlined"
                @click="cancel()">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import { PlanEventsUpdate } from '@/plan/graphql/PlanEvents.gql'
export default {
  name: 'exercise-interaction',
  props: {
    exercise: {
      type: Object,
      default: null
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      exerciseInfo: ''
    }
  },
  methods: {
    cancel() {
      this.$emit('close')
    },
    save() {
      this.$apollo
        .mutate({
          mutation: PlanEventsUpdate,
          variables: {
            data: { name: this.exerciseInfo.name },
            where: {
              id: this.exerciseInfo.id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          this.cancel()
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Exercise Name Event: ' + error)
        })
    }
  },
  watch: {
    exercise() {
      this.exerciseInfo = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.exercise), this.omitTypename)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
