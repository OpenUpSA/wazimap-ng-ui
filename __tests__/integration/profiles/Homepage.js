import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";


const profiles = {
  "Youth Explorer": "beta.youthexplorer.org.za",
  "GCRO": "gcro.openup.org.za"
}

Given('I am on the {string} Homepage', (profile) => {
  window.sessionStorage.setItem("wazi-hostname", profiles[profile])
  cy.visit("/")
})

Then('I should see a Geography in the breadcrumps', () => {
  cy.get(".map-location__tags .location-tag__name").should('not.contain', 'Loading...')
})

Then('I should see a title in the Rich Data View', () => {
  cy.get(".location__title h1").should('not.be.empty')
})

