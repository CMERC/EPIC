<template>
  <div class="is-relative-mobile">
    <nav class="level">
      <div class="level-left">
      </div>
      <div class="level-right">
        <help-content reference="settings.apps"
                      toggle
                      dropdown />
      </div>
    </nav>

    <p class="subtitle is-6">Customize the active applications for this workspace. Deactivating an application will not remove data.</p>
    <div class="columns is-multiline apps">
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'plan'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'plan')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.plan"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'plan')">
                  <span class="is-size-7">Active</span>
                </b-switch>
              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/plan.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Plan</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('plan')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('plan')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'media'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'media')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.media"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'media')">
                  <span class="is-size-7">Active</span>
                </b-switch>
              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/media.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Media</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('media')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('media')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'notebook'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'notebook')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.notebook"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'notebook')">
                  <span class="is-size-7">Active</span>
                </b-switch>
              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/notebook.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Notebook</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('notebook')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('notebook')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'web'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'web')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.web"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'web')">
                  <span class="is-size-7">Active</span>
                </b-switch>

              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/web.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Web</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('web')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('web')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'observe'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'observe')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.observe"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'observe')">
                  <span class="is-size-7">Active</span>
                </b-switch>

              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/observe.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Observe</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('observe')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('observe')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'map'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'map')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.map"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'map')">
                  <span class="is-size-7">Active</span>
                </b-switch>

              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/map.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Map</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('map')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('map')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'chat'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'chat')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.chat"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'chat')">
                  <span class="is-size-7">Active</span>
                </b-switch>

              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/chat.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Chat</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('chat')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('chat')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'resources'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'resources')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.resources"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'resources')">
                  <span class="is-size-7">Active</span>
                </b-switch>

              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/resources.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Resources</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('resources')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('resources')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'learn'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'learn')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.learn"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'learn')">
                  <span class="is-size-7">Active</span>
                </b-switch>
              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/learn.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Learn</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('learn')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('learn')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'settings'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          :disabled="true"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'settings')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.settings"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'settings')">
                  <span class="is-size-7">Active</span>
                </b-switch>
              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/settings.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Settings</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('settings')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('settings')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'dev'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'dev')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.dev"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'dev')">
                  <span class="is-size-7">Active</span>
                </b-switch>
              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/dev.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Developer</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('dev')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('dev')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'email'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'email')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.email"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'email')">
                  <span class="is-size-7">Active</span>
                </b-switch>
              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/email.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Email</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('email')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('email')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="columns is-mobile">
          <div class="column is-2 px-1">
            <ApolloQuery :query="getAppListSettingReadQuery"
                         :variables="{where: {name: 'command'}}">
              <template slot-scope="{ result: { loading, error, data } }">
                <div v-if="loading"
                     class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error"
                     class="error apollo">
                  An error occurred
                </div>
                <b-switch v-else-if="data && data.appListSetting"
                          type="is-primary"
                          v-model="data.appListSetting.status"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="handleChange($event, 'command')">
                  <span class="is-size-7"
                        v-if="data">{{data.appListSetting.status == 'ACTIVE' ? 'Active': 'Inactive'}}</span>
                </b-switch>
                <b-switch v-else
                          type="is-primary"
                          v-model="status.command"
                          true-value="ACTIVE"
                          false-value="INACTIVE"
                          @input="addApp($event, 'command')">
                  <span class="is-size-7">Active</span>
                </b-switch>
              </template>
            </ApolloQuery>
          </div>
          <div class="column is-narrow px-1">
            <img src="@/shared/assets/command.svg">
          </div>
          <div class="column">
            <div class="content">
              <p class="has-text-weight-semibold has-text-dark mb-0">Command</p>
              <p class="has-text-dark is-size-7 mb-0">{{getAppDescription('command')}}</p>
              <p class="has-text-dark is-size-7 mb-0"><strong>Accessible by:</strong> {{getAppAccessNote('command')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  AppListSettingRead,
  AppListSettingsCreate,
  AppListSettingsUpdate
} from '@/shared/graphql/AppListSettings.gql'
export default {
  name: 'workspace-apps',
  components: { HelpContent },
  data() {
    return {
      status: {
        plan: 'ACTIVE',
        media: 'ACTIVE',
        notebook: 'ACTIVE',
        web: 'ACTIVE',
        observe: 'ACTIVE',
        map: 'ACTIVE',
        chat: 'ACTIVE',
        resources: 'ACTIVE',
        learn: 'ACTIVE',
        settings: 'ACTIVE',
        email: 'ACTIVE',
        command: 'ACTIVE',
        dev: 'ACTIVE'
      },
      getAppListSettingReadQuery: AppListSettingRead
    }
  },
  methods: {
    getAppDescription(name) {
      switch (name) {
        case 'plan':
          return 'Design, track, and assess training exercises.'
        case 'media':
          return 'Replicate an online media environment.'
        case 'notebook':
          return 'Knowledge sharing in a collaborative environment.'
        case 'web':
          return 'Portal for training audience to view published media content.'
        case 'observe':
          return 'Record and view observations in real-time.'
        case 'map':
          return 'Visualize your training exercise on an interactive 3D map.'
        case 'chat':
          return 'Communicate securely with messaging and group channels'
        case 'resources':
          return 'Allocate and track resources.'
        case 'learn':
          return 'Learn with interactive gameplay and test your skills.'
        case 'settings':
          return 'Manage users, workspace settings, data, and more.'
        case 'dev':
          return 'Test innovative prototypes to aid in development.'
        case 'email':
          return 'Protect conversations using a secure email service.'
        case 'command':
          return 'Manage all exercises and identify trends.'
      }
    },
    getAppAccessNote(name) {
      switch (name) {
        case 'plan':
        case 'media':
        case 'notebook':
        case 'observe':
        case 'map':
          return 'Admin, Editor'
        case 'web':
        case 'email':
        case 'chat':
        case 'settings':
          return 'All Roles'
        case 'dev':
        case 'resources':
        case 'command':
        case 'learn':
          return 'Super'
      }
    },
    addApp(state, appName) {
      this.$apollo
        .mutate({
          mutation: AppListSettingsCreate,
          variables: {
            data: {
              name: appName.toUpperCase(),
              status: state
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
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Update App: ' + error)
        })
    },
    handleChange(state, appName) {
      this.$apollo
        .mutate({
          mutation: AppListSettingsUpdate,
          variables: {
            data: {
              status: state
            },
            where: {
              name: appName.toUpperCase()
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
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Update App: ' + error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.apps {
  .column {
    img {
      height: 50px;
    }
    .switch {
      display: inline;
    }
  }
}
</style>
