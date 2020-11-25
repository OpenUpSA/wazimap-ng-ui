import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";

Given('I am on the Wazimap Homepage', () => {
  cy.visit("/")
})

Then('Tutorial dialog box and Introduction should not be displayed', () => {
  cy.findByText("How to use Sandbox").should('not.exist')
})

when("I click back link", (link) => {
  cy.findByLabelText('previous slide').click()
})

when("I click on close", (link) => {
  cy.findByTestId("tutorial-close").click()
})

