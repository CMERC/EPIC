<template>
  <b-dropdown class="countsData"
              @active-change="handleClose">
    <a class="button"
       slot="trigger">
      <span class="icon is-small">
        <i class="fas fa-chart-bar"></i>
      </span>
      <span>Data</span>
    </a>
    <b-dropdown-item custom
                     paddingless
                     v-if="countType == 'post'">
      <label class="dropdown-item label">
        Post Data
      </label>
      <div class="dropdown-item field is-horizontal">
        <div class="field-label is-normal">
          <label>
            <span class="icon is-small">
              <i class="fas fa-heart"></i>
              Likes
            </span>
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded">
              <input class="input"
                     type="text"
                     v-model="countInfo.likes">
            </div>
          </div>
        </div>
      </div>
      <div class="dropdown-item field is-horizontal"
           v-if="service.type==='VIDEO'">
        <div class="field-label is-normal">
          <label>
            <span class="icon is-small">
              <i class="fas fa-thumbs-down"></i>
              Dislike
            </span>
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded">
              <input class="input"
                     type="text"
                     v-model="countInfo.dislikes" />
            </div>
          </div>
        </div>
      </div>
      <div class="dropdown-item field is-horizontal">
        <div class="field-label is-normal">
          <label>
            <span class="icon is-small">
              <i class="fas fa-retweet"></i>
              Shares
            </span>
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded">
              <input class="input"
                     type="text"
                     v-model="countInfo.shares" />
            </div>
          </div>
        </div>
      </div>
      <div class="dropdown-item field is-horizontal"
           v-if="service.type==='VIDEO'">
        <div class="field-label is-normal">
          <label>
            <span class="icon is-small">
              <i class="fas fa-eye"></i>
              Views
            </span>
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded">
              <input class="input"
                     type="text"
                     v-model="countInfo.views" />
            </div>
          </div>
        </div>
      </div>
    </b-dropdown-item>
    <b-dropdown-item custom
                     paddingless
                     v-else>
      <div class="dropdown-item field is-horizontal">
        <div class="field-label is-normal">
          <label>
            <span class="icon is-small">
              Followers
            </span>
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded">
              <input class="input"
                     type="text"
                     v-model="countInfo.followers">
            </div>
          </div>
        </div>
      </div>
      <div class="dropdown-item field is-horizontal">
        <div class="field-label is-normal">
          <label>
            <span class="icon is-small">
              Following
            </span>
          </label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control is-expanded">
              <input class="input"
                     type="text"
                     v-model="countInfo.following" />
            </div>
          </div>
        </div>
      </div>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: 'social-counts',
  props: {
    profileCounts: {
      type: Object,
      default: function() {
        return {
          followers: 0,
          following: 0
        }
      }
    },
    postCounts: {
      type: Object,
      default: function() {
        return {
          likes: 0,
          dislikes: 0,
          shares: 0,
          views: 0
        }
      }
    },
    countType: {
      type: String,
      default: 'post'
    },
    service: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      countInfo: this.handleData()
    }
  },
  methods: {
    handleData() {
      let data

      if (this.countType == 'profile') {
        data = this.profileCounts
      } else {
        data = this.postCounts
      }

      return data
    },
    handleClose(open) {
      if (open == false) {
        this.$emit('getValues', this.countInfo)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.countsData {
  .dropdown-content {
    .field {
      margin-bottom: 0px;
    }
    .field-label {
      padding-right: 3.5rem;
    }
    .icon {
      justify-content: left;
      svg {
        margin-right: 5px;
      }
    }
  }
}
</style>
