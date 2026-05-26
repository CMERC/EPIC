<template>
  <div class="container is-fullhd is-fullheight">
    <loading-state :isFullPage='true'
                   :isLoading='$apollo.loading' />
    <div class="columns chatClient">
      <div class="column is-narrow sidebar is-hidden-touch">
        <div class="subtitle"
             v-if="this.$store.state.currentUser">
          <figure class="image">
            <avatar-letter :name='this.$store.state.currentUser.name'
                           size='32'
                           :rounded=true />{{this.$store.state.currentUser.name}}
          </figure>
        </div>
        <div class="subtitle is-6">
          <ul class="is-list-none">
            <li :class="{'is-active' : selectedRoom.title == 'All Messages' }">
              <a @click="selectedRoom = {title: 'All Messages'}">
                View All Messages
              </a>
            </li>
          </ul>
        </div>
        <div class="room">
          Rooms
        </div>
        <div class="chatList">
          <ul class="is-list-none">
            <template v-for="room of chatRooms">
              <li :key="room.id"
                  class="room"
                  :class="{'is-active' : selectedRoom == room }">
                <a @click="selectedRoom = room">
                  #{{ room.title }}
                </a>
              </li>
            </template>
          </ul>
        </div>
        <div>
          <span v-show="errors.has('Room')"
                class="help has-text-danger">{{errors.first('Room') }}</span>
        </div>
        <div class="field has-addons addRoom">
          <div class="control">
            <a class="button"
               @click="createRoom()">
              <i class="fas fa-plus"></i>
            </a>
          </div>
          <div class="control">
            <input class="input"
                   type="text"
                   name="Room"
                   v-model="roomName"
                   v-validate="'required|max:22'"
                   :class="{'input': true, 'is-danger': errors.has('Room') }"
                   placeholder="Create a new room"
                   @keyup.enter="createRoom">
          </div>
        </div>
      </div>
      <div class="column chat is-mobile">
        <div class="has-text-centered">
          <div class="is-hidden-desktop">
            <b-dropdown v-model="roomSelector"
                        class="has-text-left">
              <button class="button"
                      slot="trigger">
                <span>{{selectedRoom ? selectedRoom.title : 'Rooms'}}</span>
              </button>
              <b-dropdown-item has-link>
                <a @click="selectedRoom = {title: 'All Messages'}">
                  View All Messages
                </a>
              </b-dropdown-item>
              <b-dropdown-item v-for="room of chatRooms"
                               v-bind:key="room.id"
                               has-link>
                <a @click="selectedRoom = room">
                  #{{ room.title }}
                </a>
              </b-dropdown-item>
              <hr class="dropdown-divider">
              <b-dropdown-item custom>
                <div>
                  <span v-for="error in errors.all()"
                        class="help is-danger"
                        :key="error.id">{{ error }}</span>
                </div>
                <div class="field has-addons addRoom">
                  <div class="control">
                    <a class="button"
                       @click="createRoom()">
                      <i class="fas fa-plus"></i>
                    </a>
                  </div>
                  <div class="control">
                    <input class="input"
                           type="text"
                           name="Room"
                           v-model="roomName"
                           v-validate="'required|max:22'"
                           :class="{'input': true, 'is-danger': errors.has('Room') }"
                           placeholder="Create a new room"
                           @keyup.enter="createRoom">
                  </div>
                </div>
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <h2 class="main__h2 is-hidden-touch">
            #{{selectedRoom.title}}
          </h2>
        </div>
        <div class="thread"
             id="messages">
          <ul class="is-list-none">
            <template v-for="(message,index) of chatMessages">
              <template v-if="index == 0 || index > 0 && !moment(message.createdAt).isSame(chatMessages[index - 1].createdAt, 'day')">
                <div class="is-divider has-text-bold"
                     v-bind:key="index"
                     style="position: sticky;top: 0;z-index:1;">
                  <div class="tag">
                    {{formatDate(message.createdAt, 'monthDay')}}
                  </div>
                </div>
              </template>
              <li class="message"
                  :key="message.id">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <span>
                      <avatar-letter :name='message.author'
                                     size='32'
                                     :rounded=true />
                    </span>
                  </div>
                  <div class="column">
                    <span class="title is-6">
                      {{ message.author }}
                    </span>
                    <span class="tooltip has-text-weight-light is-7"
                          :data-tooltip="formatDate(message.createdAt, 'convertDate')">{{ formatDate(message.createdAt, 'displayTime') }}</span>
                    <div v-if="selectedRoom && selectedRoom.id == null"
                         class="roomTitle has-text-weight-light is-7">{{ message.room.title }}</div>
                    <p class="title is-6 has-text-weight-normal"
                       v-html="replaceChatLinks(message.text)"></p>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </div>
        <div class="compose field has-addons">
          <div class="control messageEntry">
            <input v-model="newMessage"
                   :disabled="!selectedRoom.id"
                   placeholder="Type a message"
                   class="input"
                   @keyup.enter="sendMessage">
          </div>
          <div class="control">
            <a class="button"
               @click="sendMessage()"
               :disabled="!selectedRoom.id">
              <i class="fas fa-paper-plane"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ChatRoomsRead,
  ChatRoomCreate,
  ChatRoomSubscription
} from '../graphql/ChatRoom.gql'
import {
  ChatMessagesRead,
  ChatMessageCreate,
  ChatMessageSubscription
} from '../graphql/ChatMessage.gql'

