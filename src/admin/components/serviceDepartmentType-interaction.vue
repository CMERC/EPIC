<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Service/Department Type</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="serviceDepartmentType">
          <div class="field">
            <label class="label">
              Title
            </label>
            <div class="control">
              <input v-model="serviceDepartmentTypeInfo.title"
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
import PlanParticipantServiceType from '@/admin/model/planservicedepartmenttype'
import { PlanParticipantServiceTypesUpsert } from '@/plan/graphql/PlanParticipantServiceType.gql'
export default {
  name: 'serviceDepartmentType-interaction',
  props: {
    serviceDepartmentType: {
      type: Object
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      serviceDepartmentTypeInfo: null
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
              mutation: PlanParticipantServiceTypesUpsert,
              variables: {
                update: {
                  title: this.serviceDepartmentTypeInfo.title
                },
                create: {
                  title: this.serviceDepartmentTypeInfo.title
                },
                where: {
                  id: this.serviceDepartmentTypeInfo.id
                }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.serviceDepartmentTypeInfo = new PlanParticipantServiceType()
              this.close()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Service/Department Type: ' + error)
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
    serviceDepartmentType() {
      this.serviceDepartmentTypeInfo = Object.assign(
        {},
        this.serviceDepartmentType
      )
    }
  }
}
</script>
