<template>
  <div>
    <navigation area='web'
                :query="query"
                :tab="tab"
                v-if="$route.name!=='editfeedbackpublic'" />
    <main>
      <router-view :query="query"
                   :tab="tab" />
    </main>
  </div>
</template>

<script>
import Navigation from '@/shared/components/navigation.vue'
export default {
  name: 'WebDashboard',
  props: ['query', 'tab'],
  components: {
    Navigation
  }
}
</script>
<style lang="scss" scoped>
nav.navbar.is-web {
  border-bottom: 1px solid #dbdbdb;
}
@media screen and (max-width: 768px - 1px) {
  main {
    margin-top: 0.75rem;
  }
}
</style>
