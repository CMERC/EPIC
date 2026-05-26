"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[493],{

/***/ 99493:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Sites; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/Sites.vue?vue&type=template&id=240f742e&scoped=true
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
    staticClass: "container"
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
        return _vm.addSite();
      }
    }
  }, [_vm._v(" Create Site ")])])]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('span', {
    staticClass: "has-text-weight-semibold"
  }, [_vm._v(_vm._s(_vm.mediaServicesCount) + " Sites")])]), _c('div', {
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
      "reference": 'media.sites',
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
  }), 0)])])])])]), _vm.mediaServices && _vm.mediaServices.length > 0 ? _c('div', {
    staticClass: "columns is-multiline"
  }, _vm._l(_vm.mediaServices, function (site) {
    return _c('div', {
      key: site.id,
      staticClass: "column is-one-third"
    }, [_c('div', {
      staticClass: "card"
    }, [_c('nav', {
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
    })])]), _c('b-dropdown-item', {
      on: {
        "click": function ($event) {
          return _vm.showSite(site);
        }
      }
    }, [_c('span', {
      staticClass: "icon is-small"
    }, [_c('i', {
      staticClass: "fas fa-link"
    })]), _c('span', [_vm._v("Visit Site")])]), _c('b-dropdown-item', {
      on: {
        "click": function ($event) {
          return _vm.editService(site);
        }
      }
    }, [_c('span', {
      staticClass: "icon is-small"
    }, [_c('i', {
      staticClass: "fas fa-pen"
    })]), _c('span', [_vm._v("Edit Site")])]), _c('hr', {
      staticClass: "dropdown-divider"
    }), _c('b-dropdown-item', {
      on: {
        "click": function ($event) {
          return _vm.confirmDelete(site.name);
        }
      }
    }, [_c('span', {
      staticClass: "icon is-small"
    }, [_c('i', {
      staticClass: "fas fa-times has-text-danger"
    })]), _c('span', [_vm._v("Delete Site")])])], 1)], 1)])]), _c('a', {
      on: {
        "click": function ($event) {
          return _vm.showSite(site);
        }
      }
    }, [_c('div', {
      staticClass: "card-content"
    }, [_c('p', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(site.displayName))]), _c('p', {
      staticClass: "subtitle is-6"
    }, [_vm._v(_vm._s(_vm.getTypeLabel(site.type)))]), _c('div', {
      style: 'color:' + site.color
    }, [site.icon ? _c('span', {
      key: site.icon,
      staticClass: "icon is-large"
    }, [_c('i', {
      class: site.icon + ' fa-3x'
    })]) : _c('span', {
      staticClass: "icon is-large"
    }, [_c('i', {
      staticClass: "fas fa-3x"
    })])])])]), _c('footer', {
      staticClass: "card-footer"
    }, [_c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.showSite(site);
        }
      }
    }, [_vm._v(" Visit ")]), _c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.editService(site);
        }
      }
    }, [_vm._v(" Edit ")])])])]);
  }), 0) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaServices,
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
        return _vm.addSite();
      }
    }
  }, [_vm._v(" Create Site ")])])])], 2)], 1), _c('back-to-top', {
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
  })])])]), _c('site-create', {
    attrs: {
      "open": _vm.openDialog,
      "mediaService": _vm.selectedService
    },
    on: {
      "close": _vm.close
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
}];

// EXTERNAL MODULE: ./src/media/components/site-create.vue + 3 modules
var site_create = __webpack_require__(58519);
// EXTERNAL MODULE: ./src/media/model/mediaservice.js
var mediaservice = __webpack_require__(56219);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(77449);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(34601);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(66510);
// EXTERNAL MODULE: ./src/media/model/service-types.js
var service_types = __webpack_require__(79505);
// EXTERNAL MODULE: ./src/media/graphql/MediaServices.gql
var MediaServices = __webpack_require__(95514);
// EXTERNAL MODULE: ./src/media/graphql/MediaProfiles.gql
var MediaProfiles = __webpack_require__(14840);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/Sites.vue?vue&type=script&lang=js








/* harmony default export */ var Sitesvue_type_script_lang_js = ({
  name: 'WebView',
  mixins: [helpers/* default */.A],
  components: {
    HelpContent: helpcontent/* default */.A,
    SiteCreate: site_create/* default */.A
  },
  apollo: {
    mediaServicesCount: {
      query: MediaServices.MediaServicesCounts,
      variables() {
        let data = this.queryVariables();
        data.skip = 0;
        return data;
      },
      update(data) {
        if (data && data.mediaServicesConnection) {
          return data.mediaServicesConnection.aggregate.count;
        }
      },
      error(error) {
        console.error(error);
      }
    },
    mediaServices: {
      query: MediaServices.MediaServicesRead,
      variables() {
        let data = this.queryVariables();
        data.skip = 0;
        return data;
      },
      update(data) {
        if (data && data.mediaServices) {
          this.$apollo.queries.mediaServicesCount.refetch();
          return data.mediaServices;
        }
      },
      subscribeToMore: [{
        document: MediaServices.MediaServicesSubscription,
        variables() {
          let datafromread = this.queryVariables();
          delete datafromread.skip;
          delete datafromread.orderBy;
          delete datafromread.first;
          let data = {
            node: datafromread
          };
          return data;
        },
        // Mutate the previous result
        updateQuery: (previousResult, {
          subscriptionData
        }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.mediaService.mutation;
          var newResult;
          switch (mutationIn) {
            case 'CREATED':
              {
                newResult = {
                  mediaServices: [...previousResult.mediaServices, subscriptionData.data.mediaService.node]
                };
                break;
              }
            case 'DELETED':
              {
                newResult = {
                  mediaServices: [...previousResult.mediaServices.filter(obj => subscriptionData.data.mediaService.previousValues.id !== obj.id)]
                };
                break;
              }
            case 'UPDATED':
              {
                let updatedMediaServices = JSON.parse(JSON.stringify(previousResult.mediaServices));
                let index = updatedMediaServices.findIndex(x => x.id === subscriptionData.data.mediaService.node.id);
                updatedMediaServices[index] = subscriptionData.data.mediaService.node;
                newResult = {
                  mediaServices: updatedMediaServices
                };
                break;
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
      selectOrderBy: 'displayName_ASC',
      itemsPerPage: 24,
      busyLoading: false,
      typesOrderBy: [{
        name: 'Name',
        type: 'displayName_ASC'
      }, {
        name: 'Type',
        type: 'type_ASC'
      }, {
        name: 'Last Updated',
        type: 'updatedAt_DESC'
      }, {
        name: 'Last Created',
        type: 'createdAt_DESC'
      }, {
        name: 'Oldest Updated',
        type: 'updatedAt_ASC'
      }, {
        name: 'Oldest Created',
        type: 'createdAt_ASC'
      }],
      mediaSites: [],
      openDialog: false,
      mediaServices: [],
      selectedService: new mediaservice/* default */.A(),
      serviceTypes: service_types/* serviceTypeEnums */.y
    };
  },
  methods: {
    queryVariables() {
      let length = this.mediaServices ? this.mediaServices.length : 0;
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
      if (this.mediaServices && this.mediaServices.length < this.mediaServicesCount) {
        this.busyLoading = true;
        this.$apollo.queries.mediaServices.fetchMore({
          variables: this.queryVariables(),
          updateQuery: (previousResult, {
            fetchMoreResult
          }) => {
            if (fetchMoreResult && fetchMoreResult.mediaServices && fetchMoreResult.mediaServices.length > 0) {
              fetchMoreResult.mediaServices = [...this.mediaServices, ...fetchMoreResult.mediaServices.filter(n => !this.mediaServices.some(p => p.id === n.id))];
              this.busyLoading = false;
              return fetchMoreResult;
            }
          }
        });
      }
    },
    checkIfServiceHasProfiles(serviceName) {
      return this.$apollo.query({
        query: MediaProfiles.MediaProfilesRead,
        variables: {
          where: {
            service: {
              name: serviceName
            }
          }
        }
      }).then(response => {
        return response && response.data && response.data.mediaProfiles && response.data.mediaProfiles.length > 0;
      }).catch(error => {
        this.$buefy.toast.open({
          message: 'There was an error',
          type: 'is-danger'
        });
        console.error('Check Service for Profiles: ' + error);
      });
    },
    getTypeLabel(type) {
      let typeEnum = this.serviceTypes.find(typeEnum => typeEnum.value == type);
      let label = '';
      if (typeEnum && typeEnum.label) {
        label = typeEnum.label;
      }
      return label;
    },
    showSite(site) {
      let workspace = this.$store.state.activeWorkspace.name;
      this.$router.push({
        path: `/web/${workspace}/${site.name}`
      });
    },
    addSite() {
      this.openDialog = true;
    },
    editService(service) {
      this.selectedService = JSON.parse(JSON.stringify(service), this.omitTypename);
      this.openDialog = true;
    },
    async deleteService(service) {
      let serviceHasProfiles = await this.checkIfServiceHasProfiles(service);
      if (serviceHasProfiles) {
        this.$buefy.toast.open({
          message: 'Sites with profiles cannot be deleted.',
          type: 'is-danger',
          duration: 5000
        });
        return;
      } else {
        // deletes a service
        this.$apollo.mutate({
          mutation: MediaServices.MediaServicesDelete,
          variables: {
            name: {
              name: service
            }
          }
        }).then(() => {
          this.$buefy.toast.open({
            message: 'Site Deleted!',
            type: 'is-success'
          });
        }).catch(error => {
          this.$buefy.toast.open({
            message: (0,serverError/* serverError */.i)(error.message),
            type: 'is-danger'
          });
          console.error(error);
        });
      }
    },
    confirmDelete(service) {
      this.$buefy.dialog.confirm({
        title: 'Delete Site',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteService(service)
      });
    },
    close() {
      this.openDialog = false;
      this.selectedService = new mediaservice/* default */.A();
    }
  }
});
;// ./src/media/views/Sites.vue?vue&type=script&lang=js
 /* harmony default export */ var views_Sitesvue_type_script_lang_js = (Sitesvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/Sites.vue?vue&type=style&index=0&id=240f742e&prod&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// ./src/media/views/Sites.vue?vue&type=style&index=0&id=240f742e&prod&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/Sites.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  views_Sitesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "240f742e",
  null
  
)

/* harmony default export */ var Sites = (component.exports);

/***/ })

}]);