<template>
  <div class="dropdown is-right helperComponent"
       :class="{'is-active': show, 'is-up': dropup}">
    <a class="button dropdown-trigger"
       @click="show = !show"
       v-show="!show || dropdown">
      <span class="icon is-small"
            v-if="show"
            key="down">
        <i class="fas fa-caret-down"
           aria-hidden="true"></i>
      </span>
      <span class="icon is-small"
            v-else
            key="up">
        <i class="far fa-question-circle"
           aria-hidden="true"></i>
      </span>
    </a>
    <div class="dropdown-menu"
         :class="{'has-position-relative': !dropdown && !dropup}">
      <div class="card help-content">
        <header class="card-header">
          <p class="card-header-title"
             v-if="helpInfo">
            {{helpInfo.title}}
          </p>
          <p class="card-header-title"
             v-else>
            Help Not Found
          </p>
          <a class="button"
             @click="show = !show"
             v-if="closable">
            <span class="icon is-small">
              <i class="fas fa-times"
                 aria-hidden="true"></i>
            </span>
          </a>
        </header>
        <div class="card-content">
          <div class="content"
               v-if="helpInfo && helpInfo.content">
            <div class=" columns is-mobile is-multiline">
              <div class="column is-12">
                <p class="content text-wrap"
                   v-html="helpInfo.content.text"></p>
              </div>
              <div class="column is-12"
                   v-if="helpInfo.content.link.href">
                <a class="button is-primary"
                   :href="helpInfo.content.link.href"
                   target="_blank">
                  {{helpInfo.content.link.title}}
                </a>
              </div>
            </div>
          </div>
          <div class="content"
               v-else>
            <p>
              No help is available for this page.
              Reference: {{reference}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helperInfo from '@/shared/assets/helperInfo.json'
export default {
  name: 'help-content',
  props: {
    reference: {
      type: String,
      required: true
    },
    toggle: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    dropdown: {
      type: Boolean,
      default: false
    },
    dropup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: !this.toggle || this.visible,
      closable: this.toggle
    }
  },
  computed: {
    helpInfo: function() {
      return helperInfo.data[this.reference]
    }
  }
}
</script>

<style lang="scss" scoped>
//TODO: Add small medium large sizes passed in via props
.help-content {
  width: 350px;
}
p {
  white-space: initial;
}
.has-position-relative {
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.dropdown.is-up .dropdown-menu {
  bottom: 100%;
  padding-bottom: 4px;
  padding-top: initial;
  top: auto;
}
</style>
