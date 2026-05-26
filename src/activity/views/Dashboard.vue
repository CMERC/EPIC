<template>
  <section>
    <div class="wrapper">
      <header class="page-header">
        <activity-nav area='activity' />
      </header>
      <main class="page-body">
        <router-view />
      </main>
    </div>
  </section>
</template>

<script>
import ActivityNav from '@/shared/components/navigation.vue'
export default {
  name: 'ActivityDashboard',
  components: {
    ActivityNav
  }
}
</script>

<style lang="scss" scoped>
</style>
