<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active':open}">
      <div class="modal-background"></div>
      <div class="modal-card funding-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">Funding Source</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <form data-vv-scope="fundingModal"
                v-on:submit.prevent>
            <div class="columns is-multiline is-mobile">
              <div class="column is-full">
                <div class="columns">
                  <div class="column is-one-third">
                    <div class="field">
                      <label class="label">
                        Source
                      </label>
                      <div class="control">
                        <b-autocomplete :name="'primarySource'"
                                        v-validate="'required'"
                                        v-model="fundingInfo.primarySource"
                                        field="title"
                                        :data="filteredPrimarySource(fundingInfo.primarySource)"
                                        open-on-focus
                                        placeholder="Primary Source"
                                        :class="{'is-danger': errors.has('fundingModal.primarySource') }">
                        </b-autocomplete>
                        <span v-show="errors.has('fundingModal.primarySource')"
                              class="help has-text-danger">Primary Source Required</span>
                      </div>
                    </div>
                  </div>
                  <div class="column is-one-third">
                    <div class="field">
                      <label class="label">
                        Sub-source
                      </label>
                      <div class="control">
                        <b-autocomplete v-model="fundingInfo.subSource"
                                        field="title"
                                        :data="filteredSubsource(fundingInfo.subSource)"
                                        open-on-focus
                                        placeholder="Sub-source">
                        </b-autocomplete>
                      </div>
                    </div>
                  </div>
                  <div class="column is-one-third">
                    <div class="field">
                      <label class="label">
                        Amount
                      </label>
                      <div class="control has-icons-left">
                        <input class="input"
                               v-validate="'decimal:2'"
                               :name="'fundingAmount'"
                               v-model="fundingInfo.amount"
                               type="text"
                               placeholder="1000"
                               :class="{'input': true, 'is-danger': errors.has('fundingModal.fundingAmount') }" />
                        <span class="icon is-small is-left">
                          <i class="fas fa-dollar-sign"></i>
                        </span>
                        <span v-show="errors.has('fundingModal.fundingAmount')"
                              class="help has-text-danger">Whole Numeric Values Only</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="saveFundingSource('fundingModal.*','fundings',fundingInfo)">
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
import { PlanFundingSourceRead } from '@/plan/graphql/PlanFundingSources.gql'
import { participantValues } from '@/plan/model/participantValues.js'
import PlanFunding from '@/plan/model/planFunding'
import helpers from '@/shared/mixins/helpers'
import processVal from '@/shared/mixins/processVal'
export default {
  name: 'PlanManageFundingSources',
  apollo: {
    planFunding: {
      query: PlanFundingSourceRead,
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
        if (data && data.planFundingSource && this.id) {
          this.fundingInfo = JSON.parse(
            JSON.stringify(data.planFundingSource),
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
      default: false
    },
    fundingSource: {
      type: Object,
      default: function() {
        return new PlanFunding()
      }
    }
  },
  mixins: [helpers, processVal],
  data() {
    return {
      fundingInfo: new PlanFunding(),
      participantDefaultLists: participantValues
    }
  },
  watch: {
    open() {
      if (!this.open) {
        this.fundingInfo = new PlanFunding()
      }
    }
  },
  methods: {
    filteredPrimarySource(value) {
      value = value || ''
      return this.participantDefaultLists.primarySourceValues.filter(option => {
        return (
          option.title
            .toString()
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
        )
      })
    },
    filteredSubsource(value) {
      value = value || ''
      return this.participantDefaultLists.subSourceValues.filter(option => {
        return (
          option.title
            .toString()
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
        )
      })
    },
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    saveFundingSource(validateInput, name, value) {
      this.saveModal(validateInput, name, value)
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-card,
.modal-card-body {
  overflow: visible !important;
}
</style>
