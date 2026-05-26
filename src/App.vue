<template>
  <div id="app"
       class="app"
       :class="{'theme-dark': theme.dark}">
    <ConnectionStatus />
    <router-view />
  </div>
</template>
<script>
import { CurrentUser } from '@/shared/graphql/Auth.gql'
import { isUnauthorizedError } from '@/vue-apollo'

import { LocalSetSelf } from '@/state/graphql/user.gql'

import ConnectionStatus from '@/ConnectionStatus.vue'
import { initTheme, themeState } from '@/shared/theme'

export default {
  name: 'DashboardView',
  components: {
    ConnectionStatus
  },
  apollo: {
    currentUser: {
      query: CurrentUser,
      update(data) {
        if (data && data.currentUser) {
          this.$store.commit('setCurrentUser', data.currentUser)

          this.$apollo
            .mutate({
              mutation: LocalSetSelf,
              variables: {
                user: data.currentUser
              }
            })
            .catch(error => {
              console.error(error.message)
            })

          if (data.currentUser.isSuper) {
            this.$store.commit('setUserRole', 'Super')
          } else {
            if (
              data.currentUser.role &&
              data.currentUser.role.roles &&
              data.currentUser.role.roles.length > 0
            ) {
              let roles = []
              for (let i = 0; i < data.currentUser.role.roles.length; i++) {
                roles.push(data.currentUser.role.roles[i].name)
              }
              // Assign highest order user role
              if (roles.includes('ADMIN'))
                this.$store.commit('setUserRole', 'Admin')
              else if (roles.includes('EDITOR'))
                this.$store.commit('setUserRole', 'Editor')
              else if (roles.includes('AUTHOR'))
                this.$store.commit('setUserRole', 'Author')
              else this.$store.commit('setUserRole', 'User')
            } else {
              this.$store.commit('setUserRole', 'Guest')
            }
          }
          return data.currentUser
        }
      },
      error(error) {
        // Looking for specific errors from me, fire off logout.
        if (!isUnauthorizedError(error)) {
          if (!this.$router.currentRoute.meta.skipAuth) {
            this.$router.replace({
              name: 'login'
            })
          }
          console.error(error.message)
        }
      }
    }
  },
  data() {
    return {
      currentUser: {},
      theme: themeState
    }
  },
  created() {
    initTheme()
  }
}
</script>
<style lang="scss">
@import './styles/main.scss';
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
