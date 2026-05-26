<template>
  <section>
    <div class="wrapper">
      <header class="page-header">
        <observe-nav area='observe' />
      </header>
      <main class="page-body">
        <router-view />
      </main>
      <footer class="page-footer">
        <div class="tabs is-toggle is-square is-fullwidth has-background-light">
          <ul class="is-paddingless">
            <router-link :to="{name: 'observe-home'}"
                         exact
                         tag="li">
              <a>
                <span class="icon"><i class="fas fa-home"
                                      aria-hidden="true"></i></span>
                <span class="is-hidden-mobile">Home</span>
              </a>
            </router-link>

            <router-link :to="{name: 'observe-post'}"
                         tag="li">
              <a>
                <span class="icon"><i class="fas fa-plus-square fa-3x "
                                      aria-hidden="true"></i></span>
                <span class="is-hidden-mobile">Post</span>
              </a>
            </router-link>

            <router-link :to="{name: 'observe-profile'}"
                         tag="li">
              <a>
                <span class="icon"><i class="fas fa-user"
                                      aria-hidden="true"></i></span>
                <span class="is-hidden-mobile">Profile</span>
              </a>
            </router-link>
          </ul>
        </div>
      </footer>
    </div>
  </section>
</template>

<script>
import ObserveNav from '@/shared/components/navigation.vue'
export default {
  name: 'ObserveDashboard',
  components: {
    ObserveNav
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100%;
}
.page-footer {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  z-index: 2000;
}
</style>
