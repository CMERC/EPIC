<template>
  <div>
    <dev-nav area='dev' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import DevNav from '@/shared/components/navigation.vue'
export default {
  name: 'DevDashboard',
  components: {
    DevNav
  }
}
</script>
