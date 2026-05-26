<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Training Priority</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="planPriorityLevelInfo">
          <div class="field">
            <label class="label">
              Title
            </label>
            <div class="control">
              <input v-model="planPriorityLevelInfo.title"
                     class="input"
                     type="text"
                     name="title"
                     v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('title') }">
              <span v-show="errors.has('title') && fields.title.touched"
                    class="help has-text-danger">{{errors.first('title') }}</span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Color
            </label>
            <div class="control">
              <swatches v-model="planPriorityLevelInfo.color"
                        colors="material-dark"
                        show-fallback
                        inline></swatches>
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
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'
import PlanPriorityLevel from '@/admin/model/planprioritylevel'
import { PlanPriorityLevelsUpsert } from '@/plan/graphql/PlanPriorityLevels.gql'
export default {
  name: 'priorityLevel-interaction',
  components: { Swatches },
  props: {
    planPriorityLevel: {
      type: Object
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      planPriorityLevelInfo: null
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
              mutation: PlanPriorityLevelsUpsert,
              variables: {
                update: {
                  title: this.planPriorityLevelInfo.title,
                  color: this.planPriorityLevelInfo.color
                },
                create: {
                  title: this.planPriorityLevelInfo.title,
                  color: this.planPriorityLevelInfo.color
                },
                where: {
                  id: this.planPriorityLevelInfo.id
                }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.planPriorityLevelInfo = new PlanPriorityLevel()
              this.close()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Training Priority: ' + error)
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
    planPriorityLevel() {
      this.planPriorityLevelInfo = Object.assign({}, this.planPriorityLevel)
    }
  }
}
</script>
