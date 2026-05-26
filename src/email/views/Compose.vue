<template>
  <div class="container is-fluid">
    <div class="modal is-active">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Compose Email</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <div class="modal-card-body">
          <div class="field">
            <label class="label">
              From:
            </label>
            <div class="control">
              <input name="email from"
                     v-model="email.from"
                     v-validate="'required|email|min:2'"
                     :class="{'input': true, 'is-danger': errors.has('email from') }"
                     type="text"
                     placeholder="Email Address"
                     readonly>
              <span v-show="errors.has('email from')"
                    class="help is-danger">{{errors.first('email from') }}</span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              To:
            </label>
            <div class="control">
              <input name="email to"
                     v-model="email.to"
                     v-validate="'required|email|min:2'"
                     :class="{'input': true, 'is-danger': errors.has('email to') }"
                     type="text"
                     placeholder="Email Address">
              <span v-show="errors.has('email to')"
                    class="help is-danger">{{errors.first('email to') }}</span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Subject:
            </label>
            <div class="control">
              <input name="subject"
                     v-model="email.subject"
                     v-validate="'required|min:2'"
                     :class="{'input': true, 'is-danger': errors.has('subject') }"
                     type="text"
                     placeholder="Subject">
              <span v-show="errors.has('subject')"
                    class="help is-danger">{{errors.first('subject') }}</span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Message:
            </label>
            <div class="control">
              <textarea name="body"
                        v-model="email.content"
                        v-validate="'required|min:2'"
                        :class="{'textarea': true, 'is-danger': errors.has('body') }"
                        type="text"
                        placeholder="Message" />
              <span v-show="errors.has('body')"
                    class="help is-danger">{{errors.first('body') }}</span>
            </div>
          </div>
        </div>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="validateBeforeSubmit()"
                  :disabled="disableActionButton">
            Send
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
import { EmailMessageCompose } from '../graphql/EmailMessage.gql'

export default {
  name: 'email-compose',
  data() {
    return {
      email: {
        from: this.$store.state.currentUser.email,
        to: '',
        subject: '',
        content: ''
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.errors.clear()
      this.$validator.reset()
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.composeMessage()
          return
        }
      })
    },
    composeMessage() {
      this.$apollo.mutate({
        mutation: EmailMessageCompose,
        variables: {
          data: {
            ...this.email
          }
        }
      })

      this.close()
    }
  },
  computed: {
    disableActionButton() {
      return (this.errors && this.errors.items && this.errors.items.length > 0)
    }
  }
}
</script>
