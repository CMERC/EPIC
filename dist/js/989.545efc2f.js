"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[989],{

/***/ 55989:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Personas_edit; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/personas/Personas-edit.vue?vue&type=template&id=f950a430&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "is-relative-mobile"
  }, [_c('breadcrumb', {
    attrs: {
      "currentPage": _vm.persona ? _vm.persona.name : ''
    }
  }), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('help-content', {
    attrs: {
      "reference": 'media.personasview',
      "toggle": "",
      "dropdown": ""
    }
  })], 1)])]), _vm.persona && _vm.persona.id != null ? _c('div', [_c('div', {
    staticClass: "columns is-centered"
  }, [_c('div', {
    staticClass: "column is-full"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('b-dropdown', {
    staticClass: "is-pulled-right",
    attrs: {
      "position": "is-bottom-left"
    }
  }, [_c('a', {
    staticClass: "button is-small",
    attrs: {
      "slot": "trigger"
    },
    slot: "trigger"
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-ellipsis-v"
  })])]), _c('b-dropdown-item', {
    on: {
      "click": function ($event) {
        return _vm.viewPersona(_vm.persona);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-link"
  })]), _c('span', [_vm._v("View Persona")])]), _c('hr', {
    staticClass: "dropdown-divider"
  }), _c('b-dropdown-item', {
    on: {
      "click": function ($event) {
        return _vm.confirmDeletePersona(_vm.persona.id);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-times has-text-danger"
  })]), _c('span', [_vm._v("Delete Persona")])])], 1), _c('div', {
    staticClass: "card-content conOp"
  }, [_c('div', {
    staticClass: "columns is-multiline is-gapless"
  }, [_c('div', {
    staticClass: "column is-full"
  }, [_c('div', {
    staticClass: "tile is-ancestor"
  }, [_c('div', {
    staticClass: "tile is-vertical is-4"
  }, [_c('div', {
    staticClass: "tile"
  }, [_c('div', {
    staticClass: "tile is-parent is-vertical has-text-centered personaLeft"
  }, [_vm._m(0), _c('article', {
    staticClass: "tile is-child notification is-white"
  }, [_c('div', {
    staticClass: "field"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Name ")]), _c('div', {
    staticClass: "control"
  }, [_c('input', {
    directives: [{
      name: "validate",
      rawName: "v-validate",
      value: 'required',
      expression: "'required'"
    }, {
      name: "model",
      rawName: "v-model",
      value: _vm.persona.name,
      expression: "persona.name"
    }],
    staticClass: "input",
    class: {
      'input': true,
      'is-danger': _vm.errors.has('persona.personaName') || !(_vm.persona.name.length > 0)
    },
    attrs: {
      "name": "personaName"
    },
    domProps: {
      "value": _vm.persona.name
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.persona, "name", $event.target.value);
      }
    }
  }), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.errors.has('persona.personaName') || !(_vm.persona.name.length > 0),
      expression: "errors.has('persona.personaName')|| !(persona.name.length>0)"
    }],
    staticClass: "help has-text-danger"
  }, [_vm._v("Name is required")])])]), _c('div', {
    staticClass: "field"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Role ")]), _c('div', {
    staticClass: "control"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.persona.role,
      expression: "persona.role"
    }],
    staticClass: "input",
    attrs: {
      "type": "text",
      "placeholder": ""
    },
    domProps: {
      "value": _vm.persona.role
    },
    on: {
      "change": function ($event) {
        _vm.hasEdits = true;
      },
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.persona, "role", $event.target.value);
      }
    }
  })])]), _c('div', {
    staticClass: "field"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Avatar ")]), _c('div', {
    staticClass: "control"
  }, [_c('ImagePicker', {
    attrs: {
      "rootSearch": 'avatar',
      "mediaFile": _vm.persona.avatar
    },
    on: {
      "change": function ($event) {
        _vm.hasEdits = true;
      }
    },
    model: {
      value: _vm.personaMediaFile,
      callback: function ($$v) {
        _vm.personaMediaFile = $$v;
      },
      expression: "personaMediaFile"
    }
  })], 1)])]), _c('article', {
    key: "persona-map-tile",
    staticClass: "tile is-child notification is-white"
  }, [_c('MapLocationPicker', {
    key: "persona-map",
    on: {
      "change": function ($event) {
        _vm.hasEdits = true;
      }
    },
    model: {
      value: _vm.mapData,
      callback: function ($$v) {
        _vm.mapData = $$v;
      },
      expression: "mapData"
    }
  })], 1)])])]), _c('div', {
    staticClass: "tile is-4 is-parent"
  }, [_c('article', {
    staticClass: "tile is-child notification is-white"
  }, [_c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('a', {
    staticClass: "button is-primary is-outlined",
    on: {
      "click": function ($event) {
        return _vm.addCustomAttribute();
      }
    }
  }, [_vm._v(" Add Attribute ")])])])]), _vm.attributes ? _c('div', [_c('div', {
    staticClass: "columns"
  }, [_c('div', {
    staticClass: "column attributes"
  }, _vm._l(_vm.attributes, function (attribute, index) {
    return _c('div', {
      key: attribute.id,
      staticClass: "columns is-mobile"
    }, [_c('div', {
      staticClass: "column is-5"
    }, [_c('inline-input', {
      attrs: {
        "label": attribute.key
      },
      model: {
        value: attribute.key,
        callback: function ($$v) {
          _vm.$set(attribute, "key", $$v);
        },
        expression: "attribute.key"
      }
    }, [_c('p', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(attribute.key) + ": ")])])], 1), _c('div', {
      staticClass: "column is-5"
    }, [_c('inline-input', {
      attrs: {
        "label": attribute.value
      },
      model: {
        value: attribute.value,
        callback: function ($$v) {
          _vm.$set(attribute, "value", $$v);
        },
        expression: "attribute.value"
      }
    }, [_c('p', {
      staticClass: "subtitle is-6"
    }, [_vm._v(_vm._s(attribute.value ? attribute.value : '__________________'))])])], 1), _c('div', {
      staticClass: "column is-narrow"
    }, [_c('span', {
      staticClass: "icon is-small removeAtributes"
    }, [_c('a', {
      staticClass: "button is-danger is-small",
      on: {
        "click": function ($event) {
          _vm.removeAttributes.push(attribute);
          _vm.$delete(_vm.attributes, index);
        }
      }
    }, [_c('i', {
      staticClass: "far fa-trash-alt"
    })])])])]);
  }), 0)])]) : _vm._e(), _vm.customAttributes ? _c('div', {
    staticClass: "customAttributes"
  }, _vm._l(_vm.customAttributes, function (attribute) {
    return _c('div', {
      key: attribute.id,
      staticClass: "columns is-mobile"
    }, [_c('div', {
      staticClass: "column is-5"
    }, [_c('inline-input', {
      attrs: {
        "label": attribute.key
      },
      model: {
        value: attribute.key,
        callback: function ($$v) {
          _vm.$set(attribute, "key", $$v);
        },
        expression: "attribute.key"
      }
    }, [_c('p', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(attribute.key))])])], 1), _c('div', {
      staticClass: "column is-5"
    }, [_c('inline-input', {
      attrs: {
        "label": attribute.value
      },
      model: {
        value: attribute.value,
        callback: function ($$v) {
          _vm.$set(attribute, "value", $$v);
        },
        expression: "attribute.value"
      }
    }, [_c('p', {
      staticClass: "subtitle is-6"
    }, [_vm._v(_vm._s(attribute.value ? attribute.value : '__________________'))])])], 1), _c('div', {
      staticClass: "column is-narrow"
    }, [_c('span', {
      staticClass: "icon is-small removeAtributes"
    }, [_c('a', {
      staticClass: "button is-danger is-small",
      on: {
        "click": function ($event) {
          return _vm.removeCustomAttributes(attribute.id);
        }
      }
    }, [_c('i', {
      staticClass: "far fa-trash-alt"
    })])])])]);
  }), 0) : _vm._e()])]), _c('div', {
    staticClass: "tile is-4 is-parent description"
  }, [_c('article', {
    staticClass: "tile is-child notification is-white"
  }, [_c('quill-editor', {
    ref: "quillText",
    staticStyle: {
      "min-height": "30rem"
    },
    attrs: {
      "options": _vm.editorOption
    },
    on: {
      "change": function ($event) {
        _vm.hasEdits = true;
      }
    },
    model: {
      value: _vm.persona.description,
      callback: function ($$v) {
        _vm.$set(_vm.persona, "description", $$v);
      },
      expression: "persona.description"
    }
  })], 1)])])]), _c('div', {
    staticClass: "column is-full"
  }, [_c('div', {
    staticClass: "tile is-ancestor"
  }, [_c('div', {
    staticClass: "tile is-parent is-12 is-vertical"
  }, [_c('article', {
    staticClass: "tile is-child relations notification is-white"
  }, [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v("Linked Relationships")]), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('span', {
    class: {
      'tooltip': !(_vm.persona.name && _vm.persona.name.length > 0)
    },
    attrs: {
      "data-tooltip": !(_vm.persona.name && _vm.persona.name.length > 0) ? 'Add a name to the persona' : ''
    }
  }, [_c('button', {
    staticClass: "button is-primary is-outlined",
    attrs: {
      "disabled": !(_vm.persona.name && _vm.persona.name.length > 0)
    },
    on: {
      "click": function ($event) {
        _vm.openRelation = true;
      }
    }
  }, [_vm._v("Edit Relationships")])])])]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_vm.relationChanges ? _c('span', {
    staticClass: "help has-text-danger"
  }, [_c('i', {
    staticClass: "fas fa-asterisk"
  }), _vm._v(" Click save to apply changes")]) : _vm._e()])])]), _c('section', {
    staticClass: "section"
  }, [_c('OrgChart', {
    attrs: {
      "json": _vm.getChartData
    },
    on: {
      "click-node": _vm.clickNode
    }
  })], 1)])])])])])]), _c('footer', {
    staticClass: "modal-card-foot"
  }, [_c('span', {
    class: {
      'tooltip': !(_vm.persona.name && _vm.persona.name.length > 0)
    },
    attrs: {
      "data-tooltip": !(_vm.persona.name && _vm.persona.name.length > 0) ? 'Add a name to the persona' : ''
    }
  }, [_c('button', {
    staticClass: "button is-primary",
    attrs: {
      "disabled": !(_vm.persona.name && _vm.persona.name.length > 0)
    },
    on: {
      "click": _vm.validateBeforeSubmit
    }
  }, [_vm._v("Save")])]), _c('button', {
    staticClass: "button is-primary is-outlined",
    on: {
      "click": function ($event) {
        return _vm.cancel();
      }
    }
  }, [_vm._v(" Cancel ")])])], 1)])]), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.toggleProfile();
      }
    }
  }, [_vm._v(" Add Profiles ")])])]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_vm.profilesToAdd ? _c('span', {
    staticClass: "help has-text-danger"
  }, [_c('i', {
    staticClass: "fas fa-asterisk"
  }), _vm._v(" Click save to apply changes")]) : _vm._e()])])]), _vm.persona && _vm.persona.profiles && _vm.persona.profiles.length > 0 ? _c('div', [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v(_vm._s(_vm.persona.profiles.length) + " Linked Profiles")]), _c('div', {
    staticClass: "columns is-desktop is-multiline"
  }, _vm._l(_vm.persona.profiles, function (mediaProfile) {
    return _c('div', {
      key: mediaProfile.id,
      staticClass: "column is-3-desktop"
    }, [_c('Profile-Card', {
      attrs: {
        "profile": mediaProfile,
        "showEdit": "",
        "showPermalink": "",
        "showDeleteFromPersona": ""
      }
    })], 1);
  }), 0)]) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.persona.profiles,
      "isLoading": _vm.$apollo.loading
    }
  }, [_c('template', {
    slot: "custom-message"
  }, [_c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v("No Profiles found.")])])], 2)], 1)]) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.persona && _vm.persona.id ? _vm.persona : null,
      "isLoading": _vm.$apollo.loading
    }
  })], 1), _vm.openProfile ? _c('persona-add-profile', {
    attrs: {
      "open": _vm.openProfile,
      "mediaPersona": _vm.persona
    },
    on: {
      "close": _vm.toggleProfile,
      "addProfile": _vm.handleAddProfile
    }
  }) : _vm._e(), _vm.openRelation ? _c('persona-add-relation', {
    attrs: {
      "open": _vm.openRelation,
      "id": _vm.persona.id
    },
    on: {
      "close": function ($event) {
        _vm.openRelation = false;
      },
      "changes": _vm.handleRelationChanges
    }
  }) : _vm._e()], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('article', {
    staticClass: "tile is-child notification is-success personaClass"
  }, [_c('p', {
    staticClass: "title is-5 has-text-white has-text-bold"
  }, [_vm._v("UNCLASSIFIED")])]);
}];

