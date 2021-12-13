import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";
import all_details from "../rich_data/all_details.json";
import {gotoHomepage, setupInterceptions, waitUntilGeographyIsLoaded} from "../common_cy_functions/general";
import profiles from "../rich_data/profiles.json";
import profile from "../rich_data/profile.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, null, null);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa');
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
    cy.get('.hover-menu__content_item').first().click({force: true});
    cy.verifyDownload('chart.png');
})

When('I scroll to bottom of the page', () => {
    cy.scrollTo('bottom')
})

Then(/^I check if "([^"]*)" is active$/, function (word) {
    cy.get(`.rich-data-nav__item.w-inline-block[title="${word}"]`).should('have.class', 'w--current');
});

Then('None of the menu items should be active', () => {
    cy.get('.rich-data-nav__item.w--current').should('have.length', 0);
})

When('I close the Rich Data', ()=>{
    cy.get('.rich-data-toggles .point-mapper-panel__open').click();
})