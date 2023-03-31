import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    collapseMyViewPanel,
    expandDataMapper,
    expandMyViewPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import profile from "./profile.json";
import profiles from "./profiles.json";
import profile_indicator_summary from "./profile_indicator_summary.json";
import profile_indicator_data from "./profile_indicator_data.json";
import themes from "./themes.json";
import categories from './categories.json';


Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, themes, {}, [], profile_indicator_summary, profile_indicator_data, categories);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When('I expand Data Mapper', () => {
    expandDataMapper();
})

When(/^I click on "([^"]*)" in Data Mapper$/, function (word) {
    cy.get('.data-mapper').findByText(word).click();
})

Then(/^I check if "([^"]*)" on Data Mapper is hidden$/, function (word) {
    cy.get('.data-mapper').findByText(word).should('not.exist')
})

Then(/^I check if "([^"]*)" on Data Mapper is visible/, function (word) {
    cy.get('.data-mapper').findByText(word).should('be.visible')
})

When('I expand My View Window', () => {
    expandMyViewPanel();
})

Then('I check if My View Window is visible', () => {
    cy.get('div[data-test-id="my-view-panel"]').should('be.visible');
})

When('I collapse My View Window', () => {
    collapseMyViewPanel();
})

Then('I check if My View Window is hidden', () => {
    cy.get('div[data-test-id="my-view-panel"]').should('not.be.visible');
})

When(/^I click on "([^"]*)" in My View$/, function (word) {
    cy.get('div[data-test-id="my-view-panel"]').findByText(word).click();
})

When(/^I click on "([^"]*)" in hidden indicator tree$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).click();
})

Then(/^I check hidden values text on "([^"]*)" is "([^"]*)"$/, function (word, text) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span').each(($div, idx) => {
        expect($div.text()).equal(text);
    });
})

Then(/^I check eye icon on "([^"]*)" indicator is visible$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span[data-test-id="eyeIcon"]').should('be.visible');
})

Then(/^I check eye icon on "([^"]*)" indicator is not visible$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span[data-test-id="eyeIcon"]').should('not.exist');
})

Then(/^I check eye close icon on "([^"]*)" indicator is visible$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span[data-test-id="eyeCloseIcon"]').should('be.visible');
})

Then(/^I check eye close icon on "([^"]*)" indicator is not visible$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span[data-test-id="eyeCloseIcon"]').should('not.exist');
})

Then(/^I click on eye icon on "([^"]*)" indicator$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span[data-test-id="eyeIcon"]').click();
})

Then(/^I click on eye close icon on "([^"]*)" indicator$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span[data-test-id="eyeCloseIcon"]').click();
})

When('I collapse Data Mapper', () => {
    collapseChoroplethFilterDialog();
})
