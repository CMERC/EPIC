<template>
  <div class="is-relative-mobile"
       v-infinite-scroll="loadMore"
       infinite-scroll-distance="10">
    <section class="section"
             v-if="!query">
      <div class="container">
        <nav class="level is-spaced">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <help-content :reference="'web.search'"
                            toggle
                            dropdown />
            </div>
          </div>
        </nav>
        <section class="hero">
          <div class="hero-body">
            <div class="container has-text-centered">
              <div class="columns is-centered is-vcentered">
                <div class="column is-half">
                  <div class="hero-head">
                    <img src="@/shared/assets/web.svg"
                         alt="EPIC Web">
                  </div>
                  <h1 class="is-family-roboto has-text-grey has-text-weight-light is-size-1">
                    Search
                  </h1>
                  <br>
                  <div class="field has-addons">
                    <div class="control is-expanded">
                      <input class="input"
                             v-model.lazy="searchQuery"
                             placeholder=""
                             v-focus />
                    </div>
                    <div class="control">
                      <a class="button is-link">
                        <span class="icon is-small is-left has-text-white">
                          <i class="fas fa-search"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
    <div v-else
         class="container relative">
      <div class="tabs is-marginless">
        <ul>
          <li @click="siteType=null"
              :class="{'is-active' : siteType == null }">
            <a>
              <span class="icon is-small"><i class="fas fa-search"
                                             aria-hidden="true"></i></span>
              <span>All</span>
            </a>
          </li>
          <li @click="siteType='SOCIALMEDIA'"
              :class="{'is-active' : siteType == 'SOCIALMEDIA' }">
            <a>
              <span class="icon is-small"><i class="far fa-comment-alt"
                                             aria-hidden="true"></i></span>
              <span>Social Media</span>
            </a>
          </li>
          <li @click="siteType='NEWS'"
              :class="{'is-active' : siteType == 'NEWS' }">
            <a>
              <span class="icon is-small"><i class="far fa-newspaper"
                                             aria-hidden="true"></i></span>
              <span>News</span>
            </a>
          </li>
          <li @click="siteType='BLOG'"
              :class="{'is-active' : siteType == 'BLOG' }">
            <a>
              <span class="icon is-small"><i class="fas fa-blog"
                                             aria-hidden="true"></i></span>
              <span>Blog</span>
            </a>
          </li>
          <li @click="siteType='VIDEO'"
              :class="{'is-active' : siteType == 'VIDEO' }">
            <a>
              <span class="icon is-small"><i class="far fa-play-circle"
                                             aria-hidden="true"></i></span>
              <span>Video</span>
            </a>
          </li>
          <li @click="siteType='OTHER'"
              :class="{'is-active' : siteType == 'OTHER' }">
            <a>
              <span class="icon is-small"><i class="fas fa-align-left"
                                             aria-hidden="true"></i></span>
              <span>Other</span>
            </a>
          </li>
          <li @click="showMenu = (showMenu == 'Advanced' ? '':'Advanced')"
              :class="{'is-active': showMenu == 'Advanced'}">
            <a>
              <span class="icon is-small"><i class="fas fa-cog"
                                             aria-hidden="true"></i></span>
              <span>Advanced</span>
            </a>
          </li>
        </ul>
      </div>
      <transition name="expand"
                  @enter="enter"
                  @after-enter="afterEnter"
                  @leave="leave">
        <div class="advancedMenu"
             v-if="showMenu == 'Advanced'">
          <div class="card">
            <div class="card-content">
              <div class="columns is-multiline">
                <div class="column is-full">
                  <p class="is-size-6">Advanced Search</p>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <p class="subtitle is-7">Include all these words</p>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <input class="input"
                               name="includeTerms"
                               v-model="searchAdvanced.include"
                               @keyup.enter="applySearchAdvanced()" />
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <p class="subtitle is-7">Include any of these words</p>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <input class="input"
                               name="eitherTerms"
                               v-model="searchAdvanced.either"
                               @keyup.enter="applySearchAdvanced()" />
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <p class="subtitle is-7">Exclude these words</p>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <input class="input"
                               name="excludeTerms"
                               v-model="searchAdvanced.exclude"
                               @keyup.enter="applySearchAdvanced()" />
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <p class="subtitle is-7">This exact word or phrase</p>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <input class="input"
                               name="exactTerms"
                               v-model="searchAdvanced.exact"
                               @keyup.enter="applySearchAdvanced()" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-full">
                  <p class="is-size-6">Content Type</p>
                  <div class="field is-grouped is-horizontal">
                    <p class="control">
                      <input type="radio"
                             value=""
                             v-model="contentType"
                             id="anyCheck">
                      <label for="anyCheck"><span class="icon is-small"><i class="far fa-comment-dots"></i></span>Any</label>
                    </p>
                    <p class="control">
                      <input type="radio"
                             value="image"
                             v-model="contentType"
                             id="photoCheck">
                      <label for="photoCheck"><span class="icon is-small"><i class="far fa-image"></i></span>Photo</label>
                    </p>
                    <p class="control">
                      <input type="radio"
                             value="video"
                             v-model="contentType"
                             id="videoCheck">
                      <label for="videoCheck"><span class="icon is-small"><i class="far fa-play-circle"></i></span>Video</label>
                    </p>

                  </div>
                </div>
              </div>
              <div class="column is-full">
                <div class="field is-grouped">
                  <p class="control">
                    <button class="button is-rounded is-primary"
                            @click="applySearchAdvanced()">
                      Apply
                    </button>
                  </p>
                  <p class=" control">
                    <button class="button is-rounded is-outlined"
                            @click="showMenu = ''">
                      Close
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <nav class="level">
        <div class="level-left">
          <nav class="breadcrumb is-spaced"
               aria-label="breadcrumbs"
               v-if="query">
            <ul>
              <li>
                <a @click="$router.go(-1)">
                  <span class="icon is-small">
                    <i class="fas fa-chevron-left"></i>
                  </span>Back</a>
              </li>
              <li class="is-active">
                <a aria-current="page">{{query}}</a>
              </li>
              <li class="is-active"
                  v-if="contentType">
                <a aria-current="page">Content Type: {{contentType}}</a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="level-right">
          <div clss="level-item">
            <help-content :reference="'web.searchresults'"
                          toggle
                          dropdown />
          </div>
        </div>
      </nav>
      <div class="columns is-multiline media-posts-list"
           v-if="mediaSearchPublic && mediaSearchPublic.length > 0">
        <!-- Cards without Titles -->
        <template v-if="$apollo.loading == false || loadingMore == true">
          <template v-if="siteType =='SOCIALMEDIA' || siteType =='VIDEO'">
            <div class="column is-one-third"
                 v-for="mediaPost in mediaSearchPublic"
                 v-bind:key="mediaPost.id">
              <router-link :to="mediaPost.parent == null ? '/web/'+$route.params.workspace+'/'+mediaPost.profiles[0].service.name+ '/'+mediaPost.profiles[0].username+ '/'+mediaPost.id : '/web/'+$route.params.workspace+'/'+mediaPost.parent.profiles[0].service.name+ '/'+mediaPost.parent.profiles[0].username+ '/'+mediaPost.parent.id">
                <div class="card">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48"
                                v-if="mediaPost.profiles[0].avatar">
                          <img :src='mediaPost.profiles[0].avatar?mediaPost.profiles[0].avatar.url.thumb:""'
                               class="is-avatar md">
                        </figure>
                        <figure class="image is-48x48"
                                v-else>
                          <span class="icon is-large">
                            <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                          </span>
                        </figure>
                      </div>
                      <div class="media-content">
                        <strong>{{mediaPost.profiles[0].name}}</strong>
                        <small> - @{{mediaPost.profiles[0].username}}</small>
                        <small class="tooltip"
                               :data-tooltip="formatDate(mediaPost.publishTime, 'utc-dtg')">
                          {{formatDate(mediaPost.publishTime, 'milTimeDate')}}
                        </small>
                      </div>
                    </div>
                    <div class="content">
                      <span v-html="parseText(truncate(processPost(mediaPost.text, mediaPost.profiles[0].service), 280))" />
                    </div>
                    <div class="card-image">
                      <div v-if="mediaPost.mediaFile && mediaPost.mediaFile.url">
                        <img v-if="ifImage(mediaPost.mediaFile.contentType)"
                             :src='mediaPost.mediaFile?mediaPost.mediaFile.url.small:""'
                             alt="Post Image">
                        <audio controls
                               v-else-if="ifAudio(mediaPost.mediaFile.contentType)">
                          <source :src="mediaPost.mediaFile.url.raw"
                                  :type="mediaPost.mediaFile.contentType">
                        </audio>
                        <videoplayer v-else-if="ifVideo(mediaPost.mediaFile.contentType)"
                                     :src="mediaPost.mediaFile.url.raw"></videoplayer>
                        <a v-else
                           :href="mediaPost.mediaFile.url.raw">
                          File Link
                        </a>
                      </div>
                    </div>

                    <footer>
                      <nav class="level is-mobile">
                        <div class="level-left">
                          <div class="level-item">
                            <span class="icon is-small"
                                  :style="'color:'+mediaPost.profiles[0].service.color"
                                  v-if="mediaPost.profiles && mediaPost.profiles[0].service.icon">
                              <i :class="mediaPost.profiles[0].service.icon"></i>
                            </span>
                            <span class="icon is-small"
                                  v-else>
                              <i class="fas fa-sm"></i>
                            </span>
                            <span class="subtitle is-7">{{mediaPost.profiles[0].service.displayName}}</span>
                          </div>
                        </div>
                        <div class="level-right">
                          <div class="level-item">
                            <sentiment :text="truncate(processPost(mediaPost.text ,mediaPost.profiles[0].service), 280)" />
                          </div>
                        </div>
                      </nav>
                    </footer>
                  </div>
                </div>
              </router-link>
            </div>
          </template>

          <!-- Cards with Titles-->
          <template v-if="siteType == 'NEWS' || siteType == 'BLOG'">
            <div class="column is-one-third"
                 v-for="mediaPost in mediaSearchPublic"
                 v-bind:key="mediaPost.id">
              <router-link :to="mediaPost.parent == null ? '/web/'+$route.params.workspace+'/'+mediaPost.profiles[0].service.name+ '/'+mediaPost.profiles[0].username+ '/'+mediaPost.id : '/web/'+$route.params.workspace+'/'+mediaPost.parent.profiles[0].service.name+ '/'+mediaPost.parent.profiles[0].username+ '/'+mediaPost.parent.id">
                <div class="card">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48"
                                v-if="mediaPost.profiles[0].avatar">
                          <img :src='mediaPost.profiles[0].avatar?mediaPost.profiles[0].avatar.url.thumb:""'
                               class="is-avatar md">
                        </figure>
                        <figure class="image is-48x48"
                                v-else>
                          <span class="icon is-large">
                            <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                          </span>
                        </figure>
                      </div>
                      <div class="media-content">
                        <strong>{{mediaPost.profiles[0].name}}</strong>
                        <small> - @{{mediaPost.profiles[0].username}}</small>
                        <small class="tooltip"
                               :data-tooltip="formatDate(mediaPost.publishTime)">
                          {{formatDate(mediaPost.publishTime, 'milTimeDate')}}
                        </small>
                      </div>
                    </div>
                    <div class="content">
                      <p class="title is-6"
                         v-if="mediaPost.title">{{mediaPost.title}}</p>
                      <span v-html="parseText(truncate(processPost(mediaPost.text, mediaPost.profiles[0].service), 280))" />
                    </div>
                    <div class="card-image">
                      <div v-if="mediaPost.mediaFile && mediaPost.mediaFile.url">
                        <img v-if="ifImage(mediaPost.mediaFile.contentType)"
                             :src='mediaPost.mediaFile?mediaPost.mediaFile.url.small:""'
                             alt="Post Image">
                        <audio controls
                               v-else-if="ifAudio(mediaPost.mediaFile.contentType)">
                          <source :src="mediaPost.mediaFile.url.raw"
                                  :type="mediaPost.mediaFile.contentType">
                        </audio>
                        <videoplayer v-else-if="ifVideo(mediaPost.mediaFile.contentType)"
                                     :src="mediaPost.mediaFile.url.raw"></videoplayer>
                        <a v-else
                           :href="mediaPost.mediaFile.url.raw">
                          File Link
                        </a>
                      </div>
                    </div>
                    <footer>
                      <nav class="level is-mobile">
                        <div class="level-left">
                          <div class="level-item">
                            <span class="icon is-small"
                                  :style="'color:'+mediaPost.profiles[0].service.color"
                                  v-if="mediaPost.profiles && mediaPost.profiles[0].service.icon">
                              <i :class="mediaPost.profiles[0].service.icon"></i>
                            </span>
                            <span class="icon is-small"
                                  v-else>
                              <i class="fas fa-sm"></i>
                            </span>
                            <span class="subtitle is-7">{{mediaPost.profiles[0].service.displayName}}</span>
                          </div>
                        </div>
                        <div class="level-right">
                          <div class="level-item">
                            <sentiment :text="truncate(processPost(mediaPost.text ,mediaPost.profiles[0].service), 280)" />
                          </div>
                        </div>
                      </nav>
                    </footer>
                  </div>
                </div>
              </router-link>
            </div>
          </template>
          <!-- List -->
          <template v-if="siteType == null || siteType == 'OTHER'">
            <div class="column">
              <article class="media"
                       v-for="mediaPost in mediaSearchPublic"
                       v-bind:key="mediaPost.id">
                <figure class="media-left">
                  <figure class="image is-48x48"
                          v-if="mediaPost.profiles[0].avatar">
                    <img :src='mediaPost.profiles[0].avatar?mediaPost.profiles[0].avatar.url.thumb:""'
                         class="is-avatar md">
                  </figure>
                  <figure class="image is-48x48"
                          v-else>
                    <span class="icon is-large">
                      <i class="fas fa-user-circle has-text-grey fa-3x"></i>
                    </span>
                  </figure>
                </figure>
                <div class="media-content">
                  <div class="content">
                    <router-link :to="mediaPost.parent == null ? '/web/'+$route.params.workspace+'/'+mediaPost.profiles[0].service.name+ '/'+mediaPost.profiles[0].username+ '/'+mediaPost.id : '/web/'+$route.params.workspace+'/'+mediaPost.parent.profiles[0].service.name+ '/'+mediaPost.parent.profiles[0].username+ '/'+mediaPost.parent.id">
                      <p>
                        <span class="icon is-small"
                              :style="'color:'+mediaPost.profiles[0].service.color"
                              v-if="mediaPost.profiles && mediaPost.profiles[0].service.icon">
                          <i :class="mediaPost.profiles[0].service.icon"></i>
                        </span>
                        <span class="icon is-small"
                              v-else>
                          <i class="fas fa-sm"></i>
                        </span>
                        <strong> - {{mediaPost.profiles[0].name}}</strong>
                        <small> - @{{mediaPost.profiles[0].username}}</small>
                        <small class="tooltip"
                               :data-tooltip="formatDate(mediaPost.publishTime, 'utc-dtg')"> - {{formatDate(mediaPost.publishTime, 'convertDate')}} - </small>
                        <sentiment :text="truncate(processPost(mediaPost.text ,mediaPost.profiles[0].service), 280)" />
                        <br>
                        <span v-html="parseText(truncate(processPost(mediaPost.text, mediaPost.profiles[0].service), 280))" />
                      </p>
                    </router-link>
                  </div>
                </div>
              </article>
            </div>
          </template>

        </template>
        <back-to-top bottom="20px"
                     right="20px">
          <button type="button"
                  class="button">
            <span class="icon is-small"> <i class="fas fa-arrow-up"></i> </span>
          </button>
        </back-to-top>
        <div class="column is-full"
             v-if="$apollo.loading">
          <div class="card-header-title is-centered">
            <i class="fas fa-spinner fa-pulse fa-3x has-text-primary"></i>
          </div>
          <p class="subtitle has-text-centered">Loading...
          </p>
        </div>
      </div>
      <div class="columns is-centered noResults"
           v-else>

        <div class="column is-half">
          <empty-state :isCard='false'
                       :data="mediaSearchPublic"
                       :search="searchQuery ? true : false"
                       :isLoading='$apollo.loading'>
            <template slot="custom-message">
              <h3 class="title is-5">
                No results found for <span class="query">{{query}}</span>.
              </h3>
              <p class="is-size-6">Suggestions:</p>
              <ul class="is-list-disc has-text-grey is-size-6">
                <li>Make sure everything is spelled correctly.</li>
                <li>Try more general keywords.</li>
                <li>Try fewer keywords.</li>
                <li>Need <a href="https://help.epicready.com/web/search"
                            target="_blank">more help</a>?</li>
              </ul>
            </template>
          </empty-state>
        </div>

      </div>

      <div class="error-message"
           v-if="invalidWorkspace">
        <h5 class="title">
          {{invalidWorkspace}}
        </h5>
      </div>

    </div>
  </div>
