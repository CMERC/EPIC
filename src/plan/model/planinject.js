export default class PlanInject {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.title = ''
    this.status = null
    this.events = null
    this.startDate = null
    this.type = ''
    this.owner = {}
    this.from = ''
    this.to = ''
    this.method = null
    this.location = null
    this.trigger = ''
    this.response = ''
    this.responseDate = null
    this.remarks = ''
    this.objectives = []
    this.description = ''
    this.mitigation = ''
    this.attachments = []
  }
}
