# CCTV AI Dashboard — Cypress Test Suite

E2E tests for the CCTV AI Gun Detection Dashboard.

## Test Coverage

| File | What it tests |
|---|---|
| `threat-detection.cy.js` | Badge updates, bounding box, alert list, log, toast when firearm detected |
| `escalation.cy.js` | Detection counter increments, Notify Police increments Escalated counter |
| `mark-as-clear.cy.js` | Dismiss resets badge, overlay, system status, alerts list, coord display |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start your dashboard
In a separate terminal, serve your `index.html`:
```bash
cd ../cctv-dashboard
npx serve .
```
Make sure it's running on `http://localhost:3000`.  
If using GitHub Codespaces, update `baseUrl` in `cypress.config.js` to your Codespaces port URL.

### 3. Run the tests

**Headless (CI/terminal):**
```bash
npm test
```

**Interactive mode (recommended for development):**
```bash
npm run test:open
```

**Run a single suite:**
```bash
npm run test:threat
npm run test:escalation
npm run test:clear
```

## Codespaces Note

If running in GitHub Codespaces, update `baseUrl` in `cypress.config.js`:
```js
baseUrl: 'https://YOUR-CODESPACE-NAME-3000.app.github.dev'
```
You can find this URL in the **Ports** tab in VS Code.

## Important: Expose `triggerDetection` on window

The `injectThreat` custom command calls `window.triggerDetection()` directly so tests
don't have to wait for the random mock server timer. Make sure your `index.html` has
this at the end of the `<script>` block:

```js
// Expose for Cypress testing
window.triggerDetection = triggerDetection;
```
