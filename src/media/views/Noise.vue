<template>
  <div id="noise"
       class="container">
    <breadcrumb />
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
        </div>
      </div>
      <div class="level-right">
        <help-content :reference="'media.noise'"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div class="columns is-mobile is-multiline">
      <div class="column is-6-desktop is-6-tablet is-12-mobile">
        <div class="card">
          <div class="card-content">
            <label class="label">
              Post Rate
              <span class="icon is-small tooltip is-tooltip-right"
                    data-tooltip="Drag the slider right to increase noise. To stop or decrease noise, slide to 0.">
                <i class="far fa-question-circle"></i>
              </span>
            </label>
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  Noise posts per hour
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  {{noiseConfig.postRateValue}}
                </div>
              </div>
            </nav>
            <input @change="saveProfile"
                   v-if="noiseConfig.postRateValue !== null"
                   v-model="noiseConfig.postRateValue"
                   type="range"
                   min="0"
                   max="1000"
                   value="1"
                   step="1"
                   class="slider is-fullwidth is-large is-primary">
          </div>
        </div>
      </div>
      <div class="column">
        <post-count :type='"Posted"' />
      </div>
    </div>
    <div class="columns is-mobile is-multiline">
      <div class="column is-6-desktop is-6-tablet is-12-mobile">
        <div class="card">
          <div class="card-content">
            <div class="columns is-mobile">
              <div class="column">
                <label class="label">Source type
                  <span class="icon is-small tooltip is-tooltip-right"
                        data-tooltip="Control source types with a Live feed that pulls from the selected location and uploaded sources.">
                    <i class="far fa-question-circle"></i>
                  </span>
                </label>
                <div v-for="(feeds, index) in noiseConfig.feedList"
                     v-bind:key="feeds.key">
                  <label>{{filterName(feeds.key.substring(5,100))}} </label>
                  <i class="fa fa-circle"
                     v-bind:style="'color:'+noiseConfig.colorList[index]"
                     aria-hidden="true"></i><br>
                  <div class="level">
                    <input @change="changeMapInt(index, feeds.key)"
                           v-model="tempFeedList[index]"
                           type="range"
                           min="0"
                           max="100"
                           value="1"
                           step="1"
                           class="slider is-fullwidth has-output">
                    <span>
                      <b>{{tempFeedList[index].toString().substr(0,4)}}
                        <i class="fas fa-percent"></i>
                      </b>
                    </span>
                  </div>
                </div>
              </div>
              <div class="column">
                <svg width="100%"
                     height="100%"
                     viewBox="0 0 42 42"
                     class="donut">
                  <circle class="donut-hole"
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          fill="#fff"></circle>
                  <circle class="donut-ring"
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          fill="transparent"
                          stroke="#d2d3d4"
                          stroke-width="10"></circle>
                  <circle v-for="(percents, index) in noiseConfig.feedDashArray"
                          v-bind:key="index"
                          class="donut-segment"
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          fill="transparent"
                          v-bind:stroke="noiseConfig.colorList[index]"
                          stroke-width="10"
                          v-bind:stroke-dasharray="percents"
                          v-bind:stroke-dashoffset="noiseConfig.feedOffsetArray[index]"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-6-desktop is-6-tablet is-12-mobile">
        <div class="card">
          <div class="card-content">
            <div class="columns is-mobile">
              <div class="column">
                <label class="label">Sites
                  <span class="icon is-small tooltip is-tooltip-right"
                        data-tooltip="Control the ratio of sites for noise posts.">
                    <i class="far fa-question-circle"></i>
                  </span>
                </label>
                <div v-for="(feeds, index) in noiseConfig.serviceList"
                     v-bind:key="feeds.key">
                  <label>{{feeds.key.substring(8,100) }} </label>
                  <i class="fa fa-circle"
                     v-bind:style="'color:'+noiseConfig.colorList[index]"
                     aria-hidden="true"></i><br>
                  <div class="level">
                    <input @change="changeMapInt(index, feeds.key)"
                           v-model="tempServiceList[index]"
                           type="range"
                           min="0"
                           max="100"
                           value="1"
                           step="1"
                           class="slider is-fullwidth has-output">
                    <span>
                      <b>{{tempServiceList[index].toString().substr(0,4)}}
                        <i class="fas fa-percent"></i>
                      </b>
                    </span>
                  </div>
                </div>
              </div>
              <div class="column">
                <svg width="100%"
                     height="100%"
                     viewBox="0 0 42 42"
                     class="donut">
                  <circle class="donut-hole"
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          fill="#fff"></circle>
                  <circle class="donut-ring"
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          fill="transparent"
                          stroke="#d2d3d4"
                          stroke-width="10"></circle>
                  <circle v-for="(percents, index) in noiseConfig.serviceDashArray"
                          v-bind:key="index"
                          class="donut-segment"
                          cx="21"
                          cy="21"
                          r="15.91549430918954"
                          fill="transparent"
                          v-bind:stroke="noiseConfig.colorList[index]"
                          stroke-width="10"
                          v-bind:stroke-dasharray="percents"
                          v-bind:stroke-dashoffset="noiseConfig.serviceOffsetArray[index]"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-mobile is-multiline">
      <div class="column is-6-desktop is-6-tablet is-12-mobile">
        <div class="card">
          <div class="card-content">
            <label class="label">Live Feed Keywords
              <span class="icon is-small tooltip is-tooltip-bottom"
                    data-tooltip="Add keywords to pull in noise from anywhere.">
                <i class="far fa-question-circle"></i>
              </span>
            </label>
            <div class="field is-grouped is-grouped-multiline"
                 v-if="tagList !=''">
              <div class="control"
                   v-for="tags in tagList"
                   :key="tags">
                <div class="tags has-addons">
                  <span class="tag is-primary">{{tags}}</span>
                  <a class="tag is-delete is-primary"
                     @click="deleteTag(tags)"></a>
                </div>
              </div>
            </div>
            <div class="columns is-mobile">
              <div class="column is-10">
                <input v-model="tagInput"
                       v-on:keyup.enter="addTag"
                       class="input"
                       type="text"
                       placeholder="Text input">
              </div>
              <div class="column is-2">
                <a class="button is-primary"
                   @click="addTag">
                  Add
                </a>
              </div>
            </div>
          </div>
          <footer class="modal-card-foot">
            <a class="button is-primary"
               @click="saveProfile()">
              Save
            </a>
          </footer>
        </div>
        <br />
        <div class="card">
          <div class="card-content">
            <label class="label">Location Bounds
              <span class="icon is-small tooltip is-tooltip-right"
                    data-tooltip="Select the source location for your live feed.">
                <i class="far fa-question-circle"></i>
              </span>
            </label>
            <div>
              <MapLocationPicker v-model="noiseConfig.bounding"
                                 :drawType="'Box'" />
            </div>
          </div>
          <footer class="modal-card-foot">
            <a class="button is-primary"
               @click="saveProfile()">
              Save
            </a>
            <a class="button is-inverted"
               @click="downloadKML()">
              Download KML
            </a>
          </footer>
        </div>
      </div>
      <div class="column is-6-desktop is-6-tablet is-12-mobile">
        <RecentPosts />
      </div>
    </div>

  </div>
