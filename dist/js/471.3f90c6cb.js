"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[471],{

/***/ 96471:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Personas; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/personas/Personas.vue?vue&type=template&id=108b1b89&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    directives: [{
      name: "infinite-scroll",
      rawName: "v-infinite-scroll",
      value: _vm.loadMore,
      expression: "loadMore"
    }],
    attrs: {
      "infinite-scroll-disabled": "busyLoading",
      "infinite-scroll-distance": "50"
    }
  }, [_c('div', {
    staticClass: "is-relative-mobile"
  }, [_c('breadcrumb'), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.toggleCreatePersona();
      }
    }
  }, [_vm._v(" Create Persona ")])])]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('span', {
    staticClass: "has-text-weight-semibold"
  }, [_vm._v(_vm._s(_vm.mediaPersonasCount) + " Personas")])]), _c('div', {
    staticClass: "level-item"
  }, [_c('div', {
    staticClass: "field"
  }, [_c('p', {
    staticClass: "control has-icons-left has-icons-right"
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
    staticClass: "input is-rounded is-primary",
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
  }), _vm._m(0), _c('span', {
    staticClass: "icon is-small is-right",
    on: {
      "click": function ($event) {
        _vm.searchQuery = '';
      }
    }
  }, [_c('i', {
    staticClass: "fas fa-times-circle"
  })])])])]), _c('div', {
    staticClass: "level-item"
  }, [_c('help-content', {
    attrs: {
      "reference": 'media.personas',
      "toggle": "",
      "dropdown": ""
    }
  })], 1)])]), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('div', {
    staticClass: "select"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.selectOrderBy,
      expression: "selectOrderBy"
    }],
    on: {
      "change": function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.selectOrderBy = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }
    }
  }, [_c('optgroup', {
    attrs: {
      "label": "Sort By"
    }
  }, _vm._l(_vm.typesOrderBy, function (option) {
    return _c('option', {
      key: option.type,
      domProps: {
        "value": option.type
      }
    }, [_vm._v(" " + _vm._s(option.name) + " ")]);
  }), 0)])])])])]), _vm.mediaPersonae && _vm.mediaPersonae.length > 0 ? _c('div', {
    staticClass: "columns is-desktop is-multiline"
  }, [_vm._l(_vm.mediaPersonae, function (mediaPersona) {
    return _c('div', {
      key: mediaPersona.id,
      staticClass: "column is-4-desktop"
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
          return _vm.viewPersona(mediaPersona);
        }
      }
    }, [_c('span', {
      staticClass: "icon is-small"
    }, [_c('i', {
      staticClass: "fas fa-link"
    })]), _c('span', [_vm._v("View Persona")])]), _c('b-dropdown-item', {
      on: {
        "click": function ($event) {
          return _vm.editPersona(mediaPersona);
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
          return _vm.confirmDeletePersona(mediaPersona.id);
        }
      }
    }, [_c('span', {
      staticClass: "icon is-small"
    }, [_c('i', {
      staticClass: "fas fa-times has-text-danger"
    })]), _c('span', [_vm._v("Delete Persona")])])], 1), _c('div', {
      on: {
        "click": function ($event) {
          return _vm.viewPersona(mediaPersona);
        }
      }
    }, [_c('div', {
      staticClass: "card-content"
    }, [_c('div', {
      staticClass: "media"
    }, [_c('div', {
      staticClass: "media-left"
    }, [mediaPersona.avatar != null ? _c('figure', {
      staticClass: "image is-96x96"
    }, [_c('img', {
      staticClass: "is-avatar xl",
      attrs: {
        "src": mediaPersona.avatar.url.thumb,
        "alt": "image"
      }
    })]) : _c('figure', {
      staticClass: "image is-96x96"
    }, [_vm._m(1, true)])]), _c('div', {
      staticClass: "media-content"
    }, [_c('p', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(mediaPersona.name))]), _c('p', {
      staticClass: "subtitle is-7"
    }, [_vm._v(_vm._s(_vm._f("truncate")(mediaPersona.role, 25)))]), mediaPersona.profiles ? _c('p', {
      staticClass: "subtitle is-7"
    }, [_vm._v(_vm._s(mediaPersona.profiles.length) + " Linked Profiles")]) : _vm._e()])])])]), _c('footer', {
      staticClass: "card-footer"
    }, [_c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.editPersona(mediaPersona);
        }
      }
    }, [_vm._v(" Edit ")]), _c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.viewPersona(mediaPersona);
        }
      }
    }, [_vm._v(" View Persona ")])])], 1)]);
  }), _vm.busyLoading ? _c('div', {
    staticClass: "column is 12"
  }, [_vm._m(2), _c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v("Loading More Personas... ")])]) : _vm._e()], 2) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaPersonae,
      "search": _vm.searchQuery ? true : false,
      "isLoading": _vm.$apollo.loading
    }
  }, [_c('template', {
    slot: "action-buttons"
  }, [_c('div', {
    staticClass: "buttons is-centered is-spaced"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.toggleCreatePersona();
      }
    }
  }, [_vm._v(" Create Persona ")])])])], 2)], 1), _c('back-to-top', {
    attrs: {
      "bottom": "20px",
      "right": "20px"
    }
  }, [_c('button', {
    staticClass: "button",
    attrs: {
      "type": "button"
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-arrow-up"
  })])])])], 1), _c('persona-create', {
    attrs: {
      "open": _vm.openDialog
    },
    on: {
      "close": _vm.toggleCreatePersona
    }
  })], 1);
};
var staticRenderFns = [function () {
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
  return _c('span', {
    staticClass: "icon is-xxlarge"
  }, [_c('i', {
    staticClass: "fas fa-user-circle has-text-grey fa-6x"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "card-header-title is-centered"
  }, [_c('i', {
    staticClass: "fas fa-spinner fa-pulse fa-3x has-text-primary"
  })]);
}];

// EXTERNAL MODULE: ./src/media/graphql/MediaPersonas.gql
var MediaPersonas = __webpack_require__(52433);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(77449);
// EXTERNAL MODULE: ./src/media/components/personas-create.vue + 3 modules
var personas_create = __webpack_require__(99500);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(66510);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/personas/Personas.vue?vue&type=script&lang=js




/* harmony default export */ var Personasvue_type_script_lang_js = ({
  name: 'Personas',
  components: {
    PersonaCreate: personas_create/* default */.A,
    HelpContent: helpcontent/* default */.A
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
      searchQuery: this.$route.query.q,
      mediaPersonasCount: 0,
      openDialog: false,
      itemsPerPage: 24,
      busyLoading: false,
      selectOrderBy: this.$route.query.sort ? this.$route.query.sort : 'name_ASC',
      typesOrderBy: [{
        name: 'Name',
        type: 'name_ASC'
      }, {
        name: 'Last Updated',
        type: 'updatedAt_DESC'
      }, {
        name: 'Last Created',
        type: 'createdAt_DESC'
      }, {
        name: 'Oldest Created',
        type: 'createdAt_ASC'
      }, {
        name: 'Oldest Updated',
        type: 'updatedAt_ASC'
      }]
    };
  },
  watch: {
    searchQuery() {
      this.$router.push({
        query: {
          q: this.searchQuery,
          sort: this.selectOrderBy
        }
      });
      this.mediaPosts = [];
    },
    selectOrderBy() {
      this.$router.push({
        query: {
          q: this.searchQuery,
          sort: this.selectOrderBy
        }
      });
    }
  },
  methods: {
    queryVariables() {
      let length = this.mediaPersonae ? this.mediaPersonae.length : 0;
      let data = {
        where: {
          name_contains: this.searchQuery
        },
        skip: length,
        orderBy: this.selectOrderBy,
        first: this.itemsPerPage
      };
      return data;
    },
    loadMore() {
      if (this.mediaPersonae && this.mediaPersonae.length < this.mediaPersonasCount) {
        this.busyLoading = true;
        this.$apollo.queries.mediaPersonae.fetchMore({
          variables: this.queryVariables(),
          updateQuery: (previousResult, {
            fetchMoreResult
          }) => {
            if (fetchMoreResult && fetchMoreResult.mediaPersonae && fetchMoreResult.mediaPersonae.length > 0) {
              fetchMoreResult.mediaPersonae = [...this.mediaPersonae, ...fetchMoreResult.mediaPersonae.filter(n => !this.mediaPersonae.some(p => p.id === n.id))];
              this.busyLoading = false;
              return fetchMoreResult;
            }
          }
        });
      }
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
    },
    toggleCreatePersona() {
      this.openDialog = !this.openDialog;
    }
  }
});
;// ./src/media/views/personas/Personas.vue?vue&type=script&lang=js
 /* harmony default export */ var personas_Personasvue_type_script_lang_js = (Personasvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/personas/Personas.vue?vue&type=style&index=0&id=108b1b89&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/personas/Personas.vue?vue&type=style&index=0&id=108b1b89&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/personas/Personas.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  personas_Personasvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "108b1b89",
  null
  
)

/* harmony default export */ var Personas = (component.exports);

/***/ })

}]);