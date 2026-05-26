export default {
  name: 'permission-checks',
  computed: {
    isSuper() {
      return (this.$store.state.currentUser.isSuper === true)
    },
    isSuperAdmin() {
      return (
        (this.$store.state.userRole === 'Super' ||
          this.$store.state.userRole === 'Admin') &&
        !this.$store.state.showNoWorkspace
      )
    },
    isSuperAdminEditor() {
      return (
        (this.$store.state.userRole === 'Super' ||
          this.$store.state.userRole === 'Admin' ||
          this.$store.state.userRole === 'Editor') &&
        !this.$store.state.showNoWorkspace
      )
    },
    isUserOrAbove() {
      return (
        this.$store.state.userRole === 'Super' ||
        this.$store.state.userRole === 'Admin' ||
        this.$store.state.userRole === 'Editor' ||
        this.$store.state.userRole === 'Author' ||
        this.$store.state.userRole === 'User'
      )
    },
    showNoWorkspaceDialog() {
      return (
        this.$store.state.showNoWorkspace &&
        (this.$store.state.userRole !== 'Admin' &&
          this.$store.state.userRole !== 'Super')
      )
    }
  }
}
