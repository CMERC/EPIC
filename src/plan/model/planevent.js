export default class PlanEvent {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.name = ''
    this.type = null
    this.method = null
    this.startDate = null
    this.endDate = null
    this.description = null
    this.description = ''
    this.color = '#455A64'
    this.exerciseGuidance = null
  }
}
