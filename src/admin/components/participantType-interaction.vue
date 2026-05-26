<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Participant Type</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="participantType">
          <div class="field">
            <label class="label">
              Title
            </label>
            <div class="control">
              <input v-model="participantTypeInfo.title"
                     class="input"
                     type="text"
                     name="title"
                     v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('title') }">
              <span v-show="errors.has('title') && fields.title.touched"
                    class="help has-text-danger">{{errors.first('title') }}</span>
            </div>
          </div>
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
import PlanParticipantType from '@/plan/model/planParticipantType'
import { PlanParticipantTypesUpsert } from '@/plan/graphql/PlanParticipantType.gql'
export default {
  name: 'participantType-interaction',
  props: {
    participantType: {
      type: Object
    },
    edit: {
      default: false
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      participantTypeInfo: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          // Update
          this.$apollo
            .mutate({
              mutation: PlanParticipantTypesUpsert,
              variables: {
                update: {
                  title: this.participantTypeInfo.title
                },
                create: {
                  title: this.participantTypeInfo.title
                },
                where: {
                  id: this.participantTypeInfo.id
                }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.participantTypeInfo = new PlanParticipantType()
              this.close()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Participant Type: ' + error)
            })
          return
        }
        this.$buefy.toast.open({
          message: 'Title is required',
          type: 'is-danger'
        })
      })
    }
  },
  watch: {
    participantType() {
      this.participantTypeInfo = Object.assign({}, this.participantType)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
