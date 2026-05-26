export default {
  methods: {
    setUsername(username) {
      localStorage.setItem('username', username)
    },
    getUsername() {
      if (localStorage.getItem('username')) {
        return localStorage.getItem('username').toLowerCase()
      }
    },
    removeUsername() {
      localStorage.removeItem('username')
    }
  }
}
