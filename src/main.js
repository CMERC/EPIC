/* Polyfills for configured browser support */
'use strict'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { createProvider } from './vue-apollo'
import VeeValidate from 'vee-validate'

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', event => {
    const error = event.reason
    const isDuplicateNavigation = error && (
      error.name === 'NavigationDuplicated' ||
      error._name === 'NavigationDuplicated' ||
      /Avoided redundant navigation/.test(error.message || '')
    )

    if (isDuplicateNavigation) {
      event.preventDefault()
    }
  })
}

import Buefy from 'buefy'
Vue.use(Buefy, { defaultIconPack: 'fas' })

import infiniteScroll from 'vue-infinite-scroll'
import Videoplayer from '@/shared/components/videoplayer.vue'
// Font Awesome
import { library, dom } from '@fortawesome/fontawesome-svg-core'
// add fas, fab, far packs to library
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import Stepper from '@/shared/components/stepper'
import Breadcrumb from '@/shared/components/breadcrumb'
Vue.component('breadcrumb', Breadcrumb)

import LoadingState from '@/shared/components/loading-state'
Vue.component('loading-state', LoadingState)
import EmptyState from '@/shared/components/empty-state'
Vue.component('empty-state', EmptyState)

import EpicModal from '@/shared/components/epic-modal'
Vue.component('epic-modal', EpicModal)

import PostCard from '@/shared/components/post-card'
Vue.component('post-card', PostCard)

import numberFormats from '@/shared/mixins/numberFormats'
Vue.mixin(numberFormats)

import dateFormats from '@/shared/mixins/dateFormats'
Vue.mixin(dateFormats)

import stringFormats from '@/shared/mixins/stringFormats'
Vue.mixin(stringFormats)

library.add(fab, fas, far)
dom.watch() // This will kick of the initial replacement of i to svg tags and configure a MutationObserver

// Load Fonts
require('typeface-roboto')
require('typeface-open-sans')

import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import RichTextEditor from '@/shared/components/rich-text-editor'
import VueClipboard from 'vue-clipboard2'

import moment from 'moment'
Vue.prototype.moment = moment
import momentTimezone from 'moment-timezone'
Vue.prototype.momentTimezone = momentTimezone

import numeral from 'numeral'
Vue.prototype.numeral = numeral
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
Vue.component('multiselect', Multiselect)
import 'ol/ol.css'
import { EmojiPickerPlugin } from 'vue-emoji-picker'

import * as Cesium from 'cesium/Cesium'
import('cesium/Widgets/widgets.css')
Vue.prototype.Cesium = Cesium
window.Cesium = Cesium

Vue.use(EmojiPickerPlugin)

Vue.use(infiniteScroll)

Vue.use(VeeValidate)
Vue.use(Stepper)
Vue.use(VueClipboard)
Vue.use(flatPickr)
Vue.component('quill-editor', RichTextEditor)
Vue.component('videoplayer', Videoplayer)

Vue.config.productionTip = false

import { store } from './store.js'
require('./requestAnimationFrame.js')

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title)
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags)

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
    el => el.parentNode.removeChild(el)
  )
  if (!nearestWithMeta) return next()
  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement('meta')

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key])
      })

      tag.setAttribute('data-vue-router-controlled', '')

      return tag
    })
    .forEach(tag => document.head.appendChild(tag))

  next()
})

// Custom filters and directives
Vue.filter('formatNumber', (num, args) => {
  switch (args) {
    case 'abbreviate':
      return numeral(String(num)).format('0.0a')
    case 'thousands':
      return numeral(String(num)).format('0,0')
    case 'currency':
      return numeral(String(num)).format('$0,0[.]00')
    case 'percent':
      return numeral(String(num)).format('0%')
    default:
      return num
  }
})

// Custom filters and directives
Vue.filter('formatText', (text, args) => {
  switch (args) {
    case 'camelCase':
      return (
        String(text)
          .replace(/([A-Z])/g, ' $1') // insert a space before all caps
          // uppercase the first character
          .replace(/^./, function(str) {
            return str.toUpperCase()
          })
      )
    default:
      return text
  }
})

Vue.filter('truncate', (body, length) => {
  let ending = '...'
  if (body && body.length > length) {
    return body.substring(0, length - ending.length) + ending
  } else {
    return body
  }
})

Vue.filter('striphtml', value => {
  var div = document.createElement('div')
  div.innerHTML = value
  var text = div.textContent || div.innerText || ''
  return text
})

Vue.directive('focus', {
  inserted: el => {
    el.focus()
  }
})

const apolloProvider = createProvider({}, { router })

new Vue({
  store,
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
