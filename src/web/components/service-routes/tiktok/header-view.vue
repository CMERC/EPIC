<template>
  <div class="navTop">
    <div class="container contentMain">
      <nav class="level serviceNav is-mobile">
        <div class="level-left has-text-grey">
          <div class="level-item">
            <a @click="$router.go(-1)">
              <img class=" navLogo image is-48x48"
                   src='./static/images/logo.svg'
                   alt="image">
            </a>
          </div>
        </div>
        <div class="level-item is-hidden-mobile">
          <div class="control has-icons-left">
            <input class="input is-small"
                   type="text"
                   placeholder="Search">
            <span class="icon is-small is-left">
              <i class="fas fa-search fa-sm"></i>
            </span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button is-text">
              Home
            </button>
            <button class="button is-text is-inverted">
              About
            </button>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tiktokheader',
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
@import 'styles.scss';
</style>
