const mapLayer = {
  async duplicateMapLayer(parent, args, ctx, info) {
    let mapLayer = await ctx.db.query.mapLayer(args, '{ title type geojson }')
    return await ctx.db.mutation.createMapLayer({ data: { title: 'Copy of ' + mapLayer.title, type: mapLayer.type, geojson: mapLayer.geojson } }, info)
  }
}

module.exports = { mapLayer }