import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Icon,
  Text
} from 'ol/style.js'

import { RegularShape } from 'ol/style.js'
import LineString from 'ol/geom/LineString'
import MarkerIcon from '@/map/assets/map-marker-alt-solid.svg'
import ms from 'milsymbol'

export default {
  methods: {
    defaultSelectStyle() {
      return new Style({
        image: new RegularShape({
          stroke: new Stroke({ color: 'red', width: 2 }),
          points: 4,
          radius: 40,
          angle: Math.PI / 4
        })
      })
    },
    getDrawStyle(feature) {
      let featureType = feature.get('type') || feature.getGeometry().getType()
      // Override default openlayers blue cursor style
      switch (featureType) {
        case 'LineString':
          return [
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
        case 'MultiPolygon':
        case 'Polygon':
          return [
            new Style({
              fill: new Fill({
                color: [255, 255, 255, 0.5]
              })
            })
          ]
      }
    },
    styleFunction(feature, resolution) {
      let fillColor = feature.get('fillColor') || '#6fa8dc'
      let label = feature.get('label')
      let labelOffsetY = 0
      let borderPatternOptions =
        feature.get('borderPattern') && feature.get('borderPattern') === 'dash'
          ? {
            lineDash: [10, 10],
            lineCap: 'square'
          }
          : undefined
      let strokeOptions = {
        color: feature.get('borderColor') || 'blue',
        width: feature.get('borderWidth') || '3'
      }
      if (borderPatternOptions) {
        strokeOptions = {
          ...strokeOptions,
          ...borderPatternOptions
        }
      }
      let featureType = feature.get('type') || feature.getGeometry().getType()
      let pointCircle = new CircleStyle({
        radius: 5,
        fill: null,
        stroke: new Stroke({ color: 'orange', width: 2 })
      })
      let style
      switch (featureType) {
        case 'Point':
          style = { image: pointCircle }
          break
        case 'MultiPolygon':
        case 'Polygon':
          style = {
            stroke: new Stroke(strokeOptions),
            fill: new Fill({
              color: this.hexToRgbA(fillColor) //append 40 hex (25%) alpha to the color
            })
          }
          break
        case 'MultiLineString':
        case 'LineString':
          style = {
            stroke: new Stroke(strokeOptions)
          }
          break
        case 'Location':
          style = this.getLocationStyle()
          labelOffsetY = 20
          break
        case 'MilSymbol':
          style = this.getMilSymbolStyle(feature.get('SIDC'), resolution)
          labelOffsetY = 35
          break
        case 'Destroy':
          style = {
            stroke: new Stroke(strokeOptions),
            fill: new Fill({
              color: fillColor
            }),
            image: pointCircle
          }
          label = 'D'
          break
        case 'Text':
          return this.getTextStyle(feature.get('text'))
        case 'Arrow':
          return this.getArrowStyle(feature, resolution)
        case 'GenericPoint':
        case 'FriendlyAttack':
        case 'Triangle':
        case 'Star':
        case 'Rectangle':
        case 'Circle':
        case 'Square': {
          style = {
            stroke: new Stroke(strokeOptions),
            fill: new Fill({
              color: this.hexToRgbA(fillColor)
            })
          }
          break
        }
        default:
          style = {
            stroke: new Stroke(strokeOptions),
            fill: new Fill({
              color: fillColor
            }),
            image: pointCircle
          }
          break
      }
      if (label) {
        style = {
          ...style,
          text: this.getShapeLabelStyle(label, labelOffsetY)
        }
      }
      return new Style(style)
    },
    rangeStyleFunction(feature, resolution) {
      let fillColor = feature.get('fillColor') || '#aadc6f'
      let component = feature.get('COMPONENT')
      switch (component) {
        case 'AF Active':
          fillColor = '#6fa8dc'
          break
        case 'Army Active':
          fillColor = '#4b5320'
          break
        case 'Navy Active':
          fillColor = '#000080'
          break
      }
      let label = feature.get('SITE_NAME')
      let labelOffsetY = 0
      let borderPatternOptions =
        feature.get('borderPattern') && feature.get('borderPattern') === 'dash'
          ? {
            lineDash: [10, 10],
            lineCap: 'square'
          }
          : undefined
      let strokeOptions = {
        color: feature.get('borderColor') || 'blue',
        width: feature.get('borderWidth') || '3'
      }
      if (borderPatternOptions) {
        strokeOptions = {
          ...strokeOptions,
          ...borderPatternOptions
        }
      }
      let style = {
        stroke: new Stroke(strokeOptions),
        fill: new Fill({
          color: this.hexToRgbA(fillColor) //append 40 hex (25%) alpha to the color
        })
      }
      if (label) {
        style = {
          ...style,
          text: this.getRangeLabelStyle(label, labelOffsetY, resolution)
        }
      }
      return new Style(style)
    },
    getShapeLabelStyle(text, offsetY) {
      return new Text({
        fill: new Fill({
          color: '#330'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 4
        }),
        text: text,
        font: 'bold 16px "Open Sans", "Arial Unicode MS", "sans-serif"',
        weight: 'bold',
        placement: 'point',
        maxangle: parseFloat(0.7853981633974483),
        overflow: true,
        offsetX: 0,
        offsetY: offsetY,
        color: 'blue',
        outline: '#fff',
        outlineWidth: 3,
        maxreso: 1200
      })
    },
    value_limit(val, min, max) {
      if (val < min) {
        val = min
      } else if (val > max) {
        val = max
      }
      return val
    },
    getRangeLabelStyle(text, offsetY, scale) {
      let textsize = 640 / scale
      textsize = this.value_limit(textsize, '1', '66')
      return new Text({
        fill: new Fill({
          color: '#330'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 4
        }),
        text: text,
        font: `${textsize}px "Open Sans", "Arial Unicode MS", "sans-serif"`,
        weight: 'bold',
        placement: 'polygon',
        maxangle: parseFloat(0.7853981633974483),
        overflow: true,
        offsetX: 0,
        offsetY: offsetY,
        color: 'blue',
        outline: '#fff',
        outlineWidth: 3,
        maxreso: 1200
      })
    },

    getArrowStyle(feature, resolution) {
      let borderColor = feature.get('borderColor') || 'blue'
      let borderWidth = feature.get('borderWidth') || '3'
      let label = feature.get('label')
      let borderPatternOptions =
        feature.get('borderPattern') && feature.get('borderPattern') === 'dash'
          ? {
            lineDash: [10, 10],
            lineCap: 'square'
          }
          : undefined
      let strokeOptions = {
        color: borderColor,
        width: borderWidth
      }
      if (borderPatternOptions) {
        strokeOptions = {
          ...strokeOptions,
          ...borderPatternOptions
        }
      }
      let styleOption = {
        stroke: new Stroke(strokeOptions)
      }
      if (label) {
        styleOption = {
          ...styleOption,
          text: this.getShapeLabelStyle(label, 0)
        }
      }

      let styles = [new Style(styleOption)]
      let geometry = feature.getGeometry()
      geometry.forEachSegment((start, end) => {
        // Only draw arrow on the last segment
        if (end[0] === feature.getGeometry().getLastCoordinate()[0]) {
          let dx = end[0] - start[0]
          let dy = end[1] - start[1]
          let rotation = Math.atan2(dy, dx)
          let lineStr1 = new LineString([
            end,
            [end[0] - 10 * resolution, end[1] + 10 * resolution]
          ])
          lineStr1.rotate(rotation, end)

          let lineStr2 = new LineString([
            end,
            [end[0] - 10 * resolution, end[1] - 10 * resolution]
          ])
          lineStr2.rotate(rotation, end)

          let stroke = new Stroke({
            color: borderColor,
            width: borderWidth
          })

          styles.push(
            new Style({
              geometry: lineStr1,
              stroke: stroke
            })
          )
          styles.push(
            new Style({
              geometry: lineStr2,
              stroke: stroke
            })
          )
        }
      })

      return styles
    },
    getMilSymbolStyle(sidc, resolution) {
      let iconSize = 35
      if (resolution > 4000) iconSize = 20
      else if (resolution < 4000 && resolution > 2000) iconSize = 25
      else if (resolution < 2000 && resolution > 500) iconSize = 30
      else iconSize = 35

      let ratio = window.devicePixelRatio || 1
      let mysymbol = new ms.Symbol(sidc, {
        size: iconSize
      })
      // Now that we have a symbol we can  ask for the echelon and set the symbol size
      let mycanvas = mysymbol.asCanvas()
      return {
        image: new Icon({
          scale: 1 / ratio,
          anchor: [mysymbol.getAnchor().x, mysymbol.getAnchor().y],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          imgSize: [
            Math.floor(mysymbol.getSize().width),
            Math.floor(mysymbol.getSize().height)
          ],
          img: mycanvas
        })
      }
    },
    getTextStyle(text) {
      return new Style({
        text: new Text({
          font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
          fill: new Fill({
            color: '#330'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 4
          }),
          text: text
        })
      })
    },
    getLocationStyle() {
      return {
        image: new Icon(
          /** @type {module:ol/style/Icon~Options} */({
            src: MarkerIcon,
            color: '#007aff',
            scale: 0.3
          })
        )
      }
    },
    getMilSymbol(sidc) {
      return new ms.Symbol(sidc, {
        size: 35
      })
    },
    getMilSymbolIcon(sidc) {
      let mysymbol = new ms.Symbol(sidc, {
        size: 35
      })
      return mysymbol.toDataURL()
    },
    hexToRgbA(hex) {
      let c
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('')
        if (c.length == 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = '0x' + c.join('')
        return (
          'rgba(' +
          [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
          ',0.4)'
        )
      }
    }
  }
}
