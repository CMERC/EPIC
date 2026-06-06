<template>
  <div class="command-app">
    <loading-state :isFullPage="true"
                   :isLoading="$apollo.loading" />

    <aside class="command-sidebar">
      <div class="compose">
        <button class="button is-primary is-fullwidth"
                type="button"
                @click="openCompose">
          <span class="icon is-small">
            <i class="fas fa-plus"></i>
          </span>
          <span>New Command</span>
        </button>
      </div>

      <nav class="command-nav">
        <button v-for="item in scopes"
                :key="item.scope"
                class="command-nav-item"
                :class="{'is-active': selectedScope === item.scope}"
                type="button"
                @click="selectScope(item.scope)">
          <span class="icon is-small">
            <i :class="item.icon"></i>
          </span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="filters">
        <label class="label">Status</label>
        <div class="select is-fullwidth">
          <select v-model="selectedStatus">
            <option :value="null">Any status</option>
            <option v-for="status in statuses"
                    :key="status"
                    :value="status">{{ displayStatus(status) }}</option>
          </select>
        </div>

        <label class="label">Search</label>
        <input class="input"
               type="search"
               v-model.trim="searchText"
               placeholder="Title, recipient, inject">
      </div>
    </aside>

    <section class="command-list">
      <header class="command-toolbar">
        <div>
          <p class="overline">Command Traffic</p>
          <h1>{{ scopeTitle }}</h1>
        </div>
        <button class="button is-light"
                type="button"
                @click="$apollo.queries.commandMessages.refetch()">
          <span class="icon is-small">
            <i class="fas fa-sync"></i>
          </span>
        </button>
      </header>

      <div v-if="commandMessages && commandMessages.length > 0"
           class="message-list">
        <button v-for="message in commandMessages"
                :key="message.id"
                class="message-row"
                :class="{'is-active': selectedMessage && selectedMessage.id === message.id}"
                type="button"
                @click="selectMessage(message)">
          <span class="status-dot"
                :class="`status-${message.status.toLowerCase()}`"></span>
          <span class="message-row-main">
            <strong>{{ message.title }}</strong>
            <small>
              {{ displayPriority(message.priority) }} &middot; {{ displayStatus(message.status) }}
              <template v-if="message.planInjectNumber"> &middot; Inject #{{ message.planInjectNumber }}</template>
            </small>
          </span>
          <span class="message-row-time">{{ formatMessageDate(message) }}</span>
        </button>
      </div>

      <empty-state v-else
                   :data="commandMessages"
                   :isLoading="$apollo.loading" />
    </section>

    <section class="command-detail">
      <template v-if="selectedMessage">
        <header class="detail-header">
          <div>
            <p class="overline">{{ displayPriority(selectedMessage.priority) }}</p>
            <h2>{{ selectedMessage.title }}</h2>
            <span class="tag"
                  :class="statusTagClass(selectedMessage.status)">
              {{ displayStatus(selectedMessage.status) }}
            </span>
          </div>
          <b-dropdown position="is-bottom-left">
            <button class="button is-light"
                    slot="trigger"
                    type="button">
              <span class="icon is-small">
                <i class="fas fa-ellipsis-v"></i>
              </span>
            </button>
            <b-dropdown-item @click="editMessage(selectedMessage)">
              <span class="icon is-small">
                <i class="fas fa-pen"></i>
              </span>
              <span>Edit</span>
            </b-dropdown-item>
            <b-dropdown-item @click="deleteMessage(selectedMessage)"
                             class="has-text-danger">
              <span class="icon is-small">
                <i class="fas fa-trash"></i>
              </span>
              <span>Delete</span>
            </b-dropdown-item>
          </b-dropdown>
        </header>

        <div class="meta-grid">
          <div>
            <span>From</span>
            <strong>{{ selectedMessage.fromName || selectedMessage.fromEmail || 'Unknown' }}</strong>
          </div>
          <div>
            <span>To</span>
            <strong>{{ selectedMessage.recipientNames || selectedMessage.recipientEmails || 'Unassigned' }}</strong>
          </div>
          <div>
            <span>Due</span>
            <strong>{{ selectedMessage.dueAt ? formatDate(selectedMessage.dueAt, 'dtg') : 'No due time' }}</strong>
          </div>
          <div>
            <span>Linked Inject</span>
            <strong>{{ injectLabel(selectedMessage) }}</strong>
          </div>
        </div>

        <article class="command-body">
          <h3>Instruction</h3>
          <p>{{ selectedMessage.body }}</p>
        </article>

        <article class="command-body">
          <h3>Response</h3>
          <p v-if="selectedMessage.response">{{ selectedMessage.response }}</p>
          <p v-else class="muted">No response recorded.</p>
        </article>

        <div class="timeline">
          <span v-if="selectedMessage.sentAt">Sent {{ formatDate(selectedMessage.sentAt, 'dtg') }}</span>
          <span v-if="selectedMessage.acknowledgedAt">Acknowledged {{ formatDate(selectedMessage.acknowledgedAt, 'dtg') }}</span>
          <span v-if="selectedMessage.completedAt">Completed {{ formatDate(selectedMessage.completedAt, 'dtg') }}</span>
        </div>

        <footer class="detail-actions">
          <button class="button is-primary"
                  type="button"
                  :disabled="selectedMessage.status === 'ACKNOWLEDGED' || selectedMessage.status === 'COMPLETED'"
                  @click="acknowledgeMessage(selectedMessage)">
            Acknowledge
          </button>
          <button class="button is-success"
                  type="button"
                  :disabled="selectedMessage.status === 'COMPLETED'"
                  @click="openComplete(selectedMessage)">
            Complete
          </button>
          <button class="button"
                  type="button"
                  @click="setStatus(selectedMessage, 'IN_PROGRESS')">
            Mark In Progress
          </button>
          <button class="button is-danger is-outlined"
                  type="button"
                  @click="setStatus(selectedMessage, 'FAILED')">
            Mark Failed
          </button>
        </footer>
      </template>

      <div v-else
           class="empty-detail">
        <span class="icon">
          <i class="fas fa-terminal"></i>
        </span>
        <p>Select command traffic to inspect instructions, status, and responses.</p>
      </div>
    </section>

    <div class="modal"
         :class="{'is-active': composeOpen}">
      <div class="modal-background"
           @click="closeCompose"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ editingMessage ? 'Edit Command' : 'New Command' }}</p>
          <button class="delete"
                  type="button"
                  aria-label="close"
                  @click="closeCompose"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Title</label>
            <input class="input"
                   type="text"
                   v-model.trim="form.title">
          </div>
          <div class="field">
            <label class="label">Instruction</label>
            <textarea class="textarea"
                      rows="5"
                      v-model.trim="form.body"></textarea>
          </div>
          <div class="columns">
            <div class="column">
              <label class="label">Recipient Names</label>
              <input class="input"
                     type="text"
                     v-model.trim="form.recipientNames"
                     placeholder="Team Alpha, Evaluator 1">
            </div>
            <div class="column">
              <label class="label">Recipient Emails</label>
              <input class="input"
                     type="text"
                     v-model.trim="form.recipientEmails"
                     placeholder="operator@example.test">
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <label class="label">Priority</label>
              <div class="select is-fullwidth">
                <select v-model="form.priority">
                  <option v-for="priority in priorities"
                          :key="priority"
                          :value="priority">{{ displayPriority(priority) }}</option>
                </select>
              </div>
            </div>
            <div class="column">
              <label class="label">Status</label>
              <div class="select is-fullwidth">
                <select v-model="form.status">
                  <option v-for="status in composeStatuses"
                          :key="status"
                          :value="status">{{ displayStatus(status) }}</option>
                </select>
              </div>
            </div>
            <div class="column">
              <label class="label">Due Time</label>
              <input class="input"
                     type="datetime-local"
                     v-model="form.dueAtLocal">
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <label class="label">Plan Inject</label>
              <div class="select is-fullwidth">
                <select v-model="selectedInjectKey"
                        @change="applySelectedInject">
                  <option value="">No linked inject</option>
                  <option v-for="inject in planInjects"
                          :key="inject.id"
                          :value="inject.id">
                    #{{ inject.number }} - {{ inject.title }}
                  </option>
                </select>
              </div>
            </div>
            <div class="column">
              <label class="label">Inject Title Override</label>
              <input class="input"
                     type="text"
                     v-model.trim="form.planInjectTitle">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary"
                  type="button"
                  :disabled="!canSave"
                  @click="saveMessage">
            {{ editingMessage ? 'Save Command' : 'Send Command' }}
          </button>
          <button class="button"
                  type="button"
                  @click="closeCompose">Cancel</button>
        </footer>
      </div>
    </div>

    <div class="modal"
         :class="{'is-active': completeOpen}">
      <div class="modal-background"
           @click="completeOpen = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Complete Command</p>
          <button class="delete"
                  type="button"
                  aria-label="close"
                  @click="completeOpen = false"></button>
        </header>
        <section class="modal-card-body">
          <label class="label">Response</label>
          <textarea class="textarea"
                    rows="5"
                    v-model.trim="completionResponse"></textarea>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success"
                  type="button"
                  @click="completeMessage">Complete</button>
          <button class="button"
                  type="button"
                  @click="completeOpen = false">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CommandMessagesRead,
  CommandMessageCreate,
  CommandMessageUpdate,
  CommandMessageAcknowledge,
  CommandMessageComplete,
  CommandMessageDelete
} from '@/command/graphql/CommandMessages.gql'
import { PlanInjectsList } from '@/plan/graphql/PlanInjects.gql'

