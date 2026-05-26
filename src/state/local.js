// typeDefs and resovlers for local store https://vue-cli-plugin-apollo.netlify.com/guide/client-state.html
import gql from 'graphql-tag'

/*
Here, we're using the GeoLocation API to get the user's current position.
https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
*/
const getCurrentPosition = options => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export const typeDefs = gql`
  type Query {
    user: AppUser
    currentPosition(timeout: Int): Coordinates
    connected: Boolean!
  }
`

export const resolvers = {
  Query: {
    async currentPosition(_, { enableHighAccuracy, timeout, maximumAge }) {
      if (!navigator.geolocation) return null
      try {
        const data = await getCurrentPosition({
          enableHighAccuracy,
          timeout,
          maximumAge
        })

        const { coords, timestamp } = data
        return {
          coords: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            altitude: coords.altitude,
            accuracy: coords.accuracy,
            __typename: 'Coordinates'
          },
          timestamp,
          __typename: 'CurrentPosition',
          id: timestamp
        }
      } catch (e) {
        console.error(e)
        return null
      }
    }
  },
  Mutation: {
    setSelf: (parent, { user }, { cache }) => {
      cache.writeData({
        data: {
          user: user ? { ...user, __typename: 'AppUser' } : null
        }
      })
      return null
    },
    connectedSet: (parent, { value }, { cache }) => {
      const data = {
        connected: value
      }
      cache.writeData({ data })
      return null
    }
  }
}
