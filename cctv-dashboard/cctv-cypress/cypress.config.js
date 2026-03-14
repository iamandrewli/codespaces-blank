const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://curly-potato-7rp54gq44rqfwx9j-3001.app.github.dev',
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/commands.js',
    env: {
      DETECTION_WAIT: 14000,
      AUTO_CLEAR_WAIT: 16000
    }
  }
})
