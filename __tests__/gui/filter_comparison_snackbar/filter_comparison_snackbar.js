import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    checkIfChoroplethFilterDialogIsCollapsed,
    collapseChoroplethFilterDialog,
    expandChoroplethFilterDialog,
    expandDataMapper,
    gotoHomepage, mapBottomItems,
    setupInterceptions,
    waitUntilGeographyIsLoaded,
    selectChoroplethDropdownOption,
    gotoProfileViewHomepage
} from "../common_cy_functions/general";
import all_details from "./default/all_details.json";
import profiles from "./default/profiles.json";
import profile from './default/profile.json';
import profile_indicator_summary from './default/profile_indicator_summary.json';
import na_profile_indicator_summary from './non_aggregatable_filters/profile_indicator_summary.json';
import profile_indicator_data from './default/profile_indicator_data.json';
import pdf_profile from './profile_default_filters/profile.json';

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, [], [], [], profile_indicator_summary, profile_indicator_data);
    gotoHomepage();
})

Given('I am on the Wazimap Homepage for testing non aggregatable filters', () => {
    setupInterceptions(profiles, all_details, profile, [], [], [], na_profile_indicator_summary, profile_indicator_data);
    gotoHomepage();
})

Given('I am on the Wazimap Homepage for testing profile views default filters', () => {
    setupInterceptions(profiles, all_details, pdf_profile, [], [], [], profile_indicator_summary, profile_indicator_data);
    gotoProfileViewHomepage("youth");
})

Given('I am on the Wazimap Homepage for testing profile default filters', () => {
    setupInterceptions(profiles, all_details, pdf_profile, [], [], [], profile_indicator_summary, profile_indicator_data);
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

When('I expand the filter dialog', () => {
    expandChoroplethFilterDialog();
})

When('I collapse filter dialog', () => {
    collapseChoroplethFilterDialog();
})

When(/^I click on "([^"]*)" in Data Mapper$/, function (word) {
    cy.get('.data-mapper').findByText(word).click();
})

Then('I check if snackbar is not visible', () => {
    cy.get(`.SnackbarContainer-root`).should('not.exist');
})

Then('I check if snackbar is visible', () => {
    cy.get(`.SnackbarContainer-root`).should('be.visible');
})

Then('I click on snackbar to hide it', () => {
    cy.get('#notistack-snackbar').click();
})

Then(/^I check applied filter label text is "([^"]*)" of "([^"]*)" applied$/, (first, second) => {
    cy.get(`${mapBottomItems} #selected_filter_count`).should('have.text', first);
    cy.get(`${mapBottomItems} #total_filter_count`).should('have.text', second);
})

Then('I check applied filters does not have notification badge', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('not.have.class', 'notification-badges');
})

Then('I check applied filters show notification badge', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('have.class', 'notification-badges');
})

When(/^I select "([^"]*)" from indicator dropdown in filter dialog on row "([^"]*)"$/, function (word, index) {
    selectChoroplethDropdownOption(word, 0, index);
});

When(/^I select "([^"]*)" from subIndicator dropdown in filter dialog on row "([^"]*)"$/, function (word, index) {
    selectChoroplethDropdownOption(word, 1, index);
});
