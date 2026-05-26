<template>
  <div class="container">
    <div class="columns">
      <div class="column is-three-quarters">
        <div class="level is-size-3 has-text-centered">
          <b>Bot List</b>
        </div>
        <section class="section">
          <input class="input"
                 type="text"
                 placeholder="Search..."
                 v-model.lazy="searchQuery">
        </section>
        <div class="level "
             v-for="(bot, index) in noiseBots"
             v-bind:key="bot.id">
          <div class="columns ">
            <div :class="getBackgroundClass(index)">
              <label>
                <b>Name</b>
              </label>
              <input @change="changeProfile(index)"
                     class="input"
                     type="text"
                     v-model="noiseBots[index].name">
            </div>
            <div :class="getBackgroundClass(index)">
              <label>
                <b>Username</b>
              </label>
              <p class="control has-icons-left">
                <input @change="changeProfile(index)"
                       class="input"
                       type="text"
                       v-model="noiseBots[index].username">
                <span class="icon is-small is-left">
                  <i class="fas fa-at"></i>
                </span>
              </p>
            </div>
            <div :class="getBackgroundClass(index)">
              <label>
                <b>Language</b>
              </label><br>
              <div class="columns">
                <div class="column">
                  <div class="select">
                    <select v-model="noiseBots[index].language"
                            @change="changeProfile(index)">
                      <option>{{noiseBots[index].language}}</option>
                      <option v-for="(lang) in langNames"
                              v-bind:key="lang">
                        {{lang}}
                      </option>
                    </select>
                  </div>
                </div>

              </div>
            </div>
            <div :class="getBackgroundClass(index)">
              <div class="columns">
                <div class="column">
                  <label>
                    <b>Service</b>
                  </label><br>
                  <p>{{noiseBots[index].service.name}}</p>
                </div>
                <div class="column">
                  <button v-on:click="confirmDelete(index)"
                          class="delete is-medium"></button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class=" level is-size-3 has-text-centered">
          <b>Bot (Markov) Sources</b>
        </div>
        <div class="file has-name">
          <label class="file-label">
            <input class="file-input"
                   type="file"
                   name="resume"
                   @change="fileUpload">
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload"></i>
              </span>
              <span class="file-label">
                Choose a file…
              </span>
            </span>
            <span class="file-name">
              {{fileName}}
            </span>
          </label>
        </div>
        <div class="level"
             v-for="(source, index) in allSources"
             v-bind:key="source.key">
          <p>{{source.key}}</p>
          <button v-on:click="deleteSource(source.key, index)"
                  class="delete is-medium"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MediaProfilesRead,
  MediaProfilesUpdate,
  MediaProfilesDelete
} from '../graphql/MediaProfiles.gql'
import {
  CreateMediaMarkovSource,
  MediaMarkovSource,
  DeleteMediaMarkovSource
} from '../graphql/noiseProfiles.gql'
import { languages } from '../model/languages.js'

export default {
  name: 'noiseoptions',
  apollo: {
    allNoiseBots: {
      query: MediaProfilesRead,
      variables() {
        return {
          where: {
            isUserGenerated: false,
            OR: [
              { name_contains: this.searchQuery },
              { username_contains: this.searchQuery },
              { description_contains: this.searchQuery },
              { language_contains: this.searchQuery },
              { service: { name: this.searchQuery } }
            ]
          },
          first: 20
        }
      },
      update(data) {
        this.initialBots(data.mediaProfiles)
        return data.mediaProfiles
      }
    },
    allMarkovSources: {
      query: MediaMarkovSource,
      variables: {},
      update(data) {
        this.initialSources(data.mediaMarkovSources)
        return data.mediaMarkovSources
      }
    }
  },
  data() {
    return {
      searchQuery: '',
      noiseBots: {},
      allSources: {},
      languageOpts: languages,
      langNames: [],
      fileName: ''
    }
  },
  methods: {
    initialBots(bots) {
      this.noiseBots = JSON.parse(JSON.stringify(bots))
      // make a copy to overwrite obj
      this.languageOpts = languages
      this.langNames = Object.keys(this.languageOpts)
    },
    initialSources(sources) {
      this.allSources = JSON.parse(JSON.stringify(sources))
    },
    fileUpload(event) {
      let reader = new FileReader()
      let extension = event.target.files[0].name.split('.').pop()
      reader.onload = () => {
        if (extension != 'txt' && extension != 'csv') {
          this.$buefy.toast.open({
            message: 'Invalid File Type',
            type: 'is-danger'
          })
        } else {
          this.createSource(reader.result)
        }
      }
      this.fileName = event.target.files[0].name
      reader.readAsText(event.target.files[0])
    },
    getBackgroundClass(index) {
      if (index % 2 === 0) {
        return 'column has-background-white-ter'
      } else {
        return 'column has-background-grey-lighter'
      }
    },
    confirmDelete(index) {
      this.$buefy.dialog.confirm({
        title: 'Delete Profile',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.deleteBot(index)
      })
    },
    changeProfile(index) {
      this.$apollo
        .mutate({
          mutation: MediaProfilesUpdate,
          variables: {
            data: {
              name: this.noiseBots[index].name,
              username: this.noiseBots[index].username,
              language: this.languageOpts[this.noiseBots[index].language]
            },
            where: {
              id: this.noiseBots[index].id
            }
          }
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'could not save changes to bot profile',
            type: 'is-danger'
          })
          console.error('failed bot profile change: ' + error)
        })
    },
    deleteBot(index) {
      this.$apollo
        .mutate({
          mutation: MediaProfilesDelete,
          variables: {
            id: {
              id: this.noiseBots[index].id
            }
          }
        })
        .then(() => {
          this.noiseBots.splice(index, 1)
          this.$buefy.toast.open({
            message: 'deleted bot profile',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'could not delete bot profile',
            type: 'is-danger'
          })
          console.error('failed bot profile deletion: ' + error)
        })
    },
    createSource(sourceText) {
      this.$apollo
        .mutate({
          mutation: CreateMediaMarkovSource,
          variables: {
            data: {
              key: this.fileName,
              sourceText: sourceText,
              attributes: {
                connect: {
                  name: 'noiselevel'
                }
              }
            }
          }
        })
        .then(data => {
          this.allSources.push(data.data.createMediaMarkovSource)
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'could not Create Markov Source',
            type: 'is-danger'
          })
          console.error('failed Markov source creation: ' + error)
        })
    },
    deleteSource(key, index) {
      this.$apollo
        .mutate({
          mutation: DeleteMediaMarkovSource,
          variables: {
            where: {
              key: key
            }
          }
        })
        .then(() => {
          this.allSources.splice(index, 1)
          this.$buefy.toast.open({
            message: 'deleted Markov source',
            type: 'is-success'
          })
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'could not delete Markov Source',
            type: 'is-danger'
          })
          console.error('failed Markov source deletion: ' + error)
        })
    }
  }
}
</script>
