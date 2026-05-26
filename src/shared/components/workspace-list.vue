<template>
  <div class="workspace-list-container">
    <p class="menu-label">
      Workspace
    </p>
    <ul class="menu-list">
      <li v-for="workspace in appWorkspaces"
          :key="workspace.name"
          @click="changeActiveWorkspace(workspace)"
          :class="{'active-workspace':workspace.name===$store.state.activeWorkspace.name,'disable-workspace':workspace.status!=='Available'}">
        <a>{{workspace.displayName}} <i v-if="workspace.status=='Deploying'"
                                        class="fas fa-spinner fa-pulse has-text-primary"></i></a>
      </li>
    </ul>
  </div>
</template>

<script>
import { resetApollo } from '@/vue-apollo'

export default {
  name: 'workspaces-list',
  props: ['appWorkspaces'],
  methods: {
    async changeActiveWorkspace(workspace) {
      if (workspace.status === 'Available') {
        this.$store.commit('setActiveWorkspace', workspace)
        sessionStorage.setItem('workspace', workspace.name)
        localStorage.setItem('workspace', workspace.name)
        // Clear the client side cache to load the new workspace data
        await resetApollo(this.$apollo.provider.defaultClient)
        this.$buefy.toast.open({
          message: 'workspace changed',
          type: 'is-success'
        })
        location.reload(true)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.workspace-list-container {
  width: 100%;
  .menu-list {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    max-height: 10em;
    width: 100%;
    li {
      cursor: pointer;
      order: 2;
      a {
        text-transform: capitalize;
        padding-left: 20px;
      }
      &.active-workspace {
        order: 0 !important;
        a {
          padding-left: 0px;
          &:before {
            content: '✔️ ';
          }
        }
      }
      &.disable-workspace {
        cursor: not-allowed;
        a {
          pointer-events: none;
          opacity: 0.65;
        }
      }
    }
  }
}
</style>