// EXTERNAL MODULE: ./src/media/graphql/MediaPersonas.gql
var MediaPersonas = __webpack_require__(52433);
// EXTERNAL MODULE: ./src/shared/mixins/mediaPost.js
var mediaPost = __webpack_require__(76714);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(21809);
// EXTERNAL MODULE: ./src/shared/components/imagepicker.vue + 5 modules
var imagepicker = __webpack_require__(89394);
// EXTERNAL MODULE: ./src/shared/components/profile-card.vue + 6 modules
var profile_card = __webpack_require__(74558);
;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/personas-addprofile.vue?vue&type=template&id=70b8feb9&scoped=true
var personas_addprofilevue_type_template_id_70b8feb9_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "modal",
    class: {
      'is-active': _vm.open
    }
  }, [_c('div', {
    staticClass: "modal-background",
    on: {
      "click": function ($event) {
        return _vm.close();
      }
    }
  }), _c('div', {
    staticClass: "modal-card"
  }, [_c('header', {
    staticClass: "modal-card-head"
  }, [_c('p', {
    staticClass: "modal-card-title"
  }, [_vm._v("Add Profiles to Persona")]), _c('button', {
    staticClass: "delete",
    attrs: {
      "aria-label": "close"
    },
    on: {
      "click": function ($event) {
        return _vm.close();
      }
    }
  })]), _vm.mediaPersona && _vm.mediaProfiles ? _c('section', {
    staticClass: "modal-card-body"
  }, [_c('div', {
    staticClass: "columns is-centered"
  }, [_c('div', {
    staticClass: "column is-10"
  }, [_c('div', {
    staticClass: "media"
  }, [_c('div', {
    staticClass: "media-left"
  }, [_vm.mediaPersona.avatar != null ? _c('figure', {
    staticClass: "image is-96x96"
  }, [_c('img', {
    staticClass: "is-avatar xl",
    attrs: {
      "src": _vm.mediaPersona.avatar.url.thumb,
      "alt": "image"
    }
  })]) : _c('figure', {
    staticClass: "image is-48x48"
  }, [_vm._m(0)])]), _c('div', {
    staticClass: "media-content"
  }, [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v(_vm._s(_vm.mediaPersona.name))])]), _vm.selectedProfiles && _vm.selectedProfiles.length > 0 ? _c('div', {
    staticClass: "media-right"
  }, [_vm._m(1), _c('span', [_vm._v(_vm._s(_vm.selectedProfiles.length))])]) : _vm._e()]), _c('div', {
    staticClass: "content"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.toggleCreateProfile(true);
      }
    }
  }, [_vm._v(" Create Profile ")]), _c('div', {
    staticClass: "is-divider",
    attrs: {
      "data-content": "or search existing profiles"
    }
  }), _c('div', {
    staticClass: "field"
  }, [_c('p', {
    staticClass: "control has-icons-left"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.searchQuery,
      expression: "searchQuery"
    }, {
      name: "focus",
      rawName: "v-focus"
    }],
    staticClass: "input is-rounded is-primary",
    attrs: {
      "type": "text",
      "placeholder": "Search...",
      "clearable": ""
    },
    domProps: {
      "value": _vm.searchQuery
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.searchQuery = $event.target.value;
      }
    }
  }), _vm._m(2)])]), _vm.mediaProfiles && _vm.mediaProfiles.length > 0 ? _c('div', {
    staticClass: "field"
  }, [_c('div', {
    staticClass: "select is-multiple is-fullwidth"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.selectedProfiles,
      expression: "selectedProfiles"
    }],
    attrs: {
      "multiple": "",
      "size": "8"
    },
    on: {
      "change": function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.selectedProfiles = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }
    }
  }, _vm._l(_vm.mediaProfiles, function (profile) {
    return _c('option', {
      key: profile.id,
      domProps: {
        "value": profile.id
      }
    }, [_vm._v(" " + _vm._s(profile.name) + " - " + _vm._s(profile.service.displayName) + " ")]);
  }), 0)])]) : _c('div', [_vm._m(3)])])])])]) : _vm._e(), _c('footer', {
    staticClass: "modal-card-foot"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": _vm.reviewChanges
    }
  }, [_vm._v(" Review ")]), _c('a', {
    staticClass: "button",
    on: {
      "click": function ($event) {
        return _vm.close();
      }
    }
  }, [_vm._v(" Cancel ")])])])]), _c('profile-create', {
    attrs: {
      "open": _vm.createProfile,
      "isEdit": false,
      "mediaProfile": _vm.profileInfo,
      "mediaServices": _vm.mediaServices
    },
    on: {
      "close": function ($event) {
        return _vm.toggleCreateProfile(false);
      }
    }
  })], 1);
};
var personas_addprofilevue_type_template_id_70b8feb9_scoped_true_staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-large"
  }, [_c('i', {
    staticClass: "fas fa-user-circle has-text-grey fa-3x"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon"
  }, [_c('i', {
    staticClass: "fas fa-users has-text-primary"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-small is-left"
  }, [_c('i', {
    staticClass: "fas fa-search"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "card-header-title is-centered"
  }, [_c('i', {
    staticClass: "fas fa-search fa-3x has-text-primary"
  })]), _c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v(" No result found. Try a different search. ")])])]);
}];

