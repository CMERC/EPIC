(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[674],{

/***/ 251:
/***/ (function(__unused_webpack_module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 54970:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   V: function() { return /* binding */ transformWithOptions; }
/* harmony export */ });
/* harmony import */ var _obj_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53495);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(94092);
/* harmony import */ var _proj_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(98108);
/**
 * @module ol/format/Feature
 */





/**
 * @typedef {Object} ReadOptions
 * @property {import("../proj.js").ProjectionLike} [dataProjection] Projection of the data we are reading.
 * If not provided, the projection will be derived from the data (where possible) or
 * the `dataProjection` of the format is assigned (where set). If the projection
 * can not be derived from the data and if no `dataProjection` is set for a format,
 * the features will not be reprojected.
 * @property {import("../extent.js").Extent} [extent] Tile extent of the tile being read. This is only used and
 * required for {@link module:ol/format/MVT}.
 * @property {import("../proj.js").ProjectionLike} [featureProjection] Projection of the feature geometries
 * created by the format reader. If not provided, features will be returned in the
 * `dataProjection`.
 */


/**
 * @typedef {Object} WriteOptions
 * @property {import("../proj.js").ProjectionLike} [dataProjection] Projection of the data we are writing.
 * If not provided, the `dataProjection` of the format is assigned (where set).
 * If no `dataProjection` is set for a format, the features will be returned
 * in the `featureProjection`.
 * @property {import("../proj.js").ProjectionLike} [featureProjection] Projection of the feature geometries
 * that will be serialized by the format writer. If not provided, geometries are assumed
 * to be in the `dataProjection` if that is set; in other words, they are not transformed.
 * @property {boolean} [rightHanded] When writing geometries, follow the right-hand
 * rule for linear ring orientation.  This means that polygons will have counter-clockwise
 * exterior rings and clockwise interior rings.  By default, coordinates are serialized
 * as they are provided at construction.  If `true`, the right-hand rule will
 * be applied.  If `false`, the left-hand rule will be applied (clockwise for
 * exterior and counter-clockwise for interior rings).  Note that not all
 * formats support this.  The GeoJSON format does use this property when writing
 * geometries.
 * @property {number} [decimals] Maximum number of decimal places for coordinates.
 * Coordinates are stored internally as floats, but floating-point arithmetic can create
 * coordinates with a large number of decimal places, not generally wanted on output.
 * Set a number here to round coordinates. Can also be used to ensure that
 * coordinates read in can be written back out with the same number of decimals.
 * Default is no rounding.
 */


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for feature formats.
 * {FeatureFormat} subclasses provide the ability to decode and encode
 * {@link module:ol/Feature~Feature} objects from a variety of commonly used geospatial
 * file formats.  See the documentation for each format for more details.
 *
 * @abstract
 * @api
 */
var FeatureFormat = function FeatureFormat() {

  /**
   * @protected
   * @type {import("../proj/Projection.js").default}
   */
  this.dataProjection = null;

  /**
   * @protected
   * @type {import("../proj/Projection.js").default}
   */
  this.defaultFeatureProjection = null;

};

/**
 * Adds the data projection to the read options.
 * @param {Document|Node|Object|string} source Source.
 * @param {ReadOptions=} opt_options Options.
 * @return {ReadOptions|undefined} Options.
 * @protected
 */
FeatureFormat.prototype.getReadOptions = function getReadOptions (source, opt_options) {
  var options;
  if (opt_options) {
    options = {
      dataProjection: opt_options.dataProjection ?
        opt_options.dataProjection : this.readProjection(source),
      featureProjection: opt_options.featureProjection
    };
  }
  return this.adaptOptions(options);
};

/**
 * Sets the `dataProjection` on the options, if no `dataProjection`
 * is set.
 * @param {WriteOptions|ReadOptions|undefined} options
 *   Options.
 * @protected
 * @return {WriteOptions|ReadOptions|undefined}
 *   Updated options.
 */
FeatureFormat.prototype.adaptOptions = function adaptOptions (options) {
  return (0,_obj_js__WEBPACK_IMPORTED_MODULE_0__/* .assign */ .kp)({
    dataProjection: this.dataProjection,
    featureProjection: this.defaultFeatureProjection
  }, options);
};

/**
 * Get the extent from the source of the last {@link readFeatures} call.
 * @return {import("../extent.js").Extent} Tile extent.
 */
FeatureFormat.prototype.getLastExtent = function getLastExtent () {
  return null;
};

/**
 * @abstract
 * @return {import("./FormatType.js").default} Format.
 */
FeatureFormat.prototype.getType = function getType () {
  return (0,_util_js__WEBPACK_IMPORTED_MODULE_1__/* .abstract */ .b0)();
};

/**
 * Read a single feature from a source.
 *
 * @abstract
 * @param {Document|Node|Object|string} source Source.
 * @param {ReadOptions=} opt_options Read options.
 * @return {import("../Feature.js").FeatureLike} Feature.
 */
FeatureFormat.prototype.readFeature = function readFeature (source, opt_options) {
  return (0,_util_js__WEBPACK_IMPORTED_MODULE_1__/* .abstract */ .b0)();
};

/**
 * Read all features from a source.
 *
 * @abstract
 * @param {Document|Node|ArrayBuffer|Object|string} source Source.
 * @param {ReadOptions=} opt_options Read options.
 * @return {Array<import("../Feature.js").FeatureLike>} Features.
 */
FeatureFormat.prototype.readFeatures = function readFeatures (source, opt_options) {
  return (0,_util_js__WEBPACK_IMPORTED_MODULE_1__/* .abstract */ .b0)();
};

/**
 * Read a single geometry from a source.
 *
 * @abstract
 * @param {Document|Node|Object|string} source Source.
 * @param {ReadOptions=} opt_options Read options.
 * @return {import("../geom/Geometry.js").default} Geometry.
 */
FeatureFormat.prototype.readGeometry = function readGeometry (source, opt_options) {
  return (0,_util_js__WEBPACK_IMPORTED_MODULE_1__/* .abstract */ .b0)();
};

/**
 * Read the projection from a source.
 *
 * @abstract
 * @param {Document|Node|Object|string} source Source.
 * @return {import("../proj/Projection.js").default} Projection.
 */
FeatureFormat.prototype.readProjection = function readProjection (source) {
  return (0,_util_js__WEBPACK_IMPORTED_MODULE_1__/* .abstract */ .b0)();
};

/**
 * Encode a feature in this format.
 *
 * @abstract
 * @param {import("../Feature.js").default} feature Feature.
 * @param {WriteOptions=} opt_options Write options.
 * @return {string} Result.
 */
FeatureFormat.prototype.writeFeature = function writeFeature (feature, opt_options) {
  return (0,_util_js__WEBPACK_IMPORTED_MODULE_1__/* .abstract */ .b0)();
};

/**
 * Encode an array of features in this format.
 *
 * @abstract
 * @param {Array<import("../Feature.js").default>} features Features.
 * @param {WriteOptions=} opt_options Write options.
 * @return {string} Result.
 */
FeatureFormat.prototype.writeFeatures = function writeFeatures (features, opt_options) {
  return (0,_util_js__WEBPACK_IMPORTED_MODULE_1__/* .abstract */ .b0)();
};

/**
 * Write a single geometry in this format.
 *
 * @abstract
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {WriteOptions=} opt_options Write options.
 * @return {string} Result.
 */
FeatureFormat.prototype.writeGeometry = function writeGeometry (geometry, opt_options) {
  return (0,_util_js__WEBPACK_IMPORTED_MODULE_1__/* .abstract */ .b0)();
};

/* harmony default export */ __webpack_exports__.A = (FeatureFormat);

/**
 * @param {import("../geom/Geometry.js").default|import("../extent.js").Extent} geometry Geometry.
 * @param {boolean} write Set to true for writing, false for reading.
 * @param {(WriteOptions|ReadOptions)=} opt_options Options.
 * @return {import("../geom/Geometry.js").default|import("../extent.js").Extent} Transformed geometry.
 */
function transformWithOptions(geometry, write, opt_options) {
  var featureProjection = opt_options ?
    (0,_proj_js__WEBPACK_IMPORTED_MODULE_2__/* .get */ .Jt)(opt_options.featureProjection) : null;
  var dataProjection = opt_options ?
    (0,_proj_js__WEBPACK_IMPORTED_MODULE_2__/* .get */ .Jt)(opt_options.dataProjection) : null;
  /**
   * @type {import("../geom/Geometry.js").default|import("../extent.js").Extent}
   */
  var transformed;
  if (featureProjection && dataProjection &&
      !(0,_proj_js__WEBPACK_IMPORTED_MODULE_2__/* .equivalent */ .tI)(featureProjection, dataProjection)) {
    if (Array.isArray(geometry)) {
      // FIXME this is necessary because GML treats extents
      // as geometries
      transformed = (0,_proj_js__WEBPACK_IMPORTED_MODULE_2__/* .transformExtent */ .DI)(
        geometry,
        dataProjection,
        featureProjection);
    } else {
      transformed = (write ? /** @type {import("../geom/Geometry").default} */ (geometry).clone() : geometry).transform(
        write ? featureProjection : dataProjection,
        write ? dataProjection : featureProjection);
    }
  } else {
    transformed = geometry;
  }
  if (write && opt_options && /** @type {WriteOptions} */ (opt_options).decimals !== undefined &&
    !Array.isArray(transformed)) {
    var power = Math.pow(10, /** @type {WriteOptions} */ (opt_options).decimals);
    // if decimals option on write, round each coordinate appropriately
    /**
     * @param {Array<number>} coordinates Coordinates.
     * @return {Array<number>} Transformed coordinates.
     */
    var transform = function(coordinates) {
      for (var i = 0, ii = coordinates.length; i < ii; ++i) {
        coordinates[i] = Math.round(coordinates[i] * power) / power;
      }
      return coordinates;
    };
    if (transformed === geometry) {
      transformed = /** @type {import("../geom/Geometry").default} */ (geometry).clone();
    }
    transformed.applyTransform(transform);
  }
  return transformed;
}

//# sourceMappingURL=Feature.js.map

/***/ }),

/***/ 52820:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19487);
/* harmony import */ var _extent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85752);
/* harmony import */ var _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(96269);
/* harmony import */ var _GeometryType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11635);
/* harmony import */ var _SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(57029);
/* harmony import */ var _flat_closest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(98004);
/* harmony import */ var _flat_deflate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(89564);
/* harmony import */ var _flat_inflate_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1072);
/* harmony import */ var _flat_interpolate_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(39608);
/* harmony import */ var _flat_intersectsextent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(49373);
/* harmony import */ var _flat_length_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(77903);
/* harmony import */ var _flat_segments_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(51949);
/* harmony import */ var _flat_simplify_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(73468);
/**
 * @module ol/geom/LineString
 */














/**
 * @classdesc
 * Linestring geometry.
 *
 * @api
 */
var LineString = /*@__PURE__*/(function (SimpleGeometry) {
  function LineString(coordinates, opt_layout) {

    SimpleGeometry.call(this);

    /**
     * @private
     * @type {import("../coordinate.js").Coordinate}
     */
    this.flatMidpoint_ = null;

    /**
     * @private
     * @type {number}
     */
    this.flatMidpointRevision_ = -1;

    /**
     * @private
     * @type {number}
     */
    this.maxDelta_ = -1;

    /**
     * @private
     * @type {number}
     */
    this.maxDeltaRevision_ = -1;

    if (opt_layout !== undefined && !Array.isArray(coordinates[0])) {
      this.setFlatCoordinates(opt_layout, /** @type {Array<number>} */ (coordinates));
    } else {
      this.setCoordinates(/** @type {Array<import("../coordinate.js").Coordinate>} */ (coordinates), opt_layout);
    }

  }

  if ( SimpleGeometry ) LineString.__proto__ = SimpleGeometry;
  LineString.prototype = Object.create( SimpleGeometry && SimpleGeometry.prototype );
  LineString.prototype.constructor = LineString;

  /**
   * Append the passed coordinate to the coordinates of the linestring.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @api
   */
  LineString.prototype.appendCoordinate = function appendCoordinate (coordinate) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = coordinate.slice();
    } else {
      (0,_array_js__WEBPACK_IMPORTED_MODULE_0__/* .extend */ .X$)(this.flatCoordinates, coordinate);
    }
    this.changed();
  };

  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @override
   * @api
   */
  LineString.prototype.clone = function clone () {
    return new LineString(this.flatCoordinates.slice(), this.layout);
  };

  /**
   * @inheritDoc
   */
  LineString.prototype.closestPointXY = function closestPointXY (x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < (0,_extent_js__WEBPACK_IMPORTED_MODULE_1__/* .closestSquaredDistanceXY */ .Ld)(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt((0,_flat_closest_js__WEBPACK_IMPORTED_MODULE_5__/* .maxSquaredDelta */ .MD)(
        this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
      this.maxDeltaRevision_ = this.getRevision();
    }
    return (0,_flat_closest_js__WEBPACK_IMPORTED_MODULE_5__/* .assignClosestPoint */ .n)(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
  };

  /**
   * Iterate over each segment, calling the provided callback.
   * If the callback returns a truthy value the function returns that
   * value immediately. Otherwise the function returns `false`.
   *
   * @param {function(this: S, import("../coordinate.js").Coordinate, import("../coordinate.js").Coordinate): T} callback Function
   *     called for each segment.
   * @return {T|boolean} Value.
   * @template T,S
   * @api
   */
  LineString.prototype.forEachSegment = function forEachSegment$1 (callback) {
    return (0,_flat_segments_js__WEBPACK_IMPORTED_MODULE_11__/* .forEach */ .j)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, callback);
  };

  /**
   * Returns the coordinate at `m` using linear interpolation, or `null` if no
   * such coordinate exists.
   *
   * `opt_extrapolate` controls extrapolation beyond the range of Ms in the
   * MultiLineString. If `opt_extrapolate` is `true` then Ms less than the first
   * M will return the first coordinate and Ms greater than the last M will
   * return the last coordinate.
   *
   * @param {number} m M.
   * @param {boolean=} opt_extrapolate Extrapolate. Default is `false`.
   * @return {import("../coordinate.js").Coordinate} Coordinate.
   * @api
   */
  LineString.prototype.getCoordinateAtM = function getCoordinateAtM (m, opt_extrapolate) {
    if (this.layout != _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.XYM &&
        this.layout != _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.XYZM) {
      return null;
    }
    var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
    return (0,_flat_interpolate_js__WEBPACK_IMPORTED_MODULE_8__/* .lineStringCoordinateAtM */ .gr)(this.flatCoordinates, 0,
      this.flatCoordinates.length, this.stride, m, extrapolate);
  };

  /**
   * Return the coordinates of the linestring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @override
   * @api
   */
  LineString.prototype.getCoordinates = function getCoordinates () {
    return (0,_flat_inflate_js__WEBPACK_IMPORTED_MODULE_7__/* .inflateCoordinates */ .n2)(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
  };

  /**
   * Return the coordinate at the provided fraction along the linestring.
   * The `fraction` is a number between 0 and 1, where 0 is the start of the
   * linestring and 1 is the end.
   * @param {number} fraction Fraction.
   * @param {import("../coordinate.js").Coordinate=} opt_dest Optional coordinate whose values will
   *     be modified. If not provided, a new coordinate will be returned.
   * @return {import("../coordinate.js").Coordinate} Coordinate of the interpolated point.
   * @api
   */
  LineString.prototype.getCoordinateAt = function getCoordinateAt (fraction, opt_dest) {
    return (0,_flat_interpolate_js__WEBPACK_IMPORTED_MODULE_8__/* .interpolatePoint */ .SH)(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      fraction, opt_dest);
  };

  /**
   * Return the length of the linestring on projected plane.
   * @return {number} Length (on projected plane).
   * @api
   */
  LineString.prototype.getLength = function getLength () {
    return (0,_flat_length_js__WEBPACK_IMPORTED_MODULE_10__/* .lineStringLength */ .k)(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
  };

  /**
   * @return {Array<number>} Flat midpoint.
   */
  LineString.prototype.getFlatMidpoint = function getFlatMidpoint () {
    if (this.flatMidpointRevision_ != this.getRevision()) {
      this.flatMidpoint_ = this.getCoordinateAt(0.5, this.flatMidpoint_);
      this.flatMidpointRevision_ = this.getRevision();
    }
    return this.flatMidpoint_;
  };

  /**
   * @inheritDoc
   */
  LineString.prototype.getSimplifiedGeometryInternal = function getSimplifiedGeometryInternal (squaredTolerance) {
    var simplifiedFlatCoordinates = [];
    simplifiedFlatCoordinates.length = (0,_flat_simplify_js__WEBPACK_IMPORTED_MODULE_12__/* .douglasPeucker */ .P4)(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      squaredTolerance, simplifiedFlatCoordinates, 0);
    return new LineString(simplifiedFlatCoordinates, _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.XY);
  };

  /**
   * @inheritDoc
   * @api
   */
  LineString.prototype.getType = function getType () {
    return _GeometryType_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.LINE_STRING;
  };

  /**
   * @inheritDoc
   * @api
   */
  LineString.prototype.intersectsExtent = function intersectsExtent (extent) {
    return (0,_flat_intersectsextent_js__WEBPACK_IMPORTED_MODULE_9__/* .intersectsLineString */ .gp)(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      extent);
  };

  /**
   * Set the coordinates of the linestring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {GeometryLayout=} opt_layout Layout.
   * @override
   * @api
   */
  LineString.prototype.setCoordinates = function setCoordinates (coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = (0,_flat_deflate_js__WEBPACK_IMPORTED_MODULE_6__/* .deflateCoordinates */ .z2)(
      this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  };

  return LineString;
}(_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Ay));


/* harmony default export */ __webpack_exports__.A = (LineString);

//# sourceMappingURL=LineString.js.map

/***/ }),

/***/ 32817:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19487);
/* harmony import */ var _extent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85752);
/* harmony import */ var _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(96269);
/* harmony import */ var _GeometryType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11635);
/* harmony import */ var _LineString_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(52820);
/* harmony import */ var _SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(57029);
/* harmony import */ var _flat_closest_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(98004);
/* harmony import */ var _flat_deflate_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(89564);
/* harmony import */ var _flat_inflate_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1072);
/* harmony import */ var _flat_interpolate_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(39608);
/* harmony import */ var _flat_intersectsextent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(49373);
/* harmony import */ var _flat_simplify_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(73468);
/**
 * @module ol/geom/MultiLineString
 */













/**
 * @classdesc
 * Multi-linestring geometry.
 *
 * @api
 */
var MultiLineString = /*@__PURE__*/(function (SimpleGeometry) {
  function MultiLineString(coordinates, opt_layout, opt_ends) {

    SimpleGeometry.call(this);

    /**
     * @type {Array<number>}
     * @private
     */
    this.ends_ = [];

    /**
     * @private
     * @type {number}
     */
    this.maxDelta_ = -1;

    /**
     * @private
     * @type {number}
     */
    this.maxDeltaRevision_ = -1;

    if (Array.isArray(coordinates[0])) {
      this.setCoordinates(/** @type {Array<Array<import("../coordinate.js").Coordinate>>} */ (coordinates), opt_layout);
    } else if (opt_layout !== undefined && opt_ends) {
      this.setFlatCoordinates(opt_layout, /** @type {Array<number>} */ (coordinates));
      this.ends_ = opt_ends;
    } else {
      var layout = this.getLayout();
      var lineStrings = /** @type {Array<LineString>} */ (coordinates);
      var flatCoordinates = [];
      var ends = [];
      for (var i = 0, ii = lineStrings.length; i < ii; ++i) {
        var lineString = lineStrings[i];
        if (i === 0) {
          layout = lineString.getLayout();
        }
        (0,_array_js__WEBPACK_IMPORTED_MODULE_0__/* .extend */ .X$)(flatCoordinates, lineString.getFlatCoordinates());
        ends.push(flatCoordinates.length);
      }
      this.setFlatCoordinates(layout, flatCoordinates);
      this.ends_ = ends;
    }

  }

  if ( SimpleGeometry ) MultiLineString.__proto__ = SimpleGeometry;
  MultiLineString.prototype = Object.create( SimpleGeometry && SimpleGeometry.prototype );
  MultiLineString.prototype.constructor = MultiLineString;

  /**
   * Append the passed linestring to the multilinestring.
   * @param {LineString} lineString LineString.
   * @api
   */
  MultiLineString.prototype.appendLineString = function appendLineString (lineString) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = lineString.getFlatCoordinates().slice();
    } else {
      (0,_array_js__WEBPACK_IMPORTED_MODULE_0__/* .extend */ .X$)(this.flatCoordinates, lineString.getFlatCoordinates().slice());
    }
    this.ends_.push(this.flatCoordinates.length);
    this.changed();
  };

  /**
   * Make a complete copy of the geometry.
   * @return {!MultiLineString} Clone.
   * @override
   * @api
   */
  MultiLineString.prototype.clone = function clone () {
    return new MultiLineString(this.flatCoordinates.slice(), this.layout, this.ends_.slice());
  };

  /**
   * @inheritDoc
   */
  MultiLineString.prototype.closestPointXY = function closestPointXY (x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < (0,_extent_js__WEBPACK_IMPORTED_MODULE_1__/* .closestSquaredDistanceXY */ .Ld)(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt((0,_flat_closest_js__WEBPACK_IMPORTED_MODULE_6__/* .arrayMaxSquaredDelta */ .HX)(
        this.flatCoordinates, 0, this.ends_, this.stride, 0));
      this.maxDeltaRevision_ = this.getRevision();
    }
    return (0,_flat_closest_js__WEBPACK_IMPORTED_MODULE_6__/* .assignClosestArrayPoint */ .oW)(
      this.flatCoordinates, 0, this.ends_, this.stride,
      this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
  };

  /**
   * Returns the coordinate at `m` using linear interpolation, or `null` if no
   * such coordinate exists.
   *
   * `opt_extrapolate` controls extrapolation beyond the range of Ms in the
   * MultiLineString. If `opt_extrapolate` is `true` then Ms less than the first
   * M will return the first coordinate and Ms greater than the last M will
   * return the last coordinate.
   *
   * `opt_interpolate` controls interpolation between consecutive LineStrings
   * within the MultiLineString. If `opt_interpolate` is `true` the coordinates
   * will be linearly interpolated between the last coordinate of one LineString
   * and the first coordinate of the next LineString.  If `opt_interpolate` is
   * `false` then the function will return `null` for Ms falling between
   * LineStrings.
   *
   * @param {number} m M.
   * @param {boolean=} opt_extrapolate Extrapolate. Default is `false`.
   * @param {boolean=} opt_interpolate Interpolate. Default is `false`.
   * @return {import("../coordinate.js").Coordinate} Coordinate.
   * @api
   */
  MultiLineString.prototype.getCoordinateAtM = function getCoordinateAtM (m, opt_extrapolate, opt_interpolate) {
    if ((this.layout != _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.XYM &&
         this.layout != _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.XYZM) ||
        this.flatCoordinates.length === 0) {
      return null;
    }
    var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
    var interpolate = opt_interpolate !== undefined ? opt_interpolate : false;
    return (0,_flat_interpolate_js__WEBPACK_IMPORTED_MODULE_9__/* .lineStringsCoordinateAtM */ .L8)(this.flatCoordinates, 0,
      this.ends_, this.stride, m, extrapolate, interpolate);
  };

  /**
   * Return the coordinates of the multilinestring.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @override
   * @api
   */
  MultiLineString.prototype.getCoordinates = function getCoordinates () {
    return (0,_flat_inflate_js__WEBPACK_IMPORTED_MODULE_8__/* .inflateCoordinatesArray */ .cD)(
      this.flatCoordinates, 0, this.ends_, this.stride);
  };

  /**
   * @return {Array<number>} Ends.
   */
  MultiLineString.prototype.getEnds = function getEnds () {
    return this.ends_;
  };

  /**
   * Return the linestring at the specified index.
   * @param {number} index Index.
   * @return {LineString} LineString.
   * @api
   */
  MultiLineString.prototype.getLineString = function getLineString (index) {
    if (index < 0 || this.ends_.length <= index) {
      return null;
    }
    return new _LineString_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A(this.flatCoordinates.slice(
      index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]), this.layout);
  };

  /**
   * Return the linestrings of this multilinestring.
   * @return {Array<LineString>} LineStrings.
   * @api
   */
  MultiLineString.prototype.getLineStrings = function getLineStrings () {
    var flatCoordinates = this.flatCoordinates;
    var ends = this.ends_;
    var layout = this.layout;
    /** @type {Array<LineString>} */
    var lineStrings = [];
    var offset = 0;
    for (var i = 0, ii = ends.length; i < ii; ++i) {
      var end = ends[i];
      var lineString = new _LineString_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A(flatCoordinates.slice(offset, end), layout);
      lineStrings.push(lineString);
      offset = end;
    }
    return lineStrings;
  };

  /**
   * @return {Array<number>} Flat midpoints.
   */
  MultiLineString.prototype.getFlatMidpoints = function getFlatMidpoints () {
    var midpoints = [];
    var flatCoordinates = this.flatCoordinates;
    var offset = 0;
    var ends = this.ends_;
    var stride = this.stride;
    for (var i = 0, ii = ends.length; i < ii; ++i) {
      var end = ends[i];
      var midpoint = (0,_flat_interpolate_js__WEBPACK_IMPORTED_MODULE_9__/* .interpolatePoint */ .SH)(
        flatCoordinates, offset, end, stride, 0.5);
      (0,_array_js__WEBPACK_IMPORTED_MODULE_0__/* .extend */ .X$)(midpoints, midpoint);
      offset = end;
    }
    return midpoints;
  };

  /**
   * @inheritDoc
   */
  MultiLineString.prototype.getSimplifiedGeometryInternal = function getSimplifiedGeometryInternal (squaredTolerance) {
    var simplifiedFlatCoordinates = [];
    var simplifiedEnds = [];
    simplifiedFlatCoordinates.length = (0,_flat_simplify_js__WEBPACK_IMPORTED_MODULE_11__/* .douglasPeuckerArray */ .AL)(
      this.flatCoordinates, 0, this.ends_, this.stride, squaredTolerance,
      simplifiedFlatCoordinates, 0, simplifiedEnds);
    return new MultiLineString(simplifiedFlatCoordinates, _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.XY, simplifiedEnds);
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiLineString.prototype.getType = function getType () {
    return _GeometryType_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.MULTI_LINE_STRING;
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiLineString.prototype.intersectsExtent = function intersectsExtent (extent) {
    return (0,_flat_intersectsextent_js__WEBPACK_IMPORTED_MODULE_10__/* .intersectsLineStringArray */ .fB)(
      this.flatCoordinates, 0, this.ends_, this.stride, extent);
  };

  /**
   * Set the coordinates of the multilinestring.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {GeometryLayout=} opt_layout Layout.
   * @override
   * @api
   */
  MultiLineString.prototype.setCoordinates = function setCoordinates (coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    var ends = (0,_flat_deflate_js__WEBPACK_IMPORTED_MODULE_7__/* .deflateCoordinatesArray */ .KG)(
      this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  };

  return MultiLineString;
}(_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Ay));


/* harmony default export */ __webpack_exports__.A = (MultiLineString);

//# sourceMappingURL=MultiLineString.js.map

/***/ }),

/***/ 29094:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19487);
/* harmony import */ var _extent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85752);
/* harmony import */ var _GeometryType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11635);
/* harmony import */ var _Point_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(51117);
/* harmony import */ var _SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(57029);
/* harmony import */ var _flat_deflate_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(89564);
/* harmony import */ var _flat_inflate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1072);
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94966);
/**
 * @module ol/geom/MultiPoint
 */









/**
 * @classdesc
 * Multi-point geometry.
 *
 * @api
 */
var MultiPoint = /*@__PURE__*/(function (SimpleGeometry) {
  function MultiPoint(coordinates, opt_layout) {
    SimpleGeometry.call(this);
    if (opt_layout && !Array.isArray(coordinates[0])) {
      this.setFlatCoordinates(opt_layout, /** @type {Array<number>} */ (coordinates));
    } else {
      this.setCoordinates(/** @type {Array<import("../coordinate.js").Coordinate>} */ (coordinates), opt_layout);
    }
  }

  if ( SimpleGeometry ) MultiPoint.__proto__ = SimpleGeometry;
  MultiPoint.prototype = Object.create( SimpleGeometry && SimpleGeometry.prototype );
  MultiPoint.prototype.constructor = MultiPoint;

  /**
   * Append the passed point to this multipoint.
   * @param {Point} point Point.
   * @api
   */
  MultiPoint.prototype.appendPoint = function appendPoint (point) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = point.getFlatCoordinates().slice();
    } else {
      (0,_array_js__WEBPACK_IMPORTED_MODULE_0__/* .extend */ .X$)(this.flatCoordinates, point.getFlatCoordinates());
    }
    this.changed();
  };

  /**
   * Make a complete copy of the geometry.
   * @return {!MultiPoint} Clone.
   * @override
   * @api
   */
  MultiPoint.prototype.clone = function clone () {
    var multiPoint = new MultiPoint(this.flatCoordinates.slice(), this.layout);
    return multiPoint;
  };

  /**
   * @inheritDoc
   */
  MultiPoint.prototype.closestPointXY = function closestPointXY (x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < (0,_extent_js__WEBPACK_IMPORTED_MODULE_1__/* .closestSquaredDistanceXY */ .Ld)(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    var flatCoordinates = this.flatCoordinates;
    var stride = this.stride;
    for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      var squaredDistance = (0,_math_js__WEBPACK_IMPORTED_MODULE_7__/* .squaredDistance */ .hG)(
        x, y, flatCoordinates[i], flatCoordinates[i + 1]);
      if (squaredDistance < minSquaredDistance) {
        minSquaredDistance = squaredDistance;
        for (var j = 0; j < stride; ++j) {
          closestPoint[j] = flatCoordinates[i + j];
        }
        closestPoint.length = stride;
      }
    }
    return minSquaredDistance;
  };

  /**
   * Return the coordinates of the multipoint.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @override
   * @api
   */
  MultiPoint.prototype.getCoordinates = function getCoordinates () {
    return (0,_flat_inflate_js__WEBPACK_IMPORTED_MODULE_6__/* .inflateCoordinates */ .n2)(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
  };

  /**
   * Return the point at the specified index.
   * @param {number} index Index.
   * @return {Point} Point.
   * @api
   */
  MultiPoint.prototype.getPoint = function getPoint (index) {
    var n = !this.flatCoordinates ? 0 : this.flatCoordinates.length / this.stride;
    if (index < 0 || n <= index) {
      return null;
    }
    return new _Point_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A(this.flatCoordinates.slice(
      index * this.stride, (index + 1) * this.stride), this.layout);
  };

  /**
   * Return the points of this multipoint.
   * @return {Array<Point>} Points.
   * @api
   */
  MultiPoint.prototype.getPoints = function getPoints () {
    var flatCoordinates = this.flatCoordinates;
    var layout = this.layout;
    var stride = this.stride;
    /** @type {Array<Point>} */
    var points = [];
    for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      var point = new _Point_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A(flatCoordinates.slice(i, i + stride), layout);
      points.push(point);
    }
    return points;
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiPoint.prototype.getType = function getType () {
    return _GeometryType_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.MULTI_POINT;
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiPoint.prototype.intersectsExtent = function intersectsExtent (extent) {
    var flatCoordinates = this.flatCoordinates;
    var stride = this.stride;
    for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      var x = flatCoordinates[i];
      var y = flatCoordinates[i + 1];
      if ((0,_extent_js__WEBPACK_IMPORTED_MODULE_1__/* .containsXY */ .Rj)(extent, x, y)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Set the coordinates of the multipoint.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./GeometryLayout.js").default=} opt_layout Layout.
   * @override
   * @api
   */
  MultiPoint.prototype.setCoordinates = function setCoordinates (coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = (0,_flat_deflate_js__WEBPACK_IMPORTED_MODULE_5__/* .deflateCoordinates */ .z2)(
      this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  };

  return MultiPoint;
}(_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Ay));


/* harmony default export */ __webpack_exports__.A = (MultiPoint);

//# sourceMappingURL=MultiPoint.js.map

/***/ }),

/***/ 70910:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19487);
/* harmony import */ var _extent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85752);
/* harmony import */ var _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(96269);
/* harmony import */ var _GeometryType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11635);
/* harmony import */ var _MultiPoint_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(29094);
/* harmony import */ var _Polygon_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11035);
/* harmony import */ var _SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(57029);
/* harmony import */ var _flat_area_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(10110);
/* harmony import */ var _flat_center_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(77534);
/* harmony import */ var _flat_closest_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(98004);
/* harmony import */ var _flat_contains_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(64126);
/* harmony import */ var _flat_deflate_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(89564);
/* harmony import */ var _flat_inflate_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(1072);
/* harmony import */ var _flat_interiorpoint_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(79165);
/* harmony import */ var _flat_intersectsextent_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(49373);
/* harmony import */ var _flat_orient_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(64535);
/* harmony import */ var _flat_simplify_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(73468);
/**
 * @module ol/geom/MultiPolygon
 */


















/**
 * @classdesc
 * Multi-polygon geometry.
 *
 * @api
 */
var MultiPolygon = /*@__PURE__*/(function (SimpleGeometry) {
  function MultiPolygon(coordinates, opt_layout, opt_endss) {

    SimpleGeometry.call(this);

    /**
     * @type {Array<Array<number>>}
     * @private
     */
    this.endss_ = [];

    /**
     * @private
     * @type {number}
     */
    this.flatInteriorPointsRevision_ = -1;

    /**
     * @private
     * @type {Array<number>}
     */
    this.flatInteriorPoints_ = null;

    /**
     * @private
     * @type {number}
     */
    this.maxDelta_ = -1;

    /**
     * @private
     * @type {number}
     */
    this.maxDeltaRevision_ = -1;

    /**
     * @private
     * @type {number}
     */
    this.orientedRevision_ = -1;

    /**
     * @private
     * @type {Array<number>}
     */
    this.orientedFlatCoordinates_ = null;

    if (!opt_endss && !Array.isArray(coordinates[0])) {
      var layout = this.getLayout();
      var polygons = /** @type {Array<Polygon>} */ (coordinates);
      var flatCoordinates = [];
      var endss = [];
      for (var i = 0, ii = polygons.length; i < ii; ++i) {
        var polygon = polygons[i];
        if (i === 0) {
          layout = polygon.getLayout();
        }
        var offset = flatCoordinates.length;
        var ends = polygon.getEnds();
        for (var j = 0, jj = ends.length; j < jj; ++j) {
          ends[j] += offset;
        }
        (0,_array_js__WEBPACK_IMPORTED_MODULE_0__/* .extend */ .X$)(flatCoordinates, polygon.getFlatCoordinates());
        endss.push(ends);
      }
      opt_layout = layout;
      coordinates = flatCoordinates;
      opt_endss = endss;
    }
    if (opt_layout !== undefined && opt_endss) {
      this.setFlatCoordinates(opt_layout, /** @type {Array<number>} */ (coordinates));
      this.endss_ = opt_endss;
    } else {
      this.setCoordinates(/** @type {Array<Array<Array<import("../coordinate.js").Coordinate>>>} */ (coordinates),
        opt_layout);
    }

  }

  if ( SimpleGeometry ) MultiPolygon.__proto__ = SimpleGeometry;
  MultiPolygon.prototype = Object.create( SimpleGeometry && SimpleGeometry.prototype );
  MultiPolygon.prototype.constructor = MultiPolygon;

  /**
   * Append the passed polygon to this multipolygon.
   * @param {Polygon} polygon Polygon.
   * @api
   */
  MultiPolygon.prototype.appendPolygon = function appendPolygon (polygon) {
    /** @type {Array<number>} */
    var ends;
    if (!this.flatCoordinates) {
      this.flatCoordinates = polygon.getFlatCoordinates().slice();
      ends = polygon.getEnds().slice();
      this.endss_.push();
    } else {
      var offset = this.flatCoordinates.length;
      (0,_array_js__WEBPACK_IMPORTED_MODULE_0__/* .extend */ .X$)(this.flatCoordinates, polygon.getFlatCoordinates());
      ends = polygon.getEnds().slice();
      for (var i = 0, ii = ends.length; i < ii; ++i) {
        ends[i] += offset;
      }
    }
    this.endss_.push(ends);
    this.changed();
  };

  /**
   * Make a complete copy of the geometry.
   * @return {!MultiPolygon} Clone.
   * @override
   * @api
   */
  MultiPolygon.prototype.clone = function clone () {
    var len = this.endss_.length;
    var newEndss = new Array(len);
    for (var i = 0; i < len; ++i) {
      newEndss[i] = this.endss_[i].slice();
    }

    return new MultiPolygon(
      this.flatCoordinates.slice(), this.layout, newEndss);
  };

  /**
   * @inheritDoc
   */
  MultiPolygon.prototype.closestPointXY = function closestPointXY (x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < (0,_extent_js__WEBPACK_IMPORTED_MODULE_1__/* .closestSquaredDistanceXY */ .Ld)(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt((0,_flat_closest_js__WEBPACK_IMPORTED_MODULE_9__/* .multiArrayMaxSquaredDelta */ .c)(
        this.flatCoordinates, 0, this.endss_, this.stride, 0));
      this.maxDeltaRevision_ = this.getRevision();
    }
    return (0,_flat_closest_js__WEBPACK_IMPORTED_MODULE_9__/* .assignClosestMultiArrayPoint */ .te)(
      this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride,
      this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
  };

  /**
   * @inheritDoc
   */
  MultiPolygon.prototype.containsXY = function containsXY (x, y) {
    return (0,_flat_contains_js__WEBPACK_IMPORTED_MODULE_10__/* .linearRingssContainsXY */ .Gd)(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, x, y);
  };

  /**
   * Return the area of the multipolygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  MultiPolygon.prototype.getArea = function getArea () {
    return (0,_flat_area_js__WEBPACK_IMPORTED_MODULE_7__/* .linearRingss */ .Cs)(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride);
  };

  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for multi-polygons.
   *
   * @param {boolean=} opt_right Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<Array<import("../coordinate.js").Coordinate>>>} Coordinates.
   * @override
   * @api
   */
  MultiPolygon.prototype.getCoordinates = function getCoordinates (opt_right) {
    var flatCoordinates;
    if (opt_right !== undefined) {
      flatCoordinates = this.getOrientedFlatCoordinates().slice();
      (0,_flat_orient_js__WEBPACK_IMPORTED_MODULE_15__/* .orientLinearRingsArray */ .NK)(
        flatCoordinates, 0, this.endss_, this.stride, opt_right);
    } else {
      flatCoordinates = this.flatCoordinates;
    }

    return (0,_flat_inflate_js__WEBPACK_IMPORTED_MODULE_12__/* .inflateMultiCoordinatesArray */ .Dz)(
      flatCoordinates, 0, this.endss_, this.stride);
  };

  /**
   * @return {Array<Array<number>>} Endss.
   */
  MultiPolygon.prototype.getEndss = function getEndss () {
    return this.endss_;
  };

  /**
   * @return {Array<number>} Flat interior points.
   */
  MultiPolygon.prototype.getFlatInteriorPoints = function getFlatInteriorPoints () {
    if (this.flatInteriorPointsRevision_ != this.getRevision()) {
      var flatCenters = (0,_flat_center_js__WEBPACK_IMPORTED_MODULE_8__/* .linearRingss */ .C)(
        this.flatCoordinates, 0, this.endss_, this.stride);
      this.flatInteriorPoints_ = (0,_flat_interiorpoint_js__WEBPACK_IMPORTED_MODULE_13__/* .getInteriorPointsOfMultiArray */ .p)(
        this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride,
        flatCenters);
      this.flatInteriorPointsRevision_ = this.getRevision();
    }
    return this.flatInteriorPoints_;
  };

  /**
   * Return the interior points as {@link module:ol/geom/MultiPoint multipoint}.
   * @return {MultiPoint} Interior points as XYM coordinates, where M is
   * the length of the horizontal intersection that the point belongs to.
   * @api
   */
  MultiPolygon.prototype.getInteriorPoints = function getInteriorPoints () {
    return new _MultiPoint_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A(this.getFlatInteriorPoints().slice(), _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.XYM);
  };

  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  MultiPolygon.prototype.getOrientedFlatCoordinates = function getOrientedFlatCoordinates () {
    if (this.orientedRevision_ != this.getRevision()) {
      var flatCoordinates = this.flatCoordinates;
      if ((0,_flat_orient_js__WEBPACK_IMPORTED_MODULE_15__/* .linearRingsAreOriented */ .PA)(
        flatCoordinates, 0, this.endss_, this.stride)) {
        this.orientedFlatCoordinates_ = flatCoordinates;
      } else {
        this.orientedFlatCoordinates_ = flatCoordinates.slice();
        this.orientedFlatCoordinates_.length =
            (0,_flat_orient_js__WEBPACK_IMPORTED_MODULE_15__/* .orientLinearRingsArray */ .NK)(
              this.orientedFlatCoordinates_, 0, this.endss_, this.stride);
      }
      this.orientedRevision_ = this.getRevision();
    }
    return this.orientedFlatCoordinates_;
  };

  /**
   * @inheritDoc
   */
  MultiPolygon.prototype.getSimplifiedGeometryInternal = function getSimplifiedGeometryInternal (squaredTolerance) {
    var simplifiedFlatCoordinates = [];
    var simplifiedEndss = [];
    simplifiedFlatCoordinates.length = (0,_flat_simplify_js__WEBPACK_IMPORTED_MODULE_16__/* .quantizeMultiArray */ .sx)(
      this.flatCoordinates, 0, this.endss_, this.stride,
      Math.sqrt(squaredTolerance),
      simplifiedFlatCoordinates, 0, simplifiedEndss);
    return new MultiPolygon(simplifiedFlatCoordinates, _GeometryLayout_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.XY, simplifiedEndss);
  };

  /**
   * Return the polygon at the specified index.
   * @param {number} index Index.
   * @return {Polygon} Polygon.
   * @api
   */
  MultiPolygon.prototype.getPolygon = function getPolygon (index) {
    if (index < 0 || this.endss_.length <= index) {
      return null;
    }
    var offset;
    if (index === 0) {
      offset = 0;
    } else {
      var prevEnds = this.endss_[index - 1];
      offset = prevEnds[prevEnds.length - 1];
    }
    var ends = this.endss_[index].slice();
    var end = ends[ends.length - 1];
    if (offset !== 0) {
      for (var i = 0, ii = ends.length; i < ii; ++i) {
        ends[i] -= offset;
      }
    }
    return new _Polygon_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Ay(this.flatCoordinates.slice(offset, end), this.layout, ends);
  };

  /**
   * Return the polygons of this multipolygon.
   * @return {Array<Polygon>} Polygons.
   * @api
   */
  MultiPolygon.prototype.getPolygons = function getPolygons () {
    var layout = this.layout;
    var flatCoordinates = this.flatCoordinates;
    var endss = this.endss_;
    var polygons = [];
    var offset = 0;
    for (var i = 0, ii = endss.length; i < ii; ++i) {
      var ends = endss[i].slice();
      var end = ends[ends.length - 1];
      if (offset !== 0) {
        for (var j = 0, jj = ends.length; j < jj; ++j) {
          ends[j] -= offset;
        }
      }
      var polygon = new _Polygon_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Ay(flatCoordinates.slice(offset, end), layout, ends);
      polygons.push(polygon);
      offset = end;
    }
    return polygons;
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiPolygon.prototype.getType = function getType () {
    return _GeometryType_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.MULTI_POLYGON;
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiPolygon.prototype.intersectsExtent = function intersectsExtent (extent) {
    return (0,_flat_intersectsextent_js__WEBPACK_IMPORTED_MODULE_14__/* .intersectsLinearRingMultiArray */ .Wp)(
      this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, extent);
  };

  /**
   * Set the coordinates of the multipolygon.
   * @param {!Array<Array<Array<import("../coordinate.js").Coordinate>>>} coordinates Coordinates.
   * @param {GeometryLayout=} opt_layout Layout.
   * @override
   * @api
   */
  MultiPolygon.prototype.setCoordinates = function setCoordinates (coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 3);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    var endss = (0,_flat_deflate_js__WEBPACK_IMPORTED_MODULE_11__/* .deflateMultiCoordinatesArray */ .d6)(
      this.flatCoordinates, 0, coordinates, this.stride, this.endss_);
    if (endss.length === 0) {
      this.flatCoordinates.length = 0;
    } else {
      var lastEnds = endss[endss.length - 1];
      this.flatCoordinates.length = lastEnds.length === 0 ?
        0 : lastEnds[lastEnds.length - 1];
    }
    this.changed();
  };

  return MultiPolygon;
}(_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Ay));


/* harmony default export */ __webpack_exports__.A = (MultiPolygon);

//# sourceMappingURL=MultiPolygon.js.map

/***/ }),

/***/ 77534:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: function() { return /* binding */ linearRingss; }
/* harmony export */ });
/* harmony import */ var _extent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85752);
/**
 * @module ol/geom/flat/center
 */



/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<Array<number>>} endss Endss.
 * @param {number} stride Stride.
 * @return {Array<number>} Flat centers.
 */
function linearRingss(flatCoordinates, offset, endss, stride) {
  var flatCenters = [];
  var extent = (0,_extent_js__WEBPACK_IMPORTED_MODULE_0__/* .createEmpty */ .S5)();
  for (var i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    extent = (0,_extent_js__WEBPACK_IMPORTED_MODULE_0__/* .createOrUpdateFromFlatCoordinates */ .Vy)(flatCoordinates, offset, ends[0], stride);
    flatCenters.push((extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2);
    offset = ends[ends.length - 1];
  }
  return flatCenters;
}

//# sourceMappingURL=center.js.map

/***/ }),

/***/ 39608:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L8: function() { return /* binding */ lineStringsCoordinateAtM; },
/* harmony export */   SH: function() { return /* binding */ interpolatePoint; },
/* harmony export */   gr: function() { return /* binding */ lineStringCoordinateAtM; }
/* harmony export */ });
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19487);
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(94966);
/**
 * @module ol/geom/flat/interpolate
 */




/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} fraction Fraction.
 * @param {Array<number>=} opt_dest Destination.
 * @return {Array<number>} Destination.
 */
function interpolatePoint(flatCoordinates, offset, end, stride, fraction, opt_dest) {
  var pointX = NaN;
  var pointY = NaN;
  var n = (end - offset) / stride;
  if (n === 1) {
    pointX = flatCoordinates[offset];
    pointY = flatCoordinates[offset + 1];
  } else if (n == 2) {
    pointX = (1 - fraction) * flatCoordinates[offset] +
        fraction * flatCoordinates[offset + stride];
    pointY = (1 - fraction) * flatCoordinates[offset + 1] +
        fraction * flatCoordinates[offset + stride + 1];
  } else if (n !== 0) {
    var x1 = flatCoordinates[offset];
    var y1 = flatCoordinates[offset + 1];
    var length = 0;
    var cumulativeLengths = [0];
    for (var i = offset + stride; i < end; i += stride) {
      var x2 = flatCoordinates[i];
      var y2 = flatCoordinates[i + 1];
      length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      cumulativeLengths.push(length);
      x1 = x2;
      y1 = y2;
    }
    var target = fraction * length;
    var index = (0,_array_js__WEBPACK_IMPORTED_MODULE_0__/* .binarySearch */ .El)(cumulativeLengths, target);
    if (index < 0) {
      var t = (target - cumulativeLengths[-index - 2]) /
          (cumulativeLengths[-index - 1] - cumulativeLengths[-index - 2]);
      var o = offset + (-index - 2) * stride;
      pointX = (0,_math_js__WEBPACK_IMPORTED_MODULE_1__/* .lerp */ .Cc)(
        flatCoordinates[o], flatCoordinates[o + stride], t);
      pointY = (0,_math_js__WEBPACK_IMPORTED_MODULE_1__/* .lerp */ .Cc)(
        flatCoordinates[o + 1], flatCoordinates[o + stride + 1], t);
    } else {
      pointX = flatCoordinates[offset + index * stride];
      pointY = flatCoordinates[offset + index * stride + 1];
    }
  }
  if (opt_dest) {
    opt_dest[0] = pointX;
    opt_dest[1] = pointY;
    return opt_dest;
  } else {
    return [pointX, pointY];
  }
}


/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} m M.
 * @param {boolean} extrapolate Extrapolate.
 * @return {import("../../coordinate.js").Coordinate} Coordinate.
 */
function lineStringCoordinateAtM(flatCoordinates, offset, end, stride, m, extrapolate) {
  if (end == offset) {
    return null;
  }
  var coordinate;
  if (m < flatCoordinates[offset + stride - 1]) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(offset, offset + stride);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  } else if (flatCoordinates[end - 1] < m) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(end - stride, end);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  }
  // FIXME use O(1) search
  if (m == flatCoordinates[offset + stride - 1]) {
    return flatCoordinates.slice(offset, offset + stride);
  }
  var lo = offset / stride;
  var hi = end / stride;
  while (lo < hi) {
    var mid = (lo + hi) >> 1;
    if (m < flatCoordinates[(mid + 1) * stride - 1]) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  var m0 = flatCoordinates[lo * stride - 1];
  if (m == m0) {
    return flatCoordinates.slice((lo - 1) * stride, (lo - 1) * stride + stride);
  }
  var m1 = flatCoordinates[(lo + 1) * stride - 1];
  var t = (m - m0) / (m1 - m0);
  coordinate = [];
  for (var i = 0; i < stride - 1; ++i) {
    coordinate.push((0,_math_js__WEBPACK_IMPORTED_MODULE_1__/* .lerp */ .Cc)(flatCoordinates[(lo - 1) * stride + i],
      flatCoordinates[lo * stride + i], t));
  }
  coordinate.push(m);
  return coordinate;
}


/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} m M.
 * @param {boolean} extrapolate Extrapolate.
 * @param {boolean} interpolate Interpolate.
 * @return {import("../../coordinate.js").Coordinate} Coordinate.
 */
function lineStringsCoordinateAtM(
  flatCoordinates, offset, ends, stride, m, extrapolate, interpolate) {
  if (interpolate) {
    return lineStringCoordinateAtM(
      flatCoordinates, offset, ends[ends.length - 1], stride, m, extrapolate);
  }
  var coordinate;
  if (m < flatCoordinates[stride - 1]) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(0, stride);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  }
  if (flatCoordinates[flatCoordinates.length - 1] < m) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(flatCoordinates.length - stride);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  }
  for (var i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    if (offset == end) {
      continue;
    }
    if (m < flatCoordinates[offset + stride - 1]) {
      return null;
    } else if (m <= flatCoordinates[end - 1]) {
      return lineStringCoordinateAtM(
        flatCoordinates, offset, end, stride, m, false);
    }
    offset = end;
  }
  return null;
}

//# sourceMappingURL=interpolate.js.map

/***/ }),

/***/ 47133:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: function() { return /* binding */ style_Icon; }
});

// EXTERNAL MODULE: ./node_modules/ol/util.js
var util = __webpack_require__(94092);
// EXTERNAL MODULE: ./node_modules/ol/ImageState.js
var ImageState = __webpack_require__(80398);
// EXTERNAL MODULE: ./node_modules/ol/asserts.js
var asserts = __webpack_require__(17229);
// EXTERNAL MODULE: ./node_modules/ol/color.js
var color = __webpack_require__(65045);
// EXTERNAL MODULE: ./node_modules/ol/events.js
var events = __webpack_require__(17353);
// EXTERNAL MODULE: ./node_modules/ol/events/EventType.js
var EventType = __webpack_require__(55506);
;// ./node_modules/ol/style/IconAnchorUnits.js
/**
 * @module ol/style/IconAnchorUnits
 */

/**
 * Icon anchor units. One of 'fraction', 'pixels'.
 * @enum {string}
 */
/* harmony default export */ var IconAnchorUnits = ({
  FRACTION: 'fraction',
  PIXELS: 'pixels'
});

//# sourceMappingURL=IconAnchorUnits.js.map
// EXTERNAL MODULE: ./node_modules/ol/dom.js
var dom = __webpack_require__(84674);
// EXTERNAL MODULE: ./node_modules/ol/events/Target.js
var Target = __webpack_require__(78081);
// EXTERNAL MODULE: ./node_modules/ol/style/IconImageCache.js
var IconImageCache = __webpack_require__(91714);
;// ./node_modules/ol/style/IconImage.js
/**
 * @module ol/style/IconImage
 */








var IconImage = /*@__PURE__*/(function (EventTarget) {
  function IconImage(image, src, size, crossOrigin, imageState, color) {

    EventTarget.call(this);

    /**
     * @private
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    this.hitDetectionImage_ = null;

    /**
     * @private
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    this.image_ = !image ? new Image() : image;

    if (crossOrigin !== null) {
      /** @type {HTMLImageElement} */ (this.image_).crossOrigin = crossOrigin;
    }

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = color ?
      /** @type {HTMLCanvasElement} */ (document.createElement('canvas')) :
      null;

    /**
     * @private
     * @type {import("../color.js").Color}
     */
    this.color_ = color;

    /**
     * @private
     * @type {Array<import("../events.js").EventsKey>}
     */
    this.imageListenerKeys_ = null;

    /**
     * @private
     * @type {import("../ImageState.js").default}
     */
    this.imageState_ = imageState;

    /**
     * @private
     * @type {import("../size.js").Size}
     */
    this.size_ = size;

    /**
     * @private
     * @type {string|undefined}
     */
    this.src_ = src;

    /**
     * @private
     * @type {boolean|undefined}
     */
    this.tainted_;

  }

  if ( EventTarget ) IconImage.__proto__ = EventTarget;
  IconImage.prototype = Object.create( EventTarget && EventTarget.prototype );
  IconImage.prototype.constructor = IconImage;

  /**
   * @private
   * @return {boolean} The image canvas is tainted.
   */
  IconImage.prototype.isTainted_ = function isTainted_ () {
    if (this.tainted_ === undefined && this.imageState_ === ImageState/* default */.A.LOADED) {
      this.tainted_ = false;
      var context = (0,dom/* createCanvasContext2D */.Y)(1, 1);
      try {
        context.drawImage(this.image_, 0, 0);
        context.getImageData(0, 0, 1, 1);
      } catch (e) {
        this.tainted_ = true;
      }
    }
    return this.tainted_ === true;
  };

  /**
   * @private
   */
  IconImage.prototype.dispatchChangeEvent_ = function dispatchChangeEvent_ () {
    this.dispatchEvent(EventType/* default */.A.CHANGE);
  };

  /**
   * @private
   */
  IconImage.prototype.handleImageError_ = function handleImageError_ () {
    this.imageState_ = ImageState/* default */.A.ERROR;
    this.unlistenImage_();
    this.dispatchChangeEvent_();
  };

  /**
   * @private
   */
  IconImage.prototype.handleImageLoad_ = function handleImageLoad_ () {
    this.imageState_ = ImageState/* default */.A.LOADED;
    if (this.size_) {
      this.image_.width = this.size_[0];
      this.image_.height = this.size_[1];
    }
    this.size_ = [this.image_.width, this.image_.height];
    this.unlistenImage_();
    this.replaceColor_();
    this.dispatchChangeEvent_();
  };

  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
   */
  IconImage.prototype.getImage = function getImage (pixelRatio) {
    return this.canvas_ ? this.canvas_ : this.image_;
  };

  /**
   * @return {import("../ImageState.js").default} Image state.
   */
  IconImage.prototype.getImageState = function getImageState () {
    return this.imageState_;
  };

  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement} Image element.
   */
  IconImage.prototype.getHitDetectionImage = function getHitDetectionImage (pixelRatio) {
    if (!this.hitDetectionImage_) {
      if (this.isTainted_()) {
        var width = this.size_[0];
        var height = this.size_[1];
        var context = (0,dom/* createCanvasContext2D */.Y)(width, height);
        context.fillRect(0, 0, width, height);
        this.hitDetectionImage_ = context.canvas;
      } else {
        this.hitDetectionImage_ = this.image_;
      }
    }
    return this.hitDetectionImage_;
  };

  /**
   * @return {import("../size.js").Size} Image size.
   */
  IconImage.prototype.getSize = function getSize () {
    return this.size_;
  };

  /**
   * @return {string|undefined} Image src.
   */
  IconImage.prototype.getSrc = function getSrc () {
    return this.src_;
  };

  /**
   * Load not yet loaded URI.
   */
  IconImage.prototype.load = function load () {
    if (this.imageState_ == ImageState/* default */.A.IDLE) {
      this.imageState_ = ImageState/* default */.A.LOADING;
      this.imageListenerKeys_ = [
        (0,events/* listenOnce */.Jz)(this.image_, EventType/* default */.A.ERROR,
          this.handleImageError_, this),
        (0,events/* listenOnce */.Jz)(this.image_, EventType/* default */.A.LOAD,
          this.handleImageLoad_, this)
      ];
      try {
        /** @type {HTMLImageElement} */ (this.image_).src = this.src_;
      } catch (e) {
        this.handleImageError_();
      }
    }
  };

  /**
   * @private
   */
  IconImage.prototype.replaceColor_ = function replaceColor_ () {
    if (!this.color_ || this.isTainted_()) {
      return;
    }

    this.canvas_.width = this.image_.width;
    this.canvas_.height = this.image_.height;

    var ctx = this.canvas_.getContext('2d');
    ctx.drawImage(this.image_, 0, 0);

    var imgData = ctx.getImageData(0, 0, this.image_.width, this.image_.height);
    var data = imgData.data;
    var r = this.color_[0] / 255.0;
    var g = this.color_[1] / 255.0;
    var b = this.color_[2] / 255.0;

    for (var i = 0, ii = data.length; i < ii; i += 4) {
      data[i] *= r;
      data[i + 1] *= g;
      data[i + 2] *= b;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  IconImage.prototype.unlistenImage_ = function unlistenImage_ () {
    this.imageListenerKeys_.forEach(events/* unlistenByKey */.JH);
    this.imageListenerKeys_ = null;
  };

  return IconImage;
}(Target/* default */.A));


/**
 * @param {HTMLImageElement|HTMLCanvasElement} image Image.
 * @param {string} src Src.
 * @param {import("../size.js").Size} size Size.
 * @param {?string} crossOrigin Cross origin.
 * @param {import("../ImageState.js").default} imageState Image state.
 * @param {import("../color.js").Color} color Color.
 * @return {IconImage} Icon image.
 */
function get(image, src, size, crossOrigin, imageState, color) {
  var iconImage = IconImageCache/* shared */.u.get(src, crossOrigin, color);
  if (!iconImage) {
    iconImage = new IconImage(image, src, size, crossOrigin, imageState, color);
    IconImageCache/* shared */.u.set(src, crossOrigin, color, iconImage);
  }
  return iconImage;
}


/* harmony default export */ var style_IconImage = ((/* unused pure expression or super */ null && (IconImage)));

//# sourceMappingURL=IconImage.js.map
;// ./node_modules/ol/style/IconOrigin.js
/**
 * @module ol/style/IconOrigin
 */

/**
 * Icon origin. One of 'bottom-left', 'bottom-right', 'top-left', 'top-right'.
 * @enum {string}
 */
/* harmony default export */ var IconOrigin = ({
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right'
});

//# sourceMappingURL=IconOrigin.js.map
// EXTERNAL MODULE: ./node_modules/ol/style/Image.js
var style_Image = __webpack_require__(63393);
;// ./node_modules/ol/style/Icon.js
/**
 * @module ol/style/Icon
 */












/**
 * @typedef {Object} Options
 * @property {Array<number>} [anchor=[0.5, 0.5]] Anchor. Default value is the icon center.
 * @property {import("./IconOrigin.js").default} [anchorOrigin] Origin of the anchor: `bottom-left`, `bottom-right`,
 * `top-left` or `top-right`. Default is `top-left`.
 * @property {import("./IconAnchorUnits.js").default} [anchorXUnits] Units in which the anchor x value is
 * specified. A value of `'fraction'` indicates the x value is a fraction of the icon. A value of `'pixels'` indicates
 * the x value in pixels. Default is `'fraction'`.
 * @property {import("./IconAnchorUnits.js").default} [anchorYUnits] Units in which the anchor y value is
 * specified. A value of `'fraction'` indicates the y value is a fraction of the icon. A value of `'pixels'` indicates
 * the y value in pixels. Default is `'fraction'`.
 * @property {import("../color.js").Color|string} [color] Color to tint the icon. If not specified,
 * the icon will be left as is.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images. Note that you must provide a
 * `crossOrigin` value if you are using the WebGL renderer or if you want to access pixel data with the Canvas renderer.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {HTMLImageElement|HTMLCanvasElement} [img] Image object for the icon. If the `src` option is not provided then the
 * provided image must already be loaded. And in that case, it is required
 * to provide the size of the image, with the `imgSize` option.
 * @property {Array<number>} [offset=[0, 0]] Offset, which, together with the size and the offset origin, define the
 * sub-rectangle to use from the original icon image.
 * @property {import("./IconOrigin.js").default} [offsetOrigin] Origin of the offset: `bottom-left`, `bottom-right`,
 * `top-left` or `top-right`. Default is `top-left`.
 * @property {number} [opacity=1] Opacity of the icon.
 * @property {number} [scale=1] Scale.
 * @property {boolean} [rotateWithView=false] Whether to rotate the icon with the view.
 * @property {number} [rotation=0] Rotation in radians (positive rotation clockwise).
 * @property {import("../size.js").Size} [size] Icon size in pixel. Can be used together with `offset` to define the
 * sub-rectangle to use from the origin (sprite) icon image.
 * @property {import("../size.js").Size} [imgSize] Image size in pixels. Only required if `img` is set and `src` is not, and
 * for SVG images in Internet Explorer 11. The provided `imgSize` needs to match the actual size of the image.
 * @property {string} [src] Image source URI.
 */


/**
 * @classdesc
 * Set icon style for vector features.
 * @api
 */
var Icon = /*@__PURE__*/(function (ImageStyle) {
  function Icon(opt_options) {
    var options = opt_options || {};

    /**
     * @type {number}
     */
    var opacity = options.opacity !== undefined ? options.opacity : 1;

    /**
     * @type {number}
     */
    var rotation = options.rotation !== undefined ? options.rotation : 0;

    /**
     * @type {number}
     */
    var scale = options.scale !== undefined ? options.scale : 1;

    /**
     * @type {boolean}
     */
    var rotateWithView = options.rotateWithView !== undefined ?
      options.rotateWithView : false;

    ImageStyle.call(this, {
      opacity: opacity,
      rotation: rotation,
      scale: scale,
      rotateWithView: rotateWithView
    });

    /**
     * @private
     * @type {Array<number>}
     */
    this.anchor_ = options.anchor !== undefined ? options.anchor : [0.5, 0.5];

    /**
     * @private
     * @type {Array<number>}
     */
    this.normalizedAnchor_ = null;

    /**
     * @private
     * @type {import("./IconOrigin.js").default}
     */
    this.anchorOrigin_ = options.anchorOrigin !== undefined ?
      options.anchorOrigin : IconOrigin.TOP_LEFT;

    /**
     * @private
     * @type {import("./IconAnchorUnits.js").default}
     */
    this.anchorXUnits_ = options.anchorXUnits !== undefined ?
      options.anchorXUnits : IconAnchorUnits.FRACTION;

    /**
     * @private
     * @type {import("./IconAnchorUnits.js").default}
     */
    this.anchorYUnits_ = options.anchorYUnits !== undefined ?
      options.anchorYUnits : IconAnchorUnits.FRACTION;

    /**
     * @private
     * @type {?string}
     */
    this.crossOrigin_ =
        options.crossOrigin !== undefined ? options.crossOrigin : null;

    /**
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    var image = options.img !== undefined ? options.img : null;

    /**
     * @type {import("../size.js").Size}
     */
    var imgSize = options.imgSize !== undefined ? options.imgSize : null;

    /**
     * @type {string|undefined}
     */
    var src = options.src;

    (0,asserts/* assert */.v)(!(src !== undefined && image),
      4); // `image` and `src` cannot be provided at the same time
    (0,asserts/* assert */.v)(!image || (image && imgSize),
      5); // `imgSize` must be set when `image` is provided

    if ((src === undefined || src.length === 0) && image) {
      src = /** @type {HTMLImageElement} */ (image).src || (0,util/* getUid */.v6)(image);
    }
    (0,asserts/* assert */.v)(src !== undefined && src.length > 0,
      6); // A defined and non-empty `src` or `image` must be provided

    /**
     * @type {import("../ImageState.js").default}
     */
    var imageState = options.src !== undefined ?
      ImageState/* default */.A.IDLE : ImageState/* default */.A.LOADED;

    /**
     * @private
     * @type {import("../color.js").Color}
     */
    this.color_ = options.color !== undefined ? (0,color/* asArray */._j)(options.color) : null;

    /**
     * @private
     * @type {import("./IconImage.js").default}
     */
    this.iconImage_ = get(
      image, /** @type {string} */ (src), imgSize, this.crossOrigin_, imageState, this.color_);

    /**
     * @private
     * @type {Array<number>}
     */
    this.offset_ = options.offset !== undefined ? options.offset : [0, 0];

    /**
     * @private
     * @type {import("./IconOrigin.js").default}
     */
    this.offsetOrigin_ = options.offsetOrigin !== undefined ?
      options.offsetOrigin : IconOrigin.TOP_LEFT;

    /**
     * @private
     * @type {Array<number>}
     */
    this.origin_ = null;

    /**
     * @private
     * @type {import("../size.js").Size}
     */
    this.size_ = options.size !== undefined ? options.size : null;

  }

  if ( ImageStyle ) Icon.__proto__ = ImageStyle;
  Icon.prototype = Object.create( ImageStyle && ImageStyle.prototype );
  Icon.prototype.constructor = Icon;

  /**
   * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
   * @return {Icon} The cloned style.
   * @api
   */
  Icon.prototype.clone = function clone () {
    return new Icon({
      anchor: this.anchor_.slice(),
      anchorOrigin: this.anchorOrigin_,
      anchorXUnits: this.anchorXUnits_,
      anchorYUnits: this.anchorYUnits_,
      crossOrigin: this.crossOrigin_,
      color: (this.color_ && this.color_.slice) ? this.color_.slice() : this.color_ || undefined,
      src: this.getSrc(),
      offset: this.offset_.slice(),
      offsetOrigin: this.offsetOrigin_,
      size: this.size_ !== null ? this.size_.slice() : undefined,
      opacity: this.getOpacity(),
      scale: this.getScale(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView()
    });
  };

  /**
   * @inheritDoc
   * @api
   */
  Icon.prototype.getAnchor = function getAnchor () {
    if (this.normalizedAnchor_) {
      return this.normalizedAnchor_;
    }
    var anchor = this.anchor_;
    var size = this.getSize();
    if (this.anchorXUnits_ == IconAnchorUnits.FRACTION ||
        this.anchorYUnits_ == IconAnchorUnits.FRACTION) {
      if (!size) {
        return null;
      }
      anchor = this.anchor_.slice();
      if (this.anchorXUnits_ == IconAnchorUnits.FRACTION) {
        anchor[0] *= size[0];
      }
      if (this.anchorYUnits_ == IconAnchorUnits.FRACTION) {
        anchor[1] *= size[1];
      }
    }

    if (this.anchorOrigin_ != IconOrigin.TOP_LEFT) {
      if (!size) {
        return null;
      }
      if (anchor === this.anchor_) {
        anchor = this.anchor_.slice();
      }
      if (this.anchorOrigin_ == IconOrigin.TOP_RIGHT ||
          this.anchorOrigin_ == IconOrigin.BOTTOM_RIGHT) {
        anchor[0] = -anchor[0] + size[0];
      }
      if (this.anchorOrigin_ == IconOrigin.BOTTOM_LEFT ||
          this.anchorOrigin_ == IconOrigin.BOTTOM_RIGHT) {
        anchor[1] = -anchor[1] + size[1];
      }
    }
    this.normalizedAnchor_ = anchor;
    return this.normalizedAnchor_;
  };

  /**
   * Set the anchor point. The anchor determines the center point for the
   * symbolizer.
   *
   * @param {Array<number>} anchor Anchor.
   * @api
   */
  Icon.prototype.setAnchor = function setAnchor (anchor) {
    this.anchor_ = anchor;
    this.normalizedAnchor_ = null;
  };

  /**
   * Get the icon color.
   * @return {import("../color.js").Color} Color.
   * @api
   */
  Icon.prototype.getColor = function getColor () {
    return this.color_;
  };

  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
   * @override
   * @api
   */
  Icon.prototype.getImage = function getImage (pixelRatio) {
    return this.iconImage_.getImage(pixelRatio);
  };

  /**
   * @override
   */
  Icon.prototype.getImageSize = function getImageSize () {
    return this.iconImage_.getSize();
  };

  /**
   * @override
   */
  Icon.prototype.getHitDetectionImageSize = function getHitDetectionImageSize () {
    return this.getImageSize();
  };

  /**
   * @override
   */
  Icon.prototype.getImageState = function getImageState () {
    return this.iconImage_.getImageState();
  };

  /**
   * @override
   */
  Icon.prototype.getHitDetectionImage = function getHitDetectionImage (pixelRatio) {
    return this.iconImage_.getHitDetectionImage(pixelRatio);
  };

  /**
   * @inheritDoc
   * @api
   */
  Icon.prototype.getOrigin = function getOrigin () {
    if (this.origin_) {
      return this.origin_;
    }
    var offset = this.offset_;

    if (this.offsetOrigin_ != IconOrigin.TOP_LEFT) {
      var size = this.getSize();
      var iconImageSize = this.iconImage_.getSize();
      if (!size || !iconImageSize) {
        return null;
      }
      offset = offset.slice();
      if (this.offsetOrigin_ == IconOrigin.TOP_RIGHT ||
          this.offsetOrigin_ == IconOrigin.BOTTOM_RIGHT) {
        offset[0] = iconImageSize[0] - size[0] - offset[0];
      }
      if (this.offsetOrigin_ == IconOrigin.BOTTOM_LEFT ||
          this.offsetOrigin_ == IconOrigin.BOTTOM_RIGHT) {
        offset[1] = iconImageSize[1] - size[1] - offset[1];
      }
    }
    this.origin_ = offset;
    return this.origin_;
  };

  /**
   * Get the image URL.
   * @return {string|undefined} Image src.
   * @api
   */
  Icon.prototype.getSrc = function getSrc () {
    return this.iconImage_.getSrc();
  };

  /**
   * @inheritDoc
   * @api
   */
  Icon.prototype.getSize = function getSize () {
    return !this.size_ ? this.iconImage_.getSize() : this.size_;
  };

  /**
   * @override
   */
  Icon.prototype.listenImageChange = function listenImageChange (listener, thisArg) {
    return (0,events/* listen */.KT)(this.iconImage_, EventType/* default */.A.CHANGE,
      listener, thisArg);
  };

  /**
   * Load not yet loaded URI.
   * When rendering a feature with an icon style, the vector renderer will
   * automatically call this method. However, you might want to call this
   * method yourself for preloading or other purposes.
   * @override
   * @api
   */
  Icon.prototype.load = function load () {
    this.iconImage_.load();
  };

  /**
   * @override
   */
  Icon.prototype.unlistenImageChange = function unlistenImageChange (listener, thisArg) {
    (0,events/* unlisten */.Bo)(this.iconImage_, EventType/* default */.A.CHANGE,
      listener, thisArg);
  };

  return Icon;
}(style_Image/* default */.A));


/* harmony default export */ var style_Icon = (Icon);

//# sourceMappingURL=Icon.js.map

/***/ }),

/***/ 15335:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


module.exports = Pbf;

var ieee754 = __webpack_require__(251);

function Pbf(buf) {
    this.buf = ArrayBuffer.isView && ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf || 0);
    this.pos = 0;
    this.type = 0;
    this.length = this.buf.length;
}

Pbf.Varint  = 0; // varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
Pbf.Fixed64 = 1; // 64-bit: double, fixed64, sfixed64
Pbf.Bytes   = 2; // length-delimited: string, bytes, embedded messages, packed repeated fields
Pbf.Fixed32 = 5; // 32-bit: float, fixed32, sfixed32

var SHIFT_LEFT_32 = (1 << 16) * (1 << 16),
    SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;

Pbf.prototype = {

    destroy: function() {
        this.buf = null;
    },

    // === READING =================================================================

    readFields: function(readField, result, end) {
        end = end || this.length;

        while (this.pos < end) {
            var val = this.readVarint(),
                tag = val >> 3,
                startPos = this.pos;

            this.type = val & 0x7;
            readField(tag, result, this);

            if (this.pos === startPos) this.skip(val);
        }
        return result;
    },

    readMessage: function(readField, result) {
        return this.readFields(readField, result, this.readVarint() + this.pos);
    },

    readFixed32: function() {
        var val = readUInt32(this.buf, this.pos);
        this.pos += 4;
        return val;
    },

    readSFixed32: function() {
        var val = readInt32(this.buf, this.pos);
        this.pos += 4;
        return val;
    },

    // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)

    readFixed64: function() {
        var val = readUInt32(this.buf, this.pos) + readUInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
        this.pos += 8;
        return val;
    },

    readSFixed64: function() {
        var val = readUInt32(this.buf, this.pos) + readInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
        this.pos += 8;
        return val;
    },

    readFloat: function() {
        var val = ieee754.read(this.buf, this.pos, true, 23, 4);
        this.pos += 4;
        return val;
    },

    readDouble: function() {
        var val = ieee754.read(this.buf, this.pos, true, 52, 8);
        this.pos += 8;
        return val;
    },

    readVarint: function(isSigned) {
        var buf = this.buf,
            val, b;

        b = buf[this.pos++]; val  =  b & 0x7f;        if (b < 0x80) return val;
        b = buf[this.pos++]; val |= (b & 0x7f) << 7;  if (b < 0x80) return val;
        b = buf[this.pos++]; val |= (b & 0x7f) << 14; if (b < 0x80) return val;
        b = buf[this.pos++]; val |= (b & 0x7f) << 21; if (b < 0x80) return val;
        b = buf[this.pos];   val |= (b & 0x0f) << 28;

        return readVarintRemainder(val, isSigned, this);
    },

    readVarint64: function() { // for compatibility with v2.0.1
        return this.readVarint(true);
    },

    readSVarint: function() {
        var num = this.readVarint();
        return num % 2 === 1 ? (num + 1) / -2 : num / 2; // zigzag encoding
    },

    readBoolean: function() {
        return Boolean(this.readVarint());
    },

    readString: function() {
        var end = this.readVarint() + this.pos,
            str = readUtf8(this.buf, this.pos, end);
        this.pos = end;
        return str;
    },

    readBytes: function() {
        var end = this.readVarint() + this.pos,
            buffer = this.buf.subarray(this.pos, end);
        this.pos = end;
        return buffer;
    },

    // verbose for performance reasons; doesn't affect gzipped size

    readPackedVarint: function(arr, isSigned) {
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end) arr.push(this.readVarint(isSigned));
        return arr;
    },
    readPackedSVarint: function(arr) {
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end) arr.push(this.readSVarint());
        return arr;
    },
    readPackedBoolean: function(arr) {
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end) arr.push(this.readBoolean());
        return arr;
    },
    readPackedFloat: function(arr) {
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end) arr.push(this.readFloat());
        return arr;
    },
    readPackedDouble: function(arr) {
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end) arr.push(this.readDouble());
        return arr;
    },
    readPackedFixed32: function(arr) {
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end) arr.push(this.readFixed32());
        return arr;
    },
    readPackedSFixed32: function(arr) {
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end) arr.push(this.readSFixed32());
        return arr;
    },
    readPackedFixed64: function(arr) {
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end) arr.push(this.readFixed64());
        return arr;
    },
    readPackedSFixed64: function(arr) {
        var end = readPackedEnd(this);
        arr = arr || [];
        while (this.pos < end) arr.push(this.readSFixed64());
        return arr;
    },

    skip: function(val) {
        var type = val & 0x7;
        if (type === Pbf.Varint) while (this.buf[this.pos++] > 0x7f) {}
        else if (type === Pbf.Bytes) this.pos = this.readVarint() + this.pos;
        else if (type === Pbf.Fixed32) this.pos += 4;
        else if (type === Pbf.Fixed64) this.pos += 8;
        else throw new Error('Unimplemented type: ' + type);
    },

    // === WRITING =================================================================

    writeTag: function(tag, type) {
        this.writeVarint((tag << 3) | type);
    },

    realloc: function(min) {
        var length = this.length || 16;

        while (length < this.pos + min) length *= 2;

        if (length !== this.length) {
            var buf = new Uint8Array(length);
            buf.set(this.buf);
            this.buf = buf;
            this.length = length;
        }
    },

    finish: function() {
        this.length = this.pos;
        this.pos = 0;
        return this.buf.subarray(0, this.length);
    },

    writeFixed32: function(val) {
        this.realloc(4);
        writeInt32(this.buf, val, this.pos);
        this.pos += 4;
    },

    writeSFixed32: function(val) {
        this.realloc(4);
        writeInt32(this.buf, val, this.pos);
        this.pos += 4;
    },

    writeFixed64: function(val) {
        this.realloc(8);
        writeInt32(this.buf, val & -1, this.pos);
        writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
        this.pos += 8;
    },

    writeSFixed64: function(val) {
        this.realloc(8);
        writeInt32(this.buf, val & -1, this.pos);
        writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
        this.pos += 8;
    },

    writeVarint: function(val) {
        val = +val || 0;

        if (val > 0xfffffff || val < 0) {
            writeBigVarint(val, this);
            return;
        }

        this.realloc(4);

        this.buf[this.pos++] =           val & 0x7f  | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
        this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
        this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
        this.buf[this.pos++] =   (val >>> 7) & 0x7f;
    },

    writeSVarint: function(val) {
        this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
    },

    writeBoolean: function(val) {
        this.writeVarint(Boolean(val));
    },

    writeString: function(str) {
        str = String(str);
        this.realloc(str.length * 4);

        this.pos++; // reserve 1 byte for short string length

        var startPos = this.pos;
        // write the string directly to the buffer and see how much was written
        this.pos = writeUtf8(this.buf, str, this.pos);
        var len = this.pos - startPos;

        if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);

        // finally, write the message length in the reserved place and restore the position
        this.pos = startPos - 1;
        this.writeVarint(len);
        this.pos += len;
    },

    writeFloat: function(val) {
        this.realloc(4);
        ieee754.write(this.buf, val, this.pos, true, 23, 4);
        this.pos += 4;
    },

    writeDouble: function(val) {
        this.realloc(8);
        ieee754.write(this.buf, val, this.pos, true, 52, 8);
        this.pos += 8;
    },

    writeBytes: function(buffer) {
        var len = buffer.length;
        this.writeVarint(len);
        this.realloc(len);
        for (var i = 0; i < len; i++) this.buf[this.pos++] = buffer[i];
    },

    writeRawMessage: function(fn, obj) {
        this.pos++; // reserve 1 byte for short message length

        // write the message directly to the buffer and see how much was written
        var startPos = this.pos;
        fn(obj, this);
        var len = this.pos - startPos;

        if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);

        // finally, write the message length in the reserved place and restore the position
        this.pos = startPos - 1;
        this.writeVarint(len);
        this.pos += len;
    },

    writeMessage: function(tag, fn, obj) {
        this.writeTag(tag, Pbf.Bytes);
        this.writeRawMessage(fn, obj);
    },

    writePackedVarint:   function(tag, arr) { this.writeMessage(tag, writePackedVarint, arr);   },
    writePackedSVarint:  function(tag, arr) { this.writeMessage(tag, writePackedSVarint, arr);  },
    writePackedBoolean:  function(tag, arr) { this.writeMessage(tag, writePackedBoolean, arr);  },
    writePackedFloat:    function(tag, arr) { this.writeMessage(tag, writePackedFloat, arr);    },
    writePackedDouble:   function(tag, arr) { this.writeMessage(tag, writePackedDouble, arr);   },
    writePackedFixed32:  function(tag, arr) { this.writeMessage(tag, writePackedFixed32, arr);  },
    writePackedSFixed32: function(tag, arr) { this.writeMessage(tag, writePackedSFixed32, arr); },
    writePackedFixed64:  function(tag, arr) { this.writeMessage(tag, writePackedFixed64, arr);  },
    writePackedSFixed64: function(tag, arr) { this.writeMessage(tag, writePackedSFixed64, arr); },

    writeBytesField: function(tag, buffer) {
        this.writeTag(tag, Pbf.Bytes);
        this.writeBytes(buffer);
    },
    writeFixed32Field: function(tag, val) {
        this.writeTag(tag, Pbf.Fixed32);
        this.writeFixed32(val);
    },
    writeSFixed32Field: function(tag, val) {
        this.writeTag(tag, Pbf.Fixed32);
        this.writeSFixed32(val);
    },
    writeFixed64Field: function(tag, val) {
        this.writeTag(tag, Pbf.Fixed64);
        this.writeFixed64(val);
    },
    writeSFixed64Field: function(tag, val) {
        this.writeTag(tag, Pbf.Fixed64);
        this.writeSFixed64(val);
    },
    writeVarintField: function(tag, val) {
        this.writeTag(tag, Pbf.Varint);
        this.writeVarint(val);
    },
    writeSVarintField: function(tag, val) {
        this.writeTag(tag, Pbf.Varint);
        this.writeSVarint(val);
    },
    writeStringField: function(tag, str) {
        this.writeTag(tag, Pbf.Bytes);
        this.writeString(str);
    },
    writeFloatField: function(tag, val) {
        this.writeTag(tag, Pbf.Fixed32);
        this.writeFloat(val);
    },
    writeDoubleField: function(tag, val) {
        this.writeTag(tag, Pbf.Fixed64);
        this.writeDouble(val);
    },
    writeBooleanField: function(tag, val) {
        this.writeVarintField(tag, Boolean(val));
    }
};

function readVarintRemainder(l, s, p) {
    var buf = p.buf,
        h, b;

    b = buf[p.pos++]; h  = (b & 0x70) >> 4;  if (b < 0x80) return toNum(l, h, s);
    b = buf[p.pos++]; h |= (b & 0x7f) << 3;  if (b < 0x80) return toNum(l, h, s);
    b = buf[p.pos++]; h |= (b & 0x7f) << 10; if (b < 0x80) return toNum(l, h, s);
    b = buf[p.pos++]; h |= (b & 0x7f) << 17; if (b < 0x80) return toNum(l, h, s);
    b = buf[p.pos++]; h |= (b & 0x7f) << 24; if (b < 0x80) return toNum(l, h, s);
    b = buf[p.pos++]; h |= (b & 0x01) << 31; if (b < 0x80) return toNum(l, h, s);

    throw new Error('Expected varint not more than 10 bytes');
}

function readPackedEnd(pbf) {
    return pbf.type === Pbf.Bytes ?
        pbf.readVarint() + pbf.pos : pbf.pos + 1;
}

function toNum(low, high, isSigned) {
    if (isSigned) {
        return high * 0x100000000 + (low >>> 0);
    }

    return ((high >>> 0) * 0x100000000) + (low >>> 0);
}

function writeBigVarint(val, pbf) {
    var low, high;

    if (val >= 0) {
        low  = (val % 0x100000000) | 0;
        high = (val / 0x100000000) | 0;
    } else {
        low  = ~(-val % 0x100000000);
        high = ~(-val / 0x100000000);

        if (low ^ 0xffffffff) {
            low = (low + 1) | 0;
        } else {
            low = 0;
            high = (high + 1) | 0;
        }
    }

    if (val >= 0x10000000000000000 || val < -0x10000000000000000) {
        throw new Error('Given varint doesn\'t fit into 10 bytes');
    }

    pbf.realloc(10);

    writeBigVarintLow(low, high, pbf);
    writeBigVarintHigh(high, pbf);
}

function writeBigVarintLow(low, high, pbf) {
    pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
    pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
    pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
    pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
    pbf.buf[pbf.pos]   = low & 0x7f;
}

function writeBigVarintHigh(high, pbf) {
    var lsb = (high & 0x07) << 4;

    pbf.buf[pbf.pos++] |= lsb         | ((high >>>= 3) ? 0x80 : 0); if (!high) return;
    pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
    pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
    pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
    pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
    pbf.buf[pbf.pos++]  = high & 0x7f;
}

function makeRoomForExtraLength(startPos, len, pbf) {
    var extraLen =
        len <= 0x3fff ? 1 :
        len <= 0x1fffff ? 2 :
        len <= 0xfffffff ? 3 : Math.ceil(Math.log(len) / (Math.LN2 * 7));

    // if 1 byte isn't enough for encoding message length, shift the data to the right
    pbf.realloc(extraLen);
    for (var i = pbf.pos - 1; i >= startPos; i--) pbf.buf[i + extraLen] = pbf.buf[i];
}

function writePackedVarint(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeVarint(arr[i]);   }
function writePackedSVarint(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeSVarint(arr[i]);  }
function writePackedFloat(arr, pbf)    { for (var i = 0; i < arr.length; i++) pbf.writeFloat(arr[i]);    }
function writePackedDouble(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeDouble(arr[i]);   }
function writePackedBoolean(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeBoolean(arr[i]);  }
function writePackedFixed32(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed32(arr[i]);  }
function writePackedSFixed32(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed32(arr[i]); }
function writePackedFixed64(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed64(arr[i]);  }
function writePackedSFixed64(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed64(arr[i]); }

// Buffer code below from https://github.com/feross/buffer, MIT-licensed

function readUInt32(buf, pos) {
    return ((buf[pos]) |
        (buf[pos + 1] << 8) |
        (buf[pos + 2] << 16)) +
        (buf[pos + 3] * 0x1000000);
}

function writeInt32(buf, val, pos) {
    buf[pos] = val;
    buf[pos + 1] = (val >>> 8);
    buf[pos + 2] = (val >>> 16);
    buf[pos + 3] = (val >>> 24);
}

function readInt32(buf, pos) {
    return ((buf[pos]) |
        (buf[pos + 1] << 8) |
        (buf[pos + 2] << 16)) +
        (buf[pos + 3] << 24);
}

function readUtf8(buf, pos, end) {
    var str = '';
    var i = pos;

    while (i < end) {
        var b0 = buf[i];
        var c = null; // codepoint
        var bytesPerSequence =
            b0 > 0xEF ? 4 :
            b0 > 0xDF ? 3 :
            b0 > 0xBF ? 2 : 1;

        if (i + bytesPerSequence > end) break;

        var b1, b2, b3;

        if (bytesPerSequence === 1) {
            if (b0 < 0x80) {
                c = b0;
            }
        } else if (bytesPerSequence === 2) {
            b1 = buf[i + 1];
            if ((b1 & 0xC0) === 0x80) {
                c = (b0 & 0x1F) << 0x6 | (b1 & 0x3F);
                if (c <= 0x7F) {
                    c = null;
                }
            }
        } else if (bytesPerSequence === 3) {
            b1 = buf[i + 1];
            b2 = buf[i + 2];
            if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80) {
                c = (b0 & 0xF) << 0xC | (b1 & 0x3F) << 0x6 | (b2 & 0x3F);
                if (c <= 0x7FF || (c >= 0xD800 && c <= 0xDFFF)) {
                    c = null;
                }
            }
        } else if (bytesPerSequence === 4) {
            b1 = buf[i + 1];
            b2 = buf[i + 2];
            b3 = buf[i + 3];
            if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                c = (b0 & 0xF) << 0x12 | (b1 & 0x3F) << 0xC | (b2 & 0x3F) << 0x6 | (b3 & 0x3F);
                if (c <= 0xFFFF || c >= 0x110000) {
                    c = null;
                }
            }
        }

        if (c === null) {
            c = 0xFFFD;
            bytesPerSequence = 1;

        } else if (c > 0xFFFF) {
            c -= 0x10000;
            str += String.fromCharCode(c >>> 10 & 0x3FF | 0xD800);
            c = 0xDC00 | c & 0x3FF;
        }

        str += String.fromCharCode(c);
        i += bytesPerSequence;
    }

    return str;
}

function writeUtf8(buf, str, pos) {
    for (var i = 0, c, lead; i < str.length; i++) {
        c = str.charCodeAt(i); // code point

        if (c > 0xD7FF && c < 0xE000) {
            if (lead) {
                if (c < 0xDC00) {
                    buf[pos++] = 0xEF;
                    buf[pos++] = 0xBF;
                    buf[pos++] = 0xBD;
                    lead = c;
                    continue;
                } else {
                    c = lead - 0xD800 << 10 | c - 0xDC00 | 0x10000;
                    lead = null;
                }
            } else {
                if (c > 0xDBFF || (i + 1 === str.length)) {
                    buf[pos++] = 0xEF;
                    buf[pos++] = 0xBF;
                    buf[pos++] = 0xBD;
                } else {
                    lead = c;
                }
                continue;
            }
        } else if (lead) {
            buf[pos++] = 0xEF;
            buf[pos++] = 0xBF;
            buf[pos++] = 0xBD;
            lead = null;
        }

        if (c < 0x80) {
            buf[pos++] = c;
        } else {
            if (c < 0x800) {
                buf[pos++] = c >> 0x6 | 0xC0;
            } else {
                if (c < 0x10000) {
                    buf[pos++] = c >> 0xC | 0xE0;
                } else {
                    buf[pos++] = c >> 0x12 | 0xF0;
                    buf[pos++] = c >> 0xC & 0x3F | 0x80;
                }
                buf[pos++] = c >> 0x6 & 0x3F | 0x80;
            }
            buf[pos++] = c & 0x3F | 0x80;
        }
    }
    return pos;
}


/***/ }),

/***/ 65674:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: function() { return /* binding */ OLCesium; }
});

// EXTERNAL MODULE: ./node_modules/ol/geom/Point.js
var Point = __webpack_require__(51117);
// EXTERNAL MODULE: ./node_modules/ol/proj.js + 4 modules
var ol_proj = __webpack_require__(98108);
;// ./node_modules/olcs/lib/olcs/AutoRenderLoop.js
/**
 * By default Cesium (used to?) renders as often as possible.
 * This is a waste of resources (CPU/GPU/battery).
 * An alternative mechanism in Cesium is on-demand rendering.
 * This class makes use of this alternative method and add some additionnal render points.
 */
class AutoRenderLoop {
    ol3d;
    scene_;
    canvas_;
    _boundNotifyRepaintRequired;
    repaintEventNames_ = [
        'mousemove',
        'mousedown',
        'mouseup',
        'touchstart',
        'touchend',
        'touchmove',
        'pointerdown',
        'pointerup',
        'pointermove',
        'wheel',
    ];
    /**
     * @param ol3d
     */
    constructor(ol3d) {
        this.ol3d = ol3d;
        this.scene_ = ol3d.getCesiumScene();
        this.canvas_ = this.scene_.canvas;
        this._boundNotifyRepaintRequired = this.notifyRepaintRequired.bind(this);
        this.enable();
    }
    /**
     * Enable.
     */
    enable() {
        this.scene_.requestRenderMode = true;
        this.scene_.maximumRenderTimeChange = 1000;
        for (const repaintKey of this.repaintEventNames_) {
            this.canvas_.addEventListener(repaintKey, this._boundNotifyRepaintRequired, false);
        }
        window.addEventListener('resize', this._boundNotifyRepaintRequired, false);
        // Listen for changes on the layer group
        this.ol3d
            .getOlMap()
            .getLayerGroup()
            .on('change', this._boundNotifyRepaintRequired);
    }
    /**
     * Disable.
     */
    disable() {
        for (const repaintKey of this.repaintEventNames_) {
            this.canvas_.removeEventListener(repaintKey, this._boundNotifyRepaintRequired, false);
        }
        window.removeEventListener('resize', this._boundNotifyRepaintRequired, false);
        this.ol3d
            .getOlMap()
            .getLayerGroup()
            .un('change', this._boundNotifyRepaintRequired);
        this.scene_.requestRenderMode = false;
    }
    /**
     * Restart render loop.
     * Force a restart of the render loop.
     */
    restartRenderLoop() {
        this.notifyRepaintRequired();
    }
    notifyRepaintRequired() {
        if (!this.scene_.isDestroyed()) {
            this.scene_.requestRender();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b1JlbmRlckxvb3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvb2xjcy9BdXRvUmVuZGVyTG9vcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBQyxPQUFPLE9BQU8sY0FBYztJQUNqQyxJQUFJLENBQVc7SUFDUCxNQUFNLENBQVE7SUFDZCxPQUFPLENBQW9CO0lBQzNCLDJCQUEyQixDQUFvQztJQUMvRCxrQkFBa0IsR0FBRztRQUMzQixXQUFXO1FBQ1gsV0FBVztRQUNYLFNBQVM7UUFDVCxZQUFZO1FBQ1osVUFBVTtRQUNWLFdBQVc7UUFDWCxhQUFhO1FBQ2IsV0FBVztRQUNYLGFBQWE7UUFDYixPQUFPO0tBQ0MsQ0FBQztJQUVYOztPQUVHO0lBQ0gsWUFBWSxJQUFjO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU07UUFDSixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQztRQUMzQyxLQUFLLE1BQU0sVUFBVSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQzNCLFVBQVUsRUFDVixJQUFJLENBQUMsMkJBQTJCLEVBQ2hDLEtBQUssQ0FDTixDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTNFLHdDQUF3QztRQUN4QyxJQUFJLENBQUMsSUFBSTthQUNOLFFBQVEsRUFBRTthQUNWLGFBQWEsRUFBRTthQUNmLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsT0FBTztRQUNMLEtBQUssTUFBTSxVQUFVLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FDOUIsVUFBVSxFQUNWLElBQUksQ0FBQywyQkFBMkIsRUFDaEMsS0FBSyxDQUNOLENBQUM7UUFDSixDQUFDO1FBRUQsTUFBTSxDQUFDLG1CQUFtQixDQUN4QixRQUFRLEVBQ1IsSUFBSSxDQUFDLDJCQUEyQixFQUNoQyxLQUFLLENBQ04sQ0FBQztRQUVGLElBQUksQ0FBQyxJQUFJO2FBQ04sUUFBUSxFQUFFO2FBQ1YsYUFBYSxFQUFFO2FBQ2YsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUN4QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELHFCQUFxQjtRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDOUIsQ0FBQztJQUNILENBQUM7Q0FDRiJ9
// EXTERNAL MODULE: ./node_modules/ol/Observable.js
var Observable = __webpack_require__(52073);
// EXTERNAL MODULE: ./node_modules/ol/extent.js
var ol_extent = __webpack_require__(85752);
// EXTERNAL MODULE: ./node_modules/ol/LayerType.js
var LayerType = __webpack_require__(19075);
// EXTERNAL MODULE: ./node_modules/ol/layer/Layer.js
var Layer = __webpack_require__(48341);
;// ./node_modules/ol/layer/Image.js
/**
 * @module ol/layer/Image
 */




/**
 * @typedef {Object} Options
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
 * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
 * method was used.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
 * visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
 * be visible.
 * @property {import("../PluggableMap.js").default} [map] Sets the layer as overlay on a map. The map will not manage
 * this layer in its layers collection, and the layer will be rendered on top. This is useful for
 * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
 * use {@link module:ol/Map#addLayer}.
 * @property {import("../source/Image.js").default} [source] Source for this layer.
 */


/**
 * @classdesc
 * Server-rendered images that are available for arbitrary extents and
 * resolutions.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @fires import("../render/Event.js").RenderEvent
 * @api
 */
var ImageLayer = /*@__PURE__*/(function (Layer) {
  function ImageLayer(opt_options) {
    var options = opt_options ? opt_options : {};
    Layer.call(this, options);

    /**
     * The layer type.
     * @protected
     * @type {import("../LayerType.js").default}
     */
    this.type = LayerType/* default */.A.IMAGE;

  }

  if ( Layer ) ImageLayer.__proto__ = Layer;
  ImageLayer.prototype = Object.create( Layer && Layer.prototype );
  ImageLayer.prototype.constructor = ImageLayer;

  return ImageLayer;
}(Layer/* default */.A));


/**
 * Return the associated {@link module:ol/source/Image source} of the image layer.
 * @function
 * @return {import("../source/Image.js").default} Source.
 * @api
 */
ImageLayer.prototype.getSource;
/* harmony default export */ var layer_Image = (ImageLayer);

//# sourceMappingURL=Image.js.map
// EXTERNAL MODULE: ./node_modules/ol/layer/Tile.js
var Tile = __webpack_require__(92422);
// EXTERNAL MODULE: ./node_modules/ol/asserts.js
var asserts = __webpack_require__(17229);
// EXTERNAL MODULE: ./node_modules/ol/layer/TileProperty.js
var TileProperty = __webpack_require__(9359);
// EXTERNAL MODULE: ./node_modules/ol/layer/Vector.js
var Vector = __webpack_require__(33337);
// EXTERNAL MODULE: ./node_modules/ol/layer/VectorTileRenderType.js
var VectorTileRenderType = __webpack_require__(72033);
// EXTERNAL MODULE: ./node_modules/ol/obj.js
var obj = __webpack_require__(53495);
;// ./node_modules/ol/layer/VectorTile.js
/**
 * @module ol/layer/VectorTile
 */








/**
 * @typedef {Object} Options
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
 * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
 * method was used.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
 * visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
 * be visible.
 * @property {import("../render.js").OrderFunction} [renderOrder] Render order. Function to be used when sorting
 * features before rendering. By default features are drawn in the order that they are created. Use
 * `null` to avoid the sort, but get an undefined draw order.
 * @property {number} [renderBuffer=100] The buffer in pixels around the tile extent used by the
 * renderer when getting features from the vector tile for the rendering or hit-detection.
 * Recommended value: Vector tiles are usually generated with a buffer, so this value should match
 * the largest possible buffer of the used tiles. It should be at least the size of the largest
 * point symbol or line width.
 * @property {import("./VectorTileRenderType.js").default|string} [renderMode='hybrid'] Render mode for vector tiles:
 *  * `'image'`: Vector tiles are rendered as images. Great performance, but point symbols and texts
 *    are always rotated with the view and pixels are scaled during zoom animations.
 *  * `'hybrid'`: Polygon and line elements are rendered as images, so pixels are scaled during zoom
 *    animations. Point symbols and texts are accurately rendered as vectors and can stay upright on
 *    rotated views.
 *  * `'vector'`: Vector tiles are rendered as vectors. Most accurate rendering even during
 *    animations, but slower performance than the other options.
 *
 * When `declutter` is set to `true`, `'hybrid'` will be used instead of `'image'`.
 * @property {import("../source/VectorTile.js").default} [source] Source.
 * @property {import("../PluggableMap.js").default} [map] Sets the layer as overlay on a map. The map will not manage
 * this layer in its layers collection, and the layer will be rendered on top. This is useful for
 * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
 * use {@link module:ol/Map#addLayer}.
 * @property {boolean} [declutter=false] Declutter images and text. Decluttering is applied to all
 * image and text styles, and the priority is defined by the z-index of the style. Lower z-index
 * means higher priority. When set to `true`, a `renderMode` of `'image'` will be overridden with
 * `'hybrid'`.
 * @property {import("../style/Style.js").StyleLike} [style] Layer style. See
 * {@link module:ol/style} for default style which will be used if this is not defined.
 * @property {boolean} [updateWhileAnimating=false] When set to `true`, feature batches will be
 * recreated during animations. This means that no vectors will be shown clipped, but the setting
 * will have a performance impact for large amounts of vector data. When set to `false`, batches
 * will be recreated when no animation is active.
 * @property {boolean} [updateWhileInteracting=false] When set to `true`, feature batches will be
 * recreated during interactions. See also `updateWhileAnimating`.
 * @property {number} [preload=0] Preload. Load low-resolution tiles up to `preload` levels. `0`
 * means no preloading.
 * @property {import("../render.js").OrderFunction} [renderOrder] Render order. Function to be used when sorting
 * features before rendering. By default features are drawn in the order that they are created.
 * @property {import("../style/Style.js").StyleLike} [style] Layer style. See
 * {@link module:ol/style} for default style which will be used if this is not defined.
 * @property {boolean} [useInterimTilesOnError=true] Use interim tiles on error.
 */


/**
 * @classdesc
 * Layer for vector tile data that is rendered client-side.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @param {Options=} opt_options Options.
 * @api
 */
var VectorTileLayer = /*@__PURE__*/(function (VectorLayer) {
  function VectorTileLayer(opt_options) {
    var options = opt_options ? opt_options : {};

    var renderMode = options.renderMode || VectorTileRenderType/* default */.A.HYBRID;
    (0,asserts/* assert */.v)(renderMode == undefined ||
       renderMode == VectorTileRenderType/* default */.A.IMAGE ||
       renderMode == VectorTileRenderType/* default */.A.HYBRID ||
       renderMode == VectorTileRenderType/* default */.A.VECTOR,
    28); // `renderMode` must be `'image'`, `'hybrid'` or `'vector'`
    if (options.declutter && renderMode == VectorTileRenderType/* default */.A.IMAGE) {
      renderMode = VectorTileRenderType/* default */.A.HYBRID;
    }
    options.renderMode = renderMode;

    var baseOptions = /** @type {Object} */ ((0,obj/* assign */.kp)({}, options));
    delete baseOptions.preload;
    delete baseOptions.useInterimTilesOnError;

    VectorLayer.call(/** @type {import("./Vector.js").Options} */ this, (baseOptions));

    this.setPreload(options.preload ? options.preload : 0);
    this.setUseInterimTilesOnError(options.useInterimTilesOnError !== undefined ?
      options.useInterimTilesOnError : true);

    /**
    * The layer type.
    * @protected
    * @type {import("../LayerType.js").default}
    */
    this.type = LayerType/* default */.A.VECTOR_TILE;

  }

  if ( VectorLayer ) VectorTileLayer.__proto__ = VectorLayer;
  VectorTileLayer.prototype = Object.create( VectorLayer && VectorLayer.prototype );
  VectorTileLayer.prototype.constructor = VectorTileLayer;

  /**
  * Return the level as number to which we will preload tiles up to.
  * @return {number} The level to preload tiles up to.
  * @observable
  * @api
  */
  VectorTileLayer.prototype.getPreload = function getPreload () {
    return /** @type {number} */ (this.get(TileProperty/* default */.A.PRELOAD));
  };

  /**
  * Whether we use interim tiles on error.
  * @return {boolean} Use interim tiles on error.
  * @observable
  * @api
  */
  VectorTileLayer.prototype.getUseInterimTilesOnError = function getUseInterimTilesOnError () {
    return /** @type {boolean} */ (this.get(TileProperty/* default */.A.USE_INTERIM_TILES_ON_ERROR));
  };

  /**
  * Set the level as number to which we will preload tiles up to.
  * @param {number} preload The level to preload tiles up to.
  * @observable
  * @api
  */
  VectorTileLayer.prototype.setPreload = function setPreload (preload) {
    this.set(TileProperty/* default */.A.PRELOAD, preload);
  };

  /**
  * Set whether we use interim tiles on error.
  * @param {boolean} useInterimTilesOnError Use interim tiles on error.
  * @observable
  * @api
  */
  VectorTileLayer.prototype.setUseInterimTilesOnError = function setUseInterimTilesOnError (useInterimTilesOnError) {
    this.set(TileProperty/* default */.A.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
  };

  return VectorTileLayer;
}(Vector/* default */.A));


/**
 * Return the associated {@link module:ol/source/VectorTile vectortilesource} of the layer.
 * @function
 * @return {import("../source/VectorTile.js").default} Source.
 * @api
 */
VectorTileLayer.prototype.getSource;
/* harmony default export */ var VectorTile = (VectorTileLayer);

//# sourceMappingURL=VectorTile.js.map
// EXTERNAL MODULE: ./node_modules/ol/ImageBase.js
var ImageBase = __webpack_require__(46054);
// EXTERNAL MODULE: ./node_modules/ol/ImageState.js
var ImageState = __webpack_require__(80398);
// EXTERNAL MODULE: ./node_modules/ol/events.js
var events = __webpack_require__(17353);
// EXTERNAL MODULE: ./node_modules/ol/events/EventType.js
var EventType = __webpack_require__(55506);
;// ./node_modules/ol/Image.js
/**
 * @module ol/Image
 */







/**
 * A function that takes an {@link module:ol/Image~Image} for the image and a
 * `{string}` for the src as arguments. It is supposed to make it so the
 * underlying image {@link module:ol/Image~Image#getImage} is assigned the
 * content specified by the src. If not specified, the default is
 *
 *     function(image, src) {
 *       image.getImage().src = src;
 *     }
 *
 * Providing a custom `imageLoadFunction` can be useful to load images with
 * post requests or - in general - through XHR requests, where the src of the
 * image element would be set to a data URI when the content is loaded.
 *
 * @typedef {function(ImageWrapper, string)} LoadFunction
 * @api
 */


var ImageWrapper = /*@__PURE__*/(function (ImageBase) {
  function ImageWrapper(extent, resolution, pixelRatio, src, crossOrigin, imageLoadFunction) {

    ImageBase.call(this, extent, resolution, pixelRatio, ImageState/* default */.A.IDLE);

    /**
     * @private
     * @type {string}
     */
    this.src_ = src;

    /**
     * @private
     * @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement}
     */
    this.image_ = new Image();
    if (crossOrigin !== null) {
      this.image_.crossOrigin = crossOrigin;
    }

    /**
     * @private
     * @type {Array<import("./events.js").EventsKey>}
     */
    this.imageListenerKeys_ = null;

    /**
     * @protected
     * @type {ImageState}
     */
    this.state = ImageState/* default */.A.IDLE;

    /**
     * @private
     * @type {LoadFunction}
     */
    this.imageLoadFunction_ = imageLoadFunction;

  }

  if ( ImageBase ) ImageWrapper.__proto__ = ImageBase;
  ImageWrapper.prototype = Object.create( ImageBase && ImageBase.prototype );
  ImageWrapper.prototype.constructor = ImageWrapper;

  /**
   * @inheritDoc
   * @api
   */
  ImageWrapper.prototype.getImage = function getImage () {
    return this.image_;
  };

  /**
   * Tracks loading or read errors.
   *
   * @private
   */
  ImageWrapper.prototype.handleImageError_ = function handleImageError_ () {
    this.state = ImageState/* default */.A.ERROR;
    this.unlistenImage_();
    this.changed();
  };

  /**
   * Tracks successful image load.
   *
   * @private
   */
  ImageWrapper.prototype.handleImageLoad_ = function handleImageLoad_ () {
    if (this.resolution === undefined) {
      this.resolution = (0,ol_extent/* getHeight */.Oq)(this.extent) / this.image_.height;
    }
    this.state = ImageState/* default */.A.LOADED;
    this.unlistenImage_();
    this.changed();
  };

  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   * @override
   * @api
   */
  ImageWrapper.prototype.load = function load () {
    if (this.state == ImageState/* default */.A.IDLE || this.state == ImageState/* default */.A.ERROR) {
      this.state = ImageState/* default */.A.LOADING;
      this.changed();
      this.imageListenerKeys_ = [
        (0,events/* listenOnce */.Jz)(this.image_, EventType/* default */.A.ERROR,
          this.handleImageError_, this),
        (0,events/* listenOnce */.Jz)(this.image_, EventType/* default */.A.LOAD,
          this.handleImageLoad_, this)
      ];
      this.imageLoadFunction_(this, this.src_);
    }
  };

  /**
   * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image.
   */
  ImageWrapper.prototype.setImage = function setImage (image) {
    this.image_ = image;
  };

  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  ImageWrapper.prototype.unlistenImage_ = function unlistenImage_ () {
    this.imageListenerKeys_.forEach(events/* unlistenByKey */.JH);
    this.imageListenerKeys_ = null;
  };

  return ImageWrapper;
}(ImageBase/* default */.A));


/* harmony default export */ var ol_Image = (ImageWrapper);

//# sourceMappingURL=Image.js.map
// EXTERNAL MODULE: ./node_modules/ol/dom.js
var dom = __webpack_require__(84674);
// EXTERNAL MODULE: ./node_modules/ol/util.js
var util = __webpack_require__(94092);
// EXTERNAL MODULE: ./node_modules/ol/reproj/common.js
var common = __webpack_require__(20776);
// EXTERNAL MODULE: ./node_modules/ol/array.js
var array = __webpack_require__(19487);
// EXTERNAL MODULE: ./node_modules/ol/events/Event.js
var Event = __webpack_require__(43354);
// EXTERNAL MODULE: ./node_modules/ol/reproj.js
var reproj = __webpack_require__(22482);
// EXTERNAL MODULE: ./node_modules/ol/reproj/Triangulation.js
var Triangulation = __webpack_require__(95826);
;// ./node_modules/ol/reproj/Image.js
/**
 * @module ol/reproj/Image
 */











/**
 * @typedef {function(import("../extent.js").Extent, number, number) : import("../ImageBase.js").default} FunctionType
 */


/**
 * @classdesc
 * Class encapsulating single reprojected image.
 * See {@link module:ol/source/Image~ImageSource}.
 */
var ReprojImage = /*@__PURE__*/(function (ImageBase) {
  function ReprojImage(sourceProj, targetProj, targetExtent, targetResolution, pixelRatio, getImageFunction) {
    var maxSourceExtent = sourceProj.getExtent();
    var maxTargetExtent = targetProj.getExtent();

    var limitedTargetExtent = maxTargetExtent ?
      (0,ol_extent/* getIntersection */._N)(targetExtent, maxTargetExtent) : targetExtent;

    var targetCenter = (0,ol_extent/* getCenter */.q1)(limitedTargetExtent);
    var sourceResolution = (0,reproj/* calculateSourceResolution */.K)(
      sourceProj, targetProj, targetCenter, targetResolution);

    var errorThresholdInPixels = common/* ERROR_THRESHOLD */.l;

    var triangulation = new Triangulation/* default */.A(
      sourceProj, targetProj, limitedTargetExtent, maxSourceExtent,
      sourceResolution * errorThresholdInPixels);

    var sourceExtent = triangulation.calculateSourceExtent();
    var sourceImage = getImageFunction(sourceExtent, sourceResolution, pixelRatio);
    var state = ImageState/* default */.A.LOADED;
    if (sourceImage) {
      state = ImageState/* default */.A.IDLE;
    }
    var sourcePixelRatio = sourceImage ? sourceImage.getPixelRatio() : 1;

    ImageBase.call(this, targetExtent, targetResolution, sourcePixelRatio, state);

    /**
     * @private
     * @type {import("../proj/Projection.js").default}
     */
    this.targetProj_ = targetProj;

    /**
     * @private
     * @type {import("../extent.js").Extent}
     */
    this.maxSourceExtent_ = maxSourceExtent;

    /**
     * @private
     * @type {!import("./Triangulation.js").default}
     */
    this.triangulation_ = triangulation;

    /**
     * @private
     * @type {number}
     */
    this.targetResolution_ = targetResolution;

    /**
     * @private
     * @type {import("../extent.js").Extent}
     */
    this.targetExtent_ = targetExtent;

    /**
     * @private
     * @type {import("../ImageBase.js").default}
     */
    this.sourceImage_ = sourceImage;

    /**
     * @private
     * @type {number}
     */
    this.sourcePixelRatio_ = sourcePixelRatio;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = null;

    /**
     * @private
     * @type {?import("../events.js").EventsKey}
     */
    this.sourceListenerKey_ = null;
  }

  if ( ImageBase ) ReprojImage.__proto__ = ImageBase;
  ReprojImage.prototype = Object.create( ImageBase && ImageBase.prototype );
  ReprojImage.prototype.constructor = ReprojImage;

  /**
   * @inheritDoc
   */
  ReprojImage.prototype.disposeInternal = function disposeInternal () {
    if (this.state == ImageState/* default */.A.LOADING) {
      this.unlistenSource_();
    }
    ImageBase.prototype.disposeInternal.call(this);
  };

  /**
   * @inheritDoc
   */
  ReprojImage.prototype.getImage = function getImage () {
    return this.canvas_;
  };

  /**
   * @return {import("../proj/Projection.js").default} Projection.
   */
  ReprojImage.prototype.getProjection = function getProjection () {
    return this.targetProj_;
  };

  /**
   * @private
   */
  ReprojImage.prototype.reproject_ = function reproject_ () {
    var sourceState = this.sourceImage_.getState();
    if (sourceState == ImageState/* default */.A.LOADED) {
      var width = (0,ol_extent/* getWidth */.RG)(this.targetExtent_) / this.targetResolution_;
      var height = (0,ol_extent/* getHeight */.Oq)(this.targetExtent_) / this.targetResolution_;

      this.canvas_ = (0,reproj/* render */.X)(width, height, this.sourcePixelRatio_,
        this.sourceImage_.getResolution(), this.maxSourceExtent_,
        this.targetResolution_, this.targetExtent_, this.triangulation_, [{
          extent: this.sourceImage_.getExtent(),
          image: this.sourceImage_.getImage()
        }], 0);
    }
    this.state = sourceState;
    this.changed();
  };

  /**
   * @inheritDoc
   */
  ReprojImage.prototype.load = function load () {
    if (this.state == ImageState/* default */.A.IDLE) {
      this.state = ImageState/* default */.A.LOADING;
      this.changed();

      var sourceState = this.sourceImage_.getState();
      if (sourceState == ImageState/* default */.A.LOADED || sourceState == ImageState/* default */.A.ERROR) {
        this.reproject_();
      } else {
        this.sourceListenerKey_ = (0,events/* listen */.KT)(this.sourceImage_,
          EventType/* default */.A.CHANGE, function(e) {
            var sourceState = this.sourceImage_.getState();
            if (sourceState == ImageState/* default */.A.LOADED || sourceState == ImageState/* default */.A.ERROR) {
              this.unlistenSource_();
              this.reproject_();
            }
          }, this);
        this.sourceImage_.load();
      }
    }
  };

  /**
   * @private
   */
  ReprojImage.prototype.unlistenSource_ = function unlistenSource_ () {
    (0,events/* unlistenByKey */.JH)(/** @type {!import("../events.js").EventsKey} */ (this.sourceListenerKey_));
    this.sourceListenerKey_ = null;
  };

  return ReprojImage;
}(ImageBase/* default */.A));


/* harmony default export */ var reproj_Image = (ReprojImage);

//# sourceMappingURL=Image.js.map
// EXTERNAL MODULE: ./node_modules/ol/source/Source.js
var Source = __webpack_require__(76169);
;// ./node_modules/ol/source/Image.js
/**
 * @module ol/source/Image
 */











/**
 * @enum {string}
 */
var ImageSourceEventType = {

  /**
   * Triggered when an image starts loading.
   * @event ol/source/Image~ImageSourceEvent#imageloadstart
   * @api
   */
  IMAGELOADSTART: 'imageloadstart',

  /**
   * Triggered when an image finishes loading.
   * @event ol/source/Image~ImageSourceEvent#imageloadend
   * @api
   */
  IMAGELOADEND: 'imageloadend',

  /**
   * Triggered if image loading results in an error.
   * @event ol/source/Image~ImageSourceEvent#imageloaderror
   * @api
   */
  IMAGELOADERROR: 'imageloaderror'

};


/**
 * @classdesc
 * Events emitted by {@link module:ol/source/Image~ImageSource} instances are instances of this
 * type.
 */
var ImageSourceEvent = /*@__PURE__*/(function (Event) {
  function ImageSourceEvent(type, image) {

    Event.call(this, type);

    /**
     * The image related to the event.
     * @type {import("../Image.js").default}
     * @api
     */
    this.image = image;

  }

  if ( Event ) ImageSourceEvent.__proto__ = Event;
  ImageSourceEvent.prototype = Object.create( Event && Event.prototype );
  ImageSourceEvent.prototype.constructor = ImageSourceEvent;

  return ImageSourceEvent;
}(Event/* default */.Ay));


/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions]
 * @property {import("../proj.js").ProjectionLike} projection
 * @property {Array<number>} [resolutions]
 * @property {import("./State.js").default} [state]
 */


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for sources providing a single image.
 * @abstract
 * @api
 */
var ImageSource = /*@__PURE__*/(function (Source) {
  function ImageSource(options) {
    Source.call(this, {
      attributions: options.attributions,
      projection: options.projection,
      state: options.state
    });

    /**
     * @private
     * @type {Array<number>}
     */
    this.resolutions_ = options.resolutions !== undefined ?
      options.resolutions : null;


    /**
     * @private
     * @type {import("../reproj/Image.js").default}
     */
    this.reprojectedImage_ = null;


    /**
     * @private
     * @type {number}
     */
    this.reprojectedRevision_ = 0;
  }

  if ( Source ) ImageSource.__proto__ = Source;
  ImageSource.prototype = Object.create( Source && Source.prototype );
  ImageSource.prototype.constructor = ImageSource;

  /**
   * @return {Array<number>} Resolutions.
   * @override
   */
  ImageSource.prototype.getResolutions = function getResolutions () {
    return this.resolutions_;
  };

  /**
   * @protected
   * @param {number} resolution Resolution.
   * @return {number} Resolution.
   */
  ImageSource.prototype.findNearestResolution = function findNearestResolution (resolution) {
    if (this.resolutions_) {
      var idx = (0,array/* linearFindNearest */.FT)(this.resolutions_, resolution, 0);
      resolution = this.resolutions_[idx];
    }
    return resolution;
  };

  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../ImageBase.js").default} Single image.
   */
  ImageSource.prototype.getImage = function getImage (extent, resolution, pixelRatio, projection) {
    var sourceProjection = this.getProjection();
    if (!common/* ENABLE_RASTER_REPROJECTION */.b ||
        !sourceProjection ||
        !projection ||
        (0,ol_proj/* equivalent */.tI)(sourceProjection, projection)) {
      if (sourceProjection) {
        projection = sourceProjection;
      }
      return this.getImageInternal(extent, resolution, pixelRatio, projection);
    } else {
      if (this.reprojectedImage_) {
        if (this.reprojectedRevision_ == this.getRevision() &&
            (0,ol_proj/* equivalent */.tI)(
              this.reprojectedImage_.getProjection(), projection) &&
            this.reprojectedImage_.getResolution() == resolution &&
            (0,ol_extent/* equals */.aI)(this.reprojectedImage_.getExtent(), extent)) {
          return this.reprojectedImage_;
        }
        this.reprojectedImage_.dispose();
        this.reprojectedImage_ = null;
      }

      this.reprojectedImage_ = new reproj_Image(
        sourceProjection, projection, extent, resolution, pixelRatio,
        function(extent, resolution, pixelRatio) {
          return this.getImageInternal(extent, resolution,
            pixelRatio, sourceProjection);
        }.bind(this));
      this.reprojectedRevision_ = this.getRevision();

      return this.reprojectedImage_;
    }
  };

  /**
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../ImageBase.js").default} Single image.
   * @protected
   */
  ImageSource.prototype.getImageInternal = function getImageInternal (extent, resolution, pixelRatio, projection) {
    return (0,util/* abstract */.b0)();
  };

  /**
   * Handle image change events.
   * @param {import("../events/Event.js").default} event Event.
   * @protected
   */
  ImageSource.prototype.handleImageChange = function handleImageChange (event) {
    var image = /** @type {import("../Image.js").default} */ (event.target);
    switch (image.getState()) {
      case ImageState/* default */.A.LOADING:
        this.loading = true;
        this.dispatchEvent(
          new ImageSourceEvent(ImageSourceEventType.IMAGELOADSTART,
            image));
        break;
      case ImageState/* default */.A.LOADED:
        this.loading = false;
        this.dispatchEvent(
          new ImageSourceEvent(ImageSourceEventType.IMAGELOADEND,
            image));
        break;
      case ImageState/* default */.A.ERROR:
        this.loading = false;
        this.dispatchEvent(
          new ImageSourceEvent(ImageSourceEventType.IMAGELOADERROR,
            image));
        break;
      default:
        // pass
    }
  };

  return ImageSource;
}(Source/* default */.A));


/**
 * Default image load function for image sources that use import("../Image.js").Image image
 * instances.
 * @param {import("../Image.js").default} image Image.
 * @param {string} src Source.
 */
function defaultImageLoadFunction(image, src) {
  /** @type {HTMLImageElement|HTMLVideoElement} */ (image.getImage()).src = src;
}


/* harmony default export */ var source_Image = (ImageSource);

//# sourceMappingURL=Image.js.map
;// ./node_modules/ol/source/ImageStatic.js
/**
 * @module ol/source/ImageStatic
 */










/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {import("../extent.js").Extent} [imageExtent] Extent of the image in map coordinates.
 * This is the [left, bottom, right, top] map coordinates of your image.
 * @property {import("../Image.js").LoadFunction} [imageLoadFunction] Optional function to load an image given a URL.
 * @property {import("../proj.js").ProjectionLike} projection Projection.
 * @property {import("../size.js").Size} [imageSize] Size of the image in pixels. Usually the image size is auto-detected, so this
 * only needs to be set if auto-detection fails for some reason.
 * @property {string} url Image URL.
 */


/**
 * @classdesc
 * A layer source for displaying a single, static image.
 * @api
 */
var Static = /*@__PURE__*/(function (ImageSource) {
  function Static(options) {
    var crossOrigin = options.crossOrigin !== undefined ?
      options.crossOrigin : null;

    var /** @type {import("../Image.js").LoadFunction} */ imageLoadFunction =
        options.imageLoadFunction !== undefined ?
          options.imageLoadFunction : defaultImageLoadFunction;

    ImageSource.call(this, {
      attributions: options.attributions,
      projection: (0,ol_proj/* get */.Jt)(options.projection)
    });

    /**
     * @private
     * @type {string}
     */
    this.url_ = options.url;

    /**
     * @private
     * @type {import("../extent.js").Extent}
     */
    this.imageExtent_ = options.imageExtent;

    /**
     * @private
     * @type {import("../Image.js").default}
     */
    this.image_ = new ol_Image(this.imageExtent_, undefined, 1, this.url_, crossOrigin, imageLoadFunction);

    /**
     * @private
     * @type {import("../size.js").Size}
     */
    this.imageSize_ = options.imageSize ? options.imageSize : null;

    (0,events/* listen */.KT)(this.image_, EventType/* default */.A.CHANGE,
      this.handleImageChange, this);

  }

  if ( ImageSource ) Static.__proto__ = ImageSource;
  Static.prototype = Object.create( ImageSource && ImageSource.prototype );
  Static.prototype.constructor = Static;

  /**
   * Returns the image extent
   * @return {import("../extent.js").Extent} image extent.
   * @api
   */
  Static.prototype.getImageExtent = function getImageExtent () {
    return this.imageExtent_;
  };

  /**
   * @inheritDoc
   */
  Static.prototype.getImageInternal = function getImageInternal (extent, resolution, pixelRatio, projection) {
    if ((0,ol_extent/* intersects */.HY)(extent, this.image_.getExtent())) {
      return this.image_;
    }
    return null;
  };

  /**
   * Return the URL used for this image source.
   * @return {string} URL.
   * @api
   */
  Static.prototype.getUrl = function getUrl () {
    return this.url_;
  };

  /**
   * @inheritDoc
   */
  Static.prototype.handleImageChange = function handleImageChange (evt) {
    if (this.image_.getState() == ImageState/* default */.A.LOADED) {
      var imageExtent = this.image_.getExtent();
      var image = this.image_.getImage();
      var imageWidth, imageHeight;
      if (this.imageSize_) {
        imageWidth = this.imageSize_[0];
        imageHeight = this.imageSize_[1];
      } else {
        imageWidth = image.width;
        imageHeight = image.height;
      }
      var resolution = (0,ol_extent/* getHeight */.Oq)(imageExtent) / imageHeight;
      var targetWidth = Math.ceil((0,ol_extent/* getWidth */.RG)(imageExtent) / resolution);
      if (targetWidth != imageWidth) {
        var context = (0,dom/* createCanvasContext2D */.Y)(targetWidth, imageHeight);
        var canvas = context.canvas;
        context.drawImage(image, 0, 0, imageWidth, imageHeight,
          0, 0, canvas.width, canvas.height);
        this.image_.setImage(canvas);
      }
    }
    ImageSource.prototype.handleImageChange.call(this, evt);
  };

  return Static;
}(source_Image));


/* harmony default export */ var ImageStatic = (Static);

//# sourceMappingURL=ImageStatic.js.map
;// ./node_modules/ol/source/common.js
/**
 * @module ol/source/common
 */

/**
 * Default WMS version.
 * @type {string}
 */
var DEFAULT_WMS_VERSION = '1.3.0';

//# sourceMappingURL=common.js.map
;// ./node_modules/ol/source/WMSServerType.js
/**
 * @module ol/source/WMSServerType
 */

/**
 * Available server types: `'carmentaserver'`, `'geoserver'`, `'mapserver'`,
 *     `'qgis'`. These are servers that have vendor parameters beyond the WMS
 *     specification that OpenLayers can make use of.
 * @enum {string}
 */
/* harmony default export */ var WMSServerType = ({
  CARMENTA_SERVER: 'carmentaserver',
  GEOSERVER: 'geoserver',
  MAPSERVER: 'mapserver',
  QGIS: 'qgis'
});

//# sourceMappingURL=WMSServerType.js.map
;// ./node_modules/ol/string.js
/**
 * @module ol/string
 */

/**
 * @param {number} number Number to be formatted
 * @param {number} width The desired width
 * @param {number=} opt_precision Precision of the output string (i.e. number of decimal places)
 * @returns {string} Formatted string
 */
function padNumber(number, width, opt_precision) {
  var numberString = opt_precision !== undefined ? number.toFixed(opt_precision) : '' + number;
  var decimal = numberString.indexOf('.');
  decimal = decimal === -1 ? numberString.length : decimal;
  return decimal > width ? numberString : new Array(1 + width - decimal).join('0') + numberString;
}


/**
 * Adapted from https://github.com/omichelsen/compare-versions/blob/master/index.js
 * @param {string|number} v1 First version
 * @param {string|number} v2 Second version
 * @returns {number} Value
 */
function compareVersions(v1, v2) {
  var s1 = ('' + v1).split('.');
  var s2 = ('' + v2).split('.');

  for (var i = 0; i < Math.max(s1.length, s2.length); i++) {
    var n1 = parseInt(s1[i] || '0', 10);
    var n2 = parseInt(s2[i] || '0', 10);

    if (n1 > n2) {
      return 1;
    }
    if (n2 > n1) {
      return -1;
    }
  }

  return 0;
}

//# sourceMappingURL=string.js.map
;// ./node_modules/ol/uri.js
/**
 * @module ol/uri
 */


/**
 * Appends query parameters to a URI.
 *
 * @param {string} uri The original URI, which may already have query data.
 * @param {!Object} params An object where keys are URI-encoded parameter keys,
 *     and the values are arbitrary types or arrays.
 * @return {string} The new URI.
 */
function appendParams(uri, params) {
  var keyParams = [];
  // Skip any null or undefined parameter values
  Object.keys(params).forEach(function(k) {
    if (params[k] !== null && params[k] !== undefined) {
      keyParams.push(k + '=' + encodeURIComponent(params[k]));
    }
  });
  var qs = keyParams.join('&');
  // remove any trailing ? or &
  uri = uri.replace(/[?&]$/, '');
  // append ? or & depending on whether uri has existing parameters
  uri = uri.indexOf('?') === -1 ? uri + '?' : uri + '&';
  return uri + qs;
}

//# sourceMappingURL=uri.js.map
;// ./node_modules/ol/source/ImageWMS.js
/**
 * @module ol/source/ImageWMS
 */

















/**
 * @const
 * @type {import("../size.js").Size}
 */
var GETFEATUREINFO_IMAGE_SIZE = [101, 101];


/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
 * the image from the remote server.
 * @property {import("./WMSServerType.js").default|string} [serverType] The type of
 * the remote WMS server: `mapserver`, `geoserver` or `qgis`. Only needed if `hidpi` is `true`.
 * @property {import("../Image.js").LoadFunction} [imageLoadFunction] Optional function to load an image given a URL.
 * @property {Object<string,*>} params WMS request parameters.
 * At least a `LAYERS` param is required. `STYLES` is
 * `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
 * and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
 * @property {import("../proj.js").ProjectionLike} projection Projection.
 * @property {number} [ratio=1.5] Ratio. `1` means image requests are the size of the map viewport, `2` means
 * twice the width and height of the map viewport, and so on. Must be `1` or
 * higher.
 * @property {Array<number>} [resolutions] Resolutions.
 * If specified, requests will be made for these resolutions only.
 * @property {string} url WMS service URL.
 */


/**
 * @classdesc
 * Source for WMS servers providing single, untiled images.
 *
 * @fires ol/source/Image~ImageSourceEvent
 * @api
 */
var ImageWMS = /*@__PURE__*/(function (ImageSource) {
  function ImageWMS(opt_options) {

    var options = opt_options || /** @type {Options} */ ({});

    ImageSource.call(this, {
      attributions: options.attributions,
      projection: options.projection,
      resolutions: options.resolutions
    });

    /**
     * @private
     * @type {?string}
     */
    this.crossOrigin_ =
        options.crossOrigin !== undefined ? options.crossOrigin : null;

    /**
     * @private
     * @type {string|undefined}
     */
    this.url_ = options.url;

    /**
     * @private
     * @type {import("../Image.js").LoadFunction}
     */
    this.imageLoadFunction_ = options.imageLoadFunction !== undefined ?
      options.imageLoadFunction : defaultImageLoadFunction;

    /**
     * @private
     * @type {!Object}
     */
    this.params_ = options.params || {};

    /**
     * @private
     * @type {boolean}
     */
    this.v13_ = true;
    this.updateV13_();

    /**
     * @private
     * @type {import("./WMSServerType.js").default|undefined}
     */
    this.serverType_ = /** @type {import("./WMSServerType.js").default|undefined} */ (options.serverType);

    /**
     * @private
     * @type {boolean}
     */
    this.hidpi_ = options.hidpi !== undefined ? options.hidpi : true;

    /**
     * @private
     * @type {import("../Image.js").default}
     */
    this.image_ = null;

    /**
     * @private
     * @type {import("../size.js").Size}
     */
    this.imageSize_ = [0, 0];

    /**
     * @private
     * @type {number}
     */
    this.renderedRevision_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.ratio_ = options.ratio !== undefined ? options.ratio : 1.5;

  }

  if ( ImageSource ) ImageWMS.__proto__ = ImageSource;
  ImageWMS.prototype = Object.create( ImageSource && ImageSource.prototype );
  ImageWMS.prototype.constructor = ImageWMS;

  /**
   * Return the GetFeatureInfo URL for the passed coordinate, resolution, and
   * projection. Return `undefined` if the GetFeatureInfo URL cannot be
   * constructed.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {import("../proj.js").ProjectionLike} projection Projection.
   * @param {!Object} params GetFeatureInfo params. `INFO_FORMAT` at least should
   *     be provided. If `QUERY_LAYERS` is not provided then the layers specified
   *     in the `LAYERS` parameter will be used. `VERSION` should not be
   *     specified here.
   * @return {string|undefined} GetFeatureInfo URL.
   * @api
   */
  ImageWMS.prototype.getGetFeatureInfoUrl = function getGetFeatureInfoUrl (coordinate, resolution, projection, params) {
    if (this.url_ === undefined) {
      return undefined;
    }
    var projectionObj = (0,ol_proj/* get */.Jt)(projection);
    var sourceProjectionObj = this.getProjection();

    if (sourceProjectionObj && sourceProjectionObj !== projectionObj) {
      resolution = (0,reproj/* calculateSourceResolution */.K)(sourceProjectionObj, projectionObj, coordinate, resolution);
      coordinate = (0,ol_proj/* transform */.pd)(coordinate, projectionObj, sourceProjectionObj);
    }

    var extent = (0,ol_extent/* getForViewAndSize */.Bg)(coordinate, resolution, 0,
      GETFEATUREINFO_IMAGE_SIZE);

    var baseParams = {
      'SERVICE': 'WMS',
      'VERSION': DEFAULT_WMS_VERSION,
      'REQUEST': 'GetFeatureInfo',
      'FORMAT': 'image/png',
      'TRANSPARENT': true,
      'QUERY_LAYERS': this.params_['LAYERS']
    };
    (0,obj/* assign */.kp)(baseParams, this.params_, params);

    var x = Math.floor((coordinate[0] - extent[0]) / resolution);
    var y = Math.floor((extent[3] - coordinate[1]) / resolution);
    baseParams[this.v13_ ? 'I' : 'X'] = x;
    baseParams[this.v13_ ? 'J' : 'Y'] = y;

    return this.getRequestUrl_(
      extent, GETFEATUREINFO_IMAGE_SIZE,
      1, sourceProjectionObj || projectionObj, baseParams);
  };

  /**
   * Get the user-provided params, i.e. those passed to the constructor through
   * the "params" option, and possibly updated using the updateParams method.
   * @return {Object} Params.
   * @api
   */
  ImageWMS.prototype.getParams = function getParams () {
    return this.params_;
  };

  /**
   * @inheritDoc
   */
  ImageWMS.prototype.getImageInternal = function getImageInternal (extent, resolution, pixelRatio, projection) {

    if (this.url_ === undefined) {
      return null;
    }

    resolution = this.findNearestResolution(resolution);

    if (pixelRatio != 1 && (!this.hidpi_ || this.serverType_ === undefined)) {
      pixelRatio = 1;
    }

    var imageResolution = resolution / pixelRatio;

    var center = (0,ol_extent/* getCenter */.q1)(extent);
    var viewWidth = Math.ceil((0,ol_extent/* getWidth */.RG)(extent) / imageResolution);
    var viewHeight = Math.ceil((0,ol_extent/* getHeight */.Oq)(extent) / imageResolution);
    var viewExtent = (0,ol_extent/* getForViewAndSize */.Bg)(center, imageResolution, 0,
      [viewWidth, viewHeight]);
    var requestWidth = Math.ceil(this.ratio_ * (0,ol_extent/* getWidth */.RG)(extent) / imageResolution);
    var requestHeight = Math.ceil(this.ratio_ * (0,ol_extent/* getHeight */.Oq)(extent) / imageResolution);
    var requestExtent = (0,ol_extent/* getForViewAndSize */.Bg)(center, imageResolution, 0,
      [requestWidth, requestHeight]);

    var image = this.image_;
    if (image &&
        this.renderedRevision_ == this.getRevision() &&
        image.getResolution() == resolution &&
        image.getPixelRatio() == pixelRatio &&
        (0,ol_extent/* containsExtent */.ms)(image.getExtent(), viewExtent)) {
      return image;
    }

    var params = {
      'SERVICE': 'WMS',
      'VERSION': DEFAULT_WMS_VERSION,
      'REQUEST': 'GetMap',
      'FORMAT': 'image/png',
      'TRANSPARENT': true
    };
    (0,obj/* assign */.kp)(params, this.params_);

    this.imageSize_[0] = Math.round((0,ol_extent/* getWidth */.RG)(requestExtent) / imageResolution);
    this.imageSize_[1] = Math.round((0,ol_extent/* getHeight */.Oq)(requestExtent) / imageResolution);

    var url = this.getRequestUrl_(requestExtent, this.imageSize_, pixelRatio,
      projection, params);

    this.image_ = new ol_Image(requestExtent, resolution, pixelRatio,
      url, this.crossOrigin_, this.imageLoadFunction_);

    this.renderedRevision_ = this.getRevision();

    (0,events/* listen */.KT)(this.image_, EventType/* default */.A.CHANGE,
      this.handleImageChange, this);

    return this.image_;

  };

  /**
   * Return the image load function of the source.
   * @return {import("../Image.js").LoadFunction} The image load function.
   * @api
   */
  ImageWMS.prototype.getImageLoadFunction = function getImageLoadFunction () {
    return this.imageLoadFunction_;
  };

  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {import("../size.js").Size} size Size.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {Object} params Params.
   * @return {string} Request URL.
   * @private
   */
  ImageWMS.prototype.getRequestUrl_ = function getRequestUrl_ (extent, size, pixelRatio, projection, params) {

    (0,asserts/* assert */.v)(this.url_ !== undefined, 9); // `url` must be configured or set using `#setUrl()`

    params[this.v13_ ? 'CRS' : 'SRS'] = projection.getCode();

    if (!('STYLES' in this.params_)) {
      params['STYLES'] = '';
    }

    if (pixelRatio != 1) {
      switch (this.serverType_) {
        case WMSServerType.GEOSERVER:
          var dpi = (90 * pixelRatio + 0.5) | 0;
          if ('FORMAT_OPTIONS' in params) {
            params['FORMAT_OPTIONS'] += ';dpi:' + dpi;
          } else {
            params['FORMAT_OPTIONS'] = 'dpi:' + dpi;
          }
          break;
        case WMSServerType.MAPSERVER:
          params['MAP_RESOLUTION'] = 90 * pixelRatio;
          break;
        case WMSServerType.CARMENTA_SERVER:
        case WMSServerType.QGIS:
          params['DPI'] = 90 * pixelRatio;
          break;
        default:
          (0,asserts/* assert */.v)(false, 8); // Unknown `serverType` configured
          break;
      }
    }

    params['WIDTH'] = size[0];
    params['HEIGHT'] = size[1];

    var axisOrientation = projection.getAxisOrientation();
    var bbox;
    if (this.v13_ && axisOrientation.substr(0, 2) == 'ne') {
      bbox = [extent[1], extent[0], extent[3], extent[2]];
    } else {
      bbox = extent;
    }
    params['BBOX'] = bbox.join(',');

    return appendParams(/** @type {string} */ (this.url_), params);
  };

  /**
   * Return the URL used for this WMS source.
   * @return {string|undefined} URL.
   * @api
   */
  ImageWMS.prototype.getUrl = function getUrl () {
    return this.url_;
  };

  /**
   * Set the image load function of the source.
   * @param {import("../Image.js").LoadFunction} imageLoadFunction Image load function.
   * @api
   */
  ImageWMS.prototype.setImageLoadFunction = function setImageLoadFunction (imageLoadFunction) {
    this.image_ = null;
    this.imageLoadFunction_ = imageLoadFunction;
    this.changed();
  };

  /**
   * Set the URL to use for requests.
   * @param {string|undefined} url URL.
   * @api
   */
  ImageWMS.prototype.setUrl = function setUrl (url) {
    if (url != this.url_) {
      this.url_ = url;
      this.image_ = null;
      this.changed();
    }
  };

  /**
   * Update the user-provided params.
   * @param {Object} params Params.
   * @api
   */
  ImageWMS.prototype.updateParams = function updateParams (params) {
    (0,obj/* assign */.kp)(this.params_, params);
    this.updateV13_();
    this.image_ = null;
    this.changed();
  };

  /**
   * @private
   */
  ImageWMS.prototype.updateV13_ = function updateV13_ () {
    var version = this.params_['VERSION'] || DEFAULT_WMS_VERSION;
    this.v13_ = compareVersions(version, '1.3') >= 0;
  };

  return ImageWMS;
}(source_Image));


/* harmony default export */ var source_ImageWMS = (ImageWMS);

//# sourceMappingURL=ImageWMS.js.map
// EXTERNAL MODULE: ./node_modules/ol/source/TileImage.js + 2 modules
var TileImage = __webpack_require__(81798);
// EXTERNAL MODULE: ./node_modules/ol/math.js
var math = __webpack_require__(94966);
// EXTERNAL MODULE: ./node_modules/ol/size.js
var size = __webpack_require__(5245);
// EXTERNAL MODULE: ./node_modules/ol/tilecoord.js
var tilecoord = __webpack_require__(93435);
;// ./node_modules/ol/source/TileWMS.js
/**
 * @module ol/source/TileWMS
 */
















/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {Object<string,*>} params WMS request parameters.
 * At least a `LAYERS` param is required. `STYLES` is
 * `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
 * and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
 * @property {number} [gutter=0]
 * The size in pixels of the gutter around image tiles to ignore. By setting
 * this property to a non-zero value, images will be requested that are wider
 * and taller than the tile size by a value of `2 x gutter`.
 * Using a non-zero value allows artifacts of rendering at tile edges to be
 * ignored. If you control the WMS service it is recommended to address
 * "artifacts at tile edges" issues by properly configuring the WMS service. For
 * example, MapServer has a `tile_map_edge_buffer` configuration parameter for
 * this. See http://mapserver.org/output/tile_mode.html.
 * @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
 * the image from the remote server.
 * @property {import("../proj.js").ProjectionLike} projection Projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {typeof import("../ImageTile.js").default} [tileClass] Class used to instantiate image tiles.
 * Default is {@link module:ol/ImageTile~ImageTile}.
 * @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid. Base this on the resolutions,
 * tilesize and extent supported by the server.
 * If this is not defined, a default grid will be used: if there is a projection
 * extent, the grid will be based on that; if not, a grid based on a global
 * extent with origin at 0,0 will be used..
 * @property {import("./WMSServerType.js").default|string} [serverType]
 * The type of the remote WMS server. Currently only used when `hidpi` is
 * `true`.
 * @property {import("../Tile.js").LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {string} [url] WMS service URL.
 * @property {Array<string>} [urls] WMS service urls.
 * Use this instead of `url` when the WMS supports multiple urls for GetMap requests.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * When set to `false`, only one world
 * will be rendered. When `true`, tiles will be requested for one world only,
 * but they will be wrapped horizontally to render multiple worlds.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 */


/**
 * @classdesc
 * Layer source for tile data from WMS servers.
 * @api
 */
var TileWMS = /*@__PURE__*/(function (TileImage) {
  function TileWMS(opt_options) {

    var options = opt_options || /** @type {Options} */ ({});

    var params = options.params || {};

    var transparent = 'TRANSPARENT' in params ? params['TRANSPARENT'] : true;

    TileImage.call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      opaque: !transparent,
      projection: options.projection,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileClass: options.tileClass,
      tileGrid: options.tileGrid,
      tileLoadFunction: options.tileLoadFunction,
      tileUrlFunction: tileUrlFunction,
      url: options.url,
      urls: options.urls,
      wrapX: options.wrapX !== undefined ? options.wrapX : true,
      transition: options.transition
    });

    /**
     * @private
     * @type {number}
     */
    this.gutter_ = options.gutter !== undefined ? options.gutter : 0;

    /**
     * @private
     * @type {!Object}
     */
    this.params_ = params;

    /**
     * @private
     * @type {boolean}
     */
    this.v13_ = true;

    /**
     * @private
     * @type {import("./WMSServerType.js").default|undefined}
     */
    this.serverType_ = /** @type {import("./WMSServerType.js").default|undefined} */ (options.serverType);

    /**
     * @private
     * @type {boolean}
     */
    this.hidpi_ = options.hidpi !== undefined ? options.hidpi : true;

    /**
     * @private
     * @type {import("../extent.js").Extent}
     */
    this.tmpExtent_ = (0,ol_extent/* createEmpty */.S5)();

    this.updateV13_();
    this.setKey(this.getKeyForParams_());

  }

  if ( TileImage ) TileWMS.__proto__ = TileImage;
  TileWMS.prototype = Object.create( TileImage && TileImage.prototype );
  TileWMS.prototype.constructor = TileWMS;

  /**
   * Return the GetFeatureInfo URL for the passed coordinate, resolution, and
   * projection. Return `undefined` if the GetFeatureInfo URL cannot be
   * constructed.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {import("../proj.js").ProjectionLike} projection Projection.
   * @param {!Object} params GetFeatureInfo params. `INFO_FORMAT` at least should
   *     be provided. If `QUERY_LAYERS` is not provided then the layers specified
   *     in the `LAYERS` parameter will be used. `VERSION` should not be
   *     specified here.
   * @return {string|undefined} GetFeatureInfo URL.
   * @api
   */
  TileWMS.prototype.getGetFeatureInfoUrl = function getGetFeatureInfoUrl (coordinate, resolution, projection, params) {
    var projectionObj = (0,ol_proj/* get */.Jt)(projection);
    var sourceProjectionObj = this.getProjection();

    var tileGrid = this.getTileGrid();
    if (!tileGrid) {
      tileGrid = this.getTileGridForProjection(projectionObj);
    }

    var tileCoord = tileGrid.getTileCoordForCoordAndResolution(coordinate, resolution);

    if (tileGrid.getResolutions().length <= tileCoord[0]) {
      return undefined;
    }

    var tileResolution = tileGrid.getResolution(tileCoord[0]);
    var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
    var tileSize = (0,size/* toSize */.xq)(tileGrid.getTileSize(tileCoord[0]), this.tmpSize);


    var gutter = this.gutter_;
    if (gutter !== 0) {
      tileSize = (0,size/* buffer */.r)(tileSize, gutter, this.tmpSize);
      tileExtent = (0,ol_extent/* buffer */.r)(tileExtent, tileResolution * gutter, tileExtent);
    }

    if (sourceProjectionObj && sourceProjectionObj !== projectionObj) {
      tileResolution = (0,reproj/* calculateSourceResolution */.K)(sourceProjectionObj, projectionObj, coordinate, tileResolution);
      tileExtent = (0,ol_proj/* transformExtent */.DI)(tileExtent, projectionObj, sourceProjectionObj);
      coordinate = (0,ol_proj/* transform */.pd)(coordinate, projectionObj, sourceProjectionObj);
    }

    var baseParams = {
      'SERVICE': 'WMS',
      'VERSION': DEFAULT_WMS_VERSION,
      'REQUEST': 'GetFeatureInfo',
      'FORMAT': 'image/png',
      'TRANSPARENT': true,
      'QUERY_LAYERS': this.params_['LAYERS']
    };
    (0,obj/* assign */.kp)(baseParams, this.params_, params);

    var x = Math.floor((coordinate[0] - tileExtent[0]) / tileResolution);
    var y = Math.floor((tileExtent[3] - coordinate[1]) / tileResolution);

    baseParams[this.v13_ ? 'I' : 'X'] = x;
    baseParams[this.v13_ ? 'J' : 'Y'] = y;

    return this.getRequestUrl_(tileCoord, tileSize, tileExtent,
      1, sourceProjectionObj || projectionObj, baseParams);
  };

  /**
   * @inheritDoc
   */
  TileWMS.prototype.getGutter = function getGutter () {
    return this.gutter_;
  };

  /**
   * Get the user-provided params, i.e. those passed to the constructor through
   * the "params" option, and possibly updated using the updateParams method.
   * @return {Object} Params.
   * @api
   */
  TileWMS.prototype.getParams = function getParams () {
    return this.params_;
  };

  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../size.js").Size} tileSize Tile size.
   * @param {import("../extent.js").Extent} tileExtent Tile extent.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {Object} params Params.
   * @return {string|undefined} Request URL.
   * @private
   */
  TileWMS.prototype.getRequestUrl_ = function getRequestUrl_ (tileCoord, tileSize, tileExtent, pixelRatio, projection, params) {

    var urls = this.urls;
    if (!urls) {
      return undefined;
    }

    params['WIDTH'] = tileSize[0];
    params['HEIGHT'] = tileSize[1];

    params[this.v13_ ? 'CRS' : 'SRS'] = projection.getCode();

    if (!('STYLES' in this.params_)) {
      params['STYLES'] = '';
    }

    if (pixelRatio != 1) {
      switch (this.serverType_) {
        case WMSServerType.GEOSERVER:
          var dpi = (90 * pixelRatio + 0.5) | 0;
          if ('FORMAT_OPTIONS' in params) {
            params['FORMAT_OPTIONS'] += ';dpi:' + dpi;
          } else {
            params['FORMAT_OPTIONS'] = 'dpi:' + dpi;
          }
          break;
        case WMSServerType.MAPSERVER:
          params['MAP_RESOLUTION'] = 90 * pixelRatio;
          break;
        case WMSServerType.CARMENTA_SERVER:
        case WMSServerType.QGIS:
          params['DPI'] = 90 * pixelRatio;
          break;
        default:
          (0,asserts/* assert */.v)(false, 52); // Unknown `serverType` configured
          break;
      }
    }

    var axisOrientation = projection.getAxisOrientation();
    var bbox = tileExtent;
    if (this.v13_ && axisOrientation.substr(0, 2) == 'ne') {
      var tmp;
      tmp = tileExtent[0];
      bbox[0] = tileExtent[1];
      bbox[1] = tmp;
      tmp = tileExtent[2];
      bbox[2] = tileExtent[3];
      bbox[3] = tmp;
    }
    params['BBOX'] = bbox.join(',');

    var url;
    if (urls.length == 1) {
      url = urls[0];
    } else {
      var index = (0,math/* modulo */.xP)((0,tilecoord/* hash */.tW)(tileCoord), urls.length);
      url = urls[index];
    }
    return appendParams(url, params);
  };

  /**
   * @inheritDoc
   */
  TileWMS.prototype.getTilePixelRatio = function getTilePixelRatio (pixelRatio) {
    return (!this.hidpi_ || this.serverType_ === undefined) ? 1 :
    /** @type {number} */ (pixelRatio);
  };

  /**
   * @private
   * @return {string} The key for the current params.
   */
  TileWMS.prototype.getKeyForParams_ = function getKeyForParams_ () {
    var i = 0;
    var res = [];
    for (var key in this.params_) {
      res[i++] = key + '-' + this.params_[key];
    }
    return res.join('/');
  };

  /**
   * Update the user-provided params.
   * @param {Object} params Params.
   * @api
   */
  TileWMS.prototype.updateParams = function updateParams (params) {
    (0,obj/* assign */.kp)(this.params_, params);
    this.updateV13_();
    this.setKey(this.getKeyForParams_());
  };

  /**
   * @private
   */
  TileWMS.prototype.updateV13_ = function updateV13_ () {
    var version = this.params_['VERSION'] || DEFAULT_WMS_VERSION;
    this.v13_ = compareVersions(version, '1.3') >= 0;
  };

  return TileWMS;
}(TileImage/* default */.A));

/**
 * @param {import("../tilecoord.js").TileCoord} tileCoord The tile coordinate
 * @param {number} pixelRatio The pixel ratio
 * @param {import("../proj/Projection.js").default} projection The projection
 * @return {string|undefined} The tile URL
 * @this {TileWMS}
 */
function tileUrlFunction(tileCoord, pixelRatio, projection) {

  var tileGrid = this.getTileGrid();
  if (!tileGrid) {
    tileGrid = this.getTileGridForProjection(projection);
  }

  if (tileGrid.getResolutions().length <= tileCoord[0]) {
    return undefined;
  }

  if (pixelRatio != 1 && (!this.hidpi_ || this.serverType_ === undefined)) {
    pixelRatio = 1;
  }

  var tileResolution = tileGrid.getResolution(tileCoord[0]);
  var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
  var tileSize = (0,size/* toSize */.xq)(
    tileGrid.getTileSize(tileCoord[0]), this.tmpSize);

  var gutter = this.gutter_;
  if (gutter !== 0) {
    tileSize = (0,size/* buffer */.r)(tileSize, gutter, this.tmpSize);
    tileExtent = (0,ol_extent/* buffer */.r)(tileExtent, tileResolution * gutter, tileExtent);
  }

  if (pixelRatio != 1) {
    tileSize = (0,size/* scale */.hs)(tileSize, pixelRatio, this.tmpSize);
  }

  var baseParams = {
    'SERVICE': 'WMS',
    'VERSION': DEFAULT_WMS_VERSION,
    'REQUEST': 'GetMap',
    'FORMAT': 'image/png',
    'TRANSPARENT': true
  };
  (0,obj/* assign */.kp)(baseParams, this.params_);

  return this.getRequestUrl_(tileCoord, tileSize, tileExtent,
    pixelRatio, projection, baseParams);
}


/* harmony default export */ var source_TileWMS = (TileWMS);

//# sourceMappingURL=TileWMS.js.map
// EXTERNAL MODULE: ./node_modules/ol/TileState.js
var TileState = __webpack_require__(74255);
// EXTERNAL MODULE: ./node_modules/ol/Tile.js
var ol_Tile = __webpack_require__(31644);
// EXTERNAL MODULE: ./node_modules/ol/featureloader.js
var featureloader = __webpack_require__(13931);
// EXTERNAL MODULE: ./node_modules/ol/functions.js
var functions = __webpack_require__(29991);
;// ./node_modules/ol/VectorImageTile.js
/**
 * @module ol/VectorImageTile
 */











/**
 * @typedef {Object} ReplayState
 * @property {boolean} dirty
 * @property {null|import("./render.js").OrderFunction} renderedRenderOrder
 * @property {number} renderedTileRevision
 * @property {number} renderedRevision
 */


var VectorImageTile = /*@__PURE__*/(function (Tile) {
  function VectorImageTile(tileCoord, state, sourceRevision, format, tileLoadFunction,
    urlTileCoord, tileUrlFunction, sourceTileGrid, tileGrid, sourceTiles,
    pixelRatio, projection, tileClass, handleTileChange, zoom) {

    Tile.call(this, tileCoord, state, {transition: 0});

    /**
     * @private
     * @type {!Object<string, CanvasRenderingContext2D>}
     */
    this.context_ = {};

    /**
     * @private
     * @type {import("./featureloader.js").FeatureLoader}
     */
    this.loader_;

    /**
     * @private
     * @type {!Object<string, ReplayState>}
     */
    this.replayState_ = {};

    /**
     * @private
     * @type {Object<string, import("./VectorTile.js").default>}
     */
    this.sourceTiles_ = sourceTiles;

    /**
     * Keys of source tiles used by this tile. Use with {@link #getTile}.
     * @type {Array<string>}
     */
    this.tileKeys = [];

    /**
     * @type {import("./extent.js").Extent}
     */
    this.extent = null;

    /**
     * @type {number}
     */
    this.sourceRevision_ = sourceRevision;

    /**
     * @type {import("./tilecoord.js").TileCoord}
     */
    this.wrappedTileCoord = urlTileCoord;

    /**
     * @type {Array<import("./events.js").EventsKey>}
     */
    this.loadListenerKeys_ = [];

    /**
     * @type {Array<import("./events.js").EventsKey>}
     */
    this.sourceTileListenerKeys_ = [];

    if (urlTileCoord) {
      var extent = this.extent = tileGrid.getTileCoordExtent(urlTileCoord);
      var resolution = tileGrid.getResolution(zoom);
      var sourceZ = sourceTileGrid.getZForResolution(resolution);
      var useLoadedOnly = zoom != tileCoord[0];
      var loadCount = 0;
      sourceTileGrid.forEachTileCoord(extent, sourceZ, function(sourceTileCoord) {
        var sharedExtent = (0,ol_extent/* getIntersection */._N)(extent,
          sourceTileGrid.getTileCoordExtent(sourceTileCoord));
        var sourceExtent = sourceTileGrid.getExtent();
        if (sourceExtent) {
          sharedExtent = (0,ol_extent/* getIntersection */._N)(sharedExtent, sourceExtent, sharedExtent);
        }
        if ((0,ol_extent/* getWidth */.RG)(sharedExtent) / resolution >= 0.5 &&
            (0,ol_extent/* getHeight */.Oq)(sharedExtent) / resolution >= 0.5) {
          // only include source tile if overlap is at least 1 pixel
          ++loadCount;
          var sourceTileKey = sourceTileCoord.toString();
          var sourceTile = sourceTiles[sourceTileKey];
          if (!sourceTile && !useLoadedOnly) {
            var tileUrl = tileUrlFunction(sourceTileCoord, pixelRatio, projection);
            sourceTile = sourceTiles[sourceTileKey] = new tileClass(sourceTileCoord,
              tileUrl == undefined ? TileState/* default */.A.EMPTY : TileState/* default */.A.IDLE,
              tileUrl == undefined ? '' : tileUrl,
              format, tileLoadFunction);
            this.sourceTileListenerKeys_.push(
              (0,events/* listen */.KT)(sourceTile, EventType/* default */.A.CHANGE, handleTileChange));
          }
          if (sourceTile && (!useLoadedOnly || sourceTile.getState() == TileState/* default */.A.LOADED)) {
            sourceTile.consumers++;
            this.tileKeys.push(sourceTileKey);
          }
        }
      }.bind(this));

      if (useLoadedOnly && loadCount == this.tileKeys.length) {
        this.finishLoading_();
      }

      if (zoom <= tileCoord[0] && this.state != TileState/* default */.A.LOADED) {
        while (zoom > tileGrid.getMinZoom()) {
          var tile = new VectorImageTile(tileCoord, state, sourceRevision,
            format, tileLoadFunction, urlTileCoord, tileUrlFunction,
            sourceTileGrid, tileGrid, sourceTiles, pixelRatio, projection,
            tileClass, functions/* VOID */.tV, --zoom);
          if (tile.state == TileState/* default */.A.LOADED) {
            this.interimTile = tile;
            break;
          }
        }
      }
    }

  }

  if ( Tile ) VectorImageTile.__proto__ = Tile;
  VectorImageTile.prototype = Object.create( Tile && Tile.prototype );
  VectorImageTile.prototype.constructor = VectorImageTile;

  /**
   * @inheritDoc
   */
  VectorImageTile.prototype.disposeInternal = function disposeInternal () {
    this.state = TileState/* default */.A.ABORT;
    this.changed();
    if (this.interimTile) {
      this.interimTile.dispose();
    }

    for (var i = 0, ii = this.tileKeys.length; i < ii; ++i) {
      var sourceTileKey = this.tileKeys[i];
      var sourceTile = this.getTile(sourceTileKey);
      sourceTile.consumers--;
      if (sourceTile.consumers == 0) {
        delete this.sourceTiles_[sourceTileKey];
        sourceTile.dispose();
      }
    }
    this.tileKeys.length = 0;
    this.sourceTiles_ = null;
    this.loadListenerKeys_.forEach(events/* unlistenByKey */.JH);
    this.loadListenerKeys_.length = 0;
    this.sourceTileListenerKeys_.forEach(events/* unlistenByKey */.JH);
    this.sourceTileListenerKeys_.length = 0;
    Tile.prototype.disposeInternal.call(this);
  };

  /**
   * @param {import("./layer/Layer.js").default} layer Layer.
   * @return {CanvasRenderingContext2D} The rendering context.
   */
  VectorImageTile.prototype.getContext = function getContext (layer) {
    var key = (0,util/* getUid */.v6)(layer);
    if (!(key in this.context_)) {
      this.context_[key] = (0,dom/* createCanvasContext2D */.Y)();
    }
    return this.context_[key];
  };

  /**
   * Get the Canvas for this tile.
   * @param {import("./layer/Layer.js").default} layer Layer.
   * @return {HTMLCanvasElement} Canvas.
   */
  VectorImageTile.prototype.getImage = function getImage (layer) {
    return this.getReplayState(layer).renderedTileRevision == -1 ?
      null : this.getContext(layer).canvas;
  };

  /**
   * @param {import("./layer/Layer.js").default} layer Layer.
   * @return {ReplayState} The replay state.
   */
  VectorImageTile.prototype.getReplayState = function getReplayState (layer) {
    var key = (0,util/* getUid */.v6)(layer);
    if (!(key in this.replayState_)) {
      this.replayState_[key] = {
        dirty: false,
        renderedRenderOrder: null,
        renderedRevision: -1,
        renderedTileRevision: -1
      };
    }
    return this.replayState_[key];
  };

  /**
   * @inheritDoc
   */
  VectorImageTile.prototype.getKey = function getKey () {
    return this.tileKeys.join('/') + '-' + this.sourceRevision_;
  };

  /**
   * @param {string} tileKey Key (tileCoord) of the source tile.
   * @return {import("./VectorTile.js").default} Source tile.
   */
  VectorImageTile.prototype.getTile = function getTile (tileKey) {
    return this.sourceTiles_[tileKey];
  };

  /**
   * @inheritDoc
   */
  VectorImageTile.prototype.load = function load () {
    // Source tiles with LOADED state - we just count them because once they are
    // loaded, we're no longer listening to state changes.
    var leftToLoad = 0;
    // Source tiles with ERROR state - we track them because they can still have
    // an ERROR state after another load attempt.
    var errorSourceTiles = {};

    if (this.state == TileState/* default */.A.IDLE) {
      this.setState(TileState/* default */.A.LOADING);
    }
    if (this.state == TileState/* default */.A.LOADING) {
      this.tileKeys.forEach(function(sourceTileKey) {
        var sourceTile = this.getTile(sourceTileKey);
        if (sourceTile.state == TileState/* default */.A.IDLE) {
          sourceTile.setLoader(this.loader_);
          sourceTile.load();
        }
        if (sourceTile.state == TileState/* default */.A.LOADING) {
          var key = (0,events/* listen */.KT)(sourceTile, EventType/* default */.A.CHANGE, function(e) {
            var state = sourceTile.getState();
            if (state == TileState/* default */.A.LOADED ||
                state == TileState/* default */.A.ERROR) {
              var uid = (0,util/* getUid */.v6)(sourceTile);
              if (state == TileState/* default */.A.ERROR) {
                errorSourceTiles[uid] = true;
              } else {
                --leftToLoad;
                delete errorSourceTiles[uid];
              }
              if (leftToLoad - Object.keys(errorSourceTiles).length == 0) {
                this.finishLoading_();
              }
            }
          }.bind(this));
          this.loadListenerKeys_.push(key);
          ++leftToLoad;
        }
      }.bind(this));
    }
    if (leftToLoad - Object.keys(errorSourceTiles).length == 0) {
      setTimeout(this.finishLoading_.bind(this), 0);
    }
  };

  /**
   * @private
   */
  VectorImageTile.prototype.finishLoading_ = function finishLoading_ () {
    var loaded = this.tileKeys.length;
    var empty = 0;
    for (var i = loaded - 1; i >= 0; --i) {
      var state = this.getTile(this.tileKeys[i]).getState();
      if (state != TileState/* default */.A.LOADED) {
        --loaded;
      }
      if (state == TileState/* default */.A.EMPTY) {
        ++empty;
      }
    }
    if (loaded == this.tileKeys.length) {
      this.loadListenerKeys_.forEach(events/* unlistenByKey */.JH);
      this.loadListenerKeys_.length = 0;
      this.setState(TileState/* default */.A.LOADED);
    } else {
      this.setState(empty == this.tileKeys.length ? TileState/* default */.A.EMPTY : TileState/* default */.A.ERROR);
    }
  };

  return VectorImageTile;
}(ol_Tile/* default */.A));


/* harmony default export */ var ol_VectorImageTile = (VectorImageTile);

/**
 * Sets the loader for a tile.
 * @param {import("./VectorTile.js").default} tile Vector tile.
 * @param {string} url URL.
 */
function defaultLoadFunction(tile, url) {
  var loader = (0,featureloader/* loadFeaturesXhr */.m)(url, tile.getFormat(), tile.onLoad.bind(tile), tile.onError.bind(tile));
  tile.setLoader(loader);
}

//# sourceMappingURL=VectorImageTile.js.map
;// ./node_modules/ol/VectorTile.js
/**
 * @module ol/VectorTile
 */




/**
 * @const
 * @type {import("./extent.js").Extent}
 */
var DEFAULT_EXTENT = [0, 0, 4096, 4096];


var VectorTile_VectorTile = /*@__PURE__*/(function (Tile) {
  function VectorTile(tileCoord, state, src, format, tileLoadFunction, opt_options) {

    Tile.call(this, tileCoord, state, opt_options);

    /**
     * @type {number}
     */
    this.consumers = 0;

    /**
     * @private
     * @type {import("./extent.js").Extent}
     */
    this.extent_ = null;

    /**
     * @private
     * @type {import("./format/Feature.js").default}
     */
    this.format_ = format;

    /**
     * @private
     * @type {Array<import("./Feature.js").default>}
     */
    this.features_ = null;

    /**
     * @private
     * @type {import("./featureloader.js").FeatureLoader}
     */
    this.loader_;

    /**
     * Data projection
     * @private
     * @type {import("./proj/Projection.js").default}
     */
    this.projection_ = null;

    /**
     * @private
     * @type {Object<string, import("./render/ReplayGroup.js").default>}
     */
    this.replayGroups_ = {};

    /**
     * @private
     * @type {import("./Tile.js").LoadFunction}
     */
    this.tileLoadFunction_ = tileLoadFunction;

    /**
     * @private
     * @type {string}
     */
    this.url_ = src;

  }

  if ( Tile ) VectorTile.__proto__ = Tile;
  VectorTile.prototype = Object.create( Tile && Tile.prototype );
  VectorTile.prototype.constructor = VectorTile;

  /**
   * @inheritDoc
   */
  VectorTile.prototype.disposeInternal = function disposeInternal () {
    this.features_ = null;
    this.replayGroups_ = {};
    this.state = TileState/* default */.A.ABORT;
    this.changed();
    Tile.prototype.disposeInternal.call(this);
  };

  /**
   * Gets the extent of the vector tile.
   * @return {import("./extent.js").Extent} The extent.
   * @api
   */
  VectorTile.prototype.getExtent = function getExtent () {
    return this.extent_ || DEFAULT_EXTENT;
  };

  /**
   * Get the feature format assigned for reading this tile's features.
   * @return {import("./format/Feature.js").default} Feature format.
   * @api
   */
  VectorTile.prototype.getFormat = function getFormat () {
    return this.format_;
  };

  /**
   * Get the features for this tile. Geometries will be in the projection returned
   * by {@link module:ol/VectorTile~VectorTile#getProjection}.
   * @return {Array<import("./Feature.js").FeatureLike>} Features.
   * @api
   */
  VectorTile.prototype.getFeatures = function getFeatures () {
    return this.features_;
  };

  /**
   * @inheritDoc
   */
  VectorTile.prototype.getKey = function getKey () {
    return this.url_;
  };

  /**
   * Get the feature projection of features returned by
   * {@link module:ol/VectorTile~VectorTile#getFeatures}.
   * @return {import("./proj/Projection.js").default} Feature projection.
   * @api
   */
  VectorTile.prototype.getProjection = function getProjection () {
    return this.projection_;
  };

  /**
   * @param {import("./layer/Layer.js").default} layer Layer.
   * @param {string} key Key.
   * @return {import("./render/ReplayGroup.js").default} Replay group.
   */
  VectorTile.prototype.getReplayGroup = function getReplayGroup (layer, key) {
    return this.replayGroups_[(0,util/* getUid */.v6)(layer) + ',' + key];
  };

  /**
   * @inheritDoc
   */
  VectorTile.prototype.load = function load () {
    if (this.state == TileState/* default */.A.IDLE) {
      this.setState(TileState/* default */.A.LOADING);
      this.tileLoadFunction_(this, this.url_);
      this.loader_(null, NaN, null);
    }
  };

  /**
   * Handler for successful tile load.
   * @param {Array<import("./Feature.js").default>} features The loaded features.
   * @param {import("./proj/Projection.js").default} dataProjection Data projection.
   * @param {import("./extent.js").Extent} extent Extent.
   */
  VectorTile.prototype.onLoad = function onLoad (features, dataProjection, extent) {
    this.setProjection(dataProjection);
    this.setFeatures(features);
    this.setExtent(extent);
  };

  /**
   * Handler for tile load errors.
   */
  VectorTile.prototype.onError = function onError () {
    this.setState(TileState/* default */.A.ERROR);
  };

  /**
   * Function for use in an {@link module:ol/source/VectorTile~VectorTile}'s
   * `tileLoadFunction`. Sets the extent of the vector tile. This is only required
   * for tiles in projections with `tile-pixels` as units. The extent should be
   * set to `[0, 0, tilePixelSize, tilePixelSize]`, where `tilePixelSize` is
   * calculated by multiplying the tile size with the tile pixel ratio. For
   * sources using {@link module:ol/format/MVT~MVT} as feature format, the
   * {@link module:ol/format/MVT~MVT#getLastExtent} method will return the correct
   * extent. The default is `[0, 0, 4096, 4096]`.
   * @param {import("./extent.js").Extent} extent The extent.
   * @api
   */
  VectorTile.prototype.setExtent = function setExtent (extent) {
    this.extent_ = extent;
  };

  /**
   * Function for use in an {@link module:ol/source/VectorTile~VectorTile}'s `tileLoadFunction`.
   * Sets the features for the tile.
   * @param {Array<import("./Feature.js").default>} features Features.
   * @api
   */
  VectorTile.prototype.setFeatures = function setFeatures (features) {
    this.features_ = features;
    this.setState(TileState/* default */.A.LOADED);
  };

  /**
   * Function for use in an {@link module:ol/source/VectorTile~VectorTile}'s `tileLoadFunction`.
   * Sets the projection of the features that were added with
   * {@link module:ol/VectorTile~VectorTile#setFeatures}.
   * @param {import("./proj/Projection.js").default} projection Feature projection.
   * @api
   */
  VectorTile.prototype.setProjection = function setProjection (projection) {
    this.projection_ = projection;
  };

  /**
   * @param {import("./layer/Layer.js").default} layer Layer.
   * @param {string} key Key.
   * @param {import("./render/ReplayGroup.js").default} replayGroup Replay group.
   */
  VectorTile.prototype.setReplayGroup = function setReplayGroup (layer, key, replayGroup) {
    this.replayGroups_[(0,util/* getUid */.v6)(layer) + ',' + key] = replayGroup;
  };

  /**
   * Set the feature loader for reading this tile's features.
   * @param {import("./featureloader.js").FeatureLoader} loader Feature loader.
   * @api
   */
  VectorTile.prototype.setLoader = function setLoader (loader) {
    this.loader_ = loader;
  };

  return VectorTile;
}(ol_Tile/* default */.A));

/* harmony default export */ var ol_VectorTile = (VectorTile_VectorTile);

//# sourceMappingURL=VectorTile.js.map
// EXTERNAL MODULE: ./node_modules/ol/source/UrlTile.js + 2 modules
var UrlTile = __webpack_require__(77027);
// EXTERNAL MODULE: ./node_modules/ol/tilegrid.js + 1 modules
var tilegrid = __webpack_require__(73400);
;// ./node_modules/ol/source/VectorTile.js
/**
 * @module ol/source/VectorTile
 */









/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=128] Cache size.
 * @property {import("../extent.js").Extent} [extent]
 * @property {import("../format/Feature.js").default} [format] Feature format for tiles. Used and required by the default.
 * @property {boolean} [overlaps=true] This source may have overlapping geometries. Setting this
 * to `false` (e.g. for sources with polygons that represent administrative
 * boundaries or TopoJSON sources) allows the renderer to optimise fill and
 * stroke operations.
 * @property {import("../proj.js").ProjectionLike} projection Projection.
 * @property {import("./State.js").default} [state] Source state.
 * @property {typeof import("../VectorTile.js").default} [tileClass] Class used to instantiate image tiles.
 * Default is {@link module:ol/VectorTile}.
 * @property {number} [maxZoom=22] Optional max zoom level.
 * @property {number} [minZoom] Optional min zoom level.
 * @property {number|import("../size.js").Size} [tileSize=512] Optional tile size.
 * @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid.
 * @property {import("../Tile.js").LoadFunction} [tileLoadFunction]
 * Optional function to load a tile given a URL. Could look like this:
 * ```js
 * function(tile, url) {
 *   tile.setLoader(function() {
 *     var data = // ... fetch data
 *     var format = tile.getFormat();
 *     tile.setProjection(format.readProjection(data));
 *     tile.setFeatures(format.readFeatures(data, {
 *       // featureProjection is not required for ol/format/MVT
 *       featureProjection: map.getView().getProjection()
 *     }));
 *     // the line below is only required for ol/format/MVT
 *     tile.setExtent(format.getLastExtent());
 *   }
 * });
 * ```
 * @property {import("../Tile.js").UrlFunction} [tileUrlFunction] Optional function to get tile URL given a tile coordinate and the projection.
 * @property {string} [url] URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
 * A `{?-?}` template pattern, for example `subdomain{a-f}.domain.com`, may be
 * used instead of defining each one separately in the `urls` option.
 * @property {number} [transition] A duration for tile opacity
 * transitions in milliseconds. A duration of 0 disables the opacity transition.
 * @property {Array<string>} [urls] An array of URL templates.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * When set to `false`, only one world
 * will be rendered. When set to `true`, tiles will be wrapped horizontally to
 * render multiple worlds.
 */


/**
 * @classdesc
 * Class for layer sources providing vector data divided into a tile grid, to be
 * used with {@link module:ol/layer/VectorTile~VectorTile}. Although this source receives tiles
 * with vector features from the server, it is not meant for feature editing.
 * Features are optimized for rendering, their geometries are clipped at or near
 * tile boundaries and simplified for a view resolution. See
 * {@link module:ol/source/Vector} for vector sources that are suitable for feature
 * editing.
 *
 * @fires import("./Tile.js").TileSourceEvent
 * @api
 */
var source_VectorTile_VectorTile = /*@__PURE__*/(function (UrlTile) {
  function VectorTile(options) {
    var projection = options.projection || 'EPSG:3857';

    var extent = options.extent || (0,tilegrid/* extentFromProjection */.kZ)(projection);

    var tileGrid = options.tileGrid || (0,tilegrid/* createXYZ */.EN)({
      extent: extent,
      maxZoom: options.maxZoom || 22,
      minZoom: options.minZoom,
      tileSize: options.tileSize || 512
    });

    UrlTile.call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize !== undefined ? options.cacheSize : 128,
      opaque: false,
      projection: projection,
      state: options.state,
      tileGrid: tileGrid,
      tileLoadFunction: options.tileLoadFunction ? options.tileLoadFunction : defaultLoadFunction,
      tileUrlFunction: options.tileUrlFunction,
      url: options.url,
      urls: options.urls,
      wrapX: options.wrapX === undefined ? true : options.wrapX,
      transition: options.transition
    });

    /**
     * @private
     * @type {import("../format/Feature.js").default}
     */
    this.format_ = options.format ? options.format : null;

    /**
       * @private
       * @type {Object<string, Tile>}
       */
    this.sourceTiles_ = {};

    /**
     * @private
     * @type {boolean}
     */
    this.overlaps_ = options.overlaps == undefined ? true : options.overlaps;

    /**
     * @protected
     * @type {typeof import("../VectorTile.js").default}
     */
    this.tileClass = options.tileClass ? options.tileClass : ol_VectorTile;

    /**
     * @private
     * @type {Object<string, import("../tilegrid/TileGrid.js").default>}
     */
    this.tileGrids_ = {};

  }

  if ( UrlTile ) VectorTile.__proto__ = UrlTile;
  VectorTile.prototype = Object.create( UrlTile && UrlTile.prototype );
  VectorTile.prototype.constructor = VectorTile;

  /**
   * @return {boolean} The source can have overlapping geometries.
   */
  VectorTile.prototype.getOverlaps = function getOverlaps () {
    return this.overlaps_;
  };

  /**
   * clear {@link module:ol/TileCache~TileCache} and delete all source tiles
   * @api
   */
  VectorTile.prototype.clear = function clear () {
    this.tileCache.clear();
    this.sourceTiles_ = {};
  };

  /**
   * @inheritDoc
   */
  VectorTile.prototype.getTile = function getTile (z, x, y, pixelRatio, projection) {
    var tileCoordKey = (0,tilecoord/* getKeyZXY */.dp)(z, x, y);
    if (this.tileCache.containsKey(tileCoordKey)) {
      return (
        /** @type {!import("../Tile.js").default} */ (this.tileCache.get(tileCoordKey))
      );
    } else {
      var tileCoord = [z, x, y];
      var urlTileCoord = this.getTileCoordForTileUrlFunction(
        tileCoord, projection);
      var tile = new ol_VectorImageTile(
        tileCoord,
        urlTileCoord !== null ? TileState/* default */.A.IDLE : TileState/* default */.A.EMPTY,
        this.getRevision(),
        this.format_, this.tileLoadFunction, urlTileCoord, this.tileUrlFunction,
        this.tileGrid, this.getTileGridForProjection(projection),
        this.sourceTiles_, pixelRatio, projection, this.tileClass,
        this.handleTileChange.bind(this), tileCoord[0]);

      this.tileCache.set(tileCoordKey, tile);
      return tile;
    }
  };


  /**
   * @inheritDoc
   */
  VectorTile.prototype.getTileGridForProjection = function getTileGridForProjection (projection) {
    var code = projection.getCode();
    var tileGrid = this.tileGrids_[code];
    if (!tileGrid) {
      // A tile grid that matches the tile size of the source tile grid is more
      // likely to have 1:1 relationships between source tiles and rendered tiles.
      var sourceTileGrid = this.tileGrid;
      tileGrid = this.tileGrids_[code] = (0,tilegrid/* createForProjection */.JI)(projection, undefined,
        sourceTileGrid ? sourceTileGrid.getTileSize(sourceTileGrid.getMinZoom()) : undefined);
    }
    return tileGrid;
  };


  /**
   * @inheritDoc
   */
  VectorTile.prototype.getTilePixelRatio = function getTilePixelRatio (pixelRatio) {
    return pixelRatio;
  };


  /**
   * @inheritDoc
   */
  VectorTile.prototype.getTilePixelSize = function getTilePixelSize (z, pixelRatio, projection) {
    var tileGrid = this.getTileGridForProjection(projection);
    var tileSize = (0,size/* toSize */.xq)(tileGrid.getTileSize(z), this.tmpSize);
    return [Math.round(tileSize[0] * pixelRatio), Math.round(tileSize[1] * pixelRatio)];
  };

  return VectorTile;
}(UrlTile/* default */.A));


/* harmony default export */ var source_VectorTile = (source_VectorTile_VectorTile);

//# sourceMappingURL=VectorTile.js.map
;// ./node_modules/olcs/lib/olcs/util.js
let _imageRenderingPixelatedSupported = undefined;
let _imageRenderingValue = undefined;
/**
 * https://caniuse.com/mdn-css_properties_image-rendering_pixelated
 * @return whether the browser supports
 */
function supportsImageRenderingPixelated() {
    if (_imageRenderingPixelatedSupported === undefined) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('style', 'image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; image-rendering: pixelated;');
        // canvas.style.imageRendering will be undefined, null or an
        // empty string on unsupported browsers.
        const imageRenderingValue = canvas.style.imageRendering;
        _imageRenderingPixelatedSupported = !!imageRenderingValue;
        if (_imageRenderingPixelatedSupported) {
            _imageRenderingValue = imageRenderingValue;
        }
    }
    return _imageRenderingPixelatedSupported;
}
/**
 * The value supported by thie browser for the CSS property "image-rendering"
 * @return {string}
 */
function imageRenderingValue() {
    supportsImageRenderingPixelated();
    return _imageRenderingValue || '';
}
/**
 * Return the projection of the source that Cesium should use.
 *
 * @param source Source.
 * @return The projection of the source.
 */
function getSourceProjection(source) {
    return (source.get('olcs_projection') || source.getProjection());
}
/**
 * Counter for getUid.
 * @type {number}
 */
let uidCounter_ = 0;
/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. Unique IDs are generated
 * as a strictly increasing sequence. Adapted from goog.getUid. Similar to OL getUid.
 *
 * @param obj The object to get the unique ID for.
 * @return The unique ID for the object.
 */
function getUid(obj) {
    return obj.olcs_uid || (obj.olcs_uid = ++uidCounter_);
}
function waitReady(object) {
    const o = object;
    const p = o.readyPromise;
    if (p) {
        return p;
    }
    if (o.ready !== undefined) {
        if (o.ready) {
            return Promise.resolve(object);
        }
        return new Promise((resolve, _) => {
            // FIXME: this is crazy
            // alternative: intercept _ready = true
            // altnerative: pass a timeout
            const stopper = setInterval(() => {
                if (o.ready) {
                    clearInterval(stopper);
                    resolve(object);
                }
            }, 20);
        });
    }
    return Promise.reject('Not a readyable object');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGNzL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsSUFBSSxpQ0FBaUMsR0FBWSxTQUFTLENBQUM7QUFDM0QsSUFBSSxvQkFBb0IsR0FBVyxTQUFTLENBQUM7QUFFN0M7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLCtCQUErQjtJQUM3QyxJQUFJLGlDQUFpQyxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3BELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLFlBQVksQ0FDakIsT0FBTyxFQUNQLDhGQUE4RixDQUMvRixDQUFDO1FBQ0YsNERBQTREO1FBQzVELHdDQUF3QztRQUN4QyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQ3hELGlDQUFpQyxHQUFHLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztRQUMxRCxJQUFJLGlDQUFpQyxFQUFFLENBQUM7WUFDdEMsb0JBQW9CLEdBQUcsbUJBQW1CLENBQUM7UUFDN0MsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLGlDQUFpQyxDQUFDO0FBQzNDLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsbUJBQW1CO0lBQ2pDLCtCQUErQixFQUFFLENBQUM7SUFDbEMsT0FBTyxvQkFBb0IsSUFBSSxFQUFFLENBQUM7QUFDcEMsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE1BQWM7SUFDaEQsT0FBTyxDQUNKLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQWdCLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUN4RSxDQUFDO0FBQ0osQ0FBQztBQUVEOzs7R0FHRztBQUNILElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztBQUVwQjs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FBQyxHQUFRO0lBQzdCLE9BQU8sR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FBTyxNQUFZO0lBQzFDLE1BQU0sQ0FBQyxHQUFHLE1BQWEsQ0FBQztJQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDO0lBQ3pCLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDTixPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDWixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUNELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEMsdUJBQXVCO1lBQ3ZCLHVDQUF1QztZQUN2Qyw4QkFBOEI7WUFDOUIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ1osYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2xCLENBQUM7WUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNsRCxDQUFDIn0=
;// ./node_modules/olcs/lib/olcs/core/OLImageryProvider.js



function createEmptyCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas;
}
class OLImageryProvider {
    source_;
    projection_;
    fallbackProj_;
    map_;
    shouldRequestNextLevel;
    emptyCanvas_ = createEmptyCanvas();
    emptyCanvasPromise_ = Promise.resolve(this.emptyCanvas_);
    tilingScheme_;
    ready_;
    rectangle_;
    /**
     * When <code>true</code>, this model is ready to render, i.e., the external binary, image,
     * and shader files were downloaded and the WebGL resources were created.
     */
    get ready() {
        return this.ready_;
    }
    /**
     * Gets the rectangle, in radians, of the imagery provided by the instance.
     */
    get rectangle() {
        return this.rectangle_;
    }
    /**
     * Gets the tiling scheme used by the provider.
     */
    get tilingScheme() {
        return this.tilingScheme_;
    }
    /**
     * Gets an event that is raised when the imagery provider encounters an asynchronous error.  By subscribing
     * to the event, you will be notified of the error and can potentially recover from it.  Event listeners
     * are passed an instance of {@link Cesium.TileProviderError}.
     */
    errorEvent = new Cesium.Event();
    /**
     * Gets the credit to display when this imagery provider is active.  Typically this is used to credit
     * the source of the imagery.
     */
    credit;
    /**
     * Gets the proxy used by this provider.
     */
    proxy;
    get _ready() {
        return this.ready_;
    }
    /**
     * Gets the width of each tile, in pixels.
     */
    get tileWidth() {
        const tileGrid = this.source_.getTileGrid();
        if (tileGrid) {
            const tileSizeAtZoom0 = tileGrid.getTileSize(0);
            if (Array.isArray(tileSizeAtZoom0)) {
                return tileSizeAtZoom0[0];
            }
            return tileSizeAtZoom0; // same width and height
        }
        return 256;
    }
    /**
     * Gets the height of each tile, in pixels.
     */
    get tileHeight() {
        const tileGrid = this.source_.getTileGrid();
        if (tileGrid) {
            const tileSizeAtZoom0 = tileGrid.getTileSize(0);
            if (Array.isArray(tileSizeAtZoom0)) {
                return tileSizeAtZoom0[1];
            }
            return tileSizeAtZoom0; // same width and height
        }
        return 256;
    }
    /**
     * Gets the maximum level-of-detail that can be requested.
     */
    get maximumLevel() {
        const tileGrid = this.source_.getTileGrid();
        if (tileGrid) {
            return tileGrid.getMaxZoom();
        }
        return 18; // some arbitrary value
    }
    // FIXME: to implement, we could check the number of tiles at minzoom (for this rectangle) and return 0 if too big
    /**
     * Gets the minimum level-of-detail that can be requested.  Generally,
     * a minimum level should only be used when the rectangle of the imagery is small
     * enough that the number of tiles at the minimum level is small.  An imagery
     * provider with more than a few tiles at the minimum level will lead to
     * rendering problems.
     */
    get minimumLevel() {
        // WARNING: Do not use the minimum level (at least until the extent is
        // properly set). Cesium assumes the minimumLevel to contain only
        // a few tiles and tries to load them all at once -- this can
        // freeze and/or crash the browser !
        return 0;
        //var tg = this.source_.getTileGrid();
        //return tg ? tg.getMinZoom() : 0;
    }
    /**
     * Gets the tile discard policy.  If not undefined, the discard policy is responsible
     * for filtering out "missing" tiles via its shouldDiscardImage function.  If this function
     * returns undefined, no tiles are filtered.
     */
    get tileDiscardPolicy() {
        return undefined;
    }
    // FIXME: this might be exposed
    /**
     * Gets a value indicating whether or not the images provided by this imagery provider
     * include an alpha channel.  If this property is false, an alpha channel, if present, will
     * be ignored.  If this property is true, any images without an alpha channel will be treated
     * as if their alpha is 1.0 everywhere.  When this property is false, memory usage
     * and texture upload time are reduced.
     */
    get hasAlphaChannel() {
        return true;
    }
    // FIXME: this could be implemented by proxying to OL
    /**
     * Asynchronously determines what features, if any, are located at a given longitude and latitude within
     * a tile.
     * This function is optional, so it may not exist on all ImageryProviders.
     * @param x The tile X coordinate.
     * @param y The tile Y coordinate.
     * @param level The tile level.
     * @param longitude The longitude at which to pick features.
     * @param latitude The latitude at which to pick features.
     * @return A promise for the picked features that will resolve when the asynchronous
     *                   picking completes.  The resolved value is an array of {@link ImageryLayerFeatureInfo}
     *                   instances.  The array may be empty if no features are found at the given location.
     *                   It may also be undefined if picking is not supported.
     */
    pickFeatures(x, y, level, longitude, latitude) {
        return undefined;
    }
    /**
     * Special class derived from Cesium.ImageryProvider
     * that is connected to the given ol.source.TileImage.
     * @param olMap OL map
     * @param source Tile image source
     * @param [opt_fallbackProj] Projection to assume if source has no projection
     */
    constructor(olMap, source, opt_fallbackProj) {
        this.source_ = source;
        this.projection_ = null;
        this.ready_ = false;
        this.fallbackProj_ = opt_fallbackProj || null;
        // cesium v107+ don't wait for ready anymore so we put somehing here while it loads
        this.tilingScheme_ = new Cesium.WebMercatorTilingScheme();
        this.rectangle_ = null;
        this.map_ = olMap;
        this.shouldRequestNextLevel = false;
        const proxy = this.source_.get('olcs_proxy');
        if (proxy) {
            if (typeof proxy === 'function') {
                // Duck typing a proxy
                this.proxy = {
                    'getURL': proxy,
                };
            }
            else if (typeof proxy === 'string') {
                this.proxy = new Cesium.DefaultProxy(proxy);
            }
        }
        this.source_.on('change', (e) => {
            this.handleSourceChanged_();
        });
        this.handleSourceChanged_();
    }
    /**
     * Checks if the underlying source is ready and cached required data.
     */
    handleSourceChanged_() {
        if (!this.ready_ && this.source_.getState() == 'ready') {
            this.projection_ =
                getSourceProjection(this.source_) || this.fallbackProj_;
            const options = { numberOfLevelZeroTilesX: 1, numberOfLevelZeroTilesY: 1 };
            if (this.source_.getTileGrid() !== null) {
                // Get the number of tiles at level 0 if it is defined
                this.source_
                    .getTileGrid()
                    .forEachTileCoord(this.projection_.getExtent(), 0, ([zoom, xIndex, yIndex]) => {
                    options.numberOfLevelZeroTilesX = xIndex + 1;
                    options.numberOfLevelZeroTilesY = yIndex + 1;
                });
            }
            if (this.projection_.getCode() === 'EPSG:4326') {
                // Cesium zoom level 0 is OpenLayers zoom level 1 for layer in EPSG:4326 with a single tile on level 0
                this.shouldRequestNextLevel =
                    options.numberOfLevelZeroTilesX === 1 &&
                        options.numberOfLevelZeroTilesY === 1;
                this.tilingScheme_ = new Cesium.GeographicTilingScheme(options);
            }
            else if (this.projection_.getCode() === 'EPSG:3857') {
                this.shouldRequestNextLevel = false;
                this.tilingScheme_ = new Cesium.WebMercatorTilingScheme(options);
            }
            else {
                return;
            }
            this.rectangle_ = this.tilingScheme_.rectangle;
            this.ready_ = true;
        }
    }
    /**
     * Generates the proper attributions for a given position and zoom
     * level.
     * @param x
     * @param y
     * @param level
     */
    getTileCredits(x, y, level) {
        const attributionsFunction = this.source_.getAttributions();
        if (!attributionsFunction) {
            return [];
        }
        const extent = this.map_.getView().calculateExtent(this.map_.getSize());
        const center = this.map_.getView().getCenter();
        const zoom = this.shouldRequestNextLevel ? level + 1 : level;
        return attributionsFunctionToCredits(attributionsFunction, zoom, center, extent);
    }
    requestImage(x, y, level, request) {
        const tileUrlFunction = this.source_.getTileUrlFunction();
        if (tileUrlFunction && this.projection_) {
            const z_ = this.shouldRequestNextLevel ? level + 1 : level;
            let url = tileUrlFunction.call(this.source_, [z_, x, y], 1, this.projection_);
            if (this.proxy) {
                url = this.proxy.getURL(url);
            }
            if (url) {
                // It is probably safe to cast here
                return Cesium.ImageryProvider.loadImage(this, url);
            }
            return this.emptyCanvasPromise_;
        }
        // return empty canvas to stop Cesium from retrying later
        return this.emptyCanvasPromise_;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT0xJbWFnZXJ5UHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvb2xjcy9jb3JlL09MSW1hZ2VyeVByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWNBLE9BQU8sRUFBZ0IsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUFDLDZCQUE2QixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3pELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUUvQyxNQUFNLFVBQVUsaUJBQWlCO0lBQy9CLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDakIsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDbEIsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sQ0FBQyxPQUFPLE9BQU8saUJBQWlCO0lBQzVCLE9BQU8sQ0FBWTtJQUNuQixXQUFXLENBQXlCO0lBQ3BDLGFBQWEsQ0FBeUI7SUFDdEMsSUFBSSxDQUFNO0lBQ1Ysc0JBQXNCLENBQVU7SUFDaEMsWUFBWSxHQUFzQixpQkFBaUIsRUFBRSxDQUFDO0lBQ3RELG1CQUFtQixHQUErQixPQUFPLENBQUMsT0FBTyxDQUN2RSxJQUFJLENBQUMsWUFBWSxDQUNsQixDQUFDO0lBQ00sYUFBYSxDQUFlO0lBQzVCLE1BQU0sQ0FBVTtJQUNoQixVQUFVLENBQVk7SUFFOUI7OztPQUdHO0lBQ0gsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDNUIs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
// EXTERNAL MODULE: ./node_modules/pbf/index.js
var node_modules_pbf = __webpack_require__(15335);
var pbf_default = /*#__PURE__*/__webpack_require__.n(node_modules_pbf);
// EXTERNAL MODULE: ./node_modules/ol/format/Feature.js
var Feature = __webpack_require__(54970);
// EXTERNAL MODULE: ./node_modules/ol/format/FormatType.js
var FormatType = __webpack_require__(88161);
// EXTERNAL MODULE: ./node_modules/ol/geom/GeometryLayout.js
var GeometryLayout = __webpack_require__(96269);
// EXTERNAL MODULE: ./node_modules/ol/geom/GeometryType.js
var GeometryType = __webpack_require__(11635);
// EXTERNAL MODULE: ./node_modules/ol/geom/LineString.js
var LineString = __webpack_require__(52820);
// EXTERNAL MODULE: ./node_modules/ol/geom/MultiLineString.js
var MultiLineString = __webpack_require__(32817);
// EXTERNAL MODULE: ./node_modules/ol/geom/MultiPoint.js
var MultiPoint = __webpack_require__(29094);
// EXTERNAL MODULE: ./node_modules/ol/geom/MultiPolygon.js
var MultiPolygon = __webpack_require__(70910);
// EXTERNAL MODULE: ./node_modules/ol/geom/Polygon.js + 1 modules
var Polygon = __webpack_require__(11035);
// EXTERNAL MODULE: ./node_modules/ol/geom/flat/orient.js + 1 modules
var orient = __webpack_require__(64535);
// EXTERNAL MODULE: ./node_modules/ol/proj/Projection.js
var Projection = __webpack_require__(97191);
// EXTERNAL MODULE: ./node_modules/ol/proj/Units.js
var Units = __webpack_require__(38531);
// EXTERNAL MODULE: ./node_modules/ol/geom/flat/center.js
var center = __webpack_require__(77534);
// EXTERNAL MODULE: ./node_modules/ol/geom/flat/interiorpoint.js
var interiorpoint = __webpack_require__(79165);
// EXTERNAL MODULE: ./node_modules/ol/geom/flat/interpolate.js
var interpolate = __webpack_require__(39608);
// EXTERNAL MODULE: ./node_modules/ol/geom/flat/transform.js
var flat_transform = __webpack_require__(31103);
// EXTERNAL MODULE: ./node_modules/ol/transform.js
var ol_transform = __webpack_require__(21878);
;// ./node_modules/ol/render/Feature.js
/**
 * @module ol/render/Feature
 */











/**
 * @type {import("../transform.js").Transform}
 */
var tmpTransform = (0,ol_transform/* create */.vt)();


/**
 * Lightweight, read-only, {@link module:ol/Feature~Feature} and {@link module:ol/geom/Geometry~Geometry} like
 * structure, optimized for vector tile rendering and styling. Geometry access
 * through the API is limited to getting the type and extent of the geometry.
 *
 * @param {GeometryType} type Geometry type.
 * @param {Array<number>} flatCoordinates Flat coordinates. These always need
 *     to be right-handed for polygons.
 * @param {Array<number>|Array<Array<number>>} ends Ends or Endss.
 * @param {Object<string, *>} properties Properties.
 * @param {number|string|undefined} id Feature id.
 */
var RenderFeature = function RenderFeature(type, flatCoordinates, ends, properties, id) {
  /**
  * @private
  * @type {import("../extent.js").Extent|undefined}
  */
  this.extent_;

  /**
  * @private
  * @type {number|string|undefined}
  */
  this.id_ = id;

  /**
  * @private
  * @type {GeometryType}
  */
  this.type_ = type;

  /**
  * @private
  * @type {Array<number>}
  */
  this.flatCoordinates_ = flatCoordinates;

  /**
  * @private
  * @type {Array<number>}
  */
  this.flatInteriorPoints_ = null;

  /**
  * @private
  * @type {Array<number>}
  */
  this.flatMidpoints_ = null;

  /**
  * @private
  * @type {Array<number>|Array<Array<number>>}
  */
  this.ends_ = ends;

  /**
  * @private
  * @type {Object<string, *>}
  */
  this.properties_ = properties;

};

/**
* Get a feature property by its key.
* @param {string} key Key
* @return {*} Value for the requested key.
* @api
*/
RenderFeature.prototype.get = function get (key) {
  return this.properties_[key];
};

/**
* Get the extent of this feature's geometry.
* @return {import("../extent.js").Extent} Extent.
* @api
*/
RenderFeature.prototype.getExtent = function getExtent () {
  if (!this.extent_) {
    this.extent_ = this.type_ === GeometryType/* default */.A.POINT ?
      (0,ol_extent/* createOrUpdateFromCoordinate */.dP)(this.flatCoordinates_) :
      (0,ol_extent/* createOrUpdateFromFlatCoordinates */.Vy)(
        this.flatCoordinates_, 0, this.flatCoordinates_.length, 2);

  }
  return this.extent_;
};

/**
* @return {Array<number>} Flat interior points.
*/
RenderFeature.prototype.getFlatInteriorPoint = function getFlatInteriorPoint () {
  if (!this.flatInteriorPoints_) {
    var flatCenter = (0,ol_extent/* getCenter */.q1)(this.getExtent());
    this.flatInteriorPoints_ = (0,interiorpoint/* getInteriorPointOfArray */.J)(
      this.flatCoordinates_, 0, /** @type {Array<number>} */ (this.ends_), 2, flatCenter, 0);
  }
  return this.flatInteriorPoints_;
};

/**
* @return {Array<number>} Flat interior points.
*/
RenderFeature.prototype.getFlatInteriorPoints = function getFlatInteriorPoints () {
  if (!this.flatInteriorPoints_) {
    var flatCenters = (0,center/* linearRingss */.C)(
      this.flatCoordinates_, 0, /** @type {Array<Array<number>>} */ (this.ends_), 2);
    this.flatInteriorPoints_ = (0,interiorpoint/* getInteriorPointsOfMultiArray */.p)(
      this.flatCoordinates_, 0, /** @type {Array<Array<number>>} */ (this.ends_), 2, flatCenters);
  }
  return this.flatInteriorPoints_;
};

/**
* @return {Array<number>} Flat midpoint.
*/
RenderFeature.prototype.getFlatMidpoint = function getFlatMidpoint () {
  if (!this.flatMidpoints_) {
    this.flatMidpoints_ = (0,interpolate/* interpolatePoint */.SH)(
      this.flatCoordinates_, 0, this.flatCoordinates_.length, 2, 0.5);
  }
  return this.flatMidpoints_;
};

/**
* @return {Array<number>} Flat midpoints.
*/
RenderFeature.prototype.getFlatMidpoints = function getFlatMidpoints () {
  if (!this.flatMidpoints_) {
    this.flatMidpoints_ = [];
    var flatCoordinates = this.flatCoordinates_;
    var offset = 0;
    var ends = /** @type {Array<number>} */ (this.ends_);
    for (var i = 0, ii = ends.length; i < ii; ++i) {
      var end = ends[i];
      var midpoint = (0,interpolate/* interpolatePoint */.SH)(
        flatCoordinates, offset, end, 2, 0.5);
      (0,array/* extend */.X$)(this.flatMidpoints_, midpoint);
      offset = end;
    }
  }
  return this.flatMidpoints_;
};

/**
* Get the feature identifier.This is a stable identifier for the feature and
* is set when reading data from a remote source.
* @return {number|string|undefined} Id.
* @api
*/
RenderFeature.prototype.getId = function getId () {
  return this.id_;
};

/**
* @return {Array<number>} Flat coordinates.
*/
RenderFeature.prototype.getOrientedFlatCoordinates = function getOrientedFlatCoordinates () {
  return this.flatCoordinates_;
};

/**
* For API compatibility with {@link module:ol/Feature~Feature}, this method is useful when
* determining the geometry type in style function (see {@link #getType}).
* @return {RenderFeature} Feature.
* @api
*/
RenderFeature.prototype.getGeometry = function getGeometry () {
  return this;
};

/**
 * @param {number} squaredTolerance Squared tolerance.
 * @return {RenderFeature} Simplified geometry.
 */
RenderFeature.prototype.getSimplifiedGeometry = function getSimplifiedGeometry (squaredTolerance) {
  return this;
};

/**
* Get the feature properties.
* @return {Object<string, *>} Feature properties.
* @api
*/
RenderFeature.prototype.getProperties = function getProperties () {
  return this.properties_;
};

/**
* @return {number} Stride.
*/
RenderFeature.prototype.getStride = function getStride () {
  return 2;
};

/**
 * @return {undefined}
 */
RenderFeature.prototype.getStyleFunction = function getStyleFunction () {
  return undefined;
};

/**
* Get the type of this feature's geometry.
* @return {GeometryType} Geometry type.
* @api
*/
RenderFeature.prototype.getType = function getType () {
  return this.type_;
};

/**
* Transform geometry coordinates from tile pixel space to projected.
* The SRS of the source and destination are expected to be the same.
*
* @param {import("../proj.js").ProjectionLike} source The current projection
* @param {import("../proj.js").ProjectionLike} destination The desired projection.
*/
RenderFeature.prototype.transform = function transform (source, destination) {
  source = (0,ol_proj/* get */.Jt)(source);
  var pixelExtent = source.getExtent();
  var projectedExtent = source.getWorldExtent();
  var scale = (0,ol_extent/* getHeight */.Oq)(projectedExtent) / (0,ol_extent/* getHeight */.Oq)(pixelExtent);
  (0,ol_transform/* compose */.Zz)(tmpTransform,
    projectedExtent[0], projectedExtent[3],
    scale, -scale, 0,
    0, 0);
  (0,flat_transform/* transform2D */.Rc)(this.flatCoordinates_, 0, this.flatCoordinates_.length, 2,
    tmpTransform, this.flatCoordinates_);
};


/**
 * @return {Array<number>|Array<Array<number>>} Ends or endss.
 */
RenderFeature.prototype.getEnds =
RenderFeature.prototype.getEndss = function() {
  return this.ends_;
};


/**
 * @return {Array<number>} Flat coordinates.
 */
RenderFeature.prototype.getFlatCoordinates =
    RenderFeature.prototype.getOrientedFlatCoordinates;


/* harmony default export */ var render_Feature = (RenderFeature);

//# sourceMappingURL=Feature.js.map
;// ./node_modules/ol/format/MVT.js
/**
 * @module ol/format/MVT
 */
//FIXME Implement projection handling



















/**
 * @typedef {Object} Options
 * @property {import("../Feature.js").FeatureClass} [featureClass] Class for features returned by
 * {@link module:ol/format/MVT#readFeatures}. Set to {@link module:ol/Feature~Feature} to get full editing and geometry
 * support at the cost of decreased rendering performance. The default is
 * {@link module:ol/render/Feature~RenderFeature}, which is optimized for rendering and hit detection.
 * @property {string} [geometryName='geometry'] Geometry name to use when creating features.
 * @property {string} [layerName='layer'] Name of the feature attribute that holds the layer name.
 * @property {Array<string>} [layers] Layers to read features from. If not provided, features will be read from all
 * layers.
 */


/**
 * @classdesc
 * Feature format for reading data in the Mapbox MVT format.
 *
 * @param {Options=} opt_options Options.
 * @api
 */
var MVT = /*@__PURE__*/(function (FeatureFormat) {
  function MVT(opt_options) {
    FeatureFormat.call(this);

    var options = opt_options ? opt_options : {};

    /**
     * @type {Projection}
     */
    this.dataProjection = new Projection/* default */.A({
      code: '',
      units: Units/* default */.A.TILE_PIXELS
    });

    /**
     * @private
     * @type {import("../Feature.js").FeatureClass}
     */
    this.featureClass_ = options.featureClass ? options.featureClass : render_Feature;

    /**
     * @private
     * @type {string|undefined}
     */
    this.geometryName_ = options.geometryName;

    /**
     * @private
     * @type {string}
     */
    this.layerName_ = options.layerName ? options.layerName : 'layer';

    /**
     * @private
     * @type {Array<string>}
     */
    this.layers_ = options.layers ? options.layers : null;

    /**
     * @private
     * @type {import("../extent.js").Extent}
     */
    this.extent_ = null;

  }

  if ( FeatureFormat ) MVT.__proto__ = FeatureFormat;
  MVT.prototype = Object.create( FeatureFormat && FeatureFormat.prototype );
  MVT.prototype.constructor = MVT;

  /**
   * Read the raw geometry from the pbf offset stored in a raw feature's geometry
   * property.
   * @suppress {missingProperties}
   * @param {Object} pbf PBF.
   * @param {Object} feature Raw feature.
   * @param {Array<number>} flatCoordinates Array to store flat coordinates in.
   * @param {Array<number>} ends Array to store ends in.
   * @private
   */
  MVT.prototype.readRawGeometry_ = function readRawGeometry_ (pbf, feature, flatCoordinates, ends) {
    pbf.pos = feature.geometry;

    var end = pbf.readVarint() + pbf.pos;
    var cmd = 1;
    var length = 0;
    var x = 0;
    var y = 0;
    var coordsLen = 0;
    var currentEnd = 0;

    while (pbf.pos < end) {
      if (!length) {
        var cmdLen = pbf.readVarint();
        cmd = cmdLen & 0x7;
        length = cmdLen >> 3;
      }

      length--;

      if (cmd === 1 || cmd === 2) {
        x += pbf.readSVarint();
        y += pbf.readSVarint();

        if (cmd === 1) { // moveTo
          if (coordsLen > currentEnd) {
            ends.push(coordsLen);
            currentEnd = coordsLen;
          }
        }

        flatCoordinates.push(x, y);
        coordsLen += 2;

      } else if (cmd === 7) {

        if (coordsLen > currentEnd) {
          // close polygon
          flatCoordinates.push(
            flatCoordinates[currentEnd], flatCoordinates[currentEnd + 1]);
          coordsLen += 2;
        }

      } else {
        (0,asserts/* assert */.v)(false, 59); // Invalid command found in the PBF
      }
    }

    if (coordsLen > currentEnd) {
      ends.push(coordsLen);
      currentEnd = coordsLen;
    }

  };

  /**
   * @private
   * @param {Object} pbf PBF
   * @param {Object} rawFeature Raw Mapbox feature.
   * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
   * @return {import("../Feature.js").FeatureLike} Feature.
   */
  MVT.prototype.createFeature_ = function createFeature_ (pbf, rawFeature, opt_options) {
    var type = rawFeature.type;
    if (type === 0) {
      return null;
    }

    var feature;
    var id = rawFeature.id;
    var values = rawFeature.properties;
    values[this.layerName_] = rawFeature.layer.name;

    var flatCoordinates = [];
    var ends = [];
    this.readRawGeometry_(pbf, rawFeature, flatCoordinates, ends);

    var geometryType = getGeometryType(type, ends.length);

    if (this.featureClass_ === render_Feature) {
      feature = new this.featureClass_(geometryType, flatCoordinates, ends, values, id);
    } else {
      var geom;
      if (geometryType == GeometryType/* default */.A.POLYGON) {
        var endss = [];
        var offset = 0;
        var prevEndIndex = 0;
        for (var i = 0, ii = ends.length; i < ii; ++i) {
          var end = ends[i];
          if (!(0,orient/* linearRingIsClockwise */.uQ)(flatCoordinates, offset, end, 2)) {
            endss.push(ends.slice(prevEndIndex, i));
            prevEndIndex = i;
          }
          offset = end;
        }
        if (endss.length > 1) {
          geom = new MultiPolygon/* default */.A(flatCoordinates, GeometryLayout/* default */.A.XY, endss);
        } else {
          geom = new Polygon/* default */.Ay(flatCoordinates, GeometryLayout/* default */.A.XY, ends);
        }
      } else {
        geom = geometryType === GeometryType/* default */.A.POINT ? new Point/* default */.A(flatCoordinates, GeometryLayout/* default */.A.XY) :
          geometryType === GeometryType/* default */.A.LINE_STRING ? new LineString/* default */.A(flatCoordinates, GeometryLayout/* default */.A.XY) :
            geometryType === GeometryType/* default */.A.POLYGON ? new Polygon/* default */.Ay(flatCoordinates, GeometryLayout/* default */.A.XY, ends) :
              geometryType === GeometryType/* default */.A.MULTI_POINT ? new MultiPoint/* default */.A(flatCoordinates, GeometryLayout/* default */.A.XY) :
                geometryType === GeometryType/* default */.A.MULTI_LINE_STRING ? new MultiLineString/* default */.A(flatCoordinates, GeometryLayout/* default */.A.XY, ends) :
                  null;
      }
      var ctor = /** @type {typeof import("../Feature.js").default} */ (this.featureClass_);
      feature = new ctor();
      if (this.geometryName_) {
        feature.setGeometryName(this.geometryName_);
      }
      var geometry = /** @type {import("../geom/Geometry.js").default} */ ((0,Feature/* transformWithOptions */.V)(geom, false,
        this.adaptOptions(opt_options)));
      feature.setGeometry(geometry);
      feature.setId(id);
      feature.setProperties(values);
    }

    return feature;
  };

  /**
   * @inheritDoc
   * @api
   */
  MVT.prototype.getLastExtent = function getLastExtent () {
    return this.extent_;
  };

  /**
   * @inheritDoc
   */
  MVT.prototype.getType = function getType () {
    return FormatType/* default */.A.ARRAY_BUFFER;
  };

  /**
   * @inheritDoc
   * @api
   */
  MVT.prototype.readFeatures = function readFeatures (source, opt_options) {
    var layers = this.layers_;

    var pbf = new (pbf_default())(/** @type {ArrayBuffer} */ (source));
    var pbfLayers = pbf.readFields(layersPBFReader, {});
    /** @type {Array<import("../Feature.js").FeatureLike>} */
    var features = [];
    for (var name in pbfLayers) {
      if (layers && layers.indexOf(name) == -1) {
        continue;
      }
      var pbfLayer = pbfLayers[name];

      for (var i = 0, ii = pbfLayer.length; i < ii; ++i) {
        var rawFeature = readRawFeature(pbf, pbfLayer, i);
        features.push(this.createFeature_(pbf, rawFeature));
      }
      this.extent_ = pbfLayer ? [0, 0, pbfLayer.extent, pbfLayer.extent] : null;
    }

    return features;
  };

  /**
   * @inheritDoc
   * @api
   */
  MVT.prototype.readProjection = function readProjection (source) {
    return this.dataProjection;
  };

  /**
   * Sets the layers that features will be read from.
   * @param {Array<string>} layers Layers.
   * @api
   */
  MVT.prototype.setLayers = function setLayers (layers) {
    this.layers_ = layers;
  };

  return MVT;
}(Feature/* default */.A));


/**
 * Reader callback for parsing layers.
 * @param {number} tag The tag.
 * @param {Object} layers The layers object.
 * @param {Object} pbf The PBF.
 */
function layersPBFReader(tag, layers, pbf) {
  if (tag === 3) {
    var layer = {
      keys: [],
      values: [],
      features: []
    };
    var end = pbf.readVarint() + pbf.pos;
    pbf.readFields(layerPBFReader, layer, end);
    layer.length = layer.features.length;
    if (layer.length) {
      layers[layer.name] = layer;
    }
  }
}

/**
 * Reader callback for parsing layer.
 * @param {number} tag The tag.
 * @param {Object} layer The layer object.
 * @param {Object} pbf The PBF.
 */
function layerPBFReader(tag, layer, pbf) {
  if (tag === 15) {
    layer.version = pbf.readVarint();
  } else if (tag === 1) {
    layer.name = pbf.readString();
  } else if (tag === 5) {
    layer.extent = pbf.readVarint();
  } else if (tag === 2) {
    layer.features.push(pbf.pos);
  } else if (tag === 3) {
    layer.keys.push(pbf.readString());
  } else if (tag === 4) {
    var value = null;
    var end = pbf.readVarint() + pbf.pos;
    while (pbf.pos < end) {
      tag = pbf.readVarint() >> 3;
      value = tag === 1 ? pbf.readString() :
        tag === 2 ? pbf.readFloat() :
          tag === 3 ? pbf.readDouble() :
            tag === 4 ? pbf.readVarint64() :
              tag === 5 ? pbf.readVarint() :
                tag === 6 ? pbf.readSVarint() :
                  tag === 7 ? pbf.readBoolean() : null;
    }
    layer.values.push(value);
  }
}

/**
 * Reader callback for parsing feature.
 * @param {number} tag The tag.
 * @param {Object} feature The feature object.
 * @param {Object} pbf The PBF.
 */
function featurePBFReader(tag, feature, pbf) {
  if (tag == 1) {
    feature.id = pbf.readVarint();
  } else if (tag == 2) {
    var end = pbf.readVarint() + pbf.pos;
    while (pbf.pos < end) {
      var key = feature.layer.keys[pbf.readVarint()];
      var value = feature.layer.values[pbf.readVarint()];
      feature.properties[key] = value;
    }
  } else if (tag == 3) {
    feature.type = pbf.readVarint();
  } else if (tag == 4) {
    feature.geometry = pbf.pos;
  }
}


/**
 * Read a raw feature from the pbf offset stored at index `i` in the raw layer.
 * @suppress {missingProperties}
 * @param {Object} pbf PBF.
 * @param {Object} layer Raw layer.
 * @param {number} i Index of the feature in the raw layer's `features` array.
 * @return {Object} Raw feature.
 */
function readRawFeature(pbf, layer, i) {
  pbf.pos = layer.features[i];
  var end = pbf.readVarint() + pbf.pos;

  var feature = {
    layer: layer,
    type: 0,
    properties: {}
  };
  pbf.readFields(featurePBFReader, feature, end);
  return feature;
}


/**
 * @suppress {missingProperties}
 * @param {number} type The raw feature's geometry type
 * @param {number} numEnds Number of ends of the flat coordinates of the
 * geometry.
 * @return {GeometryType} The geometry type.
 */
function getGeometryType(type, numEnds) {
  /** @type {GeometryType} */
  var geometryType;
  if (type === 1) {
    geometryType = numEnds === 1 ?
      GeometryType/* default */.A.POINT : GeometryType/* default */.A.MULTI_POINT;
  } else if (type === 2) {
    geometryType = numEnds === 1 ?
      GeometryType/* default */.A.LINE_STRING :
      GeometryType/* default */.A.MULTI_LINE_STRING;
  } else if (type === 3) {
    geometryType = GeometryType/* default */.A.POLYGON;
    // MultiPolygon not relevant for rendering - winding order determines
    // outer rings of polygons.
  }
  return geometryType;
}

/* harmony default export */ var format_MVT = (MVT);

//# sourceMappingURL=MVT.js.map
// EXTERNAL MODULE: ./node_modules/ol/has.js
var has = __webpack_require__(44954);
// EXTERNAL MODULE: ./node_modules/ol/render/canvas/Immediate.js
var Immediate = __webpack_require__(39265);
;// ./node_modules/ol/render.js
/**
 * @module ol/render
 */





/**
 * @typedef {Object} State
 * @property {CanvasRenderingContext2D} context Canvas context that the layer is being rendered to.
 * @property {import("./Feature.js").FeatureLike} feature
 * @property {import("./geom/SimpleGeometry.js").default} geometry
 * @property {number} pixelRatio Pixel ratio used by the layer renderer.
 * @property {number} resolution Resolution that the render batch was created and optimized for.
 * This is not the view's resolution that is being rendered.
 * @property {number} rotation Rotation of the rendered layer in radians.
 */


/**
 * A function to be used when sorting features before rendering.
 * It takes two instances of {@link module:ol/Feature} or
 * {@link module:ol/render/Feature} and returns a `{number}`.
 *
 * @typedef {function(import("./Feature.js").FeatureLike, import("./Feature.js").FeatureLike):number} OrderFunction
 */


/**
 * @typedef {Object} ToContextOptions
 * @property {import("./size.js").Size} [size] Desired size of the canvas in css
 * pixels. When provided, both canvas and css size will be set according to the
 * `pixelRatio`. If not provided, the current canvas and css sizes will not be
 * altered.
 * @property {number} [pixelRatio=window.devicePixelRatio] Pixel ratio (canvas
 * pixel to css pixel ratio) for the canvas.
 */


/**
 * Binds a Canvas Immediate API to a canvas context, to allow drawing geometries
 * to the context's canvas.
 *
 * The units for geometry coordinates are css pixels relative to the top left
 * corner of the canvas element.
 * ```js
 * import {toContext} from 'ol/render';
 * import Fill from 'ol/style/Fill';
 * import Polygon from 'ol/geom/Polygon';
 *
 * var canvas = document.createElement('canvas');
 * var render = toContext(canvas.getContext('2d'),
 *     { size: [100, 100] });
 * render.setFillStrokeStyle(new Fill({ color: blue }));
 * render.drawPolygon(
 *     new Polygon([[[0, 0], [100, 100], [100, 0], [0, 0]]]));
 * ```
 *
 * @param {CanvasRenderingContext2D} context Canvas context.
 * @param {ToContextOptions=} opt_options Options.
 * @return {CanvasImmediateRenderer} Canvas Immediate.
 * @api
 */
function toContext(context, opt_options) {
  var canvas = context.canvas;
  var options = opt_options ? opt_options : {};
  var pixelRatio = options.pixelRatio || has/* DEVICE_PIXEL_RATIO */.cr;
  var size = options.size;
  if (size) {
    canvas.width = size[0] * pixelRatio;
    canvas.height = size[1] * pixelRatio;
    canvas.style.width = size[0] + 'px';
    canvas.style.height = size[1] + 'px';
  }
  var extent = [0, 0, canvas.width, canvas.height];
  var transform = (0,ol_transform/* scale */.hs)((0,ol_transform/* create */.vt)(), pixelRatio, pixelRatio);
  return new Immediate/* default */.A(context, pixelRatio, extent, transform, 0);
}

//# sourceMappingURL=render.js.map
// EXTERNAL MODULE: ./node_modules/ol/structs/LRUCache.js
var LRUCache = __webpack_require__(97562);
// EXTERNAL MODULE: ./node_modules/ol/style/Stroke.js
var Stroke = __webpack_require__(75370);
// EXTERNAL MODULE: ./node_modules/ol/style/Style.js
var Style = __webpack_require__(48069);
// EXTERNAL MODULE: ./node_modules/ol/tileurlfunction.js
var tileurlfunction = __webpack_require__(9095);
;// ./node_modules/olcs/lib/olcs/MVTImageryProvider.js










const format = new format_MVT({
    featureClass: render_Feature,
});
const styles = [
    new Style/* default */.Ay({
        stroke: new Stroke/* default */.A({
            color: 'blue',
            width: 2,
        }),
    }),
];
class MVTImageryProvider {
    urls;
    emptyCanvas_ = createEmptyCanvas();
    emptyCanvasPromise_ = Promise.resolve(this.emptyCanvas_);
    tilingScheme_ = new Cesium.WebMercatorTilingScheme();
    ready_ = true;
    rectangle_;
    tileRectangle_;
    tileWidth = 256;
    tileHeight = 256;
    maximumLevel = 20;
    minimumLevel_ = 0;
    get minimumLevel() {
        return this.minimumLevel_;
    }
    featureCache;
    tileCache;
    tileFunction_;
    styleFunction_;
    projection_ = (0,ol_proj/* get */.Jt)('EPSG:3857');
    /**
     * When <code>true</code>, this model is ready to render, i.e., the external binary, image,
     * and shader files were downloaded and the WebGL resources were created.
     */
    get ready() {
        return this.ready_;
    }
    /**
     * Gets the rectangle, in radians, of the imagery provided by the instance.
     */
    get rectangle() {
        return this.rectangle_;
    }
    /**
     * Gets the tiling scheme used by the provider.
     */
    get tilingScheme() {
        return this.tilingScheme_;
    }
    /**
     * Gets an event that is raised when the imagery provider encounters an asynchronous error.  By subscribing
     * to the event, you will be notified of the error and can potentially recover from it.  Event listeners
     * are passed an instance of {@link Cesium.TileProviderError}.
     */
    errorEvent = new Cesium.Event();
    /**
     * Gets the credit to display when this imagery provider is active.  Typically this is used to credit
     * the source of the imagery.
     */
    credit;
    getTileCredits(x, y, level) {
        return [];
    }
    /**
     * Gets the proxy used by this provider.
     */
    proxy;
    get _ready() {
        return this.ready_;
    }
    /**
     * Gets the tile discard policy.  If not undefined, the discard policy is responsible
     * for filtering out "missing" tiles via its shouldDiscardImage function.  If this function
     * returns undefined, no tiles are filtered.
     */
    get tileDiscardPolicy() {
        return undefined;
    }
    // FIXME: this might be exposed
    /**
     * Gets a value indicating whether or not the images provided by this imagery provider
     * include an alpha channel.  If this property is false, an alpha channel, if present, will
     * be ignored.  If this property is true, any images without an alpha channel will be treated
     * as if their alpha is 1.0 everywhere.  When this property is false, memory usage
     * and texture upload time are reduced.
     */
    get hasAlphaChannel() {
        return true;
    }
    // FIXME: this could be implemented by proxying to OL
    /**
     * Asynchronously determines what features, if any, are located at a given longitude and latitude within
     * a tile.
     * This function is optional, so it may not exist on all ImageryProviders.
     * @param x The tile X coordinate.
     * @param y The tile Y coordinate.
     * @param level The tile level.
     * @param longitude The longitude at which to pick features.
     * @param latitude The latitude at which to pick features.
     * @return A promise for the picked features that will resolve when the asynchronous
     *                   picking completes.  The resolved value is an array of {@link ImageryLayerFeatureInfo}
     *                   instances.  The array may be empty if no features are found at the given location.
     *                   It may also be undefined if picking is not supported.
     */
    pickFeatures(x, y, level, longitude, latitude) {
        return undefined;
    }
    constructor(options) {
        this.urls = options.urls;
        this.rectangle_ = options.rectangle || this.tilingScheme.rectangle;
        this.credit = options.credit;
        this.styleFunction_ = options.styleFunction || (() => styles);
        this.tileRectangle_ = new Cesium.Rectangle();
        // to avoid too frequent cache grooming we allow x2 capacity
        const cacheSize = options.cacheSize !== undefined ? options.cacheSize : 50;
        this.tileCache = new LRUCache/* default */.A(cacheSize);
        this.featureCache = options.featureCache || new LRUCache/* default */.A(cacheSize);
        this.minimumLevel_ = options.minimumLevel || 0;
        const tileGrid = (0,tilegrid/* getForProjection */.pr)(this.projection_);
        this.tileFunction_ = (0,tileurlfunction/* createFromTemplates */.Qz)(this.urls, tileGrid);
    }
    getTileFeatures(z, x, y) {
        const cacheKey = this.getCacheKey_(z, x, y);
        let promise;
        if (this.featureCache.containsKey(cacheKey)) {
            promise = this.featureCache.get(cacheKey);
        }
        if (!promise) {
            const url = this.getUrl_(z, x, y);
            promise = fetch(url)
                .then((r) => (r.ok ? r : Promise.reject(r)))
                .then((r) => r.arrayBuffer())
                .then((buffer) => this.readFeaturesFromBuffer(buffer));
            this.featureCache.set(cacheKey, promise);
            if (this.featureCache.getCount() > 2 * this.featureCache.highWaterMark) {
                while (this.featureCache.canExpireCache()) {
                    this.featureCache.pop();
                }
            }
        }
        return promise;
    }
    readFeaturesFromBuffer(buffer) {
        const features = format.readFeatures(buffer);
        const scaleFactor = this.tileWidth / 4096;
        features.forEach((f) => {
            const flatCoordinates = f.getFlatCoordinates();
            for (let i = 0; i < flatCoordinates.length; ++i) {
                flatCoordinates[i] *= scaleFactor;
            }
        });
        return features;
    }
    getUrl_(z, x, y) {
        // FIXME: probably we should not pass 1 as pixelRatio
        const url = this.tileFunction_([z, x, y], 1, this.projection_);
        return url;
    }
    getCacheKey_(z, x, y) {
        return `${z}_${x}_${y}`;
    }
    requestImage(x, y, z, request) {
        if (z < this.minimumLevel_) {
            return this.emptyCanvasPromise_;
        }
        try {
            const cacheKey = this.getCacheKey_(z, x, y);
            let promise;
            if (this.tileCache.containsKey(cacheKey)) {
                promise = this.tileCache.get(cacheKey);
            }
            if (!promise) {
                promise = this.getTileFeatures(z, x, y).then((features) => {
                    // FIXME: here we suppose the 2D projection is in meters
                    this.tilingScheme.tileXYToNativeRectangle(x, y, z, this.tileRectangle_);
                    const resolution = (this.tileRectangle_.east - this.tileRectangle_.west) /
                        this.tileWidth;
                    return this.rasterizeFeatures(features, this.styleFunction_, resolution);
                });
                this.tileCache.set(cacheKey, promise);
                if (this.tileCache.getCount() > 2 * this.tileCache.highWaterMark) {
                    while (this.tileCache.canExpireCache()) {
                        this.tileCache.pop();
                    }
                }
            }
            return promise;
        }
        catch (e) {
            console.trace(e);
            // FIXME: open PR on Cesium to fix incorrect typing
            // @ts-ignore
            this.errorEvent.raiseEvent('could not render pbf to tile', e);
        }
    }
    rasterizeFeatures(features, styleFunction, resolution) {
        const canvas = document.createElement('canvas');
        const vectorContext = toContext(canvas.getContext('2d'), {
            size: [this.tileWidth, this.tileHeight],
        });
        features.forEach((f) => {
            const styles = styleFunction(f, resolution);
            if (styles) {
                if (Array.isArray(styles)) {
                    styles.forEach((style) => {
                        vectorContext.setStyle(style);
                        vectorContext.drawGeometry(f);
                    });
                }
                else {
                    vectorContext.setStyle(styles);
                    vectorContext.drawGeometry(f);
                }
            }
        });
        return canvas;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTVZUSW1hZ2VyeVByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29sY3MvTVZUSW1hZ2VyeVByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWFBLE9BQU8sR0FBRyxNQUFNLGtCQUFrQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxHQUFHLElBQUksYUFBYSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDdkMsT0FBTyxhQUFhLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxRQUFRLE1BQU0sd0JBQXdCLENBQUM7QUFDOUMsT0FBTyxNQUFNLE1BQU0sb0JBQW9CLENBQUM7QUFDeEMsT0FBTyxLQUFLLEVBQUUsRUFBb0IsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsZ0JBQWdCLElBQUksd0JBQXdCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RSxPQUFPLEVBQUMsbUJBQW1CLElBQUksc0JBQXNCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQVk5RCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUNyQixZQUFZLEVBQUUsYUFBYTtDQUM1QixDQUFDLENBQUM7QUFFSCxNQUFNLE1BQU0sR0FBRztJQUNiLElBQUksS0FBSyxDQUFDO1FBQ1IsTUFBTSxFQUFFLElBQUksTUFBTSxDQUFDO1lBQ2pCLEtBQUssRUFBRSxNQUFNO1lBQ2IsS0FBSyxFQUFFLENBQUM7U0FDVCxDQUFDO0tBQ0gsQ0FBQztDQUNILENBQUM7QUFFRixNQUFNLENBQUMsT0FBTyxPQUFPLGtCQUFrQjtJQUM3QixJQUFJLENBQVc7SUFDZixZQUFZLEdBQXNCLGlCQUFpQixFQUFFLENBQUM7SUFDdEQsbUJBQW1CLEdBQStCLE9BQU8sQ0FBQyxPQUFPLENBQ3ZFLElBQUks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
;// ./node_modules/olcs/lib/olcs/core.js
/* unused harmony import specifier */ var linearEasing;














/**
 * Compute the pixel width and height of a point in meters using the
 * camera frustum.
 * @param scene
 * @param target
 */
function computePixelSizeAtCoordinate(scene, target) {
    const camera = scene.camera;
    const canvas = scene.canvas;
    const frustum = camera.frustum;
    const distance = Cesium.Cartesian3.magnitude(Cesium.Cartesian3.subtract(camera.position, target, new Cesium.Cartesian3()));
    // @ts-ignore TS2341
    return frustum.getPixelDimensions(canvas.clientWidth, canvas.clientHeight, distance, 
    //@ts-expect-error
    scene.pixelRatio, new Cesium.Cartesian2());
}
/**
 * Compute bounding box around a target point.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.Cartesian3} target
 * @param {number} amount Half the side of the box, in pixels.
 * @return {Array<Cesium.Cartographic>} bottom left and top right
 * coordinates of the box
 */
function computeBoundingBoxAtTarget(scene, target, amount) {
    const pixelSize = computePixelSizeAtCoordinate(scene, target);
    const transform = Cesium.Transforms.eastNorthUpToFixedFrame(target);
    const bottomLeft = Cesium.Matrix4.multiplyByPoint(transform, new Cesium.Cartesian3(-pixelSize.x * amount, -pixelSize.y * amount, 0), new Cesium.Cartesian3());
    const topRight = Cesium.Matrix4.multiplyByPoint(transform, new Cesium.Cartesian3(pixelSize.x * amount, pixelSize.y * amount, 0), new Cesium.Cartesian3());
    return Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray([
        bottomLeft,
        topRight,
    ]);
}
function applyHeightOffsetToGeometry(geometry, height) {
    geometry.applyTransform((input, output, stride) => {
        console.assert(input === output);
        if (stride !== undefined && stride >= 3) {
            for (let i = 0; i < output.length; i += stride) {
                output[i + 2] = output[i + 2] + height;
            }
        }
        return output;
    });
}
function createMatrixAtCoordinates(coordinates, rotation = 0, translation = Cesium.Cartesian3.ZERO, scale = new Cesium.Cartesian3(1, 1, 1)) {
    const position = ol4326CoordinateToCesiumCartesian(coordinates);
    const rawMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    const quaternion = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, -rotation);
    const rotationMatrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(translation, quaternion, scale);
    return Cesium.Matrix4.multiply(rawMatrix, rotationMatrix, new Cesium.Matrix4());
}
function rotateAroundAxis(camera, angle, axis, transform, opt_options) {
    const clamp = Cesium.Math.clamp;
    const options = opt_options;
    const duration = options?.duration ?? 500; // ms
    const easing = options?.easing ?? linearEasing;
    const callback = options?.callback;
    let lastProgress = 0;
    const oldTransform = new Cesium.Matrix4();
    const start = Date.now();
    const step = function () {
        const timestamp = Date.now();
        const timeDifference = timestamp - start;
        const progress = easing(clamp(timeDifference / duration, 0, 1));
        console.assert(progress >= lastProgress);
        camera.transform.clone(oldTransform);
        const stepAngle = (progress - lastProgress) * angle;
        lastProgress = progress;
        camera.lookAtTransform(transform);
        camera.rotate(axis, stepAngle);
        camera.lookAtTransform(oldTransform);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
        else {
            if (callback) {
                callback();
            }
        }
    };
    window.requestAnimationFrame(step);
}
function setHeadingUsingBottomCenter(scene, heading, bottomCenter, options) {
    const camera = scene.camera;
    // Compute the camera position to zenith quaternion
    const angleToZenith = computeAngleToZenith(scene, bottomCenter);
    const axis = camera.right;
    const quaternion = Cesium.Quaternion.fromAxisAngle(axis, angleToZenith);
    const rotation = Cesium.Matrix3.fromQuaternion(quaternion);
    // Get the zenith point from the rotation of the position vector
    const vector = new Cesium.Cartesian3();
    Cesium.Cartesian3.subtract(camera.position, bottomCenter, vector);
    const zenith = new Cesium.Cartesian3();
    Cesium.Matrix3.multiplyByVector(rotation, vector, zenith);
    Cesium.Cartesian3.add(zenith, bottomCenter, zenith);
    // Actually rotate around the zenith normal
    const transform = Cesium.Matrix4.fromTranslation(zenith);
    rotateAroundAxis(camera, heading, zenith, transform, options);
}
/**
 * Get the 3D position of the given pixel of the canvas.
 * @param scene
 * @param pixel
 */
function pickOnTerrainOrEllipsoid(scene, pixel) {
    const ray = scene.camera.getPickRay(pixel);
    const target = scene.globe.pick(ray, scene);
    return target || scene.camera.pickEllipsoid(pixel);
}
/**
 * Get the 3D position of the point at the bottom-center of the screen.
 * @param scene
 */
function pickBottomPoint(scene) {
    const canvas = scene.canvas;
    const bottom = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight);
    return pickOnTerrainOrEllipsoid(scene, bottom);
}
/**
 * Get the 3D position of the point at the center of the screen.
 * @param scene
 */
function pickCenterPoint(scene) {
    const canvas = scene.canvas;
    const center = new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2);
    return pickOnTerrainOrEllipsoid(scene, center);
}
/**
 * Compute the signed tilt angle on globe, between the opposite of the
 * camera direction and the target normal. Return undefined if there is no
 * @param scene
 */
function computeSignedTiltAngleOnGlobe(scene) {
    const camera = scene.camera;
    const ray = new Cesium.Ray(camera.position, camera.direction);
    let target = scene.globe.pick(ray, scene);
    if (!target) {
        // no tiles in the area were loaded?
        const ellipsoid = Cesium.Ellipsoid.WGS84;
        const obj = Cesium.IntersectionTests.rayEllipsoid(ray, ellipsoid);
        if (obj) {
            target = Cesium.Ray.getPoint(ray, obj.start);
        }
    }
    if (!target) {
        return undefined;
    }
    const normal = new Cesium.Cartesian3();
    Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(target, normal);
    const angleBetween = signedAngleBetween;
    const angle = angleBetween(camera.direction, normal, camera.right) - Math.PI;
    return Cesium.Math.convertLongitudeRange(angle);
}
/**
 * Compute the ray from the camera to the bottom-center of the screen.
 * @param scene
 */
function bottomFovRay(scene) {
    const camera = scene.camera;
    // @ts-ignore TS2341
    const fovy2 = camera.frustum.fovy / 2;
    const direction = camera.direction;
    const rotation = Cesium.Quaternion.fromAxisAngle(camera.right, fovy2);
    const matrix = Cesium.Matrix3.fromQuaternion(rotation);
    const vector = new Cesium.Cartesian3();
    Cesium.Matrix3.multiplyByVector(matrix, direction, vector);
    return new Cesium.Ray(camera.position, vector);
}
/**
 * Compute the angle between two Cartesian3.
 * @param first
 * @param second
 * @param normal
 */
function signedAngleBetween(first, second, normal) {
    // We are using the dot for the angle.
    // Then the cross and the dot for the sign.
    const a = new Cesium.Cartesian3();
    const b = new Cesium.Cartesian3();
    const c = new Cesium.Cartesian3();
    Cesium.Cartesian3.normalize(first, a);
    Cesium.Cartesian3.normalize(second, b);
    Cesium.Cartesian3.cross(a, b, c);
    const cosine = Cesium.Cartesian3.dot(a, b);
    const sine = Cesium.Cartesian3.magnitude(c);
    // Sign of the vector product and the orientation normal
    const sign = Cesium.Cartesian3.dot(normal, c);
    const angle = Math.atan2(sine, cosine);
    return sign >= 0 ? angle : -angle;
}
/**
 * Compute the rotation angle around a given point, needed to reach the
 * zenith position.
 * At a zenith position, the camera direction is going througth the earth
 * center and the frustrum bottom ray is going through the chosen pivot
 * point.
 * The bottom-center of the screen is a good candidate for the pivot point.
 * @param scene
 * @param pivot
 */
function computeAngleToZenith(scene, pivot) {
    // This angle is the sum of the angles 'fy' and 'a', which are defined
    // using the pivot point and its surface normal.
    //        Zenith |    camera
    //           \   |   /
    //            \fy|  /
    //             \ |a/
    //              \|/pivot
    const camera = scene.camera;
    // @ts-ignore TS2341
    const fy = camera.frustum.fovy / 2;
    const ray = bottomFovRay(scene);
    const direction = Cesium.Cartesian3.clone(ray.direction);
    Cesium.Cartesian3.negate(direction, direction);
    const normal = new Cesium.Cartesian3();
    Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(pivot, normal);
    const left = new Cesium.Cartesian3();
    Cesium.Cartesian3.negate(camera.right, left);
    const a = signedAngleBetween(normal, direction, left);
    return a + fy;
}
/**
 * Convert an OpenLayers extent to a Cesium rectangle.
 * @param {ol.Extent} extent Extent.
 * @param {ol.ProjectionLike} projection Extent projection.
 * @return {Cesium.Rectangle} The corresponding Cesium rectangle.
 */
function extentToRectangle(extent, projection) {
    if (extent && projection) {
        const ext = (0,ol_proj/* transformExtent */.DI)(extent, projection, 'EPSG:4326');
        return Cesium.Rectangle.fromDegrees(ext[0], ext[1], ext[2], ext[3]);
    }
    return null;
}
function sourceToImageryProvider(olMap, source, viewProj, olLayer) {
    const skip = source.get('olcs_skip');
    if (skip) {
        return null;
    }
    let provider = null;
    // Convert ImageWMS to TileWMS
    if (source instanceof source_ImageWMS && source.getUrl()) {
        const sourceProps = {
            'olcs_proxy': source.get('olcs_proxy'),
            'olcs_extent': source.get('olcs_extent'),
            'olcs_projection': source.get('olcs_projection'),
            'olcs.imagesource': source,
        };
        const imageLoadFunction = source.getImageLoadFunction();
        const tileLoadFunction = source.get('olcs_tileLoadFunction') ||
            function tileLoadFunction(tile, src) {
                // An imageLoadFunction takes an ImageWrapperm which has a getImage method.
                // A tile also has a getImage method.
                // We incorrectly passe a tile as an ImageWrapper and hopes for the best.
                imageLoadFunction(tile, src);
            };
        source = new source_TileWMS({
            url: source.getUrl(),
            attributions: source.getAttributions(),
            projection: source.getProjection(),
            tileLoadFunction,
            params: source.getParams(),
        });
        source.setProperties(sourceProps);
    }
    if (source instanceof TileImage/* default */.A) {
        let projection = getSourceProjection(source);
        if (!projection) {
            // if not explicit, assume the same projection as view
            projection = viewProj;
        }
        if (isCesiumProjection(projection)) {
            provider = new OLImageryProvider(olMap, source, viewProj);
        }
        // Projection not supported by Cesium
        else {
            return null;
        }
    }
    else if (source instanceof ImageStatic) {
        let projection = getSourceProjection(source);
        if (!projection) {
            projection = viewProj;
        }
        if (isCesiumProjection(projection)) {
            const rectangle = Cesium.Rectangle.fromDegrees(source.getImageExtent()[0], source.getImageExtent()[1], source.getImageExtent()[2], source.getImageExtent()[3], new Cesium.Rectangle());
            provider = new Cesium.SingleTileImageryProvider({
                url: source.getUrl(),
                rectangle,
            });
        }
        // Projection not supported by Cesium
        else {
            return null;
        }
    }
    else if (source instanceof source_VectorTile &&
        olLayer instanceof VectorTile) {
        let projection = getSourceProjection(source);
        if (!projection) {
            projection = viewProj;
        }
        if (skip === false) {
            // MVT is experimental, it should be whitelisted to be synchronized
            const fromCode = projection.getCode().split(':')[1];
            // @ts-ignore TS2341
            const urls = source.urls.map((u) => u.replace(fromCode, '3857'));
            const extent = olLayer.getExtent();
            const rectangle = extentToRectangle(extent, projection);
            const minimumLevel = source.get('olcs_minimumLevel');
            const attributionsFunction = source.getAttributions();
            const styleFunction = olLayer.getStyleFunction();
            let credit;
            if (extent && attributionsFunction) {
                const center = (0,ol_extent/* getCenter */.q1)(extent);
                credit = attributionsFunctionToCredits(attributionsFunction, 0, center, extent)[0];
            }
            provider = new MVTImageryProvider({
                credit,
                rectangle,
                minimumLevel,
                styleFunction,
                urls,
            });
            return provider;
        }
        return null; // FIXME: it is disabled by default right now
    }
    else {
        // sources other than TileImage|Imageexport function are currently not supported
        return null;
    }
    return provider;
}
/**
 * Creates Cesium.ImageryLayer best corresponding to the given ol.layer.Layer.
 * Only supports raster layers and export function images
 * @param olMap
 * @param olLayer
 * @param viewProj
 */
function tileLayerToImageryLayer(olMap, olLayer, viewProj) {
    if (!(olLayer instanceof Tile/* default */.A) &&
        !(olLayer instanceof layer_Image) &&
        !(olLayer instanceof VectorTile)) {
        return null;
    }
    const source = olLayer.getSource();
    if (!source) {
        return null;
    }
    let provider = source.get('olcs_provider');
    if (!provider) {
        provider = sourceToImageryProvider(olMap, source, viewProj, olLayer);
    }
    if (!provider) {
        return null;
    }
    const layerOptions = {};
    const forcedExtent = olLayer.get('olcs_extent');
    const ext = forcedExtent || olLayer.getExtent();
    if (ext) {
        layerOptions.rectangle = extentToRectangle(ext, viewProj);
    }
    const cesiumLayer = new Cesium.ImageryLayer(provider, layerOptions);
    return cesiumLayer;
}
/**
 * Synchronizes the layer rendering properties (opacity, visible)
 * to the given Cesium ImageryLayer.
 * @param olLayerWithParents
 * @param csLayer
 */
function updateCesiumLayerProperties(olLayerWithParents, csLayer) {
    let opacity = 1;
    let visible = true;
    [olLayerWithParents.layer]
        .concat(olLayerWithParents.parents)
        .forEach((olLayer) => {
        const layerOpacity = olLayer.getOpacity();
        if (layerOpacity !== undefined) {
            opacity *= layerOpacity;
        }
        const layerVisible = olLayer.getVisible();
        if (layerVisible !== undefined) {
            visible = visible && layerVisible;
        }
    });
    csLayer.alpha = opacity;
    csLayer.show = visible;
}
/**
 * Convert a 2D or 3D OpenLayers coordinate to Cesium.
 * @param coordinate
 */
function ol4326CoordinateToCesiumCartesian(coordinate) {
    const coo = coordinate;
    return coo.length > 2
        ? Cesium.Cartesian3.fromDegrees(coo[0], coo[1], coo[2])
        : Cesium.Cartesian3.fromDegrees(coo[0], coo[1]);
}
/**
 * Convert an array of 2D or 3D OpenLayers coordinates to Cesium.
 * @param coordinates
 */
function ol4326CoordinateArrayToCsCartesians(coordinates) {
    console.assert(coordinates !== null);
    const toCartesian = ol4326CoordinateToCesiumCartesian;
    const cartesians = [];
    for (let i = 0; i < coordinates.length; ++i) {
        cartesians.push(toCartesian(coordinates[i]));
    }
    return cartesians;
}
/**
 * Reproject an OpenLayers geometry to EPSG:4326 if needed.
 * The geometry will be cloned only when original projection is not EPSG:4326
 * and the properties will be shallow copied.
 * @param geometry
 * @param projection
 */
function olGeometryCloneTo4326(geometry, projection) {
    console.assert(!!projection);
    const proj4326 = (0,ol_proj/* get */.Jt)('EPSG:4326');
    const proj = (0,ol_proj/* get */.Jt)(projection);
    if (proj.getCode() !== proj4326.getCode()) {
        const properties = geometry.getProperties();
        geometry = geometry.clone();
        geometry.transform(proj, proj4326);
        geometry.setProperties(properties);
    }
    return geometry;
}
/**
 * Convert an OpenLayers color to Cesium.
 * @param olColor
 */
function convertColorToCesium(olColor) {
    olColor = olColor || 'black';
    if (Array.isArray(olColor)) {
        return new Cesium.Color(Cesium.Color.byteToFloat(olColor[0]), Cesium.Color.byteToFloat(olColor[1]), Cesium.Color.byteToFloat(olColor[2]), olColor[3]);
    }
    if (typeof olColor == 'string') {
        return Cesium.Color.fromCssColorString(olColor);
    }
    if (olColor instanceof CanvasPattern || olColor instanceof CanvasGradient) {
        // Render the CanvasPattern/CanvasGradient into a canvas that will be sent to Cesium as material
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;
        ctx.fillStyle = olColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return new Cesium.ImageMaterialProperty({
            image: canvas,
        });
    }
    console.assert(false, 'impossible');
}
/**
 * Convert an OpenLayers url to Cesium.
 * @param url
 */
function convertUrlToCesium(url) {
    let subdomains = '';
    const re = /\{(\d|[a-z])-(\d|[a-z])\}/;
    const match = re.exec(url);
    if (match) {
        url = url.replace(re, '{s}');
        const startCharCode = match[1].charCodeAt(0);
        const stopCharCode = match[2].charCodeAt(0);
        let charCode;
        for (charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
            subdomains += String.fromCharCode(charCode);
        }
    }
    return {
        url,
        subdomains,
    };
}
/**
 * Animate the return to a top-down view from the zenith.
 * The camera is rotated to orient to the North.
 * @param map
 * @param scene
 */
function resetToNorthZenith(map, scene) {
    return new Promise((resolve, reject) => {
        const camera = scene.camera;
        const pivot = pickBottomPoint(scene);
        if (!pivot) {
            reject('Could not get bottom pivot');
            return;
        }
        const currentHeading = map.getView().getRotation();
        if (currentHeading === undefined) {
            reject('The view is not initialized');
            return;
        }
        const angle = computeAngleToZenith(scene, pivot);
        // Point to North
        setHeadingUsingBottomCenter(scene, currentHeading, pivot);
        // Go to zenith
        const transform = Cesium.Matrix4.fromTranslation(pivot);
        const axis = camera.right;
        const options = {
            callback: () => {
                const view = map.getView();
                normalizeView(view);
                resolve(undefined);
            },
        };
        rotateAroundAxis(camera, -angle, axis, transform, options);
    });
}
/**
 * @param {!Cesium.Scene} scene
 * @param {number} angle in radian
 * @return {Promise<undefined>}
 * @api
 */
function rotateAroundBottomCenter(scene, angle) {
    return new Promise((resolve, reject) => {
        const camera = scene.camera;
        const pivot = pickBottomPoint(scene);
        if (!pivot) {
            reject('could not get bottom pivot');
            return;
        }
        const options = {
            callback: () => resolve(undefined),
        };
        const transform = Cesium.Matrix4.fromTranslation(pivot);
        const axis = camera.right;
        rotateAroundAxis(camera, -angle, axis, transform, options);
    });
}
/**
 * Set the OpenLayers view to a specific rotation and
 * the nearest resolution.
 * @param view
 * @param angle
 */
function normalizeView(view, angle = 0) {
    const resolution = view.getResolution();
    view.setRotation(angle);
    // @ts-ignore TS2341
    if (view.constrainResolution) {
        // @ts-ignore TS2341
        view.setResolution(view.constrainResolution(resolution));
    }
    else {
        view.setResolution(view.getConstrainedResolution(resolution));
    }
}
/**
 * Check if the given projection is managed by Cesium (WGS84 or Mercator Spheric)
 * @param projection
 */
function isCesiumProjection(projection) {
    const is3857 = projection.getCode() === 'EPSG:3857';
    const is4326 = projection.getCode() === 'EPSG:4326';
    return is3857 || is4326;
}
function attributionsFunctionToCredits(attributionsFunction, zoom, center, extent) {
    if (!attributionsFunction) {
        return [];
    }
    let attributions = attributionsFunction({
        viewState: {
            zoom,
            center,
            projection: undefined,
            resolution: undefined,
            rotation: undefined,
        },
        extent,
    });
    if (!Array.isArray(attributions)) {
        attributions = [attributions];
    }
    return attributions.map((html) => new Cesium.Credit(html, true));
}
/**
 * calculate the distance between camera and centerpoint based on the resolution and latitude value
 * @param resolution
 * @param latitude
 * @param scene
 * @param projection
 */
function calcDistanceForResolution(resolution, latitude, scene, projection) {
    const canvas = scene.canvas;
    const camera = scene.camera;
    // @ts-ignore TS2341
    const fovy = camera.frustum.fovy; // vertical field of view
    console.assert(!isNaN(fovy));
    const metersPerUnit = projection.getMetersPerUnit();
    // number of "map units" visible in 2D (vertically)
    const visibleMapUnits = resolution * canvas.clientHeight;
    // The metersPerUnit does not take latitude into account, but it should
    // be lower with increasing latitude -- we have to compensate.
    // In 3D it is not possible to maintain the resolution at more than one point,
    // so it only makes sense to use the latitude of the "target" point.
    const relativeCircumference = Math.cos(Math.abs(latitude));
    // how many meters should be visible in 3D
    const visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;
    // distance required to view the calculated length in meters
    //
    //  fovy/2
    //    |\
    //  x | \
    //    |--\
    // visibleMeters/2
    const requiredDistance = visibleMeters / 2 / Math.tan(fovy / 2);
    // NOTE: This calculation is not absolutely precise, because metersPerUnit
    // is a great simplification. It does not take ellipsoid/terrain into account.
    return requiredDistance;
}
/**
 * calculate the resolution based on a distance(camera to position) and latitude value
 * @param distance
 * @param latitude
 * @param scene
 * @param projection
 */
function calcResolutionForDistance(distance, latitude, scene, projection) {
    // See the reverse calculation (calcDistanceForResolution) for details
    const canvas = scene.canvas;
    const camera = scene.camera;
    // @ts-ignore TS2341
    const fovy = camera.frustum.fovy; // vertical field of view
    console.assert(!isNaN(fovy));
    const metersPerUnit = projection.getMetersPerUnit();
    const visibleMeters = 2 * distance * Math.tan(fovy / 2);
    const relativeCircumference = Math.cos(Math.abs(latitude));
    const visibleMapUnits = visibleMeters / metersPerUnit / relativeCircumference;
    const resolution = visibleMapUnits / canvas.clientHeight;
    return resolution;
}
/**
 * Constrain the camera so that it stays close to the bounding sphere of the map extent.
 * Near the ground the allowed distance is shorter.
 * @param camera
 * @param boundingSphere
 * @param ratio
 */
function limitCameraToBoundingSphere(camera, boundingSphere, ratio) {
    let blockLimiter = false;
    return function () {
        if (!blockLimiter) {
            const position = camera.position;
            const carto = Cesium.Cartographic.fromCartesian(position);
            if (Cesium.Cartesian3.distance(boundingSphere.center, position) >
                boundingSphere.radius * ratio(carto.height)) {
                // @ts-ignore TS2339: FIXME, there is no flying property in Camera
                const currentlyFlying = camera.flying;
                if (currentlyFlying === true) {
                    // There is a flying property and its value is true
                    return;
                }
                blockLimiter = true;
                const unblockLimiter = () => (blockLimiter = false);
                camera.flyToBoundingSphere(boundingSphere, {
                    complete: unblockLimiter,
                    cancel: unblockLimiter,
                });
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGNzL2NvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0JBLE9BQU8sRUFBQyxNQUFNLElBQUksWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3BELE9BQU8sRUFBYyxTQUFTLElBQUksZUFBZSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBS3ZFLE9BQU8sWUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sV0FBVyxNQUFNLGtCQUFrQixDQUFDO0FBQzNDLE9BQU8sZUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFDTCxHQUFHLElBQUksYUFBYSxFQUVwQixlQUFlLEdBQ2hCLE1BQU0sWUFBWSxDQUFDO0FBQ3BCLE9BQU8sbUJBQW1CLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxnQkFBZ0IsTUFBTSx1QkFBdUIsQ0FBQztBQUVyRCxPQUFPLGlCQUFpQixNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sZUFBZSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sa0JBQWtCLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyx5QkFBeUIsTUFBTSw2QkFBNkIsQ0FBQztBQUNwRSxPQUFPLGtCQUFrQixNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQTZCOUM7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsNEJBQTRCLENBQzFDLEtBQVksRUFDWixNQUFrQjtJQUVsQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzVCLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDNUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUMvQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDMUMsTUFBTSxDQUFD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
;// ./node_modules/olcs/lib/olcs/math.js
/**
 * Converts radians to to degrees.
 *
 * @param angleInRadians Angle in radians.
 * @return Angle in degrees.
 */
function toDegrees(angleInRadians) {
    return (angleInRadians * 180) / Math.PI;
}
/**
 * Converts degrees to radians.
 *
 * @param angleInDegrees Angle in degrees.
 * @return Angle in radians.
 */
function toRadians(angleInDegrees) {
    return (angleInDegrees * Math.PI) / 180;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGNzL21hdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFDLGNBQXNCO0lBQzlDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUMxQyxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFDLGNBQXNCO0lBQzlDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUMxQyxDQUFDIn0=
;// ./node_modules/olcs/lib/olcs/Camera.js




/**
 * @param input Input coordinate array.
 * @param opt_output Output array of coordinate values.
 * @param opt_dimension Dimension.
 * @return Input coordinate array (same array as input).
 */
function identityProjection(input, opt_output, opt_dimension) {
    const dim = opt_dimension || input.length;
    if (opt_output) {
        for (let i = 0; i < dim; ++i) {
            opt_output[i] = input[i];
        }
    }
    return input;
}
class Camera {
    scene_;
    cam_;
    map_;
    view_;
    viewListenKey_ = null;
    toLonLat_ = identityProjection;
    fromLonLat_ = identityProjection;
    /**
     * 0 -- topdown, PI/2 -- the horizon
     */
    tilt_ = 0;
    distance_ = 0;
    lastCameraViewMatrix_ = null;
    /**
     * This is used to discard change events on view caused by updateView method.
     */
    viewUpdateInProgress_ = false;
    /**
     * This object takes care of additional 3d-specific properties of the view and
     * ensures proper synchronization with the underlying raw Cesium.Camera object.
     * @param scene
     * @param map
     */
    constructor(scene, map) {
        this.scene_ = scene;
        this.cam_ = scene.camera;
        this.map_ = map;
        this.map_.on('change:view', (e) => {
            this.setView_(this.map_.getView());
        });
        this.setView_(this.map_.getView());
    }
    destroy() {
        (0,Observable/* unByKey */.e)(this.viewListenKey_);
        this.viewListenKey_ = null;
    }
    /**
     * @param {?ol.View} view New view to use.
     */
    setView_(view) {
        (0,Observable/* unByKey */.e)(this.viewListenKey_);
        this.viewListenKey_ = null;
        this.view_ = view;
        if (view) {
            const toLonLat = (0,ol_proj/* getTransform */.RG)(view.getProjection(), 'EPSG:4326');
            const fromLonLat = (0,ol_proj/* getTransform */.RG)('EPSG:4326', view.getProjection());
            console.assert(!!(toLonLat && fromLonLat));
            this.toLonLat_ = toLonLat;
            this.fromLonLat_ = fromLonLat;
            this.viewListenKey_ = view.on('propertychange', (e) => this.handleViewChangedEvent_());
            this.readFromView();
        }
        else {
            this.toLonLat_ = identityProjection;
            this.fromLonLat_ = identityProjection;
        }
    }
    handleViewChangedEvent_() {
        if (!this.viewUpdateInProgress_) {
            this.readFromView();
        }
    }
    /**
     * @deprecated
     * @param heading In radians.
     */
    setHeading(heading) {
        if (!this.view_) {
            return;
        }
        this.view_.setRotation(heading);
    }
    /**
     * @deprecated
     * @return Heading in radians.
     */
    getHeading() {
        if (!this.view_) {
            return undefined;
        }
        const rotation = this.view_.getRotation();
        return rotation || 0;
    }
    /**
     * @param tilt In radians.
     */
    setTilt(tilt) {
        this.tilt_ = tilt;
        this.updateCamera_();
    }
    /**
     * @return Tilt in radians.
     */
    getTilt() {
        return this.tilt_;
    }
    /**
     * @param distance In meters.
     */
    setDistance(distance) {
        this.distance_ = distance;
        this.updateCamera_();
        this.updateView();
    }
    /**
     * @return Distance in meters.
     */
    getDistance() {
        return this.distance_;
    }
    /**
     * @deprecated
     * Shortcut for ol.View.setCenter().
     * @param center Same projection as the ol.View.
     */
    setCenter(center) {
        if (!this.view_) {
            return;
        }
        this.view_.setCenter(center);
    }
    /**
     * @deprecated
     * Shortcut for ol.View.getCenter().
     * @return {ol.Coordinate|undefined} Same projection as the ol.View.
     * @api
     */
    getCenter() {
        if (!this.view_) {
            return undefined;
        }
        return this.view_.getCenter();
    }
    /**
     * Sets the position of the camera.
     * @param position Same projection as the ol.View.
     */
    setPosition(position) {
        if (!this.toLonLat_) {
            return;
        }
        const ll = this.toLonLat_(position);
        console.assert(!!ll);
        const carto = new Cesium.Cartographic(toRadians(ll[0]), toRadians(ll[1]), this.getAltitude());
        this.cam_.setView({
            destination: Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto),
        });
        this.updateView();
    }
    /**
     * Calculates position under the camera.
     * @return Coordinates in same projection as the ol.View.
     * @api
     */
    getPosition() {
        if (!this.fromLonLat_) {
            return undefined;
        }
        const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position);
        const pos = this.fromLonLat_([
            toDegrees(carto.longitude),
            toDegrees(carto.latitude),
        ]);
        console.assert(!!pos);
        return pos;
    }
    /**
     * @param altitude In meters.
     */
    setAltitude(altitude) {
        const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position);
        carto.height = altitude;
        this.cam_.position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
        this.updateView();
    }
    /**
     * @return Altitude in meters.
     */
    getAltitude() {
        const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position);
        return carto.height;
    }
    /**
     * Updates the state of the underlying Cesium.Camera
     * according to the current values of the properties.
     */
    updateCamera_() {
        if (!this.view_ || !this.toLonLat_) {
            return;
        }
        const center = this.view_.getCenter();
        if (!center) {
            return;
        }
        const ll = this.toLonLat_(center);
        console.assert(!!ll);
        const carto = new Cesium.Cartographic(toRadians(ll[0]), toRadians(ll[1]));
        if (this.scene_.globe) {
            const height = this.scene_.globe.getHeight(carto);
            carto.height = height || 0;
        }
        const destination = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
        const orientation = {
            pitch: this.tilt_ - Cesium.Math.PI_OVER_TWO,
            heading: -this.view_.getRotation(),
            roll: undefined,
        };
        this.cam_.setView({
            destination,
            orientation,
        });
        this.cam_.moveBackward(this.distance_);
        this.checkCameraChange(true);
    }
    /**
     * Calculates the values of the properties from the current ol.View state.
     */
    readFromView() {
        if (!this.view_ || !this.toLonLat_) {
            return;
        }
        const center = this.view_.getCenter();
        if (center === undefined || center === null) {
            return;
        }
        const ll = this.toLonLat_(center);
        console.assert(!!ll);
        const resolution = this.view_.getResolution();
        this.distance_ = this.calcDistanceForResolution(resolution || 0, toRadians(ll[1]));
        this.updateCamera_();
    }
    /**
     * Calculates the values of the properties from the current Cesium.Camera state.
     * Modifies the center, resolution and rotation properties of the view.
     */
    updateView() {
        if (!this.view_ || !this.fromLonLat_) {
            return;
        }
        this.viewUpdateInProgress_ = true;
        // target & distance
        const ellipsoid = Cesium.Ellipsoid.WGS84;
        const scene = this.scene_;
        const target = pickCenterPoint(scene);
        let bestTarget = target;
        if (!bestTarget) {
            //TODO: how to handle this properly ?
            const globe = scene.globe;
            const carto = this.cam_.positionCartographic.clone();
            const height = globe.getHeight(carto);
            carto.height = height || 0;
            bestTarget = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
        }
        this.distance_ = Cesium.Cartesian3.distance(bestTarget, this.cam_.position);
        const bestTargetCartographic = ellipsoid.cartesianToCartographic(bestTarget);
        this.view_.setCenter(this.fromLonLat_([
            toDegrees(bestTargetCartographic.longitude),
            toDegrees(bestTargetCartographic.latitude),
        ]));
        // resolution
        this.view_.setResolution(this.calcResolutionForDistance(this.distance_, bestTargetCartographic ? bestTargetCartographic.latitude : 0));
        /*
         * Since we are positioning the target, the values of heading and tilt
         * need to be calculated _at the target_.
         */
        if (target) {
            const pos = this.cam_.position;
            // normal to the ellipsoid at the target
            const targetNormal = new Cesium.Cartesian3();
            ellipsoid.geocentricSurfaceNormal(target, targetNormal);
            // vector from the target to the camera
            const targetToCamera = new Cesium.Cartesian3();
            Cesium.Cartesian3.subtract(pos, target, targetToCamera);
            Cesium.Cartesian3.normalize(targetToCamera, targetToCamera);
            // HEADING
            const up = this.cam_.up;
            const right = this.cam_.right;
            const normal = new Cesium.Cartesian3(-target.y, target.x, 0); // what is it?
            const heading = Cesium.Cartesian3.angleBetween(right, normal);
            const cross = Cesium.Cartesian3.cross(target, up, new Cesium.Cartesian3());
            const orientation = cross.z;
            this.view_.setRotation(orientation < 0 ? heading : -heading);
            // TILT
            const tiltAngle = Math.acos(Cesium.Cartesian3.dot(targetNormal, targetToCamera));
            this.tilt_ = isNaN(tiltAngle) ? 0 : tiltAngle;
        }
        else {
            // fallback when there is no target
            this.view_.setRotation(this.cam_.heading);
            this.tilt_ = -this.cam_.pitch + Math.PI / 2;
        }
        // delay resetting the guard flag to account for asynchronous event generation in ol maps
        setTimeout(() => (this.viewUpdateInProgress_ = false), 1000);
    }
    /**
     * Check if the underlying camera state has changed and ensure synchronization.
     * @param opt_dontSync Do not synchronize the view.
     */
    checkCameraChange(opt_dontSync) {
        const old = this.lastCameraViewMatrix_;
        const current = this.cam_.viewMatrix;
        if (!old || !Cesium.Matrix4.equalsEpsilon(old, current, 1e-7)) {
            this.lastCameraViewMatrix_ = current.clone();
            if (opt_dontSync !== true) {
                this.updateView();
            }
        }
    }
    /**
     * calculate the distance between camera and centerpoint based on the resolution and latitude value
     * @param resolution Number of map units per pixel.
     * @param latitude Latitude in radians.
     * @return The calculated distance.
     */
    calcDistanceForResolution(resolution, latitude) {
        return calcDistanceForResolution(resolution, latitude, this.scene_, this.view_.getProjection());
    }
    /**
     * calculate the resolution based on a distance(camera to position) and latitude value
     * @param distance
     * @param latitude
     * @return {number} The calculated resolution.
     */
    calcResolutionForDistance(distance, latitude) {
        return calcResolutionForDistance(distance, latitude, this.scene_, this.view_.getProjection());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FtZXJhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29sY3MvQ2FtZXJhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBQyxPQUFPLElBQUksbUJBQW1CLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3hDLE9BQU8sRUFDTCx5QkFBeUIsRUFDekIseUJBQXlCLEVBQ3pCLGVBQWUsR0FDaEIsTUFBTSxXQUFXLENBQUM7QUFDbkIsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFL0M7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQ2hDLEtBQWUsRUFDZixVQUFxQixFQUNyQixhQUFzQjtJQUV0QixNQUFNLEdBQUcsR0FBRyxhQUFhLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUMxQyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzdCLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNILENBQUM7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRCxNQUFNLENBQUMsT0FBTyxPQUFPLE1BQU07SUFDakIsTUFBTSxDQUFRO0lBQ2QsSUFBSSxDQUFlO0lBQ25CLElBQUksQ0FBTTtJQUNWLEtBQUssQ0FBTztJQUVaLGNBQWMsR0FBYyxJQUFJLENBQUM7SUFFakMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO0lBQy9CLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztJQUV6Qzs7T0FFRztJQUNLLEtBQUssR0FBVyxDQUFDLENBQUM7SUFDbEIsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNkLHFCQUFx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
// EXTERNAL MODULE: ./node_modules/ol/Overlay.js + 1 modules
var Overlay = __webpack_require__(45640);
;// ./node_modules/olcs/lib/olcs/SynchronizedOverlay.js



/**
 * @param node The node to remove.
 * @return The node that was removed or null.
 */
function removeNode(node) {
    return node && node.parentNode ? node.parentNode.removeChild(node) : null;
}
/**
 * @param {Node} node The node to remove the children from.
 */
function removeChildren(node) {
    while (node.lastChild) {
        node.removeChild(node.lastChild);
    }
}
function cloneNode(node, parent) {
    const clone = node.cloneNode();
    if (node.nodeName === 'CANVAS') {
        const ctx = clone.getContext('2d');
        ctx.drawImage(node, 0, 0);
    }
    if (parent) {
        parent.appendChild(clone);
    }
    if (node.nodeType !== Node.TEXT_NODE) {
        clone.addEventListener('click', (event) => {
            node.dispatchEvent(new MouseEvent('click', event));
            event.stopPropagation();
        });
    }
    const nodes = node.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i]) {
            continue;
        }
        cloneNode(nodes[i], clone);
    }
    return clone;
}
class SynchronizedOverlay extends Overlay/* default */.A {
    scenePostRenderListenerRemover_ = null;
    scene_;
    synchronizer_;
    parent_;
    positionWGS84_;
    observer_;
    attributeObserver_ = [];
    listenerKeys_;
    /**
     * @param options SynchronizedOverlay Options.
     * @api
     */
    constructor(options) {
        const parent = options.parent;
        super(parent.getOptions());
        this.scene_ = options.scene;
        this.synchronizer_ = options.synchronizer;
        this.parent_ = parent;
        this.positionWGS84_ = undefined;
        this.observer_ = new MutationObserver(this.handleElementChanged.bind(this));
        this.attributeObserver_ = [];
        this.listenerKeys_ = [];
        // synchronize our Overlay with the parent Overlay
        const setPropertyFromEvent = (event) => this.setPropertyFromEvent_(event);
        this.listenerKeys_.push(this.parent_.on('change:element', setPropertyFromEvent));
        this.listenerKeys_.push(this.parent_.on('change:offset', setPropertyFromEvent));
        this.listenerKeys_.push(this.parent_.on('change:position', setPropertyFromEvent));
        this.listenerKeys_.push(this.parent_.on('change:positioning', setPropertyFromEvent));
        this.setProperties(this.parent_.getProperties());
        this.handleMapChanged();
        this.handleElementChanged();
        this.handlePositionChanged();
    }
    /**
     * @param target
     */
    observeTarget_(target) {
        if (!this.observer_) {
            // not ready, skip the event (this occurs on construction)
            return;
        }
        this.observer_.disconnect();
        this.observer_.observe(target, {
            attributes: false,
            childList: true,
            characterData: true,
            subtree: true,
        });
        this.attributeObserver_.forEach((observer) => {
            observer.disconnect();
        });
        this.attributeObserver_.length = 0;
        for (let i = 0; i < target.childNodes.length; i++) {
            const node = target.childNodes[i];
            if (node.nodeType === 1) {
                const observer = new MutationObserver(this.handleElementChanged.bind(this));
                observer.observe(node, {
                    attributes: true,
                    subtree: true,
                });
                this.attributeObserver_.push(observer);
            }
        }
    }
    /**
     *
     * @param event
     */
    setPropertyFromEvent_(event) {
        if (event.target && event.key) {
            this.set(event.key, event.target.get(event.key));
        }
    }
    /**
     * Get the scene associated with this overlay.
     * @see ol.Overlay.prototype.getMap
     * @return The scene that the overlay is part of.
     * @api
     */
    getScene() {
        return this.scene_;
    }
    /**
     * @override
     */
    handleMapChanged() {
        if (this.scenePostRenderListenerRemover_) {
            this.scenePostRenderListenerRemover_();
            removeNode(this.element);
        }
        this.scenePostRenderListenerRemover_ = null;
        const scene = this.getScene();
        if (scene) {
            this.scenePostRenderListenerRemover_ = scene.postRender.addEventListener(this.updatePixelPosition.bind(this));
            this.updatePixelPosition();
            const container = this.stopEvent
                ? this.synchronizer_.getOverlayContainerStopEvent()
                : this.synchronizer_.getOverlayContainer();
            if (this.insertFirst) {
                container.insertBefore(this.element, container.childNodes[0] || null);
            }
            else {
                container.appendChild(this.element);
            }
        }
    }
    /**
     * @override
     */
    handlePositionChanged() {
        // check if constructor has completed
        if (!this.parent_) {
            return;
        }
        // transform position to WGS84
        const position = this.getPosition();
        if (position) {
            const sourceProjection = this.parent_.getMap().getView().getProjection();
            this.positionWGS84_ = (0,ol_proj/* transform */.pd)(position, sourceProjection, 'EPSG:4326');
        }
        else {
            this.positionWGS84_ = undefined;
        }
        this.updatePixelPosition();
    }
    /**
     * @override
     */
    handleElementChanged() {
        removeChildren(this.element);
        const element = this.getElement();
        if (element) {
            if (element.parentNode && element.parentNode.childNodes) {
                for (const node of Array.from(element.parentNode.childNodes)) {
                    const clonedNode = cloneNode(node, null);
                    this.element.appendChild(clonedNode);
                }
            }
        }
        if (element.parentNode) {
            // set new Observer
            this.observeTarget_(element.parentNode);
        }
    }
    /**
     * @override
     */
    updatePixelPosition() {
        const position = this.positionWGS84_;
        if (!this.scene_ || !position) {
            this.setVisible(false);
            return;
        }
        let height = 0;
        if (position.length === 2) {
            const globeHeight = this.scene_.globe.getHeight(Cesium.Cartographic.fromDegrees(position[0], position[1]));
            if (globeHeight && this.scene_.globe.tilesLoaded) {
                position[2] = globeHeight;
            }
            if (globeHeight) {
                height = globeHeight;
            }
        }
        else {
            height = position[2];
        }
        const cartesian = Cesium.Cartesian3.fromDegrees(position[0], position[1], height);
        const camera = this.scene_.camera;
        const ellipsoidBoundingSphere = new Cesium.BoundingSphere(new Cesium.Cartesian3(), 6356752);
        const occluder = new Cesium.Occluder(ellipsoidBoundingSphere, camera.position);
        // check if overlay position is behind the horizon
        if (!occluder.isPointVisible(cartesian)) {
            this.setVisible(false);
            return;
        }
        const cullingVolume = camera.frustum.computeCullingVolume(camera.position, camera.direction, camera.up);
        // check if overlay position is visible from the camera
        if (cullingVolume.computeVisibility(new Cesium.BoundingSphere(cartesian)) !==
            1) {
            this.setVisible(false);
            return;
        }
        this.setVisible(true);
        const pixelCartesian = this.scene_.cartesianToCanvasCoordinates(cartesian);
        const pixel = [pixelCartesian.x, pixelCartesian.y];
        const mapSize = [this.scene_.canvas.width, this.scene_.canvas.height];
        this.updateRenderedPosition(pixel, mapSize);
    }
    /**
     * Destroys the overlay, removing all its listeners and elements
     * @api
     */
    destroy() {
        if (this.scenePostRenderListenerRemover_) {
            this.scenePostRenderListenerRemover_();
        }
        if (this.observer_) {
            this.observer_.disconnect();
        }
        (0,Observable/* unByKey */.e)(this.listenerKeys_);
        this.listenerKeys_.splice(0);
        if ('removeNode' in this.element) {
            // @ts-ignore
            this.element.removeNode(true);
        }
        else {
            this.element.remove();
        }
        this.element = null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3luY2hyb25pemVkT3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGNzL1N5bmNocm9uaXplZE92ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFDLE9BQU8sSUFBSSxtQkFBbUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2hFLE9BQU8sU0FBUyxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBR3JDOzs7R0FHRztBQUNILFNBQVMsVUFBVSxDQUFDLElBQVU7SUFDNUIsT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUM1RSxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGNBQWMsQ0FBQyxJQUFVO0lBQ2hDLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQWlDLElBQU8sRUFBRSxNQUFTO0lBQ25FLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQU8sQ0FBQztJQUNwQyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDL0IsTUFBTSxHQUFHLEdBQUksS0FBc0MsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFvQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0QsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUNYLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIs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
;// ./node_modules/olcs/lib/olcs/OverlaySynchronizer.js



class OverlaySynchronizer {
    map;
    scene;
    overlayCollection_;
    overlayContainerStopEvent_;
    overlayContainer_;
    overlayMap_ = new Map();
    overlayEvents = [
        'click',
        'dblclick',
        'mousedown',
        'touchstart',
        'pointerdown',
        'mousewheel',
        'wheel',
    ];
    listenerKeys_ = [];
    /**
     * @param map
     * @param scene
     * @api
     */
    constructor(map, scene) {
        this.map = map;
        this.scene = scene;
        this.map = map;
        this.overlayCollection_ = this.map.getOverlays();
        this.scene = scene;
        this.overlayContainerStopEvent_ = document.createElement('div');
        this.overlayContainerStopEvent_.className = 'ol-overlaycontainer-stopevent';
        this.overlayEvents.forEach((name) => {
            this.overlayContainerStopEvent_.addEventListener(name, (evt) => evt.stopPropagation());
        });
        this.scene.canvas.parentElement.appendChild(this.overlayContainerStopEvent_);
        this.overlayContainer_ = document.createElement('div');
        this.overlayContainer_.className = 'ol-overlaycontainer';
        this.scene.canvas.parentElement.appendChild(this.overlayContainer_);
    }
    /**
     * Get the element that serves as a container for overlays that don't allow
     * event propagation. Elements added to this container won't let mousedown and
     * touchstart events through to the map, so clicks and gestures on an overlay
     * don't trigger any {@link ol.MapBrowserEvent}.
     * @return The map's overlay container that stops events.
     */
    getOverlayContainerStopEvent() {
        return this.overlayContainerStopEvent_;
    }
    /**
     * Get the element that serves as a container for overlays.
     * @return The map's overlay container.
     */
    getOverlayContainer() {
        return this.overlayContainer_;
    }
    /**
     * Destroy all and perform complete synchronization of the overlays.
     * @api
     */
    synchronize() {
        this.destroyAll();
        this.overlayCollection_.forEach((overlay) => {
            this.addOverlay(overlay);
        });
        this.listenerKeys_.push(this.overlayCollection_.on('add', (evt) => this.addOverlay(evt.element)));
        this.listenerKeys_.push(this.overlayCollection_.on('remove', (evt) => this.removeOverlay(evt.element)));
    }
    /**
     * @param overlay
     * @api
     */
    addOverlay(overlay) {
        if (!overlay) {
            return;
        }
        const cesiumOverlay = new SynchronizedOverlay({
            scene: this.scene,
            synchronizer: this,
            parent: overlay,
        });
        this.overlayMap_.set(getUid(overlay), cesiumOverlay);
    }
    /**
     * Removes an overlay from the scene
     * @param overlay
     * @api
     */
    removeOverlay(overlay) {
        const overlayId = getUid(overlay);
        const csOverlay = this.overlayMap_.get(overlayId);
        if (csOverlay) {
            csOverlay.destroy();
            this.overlayMap_.delete(overlayId);
        }
    }
    /**
     * Destroys all the created Cesium objects.
     */
    destroyAll() {
        this.overlayMap_.forEach((overlay) => {
            overlay.destroy();
        });
        this.overlayMap_.clear();
        (0,Observable/* unByKey */.e)(this.listenerKeys_);
        this.listenerKeys_.length = 0;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3ZlcmxheVN5bmNocm9uaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGNzL092ZXJsYXlTeW5jaHJvbml6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFDLE9BQU8sSUFBSSxtQkFBbUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRWhFLE9BQU8sbUJBQW1CLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVqQyxNQUFNLENBQUMsT0FBTyxPQUFPLG1CQUFtQjtJQXNCMUI7SUFDQTtJQXRCSixrQkFBa0IsQ0FBc0I7SUFDeEMsMEJBQTBCLENBQWlCO0lBQzNDLGlCQUFpQixDQUFpQjtJQUNsQyxXQUFXLEdBQXFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDMUQsYUFBYSxHQUFHO1FBQ3RCLE9BQU87UUFDUCxVQUFVO1FBQ1YsV0FBVztRQUNYLFlBQVk7UUFDWixhQUFhO1FBQ2IsWUFBWTtRQUNaLE9BQU87S0FDUixDQUFDO0lBQ00sYUFBYSxHQUFnQixFQUFFLENBQUM7SUFFeEM7Ozs7T0FJRztJQUNILFlBQ1ksR0FBVSxFQUNWLEtBQVk7UUFEWixRQUFHLEdBQUgsR0FBRyxDQUFPO1FBQ1YsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUV0QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQywwQkFBMEIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxTQUFTLEdBQUcsK0JBQStCLENBQUM7UUFDNUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMs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
// EXTERNAL MODULE: ./node_modules/ol/layer/Group.js
var Group = __webpack_require__(32247);
;// ./node_modules/olcs/lib/olcs/AbstractSynchronizer.js



class AbstractSynchronizer {
    map;
    view;
    scene;
    olLayers;
    mapLayerGroup;
    /**
     * Map of OpenLayers layer ids (from getUid) to the Cesium ImageryLayers.
     * Null value means, that we are unable to create equivalent layers.
     */
    layerMap = {};
    /**
     * Map of listen keys for OpenLayers layer layers ids (from getUid).
     */
    olLayerListenKeys = {};
    /**
     * Map of listen keys for OpenLayers layer groups ids (from getUid).
     */
    olGroupListenKeys_ = {};
    constructor(map, scene) {
        this.map = map;
        this.view = map.getView();
        this.scene = scene;
        this.olLayers = map.getLayerGroup().getLayers();
        this.mapLayerGroup = map.getLayerGroup();
    }
    /**
     * Destroy all and perform complete synchronization of the layers.
     */
    synchronize() {
        this.destroyAll();
        this.addLayers_(this.mapLayerGroup);
    }
    /**
     * Order counterparts using the same algorithm as the Openlayers renderer:
     * z-index then original sequence order.
     */
    orderLayers() {
        // Ordering logics is handled in subclasses.
    }
    /**
     * Add a layer hierarchy.
     * @param root
     */
    addLayers_(root) {
        const fifo = [
            {
                layer: root,
                parents: [],
            },
        ];
        while (fifo.length > 0) {
            const olLayerWithParents = fifo.splice(0, 1)[0];
            const olLayer = olLayerWithParents.layer;
            const olLayerId = getUid(olLayer).toString();
            this.olLayerListenKeys[olLayerId] = [];
            console.assert(!this.layerMap[olLayerId]);
            let cesiumObjects = null;
            if (olLayer instanceof Group/* default */.A) {
                this.listenForGroupChanges_(olLayer);
                if (olLayer !== this.mapLayerGroup) {
                    cesiumObjects =
                        this.createSingleLayerCounterparts(olLayerWithParents);
                }
                if (!cesiumObjects) {
                    olLayer.getLayers().forEach((l) => {
                        if (l) {
                            const newOlLayerWithParents = {
                                layer: l,
                                parents: olLayer === this.mapLayerGroup
                                    ? []
                                    : [olLayerWithParents.layer].concat(olLayerWithParents.parents),
                            };
                            fifo.push(newOlLayerWithParents);
                        }
                    });
                }
            }
            else {
                cesiumObjects = this.createSingleLayerCounterparts(olLayerWithParents);
                if (!cesiumObjects) {
                    // keep an eye on the layers that once failed to be added (might work when the layer is updated)
                    // for example when a source is set after the layer is added to the map
                    const layerId = olLayerId;
                    const layerWithParents = olLayerWithParents;
                    const onLayerChange = () => {
                        const cesiumObjs = this.createSingleLayerCounterparts(layerWithParents);
                        if (cesiumObjs) {
                            // unsubscribe event listener
                            layerWithParents.layer.un('change', onLayerChange);
                            this.addCesiumObjects_(cesiumObjs, layerId, layerWithParents.layer);
                            this.orderLayers();
                        }
                    };
                    this.olLayerListenKeys[olLayerId].push(layerWithParents.layer.on('change', onLayerChange));
                }
            }
            // add Cesium layers
            if (cesiumObjects) {
                this.addCesiumObjects_(cesiumObjects, olLayerId, olLayer);
            }
        }
        this.orderLayers();
    }
    /**
     * Add Cesium objects.
     * @param cesiumObjects
     * @param layerId
     * @param layer
     */
    addCesiumObjects_(cesiumObjects, layerId, layer) {
        this.layerMap[layerId] = cesiumObjects;
        this.olLayerListenKeys[layerId].push(layer.on('change:zIndex', () => this.orderLayers()));
        cesiumObjects.forEach((cesiumObject) => {
            this.addCesiumObject(cesiumObject);
        });
    }
    /**
     * Remove and destroy a single layer.
     * @param {ol.layer.Layer} layer
     * @return {boolean} counterpart destroyed
     */
    removeAndDestroySingleLayer_(layer) {
        const uid = getUid(layer).toString();
        const counterparts = this.layerMap[uid];
        if (counterparts) {
            counterparts.forEach((counterpart) => {
                this.removeSingleCesiumObject(counterpart, false);
                this.destroyCesiumObject(counterpart);
            });
            this.olLayerListenKeys[uid].forEach(Observable/* unByKey */.e);
            delete this.olLayerListenKeys[uid];
        }
        delete this.layerMap[uid];
        return !!counterparts;
    }
    /**
     * Unlisten a single layer group.
     * @param group
     */
    unlistenSingleGroup_(group) {
        if (group === this.mapLayerGroup) {
            return;
        }
        const uid = getUid(group).toString();
        const keys = this.olGroupListenKeys_[uid];
        keys.forEach((key) => {
            (0,Observable/* unByKey */.e)(key);
        });
        delete this.olGroupListenKeys_[uid];
        delete this.layerMap[uid];
    }
    /**
     * Remove layer hierarchy.
     * @param root
     */
    removeLayer_(root) {
        if (root) {
            const fifo = [root];
            while (fifo.length > 0) {
                const olLayer = fifo.splice(0, 1)[0];
                const done = this.removeAndDestroySingleLayer_(olLayer);
                if (olLayer instanceof Group/* default */.A) {
                    this.unlistenSingleGroup_(olLayer);
                    if (!done) {
                        // No counterpart for the group itself so removing
                        // each of the child layers.
                        olLayer.getLayers().forEach((l) => {
                            fifo.push(l);
                        });
                    }
                }
            }
        }
    }
    /**
     * Register listeners for single layer group change.
     * @param group
     */
    listenForGroupChanges_(group) {
        const uuid = getUid(group).toString();
        console.assert(this.olGroupListenKeys_[uuid] === undefined);
        const listenKeyArray = [];
        this.olGroupListenKeys_[uuid] = listenKeyArray;
        // only the keys that need to be relistened when collection changes
        let contentKeys = [];
        const listenAddRemove = function () {
            const collection = group.getLayers();
            if (collection) {
                contentKeys = [
                    collection.on('add', (event) => {
                        this.addLayers_(event.element);
                    }),
                    collection.on('remove', (event) => {
                        this.removeLayer_(event.element);
                    }),
                ];
                listenKeyArray.push(...contentKeys);
            }
        }.bind(this);
        listenAddRemove();
        listenKeyArray.push(group.on('change:layers', (e) => {
            contentKeys.forEach((el) => {
                const i = listenKeyArray.indexOf(el);
                if (i >= 0) {
                    listenKeyArray.splice(i, 1);
                }
                (0,Observable/* unByKey */.e)(el);
            });
            listenAddRemove();
        }));
    }
    /**
     * Destroys all the created Cesium objects.
     */
    destroyAll() {
        this.removeAllCesiumObjects(true); // destroy
        let objKey;
        for (objKey in this.olGroupListenKeys_) {
            const keys = this.olGroupListenKeys_[objKey];
            keys.forEach(Observable/* unByKey */.e);
        }
        for (objKey in this.olLayerListenKeys) {
            this.olLayerListenKeys[objKey].forEach(Observable/* unByKey */.e);
        }
        this.olGroupListenKeys_ = {};
        this.olLayerListenKeys = {};
        this.layerMap = {};
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWJzdHJhY3RTeW5jaHJvbml6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvb2xjcy9BYnN0cmFjdFN5bmNocm9uaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUMsT0FBTyxJQUFJLG1CQUFtQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFJaEUsT0FBTyxVQUFVLE1BQU0sbUJBQW1CLENBQUM7QUFHM0MsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVqQyxNQUFNLENBQUMsT0FBTyxPQUFnQixvQkFBb0I7SUFHdEMsR0FBRyxDQUFNO0lBQ1QsSUFBSSxDQUFPO0lBQ1gsS0FBSyxDQUFRO0lBQ2IsUUFBUSxDQUF3QjtJQUMxQyxhQUFhLENBQWE7SUFDMUI7OztPQUdHO0lBQ08sUUFBUSxHQUE2QixFQUFFLENBQUM7SUFDbEQ7O09BRUc7SUFDTyxpQkFBaUIsR0FBcUMsRUFBRSxDQUFDO0lBQ25FOztPQUVHO0lBQ0ssa0JBQWtCLEdBQXFDLEVBQUUsQ0FBQztJQUVsRSxZQUFzQixHQUFRLEVBQUUsS0FBWTtRQUMxQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hELElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOzs7T0FHRztJ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
;// ./node_modules/olcs/lib/olcs/RasterSynchronizer.js





class RasterSynchronizer extends AbstractSynchronizer {
    cesiumLayers_;
    ourLayers_;
    /**
     * This object takes care of one-directional synchronization of
     * Openlayers raster layers to the given Cesium globe.
     * @param map
     * @param scene
     */
    constructor(map, scene) {
        super(map, scene);
        this.cesiumLayers_ = scene.imageryLayers;
        this.ourLayers_ = new Cesium.ImageryLayerCollection();
    }
    addCesiumObject(object) {
        this.cesiumLayers_.add(object);
        this.ourLayers_.add(object);
    }
    destroyCesiumObject(object) {
        object.destroy();
    }
    removeSingleCesiumObject(object, destroy) {
        this.cesiumLayers_.remove(object, destroy);
        this.ourLayers_.remove(object, false);
    }
    removeAllCesiumObjects(destroy) {
        for (let i = 0; i < this.ourLayers_.length; ++i) {
            this.cesiumLayers_.remove(this.ourLayers_.get(i), destroy);
        }
        this.ourLayers_.removeAll(false);
    }
    /**
     * Creates an array of Cesium.ImageryLayer.
     * May be overriden by child classes to implement custom behavior.
     * The default implementation handles tiled imageries in EPSG:4326 or
     * EPSG:3859.
     * @param olLayer
     * @param viewProj
     */
    convertLayerToCesiumImageries(olLayer, viewProj) {
        const result = tileLayerToImageryLayer(this.map, olLayer, viewProj);
        return result ? [result] : null;
    }
    createSingleLayerCounterparts(olLayerWithParents) {
        const olLayer = olLayerWithParents.layer;
        const uid = getUid(olLayer).toString();
        const viewProj = this.view.getProjection();
        console.assert(!!viewProj);
        const cesiumObjects = this.convertLayerToCesiumImageries(olLayer, viewProj);
        if (cesiumObjects) {
            const listenKeyArray = [];
            [olLayerWithParents.layer]
                .concat(olLayerWithParents.parents)
                .forEach((olLayerItem) => {
                listenKeyArray.push(olLayerItem.on(['change:opacity', 'change:visible'], () => {
                    // the compiler does not seem to be able to infer this
                    console.assert(!!cesiumObjects);
                    for (let i = 0; i < cesiumObjects.length; ++i) {
                        updateCesiumLayerProperties(olLayerWithParents, cesiumObjects[i]);
                    }
                }));
            });
            if (olLayer instanceof Vector/* default */.A) {
                let previousStyleFunction = olLayer.getStyleFunction();
                // there is no convenient way to detect a style function change in OL
                listenKeyArray.push(olLayer.on('change', () => {
                    const currentStyleFunction = olLayer.getStyleFunction();
                    if (previousStyleFunction === currentStyleFunction) {
                        return;
                    }
                    previousStyleFunction = currentStyleFunction;
                    for (let i = 0; i < cesiumObjects.length; ++i) {
                        const csObj = cesiumObjects[i];
                        // clear cache and set new style
                        // @ts-ignore TS2341
                        if (csObj._imageryCache) {
                            // @ts-ignore TS2341
                            csObj._imageryCache = {};
                        }
                        const ip = csObj.imageryProvider;
                        if (ip) {
                            // @ts-ignore TS2341
                            ip.tileCache?.clear();
                            // @ts-ignore TS2341
                            ip.styleFunction_ = currentStyleFunction;
                        }
                    }
                    this.scene.requestRender();
                }));
            }
            for (let i = 0; i < cesiumObjects.length; ++i) {
                updateCesiumLayerProperties(olLayerWithParents, cesiumObjects[i]);
            }
            // there is no way to modify Cesium layer extent,
            // we have to recreate when OpenLayers layer extent changes:
            listenKeyArray.push(olLayer.on('change:extent', (e) => {
                for (let i = 0; i < cesiumObjects.length; ++i) {
                    this.cesiumLayers_.remove(cesiumObjects[i], true); // destroy
                    this.ourLayers_.remove(cesiumObjects[i], false);
                }
                delete this.layerMap[getUid(olLayer)]; // invalidate the map entry
                this.synchronize();
            }));
            listenKeyArray.push(olLayer.on('change', (e) => {
                // when the source changes, re-add the layer to force update
                for (let i = 0; i < cesiumObjects.length; ++i) {
                    const position = this.cesiumLayers_.indexOf(cesiumObjects[i]);
                    if (position >= 0) {
                        this.cesiumLayers_.remove(cesiumObjects[i], false);
                        this.cesiumLayers_.add(cesiumObjects[i], position);
                    }
                }
            }));
            this.olLayerListenKeys[uid].push(...listenKeyArray);
        }
        return Array.isArray(cesiumObjects) ? cesiumObjects : null;
    }
    /**
     * Order counterparts using the same algorithm as the Openlayers renderer:
     * z-index then original sequence order.
     */
    orderLayers() {
        const layers = [];
        const zIndices = {};
        const queue = [this.mapLayerGroup];
        while (queue.length > 0) {
            const olLayer = queue.splice(0, 1)[0];
            layers.push(olLayer);
            zIndices[getUid(olLayer)] = olLayer.getZIndex() || 0;
            if (olLayer instanceof Group/* default */.A) {
                const sublayers = olLayer.getLayers();
                if (sublayers) {
                    // Prepend queue with sublayers in order
                    queue.unshift(...sublayers.getArray());
                }
            }
        }
        // We assume sort is stable (which has been in the spec since a long time already).
        // See https://caniuse.com/mdn-javascript_builtins_array_sort_stable
        layers.sort((layer1, layer2) => zIndices[getUid(layer1)] - zIndices[getUid(layer2)]);
        layers.forEach((olLayer) => {
            const olLayerId = getUid(olLayer).toString();
            const cesiumObjects = this.layerMap[olLayerId];
            if (cesiumObjects) {
                cesiumObjects.forEach((cesiumObject) => {
                    this.raiseToTop(cesiumObject);
                });
            }
        });
    }
    raiseToTop(counterpart) {
        this.cesiumLayers_.raiseToTop(counterpart);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFzdGVyU3luY2hyb25pemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29sY3MvUmFzdGVyU3luY2hyb25pemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sZUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sVUFBVSxNQUFNLG1CQUFtQixDQUFDO0FBRzNDLE9BQU8sd0JBQXdCLE1BQU0sMkJBQTJCLENBQUM7QUFDakUsT0FBTyxFQUVMLHVCQUF1QixFQUN2QiwyQkFBMkIsR0FDNUIsTUFBTSxXQUFXLENBQUM7QUFDbkIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVqQyxNQUFNLENBQUMsT0FBTyxPQUFPLGtCQUFtQixTQUFRLHdCQUFzQztJQUM1RSxhQUFhLENBQXlCO0lBQ3RDLFVBQVUsQ0FBeUI7SUFDM0M7Ozs7O09BS0c7SUFDSCxZQUFZLEdBQVEsRUFBRSxLQUFZO1FBQ2hDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUN4RCxDQUFDO0lBRUQsZUFBZSxDQUFDLE1BQW9CO1FBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxNQUFvQjtRQUN0QyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELHdCQUF3QixDQUFDLE1BQW9CLEVBQUUsT0FBZ0I7UUFDN0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFD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
// EXTERNAL MODULE: ./node_modules/ol/Feature.js
var ol_Feature = __webpack_require__(22772);
// EXTERNAL MODULE: ./node_modules/ol/coordinate.js
var coordinate = __webpack_require__(53094);
// EXTERNAL MODULE: ./node_modules/ol/source/Vector.js + 1 modules
var source_Vector = __webpack_require__(41913);
;// ./node_modules/ol/source/Cluster.js
/**
 * @module ol/source/Cluster
 */












/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {number} [distance=20] Minimum distance in pixels between clusters.
 * @property {function(Feature):Point} [geometryFunction]
 * Function that takes an {@link module:ol/Feature} as argument and returns an
 * {@link module:ol/geom/Point} as cluster calculation point for the feature. When a
 * feature should not be considered for clustering, the function should return
 * `null`. The default, which works when the underyling source contains point
 * features only, is
 * ```js
 * function(feature) {
 *   return feature.getGeometry();
 * }
 * ```
 * See {@link module:ol/geom/Polygon~Polygon#getInteriorPoint} for a way to get a cluster
 * calculation point for polygons.
 * @property {VectorSource} source Source.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 */


/**
 * @classdesc
 * Layer source to cluster vector data. Works out of the box with point
 * geometries. For other geometry types, or if not all geometries should be
 * considered for clustering, a custom `geometryFunction` can be defined.
 * @api
 */
var Cluster = /*@__PURE__*/(function (VectorSource) {
  function Cluster(options) {
    VectorSource.call(this, {
      attributions: options.attributions,
      wrapX: options.wrapX
    });

    /**
     * @type {number|undefined}
     * @protected
     */
    this.resolution = undefined;

    /**
     * @type {number}
     * @protected
     */
    this.distance = options.distance !== undefined ? options.distance : 20;

    /**
     * @type {Array<Feature>}
     * @protected
     */
    this.features = [];

    /**
     * @param {Feature} feature Feature.
     * @return {Point} Cluster calculation point.
     * @protected
     */
    this.geometryFunction = options.geometryFunction || function(feature) {
      var geometry = /** @type {Point} */ (feature.getGeometry());
      (0,asserts/* assert */.v)(geometry.getType() == GeometryType/* default */.A.POINT,
        10); // The default `geometryFunction` can only handle `Point` geometries
      return geometry;
    };

    /**
     * @type {VectorSource}
     * @protected
     */
    this.source = options.source;

    (0,events/* listen */.KT)(this.source, EventType/* default */.A.CHANGE, this.refresh, this);
  }

  if ( VectorSource ) Cluster.__proto__ = VectorSource;
  Cluster.prototype = Object.create( VectorSource && VectorSource.prototype );
  Cluster.prototype.constructor = Cluster;

  /**
   * Get the distance in pixels between clusters.
   * @return {number} Distance.
   * @api
   */
  Cluster.prototype.getDistance = function getDistance () {
    return this.distance;
  };

  /**
   * Get a reference to the wrapped source.
   * @return {VectorSource} Source.
   * @api
   */
  Cluster.prototype.getSource = function getSource () {
    return this.source;
  };

  /**
   * @inheritDoc
   */
  Cluster.prototype.loadFeatures = function loadFeatures (extent, resolution, projection) {
    this.source.loadFeatures(extent, resolution, projection);
    if (resolution !== this.resolution) {
      this.clear();
      this.resolution = resolution;
      this.cluster();
      this.addFeatures(this.features);
    }
  };

  /**
   * Set the distance in pixels between clusters.
   * @param {number} distance The distance in pixels.
   * @api
   */
  Cluster.prototype.setDistance = function setDistance (distance) {
    this.distance = distance;
    this.refresh();
  };

  /**
   * handle the source changing
   * @override
   */
  Cluster.prototype.refresh = function refresh () {
    this.clear();
    this.cluster();
    this.addFeatures(this.features);
    VectorSource.prototype.refresh.call(this);
  };

  /**
   * @protected
   */
  Cluster.prototype.cluster = function cluster () {
    if (this.resolution === undefined) {
      return;
    }
    this.features.length = 0;
    var extent = (0,ol_extent/* createEmpty */.S5)();
    var mapDistance = this.distance * this.resolution;
    var features = this.source.getFeatures();

    /**
     * @type {!Object<string, boolean>}
     */
    var clustered = {};

    for (var i = 0, ii = features.length; i < ii; i++) {
      var feature = features[i];
      if (!((0,util/* getUid */.v6)(feature) in clustered)) {
        var geometry = this.geometryFunction(feature);
        if (geometry) {
          var coordinates = geometry.getCoordinates();
          (0,ol_extent/* createOrUpdateFromCoordinate */.dP)(coordinates, extent);
          (0,ol_extent/* buffer */.r)(extent, mapDistance, extent);

          var neighbors = this.source.getFeaturesInExtent(extent);
          neighbors = neighbors.filter(function(neighbor) {
            var uid = (0,util/* getUid */.v6)(neighbor);
            if (!(uid in clustered)) {
              clustered[uid] = true;
              return true;
            } else {
              return false;
            }
          });
          this.features.push(this.createCluster(neighbors));
        }
      }
    }
  };

  /**
   * @param {Array<Feature>} features Features
   * @return {Feature} The cluster feature.
   * @protected
   */
  Cluster.prototype.createCluster = function createCluster (features) {
    var centroid = [0, 0];
    for (var i = features.length - 1; i >= 0; --i) {
      var geometry = this.geometryFunction(features[i]);
      if (geometry) {
        (0,coordinate/* add */.WQ)(centroid, geometry.getCoordinates());
      } else {
        features.splice(i, 1);
      }
    }
    (0,coordinate/* scale */.hs)(centroid, 1 / features.length);

    var cluster = new ol_Feature/* default */.A(new Point/* default */.A(centroid));
    cluster.set('features', features);
    return cluster;
  };

  return Cluster;
}(source_Vector/* default */.A));


/* harmony default export */ var source_Cluster = (Cluster);

//# sourceMappingURL=Cluster.js.map
// EXTERNAL MODULE: ./node_modules/ol/geom/Geometry.js
var Geometry = __webpack_require__(71147);
// EXTERNAL MODULE: ./node_modules/ol/geom/SimpleGeometry.js
var SimpleGeometry = __webpack_require__(57029);
// EXTERNAL MODULE: ./node_modules/ol/style/Icon.js + 3 modules
var Icon = __webpack_require__(47133);
;// ./node_modules/olcs/lib/olcs/core/VectorLayerCounterpart.js

class VectorLayerCounterpart {
    olListenKeys = [];
    context;
    rootCollection_;
    /**
     * Result of the conversion of an OpenLayers layer to Cesium.
     * @param layerProjection
     * @param scene
     */
    constructor(layerProjection, scene) {
        const billboards = new Cesium.BillboardCollection({ scene });
        const primitives = new Cesium.PrimitiveCollection();
        this.rootCollection_ = new Cesium.PrimitiveCollection();
        this.context = {
            projection: layerProjection,
            billboards,
            featureToCesiumMap: {},
            primitives,
        };
        this.rootCollection_.add(billboards);
        this.rootCollection_.add(primitives);
    }
    /**
     * Unlisten.
     */
    destroy() {
        this.olListenKeys.forEach(Observable/* unByKey */.e);
        this.olListenKeys.length = 0;
    }
    getRootPrimitive() {
        return this.rootCollection_;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVjdG9yTGF5ZXJDb3VudGVycGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vbGNzL2NvcmUvVmVjdG9yTGF5ZXJDb3VudGVycGFydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQUMsT0FBTyxJQUFJLG1CQUFtQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFhaEUsTUFBTSxDQUFDLE9BQU8sT0FBTyxzQkFBc0I7SUFDekMsWUFBWSxHQUFnQixFQUFFLENBQUM7SUFDL0IsT0FBTyxDQUEyQjtJQUMxQixlQUFlLENBQXNCO0lBQzdDOzs7O09BSUc7SUFDSCxZQUFZLGVBQW9DLEVBQUUsS0FBWTtRQUM1RCxNQUFNLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDM0QsTUFBTSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDeEQsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLFVBQVUsRUFBRSxlQUFlO1lBQzNCLFVBQVU7WUFDVixrQkFBa0IsRUFBRSxFQUFFO1lBQ3RCLFVBQVU7U0FDWCxDQUFDO1FBRUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsT0FBTztRQUNMLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQztDQUNGIn0=
;// ./node_modules/olcs/lib/olcs/FeatureConverter.js












class FeatureConverter {
    scene;
    /**
     * Bind once to have a unique function for using as a listener
     */
    boundOnRemoveOrClearFeatureListener_ = this.onRemoveOrClearFeature_.bind(this);
    defaultBillboardEyeOffset_ = new Cesium.Cartesian3(0, 0, 10);
    /**
     * Concrete base class for converting from OpenLayers3 vectors to Cesium
     * primitives.
     * Extending this class is possible provided that the extending class and
     * the library are compiled together by the closure compiler.
     * @param scene Cesium scene.
     * @api
     */
    constructor(scene) {
        this.scene = scene;
        this.scene = scene;
    }
    /**
     * @param evt
     */
    onRemoveOrClearFeature_(evt) {
        const source = evt.target;
        console.assert(source instanceof source_Vector/* default */.A);
        const cancellers = source['olcs_cancellers'];
        if (cancellers) {
            const feature = evt.feature;
            if (feature) {
                // remove
                const id = getUid(feature);
                const canceller = cancellers[id];
                if (canceller) {
                    canceller();
                    delete cancellers[id];
                }
            }
            else {
                // clear
                for (const key in cancellers) {
                    if (cancellers.hasOwnProperty(key)) {
                        cancellers[key]();
                    }
                }
                source['olcs_cancellers'] = {};
            }
        }
    }
    /**
     * @param layer
     * @param feature OpenLayers feature.
     * @param primitive
     */
    setReferenceForPicking(layer, feature, primitive) {
        primitive.olLayer = layer;
        primitive.olFeature = feature;
    }
    /**
     * Basics primitive creation using a color attribute.
     * Note that Cesium has 'interior' and outline geometries.
     * @param layer
     * @param feature OpenLayers feature.
     * @param olGeometry OpenLayers geometry.
     * @param geometry
     * @param color
     * @param opt_lineWidth
     * @return primitive
     */
    createColoredPrimitive(layer, feature, olGeometry, geometry, color, opt_lineWidth) {
        const createInstance = function (geometry, color) {
            const instance = new Cesium.GeometryInstance({
                geometry,
            });
            if (color && !(color instanceof Cesium.ImageMaterialProperty)) {
                instance.attributes = {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
                };
            }
            return instance;
        };
        const options = {
            flat: true, // work with all geometries
            renderState: {
                depthTest: {
                    enabled: true,
                },
            },
        };
        if (opt_lineWidth !== undefined) {
            options.renderState.lineWidth = opt_lineWidth;
        }
        const instances = createInstance(geometry, color);
        const heightReference = this.getHeightReference(layer, feature, olGeometry);
        let primitive;
        if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
            if (!('createShadowVolume' in instances.geometry.constructor)) {
                // This is not a ground geometry
                return null;
            }
            primitive = new Cesium.GroundPrimitive({
                geometryInstances: instances,
            });
        }
        else {
            primitive = new Cesium.Primitive({
                geometryInstances: instances,
            });
        }
        if (color instanceof Cesium.ImageMaterialProperty) {
            // FIXME: we created stylings which are not time related
            // What should we pass here?
            // @ts-ignore
            const dataUri = color.image.getValue().toDataURL();
            primitive.appearance = new Cesium.MaterialAppearance({
                flat: true,
                renderState: {
                    depthTest: {
                        enabled: true,
                    },
                },
                material: new Cesium.Material({
                    fabric: {
                        type: 'Image',
                        uniforms: {
                            image: dataUri,
                        },
                    },
                }),
            });
        }
        else {
            primitive.appearance = new Cesium.MaterialAppearance({
                ...options,
                material: new Cesium.Material({
                    translucent: color.alpha !== 1,
                    fabric: {
                        type: 'Color',
                        uniforms: {
                            color,
                        },
                    },
                }),
            });
            if (primitive instanceof Cesium.Primitive &&
                (feature.get('olcs_shadows') || layer.get('olcs_shadows'))) {
                primitive.shadows = 1;
            }
        }
        this.setReferenceForPicking(layer, feature, primitive);
        return primitive;
    }
    /**
     * Return the fill or stroke color from a plain ol style.
     * @param style
     * @param outline
     */
    extractColorFromOlStyle(style, outline) {
        const fillColor = style.getFill()?.getColor();
        const strokeColor = style.getStroke() ? style.getStroke().getColor() : null;
        let olColor = 'black';
        if (strokeColor && outline) {
            olColor = strokeColor;
        }
        else if (fillColor) {
            olColor = fillColor;
        }
        return convertColorToCesium(olColor);
    }
    /**
     * Return the width of stroke from a plain ol style.
     * @param style
     * @return {number}
     */
    extractLineWidthFromOlStyle(style) {
        // Handling of line width WebGL limitations is handled by Cesium.
        const width = style.getStroke() ? style.getStroke().getWidth() : undefined;
        return width !== undefined ? width : 1;
    }
    /**
     * Create a primitive collection out of two Cesium geometries.
     * Only the OpenLayers style colors will be used.
     * @param layer
     * @param feature
     * @param olGeometry
     * @param fillGeometry
     * @param outlineGeometry
     * @param olStyle
     */
    wrapFillAndOutlineGeometries(layer, feature, olGeometry, fillGeometry, outlineGeometry, olStyle) {
        const fillColor = this.extractColorFromOlStyle(olStyle, false);
        const outlineColor = this.extractColorFromOlStyle(olStyle, true);
        const primitives = new Cesium.PrimitiveCollection();
        if (olStyle.getFill()) {
            const p1 = this.createColoredPrimitive(layer, feature, olGeometry, fillGeometry, fillColor);
            console.assert(!!p1);
            primitives.add(p1);
        }
        if (olStyle.getStroke() && outlineGeometry) {
            const width = this.extractLineWidthFromOlStyle(olStyle);
            const p2 = this.createColoredPrimitive(layer, feature, olGeometry, outlineGeometry, outlineColor, width);
            if (p2) {
                // Some outline geometries are not supported by Cesium in clamp to ground
                // mode. These primitives are skipped.
                primitives.add(p2);
            }
        }
        return primitives;
    }
    // Geometry converters
    // FIXME: would make more sense to only accept primitive collection.
    /**
     * Create a Cesium primitive if style has a text component.
     * Eventually return a PrimitiveCollection including current primitive.
     * @param layer
     * @param feature
     * @param geometry
     * @param style
     * @param primitive
     */
    addTextStyle(layer, feature, geometry, style, primitive) {
        let primitives;
        if (!(primitive instanceof Cesium.PrimitiveCollection)) {
            primitives = new Cesium.PrimitiveCollection();
            primitives.add(primitive);
        }
        else {
            primitives = primitive;
        }
        if (!style.getText()) {
            return primitives;
        }
        const text = /** @type {!ol.style.Text} */ style.getText();
        const label = this.olGeometry4326TextPartToCesium(layer, feature, geometry, text);
        if (label) {
            primitives.add(label);
        }
        return primitives;
    }
    /**
     * Add a billboard to a Cesium.BillboardCollection.
     * Overriding this wrapper allows manipulating the billboard options.
     * @param billboards
     * @param bbOptions
     * @param layer
     * @param feature OpenLayers feature.
     * @param geometry
     * @param style
     * @return newly created billboard
     * @api
     */
    csAddBillboard(billboards, bbOptions, layer, feature, geometry, style) {
        if (!bbOptions.eyeOffset) {
            bbOptions.eyeOffset = this.defaultBillboardEyeOffset_;
        }
        const bb = billboards.add(bbOptions);
        this.setReferenceForPicking(layer, feature, bb);
        return bb;
    }
    /**
     * Convert an OpenLayers circle geometry to Cesium.
     * @param layer
     * @param feature
     * @param olGeometry
     * @param projection
     * @param olStyle
     * @api
     */
    olCircleGeometryToCesium(layer, feature, olGeometry, projection, olStyle) {
        olGeometry = olGeometryCloneTo4326(olGeometry, projection);
        console.assert(olGeometry.getType() == 'Circle');
        // ol.Coordinate
        const olCenter = olGeometry.getCenter();
        const height = olCenter.length == 3 ? olCenter[2] : 0.0;
        const olPoint = olCenter.slice();
        olPoint[0] += olGeometry.getRadius();
        // Cesium
        const center = ol4326CoordinateToCesiumCartesian(olCenter);
        const point = ol4326CoordinateToCesiumCartesian(olPoint);
        // Accurate computation of straight distance
        const radius = Cesium.Cartesian3.distance(center, point);
        const fillGeometry = new Cesium.CircleGeometry({
            center,
            radius,
            height,
        });
        let outlinePrimitive;
        let outlineGeometry;
        if (this.getHeightReference(layer, feature, olGeometry) ===
            Cesium.HeightReference.CLAMP_TO_GROUND) {
            const width = this.extractLineWidthFromOlStyle(olStyle);
            if (width) {
                const circlePolygon = (0,Polygon/* circular */.kj)(olGeometry.getCenter(), radius);
                const positions = ol4326CoordinateArrayToCsCartesians(circlePolygon.getLinearRing(0).getCoordinates());
                outlinePrimitive = new Cesium.GroundPolylinePrimitive({
                    geometryInstances: new Cesium.GeometryInstance({
                        geometry: new Cesium.GroundPolylineGeometry({ positions, width }),
                    }),
                    appearance: new Cesium.PolylineMaterialAppearance({
                        material: this.olStyleToCesium(feature, olStyle, true),
                    }),
                    classificationType: Cesium.ClassificationType.TERRAIN,
                });
                const op = outlinePrimitive;
                waitReady(outlinePrimitive).then(() => {
                    this.setReferenceForPicking(layer, feature, op._primitive);
                });
            }
        }
        else {
            outlineGeometry = new Cesium.CircleOutlineGeometry({
                center,
                radius,
                extrudedHeight: height,
                height,
            });
        }
        const primitives = this.wrapFillAndOutlineGeometries(layer, feature, olGeometry, fillGeometry, outlineGeometry, olStyle);
        if (outlinePrimitive) {
            primitives.add(outlinePrimitive);
        }
        return this.addTextStyle(layer, feature, olGeometry, olStyle, primitives);
    }
    /**
     * Convert an OpenLayers line string geometry to Cesium.
     * @param layer
     * @param feature
     * @param olGeometry
     * @param projection
     * @param olStyle
     * @api
     */
    olLineStringGeometryToCesium(layer, feature, olGeometry, projection, olStyle) {
        olGeometry = olGeometryCloneTo4326(olGeometry, projection);
        console.assert(olGeometry.getType() == 'LineString');
        const positions = ol4326CoordinateArrayToCsCartesians(olGeometry.getCoordinates());
        const width = this.extractLineWidthFromOlStyle(olStyle);
        let outlinePrimitive;
        const heightReference = this.getHeightReference(layer, feature, olGeometry);
        const appearance = new Cesium.PolylineMaterialAppearance({
            material: this.olStyleToCesium(feature, olStyle, true),
        });
        if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
            const geometry = new Cesium.GroundPolylineGeometry({
                positions,
                width,
            });
            outlinePrimitive = new Cesium.GroundPolylinePrimitive({
                appearance,
                geometryInstances: new Cesium.GeometryInstance({
                    geometry,
                }),
            });
            const op = outlinePrimitive;
            waitReady(outlinePrimitive).then(() => {
                this.setReferenceForPicking(layer, feature, op._primitive);
            });
        }
        else {
            const geometry = new Cesium.PolylineGeometry({
                positions,
                width,
                vertexFormat: appearance.vertexFormat,
            });
            outlinePrimitive = new Cesium.Primitive({
                appearance,
                geometryInstances: new Cesium.GeometryInstance({
                    geometry,
                }),
            });
        }
        this.setReferenceForPicking(layer, feature, outlinePrimitive);
        return this.addTextStyle(layer, feature, olGeometry, olStyle, outlinePrimitive);
    }
    /**
     * Convert an OpenLayers polygon geometry to Cesium.
     * @param layer
     * @param feature
     * @param olGeometry
     * @param projection
     * @param olStyle
     * @api
     */
    olPolygonGeometryToCesium(layer, feature, olGeometry, projection, olStyle) {
        olGeometry = olGeometryCloneTo4326(olGeometry, projection);
        console.assert(olGeometry.getType() == 'Polygon');
        const heightReference = this.getHeightReference(layer, feature, olGeometry);
        let fillGeometry, outlineGeometry;
        let outlinePrimitive;
        if (olGeometry.getCoordinates()[0].length == 5 &&
            feature.get('olcs_polygon_kind') === 'rectangle') {
            // Create a rectangle according to the longitude and latitude curves
            const coordinates = olGeometry.getCoordinates()[0];
            // Extract the West, South, East, North coordinates
            const extent = (0,ol_extent/* boundingExtent */.Tr)(coordinates);
            const rectangle = Cesium.Rectangle.fromDegrees(extent[0], extent[1], extent[2], extent[3]);
            // Extract the average height of the vertices
            let maxHeight = 0.0;
            if (coordinates[0].length == 3) {
                for (let c = 0; c < coordinates.length; c++) {
                    maxHeight = Math.max(maxHeight, coordinates[c][2]);
                }
            }
            const featureExtrudedHeight = feature.get('olcs_extruded_height');
            // Render the cartographic rectangle
            fillGeometry = new Cesium.RectangleGeometry({
                ellipsoid: Cesium.Ellipsoid.WGS84,
                rectangle,
                height: maxHeight,
                extrudedHeight: featureExtrudedHeight,
            });
            outlineGeometry = new Cesium.RectangleOutlineGeometry({
                ellipsoid: Cesium.Ellipsoid.WGS84,
                rectangle,
                height: maxHeight,
                extrudedHeight: featureExtrudedHeight,
            });
        }
        else {
            const rings = olGeometry.getLinearRings();
            const hierarchy = {
                positions: [],
                holes: [],
            };
            const polygonHierarchy = hierarchy;
            console.assert(rings.length > 0);
            for (let i = 0; i < rings.length; ++i) {
                const olPos = rings[i].getCoordinates();
                const positions = ol4326CoordinateArrayToCsCartesians(olPos);
                console.assert(positions && positions.length > 0);
                if (i === 0) {
                    hierarchy.positions = positions;
                }
                else {
                    hierarchy.holes.push({
                        positions,
                        holes: [],
                    });
                }
            }
            const featureExtrudedHeight = feature.get('olcs_extruded_height');
            fillGeometry = new Cesium.PolygonGeometry({
                polygonHierarchy,
                perPositionHeight: true,
                extrudedHeight: featureExtrudedHeight,
            });
            // Since Cesium doesn't yet support Polygon outlines on terrain yet (coming soon...?)
            // we don't create an outline geometry if clamped, but instead do the polyline method
            // for each ring. Most of this code should be removeable when Cesium adds
            // support for Polygon outlines on terrain.
            if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
                const width = this.extractLineWidthFromOlStyle(olStyle);
                if (width > 0) {
                    const positions = [hierarchy.positions];
                    if (hierarchy.holes) {
                        for (let i = 0; i < hierarchy.holes.length; ++i) {
                            positions.push(hierarchy.holes[i].positions);
                        }
                    }
                    const appearance = new Cesium.PolylineMaterialAppearance({
                        material: this.olStyleToCesium(feature, olStyle, true),
                    });
                    const geometryInstances = [];
                    for (const linePositions of positions) {
                        const polylineGeometry = new Cesium.GroundPolylineGeometry({
                            positions: linePositions,
                            width,
                        });
                        geometryInstances.push(new Cesium.GeometryInstance({
                            geometry: polylineGeometry,
                        }));
                    }
                    outlinePrimitive = new Cesium.GroundPolylinePrimitive({
                        appearance,
                        geometryInstances,
                    });
                    waitReady(outlinePrimitive).then(() => {
                        this.setReferenceForPicking(layer, feature, outlinePrimitive._primitive);
                    });
                }
            }
            else {
                // Actually do the normal polygon thing. This should end the removable
                // section of code described above.
                outlineGeometry = new Cesium.PolygonOutlineGeometry({
                    polygonHierarchy: hierarchy,
                    perPositionHeight: true,
                    extrudedHeight: featureExtrudedHeight,
                });
            }
        }
        const primitives = this.wrapFillAndOutlineGeometries(layer, feature, olGeometry, fillGeometry, outlineGeometry, olStyle);
        if (outlinePrimitive) {
            primitives.add(outlinePrimitive);
        }
        return this.addTextStyle(layer, feature, olGeometry, olStyle, primitives);
    }
    /**
     * @param layer
     * @param feature
     * @param geometry
     * @api
     */
    getHeightReference(layer, feature, geometry) {
        // Read from the geometry
        let altitudeMode = geometry.get('altitudeMode');
        // Or from the feature
        if (altitudeMode === undefined) {
            altitudeMode = feature.get('altitudeMode');
        }
        // Or from the layer
        if (altitudeMode === undefined) {
            altitudeMode = layer.get('altitudeMode');
        }
        let heightReference = Cesium.HeightReference.NONE;
        if (altitudeMode === 'clampToGround') {
            heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
        }
        else if (altitudeMode === 'relativeToGround') {
            heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
        }
        return heightReference;
    }
    /**
     * Convert a point geometry to a Cesium BillboardCollection.
     * @param {ol.layer.Vector|ol.layer.Image} layer
     * @param {!ol.Feature} feature OpenLayers feature..
     * @param {!ol.geom.Point} olGeometry OpenLayers point geometry.
     * @param {!ol.ProjectionLike} projection
     * @param {!ol.style.Style} style
     * @param {!ol.style.Image} imageStyle
     * @param {!Cesium.BillboardCollection} billboards
     * @param {function(!Cesium.Billboard)=} opt_newBillboardCallback Called when the new billboard is added.
     * @api
     */
    createBillboardFromImage(layer, feature, olGeometry, projection, style, imageStyle, billboards, opt_newBillboardCallback) {
        if (imageStyle instanceof Icon/* default */.A) {
            // make sure the image is scheduled for load
            imageStyle.load();
        }
        const image = imageStyle.getImage(1); // get normal density
        const isImageLoaded = function (image) {
            return (image.src != '' &&
                image.naturalHeight != 0 &&
                image.naturalWidth != 0 &&
                image.complete);
        };
        const reallyCreateBillboard = function () {
            if (!image) {
                return;
            }
            if (!(image instanceof HTMLCanvasElement ||
                image instanceof Image ||
                image instanceof HTMLImageElement)) {
                return;
            }
            const center = olGeometry.getCoordinates();
            const position = ol4326CoordinateToCesiumCartesian(center);
            let color;
            const opacity = imageStyle.getOpacity();
            if (opacity !== undefined) {
                color = new Cesium.Color(1.0, 1.0, 1.0, opacity);
            }
            const scale = imageStyle.getScale();
            const heightReference = this.getHeightReference(layer, feature, olGeometry);
            const bbOptions = {
                image: image,
                color,
                scale: Array.isArray(scale) ? (scale[0] + scale[1]) / 2 : scale,
                heightReference,
                position,
            };
            // merge in cesium options from openlayers feature
            Object.assign(bbOptions, feature.get('cesiumOptions'));
            if (imageStyle instanceof Icon/* default */.A) {
                const anchor = imageStyle.getAnchor();
                if (anchor) {
                    const xScale = Array.isArray(scale) ? scale[0] : scale;
                    const yScale = Array.isArray(scale) ? scale[1] : scale;
                    bbOptions.pixelOffset = new Cesium.Cartesian2((image.width / 2 - anchor[0]) * xScale, (image.height / 2 - anchor[1]) * yScale);
                }
            }
            const bb = this.csAddBillboard(billboards, bbOptions, layer, feature, olGeometry, style);
            if (opt_newBillboardCallback) {
                opt_newBillboardCallback(bb);
            }
        }.bind(this);
        if (image instanceof Image && !isImageLoaded(image)) {
            // Cesium requires the image to be loaded
            let cancelled = false;
            const source = layer.getSource();
            const canceller = function () {
                cancelled = true;
            };
            source.on(['removefeature', 'clear'], this.boundOnRemoveOrClearFeatureListener_);
            let cancellers = source['olcs_cancellers'];
            if (!cancellers) {
                cancellers = {};
                source['olcs_cancellers'] = cancellers;
            }
            const fuid = getUid(feature);
            if (cancellers[fuid]) {
                // When the feature change quickly, a canceller may still be present so
                // we cancel it here to prevent creation of a billboard.
                cancellers[fuid]();
            }
            cancellers[fuid] = canceller;
            const listener = function () {
                image.removeEventListener('load', listener);
                if (!billboards.isDestroyed() && !cancelled) {
                    // Create billboard if the feature is still displayed on the map.
                    reallyCreateBillboard();
                }
            };
            image.addEventListener('load', listener);
        }
        else {
            reallyCreateBillboard();
        }
    }
    /**
     * Convert a point geometry to a Cesium BillboardCollection.
     * @param layer
     * @param feature OpenLayers feature..
     * @param olGeometry OpenLayers point geometry.
     * @param projection
     * @param style
     * @param billboards
     * @param opt_newBillboardCallback Called when the new billboard is added.
     * @return primitives
     * @api
     */
    olPointGeometryToCesium(layer, feature, olGeometry, projection, style, billboards, opt_newBillboardCallback) {
        console.assert(olGeometry.getType() == 'Point');
        olGeometry = olGeometryCloneTo4326(olGeometry, projection);
        let modelPrimitive = null;
        const imageStyle = style.getImage();
        if (imageStyle) {
            const olcsModelFunction = olGeometry.get('olcs_model') || feature.get('olcs_model');
            if (olcsModelFunction) {
                modelPrimitive = new Cesium.PrimitiveCollection();
                const olcsModel = olcsModelFunction();
                const options = Object.assign({}, { scene: this.scene }, olcsModel.cesiumOptions);
                if ('fromGltf' in Cesium.Model) {
                    // pre Cesium v107
                    // @ts-ignore
                    const model = Cesium.Model.fromGltf(options);
                    modelPrimitive.add(model);
                }
                else {
                    Cesium.Model.fromGltfAsync(options).then((model) => {
                        modelPrimitive.add(model);
                    });
                }
                if (olcsModel.debugModelMatrix) {
                    modelPrimitive.add(new Cesium.DebugModelMatrixPrimitive({
                        modelMatrix: olcsModel.debugModelMatrix,
                    }));
                }
            }
            else {
                this.createBillboardFromImage(layer, feature, olGeometry, projection, style, imageStyle, billboards, opt_newBillboardCallback);
            }
        }
        if (style.getText()) {
            return this.addTextStyle(layer, feature, olGeometry, style, modelPrimitive || new Cesium.Primitive());
        }
        return modelPrimitive;
    }
    /**
     * Convert an OpenLayers multi-something geometry to Cesium.
     * @param {ol.layer.Vector|ol.layer.Image} layer
     * @param {!ol.Feature} feature OpenLayers feature..
     * @param {!ol.geom.Geometry} geometry OpenLayers geometry.
     * @param {!ol.ProjectionLike} projection
     * @param {!ol.style.Style} olStyle
     * @param {!Cesium.BillboardCollection} billboards
     * @param {function(!Cesium.Billboard)=} opt_newBillboardCallback Called when
     * the new billboard is added.
     * @return {Cesium.Primitive} primitives
     * @api
     */
    olMultiGeometryToCesium(layer, feature, geometry, projection, olStyle, billboards, opt_newBillboardCallback) {
        // Do not reproject to 4326 now because it will be done later.
        switch (geometry.getType()) {
            case 'MultiPoint': {
                const points = geometry.getPoints();
                if (olStyle.getText()) {
                    const primitives = new Cesium.PrimitiveCollection();
                    points.forEach((geom) => {
                        console.assert(!!geom);
                        const result = this.olPointGeometryToCesium(layer, feature, geom, projection, olStyle, billboards, opt_newBillboardCallback);
                        if (result) {
                            primitives.add(result);
                        }
                    });
                    return primitives;
                }
                points.forEach((geom) => {
                    console.assert(!!geom);
                    this.olPointGeometryToCesium(layer, feature, geom, projection, olStyle, billboards, opt_newBillboardCallback);
                });
                return null;
            }
            case 'MultiLineString': {
                const lineStrings = geometry.getLineStrings();
                // FIXME: would be better to combine all child geometries in one primitive
                // instead we create n primitives for simplicity.
                const primitives = new Cesium.PrimitiveCollection();
                lineStrings.forEach((geom) => {
                    const p = this.olLineStringGeometryToCesium(layer, feature, geom, projection, olStyle);
                    primitives.add(p);
                });
                return primitives;
            }
            case 'MultiPolygon': {
                const polygons = geometry.getPolygons();
                // FIXME: would be better to combine all child geometries in one primitive
                // instead we create n primitives for simplicity.
                const primitives = new Cesium.PrimitiveCollection();
                polygons.forEach((geom) => {
                    const p = this.olPolygonGeometryToCesium(layer, feature, geom, projection, olStyle);
                    primitives.add(p);
                });
                return primitives;
            }
            default:
                console.assert(false, `Unhandled multi geometry type${geometry.getType()}`);
        }
    }
    /**
     * Convert an OpenLayers text style to Cesium.
     * @param layer
     * @param feature
     * @param geometry
     * @param style
     * @api
     */
    olGeometry4326TextPartToCesium(layer, feature, geometry, style) {
        const text = style.getText();
        if (!text) {
            return null;
        }
        const labels = new Cesium.LabelCollection({ scene: this.scene });
        // TODO: export and use the text draw position from OpenLayers .
        // See src/ol/render/vector.js
        const extentCenter = (0,ol_extent/* getCenter */.q1)(geometry.getExtent());
        if (geometry instanceof SimpleGeometry/* default */.Ay) {
            const first = geometry.getFirstCoordinate();
            extentCenter[2] = first.length == 3 ? first[2] : 0.0;
        }
        const options = {
            position: ol4326CoordinateToCesiumCartesian(extentCenter),
        };
        options.text = Array.isArray(text) ? text.join(' ') : text;
        options.heightReference = this.getHeightReference(layer, feature, geometry);
        const offsetX = style.getOffsetX();
        const offsetY = style.getOffsetY();
        if (offsetX != 0 || offsetY != 0) {
            const offset = new Cesium.Cartesian2(offsetX, offsetY);
            options.pixelOffset = offset;
        }
        options.font = style.getFont() || '10px sans-serif'; // OpenLayers default
        let labelStyle = undefined;
        if (style.getFill()) {
            options.fillColor = this.extractColorFromOlStyle(style, false);
            labelStyle = Cesium.LabelStyle.FILL;
        }
        if (style.getStroke()) {
            options.outlineWidth = this.extractLineWidthFromOlStyle(style);
            options.outlineColor = this.extractColorFromOlStyle(style, true);
            labelStyle = Cesium.LabelStyle.OUTLINE;
        }
        if (style.getFill() && style.getStroke()) {
            labelStyle = Cesium.LabelStyle.FILL_AND_OUTLINE;
        }
        options.style = labelStyle;
        let horizontalOrigin;
        switch (style.getTextAlign()) {
            case 'left':
                horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
                break;
            case 'right':
                horizontalOrigin = Cesium.HorizontalOrigin.RIGHT;
                break;
            case 'center':
            default:
                horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
        }
        options.horizontalOrigin = horizontalOrigin;
        if (style.getTextBaseline()) {
            let verticalOrigin;
            switch (style.getTextBaseline()) {
                case 'top':
                    verticalOrigin = Cesium.VerticalOrigin.TOP;
                    break;
                case 'middle':
                    verticalOrigin = Cesium.VerticalOrigin.CENTER;
                    break;
                case 'bottom':
                    verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                    break;
                case 'alphabetic':
                    verticalOrigin = Cesium.VerticalOrigin.TOP;
                    break;
                case 'hanging':
                    verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                    break;
                default:
                    console.assert(false, `unhandled baseline ${style.getTextBaseline()}`);
            }
            options.verticalOrigin = verticalOrigin;
        }
        const l = labels.add(options);
        this.setReferenceForPicking(layer, feature, l);
        return labels;
    }
    /**
     * Convert an OpenLayers style to a Cesium Material.
     * @param feature
     * @param style
     * @param outline
     * @api
     */
    olStyleToCesium(feature, style, outline) {
        const fill = style.getFill();
        const stroke = style.getStroke();
        if ((outline && !stroke) || (!outline && !fill)) {
            return null; // FIXME use a default style? Developer error?
        }
        const olColor = outline ? stroke.getColor() : fill.getColor();
        const color = convertColorToCesium(olColor);
        const lineDash = stroke.getLineDash();
        if (outline && lineDash) {
            return Cesium.Material.fromType('PolylineDash', {
                dashPattern: dashPattern(lineDash),
                color,
            });
        }
        return Cesium.Material.fromType('Color', {
            color,
        });
    }
    /**
     * Compute OpenLayers plain style.
     * Evaluates style function, blend arrays, get default style.
     * @param layer
     * @param feature
     * @param fallbackStyleFunction
     * @param resolution
     * @api
     */
    computePlainStyle(layer, feature, fallbackStyleFunction, resolution) {
        /**
         * @type {ol.FeatureStyleFunction|undefined}
         */
        const featureStyleFunction = feature.getStyleFunction();
        /**
         * @type {ol.style.Style | Array<ol.style.Style>}
         */
        let style = null;
        if (featureStyleFunction) {
            style = featureStyleFunction(feature, resolution);
        }
        if (!style && fallbackStyleFunction) {
            style = fallbackStyleFunction(feature, resolution);
        }
        if (!style) {
            // The feature must not be displayed
            return null;
        }
        // FIXME combine materials as in cesium-materials-pack?
        // then this function must return a custom material
        // More simply, could blend the colors like described in
        // http://en.wikipedia.org/wiki/Alpha_compositing
        return Array.isArray(style) ? style : [style];
    }
    /**
     * @param feature
     * @param style
     * @param opt_geom
     */
    getGeometryFromFeature(feature, style, opt_geom) {
        if (opt_geom) {
            return opt_geom;
        }
        const geom3d = feature.get('olcs_3d_geometry');
        if (geom3d && geom3d instanceof Geometry/* default */.A) {
            return geom3d;
        }
        if (style) {
            const geomFuncRes = style.getGeometryFunction()(feature);
            if (geomFuncRes instanceof Geometry/* default */.A) {
                return geomFuncRes;
            }
        }
        return feature.getGeometry();
    }
    /**
     * Convert one OpenLayers feature up to a collection of Cesium primitives.
     * @param layer
     * @param feature
     * @param style
     * @param context
     * @param opt_geom
     * @api
     */
    olFeatureToCesium(layer, feature, style, context, opt_geom) {
        const geom = this.getGeometryFromFeature(feature, style, opt_geom);
        if (!geom) {
            // OpenLayers features may not have a geometry
            // See http://geojson.org/geojson-spec.html#feature-objects
            return null;
        }
        const proj = context.projection;
        const newBillboardAddedCallback = function (bb) {
            const featureBb = context.featureToCesiumMap[getUid(feature)];
            if (featureBb instanceof Array) {
                featureBb.push(bb);
            }
            else {
                context.featureToCesiumMap[getUid(feature)] = [bb];
            }
        };
        switch (geom.getType()) {
            case 'GeometryCollection':
                const primitives = new Cesium.PrimitiveCollection();
                geom.getGeometriesArray().forEach((geom) => {
                    if (geom) {
                        const prims = this.olFeatureToCesium(layer, feature, style, context, geom);
                        if (prims) {
                            primitives.add(prims);
                        }
                    }
                });
                return primitives;
            case 'Point':
                const bbs = context.billboards;
                const result = this.olPointGeometryToCesium(layer, feature, geom, proj, style, bbs, newBillboardAddedCallback);
                if (!result) {
                    // no wrapping primitive
                    return null;
                }
                return result;
            case 'Circle':
                return this.olCircleGeometryToCesium(layer, feature, geom, proj, style);
            case 'LineString':
                return this.olLineStringGeometryToCesium(layer, feature, geom, proj, style);
            case 'Polygon':
                return this.olPolygonGeometryToCesium(layer, feature, geom, proj, style);
            case 'MultiPoint':
                return (this.olMultiGeometryToCesium(layer, feature, geom, proj, style, context.billboards, newBillboardAddedCallback) || null);
            case 'MultiLineString':
                return (this.olMultiGeometryToCesium(layer, feature, geom, proj, style, context.billboards, newBillboardAddedCallback) || null);
            case 'MultiPolygon':
                return (this.olMultiGeometryToCesium(layer, feature, geom, proj, style, context.billboards, newBillboardAddedCallback) || null);
            case 'LinearRing':
                throw new Error('LinearRing should only be part of polygon.');
            default:
                throw new Error(`Ol geom type not handled : ${geom.getType()}`);
        }
    }
    /**
     * Convert an OpenLayers vector layer to Cesium primitive collection.
     * For each feature, the associated primitive will be stored in
     * `featurePrimitiveMap`.
     * @param olLayer
     * @param olView
     * @param featurePrimitiveMap
     * @api
     */
    olVectorLayerToCesium(olLayer, olView, featurePrimitiveMap) {
        const proj = olView.getProjection();
        const resolution = olView.getResolution();
        if (resolution === undefined || !proj) {
            console.assert(false, 'View not ready');
            // an assertion is not enough for closure to assume resolution and proj
            // are defined
            throw new Error('View not ready');
        }
        let source = olLayer.getSource();
        if (source instanceof source_Cluster) {
            source = source.getSource();
        }
        console.assert(source instanceof source_Vector/* default */.A);
        const features = source.getFeatures();
        const counterpart = new VectorLayerCounterpart(proj, this.scene);
        const context = counterpart.context;
        for (let i = 0; i < features.length; ++i) {
            const feature = features[i];
            if (!feature) {
                continue;
            }
            const layerStyle = olLayer.getStyleFunction();
            const styles = this.computePlainStyle(olLayer, feature, layerStyle, resolution);
            if (!styles || !styles.length) {
                // only 'render' features with a style
                continue;
            }
            let primitives = null;
            for (let i = 0; i < styles.length; i++) {
                const prims = this.olFeatureToCesium(olLayer, feature, styles[i], context);
                if (prims) {
                    if (!primitives) {
                        primitives = prims;
                    }
                    else if (prims) {
                        let i = 0, prim;
                        while ((prim = prims.get(i))) {
                            primitives.add(prim);
                            i++;
                        }
                    }
                }
            }
            if (!primitives) {
                continue;
            }
            featurePrimitiveMap[getUid(feature)] = primitives;
            counterpart.getRootPrimitive().add(primitives);
        }
        return counterpart;
    }
    /**
     * Convert an OpenLayers feature to Cesium primitive collection.
     * @param layer
     * @param view
     * @param feature
     * @param context
     * @api
     */
    convert(layer, view, feature, context) {
        const proj = view.getProjection();
        const resolution = view.getResolution();
        if (resolution == undefined || !proj) {
            return null;
        }
        /**
         * @type {ol.StyleFunction|undefined}
         */
        const layerStyle = layer.getStyleFunction();
        const styles = this.computePlainStyle(layer, feature, layerStyle, resolution);
        if (!styles || !styles.length) {
            // only 'render' features with a style
            return null;
        }
        context.projection = proj;
        /**
         * @type {Cesium.Primitive|null}
         */
        let primitives = null;
        for (let i = 0; i < styles.length; i++) {
            const prims = this.olFeatureToCesium(layer, feature, styles[i], context);
            if (!primitives) {
                primitives = prims;
            }
            else if (prims) {
                let i = 0, prim;
                while ((prim = prims.get(i))) {
                    primitives.add(prim);
                    i++;
                }
            }
        }
        return primitives;
    }
}
/**
 * Transform a canvas line dash pattern to a Cesium dash pattern
 * See https://cesium.com/learn/cesiumjs/ref-doc/PolylineDashMaterialProperty.html#dashPattern
 * @param lineDash
 */
function dashPattern(lineDash) {
    if (lineDash.length < 2) {
        lineDash = [1, 1];
    }
    const segments = lineDash.length % 2 === 0 ? lineDash : [...lineDash, ...lineDash];
    const total = segments.reduce((a, b) => a + b, 0);
    const div = total / 16;
    // create a 16 bit binary string
    let binaryString = segments
        .map((segment, index) => {
        // we alternate between 1 and 0
        const digit = index % 2 === 0 ? '1' : '0';
        // We scale the segment length to fit 16 slots.
        let count = Math.round(segment / div);
        if (index === 0 && count === 0) {
            // We need to start with a 1
            count = 1;
        }
        return digit.repeat(count);
    })
        .join('');
    // We rounded so it might be that the string is too short or too long.
    // We try to fix it by padding or truncating the string.
    if (binaryString.length < 16) {
        binaryString = binaryString.padEnd(16, '0');
    }
    else if (binaryString.length > 16) {
        binaryString = binaryString.substring(0, 16);
    }
    if (binaryString[15] === '1') {
        // We need to really finish with a 0
        binaryString = binaryString.substring(0, 15) + '0';
    }
    console.assert(binaryString.length === 16);
    return parseInt(binaryString, 2);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmVhdHVyZUNvbnZlcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGNzL0ZlYXR1cmVDb252ZXJ0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQXFCTixNQUFNLFFBQVEsQ0FBQztBQU9oQixPQUFPLEVBQUMsY0FBYyxFQUFFLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2RCxPQUFPLEVBQ0wsUUFBUSxJQUFJLFVBQVUsR0FTdkIsTUFBTSxZQUFZLENBQUM7QUFDcEIsT0FBTyxFQUFDLFFBQVEsSUFBSSx1QkFBdUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZFLE9BQU8sb0JBQW9CLE1BQU0sMkJBQTJCLENBQUM7QUFJN0QsT0FBTyxlQUFlLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxZQUFZLEVBQUUsRUFBd0IsTUFBTSxxQkFBcUIsQ0FBQztBQUN6RSxPQUFPLFdBQVcsTUFBTSxrQkFBa0IsQ0FBQztBQUUzQyxPQUFPLEVBQTJDLE1BQU0sbUJBQW1CLENBQUM7QUFFNUUsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixtQ0FBbUMsRUFDbkMsaUNBQWlDLEVBQ2pDLHFCQUFxQixHQUN0QixNQUFNLFdBQVcsQ0FBQztBQUNuQixPQUFPLHNCQUFzQixFQUFFLEVBRTlCLE1BQU0sa0NBQWtDLENBQUM7QUFDMUMsT0FBTyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUMsTUFBTSxXQUFXLENBQUM7QUE0RDVDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sZ0JBQWdCO0lBaUJiO0lBaEJ0Qjs7T0FFRztJQUNLLG9DQUFvQyxHQUMxQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWxDLDBCQUEwQixHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXJFOzs7Ozs7O09BT0c7SUFDSCxZQUFz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
;// ./node_modules/olcs/lib/olcs/VectorSynchronizer.js










class VectorSynchronizer extends AbstractSynchronizer {
    converter;
    csAllPrimitives_;
    /**
     * Unidirectionally synchronize OpenLayers vector layers to Cesium.
     * @param map
     * @param scene
     * @param opt_converter
     */
    constructor(map, scene, opt_converter) {
        super(map, scene);
        this.converter = opt_converter || new FeatureConverter(scene);
        this.csAllPrimitives_ = new Cesium.PrimitiveCollection();
        scene.primitives.add(this.csAllPrimitives_);
        this.csAllPrimitives_.destroyPrimitives = false;
    }
    addCesiumObject(counterpart) {
        console.assert(!!counterpart);
        const collection = (counterpart.getRootPrimitive());
        collection.counterpart = counterpart;
        this.csAllPrimitives_.add(counterpart.getRootPrimitive());
    }
    destroyCesiumObject(object) {
        object.getRootPrimitive().destroy();
    }
    removeSingleCesiumObject(object, destroy) {
        object.destroy();
        this.csAllPrimitives_.destroyPrimitives = destroy;
        this.csAllPrimitives_.remove(object.getRootPrimitive());
        this.csAllPrimitives_.destroyPrimitives = false;
    }
    removeAllCesiumObjects(destroy) {
        this.csAllPrimitives_.destroyPrimitives = destroy;
        if (destroy) {
            for (let i = 0; i < this.csAllPrimitives_.length; ++i) {
                this.csAllPrimitives_.get(i)['counterpart'].destroy();
            }
        }
        this.csAllPrimitives_.removeAll();
        this.csAllPrimitives_.destroyPrimitives = false;
    }
    /**
     * Synchronizes the layer visibility properties
     * to the given Cesium Primitive.
     * @param olLayerWithParents
     * @param csPrimitive
     */
    updateLayerVisibility(olLayerWithParents, csPrimitive) {
        let visible = true;
        [olLayerWithParents.layer]
            .concat(olLayerWithParents.parents)
            .forEach((olLayer) => {
            const layerVisible = olLayer.getVisible();
            if (layerVisible !== undefined) {
                visible = visible && layerVisible;
            }
            else {
                visible = false;
            }
        });
        csPrimitive.show = visible;
    }
    createSingleLayerCounterparts(olLayerWithParents) {
        const olLayer = olLayerWithParents.layer;
        if (!(olLayer instanceof Vector/* default */.A) ||
            olLayer instanceof VectorTile) {
            return null;
        }
        console.assert(olLayer instanceof Layer/* default */.A);
        let source = olLayer.getSource();
        if (source instanceof source_Cluster) {
            source = source.getSource();
        }
        if (!source) {
            return null;
        }
        console.assert(source instanceof source_Vector/* default */.A);
        console.assert(!!this.view);
        const view = this.view;
        const featurePrimitiveMap = {};
        const counterpart = this.converter.olVectorLayerToCesium(olLayer, view, featurePrimitiveMap);
        const csPrimitives = counterpart.getRootPrimitive();
        const olListenKeys = counterpart.olListenKeys;
        [olLayerWithParents.layer]
            .concat(olLayerWithParents.parents)
            .forEach((olLayerItem) => {
            olListenKeys.push(olLayerItem.on('change:visible', () => {
                this.updateLayerVisibility(olLayerWithParents, csPrimitives);
            }));
        });
        this.updateLayerVisibility(olLayerWithParents, csPrimitives);
        const onAddFeature = (feature) => {
            const context = counterpart.context;
            const prim = this.converter.convert(olLayer, view, feature, context);
            if (prim) {
                featurePrimitiveMap[getUid(feature)] = prim;
                csPrimitives.add(prim);
            }
        };
        const onRemoveFeature = (feature) => {
            const id = getUid(feature);
            const context = counterpart.context;
            const bbs = context.featureToCesiumMap[id];
            if (bbs) {
                delete context.featureToCesiumMap[id];
                bbs.forEach((bb) => {
                    if (bb instanceof Cesium.Billboard) {
                        context.billboards.remove(bb);
                    }
                });
            }
            const csPrimitive = featurePrimitiveMap[id];
            delete featurePrimitiveMap[id];
            if (csPrimitive) {
                csPrimitives.remove(csPrimitive);
            }
        };
        olListenKeys.push(source.on('addfeature', (e) => {
            console.assert(!!e.feature);
            onAddFeature(e.feature);
        }));
        olListenKeys.push(source.on('removefeature', (e) => {
            console.assert(!!e.feature);
            onRemoveFeature(e.feature);
        }));
        olListenKeys.push(source.on('changefeature', (e) => {
            const feature = e.feature;
            console.assert(!!feature);
            onRemoveFeature(feature);
            onAddFeature(feature);
        }));
        return counterpart ? [counterpart] : null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVjdG9yU3luY2hyb25pemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29sY3MvVmVjdG9yU3luY2hyb25pemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sWUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sYUFBYSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8saUJBQWlCLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxlQUFlLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxjQUFjLEVBQUUsRUFBd0IsTUFBTSxxQkFBcUIsQ0FBQztBQUMzRSxPQUFPLHdCQUF3QixNQUFNLDJCQUEyQixDQUFDO0FBQ2pFLE9BQU8sb0JBQW9CLE1BQU0sdUJBQXVCLENBQUM7QUFFekQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQU1qQyxPQUFPLEVBQXVCLE1BQU0sV0FBVyxDQUFDO0FBQ2hELE9BQU8sRUFHTixNQUFNLGtDQUFrQyxDQUFDO0FBRTFDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sa0JBQW1CLFNBQVEsd0JBQWdEO0lBQ3BGLFNBQVMsQ0FBdUI7SUFDbEMsZ0JBQWdCLENBQXNCO0lBQzlDOzs7OztPQUtHO0lBQ0gsWUFBWSxHQUFRLEVBQUUsS0FBWSxFQUFFLGFBQW9DO1FBQ3RFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLElBQUksSUFBSSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUN6RCxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFD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
;// ./node_modules/olcs/lib/olcs/OLCesium.js









/**
 * Moved from Cesium
 * The state of a BoundingSphere computation being performed by a {@link Visualizer}.
 */
const BoundingSphereState = {
    /**
     * The BoundingSphere has been computed.
     */
    DONE: 0,
    /**
     * The BoundingSphere is still being computed.
     */
    PENDING: 1,
    /**
     * The BoundingSphere does not exist.
     */
    FAILED: 2,
};
/**
 * @typedef {Object} OLCesiumOptions
 * @property {import('ol/Map.js').default} map The OpenLayers map we want to show on a Cesium scene.
 * @property {Element|string} [target] Target element for the Cesium scene.
 * @property {function(!import('ol/Map.js').default, !Cesium.Scene, !Cesium.DataSourceCollection): Array<import('olcs/AbstractSynchronizer.js').default>}
 *      [createSynchronizers] Callback function which will be called by the {@link olcs.OLCesium}
 *      constructor to create custom synchronizers. Receives an `ol.Map` and a `Cesium.Scene` as arguments,
 *      and needs to return an array of {@link import('olcs/AbstractSynchronizer.js').default}.
 * @property {function(): Cesium.JulianDate} [time] Control the current time used by Cesium.
 * @property {boolean} [stopOpenLayersEventsPropagation] Prevent propagation of mouse/touch events to
 *      OpenLayers when Cesium is active.
 * @property {Cesium.SceneOptions} [sceneOptions] Allows the passing of property value to the
 *      `Cesium.Scene`.
 */
class OLCesium {
    autoRenderLoop_ = null;
    map_;
    time_;
    to4326Transform_;
    resolutionScale_ = 1.0;
    canvasClientWidth_ = 0.0;
    canvasClientHeight_ = 0.0;
    resolutionScaleChanged_ = true; // force resize
    container_;
    isOverMap_;
    canvas_;
    enabled_ = false;
    pausedInteractions_ = [];
    hiddenRootGroup_ = null;
    scene_;
    camera_;
    globe_;
    dataSourceCollection_;
    dataSourceDisplay_;
    /** Time of the last rendered frame, as returned by `performance.now()`. */
    lastFrameTime_ = 0;
    /** The identifier returned by `requestAnimationFrame`. */
    renderId_;
    /** Target frame rate for the render loop.  */
    targetFrameRate_ = Number.POSITIVE_INFINITY;
    /** If the Cesium render loop is being blocked. */
    blockCesiumRendering_ = false;
    /** If the warmup routine is active. */
    warmingUp_ = false;
    trackedFeature_ = null;
    trackedEntity_ = null;
    entityView_ = null;
    needTrackedEntityUpdate_ = false;
    boundingSphereScratch_ = new Cesium.BoundingSphere();
    synchronizers_;
    refresh2DAfterCameraMoveEndOnly = false;
    moveEndRemoveCallback_;
    constructor(options) {
        this.map_ = options.map;
        this.time_ =
            options.time ||
                function () {
                    return Cesium.JulianDate.now();
                };
        /**
         * No change of the view projection.
         */
        this.to4326Transform_ = (0,ol_proj/* getTransform */.RG)(this.map_.getView().getProjection(), 'EPSG:4326');
        const fillArea = 'position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;';
        this.container_ = document.createElement('DIV');
        const containerAttribute = document.createAttribute('style');
        containerAttribute.value = `${fillArea}visibility:hidden;`;
        this.container_.setAttributeNode(containerAttribute);
        let targetElement = options.target || this.map_.getViewport();
        if (typeof targetElement === 'string') {
            targetElement = document.getElementById(targetElement);
        }
        targetElement.appendChild(this.container_);
        /**
         * Whether the Cesium container is placed over the ol map.
         * a target => side by side mode
         * no target => over map mode
         */
        this.isOverMap_ = !options.target;
        if (this.isOverMap_ && options.stopOpenLayersEventsPropagation) {
            const overlayEvents = [
                'click',
                'dblclick',
                'mousedown',
                'touchstart',
                'pointerdown',
                'mousewheel',
                'wheel',
            ];
            for (let i = 0, ii = overlayEvents.length; i < ii; ++i) {
                this.container_.addEventListener(overlayEvents[i], (evt) => evt.stopPropagation());
            }
        }
        this.canvas_ = document.createElement('canvas');
        const canvasAttribute = document.createAttribute('style');
        canvasAttribute.value = fillArea;
        this.canvas_.setAttributeNode(canvasAttribute);
        if (supportsImageRenderingPixelated()) {
            // non standard CSS4
            this.canvas_.style['imageRendering'] = imageRenderingValue();
        }
        this.canvas_.oncontextmenu = function () {
            return false;
        };
        this.canvas_.onselectstart = function () {
            return false;
        };
        this.container_.appendChild(this.canvas_);
        const sceneOptions = options.sceneOptions !== undefined
            ? { ...options.sceneOptions, canvas: this.canvas_, scene3DOnly: true }
            : { canvas: this.canvas_, scene3DOnly: true };
        this.scene_ = new Cesium.Scene(sceneOptions);
        const sscc = this.scene_.screenSpaceCameraController;
        if (!Array.isArray(sscc.tiltEventTypes)) {
            console.log('sscc is not an array');
        }
        else {
            sscc.tiltEventTypes.push({
                'eventType': Cesium.CameraEventType.LEFT_DRAG,
                'modifier': Cesium.KeyboardEventModifier.SHIFT,
            });
            sscc.tiltEventTypes.push({
                'eventType': Cesium.CameraEventType.LEFT_DRAG,
                'modifier': Cesium.KeyboardEventModifier.ALT,
            });
        }
        sscc.enableLook = false;
        this.scene_.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
        this.camera_ = new Camera(this.scene_, this.map_);
        this.globe_ = new Cesium.Globe(Cesium.Ellipsoid.WGS84);
        this.globe_.baseColor = Cesium.Color.WHITE;
        this.scene_.globe = this.globe_;
        this.scene_.skyAtmosphere = new Cesium.SkyAtmosphere();
        // The first layer of Cesium is special; using a 1x1 transparent image to workaround it.
        // See https://github.com/AnalyticalGraphicsInc/cesium/issues/1323 for details.
        const firstImageryProvider = new Cesium.SingleTileImageryProvider({
            tileHeight: 1,
            tileWidth: 1,
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
            rectangle: Cesium.Rectangle.fromDegrees(0, 0, 1, 1), // the Rectangle dimensions are arbitrary
        });
        this.globe_.imageryLayers.addImageryProvider(firstImageryProvider, 0);
        this.dataSourceCollection_ = new Cesium.DataSourceCollection();
        this.dataSourceDisplay_ = new Cesium.DataSourceDisplay({
            scene: this.scene_,
            dataSourceCollection: this.dataSourceCollection_,
        });
        this.synchronizers_ = options.createSynchronizers
            ? options.createSynchronizers(this.map_, this.scene_, this.dataSourceCollection_)
            : [
                new RasterSynchronizer(this.map_, this.scene_),
                new VectorSynchronizer(this.map_, this.scene_),
                new OverlaySynchronizer(this.map_, this.scene_),
            ];
        // Assures correct canvas size after initialisation
        this.handleResize_();
        for (let i = this.synchronizers_.length - 1; i >= 0; --i) {
            this.synchronizers_[i].synchronize();
        }
        const eventHelper = new Cesium.EventHelper();
        eventHelper.add(this.scene_.postRender, OLCesium.prototype.updateTrackedEntity_, this);
        this.moveEndRemoveCallback_ = this.scene_.camera.moveEnd.addEventListener(() => {
            if (this.refresh2DAfterCameraMoveEndOnly) {
                this.camera_.checkCameraChange();
            }
        });
    }
    /**
     * Destroys the Cesium resources held by this object.
     */
    destroy() {
        cancelAnimationFrame(this.renderId_);
        this.renderId_ = undefined;
        this.synchronizers_.forEach((synchronizer) => synchronizer.destroyAll());
        this.camera_.destroy();
        this.scene_.destroy();
        // @ts-ignore TS2341
        this.scene_._postRender = null;
        this.moveEndRemoveCallback_();
        this.container_.remove();
    }
    /**
     * Render the Cesium scene.
     */
    render_() {
        // if a call to `requestAnimationFrame` is pending, cancel it
        if (this.renderId_ !== undefined) {
            cancelAnimationFrame(this.renderId_);
            this.renderId_ = undefined;
        }
        // only render if Cesium is enabled/warming and rendering hasn't been blocked
        if ((this.enabled_ || this.warmingUp_) && !this.blockCesiumRendering_) {
            this.renderId_ = requestAnimationFrame(this.onAnimationFrame_.bind(this));
        }
    }
    /**
     * Callback for `requestAnimationFrame`.
     * @param {number} frameTime The frame time, from `performance.now()`.
     */
    onAnimationFrame_(frameTime) {
        this.renderId_ = undefined;
        // check if a frame was rendered within the target frame rate
        const interval = 1000.0 / this.targetFrameRate_;
        const delta = frameTime - this.lastFrameTime_;
        if (delta < interval) {
            // too soon, don't render yet
            this.render_();
            return;
        }
        // time to render a frame, save the time
        this.lastFrameTime_ = frameTime;
        const julianDate = this.time_();
        // initializeFrame private property
        // @ts-ignore TS2341
        this.scene_.initializeFrame();
        this.handleResize_();
        this.dataSourceDisplay_.update(julianDate);
        // Update tracked entity
        if (this.entityView_) {
            const trackedEntity = this.trackedEntity_;
            // getBoundingSphere private property
            // @ts-ignore TS2341
            const trackedState = this.dataSourceDisplay_.getBoundingSphere(trackedEntity, false, this.boundingSphereScratch_);
            if (trackedState === BoundingSphereState.DONE) {
                this.boundingSphereScratch_.radius = 1; // a radius of 1 is enough for tracking points
                this.entityView_.update(julianDate, this.boundingSphereScratch_);
            }
        }
        this.scene_.render(julianDate);
        if (!this.refresh2DAfterCameraMoveEndOnly) {
            this.camera_.checkCameraChange();
        }
        // request the next render call after this one completes to ensure the browser doesn't get backed up
        this.render_();
    }
    updateTrackedEntity_() {
        if (!this.needTrackedEntityUpdate_) {
            return;
        }
        const trackedEntity = this.trackedEntity_;
        const scene = this.scene_;
        // getBoundingSphere private property
        // @ts-ignore TS2341
        const state = this.dataSourceDisplay_.getBoundingSphere(trackedEntity, false, this.boundingSphereScratch_);
        if (state === BoundingSphereState.PENDING) {
            return;
        }
        scene.screenSpaceCameraController.enableTilt = false;
        const bs = state !== BoundingSphereState.FAILED
            ? this.boundingSphereScratch_
            : undefined;
        if (bs) {
            bs.radius = 1;
        }
        this.entityView_ = new Cesium.EntityView(trackedEntity, scene, scene.mapProjection.ellipsoid);
        this.entityView_.update(this.time_(), bs);
        this.needTrackedEntityUpdate_ = false;
    }
    handleResize_() {
        let width = this.canvas_.clientWidth;
        let height = this.canvas_.clientHeight;
        if (width === 0 || height === 0) {
            // The canvas DOM element is not ready yet.
            return;
        }
        if (width === this.canvasClientWidth_ &&
            height === this.canvasClientHeight_ &&
            !this.resolutionScaleChanged_) {
            return;
        }
        let resolutionScale = this.resolutionScale_;
        if (!supportsImageRenderingPixelated()) {
            resolutionScale *= window.devicePixelRatio || 1.0;
        }
        this.resolutionScaleChanged_ = false;
        this.canvasClientWidth_ = width;
        this.canvasClientHeight_ = height;
        width *= resolutionScale;
        height *= resolutionScale;
        this.canvas_.width = width;
        this.canvas_.height = height;
        this.scene_.camera.frustum.aspectRatio =
            width / height;
    }
    getCamera() {
        return this.camera_;
    }
    getOlMap() {
        return this.map_;
    }
    getOlView() {
        const view = this.map_.getView();
        console.assert(!!view);
        return view;
    }
    getCesiumScene() {
        return this.scene_;
    }
    getDataSources() {
        return this.dataSourceCollection_;
    }
    getDataSourceDisplay() {
        return this.dataSourceDisplay_;
    }
    getEnabled() {
        return this.enabled_;
    }
    /**
     * Enables/disables the Cesium.
     * This modifies the visibility style of the container element.
     * @param enable
     */
    setEnabled(enable) {
        if (this.enabled_ === enable) {
            return;
        }
        this.enabled_ = enable;
        // some Cesium operations are operating with canvas.clientWidth,
        // so we can't remove it from DOM or even make display:none;
        this.container_.style.visibility = this.enabled_ ? 'visible' : 'hidden';
        let interactions;
        if (this.enabled_) {
            this.throwOnUnitializedMap_();
            if (this.isOverMap_) {
                interactions = this.map_.getInteractions();
                interactions.forEach((el, i, arr) => {
                    this.pausedInteractions_.push(el);
                });
                interactions.clear();
                this.map_.addInteraction = (interaction) => this.pausedInteractions_.push(interaction);
                this.map_.removeInteraction = (interaction) => {
                    let interactionRemoved = false;
                    this.pausedInteractions_ = this.pausedInteractions_.filter((i) => {
                        const removed = i !== interaction;
                        if (!interactionRemoved) {
                            interactionRemoved = removed;
                        }
                        return removed;
                    });
                    return interactionRemoved ? interaction : undefined;
                };
                const rootGroup = this.map_.getLayerGroup();
                if (rootGroup.getVisible()) {
                    this.hiddenRootGroup_ = rootGroup;
                    this.hiddenRootGroup_.setVisible(false);
                }
                this.map_.getOverlayContainer().classList.add('olcs-hideoverlay');
            }
            this.camera_.readFromView();
            this.render_();
        }
        else {
            if (this.isOverMap_) {
                interactions = this.map_.getInteractions();
                this.pausedInteractions_.forEach((interaction) => {
                    interactions.push(interaction);
                });
                this.pausedInteractions_.length = 0;
                this.map_.addInteraction = (interaction) => this.map_.getInteractions().push(interaction);
                this.map_.removeInteraction = (interaction) => this.map_.getInteractions().remove(interaction);
                this.map_.getOverlayContainer().classList.remove('olcs-hideoverlay');
                if (this.hiddenRootGroup_) {
                    this.hiddenRootGroup_.setVisible(true);
                    this.hiddenRootGroup_ = null;
                }
            }
            this.camera_.updateView();
        }
    }
    /**
     * Preload Cesium so that it is ready when transitioning from 2D to 3D.
     * @param {number} height Target height of the camera
     * @param {number} timeout Milliseconds after which the warming will stop
     */
    warmUp(height, timeout) {
        if (this.enabled_) {
            // already enabled
            return;
        }
        this.throwOnUnitializedMap_();
        this.camera_.readFromView();
        const ellipsoid = this.globe_.ellipsoid;
        const csCamera = this.scene_.camera;
        const position = ellipsoid.cartesianToCartographic(csCamera.position);
        if (position.height < height) {
            position.height = height;
            csCamera.position = ellipsoid.cartographicToCartesian(position);
        }
        this.warmingUp_ = true;
        this.render_();
        setTimeout(() => {
            this.warmingUp_ = false;
        }, timeout);
    }
    /**
     * Block Cesium rendering to save resources.
     * @param {boolean} block True to block.
     */
    setBlockCesiumRendering(block) {
        if (this.blockCesiumRendering_ !== block) {
            this.blockCesiumRendering_ = block;
            // reset the render loop
            this.render_();
        }
    }
    /**
     * Render the globe only when necessary in order to save resources.
     * Experimental.
     */
    enableAutoRenderLoop() {
        if (!this.autoRenderLoop_) {
            this.autoRenderLoop_ = new AutoRenderLoop(this);
        }
    }
    /**
     * Get the autorender loop.
     */
    getAutoRenderLoop() {
        return this.autoRenderLoop_;
    }
    /**
     * The 3D Cesium globe is rendered in a canvas with two different dimensions:
     * clientWidth and clientHeight which are the dimension on the screen and
     * width and height which are the dimensions of the drawing buffer.
     *
     * By using a resolution scale lower than 1.0, it is possible to render the
     * globe in a buffer smaller than the canvas client dimensions and improve
     * performance, at the cost of quality.
     *
     * Pixel ratio should also be taken into account; by default, a device with
     * pixel ratio of 2.0 will have a buffer surface 4 times bigger than the client
     * surface.
     * @param value
     */
    setResolutionScale(value) {
        value = Math.max(0, value);
        if (value !== this.resolutionScale_) {
            this.resolutionScale_ = Math.max(0, value);
            this.resolutionScaleChanged_ = true;
            if (this.autoRenderLoop_) {
                this.autoRenderLoop_.restartRenderLoop();
            }
        }
    }
    /**
     * Set the target frame rate for the renderer. Set to `Number.POSITIVE_INFINITY`
     * to render as quickly as possible.
     * @param {number} value The frame rate, in frames per second.
     */
    setTargetFrameRate(value) {
        if (this.targetFrameRate_ !== value) {
            this.targetFrameRate_ = value;
            // reset the render loop
            this.render_();
        }
    }
    /**
     * Set if the synchronization back to the OL 2D map happens continuously or only after the camera is at rest again.
     * @param {boolean} value true: synch after camera move end only; false: synch continuously
     */
    setRefresh2DAfterCameraMoveEndOnly(value) {
        this.refresh2DAfterCameraMoveEndOnly = value;
    }
    /**
     * Check if OpenLayers map is not properly initialized.
     */
    throwOnUnitializedMap_() {
        const map = this.map_;
        const view = map.getView();
        const center = view.getCenter();
        if (!view.isDef() || isNaN(center[0]) || isNaN(center[1])) {
            throw new Error(`The OpenLayers map is not properly initialized: ${center} / ${view.getResolution()}`);
        }
    }
    get trackedFeature() {
        return this.trackedFeature_;
    }
    set trackedFeature(feature) {
        if (this.trackedFeature_ !== feature) {
            const scene = this.scene_;
            //Stop tracking
            if (!feature || !feature.getGeometry()) {
                this.needTrackedEntityUpdate_ = false;
                scene.screenSpaceCameraController.enableTilt = true;
                if (this.trackedEntity_) {
                    this.dataSourceDisplay_.defaultDataSource.entities.remove(this.trackedEntity_);
                }
                this.trackedEntity_ = null;
                this.trackedFeature_ = null;
                this.entityView_ = null;
                scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
                return;
            }
            this.trackedFeature_ = feature;
            //We can't start tracking immediately, so we set a flag and start tracking
            //when the bounding sphere is ready (most likely next frame).
            this.needTrackedEntityUpdate_ = true;
            const to4326Transform = this.to4326Transform_;
            const toCesiumPosition = function () {
                const geometry = feature.getGeometry();
                console.assert(geometry instanceof Point/* default */.A);
                const coo = geometry instanceof Point/* default */.A ? geometry.getCoordinates() : [];
                const coo4326 = to4326Transform(coo, undefined, coo.length);
                return ol4326CoordinateToCesiumCartesian(coo4326);
            };
            // Create an invisible point entity for tracking.
            // It is independent of the primitive/geometry created by the vector synchronizer.
            const options = {
                // @ts-ignore according to Cesium types, not possible to pass CallbackProperty
                position: new Cesium.CallbackProperty((time, result) => toCesiumPosition(), false),
                point: {
                    pixelSize: 1,
                    color: Cesium.Color.TRANSPARENT,
                },
            };
            this.trackedEntity_ =
                this.dataSourceDisplay_.defaultDataSource.entities.add(options);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT0xDZXNpdW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvb2xjcy9PTENlc2l1bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrQkEsT0FBTyxXQUFXLE1BQU0sa0JBQWtCLENBQUM7QUFHM0MsT0FBTyxFQUFDLFlBQVksRUFBeUIsTUFBTSxZQUFZLENBQUM7QUFFaEUsT0FBTyxrQkFBa0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLFVBQVUsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyx1QkFBdUIsTUFBTSwwQkFBMEIsQ0FBQztBQUMvRCxPQUFPLHNCQUFzQixNQUFNLHlCQUF5QixDQUFDO0FBQzdELE9BQU8sc0JBQXNCLE1BQU0seUJBQXlCLENBQUM7QUFDN0QsT0FBTyxFQUFDLGlDQUFpQyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRTVELE9BQU8sRUFBQyxtQkFBbUIsRUFBRSwrQkFBK0IsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUUvRTs7O0dBR0c7QUFDSCxNQUFNLG1CQUFtQixHQUEyQjtJQUNsRDs7T0FFRztJQUNILElBQUksRUFBRSxDQUFDO0lBQ1A7O09BRUc7SUFDSCxPQUFPLEVBQUUsQ0FBQztJQUNWOztPQUVHO0lBQ0gsTUFBTSxFQUFFLENBQUM7Q0FDVixDQUFDO0FBb0NGOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVE7SUFDbkIsZUFBZSxHQUE4QixJQUFJLENBQUM7SUFDbEQsSUFBSSxDQUFNO0lBQ1YsS0FBSyxDQUFtQjtJQUN4QixnQkFBZ0IsQ0FBb0I7SUFDcEMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLGtCQUFrQixHQUFHLEdBQUcsQ0FBQztJQUN6QixtQkFBbUIsR0FBRyxHQUFHLENBQUM7SUFDMUIsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLENBQUMsZUFBZTtJQUMvQyxVQUFVLENBQWM7SUFDeEIsVUFBVSxDQUFVO0lBQ3BCLE9BQU8sQ0FBb0I7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

/***/ })

}]);