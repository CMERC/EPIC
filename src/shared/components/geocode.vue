<template>
  <div v-if="mapLocationName">
    <slot v-if="display=='tooltip'">
      <span :class="'icon is-small tooltip '+tooltipLocation"
            :data-tooltip="mapLocationName.formatted">
        <i :class="tooltipIcon"></i>
      </span>
    </slot>
    <slot v-else-if="display=='inline'">
      <span class="icon is-medium is-left"><i :class="icon + ' has-text-grey'"></i></span>
      <span class="subtitle is-7">{{mapLocationName.name}},
        {{mapLocationName.admin1.name}}, {{mapLocationName.country.name}}</span>
    </slot>
    <slot v-else>
      <p v-if="mapLocationName.name"><span class="title is-6">{{mapLocationName.name}}</span>, <br />
        {{mapLocationName.admin1.name}}, {{mapLocationName.country.name}}
      </p>
      <p class="title is-6"
         v-else>No Location Name</p>
    </slot>
  </div>
</template>

<script>
import Polygon from 'ol/geom/Polygon'
import { MapLocationName } from '@/shared/graphql/Geocode.gql'
export default {
  name: 'geocode',
  props: {
    type: {
      default: 'Point'
    },
    icon: {
      default: 'fas fa-location-arrow'
    },
    tooltipIcon: {
      default: 'fas fa-map-marked-alt'
    },
    coordinates: {},
    tooltipLocation: {
      default: 'is-tooltip-top'
    },
    display: {
      default: 'block'
    }
  },
  apollo: {
    mapLocationName: {
      query: MapLocationName,
      variables() {
        let data = this.averageCoordinates()
        return {
          latitude: data[1],
          longitude: data[0]
        }
      }
    }
  },
  methods: {
    averageCoordinates() {
      let data = this.coordinates
      switch (this.type) {
        case 'Polygon': {
          let poly = new Polygon(this.coordinates)
          data = this.getCenter(poly.getExtent())
          break
        }
        default: {
          break
        }
      }

      return data
    },
    getCenter(extent) {
      return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
    }
  }
}
</script>
