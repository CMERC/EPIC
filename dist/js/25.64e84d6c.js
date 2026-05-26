"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[25],{

/***/ 20025:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Posts; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/profiles/Posts.vue?vue&type=template&id=be187a60&scoped=true
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
      "infinite-scroll-disabled": "busyLoadingPosts",
      "infinite-scroll-distance": "50"
    }
  }, [_c('breadcrumb', {
    attrs: {
      "currentPage": _vm.mediaProfile ? 'Posts by ' + _vm.mediaProfile.name : ''
    }
  }), _vm.mediaProfile && _vm.mediaProfile.id != null ? _c('div', [_c('nav', {
    staticClass: "level"
  }, [_c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.createMediaPost(_vm.mediaProfile);
      }
    }
  }, [_vm._v(" Create Post ")])]), _c('div', {
    staticClass: "level-item"
  }, [_c('a', {
    staticClass: "button is-primary is-outlined",
    attrs: {
      "href": _vm.mediaProfile.url,
      "target": "_blank"
    }
  }, [_vm._v(" View Profile ")])]), _c('div', {
    staticClass: "level-item"
  }, [_c('a', {
    staticClass: "button is-primary is-outlined",
    on: {
      "click": function ($event) {
        return _vm.toggleShareProfile();
      }
    }
  }, [_vm._v(" Share Profile ")])])]), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('span', {
    staticClass: "has-text-weight-semibold"
  }, [_vm._v(_vm._s(_vm.mediaPostsCount) + " " + _vm._s(_vm.filterFriendly) + " posts")])]), _c('div', {
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
      "reference": 'media.profileposts',
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
  }, [_c('nav', {
    staticClass: "breadcrumb breadMenu"
  }, [_c('ul', [_c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'all'
    },
    attrs: {
      "to": {
        name: 'profilefilter',
        params: {
          requestedFilter: 'all'
        }
      }
    }
  }, [_vm._v("All")])], 1), _c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'published'
    },
    attrs: {
      "to": {
        name: 'profilefilter',
        params: {
          requestedFilter: 'published'
        }
      }
    }
  }, [_vm._v("Published")])], 1), _c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'scheduled'
    },
    attrs: {
      "to": {
        name: 'profilefilter',
        params: {
          requestedFilter: 'scheduled'
        }
      }
    }
  }, [_vm._v("Scheduled")])], 1), _c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'drafted'
    },
    attrs: {
      "to": {
        name: 'profilefilter',
        params: {
          requestedFilter: 'drafted'
        }
      }
    }
  }, [_vm._v("Drafted")])], 1), _c('li', [_c('router-link', {
    class: {
      'is-active': _vm.requestedFilter === 'noise_only'
    },
    attrs: {
      "to": {
        name: 'profilefilter',
        params: {
          requestedFilter: 'noise_only'
        }
      }
    }
  }, [_vm._v("Noise")])], 1)])])])])]), _c('div', {
    staticClass: "columns"
  }, [_c('div', {
    staticClass: "column is-4 is-narrow"
  }, [_c('Profile-Card', {
    attrs: {
      "profile": _vm.mediaProfile,
      "showEdit": "",
      "showPermalink": "",
      "showDelete": ""
    }
  })], 1), _c('div', {
    staticClass: "column is-8"
  }, [_vm.mediaPosts && _vm.mediaPosts.length > 0 ? _c('div', {
    staticClass: "columns is-multiline is-gapless"
  }, [_vm._l(_vm.mediaPosts, function (mediaPost) {
    return _c('div', {
      key: mediaPost.id,
      staticClass: "column is-12"
    }, [_c('post-card', {
      attrs: {
        "post": mediaPost,
        "showEdit": "",
        "showCreateComment": "",
        "showDelete": "",
        "showPermalink": ""
      }
    })], 1);
  }), _vm.busyLoadingPosts ? _c('div', {
    staticClass: "column is-12"
  }, [_vm._m(1), _c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v("Loading More Posts... ")])]) : _vm._e()], 2) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaPosts,
      "search": _vm.searchQuery ? true : false,
      "isLoading": _vm.$apollo.loading
    }
  }, [_c('template', {
    slot: "custom-message"
  }, [_c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v("No Posts found.")])]), _c('template', {
    slot: "action-buttons"
  }, [_c('div', {
    staticClass: "buttons is-centered"
  }, [_c('a', {
    staticClass: "button is-primary",
    on: {
      "click": function ($event) {
        return _vm.createMediaPost(_vm.mediaProfile);
      }
    }
  }, [_vm._v(" Create Post ")])])])], 2)], 1)])])]) : _c('div', [_c('empty-state', {
    attrs: {
      "data": _vm.mediaProfile,
      "isLoading": _vm.$apollo.loading
    }
  })], 1), _c('back-to-top', {
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
  })])])]), _vm.mediaProfile ? _c('div', {
    staticClass: "modal",
    class: {
      'is-active': _vm.shareProfileModal
    }
  }, [_c('div', {
    staticClass: "modal-background",
    on: {
      "click": _vm.toggleShareProfile
    }
  }), _c('div', {
    staticClass: "modal-card"
  }, [_c('header', {
    staticClass: "modal-card-head"
  }, [_c('p', {
    staticClass: "modal-card-title"
  }, [_vm._v("Share Profile")]), _c('button', {
    staticClass: "delete",
    attrs: {
      "aria-label": "close"
    },
    on: {
      "click": _vm.toggleShareProfile
    }
  })]), _c('section', {
    staticClass: "modal-card-body"
  }, [_c('span', {
    staticClass: "input",
    attrs: {
      "id": "mediaProfileURL"
    }
  }, [_vm._v(_vm._s(_vm.mediaProfile.url))])]), _c('footer', {
    staticClass: "modal-card-foot"
  }, [_c('a', {
    directives: [{
      name: "clipboard",
      rawName: "v-clipboard:copy",
      value: _vm.mediaProfile.url,
      expression: "mediaProfile.url",
      arg: "copy"
    }, {
      name: "clipboard",
      rawName: "v-clipboard:success",
      value: _vm.copyToClipboard,
      expression: "copyToClipboard",
      arg: "success"
    }],
    staticClass: "button is-primary"
  }, [_vm._v(" Copy to Clipboard ")])])])]) : _vm._e()], 1);
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

// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(21809);
// EXTERNAL MODULE: ./src/shared/components/profile-card.vue + 6 modules
var profile_card = __webpack_require__(74558);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(21823);
// EXTERNAL MODULE: ./src/shared/mixins/processText.js + 1 modules
var processText = __webpack_require__(59138);
// EXTERNAL MODULE: ./src/shared/mixins/mediaPost.js
var mediaPost = __webpack_require__(76714);
// EXTERNAL MODULE: ./src/media/graphql/MediaPosts.gql
var MediaPosts = __webpack_require__(36731);
// EXTERNAL MODULE: ./src/media/graphql/MediaProfiles.gql
var MediaProfiles = __webpack_require__(14840);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/profiles/Posts.vue?vue&type=script&lang=js







/* harmony default export */ var Postsvue_type_script_lang_js = ({
  name: 'Posts',
  components: {
    HelpContent: helpcontent/* default */.A,
    ProfileCard: profile_card/* default */.A
  },
  props: ['profile', 'service', 'requestedFilter'],
  mixins: [helpers/* default */.A, processText/* default */.A, mediaPost/* default */.A],
  apollo: {
    mediaPostsCount: {
      query: MediaPosts.MediaPostsCounts,
      variables() {
        let variableData = this.mediaPostsQueryVariable();
        // delete keys not used for count
        delete variableData.skip;
        delete variableData.first;
        return variableData;
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
    mediaProfile: {
      query: MediaProfiles.MediaProfilesRead,
      variables() {
        return {
          where: {
            username: this.profile,
            service: {
              name: this.service
            }
          }
        };
      },
      update(data) {
        if (data && data.mediaProfiles && data.mediaProfiles.length > 0) {
          return data.mediaProfiles[0];
        }
      },
      subscribeToMore: [{
        document: MediaProfiles.MediaProfilesSubscription,
        variables() {
          return {
            where: {
              node: {
                username: this.profile,
                service: {
                  name: this.service
                }
              }
            }
          };
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
    },
    mediaPosts: {
      query: MediaPosts.MediaPostsRead,
      variables() {
        let variableData = this.mediaPostsQueryVariable();
        variableData.skip = 0;
        return variableData;
      },
      update(data) {
        if (data && data.mediaPosts) {
          return data.mediaPosts;
        }
      },
      subscribeToMore: {
        document: MediaPosts.MediaPostsSubscription,
        variables() {
          let datafromread = this.mediaPostsQueryVariable();
          delete datafromread.orderBy;
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
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.mediaPost.mutation;
          let newResult;
          switch (mutationIn) {
            case 'CREATED':
              this.$apollo.queries.mediaPosts.refetch();
              break;
            case 'DELETED':
              newResult = {
                mediaPosts: [...previousResult.mediaPosts.filter(obj => subscriptionData.data.mediaPost.previousValues.id !== obj.id)]
              };
              break;
            case 'UPDATED':
              this.$apollo.queries.mediaPosts.refetch();
              break;
            default:
              throw new Error(`Unknown mediaPost mutation`);
          }
          return newResult;
        }
      }
    }
  },
  data() {
    return {
      shareProfileModal: false,
      filterFriendly: 'All',
      previewModal: false,
      searchQuery: '',
      mediaPosts: [],
      mediaPostsCount: 0,
      mediaProfile: null,
      selectedPost: null,
      itemsPerPage: 10,
      busyLoadingPosts: false
    };
  },
  methods: {
    mediaPostsQueryVariable() {
      let length = this.mediaPosts ? this.mediaPosts.length : 0;
      let data = {
        where: {
          isUserGenerated: true,
          profiles_some: {
            username: this.profile,
            service: {
              name: this.service
            }
          },
          OR: [{
            text_contains: this.searchQuery
          }, {
            title_contains: this.searchQuery
          }]
        },
        orderBy: 'updatedAt_DESC',
        skip: length,
        first: this.itemsPerPage
      };
      switch (this.requestedFilter) {
        case 'published':
          {
            data.where = Object.assign(data.where, {
              isPublished: true,
              text_contains: this.searchQuery
            });
            break;
          }
        case 'scheduled':
          {
            data.where = Object.assign(data.where, {
              isPublished: false,
              publishTime_not: null,
              text_contains: this.searchQuery
            });
            break;
          }
        case 'drafted':
          {
            data.where = Object.assign(data.where, {
              isPublished: false,
              publishTime: null,
              text_contains: this.searchQuery
            });
            break;
          }
        case 'noise_only':
          {
            data.where = Object.assign(data.where, {
              isUserGenerated: false,
              publishTime_not: null,
              text_contains: this.searchQuery
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
          variables: this.mediaPostsQueryVariable(),
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
    copyToClipboard() {
      this.$buefy.toast.open({
        message: 'Copied to Clipboard!',
        type: 'is-success'
      });
    },
    toggleShareProfile() {
      this.shareProfileModal = !this.shareProfileModal;
    },
    closeModal() {
      this.previewModal = false;
      this.selectedPost = null;
      this.postObj = null;
    },
    previewPost(post) {
      this.selectedPostID = post.id;
      this.postObj = post;
      this.previewModal = true;
    },
    permalinkPost(profile, service, postID) {
      this.$router.push({
        name: 'getPost',
        params: {
          workspace: this.$store.state.activeWorkspace.name,
          profile: this.profile,
          service: this.service,
          id: postID
        }
      });
    },
    editPost(postID) {
      this.$router.push({
        name: 'editpost',
        params: {
          profile: this.profile,
          service: this.service,
          id: postID
        }
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
        this.selectPost = null;
        this.selectProfile = '';
      }).catch(error => {
        this.$buefy.toast.open({
          message: 'There was an error',
          type: 'is-danger'
        });
        console.error('Post Deleted: ' + error);
      });
    },
    confirmPostDelete(post) {
      this.$buefy.dialog.confirm({
        title: 'Delete Post',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deletePost(post)
      });
    }
  },
  watch: {
    mediaProfile() {
      if (this.mediaProfile && this.mediaProfile.isUserGenerated == false) {
        this.$router.push({
          path: 'noise_only'
        });
      }
    }
  }
});
;// ./src/media/views/profiles/Posts.vue?vue&type=script&lang=js
 /* harmony default export */ var profiles_Postsvue_type_script_lang_js = (Postsvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/profiles/Posts.vue?vue&type=style&index=0&id=be187a60&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/profiles/Posts.vue?vue&type=style&index=0&id=be187a60&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/profiles/Posts.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  profiles_Postsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "be187a60",
  null
  
)

/* harmony default export */ var Posts = (component.exports);

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