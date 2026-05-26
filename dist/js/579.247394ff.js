"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[579],{

/***/ 33579:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Networks_edit; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/networks/Networks-edit.vue?vue&type=template&id=1150b024&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "is-relative-mobile"
  }, [_c('breadcrumb', {
    attrs: {
      "currentPage": _vm.mediaNetwork ? _vm.mediaNetwork.name : ''
    }
  }), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }), _c('div', {
    staticClass: "level-right"
  }, [_c('help-content', {
    attrs: {
      "reference": "media.networksedit",
      "toggle": "",
      "dropdown": ""
    }
  })], 1)]), _vm.mediaNetwork && _vm.mediaNetwork.id != null ? _c('div', [_c('div', {
    staticClass: "columns is-multiline is-centered is-mobile"
  }, [_c('div', {
    staticClass: "column is-8-desktop is-three-quarters-tablet is-12-mobile"
  }, [_vm.network ? _c('div', {
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
        return _vm.viewNetwork(_vm.mediaNetwork.id);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-link"
  })]), _c('span', [_vm._v("View Network")])]), _c('hr', {
    staticClass: "dropdown-divider"
  }), _c('b-dropdown-item', {
    on: {
      "click": function ($event) {
        return _vm.confirmDeleteNetwork(_vm.mediaNetwork.id);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-times has-text-danger"
  })]), _c('span', [_vm._v("Delete Network")])])], 1), _c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "media"
  }, [_c('div', {
    staticClass: "media-left"
  }, [_vm.network.avatar != null ? _c('figure', {
    staticClass: "image is-48x48"
  }, [_c('img', {
    staticClass: "is-avatar md",
    attrs: {
      "src": _vm.network.avatar.url.thumb,
      "alt": "image"
    }
  })]) : _c('figure', {
    staticClass: "image is-48x48"
  }, [_vm._m(0)])]), _c('div', {
    staticClass: "media-content"
  }, [_c('div', {
    staticClass: "columns is-mobile is-multiline"
  }, [_c('div', {
    staticClass: "column is-12-desktop is-12-tablet is-12-mobile"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Name "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.network.name,
      expression: "network.name"
    }],
    staticClass: "input",
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": _vm.network.name
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.network, "name", $event.target.value);
      }
    }
  })]), _c('label', {
    staticClass: "label"
  }, [_vm._v(" Description "), _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.network.description,
      expression: "network.description"
    }],
    staticClass: "textarea",
    domProps: {
      "value": _vm.network.description
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.network, "description", $event.target.value);
      }
    }
  })])]), _c('div', {
    staticClass: "column"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Avatar ")]), _c('ImagePicker', {
    attrs: {
      "rootSearch": 'avatar',
      "mediaFile": _vm.network.avatar
    },
    model: {
      value: _vm.networkMediaFile,
      callback: function ($$v) {
        _vm.networkMediaFile = $$v;
      },
      expression: "networkMediaFile"
    }
  })], 1)])])])]), _c('footer', {
    staticClass: "modal-card-foot"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.save();
      }
    }
  }, [_vm._v(" Save ")]), _c('button', {
    staticClass: "button is-primary is-outlined",
    on: {
      "click": function ($event) {
        return _vm.cancel();
      }
    }
  }, [_vm._v(" Cancel ")])])], 1) : _vm._e()])]), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.openAddPersona(_vm.mediaNetwork);
      }
    }
  }, [_vm._v(" Add Personas ")])])]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_vm.personasToAdd ? _c('span', {
    staticClass: "help has-text-danger"
  }, [_c('i', {
    staticClass: "fas fa-asterisk"
  }), _vm._v(" Pending updates")]) : _vm._e()])])]), _vm.mediaNetwork && _vm.mediaNetwork.personas.length > 0 ? _c('div', {
    staticClass: "columns is-desktop is-multiline is-centered"
  }, _vm._l(_vm.mediaNetwork.personas, function (personas) {
    return _c('div', {
      key: personas.id,
      staticClass: "column is-4-desktop"
    }, [_c('div', {
      staticClass: "card persona"
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
    })]), _c('span', [_vm._v("Edit Persona")])]), _c('b-dropdown-item', {
      on: {
        "click": function ($event) {
          return _vm.removePersona(personas.id);
        }
      }
    }, [_c('span', {
      staticClass: "icon is-small"
    }, [_c('i', {
      staticClass: "fas fa-minus-circle has-text-danger"
    })]), _c('span', [_vm._v("Remove from Network")])])], 1), _c('div', {
      staticClass: "card-content",
      on: {
        "click": function ($event) {
          return _vm.openPersonaPreview(personas);
        }
      }
    }, [_c('div', {
      staticClass: "media"
    }, [_c('div', {
      staticClass: "media-left"
    }, [personas.avatar != null ? _c('figure', {
      staticClass: "image"
    }, [_c('img', {
      staticClass: "is-avatar lg",
      attrs: {
        "src": personas.avatar.url.thumb,
        "alt": "image"
      }
    })]) : _c('figure', {
      staticClass: "image is-48x48"
    }, [_vm._m(1, true)])]), _c('div', {
      staticClass: "media-content"
    }, [_c('p', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(personas.name))]), _c('p', {
      staticClass: "subtitle is-7 profile-description"
    }, [_vm._v(_vm._s(personas.role))]), personas.profiles ? _c('p', {
      staticClass: "subtitle is-7"
    }, [_vm._v(_vm._s(personas.profiles.length) + " Linked Profiles")]) : _vm._e()])])]), _c('footer', {
      staticClass: "card-footer"
    }, [_c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.editPersona(_vm.mediaPersona);
        }
      }
    }, [_vm._v(" Edit ")]), _c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.viewPersona(_vm.mediaPersona);
        }
      }
    }, [_vm._v(" View Persona ")])])], 1)]);
  }), 0) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaNetwork.personas,
      "search": _vm.searchQuery ? true : false,
      "isLoading": _vm.$apollo.loading
    }
  }, [_c('template', {
    slot: "custom-message"
  }, [_c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v("No Personas found.")])])], 2)], 1)]) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaNetwork,
      "isLoading": _vm.$apollo.loading
    }
  })], 1), _c('persona-create', {
    attrs: {
      "open": _vm.openDialog
    },
    on: {
      "close": function ($event) {
        return _vm.toggleCreatePersona(false);
      }
    }
  }), _c('network-add-persona', {
    attrs: {
      "open": _vm.openPersona,
      "mediaNetwork": _vm.selectedNetwork
    },
    on: {
      "addPersona": _vm.handleAddPersona,
      "close": _vm.closeAddPersona
    }
  })], 1);
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

