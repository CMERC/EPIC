<template>
  <div>
    <plan-nav area='plan' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import PlanNav from '@/shared/components/navigation.vue'
export default {
  name: 'PlanDashboard',
  components: {
    PlanNav
  }
}
</script>
