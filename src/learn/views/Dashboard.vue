<template>
  <div>
    <learn-nav area='learn' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import LearnNav from '@/shared/components/navigation.vue'
export default {
  name: 'LearnDashboard',
  components: {
    LearnNav
  }
}
</script>
