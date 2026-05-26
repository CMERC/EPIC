<template>
  <div class="ol-map-container">
    <div style="position:relative">
      <a style="text-decoration:initial"
         @click="showDialog = true">
        <article class="media">
          <figure class="media-left">
            <span class="icon">
              <i class="fas fa-map-marker-alt has-text-primary fa-2x"></i>
            </span>
          </figure>
          <div class="media-content"
               v-if="value">
            <geocode :coordinates="value.geojson.coordinates"></geocode>
            <span v-if="value.geojson.type=='Box'">SW </span>
            <div>Lat/Lon:</div>
            <span> {{value.geojson.coordinates[1]}} {{value.geojson.coordinates[0]}}</span><br />
            <span v-if="value.geojson.coordinates.length>=4">
              NE Lat/Lon: {{value.geojson.coordinates[3]}} {{value.geojson.coordinates[2]}}
            </span>
          </div>
          <div class="media-content"
               v-else>
            No Location
          </div>
        </article>
      </a>
      <a class="delete is-pulled-right"
         style="z-index:15;position:absolute;top:0;right:0;"
         @click="deleteLocation"
         v-if="value"></a>
    </div>
    <div class="modal"
         :class="{'is-active': showDialog}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Choose Location...</p>
          <button class="delete"
                  aria-label="close"
                  @click="close"></button>
        </header>
        <section class="modal-card-body">
          <div ref="olMap"
               class="olMap"></div>
          <div class="columns">
            <div class="column"
                 v-if="drawType==='Box'">
              <div class="field has-addons">
                <p class="control">
                  <a class="button"
                     @click="setExtent(false)"
                     :class="{'is-primary': !enableExtent}">
                    <span class="icon is-small is-left">
                      <i class="fas fa-arrows-alt"></i>
                    </span>
                    <span>Move Map</span>
                  </a>
                </p>
                <p class="control">
                  <a class="button"
                     @click="setExtent(true)"
                     :class="{'is-primary': enableExtent}">
                    <span class="icon is-small is-left">
                      <i class="fas fa-mouse-pointer"></i>
                    </span>
                    <span>Draw Bounding Box</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div class="content is-medium"
               v-if="coordinate">
            <geocode :coordinates="coordinate"></geocode>
            <small v-if="coordinate.length>2">
              SW
            </small><small>Lat/Lon: {{coordinate[1]}} {{coordinate[0]}}</small><br />
            <small v-if="coordinate.length>2">
              NE Lat/Lon: {{coordinate[3]}} {{coordinate[2]}}
            </small>
          </div>
        </section>
        <footer class="modal-card-foot  map-picker-footer">
          <div class="field is-grouped is-grouped-left">
            <button class="button is-primary"
                    @click="emitChanges"
                    :disabled="disableSave">
              Ok
            </button>
            <button class="button"
                    @click="close">
              Cancel
            </button>
          </div>
          <div class="field is-grouped is-grouped-right">
            <div class="field has-addons">
              <p class="control">
                <a class="button"
                   @click="updateMapBaseLayer('Road')"
                   :class="{'is-primary': baseLayer==='Road'}">
                  <span>Map</span>
                </a>
              </p>
              <p class="control">
                <a class="button"
                   @click="updateMapBaseLayer('AerialWithLabels')"
                   :class="{'is-primary': baseLayer==='AerialWithLabels'}">
                  <span>Satellite</span>
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import Point from 'ol/geom/Point'
import { Vector as VectorSource } from 'ol/source'
import ExtentInteraction from 'ol/interaction/Extent'
import { Fill, Stroke, Style } from 'ol/style.js'
import Geocode from '@/shared/components/geocode'
const Geohash = require('ngeohash')
import XYZ from 'ol/source/XYZ'

