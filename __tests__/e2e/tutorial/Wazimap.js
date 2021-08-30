import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";

Given('I am on the Wazimap Homepage', () => {
  cy.visit("/")
})

When("I click on {word}", (link) => {
  cy.findByText(link).click()
})

Then("{string} should be displayed", (text) => {
  cy.findByText(text).should('exist')
})


Then('Tutorial dialog box and Introduction should not be displayed', () => {
  cy.findByText("How to use Sandbox").should('not.exist')
})

When("I click back link", (link) => {
  cy.findByLabelText('previous slide').click()
})

When("I click on close", (link) => {
  cy.findByTestId("tutorial-close").click()
})

