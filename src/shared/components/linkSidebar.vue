<template>
  <article class="sideMenu">
    <nav class="settings level is-pulled-right">
      <div class="level-item"
           v-if="$store.state.currentUser">
        <router-link class="button is-small"
                     :to="{name: 'userSettings', params: {id: $store.state.currentUser.id} }">
          <i class="fas fa-cog"></i>
        </router-link>
      </div>
    </nav>
    <aside class="menu">
      <p class="menu-label title">
        <span class="icon">
          <i class="fas fa-star"></i>
        </span> Favorites
      </p>
      <ul class="menu-list">
        <li v-for="link in filteredFavorites"
            :key="link.index"
            class="has-hoverable">
          <router-link :to="link.url">{{link.name}}</router-link>
          <span class="has-show-on-hover icon is-pulled-right"
                @click="removeFavorite(link, area)">
            <i class="fas fa-star fa-xs"></i>
          </span>
        </li>
      </ul>

      <div v-for="item in data"
           :key="item.index">
        <p class="menu-label title"
           v-show="betaCheck(item.beta)">
          <span class="icon">
            <i :class="item.icon"></i>
          </span>
          {{item.name}}
        </p>
        <ul class="menu-list">
          <li v-for="link in item.links"
              :key="link.index"
              v-show="betaCheck(link.beta)"
              class="has-hoverable">
            <router-link :to="link.url">{{link.name}}</router-link>
            <span class="has-show-on-hover icon is-pulled-right"
                  @click="setFavorite(link, area)">
              <i class="far fa-star fa-xs"></i>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  </article>
</template>

<script>
import { LocalGetSelf } from '@/state/graphql/user.gql'
export default {
  name: 'linkSidebar',
  apollo: {
    user: {
      query: LocalGetSelf
    }
  },
  props: {
    data: {},
    area: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      favorites: localStorage.getItem(this.area + 'Favorites')
        ? JSON.parse(localStorage.getItem(this.area + 'Favorites'))
        : []
    }
  },
  computed: {
    filteredFavorites() {
      return this.favorites.reduce(
        (x, y) => (x.findIndex(e => e.name == y.name) < 0 ? [...x, y] : x),
        []
      )
    }
  },
  methods: {
    betaCheck(item) {
      let check = true
      if (item == true && this.user && this.user.isSuper !== true) {
        check = false
      }
      return check
    },
    removeFavorite(link, area) {
      for (let i = 0; i < this.favorites.length; i++) {
        if (link.name === this.favorites[i].name) {
          this.favorites.splice(i, 1)
        }
      }
      localStorage.setItem(area + 'Favorites', JSON.stringify(this.favorites))
    },
    setFavorite(link, area) {
      this.favorites.push(link)

      this.favorites = this.favorites.reduce(
        (x, y) => (x.findIndex(e => e.name == y.name) < 0 ? [...x, y] : x),
        []
      )
      localStorage.setItem(area + 'Favorites', JSON.stringify(this.favorites))
    }
  },
  watch: {
    favorites() {
      if (this.favorites.length <= 0) {
        localStorage.removeItem(this.area + 'Favorites')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
article {
  .settings {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  aside.menu {
    .menu-label {
      margin-top: 1rem !important;
      margin-bottom: 0.5rem !important;
      display: flex;
      align-items: center;
      text-transform: capitalize;
      font-weight: 700;
      font-size: 1rem;
    }
    .menu-list {
      margin-left: 15px !important;
      margin-top: 0 !important;
      list-style-type: none;
      padding-left: 0;
      li {
        a {
          display: inline-flex;
          padding: 0.25em 0.75em;
        }
        a.is-active {
          background-color: inherit;
          font-style: italic;
          color: inherit;
        }
      }
    }
  }
}

@media (hover: hover) {
  .menu-list {
    a:hover {
      background: transparent !important;
    }
    li {
      &:hover {
        background-color: hsl(0, 0%, 86%);
      }
      &:hover > span {
        display: inline-flex;
        &:hover {
          cursor: pointer;
          color: grey;
        }
      }
    }
  }
}
</style>
