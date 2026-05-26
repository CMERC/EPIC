<template>
  <div class="container is-fluid">
    <div class="modal"
         :class="{'is-active': open}">
      <div class="modal-background"
           @click="close()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Time Zone</p>
          <button class="delete"
                  aria-label="close"
                  @click="close()"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <div class="control"
                 v-if="timezones">
              <multiselect v-model="selectedTimezone"
                           name="timezone"
                           :optionHeight="25"
                           track-by="name"
                           :options="timezones"
                           label="displayName"
                           placeholder="Select timezone">
                <template slot="option"
                          slot-scope="{ option }">
                  ({{option.abbr}} {{option.displayOffset}}) {{ option.displayName }}
                </template>
                <template slot="singleLabel"
                          slot-scope="{ option }">
                  ({{option.abbr}} {{option.displayOffset}}) {{ option.displayName }}
                </template>
              </multiselect>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-primary"
             @click="save()">
            Save
          </a>
          <a class="button is-danger is-outlined"
             @click="confirmClear()"
             v-if="timezone != ''">
            Reset to Local Time
          </a>
          <a class="button"
             @click="close()">
            Cancel
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { AppWorkspaceUpdate } from '@/shared/graphql/AppWorkspaces.gql'

export default {
  name: 'timezone-interaction',
  props: {
    timezone: {
      type: String
    },
    open: {
      default: false
    }
  },
  data() {
    return {
      selectedTimezone: null,
      timezones: this.getTimeZones()
    }
  },
  methods: {
    confirmClear() {
      this.$buefy.dialog.confirm({
        title: 'Reset to Default',
        message: 'Are you sure you want to do this?',
        type: 'is-danger',
        onConfirm: () => this.save('clear')
      })
    },
    getTimeZones() {
      let names = this.momentTimezone.tz
        .names()
        .reduce((zoneObj, zone) => {
          zoneObj.push({
            name: zone,
            displayName: zone.replace(/(_)/g, ' '),
            offset: parseFloat(this.momentTimezone.tz(zone).format('Z')),
            displayOffset: this.momentTimezone.tz(zone).format('Z'),
            abbr: this.momentTimezone.tz(zone).format('z')
          })
          return zoneObj
        }, [])
        .sort((a, b) => {
          return a.offset - b.offset
        })

      return names
    },
    close() {
      this.$emit('close')
      this.selectedTimezone = null
    },
    save(clear) {
      let data
      if (clear) {
        data = {
          timeZone: ''
        }
      } else {
        data = {
          timeZone: this.selectedTimezone.name ? this.selectedTimezone.name : ''
        }
      }

      this.$apollo
        .mutate({
          mutation: AppWorkspaceUpdate,
          variables: {
            data: data,
            where: {
              name: this.$store.state.activeWorkspace.name
            }
          }
        })
        .then(response => {
          if (response && response.data && response.data.updateAppWorkspace) {
            this.$buefy.toast.open({
              message: 'Timezone updated',
              type: 'is-success'
            })
            if (clear) {
              this.$store.commit('clearTimeZone')
            }
            this.close()
          }
        })
    }
  },
  watch: {
    timezone() {
      if (this.timezone) {
        this.selectedTimezone = {
          name: this.timezone,
          displayName: this.timezone.replace(/(_)/g, ' '),
          offset: this.momentTimezone.tz(this.timezone).format('Z'),
          displayOffset: this.momentTimezone.tz(this.timezone).format('Z'),
          abbr: this.momentTimezone.tz(this.timezone).format('z')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-card,
.modal-card-body {
  overflow: visible !important;
}
</style>
