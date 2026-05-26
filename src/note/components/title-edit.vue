<template>
  <div class="modal"
       :class="{'is-active': open}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Title</p>
        <button class="delete"
                aria-label="close"
                @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">
            Title
          </label>
          <p class="control has-icon has-icon-right">
            <input name="titleName"
                   :value="value"
                   v-on:input="$emit('input', $event.target.value)"
                   v-validate="{ required: true}"
                   :class="{'input': true, 'is-danger': errors.has('titleName') }"
                   type="text"
                   placeholder="Input Title">
            <i v-show="errors.has('titleName')"
               class="fa fa-warning"></i>
            <span v-show="errors.has('titleName')"
                  class="help is-danger">Title is required</span>
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary"
                @click="save">
          Save
        </button>
        <button class="button"
                @click="close">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'title-edit',
  props: {
    value: {
      type: String
    },
    open: {
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {
      this.$emit('save', this.value)
      this.$emit('close')
    }
  }
}
</script>
