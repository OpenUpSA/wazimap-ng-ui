import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";

Then('Tutorial dialog box and Introduction should not be displayed', () => {
  cy.findByText("How to use Sandbox").should('not.exist')
})

When("I click back link", (link) => {
  cy.findByLabelText('previous slide').click()
})

When("I click on close", (link) => {
  cy.findByTestId("tutorial-close").click()
})

