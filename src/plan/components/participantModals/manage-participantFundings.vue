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
          <form data-vv-scope="participantFundingModal" 
                v-on:submit.prevent>
            <div class="columns is-multiline is-mobile">
              <div class="column is-two-thirds">
                <label class="label">
                  Available Fundings
                </label>
                <multiselect v-model="fundingName" 
                             openDirection="below" 
                             placeholder="Select Funding" 
                             :options="planFundingSources" 
                             :searchable="true" 
                             name="fundingName" 
                             v-validate="'required'" 
                             :class="{'input': errors.has('participantFundingModal.fundingName'), 'is-danger': errors.has('participantFundingModal.fundingName') }" 
                             :internal-search="false" 
                             @search-change="(value) => {searchQuery = value}">
                  <template slot="singleLabel" 
                            slot-scope="props">{{ props.option.primarySource }}-{{ props.option.subSource }}</template>
                  <template slot="option" 
                            slot-scope="{ option }">{{ option.primarySource }}-{{ option.subSource }}</template>
                </multiselect>
                <span v-show="errors.has('participantFundingModal.fundingName') && fields.fundingName.touched" 
                      class="help has-text-danger">Funding Name Required</span>
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
                           v-model="fundingAmount" 
                           type="text" 
                           placeholder="1000" 
                           :class="{'input': true, 'is-danger': errors.has('participantFundingModal.fundingAmount') }" />
                    <span class="icon is-small is-left">
                      <i class="fas fa-dollar-sign"></i>
                    </span>
                    <span v-show="errors.has('participantFundingModal.fundingAmount')" 
                          class="help has-text-danger">Whole Numeric Values Only</span>                      </div>
                  <span v-show="fundingError" 
                        class="help has-text-danger">Participant funding cannot exceed exercise funding</span>
                </div>
              </div>
            </div>          
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" 
                  @click="validateBeforeSave(fundingName, fundingAmount)">Save</button>
          <button class="button" 
                  @click="close()">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import {
  PlanParticipantFundingSourceRead,
  PlanParticipantFundingSourcesRead,
  PlanParticipantFundingSourceSubscription
} from '@/plan/graphql/PlanParticipantFundingSources.gql'
import {
  PlanFundingSourcesRead,
  PlanFundingSourceSubscription
} from '@/plan/graphql/PlanFundingSources.gql'
import { PlanParticipantsUpdate } from '@/plan/graphql/PlanParticipants.gql'
import { serverError } from '@/shared/serverError'
import helpers from '@/shared/mixins/helpers'
export default {
  name: 'PlanManageParticipantFundingSources',
  props: {
    id: {
      type: String,
      default: ''
    },
    participantId: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  mixins: [helpers],
  apollo: {
    planFundingSources: {
      query: PlanFundingSourcesRead,
      variables() {
        return {
          where: {
            OR: [
              { primarySource_contains: this.searchQuery },
              { subSource_contains: this.searchQuery }
            ]
          }
        }
      },
      update(data) {
        if (data && data.planFundingSources) {
          return data.planFundingSources
        }
      },
      error(error) {
        console.error(error)
      },
      skip() {
        return !this.open
      },
      subscribeToMore: {
        document: PlanFundingSourceSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.planFundingSource.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planFundingSources: [
                  subscriptionData.data.planFundingSource.node,
                  ...previousResult.planFundingSources
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planFundingSources: [
                  ...previousResult.planFundingSources.filter(
                    obj =>
                      subscriptionData.data.planFundingSource.previousValues
                        .id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanFundingSources = JSON.parse(
                JSON.stringify(previousResult.planFundingSources)
              )
              let index = newPlanFundingSources.findIndex(
                x => x.id === subscriptionData.data.planFundingSource.node.id
              )
              newPlanFundingSources[index] =
                subscriptionData.data.planFundingSource.node
              newResult = {
                planFundingSources: newPlanFundingSources
              }
              break
            }
            default: {
              throw new Error(`Unknown mutation`)
            }
          }
          return newResult
        }
      }
    },
    planParticipantFundingSource: {
      query: PlanParticipantFundingSourceRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      update(data) {
        if (data && data.planParticipantFundingSource && this.id) {
          this.fundingName = JSON.parse(
            JSON.stringify(data.planParticipantFundingSource),
            this.omitTypename
          )
          this.fundingAmount = JSON.parse(
            JSON.stringify(data.planParticipantFundingSource.amount),
            this.omitTypename
          )
          return data.planParticipantFundingSource
        }
      },
      error(error) {
        console.error(error)
      },
      skip() {
        return !this.id
      }
    },
    planParticipantFundingSources: {
      query: PlanParticipantFundingSourcesRead,
      update(data) {
        if (
          data &&
          data.planParticipantFundingSources &&
          data.planParticipantFundingSources.length > 0
        ) {
          return data.planParticipantFundingSources
        }
      },
      error(error) {
        console.error(error)
      },
      skip() {
        return !this.fundingAmount
      },
      subscribeToMore: {
        document: PlanParticipantFundingSourceSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn =
            subscriptionData.data.planParticipantFundingSource.mutation
          let newResult
          switch (mutationIn) {
            case 'CREATED': {
              newResult = {
                planParticipantFundingSources: [
                  subscriptionData.data.planParticipantFundingSource.node,
                  ...previousResult.planParticipantFundingSources
                ]
              }
              break
            }
            case 'DELETED': {
              newResult = {
                planParticipantFundingSources: [
                  ...previousResult.planParticipantFundingSources.filter(
                    obj =>
                      subscriptionData.data.planParticipantFundingSource
                        .previousValues.id !== obj.id
                  )
                ]
              }
              break
            }
            case 'UPDATED': {
              let newPlanParticipantFundingSources = JSON.parse(
                JSON.stringify(previousResult.planParticipantFundingSources)
              )
              let index = newPlanParticipantFundingSources.findIndex(
                x =>
                  x.id ===
                  subscriptionData.data.planParticipantFundingSource.node.id
              )
              newPlanParticipantFundingSources[index] =
                subscriptionData.data.planParticipantFundingSource.node
              newResult = {
                planParticipantFundingSources: newPlanParticipantFundingSources
              }
              break
            }
            default: {
              throw new Error(`Unknown mutation`)
            }
          }
          return newResult
        }
      }
    }
  },
  data() {
    return {
      searchQuery: '',
      fundingError: false,
      planFundingSources: [],
      fundingName: null,
      fundingAmount: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.fundingName = null
      this.fundingAmount = null
      this.fundingError = false
      this.errors.clear()
      this.$validator.reset()
    },
    async validateBeforeSave(fundingName, fundingAmount) {
      let fundings = fundingAmount ? parseFloat(fundingAmount) : 0

      this.$validator.validateAll().then(result => {
        if (
          result &&
          fundings + this.participantFundingAllocated <=
            this.availableFundingTotal
        ) {
          this.fundingError = false
          this.saveParticipantFundingSource(fundingName, fundingAmount)
          this.close()
          return true
        } else {
          this.fundingError = true
          return false
        }
      })
    },
    saveParticipantFundingSource(fundingName, fundingAmount) {
      let dataVariable, fundingObj

      if (!fundingAmount) {
        fundingAmount = null
      }
      fundingObj = {
        primarySource: fundingName.primarySource,
        subSource: fundingName.subSource,
        amount: parseFloat(fundingAmount)
      }
      if (!this.id) {
        dataVariable = {
          fundings: { create: fundingObj }
        }
      } else {
        dataVariable = {
          fundings: {
            update: {
              data: fundingObj,
              where: { id: this.id }
            }
          }
        }
      }

      this.$apollo
        .mutate({
          mutation: PlanParticipantsUpdate,
          variables: {
            data: dataVariable,
            where: {
              id: this.participantId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
        })
    }
  },
  computed: {
    participantFundingAllocated() {
      let sum = 0
      if (
        this.planParticipantFundingSources &&
        this.planParticipantFundingSources.length > 0
      ) {
        sum = this.planParticipantFundingSources.reduce(
          (accumulator, currentTotal) => {
            return accumulator + currentTotal.amount
          },
          0
        )
        if (this.planParticipantFundingSource != null) {
          sum = sum - this.planParticipantFundingSource.amount
        }
      }
      return sum
    },
    availableFundingTotal() {
      let sum = 0
      if (this.planFundingSources && this.planFundingSources.length > 0) {
        sum = this.planFundingSources.reduce((accumulator, currentTotal) => {
          return accumulator + currentTotal.amount
        }, 0)
      }
      return sum
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
