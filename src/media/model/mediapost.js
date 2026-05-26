import MediaFile from './mediafile'

export default class MediaPost {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.isPublished = false
    this.publishTime = null
    this.title = ''
    this.text = ''
    this.url = ''
    this.isUserGenerated = true
    this.profiles = []
    this.location = null
    this.parent = {}
    this.mediaFile = new MediaFile()
  }
}
