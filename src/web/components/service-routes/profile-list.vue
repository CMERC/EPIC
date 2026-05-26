<template>
  <section class="section">
    <div class="container is-fluid">
      <nav class="level">
        <div class="level-right">
          <div class="level-item">
            <div class="field">
              <p class="control has-icons-left">
                <input class="input"
                       type="text"
                       placeholder="Search..."
                       v-model.lazy="searchQuery">
                <span class="icon is-small is-left">
                  <i class="fas fa-search"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
      </nav>
      <div class="columns is-multiline"
           v-if="filteredList && filteredList.length > 0">
        <div class="column is-4"
             v-for="mediaProfile in filteredList"
             v-bind:key="mediaProfile.id">
          <router-link :to="{path: `/web/${$route.params.workspace}/${mediaProfile.service.name}/${mediaProfile.username}`}">
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48"
                            v-if="mediaProfile.avatar">
                      <img :src='mediaProfile.avatar?mediaProfile.avatar.url.thumb:""'
                           class="is-avatar md">
                    </figure>
                    <figure class="image is-48x48"
                            v-else>
                      <span class="icon is-large">
                        <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                      </span>
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-6">{{mediaProfile.name}}</p>
                    <p class="subtitle is-7 has-text-weight-semibold">@{{mediaProfile.username}}<br />
                      <span class="icon is-small"
                            :style="'color:'+mediaProfile.service.color"
                            v-if="mediaProfile.service.icon">
                        <i :class="mediaProfile.service.icon"></i>
                      </span>
                      <span class="icon is-small"
                            v-else>
                        <i class="fas fa-sm"></i>
                      </span>
                      <span> {{mediaProfile.service.displayName}}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div v-else
           class="no-result apollo">
        <div class="card">
          <div class="card-content">
            <div class="card-header-title is-centered">
              <i class="fas fa-search fa-3x has-text-primary"></i>
            </div>
            <p class="subtitle has-text-centered">No result found. Try a different search.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
export default {
  name: 'profile-list',
  props: {
    mediaProfiles: {}
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    filteredList() {
      return self.mediaProfiles.filter(profile => {
        let searchRegex = new RegExp(this.searchQuery, 'i')
        return searchRegex.test(JSON.stringify(profile))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-list-item {
  border: 1px solid #ccc;
}
.profile-list-item:hover {
  border: 1px solid #ff4612;
}
.flex-box-main {
  margin-top: 10px;
  height: 100%;
  width: 100%;
  display: flex;
}
</style>
