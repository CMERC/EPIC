import { MediaPostsCreate } from '@/media/graphql/MediaPosts.gql'

export default {
  methods: {
    createMediaPost(profile, parentPostID, parentDate) {
      if (!profile) return
      let parentPost = null
      if (parentPostID) {
        parentPost = { connect: { id: parentPostID ? parentPostID : null } }
      }

      let currentDate = new Date().toISOString()

      let dataVariable = {
        title: '',
        text: '',
        isPublished: false,
        isUserGenerated: true,
        createTime: currentDate,
        updateTime: currentDate === '' ? null : currentDate,
        parent: parentPost,
        profiles: {
          connect: {
            id: profile.id
          }
        }
      }

      let url = {
        service: profile.service.name,
        profile: profile.username
      }
      dataVariable = Object.assign(dataVariable, {
        url: JSON.stringify(url)
      })

      this.$apollo
        .mutate({
          mutation: MediaPostsCreate,
          variables: {
            data: dataVariable
          }
        })
        .then(response => {
          this.$buefy.toast.open({
            message: 'Saving...',
            type: 'is-success'
          })
          if (response && response.data && response.data.createMediaPost) {
            let queryParam

            if (parentPostID) {
              queryParam = { c: parentPostID, min: parentDate }
            }
            this.$router.push({
              name: 'editpost',
              params: {
                profile: profile.username,
                service: profile.service.name,
                id: response.data.createMediaPost.id
              },
              query: queryParam
            })
          }
        })
        .catch(error => {
          this.$buefy.toast.open({
            message: 'There was an error',
            type: 'is-danger'
          })
          console.error('Create Media Post: ' + error)
        })
    }
  }
}
