"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[811],{

/***/ 57811:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ CesiumMap; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/map/views/CesiumMap.vue?vue&type=template&id=8203cbf2&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "cesium-map-container"
  }, [_c('nav', {
    staticClass: "level floater"
  }, [_c('div', {
    staticClass: "level-left"
  }), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('nav', {
    staticClass: "breadcrumb breadMenu"
  }, [_c('ul', [_c('div', {
    staticClass: "field is-horizontal"
  }, [_vm._m(0), _c('div', {
    staticClass: "field-body"
  }, [_c('div', {
    staticClass: "field is-horizontal"
  }, [_c('div', {
    staticClass: "select"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.mapType,
      expression: "mapType"
    }],
    on: {
      "change": [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.mapType = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.updateMapBaseLayer]
    }
  }, _vm._l(_vm.customBaseLayers, function (baseLayer) {
    return _c('option', {
      key: baseLayer.dbkey,
      domProps: {
        "value": baseLayer.dbkey
      }
    }, [_vm._v(" " + _vm._s(baseLayer.label) + " ")]);
  }), 0)])])])])])])])])]), _c('div', {
    staticClass: "helper floater"
  }, [_c('help-content', {
    attrs: {
      "reference": 'map.globe',
      "toggle": "",
      "dropup": ""
    }
  })], 1), _c('div', {
    staticClass: "map",
    attrs: {
      "id": "map"
    }
  })]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "field-label is-normal"
  }, [_c('label', {
    staticClass: "label has-text-white"
  }, [_vm._v(" Map Type ")])]);
}];

// EXTERNAL MODULE: ./node_modules/ol/Map.js + 40 modules
var Map = __webpack_require__(98251);
// EXTERNAL MODULE: ./node_modules/ol/View.js + 3 modules
var View = __webpack_require__(68436);
// EXTERNAL MODULE: ./node_modules/ol/layer/Tile.js
var Tile = __webpack_require__(92422);
// EXTERNAL MODULE: ./node_modules/ol/source/XYZ.js
var XYZ = __webpack_require__(6553);
// EXTERNAL MODULE: ./node_modules/olcs/lib/olcs/OLCesium.js + 33 modules
var OLCesium = __webpack_require__(65674);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(77449);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/map/views/CesiumMap.vue?vue&type=script&lang=js





/* harmony default export */ var CesiumMapvue_type_script_lang_js = ({
  name: 'CesiumMap',
  components: {
    HelpContent: helpcontent/* default */.A
  },
  data() {
    return {
      mapType: 'SATELLITEWITHLABELS',
      olMap: null,
      customBaseLayers: [{
        label: 'Map',
        dbkey: 'MAP',
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      }, {
        label: 'Satellite',
        dbkey: 'SATELLITE',
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      }, {
        label: 'Satellite with Labels',
        dbkey: 'SATELLITEWITHLABELS',
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      }],
      mapBaseLayers: [],
      ol3dMap: null
    };
  },
  mounted() {
    // Keyless basemap layers for local evaluation.
    for (let layerIndex = 0; layerIndex < this.customBaseLayers.length; layerIndex++) {
      this.mapBaseLayers.push(new Tile/* default */.A({
        visible: false,
        preload: 4,
        source: new XYZ/* default */.A({
          crossOrigin: 'anonymous',
          url: this.customBaseLayers[layerIndex].url
        })
      }));
    }
    // Init Map
    this.olMap = new Map/* default */.A({
      layers: [...this.mapBaseLayers],
      target: document.getElementById('map'),
      view: new View/* default */.Ay({
        center: [-0, 0],
        zoom: 2.5,
        maxZoom: 20
      })
    });
    this.ol3dMap = new OLCesium/* default */.A({
      map: this.olMap
    }); // ol2dMap is the ol.Map instance
    this.ol3dMap.setEnabled(true);
    this.updateMapBaseLayer();
  },
  methods: {
    updateMapBaseLayer() {
      for (let i = 0; i < this.mapBaseLayers.length; i++) {
        this.mapBaseLayers[i].setVisible(this.customBaseLayers[i].dbkey === this.mapType);
      }
      this.updateCesiumImagery();
    },
    updateCesiumImagery() {
      if (!this.ol3dMap || !window.Cesium) return;
      const baseLayer = this.customBaseLayers.find(layer => layer.dbkey === this.mapType);
      if (!baseLayer) return;
      const scene = this.ol3dMap.getCesiumScene();
      const layers = scene.imageryLayers;
      while (layers.length > 0) layers.remove(layers.get(0), false);
      layers.addImageryProvider(new window.Cesium.UrlTemplateImageryProvider({
        url: baseLayer.url.replace('{a-c}', 'a'),
        credit: baseLayer.label
      }));
    }
  }
});
;// ./src/map/views/CesiumMap.vue?vue&type=script&lang=js
 /* harmony default export */ var views_CesiumMapvue_type_script_lang_js = (CesiumMapvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/map/views/CesiumMap.vue?vue&type=style&index=0&id=8203cbf2&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/map/views/CesiumMap.vue?vue&type=style&index=0&id=8203cbf2&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/map/views/CesiumMap.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  views_CesiumMapvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "8203cbf2",
  null
  
)

/* harmony default export */ var CesiumMap = (component.exports);

/***/ })

}]);