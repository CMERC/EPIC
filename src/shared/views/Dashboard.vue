<template>
  <div>
    <main-nav area="base" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import MainNav from '@/shared/components/navigation.vue'
export default {
  name: 'MainDashboard',
  components: {
    MainNav
  }
}
</script>
