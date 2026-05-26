<template>
  <nav class="level serviceNav is-marginless is-paddingless">
    <div class="level-item">
      <a @click="$router.go(-1)">
        <img src='./static/images/logo.svg'
             alt="image">
      </a>
    </div>
    <div class="level-item">
      <label class="label has-text-white is-size-7 has-text-weight-light">
        Email or Phone <input class="input is-small is-size-7"
                              autocomplete="off"
                              type="text"
                              disabled />
      </label>
    </div>
    <div class="level-item">
      <label class="label has-text-white is-size-7 has-text-weight-light">
        Password<input class="input is-small"
                       autocomplete="off"
                       type="password"
                       disabled /></label>
    </div>
    <div class="level-item">
      <a class="button is-link is-small">
        Login
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'facebookheader',
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.serviceNav {
  background: #3b5998;
}
.input {
  background-color: #faffbd;
  border-radius: 0;
  border-color: #000;
}
</style>