// EXTERNAL MODULE: ./src/media/components/profile-create.vue + 5 modules
var profile_create = __webpack_require__(5832);
// EXTERNAL MODULE: ./src/media/graphql/MediaServices.gql
var MediaServices = __webpack_require__(95514);
// EXTERNAL MODULE: ./src/media/model/mediaprofile.js
var mediaprofile = __webpack_require__(42825);
// EXTERNAL MODULE: ./src/media/graphql/MediaProfiles.gql
var MediaProfiles = __webpack_require__(14840);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/personas-addprofile.vue?vue&type=script&lang=js




/* harmony default export */ var personas_addprofilevue_type_script_lang_js = ({
  name: 'personas-addprofile',
  components: {
    ProfileCreate: profile_create/* default */.A
  },
  props: {
    mediaPersona: {},
    open: {
      default: false
    }
  },
  apollo: {
    mediaServices: {
      query: MediaServices.MediaServicesRead,
      error(error) {
        console.error(error);
      }
    },
    mediaProfiles: {
      query: MediaProfiles.MediaProfilesRead,
      variables() {
        return {
          where: {
            isUserGenerated: true,
            OR: [{
              service: {
                name_contains: this.searchQuery
              }
            }, {
              name_contains: this.searchQuery
            }, {
              username_contains: this.searchQuery
            }, {
              description_contains: this.searchQuery
            }, {
              language_contains: this.searchQuery
            }]
          }
        };
      },
      subscribeToMore: [{
        document: MediaProfiles.MediaProfilesSubscription,
        variables() {
          return {
            where: {
              node: {
                isUserGenerated: true
              }
            }
          };
        },
        // Mutate the previous result
        updateQuery: (previousResult, {
          subscriptionData
        }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.mediaProfile.mutation;
          var newResult;
          switch (mutationIn) {
            case 'CREATED':
              {
                newResult = {
                  mediaProfiles: [...previousResult.mediaProfiles, subscriptionData.data.mediaProfile.node]
                };
                break;
              }
            case 'DELETED':
              {
                newResult = {
                  mediaProfiles: [...previousResult.mediaProfiles.filter(obj => subscriptionData.data.mediaProfile.previousValues.id !== obj.id)]
                };
                break;
              }
            case 'UPDATED':
              {
                let updatedMediaProfiles = JSON.parse(JSON.stringify(previousResult.mediaProfiles));
                updatedMediaProfiles[updatedMediaProfiles.findIndex(x => x.id === subscriptionData.data.mediaProfile.node.id)] = subscriptionData.data.mediaProfile.node;
                newResult = {
                  mediaProfiles: updatedMediaProfiles
                };
                break;
              }
            default:
              {
                throw new Error(`Unknown Subscription Mutation`);
              }
          }
          return newResult;
        }
      }]
    }
  },
  data() {
    return {
      selectedProfiles: [],
      searchQuery: '',
      createProfile: false,
      profileInfo: new mediaprofile/* default */.A(),
      mediaServices: []
    };
  },
  methods: {
    close() {
      this.$emit('close');
      this.selectedProfiles = [];
    },
    toggleCreateProfile(value) {
      this.createProfile = value;
    },
    save() {
      let profilesArray = [];
      for (let i = 0; i < this.selectedProfiles.length; i++) {
        profilesArray.push({
          id: this.selectedProfiles[i]
        });
      }
      this.$emit('addProfile', profilesArray);
      this.close();
    },
    reviewChanges() {
      this.$buefy.dialog.confirm({
        title: 'Review Profiles',
        message: `You are adding ${this.selectedProfiles.length} Profiles`,
        type: 'is-warning',
        onConfirm: () => this.save()
      });
    }
  },
  watch: {
    mediaPersona() {
      if (this.mediaPersona.profiles) {
        for (let i = 0; i < this.mediaPersona.profiles.length; i++) {
          this.selectedProfiles.push(this.mediaPersona.profiles[i].id);
        }
      }
    }
  }
});
;// ./src/media/components/personas-addprofile.vue?vue&type=script&lang=js
 /* harmony default export */ var components_personas_addprofilevue_type_script_lang_js = (personas_addprofilevue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/personas-addprofile.vue?vue&type=style&index=0&id=70b8feb9&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/components/personas-addprofile.vue?vue&type=style&index=0&id=70b8feb9&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/components/personas-addprofile.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_personas_addprofilevue_type_script_lang_js,
  personas_addprofilevue_type_template_id_70b8feb9_scoped_true_render,
  personas_addprofilevue_type_template_id_70b8feb9_scoped_true_staticRenderFns,
  false,
  null,
  "70b8feb9",
  null
  
)

