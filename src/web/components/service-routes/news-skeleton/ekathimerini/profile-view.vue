<template>
  <section class="section">
    <div class="container">
      <div class="columns is-mobile">
        <div class="column is-10 is-offset-1">
          <div class="box">
            <div v-if="checkContent">
              <div class="columns is-mobile is-multiline">
                <div class="column is-6-desktop is-6-tablet is-12-mobile"
                     v-if="allData.serviceContent[ranNum]">
                  <a @click="showContent(allData.serviceContent[ranNum])">
                    <div class="card panel">
                      <div class="card-image"
                           v-if="allData.serviceContent[ranNum].mediaFile && allData.serviceContent[ranNum].mediaFile.url">
                        <div>
                          <figure class="image is-4by3">
                            <img v-bind:src="allData.serviceContent[ranNum].mediaFile.url.small"
                                 alt="Placeholder image">
                          </figure>
                        </div>
                      </div>
                      <div v-else
                           class="card-image">
                        <figure class="image is-4by3">
                        </figure>
                      </div>
                      <div class="card-content">
                        <div class="media">
                          <div class="media-content">
                            <p class="title is-4">{{allData.serviceContent[ranNum].title}}</p>
                          </div>
                        </div>
                        <div class="content">
                          <p class="subtitle is-6"
                             v-html="truncate(allData.serviceContent[ranNum].text, 250)"></p>
                        </div>
                        <nav class="level is-mobile">
                          <div class="level-left">
                            <a class="level-item">
                              <span class="subtitle is-7 tooltip"
                                    :data-tooltip="formatDate(allData.serviceContent[ranNum].createTime)">{{formatDate(allData.serviceContent[ranNum].createTime, 'fromNow')}}</span>
                            </a>
                            <a class="level-item">
                              <span>{{allData.serviceContent[ranNum].counts ? allData.serviceContent[ranNum].counts.likes : ''}} Like<span>{{allData.serviceContent[ranNum].counts && allData.serviceContent[ranNum].counts.likes ? 's' : ''}}</span></span>
                            </a>
                            <a class="level-item">
                              <span>Reply</span>
                            </a>
                          </div>
                        </nav>
                      </div>
                    </div>
                  </a>
                </div>
                <div class="column is-3-desktop is-3-tablet is-12-mobile"
                     v-if="allData.serviceContent[ranNum1]">
                  <div class="card panel is-marginless">
                    <header class="card-header">
                      <p class="card-header-title editor-pick">
                        EDITOR'S PICK
                      </p>
                    </header>
                  </div>

                  <a @click="showContent(allData.serviceContent[ranNum1])">
                    <div class="card panel">
                      <div class="card-image"
                           v-if="allData.serviceContent[ranNum1].mediaFile && allData.serviceContent[ranNum1].mediaFile.url">
                        <div>
                          <figure class="image is-4by3">
                            <img v-bind:src="allData.serviceContent[ranNum1].mediaFile.url.small"
                                 alt="Placeholder image">
                          </figure>
                        </div>
                      </div>
                      <div class="card-content">
                        <div class="media">
                          <div class="media-content">
                            <p class="title is-size-6">{{allData.serviceContent[ranNum1].title}}</p>

                          </div>
                        </div>
                        <div class="content">
                          <p class="is-size-7"
                             v-html="truncate(allData.serviceContent[ranNum1].text, 60)"></p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div class="column is-3-desktop is-3-tablet is-12-mobile">
                  <div class="card panel is-marginless">
                    <header class="card-header">
                      <p class="card-header-title comments">
                        COMMENT
                      </p>
                    </header>
                  </div>
                  <div class="card panel">
                    <aside class="menu">
                      <ul class="menu-list"
                          v-for="link in commentLinks"
                          v-bind:key="link.id">
                        <li class="list-section">
                          <a class="is-size-7 has-text-black is-italic">{{link.label}}</a>
                        </li>
                      </ul>
                    </aside>
                  </div>
                </div>
              </div>
              <div class="columns is-mobile">
                <div class="column is-9-desktop is-9-tablet is-12-mobile">
                  <div class="columns is-mobile is-multiline">
                    <div class="column is-12 is-paddingless"
                         v-for="post in allData.serviceContent"
                         v-bind:key="post.id">
                      <a @click="showContent(post)">
                        <div class="card panel">
                          <div class="card-content">
                            <div class="media">
                              <div class="media-left"
                                   v-if="post.mediaFile && post.mediaFile.url">
                                <div v-if='post.mediaFile.contentType.includes("image")||post.mediaFile.contentType.includes("Image")'>
                                  <figure class="image is-128x128">
                                    <img v-bind:src="post.mediaFile.url.small"
                                         alt="Post Image">
                                  </figure>
                                </div>
                                <div v-if='post.mediaFile.contentType.includes("video")'>
                                  <video class="post-media"
                                         v-bind:src="post.mediaFile.url.regular"
                                         controls
                                         controlsList="nodownload"></video>
                                </div>
                              </div>
                              <div v-else
                                   class="media-left">
                                <figure class="image is-128x128">
                                </figure>
                              </div>
                              <div class="content media-content">
                                <p class="title is-5">{{post.title}}</p>
                                <p class="subtitle is-6"
                                   v-html="truncate(processPost(post.text, post.profiles[0].service), 250)"></p>
                              </div>
                            </div>
                          </div>
                          <div class="card-content">
                            <nav class="level is-mobile">
                              <div class="level-left">
                                <a class="level-item">
                                  <span class="subtitle is-7 tooltip"
                                        :data-tooltip="formatDate(post.createTime)">{{formatDate(post.createTime, 'fromNow')}}</span>
                                </a>
                                <a class="level-item">
                                  <span>{{post.counts ? post.counts.likes : ''}} Like<span>{{post.counts && post.counts.likes ? 's' : ''}}</span></span>
                                </a>
                                <a class="level-item">
                                  <span>{{post.comments ? post.comments.length : 0}} Comments<span>{{post.comments && post.comments.length > 0 ? 's' : ''}}</span></span>
                                </a>
                                <a class="level-item">
                                  <span>Reply</span>
                                </a>
                              </div>
                            </nav>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns is-mobile is-multiline">
                <div class="column is-9-desktop is-9-tablet is-12-mobile">
                  <div class="card panel is-marginless">
                    <header class="card-header">
                      <p class="card-header-title whats-on">
                        WHAT'S ON
                      </p>
                    </header>
                  </div>
                  <div class="card">
                    <div class="card-content">
                      <div class="card-header-title is-centered">
                        <i class="fas fa-user-lock fa-3x has-text-primary"></i>
                      </div>
                      <p class="title has-text-centered">
                        Register To See More Content
                      </p>
                    </div>
                  </div>
                </div>
                <div class="column is-3-desktop is-3tablet is-12-mobile">
                  <div class="card panel is-marginless">
                    <header class="card-header">
                      <p class="card-header-title cartoon">
                        CARTOONS
                      </p>
                    </header>
                  </div>
                  <div class="card">
                    <div class="card-content">
                      <div class="card-header-title is-centered">
                        <i class="fas fa-user-lock fa-2x has-text-primary"></i>
                      </div>
                      <p class="title is-size-5 has-text-centered">
                        Register To See More Content
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="card">
                <div class="card-content">
                  <div class="card-header-title is-centered">
                    <i class="fas fa-search fa-3x has-text-primary"></i>
                  </div>
                  <p class="title has-text-centered">
                    No Posts Yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="section">
        <div class="columns is-mobile">
          <div class="column is-12 is-offset-2-widescreen is-offset-1-desktop">
            <div class="content has-text-centered">
              <table class="table">
                <tbody>
                  <tr>
                    <td align="center"
                        class="is-size-7">
                      <a>
                        About us
                      </a> &nbsp;|&nbsp;
                      <a>
                        Subscriptions
                      </a> &nbsp;|&nbsp;
                      <a>
                        Advertising
                      </a> &nbsp;|&nbsp;
                      <a>
                        Contact us
                      </a> &nbsp;|&nbsp;
                      <a>
                        Site Map
                      </a> &nbsp;|&nbsp;
                      <a>
                        Terms of use
                      </a> &nbsp;|&nbsp;
                      <a>
                        Partner Content
                      </a> &nbsp;|&nbsp;
                      <a>
                        Greece is
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
<script>
import processText from '@/shared/mixins/processText'
import helpers from '@/shared/mixins/helpers'
export default {
  name: 'ekathimeriniprofile',
  mixins: [helpers, processText],
  props: {
    allData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      scrollPosition: 0,
      ranNum: null,
      ranNum1: null,
      commentLinks: [
        { id: 1, value: 'comment1', label: 'Greece is on the energy map.' },
        { id: 2, value: 'comment2', label: 'Tax limit has been reached' },
        { id: 3, value: 'comment3', label: 'A bizarre political landscape' },
        { id: 4, value: 'comment4', label: 'The right business mix' },
        { id: 5, value: 'comment5', label: 'What is missing?' },
        {
          id: 6,
          value: 'comment6',
          label: 'Promises to a disenchanted society'
        },
        { id: 7, value: 'comment7', label: 'The appointment in Thessaloniki' },
        { id: 8, value: 'comment8', label: 'Where did it go wrong?' }
      ],
      footerLinks: [
        { id: 1, value: 'aboutus', label: 'About Us' },
        { id: 2, value: 'subs', label: 'Subscriptions' },
        { id: 3, value: 'advertise', label: 'Advertising' },
        { id: 4, value: 'contactus', label: 'Contact Us' },
        { id: 5, value: 'sitemap', label: 'Site Map' },
        { id: 6, value: 'terms', label: 'Terms of Use' },
        { id: 7, value: 'partnercontent', label: 'Partner Content' },
        { id: 8, value: 'greeceis', label: 'Greece is' }
      ]
    }
  },
  methods: {
    showContent(post) {
      let service = this.$router.currentRoute.params.service
      let username = this.$router.currentRoute.params.username
      let workspace = this.$router.currentRoute.params.workspace
      this.$router.push({
        path: `/web/${workspace}/${service}/${username}/${post.id}`
      })
    },
    setRandoms() {
      let maxNum = this.allData.serviceContentLength - 1
      let minStat = 1
      if (maxNum === 0) {
        this.ranNum = maxNum
        this.ranNum1 = maxNum
      } else {
        this.ranNum = this.randomMediaStatNumber(minStat, maxNum)
        this.ranNum1 = this.randomMediaStatNumber(minStat, maxNum)
      }
    }
  },
  computed: {
    checkUser() {
      return this.isCurrentUser(
        this.allData.currentUser.username,
        this.$router.currentRoute.params.username
      )
    },
    checkContent() {
      let theContent =
        this.allData.serviceContent && this.allData.serviceContentLength > 0
      if (theContent) {
        this.setRandoms()
      }

      return theContent
    }
  }
}
</script>
<!-- use to style content outside component -->

<style lang="scss" scoped>
@import 'card-theme.scss';
</style>
