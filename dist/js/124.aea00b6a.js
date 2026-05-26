"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[124],{

/***/ 48124:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Personas_view; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/personas/Personas-view.vue?vue&type=template&id=00e76646&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "is-relative-mobile"
  }, [_c('breadcrumb', {
    attrs: {
      "currentPage": _vm.mediaPersona ? _vm.mediaPersona.name : ''
    }
  }), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }, [_vm.mediaPersona ? _c('div', {
    staticClass: "level-item"
  }, [_c('button', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.editPersona(_vm.mediaPersona);
      }
    }
  }, [_c('span', [_vm._v("Edit Persona")])])]) : _vm._e()]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('help-content', {
    attrs: {
      "reference": 'media.personasview',
      "toggle": "",
      "dropdown": ""
    }
  })], 1)])]), _vm.mediaPersona && _vm.mediaPersona.id != null ? _c('div', [_c('div', {
    staticClass: "columns is-centered"
  }, [_vm.mediaPersona ? _c('div', {
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
        return _vm.editPersona(_vm.mediaPersona);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-pen"
  })]), _c('span', [_vm._v("Edit Persona")])]), _c('hr', {
    staticClass: "dropdown-divider"
  }), _c('b-dropdown-item', {
    on: {
      "click": function ($event) {
        return _vm.confirmDeletePersona(_vm.mediaPersona.id);
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
    staticClass: "content"
  }, [_c('p', {
    staticClass: "title is-5"
  }, [_vm._v(" " + _vm._s(_vm.mediaPersona.name) + " ")]), _c('p', {
    staticClass: "subtitle is-7"
  }, [_vm._v(" " + _vm._s(_vm.mediaPersona.role) + " ")]), _vm.mediaPersona.avatar != null ? _c('img', {
    staticClass: "is-avatar xxl",
    attrs: {
      "src": _vm.mediaPersona.avatar.url.thumb,
      "alt": "image"
    },
    on: {
      "click": function ($event) {
        return _vm.imagePreview(_vm.mediaPersona.avatar);
      }
    }
  }) : _c('span', {
    staticClass: "icon is-xxlarge"
  }, [_c('i', {
    staticClass: "fas fa-user-circle has-text-grey fa-6x"
  })])])]), _c('article', {
    staticClass: "tile is-child notification is-white"
  }, [_vm.mediaPersona.location ? _c('geocode', {
    attrs: {
      "coordinates": _vm.mediaPersona.location.geojson.coordinates
    }
  }) : _vm._e()], 1)])])]), _c('div', {
    staticClass: "tile is-4 is-parent"
  }, [_c('article', {
    staticClass: "tile notification is-white"
  }, [_vm.mediaPersona && _vm.mediaPersona.attributes.length > 0 ? _c('div', _vm._l(_vm.mediaPersona.attributes, function (attributes) {
    return _c('p', {
      key: attributes.id
    }, [_c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(attributes.key))]), _vm._v(": " + _vm._s(attributes.value))]);
  }), 0) : _c('div', [_c('p', [_vm._v("Edit this Persona to create Attributes")])])])]), _c('div', {
    staticClass: "tile is-4 is-parent description"
  }, [_c('article', {
    staticClass: "tile notification is-white content"
  }, [_vm.mediaPersona.description ? _c('div', {
    domProps: {
      "innerHTML": _vm._s(_vm.mediaPersona.description)
    }
  }) : _c('div', [_c('h3', [_vm._v("Description")]), _c('p', [_vm._v("None")])])])])])]), _c('div', {
    staticClass: "column is-full"
  }, [_c('div', {
    staticClass: "tile is-ancestor"
  }, [_c('div', {
    staticClass: "tile is-parent is-12 is-vertical"
  }, [_c('article', {
    staticClass: "tile is-child relations notification is-white"
  }, [_c('nav', {
    staticClass: "level"
  }, [_vm._m(1), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('div', {
    staticClass: "field has-addons"
  }, [_c('p', {
    staticClass: "control"
  }, [_c('button', {
    staticClass: "button",
    attrs: {
      "title": "Tree"
    },
    on: {
      "click": function ($event) {
        _vm.relationsView = 'tree';
      }
    }
  }, [_vm._m(2)])]), _c('p', {
    staticClass: "control"
  }, [_c('button', {
    staticClass: "button",
    attrs: {
      "title": "List"
    },
    on: {
      "click": function ($event) {
        _vm.relationsView = 'list';
      }
    }
  }, [_vm._m(3)])])])])])]), _c('section', {
    staticClass: "section"
  }, [_vm.relationsView == 'tree' ? _c('div', [_c('OrgChart', {
    attrs: {
      "json": _vm.treeChart
    },
    on: {
      "click-node": _vm.clickNode
    }
  })], 1) : _vm._e(), _vm.relationsView == 'list' ? _c('div', [_vm.mediaPersona.relatesTo ? _c('ul', {
    staticClass: "bd-anchors-list"
  }, _vm._l(_vm.mediaPersona.relatesTo, function (relation) {
    return _c('li', {
      key: relation.id
    }, [_c('p', [_c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(relation.start.name))]), _vm._v(" is "), _c('span', {
      staticClass: "title is-italic is-6"
    }, [_vm._v(_vm._s(relation.name))]), _vm._v(" of "), _c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(relation.end.name))])])]);
  }), 0) : _vm._e(), _vm.mediaPersona.relatesFrom ? _c('ul', {
    staticClass: "bd-anchors-list"
  }, _vm._l(_vm.mediaPersona.relatesFrom, function (relation) {
    return _c('li', {
      key: relation.id
    }, [_c('p', [_c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(relation.start.name))]), _vm._v(" is "), _c('span', {
      staticClass: "title is-italic is-6"
    }, [_vm._v(_vm._s(relation.name))]), _vm._v(" of "), _c('span', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(relation.end.name))])])]);
  }), 0) : _vm._e()]) : _vm._e()])])])])])])])], 1)]) : _vm._e()]), _vm.mediaPersona && _vm.mediaPersona.profiles && _vm.mediaPersona.profiles.length > 0 ? _c('div', [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v(_vm._s(_vm.mediaPersona.profiles.length) + " Linked Profiles")]), _c('div', {
    staticClass: "columns is-desktop is-multiline"
  }, _vm._l(_vm.mediaPersona.profiles, function (mediaProfile) {
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
      "data": _vm.mediaPersona.profiles,
      "isLoading": _vm.$apollo.loading
    }
  }, [_c('template', {
    slot: "custom-message"
  }, [_c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v("No Profiles found.")])])], 2)], 1), _vm.mediaPersona ? _c('div', [_c('media-preview', {
    attrs: {
      "open": _vm.imagePreviewModal,
      "file": _vm.selectedImage
    },
    on: {
      "close": _vm.closeModal
    }
  })], 1) : _vm._e()]) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaPersona,
      "isLoading": _vm.$apollo.loading
    }
  })], 1)], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('article', {
    staticClass: "tile is-child notification is-success personaClass"
  }, [_c('p', {
    staticClass: "title is-5 has-text-white has-text-bold"
  }, [_vm._v("UNCLASSIFIED")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v("Linked Relationships")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-sitemap has-text-grey"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-align-justify has-text-grey"
  })]);
}];

