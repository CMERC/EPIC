export default class MediaFile {
  constructor() {
    this.name = ''
    this.id = ''
    this.url = {
      thumb: '',
      full: '',
      regular: '',
      small: '',
      raw: ''
    }
    this.secret = ''
    this.contentType = ''
  }
}
