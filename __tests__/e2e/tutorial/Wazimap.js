import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";
import {waitUntilGeographyIsLoaded} from "../../gui/common_cy_functions/general";

Given('I am on the Wazimap Homepage', () => {
  cy.visit("/")
})

Then('I wait until map is ready', () => {
  waitUntilGeographyIsLoaded('South Africa');
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

When("I click on close button", (link) => {
  cy.findByTestId("tutorial-close").click()
})

