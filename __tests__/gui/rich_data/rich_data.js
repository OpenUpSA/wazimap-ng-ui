import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";
import all_details from "../rich_data/all_details.json";


When('I expand Rich Data', () => {
    cy.wait(100);
    cy.get('.point-mapper-toggles .rich-data-panel__open').click();
})

Then('Rich Data should be displayed', () => {
    cy.get('.rich-data-nav__list').should('be.visible');
})

When('I mouseover the hamburger menu', () => {
    cy.get('.hover-menu').invoke('show')
})

Then('The hamburger menu should show', () => {
    cy.get('.hover-menu').should('be.visible');
})

When('I click on {word} in Data Mapper', () => {
    cy.get('.hover-menu__content_item').contains('Save As Image').click();
})

