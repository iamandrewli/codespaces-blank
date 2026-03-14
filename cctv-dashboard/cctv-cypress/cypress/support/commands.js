// cypress/support/commands.js
// Custom commands for the CCTV AI Detection Dashboard

/**
 * Waits for ANY camera to enter threat state.
 * Polls until a .feed-badge.threat element appears.
 */
Cypress.Commands.add('waitForThreat', (timeout = 14000) => {
  cy.get('.feed-badge.threat', { timeout }).should('be.visible')
})

/**
 * Waits for a SPECIFIC camera to enter threat state.
 * @param {string} camId  e.g. 'CAM-01'
 */
Cypress.Commands.add('waitForThreatOnCam', (camId, timeout = 14000) => {
  cy.get(`#badge-${camId}`, { timeout })
    .should('have.class', 'threat')
    .and('contain.text', 'THREAT')
})

/**
 * Injects a threat directly into the page via JS so tests don't
 * have to wait for the random mock server timer.
 * @param {string} camId  e.g. 'CAM-01'
 */
Cypress.Commands.add('injectThreat', (camId = 'CAM-01') => {
  cy.window().then(win => {
    // The dashboard exposes triggerDetection on window in test mode
    // We call it directly to bypass the random timer
    win.triggerDetection(camId)
  })
})

/**
 * Gets the current numeric value of a metric card by its element id.
 * Returns a Cypress chainable resolving to a Number.
 */
Cypress.Commands.add('getMetricValue', (elementId) => {
  return cy.get(`#${elementId}`).invoke('text').then(txt => parseInt(txt.trim(), 10))
})

/**
 * Asserts the system-level badge shows ALERT state.
 */
Cypress.Commands.add('assertSystemAlert', () => {
  cy.get('#sysBadge')
    .should('have.class', 'pill-alert')
    .and('contain.text', 'ALERT')
})

/**
 * Asserts the system-level badge shows ALL CLEAR state.
 */
Cypress.Commands.add('assertSystemClear', () => {
  cy.get('#sysBadge')
    .should('have.class', 'pill-ok')
    .and('contain.text', 'ALL CLEAR')
})

/**
 * Asserts the server log contains a given string.
 */
Cypress.Commands.add('assertLog', (text) => {
  cy.get('#logBox').should('contain.text', text)
})
