
<template>
  <div class="cesium-map-container">
    <nav class="level floater">
      <div class="level-left"></div>
      <div class="level-right">
        <div class="level-item">
          <nav class="breadcrumb breadMenu">
            <ul>
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-white">
                    Map Type
                  </label>
                </div>
                <div class="field-body">
                  <div class="field is-horizontal">
                    <div class="select">
                      <select v-model="mapType"
                              @change="updateMapBaseLayer">
                        <option v-for="baseLayer in customBaseLayers"
                                :value="baseLayer.dbkey"
                                :key="baseLayer.dbkey">
                          {{baseLayer.label}}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </nav>
    <div class="helper floater">
      <help-content :reference="'map.globe'"
                    toggle
                    dropup />
    </div>
    <div id="map"
         class="map"></div>
  </div>
</template>

<script>
import { Map, View } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import XYZ from 'ol/source/XYZ'
import OLCesium from 'olcs/OLCesium.js'

import HelpContent from '@/shared/components/helpcontent'
export default {
  name: 'CesiumMap',
  components: {
    HelpContent
  },
  data() {
    return {
      mapType: 'SATELLITEWITHLABELS',
      olMap: null,
      customBaseLayers: [
        {
          label: 'Map',
          dbkey: 'MAP',
          url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        {
          label: 'Satellite',
          dbkey: 'SATELLITE',
          url:
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        },
        {
          label: 'Satellite with Labels',
          dbkey: 'SATELLITEWITHLABELS',
          url:
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        }
      ],
      mapBaseLayers: [],
      ol3dMap: null
    }
  },

  mounted() {
    // Keyless basemap layers for local evaluation.
    for (
      let layerIndex = 0;
      layerIndex < this.customBaseLayers.length;
      layerIndex++
    ) {
      this.mapBaseLayers.push(
        new TileLayer({
          visible: false,
          preload: 4,
          source: new XYZ({
            crossOrigin: 'anonymous',
            url: this.customBaseLayers[layerIndex].url
          })
        })
      )
    }
    // Init Map
    this.olMap = new Map({
      layers: [...this.mapBaseLayers],
      target: document.getElementById('map'),
      view: new View({
        center: [-0, 0],
        zoom: 2.5,
        maxZoom: 20
      })
    })
    this.ol3dMap = new OLCesium({ map: this.olMap }) // ol2dMap is the ol.Map instance
    this.ol3dMap.setEnabled(true)
    this.updateMapBaseLayer()
  },
  methods: {
    updateMapBaseLayer() {
      for (let i = 0; i < this.mapBaseLayers.length; i++) {
        this.mapBaseLayers[i].setVisible(
          this.customBaseLayers[i].dbkey === this.mapType
        )
      }
      this.updateCesiumImagery()
    },
    updateCesiumImagery() {
      if (!this.ol3dMap || !window.Cesium) return

      const baseLayer = this.customBaseLayers.find(
        layer => layer.dbkey === this.mapType
      )
      if (!baseLayer) return

      const scene = this.ol3dMap.getCesiumScene()
      const layers = scene.imageryLayers
      while (layers.length > 0) layers.remove(layers.get(0), false)

      layers.addImageryProvider(
        new window.Cesium.UrlTemplateImageryProvider({
          url: baseLayer.url.replace('{a-c}', 'a'),
          credit: baseLayer.label
        })
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.cesium-map-container {
  .level {
    margin-top: 10px;
    margin-bottom: 0px;
  }
  .helper {
    bottom: 50px;
    .helperComponent {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  .floater {
    position: absolute;
    right: 5px;
    z-index: 15000;
  }
  .map {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 52px);
  }
}
</style>