export default {
  name: 'command-home',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedScope: 'INBOX',
      selectedStatus: null,
      searchText: '',
      selectedMessage: null,
      composeOpen: false,
      completeOpen: false,
      completionResponse: '',
      completingMessage: null,
      editingMessage: null,
      selectedInjectKey: '',
      form: this.emptyForm(),
      scopes: [
        { scope: 'INBOX', label: 'Inbox', icon: 'fas fa-inbox' },
        { scope: 'OUTBOX', label: 'Sent', icon: 'fas fa-paper-plane' },
        { scope: 'ALL', label: 'All Traffic', icon: 'fas fa-stream' }
      ],
      statuses: ['DRAFT', 'SENT', 'ACKNOWLEDGED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED'],
      composeStatuses: ['DRAFT', 'SENT'],
      priorities: ['ROUTINE', 'PRIORITY', 'IMMEDIATE', 'FLASH']
    }
  },
  apollo: {
    commandMessages: {
      query: CommandMessagesRead,
      pollInterval: 15000,
      variables() {
        return {
          scope: this.selectedScope,
          status: this.selectedStatus,
          query: this.searchText,
          orderBy: 'createdAt_DESC',
          first: 100,
          skip: 0
        }
      },
      result({ data }) {
        if (data && data.commandMessages && data.commandMessages.length > 0) {
          if (this.id) {
            this.selectedMessage = data.commandMessages.find(message => message.id === this.id) || data.commandMessages[0]
          } else if (!this.selectedMessage || !data.commandMessages.some(message => message.id === this.selectedMessage.id)) {
            this.selectedMessage = data.commandMessages[0]
          }
        } else {
          this.selectedMessage = null
        }
      }
    },
    planInjects: {
      query: PlanInjectsList,
      variables() {
        return {
          where: { deletedAt: null },
          orderBy: 'number_DESC',
          first: 100
        }
      },
      error(error) {
        console.error(error)
      }
    }
  },
  computed: {
    scopeTitle() {
      const active = this.scopes.find(scope => scope.scope === this.selectedScope)
      return active ? active.label : 'Command'
    },
    canSave() {
      return this.form.title && this.form.body && (this.form.recipientNames || this.form.recipientEmails)
    }
  },
  methods: {
    emptyForm() {
      return {
        title: '',
        body: '',
        recipientNames: '',
        recipientEmails: '',
        priority: 'ROUTINE',
        status: 'SENT',
        dueAtLocal: '',
        planInjectId: '',
        planInjectNumber: null,
        planInjectTitle: ''
      }
    },
    selectScope(scope) {
      this.selectedScope = scope
      this.selectedMessage = null
      this.$router.push({ name: 'command-home' })
    },
    selectMessage(message) {
      this.selectedMessage = message
      this.$router.push({ name: 'command-message', params: { id: message.id } })
    },
    openCompose() {
      this.editingMessage = null
      this.selectedInjectKey = ''
      this.form = this.emptyForm()
      this.composeOpen = true
    },
    closeCompose() {
      this.composeOpen = false
      this.editingMessage = null
      this.selectedInjectKey = ''
      this.form = this.emptyForm()
    },
    editMessage(message) {
      this.editingMessage = message
      this.selectedInjectKey = message.planInjectId || ''
      this.form = {
        title: message.title || '',
        body: message.body || '',
        recipientNames: message.recipientNames || '',
        recipientEmails: message.recipientEmails || '',
        priority: message.priority || 'ROUTINE',
        status: message.status === 'DRAFT' ? 'DRAFT' : 'SENT',
        dueAtLocal: message.dueAt ? this.moment(message.dueAt).format('YYYY-MM-DDTHH:mm') : '',
        planInjectId: message.planInjectId || '',
        planInjectNumber: message.planInjectNumber || null,
        planInjectTitle: message.planInjectTitle || ''
      }
      this.composeOpen = true
    },
    applySelectedInject() {
      const inject = (this.planInjects || []).find(item => item.id === this.selectedInjectKey)
      if (!inject) {
        this.form.planInjectId = ''
        this.form.planInjectNumber = null
        this.form.planInjectTitle = ''
        return
      }
      this.form.planInjectId = inject.id
      this.form.planInjectNumber = inject.number
      this.form.planInjectTitle = inject.title
    },
    savePayload() {
      return {
        title: this.form.title,
        body: this.form.body,
        recipientNames: this.form.recipientNames,
        recipientEmails: this.form.recipientEmails,
        priority: this.form.priority,
        status: this.form.status,
        dueAt: this.form.dueAtLocal ? this.moment(this.form.dueAtLocal).toISOString() : null,
        planInjectId: this.form.planInjectId,
        planInjectNumber: this.form.planInjectNumber ? Number(this.form.planInjectNumber) : null,
        planInjectTitle: this.form.planInjectTitle
      }
    },
    saveMessage() {
      const mutation = this.editingMessage ? CommandMessageUpdate : CommandMessageCreate
      const variables = this.editingMessage
        ? { data: this.savePayload(), where: { id: this.editingMessage.id } }
        : { data: this.savePayload() }

      this.$apollo.mutate({ mutation, variables }).then(({ data }) => {
        const message = data.createCommandMessage || data.updateCommandMessage
        this.selectedMessage = message
        this.closeCompose()
        this.$apollo.queries.commandMessages.refetch()
        this.$buefy.toast.open({ message: 'Command saved', type: 'is-success' })
      }).catch(error => {
        this.$buefy.toast.open({ message: error.message, type: 'is-danger' })
      })
    },
    acknowledgeMessage(message) {
      this.$apollo.mutate({
        mutation: CommandMessageAcknowledge,
        variables: { where: { id: message.id } }
      }).then(({ data }) => {
        this.selectedMessage = data.acknowledgeCommandMessage
        this.$apollo.queries.commandMessages.refetch()
      })
    },
    openComplete(message) {
      this.completingMessage = message
      this.completionResponse = message.response || ''
      this.completeOpen = true
    },
    completeMessage() {
      this.$apollo.mutate({
        mutation: CommandMessageComplete,
        variables: {
          where: { id: this.completingMessage.id },
          data: {
            response: this.completionResponse,
            status: 'COMPLETED'
          }
        }
      }).then(({ data }) => {
        this.selectedMessage = data.completeCommandMessage
        this.completeOpen = false
        this.$apollo.queries.commandMessages.refetch()
      })
    },
    setStatus(message, status) {
      this.$apollo.mutate({
        mutation: CommandMessageUpdate,
        variables: {
          where: { id: message.id },
          data: { status }
        }
      }).then(({ data }) => {
        this.selectedMessage = data.updateCommandMessage
        this.$apollo.queries.commandMessages.refetch()
      })
    },
    deleteMessage(message) {
      this.$buefy.dialog.confirm({
        title: 'Delete Command',
        message: 'Delete this command traffic record?',
        type: 'is-danger',
        onConfirm: () => {
          this.$apollo.mutate({
            mutation: CommandMessageDelete,
            variables: { where: { id: message.id } }
          }).then(() => {
            this.selectedMessage = null
            this.$router.push({ name: 'command-home' })
            this.$apollo.queries.commandMessages.refetch()
          })
        }
      })
    },
    displayStatus(status) {
      return String(status || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
    },
    displayPriority(priority) {
      return this.displayStatus(priority)
    },
    statusTagClass(status) {
      return {
        'is-light': status === 'DRAFT',
        'is-info': status === 'SENT',
        'is-link': status === 'ACKNOWLEDGED' || status === 'IN_PROGRESS',
        'is-success': status === 'COMPLETED',
        'is-danger': status === 'FAILED',
        'is-warning': status === 'CANCELLED'
      }
    },
    formatMessageDate(message) {
      const date = message.sentAt || message.createdAt
      return date ? this.formatDate(date, 'shortDate') : ''
    },
    injectLabel(message) {
      if (message.planInjectNumber && message.planInjectTitle) {
        return `#${message.planInjectNumber} - ${message.planInjectTitle}`
      }
      return message.planInjectTitle || 'No linked inject'
    }
  }
}
</script>