/* harmony default export */ var personas_addprofile = (component.exports);
;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/personas-addrelation.vue?vue&type=template&id=599213c2&scoped=true
var personas_addrelationvue_type_template_id_599213c2_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "container is-fluid"
  }, [_c('epic-modal', {
    attrs: {
      "open": _vm.open,
      "shouldOverflow": true
    },
    on: {
      "close": _vm.close
    }
  }, [_c('template', {
    slot: "modal-title"
  }, [_vm._v(" Add Relationships ")]), _vm.mediaPersona ? _c('template', {
    slot: "modal-body"
  }, [_c('div', {
    staticClass: "content"
  }, [_c('div', {
    staticClass: "columns is-multiline"
  }, [_c('div', {
    staticClass: "column is-8"
  }, [_c('div', {
    staticClass: "field"
  }, [_c('div', {
    staticClass: "control"
  }, [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v(_vm._s(_vm.mediaPersona.name))]), _c('span', {
    staticClass: "title is-6"
  }, [_vm._v(" is the ")])])]), _c('div', {
    staticClass: "field"
  }, [_c('div', {
    staticClass: "control"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.relationship,
      expression: "relationship"
    }, {
      name: "validate",
      rawName: "v-validate",
      value: 'required',
      expression: "'required'"
    }],
    staticClass: "input",
    class: {
      'input': true,
      'is-danger': _vm.errors.has('Relation Type')
    },
    attrs: {
      "name": "Relation Type",
      "type": "text",
      "placeholder": "e.g. mother, father, son, daughter"
    },
    domProps: {
      "value": _vm.relationship
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.relationship = $event.target.value;
      }
    }
  }), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.errors.has('Relation Type'),
      expression: "errors.has('Relation Type')"
    }],
    staticClass: "help is-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('Relation Type')))])])]), _c('div', {
    staticClass: "field"
  }, [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v("of")]), _c('persona-relation-selector', {
    attrs: {
      "isModal": true,
      "errorMessage": _vm.showRelationError
    },
    on: {
      "emitValue": function ($event) {
        return _vm.setValue($event);
      }
    }
  })], 1)]), _vm.pendingChanges.length > 0 ? _c('div', {
    staticClass: "column is-half"
  }, [_c('label', {
    staticClass: "label is-italic"
  }, [_vm._v(" Pending Changes ")]), _c('ul', {
    staticClass: "bd-anchors-list"
  }, _vm._l(_vm.pendingChanges, function (change) {
    return _c('li', {
      key: change.id
    }, [_c('p', [_c('span', {
      staticClass: "icon"
    }, [_c('i', {
      class: change.icon
    })]), _c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(_vm.mediaPersona.name))]), _vm._v(" is "), _c('span', {
      staticClass: "title is-italic is-6"
    }, [_vm._v(_vm._s(change.relationship))]), _vm._v(" of "), _c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(change.name))])])]);
  }), 0)]) : _vm._e()])]), _c('div', {
    staticClass: "content"
  }, [_c('label', {
    staticClass: "label is-italic"
  }, [_vm._v(" Linked Relationships ")]), _vm.mediaPersona.relatesTo ? _c('ul', {
    staticClass: "bd-anchors-list"
  }, _vm._l(_vm.mediaPersona.relatesTo, function (relation) {
    return _c('li', {
      key: relation.id,
      attrs: {
        "id": relation.id
      }
    }, [_c('p', [_c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(relation.start.name))]), _vm._v(" is "), _c('span', {
      staticClass: "title is-italic is-6"
    }, [_vm._v(_vm._s(relation.name))]), _vm._v(" of "), _c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(relation.end.name))]), _c('span', {
      staticClass: "icon has-text-grey",
      on: {
        "click": function ($event) {
          return _vm.removeRelation(relation.id, relation.name, relation.end.name);
        }
      }
    }, [_c('i', {
      staticClass: "fas fa-times-circle"
    })])])]);
  }), 0) : _vm._e(), _vm.mediaPersona.relatesFrom ? _c('ul', {
    staticClass: "bd-anchors-list"
  }, _vm._l(_vm.mediaPersona.relatesFrom, function (relation) {
    return _c('li', {
      key: relation.id,
      attrs: {
        "id": relation.id
      }
    }, [_c('p', [_c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(relation.start.name))]), _vm._v(" is "), _c('span', {
      staticClass: "title is-italic is-6"
    }, [_vm._v(_vm._s(relation.name))]), _vm._v(" of "), _c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(relation.end.name))]), _c('span', {
      staticClass: "icon has-text-grey",
      on: {
        "click": function ($event) {
          return _vm.removeRelation(relation.id, relation.name, relation.end.name);
        }
      }
    }, [_c('i', {
      staticClass: "fas fa-times-circle"
    })])])]);
  }), 0) : _vm._e()])]) : _vm._e(), _c('template', {
    slot: "modal-footer-buttons"
  }, [_c('p', {
    staticClass: "control"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.validateBeforeSubmit(false);
      }
    }
  }, [_vm._v("Save")])]), _c('p', {
    staticClass: "control"
  }, [_c('a', {
    staticClass: "button is-primary is-outlined",
    on: {
      "click": function ($event) {
        return _vm.validateBeforeSubmit(true);
      }
    }
  }, [_vm._v("Save & add another")])])])], 2)], 1);
};
var personas_addrelationvue_type_template_id_599213c2_scoped_true_staticRenderFns = [];

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/persona-relationselector.vue?vue&type=template&id=c521eafe&scoped=true
var persona_relationselectorvue_type_template_id_c521eafe_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "field"
  }, [_c('div', {
    staticClass: "control is-expanded"
  }, [_vm.mediaPersonae ? _c('multiselect', {
    class: {
      'input': _vm.errorMessage,
      'is-danger': _vm.errorMessage
    },
    attrs: {
      "name": "Persona",
      "multiple": _vm.allowMultipleSelect,
      "close-on-select": !_vm.allowMultipleSelect,
      "clear-on-select": !_vm.allowMultipleSelect,
      "optionHeight": 25,
      "track-by": "id",
      "options": _vm.mediaPersonae,
      "internal-search": false,
      "openDirection": "below"
    },
    on: {
      "search-change": value => {
        _vm.searchQuery = value;
      },
      "select": _vm.selectPersona
    },
    scopedSlots: _vm._u([{
      key: "singleLabel",
      fn: function (props) {
        return [_c('span', {
          key: props.option.id,
          staticClass: "option__desc"
        }, [_c('span', {
          staticClass: "option__title"
        }, [_vm._v(" " + _vm._s(props.option.name) + _vm._s(_vm._f("truncate")(props.option.role ? ` - ${props.option.role}` : null, 50)) + " ")])])];
      }
    }, {
      key: "option",
      fn: function (props) {
        return [_c('div', {
          staticClass: "option__desc"
        }, [_c('div', {
          key: props.option.id,
          staticClass: "media"
        }, [_c('div', {
          staticClass: "media-left"
        }, [props.option && props.option.avatar ? _c('figure', {
          staticClass: "image"
        }, [_c('img', {
          staticClass: "is-avatar md",
          attrs: {
            "src": props.option.avatar ? props.option.avatar.url.small : ""
          }
        })]) : _c('figure', {
          staticClass: "image"
        }, [_c('span', {
          staticClass: "icon is-large"
        }, [_c('i', {
          staticClass: "fas fa-user-circle has-text-grey fa-3x"
        })])])]), _c('div', {
          staticClass: "media-content"
        }, [_c('p', {
          staticClass: "title is-6"
        }, [_vm._v(_vm._s(props.option.name))]), _c('p', {
          staticClass: "subtitle is-7 has-text-weight-semibold"
        }, [_vm._v(_vm._s(_vm._f("truncate")(props.option.role, 50)))])])])])];
      }
    }], null, false, 4035711604),
    model: {
      value: _vm.selectedPersona,
      callback: function ($$v) {
        _vm.selectedPersona = $$v;
      },
      expression: "selectedPersona"
    }
  }, [_c('template', {
    staticClass: "multiselect_element",
    slot: "afterList"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.mediaPersonasCount > 74,
      expression: "mediaPersonasCount > 74"
    }],
    staticClass: "afterList"
  }, [_c('hr', {
    staticClass: "dropdown-divider"
  }), _vm.mediaPersonae.length > 74 && _vm.showAll == false ? _c('span', {
    staticClass: "multiselect__option",
    on: {
      "click": function ($event) {
        return _vm.toggleList(true);
      }
    }
  }, [_c('span', {
    staticClass: "is-italic"
  }, [_vm._v("Show more options... ")])]) : _c('span', {
    staticClass: "multiselect__option",
    on: {
      "click": function ($event) {
        return _vm.toggleList(false);
      }
    }
  }, [_c('span', {
    staticClass: "is-italic"
  }, [_vm._v("Show fewer options... ")])])])])], 2) : _vm._e(), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.errorMessage,
      expression: "errorMessage"
    }],
    staticClass: "help has-text-danger"
  }, [_vm._v("Persona Required")])], 1)]);
};
var persona_relationselectorvue_type_template_id_c521eafe_scoped_true_staticRenderFns = [];

