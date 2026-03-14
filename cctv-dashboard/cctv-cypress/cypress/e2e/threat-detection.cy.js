// cypress/e2e/threat-detection.cy.js
// Tests: When a firearm is detected, the UI correctly enters threat/alert state

describe('Threat Detection Alerts', () => {

  beforeEach(() => {
    cy.visit('/')
    // Give the page a moment to initialise before each test
    cy.get('#feedGrid').should('be.visible')
    cy.get('#logBox').should('contain.text', 'System initialised')
  })

  it('should show THREAT badge on the camera that detected a firearm', () => {
    // CAM-01 fires automatically 2s after page load (built into the dashboard)
    cy.waitForThreatOnCam('CAM-01')

    cy.get('#badge-CAM-01')
      .should('have.class', 'threat')
      .and('contain.text', 'THREAT')
  })

  it('should update the system status badge to ALERT when a threat is detected', () => {
    cy.waitForThreat()
    cy.assertSystemAlert()
  })

  it('should display a detection bounding box on the camera feed', () => {
    cy.waitForThreatOnCam('CAM-01')

    // A detection box with a firearm label should appear in the overlay
    cy.get('#ov-CAM-01 .det-box')
      .should('be.visible')

    cy.get('#ov-CAM-01 .det-box-label')
      .should('contain.text', 'FIREARM')
  })

  it('should show the detected camera and coordinates in the escalation panel', () => {
    cy.waitForThreatOnCam('CAM-01')

    // Coord display should no longer say "No active detection"
    cy.get('#coordDisp')
      .should('not.contain.text', 'No active detection')
      .and('contain.text', 'Main Entrance')
  })

  it('should add an entry to the Active Alerts list', () => {
    cy.waitForThreat()

    cy.get('#alertList .alert-item')
      .should('have.length.at.least', 1)

    cy.get('#alertList .alert-item').first().within(() => {
      // Should show camera name, coordinates and confidence
      cy.get('.alert-cam').should('not.be.empty')
      cy.get('.alert-coord').should('match', /\d+\.\d+/)
      cy.get('.alert-conf').should('match', /\d+\.\d+%/)
    })
  })

  it('should write an ALERT line to the server log', () => {
    cy.waitForThreat()
    cy.assertLog('ALERT: Firearm detected')
  })

  it('should show a toast notification when a threat is detected', () => {
    cy.waitForThreat()
    cy.get('.toast.show')
      .should('be.visible')
      .within(() => {
        cy.get('.toast-title').should('contain.text', 'Threat Detected')
        cy.get('.toast-body').should('not.be.empty')
      })
  })

  it('should change the server label to THREAT DETECTED', () => {
    cy.waitForThreat()
    cy.get('#srvLabel').should('contain.text', 'THREAT DETECTED')
  })

})
