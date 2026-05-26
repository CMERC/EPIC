<template>
  <div>
    <settings-nav area='base' />
    <main>
      <nav class="level">
        <div class="level-left">
          <breadcrumb />
        </div>
        <div class="level-right">
          <div class="level-item">
          </div>
        </div>
      </nav>
      <div class="container is-fluid settings">
        <div class="columns">
          <div class="column is-narrow">
            <p class="menu-label"
               v-if="isUserOrAbove"> General </p>
            <ul class="menu-list"
                v-if="isUserOrAbove">
              <li>
                <router-link :to="{name: 'userSettings'}"
                             class="navbar-item">User Settings
                </router-link>
              </li>
            </ul>
            <p class="menu-label"
               v-if="isUserOrAbove">Workspace</p>
            <ul class="menu-list"
                v-if="isUserOrAbove">
              <li>
                <router-link :to="{name: 'members'}"
                             class="navbar-item">Members</router-link>
              </li>
              <li v-if="isSuperAdminEditor">
                <router-link :to="{name: 'timezone'}"
                             class="navbar-item">Time Zone</router-link>
              </li>
              <li v-if="isSuper">
                <router-link :to="{name: 'apps'}"
                             class="navbar-item">Applications</router-link>
              </li>
            </ul>
            <p class="menu-label"
               v-if="isSuperAdminEditor"> Plan </p>
            <ul class="menu-list"
                v-if="isSuperAdminEditor">
              <li>
                <router-link :to="{name:'planJmets'}"
                             class="navbar-item">JMETs</router-link>
              </li>
              <li>
                <router-link :to="{name:'planOrganizations'}"
                             class="navbar-item">Organizations</router-link>
              </li>
              <li>
                <router-link :to="{name:'planPlatforms'}"
                             class="navbar-item">Platforms</router-link>
              </li>
              <li>
                <router-link :to="{name:'planParticipantTypes'}"
                             class="navbar-item">Participant Types</router-link>
              </li>
              <li>
                <router-link :to="{name:'planServiceDepartment'}"
                             class="navbar-item">Service/Department</router-link>
              </li>
              <li>
                <router-link :to="{name:'planServiceDepartmentType'}"
                             class="navbar-item">Service/Department Types</router-link>
              </li>
              <li>
                <router-link :to="{name:'planCommandAgency'}"
                             class="navbar-item">Command/Agency</router-link>
              </li>
              <li>
                <router-link :to="{name:'planJointStaffTrainingPriorities'}"
                             class="navbar-item">Joint Staff Training Priorities</router-link>
              </li>
              <li>
                <router-link :to="{name:'planMethods'}"
                             class="navbar-item">Inject Methods</router-link>
              </li>
              <li>
                <router-link :to="{name:'planInjectOwners'}"
                             class="navbar-item">Inject Owners</router-link>
              </li>
              <li>
                <router-link :to="{name:'status'}"
                             class="navbar-item">Status Labels</router-link>
              </li>
              <li>
                <router-link :to="{name:'planBoards'}"
                             class="navbar-item">Status Boards</router-link>
              </li>
              <li>
                <router-link :to="{name:'planReasons'}"
                             class="navbar-item">Assessment Reasons</router-link>
              </li>
              <li>
                <router-link :to="{name:'planPriorityLevels'}"
                             class="navbar-item">Training Priority</router-link>
              </li>
            </ul>
          </div>
          <div class="column">
            <router-view />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SettingsNav from '@/shared/components/navigation.vue'
import Permissions from '@/shared/mixins/permissions'
export default {
  name: 'SettingsDashboard',
  mixins: [Permissions],
  components: {
    SettingsNav
  }
}
</script>
<style lang="scss" scoped>
.menu-list a {
  padding: 0.25em 0.75em;
}

a.navbar-item {
  &.is-active {
    color: #fff;
  }
}
</style>
