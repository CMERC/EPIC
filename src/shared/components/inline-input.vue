<template>
  <div>
    <div v-if="!editing"
         @click="enableEditing">
      <slot></slot>
    </div>
    <div v-if="editing">
      <input v-model="inputValue"
             type="text"
             class="input form-control"
             v-focus>
      <span class="buttons has-addons">
        <a class="button"
           @click="saveEdit">
          <span class="icon is-small has-text-success">
            <i class="fas fa-check"></i>
          </span>
        </a>
        <a class="button"
           @click="disableEditing">
          <span class="icon is-small has-text-danger">
            <i class="fas fa-times"></i>
          </span>
        </a>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'click-to-edit',
  props: ['label', 'value'],

  data() {
    return {
      editing: false,
      inputValue: this.value
    }
  },
  methods: {
    enableEditing() {
      this.editing = true
    },
    disableEditing() {
      this.editing = false
    },
    saveEdit() {
      this.disableEditing()
      this.$emit('input', this.inputValue)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