<style lang="scss" scoped>
.command-app {
  display: grid;
  grid-template-columns: 260px minmax(320px, 420px) 1fr;
  min-height: calc(100vh - 53px);
  background: #f6f8fb;
  color: #1f2933;
}

.command-sidebar,
.command-list,
.command-detail {
  min-height: calc(100vh - 53px);
}

.command-sidebar {
  background: #263746;
  color: #fff;
  padding: 1rem;
}

.compose {
  margin-bottom: 1rem;
}

.command-nav {
  display: grid;
  gap: 0.25rem;
}

.command-nav-item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: #d7dee7;
  cursor: pointer;
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  text-align: left;
  width: 100%;
}

.command-nav-item.is-active,
.command-nav-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.filters {
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  margin-top: 1rem;
  padding-top: 1rem;
}

.filters .label {
  color: #f7fafc;
  margin-top: 0.75rem;
}

.command-list {
  background: #fff;
  border-right: 1px solid #d9e2ec;
  overflow-y: auto;
}

.command-toolbar,
.detail-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

.overline {
  color: #627d98;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: 0.15rem;
  text-transform: uppercase;
}

.command-toolbar h1,
.detail-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.message-list {
  border-top: 1px solid #edf2f7;
}

.message-row {
  align-items: center;
  background: #fff;
  border: 0;
  border-bottom: 1px solid #edf2f7;
  cursor: pointer;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 10px 1fr auto;
  min-height: 72px;
  padding: 0.75rem 1rem;
  text-align: left;
  transition: background-color 140ms ease, box-shadow 140ms ease;
  width: 100%;
}

