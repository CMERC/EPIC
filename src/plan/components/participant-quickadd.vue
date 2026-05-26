<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Participant</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">
              Name
            </label>
            <div class="control">
              <input v-model="participantName"
                     class="input"
                     type="text"
                     name="Name"
                     v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('Name') }"
                     placeholder="Name">
            </div>
          </div>
          <span v-show="errors.has('Name') && fields.Name.touched"
                class="help has-text-danger">{{errors.first('Name') }}</span>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             @click="save()">
            Save
          </a>
          <a class="button"
             @click="close()">
            Cancel
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { PlanParticipantsCreate } from '@/plan/graphql/PlanParticipants.gql'
export default {
  name: 'participant-quickadd',
  props: {
    open: {
      default: false
    }
  },
  data() {
    return {
      participantName: null
    }
  },
  methods: {
    save() {
      this.$validator.validate('*').then(result => {
        if (result) {
          this.$apollo
            .mutate({
              mutation: PlanParticipantsCreate,
              variables: {
                data: { name: this.participantName }
              }
            })
            .then(response => {
              if (
                response &&
                response.data &&
                response.data.createPlanParticipant
              ) {
                this.$router.push({
                  name: 'planParticipantEdit',
                  params: { id: response.data.createPlanParticipant.id },
                  query: { from: this.$route.fullPath }
                })
                this.participantName = null
              }
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'Sorry, Participant could not be created',
                type: 'is-danger'
              })
              console.error(error)
            })
        } else {
          this.$buefy.toast.open({
            message: 'Participant Name Required!',
            type: 'is-danger'
          })
        }
      })
    },
    close() {
      this.particpantName = null
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
