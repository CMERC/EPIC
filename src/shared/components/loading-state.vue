<template>
  <b-loading :is-full-page='isFullPage'
             :active.sync='isLoading'>
    <span :class="'icon '+ iconSpanSize">
      <i :class="icon +' '+ iconSize +' '+ iconColor"></i>
    </span>
  </b-loading>
</template>

<script>
export default {
  name: 'loading-state',
  props: {
    icon: {
      type: String,
      default: 'fas fa-spinner fa-pulse'
    },
    iconSize: {
      type: String,
      default: 'fa-3x'
    },
    iconColor: {
      type: String,
      default: 'has-text-primary'
    },
    iconSpanSize: {
      type: String,
      default: 'is-large'
    },
    isFullPage: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss">
.loading-overlay {
  z-index: 29;
}
</style>
