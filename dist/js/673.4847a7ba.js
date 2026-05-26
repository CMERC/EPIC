(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[673],{

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

/***/ 67673:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ OptionsNoise; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/OptionsNoise.vue?vue&type=template&id=db17e536
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "columns"
  }, [_c('div', {
    staticClass: "column is-three-quarters"
  }, [_vm._m(0), _c('section', {
    staticClass: "section"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model.lazy",
      value: _vm.searchQuery,
      expression: "searchQuery",
      modifiers: {
        "lazy": true
      }
    }],
    staticClass: "input",
    attrs: {
      "type": "text",
      "placeholder": "Search..."
    },
    domProps: {
      "value": _vm.searchQuery
    },
    on: {
      "change": function ($event) {
        _vm.searchQuery = $event.target.value;
      }
    }
  })]), _vm._l(_vm.noiseBots, function (bot, index) {
    return _c('div', {
      key: bot.id,
      staticClass: "level"
    }, [_c('div', {
      staticClass: "columns"
    }, [_c('div', {
      class: _vm.getBackgroundClass(index)
    }, [_vm._m(1, true), _c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.noiseBots[index].name,
        expression: "noiseBots[index].name"
      }],
      staticClass: "input",
      attrs: {
        "type": "text"
      },
      domProps: {
        "value": _vm.noiseBots[index].name
      },
      on: {
        "change": function ($event) {
          return _vm.changeProfile(index);
        },
        "input": function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.noiseBots[index], "name", $event.target.value);
        }
      }
    })]), _c('div', {
      class: _vm.getBackgroundClass(index)
    }, [_vm._m(2, true), _c('p', {
      staticClass: "control has-icons-left"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.noiseBots[index].username,
        expression: "noiseBots[index].username"
      }],
      staticClass: "input",
      attrs: {
        "type": "text"
      },
      domProps: {
        "value": _vm.noiseBots[index].username
      },
      on: {
        "change": function ($event) {
          return _vm.changeProfile(index);
        },
        "input": function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.noiseBots[index], "username", $event.target.value);
        }
      }
    }), _vm._m(3, true)])]), _c('div', {
      class: _vm.getBackgroundClass(index)
    }, [_vm._m(4, true), _c('br'), _c('div', {
      staticClass: "columns"
    }, [_c('div', {
      staticClass: "column"
    }, [_c('div', {
      staticClass: "select"
    }, [_c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.noiseBots[index].language,
        expression: "noiseBots[index].language"
      }],
      on: {
        "change": [function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(_vm.noiseBots[index], "language", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }, function ($event) {
          return _vm.changeProfile(index);
        }]
      }
    }, [_c('option', [_vm._v(_vm._s(_vm.noiseBots[index].language))]), _vm._l(_vm.langNames, function (lang) {
      return _c('option', {
        key: lang
      }, [_vm._v(" " + _vm._s(lang) + " ")]);
    })], 2)])])])]), _c('div', {
      class: _vm.getBackgroundClass(index)
    }, [_c('div', {
      staticClass: "columns"
    }, [_c('div', {
      staticClass: "column"
    }, [_vm._m(5, true), _c('br'), _c('p', [_vm._v(_vm._s(_vm.noiseBots[index].service.name))])]), _c('div', {
      staticClass: "column"
    }, [_c('button', {
      staticClass: "delete is-medium",
      on: {
        "click": function ($event) {
          return _vm.confirmDelete(index);
        }
      }
    })])])])])]);
  })], 2), _c('div', {
    staticClass: "column"
  }, [_vm._m(6), _c('div', {
    staticClass: "file has-name"
  }, [_c('label', {
    staticClass: "file-label"
  }, [_c('input', {
    staticClass: "file-input",
    attrs: {
      "type": "file",
      "name": "resume"
    },
    on: {
      "change": _vm.fileUpload
    }
  }), _vm._m(7), _c('span', {
    staticClass: "file-name"
  }, [_vm._v(" " + _vm._s(_vm.fileName) + " ")])])]), _vm._l(_vm.allSources, function (source, index) {
    return _c('div', {
      key: source.key,
      staticClass: "level"
    }, [_c('p', [_vm._v(_vm._s(source.key))]), _c('button', {
      staticClass: "delete is-medium",
      on: {
        "click": function ($event) {
          return _vm.deleteSource(source.key, index);
        }
      }
    })]);
  })], 2)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "level is-size-3 has-text-centered"
  }, [_c('b', [_vm._v("Bot List")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', [_c('b', [_vm._v("Name")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', [_c('b', [_vm._v("Username")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-small is-left"
  }, [_c('i', {
    staticClass: "fas fa-at"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', [_c('b', [_vm._v("Language")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('label', [_c('b', [_vm._v("Service")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "level is-size-3 has-text-centered"
  }, [_c('b', [_vm._v("Bot (Markov) Sources")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "file-cta"
  }, [_c('span', {
    staticClass: "file-icon"
  }, [_c('i', {
    staticClass: "fas fa-upload"
  })]), _c('span', {
    staticClass: "file-label"
  }, [_vm._v(" Choose a file… ")])]);
}];

// EXTERNAL MODULE: ./src/media/graphql/MediaProfiles.gql
var MediaProfiles = __webpack_require__(14840);
// EXTERNAL MODULE: ./src/media/graphql/noiseProfiles.gql
var noiseProfiles = __webpack_require__(57906);
;// ./src/media/model/languages.js
const languages = {
  Afrikaans: 'af',
  Albanian: 'sq',
  Amharic: 'am',
  Arabic: 'ar',
  Armenian: 'hy',
  Azeerbaijani: 'az',
  Basque: 'eu',
  Belarusian: 'be',
  Bengali: 'bn',
  Bosnian: 'bs',
  Bulgarian: 'bg',
  Catalan: 'ca',
  Cebuano: 'ceb',
  Chinese_simplified: 'zh-CN',
  Chinese_traditional: 'zh-TW',
  Corsican: 'co',
  Croatian: 'hr',
  Czech: 'cs',
  Danish: 'da',
  Dutch: 'nl',
  English: 'en',
  Esperanto: 'eo',
  Estonian: 'et',
  Finnish: 'fi',
  French: 'fr',
  Frisian: 'fy',
  Galician: 'gl',
  Georgian: 'ka',
  German: 'de',
  Greek: 'el',
  Gujarati: 'gu',
  Haitian_Creole: 'ht',
  Hausa: 'ha',
  Hawaiian: 'haw',
  Hebrew: 'iw',
  Hindi: 'hi',
  Hmong: 'hmn',
  Hungarian: 'hu',
  Icelandic: 'is',
  Igbo: 'ig',
  Indonesian: 'id',
  Irish: 'ga',
  Italian: 'it',
  Japanese: 'ja',
  Javanese: 'jw',
  Kannada: 'kn',
  Kazakh: 'kk',
  Khmer: 'km',
  Korean: 'ko',
  Kurdish: 'ku',
  Kyrgyz: 'ky',
  Lao: 'lo',
  Latin: 'la',
  Latvian: 'lv',
  Lithuanian: 'lt',
  Luxembourgish: 'lb',
  Macedonian: 'mk',
  Malagasy: 'mg',
  Malay: 'ms',
  Malayalam: 'ml',
  Maltese: 'mt',
  Maori: 'mi',
  Marathi: 'mr',
  Mongolian: 'mn',
  Myanmar_Burmese: 'my',
  Nepali: 'ne',
  Norwegian: 'no',
  Nyanja: 'ny',
  Pashto: 'ps',
  Persian: 'fa',
  Polish: 'pl',
  Portuguese: 'pt',
  Punjabi: 'pa',
  Romanian: 'ro',
  Russian: 'ru',
  Samoan: 'sm',
  Scots_Gaelic: 'gd',
  Serbian: 'sr',
  Sesotho: 'st',
  Shona: 'sn',
  Sindhi: 'sd',
  Sinhala: 'si',
  Slovak: 'sk',
  Slovenian: 'sl',
  Somali: 'so',
  Spanish: 'es',
  Sudanese: 'su',
  Swahili: 'sw',
  Swedish: 'sv',
  Tagalog: 'tl',
  Tajik: 'tg',
  Tamil: 'ta',
  Telugu: 'te',
  Thai: 'th',
  Turkish: 'tr',
  Ukranian: 'uk',
  Urdu: 'ur',
  Uzbek: 'uz',
  Vietnamese: 'vi',
  Welsh: 'cy',
  Xhosa: 'xh',
  Yiddish: 'yi',
  Yoruba: 'yo',
  Zulu: 'zu'
};
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/OptionsNoise.vue?vue&type=script&lang=js



/* harmony default export */ var OptionsNoisevue_type_script_lang_js = ({
  name: 'noiseoptions',
  apollo: {
    allNoiseBots: {
      query: MediaProfiles.MediaProfilesRead,
      variables() {
        return {
          where: {
            isUserGenerated: false,
            OR: [{
              name_contains: this.searchQuery
            }, {
              username_contains: this.searchQuery
            }, {
              description_contains: this.searchQuery
            }, {
              language_contains: this.searchQuery
            }, {
              service: {
                name: this.searchQuery
              }
            }]
          },
          first: 20
        };
      },
      update(data) {
        this.initialBots(data.mediaProfiles);
        return data.mediaProfiles;
      }
    },
    allMarkovSources: {
      query: noiseProfiles.MediaMarkovSource,
      variables: {},
      update(data) {
        this.initialSources(data.mediaMarkovSources);
        return data.mediaMarkovSources;
      }
    }
  },
  data() {
    return {
      searchQuery: '',
      noiseBots: {},
      allSources: {},
      languageOpts: languages,
      langNames: [],
      fileName: ''
    };
  },
  methods: {
    initialBots(bots) {
      this.noiseBots = JSON.parse(JSON.stringify(bots));
      // make a copy to overwrite obj
      this.languageOpts = languages;
      this.langNames = Object.keys(this.languageOpts);
    },
    initialSources(sources) {
      this.allSources = JSON.parse(JSON.stringify(sources));
    },
    fileUpload(event) {
      let reader = new FileReader();
      let extension = event.target.files[0].name.split('.').pop();
      reader.onload = () => {
        if (extension != 'txt' && extension != 'csv') {
          this.$buefy.toast.open({
            message: 'Invalid File Type',
            type: 'is-danger'
          });
        } else {
          this.createSource(reader.result);
        }
      };
      this.fileName = event.target.files[0].name;
      reader.readAsText(event.target.files[0]);
    },
    getBackgroundClass(index) {
      if (index % 2 === 0) {
        return 'column has-background-white-ter';
      } else {
        return 'column has-background-grey-lighter';
      }
    },
    confirmDelete(index) {
      this.$buefy.dialog.confirm({
        title: 'Delete Profile',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteBot(index)
      });
    },
    changeProfile(index) {
      this.$apollo.mutate({
        mutation: MediaProfiles.MediaProfilesUpdate,
        variables: {
          data: {
            name: this.noiseBots[index].name,
            username: this.noiseBots[index].username,
            language: this.languageOpts[this.noiseBots[index].language]
          },
          where: {
            id: this.noiseBots[index].id
          }
        }
      }).then(() => {
        this.$buefy.toast.open({
          message: 'Saving...',
          type: 'is-success'
        });
      }).catch(error => {
        this.$buefy.toast.open({
          message: 'could not save changes to bot profile',
          type: 'is-danger'
        });
        console.error('failed bot profile change: ' + error);
      });
    },
    deleteBot(index) {
      this.$apollo.mutate({
        mutation: MediaProfiles.MediaProfilesDelete,
        variables: {
          id: {
            id: this.noiseBots[index].id
          }
        }
      }).then(() => {
        this.noiseBots.splice(index, 1);
        this.$buefy.toast.open({
          message: 'deleted bot profile',
          type: 'is-success'
        });
      }).catch(error => {
        this.$buefy.toast.open({
          message: 'could not delete bot profile',
          type: 'is-danger'
        });
        console.error('failed bot profile deletion: ' + error);
      });
    },
    createSource(sourceText) {
      this.$apollo.mutate({
        mutation: noiseProfiles.CreateMediaMarkovSource,
        variables: {
          data: {
            key: this.fileName,
            sourceText: sourceText,
            attributes: {
              connect: {
                name: 'noiselevel'
              }
            }
          }
        }
      }).then(data => {
        this.allSources.push(data.data.createMediaMarkovSource);
        this.$buefy.toast.open({
          message: 'Saving...',
          type: 'is-success'
        });
      }).catch(error => {
        this.$buefy.toast.open({
          message: 'could not Create Markov Source',
          type: 'is-danger'
        });
        console.error('failed Markov source creation: ' + error);
      });
    },
    deleteSource(key, index) {
      this.$apollo.mutate({
        mutation: noiseProfiles.DeleteMediaMarkovSource,
        variables: {
          where: {
            key: key
          }
        }
      }).then(() => {
        this.allSources.splice(index, 1);
        this.$buefy.toast.open({
          message: 'deleted Markov source',
          type: 'is-success'
        });
      }).catch(error => {
        this.$buefy.toast.open({
          message: 'could not delete Markov Source',
          type: 'is-danger'
        });
        console.error('failed Markov source deletion: ' + error);
      });
    }
  }
});
;// ./src/media/views/OptionsNoise.vue?vue&type=script&lang=js
 /* harmony default export */ var views_OptionsNoisevue_type_script_lang_js = (OptionsNoisevue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/OptionsNoise.vue





/* normalize component */
;
var component = (0,componentNormalizer/* default */.A)(
  views_OptionsNoisevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var OptionsNoise = (component.exports);

/***/ })

}]);