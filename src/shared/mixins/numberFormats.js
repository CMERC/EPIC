export default {
  methods: {
    formatNumber(num, args) {
      switch (args) {
        case 'abbreviate':
          return this.numeral(String(num)).format('0.0a')
        case 'thousands':
          return this.numeral(String(num)).format('0,0')
        case 'currency':
          return this.numeral(String(num)).format('$0,0[.]00')
        case 'percent':
          return this.numeral(String(num)).format('0%')
        default:
          return num
      }
    }
  }
}
