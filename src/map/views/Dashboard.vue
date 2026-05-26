<template>
  <div>
    <map-nav area='map' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import MapNav from '@/shared/components/navigation.vue'
export default {
  name: 'MapDashboard',
  components: {
    MapNav
  }
}
</script>
