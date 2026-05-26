<template>
  <div>
    <map-nav area='email' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import MapNav from '@/shared/components/navigation.vue'
export default {
  name: 'EmailDashboard',
  components: {
    MapNav
  }
}
</script>
<style lang="scss" scoped>
@media screen and (max-width: 768px - 1px) {
  main {
    margin-top: 0.75rem;
  }
}
</style>
