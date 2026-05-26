export default class MediaProfile {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.name = ''
    this.id = ''
    this.url = ''
    this.username = ''
    this.name = ''
    this.description = ''
    this.service = {
      name: ''
    }
    this.avatar = null
    this.banner = null
    this.isUserGenerated = false
    this.counts = null
  }
}
