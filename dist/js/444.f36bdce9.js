(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[444],{

/***/ 57906:
/***/ (function(module) {


    var doc = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mediaNoiseLevels"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mediaNoiseLevels"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"postRate"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"feeds"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"value"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"bounding"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"geojson"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"filterTags"},"arguments":[],"directives":[]}]}}]}},{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mapInts"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mapInts"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"value"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}]}}]}},{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMediaNoiseLevel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaNoiseLevelCreateInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMediaNoiseLevel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"postRate"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"feeds"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"bounding"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"geojson"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"filterTags"},"arguments":[],"directives":[]}]}}]}},{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMediaNoiseLevel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaNoiseLevelUpdateInput"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaNoiseLevelWhereUniqueInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMediaNoiseLevel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"postRate"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"feeds"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"value"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"bounding"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"geojson"},"arguments":[],"directives":[]}]}},{"kind":"Field","name":{"kind":"Name","value":"filterTags"},"arguments":[],"directives":[]}]}}]}},{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMediaNoiseLevel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NoiseAttributeWhereUniqueInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMediaNoiseLevel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}]}},{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMapInt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MapIntCreateInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMapInt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"value"},"arguments":[],"directives":[]}]}}]}},{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMapInt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MapIntUpdateInput"}}},"directives":[]},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MapIntWhereUniqueInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMapInt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"value"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}]}}]}},{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMediaMarkovSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaMarkovSourceCreateInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMediaMarkovSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"sourceText"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}]}}]}},{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MediaMarkovSource"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mediaMarkovSources"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"sourceText"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"arguments":[],"directives":[]}]}}]}}]}},{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMediaMarkovSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaMarkovSourceWhereUniqueInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMediaMarkovSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"},"arguments":[],"directives":[]}]}}]}}],"loc":{"start":0,"end":1616}};
    doc.loc.source = {"body":"query mediaNoiseLevels {\n  mediaNoiseLevels {\n    id\n    name\n    postRate\n    feeds {\n      key\n      value\n    }\n    bounding {\n      geojson\n    }\n    filterTags\n  }\n}\n\nquery mapInts {\n  mapInts {\n    key\n    value\n    attributes {\n      name\n    }\n  }\n}\n\nmutation createMediaNoiseLevel($data: MediaNoiseLevelCreateInput!) {\n  createMediaNoiseLevel(data: $data) {\n    name\n    postRate\n    feeds\n    bounding {\n      geojson\n    }\n    filterTags\n  }\n}\n\nmutation updateMediaNoiseLevel(\n  $data: MediaNoiseLevelUpdateInput!\n  $where: MediaNoiseLevelWhereUniqueInput!\n) {\n  updateMediaNoiseLevel(data: $data, where: $where) {\n    id\n    name\n    postRate\n    feeds {\n      key\n      value\n    }\n    bounding {\n      geojson\n    }\n    filterTags\n  }\n}\n\nmutation deleteMediaNoiseLevel($where: NoiseAttributeWhereUniqueInput!) {\n  deleteMediaNoiseLevel(where: $where) {\n    id\n    name\n  }\n}\n\nmutation createMapInt($data: MapIntCreateInput!) {\n  createMapInt(data: $data) {\n    key\n    value\n  }\n}\n\nmutation updateMapInt(\n  $data: MapIntUpdateInput!\n  $where: MapIntWhereUniqueInput!\n) {\n  updateMapInt(data: $data, where: $where) {\n    key\n    value\n    attributes {\n      name\n    }\n  }\n}\n\nmutation CreateMediaMarkovSource($data: MediaMarkovSourceCreateInput!) {\n  createMediaMarkovSource(data: $data) {\n    key\n    sourceText\n    attributes {\n      name\n    }\n  }\n}\n\nquery MediaMarkovSource {\n  mediaMarkovSources {\n    key\n    sourceText\n    attributes {\n      name\n    }\n  }\n}\n\nmutation DeleteMediaMarkovSource($where: MediaMarkovSourceWhereUniqueInput!) {\n  deleteMediaMarkovSource(where: $where) {\n    key\n  }\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = (/* unused pure expression or super */ null && ({}));
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }
    }

    var definitionRefs = {};
    (function extractReferences() {
      doc.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences(def, refs);
          definitionRefs[def.name.value] = refs;
        }
      });
    })();

    function findOperation(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set();

      // IE 11 doesn't support "new Set(iterable)", so we add the members of opRefs to newRefs one by one
      opRefs.forEach(function(refName) {
        newRefs.add(refName);
      });

      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }
    
    module.exports = doc;
    
        module.exports.mediaNoiseLevels = oneQuery(doc, "mediaNoiseLevels");
        
        module.exports.mapInts = oneQuery(doc, "mapInts");
        
        module.exports.createMediaNoiseLevel = oneQuery(doc, "createMediaNoiseLevel");
        
        module.exports.updateMediaNoiseLevel = oneQuery(doc, "updateMediaNoiseLevel");
        
        module.exports.deleteMediaNoiseLevel = oneQuery(doc, "deleteMediaNoiseLevel");
        
        module.exports.createMapInt = oneQuery(doc, "createMapInt");
        
        module.exports.updateMapInt = oneQuery(doc, "updateMapInt");
        
        module.exports.CreateMediaMarkovSource = oneQuery(doc, "CreateMediaMarkovSource");
        
        module.exports.MediaMarkovSource = oneQuery(doc, "MediaMarkovSource");
        
        module.exports.DeleteMediaMarkovSource = oneQuery(doc, "DeleteMediaMarkovSource");
        


