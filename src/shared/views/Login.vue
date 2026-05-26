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
                <p class="subtitle is-6 is-spaced has-text-centered">Login to your account</p>
              </div>
              <div class="column is-12">
                <div class="field">
                  <label class="label">
                    Email
                  </label>
                  <div class="control">
                    <input v-focus
                           class="input"
                           name="email"
                           v-model="email"
                           v-validate="'required|email'"
                           :class="{'input': true, 'is-danger': errors.has('email') }"
                           type="email"
                           placeholder="Email" />
                    <span v-show="errors.has('email') && fields.email.touched"
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
                           v-model="password"
                           v-validate="'required'"
                           :class="{'input': true, 'is-danger': errors.has('password') }"
                           @keyup.enter="validateBeforeSubmit"
                           type="password"
                           placeholder="Password" />
                    <span v-show="errors.has('password')"
                          class="help has-text-danger">{{errors.first('password') }}</span>
                  </div>
                </div>

                <div class="columns is-centered">
                  <div class="column has-text-centered">
                    <label class="checkbox">
                      <input type="checkbox"
                             v-model="rememberMe"> Remember me
                    </label>
                  </div>
                  <div class="column has-text-centered">
                    <router-link :to="{name: 'forgot'}"
                                 class="has-text-primary">
                      Forgot Password?
                    </router-link>
                  </div>
                </div>

              </div>
              <br />
              <a class="button is-orange is-fullwidth"
                 @click="validateBeforeSubmit"
                 id="login">
                Login
              </a>
            </div>
          </div>

        </div>
        <p class="subtitle has-text-centered is-size-7 is-spaced has-text-primary">
          <a href="https://www.epicready.com">About EPIC Ready</a> | EPIC Ready © {{currentYear()}} | v{{version}}</p>
      </div>
    </div>
  </section>
</template>

<script>
import packageInfo from '@/../package.json'
import helpers from '@/shared/mixins/helpers'
import auth from '../mixins/auth'
import { Login } from '../graphql/Auth.gql'
import { serverError } from '../serverError'

import { onLogin } from '@/vue-apollo'

export default {
  name: 'login-view',
  mixins: [helpers, auth],
  data() {
    return {
      wantedRoute: this.$route.params.wantedRoute,
      version: packageInfo.version,
      email: this.getUsername(),
      password: '',
      rememberMe: this.getUsername() != null
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.login()
          return
        }
        this.$buefy.toast.open({
          message: 'Correct errors!',
          type: 'is-danger'
        })
      })
    },
    login() {
      this.$apollo
        .mutate({
          mutation: Login,
          variables: {
            email: this.email.toLowerCase(),
            password: this.password
          }
        })
        .then(data => {
          if (data && data.data.login) {
            if (this.$apollo.provider.defaultClient && data.data.login.token)
              onLogin(
                this.$apollo.provider.defaultClient,
                data.data.login.token
              )
                .then(response => {
                  if (response) {
                    if (this.rememberMe) {
                      this.setUsername(this.email)
                    } else {
                      this.removeUsername()
                    }
                    this.$buefy.toast.open({
                      message: 'Login Successful',
                      type: 'is-success'
                    })
                    this.email = ''
                    this.password = ''
                    this.$router.replace({ path: this.wantedRoute || '/' })
                  }
                })
                .catch(error => {
                  this.$buefy.toast.open({
                    message: 'There was an error',
                    type: 'is-danger'
                  })
                  console.error('On Login: ' + error)
                })
          }
        })
        .catch(error => {
          let message = serverError(error.message)

          if (JSON.stringify(error).includes('No user found')) {
            message = 'Invalid username or password.'
          }

          this.$buefy.toast.open({
            message: message,
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
