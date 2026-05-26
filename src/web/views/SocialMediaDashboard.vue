<template>
  <main>
    <router-view :query="query" />
  </main>
</template>

<script>
export default {
  name: 'SocialMediaDashboard',
  props: ['query'],
  mounted() {
    document.body.classList.remove('has-navbar-fixed-top')
  }
}
</script>