;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/persona-relationselector.vue?vue&type=script&lang=js

/* harmony default export */ var persona_relationselectorvue_type_script_lang_js = ({
  name: 'persona-relationselector',
  props: {
    errorMessage: {
      type: Boolean,
      default: false
    },
    isModal: {
      type: Boolean,
      default: false
    },
    allowMultipleSelect: {
      type: Boolean,
      deafult: false
    }
  },
  apollo: {
    mediaPersonasCount: {
      query: MediaPersonas.MediaPersonasCounts,
      variables() {
        let data = this.queryVariables();
        data.skip = 0;
        return data;
      },
      update(data) {
        if (data && data.mediaPersonaeConnection) {
          return data.mediaPersonaeConnection.aggregate.count;
        }
      },
      error(error) {
        console.error(error);
      }
    },
    mediaPersonae: {
      query: MediaPersonas.MediaPersonasList,
      variables() {
        let data = this.queryVariables();
        data.skip = 0;
        return data;
      },
      update(data) {
        if (data && data.mediaPersonae) {
          this.$apollo.queries.mediaPersonasCount.refetch();
          return data.mediaPersonae;
        }
      },
      subscribeToMore: [{
        document: MediaPersonas.MediaPersonaSubscription,
        variables() {
          let datafromread = this.queryVariables();
          delete datafromread.skip;
          delete datafromread.first;
          let data = {
            node: datafromread
          };
          return data;
        },
        // Mutate the previous result
        updateQuery(previousResult, {
          subscriptionData
        }) {
          // Mutation type
          let mutationIn = subscriptionData.data.mediaPersona.mutation;
          let newResult;
          switch (mutationIn) {
            case 'CREATED':
              {
                newResult = {
                  mediaPersonae: [...previousResult.mediaPersonae, subscriptionData.data.mediaPersona.node]
                };
                break;
              }
            case 'DELETED':
              {
                newResult = {
                  mediaPersonae: [...previousResult.mediaPersonae.filter(obj => subscriptionData.data.mediaPersona.previousValues.id !== obj.id)]
                };
                break;
              }
            case 'UPDATED':
              {
                let updatedMediaPersona = JSON.parse(JSON.stringify(previousResult.mediaPersona));
                let index = updatedMediaPersona.findIndex(x => x.id === subscriptionData.data.mediaPersona.node.id);
                updatedMediaPersona[index] = subscriptionData.data.mediaPersona.node;
                newResult = {
                  mediaPersonae: updatedMediaPersona
                };
                break;
              }
            default:
              {
                throw new Error(`Unknown Subscription Mutation`);
              }
          }
          this.$apollo.queries.mediaPersonasCount.refetch();
          // Here, return the new result from the previous with the new data
          return newResult;
        }
      }]
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedPersona: '',
      first: 75,
      showAll: false
    };
  },
  methods: {
    toggleList(state) {
      this.showAll = state;
      if (state == true) {
        this.first = null;
      } else {
        this.first = 75;
      }
    },
    queryVariables() {
      let data = {
        where: {
          OR: [{
            name_contains: this.searchQuery
          }, {
            role_contains: this.searchQuery
          }]
        },
        orderBy: 'name_ASC',
        first: this.first
      };
      return data;
    },
    selectPersona(persona) {
      this.$emit('emitValue', persona);
    }
  }
});
;// ./src/media/components/persona-relationselector.vue?vue&type=script&lang=js
 /* harmony default export */ var components_persona_relationselectorvue_type_script_lang_js = (persona_relationselectorvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/persona-relationselector.vue?vue&type=style&index=0&id=c521eafe&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/components/persona-relationselector.vue?vue&type=style&index=0&id=c521eafe&prod&lang=scss&scoped=true

;// ./src/media/components/persona-relationselector.vue



;


/* normalize component */

var persona_relationselector_component = (0,componentNormalizer/* default */.A)(
  components_persona_relationselectorvue_type_script_lang_js,
  persona_relationselectorvue_type_template_id_c521eafe_scoped_true_render,
  persona_relationselectorvue_type_template_id_c521eafe_scoped_true_staticRenderFns,
  false,
  null,
  "c521eafe",
  null
  
)

/* harmony default export */ var persona_relationselector = (persona_relationselector_component.exports);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/personas-addrelation.vue?vue&type=script&lang=js


/* harmony default export */ var personas_addrelationvue_type_script_lang_js = ({
  name: 'personas-addrelation',
  components: {
    PersonaRelationSelector: persona_relationselector
  },
  props: {
    id: {
      type: String
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  apollo: {
    mediaPersonae: {
      query: MediaPersonas.MediaPersonasList
    },
    mediaPersona: {
      query: MediaPersonas.MediaPersonaRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        };
      },
      update(data) {
        if (data && data.mediaPersona) {
          return data.mediaPersona;
        }
      }
    }
  },
  data() {
    return {
      showRelationError: false,
      pendingChanges: [],
      relationship: '',
      selectedPersona: ''
    };
  },
  methods: {
    clearInputs() {
      this.selectedPersona = '';
      this.relationship = '';
      this.$validator.reset();
    },
    setValue(e) {
      this.showRelationError = false;
      this.selectedPersona = e;
    },
    close() {
      this.$emit('close');
      this.pendingChanges = [];
      this.clearInputs();
    },
    validateBeforeSubmit(multiple) {
      this.$validator.validateAll().then(result => {
        if (result && this.selectedPersona) {
          this.showRelationError = false;
          this.addRelation(multiple);
          return;
        } else {
          this.showRelationError = true;
        }
      });
    },
    addRelation(multiple) {
      let addRelationData = {
        name: this.relationship,
        start: {
          connect: {
            id: this.mediaPersona.id
          }
        },
        end: {
          connect: {
            id: this.selectedPersona.id
          }
        }
      };
      this.$apollo.mutate({
        mutation: MediaPersonas.MediaPersonasEdgeCreate,
        variables: {
          data: addRelationData
        }
      }).then(response => {
        if (response && response.data.createMediaPersonaEdge) {
          this.pendingChanges.push({
            id: response.data.createMediaPersonaEdge.id,
            icon: 'fas fa-plus-circle has-text-success',
            name: this.selectedPersona.name,
            relationship: this.relationship
          });
          this.$emit('changes');
          if (multiple == true) {
            this.clearInputs();
          } else {
            this.clearInputs();
            this.close();
          }
        }
      }).catch(error => {
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger'
        });
        console.error('Create Persona: ' + error);
      });
    },
    removeRelation(id, relation, name) {
      this.$apollo.mutate({
        mutation: MediaPersonas.MediaPersonasEdgeDelete,
        variables: {
          where: {
            id: id
          }
        }
      }).then(response => {
        if (response && response.data.deleteMediaPersonaEdge) {
          this.pendingChanges.push({
            id: response.data.deleteMediaPersonaEdge.id,
            icon: 'fas fa-minus-circle has-text-danger',
            name: name,
            relationship: relation
          });
          this.$emit('changes');
          document.getElementById(id).style.display = 'none';
        }
      }).catch(error => {
        this.$buefy.toast.open({
          message: error.message,
          type: 'is-danger'
        });
        console.error('Create Persona: ' + error);
      });
    }
  }
});
;// ./src/media/components/personas-addrelation.vue?vue&type=script&lang=js
 /* harmony default export */ var components_personas_addrelationvue_type_script_lang_js = (personas_addrelationvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/personas-addrelation.vue?vue&type=style&index=0&id=599213c2&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/components/personas-addrelation.vue?vue&type=style&index=0&id=599213c2&prod&lang=scss&scoped=true

;// ./src/media/components/personas-addrelation.vue



;


/* normalize component */

var personas_addrelation_component = (0,componentNormalizer/* default */.A)(
  components_personas_addrelationvue_type_script_lang_js,
  personas_addrelationvue_type_template_id_599213c2_scoped_true_render,
  personas_addrelationvue_type_template_id_599213c2_scoped_true_staticRenderFns,
  false,
  null,
  "599213c2",
  null
  
)

/* harmony default export */ var personas_addrelation = (personas_addrelation_component.exports);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(21823);
;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/inline-input.vue?vue&type=template&id=6302c71f&scoped=true
var inline_inputvue_type_template_id_6302c71f_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', [!_vm.editing ? _c('div', {
    on: {
      "click": _vm.enableEditing
    }
  }, [_vm._t("default")], 2) : _vm._e(), _vm.editing ? _c('div', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.inputValue,
      expression: "inputValue"
    }, {
      name: "focus",
      rawName: "v-focus"
    }],
    staticClass: "input form-control",
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": _vm.inputValue
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.inputValue = $event.target.value;
      }
    }
  }), _c('span', {
    staticClass: "buttons has-addons"
  }, [_c('a', {
    staticClass: "button",
    on: {
      "click": _vm.saveEdit
    }
  }, [_vm._m(0)]), _c('a', {
    staticClass: "button",
    on: {
      "click": _vm.disableEditing
    }
  }, [_vm._m(1)])])]) : _vm._e()]);
};
var inline_inputvue_type_template_id_6302c71f_scoped_true_staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-small has-text-success"
  }, [_c('i', {
    staticClass: "fas fa-check"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-small has-text-danger"
  }, [_c('i', {
    staticClass: "fas fa-times"
  })]);
}];

