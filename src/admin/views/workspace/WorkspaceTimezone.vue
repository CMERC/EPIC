<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <a class="button is-primary"
             @click="openTimeZone()"
             v-if="isSuperAdmin">
            Set Time Zone
          </a></div>
      </div>
      <div class="level-right">
        <help-content reference="settings.timezone"
                      toggle
                      dropdown />
      </div>
    </nav>
    <div class="is-relative">
      <loading-state :isLoading='$apollo.loading' />
      <div class="card">
        <div class="card-content">
          <div class="field"
               v-if="appWorkspacePublic">
            <label class="label">
              Workspace Time Zone:
            </label>
            <span v-if="appWorkspacePublic && !appWorkspacePublic.timeZone"
                  class="help">No Time Zone Set - Displays Your Local Time Zone</span>
            <div class="control">
              <p class="subtitle is-6"
                 v-if="appWorkspacePublic && appWorkspacePublic.timeZone">{{appWorkspacePublic.timeZone.replace(/(_)/g, ' ')}} ({{momentTimezone
                   .tz(appWorkspacePublic.timeZone)
                   .format('Z')}})</p>
              <p class="subtitle is-6"
                 v-else>{{guess ? guess.displayName:''}} {{guess ? '('+guess.offset+')' : ''}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <timezone-interaction :open="openDialog"
                          :timezone="selectedTimezone"
                          @close="closeDialog" />
  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import TimezoneInteraction from '@/admin/components/timeZone-interaction'
import Permissions from '@/shared/mixins/permissions'
import { AppWorkspacePublicRead } from '@/shared/graphql/AppWorkspaces.gql'

export default {
  name: 'workspace-timezone',
  components: { TimezoneInteraction, HelpContent },
  mixins: [Permissions],
  apollo: {
    appWorkspacePublic: {
      query: AppWorkspacePublicRead,
      variables() {
        return {
          where: {
            name: this.$store.state.activeWorkspace.name
          }
        }
      }
    }
  },
  data() {
    return {
      guess: this.getGuessZone(),
      openDialog: false,
      selectedTimezone: '',
      appWorkspacePublic: null
    }
  },
  methods: {
    getGuessZone() {
      let guess = {
        name: this.momentTimezone.tz.guess(true),
        displayName: this.momentTimezone.tz.guess(true).replace(/(_)/g, ' '),
        offset: this.momentTimezone
          .tz(this.momentTimezone.tz.guess(true))
          .format('Z')
      }
      return guess
    },
    getZoneOffset() {
      let zoneOffset
      if (this.appWorkspacePublic && this.appWorkspacePublic.timeZone != '') {
        zoneOffset = this.momentTimezone
          .tz(this.appWorkspacePublic.timeZone)
          .format('Z')
      }

      return zoneOffset
    },
    closeDialog() {
      this.openDialog = !this.openDialog
      this.$apollo.queries.appWorkspacePublic.refetch()
      this.selectedTimezone = ''
    },
    openTimeZone() {
      if (
        this.appWorkspacePublic &&
        this.appWorkspacePublic.timeZone !== null
      ) {
        this.selectedTimezone = this.appWorkspacePublic.timeZone
      } else {
        this.selectedTimezone = this.guess.name
      }
      this.openDialog = !this.openDialog
    }
  }
}
</script>
