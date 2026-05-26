<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Status</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="status">
          <label class="label">
            Title
            <input type="text"
                   name="title"
                   v-model="labelInfo.title"
                   class="input"
                   v-validate="'required'"
                   :class="{'input': true, 'is-danger': errors.has('title') }" />
            <span v-show="errors.has('title') && fields.title.touched"
                  class="help has-text-danger">{{errors.first('title') }}</span>
          </label>
          <label class="label">
            Description
            <input type="text"
                   v-model="labelInfo.description"
                   class="input" />
          </label>
          <div class="field"
               v-if="!edit">
            <label class="label">
              Add Status to Board
            </label>
            <div class="control is-expanded">
              <div class="field is-grouped-multiline"
                   v-if="filteredTags">
                <b-checkbox name="Status"
                            v-model="labelGroup"
                            v-for="tag in filteredTags"
                            :key="tag.id"
                            :native-value="tag">
                  <span class="tag is-rounded"
                        v-bind:key="tag.id"
                        :style="'background-color:'+tag.color"
                        :class="lightOrDark(tag.color)">{{tag.title}}</span>
                </b-checkbox>
              </div>
            </div>
          </div>
          <label class="label">
            Color
            <swatches v-model="labelInfo.color"
                      show-fallback
                      inline></swatches>
          </label>
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
import PlanLabel from '@/plan/model/planlabel'
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'
import {
  PlanLabelsCreate,
  PlanLabelsUpdate
} from '@/plan/graphql/PlanLabels.gql'
import {
  PlanLabelGroupsRead,
  PlanLabelGroupsUpdate
} from '@/plan/graphql/PlanLabelGroups.gql'
import lightOrDark from '@/shared/mixins/lightOrDark'

export default {
  name: 'label-interaction',
  mixins: [lightOrDark],
  components: { Swatches },
  apollo: {
    planLabelGroups: {
      query: PlanLabelGroupsRead,
      update(data) {
        if (data && data.planLabelGroups) {
          this.planLabelGroups = data.planLabelGroups
          this.filteredTags = JSON.parse(
            JSON.stringify(data.planLabelGroups),
            this.omitTypename
          )
          return data.planLabelGroups
        }
      }
    }
  },
  props: {
    status: {
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
      color: '#1CA085',
      labelInfo: Object.assign({}, this.status),
      labelGroup: [],
      planLabelGroups: [],
      filteredTags: []
    }
  },
  watch: {
    status() {
      this.labelInfo = Object.assign({}, this.status)
    }
  },
  methods: {
    validateTag(tag) {
      let validAdd = true
      if (this.labelGroup && this.labelGroup.length > 0) {
        this.labelGroup.some(function(status) {
          if (status.title === tag.title) {
            validAdd = false
          }
        })
      }
      return validAdd
    },
    getFilteredTags(text) {
      this.filteredTags = this.planLabelGroups.filter(option => {
        return (
          option.title
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
    },
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let data = {
            title: this.labelInfo.title,
            description: this.labelInfo.description,
            color: this.labelInfo.color
          }
          if (this.edit === true) {
            // Update
            this.$apollo
              .mutate({
                mutation: PlanLabelsUpdate,
                variables: {
                  data: data,
                  where: {
                    id: this.labelInfo.id
                  }
                }
              })
              .then(() => {
                this.$buefy.toast.open({
                  message: 'Saving...',
                  type: 'is-success'
                })
                this.labelInfo = new PlanLabel()
                this.close()
              })
              .catch(error => {
                this.$buefy.toast.open({
                  message: 'There was an error',
                  type: 'is-danger'
                })
                console.error('Update Label: ' + error)
              })
          } else {
            // Create
            this.$apollo
              .mutate({
                mutation: PlanLabelsCreate,
                variables: {
                  data: data
                }
              })
              .then(response => {
                if (this.labelGroup && this.labelGroup.length > 0) {
                  this.addToLabelGroup(response.data.createPlanLabel.title)
                }
                this.$buefy.toast.open({
                  message: 'Saving...',
                  type: 'is-success'
                })
                this.labelInfo = new PlanLabel()
                this.close()
              })
              .catch(error => {
                this.$buefy.toast.open({
                  message: 'There was an error',
                  type: 'is-danger'
                })
                console.error('Create Label: ' + error)
              })
          }
          return
        }
        this.$buefy.toast.open({
          message: 'Title is required',
          type: 'is-danger'
        })
      })
    },
    addToLabelGroup(labelTitle) {
      this.labelGroup.forEach(group => {
        let labelData = {
          title: group.title,
          groupLabels: {
            connect: [{ title: labelTitle }]
          }
        }
        this.$apollo
          .mutate({
            mutation: PlanLabelGroupsUpdate,
            variables: {
              data: labelData,
              where: {
                id: group.id
              }
            }
          })
          .then(() => {})
          .catch(error => {
            this.$buefy.toast.open({
              message: error.message,
              type: 'is-danger'
            })
          })
      })
      this.labelGroup = []
    }
  }
}
</script>
