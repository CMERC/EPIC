<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-one-third">
        <div class="card">
          <div class="card-content">
            <div v-if="showConfirm">
              <h1 class="title is-size-4 has-text-centered">
                Password Reset Email Sent
              </h1>
              <p class="content is-size-6 has-text-centered">A link to reset you password has been sent to your email.</p>
              <p>This may take a few minutes before it will be delivered to your inbox.</p>
              <br>
              <router-link class="button is-orange is-fullwidth"
                           to="/login">
                Go To Login
              </router-link>
            </div>
            <div v-else>
              <h1 class="title is-size-4 has-text-centered">
                Forgot Your Password?
              </h1>
              <p class="content is-size-6 has-text-centered">Input your registered email to reset your password</p>
              <div class="field">
                <label class="label">
                  Email
                </label>
                <p class="control has-icons-left">
                  <input class="input"
                         type="email"
                         name="email"
                         v-model="email"
                         v-validate="'required|email'"
                         :class="{'input': true, 'is-danger': errors.has('email') }"
                         placeholder="Email">
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </p>
                <span v-show="errors.has('email')"
                      class="help has-text-danger">{{errors.first('email') }}</span>
              </div>

              <a class="button is-orange is-fullwidth"
                 @click="validateBeforeSubmit">
                Send Reset Link
              </a>
            </div>
          </div>
        </div>
        <p class="content has-text-centered is-size-7">EPIC Ready © {{currentYear()}}</p>
      </div>
    </div>
  </section>

</template>

<script>
import helpers from '@/shared/mixins/helpers'
import { serverError } from '../serverError'
import { TriggerPasswordReset } from '../graphql/Auth.gql'

export default {
  name: 'ForgotView',
  mixins: [helpers],
  data() {
    return {
      email: '',
      showConfirm: false
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.forgot()
          return
        }
        this.$buefy.toast.open({
          message: 'Correct errors!',
          type: 'is-danger'
        })
      })
    },
    forgot() {
      this.$apollo
        .mutate({
          mutation: TriggerPasswordReset,
          variables: {
            email: this.email.toLowerCase()
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Password reset request sent to email.',
            type: 'is-success'
          })
          this.showConfirm = true
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error(error)
          this.showConfirm = false
        })
    }
  }
}
</script>