.message-row.is-active,
.message-row:hover {
  background: #eef6ff;
}

.message-row-main {
  display: grid;
  gap: 0.2rem;
}

.message-row-main small,
.message-row-time,
.muted,
.timeline {
  color: #627d98;
}

.status-dot {
  border-radius: 50%;
  display: block;
  height: 10px;
  width: 10px;
}

.status-draft { background: #9aa5b1; }
.status-sent { background: #2f80ed; }
.status-acknowledged,
.status-in_progress { background: #7c3aed; }
.status-completed { background: #219653; }
.status-failed { background: #d64545; }
.status-cancelled { background: #f2c94c; }

.command-detail {
  overflow-y: auto;
  padding: 1rem;
}

.detail-header {
  padding: 0 0 1rem;
}

.meta-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 1rem;
}

.meta-grid div,
.command-body {
  background: #fff;
  border: 1px solid #d9e2ec;
  border-radius: 8px;
  padding: 1rem;
}

.meta-grid span {
  color: #627d98;
  display: block;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.command-body {
  margin-bottom: 1rem;
}

.command-body h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.timeline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.empty-detail {
  align-items: center;
  color: #627d98;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  justify-content: center;
  text-align: center;
}

.empty-detail .icon {
  font-size: 2rem;
}

@media screen and (max-width: 1023px) {
  .command-app {
    grid-template-columns: 1fr;
  }

  .command-sidebar,
  .command-list,
  .command-detail {
    min-height: auto;
  }

  .command-sidebar {
    position: relative;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