/***/ }),

/***/ 73444:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Noise; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/Noise.vue?vue&type=template&id=06d4b1e4&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "container",
    attrs: {
      "id": "noise"
    }
  }, [_c('breadcrumb'), _c('nav', {
    staticClass: "level"
  }, [_vm._m(0), _c('div', {
    staticClass: "level-right"
  }, [_c('help-content', {
    attrs: {
      "reference": 'media.noise',
      "toggle": "",
      "dropdown": ""
    }
  })], 1)]), _c('div', {
    staticClass: "columns is-mobile is-multiline"
  }, [_c('div', {
    staticClass: "column is-6-desktop is-6-tablet is-12-mobile"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(1), _c('nav', {
    staticClass: "level"
  }, [_vm._m(2), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_vm._v(" " + _vm._s(_vm.noiseConfig.postRateValue) + " ")])])]), _vm.noiseConfig.postRateValue !== null ? _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.noiseConfig.postRateValue,
      expression: "noiseConfig.postRateValue"
    }],
    staticClass: "slider is-fullwidth is-large is-primary",
    attrs: {
      "type": "range",
      "min": "0",
      "max": "1000",
      "value": "1",
      "step": "1"
    },
    domProps: {
      "value": _vm.noiseConfig.postRateValue
    },
    on: {
      "change": _vm.saveProfile,
      "__r": function ($event) {
        return _vm.$set(_vm.noiseConfig, "postRateValue", $event.target.value);
      }
    }
  }) : _vm._e()])])]), _c('div', {
    staticClass: "column"
  }, [_c('post-count', {
    attrs: {
      "type": "Posted"
    }
  })], 1)]), _c('div', {
    staticClass: "columns is-mobile is-multiline"
  }, [_c('div', {
    staticClass: "column is-6-desktop is-6-tablet is-12-mobile"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "columns is-mobile"
  }, [_c('div', {
    staticClass: "column"
  }, [_vm._m(3), _vm._l(_vm.noiseConfig.feedList, function (feeds, index) {
    return _c('div', {
      key: feeds.key
    }, [_c('label', [_vm._v(_vm._s(_vm.filterName(feeds.key.substring(5, 100))) + " ")]), _c('i', {
      staticClass: "fa fa-circle",
      style: 'color:' + _vm.noiseConfig.colorList[index],
      attrs: {
        "aria-hidden": "true"
      }
    }), _c('br'), _c('div', {
      staticClass: "level"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.tempFeedList[index],
        expression: "tempFeedList[index]"
      }],
      staticClass: "slider is-fullwidth has-output",
      attrs: {
        "type": "range",
        "min": "0",
        "max": "100",
        "value": "1",
        "step": "1"
      },
      domProps: {
        "value": _vm.tempFeedList[index]
      },
      on: {
        "change": function ($event) {
          return _vm.changeMapInt(index, feeds.key);
        },
        "__r": function ($event) {
          return _vm.$set(_vm.tempFeedList, index, $event.target.value);
        }
      }
    }), _c('span', [_c('b', [_vm._v(_vm._s(_vm.tempFeedList[index].toString().substr(0, 4)) + " "), _c('i', {
      staticClass: "fas fa-percent"
    })])])])]);
  })], 2), _c('div', {
    staticClass: "column"
  }, [_c('svg', {
    staticClass: "donut",
    attrs: {
      "width": "100%",
      "height": "100%",
      "viewBox": "0 0 42 42"
    }
  }, [_c('circle', {
    staticClass: "donut-hole",
    attrs: {
      "cx": "21",
      "cy": "21",
      "r": "15.91549430918954",
      "fill": "#fff"
    }
  }), _c('circle', {
    staticClass: "donut-ring",
    attrs: {
      "cx": "21",
      "cy": "21",
      "r": "15.91549430918954",
      "fill": "transparent",
      "stroke": "#d2d3d4",
      "stroke-width": "10"
    }
  }), _vm._l(_vm.noiseConfig.feedDashArray, function (percents, index) {
    return _c('circle', {
      key: index,
      staticClass: "donut-segment",
      attrs: {
        "cx": "21",
        "cy": "21",
        "r": "15.91549430918954",
        "fill": "transparent",
        "stroke": _vm.noiseConfig.colorList[index],
        "stroke-width": "10",
        "stroke-dasharray": percents,
        "stroke-dashoffset": _vm.noiseConfig.feedOffsetArray[index]
      }
    });
  })], 2)])])])])]), _c('div', {
    staticClass: "column is-6-desktop is-6-tablet is-12-mobile"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "columns is-mobile"
  }, [_c('div', {
    staticClass: "column"
  }, [_vm._m(4), _vm._l(_vm.noiseConfig.serviceList, function (feeds, index) {
    return _c('div', {
      key: feeds.key
    }, [_c('label', [_vm._v(_vm._s(feeds.key.substring(8, 100)) + " ")]), _c('i', {
      staticClass: "fa fa-circle",
      style: 'color:' + _vm.noiseConfig.colorList[index],
      attrs: {
        "aria-hidden": "true"
      }
    }), _c('br'), _c('div', {
      staticClass: "level"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.tempServiceList[index],
        expression: "tempServiceList[index]"
      }],
      staticClass: "slider is-fullwidth has-output",
      attrs: {
        "type": "range",
        "min": "0",
        "max": "100",
        "value": "1",
        "step": "1"
      },
      domProps: {
        "value": _vm.tempServiceList[index]
      },
      on: {
        "change": function ($event) {
          return _vm.changeMapInt(index, feeds.key);
        },
        "__r": function ($event) {
          return _vm.$set(_vm.tempServiceList, index, $event.target.value);
        }
      }
    }), _c('span', [_c('b', [_vm._v(_vm._s(_vm.tempServiceList[index].toString().substr(0, 4)) + " "), _c('i', {
      staticClass: "fas fa-percent"
    })])])])]);
  })], 2), _c('div', {
    staticClass: "column"
  }, [_c('svg', {
    staticClass: "donut",
    attrs: {
      "width": "100%",
      "height": "100%",
      "viewBox": "0 0 42 42"
    }
  }, [_c('circle', {
    staticClass: "donut-hole",
    attrs: {
      "cx": "21",
      "cy": "21",
      "r": "15.91549430918954",
      "fill": "#fff"
    }
  }), _c('circle', {
    staticClass: "donut-ring",
    attrs: {
      "cx": "21",
      "cy": "21",
      "r": "15.91549430918954",
      "fill": "transparent",
      "stroke": "#d2d3d4",
      "stroke-width": "10"
    }
  }), _vm._l(_vm.noiseConfig.serviceDashArray, function (percents, index) {
    return _c('circle', {
      key: index,
      staticClass: "donut-segment",
      attrs: {
        "cx": "21",
        "cy": "21",
        "r": "15.91549430918954",
        "fill": "transparent",
        "stroke": _vm.noiseConfig.colorList[index],
        "stroke-width": "10",
        "stroke-dasharray": percents,
        "stroke-dashoffset": _vm.noiseConfig.serviceOffsetArray[index]
      }
    });
  })], 2)])])])])])]), _c('div', {
    staticClass: "columns is-mobile is-multiline"
  }, [_c('div', {
    staticClass: "column is-6-desktop is-6-tablet is-12-mobile"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(5), _vm.tagList != '' ? _c('div', {
    staticClass: "field is-grouped is-grouped-multiline"
  }, _vm._l(_vm.tagList, function (tags) {
    return _c('div', {
      key: tags,
      staticClass: "control"
    }, [_c('div', {
      staticClass: "tags has-addons"
    }, [_c('span', {
      staticClass: "tag is-primary"
    }, [_vm._v(_vm._s(tags))]), _c('a', {
      staticClass: "tag is-delete is-primary",
      on: {
        "click": function ($event) {
          return _vm.deleteTag(tags);
        }
      }
    })])]);
  }), 0) : _vm._e(), _c('div', {
    staticClass: "columns is-mobile"
  }, [_c('div', {
    staticClass: "column is-10"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.tagInput,
      expression: "tagInput"
    }],
    staticClass: "input",
    attrs: {
      "type": "text",
      "placeholder": "Text input"
    },
    domProps: {
      "value": _vm.tagInput
    },
    on: {
      "keyup": function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.addTag.apply(null, arguments);
      },
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.tagInput = $event.target.value;
      }
    }
  })]), _c('div', {
    staticClass: "column is-2"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": _vm.addTag
    }
  }, [_vm._v(" Add ")])])])]), _c('footer', {
    staticClass: "modal-card-foot"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.saveProfile();
      }
    }
  }, [_vm._v(" Save ")])])]), _c('br'), _c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(6), _c('div', [_c('MapLocationPicker', {
    attrs: {
      "drawType": 'Box'
    },
    model: {
      value: _vm.noiseConfig.bounding,
      callback: function ($$v) {
        _vm.$set(_vm.noiseConfig, "bounding", $$v);
      },
      expression: "noiseConfig.bounding"
    }
  })], 1)]), _c('footer', {
    staticClass: "modal-card-foot"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.saveProfile();
      }
    }
  }, [_vm._v(" Save ")]), _c('a', {
    staticClass: "button is-inverted",
    on: {
      "click": function ($event) {
        return _vm.downloadKML();
      }
    }
  }, [_vm._v(" Download KML ")])])])]), _c('div', {
    staticClass: "column is-6-desktop is-6-tablet is-12-mobile"
  }, [_c('RecentPosts')], 1)])], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', {
    staticClass: "label"
  }, [_vm._v(" Post Rate "), _c('span', {
    staticClass: "icon is-small tooltip is-tooltip-right",
    attrs: {
      "data-tooltip": "Drag the slider right to increase noise. To stop or decrease noise, slide to 0."
    }
  }, [_c('i', {
    staticClass: "far fa-question-circle"
  })])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_vm._v(" Noise posts per hour ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', {
    staticClass: "label"
  }, [_vm._v("Source type "), _c('span', {
    staticClass: "icon is-small tooltip is-tooltip-right",
    attrs: {
      "data-tooltip": "Control source types with a Live feed that pulls from the selected location and uploaded sources."
    }
  }, [_c('i', {
    staticClass: "far fa-question-circle"
  })])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', {
    staticClass: "label"
  }, [_vm._v("Sites "), _c('span', {
    staticClass: "icon is-small tooltip is-tooltip-right",
    attrs: {
      "data-tooltip": "Control the ratio of sites for noise posts."
    }
  }, [_c('i', {
    staticClass: "far fa-question-circle"
  })])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', {
    staticClass: "label"
  }, [_vm._v("Live Feed Keywords "), _c('span', {
    staticClass: "icon is-small tooltip is-tooltip-bottom",
    attrs: {
      "data-tooltip": "Add keywords to pull in noise from anywhere."
    }
  }, [_c('i', {
    staticClass: "far fa-question-circle"
  })])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', {
    staticClass: "label"
  }, [_vm._v("Location Bounds "), _c('span', {
    staticClass: "icon is-small tooltip is-tooltip-right",
    attrs: {
      "data-tooltip": "Select the source location for your live feed."
    }
  }, [_c('i', {
    staticClass: "far fa-question-circle"
  })])]);
}];