;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/inline-input.vue?vue&type=script&lang=js
/* harmony default export */ var inline_inputvue_type_script_lang_js = ({
  name: 'click-to-edit',
  props: ['label', 'value'],
  data() {
    return {
      editing: false,
      inputValue: this.value
    };
  },
  methods: {
    enableEditing() {
      this.editing = true;
    },
    disableEditing() {
      this.editing = false;
    },
    saveEdit() {
      this.disableEditing();
      this.$emit('input', this.inputValue);
    }
  }
});
;// ./src/shared/components/inline-input.vue?vue&type=script&lang=js
 /* harmony default export */ var components_inline_inputvue_type_script_lang_js = (inline_inputvue_type_script_lang_js); 
;// ./src/shared/components/inline-input.vue





/* normalize component */
;
var inline_input_component = (0,componentNormalizer/* default */.A)(
  components_inline_inputvue_type_script_lang_js,
  inline_inputvue_type_template_id_6302c71f_scoped_true_render,
  inline_inputvue_type_template_id_6302c71f_scoped_true_staticRenderFns,
  false,
  null,
  "6302c71f",
  null
  
)

/* harmony default export */ var inline_input = (inline_input_component.exports);
// EXTERNAL MODULE: ./src/shared/components/orgchart.vue + 5 modules
var orgchart = __webpack_require__(36714);
// EXTERNAL MODULE: ./src/shared/components/maplocationpicker.vue + 5 modules
var maplocationpicker = __webpack_require__(35505);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(97750);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/personas/Personas-edit.vue?vue&type=script&lang=js












let toolbarOptions = [[{
  header: [1, 2, 3, 4, 5, 6, false]
}], ['bold', 'italic', 'underline'],
// toggled buttons
['blockquote', 'code-block'], ['link'], [{
  list: 'ordered'
}, {
  list: 'bullet'
}], [{
  indent: '-1'
}, {
  indent: '+1'
}, {
  align: []
}] // outdent/indent
];
/* harmony default export */ var Personas_editvue_type_script_lang_js = ({
  name: 'PersonaEdit',
  mixins: [helpers/* default */.A, mediaPost/* default */.A],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    ProfileCard: profile_card/* default */.A,
    HelpContent: helpcontent/* default */.A,
    ImagePicker: imagepicker/* default */.A,
    PersonaAddProfile: personas_addprofile,
    PersonaAddRelation: personas_addrelation,
    InlineInput: inline_input,
    OrgChart: orgchart/* default */.A,
    MapLocationPicker: maplocationpicker/* default */.A
  },
  apollo: {
    mediaPersona: {
      query: MediaPersonas.MediaPersonaRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        };
      },
      update(data) {
        if (data && data.mediaPersona) {
          this.persona = Object.assign({}, data.mediaPersona ? data.mediaPersona : null);
          if (this.persona.attributes && this.persona.attributes.length > 0) {
            this.attributes = JSON.parse(JSON.stringify(this.persona.attributes), this.omitTypename);
          }
          if (this.persona.location) {
            delete this.persona.location.id;
            this.mapData = JSON.parse(JSON.stringify(this.persona.location), this.omitTypename);
          }
          return data.mediaPersona;
        }
      },
      error(error) {
        console.error(error);
      }
    }
  },
  data() {
    return {
      persona: [],
      hasEdits: false,
      mediaPersona: null,
      mapData: null,
      editorOption: {
        modules: {
          toolbar: toolbarOptions
        }
      },
      attributes: [],
      removeAttributes: [],
      customAttributes: [],
      personaMediaFile: null,
      openProfile: false,
      openRelation: false,
      profilesToAdd: null,
      relationChanges: false
    };
  },
  methods: {
    handleRelationChanges() {
      this.relationChanges = true;
    },
    handleAddProfile(profiles) {
      this.profilesToAdd = profiles;
    },
    cancel() {
      this.hasEdits = false;
      this.$router.go(-1);
    },
    clickNode: function (node) {
      this.$router.push({
        name: 'viewpersona',
        params: {
          id: node.id
        }
      });
    },
    viewPersona(persona) {
      this.$router.push({
        name: 'viewpersona',
        params: {
          id: persona.id
        }
      });
    },
    toggleProfile() {
      this.openProfile = !this.openProfile;
    },
    addCustomAttribute() {
      this.hasEdits = true;
      let count = this.customAttributes ? this.customAttributes.length : 0;
      this.customAttributes.push({
        id: this.customAttributes.length,
        key: 'Trait ' + count,
        value: ''
      });
    },
    removeCustomAttributes(id) {
      this.customAttributes = this.customAttributes.filter(attribute => {
        if (attribute.id !== id) {
          return attribute;
        }
      });
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.save();
          return;
        }
        this.$buefy.toast.open({
          message: 'Correct errors!',
          type: 'is-danger'
        });
      });
    },
    async save(goBack = true) {
      this.hasEdits = false;
      let data = {
        name: this.persona.name,
        role: this.persona.role,
        description: this.persona.description
      };
      let updateAttributes = [];
      let createAttributes = [];
      let personaAttributes = {};

      // Handle Deletes first, then fire rest
      if (this.removeAttributes && this.removeAttributes.length > 0) {
        await this.deleteAttributes(this.removeAttributes);
      }

      // Generate Update attribute list
      if (this.attributes && this.attributes.length > 0) {
        for (let i in this.attributes) {
          let insideObj = {
            data: {
              key: this.attributes[i].key,
              value: this.attributes[i].value
            },
            where: {
              id: this.attributes[i].id
            }
          };
          updateAttributes.push(insideObj);
        }
        personaAttributes = {
          update: updateAttributes
        };
      }

      // Generate Create attribute list
      if (this.customAttributes && this.customAttributes.length > 0) {
        for (let i in this.customAttributes) {
          let insideObj = {
            key: this.customAttributes[i].key,
            value: this.customAttributes[i].value
          };
          createAttributes.push(insideObj);
        }
        personaAttributes = {
          ...personaAttributes,
          create: createAttributes
        };
      }
      // add attributes key to data obj
      data = {
        ...data,
        attributes: personaAttributes
      };
      // avatar
      let avatarData;
      if (this.personaMediaFile) {
        // mediaFile added
        if (this.personaMediaFile.create || this.personaMediaFile.connect) {
          avatarData = this.personaMediaFile;
        } else {
          // if Persona already has avatar, delete
          if (this.personaMediaFile.delete && this.persona.avatar) avatarData = {
            delete: true
          };
        }
        if (avatarData) data = {
          ...data,
          avatar: avatarData
        };
      }
      let dbMapData;
      if (this.persona.location) {
        if (this.mapData) {
          // update
          dbMapData = {
            location: {
              update: this.mapData
            }
          };
        } else {
          // delete location
          dbMapData = {
            location: {
              delete: true
            }
          };
        }
      } else {
        // create
        if (this.mapData) dbMapData = {
          location: {
            create: this.mapData
          }
        };
      }
      if (this.mapData || this.persona.location) {
        data = Object.assign(data, dbMapData);
      }
      if (this.profilesToAdd) {
        let profiles = {
          profiles: {
            connect: this.profilesToAdd
          }
        };
        data = {
          ...data,
          ...profiles
        };
      }
      if (this.relationToRemove) {
        data = {
          ...data,
          ...this.relationToRemove
        };
      }
      //update Persona
      this.$apollo.mutate({
        mutation: MediaPersonas.MediaPersonasUpdate,
        variables: {
          data,
          where: {
            id: this.id
          }
        }
      }).then(() => {
        this.$buefy.toast.open({
          message: 'Saving...',
          type: 'is-success'
        });
        this.personaMediaFile = null;
        if (goBack) {
          this.$router.go(-1);
        }
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Update Persona: ' + error);
      });
    },
    deleteAttributes(attributes) {
      for (let i = 0; i < attributes.length; i++) {
        this.$apollo.mutate({
          mutation: MediaPersonas.MediaPersonasUpdate,
          variables: {
            data: {
              attributes: {
                delete: {
                  id: attributes[i].id
                }
              }
            },
            where: {
              id: this.id
            }
          }
        }).then(() => {}).catch(error => {
          this.$buefy.toast.open({
            message: (0,serverError/* serverError */.i)(error.message),
            type: 'is-danger'
          });
          console.error('Update Persona: ' + error);
        });
      }
    },
    deletePersona(id) {
      this.$apollo.mutate({
        mutation: MediaPersonas.MediaPersonasDelete,
        variables: {
          where: {
            id: id
          }
        }
      }).then(() => {
        this.$buefy.toast.open({
          message: 'Persona Deleted!',
          type: 'is-success'
        });
        this.$router.go(-1);
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Persona Deleted: ' + error);
      });
    },
    confirmDeletePersona(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Persona',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePersona(id)
      });
    }
  },
  computed: {
    getChartData() {
      let children;
      children = [...(this.persona.relatesFrom || []), ...(this.persona.relatesTo || [])];
      //modify and reduce the tree to match the shape of the TreeChart component
      children = children.map(relates => {
        let name = relates.name;
        let edge_name = this.persona.name + ' is ' + name + ' of...';
        let node = relates.end;
        if (node.id === this.persona.id) {
          node = relates.start;
          edge_name = ' ...is ' + name + ' of ' + this.persona.name;
        }
        return {
          id: node.id,
          name: node.name,
          image_url: node.avatar ? node.avatar.url.regular : null,
          edge_name
        };
      });
      return {
        edge_name: this.persona.name,
        id: this.persona.id,
        name: this.persona.name,
        image_url: this.persona.avatar ? this.persona.avatar.url.regular : null,
        children: children || []
      };
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasEdits) {
      this.$buefy.dialog.confirm({
        title: 'Unsaved Changes',
        message: 'Would you like to keep editing this page? Leaving this page will discard unsaved changes.',
        type: 'is-primary',
        confirmText: 'Keep Editing',
        cancelText: 'Discard',
        // eslint-disable-next-line space-before-function-paren
        onConfirm: async () => {
          await next(false);
        },
        onCancel: () => {
          next();
        }
      });
    } else {
      next();
    }
  }
});
;// ./src/media/views/personas/Personas-edit.vue?vue&type=script&lang=js
 /* harmony default export */ var personas_Personas_editvue_type_script_lang_js = (Personas_editvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/personas/Personas-edit.vue?vue&type=style&index=0&id=f950a430&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/personas/Personas-edit.vue?vue&type=style&index=0&id=f950a430&prod&lang=scss&scoped=true

;// ./src/media/views/personas/Personas-edit.vue



;


/* normalize component */

var Personas_edit_component = (0,componentNormalizer/* default */.A)(
  personas_Personas_editvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "f950a430",
  null
  
)

/* harmony default export */ var Personas_edit = (Personas_edit_component.exports);

/***/ }),

