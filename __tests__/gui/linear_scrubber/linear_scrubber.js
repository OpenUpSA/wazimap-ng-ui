import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    expandChoroplethFilterDialog,
    expandDataMapper,
    gotoHomepage, mapBottomItems,
    setupInterceptions,
    waitUntilGeographyIsLoaded,
    selectChoroplethDropdownOption
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import profiles from "./profiles.json";
import profile from './profile.json';
import profile_indicator_summary from './profile_indicator_summary.json';
import profile_indicator_data from './profile_indicator_data.json'

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, [], [], [], profile_indicator_summary, profile_indicator_data);
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

Then('I select an indicator', () => {
  cy.get('li[data-test-id="datamapper-subcategory-3"]').click();
  cy.get('li[data-test-id="datamapper-indicator-927"]').click();
  cy.get('li[data-test-id="datamapper-subindicator-927-Black african"]').click();
})

Then('I check if scrubber is visible', () => {
    cy.get('.map-options__linear_scrubber_wrap .MuiSlider-root').should('be.visible');
})

Then('I check number of marks on scrubber', () => {
    cy.get('.MuiSlider-root .MuiSlider-mark ').should('have.length', 4)
})

Then('I check if Black African is selected on scrubber', () => {
    cy.get('.MuiSlider-root .MuiSlider-thumb input').should('have.attr', 'aria-valuenow', '2');
})

When('I click on next mark', () => {
    cy.get('.MuiSlider-root .MuiSlider-mark').last().click();
})

Then('I check if White is selected on scrubber', () => {
    cy.get('.MuiSlider-root .MuiSlider-thumb input').should('have.attr', 'aria-valuenow', '3');
})

Then('I check if White is selected on scrubber', () => {
    cy.get('.MuiSlider-root .MuiSlider-thumb input').should('have.attr', 'aria-valuenow', '3');
})

Then('I check if mapchip title name is changed', () => {
    cy.get(`${mapBottomItems} .map-options .filter__header_sub-indicator .filters__header_name div`).should('have.text', 'Population group (White)')
})

When('I select next indicator', () => {
    cy.get('li[data-test-id="datamapper-subcategory-4"]').click();
    cy.get('li[data-test-id="datamapper-indicator-840"]').click();
    cy.get('li[data-test-id="datamapper-subindicator-840-Black African"]').click();
})

Then('I check if scrubber is not visible', () => {
    cy.get('.map-options__linear_scrubber_wrap div').should('be.empty');
})

When('I select Population indicator and White subindicator', () => {
  cy.get('li[data-test-id="datamapper-subindicator-927-White"]').click();
})

Then('I select Black african subindicator', () => {
    cy.get('li[data-test-id="datamapper-subindicator-927-Black african"]').click();
})

Then('I expand choropleth filter dialog', () => {
    expandChoroplethFilterDialog();
})

Then('I apply filters', () => {
    selectChoroplethDropdownOption('sex', 0);
    selectChoroplethDropdownOption('Male', 1)
})

Then('I check if filters are still applied', () => {
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible .mapping-options__filter`)
        .eq(0)
        .should('contain.text', 'sex');

    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible .mapping-options__filter`)
        .eq(1)
        .should('contain.text', 'Male');
})
