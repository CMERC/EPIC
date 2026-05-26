import { transform } from 'ol/proj'
import {
  boundingExtent,
  getBottomLeft,
  getBottomRight,
  getTopLeft,
  getTopRight
} from 'ol/extent.js'
import LineString from 'ol/geom/LineString'
import Polygon from 'ol/geom/Polygon'
export default {
  methods: {
    tranformCoordinates(points, from, to) {
      let transformedCoordinates = []
      for (let i = 0; i < points.length; i++) {
        transformedCoordinates.push(transform(points[i], from, to))
      }
      return transformedCoordinates
    },
    pointBetween(p1, p2, f) {
      return new LineString([p1, p2]).getCoordinateAt(f)
    },
    distanceBetween(p1, p2) {
      return new LineString([p1, p2]).getLength()
    },
    getGenericPointGeometry(coordinates, geometry) {
      let extent = boundingExtent(coordinates)
      let boxCoordinates = [
        getBottomLeft(extent),
        getBottomRight(extent),
        getTopRight(extent),
        getTopLeft(extent),
        getBottomLeft(extent)
      ]
      // use 0.5 for middlePoint
      let middlePoint = this.pointBetween(
        boxCoordinates[1],
        boxCoordinates[0],
        0.5
      )
      let dist = this.distanceBetween(middlePoint, boxCoordinates[0])
      let trianglePointer = [middlePoint[0], middlePoint[1] - dist]
      let newCoordinates = [
        trianglePointer,
        boxCoordinates[0],
        boxCoordinates[1],
        boxCoordinates[2],
        boxCoordinates[3],
        boxCoordinates[0],
        boxCoordinates[1],
        trianglePointer
      ]
      if (!geometry) {
        geometry = new Polygon([newCoordinates])
      } else {
        geometry.setCoordinates([newCoordinates])
      }
      return geometry
    },
    getDestroyGeometry(coordinates, geometry) {
      let extent = boundingExtent(coordinates)
      let boxCoordinates = [
        getBottomLeft(extent),
        getBottomRight(extent),
        getTopRight(extent),
        getTopLeft(extent),
        getBottomLeft(extent)
      ]
      let middlePoint = this.pointBetween(
        boxCoordinates[0],
        boxCoordinates[2],
        0.5
      )
      let newCoordinates = [
        boxCoordinates[3],
        boxCoordinates[1],
        middlePoint,
        boxCoordinates[2],
        boxCoordinates[0]
      ]
      if (!geometry) {
        geometry = new LineString(newCoordinates)
      } else {
        geometry.setCoordinates(newCoordinates)
      }
      return geometry
    },
    getStarGeometry(coordinates, geometry) {
      let center = coordinates[0]
      let last = coordinates[1]
      let dx = center[0] - last[0]
      let dy = center[1] - last[1]
      let radius = Math.sqrt(dx * dx + dy * dy)
      let rotation = Math.atan2(dy, dx)
      let newCoordinates = []

      // Increase numPoints to add more sides to start
      let numPoints = 10
      for (let i = 0; i < numPoints; ++i) {
        let angle = rotation + (i * 2 * Math.PI) / numPoints
        let fraction = i % 2 === 0 ? 1 : 0.5
        let offsetX = radius * fraction * Math.cos(angle)
        let offsetY = radius * fraction * Math.sin(angle)
        newCoordinates.push([center[0] + offsetX, center[1] + offsetY])
      }
      newCoordinates.push(newCoordinates[0].slice())
      if (!geometry) {
        geometry = new Polygon([newCoordinates])
      } else {
        geometry.setCoordinates([newCoordinates])
      }
      return geometry
    },
    getFriendlyAttackGeometry(coordinates, geometry) {
      let extent = boundingExtent(coordinates)
      let boxCoordinates = [
        getBottomLeft(extent),
        getBottomRight(extent),
        getTopRight(extent),
        getTopLeft(extent),
        getBottomLeft(extent)
      ]
      // use 0.5 for middlePoint
      let middlePoint = this.pointBetween(
        boxCoordinates[2],
        boxCoordinates[3],
        0.5
      )
      let dist = this.distanceBetween(middlePoint, boxCoordinates[3])
      let trianglePointer = [middlePoint[0], middlePoint[1] + dist]
      // arrow bottom left and right
      let trianglePointerRight = [
        boxCoordinates[2][0] + dist / 2,
        boxCoordinates[2][1]
      ]
      let trianglePointerLeft = [
        boxCoordinates[3][0] - dist / 2,
        boxCoordinates[3][1]
      ]
      let newCoordinates = [
        boxCoordinates[0],
        boxCoordinates[3],
        trianglePointerLeft,
        trianglePointer,
        trianglePointer,
        trianglePointerRight,
        boxCoordinates[2],
        boxCoordinates[1]
      ]
      if (!geometry) {
        geometry = new LineString(newCoordinates)
      } else {
        geometry.setCoordinates(newCoordinates)
      }
      return geometry
    }
  }
}
