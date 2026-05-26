<template>
  <div class="navTop">
    <div class="container contentMain">
      <nav class="level serviceNav is-mobile">
        <div class="level-left has-text-grey">
          <div class="level-item">
            <a @click="$router.go(-1)">
              <a class="navbar-brand"
                 v-if="allData.currentUser && allData.currentUser.service">
                <div class="navbar-item">
                  <span class="icon is-large"
                        :style="'color:'+allData.currentUser.service.color"
                        v-if="allData.currentUser.service.icon">
                    <i :class="'fa-2x '+allData.currentUser.service.icon"></i>
                  </span>
                  <span class="icon is-large"
                        v-else>
                    <i class="fas fa-2x"></i>
                  </span>
                </div>
                <div class="navbar-item">
                  <span class="title is-4"> {{allData.currentUser.service.displayName}}</span>
                </div>
              </a>
            </a>
          </div>
        </div>
        <div class="level-item is-hidden-mobile">
        </div>
        <div class="level-right">
          <div class="level-item">
            <a class="button is-link is-inverted">
              Contacts
            </a>
            <a class="button is-link is-inverted">
              Settings
            </a>
            <a class="button is-link is-inverted">
              Log Out
            </a>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chatheader',
  props: {
    allData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
@import 'styles.scss';
</style>
