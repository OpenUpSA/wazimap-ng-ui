import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";
import {
    gotoTabularComparison,
    setupInterceptions,
    setupInterceptionsForSpecificGeo
} from "../common_cy_functions/general";
import profiles from "./profiles.json";
import profile from "./profile.json";
import geographies from './geographies.json';
import all_details_ec from "./all_details_ec.json";


Given('I am on the tabular comparison view', () => {
    setupInterceptions(profiles, null, profile, null, null);
    setupInterceptionsForSpecificGeo("EC", all_details_ec);
    gotoTabularComparison();
})

Then('I wait until view is ready', () => {
    cy.get('[data-testid=comparison-geographies]', {timeout: 20000}).should('be.visible');
})

When(/^I click on (\w+) autocomplete$/, (type) => {
   cy.get(`[data-testid=${type}-autocomplete]`).last().find('input').click();
})

Then('I assert initial click on dropdown', () => {
  cy.get('.MuiAutocomplete-popper').contains('Search for a place, e.g. municipality name');
})

Then(/^I search for (\w+) in (\w+) autocomplete$/, (value, type) => {
  if (type === "geography"){
    cy.intercept(`/api/v1/geography/search/8/*`, (req) => {
        req.reply({
            statusCode: 200,
            body: geographies.filter(obj => obj.name.toLowerCase().includes(value)),
            forceNetworkError: false // default
        })
    }).as('selectedgeo');
  }

  cy.get(`[data-testid=${type}-autocomplete]`).last().find('input').clear().type(value);
})

Then(/^I select ([\w ]+) in autocomplete dropdown$/, (value) => {
  cy.get(`.MuiAutocomplete-popper li[data-option-index='0']:contains(${value})`, {timeout: 20000}).click()
})

Then(/^I check if filters for indicator panel (\d+) is not visible/, (filterPanelId) => {
  cy.get(`[data-testid=filter-panel-${filterPanelId}]`).should('not.exist');
})

When('I click on add indicator', () => {
    cy.get('[data-testid=add-indicator]').click()
});

Then(/^I check if filters for indicator panel (\d+) is visible/, (filterPanelId) => {
  cy.get(`[data-testid=filter-panel-${filterPanelId}]`).should('exist');
})

Then(/^I check if filter row count for indicator panel (\d+) is (\d+)/, (filterPanelId, count) => {
   cy.get(`[data-testid=filter-panel-${filterPanelId}]`).find(".filter-row").should('have.length', count)
})

Then(/^I check "([^"]*)" selected for filter at index (\d+) of indicator panel (\d+) is "([^"]*)"/, (type, idx, filterPanelId, value) => {
   cy.get(`[data-testid='filter-panel-${filterPanelId}'] [data-testid='filter-row-${idx}'] [data-testid='${type}-dropdown'] div`).should('have.text', value);
})

Then(/^I assert value for index (\d+) column is "([^"]*)"/, (idx, val) => {
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(idx).should('have.text', val);
})

Then(/^I change "([^"]*)" dropdown for filter at index (\d+) of indicator panel (\d+) to "([^"]*)"/, (type, idx, filterPanelId, val) => {
   cy.get(`[data-testid='filter-panel-${filterPanelId}'] [data-testid='filter-row-${idx}'] [data-testid='${type}-dropdown']`).click().get(`ul > li[data-value="${val}"]`).click();
})