// EXTERNAL MODULE: ./src/shared/components/profile-card.vue + 6 modules
var profile_card = __webpack_require__(74558);
// EXTERNAL MODULE: ./src/media/graphql/MediaPersonas.gql
var MediaPersonas = __webpack_require__(52433);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(21809);
// EXTERNAL MODULE: ./src/shared/mixins/mediaPost.js
var mediaPost = __webpack_require__(76714);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(97750);
// EXTERNAL MODULE: ./src/shared/components/mediaPreview.vue + 5 modules
var mediaPreview = __webpack_require__(82483);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(21823);
// EXTERNAL MODULE: ./src/shared/components/orgchart.vue + 5 modules
var orgchart = __webpack_require__(36714);
// EXTERNAL MODULE: ./src/shared/components/geocode.vue + 3 modules
var geocode = __webpack_require__(37133);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/personas/Personas-view.vue?vue&type=script&lang=js









/* harmony default export */ var Personas_viewvue_type_script_lang_js = ({
  name: 'PersonasView',
  mixins: [helpers/* default */.A, mediaPost/* default */.A],
  props: ['id'],
  components: {
    ProfileCard: profile_card/* default */.A,
    HelpContent: helpcontent/* default */.A,
    MediaPreview: mediaPreview/* default */.A,
    OrgChart: orgchart/* default */.A,
    Geocode: geocode/* default */.A
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
      }
    }
  },
  data() {
    return {
      relationsView: 'tree',
      imagePreviewModal: false,
      selectedImage: null,
      open: false,
      openPost: false
    };
  },
  methods: {
    viewPersona(persona) {
      this.$router.push({
        name: 'viewpersona',
        params: {
          id: persona.id
        }
      });
    },
    editPersona(persona) {
      this.$router.push({
        name: 'editpersona',
        params: {
          id: persona.id
        }
      });
    },
    clickNode: function (node) {
      this.$router.push({
        name: 'viewpersona',
        params: {
          id: node.id
        }
      });
    },
    imagePreview(image) {
      this.imagePreviewModal = true;
      this.selectedImage = image;
    },
    closeModal() {
      this.imagePreviewModal = false;
      this.selectedImage = null;
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
  watch: {
    mediaPersona() {
      if (!this.mediaPersona) return;
      this.treeChart = [...(this.mediaPersona.relatesFrom || []), ...(this.mediaPersona.relatesTo || [])];

      //modify and reduce the tree to match the shape of the TreeChart component
      this.treeChart = this.treeChart.map(relates => {
        let name = relates.name;
        let edge_name = this.mediaPersona.name + ' is ' + name + ' of...';
        let node = relates.end;
        if (node.id === this.mediaPersona.id) {
          node = relates.start;
          edge_name = ' ...is ' + name + ' of ' + this.mediaPersona.name;
        }
        return {
          id: node.id,
          name: node.name,
          image_url: node.avatar ? node.avatar.url.regular : null,
          edge_name
        };
      });
      this.treeChart = {
        edge_name: this.mediaPersona.name,
        id: this.mediaPersona.id,
        name: this.mediaPersona.name,
        image_url: this.mediaPersona.avatar ? this.mediaPersona.avatar.url.regular : null,
        children: this.treeChart
      };
    }
  }
});
;// ./src/media/views/personas/Personas-view.vue?vue&type=script&lang=js
 /* harmony default export */ var personas_Personas_viewvue_type_script_lang_js = (Personas_viewvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/personas/Personas-view.vue?vue&type=style&index=0&id=00e76646&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/personas/Personas-view.vue?vue&type=style&index=0&id=00e76646&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/personas/Personas-view.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  personas_Personas_viewvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "00e76646",
  null
  
)

/* harmony default export */ var Personas_view = (component.exports);

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