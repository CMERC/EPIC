<template>
  <div class="is-relative-mobile">
    <loading-state :isFullPage='true'
                   :isLoading='$apollo.loading' />
    <div id="mail-app"
         class="columns">
      <aside class="column is-narrow aside">
        <div>
          <div class="compose has-text-centered">
            <a class="button is-primary is-block is-bold"
               @click="showModal = true">
              <span class="compose">Compose</span>
            </a>
          </div>
          <div class="main">
            <a class="item"
               :class="{'is-active': selectedFolder === 'INBOX'}"
               @click="selectFolder('INBOX')">
              <span class=" icon"><i class="fas fa-inbox"></i></span><span class="name">Inbox</span>
            </a>
            <a class="item"
               :class="{'is-active': selectedFolder === 'SENT'}"
               @click="selectFolder('SENT')">
              <span class="icon"><i class="fas fa-envelope-open"></i></span><span class="name">Sent Mail</span>
            </a>
            <a class="item"
               :class="{'is-active': !selectedFolder}"
               @click="selectFolder(null)">
              <span class="icon"><i class="fas fa-folder-open"></i></span><span class="name">All</span>
            </a>
          </div>
        </div>
      </aside>
      <div id="message-feed"
           class="column messages">
        <div class="action-buttons">
          <div class="control is-grouped">
            <a class="button is-small">
              <i class="fas fa-sync"></i>
            </a>
            <a class="button is-small">
              <i class="fas fa-inbox"></i>
            </a>
            <a class="button is-small">
              <i class="fas fa-trash"></i>
            </a>
          </div>
          <div class="control is-grouped">
            <a class="button is-small">
              <i class="fas fa-folder"></i>
            </a>
            <a class="button is-small">
              <i class="fas fa-tag"></i>
            </a>
          </div>
          <div class="control is-grouped pg">
            <div class="title"
                 v-if="emailMessages">
              {{emailMessages.length}} messages
            </div>
          </div>
        </div>
        <div id="inbox-messages"
             class="inbox-messages">
          {{selectedFolder}}
          <template v-for="message of emailMessages">
            <div :key="message.id"
                 class="card"
                 @click="viewMessage(message)"
                 :class="{
                   'is-active': selectedMessage === message,
                   'is-unread': message.status ==  'UNREAD'
                 }">
              <div class="card-content">
                <div class="msg-header">
                  <span class="msg-from"><small>From: {{message.from}}</small></span>
                  <span class="msg-timestamp">{{formatDate(message.createdAt, 'shortDate')}}</span>
                  <span class="msg-attachment"
                        v-if="message.status ==  'UNREAD'"><i class="fas fa-envelope"></i></span>
                  <span class="msg-attachment"
                        v-else><i class="fas fa-envelope-open"></i></span>
                  <span class="msg-attachment"
                        v-if="message.attachment"><i class="fa fa-paperclip"></i></span>
                </div>
                <div class="msg-subject">
                  <span class="msg-subject"><strong>{{message.subject}}</strong></span>
                </div>
                <div class="msg-snippet">
                  <p>{{message.content | striphtml | truncate(70)}}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div id="message-pane"
           class="column is-7 message hero is-fullheight relative">
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <div class="action-buttons">
                <div class="control is-grouped">
                  <a class="button is-small">
                    <i class="fas fa-inbox"></i>
                  </a>
                  <a class="button is-small">
                    <i class="fas fa-trash"></i>
                  </a>
                </div>
                <div class="control is-grouped">
                  <a class="button is-small">
                    <i class="fas fa-folder"></i>
                  </a>
                  <a class="button is-small">
                    <i class="fas fa-tag"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <help-content reference="email.general"
                            toggle
                            dropdown />
            </div>
          </div>
        </nav>
        <template v-if="emailMessage">
          <div class="box message-preview">
            <div class="top">
              <div class="avatar">
                <avatar-letter :name='emailMessage.from'
                               size='32'
                               :rounded=true />
              </div>
              <div class="address">
                <div class="name">
                  From: {{emailMessage.from}}
                </div>
                <div class="email">
                  To: {{emailMessage.to}}
                </div>
                <span class="msg-timestamp">{{formatDate(emailMessage.createdAt, 'convertDate')}}</span>
              </div>
              <div class="msg-subject">
                <span class="msg-subject"><strong>{{emailMessage.subject}}</strong></span>
              </div>
              <hr>
              <div class="content"
                   v-html="emailMessage.content">
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <email-compose v-if="showModal"
                   @close="showModal = false" />

  </div>
</template>

<script>
import HelpContent from '@/shared/components/helpcontent'
import {
  EmailMessagesRead,
  EmailMessageRead,
  EmailMessageSubscription
} from '../graphql/EmailMessage.gql'

import AvatarLetter from '@/shared/components/avatar-letter'
import EmailCompose from '../views/Compose'

