"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[18],{

/***/ 41637:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Networks; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/networks/Networks.vue?vue&type=template&id=33a5776d
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
        return _vm.openCreateNetwork();
      }
    }
  }, [_vm._v(" Create Network ")])])]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('span', {
    staticClass: "has-text-weight-semibold"
  }, [_vm._v(_vm._s(_vm.mediaNetworksCount) + " Networks")])]), _c('div', {
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
      "reference": 'media.networks',
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
  }), 0)])])])])]), _vm.mediaNetworks && _vm.mediaNetworks.length > 0 ? _c('div', {
    staticClass: "columns is-desktop is-multiline"
  }, _vm._l(_vm.mediaNetworks, function (mediaNetwork) {
    return _c('div', {
      key: mediaNetwork.id,
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
          return _vm.viewNetwork(mediaNetwork.id);
        }
      }
    }, [_c('span', {
      staticClass: "icon is-small"
    }, [_c('i', {
      staticClass: "fas fa-link"
    })]), _c('span', [_vm._v("View Network")])]), _c('b-dropdown-item', {
      on: {
        "click": function ($event) {
          return _vm.editNetwork(mediaNetwork.id);
        }
      }
    }, [_c('span', {
      staticClass: "icon is-small"
    }, [_c('i', {
      staticClass: "fas fa-pen"
    })]), _c('span', [_vm._v("Edit Network")])]), _c('hr', {
      staticClass: "dropdown-divider"
    }), _c('b-dropdown-item', {
      on: {
        "click": function ($event) {
          return _vm.confirmDeleteNetwork(mediaNetwork.id);
        }
      }
    }, [_c('span', {
      staticClass: "icon is-small"
    }, [_c('i', {
      staticClass: "fas fa-times has-text-danger"
    })]), _c('span', [_vm._v("Delete Network")])])], 1), _c('div', {
      staticClass: "card-content",
      on: {
        "click": function ($event) {
          return _vm.viewNetwork(mediaNetwork.id);
        }
      }
    }, [_c('div', {
      staticClass: "media"
    }, [_c('div', {
      staticClass: "media-left"
    }, [mediaNetwork.avatar != null ? _c('figure', {
      staticClass: "image is-96x96"
    }, [_c('img', {
      staticClass: "is-avatar xl",
      attrs: {
        "src": mediaNetwork.avatar.url.thumb,
        "alt": "image"
      }
    })]) : _c('figure', {
      staticClass: "image is-96x96"
    }, [_vm._m(1, true)])]), _c('div', {
      staticClass: "media-content"
    }, [_c('p', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(mediaNetwork.name))]), _c('p', {
      staticClass: "subtitle is-7"
    }, [_vm._v(_vm._s(_vm._f("truncate")(mediaNetwork.description, 70)))]), mediaNetwork.personas ? _c('p', {
      staticClass: "subtitle is-7"
    }, [_vm._v(_vm._s(mediaNetwork.personas.length) + " Linked Personas")]) : _vm._e()])])]), _c('footer', {
      staticClass: "card-footer"
    }, [_c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.editNetwork(mediaNetwork.id);
        }
      }
    }, [_vm._v(" Edit ")]), _c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.viewNetwork(mediaNetwork.id);
        }
      }
    }, [_vm._v(" View Network ")])])], 1)]);
  }), 0) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaNetworks,
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
        return _vm.openCreateNetwork();
      }
    }
  }, [_vm._v(" Create Network ")])])])], 2)], 1), _c('back-to-top', {
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
  })])])]), _c('network-create', {
    attrs: {
      "open": _vm.openDialog
    },
    on: {
      "close": _vm.closeDialog
    }
  })], 1)]);
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
}];

// EXTERNAL MODULE: ./src/media/graphql/MediaNetworks.gql
var MediaNetworks = __webpack_require__(7695);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(21823);
// EXTERNAL MODULE: ./src/media/components/network-create.vue + 3 modules
var network_create = __webpack_require__(20395);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(97750);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/networks/Networks.vue?vue&type=script&lang=js




/* harmony default export */ var Networksvue_type_script_lang_js = ({
  name: 'Networks',
  components: {
    NetworkCreate: network_create/* default */.A,
    HelpContent: helpcontent/* default */.A
  },
  apollo: {
    mediaNetworksCount: {
      query: MediaNetworks.MediaNetworksCounts,
      variables() {
        let data = this.queryVariables();
        data.skip = 0;
        return data;
      },
      update(data) {
        if (data && data.mediaNetworksConnection) {
          return data.mediaNetworksConnection.aggregate.count;
        }
      },
      error(error) {
        console.error(error);
      }
    },
    mediaNetworks: {
      query: MediaNetworks.MediaNetworksList,
      variables() {
        let data = this.queryVariables();
        data.skip = 0;
        return data;
      },
      update(data) {
        if (data && data.mediaNetworks) {
          this.$apollo.queries.mediaNetworksCount.refetch();
          return data.mediaNetworks;
        }
      },
      subscribeToMore: [{
        document: MediaNetworks.MediaNetworksSubscription,
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
                newResult = {
                  mediaNetworks: [...previousResult.mediaNetworks.filter(obj => subscriptionData.data.mediaNetwork.previousValues.id !== obj.id)]
                };
                break;
              }
            case 'UPDATED':
              {
                let updatedMediaNetworks = JSON.parse(JSON.stringify(previousResult.mediaNetworks));
                let index = updatedMediaNetworks.findIndex(x => x.id === subscriptionData.data.mediaNetwork.node.id);
                updatedMediaNetworks[index] = subscriptionData.data.mediaNetwork.node;
                newResult = {
                  mediaNetworks: updatedMediaNetworks
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
      searchQuery: this.$route.query.q,
      mediaNetworks: [],
      mediaNetworksCount: 0,
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
      let length = this.mediaNetworks ? this.mediaNetworks.length : 0;
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
      if (this.mediaNetworks && this.mediaNetworks.length < this.mediaNetworksCount) {
        this.busyLoading = true;
        this.$apollo.queries.mediaNetworks.fetchMore({
          variables: this.queryVariables(),
          updateQuery: (previousResult, {
            fetchMoreResult
          }) => {
            if (fetchMoreResult && fetchMoreResult.mediaNetworks && fetchMoreResult.mediaNetworks.length > 0) {
              fetchMoreResult.mediaNetworks = [...this.mediaNetworks, ...fetchMoreResult.mediaNetworks.filter(n => !this.mediaNetworks.some(p => p.id === n.id))];
              this.busyLoading = false;
              return fetchMoreResult;
            }
          }
        });
      }
    },
    editNetwork(id) {
      this.$router.push({
        name: 'editnetwork',
        params: {
          id: id
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
    openCreateNetwork() {
      this.openDialog = true;
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
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Delete Network: ' + error);
      });
    },
    closeDialog() {
      this.openDialog = false;
    }
  }
});
;// ./src/media/views/networks/Networks.vue?vue&type=script&lang=js
 /* harmony default export */ var networks_Networksvue_type_script_lang_js = (Networksvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/networks/Networks.vue





/* normalize component */
;
var component = (0,componentNormalizer/* default */.A)(
  networks_Networksvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Networks = (component.exports);

/***/ })

}]);