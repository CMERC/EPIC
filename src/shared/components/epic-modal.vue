<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"
           v-if="showBackground"></div>
      <div class="modal-card"
           :class="shouldOverflow ? 'has-overflow': null">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <slot name="modal-title">
            </slot>
          </p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"
                  v-if="canClose == true"></button>
        </header>
        <section class="modal-card-body"
                 :class="shouldOverflow ? 'has-overflow': null">
          <slot name="modal-body"></slot>
        </section>
        <footer class="modal-card-foot">
          <div class="field is-grouped is-grouped-left">
            <slot name='modal-footer-buttons'></slot>
            <p class="control"
               v-if="canClose == true">
              <a class="button"
                 @click="close()">Cancel</a>
            </p>
          </div>
          <div class="field is-grouped is-grouped-right"
               v-if="hasRightButtons">
            <slot name="right-buttons"></slot>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'epic-modal',
  props: {
    open: {
      default: false
    },
    showBackground: {
      type: Boolean,
      default: true
    },
    canClose: {
      default: true
    },
    shouldOverflow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    close() {
      if (this.canClose == true) {
        this.$emit('close')
      }
    }
  },
  computed: {
    hasRightButtons() {
      return (
        !!this.$slots['right-buttons'] || !!this.$scopedSlots['right-buttons']
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.has-overflow {
  overflow: visible !important;
}

.modal-card-foot {
  justify-content: space-between;
}
</style>
