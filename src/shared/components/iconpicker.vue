<template>
  <b-dropdown ref="dropdown"
              :position="position">
    <button class="button"
            slot="trigger">
      <span class="icon"
            v-if="value && value.length > 0"
            :key="value">
        <i :class="value + ' fa-2x'"></i>
      </span>
      <span class="icon has-text-danger"
            v-else
            key="ban">
        <i class="fas fa-ban fa-2x"></i>
      </span>
      <span>Icon</span>

    </button>
    <b-dropdown-item custom>
      <div class="icon-picker container">
        <div class="field has-addons is-marginless icon-search">
          <p class="control is-expanded">
            <input ref="picker"
                   class="input"
                   v-model.lazy="search"
                   placeholder="Search for an icon">
          </p>
          <p class="control">
            <button class="button">
              Search
            </button>
          </p>
          <p class="control"
             v-if="value && value.length > 0">
            <button class="button"
                    @click="clearIcon">
              <span class="icon has-text-danger">
                <i class="fas fa-times"></i>
              </span>
            </button>
          </p>
        </div>
        <div v-infinite-scroll="loadMore"
             infinite-scroll-distance="100">
          <div class="columns is-mobile is-multiline is-gapless icon-list"
               @click="select(undefined)"
               @mouseover="hoverPanel = true"
               @mouseout="hoverPanel = false"
               v-if="iconsFiltered && iconsFiltered.length > 0">
            <template v-for="(iconItem, index) in iconsPaginated">
              <div class="column"
                   :key="index">
                <span @click.prevent.stop="select(iconItem)"
                      :class="['icon', 'is-large','is-rounded', {'has-text-success': iconItem.title == selected}]"
                      :key="iconItem.title">
                  <i :class="iconItem.title + ' fa-2x'" />
                </span>
              </div>
            </template>
          </div>
          <div v-else
               class="columns">
            <div class="no-result apollo">
              <div class="is-spaced">
                <p class="subtitle has-text-centered is-size-6">No result found. Try a different search.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { iconList } from './icons.js'
const icons = JSON.parse(iconList).icons

let timeout = undefined

export default {
  name: 'IconPicker',
  props: {
    value: {
      type: String
    },
    position: {
      type: String,
      default: null
    }
  },
  data: function() {
    return {
      focusOn: true, // <- set this to false
      icons: icons,
      hoverPanel: false,
      search: '',
      beforeSelect: '',
      selected: '',
      itemCount: 40,
      itemPageSize: 40,
      busy: false
    }
  },
  beforeMount() {
    this.selected = this.value
  },
  watch: {
    search: function() {
      //Reset the number of items that show in the filtered list
      this.itemCount = this.itemPageSize
    },
    selected: function(newValue) {
      this.$emit('input', newValue)
    }
  },
  methods: {
    loadMore: function() {
      if (this.itemCount < this.iconsFiltered.length) {
        this.itemCount += this.itemPageSize
      }
    },
    close() {
      this.$refs.dropdown.toggle()
    },
    clearIcon() {
      this.$emit('input', null)
    },
    select(icon) {
      clearTimeout(timeout)
      if (icon) {
        if (this.search != this.selected) {
          this.beforeSelect = this.search
        }
        this.selected = icon.title
        this.close()
      }
      this.$refs.picker.focus()
    }
  },
  computed: {
    iconsFiltered: function() {
      const search =
        this.search == this.selected
          ? this.beforeSelect.toLowerCase()
          : this.search.toLowerCase()

      return this.icons.filter(
        i =>
          i.title.indexOf(search) !== -1 ||
          i.searchTerms.some(t => t.indexOf(search) !== -1)
      )
    },
    iconsPaginated: function() {
      let indexStart = 0
      let indexEnd = indexStart + this.itemCount
      return this.iconsFiltered.slice(indexStart, indexEnd)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-picker {
  width: 26rem;
  max-width: 26rem;
  max-height: 20rem;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.icon-search {
  position: sticky;
  top: 5px;
}
.no-result {
  margin-top: 2rem;
}

@media screen and (max-width: 1024px - 1px) {
  .icon-picker {
    width: initial;
    max-width: 26rem;
    max-height: 20rem;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    & .column {
      width: 25%;
    }
  }
}
</style>
