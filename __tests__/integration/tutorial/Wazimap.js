import { When, Given } from "cypress-cucumber-preprocessor/steps";

Given('I am on the Wazimap Homepage', () => {
  cy.visit("/")
})

When('I click on tutorial', () => {
  cy.findByText("Tutorial").click()
})

