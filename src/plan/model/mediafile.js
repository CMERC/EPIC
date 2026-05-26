export default class MediaFile {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.id = ''
    this.name = ''
    this.url = {
      thumb: '',
      full: '',
      regular: '',
      small: '',
      raw: ''
    }
  }
}
