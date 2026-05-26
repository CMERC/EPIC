"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[867],{

/***/ 76867:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ profiles_edit; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/profiles/profiles-edit.vue?vue&type=template&id=3568f550&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "container"
  }, [_c('breadcrumb', {
    attrs: {
      "currentPage": _vm.mediaProfile ? _vm.mediaProfile.name : ''
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
      "reference": 'media.editprofiles',
      "toggle": "",
      "dropdown": ""
    }
  })], 1)])]), _vm.mediaProfile && _vm.mediaProfile.id != null ? _c('div', {
    staticClass: "columns is-centered"
  }, [_c('div', {
    staticClass: "column is-three-quarters"
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
    attrs: {
      "has-link": ""
    }
  }, [_c('a', {
    attrs: {
      "href": _vm.mediaProfile.url
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-link"
  })]), _c('span', [_vm._v("Permalink")])])]), _c('hr', {
    staticClass: "dropdown-divider"
  }), _c('b-dropdown-item', {
    on: {
      "click": function ($event) {
        return _vm.confirmDelete(_vm.mediaProfile.id);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-times has-text-danger"
  })]), _c('span', [_vm._v("Delete Profile")])])], 1), _c('div', {
    staticClass: "card-content"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Site ")]), _c('div', {
    staticClass: "control"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.mediaProfile.service.displayName,
      expression: "mediaProfile.service.displayName"
    }],
    staticClass: "input is-disabled",
    attrs: {
      "type": "text",
      "disabled": ""
    },
    domProps: {
      "value": _vm.mediaProfile.service.displayName
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.mediaProfile.service, "displayName", $event.target.value);
      }
    }
  })]), _c('label', {
    staticClass: "label"
  }, [_vm._v("Name "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.mediaProfile.name,
      expression: "mediaProfile.name"
    }, {
      name: "validate",
      rawName: "v-validate",
      value: 'required',
      expression: "'required'"
    }],
    staticClass: "input",
    class: {
      'input': true,
      'is-danger': _vm.errors.has('name')
    },
    attrs: {
      "name": "name",
      "type": "text"
    },
    domProps: {
      "value": _vm.mediaProfile.name
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.mediaProfile, "name", $event.target.value);
      }
    }
  }), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.errors.has('name'),
      expression: "errors.has('name')"
    }],
    staticClass: "help is-danger"
  }, [_vm._v(_vm._s(_vm.errors.first('name')))])]), _c('label', {
    staticClass: "label"
  }, [_vm._v("Username "), _c('p', {
    staticClass: "control has-icons-left"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.mediaProfile.username,
      expression: "mediaProfile.username"
    }],
    staticClass: "input is-disabled",
    attrs: {
      "name": "username",
      "type": "text",
      "disabled": ""
    },
    domProps: {
      "value": _vm.mediaProfile.username
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.mediaProfile, "username", $event.target.value);
      }
    }
  }), _vm._m(0)])]), _c('label', {
    staticClass: "label"
  }, [_vm._v("Description "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.mediaProfile.description,
      expression: "mediaProfile.description"
    }],
    staticClass: "input",
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": _vm.mediaProfile.description
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.mediaProfile, "description", $event.target.value);
      }
    }
  })]), _vm.mediaProfile && _vm.mediaProfile.counts ? _c('div', {
    staticClass: "countsData"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Follower/Following ")]), _c('social-counts', {
    attrs: {
      "profileCounts": _vm.mediaProfile.counts,
      "service": _vm.mediaProfile.service,
      "countType": "profile"
    },
    on: {
      "getValues": value => {
        _vm.mediaProfile.counts = value;
      }
    }
  })], 1) : _vm._e(), _c('div', {
    staticClass: "columns is-multiline"
  }, [_c('div', {
    staticClass: "column is-half-desktop is-12-tablet"
  }, [_c('div', {
    staticClass: "box"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Avatar ")]), _c('ImagePicker', {
    attrs: {
      "rootSearch": 'avatar',
      "mediaFile": _vm.mediaProfile.avatar ? _vm.mediaProfile.avatar : ""
    },
    model: {
      value: _vm.avatarMediaFile,
      callback: function ($$v) {
        _vm.avatarMediaFile = $$v;
      },
      expression: "avatarMediaFile"
    }
  })], 1)]), _c('div', {
    staticClass: "column"
  }, [_c('div', {
    staticClass: "box"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Banner ")]), _c('ImagePicker', {
    attrs: {
      "mediaFile": _vm.mediaProfile.banner ? _vm.mediaProfile.banner.mediaFile : ""
    },
    model: {
      value: _vm.bannerMediaFile,
      callback: function ($$v) {
        _vm.bannerMediaFile = $$v;
      },
      expression: "bannerMediaFile"
    }
  })], 1)])])]), _c('footer', {
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
  }, [_vm._v(" Cancel ")])])], 1)])]) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaProfile,
      "isLoading": _vm.$apollo.loading
    }
  })], 1)], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-small is-left"
  }, [_c('i', {
    staticClass: "fas fa-at"
  })]);
}];

// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(77449);
// EXTERNAL MODULE: ./node_modules/vue/dist/vue.runtime.esm.js
var vue_runtime_esm = __webpack_require__(85471);
// EXTERNAL MODULE: ./src/media/components/social-counts.vue + 5 modules
var social_counts = __webpack_require__(81525);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(34601);
// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(66510);
// EXTERNAL MODULE: ./src/media/graphql/MediaProfiles.gql
var MediaProfiles = __webpack_require__(14840);
// EXTERNAL MODULE: ./src/shared/components/imagepicker.vue + 5 modules
var imagepicker = __webpack_require__(78892);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/profiles/profiles-edit.vue?vue&type=script&lang=js







/* harmony default export */ var profiles_editvue_type_script_lang_js = ({
  name: 'ProfileEdit',
  components: {
    SocialCounts: social_counts/* default */.A,
    ImagePicker: imagepicker/* default */.A,
    HelpContent: helpcontent/* default */.A
  },
  props: {
    profile: {},
    service: {},
    id: {}
  },
  mixins: [helpers/* default */.A],
  apollo: {
    mediaProfile: {
      query: MediaProfiles.MediaProfileRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        };
      },
      update(data) {
        let counts;
        // check if profile has counts
        if (data.mediaProfile.counts && data.mediaProfile.counts.followers) {
          counts = JSON.parse(JSON.stringify(data.mediaProfile.counts), this.omitTypename);
        } else {
          counts = this.getRandomCountsObj('profile');
        }
        return vue_runtime_esm/* default */.Ay.util.extend({}, {
          ...data.mediaProfile,
          counts
        });
      }
    }
  },
  data() {
    return {
      mediaProfile: null,
      bannerMediaFile: null,
      avatarMediaFile: null
    };
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    save() {
      let data = {
        name: this.mediaProfile.name,
        description: this.mediaProfile.description,
        isUserGenerated: true,
        counts: this.mediaProfile.counts
      };
      if (this.avatarMediaFile) {
        // avatar added
        data = Object.assign(data, {
          avatar: this.avatarMediaFile
        });
      }
      if (this.bannerMediaFile) {
        if (this.bannerMediaFile.delete && this.mediaProfile.banner) {
          data = Object.assign(data, {
            banner: {
              delete: true
            }
          });
        } else {
          // banner added
          data = Object.assign(data, {
            banner: {
              create: {
                mediaFile: this.bannerMediaFile
              }
            }
          });
        }
      }
      this.$apollo.mutate({
        mutation: MediaProfiles.MediaProfilesUpdate,
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
        this.$router.go(-1);
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Update Profile: ' + error);
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
        this.selectedProfile = '';
        this.$router.go(-1);
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
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
    }
  }
});
;// ./src/media/views/profiles/profiles-edit.vue?vue&type=script&lang=js
 /* harmony default export */ var profiles_profiles_editvue_type_script_lang_js = (profiles_editvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/profiles/profiles-edit.vue?vue&type=style&index=0&id=3568f550&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/profiles/profiles-edit.vue?vue&type=style&index=0&id=3568f550&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/profiles/profiles-edit.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  profiles_profiles_editvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "3568f550",
  null
  
)

/* harmony default export */ var profiles_edit = (component.exports);

/***/ })

}]);