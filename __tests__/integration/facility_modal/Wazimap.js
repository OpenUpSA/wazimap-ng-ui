import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";

When("I click on Point Mapper", (link) => {
    cy.find('.point-mapper-panel__open').click()
})

When('I click on Higher Education', () => {
    cy.findByText('Higher Education').click()
})

Given("Higher Education is visible", (word) => {
    cy.findByText('Higher Education', { timeout: 10000 }).should('be.visible');
})

Then('I wait for 5s', () => {
    cy.wait(20000);
})