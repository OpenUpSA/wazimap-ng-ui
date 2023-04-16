import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";
import {
    checkIfCategoriesAreDisplayed, clickOnTheFirstCategory,
    clickOnTheFirstTheme, expandPointMapper,
    gotoHomepage, hoverOverTheMapCenter,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import profile from "./profile.json";
import profiles from "./profiles.json";
import themes from "./themes.json";
import points from "./points.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, themes, points);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When('I click on a theme', () => {
    cy.wait(1000);
    clickOnTheFirstTheme();
})

Then('categories should be displayed', () => {
    checkIfCategoriesAreDisplayed();
})

When('I click on a category', () => {
    clickOnTheFirstCategory();
})

When('I click on a marker', () => {
    //click on the center of the window
    hoverOverTheMapCenter().then(() => {
        cy.get('.leaflet-marker-pane .leaflet-zoom-animated').click({force: true});
    })
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

Then('I expand Point Mapper', () => {
    expandPointMapper();
})

When('I exit print view', () => {
    cy.task('resetCRI')
})

Then('I confirm that empty values are not displayed in the facility modal', () => {
    cy.get('.facility-info .facility-info__items .facility-info__item_label').each($label => {
        cy.wrap($label).should('not.have.text', 'empty value');
        cy.wrap($label).should('not.have.text', 'null value');
    })
})