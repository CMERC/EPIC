<template>
  <profile-list :mediaProfiles="allData.serviceUsers" />
</template>

<script>
import helpers from '@/shared/mixins/helpers'
import ProfileList from '../profile-list'
import { MediaProfilesRead } from '@/media/graphql/MediaProfiles.gql'

export default {
  name: 'UsersView',
  mixins: [helpers],
  props: {
    allData: {
      type: Object,
      required: true
    }
  },
  components: { ProfileList },
  apollo: {
    mediaProfiles: {
      query: MediaProfilesRead,
      variables() {
        let data
        switch (this.allData.page) {
          case 'user': {
            data = {
              where: {
                service: {
                  name: this.$route.params.service
                }
              },
              first: 10
            }
            break
          }
          case 'profile': {
            data = {
              where: {
                username: this.$route.params.username,
                service: { name: this.$route.params.service }
              }
            }
            break
          }
        }
        return data
      },
      result({ data }) {
        if (data === undefined) {
          switch (this.allData.page) {
            case 'user': {
              this.allData.serviceUsers = data.mediaProfiles
              break
            }
            case 'profile': {
              const newProfile = {
                profile: {
                  fullName: data.mediaProfiles[0].name,
                  counts: data.mediaProfiles[0].counts
                }
              }
              this.allData.currentUser = Object.assign(
                newProfile,
                data.mediaProfiles[0]
              )
              break
            }
          }
        }
      },
      skip() {
        return this.skipProfile
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    getUser(userSelected) {
      this.$router.push({
        path: `/web/${this.$route.params.workspace}/${
          userSelected.service.name
        }/${userSelected.username}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.card:hover {
  background-color: rgb(219, 219, 219);
}
</style>
