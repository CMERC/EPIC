<template>
  <div>
    <note-nav area='note' />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import NoteNav from '@/shared/components/navigation.vue'
export default {
  name: 'NoteDashboard',
  components: {
    NoteNav
  }
}
</script>
