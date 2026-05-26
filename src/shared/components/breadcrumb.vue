<template>
  <nav class="breadcrumb is-spaced has-bullet-separator"
       aria-label="breadcrumbs">
    <ul>
      <li>
        <a @click="navigateAway()">
          <span class="icon is-small">
            <i class="fas fa-chevron-left"
               aria-hidden="true"></i>
          </span>
          <span>Back</span>
        </a>
      </li>
      <template v-if="breadcrumbList">
        <li v-for="(breadcrumb, idx) in breadcrumbList"
            :key="idx">
          <router-link :to="breadcrumb.link">
            <span class="icon is-small"
                  v-if="breadcrumb.icon">
              <i :class="breadcrumb.icon"></i>
            </span>
            <span>{{breadcrumb.name | truncate(30)}}</span>
          </router-link>
        </li>
      </template>

      <li v-if="currentPage"
          class="is-active">
        <a aria-current="page">{{currentPage}}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'breadcrumb',
  props: {
    currentPage: {
      type: String,
      default: ''
    }
  },
  data() {
    return { breadcrumbList: [] }
  },
  mounted() {
    this.updateList()
  },
  watch: {
    $route() {
      this.updateList()
    }
  },
  methods: {
    navigateAway() {
      if (this.$route.query.from) {
        this.$router.push({
          path: this.$route.query.from
        })
      } else {
        this.$router.go(-1)
      }
    },
    updateList() {
      this.breadcrumbList = this.$route.meta.breadcrumb
    }
  }
}
</script>
