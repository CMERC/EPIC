import MediaFile from './mediafile'

export default class MediaNetwork {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.name = ''
    this.id = ''
    this.description = ''
    this.profiles = []
    this.avatar = new MediaFile()
  }
}
