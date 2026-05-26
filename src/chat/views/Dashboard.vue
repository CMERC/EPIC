<template>
  <div>
    <map-nav area='chat' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import MapNav from '@/shared/components/navigation.vue'
export default {
  name: 'ChatDashboard',
  components: {
    MapNav
  }
}
</script>
