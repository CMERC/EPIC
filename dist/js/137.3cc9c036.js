"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[137],{

/***/ 56137:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Posts; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"84300870-vue-loader-template"}!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/posts/Posts.vue?vue&type=template&id=053cfc0b&scoped=true
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
      "infinite-scroll-disabled": "busyLoadingPosts",
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
        return _vm.openProfileSelector();
      }
    }
  }, [_vm._v(" Create Post ")])])]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
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
      "reference": 'media.posts',
      "toggle": "",
      "dropdown": ""
    }
  })], 1)])]), _c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('nav', {
    staticClass: "breadcrumb breadMenu"
  }, [_c('ul', [_c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'all'
    },
    attrs: {
      "to": {
        name: 'posts-filter',
        params: {
          requestedFilter: 'all'
        }
      }
    }
  }, [_vm._v("All")]), _vm.allMediaPostsCounts.allPosts ? _c('span', {
    staticClass: "tag is-rounded tooltip",
    attrs: {
      "data-tooltip": _vm._f("formatNumber")(_vm.allMediaPostsCounts.allPosts.aggregate.count, 'thousands')
    }
  }, [_vm.allMediaPostsCounts.allPosts.aggregate.count < 1000 ? _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.allPosts.aggregate.count, 'thousands')))]) : _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.allPosts.aggregate.count, 'abbreviate')))])]) : _vm._e()], 1), _c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'published'
    },
    attrs: {
      "to": {
        name: 'posts-filter',
        params: {
          requestedFilter: 'published'
        }
      }
    }
  }, [_vm._v("Published")]), _vm.allMediaPostsCounts.publishedPosts ? _c('span', {
    staticClass: "tag is-rounded tooltip",
    attrs: {
      "data-tooltip": _vm._f("formatNumber")(_vm.allMediaPostsCounts.publishedPosts.aggregate.count, 'thousands')
    }
  }, [_vm.allMediaPostsCounts.publishedPosts.aggregate.count < 1000 ? _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.publishedPosts.aggregate.count, 'thousands')))]) : _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.publishedPosts.aggregate.count, 'abbreviate')))])]) : _vm._e()], 1), _c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'scheduled'
    },
    attrs: {
      "to": {
        name: 'posts-filter',
        params: {
          requestedFilter: 'scheduled'
        }
      }
    }
  }, [_vm._v("Scheduled")]), _vm.allMediaPostsCounts.scheduledPosts ? _c('span', {
    staticClass: "tag is-rounded tooltip",
    attrs: {
      "data-tooltip": _vm._f("formatNumber")(_vm.allMediaPostsCounts.scheduledPosts.aggregate.count, 'thousands')
    }
  }, [_vm.allMediaPostsCounts.scheduledPosts.aggregate.count < 1000 ? _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.scheduledPosts.aggregate.count, 'thousands')))]) : _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.scheduledPosts.aggregate.count, 'abbreviate')))])]) : _vm._e()], 1), _c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'drafted'
    },
    attrs: {
      "to": {
        name: 'posts-filter',
        params: {
          requestedFilter: 'drafted'
        }
      }
    }
  }, [_vm._v("Drafted")]), _vm.allMediaPostsCounts.draftPosts ? _c('span', {
    staticClass: "tag is-rounded tooltip",
    attrs: {
      "data-tooltip": _vm._f("formatNumber")(_vm.allMediaPostsCounts.draftPosts.aggregate.count, 'thousands')
    }
  }, [_vm.allMediaPostsCounts.draftPosts.aggregate.count < 1000 ? _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.draftPosts.aggregate.count, 'thousands')))]) : _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.draftPosts.aggregate.count, 'abbreviate')))])]) : _vm._e()], 1), _c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'noise_only'
    },
    attrs: {
      "to": {
        name: 'posts-filter',
        params: {
          requestedFilter: 'noise_only'
        }
      }
    }
  }, [_vm._v("Noise")]), _vm.allMediaPostsCounts.noisePosts ? _c('span', {
    staticClass: "tag is-rounded tooltip",
    attrs: {
      "data-tooltip": _vm._f("formatNumber")(_vm.allMediaPostsCounts.noisePosts.aggregate.count, 'thousands')
    }
  }, [_vm.allMediaPostsCounts.noisePosts.aggregate.count < 1000 ? _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.noisePosts.aggregate.count, 'thousands')))]) : _c('span', [_vm._v(_vm._s(_vm._f("formatNumber")(_vm.allMediaPostsCounts.noisePosts.aggregate.count, 'abbreviate')))])]) : _vm._e()], 1)])])])]), _c('div', {
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
  }), 0)])])])])]), _vm.mediaPosts && _vm.mediaPosts.length > 0 ? _c('div', {
    staticClass: "columns is-multiline is-mobile is-centered is-gapless"
  }, [_vm._l(_vm.mediaPosts, function (mediaPost) {
    return _c('div', {
      key: mediaPost.id,
      staticClass: "column is-12"
    }, [_c('post-card', {
      attrs: {
        "post": mediaPost,
        "commentsCount": mediaPost && mediaPost.comments ? mediaPost.comments.length : '',
        "showEdit": "",
        "showDelete": "",
        "showViewProfile": "",
        "showCreateComment": "",
        "showPermalink": ""
      }
    })], 1);
  }), _vm.busyLoadingPosts ? _c('div', [_vm._m(1), _c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v("Loading More Posts... ")])]) : _vm._e()], 2) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaPosts,
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
        return _vm.openProfileSelector();
      }
    }
  }, [_vm._v(" Create Post ")])])])], 2)], 1), _c('back-to-top', {
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
  })])])]), _vm.showProfileSelector ? _c('profile-select-modal', {
    attrs: {
      "open": _vm.showProfileSelector,
      "authorID": _vm.parentPostAuthorID,
      "service": _vm.selectedService
    },
    on: {
      "close": _vm.closeProfileSelector,
      "select": function ($event) {
        return _vm.createMediaPost($event, _vm.parentPost, _vm.parentDate);
      }
    }
  }) : _vm._e()], 1)]);
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

