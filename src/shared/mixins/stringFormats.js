export default {
  methods: {
    truncate(body, length, ending = '...') {
      if (body && body.length > length) {
        return body.substring(0, length - ending.length) + ending
      } else {
        return body
      }
    }
  }
}
