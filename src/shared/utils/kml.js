function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function coordinateString(ring) {
  return ring
    .map(point => `${Number(point[0])},${Number(point[1])},0`)
    .join(' ')
}

function polygonKml(polygon) {
  const coordinates = polygon.coordinates || []
  const outerRing = coordinates[0] || []
  const innerRings = coordinates.slice(1)

  return `<Polygon><outerBoundaryIs><LinearRing><coordinates>${coordinateString(
    outerRing
  )}</coordinates></LinearRing></outerBoundaryIs>${innerRings
    .map(
      ring =>
        `<innerBoundaryIs><LinearRing><coordinates>${coordinateString(
          ring
        )}</coordinates></LinearRing></innerBoundaryIs>`
    )
    .join('')}</Polygon>`
}

export function geojsonToKml(geojson, name = 'EPIC export') {
  if (!geojson) {
    throw new Error('GeoJSON is required for this export.')
  }

  if (geojson.type === 'Box' && Array.isArray(geojson.coordinates)) {
    const [west, south, east, north] = geojson.coordinates.map(Number)
    geojson = {
      type: 'Polygon',
      coordinates: [
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south]
        ]
      ]
    }
  }

  if (geojson.type !== 'Polygon') {
    throw new Error('Only Polygon and Box GeoJSON are supported for this export.')
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(name)}</name>
    <Placemark>
      <name>${escapeXml(name)}</name>
      ${polygonKml(geojson)}
    </Placemark>
  </Document>
</kml>`
}
