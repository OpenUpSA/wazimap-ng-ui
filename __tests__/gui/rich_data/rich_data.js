import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";
import all_details from "../rich_data/all_details.json";

Given('I am on the Wazimap Homepage', () => {
    cy.visit("/")

    cy.intercept('/api/v1/all_details/profile/8/geography/ZA/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: all_details,
            forceNetworkError: false // default
        })
    })
})

When('I expand Rich Data', () => {
    cy.wait(100);
    cy.get('.point-mapper-toggles .rich-data-panel__open').click();
})

Then('Rich Data should be displayed', () => {
    cy.get('.rich-data-nav__list').should('be.visible');
})

When('I mouseover the hamburger menu', () => {
    cy.get('.hover-menu').first().trigger('mouseover');
})

Then('the hamburger menu should show', () => {
    cy.get('.hover-menu__content').should('be.visible');
})

When('I click on Save As Image in Rich Data', () => {
    cy.get('.hover-menu__content_item').first().click();
    cy.verifyDownload('Youth status.png');
})

