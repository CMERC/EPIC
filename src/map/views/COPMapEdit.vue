
<template>
  <div class="cop-map-container">
    <div class="map__grid">
      <div class="map__left actionMenu" 
           v-if="showActionMenu">
        <div class="map__left__menu">
          <div class="map__left__top">
            <ul class="menu-list has-text-centered">
              <li>
                <a @click="$router.push({name: 'map-home'})">
                  <span class="icon is-small" 
                        style="display:inline;">
                    <i class="fas fa-chevron-left" 
                       aria-hidden="true"></i>
                  </span>
                  <span> Home</span>
                </a>
              </li>
              <hr class="is-paddingless is-marginless">
              <li>
                <a @click="save()">
                  <span class="icon is-medium">
                    <i class="fas fa-save fa-2x"></i>
                  </span>
                  <span>Save</span>
                </a>
              </li>
              <hr class="is-paddingless is-marginless">
              <li>
                <a @click="enableDrawInteraction('none'); showSubmenu('none')" 
                   :class="{'is-active': showArea==='none'}">
                  <span class="icon is-medium">
                    <i class="fas fa-mouse-pointer fa-2x"></i>
                  </span>
                  <span>Select</span>
                </a>
              </li>
              <li>
                <a @click="enableDrawInteraction('LineString'); showSubmenu('LineString')" 
                   :class="{'is-active': showArea==='LineString'}">
                  <span class="icon is-medium">
                    <i class="fas fa-arrow-circle-right fa-2x"></i>
                  </span>
                  <span>Marker</span>
                </a>
              </li>
              <li>
                <a @click="enableDrawInteraction('Polygon'); showSubmenu('Shapes')" 
                   :class="{'is-active': showArea==='Shapes'}">
                  <span class="icon is-medium">
                    <i class="fas fa-shapes fa-2x"></i>
                  </span>
                  <span>Shape</span>
                </a>
              </li>
              <li> <a @click="enableDrawInteraction('Location'); showSubmenu('Location')" 
                      :class="{'is-active': showArea==='Location'}">
                <span class="icon is-medium">
                  <i class="fas fa-map-marker-alt fa-2x"></i>
                </span>
                <span>Location</span></a> </li>
              <li>
                <a @click="enableDrawInteraction('Text'); showSubmenu('Text')" 
                   :class="{'is-active': showArea==='Text'}">
                  <span class="icon is-medium">
                    <i class="fas fa-align-left fa-2x"></i>
                  </span>
                  <span>Text</span>
                </a>
              </li>
              <li>
                <a @click="enableDrawInteraction('MilSymbol'); showSubmenu('CustomSymbol')" 
                   :class="{'is-active': showArea==='CustomSymbol'}">
                  <span class="icon is-medium">
                    <i class="fas fa-map-signs fa-2x"></i>
                  </span>
                  <span>Symbol</span>
                </a>
              </li>
            </ul>
          </div>
          <div class="map__left__bottom">
            <hr>
            <ul class="menu-list has-text-centered">
              <li class="mapSettings">
                <a @click="showSubmenu('Settings')"> <span class="icon is-medium">
                                                       <i class="far fa-map fa-2x"></i>
                                                     </span>
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="map__right">
        <transition name="slide" 
                    mode="out-in">
          <div class="actionSubmenu" 
               v-if="showArea !=='none'">
            <nav class="level">
              <div class="level-left"></div>
              <div class="level-right">
                <div class="level-item">
                  <a @click="enableDrawInteraction('none'); showSubmenu('none')" 
                     class="delete is-large" 
                     :class="{'is-active': showArea==='none'}"></a>
                </div>
              </div>
            </nav>
            <div v-if="showArea==='MilSymbol'">
            </div>
            <div v-if="showArea==='LineString'">
              <ul class="menu-list has-text-centered">
                <li>
                  <a @click="enableDrawInteraction('LineString')" 
                     :class="{'is-active': drawType === 'LineString'}">
                    <span class="icon" 
                          key="line">
                      <img src="../assets/Line.svg" />
                    </span>
                    <span>Line</span></a>
                </li>
                <li>
                  <a @click="enableDrawInteraction('Arrow')" 
                     :class="{'is-active': drawType === 'Arrow'}">
                    <span class="icon" 
                          key="arrow">
                      <i class="fas fa-arrow-right fa-2x"></i>
                    </span>
                    <span>Arrow</span></a>
                </li>
                <li>
                  <a @click="enableDrawInteraction('GenericPoint')" 
                     :class="{'is-active': drawType === 'GenericPoint'}">
                    <span class="icon taller-icon" 
                          key="Action Point">
                      <img src="../assets/map-action-point-marker.svg" />
                    </span>
                    <span>Generic Point</span></a>
                </li>
                <li>
                  <a @click="enableDrawInteraction('FriendlyAttack')" 
                     :class="{'is-active': drawType === 'FriendlyAttack'}">
                    <span class="icon" 
                          key="Friendly Ground Axis">
                      <img src="../assets/map-friendly-ground-axis.svg" />
                    </span>
                    <span>Friendly Attack</span></a>
                </li>
                <li>
                  <a @click="enableDrawInteraction('Destroy')" 
                     :class="{'is-active': drawType === 'Destroy'}">
                    <span class="icon" 
                          key="Destroy">
                      <img src="../assets/map-destroy-marker.svg" />
                    </span>
                    <span>Destroy</span></a>
                </li>
              </ul>
            </div>
            <div v-if="showArea ==='Shapes'">
              <ul class="menu-list has-text-centered">
                <li>
                  <a @click="enableDrawInteraction('Polygon')" 
                     :class="{'is-active': drawType === 'Polygon'}">
                    <span class="icon is-medium" 
                          key="polygon">
                      <i class="fas fa-draw-polygon fa-2x"></i>
                    </span>
                    <span>Polygon</span>
                  </a>
                </li>
                <li>
                  <a @click="enableDrawInteraction('Rectangle')" 
                     :class="{'is-active': this.drawType === 'Rectangle'}">
                    <span class="icon is-medium" 
                          key="rectangle">
                      <img src="../assets/map-rectangle-marker.svg" />
                    </span>
                    <span>Rectangle</span>
                  </a>
                </li>
                <li>
                  <a @click="enableDrawInteraction('Square')" 
                     :class="{'is-active': this.drawType === 'Square'}">
                    <span class="icon is-medium" 
                          key="square">
                      <i class="fas fa-vector-square fa-2x"></i>
                    </span>
                    <span>Square</span>
                  </a>
                </li>
                <li>
                  <a @click="enableDrawInteraction('Star')" 
                     :class="{'is-active': this.drawType === 'Star'}">
                    <span class="icon is-medium" 
                          key="Star">
                      <i class="fas fa-star fa-2x"></i>
                    </span>
                    <span>Decision Point</span>
                  </a>
                </li>
                <li>
                  <a @click="enableDrawInteraction('Triangle')" 
                     :class="{'is-active': this.drawType === 'Triangle'}">
                    <span class="icon is-medium" 
                          key="Triangle">
                      <i class="fas fa-caret-up fa-2x"></i>
                    </span>
                    <span>Observation Post</span>
                  </a>
                </li>
                <li>
                  <a @click="enableDrawInteraction('Circle')" 
                     :class="{'is-active': this.drawType === 'Circle'}">
                    <span class="icon is-medium" 
                          key="Circle">
                      <i class="fas fa-circle fa-2x"></i>
                    </span>
                    <span>Circle</span>
                  </a>
                </li>
              </ul>
            </div>
            <div v-if="showArea ==='Text'">
              <ul class="menu-list has-text-centered">
                <li>
                  <a @click="enableDrawInteraction('Text')" 
                     :class="{'is-active': drawType === 'Text'}">
                    <span class="icon is-medium" 
                          key="text">
                      <i class="fas fa-align-left fa-2x"></i>
                    </span>
                    <span>Text</span>
                  </a>
                </li>
              </ul>
            </div>
            <div v-if="showArea ==='Location'">
              <ul class="menu-list has-text-centered">
                <li>
                  <a @click="enableDrawInteraction('Location')" 
                     :class="{'is-active': drawType === 'Location'}">
                    <span class="icon is-medium" 
                          key="location">
                      <i class="fas fa-map-marker-alt fa-2x"></i>
                    </span>
                    <span>Location</span></a>
                </li>
              </ul>
            </div>
            <div v-if="showArea ==='CustomSymbol'">
              <ul class="menu-list has-text-centered">
                <li v-for="sidc in staticSidcList" 
                    :key="sidc.sidc">
                  <a @click="generateMilSymbol(sidc.sidc)" 
                     :class="{'is-active': drawType === 'MilSymbol' && selectedStaticSidc===sidc.sidc}">
                    <span class="icon is-medium">
                      <img :src="getMilSymbolIcon(sidc.sidc)" />
                    </span>
                    <span>{{sidc.title}}</span>
                  </a>
                </li>
                <li>
                  <a @click="generateMilSymbol(customSymbol.getOptions().sidc)" 
                     :class="{'is-active': drawType === 'MilSymbol' && selectedStaticSidc===customSymbol.getOptions().sidc}">
                    <span class="icon is-medium" 
                          key="custom">
                      <img :src="getMilSymbolIcon(customSymbol.getOptions().sidc)" />
                    </span>
                    <span>Custom</span>
                  </a>
                </li>
                <hr>
              </ul>
              <mil-symbol-generator v-model="customSymbol"></mil-symbol-generator>
            </div>
            <div v-if="showArea ==='Settings'">
              <ul class="menu-list has-text-centered">
                <li>
                  <div class="control has-text-centered">
                    <label class="label has-text-white">Title</label>
                    <input class="input" 
                           type="text" 
                           name="Title" 
                           v-model="mapSettings.title" 
                           v-validate="'required|max:22'">
                  </div>
                </li>
                <hr>
                <li>
                  <div class="field is-grouped is-grouped-centered">
                    <div class="field has-addons">
                      <p class="control">
                        <button class="button" 
                                @click="updateMapView('2D')" 
                                :class="{'is-primary': mapBaseView==='2D'}">
                          <span>2D</span>
                        </button>
                      </p>
                      <p class="control">
                        <button class="button" 
                                @click="updateMapView('3D')" 
                                :class="{'is-primary': mapBaseView==='3D'}">
                          <span>3D</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="field">
                    <div class="control has-text-centered">
                      <label class="label has-text-white">Map Type</label>
                      <div class="select">
                        <select v-model="mapSettings.type" 
                                @change="updateMapBaseLayer">
                          <option v-for="baseLayer in customBaseLayers" 
                                  :value="baseLayer.dbkey" 
                                  :key="baseLayer.dbkey">{{baseLayer.label}}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </li>
                <hr>
                <li>
                  <label class="label has-text-white">Weather</label>
                </li>
                <li>
                  <div class="field is-grouped is-grouped-centered">
                    <div>
                      <b-switch :value="this.isWeatherOn"
                                true-value="On"
                                false-value="Off"
                                type="is-success"
                                @input="updateWeatherLayer()">
                        <label class="label has-text-white">{{this.isWeatherOn}}</label>
                      </b-switch>
                    </div>
                  </div>
                </li>
                <li>
                  <label class="label has-text-white">Ranges</label>
                </li>
                <li>
                  <div class="field is-grouped is-grouped-centered">
                    <div>
                      <b-switch :value="this.isRangesOn"
                                true-value="On"
                                false-value="Off"
                                type="is-success"
                                @input="updateRangesLayer()">
                        <label class="label has-text-white">{{this.isRangesOn}}</label>
                      </b-switch>
                    </div>
                  </div>
                </li>
                <hr>
                <li>
                  <a @click="duplicateMapLayer(id)">
                    <span class=" icon is-medium">
                      <i class="fas fa-copy fa-2x"></i>
                    </span>
                    <span>Duplicate Map</span>
                  </a>
                </li>
                <li>
                  <a @click="confirmMapLayerDelete(id)">
                    <span class=" icon is-medium has-text-danger">
                      <i class="fas fa-trash fa-2x"></i>
                    </span>
                    <span>Delete Map</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </transition>
        <div class="helper">
          <help-content :reference="'map.create'" 
                        toggle 
                        dropup />
        </div>
        <div id="map" 
             class="map"></div>
        <div id="action-menu" 
             class="feature-action-menu">
          <span v-show="showActionIcons('edit')" 
                class="icon" 
                @click="updateTextFeature">
            <i class="fas fa-pen"></i>
          </span>
          <span v-show="showActionIcons('style')" 
                class="icon" 
                @click="showStyleDialog">
            <i class="fas fa-palette"></i>
          </span>
          <b-dropdown class="is-pulled-right" 
                      position="is-bottom-left">
            <span class="button is-small" 
                  slot="trigger">
              <span class="icon is-small">
                <i class="fas fa-ellipsis-v"></i>
              </span>
            </span>
            <b-dropdown-item v-show="showActionIcons('style')" 
                             @click="showStyleDialog">
              <span class="icon is-small">
                <i class="fas fa-palette"></i>
              </span>
              <span>Change Style</span>
            </b-dropdown-item>
            <b-dropdown-item @click="removeFeature">
              <span class="icon is-small">
                <i class="fas fa-trash has-text-danger"></i>
              </span>
              <span>Delete Feature</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="modal" 
             :class="{'is-active': openStyleDialog}">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Style</p>
              <button class="delete" 
                      aria-label="close" 
                      @click="openStyleDialog=false"></button>
            </header>
            <section class="modal-card-body">
              <div>
                <div class="shape-style" 
                     v-show="showActionIcons('styles')">
                  <div class="field">
                    <label class="label">
                      Border Color
                    </label>
                    <div class="control">
                      <swatches v-model="selectedFeatureStyles.borderColor" 
                                colors="text-advanced" 
                                show-fallback 
                                inline></swatches>
                    </div>
                  </div>
                  <div class="field is-hidden-desktop">
                    <label class="label">
                      Border Width
                    </label>
                    <div class="control">
                      <input v-model="selectedFeatureStyles.borderWidth" 
                             class="input" 
                             type="number" 
                             min="1" 
                             max="20">
                    </div>
                  </div>
                  <div class="field is-hidden-touch">
                    <label class="label">
                      Border Width
                    </label>
                    <div class="control">
                      <input name="widthRange" 
                             v-model="selectedFeatureStyles.borderWidth" 
                             type="range" 
                             min="1" 
                             max="20">
                      <span style="margin-left:15px;">{{selectedFeatureStyles.borderWidth}}</span>
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">
                      Border Pattern
                    </label>
                    <div class="control">
                      <div class="select">
                        <select v-model="selectedFeatureStyles.borderPattern">
                          <option value="solid">
                            Solid
                          </option>
                          <option value="dash">
                            Dash
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="field" 
                       v-show="showActionIcons('fillColor')">
                    <label class="label">
                      Fill Color
                    </label>
                    <div class="control">
                      <swatches v-model="selectedFeatureStyles.fillColor" 
                                colors="text-advanced" 
                                show-fallback 
                                inline></swatches>
                    </div>
                  </div>
                </div>
                <div class="field" 
                     v-show="showActionIcons('label')">
                  <label class="label">
                    Label
                  </label>
                  <div class="control">
                    <input v-model="selectedFeatureStyles.label" 
                           class="input" 
                           type="text" />
                  </div>
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-primary" 
                      @click="styleFeature">Save</button>
            </footer>
          </div>
        </div>
        <div class="modal" 
             :class="{'is-active': openInfoDialog}">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <div class="modal-card-title">
                <p class="title">{{ selectedFeatureInfo.name }}</p> 
                <p class="subtitle"> {{ selectedFeatureInfo.state_terr }}, {{ selectedFeatureInfo.country }}</p>
              </div> 
              <div class="modal-card-title">
                <img :src="currentWeatherInfo.icon"
                     :alt="currentWeatherInfo.visibility" />   
              </div>
            </header>
            <section class="modal-card-body">
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label is-size-6">
                      Status:
                    </label>
                    <label class="label is-size-7	has-text-weight-normal">
                      {{ selectedFeatureInfo.status }}
                    </label>
                  </div>
                  <div class="field">
                    <label class="label is-size-6	">
                      Component:
                    </label>
                    <label class="label is-size-7	has-text-weight-normal">
                      {{ selectedFeatureInfo.component }}
                    </label>
                  </div>
                  <div class="field">
                    <label class="label is-size-6	">
                      Joint Base:
                    </label>
                    <label class="label is-size-7	has-text-weight-normal">
                      {{ selectedFeatureInfo.joint_base }}
                    </label>
                  </div>
                  <div class="field">
                    <label class="label is-size-6	">
                      Points of Contact:
                    </label>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label is-size-6">
                      Capabilities:
                    </label>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label is-size-6">
                      Training Sites & Targets:
                    </label>
                  </div>
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-primary"
                      v-if="false" >
                Edit
              </button>
              <button class="button is-danger"
                      v-if="false" >
                Delete Area
              </button>
              <button class="button is-outlined"
                      @click="openWeatherDialog=true; openInfoDialog=false ">
                View Weather
              </button>
              <button class="button is-outlined"
                      @click="openInfoDialog=false">
                Cancel
              </button>
            </footer>
          </div>
        </div>
        <div class="modal"
             :class="{'is-active': openWeatherDialog}">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <div class="modal-card-title">
                <p class="title">{{ selectedFeatureInfo.name }}</p> 
                <p class="subtitle"> {{ selectedFeatureInfo.state_terr }}, {{ selectedFeatureInfo.country }}</p>
              </div> 
              <div class="modal-card-title">
                <a :href="selectedFeatureInfo.link"
                   target="_blank"
                   background="white">
                  <img :src="currentWeatherInfo.icon"
                       :alt="currentWeatherInfo.visibility" />
                </a>   
              </div>
            </header>
            <section class="modal-card-body">
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <multiselect name="forecastData" 
                                 v-model="forecastData" 
                                 @select="showForecastDialog=true; openWeatherDialog=false" 
                                 placeholder="Current Weather"  
                                 label="dt" 
                                 track-by="dt" 
                                 :options="weatherForecast" 
                                 :custom-label="formatDate" 
                                 :preselectFirst="false" 
                                 :taggable="false">
                    </multiselect>
                  </div>
                </div>
                <div class="column">
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <div class="columns">
                      <div class="column">
                        <img :src="currentWeatherInfo.icon"
                             :alt="currentWeatherInfo.visibility" />
                      </div>
                      <div class="column">
                        <label class="label is-size-6">
                          {{ currentWeatherInfo.temp + '&deg;'}}
                        </label>
                        <label class="label is-size-6">
                          {{ currentWeatherInfo.description }}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <div class="columns">
                      <div class="column  is-one-quarter">
                        <span class="icon is-large">
                          <i class="fas fa-thermometer-half fa-2x "></i>
                        </span>
                      </div>
                      <div class="column">
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label  is-size-6	has-text-weight-normal">
                              Current Temp:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker ">
                              {{ currentWeatherInfo.temp + '&deg;' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Feels Like Temp:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker ">
                              {{ currentWeatherInfo.feelsLike + '&deg;' }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                  <br />
                  <div class="field">
                    <div class="columns">
                      <div class="column  is-one-quarter">
                        <span class="icon is-large">
                          <i class="far fa-sun fa-2x "></i>
                        </span>
                      </div>
                      <div class="column">
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Sunrise Time:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker ">
                              {{ currentWeatherInfo.sunrise}}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Sunset Time:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ currentWeatherInfo.sunset }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              UV Index:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ currentWeatherInfo.uvIndex }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <div class="columns">
                      <div class="column  is-one-quarter">
                        <span class="icon is-large">
                          <i class="fas fa-wind fa-2x "></i>
                        </span>
                      </div>
                      <div class="column">
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Wind Speed:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ currentWeatherInfo.windSpeed }} mph
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Wind Direction:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker ">
                              {{ currentWeatherInfo.windDir }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Wind Gust:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker ">
                              {{ currentWeatherInfo.windGust }} mph
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                  <br />
                  <div class="field">
                    <div class="columns">
                      <div class="column  is-one-quarter">
                        <span class="icon is-large">
                          <i class="fas fa-cloud fa-2x "></i>
                        </span>
                      </div>
                      <div class="column">
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label iis-size-6	has-text-weight-normal	">
                              Atmospheric Pressure:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ currentWeatherInfo.pressure}}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Humidity:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ currentWeatherInfo.humidity + '%' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Dew Point:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ currentWeatherInfo.dewPoint + '&deg;'}}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Cloudiness:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6 has-text-grey-darker">
                              {{ currentWeatherInfo.cloudPerc + '%' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Visibility:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ currentWeatherInfo.visibility }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                  <br />
                  <div class="field">
                    <div class="columns">
                      <div class="column  is-one-quarter">
                        <span class="icon is-large">
                          <i class="fas fa-cloud-showers-heavy fa-2x "></i>
                        </span>
                      </div>
                      <div class="column">
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Rain Volume:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker ">
                              {{ currentWeatherInfo.rain + 'in' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-weight-normal">
                              Snow Volume:
                            </label>
                          </div>
                          <div class="column is-paddingless">
                            <label class="label is-size-6	has-text-grey-darker ">
                              {{ currentWeatherInfo.snow + 'in' }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-outlined"
                      @click="openInfoDialog=true; openWeatherDialog=false; forecastData=null">
                View Area Details
              </button>
              <button class="button is-outlined"
                      @click="openWeatherDialog=false; forecastData=null">
                Cancel
              </button>
            </footer>
          </div>
        </div>
        <div class="modal"
             :class="{'is-active':showForecastDialog}"
             v-if="forecastData">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <div class="modal-card-title">
                <p class="title">{{ selectedFeatureInfo.name }}</p> 
                <p class="subtitle"> {{ selectedFeatureInfo.state_terr }}, {{ selectedFeatureInfo.country }}</p>
              </div> 
              <div class="modal-card-title">
                <a :href="selectedFeatureInfo.link"
                   target="_blank"
                   background="white">
                  <img :src="currentWeatherInfo.icon"
                       :alt="currentWeatherInfo.visibility" />
                </a>   
              </div>
            </header>
            <section class="modal-card-body">
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <multiselect name="forecastData"
                                 v-model="forecastData"
                                 placeholder="Current Weather"
                                 label="dt"
                                 track-by="dt"
                                 :options="weatherForecast"
                                 :custom-label="formatDate"
                                 :preselectFirst="false"
                                 :taggable="false"></multiselect>
                  </div>
                </div>
                <div class="column">
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <div class="columns">
                      <div class="column">
                        <img :src="getWeatherIcon()"
                             :alt="currentWeatherInfo.visibility" />
                      </div>
                      <div class="column">
                        <label class="label is-size-6">
                          {{ Math.round(forecastData.temp.day) + '&deg;'}}
                        </label>
                        <label class="label is-size-6 is-capitalized">
                          {{ forecastData.weather[0].description }}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <div class="columns">
                      <div class="column is-one-fifth">
                        <span class="icon is-large">
                          <i class="fas fa-thermometer-half fa-2x"></i>
                        </span>
                      </div>
                      <div class="column" >
                        <div class="columns">
                          <div class="column is-paddingless is-marginless ">
                            <p class="is-size-6	has-text-weight-normal ">Morning Temp:</p>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker has-text-right">
                              {{ Math.round(forecastData.temp.morn) + '&deg;' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns" >
                          <div class="column is-marginless is-paddingless">
                            <label class="label  is-size-6	has-text-weight-normal ">
                              Feels Like:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker has-text-right">
                              {{ Math.round(forecastData.feels_like.morn) + '&deg;' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Daytime Temp:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker has-text-right">
                              {{ Math.round(forecastData.temp.day) + '&deg;' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns" >
                          <div class="column is-marginless is-paddingless">
                            <label class="label  is-size-6	has-text-weight-normal ">
                              Feels Like:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker has-text-right">
                              {{ Math.round(forecastData.feels_like.day) + '&deg;' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Nighttime Temp:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless  has-text-left">
                            <label class="label is-size-6	has-text-grey-darker has-text-right">
                              {{ Math.round(forecastData.temp.night) + '&deg;' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns" >
                          <div class="column is-paddingless is-marginless">
                            <label class="label  is-size-6	has-text-weight-normal  ">
                              Feels Like:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker has-text-right">
                              {{ Math.round(forecastData.feels_like.night) + '&deg;' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal  ">
                              Min Temp:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker has-text-right">
                              {{ Math.round(forecastData.temp.min) + '&deg;' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Max Temp:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker has-text-right">
                              {{ Math.round(forecastData.temp.max) + '&deg;' }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <div class="columns">
                      <div class="column is-one-fifth">
                        <span class="icon is-large">
                          <i class="far fa-sun fa-2x "></i>
                        </span>
                      </div>
                      <div class="column">
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              UV Index:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ forecastData.uvi }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                  <div class="field">
                    <div class="columns">
                      <div class="column is-one-fifth">
                        <span class="icon is-large">
                          <i class="fas fa-wind fa-2x "></i>
                        </span>
                      </div>
                      <div class="column">
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Wind Speed:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ forecastData.wind_speed }} mph
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Wind Direction:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ forecastData.wind_deg }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                  <div class="field">
                    <div class="columns">
                      <div class="column is-one-fifth">
                        <span class="icon is-large">
                          <i class="fas fa-cloud fa-2x "></i>
                        </span>
                      </div>
                      <div class="column">
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label iis-size-6	has-text-weight-normal">
                              Atmospheric Pressure:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ forecastData.pressure}}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Humidity:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ forecastData.humidity + '%' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Dew Point:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ Math.round(forecastData.dew_point) + '&deg;'}}
                            </label>
                          </div>
                        </div>
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Cloudiness:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6 has-text-grey-darker ">
                              {{ forecastData.clouds + '%' }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                  <br/>
                  <div class="field">
                    <div class="columns">
                      <div class="column is-one-fifth">
                        <span class="icon is-large">
                          <i class="fas fa-cloud-showers-heavy fa-2x "></i>
                        </span>
                      </div>
                      <div class="column">
                        <div class="columns">
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Rain Volume:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ forecastData.rain ? forecastData.rain + ' in' : '0' + ' in' }}
                            </label>
                          </div>
                        </div>
                        <div class="columns" >
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-weight-normal ">
                              Snow Volume:
                            </label>
                          </div>
                          <div class="column is-paddingless is-marginless">
                            <label class="label is-size-6	has-text-grey-darker">
                              {{ forecastData.snow ? forecastData.snow + ' in' : '0' + ' in'  }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>                    
                  </div>
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-outlined"
                      @click="openInfoDialog=true; openWeatherDialog=false; forecastData=null">
                View Area Details
              </button>
              <button class="button is-outlined"
                      @click="openWeatherDialog=false; forecastData=null">
                Cancel
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import Permissions from '@/shared/mixins/permissions'
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import XYZ from 'ol/source/XYZ'
import DrawRegular from 'ol-ext/interaction/DrawRegular.js'
import Transform from 'ol-ext/interaction/Transform.js'
import Overlay from 'ol/Overlay.js'
import {
  defaults as defaultInteractions,
  Draw,
  Modify,
  Select
} from 'ol/interaction.js'
import { getTopRight } from 'ol/extent.js'
import { toLonLat } from 'ol/proj'
import Point from 'ol/geom/Point'
import { fromExtent } from 'ol/geom/Polygon'
import { Vector as VectorSource } from 'ol/source'
import { GeoJSON } from 'ol/format'
import { Stroke, Style } from 'ol/style.js'

import OLCesium from 'olcs/OLCesium.js'
import olFormatGeoJSON from 'ol/format/GeoJSON.js'

import { createBox } from 'ol/interaction/Draw.js'
import featuresStyleFunctions from '@/map/mixins/featuresStyleFunctions'
import geometry from '@/map/mixins/geometry'
import MilSymbolGenerator from '@/map/components/milsymbol-generator'
import Swatches from 'vue-swatches'
import {
  MapLayerRead,
  MapLayerUpdate,
  MapLayerDelete,
  MapLayerDuplicate
} from '@/map/graphql/MapLayer.gql'

export default {
  name: 'COPMapEdit',
  apollo: {
    mapLayer: {
      query: MapLayerRead,
      variables() {
        return {
          where: {
            id: this.id
          }
        }
      },
      skip() {
        return this.id == undefined
      },
      update(data) {
        if (data.mapLayer != null) {
          this.mapLayer = JSON.parse(
            JSON.stringify(data.mapLayer),
            this.omitTypename
          )
          this.mapSettings.title = this.mapLayer.title
          this.mapSettings.type = this.mapLayer.type || 'SATELLITE'
          this.updateMapBaseLayer()
          if (this.mapLayer.geojson && this.mapLayer.geojson.data) {
            let features = new GeoJSON().readFeatures(
              this.mapLayer.geojson.data
            )
            this.vectorSource.clear()
            if (features && features.length > 0) {
              this.vectorSource.addFeatures(features)
              this.olMap
                .getView()
                .fit(this.vectorSource.getExtent(), this.olMap.getSize())
            }
          }
        }
        return this.mapLayer
      }
    }
  },
  components: {
    HelpContent,
    MilSymbolGenerator,
    Swatches
  },
  props: {
    id: {
      type: String
    }
  },
  mixins: [featuresStyleFunctions, geometry, Permissions],
  data() {
    return {
      mapSettings: {
        title: '',
        type: 'SATELLITE'
      },
      hasEdits: false,
      olMap: null,
      mapLayer: null,
      customSymbol: this.getMilSymbol('10030100000000000000'),
      marker: null,
      vectorSource: null,
      draw: null,
      modify: null,
      tranformInteraction: null,
      selectInteraction: null,
      showActionMenu: true,
      showArea: 'none',
      drawType: 'none',
      isWeatherOn: 'Off',
      isRangesOn: 'Off',
      interactionsLayer: null,
      interactionsLayerSource: null,
      overlay: null,
      vectorLayer: null,
      highlightSelectFeature: null,
      selectedFeature: null,
      staticSidcList: [
        { title: 'Friend', sidc: '10031000000000000000' },
        { title: 'Hostile', sidc: '10061000000000000000' },
        { title: 'Neutral', sidc: '10041000000000000000' },
        { title: 'Unknown', sidc: '10011000000000000000' }
      ],
      selectedStaticSidc: null,
      openStyleDialog: false,
      selectedFeatureStyles: {
        borderColor: 'blue',
        borderWidth: '3',
        fillColor: '#6fa8dc',
        borderPattern: 'solid',
        label: null
      },
      openInfoDialog: false,
      openWeatherDialog: false,
      showForecastDialog: false,
      selectedFeatureInfo: {
        name: 'test',
        component: null,
        country: null,
        status: null,
        state_terr: null,
        capabilities: null,
        link: 'https://www.epicready.com',
        contacts: null,
        sites: null,
        targets: null,
        joint_base: null
      },
      customBaseLayers: [
        {
          label: 'Map',
          dbkey: 'MAP',
          url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        },
        {
          label: 'Satellite',
          dbkey: 'SATELLITE',
          url:
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        },
        {
          label: 'Satellite with Labels',
          dbkey: 'SATELLITEWITHLABELS',
          url:
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        }
      ],
      mapBaseLayers: [],
      ol3dMap: null,
      mapBaseView: '2D',
      weatherLayer: null,
      weatherLayerSource: null,
      precipLayer: null,
      precipLayerSource: null,
      rangeLayer: null,
      rangeLayerSource: null,
      rangeUrl: null,
      validTimeStamp: {},
      forecastData: null,
      currentWeatherInfo: {
        json: null,
        temp: null,
        feelsLike: 0,
        windSpeed: 0,
        windDir: 0,
        windGust: 0,
        visibility: 0,
        icon: null,
        sunrise: null,
        sunset: null,
        pressure: 0,
        humidity: 0,
        dewPoint: 0,
        uvIndex: 0,
        cloudPerc: 0,
        description: null,
        rain: 0,
        snow: 0
      },
      weatherForecast: [],
      publicPath: process.env.BASE_URL
    }
  },
  watch: {
    customSymbol() {
      if (
        this.customSymbol &&
        this.customSymbol.getOptions() &&
        this.customSymbol.getOptions().sidc
      ) {
        this.generateMilSymbol(this.customSymbol.getOptions().sidc)
      }
    }
  },
  beforeMount() {
    this.getTimestamps()
  },
  mounted() {
    this.rangeUrl = this.publicPath + 'Ranges.geojson'
    this.rangeLayerSource = new VectorSource({
      format: new olFormatGeoJSON(),
      url: this.rangeUrl
    })

    this.rangeLayer = new VectorLayer({
      source: this.rangeLayerSource,
      style: this.rangeStyleFunction,
      visible: false
    })

    this.vectorSource = new VectorSource({ features: [] })
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.styleFunction,
      declutter: true
    })
    // Layer to draw temporary features like selection highlight etc
    this.interactionsLayerSource = new VectorSource()
    this.interactionsLayer = new VectorLayer({
      source: this.interactionsLayerSource
    })
    // Keyless basemap layers for local evaluation.
    for (
      let layerIndex = 0;
      layerIndex < this.customBaseLayers.length;
      layerIndex++
    ) {
      this.mapBaseLayers.push(
        new TileLayer({
          visible: false,
          preload: 4,
          source: new XYZ({
            crossOrigin: 'anonymous',
            url: this.customBaseLayers[layerIndex].url
          })
        })
      )
    }

    // Init Interactions
    this.selectInteraction = new Select({
      wrapX: false,
      hitTolerance: 6,
      style: this.styleFunction
    })
    this.selectInteraction.getFeatures().on('add', this.addSelectionListener)
    this.selectInteraction
      .getFeatures()
      .on('remove', this.removeSelectionListener)
    this.modify = new Modify({
      features: this.selectInteraction.getFeatures()
    })

    // Overlays for features action menu
    this.actionMenuLayer = new Overlay({
      element: document.getElementById('action-menu'),
      autoPan: true
    })

    // Init Map
    this.olMap = new Map({
      interactions: defaultInteractions().extend([
        this.selectInteraction,
        this.modify
      ]),
      layers: [
        ...this.mapBaseLayers,
        this.interactionsLayer,
        this.vectorLayer,
        this.rangeLayer
      ],
      overlays: [this.actionMenuLayer],
      projection: 'EPSG:4326',
      target: document.getElementById('map'),
      view: new View({
        center: [-0, 0],
        zoom: 2.5,
        maxZoom: 20
      })
    })
    this.olMap.on('click', this.mapClickEventHandler)
    this.olMap.on('dblclick', this.mapDblClickEventHandler)
    this.ol3dMap = new OLCesium({ map: this.olMap }) // ol2dMap is the ol.Map instance
  },
  methods: {
    addSelectionListener() {
      this.highlightSelectFeature = null
      let selectStyle = this.defaultSelectStyle()
      let collection = this.selectInteraction.getFeatures()
      if (this.tranformInteraction) {
        this.tranformInteraction.select(null)
        this.olMap.removeInteraction(this.tranformInteraction)
      }
      collection.forEach(feature => {
        this.selectedFeature = feature
        let actionMenuCoordinates
        if (feature.getGeometry().getType() === 'Point') {
          this.modify.setActive(true)
          // add highlightSelectFeature
          this.highlightSelectFeature = new Feature({
            geometry: new Point(feature.getGeometry().getCoordinates())
          })
          actionMenuCoordinates = feature.getGeometry().getCoordinates()

          feature.on('change', evt => {
            if (evt && evt.target) {
              this.hasEdits = true
              this.highlightSelectFeature
                .getGeometry()
                .setCoordinates(evt.target.getGeometry().getCoordinates())
              this.actionMenuLayer.setPosition(
                evt.target.getGeometry().getCoordinates()
              )
            }
          })
        } else {
          if (
            feature.getProperties() &&
            this.isTransformTypeShape(feature.getProperties().type)
          ) {
            this.addTranformInteraction(feature.getProperties().type)
          } else {
            this.modify.setActive(true)
          }
          // Generate select highlight feature
          this.highlightSelectFeature = new Feature({
            geometry: new fromExtent(feature.getGeometry().getExtent())
          })
          selectStyle = new Style({
            stroke: new Stroke({ color: 'red', width: 2 })
          })
          actionMenuCoordinates = getTopRight(feature.getGeometry().getExtent())
          feature.on('change', this.nonPointSelectFeatureChange)
        }
        if (this.highlightSelectFeature) {
          this.highlightSelectFeature.setStyle(selectStyle)
          this.interactionsLayerSource.addFeature(this.highlightSelectFeature)
        }
        this.actionMenuLayer.setPosition(actionMenuCoordinates)
      })
    },
    async getTimestamps() {
      const res = await fetch('https://api.rainviewer.com/public/maps.json')
      const data = await res.json()
      this.validTimeStamp = data
    },
    formatDate({ dt }) {
      let date = new Date(dt * 1000)
      return date.toDateString()
    },
    formatTime({ dt }) {
      let dateToFormat = new Date(dt * 1000)
      return (
        dateToFormat.getHours() +
        ':' +
        (dt.getMinutes() < 10 ? '0' : '') +
        dt.getMinutes()
      )
    },
    getWeatherIcon() {
      let iconPath =
        'https://openweathermap.org/img/wn/' +
        this.forecastData.weather[0].icon +
        '@2x.png'
      return iconPath
    },
    async getWeather(lat, long) {
      const res = await fetch(
        'https://api.openweathermap.org/data/2.5/onecall?lat=' +
          lat +
          '&lon=' +
          long +
          '&units=imperial&exclude=minutely,hourly&appid=bd89f3e468fa0291dece03108095e759'
      )
      const data = await res.json()
      this.currentWeatherInfo.json = data
      this.currentWeatherInfo.temp = Math.round(data.current.temp)
      this.currentWeatherInfo.description = data.current.weather[0].description
      this.currentWeatherInfo.feelsLike = Math.round(data.current.feels_like)
      this.currentWeatherInfo.windSpeed = data.current.wind_speed
      this.currentWeatherInfo.windDir = data.current.wind_deg
      this.currentWeatherInfo.visibility = data.current.visibility
      let sunRiseDate = new Date(data.current.sunrise * 1000)
      let sunSetDate = new Date(data.current.sunset * 1000)
      this.currentWeatherInfo.sunrise =
        sunRiseDate.getHours() +
        ':' +
        (sunRiseDate.getMinutes() < 10 ? '0' : '') +
        sunRiseDate.getMinutes()
      this.currentWeatherInfo.sunset =
        sunSetDate.getHours() +
        ':' +
        (sunSetDate.getMinutes() < 10 ? '0' : '') +
        sunSetDate.getMinutes()
      this.currentWeatherInfo.pressure = data.current.pressure
      this.currentWeatherInfo.humidity = data.current.humidity
      this.currentWeatherInfo.dewPoint = Math.round(data.current.dew_point)
      this.currentWeatherInfo.uvIndex = data.current.uvi
      this.currentWeatherInfo.cloudPerc = data.current.clouds
      this.currentWeatherInfo.windGust = data.current.wind_gust
      this.weatherForecast = data.daily
      this.currentWeatherInfo.icon =
        'https://openweathermap.org/img/wn/' +
        data.current.weather[0].icon +
        '@2x.png'
    },
    nonPointSelectFeatureChange(evt) {
      if (evt && evt.target) {
        this.hasEdits = true
        let featureforcoordinates = new Feature({
          geometry: new fromExtent(evt.target.getGeometry().getExtent())
        })
        this.highlightSelectFeature
          .getGeometry()
          .setCoordinates(featureforcoordinates.getGeometry().getCoordinates())
        this.actionMenuLayer.setPosition(
          getTopRight(evt.target.getGeometry().getExtent())
        )
      }
    },
    removeSelectionListener() {
      this.interactionsLayerSource.clear()
      this.actionMenuLayer.setPosition(undefined)
      this.selectInteraction.getFeatures().clear()
      if (this.tranformInteraction) {
        this.tranformInteraction.select(null)
        this.olMap.removeInteraction(this.tranformInteraction)
      }
    },
    removeFeature() {
      this.hasEdits = true
      this.selectInteraction.getFeatures().forEach(feature => {
        this.vectorSource.removeFeature(feature)
        this.removeSelectionListener()
      })
    },
    showStyleDialog() {
      this.selectedFeatureStyles.borderColor =
        this.selectedFeature.get('borderColor') || 'blue'
      this.selectedFeatureStyles.borderWidth =
        this.selectedFeature.get('borderWidth') || '3'
      this.selectedFeatureStyles.fillColor =
        this.selectedFeature.get('fillColor') || '#6fa8dc'
      this.selectedFeatureStyles.borderPattern =
        this.selectedFeature.get('borderPattern') || 'solid'
      this.selectedFeatureStyles.label = this.selectedFeature.get('label')
      this.openStyleDialog = true
    },
    showInfoDialog() {
      this.selectedFeatureInfo.name = this.selectedFeature.get('SITE_NAME')
      this.selectedFeatureInfo.state_terr = this.selectedFeature.get(
        'STATE_TERR'
      )
      this.selectedFeatureInfo.country = this.selectedFeature.get('COUNTRY')
      this.selectedFeatureInfo.component = this.selectedFeature.get('COMPONENT')
      this.selectedFeatureInfo.joint_base = this.selectedFeature.get(
        'JOINT_BASE'
      )
      this.selectedFeatureInfo.status = this.selectedFeature.get('OPER_STAT')
      if (this.selectedFeatureInfo.name) {
        this.openInfoDialog = true
      }
    },
    styleFeature() {
      this.hasEdits = true
      this.selectedFeature.setProperties(this.selectedFeatureStyles)
      this.openStyleDialog = false
    },
    updateTextFeature() {
      this.hasEdits = true
      this.$buefy.dialog.prompt({
        message: `Please enter your updated text`,
        inputAttrs: {
          value: this.selectedFeature.getProperties().text
        },
        onConfirm: value => {
          if (value && value.length > 0) {
            // update feature with new text
            this.selectedFeature.setProperties({ text: value })
          }
        }
      })
    },
    updateMapBaseLayer() {
      for (let i = 0; i < this.mapBaseLayers.length; i++) {
        this.mapBaseLayers[i].setVisible(
          this.customBaseLayers[i].dbkey === this.mapSettings.type
        )
      }
      this.updateCesiumImagery()
    },
    updateCesiumImagery() {
      if (!this.ol3dMap || !window.Cesium) return

      const baseLayer = this.customBaseLayers.find(
        layer => layer.dbkey === this.mapSettings.type
      )
      if (!baseLayer) return

      const scene = this.ol3dMap.getCesiumScene()
      const layers = scene.imageryLayers
      while (layers.length > 0) layers.remove(layers.get(0), false)

      layers.addImageryProvider(
        new window.Cesium.UrlTemplateImageryProvider({
          url: baseLayer.url.replace('{a-c}', 'a'),
          credit: baseLayer.label
        })
      )
    },
    updateRangesLayer() {
      this.isRangesOn == 'On'
        ? (this.isRangesOn = 'Off')
        : (this.isRangesOn = 'On')
      if (this.isRangesOn == 'On') {
        this.rangeLayer.setVisible(true)
      } else {
        this.rangeLayer.setVisible(false)
      }
    },
    updateWeatherLayer() {
      this.isWeatherOn == 'On'
        ? (this.isWeatherOn = 'Off')
        : (this.isWeatherOn = 'On')
      let i = this.validTimeStamp.length - 1
      if (this.isWeatherOn == 'On') {
        this.precipLayerSource = new XYZ({
          url:
            'https://tilecache.rainviewer.com/v2/radar/' +
            this.validTimeStamp[i] +
            '/512/{z}/{x}/{y}/6/1_0.png',
          transition: 0
        })

        this.precipLayer = new TileLayer({
          source: this.precipLayerSource,
          visible: true
        })
        this.olMap.addLayer(this.precipLayer)
      } else {
        this.olMap.removeLayer(this.precipLayer)
      }
    },
    updateMapView(value) {
      this.mapBaseView = value
      this.ol3dMap.setEnabled(value === '3D')
      this.updateCesiumImagery()
    },
    generateMilSymbol(sidc) {
      this.selectedStaticSidc = sidc
      this.marker = this.getMilSymbol(sidc)
    },
    mapClickEventHandler(evt) {
      if (this.drawType !== 'none') {
        this.hasEdits = true
      } else {
        this.olMap.forEachFeatureAtPixel(evt.pixel, feature => {
          if (feature) {
            if (
              feature.getProperties().type !== 'Rectangle' ||
              feature.getProperties().type !== 'Sqaure'
            ) {
              if (this.tranformInteraction)
                this.olMap.removeInteraction(this.tranformInteraction)
              this.selectInteraction.setActive(true)
              this.modify.setActive(true)
            }
          }
        })
      }
      // Style custom features
      switch (this.drawType) {
        case 'MilSymbol': {
          if (
            this.marker &&
            this.marker.getOptions() &&
            this.marker.getOptions().sidc
          ) {
            let iconFeature = new Feature({
              geometry: new Point(evt.coordinate),
              type: 'MilSymbol',
              SIDC: this.marker.getOptions().sidc
            })
            // add feature to map
            this.vectorSource.addFeature(iconFeature)
          }
          break
        }
        case 'Text': {
          this.$buefy.dialog.prompt({
            message: `Please enter your text here`,
            inputAttrs: {
              placeholder: 'e.g. Safe House'
            },
            onConfirm: value => {
              if (value && value.length > 0) {
                let textFeature = new Feature({
                  geometry: new Point(evt.coordinate),
                  type: 'Text',
                  text: value
                })
                // add feature to map
                this.vectorSource.addFeature(textFeature)
              }
            }
          })
          break
        }
        case 'Location': {
          let locationFeature = new Feature({
            geometry: new Point(evt.coordinate),
            type: 'Location'
          })
          this.vectorSource.addFeature(locationFeature)
          break
        }
      }
    },
    async mapDblClickEventHandler(evt) {
      this.olMap.forEachFeatureAtPixel(evt.pixel, feature => {
        if (feature) {
          let coordinate = evt.coordinate
          let lonlat = toLonLat(coordinate)
          let lon = lonlat[0]
          let lat = lonlat[1]
          this.getWeather(lat, lon)
          this.selectedFeature = feature
          this.showInfoDialog()
        }
      })
    },
    showSubmenu(area) {
      this.showArea = area
    },
    enableDrawInteraction(type) {
      this.drawType = type
      // Remove other interactions
      if (this.draw) this.olMap.removeInteraction(this.draw)
      this.removeSelectionListener()
      if (this.drawType === 'none') {
        this.selectInteraction.setActive(true)
        this.modify.setActive(true)
        // Reset the cursor
        this.olMap.getTargetElement().style.cursor = 'default'
        return
      }
      if (this.selectInteraction) this.selectInteraction.setActive(false)
      if (this.modify) this.modify.setActive(false)
      if (this.olMap) {
        this.olMap.getTargetElement().style.cursor = 'crosshair'
      }
      // Add feature type draw interaction
      switch (this.drawType) {
        case 'Text':
        case 'MilSymbol':
        case 'Location':
        case 'Shapes':
        case 'none':
          break
        case 'Arrow': {
          this.draw = new Draw({
            source: this.vectorSource,
            type: 'LineString',
            maxPoints: 2,
            style: this.getDrawStyle
          })
          this.enableSetProperties()
          break
        }
        case 'GenericPoint': {
          this.draw = new Draw({
            source: this.vectorSource,
            type: 'Circle',
            geometryFunction: this.getGenericPointGeometry,
            style: this.getDrawStyle
          })
          this.enableSetProperties()
          break
        }
        case 'Destroy': {
          this.draw = new Draw({
            source: this.vectorSource,
            type: 'Circle',
            geometryFunction: this.getDestroyGeometry,
            style: this.getDrawStyle
          })
          this.enableSetProperties()
          break
        }
        case 'FriendlyAttack': {
          this.draw = new Draw({
            source: this.vectorSource,
            type: 'Circle',
            geometryFunction: this.getFriendlyAttackGeometry,
            style: this.getDrawStyle
          })
          this.enableSetProperties()
          break
        }
        case 'Star': {
          this.draw = new Draw({
            source: this.vectorSource,
            type: 'Circle',
            geometryFunction: this.getStarGeometry,
            style: this.getDrawStyle
          })
          this.enableSetProperties()
          break
        }
        case 'Square': {
          this.draw = new DrawRegular({
            source: this.vectorSource,
            sides: 4,
            canRotate: false,
            squareCondition: () => {
              return true
            }
          })
          this.enableSetProperties()
          break
        }
        case 'Triangle': {
          this.draw = new DrawRegular({
            source: this.vectorSource,
            sides: 3,
            canRotate: false,
            squareCondition: () => {
              return true
            }
          })
          this.enableSetProperties()
          break
        }
        case 'Rectangle': {
          this.draw = new Draw({
            source: this.vectorSource,
            type: 'Circle',
            geometryFunction: createBox(),
            style: this.getDrawStyle
          })
          this.enableSetProperties()
          break
        }
        case 'Circle': {
          // Hack to save circle as polygon, until geojson supports saving cirle
          this.draw = new DrawRegular({
            source: this.vectorSource,
            sides: 64,
            canRotate: false,
            squareCondition: () => {
              return true
            }
          })
          this.enableSetProperties()
          break
        }
        default: {
          this.draw = new Draw({
            source: this.vectorSource,
            type: this.drawType,
            style: this.getDrawStyle
          })
          this.enableSetProperties()
          break
        }
      }
    },
    enableSetProperties() {
      this.draw.on('drawend', evt => {
        if (evt) {
          this.hasEdits = true
          evt.feature.setProperties({
            type: this.drawType,
            name: this.drawType
          })
        }
      })
      this.olMap.addInteraction(this.draw)
    },
    save() {
      this.hasEdits = false
      if (this.id !== undefined) {
        this.$apollo
          .mutate({
            mutation: MapLayerUpdate,
            variables: {
              data: {
                ...this.mapSettings,
                geojson: this.generateMapJson()
              },
              where: { id: this.id }
            }
          })
          .then(() => {
            this.$buefy.toast.open({
              message: 'Saving...',
              type: 'is-success'
            })
          })
          .catch(error => {
            console.error(error)
            this.$buefy.toast.open({
              message: error.message,
              type: 'is-danger'
            })
          })
      }
    },
    confirmMapLayerDelete(mapId) {
      this.$buefy.dialog.confirm({
        title: 'Delete Map',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteMapLayer(mapId)
      })
    },
    deleteMapLayer(mapId) {
      this.$apollo
        .mutate({
          mutation: MapLayerDelete,
          variables: {
            where: {
              id: mapId
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Map Deleted',
            type: 'is-success'
          })
          this.hasEdits = false
          this.$router.push({
            name: 'map-home'
          })
        })
        .catch(error => {
          console.error(error)
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          })
        })
    },
    generateMapJson() {
      return {
        data: JSON.parse(
          JSON.stringify(
            new GeoJSON().writeFeatures(this.vectorSource.getFeatures())
          )
        )
      }
    },
    addTranformInteraction(type) {
      if (this.modify) this.modify.setActive(false)
      // Transform options can be used to enable specific control points based on shapes
      let options = {
        hitTolerance: 6,
        scale: true,
        rotate: !(type === 'Triangle' || type === 'Destroy'),
        stretch: type === 'Rectangle',
        keepAspectRatio: () => {
          return (
            type === 'Square' ||
            type === 'Star' ||
            type === 'Circle' ||
            type === 'Triangle' ||
            type === 'GenericPoint' ||
            type === 'Destroy'
          )
        }
      }
      this.tranformInteraction = new Transform(options)
      this.tranformInteraction.select(this.selectedFeature)
      this.olMap.addInteraction(this.tranformInteraction)
    },
    isTransformTypeShape(type) {
      return (
        type === 'Rectangle' ||
        type === 'Square' ||
        type === 'GenericPoint' ||
        type === 'Star' ||
        type === 'Circle' ||
        type === 'Triangle' ||
        type === 'FriendlyAttack' ||
        type === 'Destroy'
      )
    },
    showActionIcons(type) {
      if (this.selectedFeature)
        switch (type) {
          case 'styles':
            return this.selectedFeature.getGeometry().getType() !== 'Point'
          case 'edit':
            return (
              this.selectedFeature.getProperties() &&
              this.selectedFeature.getProperties().text
            )
          case 'fillColor':
            return this.selectedFeature.getGeometry().getType() === 'Polygon'
          case 'label':
            return (
              this.selectedFeature.getProperties() &&
              !(
                this.selectedFeature.getProperties().type === 'Destroy' ||
                this.selectedFeature.getProperties().type === 'Triangle' ||
                this.selectedFeature.getProperties().type ===
                  'FriendlyAttack' ||
                this.selectedFeature.getProperties().type === 'Text'
              )
            )
          default:
            // show style icon
            return this.selectedFeature.getProperties().type !== 'Text'
        }
    },
    duplicateMapLayer(mapId) {
      this.$apollo
        .mutate({
          mutation: MapLayerDuplicate,
          variables: {
            where: { id: mapId }
          }
        })
        .then(response => {
          if (response && response.data) {
            this.$buefy.toast.open({
              message: 'Duplicate success',
              type: 'is-success'
            })
            this.$router.push({
              path: '/map/copmap/edit/' + response.data.duplicateMapLayer.id
            })
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'Sorry, Map Layer could not be duplicated',
            type: 'is-danger'
          })
          console.error(error)
        })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasEdits) {
      this.$buefy.dialog.confirm({
        title: 'Unsaved Changes',
        message:
          'Would you like to keep editing this page? Leaving this page will discard unsaved changes.',
        type: 'is-primary',
        confirmText: 'Keep Editing',
        cancelText: 'Discard',
        // eslint-disable-next-line space-before-function-paren
        onConfirm: async () => {
          await next(false)
        },
        onCancel: () => {
          next()
        }
      })
    } else {
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/cop-map.scss';
</style>
