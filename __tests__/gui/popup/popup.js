import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    collapseChoroplethFilterDialog, expandChoroplethFilterDialog,
    expandDataMapper, expandPointFilterDialog,
    gotoHomepage, hoverOverTheMapCenter,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import profiles from "./profiles.json";
import all_details from "./all_details.json";
import profile from "./profile.json";
import profile_indicator_summary from "./profile_indicator_summary.json";
import profile_indicator_data from "./profile_indicator_data.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, {}, {}, [], profile_indicator_summary, profile_indicator_data);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When('I expand Data Mapper', () => {
    expandDataMapper();
})

Then('Data Mapper should be displayed', () => {
    cy.get('.data-mapper-content__list').should('be.visible');
})

When(/^I click on "([^"]*)" in Data Mapper$/, function (word) {
    cy.get('.data-mapper').findByText(word).click();
});

When('I move the cursor', () => {
    cy.get('body')
        .trigger('mousemove', {clientX: 500, clientY: 358})
        .trigger('mousemove', {clientX: 120, clientY: 130});
})

When('I hover over the center of the map', () => {
    hoverOverTheMapCenter();
})

Then('I confirm that the tooltip is created with the correct text and the correct values if the choropleth method is sub-indicator', () => {
    cy.get('.leaflet-popup .map-tooltip__value .tooltip__value_label .truncate').should('have.text', 'Language most spoken at home (15-19)');
    cy.get('.leaflet-popup .tooltip-row-top').should('have.class', 'sub-indicator-type');
    cy.get('.leaflet-popup .map-tooltip__value .tooltip-row-top .tooltip__value_wrapper .tooltip__value_amount div').should('have.text', '258,782');
    cy.get('.leaflet-popup .tooltip-row-top .tooltip-label').should('have.text', 'or');

    cy.get('.leaflet-popup .tooltip-row-bottom').should('have.class', 'sub-indicator-type');
    cy.get('.leaflet-popup .map-tooltip__value .tooltip-row-bottom .tooltip__value_wrapper .tooltip__value_detail').should('have.text', '(10%)');
    cy.get('.leaflet-popup .tooltip-row-bottom .tooltip-label').should('have.text', 'of all categories');
})

Then('I confirm that the tooltip is created with the correct text and the correct values if the choropleth method is sibling', () => {
    cy.get('.leaflet-popup .map-tooltip__value .tooltip__value_label .truncate').should('have.text', 'Region of birth (Male)');
    cy.get('.leaflet-popup .tooltip-row-top').should('have.class', 'sibling-type');
    cy.get('.leaflet-popup .map-tooltip__value .tooltip-row-top .tooltip__value_wrapper .tooltip__value_amount div').should('have.text', '128,571');
    cy.get('.leaflet-popup .tooltip-row-top .tooltip-label').should('have.text', 'or');

    cy.get('.leaflet-popup .tooltip-row-bottom').should('have.class', 'sibling-type');
    cy.get('.leaflet-popup .map-tooltip__value .tooltip-row-bottom .tooltip__value_wrapper .tooltip__value_detail').should('have.text', '(5%)');
    cy.get('.leaflet-popup .tooltip-row-bottom .tooltip-label').should('have.text', 'of total for shaded areas');
})

Then('I confirm that the tooltip is created with the correct text and the label is hidden if the choropleth method is absolute', () => {
    cy.get('.leaflet-popup .map-tooltip__value .tooltip__value_label .truncate').should('have.text', 'Citizenship (Yes)');
    cy.get('.leaflet-popup .tooltip-row-top').should('have.class', 'absolute-type');
    cy.get('.leaflet-popup .map-tooltip__value .tooltip-row-top .tooltip__value_wrapper .tooltip__value_amount div').should('have.text', '948,765');
    cy.get('.leaflet-popup .tooltip-row-top .tooltip-label').should('be.hidden');
})