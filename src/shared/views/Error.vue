<template>
  <section class="section">
    <div class="columns is-mobile is-centered">
      <div class="column is-one-third-desktop is-12-mobile is-5-tablet">
        <div class="card">
          <div class="card-content">
            <p class="title has-text-centered is-size-1">404</p>
            <p class="subtitle has-text-centered is-size-4 is-spaced">OOPS!</p>
            <p class="subtitle has-text-centered is-size-5 is-spaced">Sorry! The page you are looking for doesn't exist.</p>
            <a class="button is-primary is-fullwidth"
               @click="goHome">
              Go Back!
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
export default {
  name: 'ErrorView',
  methods: {
    goHome() {
      if (window.history.length > 2) {
        this.$router.go(-1)
      } else {
        this.$router.replace('/')
      }
    }
  }
}
</script>
