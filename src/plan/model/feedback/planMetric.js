export default class PlanMetric {
  constructor() {
    this.resetData()
  }
  resetData() {
    this.flightHours = 0
    this.numOfStories = 0
    this.numOfPassesngers = 0
    this.cargoWeight = 0
    this.fuelPassed = 0
    this.milesTraveled = 0
    this.gallonsGasUsed = 0
  }
}
