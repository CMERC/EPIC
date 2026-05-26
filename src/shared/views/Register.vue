<template>
  <section class="section">
    <div class="columns is-mobile is-centered">
      <div class="column is-one-third-desktop is-12-mobile is-5-tablet">
        <div class="card">
          <div class="card-content">
            <div class="columns is-mobile is-centered is-multiline">
              <div class="column is-12">
                <figure class="image center-image">
                  <img src="@/shared/assets/epic_logo.svg"
                       class="logo" />
                </figure>
                <p class="subtitle is-6 is-spaced has-text-centered">Register your account</p>
              </div>
              <div class="column is-12">
                <div class="field">
                  <label class="label">
                    Name
                  </label>
                  <div class="control">
                    <input v-focus
                           class="input"
                           name="name"
                           v-model="name"
                           v-validate="'required'"
                           :class="{'input': true, 'is-danger': errors.has('name') }"
                           type="text" />
                    <span v-show="errors.has('name')"
                          class="help has-text-danger">{{errors.first('name') }}</span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">
                    Email
                  </label>
                  <div class="control">
                    <input class="input"
                           name="email"
                           v-model="email"
                           v-validate="'required|email'"
                           :class="{'input': true, 'is-danger': errors.has('email') }"
                           type="email" />
                    <span v-show="errors.has('email')"
                          class="help has-text-danger">{{errors.first('email') }}</span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">
                    Password
                  </label>
                  <div class="control">
                    <input class="input"
                           name="password"
                           ref="pw_confirm"
                           v-model="password"
                           v-validate="'required|min:5'"
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
              </div>
              <br />
              <a class="button is-orange is-fullwidth"
                 @click="validateBeforeSubmit">
                Register
              </a>
            </div>
          </div>

        </div>
        <p class="subtitle has-text-centered is-size-7 is-spaced">Already have an account?
          <router-link :to="{name:'login'}">Login</router-link>
        </p>
        <p class="subtitle has-text-centered is-size-7">
          <a href="https://www.epicready.com">About EPIC Ready</a> | EPIC Ready © {{currentYear()}}</p>
      </div>
    </div>
  </section>
</template>

<script>
import helpers from '@/shared/mixins/helpers'
import { serverError } from '../serverError'
import auth from '../mixins/auth'
import { Signup } from '../graphql/Auth.gql'

export default {
  name: 'RegisterView',
  mixins: [helpers, auth],
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmation: ''
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.register()
          return
        }
      })
    },
    register() {
      this.$apollo
        .mutate({
          mutation: Signup,
          variables: {
            data: {
              name: this.name,
              email: this.email.toLowerCase(),
              password: this.password
            }
          }
        })
        .then(data => {
          if (data) {
            this.$buefy.toast.open({
              message: 'User Registered!',
              type: 'is-success'
            })
            // Reset data
            this.name = ''
            this.email = ''
            this.password = ''
            this.repeatpassword = ''
            // Direct to login
            this.$router.replace('/')
          }
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

<style scoped>
.card {
  border-radius: 5px;
}
</style>
