<template>
  <div>
    <timeline-nav area="timeline" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import TimelineNav from '@/shared/components/navigation.vue'

export default {
  name: 'TimelineDashboard',
  components: {
    TimelineNav
  }
}
</script>
