<template>
  <div class="treeChart">
    <table v-if="treeData.name">
      <tr>
        <td :colspan="treeData.children ? treeData.children.length * 2 : 1"
            :class="{parentLevel: treeData.children, extend: treeData.children && treeData.extend}">
          <div :class="{node: true, hasMate: treeData.mate}">
            <div class="person tooltip"
                 @click="$emit('click-node', treeData)"
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
              <div class="name">
                {{treeData.name}}
              </div>
            </div>
            <div class="person"
                 v-if="treeData.mate"
                 @click="$emit('click-node', treeData.mate)">
              <div class="avat">
                <img :src="treeData.mate.image_url"
                     class="is-avatar lg" />
              </div>
              <div class="name">
                {{treeData.mate.name}}
              </div>
            </div>
          </div>
          <div class="extend_handle"
               v-if="treeData.children"
               @click="toggleExtend(treeData)"></div>
        </td>
      </tr>
      <tr v-if="treeData.children && treeData.extend">
        <td v-for="(children, index) in treeData.children"
            :key="index"
            colspan="2"
            class="childLevel">
          <TreeChart :json="children"
                     @click-node="$emit('click-node', $event)" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TreeChart',
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
div.treeChart {
  margin: 0 auto;
  max-width: calc(100vw - 150px);
  table {
    margin: 0 auto;
    table-layout: fixed;
    border-collapse: separate !important;
    border-spacing: 0 !important;
  }
  td {
    position: relative;
    vertical-align: top;
    padding: 0 0 50px 0;
    text-align: center;
  }

  .extend_handle {
    position: absolute;
    left: 50%;
    bottom: 30px;
    width: 10px;
    height: 10px;
    padding: 10px;
    transform: translate3d(-15px, 0, 0);
    cursor: pointer;

    &:before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 2px solid;
      border-color: #ccc #ccc transparent transparent;
      transform: rotateZ(135deg);
      transform-origin: 50% 50% 0;
      transition: transform ease 300ms;
    }
    &:hover:before {
      border-color: #333 #333 transparent transparent;
    }
  }
  .extend {
    .extend_handle:before {
      transform: rotateZ(-45deg);
    }
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 15px;
      height: 15px;
      border-left: 2px solid #ccc;
      transform: translate3d(-1px, 0, 0);
    }
  }

  .childLevel {
    &:before {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 100%;
      height: 15px;
      border-left: 2px solid #ccc;
      transform: translate3d(-1px, 0, 0);
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -15px;
      border-top: 2px solid #ccc;
    }
    &:first-child:before,
    &:last-child:before {
      display: none;
    }
    &:first-child:after {
      left: 50%;
      height: 15px;
      border: 2px solid;
      border-color: #ccc transparent transparent #ccc;
      border-radius: 6px 0 0 0;
      transform: translate3d(1px, 0, 0);
    }
    &:last-child:after {
      right: 50%;
      height: 15px;
      border: 2px solid;
      border-color: #ccc #ccc transparent transparent;
      border-radius: 0 6px 0 0;
      transform: translate3d(-1px, 0, 0);
    }
    &:first-child.childLevel:last-child::after {
      left: auto;
      border-radius: 0;
      border-color: transparent #ccc transparent transparent;
      transform: translate3d(1px, 0, 0);
    }
  }

  .node {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    .person {
      position: relative;
      display: inline-block;
      z-index: 2;
      width: 6em;
      cursor: pointer;
      .avat {
        display: block;
        margin: auto;
        overflow: hidden;
        box-sizing: border-box;
      }
      .avat img {
        width: 100%;
        height: 100%;
      }
      .name {
        height: 2em;
        line-height: 2em;
        width: 100%;
      }
    }
  }
  .node.hasMate::after {
    content: '';
    position: absolute;
    left: 2em;
    right: 2em;
    top: 2em;
    border-top: 2px solid #ccc;
    z-index: 1;
  }
  .node.hasMate .person:last-child {
    margin-left: 1em;
  }

  .landscape {
    transform: rotate(-90deg);
    padding: 0 4em;
    .node {
      text-align: left;
      height: 8em;
      width: 8em;
    }
    .person {
      position: relative;
      transform: rotate(90deg);
      padding-left: 4.5em;
      height: 4em;
      top: 4em;
      left: -1em;
      .avat {
        position: absolute;
        left: 0;
      }
      .name {
        height: 4em;
        line-height: 4em;
      }
    }
    .hasMate {
      position: relative;
      .person {
        position: absolute;
      }
      .person:first-child {
        left: auto;
        right: -4em;
      }
      .person:last-child {
        left: -4em;
        margin-left: 0;
      }
    }
  }
}
</style>
