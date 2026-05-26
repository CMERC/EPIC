<template>
  <div>
    <epic-modal :open="open"
                @close="close"
                :shouldOverflow="true">
      <template slot="modal-title">
        COBRA Connection
      </template>
      <template slot="modal-body">
        <div class="content is-relative">
          <template v-if="showCobraConnection || authorizationError">
            <div class="field">
              <label class="label">
                Username
              </label>
              <div class="control">
                <input v-focus
                       class="input"
                       name="username"
                       v-model="cobraUser.username"
                       type="input"
                       placeholder="Username"
                       v-validate="'required'" 
                       :class="{ input: true, 'is-danger': errors.has('username') }" />
                <span v-show="errors.has('username') && fields.username.touched" 
                      class="help has-text-danger">{{ errors.first('username') }}</span>
              </div>
            </div>
            <div class="field">
              <label class="label">
                Password
              </label>
              <div class="control">
                <input class="input"
                       name="password"
                       v-model="cobraUser.password"
                       type="password"
                       placeholder="Password"
                       v-validate="'required'" 
                       :class="{ input: true, 'is-danger': errors.has('password') }" />
                <span v-show="errors.has('password')" 
                      class="help has-text-danger">{{ errors.first('password') }}</span>
              </div>
            </div>
            <span v-show="authorizationError"
                  class="help has-text-danger">
              {{authorizationErrorMessage}}</span>
          </template>
          <template v-if="!authorizationError && !showCobraConnection">
            <loading-state :isLoading='isLoading'
                           :isFullPage='false' />
            <div class="columns is-multiline">
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Inject
                  </label>
                  <input v-focus
                         class="input"
                         name="injectTitle"
                         v-model="inject.title"
                         type="text"
                         placeholder="Epic Ready Inject" />
                </div>
              </div>
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Cobra Incident Name
                  </label>
                  <div class="control">
                    <input v-focus
                           class="input"
                           name="cobraIncidentName"
                           v-model="cobraIncidentName"
                           type="text"
                           placeholder="Name of Incident from Cobra" />
                  </div>
                </div>
              </div>
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Organization Name
                  </label>
                  <div class="control">
                    <input v-focus
                           class="input"
                           name="OrganizationName"
                           v-model="organizationName"
                           type="text"
                           placeholder="Org Name from Cobra" />
                  </div>
                </div>
              </div>
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Status
                  </label>
                  <div class="control">
                    <multiselect v-model="selectedStatus"
                                 track-by="id"
                                 label="label"
                                 placeholder="Select Status"
                                 :options="statusLevels">
                    </multiselect>
                  </div>
                </div>
              </div>
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Priority
                  </label>
                  <div class="control">
                    <multiselect v-model="selectedPriority"
                                 track-by="id"
                                 label="label"
                                 placeholder="Select Priority"
                                 :options="priorityLevels">
                    </multiselect>
                  </div>
                </div>
              </div>
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Request Type
                  </label>
                  <div class="control">
                    <multiselect v-model="selectedRequestType"
                                 track-by="id"
                                 label="label"
                                 placeholder="Select Request Type"
                                 :options="requestTypes">
                    </multiselect>
                  </div>
                </div>
              </div>
            </div>
            <span v-show="resourceRequestError"
                  class="help has-text-danger">
              {{resourceRequestErrorMessage}}</span>
          </template>
        </div>
      </template>
      <template slot="modal-footer-buttons">
        <p class="control"
           v-if="!showCobraConnection">
          <button class="button is-primary"
                  @click="pushCobraResourceRequest">Submit</button>
        </p>
        <p class="control"
           v-if="showCobraConnection">
          <button class="button is-primary is-outlined"
                  @click="setCredentials">Save Credentials</button>
        </p>
        <p class="control">
          <button class="button is-danger is-outlined"
                  @click="resetCredentials(true)">Reset Credentials</button>
        </p>
      </template>
    </epic-modal>
  </div>
</template>

