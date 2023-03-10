import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    expandDataMapper, expandPointMapper, expandRichDataPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import profiles from "./profiles.json";
import all_details from "./all_details.json";
import profile from "./profile.json";
import profile_indicator_summary from "./profile_indicator_summary.json";
import profile_indicator_data from "./profile_indicator_data.json";
import themes from "./themes.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, themes, {}, [], profile_indicator_summary, profile_indicator_data);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

Then('I confirm that the map watermark is visible', () => {
    cy.get('.map-watermark-wrapper .watermark-wrapper').should('be.visible');
})

Then('I confirm that the watermak links to the correct url', () => {
    cy.get('.map-watermark-wrapper .watermark-wrapper a').should('have.attr', 'href', 'https://wazimap.com/');
})

When('I expand Data Mapper', () => {
    expandDataMapper();
})

Then('I confirm that the data mapper watermark is visible', () => {
    cy.get('.data-mapper-content .watermark-wrapper').should('be.visible');
})

When(/^I click on "([^"]*)" in Data Mapper$/, function (word) {
    cy.get('.data-mapper').findByText(word).click();
})

When('I expand Point Mapper', () => {
    expandPointMapper();
})

Then('I confirm that the point mapper watermark is visible', () => {
    cy.get('.point-mapper-content .watermark-wrapper').should('be.visible');
})

When(/^I click on "([^"]*)" in Point Mapper$/, function (word) {
    cy.get('.point-mapper').findByText(word).click();
})

When('I expand Rich Data', () => {
    expandRichDataPanel();
})

Then('I confirm that the rich data watermark is visible', () => {
    cy.get('.rich-data .rich-data-nav .watermark-wrapper').should('be.visible');
})

When('I collapse Rich Data Nav', () => {
    cy.get('.rich-data-nav__toggle').click()
})

Then('I confirm that the rich data watermark is not visible', () => {
    cy.get('.rich-data .rich-data-nav .watermark-wrapper').should('not.be.visible');
})

When('I collapse Rich Data Panel', () => {
    cy.get('.rich-data-toggles .rich-data-panel__close').click();
})