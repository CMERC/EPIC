export default {
  name: 'permission-checks',
  computed: {
    isSuper() {
      return Boolean(
        this.$store.state.currentUser &&
        this.$store.state.currentUser.isSuper === true
      )
    },
    isSuperAdmin() {
      return (
        (this.isSuper ||
          this.$store.state.userRole === 'Super' ||
          this.$store.state.userRole === 'Admin') &&
        !this.$store.state.showNoWorkspace
      )
    },
    isSuperAdminEditor() {
      return (
        (this.isSuper ||
          this.$store.state.userRole === 'Super' ||
          this.$store.state.userRole === 'Admin' ||
          this.$store.state.userRole === 'Editor') &&
        !this.$store.state.showNoWorkspace
      )
    },
    isUserOrAbove() {
      return (
        this.isSuper ||
        this.$store.state.userRole === 'Super' ||
        this.$store.state.userRole === 'Admin' ||
        this.$store.state.userRole === 'Editor' ||
        this.$store.state.userRole === 'Author' ||
        this.$store.state.userRole === 'User'
      )
    },
    canOpenWorkspaceApps() {
      return this.isUserOrAbove && !this.$store.state.showNoWorkspace
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
