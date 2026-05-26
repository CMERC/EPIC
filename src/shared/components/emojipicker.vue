<template>
  <emoji-picker @emoji="addEmoji"
                :search="search"
                class="dropdown is-active">
    <div class="emoji-invoker"
         slot="emoji-invoker"
         slot-scope="{ events }"
         v-on="events">
      <div class="dropdown-trigger"
           slot="trigger">
        <button class="button"
                aria-haspopup="true">
          <span class="icon is-small">
            <i class="far fa-smile"></i>
          </span>
        </button>
      </div>
    </div>
    <div class="dropdown-menu"
         role="menu"
         slot="emoji-picker"
         slot-scope="{ emojis, insert }">
      <div class="dropdown-content emoji-picker">
        <div class="emoji-picker__search">
          <input type="text"
                 v-model="search">
        </div>
        <div>
          <div v-for="(emojiGroup, category) in emojis"
               :key="category">
            <h5>{{ category }}</h5>
            <div class="emojis">
              <span v-for="(emoji, emojiName) in emojiGroup"
                    :key="emojiName"
                    @click="insert(emoji)"
                    :title="emojiName">{{ emoji }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </emoji-picker>
</template>

<script>
export default {
  name: 'CustomEmojiPicker',
  props: ['value'],
  data() {
    return {
      selectedEmoji: null,
      search: ''
    }
  },
  methods: {
    addEmoji(emoji) {
      this.selectedEmoji = emoji
      Object.assign({}, this.value, this.selectedEmoji)
      this.$emit('input', this.selectedEmoji)
    }
  }
}
</script>
<style lang="scss" scoped>
.emoji-invoker {
  cursor: pointer;
  transition: all 0.2s;
}
.emoji-invoker:hover {
  transform: scale(1.1);
}
.emoji-invoker > svg {
  fill: #b1c6d0;
}

.emoji-picker {
  z-index: 1;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 15rem;
  height: 20rem;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 1px 1px 8px #c7dbe6;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: '';
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}
</style>
