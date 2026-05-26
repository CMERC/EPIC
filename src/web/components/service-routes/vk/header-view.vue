<template>
  <div class="serviceNav is-marginless">
    <div class="container">
      <div class="columns is-mobile mt">
        <div class="column is-2">
          <div class="level-item">
            <a @click="$router.go(-1)">
              <img src='./static/images/logo.svg'
                   alt="image"
                   class="navLogo">
            </a>
          </div>
        </div>
        <div class="column is-2">
          <div class="control has-icons-left">
            <input class="input is-small is-rounded has-text-link"
                   type="text"
                   placeholder="Search">
            <span class="icon is-small is-left">
              <i class="fas fa-search fa-sm"></i>
            </span>
          </div>
        </div>
        <div class="column is-2 is-offset-6">
          <a class="link has-text-white">
            Sign up
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vkheader',
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.serviceNav {
  background: #4a76a8;
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 10px;
  height: 40px !important;
  img {
    max-height: 50px;
  }
  .mt {
    height: 35px;
  }
}
</style>
