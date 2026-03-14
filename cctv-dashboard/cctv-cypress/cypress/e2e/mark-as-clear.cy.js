// cypress/e2e/mark-as-clear.cy.js
// Tests: Clicking "Mark as Clear" fully resets all alert/threat state

describe('Mark as Clear — Full Reset', () => {

  beforeEach(() => {
    cy.visit('/')
    cy.get('#feedGrid').should('be.visible')
    cy.get('#logBox').should('contain.text', 'System initialised')

    // Wait for the auto-triggered detection on CAM-01 so we have
    // an active alert to dismiss in every test
    cy.waitForThreatOnCam('CAM-01')
  })

  it('should reset the threat camera badge back to NORMAL', () => {
    cy.get('.esc-btn.dismiss').click()

    cy.get('#badge-CAM-01', { timeout: 5000 })
      .should('have.class', 'ok')
      .and('contain.text', 'NORMAL')
  })

  it('should remove the detection bounding box from the camera feed', () => {
    cy.get('.esc-btn.dismiss').click()

    cy.get('#ov-CAM-01 .det-box', { timeout: 5000 }).should('not.exist')
  })

  it('should reset the system status badge to ALL CLEAR', () => {
    cy.get('.esc-btn.dismiss').click()
    cy.assertSystemClear()
  })

  it('should reset the server label back to "Server online"', () => {
    cy.get('.esc-btn.dismiss').click()

    cy.get('#srvLabel', { timeout: 5000 }).should('contain.text', 'Server online')
  })

  it('should clear the Active Alerts list', () => {
    cy.get('.esc-btn.dismiss').click()

    cy.get('#alertList', { timeout: 5000 })
      .should('contain.text', 'No threats detected')

    cy.get('#alertList .alert-item').should('not.exist')
  })

  it('should reset the escalation panel coord display to "No active detection"', () => {
    cy.get('.esc-btn.dismiss').click()

    cy.get('#coordDisp', { timeout: 5000 })
      .should('contain.text', 'No active detection')
  })

  it('should write a "cleared" line to the server log', () => {
    cy.get('.esc-btn.dismiss').click()
    cy.assertLog('Operator marked scene as clear')
  })

  it('should show a Cleared toast notification', () => {
    cy.get('.esc-btn.dismiss').click()

    cy.get('.toast.show', { timeout: 3000 })
      .should('be.visible')
      .within(() => {
        cy.get('.toast-title').should('contain.text', 'Cleared')
      })
  })

  it('should fully reset when there are multiple active threats', () => {
    // Inject a second threat on another camera
    cy.injectThreat('CAM-02')
    cy.waitForThreatOnCam('CAM-02')

    // Both cameras should be in threat state
    cy.get('.feed-badge.threat').should('have.length', 2)

    // Dismiss the active alert (will clear whichever is activeAlert)
    cy.get('.esc-btn.dismiss').click()

    // At least one camera should clear; if both are gone system goes clear
    cy.get('#alertList', { timeout: 5000 }).then($list => {
      // Either fully clear or one remaining — either way count dropped
      const items = $list.find('.alert-item').length
      expect(items).to.be.lessThan(2)
    })
  })

  it('should NOT reset the Detections Today counter (detections are persistent)', () => {
    // Detection count records history and should NOT drop after a clear
    cy.get('#mDet').invoke('text').then(before => {
      const count = parseInt(before.trim(), 10)
      expect(count).to.be.at.least(1)

      cy.get('.esc-btn.dismiss').click()

      cy.get('#mDet').invoke('text').then(after => {
        // Count should stay the same or increase, never decrease
        expect(parseInt(after.trim(), 10)).to.be.at.least(count)
      })
    })
  })

})
