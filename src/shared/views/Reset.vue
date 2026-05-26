<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-one-third">
        <div class="card">
          <div class="card-content">
            <h1 class="title is-size-4 has-text-centered">
              Reset Password
            </h1>
            <div class="field">
              <label class="label">
                Password
              </label>
              <div class="control">
                <input class="input"
                       name="password"
                       ref="pw_confirm"
                       v-model="password"
                       v-validate="'required'"
                       :class="{'input': true, 'is-danger': errors.has('password') }"
                       type="password" />
                <span v-show="errors.has('password')"
                      class="help has-text-danger">{{errors.first('password') }}</span>
              </div>
            </div>
            <div class="field">
              <label class="label">
                Repeat Password
              </label>
              <div class="control">
                <input class="input"
                       name="password_repeat"
                       v-validate="'required|confirmed:pw_confirm|min:5'"
                       v-model="confirmation"
                       :class="{'input': true, 'is-danger': errors.has('password_repeat') }"
                       type="password"
                       @keyup.enter="validateBeforeSubmit"
                       data-vv-as="password" />
                <span v-show="errors.has('password_repeat')"
                      class="help has-text-danger">{{errors.first('password_repeat') }}</span>
              </div>
            </div>
            <a class="button is-orange is-fullwidth"
               @click="validateBeforeSubmit">
              Reset Password
            </a>
          </div>
        </div>
        <p class="subtitle has-text-centered is-size-7">EPIC Ready © {{currentYear()}}</p>
      </div>
    </div>
  </section>

</template>

<script>
import helpers from '@/shared/mixins/helpers'
import { serverError } from '../serverError'
import { PasswordReset } from '../graphql/Auth.gql'

export default {
  name: 'ForgotView',
  mixins: [helpers],
  props: ['email', 'resetToken'],
  data() {
    return {
      password: '',
      confirmation: ''
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.reset()
          return
        }
        this.$buefy.toast.open({
          message: 'Correct errors!',
          type: 'is-danger'
        })
      })
    },
    reset() {
      this.$apollo
        .mutate({
          mutation: PasswordReset,
          variables: {
            resetToken: this.resetToken,
            email: this.email.toLowerCase(),
            password: this.password
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Password Successfully Changed!',
            type: 'is-success'
          })
          setTimeout(() => {
            this.$router.replace('/login')
          }, 1300)
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: serverError(error.message),
            type: 'is-danger'
          })
          console.error(error)
        })
    }
  }
}
</script>
