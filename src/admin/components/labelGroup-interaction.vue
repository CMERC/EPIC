<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Board</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="groupLabelInfo">
          <div class="field">
            <label class="label">
              Title
            </label>
            <div class="control is-expanded">
              <input type="text"
                     name="title"
                     v-model="groupLabelInfo.title"
                     class="input"
                     v-validate="'required|alpha_spaces'"
                     :class="{'input': true, 'is-danger': errors.has('title') }"
                     v-focus />
              <span v-show="errors.has('title') && fields.title.touched"
                    class="help has-text-danger">{{errors.first('title') }}</span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Status List
            </label>
            <div class="control is-expanded">
              <div class="field is-grouped-multiline"
                   v-if="filteredTags">
                <b-checkbox name="Status"
                            v-model="groupLabelInfo.groupLabels"
                            v-for="tag in filteredTags"
                            :key="tag.id"
                            :native-value="tag"
                            v-validate="'required'"
                            :class="{'is-danger': errors.has('Status') }">
                  <span class="tag is-rounded"
                        v-bind:key="tag.id"
                        :style="'background-color:'+tag.color"
                        :class="lightOrDark(tag.color)">{{tag.title}}</span>
                </b-checkbox>
                <span v-show="errors.has('Status') && fields.Status.touched"
                      class="help has-text-danger">{{errors.first('Status') }}</span>
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
import { PlanLabelsRead } from '@/plan/graphql/PlanLabels.gql'
import {
  PlanLabelGroupsCreate,
  PlanLabelGroupsUpdate,
  PlanLabelGroupsDelete
} from '@/plan/graphql/PlanLabelGroups.gql'
import lightOrDark from '@/shared/mixins/lightOrDark'

export default {
  name: 'labelGroup-interaction',
  mixins: [lightOrDark],
  apollo: {
    planLabels: {
      query: PlanLabelsRead,
      update(data) {
        if (data && data.planLabels) {
          this.allLabels = data.planLabels
          this.filteredTags = JSON.parse(
            JSON.stringify(data.planLabels),
            this.omitTypename
          )
          return data.planLabels
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  props: {
    labelGroupInfo: {
      type: Object
    },
    edit: {
      default: false
    },
    open: {
      default: false
    },
    labelGroupID: {}
  },
  data() {
    return {
      groupLabelInfo: Object.assign({}, this.labelGroupInfo),
      allLabels: '',
      originalLabels: Object.assign({}, this.labelGroupInfo),
      filteredTags: [],
      statusList: []
    }
  },
  watch: {
    labelGroupInfo() {
      this.groupLabelInfo = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.labelGroupInfo), this.omitTypename)
      )
      this.originalLabels = Object.assign({}, this.labelGroupInfo)
    }
  },
  methods: {
    validateTag(tag) {
      let validAdd = true
      if (
        this.groupLabelInfo &&
        this.groupLabelInfo.groupLabels &&
        this.groupLabelInfo.groupLabels.length > 0
      ) {
        this.groupLabelInfo.groupLabels.some(function(label) {
          if (label.title === tag.title) {
            validAdd = false
          }
        })
      }
      return validAdd
    },
    getFilteredTags(text) {
      this.filteredTags = this.allLabels.filter(option => {
        return (
          option.title
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
    },
    confirmDelete() {
      this.$buefy.dialog.confirm({
        title: 'Delete ' + this.groupLabelInfo.title + ' ?',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteGroupLabel(this.groupLabelInfo.id)
      })
    },
    deleteGroupLabel(groupID) {
      this.$apollo
        .mutate({
          mutation: PlanLabelGroupsDelete,
          variables: {
            id: {
              id: groupID
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Group Deleted!',
            type: 'is-success'
          })
          this.close()
        })
        .catch(error => {
          this.$buefy.toast.open({ message: error.message, type: 'is-danger' })
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
            title: this.groupLabelInfo.title
          }
          if (this.edit) {
            let disconnectArray = []
            let connectArray = []
            let isDisconnect = false
            let isConnect = false
            this.groupLabelInfo.groupLabels.forEach((label, idx) => {
              let tempConnectObj = {}
              tempConnectObj = {
                title: label.title
              }
              connectArray.push(tempConnectObj)
              if (idx === this.groupLabelInfo.groupLabels.length - 1) {
                isConnect = true
              }
            })
            this.originalLabels.groupLabels.forEach((label, idx) => {
              let tempDisconnectObj = {}
              tempDisconnectObj = {
                title: label.title
              }
              disconnectArray.push(tempDisconnectObj)
              if (idx === this.originalLabels.groupLabels.length - 1) {
                isDisconnect = true
              }
            })
            if (isDisconnect && isConnect) {
              connectArray.forEach(connectLabel => {
                disconnectArray.forEach(
                  (disconnectLabel, disconnectIdx, disconnectArray) => {
                    if (connectLabel.title === disconnectLabel.title) {
                      disconnectArray.splice(disconnectIdx, 1)
                    }
                  }
                )
              })
              let labelData = Object.assign(data, {
                groupLabels: {
                  disconnect: disconnectArray,
                  connect: connectArray
                }
              })
              this.$apollo
                .mutate({
                  mutation: PlanLabelGroupsUpdate,
                  variables: {
                    data: labelData,
                    where: {
                      id: this.groupLabelInfo.id
                    }
                  }
                })
                .then(() => {
                  this.$buefy.toast.open({
                    message: 'Saving...',
                    type: 'is-success'
                  })
                  this.$emit('updated')
                  this.close()
                })
                .catch(() => {
                  this.$buefy.toast.open({
                    message: 'Sorry, Label could not be Updated',
                    type: 'is-danger'
                  })
                })
            }
          } else {
            let tempArray = []
            for (let i in this.groupLabelInfo.groupLabels) {
              let tempObj = {}
              let tempLabel = this.groupLabelInfo.groupLabels[i]
              tempObj = {
                title: tempLabel.title
              }
              tempArray.push(tempObj)
            }
            let labelData = Object.assign(data, {
              groupLabels: {
                connect: tempArray
              }
            })
            this.$apollo
              .mutate({
                mutation: PlanLabelGroupsCreate,
                variables: {
                  data: labelData
                }
              })
              .then(() => {
                this.$buefy.toast.open({
                  message: 'Saving...',
                  type: 'is-success'
                })
                this.close()
              })
              .catch(() => {
                this.$buefy.toast.open({
                  message: 'Sorry, Label could not be created',
                  type: 'is-danger'
                })
              })
          }
          return
        }
        this.$buefy.toast.open({
          message: 'Field Can Not Be Empty',
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-card {
  .modal-card-body {
    min-height: 25vh;
    overflow: initial;
    .autocomplete .dropdown-menu {
      z-index: 100000;
    }
  }
}
</style>
