<template>
  <section data-cy="noWorkSpace">
    <b-modal :active.sync="isComponentModalActive"
             has-modal-card
             :canCancel="false">

      <div class="modal-card"
           style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Workspace access required</p>
        </header>
        <section class="modal-card-body">
          <h2 class="title">You have not yet been invited to a workspace. Please contact your administrator or email support@epicready.com for assistance
            <a @click="isComponentModalActive = false">
              .
            </a>
          </h2>

        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click.once="sendRequest">
            Request Access
          </button>
        </footer>
      </div>

    </b-modal>
  </section>
</template>

<script>
import { RequestAppWorkspace } from '@/shared/graphql/AppWorkspaces.gql'

export default {
  name: 'NoWorkspaceModal',
  props: ['email'],
  data() {
    return {
      isComponentModalActive: true
    }
  },
  methods: {
    sendRequest(event) {
      this.$apollo
        .mutate({
          mutation: RequestAppWorkspace
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'An access request has been sent.',
            type: 'is-success'
          })

          //Disable button
          event.target.disabled = true
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
        })
    }
  }
}
</script>