<script>
import { GetCobraAuthorization, PushInjectToCobraRequestManager } from '@/plan/graphql/Cobra.gql'
export default {
  name: 'cobra-connect',
  props: {
    inject: {
      type: Object,
      default: null
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cobraUser: { username: null, password: null },
      cobraSessionStorage: JSON.parse(sessionStorage.getItem('cobraUser')),
      cobraTokenSessionStorage: sessionStorage.getItem('cobraToken'),
      showCobraConnection: false,
      authResponse: null,
      authorizationError: false,
      authorizationErrorMessage: null,
      resourceRequestError: false, 
      resourceRequestErrorMessage: null,
      isLoading: true,
      cobraIncidentName: null,
      organizationName: null,
      selectedStatus: null,
      statusLevels: [
        { id: 0, value: 0, label: 'Unknown' },
        { id: 1, value: 1, label: 'Minor' },
        { id: 2, value: 2, label: 'Moderate' },
        { id: 3, value: 3, label: 'Severe' },
        { id: 4, value: 4, label: 'Extreme' }
      ], 
      selectedPriority: null,
      priorityLevels: [
        { id: 0, value: 0, label: 'Initiated' },
        { id: 1, value: 1, label: 'In Review' },
        { id: 2, value: 2, label: 'Approved' },
        { id: 3, value: 3, label: 'Ordered' },
        { id: 4, value: 4, label: 'In Transit' },
        { id: 5, value: 5, label: 'Delivered' },
        { id: 6, value: 6, label: 'Denied / Not Available' }
      ],
      selectedRequestType: null,
      requestTypes: [
        { id: 0, value: 0, label: 'Resource' },
        { id: 1, value: 1, label: 'Info' },
        { id: 2, value: 2, label: 'Assistance' },
        { id: 3, value: 3, label: 'Task' },
        { id: 4, value: 4, label: 'Mission' }
      ]
    }
  },
  updated() {
    this.shouldShowCobraConnection()
  },
  mounted() {
    this.shouldShowCobraConnection()
  },
  methods: {
    close() {
      this.$emit('close')
      this.resetForm()
    },
    shouldShowCobraConnection() {
      let cobraUser = sessionStorage.getItem('cobraUser')
      if (!cobraUser || this.authorizationError) {
        this.showCobraConnection = true
      } else {
        this.showCobraConnection = false
        this.isLoading = false
      }
    },
    async getAuth() {
      if (
        this.showCobraConnection == false &&
        sessionStorage.getItem('cobraUser')
      ) {
          this.$apollo
            .query({
              query: GetCobraAuthorization,
              variables: {
                username: this.cobraUser.username,
                password: this.cobraUser.password
              }
            })
            .then(response => {
              if (response && response.data && response.data.getCobraAuthorization && response.data.getCobraAuthorization.access_token != null) {
                this.authorizationError = false
                this.authResponse = response.data.getCobraAuthorization
                sessionStorage.setItem('cobraToken', response.data.getCobraAuthorization.access_token)
                this.cobraTokenSessionStorage = response.data.getCobraAuthorization.access_token
                this.handleInformUser('Credentials Saved...', 'is-success', 2000)
              } else if(response.data.getCobraAuthorization.error != null) {
                this.authorizationError = true
                this.authorizationErrorMessage = response.data.getCobraAuthorization.error.error_description
                this.handleInformUser(response.data.getCobraAuthorization.error.error_description, 'is-danger', 3000)
              }
              this.isLoading = false
            })
            .catch(error => {
              console.error('error: ' + error)
            })

      }
    },
    pushCobraResourceRequest(){
      this.$apollo
            .mutate({
              mutation: PushInjectToCobraRequestManager,
              variables: {
              data: {
                token: this.cobraTokenSessionStorage,
                incidentName: this.cobraIncidentName,
                details: this.inject.response,
                title: this.inject.title,
                requestType: this.selectedRequestType.value,
                organization: this.organizationName,
                status: this.selectedStatus.value,
                priority: this.selectedPriority.value
                }
              }
            })
            .then(response => {
              if (response && response.data && response.data.pushInjectToCobraRequestManager.status != null) {
                this.resourceRequestError = false
                switch(response.data.pushInjectToCobraRequestManager.status) {
                  case 200:
                    this.handleInformUser('Sending to Cobra', 'is-success', 2000)
                    this.close()
                    break
                  case 400: 
                    this.handleInformUser('Bad Request', 'is-danger', 3000)
                    break
                  case 404:
                    this.handleInformUser('Status 404', 'is-warning', 3000)
                    break
                }
              } else if (response.data.pushInjectToCobraRequestManager.error != null) {
                this.handleInformUser(response.data.pushInjectToCobraRequestManager.error.Message, 'is-danger', 3000)
                this.resourceRequestError = true
                this.resourceRequestErrorMessage = response.data.pushInjectToCobraRequestManager.error.Message
              }
            })
            .catch(error => {
              console.error('error: ' + error)
            })
    },
    setCredentials() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (
            this.cobraUser &&
            this.cobraUser.username != null &&
            this.cobraUser.password != null
            ) {
              sessionStorage.setItem('cobraUser', JSON.stringify(this.cobraUser))
              this.cobraSessionStorage = sessionStorage.getItem('cobraUser')
              this.cobraTokenSessionStorage = sessionStorage.getItem('cobraToken')
              this.shouldShowCobraConnection()
              this.getAuth()
              }
              return
            }
        })
    },
    resetCredentials(resetForm) {
      sessionStorage.removeItem('cobraUser')
      sessionStorage.removeItem('cobraToken')
      this.showCobraConnection = true
      if (resetForm) {
        this.authorizationError = false
        this.authorizationErrorMessage = null
        this.resetForm()
      }
    },
    resetForm() {
      this.cobraUser.username = null
      this.cobraUser.password = null
      this.authResponse = null
      this.cobraSessionStorage = null
      this.cobraIncidentGUID = null
      this.selectedPriority = null
      this.selectedRequestType = null
      this.selectedStatus = null
      this.errors.clear()
      this.$validator.reset()
    },
    handleInformUser(message, type, length) {
      this.$buefy.toast.open({
        message: message,
        type: type,
        duration: length
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
