import '@testing-library/cypress/add-commands';

const PROFILES = {
  "Youth Explorer": "beta.youthexplorer.org.za",
  "GCRO": "gcro.openup.org.za"
}

Cypress.Commands.add('setSessionStorage', (key, value) => {
  cy.window().then((window) => {
    window.sessionStorage.setItem(key, value)
  })
})

Cypress.Commands.add('setProfile', (value) => {
  cy.window().then((window) => {
    window.sessionStorage.setItem("wazi-hostname", PROFILES[value])
  })
})
