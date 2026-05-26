<template>
  <ol class="organizational-chart">
    <li v-if="treeData.name">
      <div @click="$emit('click-node', treeData)">
        <div class="tooltip"
             :data-tooltip="treeData.edge_name">
          <div class="avat"
               v-if="treeData.image_url">
            <img :src="treeData.image_url"
                 class="is-avatar lg" />
          </div>
          <div class="avat"
               v-else>
            <span class="icon is-large">
              <i class="fas fa-user-circle has-text-grey fa-3x"></i>
            </span>
          </div>
          <div>{{treeData.name}}</div>
        </div>
      </div>
      <ol>
        <template v-if="treeData.children && treeData.extend">
          <li v-for="(children, index) in treeData.children"
              :key="index">
            <div @click="$emit('click-node', children)">
              <div class="tooltip"
                   :data-tooltip="children.edge_name">
                <div class="image is-large is-64x64"
                     v-if="children.image_url">
                  <img :src="children.image_url"
                       class="is-avatar lg" />
                </div>
                <div v-else>
                  <span class="icon is-large">
                    <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                  </span>
                </div>
                <div>{{children.name}}</div>
              </div>
            </div>
          </li>
        </template>
      </ol>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'OrgChart',
  props: ['json'],
  data() {
    return {
      treeData: {}
    }
  },
  watch: {
    json: {
      handler: function(Props) {
        let extendKey = function(jsonData) {
          jsonData.extend =
            jsonData.extend === void 0 ? true : !!jsonData.extend
          if (Array.isArray(jsonData.children)) {
            jsonData.children.forEach(c => {
              extendKey(c)
            })
          }
          return jsonData
        }
        if (Props) {
          this.treeData = extendKey(Props)
        }
      },
      immediate: true
    }
  },
  methods: {
    toggleExtend: function(treeData) {
      treeData.extend = !treeData.extend
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
ol.organizational-chart,
ol.organizational-chart ol,
ol.organizational-chart li,
ol.organizational-chart li > div {
  position: relative;
}

ol.organizational-chart,
ol.organizational-chart ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

ol.organizational-chart {
  text-align: center;
}

ol.organizational-chart ol {
  padding-top: 1em;
}

ol.organizational-chart ol:before,
ol.organizational-chart ol:after,
ol.organizational-chart li:before,
ol.organizational-chart li:after,
ol.organizational-chart > li > div:before,
ol.organizational-chart > li > div:after {
  background-color: #b7a6aa;
  content: '';
  position: absolute;
}

ol.organizational-chart ol > li {
  padding: 1em 0 0 1em;
}

ol.organizational-chart > li ol:before {
  height: 1em;
  left: 50%;
  top: 0;
  width: 3px;
}

ol.organizational-chart > li ol:after {
  height: 3px;
  left: 3px;
  top: 1em;
  width: 50%;
}

ol.organizational-chart > li ol > li:not(:last-of-type):before {
  height: 3px;
  left: 0;
  top: 2em;
  width: 1em;
}

ol.organizational-chart > li ol > li:not(:last-of-type):after {
  height: 100%;
  left: 0;
  top: 0;
  width: 3px;
}

ol.organizational-chart > li ol > li:last-of-type:before {
  height: 3px;
  left: 0;
  top: 2em;
  width: 1em;
}

ol.organizational-chart > li ol > li:last-of-type:after {
  height: 2em;
  left: 0;
  top: 0;
  width: 3px;
}

ol.organizational-chart li > div {
  background-color: #eee;
  border-radius: 3px;
  min-height: 2em;
  padding: 0.5em;
}

/*** PRIMARY ***/
ol.organizational-chart > li > div {
  margin-right: 1em;
}

ol.organizational-chart > li > div:before {
  bottom: 2em;
  height: 3px;
  right: -1em;
  width: 1em;
}

ol.organizational-chart > li > div:first-of-type:after {
  bottom: 0;
  height: 2em;
  right: -1em;
  width: 3px;
}

ol.organizational-chart > li > div + div {
  margin-top: 1em;
}

ol.organizational-chart > li > div + div:after {
  height: calc(100% + 1em);
  right: -1em;
  top: -1em;
  width: 3px;
}

/*** SECONDARY ***/
ol.organizational-chart > li > ol:before {
  left: inherit;
  right: 0;
}

ol.organizational-chart > li > ol:after {
  left: 0;
  width: 100%;
}

@media only screen and (min-width: 64em) {
  ol.organizational-chart {
    margin-left: -1em;
    margin-right: -1em;
  }

  /* PRIMARY */
  ol.organizational-chart > li > div {
    display: inline-block;
    float: none;
    margin: 0 1em 1em 1em;
    vertical-align: bottom;
  }

  ol.organizational-chart > li > div:only-of-type {
    margin-bottom: 0;
  }

  ol.organizational-chart > li > div:first-of-type:nth-last-of-type(2),
  ol.organizational-chart > li > div:first-of-type:nth-last-of-type(2) ~ div {
    width: calc((100% / 2) - 2em - 4px);
  }

  ol.organizational-chart > li > div:first-of-type:nth-last-of-type(3),
  ol.organizational-chart > li > div:first-of-type:nth-last-of-type(3) ~ div {
    width: calc((100% / 3) - 2em - 4px);
  }

  ol.organizational-chart > li > div:first-of-type:nth-last-of-type(4),
  ol.organizational-chart > li > div:first-of-type:nth-last-of-type(4) ~ div {
    width: calc((100% / 4) - 2em - 4px);
  }

  ol.organizational-chart > li > div:first-of-type:nth-last-of-type(5),
  ol.organizational-chart > li > div:first-of-type:nth-last-of-type(5) ~ div {
    width: calc((100% / 5) - 2em - 4px);
  }

  ol.organizational-chart > li > div:before,
  ol.organizational-chart > li > div:after {
    bottom: -1em !important;
    top: inherit !important;
  }

  ol.organizational-chart > li > div:before {
    height: 1em !important;
    left: 50% !important;
    width: 3px !important;
  }

  ol.organizational-chart > li > div:only-of-type:after {
    display: none;
  }

  ol.organizational-chart > li > div:first-of-type:not(:only-of-type):after,
  ol.organizational-chart > li > div:last-of-type:not(:only-of-type):after {
    bottom: -1em;
    height: 3px;
    width: calc(50% + 1em + 3px);
  }

  ol.organizational-chart > li > div:first-of-type:not(:only-of-type):after {
    left: calc(50% + 3px);
  }

  ol.organizational-chart > li > div:last-of-type:not(:only-of-type):after {
    left: calc(-1em - 3px);
  }

  ol.organizational-chart > li > div + div:not(:last-of-type):after {
    height: 3px;
    left: -2em;
    width: calc(100% + 4em);
  }

  /* SECONDARY */
  ol.organizational-chart > li > ol {
    display: flex;
    flex-wrap: nowrap;
  }

  ol.organizational-chart > li > ol:before,
  ol.organizational-chart > li > ol > li:before {
    height: 1em !important;
    left: 50% !important;
    top: 0 !important;
    width: 3px !important;
  }

  ol.organizational-chart > li > ol:after {
    display: none;
  }

  ol.organizational-chart > li > ol > li {
    flex-grow: 1;
  }

  ol.organizational-chart > li > ol > li:only-of-type {
    padding-top: 0;
  }

  ol.organizational-chart > li > ol > li:only-of-type:before,
  ol.organizational-chart > li > ol > li:only-of-type:after {
    display: none;
  }

  ol.organizational-chart > li > ol > li:first-of-type:not(:only-of-type):after,
  ol.organizational-chart > li > ol > li:last-of-type:not(:only-of-type):after {
    height: 3px;
    top: 0;
    width: 50%;
  }

  ol.organizational-chart
    > li
    > ol
    > li:first-of-type:not(:only-of-type):after {
    left: 50%;
  }

  ol.organizational-chart > li > ol > li:last-of-type:not(:only-of-type):after {
    left: 0;
  }

  ol.organizational-chart > li > ol > li + li:not(:last-of-type):after {
    height: 3px;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