</template>
<script>
import HelpContent from '@/shared/components/helpcontent'
import helpers from '@/shared/mixins/helpers'
import { MediaSearchPublic } from '../graphql/MediaSearch.gql'
import processText from '@/shared/mixins/processText'
import sentiment from '@/shared/components/sentiment'

import bulmaCarousel from 'bulma-extensions/bulma-carousel/dist/js/bulma-carousel.min.js'
export default {
  name: 'WebHome',
  mixins: [helpers, processText],
  props: ['query', 'tab', 'service', 'workspace'],
  components: { sentiment, HelpContent },
  apollo: {
    mediaSearchPublic: {
      query: MediaSearchPublic,
      variables() {
        let varaiables = this.searchPublicQueryVariables()
        // delete skip
        delete varaiables.skip
        return varaiables
      },
      error(error) {
        this.invalidWorkspace = error.message
      }
    }
  },
  data() {
    return {
      sentiment: null,
      postType: [],
      searchQuery: this.query,
      searchAdvanced: {
        include: '',
        either: '',
        exclude: '',
        exact: ''
      },
      showMenu: '',
      siteType: this.tab,
      contentType: '',
      carousel: [],
      invalidWorkspace: null,
      doneLoading: false,
      loadingMore: false,
      itemsPerPage: 18
    }
  },
  updated() {
    this.carousel = bulmaCarousel.attach()
  },
  methods: {
    searchPublicQueryVariables() {
      let length = this.mediaSearchPublic ? this.mediaSearchPublic.length : 0
      let args = {
        data: {
          query: this.searchQuery,
          workspace: this.$route.params.workspace,
          siteType: this.siteType,
          contentType: this.contentType
        },
        skip: length,
        first: this.itemsPerPage,
        orderBy: 'publishTime_DESC'
      }
      if (this.service != undefined) {
        args.data = {
          ...args.data,
          service: this.service
        }
      }
      return args
    },
    loadMore() {
      if (
        this.mediaSearchPublic &&
        this.mediaSearchPublic.length > 0 &&
        !this.doneLoading
      ) {
        this.loadingMore = true
        this.$apollo.queries.mediaSearchPublic.fetchMore({
          variables: this.searchPublicQueryVariables(),
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.loadingMore = false
            if (
              fetchMoreResult &&
              fetchMoreResult.mediaSearchPublic &&
              fetchMoreResult.mediaSearchPublic.length > 0
            ) {
              let newPosts = [
                ...this.mediaSearchPublic,
                ...fetchMoreResult.mediaSearchPublic.filter(
                  n => !this.mediaSearchPublic.some(p => p.id === n.id)
                )
              ]
              fetchMoreResult.mediaSearchPublic = newPosts
              return fetchMoreResult
            } else {
              this.doneLoading = true
            }
          }
        })
      }
    },
    applySearchAdvanced() {
      //Do no do any search if all the form is all blank
      if (
        !this.searchAdvanced.include &&
        !this.searchAdvanced.either &&
        !this.searchAdvanced.exclude &&
        !this.searchAdvanced.exact
      )
        return

      let searchTerms = ''

      searchTerms += this.searchAdvanced.include
        .trim()
        .split(' ')
        .join(' ')

      if (this.searchAdvanced.either) {
        searchTerms += ' '
        searchTerms += this.searchAdvanced.either
          .trim()
          .split(' ')
          .map(function(el) {
            return '|' + el
          })
          .join(' ')
      }

      if (this.searchAdvanced.exclude) {
        searchTerms += ' '
        searchTerms += this.searchAdvanced.exclude
          .trim()
          .split(' ')
          .map(function(el) {
            return '-' + el
          })
          .join(' ')
      }

      if (this.searchAdvanced.exact) {
        searchTerms += ' '
        searchTerms += '"' + this.searchAdvanced.exact.trim() + '"'
      }

      //clear and add array of terms to search
      this.searchQuery = ''
      this.searchQuery += searchTerms
    },
    enter(element) {
      const width = getComputedStyle(element).width

      element.style.width = width
      element.style.position = 'absolute'
      element.style.visibility = 'hidden'
      element.style.height = 'auto'

      const height = getComputedStyle(element).height

      element.style.width = null
      element.style.position = null
      element.style.visibility = null
      element.style.height = 0

      getComputedStyle(element).height

      setTimeout(() => {
        element.style.height = height
      })
    },
    afterEnter(element) {
      element.style.height = 'auto'
    },
    leave(element) {
      const height = getComputedStyle(element).height

      element.style.height = height

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height

      setTimeout(() => {
        element.style.height = 0
      })
    }
  },
  watch: {
    query: function() {
      this.doneLoading = false
      if (!this.query) {
        this.siteType = null
      }

      this.searchQuery = this.query
    },
    tab: function() {
      this.doneLoading = false
      this.siteType = this.tab
    },
    siteType: function() {
      this.doneLoading = false
      this.$router.push({ query: { q: this.searchQuery, t: this.siteType } })
    },
    contentType: function() {
      this.doneLoading = false
    },
    searchQuery: function() {
      this.$router.push({ query: { q: this.searchQuery, t: this.siteType } })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  a {
    padding: 0.5rem;
  }
  .icon {
    margin: 0 0.5rem;
  }
}
.card {
  background-color: white;
  .card-content {
    padding: 0.5rem;
    .content p {
      margin-bottom: 0.5em;
    }
    .content * {
      word-wrap: break-word;
    }
    .card-image {
      text-align: center;
      img {
        max-width: 8rem;
      }
    }
    .icon {
      margin: 0 0.5rem;
    }
    nav .level {
      padding-bottom: 0;
    }
  }
}
.noResults {
  .query {
    text-decoration: underline;
  }
}
.hero-head img {
  height: 75px;
}
.carousel-item {
  min-width: 330px;
}
.error-message {
  margin: 10%;
}
.has-fixed-nav {
  padding-top: 3.25rem;
}
.media-posts-list {
  margin-bottom: 1em;
}
.filterMenu {
  .icon {
    margin: 0 0.5rem;
  }
}
.expand-enter-active,
.expand-leave-active {
  transition: height 0.25s ease-in-out;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>
