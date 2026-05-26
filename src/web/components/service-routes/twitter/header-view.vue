<template>
  <div class="container">
    <nav class="level is-mobile serviceNav is-marginless is-paddingless">
      <div class="level-left has-text-grey has-text-weight-semibold">
        <div class="level-item">
          <a @click="$router.go(-1)">
            <span>
              <span class="icon is-small">
                <i class="fab fa-twitter has-text-link"></i>
              </span>&nbsp;Home</span>
          </a>
        </div>
        <div class="level-item">
          <a @click="$router.go(-1)">
            <span>
              <span class="icon is-small">
                <i class="fas fa-bolt"></i>
              </span>Moments</span>

          </a>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="control has-icons-left">
            <input class="input is-small"
                   type="text"
                   placeholder="Search">
            <span class="icon is-small is-left">
              <i class="fas fa-search fa-sm"></i>
            </span>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'twitterheader',
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.serviceNav {
  background: #fff;
  height: 60px;
  vertical-align: middle;
  font-family: 'Segoe UI', Arial, sans-serif;
  img {
    max-height: 25px;
  }
}
</style>
