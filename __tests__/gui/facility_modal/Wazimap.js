import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";

Then('I wait until map is ready', () => {
    cy.get('.map-location .location-tag .location-tag__name .truncate', {timeout: 20000}).should('contain', 'South Africa')
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

When('I click on a marker', () => {
    //click on the center of the window
    let navHeight = 56;
    let width = Cypress.config("viewportWidth");
    let height = Cypress.config("viewportHeight");
    let x = (width / 2);
    let y = (height / 2) + (navHeight / 2);
    cy.get('.leaflet-marker-pane .leaflet-zoom-animated')
        .trigger('mousemove', {clientX: 0, clientY: 0})
        .trigger('mousemove', {clientX: x, clientY: y});
    cy.get('.leaflet-marker-pane .leaflet-zoom-animated').click();
})

When('I click on the More info button', () => {
    cy.get('.leaflet-popup-content-wrapper .facility-tooltip__open-modal').click({force: true, multiple: true});
})

Then('Facility modal and Google maps button should be visible', () => {
    cy.get('.facility-info').should('be.visible');
    cy.get('.facility-info__view-google-map').should('be.visible');
    cy.get('.facility-info__view-google-map')
        .should('have.attr', 'href')
        .and('include', 'google.com/maps');
})

When('I switch to print view', () => {
    cy.task('activatePrintMediaQuery');
})

Then('I check if the print view is as expected', () => {
    cy.get('.facility-info').should('be.visible');
    cy.get('.rich-data').should('not.be.visible');
})