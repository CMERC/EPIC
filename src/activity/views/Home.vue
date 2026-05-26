<template>
  <div class="container is-fullheight posts-container">
    <breadcrumb currentPage="Activity" />
    <nav class="level is-mobile">
      <div class="level-left">
        <h2 class="subtitle">
          Activity
        </h2>
      </div>
      <div class="level-right">
        <help-content reference="activity.home"
                      toggle
                      dropdown />
      </div>
    </nav>
    <activity-stream />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import ActivityStream from '@/shared/components/activity-stream'
export default {
  name: 'ActivityHome',
  components: {
    HelpContent,
    ActivityStream
  }
}
</script>
<style lang="scss" scoped>
.posts-container {
  margin-bottom: 20px;
  min-height: calc(100vh - 94px);
}
</style>