// EXTERNAL MODULE: ./src/shared/mixins/permissions.js
var permissions = __webpack_require__(61316);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(34601);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(77449);
// EXTERNAL MODULE: ./src/shared/components/profile-selectModal.vue + 7 modules
var profile_selectModal = __webpack_require__(51472);
// EXTERNAL MODULE: ./src/shared/mixins/mediaPost.js
var mediaPost = __webpack_require__(6994);
// EXTERNAL MODULE: ./src/media/graphql/MediaPosts.gql
var MediaPosts = __webpack_require__(36731);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/posts/Posts.vue?vue&type=script&lang=js






/* harmony default export */ var Postsvue_type_script_lang_js = ({
  name: 'PostsView',
  props: ['requestedFilter'],
  components: {
    ProfileSelectModal: profile_selectModal/* default */.A,
    HelpContent: helpcontent/* default */.A
  },
  mixins: [helpers/* default */.A, mediaPost/* default */.A, permissions/* default */.A],
  apollo: {
    mediaPostsCount: {
      query: MediaPosts.MediaPostsCounts,
      variables() {
        let data = this.mediaPostsReadVariables();
        // delete keys not used for count
        delete data.skip;
        delete data.first;
        delete data.orderBy;
        return data;
      },
      update(data) {
        if (data && data.mediaPostsConnection) {
          return data.mediaPostsConnection.aggregate.count;
        }
      },
      error(error) {
        console.error(error);
      }
    },
    allMediaPostsCounts: {
      query: MediaPosts.allMediaPostsCounts,
      variables() {
        return {
          query: this.searchQuery
        };
      },
      update(data) {
        if (data) {
          return data;
        }
      }
    },
    mediaPosts: {
      query: MediaPosts.MediaPostsRead,
      variables() {
        let data = this.mediaPostsReadVariables();
        data.skip = 0;
        return data;
      },
      subscribeToMore: {
        document: MediaPosts.MediaPostsSubscription,
        variables() {
          let datafromread = this.mediaPostsReadVariables();
          delete datafromread.skip;
          delete datafromread.first;
          delete datafromread.orderBy;
          let data = {
            node: datafromread
          };
          return data;
        },
        updateQuery() {
          this.$apollo.queries.mediaPosts.refetch();
          this.$apollo.queries.mediaPostsCount.refetch();
          this.$apollo.queries.allMediaPostsCounts.refetch();
        }
      }
    }
  },
  data() {
    return {
      allMediaPostsCounts: [],
      previewModal: false,
      value: null,
      PostModal: false,
      mediaPosts: [],
      files: [],
      searchQuery: this.$route.query.q,
      selectOrderBy: this.$route.query.sort ? this.$route.query.sort : 'updatedAt_DESC',
      typesOrderBy: [{
        name: 'Last Updated',
        type: 'updatedAt_DESC'
      }, {
        name: 'Last Created',
        type: 'createdAt_DESC'
      }, {
        name: 'Last Published',
        type: 'publishTime_DESC'
      }, {
        name: 'Oldest Created',
        type: 'createdAt_ASC'
      }, {
        name: 'Oldest Updated',
        type: 'updatedAt_ASC'
      }, {
        name: 'Oldest Published',
        type: 'publishTime_ASC'
      }],
      selectProfile: '',
      selectedService: '',
      parentPostAuthorID: '',
      parentPost: '',
      parentDate: '',
      itemsPerPage: 10,
      busyLoadingPosts: false,
      showProfileSelector: false
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
    mediaPostsReadVariables() {
      let length = this.mediaPosts ? this.mediaPosts.length : 0;
      let data = {
        where: {
          isUserGenerated: true,
          OR: [{
            text_contains: this.searchQuery
          }, {
            title_contains: this.searchQuery
          }, {
            profiles_some: {
              OR: [{
                name_contains: this.searchQuery
              }, {
                username_contains: this.searchQuery
              }, {
                service: {
                  name_contains: this.searchQuery
                }
              }]
            }
          }]
        },
        orderBy: this.selectOrderBy,
        skip: length,
        first: this.itemsPerPage
      };
      switch (this.requestedFilter) {
        case 'published':
          {
            data.where = Object.assign(data.where, {
              isPublished: true,
              publishTime_not: null
            });
            break;
          }
        case 'scheduled':
          {
            data.where = Object.assign(data.where, {
              isPublished: false,
              publishTime_not: null
            });
            break;
          }
        case 'drafted':
          {
            data.where = Object.assign(data.where, {
              isPublished: false,
              publishTime: null
            });
            break;
          }
        case 'noise_only':
          {
            data.where = Object.assign(data.where, {
              isUserGenerated: false,
              isPublished: true,
              publishTime_not: null
            });
            break;
          }
      }
      return data;
    },
    loadMore() {
      if (this.mediaPosts && this.mediaPosts.length < this.mediaPostsCount) {
        this.busyLoadingPosts = true;
        this.$apollo.queries.mediaPosts.fetchMore({
          variables: this.mediaPostsReadVariables(),
          updateQuery: (previousResult, {
            fetchMoreResult
          }) => {
            if (fetchMoreResult && fetchMoreResult.mediaPosts && fetchMoreResult.mediaPosts.length > 0) {
              fetchMoreResult.mediaPosts = [...this.mediaPosts, ...fetchMoreResult.mediaPosts.filter(n => !this.mediaPosts.some(p => p.id === n.id))];
              this.busyLoadingPosts = false;
              return fetchMoreResult;
            }
          }
        });
      }
    },
    openProfileSelector(parentPost) {
      if (parentPost) {
        this.selectedService = parentPost.profiles[0].service.name;
        this.parentPostAuthorID = parentPost.profiles[0].id;
        this.parentPost = parentPost.id;
        this.parentDate = parentPost.publishTime;
      }
      this.showProfileSelector = true;
    },
    closeProfileSelector() {
      this.selectedService = '';
      this.parentPostAuthorID = '';
      this.parentPost = '';
      this.showProfileSelector = false;
    }
  }
});
;// ./src/media/views/posts/Posts.vue?vue&type=script&lang=js
 /* harmony default export */ var posts_Postsvue_type_script_lang_js = (Postsvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/posts/Posts.vue?vue&type=style&index=0&id=053cfc0b&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/posts/Posts.vue?vue&type=style&index=0&id=053cfc0b&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/posts/Posts.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  posts_Postsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "053cfc0b",
  null
  
)

/* harmony default export */ var Posts = (component.exports);

/***/ })

}]);