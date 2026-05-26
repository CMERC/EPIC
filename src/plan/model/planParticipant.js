export default class PlanParticipant {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.name = ''
    this.serviceType = null
    this.service = null
    this.commandAgency = null
    this.homeStation = ''
    this.bedDown = ''
    this.totalAudience = ''
    this.icon = ''
    this.participantType = null
    this.planners = []
    this.fundings = []
    this.platforms = []
  }
}
