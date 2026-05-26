<template>
  <div>
    <navigation area='media' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Navigation from '@/shared/components/navigation.vue'
export default {
  name: 'MediaDashboard',
  components: {
    Navigation
  }
}
</script>
