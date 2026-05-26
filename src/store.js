// Global store per tab/workspace being edited
/* STORE */
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)
// Plugin to use sessionStorage
const vuexLocal = new VuexPersist({
  storage: window.sessionStorage
})

export const store = new Vuex.Store({
  state: {
    activeWorkspace: { name: '', displayName: '' },
    showNoWorkspace: false,
    userRole: '',
    currentUser: null
  },
  mutations: {
    updateState(state) {
      // mutate state object
      this.replaceState(state)
    },
    setActiveWorkspace(state, value) {
      this.state.activeWorkspace = value
    },
    setUserRole(state, value) {
      this.state.userRole = value
    },
    setShowNoWorkspace(state, value) {
      this.state.showNoWorkspace = value
    },
    setCurrentUser(state, value) {
      this.state.currentUser = value
    },
    clearTimeZone() {
      this.state.activeWorkspace.timeZone = ''
    }
  },
  plugins: [vuexLocal.plugin]
})
