import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";

Then('I should see a Geography in the breadcrumps', () => {
  cy.get(".map-location__tags .location-tag__name", { timeout: 100000 }).should('not.contain', 'Loading...')
})

Then('I should see a title in the Rich Data View', () => {
  cy.get(".location__title h1", { timeout: 100000 }).should('not.be.empty')
})

