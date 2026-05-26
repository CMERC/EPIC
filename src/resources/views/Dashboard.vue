<template>
  <div>
    <resources-nav area='resources' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import ResourcesNav from '@/shared/components/navigation.vue'
export default {
  name: 'ResourcesDashboard',
  components: {
    ResourcesNav
  }
}
</script>
