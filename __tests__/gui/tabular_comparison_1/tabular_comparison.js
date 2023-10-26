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
import all_details_wc from "./all_details_wc.json";


Given('I am on the tabular comparison view', () => {
    setupInterceptions(profiles, null, profile, null, null);
    setupInterceptionsForSpecificGeo("EC", all_details_ec);
    setupInterceptionsForSpecificGeo("WC", all_details_wc);
    gotoTabularComparison();
})

Then('I wait until view is ready', () => {
    cy.get('[data-testid=comparison-geographies]', {timeout: 20000}).should('be.visible');
})

When(/^I click on (\w+) autocomplete$/, (type) => {
   cy.get(`[data-testid=${type}-autocomplete]`).last().find('input').click();
})

Then('I assert no options in dropdown', () => {
  cy.get('.MuiAutocomplete-popper').contains('No options');
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

When('I click on add indicator', () => {
  cy.get('[data-testid=add-indicator]').click()
});

Then('I check result table', (type) => {
   cy.get(`[data-testid=result-table]`).find('th').eq(0).should('have.text', 'Geography');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).find('b').should('have.text', 'Language most spoken at home');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).find('[data-testid=filter-chip-0]').should('have.text', 'English');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).find('[data-testid=filter-chip-1]').should('have.text', '15-35 (ZA)');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(0).should('have.text', 'Eastern Cape');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.text', '119,035');
})

Then('I check result table after adding second indicator', (type) => {
   cy.get(`[data-testid=result-table]`).find('th').eq(0).should('have.text', 'Geography');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).find('b').should('have.text', 'Language most spoken at home');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).find('[data-testid=filter-chip-0]').should('have.text', 'English');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).find('[data-testid=filter-chip-1]').should('have.text', '15-35 (ZA)');
   cy.get(`[data-testid=result-table]`).find('th').eq(2).find('b').should('have.text', 'Employment status');
   cy.get(`[data-testid=result-table]`).find('th').eq(2).find('[data-testid=filter-chip-0]').should('have.text', 'Unemployed');
   cy.get(`[data-testid=result-table]`).find('th').eq(2).find('[data-testid=filter-chip-1]').should('have.text', '20-24');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(0).should('have.text', 'Eastern Cape');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.text', '119,035');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.css', 'background-color').and('eq', 'rgb(124, 162, 206)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.css', 'color').and('eq', 'rgb(51, 51, 51)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(2).should('have.text', '22.55%');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(2).should('have.css', 'background-color').and('eq', 'rgb(124, 162, 206)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(2).should('have.css', 'color').and('eq', 'rgb(51, 51, 51)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(2).should('have.attr', 'title').and('equal', '125,117');
})

Then(/^I clear the (\w+) autocomplete field/, (type) => {
   cy.get(`[data-testid=${type}-autocomplete]`).last().find('button').first().click();
})

Then('I check result table after adding second geography', (type) => {
   cy.get(`[data-testid=result-table]`).find('th').eq(0).should('have.text', 'Geography');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).find('b').should('have.text', 'Language most spoken at home');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).find('[data-testid=filter-chip-0]').should('have.text', 'English');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).find('[data-testid=filter-chip-1]').should('have.text', '15-35 (ZA)');
   cy.get(`[data-testid=result-table]`).find('th').eq(2).find('b').should('have.text', 'Employment status');
   cy.get(`[data-testid=result-table]`).find('th').eq(2).find('[data-testid=filter-chip-0]').should('have.text', 'Unemployed');
   cy.get(`[data-testid=result-table]`).find('th').eq(2).find('[data-testid=filter-chip-1]').should('have.text', '20-24');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(0).should('have.text', 'Eastern Cape');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.text', '119,035');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.css', 'background-color').and('eq', 'rgb(239, 243, 255)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.css', 'color').and('eq', 'rgb(51, 51, 51)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(2).should('have.text', '22.55%');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(2).should('have.css', 'background-color').and('eq', 'rgb(239, 243, 255)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(2).should('have.css', 'color').and('eq', 'rgb(51, 51, 51)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(0).should('have.text', 'Western Cape');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(1).should('have.text', '372,879');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(1).should('have.css', 'background-color').and('eq', 'rgb(8, 81, 156)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(1).should('have.css', 'color').and('eq', 'rgb(255, 255, 255)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(2).should('have.text', '23.13%');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(2).should('have.css', 'background-color').and('eq', 'rgb(8, 81, 156)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(2).should('have.css', 'color').and('eq', 'rgb(255, 255, 255)')
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(2).should('have.attr', 'title').and('equal', '127,300');
})