import MediaFile from './mediafile'

export default class MediaPersona {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.id = ''
    this.name = ''
    this.description = ''
    this.role = ''
    this.aliases = ''
    this.ethnicity = ''
    this.hometown = ''
    this.currentResidence = ''
    this.religion = ''
    this.patternOfLife = ''
    this.family = ''
    this.associates = ''
    this.otherSignificantInfo = ''
    this.profiles = []
    this.avatar = new MediaFile()
  }
}
