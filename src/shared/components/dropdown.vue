<template>
  <span class="is-hoverable"
        ref="dropdownMenu"
        :class="{'is-active': visible}"
        @click="visible = !visible">
    <slot name="header"></slot>
    <template v-if="visible">
      <slot></slot>
    </template>
  </span>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  },
  methods: {
    documentClick(e) {
      let el = this.$refs.dropdownMenu
      let target = e.target
      if (el !== target && !el.contains(target)) {
        this.visible = false
      }
    }
  },
  created() {
    document.addEventListener('click', this.documentClick)
  },
  destroyed() {
    // important to clean up!!
    document.removeEventListener('click', this.documentClick)
  }
}
</script>
