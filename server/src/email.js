var nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const apiKey = process.env.SENDGRID_API_KEY
const templateRoot = path.join(__dirname, 'emails')

handlebars.registerHelper('year', () => new Date().getFullYear())

// In local/containerized dev there is usually no SMTP server on localhost:587.
// Use a no-network JSON transport when SendGrid is not configured.
const transporter = apiKey
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: apiKey
      }
    })
  : nodemailer.createTransport({ jsonTransport: true })

function renderTemplate(template, fileName, locals) {
  const filePath = path.join(templateRoot, template, `${fileName}.hbs`)
  const source = fs.readFileSync(filePath, 'utf8')
  return handlebars.compile(source)(locals || {})
}

const email = {
  async send({ template, message = {}, locals = {} }) {
    const mail = {
      ...message,
      from: message.from || process.env.MAIL_FROM,
      subject: message.subject || renderTemplate(template, 'subject', locals).trim(),
      html: message.html || renderTemplate(template, 'html', locals)
    }

    return transporter.sendMail(mail)
  }
}

module.exports = { email }
