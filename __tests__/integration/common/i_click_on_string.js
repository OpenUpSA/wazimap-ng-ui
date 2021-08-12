import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";

When("I click on {word}", (link) => {
  cy.findByText(link).click()
})

Then("{string} should be displayed", (text) => {
  cy.findByText(text).should('exist')
})
