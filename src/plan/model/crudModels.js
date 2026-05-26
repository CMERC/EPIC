//Working on having all models in one file
export default {
  methods: {
    getModel(name) {
      switch (name) {
        case 'jmet':
          return class {
            constructor() {
              this.resetData()
            }
            resetData() {
              this.levelWar = null
              this.taskNumber = null
              this.taskTitle = null
            }
          }
        case 'organization':
          return class {
            constructor() {
              this.resetData()
            }
            resetData() {
              this.name = null
              this.group = null
            }
          }
      }
    }
  }
}
