<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active':open}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Command Training Priority</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns is-multiline is-mobile">
            <div class="column is-full">
              <div class="columns is-multiline is-mobile">
                <div class="column is-full">
                  <div class="field">
                    <label class="label">
                      Title
                    </label>
                    <div class="control">
                      <input class="input"
                             v-validate="'required'"
                             :name="'commandPriorityTitle'"
                             v-model="commandPriorityInfo.title"
                             type="text"
                             :class="{'input': true, 'is-danger': errors.has('commandPriorityTitle') }" />
                      <span v-show="errors.has('commandPriorityTitle')"
                            class="help has-text-danger">Title is Required</span>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <div class="field">
                    <label class="label">
                      Description
                    </label>
                    <div class="control">
                      <textarea class="textarea"
                                v-model="commandPriorityInfo.description"
                                type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="saveCommandPriority('commandPriorityTitle','tasksPriority',commandPriorityInfo)">
            Save
          </button>
          <button class="button"
                  @click="close()">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { PlanCommandPriorityRead } from '@/plan/graphql/PlanCommandPriorities.gql'
import PlanCommandPriority from '@/plan/model/planCommandPriority'
import helpers from '@/shared/mixins/helpers'
import processVal from '@/shared/mixins/processVal'
export default {
  name: 'PlanManageCommandPriority',
  apollo: {
    planCommandPriority: {
      query: PlanCommandPriorityRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      skip() {
        return !this.id
      },
      update(data) {
        if (data && data.planCommandPriority && this.id) {
          this.commandPriorityInfo = JSON.parse(
            JSON.stringify(data.planCommandPriority),
            this.omitTypename
          )
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  props: {
    id: {},
    open: {
      default: false
    },
    isClosed: {
      default: true
    }
  },
  mixins: [helpers, processVal],
  data() {
    return {
      commandPriorityInfo: new PlanCommandPriority()
    }
  },
  watch: {
    open() {
      if (!this.open) {
        this.commandPriorityInfo = new PlanCommandPriority()
      }
    },
    isClosed() {
      if (this.isClosed) {
        this.errors.clear()
        this.$validator.reset()
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    saveCommandPriority(validateInput, name, value) {
      this.saveModal(validateInput, name, value)
    }
  }
}
</script>
