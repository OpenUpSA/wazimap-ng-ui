import { Given } from "cypress-cucumber-preprocessor/steps";

Given('I am on the {string} Homepage', (profile) => {
  cy.setProfile(profile);
  cy.visit("/")
})
