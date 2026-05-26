<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">JMET</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="jmetInfo">
          <div class="columns is-multiline">
            <div class="column is-half">
              <div class="field">
                <label class="label">
                  Level of War
                </label>
                <div class="control">
                  <input class="input"
                         @input="jmetInfo.levelWar = jmetInfo.levelWar.toUpperCase()"
                         v-validate="'required|alpha'"
                         :name="'levelWar'"
                         v-model="jmetInfo.levelWar"
                         type="text"
                         :class="{'input': true, 'is-danger': errors.has('levelWar') }" />
                  <span v-show="errors.has('levelWar')"
                        class="help has-text-danger">Alpha Values are Required</span>
                </div>
              </div>
            </div>
            <div class="column is-half">
              <div class="field">
                <label class="label">
                  Task Number
                </label>
                <div class="control">
                  <input class="input"
                         v-validate="'required'"
                         :name="'taskNumber'"
                         v-model="jmetInfo.taskNumber"
                         type="text"
                         :class="{'input': true, 'is-danger': errors.has('taskNumber') }" />
                  <span v-show="errors.has('taskNumber')"
                        class="help has-text-danger">Task Number is Required</span>
                </div>
              </div>
            </div>
            <div class="column is-12">
              <div class="field">
                <label class="label">
                  Task Title
                </label>
                <div class="control">
                  <input class="input"
                         v-validate="'required'"
                         :name="'taskTitle'"
                         v-model="jmetInfo.taskTitle"
                         type="text"
                         :class="{'input': true, 'is-danger': errors.has('taskTitle') }" />
                  <span v-show="errors.has('taskTitle')"
                        class="help has-text-danger">Task Title is Required</span>
                </div>
              </div>
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
import PlanJmet from '@/plan/model/planJmet'
import { PlanJmetsUpsert } from '@/plan/graphql/PlanJmets.gql'
export default {
  name: 'jmet-interaction',
  props: {
    jmet: {
      type: Object,
      default: function() {
        return new PlanJmet()
      }
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      jmetInfo: new PlanJmet()
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
              mutation: PlanJmetsUpsert,
              variables: {
                update: {
                  levelWar: this.jmetInfo.levelWar,
                  taskNumber: this.jmetInfo.taskNumber,
                  taskTitle: this.jmetInfo.taskTitle,
                  description: `${this.jmetInfo.levelWar} ${
                    this.jmetInfo.taskNumber
                  } ${this.jmetInfo.taskTitle}`
                },
                create: {
                  levelWar: this.jmetInfo.levelWar,
                  taskNumber: this.jmetInfo.taskNumber,
                  taskTitle: this.jmetInfo.taskTitle,
                  description: `${this.jmetInfo.levelWar} ${
                    this.jmetInfo.taskNumber
                  } ${this.jmetInfo.taskTitle}`
                },
                where: {
                  id: this.jmetInfo.id
                }
              }
            })
            .then(response => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              if (response && response.data && response.data.upsertPlanJmet) {
                let data = Object.assign(
                  {},
                  JSON.parse(
                    JSON.stringify(response.data.upsertPlanJmet),
                    this.omitTypename
                  )
                )
                this.$emit('addRecord', data)
                this.jmetInfo = new PlanJmet()
                this.close()
              }
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Jmet: ' + error)
            })
          return
        }
      })
    }
  },
  watch: {
    jmet() {
      this.jmetInfo = Object.assign({}, this.jmet)
    }
  }
}
</script>
