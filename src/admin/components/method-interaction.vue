<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Method</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="methodInfo">
          <div class="field">
            <label class="label">
              Name
            </label>
            <div class="control">
              <input type="text"
                     name="name"
                     v-model="methodInfo.name"
                     class="input"
                     v-validate="'required'"
                     :class="{'input': true, 'is-danger': errors.has('name') }"
                     placeholder="Identifier for the Inject Method" />
              <span v-show="errors.has('name') && fields.name.touched"
                    class="help has-text-danger">{{errors.first('name') }}</span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Icon
            </label>
            <div class="control">
              <icon-picker v-model="methodInfo.icon"></icon-picker>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Color
            </label>
            <div class="control">
              <swatches v-model="methodInfo.color"
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
import IconPicker from '@/shared/components/iconpicker'
import { PlanMethodsUpsert } from '@/plan/graphql/PlanMethods.gql'
import PlanMethod from '@/plan/model/planMethods'
export default {
  name: 'method-interaction',
  components: { Swatches, IconPicker },
  props: {
    method: {
      type: Object,
      default: function() {
        return new PlanMethod()
      }
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      methodInfo: new PlanMethod()
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
              mutation: PlanMethodsUpsert,
              variables: {
                update: {
                  name: this.methodInfo.name,
                  icon: this.methodInfo.icon,
                  color: this.methodInfo.color
                },
                create: {
                  name: this.methodInfo.name,
                  icon: this.methodInfo.icon,
                  color: this.methodInfo.color
                },
                where: {
                  id: this.methodInfo.id
                }
              }
            })
            .then(response => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })

              if (response && response.data && response.data.upsertPlanMethod) {
                let data = Object.assign(
                  {},
                  JSON.parse(
                    JSON.stringify(response.data.upsertPlanMethod),
                    this.omitTypename
                  )
                )
                this.$emit('addRecord', data)
                this.methodInfo = new PlanMethod()
                this.close()
              }
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Method: ' + error)
            })
          return
        }
      })
    }
  },
  watch: {
    method() {
      this.methodInfo = Object.assign({}, this.method)
    }
  }
}
</script>
