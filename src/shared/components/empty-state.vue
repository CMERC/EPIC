<template>
  <div class="emptyState"
       :class="{'card': isCard}">
    <div class="card-content">
      <template v-if="isLoading">
        <div class="columns is-multiline is-centered">
          <div class="column is-relative loadingState">
            <loading-state :isLoading='isLoading'
                           :isFullPage='false' />
          </div>
          <div class="column is-full">
            <p class="subtitle has-text-centered">Loading...
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="search || search && data.length == 0">
          <div class="card-header-title is-centered">
            <i :class="searchIcon+' '+ searchIconSize + ' has-text-grey-dark'"></i>
          </div>
          <p v-if="!hasCustomMessage"
             class="subtitle has-text-centered">No results. Try a different search or create a new entry. <a class="has-text-link has-text-underline"
                                                                                                             :href="helpLink"
                                                                                                             target="_blank">Need more help?</a>
          </p>
        </div>
        <div v-else-if="isIDPage">
          <div class="card-header-title is-centered">
            <div class="fa-5x">
              <span class="fa-layers fa-fw">
                <i class="fas fa-file has-text-grey"></i>
                <i class="fa-inverse fas fa-question"
                   data-fa-transform="shrink-10 down-1"></i>
              </span>
            </div>
          </div>
          <p v-if="!hasCustomMessage"
             class="subtitle has-text-centered">No data found. <span v-if="$route.meta.breadcrumb">Try<router-link class="has-text-link has-text-underline"
                                                                                                                   :to="$route.meta.breadcrumb[0].link"> viewing all entries</router-link>.</span><br /> <a class="has-text-link has-text-underline"
                                                                                                                                                                                                            :href="helpLink"
                                                                                                                                                                                                            target="_blank">Need more help?</a>
          </p>
        </div>
        <div v-else-if="!data || data.length == 0">
          <div class="card-header-title is-centered">
            <div class="fa-5x">
              <span class="fa-layers fa-fw">
                <i class="fas fa-file has-text-grey"></i>
                <i class="fa-inverse fas fa-pencil-alt"
                   data-fa-transform="shrink-10 down-1"></i>
              </span>
            </div>
          </div>
          <p v-if="!hasCustomMessage"
             class="subtitle has-text-centered">A fresh start. Create the first entry. <a class="has-text-link has-text-underline"
                                                                                          :href="helpLink"
                                                                                          target="_blank">Need more help?</a>
          </p>
        </div>
        <slot name="custom-message"></slot>
        <slot name="action-buttons"></slot>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'empty-state',
  props: {
    data: {
      default: null
    },
    isCard: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    helpLink: {
      type: String,
      default: 'https://help.epicready.com/'
    },
    customMessage: {
      type: String,
      default: ''
    },
    searchIcon: {
      type: String,
      default: 'fas fa-search'
    },
    searchIconSize: {
      type: String,
      default: 'fa-5x'
    },
    search: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isIDPage() {
      return (
        (this.$route.params.id ||
          this.$route.params.number ||
          this.$route.params.notebookID ||
          this.$route.params.noteFolderID ||
          this.$route.params.profile) &&
        !this.data
      )
    },
    hasCustomMessage() {
      return (
        !!this.$slots['custom-message'] || !!this.$scopedSlots['custom-message']
      )
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1024px - 1px) {
  .emptyState {
    & .card-content {
      max-width: calc(50vw - 20vw);
    }
  }
}

.emptyState {
  & .card-content {
    max-width: calc(75vw - 20vw);
    margin-right: auto;
    margin-left: auto;
    & .subtitle {
      font-size: 1rem;
    }
    .column.loadingState {
      height: 5rem;
      & .loading-overlay .loading-background {
        background-color: transparent;
      }
    }
  }
}
</style>