export default {
  name: 'EmailHome',
  props: {
    id: { type: String, default: '' }
  },
  components: {
    AvatarLetter,
    EmailCompose,
    HelpContent
  },
  data() {
    return {
      showModal: false,
      newMessage: '',
      mailbox: {},
      selectedMessage: {},
      selectedFolder: 'INBOX'
    }
  },

  apollo: {
    emailMessages: {
      query: EmailMessagesRead,
      variables() {
        return {
          where: { folder: this.selectedFolder },
          orderBy: 'createdAt_DESC'
        }
      },
      subscribeToMore: {
        document: EmailMessageSubscription,
        variables() {
          return {
            where: {
              node: {
                folder: this.selectedFolder,
                mailbox: {
                  owner: this.$store.state.currentUser.email
                }
              }
            }
          }
        },
        skip() {
          return !this.$store.state.currentUser
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            emailMessages: [
              subscriptionData.data.emailMessage.node,
              ...previousResult.emailMessages
            ]
          }
        }
      }
    },
    emailMessage: {
      query: EmailMessageRead,
      variables() {
        return {
          where: { id: this.id }
        }
      }
    }
  },

  methods: {
    selectFolder(folder) {
      this.selectedFolder = folder
      this.$router.push({
        name: 'email-home'
      })
    },
    viewMessage(message) {
      this.selectedMessage = message
      this.$router.push({
        name: 'email-inbox',
        params: { id: message.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aside {
  display: block;
  background-color: #f9f9f9;
  border-right: 1px solid #dedede;
}
.messages {
  display: block;
  background-color: #fff;
  border-right: 1px solid #dedede;
}
.message {
  display: block;
  background-color: #fff;
}
.aside .compose {
  height: 95px;
  margin: 0 -10px;
  padding: 25px 30px;
}
.aside .compose .button {
  color: #f6f7f7;
}
.aside .compose .button .compose {
  font-size: 14px;
  font-weight: 700;
}
.aside .main {
  padding: 40px;
  color: #6f7b7e;
}
.aside .title {
  color: #6f7b7e;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
.aside .main .item {
  display: block;
  padding: 10px 0;
  color: #6f7b7e;
}
.aside .main .item.is-active {
  background-color: #f1f1f1;
  margin: 0 -50px;
  padding-left: 50px;
}
.aside .main .item:active,
.aside .main .item:hover {
  background-color: #f2f2f2;
  margin: 0 -50px;
  padding-left: 50px;
}
.aside .main .icon {
  font-size: 19px;
  padding-right: 30px;
  color: #a0a0a0;
}
.aside .main .name {
  font-size: 15px;
  color: #5d5d5d;
  font-weight: 500;
}
.messages {
  padding: 40px 20px;
}
.message {
  padding: 40px 20px;
}
.messages .action-buttons {
  padding: 0;
  margin-top: -20px;
}
.message .action-buttons {
  padding: 0;
  margin-top: -5px;
}
.action-buttons .control.is-grouped {
  display: inline-block;
  margin-right: 30px;
}
.action-buttons .control.is-grouped:last-child {
  margin-right: 0;
}
.action-buttons .control.is-grouped .button:first-child {
  border-radius: 5px 0 0 5px;
}
.action-buttons .control.is-grouped .button:last-child {
  border-radius: 0 5px 5px 0;
}
.action-buttons .control.is-grouped .button {
  margin-right: -5px;
  border-radius: 0;
}
.pg {
  display: inline-block;
  top: 10px;
}
.action-buttons .pg .title {
  display: block;
  margin-top: 0;
  padding-top: 0;
  margin-bottom: 3px;
  font-size: 12px;
  color: #aaaaaa;
}
.action-buttons .pg a {
  font-size: 12px;
  color: #aaaaaa;
  text-decoration: none;
}
.is-grouped .button {
  background-image: linear-gradient(#f8f8f8, #f1f1f1);
}
.is-grouped .button .fa {
  font-size: 15px;
  color: #aaaaaa;
}
.inbox-messages {
  margin-top: 60px;
}
.message-preview {
  margin-top: 60px;
}
.inbox-messages .card {
  width: 100%;
}
.inbox-messages strong {
  color: #5d5d5d;
}
.inbox-messages .msg-check {
  padding: 0 20px;
}
.inbox-messages .msg-subject {
  padding: 10px 0;
  color: #5d5d5d;
}
.inbox-messages .msg-attachment {
  float: right;
}
.inbox-messages .msg-snippet {
  padding: 5px 20px 0px 5px;
}
.inbox-messages .msg-subject .fa {
  font-size: 14px;
  padding: 3px 0;
}
.inbox-messages .msg-timestamp {
  float: right;
  padding: 0 20px;
  color: #5d5d5d;
}
.message-preview .avatar {
  display: inline-block;
}
.message-preview .top .address {
  display: inline-block;
  padding: 0 20px;
}
.avatar img {
  width: 40px;
  border-radius: 50px;
  border: 2px solid #999;
  padding: 2px;
}
.address .name {
  font-size: 16px;
  font-weight: bold;
}
.address .email {
  font-weight: bold;
  color: #b6c7d1;
}
.card.is-unread {
  background-color: #ffffff;
}
.card.is-active {
  background-color: #f5f5f5;
}
</style>
