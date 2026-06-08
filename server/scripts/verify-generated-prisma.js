const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '..', 'src', 'generated', 'prisma.graphql')
if (!fs.existsSync(file)) {
  console.warn('[startup] src/generated/prisma.graphql is missing. This committed GraphQL SDL artifact is still required by graphql-import.')
}
