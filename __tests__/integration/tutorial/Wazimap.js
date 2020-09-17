import { When, Given, THen } from "cypress-cucumber-preprocessor/steps";

Given('I am on the Wazimap Homepage', () => {
  cy.visit("/")
})

Then('Tutorial dialog box and Introduction should be displayed', () => {
  cy.findByText("Introduction:").should('exist')
})
