<template>
  <section class="section">
    <div class="columns is-mobile is-centered">
      <div class="column  is-one-third-desktop is-12-mobile is-5-tablet">
        <div class="card">
          <div class="card-content">
            <div class="columns is-mobile is-centered is-multiline">
              <div class="column is-12">
                <figure class="image center-image">
                  <img src="@/shared/assets/epic_logo.svg"
                       class="logo" />
                </figure>
              </div>
              <div class="column is-12">
                <div class="field">
                  <div v-if="confirmSuccess">
                    <h1 class="title is-size-4 has-text-centered">
                      Thanks, your email has been confirmed.
                    </h1>
                    <p class="content is-size-6 has-text-centered">You can now login into EPIC Ready with {{email}}<br> Please click the button below to go to the login page.</p>
                  </div>
                  <div v-else>
                    <h1 class="title is-size-4 has-text-centered">
                      Confirming email...
                    </h1>
                    <p class="content is-size-6 has-text-centered">Sorry we are not able to confirm your email or it has already been confirmed. Please request a new confirmation email or check that your link is correct.</p>
                  </div>
                </div>
                <router-link class="button is-orange is-fullwidth"
                             to="/login">
                  Go To Login
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <p class="content has-text-centered is-size-7">EPIC Ready © {{currentYear()}}</p>
        <p class="content has-text-centered is-size-7">{{emailConfirmToken}}</p>
      </div>
    </div>
  </section>
</template>

<script>
import helpers from '@/shared/mixins/helpers'

import { ConfirmEmail } from '../graphql/Auth.gql'

export default {
  name: 'confirm-email',
  mixins: [helpers],
  props: ['email', 'emailConfirmToken'],
  data() {
    return {
      confirmSuccess: true
    }
  },
  methods: {
    confirm() {
      this.$apollo
        .mutate({
          mutation: ConfirmEmail,
          variables: {
            email: this.email,
            emailConfirmToken: this.emailConfirmToken
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Email Confirmed!',
            type: 'is-success'
          })
          this.confirmSuccess = true
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error: ' + error,
            type: 'is-danger'
          })
          console.error(error)
          this.confirmSuccess = false
        })
    }
  },
  beforeMount() {
    this.confirm()
  }
}
</script>
