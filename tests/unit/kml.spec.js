import { geojsonToKml } from '@/shared/utils/kml'

describe('kml utilities', () => {
  it('exports Box bounds as a KML polygon', () => {
    const kml = geojsonToKml(
      {
        type: 'Box',
        coordinates: [-10, 20, 30, 40]
      },
      'Bounds'
    )

    expect(kml).toContain('<name>Bounds</name>')
    expect(kml).toContain('-10,20,0 30,20,0 30,40,0 -10,40,0 -10,20,0')
  })
})
