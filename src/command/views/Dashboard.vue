<template>
  <div>
    <command-nav area='command' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import CommandNav from '@/shared/components/navigation.vue'
export default {
  name: 'CommandDashboard',
  components: {
    CommandNav
  }
}
</script>
