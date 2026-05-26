<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left"></div>
      <div class="level-right">
        <help-content reference="settings.general"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div class="columns is-centered">
      <div class="column">
        <div class="card"
             v-if="user">
          <div class="card-content">
            <div class="columns">
              <div class="column">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-96x96">
                      <template v-if="user.name">
                        <avatar-letter :name='user.name'
                                       size='96'
                                       :rounded='true' />
                      </template>
                      <template v-else>
                        <span class="icon is-large">
                          <i class="fas fa-user-circle has-text-grey fa-2x"></i>
                        </span>
                      </template>
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-6">{{user.name}}</p>
                    <p class="subtitle is-7">{{user.email}}</p>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label">
                      Name
                    </label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <input class="input"
                               type="name"
                               v-model="name">
                      </p>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label">
                      Email
                    </label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <span class="tooltip"
                              data-tooltip="Contact support@epicready.com">
                          <input class="input"
                                 type="name"
                                 v-model="user.email"
                                 disabled>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label">
                      Password
                    </label>
                  </div>
                  <div class="field-body">
                    <div class="field is-grouped">
                      <p class="control">
                        <router-link class="button is-primary is-inverted"
                                     to="/reset">
                          Change Password
                        </router-link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer class="modal-card-foot">
            <a class="button is-primary"
               @click="updateUser()">
              Save
            </a>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HelpContent from '@/shared/components/helpcontent'
import AvatarLetter from '@/shared/components/avatar-letter'
import { serverError } from '@/shared/serverError'
import { UpdateCurrentUser } from '@/shared/graphql/Auth.gql'
import { LocalGetSelf } from '@/state/graphql/user.gql'

export default {
  name: 'UserSettings',
  props: ['id'],
  components: {
    AvatarLetter,
    HelpContent
  },
  data() {
    return {
      checks: {},
      name: ''
    }
  },
  apollo: {
    user: {
      query: LocalGetSelf,
      update(data) {
        if (data && data.user) {
          this.name = data.user.name
          return data.user
        }
      }
    }
  },
  methods: {
    updateUser() {
      this.$apollo
        .mutate({
          mutation: UpdateCurrentUser,
          variables: {
            data: {
              name: this.name
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
  }
}
</script>
<style lang="scss" scoped>
.modal-card-foot {
  justify-content: flex-end;
}
</style>