export default {
  name: 'MapLocationPicker',
  props: ['value', 'drawType'],
  components: { Geocode },
  data() {
    return {
      showDialog: false,
      geocode: null,
      oldLocationName: null,
      coordinate: null,
      olMapData: null,
      map: null,
      extent: null,
      pointFeature: null,
      enableExtent: false,
      baseLayer: 'Road',
      roadLayer: null,
      aerialLayer: null
    }
  },
  mounted() {
    // Layers to load map
    this.roadLayer = new TileLayer({
      visible: true,
      preload: 4,
      source: new XYZ({
        crossOrigin: 'anonymous',
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    })
    this.aerialLayer = new TileLayer({
      visible: false,
      preload: 4,
      source: new XYZ({
        crossOrigin: 'anonymous',
        url:
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      })
    })
    // Layer to draw features
    let sourceLocal = new VectorSource({ wrapX: false })
    let drawFeaturesLayer = new VectorLayer({
      source: sourceLocal
    })

    this.map = new Map({
      target: this.$refs.olMap,
      layers: [this.aerialLayer, this.roadLayer, drawFeaturesLayer],
      view: new View({
        center: [-0, 0],
        zoom: 1,
        projection: 'EPSG:4326'
      })
    })

    this.extent = new ExtentInteraction({
      boxStyle: new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      }),
      pointerStyle: [
        new Style({
          stroke: new Stroke({
            color: [255, 255, 255, 1],
            width: 5
          })
        }),
        new Style({
          stroke: new Stroke({
            color: [0, 153, 255, 1],
            width: 3
          })
        })
      ]
    })
    this.map.addInteraction(this.extent)
    // Single Location
    this.pointFeature = new Feature({
      geometry: new Point([-0, 0])
    })

    if (this.drawType === 'Box') {
      // Bouding Box
      this.setExtent(false)
      this.map.on('pointerdrag', this.mapEventCallback)
    } else {
      sourceLocal.addFeature(this.pointFeature)
      this.map.on('click', this.mapEventCallback)
      this.extent.setActive(false)
    }

    if (this.value) {
      this.updateMapFeatures()
    }

    this.map.updateSize()
  },
  updated() {
    this.map.updateSize()
    if (this.value) {
      this.updateMapFeatures()
    }
  },

  methods: {
    emitChanges() {
      // can be extended to add more types(multipoint, polygon etc) of features
      let featureType = 'Point'
      if (this.drawType === 'Box') {
        featureType = 'Box'
      }
      this.olMapData = {
        geojson: {
          type: featureType,
          coordinates: this.coordinate
        },
        geohash: Geohash.encode(this.coordinate[1], this.coordinate[0])
      }

      // Emit changes to v-model bind object of the parent component
      Object.assign({}, this.value, this.olMapData)
      this.$emit('input', this.olMapData)

      this.close()
    },
    close() {
      this.setExtent(false)
      this.showDialog = false

      // If editing, rollback to intial value
      if (this.olMapData) {
        this.setCoordinates(
          this.olMapData.geojson.type,
          this.olMapData.geojson.coordinates
        )
      } else {
        this.setCoordinates(this.drawType, [-0, 0])
        this.geocode = null
      }
    },
    deleteLocation() {
      this.setExtent(false)
      this.setCoordinates(this.drawType, [-0, 0])
      this.geocode = null
      // Emit changes to v-model bind object of the parent component
      this.olMapData = null
      Object.assign({}, this.value, this.olMapData)
      this.$emit('input', this.olMapData)
    },
    mapEventCallback(evt) {
      let coordinates
      if (this.drawType === 'Box') {
        coordinates = this.extent.getExtent()
      } else {
        coordinates = evt.coordinate
      }
      this.setCoordinates(this.drawType, coordinates)
    },
    modulo(a, b) {
      let r = a % b
      return r * b < 0 ? r + b : r
    },
    normalizeCoordinate(coordinateIn) {
      if (coordinateIn)
        return coordinateIn.map(
          coordinate => this.modulo(coordinate + 180, 360) - 180
        )
    },
    setCoordinates(type, coordinate) {
      this.coordinate = this.normalizeCoordinate(coordinate)
      if (type === 'Box') {
        this.extent.setExtent(coordinate)
      } else {
        this.pointFeature.getGeometry().setCoordinates(coordinate)
      }
    },
    updateMapFeatures() {
      if (this.value && this.value !== this.olMapData) {
        this.olMapData = this.value
        if (this.olMapData.geojson) {
          this.setCoordinates(
            this.olMapData.geojson.type,
            this.olMapData.geojson.coordinates
          )
        }
      }
    },
    setExtent(enable) {
      enable
        ? (this.map.getTargetElement().style.cursor = 'crosshair')
        : (this.map.getTargetElement().style.cursor = 'default')
      this.enableExtent = enable
      this.extent.setActive(this.enableExtent)
    },
    updateMapBaseLayer(value) {
      this.baseLayer = value
      this.aerialLayer.setVisible(this.baseLayer === 'AerialWithLabels')
      this.roadLayer.setVisible(this.baseLayer === 'Road')
    }
  },
  computed: {
    disableSave() {
      if (this.coordinate) return false
      else return true
    }
  }
}
</script>
<style scoped>
.olMap {
  height: 400px;
  border: 2px solid black;
}
.modal.is-active {
  z-index: 1000;
}

.map-picker-footer {
  justify-content: space-between;
}
</style>
