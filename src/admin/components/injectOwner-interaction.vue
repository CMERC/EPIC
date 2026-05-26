<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Inject Owner</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body"
                 v-if="owner">
          <div class="field">
            <label class="label">
              Title
            </label>
            <div class="control">
              <input v-model="ownerInfo.title"
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
import PlanInjectOwner from '@/admin/model/planinjectowner'
import { PlanInjectOwnersUpsert } from '@/plan/graphql/PlanInjectOwners.gql'
export default {
  name: 'injectOwner-interaction',
  props: {
    owner: {
      type: Object
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      ownerInfo: null
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
              mutation: PlanInjectOwnersUpsert,
              variables: {
                update: {
                  title: this.ownerInfo.title
                },
                create: {
                  title: this.ownerInfo.title
                },
                where: {
                  id: this.ownerInfo.id
                }
              }
            })
            .then(() => {
              this.$buefy.toast.open({
                message: 'Saving...',
                type: 'is-success'
              })
              this.ownerInfo = new PlanInjectOwner()
              this.close()
            })
            .catch(error => {
              this.$buefy.toast.open({
                message: 'There was an error',
                type: 'is-danger'
              })
              console.error('Update Inject Owner: ' + error)
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
    owner() {
      this.ownerInfo = Object.assign({}, this.owner)
    }
  }
}
</script>
