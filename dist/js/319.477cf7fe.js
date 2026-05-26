"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[319],{

/***/ 72319:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ post_edit; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/posts/post-edit.vue?vue&type=template&id=0341a2cf&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "is-relative-mobile"
  }, [_c('breadcrumb', {
    attrs: {
      "currentPage": _vm.mediaPost ? _vm.mediaPost.profiles[0].name : ''
    }
  }), _c('div', {
    staticClass: "columns is-centered postEdit"
  }, [_vm.mediaPost && _vm.mediaPost.id != null ? _c('div', {
    staticClass: "column"
  }, [_c('div', {
    staticClass: "columns is-multiline is-centered"
  }, [_c('div', {
    staticClass: "column",
    class: _vm.mediaPost.id || _vm.parentPostID && _vm.mediaPost ? 'is-half-desktop is-12-tablet' : 'is-three-quarters-desktop is-12-tablet'
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
      "href": _vm.mediaPost.url
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
        return _vm.confirmDelete(_vm.mediaPost.id);
      }
    }
  }, [_c('span', {
    staticClass: "icon is-small"
  }, [_c('i', {
    staticClass: "fas fa-times has-text-danger"
  })]), _c('span', [_vm._v("Delete Post")])])], 1), _c('div', {
    staticClass: "card-content"
  }, [_c('div', {
    staticClass: "columns is-multiline"
  }, [_c('div', {
    staticClass: "column is-full"
  }, [_c('div', {
    staticClass: "media"
  }, [_c('div', {
    staticClass: "media-left"
  }, [_vm.mediaPost.profiles[0] && _vm.mediaPost.profiles[0].avatar ? _c('figure', {
    staticClass: "image is-64x64"
  }, [_c('img', {
    staticClass: "is-avatar lg",
    attrs: {
      "src": _vm.mediaPost.profiles[0].avatar ? _vm.mediaPost.profiles[0].avatar.url.small : ""
    }
  })]) : _c('figure', {
    staticClass: "image is-64x64"
  }, [_vm._m(0)])]), _c('div', {
    staticClass: "media-content"
  }, [_c('p', {
    staticClass: "title is-6"
  }, [_vm._v(_vm._s(_vm.mediaPost.profiles[0].name))]), _c('p', {
    staticClass: "subtitle is-7 has-text-weight-semibold"
  }, [_vm._v("@" + _vm._s(_vm.mediaPost.profiles[0].username)), _c('br'), _vm.mediaPost.profiles[0].service.icon ? _c('span', {
    staticClass: "icon is-small",
    style: 'color:' + _vm.mediaPost.profiles[0].service.color
  }, [_c('i', {
    class: _vm.mediaPost.profiles[0].service.icon
  })]) : _c('span', {
    staticClass: "icon"
  }, [_c('i', {
    staticClass: "fas fa-sm"
  })]), _c('span', [_vm._v(" " + _vm._s(_vm.mediaPost.profiles[0].service.displayName))])])])])]), _vm.mediaPost.profiles && _vm.mediaPost.profiles[0].description ? _c('div', {
    staticClass: "column is-full"
  }, [_c('p', {
    staticClass: "subtitle is-6"
  }, [_vm._v(" " + _vm._s(_vm.mediaPost.profiles[0].description))])]) : _vm._e(), _c('div', {
    staticClass: "column is-full"
  }, [_vm.checkProfile ? _c('div', [_c('label', {
    staticClass: "label"
  }, [_vm._v("Title "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.mediaPost.title,
      expression: "mediaPost.title"
    }],
    staticClass: "input",
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": _vm.mediaPost.title
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.mediaPost, "title", $event.target.value);
      }
    }
  })])]) : _vm._e(), _c('label', {
    staticClass: "label"
  }, [_vm._v(" Text ")]), _vm.checkProfile ? _c('div', [_c('div', {
    staticClass: "has-background-white"
  }, [_c('quill-editor', {
    ref: "quillText",
    attrs: {
      "options": _vm.editorOption
    },
    model: {
      value: _vm.mediaPost.text,
      callback: function ($$v) {
        _vm.$set(_vm.mediaPost, "text", $$v);
      },
      expression: "mediaPost.text"
    }
  })], 1)]) : _c('div', [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.mediaPost.text,
      expression: "mediaPost.text"
    }],
    ref: "textArea",
    staticClass: "textarea",
    attrs: {
      "placeholder": "Insert Text Here",
      "rows": "5",
      "cols": "50"
    },
    domProps: {
      "value": _vm.mediaPost.text
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.mediaPost, "text", $event.target.value);
      }
    }
  })]), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('custom-emoji-picker', {
    model: {
      value: _vm.selectedEmoji,
      callback: function ($$v) {
        _vm.selectedEmoji = $$v;
      },
      expression: "selectedEmoji"
    }
  })], 1), _c('div', {
    staticClass: "level-item"
  }, [_c('social-counts', {
    attrs: {
      "postCounts": _vm.mediaPost.counts,
      "service": _vm.mediaPost.profiles[0].service,
      "countType": "post"
    },
    on: {
      "getValues": value => {
        _vm.mediaPost.counts = value;
      }
    }
  })], 1)]), _c('div', {
    staticClass: "level-right"
  }, [_c('span', {
    staticClass: "has-text-grey-light is-pulled-right",
    domProps: {
      "textContent": _vm._s(_vm.mediaPost.text ? _vm.mediaPost.text.length : 0)
    }
  })])])]), _c('div', {
    staticClass: "column is-full"
  }, [_c('div', {
    staticClass: "box"
  }, [_c('div', {
    staticClass: "columns is-multiline"
  }, [_c('div', {
    staticClass: "column",
    class: _vm.mediaPost.id || _vm.parentPostID && _vm.mediaPost ? 'is-12' : 'is-6'
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Media ")]), _c('ImagePicker', {
    attrs: {
      "mediaFile": _vm.mediaPost.mediaFile
    },
    model: {
      value: _vm.postMediaFile,
      callback: function ($$v) {
        _vm.postMediaFile = $$v;
      },
      expression: "postMediaFile"
    }
  })], 1), _c('div', {
    staticClass: "column"
  }, [_c('label', {
    staticClass: "label"
  }, [_vm._v(" Location ")]), _c('MapLocationPicker', {
    model: {
      value: _vm.mapData,
      callback: function ($$v) {
        _vm.mapData = $$v;
      },
      expression: "mapData"
    }
  })], 1)])]), _c('div', {
    staticClass: "box datePicker"
  }, [_c('date-picker', {
    attrs: {
      "minDate": _vm.parentDate,
      "label": _vm.checkScheduleTime ? 'Scheduled Time' : 'Back Date',
      "timeZone": _vm.$store.state.activeWorkspace.timeZone || _vm.momentTimezone.tz.guess(true),
      "showNow": "",
      "showClear": "",
      "placeholder": 'Select a time for your post to publish'
    },
    on: {
      "clear": value => {
        _vm.mediaPost.publishTime = value;
      },
      "now": value => {
        _vm.mediaPost.publishTime = value;
      },
      "changed": value => {
        _vm.mediaPost.publishTime = value;
      }
    },
    model: {
      value: _vm.mediaPost.publishTime,
      callback: function ($$v) {
        _vm.$set(_vm.mediaPost, "publishTime", $$v);
      },
      expression: "mediaPost.publishTime"
    }
  })], 1)])])]), _c('footer', {
    staticClass: "modal-card-foot post-footer"
  }, [_c('div', {
    staticClass: "field is-grouped is-grouped-left"
  }, [_vm.checkPublishNow ? _c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.confirm('publishNow');
      }
    }
  }, [_vm._v(" Publish Now ")]) : _vm.checkScheduleTime ? _c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.confirm('schedule');
      }
    }
  }, [_vm._v(" Schedule Post ")]) : _c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.confirm('publishNow');
      }
    }
  }, [_vm._v(" Back Date Post ")]), _vm.mediaPost.isPublished == false ? _c('a', {
    staticClass: "button is-primary is-outlined",
    on: {
      "click": function ($event) {
        return _vm.confirm('draft');
      }
    }
  }, [_vm._v(" Save Draft ")]) : _vm._e(), _c('a', {
    staticClass: "button",
    on: {
      "click": function ($event) {
        return _vm.$router.go(-1);
      }
    }
  }, [_vm._v(" Cancel ")])]), _c('div', {
    staticClass: "field is-grouped is-grouped-right"
  }, [_c('button', {
    staticClass: "button",
    on: {
      "click": _vm.getFakePost
    }
  }, [_vm._v(" 🎲 Random ")])])])], 1)]), _vm.parentPostID || _vm.mediaPost.id && _vm.mediaPost ? _c('div', {
    staticClass: "column"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('PostPreview', {
    attrs: {
      "post": _vm.parentPostID || _vm.mediaPost.id
    }
  })], 1)])]) : _vm._e()])]) : _c('div', {
    staticClass: "column"
  }, [_c('empty-state', {
    attrs: {
      "data": _vm.mediaPost && _vm.mediaPost.id ? _vm.mediaPost : null,
      "isLoading": _vm.isLoading
    }
  })], 1)])], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon is-large"
  }, [_c('i', {
    staticClass: "fas fa-user-circle has-text-grey fa-3x"
  })]);
}];

