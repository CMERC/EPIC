<template>
  <div class="container is-fluid">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'reports-home'
}
</script>
<style lang="scss">
.plan-reports {
  .columns {
    .column {
      & article {
        padding: 2rem;
        background-color: #ecf0f1;
        border-radius: 8px;
        -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
          0 0 0 1px rgba(10, 10, 10, 0.1);
        box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
          0 0 0 1px rgba(10, 10, 10, 0.1);
      }
    }
  }
}
</style>