/***/ 36714:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: function() { return /* binding */ orgchart; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/orgchart.vue?vue&type=template&id=35557edc&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('ol', {
    staticClass: "organizational-chart"
  }, [_vm.treeData.name ? _c('li', [_c('div', {
    on: {
      "click": function ($event) {
        return _vm.$emit('click-node', _vm.treeData);
      }
    }
  }, [_c('div', {
    staticClass: "tooltip",
    attrs: {
      "data-tooltip": _vm.treeData.edge_name
    }
  }, [_vm.treeData.image_url ? _c('div', {
    staticClass: "avat"
  }, [_c('img', {
    staticClass: "is-avatar lg",
    attrs: {
      "src": _vm.treeData.image_url
    }
  })]) : _c('div', {
    staticClass: "avat"
  }, [_vm._m(0)]), _c('div', [_vm._v(_vm._s(_vm.treeData.name))])])]), _c('ol', [_vm.treeData.children && _vm.treeData.extend ? _vm._l(_vm.treeData.children, function (children, index) {
    return _c('li', {
      key: index
    }, [_c('div', {
      on: {
        "click": function ($event) {
          return _vm.$emit('click-node', children);
        }
      }
    }, [_c('div', {
      staticClass: "tooltip",
      attrs: {
        "data-tooltip": children.edge_name
      }
    }, [children.image_url ? _c('div', {
      staticClass: "image is-large is-64x64"
    }, [_c('img', {
      staticClass: "is-avatar lg",
      attrs: {
        "src": children.image_url
      }
    })]) : _c('div', [_vm._m(1, true)]), _c('div', [_vm._v(_vm._s(children.name))])])])]);
  }) : _vm._e()], 2)]) : _vm._e()]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-large"
  }, [_c('i', {
    staticClass: "fas fa-user-circle has-text-grey fa-3x"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-large"
  }, [_c('i', {
    staticClass: "fas fa-user-circle has-text-grey fa-3x"
  })]);
}];

;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/orgchart.vue?vue&type=script&lang=js
/* harmony default export */ var orgchartvue_type_script_lang_js = ({
  name: 'OrgChart',
  props: ['json'],
  data() {
    return {
      treeData: {}
    };
  },
  watch: {
    json: {
      handler: function (Props) {
        let extendKey = function (jsonData) {
          jsonData.extend = jsonData.extend === void 0 ? true : !!jsonData.extend;
          if (Array.isArray(jsonData.children)) {
            jsonData.children.forEach(c => {
              extendKey(c);
            });
          }
          return jsonData;
        };
        if (Props) {
          this.treeData = extendKey(Props);
        }
      },
      immediate: true
    }
  },
  methods: {
    toggleExtend: function (treeData) {
      treeData.extend = !treeData.extend;
      this.$forceUpdate();
    }
  }
});
;// ./src/shared/components/orgchart.vue?vue&type=script&lang=js
 /* harmony default export */ var components_orgchartvue_type_script_lang_js = (orgchartvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/orgchart.vue?vue&type=style&index=0&id=35557edc&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/shared/components/orgchart.vue?vue&type=style&index=0&id=35557edc&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/shared/components/orgchart.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_orgchartvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "35557edc",
  null
  
)

/* harmony default export */ var orgchart = (component.exports);

/***/ }),

