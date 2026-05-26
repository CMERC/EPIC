
<template>
  <div class="monitor-map-container">
    <nav class="level">
      <div class="level-item">
        <nav class="breadcrumb breadMenu">
          <ul>
            <li>
              <router-link :to="{name: 'monitor-filter', params: {requestedFilter: 'all'}}"
                           :class="{'is-active':requestedFilter==='all'}">All</router-link>
            </li>
            <li>
              <router-link :to="{name: 'monitor-filter', params: {requestedFilter: 'noise_only'}}"
                           :class="{'is-active':requestedFilter==='noise_only'}">Noise</router-link>
            </li>
            <li>
              <router-link :to="{name: 'monitor-filter', params: {requestedFilter: 'injects'}}"
                           :class="{'is-active':requestedFilter==='injects'}">Injects</router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="level-item">
        <h3>Media Posts</h3>
      </div>
      <div class="level-item">
        <help-content reference="map.monitor"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div id="map"
         class="map"></div>
    <div id='post-info-dialog'>
      <div class="modal-card"
           v-if="selectedFeature">
        <header class="modal-card-head">
          <p class="modal-card-title">
            <span class="icon is-small"
                  :style="'color:'+selectedFeature.profiles[0].service.color"
                  v-if="selectedFeature.profiles[0].service.icon">
              <i :class="selectedFeature.profiles[0].service.icon"></i>
            </span>
            <span class="icon"
                  v-else>
              <i class="fas fa-sm"></i>
            </span>
            <span> {{selectedFeature.profiles[0].service.displayName}}</span>
          </p>
          <button class="delete"
                  aria-label="close"
                  @click="closeSelectOverlay"></button>
        </header>
        <section class="modal-card-body">
          <div>
            <b>Name:</b> {{selectedFeature.profiles[0].name}}
          </div>
          <div>
            <b>Username:</b> {{selectedFeature.profiles[0].username}}
          </div>
          <b>Service:</b>
          <span class="icon is-small"
                :style="'color:'+selectedFeature.profiles[0].service.color"
                v-if="selectedFeature.profiles[0].service.icon">
            <i :class="selectedFeature.profiles[0].service.icon"></i>
          </span>
          <span class="icon"
                v-else>
            <i class="fas fa-sm"></i>
          </span>
          <span> {{selectedFeature.profiles[0].service.displayName}}</span>
          <div>
            <b>Title:</b> {{selectedFeature.title}}
          </div>
          <div>
            <b>Text:</b>
            <p v-html="parseText(processPost(selectedFeature.text, selectedFeature.profiles[0].service))"></p>
          </div>
          <div>
            <b>Publish Time:</b> {{selectedFeature.publishTime}}
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="editPost(selectedFeature)">
            Edit Post
          </button>
          <button class="button is-primary is-outlined"
                  @click="permalinkPost(selectedFeature)">
            View Post
          </button>
          <button class="button"
                  aria-label="close"
                  @click="closeSelectOverlay">
            Cancel
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import HelpContent from '@/shared/components/helpcontent'
import { MediaPostsRead } from '@/media/graphql/MediaPosts.gql'
import helpers from '@/shared/mixins/helpers'
import processText from '@/shared/mixins/processText'
const Geohash = require('ngeohash')
import Point from 'ol/geom/Point'
import { Map, View, Feature } from 'ol'
import { Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Stroke, Style, Circle as CircleStyle } from 'ol/style.js'
import Overlay from 'ol/Overlay.js'
import { defaults as defaultInteractions, Select } from 'ol/interaction.js'
import XYZ from 'ol/source/XYZ'
export default {
  name: 'Map',
  props: ['requestedFilter'],
  components: { HelpContent },
  mixins: [helpers, processText],
  apollo: {
    mediaPosts: {
      query: MediaPostsRead,
      variables() {
        let data = {
          where: {
            isPublished: true,
            location: {
              id_not: null
            }
          },
          orderBy: 'publishTime_DESC',
          first: 100
        }
        switch (this.requestedFilter) {
          case 'noise_only': {
            data.where = {
              ...data.where,
              isUserGenerated: false
            }
            break
          }
          case 'injects': {
            data.where = {
              ...data.where,
              isUserGenerated: true
            }
            break
          }
        }
        if (this.geoHashRange.length > 0) {
          let locationWhereInput = []
          for (let i = 0; i < this.geoHashRange.length; i++) {
            locationWhereInput.push({
              geohash_starts_with: this.geoHashRange[i]
            })
          }
          data.where = {
            ...data.where,
            location: {
              OR: locationWhereInput
            }
          }
        }
        return data
      },
      update(data) {
        if (data) this.selectMapData(data)
        return data
      }
    }
  },
  data() {
    return {
      selectedFeature: null,
      olMap: null,
      vectorSource: null,
      vectorLayer: null,
      postInfoDialogLayer: null,
      selectInteraction: null,
      geoHashRange: []
    }
  },
  mounted() {
    this.vectorSource = new VectorSource({ features: [] })
    this.vectorLayer = new VectorLayer({ source: this.vectorSource })
    this.selectInteraction = new Select({
      wrapX: false,
      hitTolerance: 6,
      style: this.styleFunction
    })
    this.selectInteraction.getFeatures().on('add', this.addSelectionListener)
    this.postInfoDialogLayer = new Overlay({
      element: document.getElementById('post-info-dialog'),
      autoPan: true
    })
    this.olMap = new Map({
      interactions: defaultInteractions().extend([this.selectInteraction]),
      layers: [
        new TileLayer({
          visible: true,
          preload: 4,
          source: new XYZ({
            crossOrigin: 'anonymous',
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        this.vectorLayer
      ],
      overlays: [this.postInfoDialogLayer],
      target: document.getElementById('map'),
      view: new View({
        center: [-0, 0],
        zoom: 3.5,
        maxZoom: 20,
        projection: 'EPSG:4326'
      })
    })
    this.olMap.getView().on('change:resolution', () => {
      this.setGeohashRange()
    })
    this.olMap.on('moveend', () => {
      this.setGeohashRange()
    })
  },
  methods: {
    setGeohashRange() {
      let extent = this.olMap.getView().calculateExtent(this.olMap.getSize())
      let geohashLength = 1
      let zoomLevel = this.olMap.getView().getZoom()
      if (zoomLevel > 9) geohashLength = 4
      else if (zoomLevel > 7 && zoomLevel <= 9) geohashLength = 3
      else if (zoomLevel >= 3 && zoomLevel <= 7) geohashLength = 2
      else geohashLength = 1
      this.geoHashRange = Geohash.bboxes(
        extent[1],
        extent[0],
        extent[3],
        extent[2],
        geohashLength
      )
    },
    editPost(mediaPost) {
      this.$router.push({
        name: 'editpost',
        params: {
          profile: mediaPost.profiles[0].username,
          service: mediaPost.profiles[0].service.name,
          id: mediaPost.id
        }
      })
    },
    permalinkPost(mediaPost) {
      this.$router.push({
        path: `/web/${this.$store.state.activeWorkspace.name}/${
          mediaPost.profiles[0].service.name
        }/${mediaPost.profiles[0].username}/${mediaPost.id}`
      })
    },
    addSelectionListener(evt) {
      if (evt && evt.element) {
        this.selectedFeature = evt.element.getProperties()
        this.postInfoDialogLayer.setPosition(
          evt.element.getGeometry().getCoordinates()
        )
      }
    },
    closeSelectOverlay() {
      this.selectInteraction.getFeatures().clear()
      this.selectedFeature = null
      this.postInfoDialogLayer.setPosition(undefined)
    },
    selectMapData(data) {
      // Clear Map
      this.vectorSource.clear()

      if (data.mediaPosts) {
        data.mediaPosts.forEach(mediaPost => {
          if (
            mediaPost.location &&
            mediaPost.location.geojson &&
            mediaPost.location.geojson.coordinates
          ) {
            let featureForPost = new Feature({
              geometry: new Point(mediaPost.location.geojson.coordinates)
            })
            if (mediaPost.profiles[0].service.color) {
              featureForPost.setStyle(
                new Style({
                  image: new CircleStyle({
                    radius: 5,
                    stroke: new Stroke({
                      color: mediaPost.profiles[0].service.color,
                      width: 2
                    })
                  })
                })
              )
            }
            featureForPost.setProperties(mediaPost)
            this.vectorSource.addFeature(featureForPost)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-card {
  width: 400px;
  .delete {
    float: right;
  }
}
.level {
  margin-bottom: 0px;
}
.map {
  margin: 0;
  padding: 0;
  width: 100%;
  height: calc(100vh - 90px);
}
</style>
