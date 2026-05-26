<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Organization</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="orgInfo">
          <div class="field">
            <label class="label">
              Name
            </label>
            <div class="control">
              <input class="input"
                     v-validate="'required'"
                     :name="'name'"
                     v-model="orgInfo.name"
                     type="text"
                     :class="{'input': true, 'is-danger': errors.has('name') }" />
              <span v-show="errors.has('name')"
                    class="help has-text-danger">Organization Name Required</span>
            </div>
          </div>

          <div class="field">
            <label class="label">
              Group
            </label>
            <div class="control">
              <input class="input"
                     v-model="orgInfo.group"
                     type="text" />
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
import PlanOrganization from '@/plan/model/planOrganization'
import { PlanOrganizationsUpsert } from '@/plan/graphql/PlanOrganizations.gql'
export default {
  name: 'organization-interaction',
  props: {
    organization: {
      type: Object,
      default: function() {
        return new PlanOrganization()
      }
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      orgInfo: new PlanOrganization()
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
              mutation: PlanOrganizationsUpsert,
              variables: {
                update: {
                  name: this.orgInfo.name,
                  group: this.orgInfo.group
                },
                create: {
                  name: this.orgInfo.name,
                  group: this.orgInfo.group
                },
                where: {
                  id: this.orgInfo.id
                }
              }
            })
            .then(response => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              if (
                response &&
                response.data &&
                response.data.upsertPlanOrganization
              ) {
                let data = Object.assign(
                  {},
                  JSON.parse(
                    JSON.stringify(response.data.upsertPlanOrganization),
                    this.omitTypename
                  )
                )
                this.$emit('addRecord', data)
                this.orgInfo = new PlanOrganization()
                this.close()
              }
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Reason: ' + error)
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
    organization() {
      this.orgInfo = Object.assign({}, this.organization)
    }
  }
}
</script>