/***/ 74558:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: function() { return /* binding */ profile_card; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/profile-card.vue?vue&type=template&id=1d587c1a&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "card article profile-card"
  }, [_vm.showQuickMenu ? _c('nav', {
    staticClass: "level is-pulled-right"
  }, [_c('div', {
    staticClass: "level-left"
  }), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('b-dropdown', {
    attrs: {
      "position": "is-bottom-left"
    }
  }, [_c('a', {
    staticClass: "button is-small",
    attrs: {
      "slot": "trigger"
    },
    slot: "trigger"
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-ellipsis-v"
  })])]), _vm.showEdit ? _c('b-dropdown-item', {
    on: {
      "click": function ($event) {
        return _vm.editProfile(_vm.profile);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-pen"
  })]), _c('span', [_vm._v("Edit Profile")])]) : _vm._e(), _vm.showPermalink ? _c('b-dropdown-item', {
    attrs: {
      "has-link": ""
    }
  }, [_c('a', {
    attrs: {
      "href": _vm.profile.url
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-link"
  })]), _c('span', [_vm._v("Permalink")])])]) : _vm._e(), _c('hr', {
    staticClass: "dropdown-divider"
  }), _vm.showDelete ? _c('b-dropdown-item', {
    on: {
      "click": function ($event) {
        return _vm.confirmDelete(_vm.profile.id);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-times has-text-danger"
  })]), _c('span', [_vm._v("Delete Profile")])]) : _vm._e(), _vm.showDeleteFromPersona ? _c('b-dropdown-item', {
    on: {
      "click": function ($event) {
        return _vm.removeProfile(_vm.profile.id);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-minus-circle has-text-danger"
  })]), _c('span', [_vm._v("Remove from Persona")])]) : _vm._e()], 1)], 1)])]) : _vm._e(), _c('div', {
    on: {
      "click": function ($event) {
        return _vm.viewProfile(_vm.profile);
      }
    }
  }, [_vm.profile.banner ? _c('div', {
    staticClass: "card-image"
  }, [_c('img', {
    attrs: {
      "src": _vm.profile.banner.mediaFile ? _vm.profile.banner.mediaFile.url.thumb : "",
      "alt": "Banner"
    }
  })]) : _c('div', {
    staticClass: "card-image",
    style: 'background: ' + _vm.stringToColor(_vm.profile.username)
  }), _c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "columns is-centered is-desktop"
  }, [_c('div', {
    staticClass: "column is-12"
  }, [_vm.profile.avatar ? _c('div', {
    staticClass: "media-center"
  }, [_c('img', {
    staticClass: "is-avatar xxl author-image",
    attrs: {
      "src": _vm.profile.avatar ? _vm.profile.avatar.url.thumb : "",
      "alt": "image"
    }
  })]) : _c('div', {
    staticClass: "media-center"
  }, [_vm._m(0)])])]), _c('div', {
    staticClass: "media-content has-text-centered"
  }, [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v(_vm._s(_vm.profile.name))]), _c('p', {
    staticClass: "subtitle is-7 has-text-weight-semibold"
  }, [_vm._v("@" + _vm._s(_vm.profile.username)), _c('br'), _vm.profile.service.icon ? _c('span', {
    staticClass: "icon is-small",
    style: 'color:' + _vm.profile.service.color
  }, [_c('i', {
    class: _vm.profile.service.icon
  })]) : _c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-sm"
  })]), _c('span', [_vm._v(" " + _vm._s(_vm.profile.service.displayName))])]), _vm.profile.description ? _c('p', {
    staticClass: "subtitle is-7"
  }, [_vm._v(_vm._s(_vm._f("truncate")(_vm.profile.description, 75)))]) : _vm._e()])])]), _c('footer', {
    staticClass: "card-footer"
  }, [_c('a', {
    staticClass: "card-footer-item",
    on: {
      "click": function ($event) {
        return _vm.createMediaPost(_vm.profile);
      }
    }
  }, [_vm._v(" Create Post ")]), _c('a', {
    staticClass: "card-footer-item",
    on: {
      "click": function ($event) {
        return _vm.viewProfile(_vm.profile);
      }
    }
  }, [_vm._v(" View Posts ")])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "fa-9x"
  }, [_c('span', {
    staticClass: "fa-layers author-image"
  }, [_c('i', {
    staticClass: "fas fa-circle has-text-grey-light",
    attrs: {
      "data-fa-transform": "grow-1"
    }
  }), _c('i', {
    staticClass: "fas fa-user-circle has-text-white"
  })])]);
}];

// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(21809);
;// ./src/shared/mixins/stringColor.js
/* harmony default export */ var stringColor = ({
  methods: {
    stringToColor(str) {
      // use hsl to define the background color.
      let hash = 0;
      if (str.length == 0) return hash;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
      }
      let hue = hash % 360;
      return `hsl(${hue}, 68%, 48%)`;
    }
  }
});
// EXTERNAL MODULE: ./src/shared/mixins/mediaPost.js
var mediaPost = __webpack_require__(76714);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(97750);
// EXTERNAL MODULE: ./src/media/graphql/MediaProfiles.gql
var MediaProfiles = __webpack_require__(14840);
// EXTERNAL MODULE: ./src/media/graphql/MediaPersonas.gql
var MediaPersonas = __webpack_require__(52433);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/profile-card.vue?vue&type=script&lang=js






/* harmony default export */ var profile_cardvue_type_script_lang_js = ({
  name: 'profile-card',
  props: {
    profile: {
      type: Object,
      default: null
    },
    showQuickMenu: {
      type: Boolean,
      default: true
    },
    showEdit: {
      type: Boolean,
      default: false
    },
    showPermalink: {
      type: Boolean,
      default: false
    },
    showDelete: {
      type: Boolean,
      default: false
    },
    showDeleteFromPersona: {
      type: Boolean,
      default: false
    }
  },
  mixins: [helpers/* default */.A, stringColor, mediaPost/* default */.A],
  data() {
    return {};
  },
  methods: {
    viewProfile(profile) {
      this.$router.push({
        name: 'viewprofile',
        params: {
          service: profile.service.name,
          profile: profile.username
        }
      });
    },
    editProfile(profile) {
      this.$router.push({
        name: 'editprofile',
        params: {
          service: profile.service.name,
          profile: profile.username,
          id: profile.id
        }
      });
    },
    deleteMediaProfile(profile) {
      // Delete Media Profile
      this.$apollo.mutate({
        mutation: MediaProfiles.MediaProfilesDelete,
        variables: {
          id: {
            id: profile
          }
        }
      }).then(() => {
        this.$buefy.toast.open({
          message: 'Profile Deleted!',
          type: 'is-success'
        });
        this.confirmBox = false;
      }).catch(error => {
        this.$buefy.toast.open({
          message: 'There was an error',
          type: 'is-danger'
        });
        console.error('Delete Profile: ' + error);
      });
    },
    confirmDelete(profile) {
      this.$buefy.dialog.confirm({
        title: 'Delete Profile',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteMediaProfile(profile)
      });
    },
    removeProfile(profileid) {
      this.$apollo.mutate({
        mutation: MediaPersonas.MediaPersonasUpdateProfile,
        variables: {
          data: {
            profiles: {
              disconnect: {
                id: profileid
              }
            }
          },
          where: {
            id: this.id
          }
        }
      }).then(() => {
        this.$buefy.toast.open({
          message: 'Profile Removed from Persona!',
          type: 'is-success'
        });
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Remove Profile from Persona: ' + error);
      });
    }
  }
});
;// ./src/shared/components/profile-card.vue?vue&type=script&lang=js
 /* harmony default export */ var components_profile_cardvue_type_script_lang_js = (profile_cardvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/profile-card.vue?vue&type=style&index=0&id=1d587c1a&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/shared/components/profile-card.vue?vue&type=style&index=0&id=1d587c1a&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/shared/components/profile-card.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_profile_cardvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "1d587c1a",
  null
  
)

/* harmony default export */ var profile_card = (component.exports);

/***/ })

}]);