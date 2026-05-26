<template>
  <div class="container is-fluid">
    <section class="section">
      <NoteFoldersFiles :noteFolderID="noteFolderID" />
    </section>
    <back-to-top bottom="20px"
                 right="20px">
      <button type="button"
              class="button">
        <span class="icon is-small">
          <i class="fas fa-arrow-up"></i>
        </span>
      </button>
    </back-to-top>
  </div>
</template>

<script>
import NoteFoldersFiles from '@/note/components/noteFoldersFiles.vue'

export default {
  name: 'NoteFolderEditView',
  props: {
    noteFolderID: {
      default: 'root',
      type: String
    }
  },
  components: {
    NoteFoldersFiles
  }
}
</script>
