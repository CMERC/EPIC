"use strict";
(self["webpackChunkepic_vue"] = self["webpackChunkepic_vue"] || []).push([[140],{

/***/ 77140:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ MSELTimeline; }
});

;// ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c90667b2-vue-loader-template"}!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[4]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/plan/views/train/MSELTimeline.vue?vue&type=template&id=d1ed81bc&scoped=true
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
    staticClass: "is-relative-mobile",
    attrs: {
      "infinite-scroll-disabled": "busyLoading",
      "infinite-scroll-distance": "50"
    }
  }, [_c('breadcrumb'), _c('nav', {
    staticClass: "level"
  }, [_vm._m(0), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('date-picker', {
    key: 'mselStartDate',
    attrs: {
      "label": "",
      "timeZone": _vm.$store.state.activeWorkspace.timeZone || _vm.momentTimezone.tz.guess(true),
      "placeholder": "Start Date",
      "showClear": "",
      "showNow": "",
      "name": 'mselStartDate'
    },
    on: {
      "clear": value => {
        _vm.mselStartDate = value;
      },
      "now": value => {
        _vm.mselStartDate = value;
      },
      "changed": value => {
        _vm.mselStartDate = value;
      }
    },
    model: {
      value: _vm.mselStartDate,
      callback: function ($$v) {
        _vm.mselStartDate = $$v;
      },
      expression: "mselStartDate"
    }
  })], 1), _c('div', {
    staticClass: "level-item"
  }, [_c('date-picker', {
    key: 'mselEndDate',
    attrs: {
      "label": "",
      "timeZone": _vm.$store.state.activeWorkspace.timeZone || _vm.momentTimezone.tz.guess(true),
      "placeholder": "End Date",
      "showClear": "",
      "showNow": "",
      "name": 'mselEndDate'
    },
    on: {
      "now": value => {
        _vm.mselEndDate = value;
      },
      "clear": value => {
        _vm.mselEndDate = value;
      },
      "changed": value => {
        _vm.mselEndDate = value;
      }
    },
    model: {
      value: _vm.mselEndDate,
      callback: function ($$v) {
        _vm.mselEndDate = $$v;
      },
      expression: "mselEndDate"
    }
  })], 1), _c('div', {
    staticClass: "level-item"
  }, [_c('router-link', {
    staticClass: "button is-primary is-outlined",
    attrs: {
      "to": {
        name: 'msel-timeline',
        query: {
          event: _vm.eventID
        }
      },
      "target": "_blank"
    }
  }, [_c('span', {
    staticClass: "icon"
  }, [_c('i', {
    staticClass: "fas fa-external-link-alt"
  })])])], 1), _c('div', {
    staticClass: "level-item"
  }, [_c('button', {
    staticClass: "button is-primary",
    attrs: {
      "disabled": _vm.planInjects && _vm.planInjects.length == 0
    },
    on: {
      "click": _vm.openFullScreen
    }
  }, [_vm._m(1)])]), _c('div', {
    staticClass: "level-item"
  }, [_c('help-content', {
    attrs: {
      "reference": 'plan.train',
      "toggle": "",
      "dropdown": ""
    }
  })], 1)])]), _c('nav', {
    staticClass: "level"
  }, [_vm._m(2), _c('div', {
    staticClass: "level-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('span', {
    staticClass: "has-text-weight-semibold"
  }, [_vm._v(_vm._s(_vm.planInjectsCount) + " MSEL Injects")])]), _vm.planEvents ? _c('div', {
    staticClass: "level-item"
  }, [_c('div', {
    staticClass: "select"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.eventID,
      expression: "eventID"
    }],
    on: {
      "change": function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.eventID = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }
    }
  }, [_c('option', {
    attrs: {
      "value": ""
    }
  }, [_vm._v(" All Events ")]), _c('option', {
    attrs: {
      "disabled": ""
    }
  }, [_vm._v(" ────────── ")]), _vm._l(_vm.planEvents, function (event) {
    return _c('option', {
      key: event.id,
      domProps: {
        "value": event.id
      }
    }, [_vm._v(" " + _vm._s(_vm.truncate(event.name, 25)))]);
  })], 2)])]) : _vm._e(), _vm.planLabelGroups ? _c('div', {
    staticClass: "level-item"
  }, [_c('div', {
    staticClass: "select"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.statusGroup,
      expression: "statusGroup"
    }],
    on: {
      "change": function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.statusGroup = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }
    }
  }, [_c('option', {
    attrs: {
      "value": ""
    }
  }, [_vm._v(" All Boards ")]), _c('option', {
    attrs: {
      "disabled": ""
    }
  }, [_vm._v(" ────────── ")]), _vm._l(_vm.planLabelGroups, function (board) {
    return _c('option', {
      key: board.id,
      domProps: {
        "value": board
      }
    }, [_vm._v(" " + _vm._s(_vm.truncate(board.title, 25)))]);
  })], 2)])]) : _vm._e()])]), _vm.endAfterStartCheck ? _c('p', {
    staticClass: "help has-text-danger has-text-centered"
  }, [_vm._v(_vm._s(_vm.endAfterStartCheck))]) : _vm._e(), _vm.planInjects && _vm.planInjects.length > 0 ? _c('div', {
    staticClass: "columns is-mobile is-multiline is-centered"
  }, [_c('div', {
    staticClass: "column is-three-quarters"
  }, [_c('div', {
    staticClass: "container is-relative",
    attrs: {
      "id": "timeline"
    }
  }, [_c('nav', {
    staticClass: "level is-pulled-right"
  }, [_c('div', {
    staticClass: "level-item"
  }, [_c('button', {
    staticClass: "delete",
    on: {
      "click": _vm.closeFullScreen
    }
  })])]), _c('div', {
    staticClass: "timeline"
  }, [_c('header', {
    staticClass: "timeline-header"
  }, [_c('span', {
    staticClass: "tag is-medium is-primary tooltip",
    attrs: {
      "data-tooltip": _vm.planInjects ? _vm.planInjects[0].startDate : ''
    }
  }, [_vm._v(_vm._s(_vm.planInjects ? _vm.formatDate(_vm.planInjects[0].startDate, 'shortDate') : ''))])]), _vm._l(_vm.planInjects, function (inject, index) {
    return [_c('article', {
      key: inject.id
    }, [index > 0 && !_vm.moment(inject.startDate).isSame(_vm.planInjects[index - 1].startDate, 'day') ? [_c('div', {
      key: index,
      staticClass: "timeline-divider columns is-variable is-vcentered"
    }, [_c('div', {
      staticClass: "column is-narrow is-1 is-paddingless"
    }, [_c('span', {
      staticClass: "tag is-size-7 is-inverted is-white"
    }, [_vm._v(_vm._s(_vm.formatDate(inject.startDate, 'monthDay')))])]), _vm._m(3, true)])] : _vm._e(), _c('div', {
      key: inject.id,
      staticClass: "timeline-item",
      on: {
        "click": function ($event) {
          return _vm.previewInject(inject);
        }
      }
    }, [_c('div', {
      staticClass: "timeline-marker is-icon"
    }, [inject.status ? _c('div', {
      staticClass: "tag",
      class: _vm.lightOrDark(_vm.injectColorChecker(inject.status)),
      style: 'background-color:' + _vm.injectColorChecker(inject.status) + ';border-color:' + _vm.injectColorChecker(inject.status)
    }, [_vm._v(" " + _vm._s(inject.status.title) + " ")]) : _c('div', {
      staticClass: "tag"
    }, [_vm._v(" No Status ")])]), _c('div', {
      staticClass: "timeline-content"
    }, [_c('div', {
      staticClass: "card inject",
      class: _vm.lightOrDark(_vm.injectColorChecker(inject.status)),
      style: 'background-color:' + _vm.injectColorChecker(inject.status)
    }, [_c('div', {
      staticClass: "card-content",
      class: {
        'has-ribbon-left is-small': _vm.isInjectPastDue(inject, inject.status)
      }
    }, [_c('div', {
      staticClass: "content"
    }, [_c('nav', {
      staticClass: "level"
    }, [_c('div', {
      staticClass: "level-left"
    }, [_c('div', {
      staticClass: "level-item"
    }, [_c('span', {
      staticClass: "title is-6 tooltip is-tooltip-long",
      attrs: {
        "data-tooltip": `#${inject.number} ${inject.title}`
      }
    }, [_vm._v("#" + _vm._s(inject.number) + " - " + _vm._s(_vm.truncate(inject.title, 25)))])])]), _c('div', {
      staticClass: "level-right"
    }, [_c('div', {
      staticClass: "level-item"
    }, [_c('span', {
      staticClass: "subtitle is-6"
    }, [_vm._v(_vm._s(inject.owner ? inject.owner.title : null))])])])]), _vm.isInjectPastDue(inject, inject.status) ? _c('div', {
      staticClass: "ribbon is-small is-danger"
    }, [_vm._v(" Past Due ")]) : _vm._e(), _c('nav', {
      staticClass: "level"
    }, [_c('div', {
      staticClass: "level-left"
    }, [_c('div', {
      staticClass: "level-item"
    }, [_c('span', {
      staticClass: "subtitle is-7 tooltip",
      attrs: {
        "data-tooltip": _vm.formatDate(inject.startDate, 'utc-dtg')
      }
    }, [_vm._v(_vm._s(_vm.formatDate(inject.startDate, 'dtg')))])])]), _c('div', {
      staticClass: "level-right"
    }, [inject.events ? _c('div', {
      staticClass: "level-item"
    }, [_c('span', {
      staticClass: "tooltip",
      attrs: {
        "data-tooltip": inject.events.name
      }
    }, [_vm._v(_vm._s(_vm._f("truncate")(inject.events.name, 20)))])]) : _vm._e()])])])])])]), _vm._m(4, true), _c('div', {
      staticClass: "timeline-content"
    }, [_c('div', {
      staticClass: "card response",
      style: 'background-color:' + _vm.responseChecker(inject.status)
    }, [_c('div', {
      staticClass: "card-content",
      class: _vm.lightOrDark(_vm.responseChecker(inject.status))
    }, [inject.responseDate ? _c('nav', {
      staticClass: "level"
    }, [_c('div', {
      staticClass: "level-left"
    }, [_c('span', {
      staticClass: "tag is-white is-7 tooltip",
      attrs: {
        "data-tooltip": _vm.showDiff(inject.startDate, inject.responseDate)
      }
    }, [_c('i', [_vm._v(_vm._s(_vm.formatDate(inject.responseDate, 'dtg')))])])])]) : _vm._e(), _c('div', {
      staticClass: "content"
    }, [inject.response && !inject.mitigation ? _c('span', [_c('p', {
      staticClass: "subtitle is-7"
    }, [_vm._v(_vm._s(_vm._f("truncate")(inject.response, 25)))])]) : inject.mitigation ? _c('span', [_c('p', {
      staticClass: "subtitle is-7"
    }, [_vm._v(_vm._s(_vm._f("truncate")(inject.mitigation, 25)))])]) : _c('p', {
      staticClass: "subtitle is-7"
    }, [_vm._v("No Response Entered")])])])])])])], 2)];
  })], 2)])]), _vm.busyLoading ? _c('div', {
    staticClass: "column is-12"
  }, [_vm._m(5), _c('p', {
    staticClass: "subtitle has-text-centered"
  }, [_vm._v("Loading More Injects... ")])]) : _vm._e()]) : _c('div', {
    staticClass: "column is-12 no-result apollo"
  }, [_c('empty-state', {
    attrs: {
      "data": _vm.planInjects,
      "isLoading": _vm.$apollo.loading
    }
  })], 1), _c('back-to-top', {
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
  })])])]), _c('inject-preview', {
    attrs: {
      "open": _vm.previewModal,
      "id": _vm.selectedInject
    },
    on: {
      "close": _vm.closeModal
    }
  })], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('span', {
    staticClass: "icon"
  }, [_c('i', {
    staticClass: "fas fa-expand-arrows-alt"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "level-left"
  }, [_c('div', {
    staticClass: "level-item"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "column is-paddingless"
  }, [_c('hr', {
    staticClass: "dropdown-divider"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "timeline-content response"
  }, [_c('span', {
    staticClass: "icon"
  }, [_c('i', {
    staticClass: "fas fa-chevron-right"
  })])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    staticClass: "card-header-title is-centered"
  }, [_c('i', {
    staticClass: "fas fa-spinner fa-pulse fa-3x has-text-primary"
  })]);
}];

// EXTERNAL MODULE: ./src/plan/graphql/PlanEvents.gql
var PlanEvents = __webpack_require__(86305);
// EXTERNAL MODULE: ./src/plan/graphql/PlanInjects.gql
var PlanInjects = __webpack_require__(78648);
// EXTERNAL MODULE: ./src/plan/graphql/PlanLabelGroups.gql
var PlanLabelGroups = __webpack_require__(44192);
// EXTERNAL MODULE: ./src/shared/components/helpcontent.vue + 6 modules
var helpcontent = __webpack_require__(21823);
// EXTERNAL MODULE: ./src/shared/mixins/helpers.js
var helpers = __webpack_require__(21809);
// EXTERNAL MODULE: ./src/shared/mixins/lightOrDark.js
var lightOrDark = __webpack_require__(42417);
// EXTERNAL MODULE: ./src/plan/components/inject-preview.vue + 5 modules
var inject_preview = __webpack_require__(86259);
// EXTERNAL MODULE: ./src/shared/mixins/dateChecks.js
var dateChecks = __webpack_require__(8571);
// EXTERNAL MODULE: ./src/shared/mixins/injectStatusCheck.js
var injectStatusCheck = __webpack_require__(4989);
// EXTERNAL MODULE: ./src/shared/components/datepicker.vue + 5 modules
var datepicker = __webpack_require__(14208);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/plan/views/train/MSELTimeline.vue?vue&type=script&lang=js










/* harmony default export */ var MSELTimelinevue_type_script_lang_js = ({
  name: 'msel-timeline',
  components: {
    HelpContent: helpcontent/* default */.A,
    InjectPreview: inject_preview/* default */.A,
    DatePicker: datepicker/* default */.A
  },
  mixins: [helpers/* default */.A, lightOrDark/* default */.A, dateChecks/* default */.A, injectStatusCheck/* default */.A],
  apollo: {
    planEvent: {
      query: PlanEvents.PlanEventRead,
      variables() {
        return {
          where: {
            id: this.eventID
          }
        };
      },
      skip() {
        return !this.eventID;
      },
      update(data) {
        if (data && data.planEvent) {
          return data.planEvent;
        }
      },
      error(error) {
        console.error(error);
      }
    },
    planEvents: {
      query: PlanEvents.PlanEventsSelector,
      variables: {
        where: {
          type: null
        }
      },
      update(data) {
        if (data && data.planEvents && data.planEvents.length > 0) {
          return data.planEvents;
        }
      },
      error(error) {
        console.error(error);
      },
      subscribeToMore: [{
        document: PlanEvents.PlanEventSubscription,
        variables: {
          node: {
            where: {
              type: null
            }
          }
        },
        // Mutate the previous result
        updateQuery(previousResult, {
          subscriptionData
        }) {
          // Mutation type
          let mutationIn = subscriptionData.data.planEvent.mutation;
          let newResult;
          switch (mutationIn) {
            case 'CREATED':
              {
                newResult = {
                  planEvents: [...previousResult.planEvents, subscriptionData.data.planEvent.node]
                };
                break;
              }
            case 'DELETED':
              {
                newResult = {
                  planEvents: [...previousResult.planEvents.filter(obj => subscriptionData.data.planEvent.previousValues.id !== obj.id)]
                };
                break;
              }
            case 'UPDATED':
              {
                let updatedPlanEvents = JSON.parse(JSON.stringify(previousResult.planEvents));
                let index = updatedPlanEvents.findIndex(x => x.id === subscriptionData.data.planEvent.node.id);
                updatedPlanEvents[index] = subscriptionData.data.planEvent.node;
                newResult = {
                  planEvents: updatedPlanEvents
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
    },
    planInjects: {
      query: PlanInjects.PlanInjectsList,
      variables() {
        let data = this.injectsReadVariables();
        data.skip = 0;
        return data;
      },
      update(data) {
        return data.planInjects;
      },
      error(error) {
        console.error(error);
      },
      subscribeToMore: [{
        document: PlanInjects.PlanInjectsSubscription,
        variables() {
          let datafromread = this.injectsReadVariables();
          delete datafromread.skip;
          delete datafromread.first;
          delete datafromread.orderBy;
          let data = {
            node: datafromread
          };
          return data;
        },
        // Mutate the previous result
        updateQuery() {
          this.refetchQueries();
        }
      }]
    },
    planInjectsCount: {
      query: PlanInjects.PlanInjectsCounts,
      variables() {
        let data = this.injectsReadVariables();
        delete data.skip;
        delete data.first;
        delete data.orderBy;
        return data;
      },
      update(data) {
        if (data && data.planInjectsConnection && data.planInjectsConnection.aggregate) {
          return data.planInjectsConnection.aggregate.count;
        }
      },
      error(error) {
        console.error(error);
      }
    },
    planLabelGroups: {
      query: PlanLabelGroups.PlanLabelGroupsRead,
      update(data) {
        if (data && data.planLabelGroups && data.planLabelGroups.length > 0) {
          if (this.board && this.board.length > 0) this.statusGroup = data.planLabelGroups.find(label => label.title === this.board);
          return data.planLabelGroups;
        }
      },
      error(error) {
        console.error(error);
      },
      subscribeToMore: [{
        document: PlanLabelGroups.PlanLabelGroupSubscription,
        // Mutate the previous result
        updateQuery(previousResult, {
          subscriptionData
        }) {
          // Mutation type
          let mutationIn = subscriptionData.data.planLabelGroup.mutation;
          let newResult;
          switch (mutationIn) {
            case 'CREATED':
              {
                newResult = {
                  planLabelGroups: [...previousResult.planLabelGroups, subscriptionData.data.planLabelGroup.node]
                };
                break;
              }
            case 'DELETED':
              {
                newResult = {
                  planLabelGroups: [...previousResult.planLabelGroups.filter(obj => subscriptionData.data.planLabelGroup.previousValues.id !== obj.id)]
                };
                break;
              }
            case 'UPDATED':
              {
                let updatedPlanLabelGroups = JSON.parse(JSON.stringify(previousResult.planLabelGroups));
                let index = updatedPlanLabelGroups.findIndex(x => x.id === subscriptionData.data.planEvent.node.id);
                updatedPlanLabelGroups[index] = subscriptionData.data.planLabelGroup.node;
                newResult = {
                  planLabelGroups: updatedPlanLabelGroups
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
      board: this.$route.query.b ? this.$route.query.b : '',
      statusGroup: '',
      selectedInject: null,
      previewModal: false,
      eventID: this.$route.query.event ? this.$route.query.event : '',
      endAfterStartCheck: null,
      mselStartDate: null,
      mselEndDate: null,
      busyLoading: false,
      itemsPerPage: 10,
      planInjectsCount: 0
    };
  },
  methods: {
    clearSelection() {
      this.eventID = '';
    },
    refetchQueries() {
      this.$apollo.queries.planInjects.refetch();
      this.$apollo.queries.planInjectsCount.refetch();
    },
    injectsReadVariables() {
      let length = this.planInjects ? this.planInjects.length : 0;
      let data = {
        where: {
          AND: [{
            startDate_not: null
          }, {
            deletedAt: null
          }]
        },
        orderBy: 'startDate_ASC',
        first: this.itemsPerPage,
        skip: length
      };
      if (!this.mselStartDate && !this.mselEndDate) {
        this.endAfterStartCheck = this.isEndAfterStart(this.mselStartDate, this.mselEndDate);
      }
      if (!this.mselStartDate && this.mselEndDate) {
        this.endAfterStartCheck = this.isEndAfterStart(this.mselEndDate, this.mselEndDate);
      }
      if (this.mselStartDate && !this.mselEndDate) {
        data.where.AND.push({
          startDate_gte: this.mselStartDate
        });
      }
      if (this.mselStartDate && this.mselEndDate) {
        this.endAfterStartCheck = this.isEndAfterStart(this.mselStartDate, this.mselEndDate);
        if (!this.endAfterStartCheck) {
          data.where.AND.push({
            startDate_gte: this.mselStartDate,
            startDate_lte: this.mselEndDate
          });
        }
      }
      if (this.eventID) {
        data.where.AND.push({
          events: {
            id: this.eventID
          }
        });
      }
      if (this.statusGroup && this.statusGroup.groupLabels && this.statusGroup.groupLabels.length > 0) {
        data.where.AND.push({
          status: {
            title_in: this.statusGroup.groupLabels.map(label => label.title)
          }
        });
      }
      return data;
    },
    previewInject(inject) {
      this.previewModal = true;
      this.selectedInject = inject.id;
    },
    closeModal() {
      this.previewModal = false;
      this.selectedInject = null;
    },
    openFullScreen() {
      let elem = document.getElementById('timeline');
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },
    closeFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    },
    injectColorChecker(status) {
      if (status && status.color) {
        return status.color;
      }
    },
    responseChecker(status) {
      let colorReturn = '';
      if (status && status.title && status.color) {
        if (status.title === 'Complete' || status.title === 'Incomplete') {
          colorReturn = status.color;
        }
      }
      return colorReturn;
    },
    loadMore() {
      if (this.planInjects && this.planInjects.length < this.planInjectsCount) {
        this.busyLoading = true;
        this.$apollo.queries.planInjects.fetchMore({
          variables: this.injectsReadVariables(),
          updateQuery: (previousResult, {
            fetchMoreResult
          }) => {
            if (fetchMoreResult && fetchMoreResult.planInjects && fetchMoreResult.planInjects.length > 0) {
              fetchMoreResult.planInjects = [...this.planInjects, ...fetchMoreResult.planInjects.filter(n => !this.planInjects.some(p => p.id === n.id))];
              this.busyLoading = false;
              return fetchMoreResult;
            }
          }
        });
      } else {
        this.refetchQueries();
      }
    }
  },
  watch: {
    eventID() {
      this.$router.push({
        query: {
          event: this.eventID,
          b: this.statusGroup && this.statusGroup.title.length > 0 ? this.statusGroup.title : ''
        }
      });
      this.planInjects = [];
    },
    statusGroup() {
      this.$router.push({
        query: {
          event: this.eventID,
          b: this.statusGroup && this.statusGroup.title.length > 0 ? this.statusGroup.title : ''
        }
      });
      this.planInjects = [];
    }
  }
});
;// ./src/plan/views/train/MSELTimeline.vue?vue&type=script&lang=js
 /* harmony default export */ var train_MSELTimelinevue_type_script_lang_js = (MSELTimelinevue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/cache-loader/dist/cjs.js??ruleSet[0].use[0]!./node_modules/@vue/cli-service/lib/config/vue-loader-v15-resolve-compat/vue-loader.js??vue-loader-options!./src/plan/views/train/MSELTimeline.vue?vue&type=style&index=0&id=d1ed81bc&prod&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// ./src/plan/views/train/MSELTimeline.vue?vue&type=style&index=0&id=d1ed81bc&prod&lang=scss&scoped=true

// EXTERNAL MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(81656);
;// ./src/plan/views/train/MSELTimeline.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  train_MSELTimelinevue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "d1ed81bc",
  null
  
)

/* harmony default export */ var MSELTimeline = (component.exports);

/***/ })

}]);