"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[13],{

/***/ 98013:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Networks_view; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/networks/Networks-view.vue?vue&type=template&id=0b444d7e&scoped=true
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
    staticClass: "level is-pulled-right"
  }, [_c('div', {
    staticClass: "level-left"
  }), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('help-content', {
    attrs: {
      "reference": 'media.networksview',
      "toggle": "",
      "dropdown": ""
    }
  })], 1)])]), _vm.mediaNetwork && _vm.mediaNetwork.id != null ? _c('div', [_c('div', {
    staticClass: "columns is-multiline is-centered is-mobile"
  }, [_c('div', {
    staticClass: "column is-half-desktop is-half-tablet is-12-mobile"
  }, [_c('div', {
    staticClass: "card focus"
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
        return _vm.editNetwork(_vm.mediaNetwork.id);
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
  }, [_vm.mediaNetwork.avatar != null ? _c('figure', {
    staticClass: "image is-96x96",
    on: {
      "click": function ($event) {
        return _vm.imagePreview(_vm.mediaNetwork.avatar);
      }
    }
  }, [_c('img', {
    staticClass: "is-avatar xl",
    attrs: {
      "src": _vm.mediaNetwork.avatar.url.thumb,
      "alt": "image"
    }
  })]) : _c('figure', {
    staticClass: "image is-96x96"
  }, [_vm._m(0)])]), _c('div', {
    staticClass: "media-content"
  }, [_c('p', {
    staticClass: "title is-5"
  }, [_vm._v(_vm._s(_vm.mediaNetwork.name))]), _c('p', {
    staticClass: "subtitle is-7"
  }, [_vm._v(_vm._s(_vm.mediaNetwork.description))])])])])], 1)])]), _vm.mediaNetwork && _vm.mediaNetwork.personas.length > 0 ? _c('div', {
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
          return _vm.editPersona(personas.id);
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
          return _vm.viewPersona(personas.id);
        }
      }
    }, [_c('div', {
      staticClass: "media"
    }, [_c('div', {
      staticClass: "media-left"
    }, [personas.avatar != null ? _c('figure', {
      staticClass: "image is-96x96"
    }, [_c('img', {
      staticClass: "is-avatar xl",
      attrs: {
        "src": personas.avatar.url.thumb,
        "alt": "image"
      }
    })]) : _c('figure', {
      staticClass: "image is-96x96"
    }, [_vm._m(1, true)])]), _c('div', {
      staticClass: "media-content"
    }, [_c('p', {
      staticClass: "title is-6"
    }, [_vm._v(_vm._s(personas.name))]), _c('p', {
      staticClass: "subtitle is-7 profile-description"
    }, [_vm._v(_vm._s(_vm._f("truncate")(personas.role, 70)))]), personas.profiles ? _c('p', {
      staticClass: "subtitle is-7"
    }, [_vm._v(_vm._s(personas.profiles.length) + " Linked Profiles")]) : _vm._e()])])]), _c('footer', {
      staticClass: "card-footer"
    }, [_c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.editPersona(personas.id);
        }
      }
    }, [_vm._v(" Edit ")]), _c('a', {
      staticClass: "card-footer-item",
      on: {
        "click": function ($event) {
          return _vm.viewPersona(personas.id);
        }
      }
    }, [_vm._v(" View Persona ")])])], 1)]);
  }), 0) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaNetwork.personas,
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
  })], 1), _c('media-preview', {
    attrs: {
      "open": _vm.imagePreviewModal,
      "file": _vm.selectedImage
    },
    on: {
      "close": _vm.closeModal
    }
  })], 1);
};
var staticRenderFns = [function () {
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
  return _c('span', {
    staticClass: "icon is-xxlarge"
  }, [_c('i', {
    staticClass: "fas fa-user-circle has-text-grey fa-6x"
  })]);
}];

// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(77449);
// EXTERNAL MODULE: ./src/media/graphql/MediaNetworks.gql
var MediaNetworks = __webpack_require__(7695);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(66510);
// EXTERNAL MODULE: ./src/shared/components/mediaPreview.vue + 5 modules
var mediaPreview = __webpack_require__(3063);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/networks/Networks-view.vue?vue&type=script&lang=js




/* harmony default export */ var Networks_viewvue_type_script_lang_js = ({
  name: 'NetworkView',
  props: ['id'],
  components: {
    MediaPreview: mediaPreview/* default */.A,
    HelpContent: helpcontent/* default */.A
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
    }
  },
  data() {
    return {
      imagePreviewModal: false,
      selectedImage: null,
      open: false
    };
  },
  methods: {
    editNetwork(id) {
      this.$router.push({
        name: 'editnetwork',
        params: {
          id: id
        }
      });
    },
    viewPersona(personaId) {
      this.$router.push({
        name: 'viewpersona',
        params: {
          id: personaId
        }
      });
    },
    editPersona(personaId) {
      this.$router.push({
        name: 'editpersona',
        params: {
          id: personaId
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
    addToNetwork(profileid) {
      this.$apollo.mutate({
        mutation: MediaNetworks.MediaNetworksUpdateProfile,
        variables: {
          data: {
            profiles: {
              connect: {
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
          message: 'Saving...',
          type: 'is-success'
        });
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Update Network with Profile: ' + error);
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
;// ./src/media/views/networks/Networks-view.vue?vue&type=script&lang=js
 /* harmony default export */ var networks_Networks_viewvue_type_script_lang_js = (Networks_viewvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/networks/Networks-view.vue?vue&type=style&index=0&id=0b444d7e&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/networks/Networks-view.vue?vue&type=style&index=0&id=0b444d7e&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/networks/Networks-view.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  networks_Networks_viewvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "0b444d7e",
  null
  
)

/* harmony default export */ var Networks_view = (component.exports);

/***/ })

}]);