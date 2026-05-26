<template>
  <div class="modal"
       :class="{'is-active': open}"
       @click="cancel()"
       v-if="file">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div v-if="ifVideo(file.contentType)">
        <video class="video"
               controls
               preload="auto"
               autoplay
               data-setup='{ "aspectRatio":"16:9" }'>
          <source :src="file.url.raw">
        </video>
      </div>
      <div v-else>
        <p class="image">
          <img :src="file.url.regular"
               alt="Image" />
        </p>
      </div>
    </div>
    <button class="modal-close is-large"
            aria-label="close"></button>
  </div>
</template>

<script>
import MediaCheck from '@/shared/mixins/mediaCheck'
export default {
  name: 'mediaPreview',
  mixins: [MediaCheck],
  props: {
    file: {
      type: Object,
      default: null
    },
    open: {
      default: false
    }
  },
  methods: {
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.video,
.image img {
  display: block;
  height: calc(100vh - 200px);
  width: auto;
  margin-left: auto;
  margin-right: auto;
}

@media screen and (max-width: 1024px - 1px) {
  .video,
  .image img {
    display: block;
    height: auto;
    width: calc(100vw - 50px);
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
