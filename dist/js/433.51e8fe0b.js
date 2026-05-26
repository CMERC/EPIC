"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[433],{

/***/ 4433:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Profiles; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/profiles/Profiles.vue?vue&type=template&id=087fcd5c&scoped=true
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
    staticClass: "container",
    attrs: {
      "infinite-scroll-disabled": "busyLoadingProfiles",
      "infinite-scroll-distance": "50"
    }
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
        return _vm.openAddProfile();
      }
    }
  }, [_vm._v(" Create Profile ")])])]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('span', {
    staticClass: "has-text-weight-semibold"
  }, [_vm._v(_vm._s(_vm.mediaProfilesCount) + " Profiles")])]), _c('div', {
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
      "placeholder": "Search...",
      "clearable": ""
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
      "reference": 'media.profiles',
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
  }), 0)])])])])]), _vm.mediaProfiles && _vm.mediaProfiles.length > 0 ? _c('div', {
    staticClass: "columns is-multiline is-mobile articles"
  }, [_vm._l(_vm.mediaProfiles, function (mediaProfile) {
    return _c('div', {
      key: mediaProfile.id,
      staticClass: "column is-3-desktop is-6-tablet is-12-mobile"
    }, [_c('Profile-Card', {
      attrs: {
        "profile": mediaProfile,
        "showEdit": "",
        "showPermalink": "",
        "showDelete": ""
      }
    })], 1);
  }), _vm.busyLoadingProfiles ? _c('div', {
    staticClass: "column is-12"
  }, [_vm._m(1), _c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v("Loading More Profiles... ")])]) : _vm._e()], 2) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaProfiles,
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
        return _vm.openAddProfile();
      }
    }
  }, [_vm._v(" Create Profile ")])])])], 2)], 1), _c('back-to-top', {
    attrs: {
      "bottom": "20px",
      "right": "10px"
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
  })])])]), _vm.openProfile ? _c('profile-create', {
    attrs: {
      "open": _vm.openProfile
    },
    on: {
      "close": _vm.closeProfile
    }
  }) : _vm._e()], 1);
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
  return _c('div', {
    staticClass: "card-header-title is-centered"
  }, [_c('i', {
    staticClass: "fas fa-spinner fa-pulse fa-3x has-text-primary"
  })]);
}];

// EXTERNAL MODULE: ./src/shared/components/profile-card.vue + 6 modules
var profile_card = __webpack_require__(54129);
// EXTERNAL MODULE: ./src/media/components/profile-create.vue + 5 modules
var profile_create = __webpack_require__(80786);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(34601);
// EXTERNAL MODULE: ./src/shared/mixins/mediaPost.js
var mediaPost = __webpack_require__(6994);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(77449);
// EXTERNAL MODULE: ./src/media/graphql/MediaProfiles.gql
var MediaProfiles = __webpack_require__(14840);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/profiles/Profiles.vue?vue&type=script&lang=js






/* harmony default export */ var Profilesvue_type_script_lang_js = ({
  name: 'MediaProfiles',
  mixins: [helpers/* default */.A, mediaPost/* default */.A],
  components: {
    ProfileCard: profile_card/* default */.A,
    ProfileCreate: profile_create/* default */.A,
    HelpContent: helpcontent/* default */.A
  },
  apollo: {
    mediaProfilesCount: {
      query: MediaProfiles.MediaProfileCounts,
      variables() {
        let data = this.mediaProfilesReadVariables();
        // delete keys not used for count
        delete data.skip;
        delete data.first;
        delete data.orderBy;
        return data;
      },
      update(data) {
        if (data && data.mediaProfilesConnection && data.mediaProfilesConnection.aggregate) {
          return data.mediaProfilesConnection.aggregate.count;
        }
      },
      error(error) {
        console.error(error);
      }
    },
    mediaProfiles: {
      query: MediaProfiles.MediaProfilesSlim,
      variables() {
        let data = this.mediaProfilesReadVariables();
        data.skip = 0;
        return data;
      },
      update(data) {
        if (data && data.mediaProfiles) {
          this.$apollo.queries.mediaProfilesCount.refetch();
          return data.mediaProfiles;
        }
      },
      subscribeToMore: [{
        document: MediaProfiles.MediaProfilesSlimSubscription,
        variables() {
          let datafromread = this.mediaProfilesReadVariables();
          delete datafromread.orderBy;
          delete datafromread.skip;
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
          let mutationIn = subscriptionData.data.mediaProfile.mutation;
          let newResult;
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
                let index = updatedMediaProfiles.findIndex(x => x.id === subscriptionData.data.mediaProfile.node.id);
                updatedMediaProfiles[index] = subscriptionData.data.mediaProfile.node;
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
      searchQuery: this.$route.query.q,
      selectOrderBy: this.$route.query.sort ? this.$route.query.sort : 'name_ASC',
      typesOrderBy: [{
        name: 'Name',
        type: 'name_ASC'
      }, {
        name: 'Username',
        type: 'username_ASC'
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
      mediaProfiles: [],
      mediaProfilesCount: 0,
      itemsPerPage: 24,
      openProfile: false,
      busyLoadingProfiles: false
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
    mediaProfilesReadVariables() {
      let length = this.mediaProfiles ? this.mediaProfiles.length : 0;
      let data = {
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
        },
        orderBy: this.selectOrderBy,
        skip: length,
        first: this.itemsPerPage
      };
      return data;
    },
    loadMore() {
      if (this.mediaProfiles.length < this.mediaProfilesCount) {
        this.busyLoadingProfiles = true;
        this.$apollo.queries.mediaProfiles.fetchMore({
          variables: this.mediaProfilesReadVariables(),
          updateQuery: (previousResult, {
            fetchMoreResult
          }) => {
            if (fetchMoreResult && fetchMoreResult.mediaProfiles && fetchMoreResult.mediaProfiles.length > 0) {
              fetchMoreResult.mediaProfiles = [...this.mediaProfiles, ...fetchMoreResult.mediaProfiles.filter(n => !this.mediaProfiles.some(p => p.id === n.id))];
              this.busyLoadingProfiles = false;
              return fetchMoreResult;
            }
          }
        });
      }
    },
    openAddProfile() {
      this.openProfile = true;
    },
    closeProfile() {
      this.openProfile = false;
    }
  }
});
;// ./src/media/views/profiles/Profiles.vue?vue&type=script&lang=js
 /* harmony default export */ var profiles_Profilesvue_type_script_lang_js = (Profilesvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/profiles/Profiles.vue?vue&type=style&index=0&id=087fcd5c&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/profiles/Profiles.vue?vue&type=style&index=0&id=087fcd5c&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/profiles/Profiles.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  profiles_Profilesvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "087fcd5c",
  null
  
)

/* harmony default export */ var Profiles = (component.exports);

/***/ }),

/***/ 54129:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: function() { return /* binding */ profile_card; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/profile-card.vue?vue&type=template&id=1d587c1a&scoped=true
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
var helpers = __webpack_require__(34601);
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
var mediaPost = __webpack_require__(6994);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(66510);
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