export default class PlanTrainingObjective {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.platform = {}
    this.jmet = {}
    this.requestedMethodType = null
    this.trainedMethodType = null
    this.priorityLevel = null
    this.requiredRuns = ''
    this.classification = ''
    this.task = ''
    this.condition = ''
    this.standard = ''
    this.exerciseObjective = []
    this.accreditedTask = []
    this.commandTrainingPriority = []
    this.jointStaffTrainingPriority = []
  }
}
