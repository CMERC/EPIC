<template>
  <div class="container is-fluid">
    <div class="modal" 
         :class="{ 'is-active': open }">
      <div class="modal-background" 
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Command Or Agency</p>
          <button class="delete" 
                  aria-label="close" 
                  @click="close()"></button>
        </header>
        <section class="modal-card-body" 
                 v-if="planCommandAgencyInfo">
          <div class="field">
            <label class="label">
              Title
            </label>
            <div class="control">
              <input v-model="planCommandAgencyInfo.title" 
                     class="input" 
                     type="text" 
                     name="title" 
                     v-validate="'required'" 
                     :class="{ input: true, 'is-danger': errors.has('title') }" />
              <span v-show="errors.has('title') && fields.title.touched" 
                    class="help has-text-danger">{{ errors.first('title') }}</span>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary" 
             @click="save()">Save</a>
          <a class="button" 
             @click="close()">Cancel</a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import PlanCommandAgency from '@/admin/model/plancommandagency'
import { PlanParticipantCommandAgenciesUpsert } from '@/plan/graphql/PlanParticipantCommandAgency.gql'
export default {
  name: 'commandAgency-interaction',
  props: {
    planCommandAgency: {
      type: Object
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      planCommandAgencyInfo: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    save() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          // Update
          this.$apollo
            .mutate({
              mutation: PlanParticipantCommandAgenciesUpsert,
              variables: {
                update: {
                  title: this.planCommandAgencyInfo.title
                },
                create: {
                  title: this.planCommandAgencyInfo.title
                },
                where: {
                  id: this.planCommandAgencyInfo.id
                }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.planCommandAgencyInfo = new PlanCommandAgency()
              this.close()
            })
            .catch((error) => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Command/Agency: ' + error)
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
    planCommandAgency() {
      this.planCommandAgencyInfo = Object.assign({}, this.planCommandAgency)
    }
  }
}
</script>
