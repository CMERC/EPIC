const winston = require('winston')
const { combine, colorize, splat, label, printf } = winston.format

const level = process.env.LOG_LEVEL || 'debug'

const logger = winston.createLogger({
  level: level,
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        splat(),
        label({ label: '[server]' }),
        printf(info => `${info.label} ${info.message}`)
      )
    })
  ]
})

module.exports = logger
