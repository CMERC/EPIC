<template>
  <div class="container is-fluid noteFolderselect">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card"
           v-if="open">
        <header class="modal-card-head">
          <p class="modal-card-title">Rename File</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">
              Display Name
            </label>
            <div class="control">
              <input type="text"
                     class="input"
                     v-model="fileInfo" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="select()">
            Rename
          </button>
          <button class="button"
                  @click="close()">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'file-rename',
  props: {
    open: {
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileInfo: ''
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.newName = ''
    },
    select() {
      let data = {
        id: this.id,
        name: this.fileInfo
      }
      this.$emit('select', data)
      this.close()
    }
  },
  watch: {
    fileName() {
      this.fileInfo = this.fileName
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