// EXTERNAL MODULE: ./src/shared/serverError.js
var serverError = __webpack_require__(97750);
// EXTERNAL MODULE: ./src/media/components/post-preview.vue + 5 modules
var post_preview = __webpack_require__(23891);
;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/emojipicker.vue?vue&type=template&id=5817f11a&scoped=true
var emojipickervue_type_template_id_5817f11a_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('emoji-picker', {
    staticClass: "dropdown is-active",
    attrs: {
      "search": _vm.search
    },
    on: {
      "emoji": _vm.addEmoji
    },
    scopedSlots: _vm._u([{
      key: "emoji-invoker",
      fn: function ({
        events
      }) {
        return _c('div', _vm._g({
          staticClass: "emoji-invoker"
        }, events), [_c('div', {
          staticClass: "dropdown-trigger",
          attrs: {
            "slot": "trigger"
          },
          slot: "trigger"
        }, [_c('button', {
          staticClass: "button",
          attrs: {
            "aria-haspopup": "true"
          }
        }, [_c('span', {
          staticClass: "icon is-small"
        }, [_c('i', {
          staticClass: "far fa-smile"
        })])])])]);
      }
    }, {
      key: "emoji-picker",
      fn: function ({
        emojis,
        insert
      }) {
        return _c('div', {
          staticClass: "dropdown-menu",
          attrs: {
            "role": "menu"
          }
        }, [_c('div', {
          staticClass: "dropdown-content emoji-picker"
        }, [_c('div', {
          staticClass: "emoji-picker__search"
        }, [_c('input', {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: _vm.search,
            expression: "search"
          }],
          attrs: {
            "type": "text"
          },
          domProps: {
            "value": _vm.search
          },
          on: {
            "input": function ($event) {
              if ($event.target.composing) return;
              _vm.search = $event.target.value;
            }
          }
        })]), _c('div', _vm._l(emojis, function (emojiGroup, category) {
          return _c('div', {
            key: category
          }, [_c('h5', [_vm._v(_vm._s(category))]), _c('div', {
            staticClass: "emojis"
          }, _vm._l(emojiGroup, function (emoji, emojiName) {
            return _c('span', {
              key: emojiName,
              attrs: {
                "title": emojiName
              },
              on: {
                "click": function ($event) {
                  return insert(emoji);
                }
              }
            }, [_vm._v(_vm._s(emoji))]);
          }), 0)]);
        }), 0)])]);
      }
    }])
  });
};
var emojipickervue_type_template_id_5817f11a_scoped_true_staticRenderFns = [];

