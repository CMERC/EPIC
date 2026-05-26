// /geocode?longitude=12.49&latitude=41.89
const geocoder = require('offline-geocoder')({ database: './data/geodata.sqlite' })

const geocode = {
  async mapLocationName(parent, args, ctx) {
    let latitude = parseFloat(args.latitude)
    let longitude = parseFloat(args.longitude)

    let result = await geocoder.reverse(latitude, longitude)

    return result
  }
}

module.exports = {
  geocode
}