import AvatarLetter from '@/shared/components/avatar-letter'
import processText from '@/shared/mixins/processText'

export default {
  name: 'ChatHome',
  mixins: [processText],
  components: {
    AvatarLetter
  },
  data() {
    return {
      roomName: '',
      newMessage: '',
      roomSelector: '',
      selectedRoom: {
        title: 'All Messages'
      }
    }
  },
  apollo: {
    chatRooms: {
      query: ChatRoomsRead,
      subscribeToMore: {
        document: ChatRoomSubscription,
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            chatRooms: [
              ...previousResult.chatRooms,
              subscriptionData.data.chatRoom.node
            ]
          }
        }
      }
    },
    chatMessages: {
      query: ChatMessagesRead,
      variables() {
        return {
          where: { room: { id: this.selectedRoom.id } }
        }
      },
      subscribeToMore: {
        document: ChatMessageSubscription,
        variables() {
          return {
            where: { node: { room: { id: this.selectedRoom.id } } }
          }
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            chatMessages: [
              ...previousResult.chatMessages,
              subscriptionData.data.chatMessage.node
            ]
          }
        }
      }
    }
  },
  watch: {
    selectedRoom() {
      this.roomSelector = this.selectedRoom
    },
    chatMessages() {
      this.$nextTick(() => {
        this.scrollToEnd()
      })
    }
  },
  methods: {
    createRoom() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$apollo
            .mutate({
              mutation: ChatRoomCreate,
              variables: {
                data: {
                  title: this.roomName
                }
              }
            })
            .then(() => {
              this.roomName = ''
              this.errors.clear()
              this.$validator.reset()
            })
            .catch(error => alert(error))
          return
        }
      })
    },
    sendMessage() {
      if (this.formValid) {
        this.$apollo.mutate({
          mutation: ChatMessageCreate,
          variables: {
            data: {
              text: this.newMessage,
              author: this.$store.state.currentUser.name,
              room: {
                connect: {
                  id: this.selectedRoom.id
                }
              }
            }
          }
        })

        this.newMessage = ''
      }
    },
    scrollToEnd: function() {
      var container = this.$el.querySelector('#messages')
      container.scrollTop = container.scrollHeight
    }
  },
  computed: {
    formValid() {
      return this.newMessage
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: white;
  max-width: 100vw;
  width: auto;
  flex-direction: column;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  height: calc(100vh - 53px);
  min-height: 300px;

  .chatClient {
    > .column {
      min-height: calc(100vh - 53px);
    }
    margin: 0;
    .columns:last-child {
      margin-bottom: 0rem;
    }
    li {
      padding-left: 10px;
      &.is-active {
        background-color: #34495e;
        a {
          color: whitesmoke;
        }
      }
    }
    .sidebar {
      padding-left: 20px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      min-width: 245px;
      max-width: 260px;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 0;
      figure,
      span {
        svg {
          vertical-align: middle;
          margin-right: 5px;
        }
      }
    }
  }
}

.form,
.input,
.apollo,
.message {
  padding: 0.25em;
}

.message {
  margin: 0.75rem 0;
}

.input {
  font-family: inherit;
  font-size: inherit;
}

.chatList {
  overflow: auto;
  flex-grow: 1;
}

.chat {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
  overflow-x: hidden;
}

.thread {
  margin: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  min-height: calc(90vh - 110px);
  height: 65vh;
  & li {
    background-color: whitesmoke;
  }
  .roomTitle {
    margin-left: 10px;
    width: 90px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: bottom;
  }
}
.compose,
.addRoom {
  margin: 10px 0;
}
.compose {
  .messageEntry {
    width: 100%;
  }
}
@media screen and (min-width: 1025px) {
  .container {
    overflow: hidden;
    background-color: whitesmoke;
  }
  .thread {
    min-height: initial;
    flex-grow: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding: 0;
    & ul {
      list-style-type: none;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .roomTitle {
      width: 90px;
    }

    & li {
      padding: 8px 16px;
      background-color: #fff;
      align-self: flex-start;
      border-radius: 18px;
      word-break: break-word;
      word-wrap: break-word;
      span {
        margin-right: 5px;
        margin-left: 5px;
      }
    }
  }
}
</style>