;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/emojipicker.vue?vue&type=script&lang=js
/* harmony default export */ var emojipickervue_type_script_lang_js = ({
  name: 'CustomEmojiPicker',
  props: ['value'],
  data() {
    return {
      selectedEmoji: null,
      search: ''
    };
  },
  methods: {
    addEmoji(emoji) {
      this.selectedEmoji = emoji;
      Object.assign({}, this.value, this.selectedEmoji);
      this.$emit('input', this.selectedEmoji);
    }
  }
});
;// ./src/shared/components/emojipicker.vue?vue&type=script&lang=js
 /* harmony default export */ var components_emojipickervue_type_script_lang_js = (emojipickervue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/shared/components/emojipicker.vue?vue&type=style&index=0&id=5817f11a&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/shared/components/emojipicker.vue?vue&type=style&index=0&id=5817f11a&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/shared/components/emojipicker.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_emojipickervue_type_script_lang_js,
  emojipickervue_type_template_id_5817f11a_scoped_true_render,
  emojipickervue_type_template_id_5817f11a_scoped_true_staticRenderFns,
  false,
  null,
  "5817f11a",
  null
  
)

/* harmony default export */ var emojipicker = (component.exports);
// EXTERNAL MODULE: ./src/shared/components/maplocationpicker.vue + 5 modules
var maplocationpicker = __webpack_require__(35505);
// EXTERNAL MODULE: ./src/media/components/social-counts.vue + 5 modules
var social_counts = __webpack_require__(31842);
// EXTERNAL MODULE: ./src/shared/components/imagepicker.vue + 5 modules
var imagepicker = __webpack_require__(89394);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(21809);
// EXTERNAL MODULE: ./src/shared/components/datepicker.vue + 5 modules
var datepicker = __webpack_require__(14208);
// EXTERNAL MODULE: ./src/shared/graphql/FakerData.gql
var FakerData = __webpack_require__(76864);
// EXTERNAL MODULE: ./src/media/graphql/MediaPosts.gql
var MediaPosts = __webpack_require__(36731);
// EXTERNAL MODULE: ./node_modules/vue/dist/vue.runtime.esm.js
var vue_runtime_esm = __webpack_require__(85471);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/posts/post-edit.vue?vue&type=script&lang=js











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
/* harmony default export */ var post_editvue_type_script_lang_js = ({
  name: 'edit-post',
  mixins: [helpers/* default */.A],
  components: {
    DatePicker: datepicker/* default */.A,
    MapLocationPicker: maplocationpicker/* default */.A,
    ImagePicker: imagepicker/* default */.A,
    CustomEmojiPicker: emojipicker,
    PostPreview: post_preview/* default */.A,
    SocialCounts: social_counts/* default */.A
  },
  props: {
    profile: {
      type: String,
      default: ''
    },
    service: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  apollo: {
    mediaPost: {
      query: MediaPosts.MediaPostRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        };
      },
      skip() {
        return !this.id;
      },
      update(data) {
        if (data && data.mediaPost) {
          this.quillText = data.mediaPost.text;
          let counts;
          if (data.mediaPost.location) {
            delete data.mediaPost.location.id;
            this.mapData = JSON.parse(JSON.stringify(data.mediaPost.location), this.omitTypename);
          }
          // check if post has counts
          if (!data.mediaPost.counts || !data.mediaPost.counts.likes) {
            counts = this.getRandomCountsObj('post');
            if (data.mediaPost.profiles[0].service.type === 'VIDEO') {
              counts.dislikes = Math.floor(Math.random() * 150 + 1);
            }
          } else {
            counts = JSON.parse(JSON.stringify(data.mediaPost.counts), this.omitTypename);
          }
          this.isLoading = false;
          return vue_runtime_esm/* default */.Ay.util.extend({}, {
            ...data.mediaPost,
            counts
          });
        } else {
          this.isLoading = false;
        }
      }
    }
  },
  data() {
    return {
      parentDate: this.$route.query.min,
      parentPostID: this.$route.query.c,
      isLoading: true,
      selectedEmoji: null,
      currDate: this.moment().toISOString(),
      loadingState: 0,
      htmlSet: false,
      mediaPost: null,
      quillText: '',
      selectedProfile: null,
      editorOption: {
        modules: {
          toolbar: toolbarOptions
        }
      },
      postMediaFile: null,
      mapData: null
    };
  },
  watch: {
    selectedEmoji: function () {
      this.insertEmoji(this.selectedEmoji);
    }
  },
  methods: {
    save() {
      let currentDate = new Date().toISOString();
      if (this.mediaPost.id) {
        // Create $data object
        let data = {
          isPublished: this.mediaPost.isPublished,
          title: this.mediaPost.title,
          text: this.htmlSet === true ? this.quillText : this.mediaPost.text,
          createTime: this.mediaPost.publishTime,
          updateTime: currentDate === '' ? null : currentDate,
          publishTime: this.mediaPost.publishTime,
          counts: this.mediaPost.counts
        };
        let dbMapData;
        if (this.mediaPost.location) {
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
        if (this.mapData || this.mediaPost.location) {
          data = Object.assign(data, dbMapData);
        }
        if (this.postMediaFile) {
          // mediaFile added
          if (this.postMediaFile.create || this.postMediaFile.connect) {
            data = Object.assign(data, {
              mediaFile: this.postMediaFile
            });
          } else {
            // if post already has an image, delete
            if (this.postMediaFile.delete && this.mediaPost.mediaFile) data = Object.assign(data, {
              mediaFile: {
                delete: true
              }
            });
          }
        }

        // Update post in database
        this.$apollo.mutate({
          mutation: MediaPosts.MediaPostsUpdate,
          variables: {
            data,
            where: {
              id: this.mediaPost.id
            }
          }
        }).then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          });
          this.open = false;
          this.postMediaFile = null;
          this.mapData = null;
          this.$router.go(-1);
        }).catch(error => {
          this.$buefy.toast.open({
            message: (0,serverError/* serverError */.i)(error.message),
            type: 'is-danger'
          });
          console.error('Post Updated: ' + error);
        });
      }
    },
    confirm(type) {
      switch (type) {
        case 'draft':
          if (this.mediaPost.publishTime !== null || this.mediaPost.publishTime !== '') {
            this.$buefy.dialog.confirm({
              title: 'Are you Sure?',
              message: `This post will save as a draft and will not be published. Continue?`,
              type: 'is-warning',
              onConfirm: () => {
                this.mediaPost.isPublished = false;
                this.mediaPost.publishTime = null;
                this.save();
              }
            });
          }
          break;
        case 'schedule':
          this.$buefy.dialog.confirm({
            title: 'Are you Sure?',
            message: `This will post will publish automatically at the time selected, are you sure?`,
            type: 'is-warning',
            onConfirm: () => {
              this.mediaPost.isPublished = false;
              this.save();
            }
          });
          break;
        case 'publishNow':
          this.$buefy.dialog.confirm({
            title: 'Are you Sure?',
            message: `This will publish your post immediately and cannot be undone, are you sure?`,
            type: 'is-warning',
            onConfirm: () => {
              this.mediaPost.isPublished = true;
              if (this.mediaPost.publishTime === null || this.mediaPost.publishTime === '') {
                this.mediaPost.createTime = this.moment().toISOString();
                this.mediaPost.publishTime = this.moment().toISOString();
              }
              this.save();
            }
          });
          break;
      }
    },
    insertEmoji(emoji) {
      let txtarea = this.$refs.textArea;
      let quillTxt = this.$refs.quillText;
      if (quillTxt === undefined) {
        // get cursor's position:
        let cursorPos = txtarea.selectionStart;
        let tmpStr = txtarea.value;
        // insert:
        this.mediaPost.text = tmpStr.substring(0, txtarea.selectionStart) + emoji + tmpStr.substring(txtarea.selectionEnd, tmpStr.length);

        // move cursor:
        setTimeout(() => {
          cursorPos += emoji ? emoji.length : 0;
          txtarea.selectionStart = txtarea.selectionEnd = cursorPos;
        }, 10);
      } else {
        if (emoji) this.mediaPost.text += emoji;
      }
    },
    confirmDelete(post) {
      this.$buefy.dialog.confirm({
        title: 'Delete Post',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePost(post)
      });
    },
    deletePost(post) {
      // delete post
      this.$apollo.mutate({
        mutation: MediaPosts.MediaPostsDelete,
        variables: {
          id: {
            id: post
          }
        }
      }).then(() => {
        this.$buefy.toast.open({
          message: 'Post Deleted!',
          type: 'is-success'
        });
        this.$router.go(-1);
      }).catch(error => {
        this.$buefy.toast.open({
          message: (0,serverError/* serverError */.i)(error.message),
          type: 'is-danger'
        });
        console.error('Post Deleted: ' + error);
      });
    },
    getFakePost() {
      this.$apollo.query({
        query: FakerData.GetRandomData,
        variables: {
          where: {
            type: 'post'
          }
        },
        // disable cache for query
        fetchPolicy: 'network-only'
      }).then(response => {
        if (response && response.data && response.data.getRandomData) {
          this.mediaPost.text = response.data.getRandomData.data.text;
          this.mapData = response.data.getRandomData.data.location;
          let timeZone = this.$store.state.activeWorkspace.timeZone;
          if (!timeZone) {
            timeZone = this.momentTimezone.tz.guess(true);
          }
          let publishDate = response.data.getRandomData.data.publishTime;
          //reverse out local timezone
          let newDate;
          if (isNaN(publishDate)) {
            newDate = new Date(publishDate);
          } else {
            newDate = new Date(parseInt(publishDate));
          }
          let momentDate = this.moment(newDate);
          let localizedDate = this.momentTimezone(momentDate).tz(this.momentTimezone.tz.guess(true)).format();
          //cast to new Timezone
          let date = this.moment.tz(this.moment(localizedDate).format('YYYY-MM-DDTHH:mm:ss'), 'YYYY-MM-DDTHH:mm:ss', timeZone).format();
          //convert that to UTC
          let utcDate = this.moment.parseZone(date).utc().format();
          this.mediaPost.publishTime = utcDate;
        }
      });
    }
  },
  mounted() {
    this.$apollo.queries.mediaPost.refetch();
  },
  computed: {
    checkProfile() {
      let checkProfile = this.mediaPost && this.mediaPost.profiles[0] && this.mediaPost.profiles[0].service && this.mediaPost.profiles[0].service.type !== 'SOCIALMEDIA';
      return checkProfile;
    },
    checkComment() {
      let checkComment = this.addComment && this.addComment.profiles[0] && this.addComment.profiles[0].name;
      return checkComment;
    },
    checkScheduleTime() {
      let checkScheduleTime = this.mediaPost.publishTime >= this.currDate || this.mediaPost.publishTime === null || this.mediaPost.publishTime === '';
      return checkScheduleTime;
    },
    checkPublishNow() {
      return this.mediaPost.publishTime == null || this.mediaPost.publishTime == '';
    }
  }
});
;// ./src/media/views/posts/post-edit.vue?vue&type=script&lang=js
 /* harmony default export */ var posts_post_editvue_type_script_lang_js = (post_editvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/posts/post-edit.vue?vue&type=style&index=0&id=0341a2cf&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/posts/post-edit.vue?vue&type=style&index=0&id=0341a2cf&prod&lang=scss&scoped=true

;// ./src/media/views/posts/post-edit.vue



;


/* normalize component */

var post_edit_component = (0,componentNormalizer/* default */.A)(
  posts_post_editvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "0341a2cf",
  null
  
)

/* harmony default export */ var post_edit = (post_edit_component.exports);

/***/ })

}]);