</template>

<script>
import PostCount from '../components/widgets/post-count'
import MapLocationPicker from '@/shared/components/maplocationpicker'
import RecentPosts from '@/media/components/recentposts'
import HelpContent from '@/shared/components/helpcontent'

import helpers from '@/shared/mixins/helpers'

// geojson to kml and then save as file
import { geojsonToKml } from '@/shared/utils/kml'
import { saveAs } from 'file-saver'

import {
  mediaNoiseLevels,
  updateMediaNoiseLevel,
  updateMapInt
} from '../graphql/noiseProfiles.gql'
export default {
  name: 'noise',
  mixins: [helpers],
  components: {
    HelpContent,
    PostCount,
    MapLocationPicker,
    RecentPosts
  },
  apollo: {
    allNoiseProfiles: {
      query: mediaNoiseLevels,
      update(data) {
        if (data.mediaNoiseLevels && data.mediaNoiseLevels.length > 0) {
          this.loadProfile(data.mediaNoiseLevels[0])
        }
        return data.noiseAttributes
      },
      error(error) {
        console.error(error)
      }
    }
  },
  data() {
    return {
      allNoiseProfiles: {},
      tagList: [],
      tagInput: null,
      noiseConfig: {
        feedList: [],
        serviceList: [],
        postRateValue: null,
        bounding: null,
        previousBounding: null,
        tags: '',
        feedDashArray: [],
        feedOffsetArray: [],
        serviceDashArray: [],
        serviceOffsetArray: [],
        colorList: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2']
      },
      tempFeedList: [],
      tempServiceList: []
    }
  },
  methods: {
    filterName(name) {
      if (name.includes('markov')) {
        return 'bot'
      }
      return name
    },
    loadProfile(profile) {
      this.noiseConfig.feedList = []
      this.noiseConfig.serviceList = []
      this.tempServiceList = []
      this.tempFeedList = []
      if (profile) {
        if (profile.feeds) {
          for (let i = 0; i < profile.feeds.length; i++) {
            if (profile.feeds[i].key.substring(0, 4) === 'feed') {
              this.noiseConfig.feedList.push(profile.feeds[i])
              this.tempFeedList.push(profile.feeds[i].value)
              // this.noiseConfig.colorList.push('#' + Math.floor(Math.random() * 16777215).toString(16))
            } else if (profile.feeds[i].key.substring(0, 7) === 'service') {
              this.noiseConfig.serviceList.push(profile.feeds[i])
              this.tempServiceList.push(profile.feeds[i].value)
              // this.noiseConfig.colorList.push('#' + Math.floor(Math.random() * 16777215).toString(16))
            }
          }
        }
        this.noiseConfig.postRateValue = profile.postRate

        if (profile.bounding) {
          this.noiseConfig.previousBounding = profile.bounding
          this.noiseConfig.bounding = JSON.parse(
            JSON.stringify(profile.bounding),
            this.omitTypename
          )
        }

        if (profile.filterTags && profile.filterTags.length > 0) {
          this.tagList = profile.filterTags.split(',')
        }
      }
      this.updateTagString()
      this.calcFeedPercents()
      this.calcServicePercents()
    },
    calcFeedPercents() {
      let total = 0
      let tempFeedPercents = []
      this.noiseConfig.feedDashArray = []
      this.noiseConfig.feedOffsetArray = []
      for (let i = 0; i < this.tempFeedList.length; i++) {
        total = total + parseInt(this.tempFeedList[i])
        if (i === this.tempFeedList.length - 1) {
          for (let j = 0; j < this.tempFeedList.length; j++) {
            tempFeedPercents.push(
              (parseInt(this.tempFeedList[j]) / total) * 100
            )
          }
        }
      }
      let tempOffset = 0
      for (let i = 0; i < tempFeedPercents.length; i++) {
        this.noiseConfig.feedDashArray.push(
          tempFeedPercents[i] + ' ' + (100 - tempFeedPercents[i]).toString()
        )
        if (i === 0) {
          tempOffset = 25
        } else {
          tempOffset = tempOffset + tempFeedPercents[i]
        }
        this.noiseConfig.feedOffsetArray.push(tempOffset)
      }
    },
    calcServicePercents() {
      let total = 0
      let tempServicePercents = []
      this.noiseConfig.serviceDashArray = []
      this.noiseConfig.serviceOffsetArray = []
      for (let i = 0; i < this.tempServiceList.length; i++) {
        total = total + parseInt(this.tempServiceList[i])
        if (i === this.tempServiceList.length - 1) {
          for (let j = 0; j < this.tempServiceList.length; j++) {
            tempServicePercents.push(
              (parseInt(this.tempServiceList[j]) / total) * 100
            )
          }
        }
      }
      let tempOffset = 0
      for (let i = 0; i < tempServicePercents.length; i++) {
        this.noiseConfig.serviceDashArray.push(
          tempServicePercents[i] +
            ' ' +
            (100 - tempServicePercents[i]).toString()
        )
        if (i === 0) {
          tempOffset = 25
        } else {
          tempOffset = tempOffset + tempServicePercents[i]
        }
        this.noiseConfig.serviceOffsetArray.push(tempOffset)
      }
    },
    changeMapInt(changedIndex, key) {
      if (key.substring(0, 4) === 'feed') {
        this.tempFeedList = this.updateSliderArray(
          parseInt(this.tempFeedList[changedIndex]),
          this.tempFeedList,
          changedIndex
        )
        this.updateAllSources()
      }
      if (key.substring(0, 7) === 'service') {
        this.tempServiceList = this.updateSliderArray(
          parseInt(this.tempServiceList[changedIndex]),
          this.tempServiceList,
          changedIndex
        )
        this.updateAllServices()
      }
      this.$forceUpdate()
    },
    updateAllServices() {
      if (this.noiseConfig && this.noiseConfig.serviceList) {
        for (let i = 0; i < this.noiseConfig.serviceList.length; i++) {
          this.$apollo
            .mutate({
              mutation: updateMapInt,
              variables: {
                data: {
                  value: parseInt(this.tempServiceList[i])
                },
                where: {
                  key: this.noiseConfig.serviceList[i].key
                }
              }
            })
            .then(() => {
              this.calcServicePercents()
            })
            .catch(error => {
              console.error('failed mapInt change: ' + error)
            })
        }
      }
    },
    updateAllSources() {
      if (this.noiseConfig && this.noiseConfig.feedList) {
        for (let i = 0; i < this.noiseConfig.feedList.length; i++) {
          this.$apollo
            .mutate({
              mutation: updateMapInt,
              variables: {
                data: {
                  value: parseInt(this.tempFeedList[i])
                },
                where: {
                  key: this.noiseConfig.feedList[i].key
                }
              }
            })
            .then(() => {
              this.calcFeedPercents()
            })
            .catch(error => {
              console.error('failed mapInt change: ' + error)
            })
        }
      }
    },
    updateSliderArray(newValue, inputArray, changedIndex) {
      let otherTotal = 0
      if (inputArray) {
        for (let i = 0; i < inputArray.length; i++) {
          if (i === changedIndex) {
            // do nothing
          } else {
            otherTotal += parseInt(inputArray[i])
          }
        }
        for (let i = 0; i < inputArray.length; i++) {
          if (i === changedIndex) {
            // inputArray[i] = newValue
          } else {
            if (otherTotal === 0) {
              let tempPercent = 1 / (inputArray.length - 1)
              let temp = (100 - parseInt(newValue)) * tempPercent
              inputArray[i] = parseInt(Math.ceil(temp))
            } else {
              let tempPercent = parseInt(inputArray[i]) / parseInt(otherTotal)
              let temp =
                (100 - parseInt(inputArray[changedIndex])) * tempPercent
              inputArray[i] = parseInt(Math.ceil(temp))
            }
          }
        }
        return inputArray
      } else {
        return []
      }
    },
    addTag() {
      this.tagList.push(this.tagInput)
      this.updateTagString()
      this.tagInput = null
    },
    deleteTag(tag) {
      let index = this.tagList.indexOf(tag)
      this.tagList.splice(index, 1)
      this.updateTagString()
    },
    updateTagString() {
      let temp = ''
      for (let i = 0; i < this.tagList.length; i++) {
        if (i === this.tagList.length - 1) {
          temp = temp + this.tagList[i]
        } else {
          temp = temp + this.tagList[i] + ','
        }
      }
      this.noiseConfig.tags = temp
    },
    saveProfile() {
      let data = {
        postRate: parseInt(this.noiseConfig.postRateValue),
        filterTags: this.noiseConfig.tags
      }
      let dbMapData
      if (this.noiseConfig.bounding !== null) {
        if (this.noiseConfig.previousBounding !== null) {
          //update
          dbMapData = {
            bounding: {
              update: this.noiseConfig.bounding
            }
          }
        } else {
          //create
          dbMapData = {
            bounding: {
              create: this.noiseConfig.bounding
            }
          }
        }
      } else {
        if (this.noiseConfig.previousBounding !== null) {
          // delete location
          dbMapData = {
            bounding: { delete: true }
          }
          this.noiseConfig.previousBounding = null
        }
      }

      if (dbMapData) {
        data = Object.assign(data, dbMapData)
      }
      this.$apollo
        .mutate({
          mutation: updateMediaNoiseLevel,
          variables: {
            data: data,
            where: {
              name: 'noiselevel'
            }
          }
        })
        .then(data => {
          if (data)
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'Save noise failed',
            type: 'is-danger'
          })
          console.error('failed save noise: ' + error)
        })
    },
    downloadKML() {
      try {
        let geojson = this.noiseConfig.bounding && this.noiseConfig.bounding.geojson
        if (!geojson) {
          throw new Error('Noise bounds are not set.')
        }

        let kml = geojsonToKml(geojson, 'EPIC noise bounds')
        let blob = new Blob([kml], {
          type: 'application/vnd.google-earth.kml+xml'
        })
        saveAs(blob, 'noise_bounds.kml')
      } catch (error) {
        this.$buefy.toast.open({
          message: 'Download KML failed',
          type: 'is-danger'
        })
        console.error('failed KML export: ' + error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
