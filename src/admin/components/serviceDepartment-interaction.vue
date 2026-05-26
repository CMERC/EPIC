<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Service/Department</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="serviceDepartment">
          <div class="field">
            <label class="label">
              Title
            </label>
            <div class="control">
              <input v-model="serviceDepartmentInfo.title"
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
import PlanParticipantService from '@/admin/model/planservicedepartment'
import { PlanParticipantServicesUpsert } from '@/plan/graphql/PlanParticipantService.gql'
export default {
  name: 'serviceDepartment-interaction',
  props: {
    serviceDepartment: {
      type: Object
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      serviceDepartmentInfo: null
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
              mutation: PlanParticipantServicesUpsert,
              variables: {
                update: {
                  title: this.serviceDepartmentInfo.title
                },
                create: {
                  title: this.serviceDepartmentInfo.title
                },
                where: {
                  id: this.serviceDepartmentInfo.id
                }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.serviceDepartmentInfo = new PlanParticipantService()
              this.close()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Service/Department: ' + error)
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
    serviceDepartment() {
      this.serviceDepartmentInfo = Object.assign({}, this.serviceDepartment)
    }
  }
}
</script>
