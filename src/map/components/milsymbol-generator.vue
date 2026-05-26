<template>
  <div class="mil-symbol-picker">
    <ul class="menu-list has-text-centered"
        @click="toggleMilSymbolPicker">
      <li>
        <a>
          <span class="icon is-medium">
            <i class="fas fa-pen-square has-text-white fa-2x"></i>
          </span>
          <span>Edit</span>
        </a>
      </li>
    </ul>
    <div class="modal"
         :class="{'is-active': showDialog}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">MilSymbol Generator - MIL-STD-2525D</p>
          <button class="delete"
                  aria-label="close"
                  @click="toggleMilSymbolPicker"></button>
        </header>
        <section class="modal-card-body">
          <div class="field"
               v-if="marker">
            <label class="label">
              Preview
            </label>
            <div class="control">
              <img :src="marker.toDataURL()" /><br>
              SIDC: {{selectedSIDC}}
            </div>
          </div>

          <div class="field">
            <label class="label">
              Standard identity 1
            </label>
            <div class="control">
              <div class="select">
                <select @change="getSIDC"
                        v-model="selectedSD1">
                  <option v-for="item in standardIdentity1List"
                          :value="item.index"
                          :key="item.index">
                    {{item.name}}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Standard identity 2
            </label>
            <div class="control">
              <div class="select">
                <select @change="getSIDC"
                        v-model="selectedSD2">
                  <option v-for="item in standardIdentity2List"
                          :value="item.index"
                          :key="item.index">
                    {{item.name}}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Symbol Sets
            </label>
            <div class="control">
              <div class="select">
                <select @change="changeSymbolSet"
                        v-model="selectedSymbolSet">
                  <option v-for="item in symbolsets"
                          :value="item.value"
                          :key="item.value">
                    {{item.name}}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Status
            </label>
            <div class="control">
              <div class="select">
                <select @change="getSIDC"
                        v-model="selectedStatus">
                  <option v-for="item in statusDefault"
                          :value="item.code"
                          :key="item.code">
                    {{item.name}}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Echelon
            </label>
            <div class="control">
              <div class="select"
                   v-if="echelonMobilityTowedList && echelonMobilityTowedList.length>0">
                <select @change="getSIDC"
                        v-model="selectedEchelon">
                  <option v-for="item in echelonMobilityTowedList"
                          :value="item.code"
                          :key="item.code">
                    {{item.name}}
                  </option>
                </select>
              </div>
              <span v-else
                    class="disabled">Not Applicable</span>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Headquarters/Task force/Dummy
            </label>
            <div class="control">
              <div class="select">
                <select @change="getSIDC"
                        v-model="selectedTaskForce">
                  <option v-for="item in headquartersTaskforceDummyList"
                          :value="item.code"
                          :key="item.code">
                    {{item.name}}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">
              Icon
            </label>
            <div class="control">
              <div class="select">
                <select @change="getSIDC"
                        v-model="selectedIcon">
                  <option v-for="icon in icons"
                          :value="icon.code"
                          :key="icon.code">
                    {{
                      (icon.entity||'')
                        + (icon['entity type']?' --'+icon['entity type']:'')
                        + (icon['entity subtype']?' --'+icon['entity subtype']:'')
                    }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Symbol Modifier 1
            </label>
            <div class="control">
              <div class="select">
                <select @change="getSIDC"
                        v-model="selectedModifier1">
                  <option v-for="item in modifier1List"
                          :value="item.code"
                          :key="item.code">
                    {{item.modifier}}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">
              Symbol Modifier 2
            </label>
            <div class="control">
              <div class="select">
                <select @change="getSIDC"
                        v-model="selectedModifier2">
                  <option v-for="item in modifier2List"
                          :value="item.code"
                          :key="item.code">
                    {{item.modifier}}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  @click="emitChanges">
            Ok
          </button>
        </footer>
      </div>
    </div>

  </div>
</template>

<script>
import ms from 'milsymbol'
// Symbolsets
import { ms2525d } from '@/map/assets/milsymbol/index_2525d.js'
import defaults_2525d from '@/map/assets/milsymbol/2525d/defaults.json'

import helpers_2525d from '@/map/mixins/helpers_2525d'
export default {
  name: 'MilSymbolGenerator',
  mixins: [helpers_2525d],
  props: ['value'],
  data() {
    return {
      selectedSIDC: null,
      marker: null,
      standardIdentity1List: defaults_2525d.standardIdentity1Default,
      selectedSD1: '0',
      standardIdentity2List: defaults_2525d.standardIdentity2Default,
      selectedSD2: '3',
      statusDefault: defaults_2525d.statusDefault,
      selectedStatus: '0',
      modifier1List: [],
      selectedModifier1: '00',
      modifier2List: [],
      selectedModifier2: '00',
      symbolsets: [],
      selectedSymbolSet: '01',
      echelonMobilityTowedList: [],
      selectedEchelon: '00',
      headquartersTaskforceDummyList: [],
      selectedTaskForce: '0',
      icons: [],
      selectedIcon: '',
      showDialog: false,
      ms2525d: ms2525d
    }
  },
  mounted() {
    // Generate symbolsets
    for (let i in this.ms2525d) {
      this.symbolsets.push({ value: i, name: this.ms2525d[i].name })
      this.selectedSIDC = '1003' + this.selectedSymbolSet + '00000000000000'
    }
    this.changeSymbolSet()
  },
  methods: {
    toggleMilSymbolPicker() {
      this.showDialog = !this.showDialog
    },
    emitChanges() {
      this.$emit('input', this.marker)
      this.toggleMilSymbolPicker()
    },
    changeSymbolSet() {
      this.echelonMobilityTowedList = this.echelonMobilityTowedarray(
        this.selectedSymbolSet
      )
      this.headquartersTaskforceDummyList = this.headquartersTaskforceDummy(
        this.selectedSymbolSet
      )
      this.icons = this.ms2525d[this.selectedSymbolSet]['main icon']
      this.selectedIcon = this.ms2525d[this.selectedSymbolSet]['main icon'][0][
        'code'
      ]
      this.modifier1List = this.ms2525d[this.selectedSymbolSet]['modifier 1']
      this.modifier2List = this.ms2525d[this.selectedSymbolSet]['modifier 2']

      this.getSIDC()
    },

    getSIDC() {
      this.selectedSIDC =
        '10' +
        this.selectedSD1 +
        this.selectedSD2 +
        this.selectedSymbolSet +
        this.selectedStatus +
        this.selectedTaskForce +
        this.selectedEchelon +
        this.selectedIcon +
        this.selectedModifier1 +
        this.selectedModifier2

      this.marker = new ms.Symbol(this.selectedSIDC, {
        size: 35
      })
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../styles/cop-map.scss';
</style>
