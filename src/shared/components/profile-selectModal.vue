<template>
  <div class="container">
    <epic-modal :open="open"
                @close="close"
                :shouldOverflow="true">
      <template slot="modal-title">
        Select a Profile
      </template>
      <template slot="modal-body">
        <profile-selector :authorID="authorID"
                          :service="service"
                          :isModal='true'
                          @emitValue="setValue($event)"/>
      </template>
      <template slot="modal-footer-buttons">
        <p class="control">
          <a class="button is-primary"
             @click="select()">Create</a>
        </p>
      </template>
    </epic-modal>
  </div>
</template>

<script>
import ProfileSelector from '@/shared/components/profile-selector'
export default {
  name: 'profile-selectModal',
  components: { ProfileSelector },
  props: {
    open: {
      default: false
    },
    service: {
      type: String,
      default: ''
    },
    authorID: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedProfile: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    setValue(e) {
      this.selectedProfile = e
    },
    select() {
      this.$emit('select', this.selectedProfile)
      this.close()
    }
  }
}
</script>
