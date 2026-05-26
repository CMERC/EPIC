<template>
  <div class="serviceNav is-marginless is-paddingless">
    <div class="container">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <i class="fas fa-bars"></i>
          </div>
          <div class="level-item">
            <a @click="$router.go(-1)">
              <img src='./static/images/logo.svg'
                   alt="image"
                   class="navLogo">
            </a>
          </div>
          <div class="level-item">
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
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="columns is-vcentered">
              <div class="column">
                <span class="icon is-small">
                  <i class="fas fa-video"></i>
                </span>
              </div>
              <div class="column">
                <span class="icon is-small">
                  <i class="fas fa-th"></i>
                </span>
              </div>
              <div class="column">
                <span class="icon is-small">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </div>
              <div class="column is-narrow">
                <span class="button is-text has-text-link">SIGN IN</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

  </div>

</template>

<script>
export default {
  name: 'youtubeheader',
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.serviceNav {
  padding-left: 20px;
  background: #fff;
  img {
    max-height: 25px;
  }
}
[class^='icon-'],
[class*=' icon-'] {
  line-height: 2;
}
.icon-video-camera5 {
  font-size: 22px;
  line-height: 1.5;
}
</style>
