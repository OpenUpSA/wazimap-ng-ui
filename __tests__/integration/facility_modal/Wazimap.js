import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";

Then('I wait until map is ready', () => {
    cy.get('.location-tag .location-tag__name .truncate', {timeout: 20000}).should('contain', 'South Africa')
})

When('I click on a theme', () => {
    cy.get('.point-mapper .point-mapper-content__list .point-mapper__h1').first().click();
})

Then('categories should be displayed', () => {
    cy.get('.point-mapper .point-mapper-content__list .point-mapper__h1 .point-mapper__h1_content').should('be.visible');
})

When('I click on a category', () => {
    cy.get('.point-mapper .point-mapper-content__list .point-mapper__h1 .point-mapper__h1_content .point-mapper__h2_wrapper .point-mapper__h2').first().click();
})

Then('I wait for 2s', () => {
    cy.wait(2000);
})

When('I click on a marker', () => {
   
})