// EXTERNAL MODULE: ./src/media/components/widgets/post-count.vue + 3 modules
var post_count = __webpack_require__(12357);
// EXTERNAL MODULE: ./src/shared/components/maplocationpicker.vue + 5 modules
var maplocationpicker = __webpack_require__(17440);
;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/recentposts.vue?vue&type=template&id=3295d1f3
var recentpostsvue_type_template_id_3295d1f3_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', [_vm._m(0), _vm.mediaPosts ? _c('div', [_vm._l(_vm.mediaPosts, function (post) {
    return [_c('post-card', {
      key: post.id,
      attrs: {
        "post": post,
        "showQuickMenu": false
      }
    })];
  })], 2) : _vm._e()]);
};
var recentpostsvue_type_template_id_3295d1f3_staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', {
    staticClass: "label"
  }, [_vm._v(" Recent Posts "), _c('span', {
    staticClass: "tooltip is-tooltip-right",
    attrs: {
      "data-tooltip": "Shows the 5 most recent posts added by the noise generation"
    }
  }, [_c('i', {
    staticClass: "far fa-question-circle"
  })])]);
}];

// EXTERNAL MODULE: ./src/media/graphql/MediaPosts.gql
var MediaPosts = __webpack_require__(36731);
// EXTERNAL MODULE: ./src/shared/mixins/processText.js + 1 modules
var processText = __webpack_require__(81496);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(34601);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/recentposts.vue?vue&type=script&lang=js



