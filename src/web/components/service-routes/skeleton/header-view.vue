<template>
  <nav class="navbar">
    <div class="container">
      <a class="navbar-brand"
         v-if="allData.currentUser && allData.currentUser.service"
         @click="$router.go(-1)">
        <div class="navbar-item">
          <span class="icon is-large"
                :style="'color:'+allData.currentUser.service.color"
                v-if="allData.currentUser.service.icon">
            <i :class="'fa-3x '+allData.currentUser.service.icon"></i>
          </span>
          <span class="icon is-large"
                v-else>
            <i class="fas fa-3x"></i>
          </span>
        </div>
        <div class="navbar-item">
          <h1 class="title is-1 siteTitle">
            {{allData.currentUser.service.displayName}}
          </h1>
        </div>
      </a>
      <div id="navbarMenu"
           class="navbar-menu">
        <div class="navbar-end">
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'skeleton-header',
  props: {
    allData: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'styles.scss';
</style>
