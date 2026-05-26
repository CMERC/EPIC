<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Platform</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="platformInfo">
          <div class="field">
            <label class="label">
              Title
            </label>
            <div class="control">
              <input class="input"
                     v-validate="'required'"
                     :name="'title'"
                     v-model="platformInfo.title"
                     type="text"
                     :class="{'input': true, 'is-danger': errors.has('title') }" />
              <span v-show="errors.has('title')"
                    class="help has-text-danger">Platform Title Required</span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Type
            </label>
            <div class="control">
              <input class="input"
                     v-validate="'required'"
                     :name="'type'"
                     v-model="platformInfo.type"
                     type="text"
                     :class="{'input': true, 'is-danger': errors.has('type') }" />
              <span v-show="errors.has('type')"
                    class="help has-text-danger">Platform Type Required</span>
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
import PlanPlatform from '@/plan/model/planPlatform'
import { PlanPlatformsUpsert } from '@/plan/graphql/PlanPlatforms.gql'
export default {
  name: 'platform-interaction',
  props: {
    platform: {
      type: Object,
      default: function() {
        return new PlanPlatform()
      }
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      platformInfo: new PlanPlatform()
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
              mutation: PlanPlatformsUpsert,
              variables: {
                update: {
                  title: this.platformInfo.title,
                  type: this.platformInfo.type
                },
                create: {
                  title: this.platformInfo.title,
                  type: this.platformInfo.type
                },
                where: {
                  id: this.platformInfo.id
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
                response.data.upsertPlanPlatform
              ) {
                let data = Object.assign(
                  {},
                  JSON.parse(
                    JSON.stringify(response.data.upsertPlanPlatform),
                    this.omitTypename
                  )
                )
                this.$emit('addRecord', data)
                this.platformInfo = new PlanPlatform()
                this.close()
              }
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Platform: ' + error)
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
    platform() {
      this.platformInfo = Object.assign({}, this.platform)
    }
  }
}
</script>
