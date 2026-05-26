"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[637],{

/***/ 20637:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ calendar; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/posts/calendar.vue?vue&type=template&id=0849bd44&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "container"
  }, [_c('breadcrumb'), _c('nav', {
    staticClass: "level"
  }, [_vm._m(0), _c('div', {
    staticClass: "level-right"
  }, [_c('help-content', {
    attrs: {
      "reference": 'media.calendar',
      "toggle": "",
      "dropdown": ""
    }
  })], 1)]), _c('div', {
    staticClass: "columns is-mobile"
  }, [_c('div', {
    staticClass: "column is-12"
  }, [_c('full-calendar', _vm._b({
    attrs: {
      "events": _vm.mediaPosts,
      "datesRender": _vm.viewRender
    },
    on: {
      "eventClick": _vm.eventSelected
    }
  }, 'full-calendar', _vm.calendarOptions, false))], 1)]), _vm.previewModal ? _c('post-preview-modal', {
    attrs: {
      "open": _vm.previewModal,
      "postObj": _vm.postObj,
      "post": _vm.postObj ? _vm.postObj.id : null
    },
    on: {
      "close": _vm.closeModal
    }
  }) : _vm._e()], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  })]);
}];

// EXTERNAL MODULE: ./node_modules/@fullcalendar/vue/main.esm.js
var main_esm = __webpack_require__(65639);
// EXTERNAL MODULE: ./node_modules/@fullcalendar/daygrid/main.esm.js
var daygrid_main_esm = __webpack_require__(44357);
// EXTERNAL MODULE: ./node_modules/@fullcalendar/timegrid/main.esm.js
var timegrid_main_esm = __webpack_require__(81446);
// EXTERNAL MODULE: ./node_modules/@fullcalendar/interaction/main.esm.js
var interaction_main_esm = __webpack_require__(77087);
// EXTERNAL MODULE: ./node_modules/@fullcalendar/list/main.esm.js
var list_main_esm = __webpack_require__(30109);
// EXTERNAL MODULE: ./node_modules/@fullcalendar/moment-timezone/main.esm.js
var moment_timezone_main_esm = __webpack_require__(3111);
// EXTERNAL MODULE: ./src/media/components/post-previewModal.vue + 3 modules
var post_previewModal = __webpack_require__(25747);
// EXTERNAL MODULE: ./src/media/graphql/MediaPosts.gql
var MediaPosts = __webpack_require__(36731);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(21809);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(21823);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/posts/calendar.vue?vue&type=script&lang=js










/* harmony default export */ var calendarvue_type_script_lang_js = ({
  name: 'Calendar',
  mixins: [helpers/* default */.A],
  components: {
    HelpContent: helpcontent/* default */.A,
    FullCalendar: main_esm/* default */.A,
    PostPreviewModal: post_previewModal/* default */.A
  },
  apollo: {
    mediaPosts: {
      query: MediaPosts.MediaPostsCalendarRead,
      variables() {
        return {
          where: {
            isUserGenerated: true,
            createTime_not: null,
            publishTime_gte: this.startMoment,
            publishTime_lte: this.endMoment
          },
          orderBy: 'createTime_ASC'
        };
      },
      update(data) {
        if (data && data.mediaPosts) {
          let posts = JSON.parse(JSON.stringify(data.mediaPosts));
          for (let i = 0; i < posts.length; i++) {
            posts[i].title = this.truncate(this.htmlDecode(posts[i].title), 50);
          }
          return posts;
        }
      },
      subscribeToMore: {
        document: MediaPosts.MediaPostsCalendarSubscription,
        variables() {
          return {
            where: {
              node: {
                isUserGenerated: true,
                createTime_not: null,
                publishTime_gte: this.startMoment,
                publishTime_lte: this.endMoment
              }
            }
          };
        },
        // Mutate the previous result
        updateQuery: (previousResult, {
          subscriptionData
        }) => {
          // Here, return the new result from the previous with the new data
          let mutationIn = subscriptionData.data.mediaPost.mutation;
          let newResult;
          switch (mutationIn) {
            case 'CREATED':
              {
                newResult = {
                  mediaPosts: [subscriptionData.data.mediaPost.node, ...previousResult.mediaPosts]
                };
                break;
              }
            case 'DELETED':
              {
                newResult = {
                  mediaPosts: [...previousResult.mediaPosts.filter(obj => subscriptionData.data.mediaPost.previousValues.id !== obj.id)]
                };
                break;
              }
            case 'UPDATED':
              {
                let newMediaPosts = JSON.parse(JSON.stringify(previousResult.mediaPosts));
                let index = newMediaPosts.findIndex(x => x.id === subscriptionData.data.mediaPost.node.id);
                newMediaPosts[index] = subscriptionData.data.mediaPost.node;
                newResult = {
                  mediaPosts: newMediaPosts
                };
                break;
              }
            default:
              {
                throw new Error(`Unknown mediaPost mutation`);
              }
          }
          return newResult;
        }
      }
    }
  },
  data() {
    return {
      calendarOptions: {
        timeZone: this.$store.state.activeWorkspace.timeZone,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
        },
        editable: true,
        handleWindowResize: false,
        contentHeight: 750,
        eventLimit: 5,
        displayEventTime: false,
        nowIndicator: true,
        plugins: [daygrid_main_esm/* default */.Ay, timegrid_main_esm/* default */.Ay, interaction_main_esm/* default */.Ay, list_main_esm/* default */.A, moment_timezone_main_esm/* default */.A]
      },
      postObj: null,
      previewModal: false,
      startMoment: null,
      endMoment: null
    };
  },
  methods: {
    closeModal() {
      this.previewModal = false;
      this.postObj = null;
    },
    eventSelected(e) {
      this.$apollo.query({
        query: MediaPosts.MediaPostRead,
        variables: {
          where: {
            id: e.event.id
          }
        }
      }).then(response => {
        if (response && response.data) {
          this.postObj = response.data.mediaPost;
        }
      });
      this.previewModal = true;
    },
    viewRender(view) {
      // Get start and end dates from calendar
      this.startMoment = view.view.currentStart.toISOString();
      this.endMoment = view.view.currentEnd.toISOString();
      // get data for the interval
      this.$apollo.queries.mediaPosts.refetch();
    },
    htmlDecode(input) {
      let doc = new DOMParser().parseFromString(input, 'text/html');
      return doc.documentElement.textContent;
    }
  }
});
;// ./src/media/views/posts/calendar.vue?vue&type=script&lang=js
 /* harmony default export */ var posts_calendarvue_type_script_lang_js = (calendarvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/media/views/posts/calendar.vue?vue&type=style&index=0&id=0849bd44&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/media/views/posts/calendar.vue?vue&type=style&index=0&id=0849bd44&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/media/views/posts/calendar.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  posts_calendarvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "0849bd44",
  null
  
)

/* harmony default export */ var calendar = (component.exports);

/***/ })

}]);