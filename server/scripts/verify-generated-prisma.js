const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '..', 'src', 'generated', 'prisma.graphql')
if (!fs.existsSync(file)) {
  console.warn('[startup] src/generated/prisma.graphql is missing. The Docker entrypoint will run prisma1 deploy/generate before starting.')
}