/* harmony default export */ var recentpostsvue_type_script_lang_js = ({
  name: 'RecentPosts',
  props: {
    postNum: {
      default: 5
    }
  },
  mixins: [processText/* default */.A, helpers/* default */.A],
  apollo: {
    mediaPosts: {
      query: MediaPosts.MediaPostsRead,
      variables() {
        return {
          where: {
            isPublished: true,
            isUserGenerated: false
          },
          orderBy: 'publishTime_DESC',
          first: this.postNum
        };
      },
      subscribeToMore: {
        document: MediaPosts.MediaPostsSubscription,
        variables() {
          return {
            where: {
              node: {
                isPublished: true,
                isUserGenerated: false
              }
            }
          };
        },
        updateQuery: (previousResult, {
          subscriptionData
        }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.mediaPost.mutation;
          let newResult;
          switch (mutationIn) {
            case 'CREATED':
              {
                newResult = {
                  mediaPosts: [subscriptionData.data.mediaPost.node, ...previousResult.mediaPosts]
                };
                break;
              }
            case 'DELETED':
              {
                newResult = {
                  mediaPosts: [...previousResult.mediaPosts.filter(obj => subscriptionData.data.mediaPost.previousValues.id !== obj.id)]
                };
                break;
              }
            case 'UPDATED':
              {
                let newMediaPosts = JSON.parse(JSON.stringify(previousResult.mediaPosts));
                newMediaPosts.push(subscriptionData.data.mediaPost.node);
                newMediaPosts.sort(function (a, b) {
                  let dateA = new Date(a.publishTime);
                  let dateB = new Date(b.publishTime);
                  return dateB - dateA;
                });
                newMediaPosts = newMediaPosts.slice(0, 5);
                newResult = {
                  mediaPosts: newMediaPosts
                };
                break;
              }
            default:
              {
                throw new Error(`Unknown mediaPost mutation`);
              }
          }
          return newResult;
        }
      },
      error(error) {
        console.error(error);
      }
    }
  }
});
;// ./src/media/components/recentposts.vue?vue&type=script&lang=js
 /* harmony default export */ var components_recentpostsvue_type_script_lang_js = (recentpostsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/components/recentposts.vue





/* normalize component */
;
var component = (0,componentNormalizer/* default */.A)(
  components_recentpostsvue_type_script_lang_js,
  recentpostsvue_type_template_id_3295d1f3_render,
  recentpostsvue_type_template_id_3295d1f3_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var recentposts = (component.exports);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(77449);
;// ./src/shared/utils/kml.js
function escapeXml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function coordinateString(ring) {
  return ring.map(point => `${Number(point[0])},${Number(point[1])},0`).join(' ');
}
function polygonKml(polygon) {
  const coordinates = polygon.coordinates || [];
  const outerRing = coordinates[0] || [];
  const innerRings = coordinates.slice(1);
  return `<Polygon><outerBoundaryIs><LinearRing><coordinates>${coordinateString(outerRing)}</coordinates></LinearRing></outerBoundaryIs>${innerRings.map(ring => `<innerBoundaryIs><LinearRing><coordinates>${coordinateString(ring)}</coordinates></LinearRing></innerBoundaryIs>`).join('')}</Polygon>`;
}
function geojsonToKml(geojson, name = 'EPIC export') {
  if (!geojson) {
    throw new Error('GeoJSON is required for this export.');
  }
  if (geojson.type === 'Box' && Array.isArray(geojson.coordinates)) {
    const [west, south, east, north] = geojson.coordinates.map(Number);
    geojson = {
      type: 'Polygon',
      coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]]
    };
  }
  if (geojson.type !== 'Polygon') {
    throw new Error('Only Polygon and Box GeoJSON are supported for this export.');
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
</kml>`;
}
// EXTERNAL MODULE: ./node_modules/file-saver/dist/FileSaver.min.js
var FileSaver_min = __webpack_require__(4213);
// EXTERNAL MODULE: ./src/media/graphql/noiseProfiles.gql
var noiseProfiles = __webpack_require__(57906);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/Noise.vue?vue&type=script&lang=js






// geojson to kml and then save as file



/* harmony default export */ var Noisevue_type_script_lang_js = ({
  name: 'noise',
  mixins: [helpers/* default */.A],
  components: {
    HelpContent: helpcontent/* default */.A,
    PostCount: post_count/* default */.A,
    MapLocationPicker: maplocationpicker/* default */.A,
    RecentPosts: recentposts
  },
  apollo: {
    allNoiseProfiles: {
      query: noiseProfiles.mediaNoiseLevels,
      update(data) {
        if (data.mediaNoiseLevels && data.mediaNoiseLevels.length > 0) {
          this.loadProfile(data.mediaNoiseLevels[0]);
        }
        return data.noiseAttributes;
      },
      error(error) {
        console.error(error);
      }
    }
  },
  data() {
    return {
      allNoiseProfiles: {},
      tagList: [],
      tagInput: null,
      noiseConfig: {
        feedList: [],
        serviceList: [],
        postRateValue: null,
        bounding: null,
        previousBounding: null,
        tags: '',
        feedDashArray: [],
        feedOffsetArray: [],
        serviceDashArray: [],
        serviceOffsetArray: [],
        colorList: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2']
      },
      tempFeedList: [],
      tempServiceList: []
    };
  },
  methods: {
    filterName(name) {
      if (name.includes('markov')) {
        return 'bot';
      }
      return name;
    },
    loadProfile(profile) {
      this.noiseConfig.feedList = [];
      this.noiseConfig.serviceList = [];
      this.tempServiceList = [];
      this.tempFeedList = [];
      if (profile) {
        if (profile.feeds) {
          for (let i = 0; i < profile.feeds.length; i++) {
            if (profile.feeds[i].key.substring(0, 4) === 'feed') {
              this.noiseConfig.feedList.push(profile.feeds[i]);
              this.tempFeedList.push(profile.feeds[i].value);
              // this.noiseConfig.colorList.push('#' + Math.floor(Math.random() * 16777215).toString(16))
            } else if (profile.feeds[i].key.substring(0, 7) === 'service') {
              this.noiseConfig.serviceList.push(profile.feeds[i]);
              this.tempServiceList.push(profile.feeds[i].value);
              // this.noiseConfig.colorList.push('#' + Math.floor(Math.random() * 16777215).toString(16))
            }
          }
        }
        this.noiseConfig.postRateValue = profile.postRate;
        if (profile.bounding) {
          this.noiseConfig.previousBounding = profile.bounding;
          this.noiseConfig.bounding = JSON.parse(JSON.stringify(profile.bounding), this.omitTypename);
        }
        if (profile.filterTags && profile.filterTags.length > 0) {
          this.tagList = profile.filterTags.split(',');
        }
      }
      this.updateTagString();
      this.calcFeedPercents();
      this.calcServicePercents();
    },
    calcFeedPercents() {
      let total = 0;
      let tempFeedPercents = [];
      this.noiseConfig.feedDashArray = [];
      this.noiseConfig.feedOffsetArray = [];
      for (let i = 0; i < this.tempFeedList.length; i++) {
        total = total + parseInt(this.tempFeedList[i]);
        if (i === this.tempFeedList.length - 1) {
          for (let j = 0; j < this.tempFeedList.length; j++) {
            tempFeedPercents.push(parseInt(this.tempFeedList[j]) / total * 100);
          }
        }
      }
      let tempOffset = 0;
      for (let i = 0; i < tempFeedPercents.length; i++) {
        this.noiseConfig.feedDashArray.push(tempFeedPercents[i] + ' ' + (100 - tempFeedPercents[i]).toString());
        if (i === 0) {
          tempOffset = 25;
        } else {
          tempOffset = tempOffset + tempFeedPercents[i];
        }
        this.noiseConfig.feedOffsetArray.push(tempOffset);
      }
    },
    calcServicePercents() {
      let total = 0;
      let tempServicePercents = [];
      this.noiseConfig.serviceDashArray = [];
      this.noiseConfig.serviceOffsetArray = [];
      for (let i = 0; i < this.tempServiceList.length; i++) {
        total = total + parseInt(this.tempServiceList[i]);
        if (i === this.tempServiceList.length - 1) {
          for (let j = 0; j < this.tempServiceList.length; j++) {
            tempServicePercents.push(parseInt(this.tempServiceList[j]) / total * 100);
          }
        }
      }
      let tempOffset = 0;
      for (let i = 0; i < tempServicePercents.length; i++) {
        this.noiseConfig.serviceDashArray.push(tempServicePercents[i] + ' ' + (100 - tempServicePercents[i]).toString());
        if (i === 0) {
          tempOffset = 25;
        } else {
          tempOffset = tempOffset + tempServicePercents[i];
        }
        this.noiseConfig.serviceOffsetArray.push(tempOffset);
      }
    },
    changeMapInt(changedIndex, key) {
      if (key.substring(0, 4) === 'feed') {
        this.tempFeedList = this.updateSliderArray(parseInt(this.tempFeedList[changedIndex]), this.tempFeedList, changedIndex);
        this.updateAllSources();
      }
      if (key.substring(0, 7) === 'service') {
        this.tempServiceList = this.updateSliderArray(parseInt(this.tempServiceList[changedIndex]), this.tempServiceList, changedIndex);
        this.updateAllServices();
      }
      this.$forceUpdate();
    },
    updateAllServices() {
      if (this.noiseConfig && this.noiseConfig.serviceList) {
        for (let i = 0; i < this.noiseConfig.serviceList.length; i++) {
          this.$apollo.mutate({
            mutation: noiseProfiles.updateMapInt,
            variables: {
              data: {
                value: parseInt(this.tempServiceList[i])
              },
              where: {
                key: this.noiseConfig.serviceList[i].key
              }
            }
          }).then(() => {
            this.calcServicePercents();
          }).catch(error => {
            console.error('failed mapInt change: ' + error);
          });
        }
      }
    },
    updateAllSources() {
      if (this.noiseConfig && this.noiseConfig.feedList) {
        for (let i = 0; i < this.noiseConfig.feedList.length; i++) {
          this.$apollo.mutate({
            mutation: noiseProfiles.updateMapInt,
            variables: {
              data: {
                value: parseInt(this.tempFeedList[i])
              },
              where: {
                key: this.noiseConfig.feedList[i].key
              }
            }
          }).then(() => {
            this.calcFeedPercents();
          }).catch(error => {
            console.error('failed mapInt change: ' + error);
          });
        }
      }
    },
    updateSliderArray(newValue, inputArray, changedIndex) {
      let otherTotal = 0;
      if (inputArray) {
        for (let i = 0; i < inputArray.length; i++) {
          if (i === changedIndex) {
            // do nothing
          } else {
            otherTotal += parseInt(inputArray[i]);
          }
        }
        for (let i = 0; i < inputArray.length; i++) {
          if (i === changedIndex) {
            // inputArray[i] = newValue
          } else {
            if (otherTotal === 0) {
              let tempPercent = 1 / (inputArray.length - 1);
              let temp = (100 - parseInt(newValue)) * tempPercent;
              inputArray[i] = parseInt(Math.ceil(temp));
            } else {
              let tempPercent = parseInt(inputArray[i]) / parseInt(otherTotal);
              let temp = (100 - parseInt(inputArray[changedIndex])) * tempPercent;
              inputArray[i] = parseInt(Math.ceil(temp));
            }
          }
        }
        return inputArray;
      } else {
        return [];
      }
    },
    addTag() {
      this.tagList.push(this.tagInput);
      this.updateTagString();
      this.tagInput = null;
    },
    deleteTag(tag) {
      let index = this.tagList.indexOf(tag);
      this.tagList.splice(index, 1);
      this.updateTagString();
    },
    updateTagString() {
      let temp = '';
      for (let i = 0; i < this.tagList.length; i++) {
        if (i === this.tagList.length - 1) {
          temp = temp + this.tagList[i];
        } else {
          temp = temp + this.tagList[i] + ',';
        }
      }
      this.noiseConfig.tags = temp;
    },
    saveProfile() {
      let data = {
        postRate: parseInt(this.noiseConfig.postRateValue),
        filterTags: this.noiseConfig.tags
      };
      let dbMapData;
      if (this.noiseConfig.bounding !== null) {
        if (this.noiseConfig.previousBounding !== null) {
          //update
          dbMapData = {
            bounding: {
              update: this.noiseConfig.bounding
            }
          };
        } else {
          //create
          dbMapData = {
            bounding: {
              create: this.noiseConfig.bounding
            }
          };
        }
      } else {
        if (this.noiseConfig.previousBounding !== null) {
          // delete location
          dbMapData = {
            bounding: {
              delete: true
            }
          };
          this.noiseConfig.previousBounding = null;
        }
      }
      if (dbMapData) {
        data = Object.assign(data, dbMapData);
      }
      this.$apollo.mutate({
        mutation: noiseProfiles.updateMediaNoiseLevel,
        variables: {
          data: data,
          where: {
            name: 'noiselevel'
          }
        }
      }).then(data => {
        if (data) this.$buefy.toast.open({
          message: 'Saving...',
          type: 'is-success'
        });
      }).catch(error => {
        this.$buefy.toast.open({
          message: 'Save noise failed',
          type: 'is-danger'
        });
        console.error('failed save noise: ' + error);
      });
    },
    downloadKML() {
      try {
        let geojson = this.noiseConfig.bounding && this.noiseConfig.bounding.geojson;
        if (!geojson) {
          throw new Error('Noise bounds are not set.');
        }
        let kml = geojsonToKml(geojson, 'EPIC noise bounds');
        let blob = new Blob([kml], {
          type: 'application/vnd.google-earth.kml+xml'
        });
        (0,FileSaver_min.saveAs)(blob, 'noise_bounds.kml');
      } catch (error) {
        this.$buefy.toast.open({
          message: 'Download KML failed',
          type: 'is-danger'
        });
        console.error('failed KML export: ' + error);
      }
    }
  }
});
;// ./src/media/views/Noise.vue?vue&type=script&lang=js
 /* harmony default export */ var views_Noisevue_type_script_lang_js = (Noisevue_type_script_lang_js); 
;// ./src/media/views/Noise.vue





/* normalize component */
;
var Noise_component = (0,componentNormalizer/* default */.A)(
  views_Noisevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "06d4b1e4",
  null
  
)

/* harmony default export */ var Noise = (Noise_component.exports);

/***/ }),

/***/ 4213:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(a,b){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else // removed by dead control flow
{}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof __webpack_require__.g&&__webpack_require__.g.global===__webpack_require__.g?__webpack_require__.g:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g, true&&(module.exports=g)});

//# sourceMappingURL=FileSaver.min.js.map

/***/ })

}]);