import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";

Given('I am on the Wazimap Homepage', () => {
    cy.visit("/")
})