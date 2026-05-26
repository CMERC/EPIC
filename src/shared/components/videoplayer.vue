
<template>
  <video ref="videoPlayer"
         class="video-js vjs-big-play-centered"
         controls
         height="100"
         width="100"
         preload="auto"
         data-setup='{ "aspectRatio":"16:9" }'>
    <source :src="src">
  </video>
</template>
<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
export default {
  name: 'VideoPlayer',
  props: {
    src: {
      type: String,
      default: 'http://vjs.zencdn.net/v/oceans.mp4'
    }
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer)
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
