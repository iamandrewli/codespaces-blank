// cypress/e2e/escalation.cy.js
// Tests: Detection counter increments on threat + Notify Police increments Escalated counter

describe('Detection Counter & Police Escalation', () => {

  beforeEach(() => {
    cy.visit('/')
    cy.get('#feedGrid').should('be.visible')
    cy.get('#logBox').should('contain.text', 'System initialised')
  })

  // --- Detection counter ---

  it('should start with Detections Today at 0', () => {
    // Wait long enough that the auto-trigger on CAM-01 hasn't fired yet
    // We check immediately on load before the 2s auto-trigger
    cy.get('#mDet').should('have.text', '0')
  })

  it('should increment Detections Today by 1 when a threat is detected', () => {
    // Read baseline (may already be 1 from 2s auto-trigger)
    cy.get('#mDet').invoke('text').then(before => {
      const baseline = parseInt(before.trim(), 10)

      // Wait for at least one threat to register
      cy.waitForThreat()

      cy.get('#mDet').invoke('text').then(after => {
        const updated = parseInt(after.trim(), 10)
        expect(updated).to.be.greaterThan(baseline)
      })
    })
  })

  it('should increment Detections Today on each new detection', () => {
    // Wait for first detection (auto-fires at 2s)
    cy.waitForThreat()
    cy.get('#mDet').invoke('text').then(first => {
      const count1 = parseInt(first.trim(), 10)
      expect(count1).to.be.at.least(1)

      // Inject a second detection on a different camera
      cy.injectThreat('CAM-02')

      cy.get('#mDet').invoke('text').then(second => {
        const count2 = parseInt(second.trim(), 10)
        expect(count2).to.equal(count1 + 1)
      })
    })
  })

  // --- Police escalation ---

  it('should start with Escalated counter at 0', () => {
    cy.get('#mEsc').should('have.text', '0')
  })

  it('should increment Escalated counter by 1 when Notify Police is clicked', () => {
    cy.waitForThreat()

    cy.get('#mEsc').invoke('text').then(before => {
      const baseline = parseInt(before.trim(), 10)

      cy.get('#btnPolice').click()

      cy.get('#mEsc').invoke('text').then(after => {
        const updated = parseInt(after.trim(), 10)
        expect(updated).to.equal(baseline + 1)
      })
    })
  })

  it('should show the Police Notified confirmation state on the button after clicking', () => {
    cy.waitForThreat()
    cy.get('#btnPolice').click()

    cy.get('#btnPolice')
      .should('have.class', 'fired')
      .and('contain.text', 'Police Notified')
  })

  it('should reset the Notify Police button back to default after 5 seconds', () => {
    cy.waitForThreat()
    cy.get('#btnPolice').click()

    // Button should reset after ~5s
    cy.get('#btnPolice', { timeout: 7000 })
      .should('not.have.class', 'fired')
      .and('contain.text', 'Notify Police')
  })

  it('should write an ESCALATED line to the server log when police are notified', () => {
    cy.waitForThreat()
    cy.get('#btnPolice').click()
    cy.assertLog('ESCALATED: Police notified')
  })

  it('should show a toast confirming police have been notified', () => {
    cy.waitForThreat()
    cy.get('#btnPolice').click()

    cy.get('.toast.show')
      .should('be.visible')
      .within(() => {
        cy.get('.toast-title').should('contain.text', 'Police Notified')
      })
  })

  it('should increment Escalated counter correctly across multiple escalations', () => {
    cy.waitForThreat()
    cy.get('#btnPolice').click()
    cy.get('#mEsc').should('have.text', '1')

    // Wait for button to reset, inject another threat, escalate again
    cy.get('#btnPolice', { timeout: 7000 }).should('not.have.class', 'fired')
    cy.injectThreat('CAM-02')
    cy.waitForThreatOnCam('CAM-02')
    cy.get('#btnPolice').click()
    cy.get('#mEsc').should('have.text', '2')
  })

})