// EXTERNAL MODULE: ./src/media/graphql/MediaNetworks.gql
var MediaNetworks = __webpack_require__(7695);
// EXTERNAL MODULE: ./src/shared/components/imagepicker.vue + 5 modules
var imagepicker = __webpack_require__(78892);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(77449);
// EXTERNAL MODULE: ./node_modules/vue/dist/vue.runtime.esm.js
var vue_runtime_esm = __webpack_require__(85471);
// EXTERNAL MODULE: ./src/media/graphql/MediaPersonas.gql
var MediaPersonas = __webpack_require__(52433);
// EXTERNAL MODULE: ./src/media/components/personas-create.vue + 3 modules
var personas_create = __webpack_require__(99500);
;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/networks-addpersona.vue?vue&type=template&id=7b543460&scoped=true
var networks_addpersonavue_type_template_id_7b543460_scoped_true_render = function render() {
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
  }, [_vm._v("Add Personas to Network")]), _c('button', {
    staticClass: "delete",
    attrs: {
      "aria-label": "close"
    },
    on: {
      "click": function ($event) {
        return _vm.close();
      }
    }
  })]), _vm.mediaNetwork && _vm.mediaPersonae ? _c('section', {
    staticClass: "modal-card-body"
  }, [_c('div', {
    staticClass: "columns is-centered"
  }, [_c('div', {
    staticClass: "column is-10"
  }, [_c('div', {
    staticClass: "media"
  }, [_c('div', {
    staticClass: "media-left"
  }, [_vm.mediaNetwork.avatar != null ? _c('figure', {
    staticClass: "image is-96x96"
  }, [_c('img', {
    staticClass: "is-avatar xl",
    attrs: {
      "src": _vm.mediaNetwork.avatar.url.thumb,
      "alt": "image"
    }
  })]) : _c('figure', {
    staticClass: "image is-48x48"
  }, [_vm._m(0)])]), _c('div', {
    staticClass: "media-content"
  }, [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v(_vm._s(_vm.mediaNetwork.name))])]), _vm.selectedPersonas && _vm.selectedPersonas.length > 0 ? _c('div', {
    staticClass: "media-right"
  }, [_vm._m(1), _c('span', [_vm._v(_vm._s(_vm.selectedPersonas.length))])]) : _vm._e()]), _c('div', {
    staticClass: "content"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.toggleQuickPersona();
      }
    }
  }, [_vm._v(" Create Quick Persona ")]), _c('div', {
    staticClass: "is-divider",
    attrs: {
      "data-content": "or search existing personas"
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
  }), _vm._m(2)])]), _vm.mediaPersonae && _vm.mediaPersonae.length > 0 ? _c('div', {
    staticClass: "field"
  }, [_c('div', {
    staticClass: "select is-multiple is-fullwidth"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.selectedPersonas,
      expression: "selectedPersonas"
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
        _vm.selectedPersonas = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }
    }
  }, _vm._l(_vm.mediaPersonae, function (persona) {
    return _c('option', {
      key: persona.id,
      domProps: {
        "value": persona.id
      }
    }, [_vm._v(" " + _vm._s(persona.name) + " - " + _vm._s(persona.role) + " ")]);
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
  }, [_vm._v(" Cancel ")])])])]), _c('persona-quick-add', {
    attrs: {
      "open": _vm.quickAdd
    },
    on: {
      "close": _vm.toggleQuickPersona
    }
  })], 1);
};
var networks_addpersonavue_type_template_id_7b543460_scoped_true_staticRenderFns = [function () {
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

// EXTERNAL MODULE: ./src/media/components/personas-quickadd.vue + 3 modules
var personas_quickadd = __webpack_require__(33767);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/components/networks-addpersona.vue?vue&type=script&lang=js


/* harmony default export */ var networks_addpersonavue_type_script_lang_js = ({
  name: 'networks-addpersona',
  components: {
    PersonaQuickAdd: personas_quickadd/* default */.A
  },
  props: {
    mediaNetwork: {},
    open: {
      default: false
    }
  },
  apollo: {
    mediaPersonae: {
      query: MediaPersonas.MediaPersonasList,
      variables() {
        return {
          where: {
            name_contains: this.searchQuery
          },
          orderBy: 'name_DESC'
        };
      },
      subscribeToMore: [{
        document: MediaPersonas.MediaPersonaSubscription,
        // Mutate the previous result
        updateQuery(previousResult, {
          subscriptionData
        }) {
          // Mutation type
          let mutationIn = subscriptionData.data.mediaPersona.mutation;
          var newResult;
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
          // Here, return the new result from the previous with the new data
          return newResult;
        }
      }]
    }
  },
  data() {
    return {
      selectedPersonas: [],
      searchQuery: '',
      quickAdd: false
    };
  },
  methods: {
    close() {
      this.$emit('close');
      this.selectedPersonas = [];
    },
    toggleQuickPersona() {
      this.quickAdd = !this.quickAdd;
    },
    save() {
      let personasArray = [];
      for (let i = 0; i < this.selectedPersonas.length; i++) {
        personasArray.push({
          id: this.selectedPersonas[i]
        });
      }
      this.$emit('addPersona', personasArray);
      this.close();
    },
    reviewChanges() {
      this.$buefy.dialog.confirm({
        title: 'Review Personas',
        message: `You are adding ${this.selectedPersonas.length} Personas`,
        type: 'is-warning',
        onConfirm: () => this.save()
      });
    }
  },
  watch: {
    mediaNetwork() {
      if (this.mediaNetwork.personas) {
        for (let i = 0; i < this.mediaNetwork.personas.length; i++) {
          this.selectedPersonas.push(this.mediaNetwork.personas[i].id);
        }
      }
    }
  }
});
;// ./src/media/components/networks-addpersona.vue?vue&type=script&lang=js
 /* harmony default export */ var components_networks_addpersonavue_type_script_lang_js = (networks_addpersonavue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/components/networks-addpersona.vue





/* normalize component */
;
var component = (0,componentNormalizer/* default */.A)(
  components_networks_addpersonavue_type_script_lang_js,
  networks_addpersonavue_type_template_id_7b543460_scoped_true_render,
  networks_addpersonavue_type_template_id_7b543460_scoped_true_staticRenderFns,
  false,
  null,
  "7b543460",
  null
  
)

/* harmony default export */ var networks_addpersona = (component.exports);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(66510);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/networks/Networks-edit.vue?vue&type=script&lang=js








/* harmony default export */ var Networks_editvue_type_script_lang_js = ({
  name: 'NetworkEdit',
  props: ['id'],
  components: {
    HelpContent: helpcontent/* default */.A,
    ImagePicker: imagepicker/* default */.A,
    PersonaCreate: personas_create/* default */.A,
    NetworkAddPersona: networks_addpersona
  },
  apollo: {
    mediaNetwork: {
      query: MediaNetworks.MediaNetworkRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        };
      },
      update(data) {
        this.selectedPersonae = data.mediaNetwork.personas;
        this.network = vue_runtime_esm/* default */.Ay.util.extend({}, data.mediaNetwork);
        return data.mediaNetwork;
      },
      subscribeToMore: [{
        document: MediaNetworks.MediaNetworksSubscription,
        // Mutate the previous result
        updateQuery(previousResult, {
          subscriptionData
        }) {
          // Mutation type
          let mutationIn = subscriptionData.data.mediaNetwork.mutation;
          let newResult;
          switch (mutationIn) {
            case 'CREATED':
              {
                newResult = {
                  mediaNetworks: [...previousResult.mediaNetworks, subscriptionData.data.mediaNetwork.node]
                };
                break;
              }
            case 'DELETED':
              {
                this.$apollo.queries.mediaNetwork.refetch();
                break;
              }
            case 'UPDATED':
              {
                this.$apollo.queries.mediaNetwork.refetch();
                break;
              }
            default:
              {
                throw new Error(`Unknown Subscription Mutation`);
              }
          }
          // Here, return the new result from the previous with the new data
          return newResult;
        }
      }]
    },
    mediaPersonae: {
      query: MediaPersonas.MediaPersonasList,
      variables() {
        return {
          skip: this.itemsPerPage * (this.paged - 1),
          first: this.itemsPerPage
        };
      },
      subscribeToMore: [{
        document: MediaPersonas.MediaPersonaSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, {
          subscriptionData
        }) => {
          // Here, return the new result from the previous with the new data
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
                let updatedMediaPersonae = JSON.parse(JSON.stringify(previousResult.mediaPersonae));
                let index = updatedMediaPersonae.findIndex(x => x.id === subscriptionData.data.mediaPersona.node.id);
                updatedMediaPersonae[index] = subscriptionData.data.mediaPersona.node;
                newResult = {
                  mediaPersonae: updatedMediaPersonae
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
      searchQuery: '',
      selectedPersonae: null,
      openPersona: false,
      selectedNetwork: '',
      networkMediaFile: null,
      network: null,
      mediaPersonae: [],
      openDialog: false,
      personasToAdd: null
    };
  },
  watch: {
    networkMediaFile() {
      if (this.networkMediaFile != null) {
        this.network.avatar = this.networkMediaFile.create;
      }
    }
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
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
    viewNetwork(id) {
      this.$router.push({
        name: 'viewnetwork',
        params: {
          id: id
        }
      });
    },
    handleAddPersona(persona) {
      this.personasToAdd = persona;
    },
    openAddPersona(network) {
      this.selectedNetwork = network;
      this.openPersona = true;
    },
    closeAddPersona() {
      this.openPersona = false;
      this.selectedNetwork = '';
    },
    save() {
      let data = {
        name: this.network.name,
        description: this.network.description
      };
      if (this.networkMediaFile) {
        // avatar added
        data = Object.assign(data, {
          avatar: this.networkMediaFile
        });
      }
      if (this.personasToAdd) {
        let personas = {
          personas: {
            connect: this.personasToAdd
          }
        };
        data = {
          ...data,
          ...personas
        };
      }
      this.$apollo.mutate({
        mutation: MediaNetworks.MediaNetworksUpdate,
        variables: {
          data: data,
          where: {
            id: this.id
          }
        }
      }).then(() => {
        this.$buefy.toast.open({
          message: 'Saving...',
          type: 'is-success'
        });
        this.networkMediaFile = null;
        this.$emit('close');
        this.$router.go(-1);
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Update Network: ' + error);
      });
    },
    removePersona(personaid) {
      this.$apollo.mutate({
        mutation: MediaNetworks.MediaNetworksUpdatePersonas,
        variables: {
          data: {
            personas: {
              disconnect: {
                id: personaid
              }
            }
          },
          where: {
            id: this.id
          }
        }
      }).then(() => {
        this.$buefy.toast.open({
          message: 'Persona Removed from Network!',
          type: 'is-success'
        });
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Persona Removed from Network: ' + error);
      });
    },
    toggleCreatePersona(value) {
      this.openDialog = value;
    },
    confirmDeleteNetwork(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete Network',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteNetwork(id)
      });
    },
    deleteNetwork(Network) {
      // Delete Network
      this.$apollo.mutate({
        mutation: MediaNetworks.MediaNetworksDelete,
        variables: {
          id: {
            id: Network
          }
        }
      }).then(() => {
        this.$buefy.toast.open({
          message: 'Network Deleted!',
          type: 'is-success'
        });
        this.$router.go(-1);
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Delete Network: ' + error);
      });
    }
  }
});
;// ./src/media/views/networks/Networks-edit.vue?vue&type=script&lang=js
 /* harmony default export */ var networks_Networks_editvue_type_script_lang_js = (Networks_editvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/networks/Networks-edit.vue?vue&type=style&index=0&id=1150b024&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/networks/Networks-edit.vue?vue&type=style&index=0&id=1150b024&prod&lang=scss&scoped=true

;// ./src/media/views/networks/Networks-edit.vue



;


/* normalize component */

var Networks_edit_component = (0,componentNormalizer/* default */.A)(
  networks_Networks_editvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "1150b024",
  null
  
)

/* harmony default export */ var Networks_edit = (Networks_edit_component.exports);

/***/ })

}]);