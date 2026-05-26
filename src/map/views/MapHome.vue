<template>
  <div class="container">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
        </div>
      </div>
      <div class="level-item has-text-centered">
        <h1 class="title is-3">
          Maps
        </h1>
      </div>
      <div class="level-right">
        <div class="level-item">
          <help-content :reference="'map.general'"
                        toggle
                        dropdown />
        </div>
      </div>
    </nav>
    <div class="columns is-multiline"
         v-if="mapLayers && mapLayers.length > 0">
      <template v-for="map in mapLayers">
        <div class="column is-3-desktop is-4-tablet is-vcentered"
             v-bind:key="map.id">
          <div class="card"
               :key="map.id">
            <nav class="level is-pulled-right">
              <div class="level-item">
                <b-dropdown position="is-bottom-left">
                  <a class="button is-small"
                     slot="trigger">
                    <span class="icon is-small">
                      <i class="fas fa-ellipsis-v"></i>
                    </span>
                  </a>
                  <b-dropdown-item has-link>
                    <a @click="$router.push({path: '/map/copmap/edit/' + map.id})">
                      <span class="icon is-small">
                        <i class="fas fa-pen"></i>
                      </span>
                      <span>Edit Map</span>
                    </a>
                  </b-dropdown-item>
                  <b-dropdown-item has-link>
                    <a @click="duplicateMapLayer(map.id)">
                      <span class="icon is-small">
                        <i class="fas fa-copy"></i>
                      </span>
                      <span>Duplicate Map</span>
                    </a>
                  </b-dropdown-item>
                  <hr class="dropdown-divider">
                  <b-dropdown-item @click="confirmMapLayerDelete(map.id)">
                    <span class="icon is-small">
                      <i class="fas fa-times has-text-danger"></i>
                    </span>
                    <span>Delete Map</span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </nav>
            <router-link :to="{path: '/map/copmap/edit/' + map.id}">
              <div class="card-content title has-text-centered is-size-4-desktop map-item">
                <p> {{map.title}}</p>
              </div>
            </router-link>
          </div>
        </div>
      </template>
      <div class="column is-3-desktop is-4-tablet">
        <a @click="toggleCreateMapDialog">
          <div class="card map-item add-map">
            <div class="card-content title has-text-centered ">
              <p>
                <span class="icon is-large">
                  <i class="fas fa-plus fa-3x"></i>
                </span>
              </p>
              <p> Create Map</p>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div v-else>
      <empty-state :data="mapLayers"
                   :isLoading='$apollo.loading'>
        <template slot="action-buttons">
          <div class="buttons is-centered is-spaced">
            <a class="button is-primary"
               @click="toggleCreateMapDialog">
              Create Map
            </a>
          </div>
        </template>
      </empty-state>
    </div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
        </div>
      </div>
      <div class="level-item has-text-centered">
        <p class="title is-3">Other</p>
      </div>
    </nav>
    <div class="columns">
      <div class="column is-3-desktop is-4-tablet">
        <router-link :to="{name: 'map-globe'}">
          <div class=" card map-item">
            <div class="card-content title has-text-centered has-text-shadow">
              <p>Globe</p>
              <span class="icon is-large">
                <i class="fas fa-globe fa-3x"></i>
              </span>
            </div>
          </div>
        </router-link>
      </div>
      <div class="column is-3-desktop is-4-tablet">
        <router-link :to="{name: 'map-monitor'}">
          <div class=" card map-item">
            <div class="card-content title has-text-centered has-text-shadow">
              <p>Media Posts</p>
              <span class="icon is-large">
                <i class="fas fa-map fa-3x"></i>
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="modal"
         :class="{'is-active': showDialog}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Map</p>
          <button class="delete"
                  aria-label="close"
                  @click="toggleCreateMapDialog"></button>
        </header>
        <section class="modal-card-body">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">
                Title
              </label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input"
                         type="text"
                         placeholder="Map title"
                         v-model="mapTitle">
                </p>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="createMap"
                  :disabled="disableActionButton">
            Save
          </button>
          <button class="button"
                  @click="toggleCreateMapDialog">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  MapLayersRead,
  MapLayerCreate,
  MapLayerDuplicate,
  MapLayerDelete
} from '../graphql/MapLayer.gql'

export default {
  name: 'COPMap',
  components: { HelpContent },
  apollo: {
    mapLayers: {
      query: MapLayersRead
    }
  },
  data() {
    return {
      mapLayers: [],
      showDialog: false,
      mapTitle: ''
    }
  },
  methods: {
    toggleCreateMapDialog() {
      this.showDialog = !this.showDialog
    },
    duplicateMapLayer(mapId) {
      this.$apollo
        .mutate({
          mutation: MapLayerDuplicate,
          variables: {
            where: { id: mapId }
          }
        })
        .then(response => {
          if (response && response.data) {
            this.$buefy.toast.open({
              message: 'Duplicate success',
              type: 'is-success'
            })
            this.$router.push({
              path: '/map/copmap/edit/' + response.data.duplicateMapLayer.id
            })
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'Sorry, Map Layer could not be duplicated',
            type: 'is-danger'
          })
          console.error(error)
        })
    },
    createMap() {
      this.$apollo
        .mutate({
          mutation: MapLayerCreate,
          variables: {
            data: {
              title: this.mapTitle
            }
          }
        })
        .then(response => {
          this.toggleCreateMapDialog()
          this.$router.push({
            path: '/map/copmap/edit/' + response.data.createMapLayer.id
          })
        })
        .catch(error => {
          console.error(error)
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
        })
    },
    editMap(mapId) {
      this.$router.push({
        name: 'copmapedit',
        params: { id: mapId }
      })
    },
    confirmMapLayerDelete(mapId) {
      this.$buefy.dialog.confirm({
        title: 'Delete Map',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteMapLayer(mapId)
      })
    },
    deleteMapLayer(mapId) {
      this.$apollo
        .mutate({
          mutation: MapLayerDelete,
          variables: {
            where: {
              id: mapId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Map Deleted',
            type: 'is-success'
          })
          this.$apollo.queries.mapLayers.refetch()
        })
        .catch(error => {
          console.error(error)
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
        })
    }
  },
  computed: {
    disableActionButton() {
      return !(this.mapTitle && this.mapTitle.length > 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.has-text-shadow {
  text-shadow: -1px -1px 0px rgba(255, 255, 255, 0.3),
    1px 1px 0px rgba(0, 0, 0, 0.8);
}
.add-map {
  border-color: grey;
  border-style: dashed;
}
@media only screen and (min-width: 640px) {
  .columns {
    margin-left: 0px;
  }
  .map-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 14rem;
    height: auto;
    cursor: pointer;
  }
}
</style>
