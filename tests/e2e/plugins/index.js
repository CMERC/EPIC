// https://docs.cypress.io/guides/guides/plugins-guide.html

module.exports = (on, config) => {
  return Object.assign({}, config, {
    viewportWidth: 1280,
    viewportHeight: 720,
    responseTimeout: 250000,
    requestTimeout: 250000,
    execTimeout: 250000,
    defaultCommandTimeout: 250000,
    pageLoadTimeout: 250000,
    taskTimeout: 250000,
    numTestsKeptInMemory: 15,
    baseUrl: 'http://localhost:4467/',
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js'
  })
}
