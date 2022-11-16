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

  cy.get(`[data-testid=${type}-autocomplete]`).last().find('input').type(value);
})

Then(/^I select ([\w ]+) in autocomplete dropdown$/, (value) => {
  cy.wait(1000);
  cy.get(".MuiAutocomplete-popper li[data-option-index='0']", {timeout: 20000}).contains(value).click()
})

When('I click on add indictor', () => {
  cy.get('[data-testid=add-indicator]').click()
});

Then('I check result table', (type) => {
   cy.get(`[data-testid=result-table]`).find('th').eq(0).should('have.text', 'Geography');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).should('have.text', 'Language most spoken at home : English');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(0).should('have.text', 'Eastern Cape');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.text', '301,909');
})

Then('I check result table after adding second indicator', (type) => {
   cy.get(`[data-testid=result-table]`).find('th').eq(0).should('have.text', 'Geography');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).should('have.text', 'Language most spoken at home : English');
   cy.get(`[data-testid=result-table]`).find('th').eq(2).should('have.text', 'Employment status : Unemployed');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(0).should('have.text', 'Eastern Cape');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.text', '301,909');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(2).should('have.text', '952,709');
})

Then(/^I clear the (\w+) autocomplete field/, (type) => {
   cy.get(`[data-testid=${type}-autocomplete]`).last().find('button').first().click();
})

Then('I check result table after adding second geography', (type) => {
   cy.get(`[data-testid=result-table]`).find('th').eq(0).should('have.text', 'Geography');
   cy.get(`[data-testid=result-table]`).find('th').eq(1).should('have.text', 'Language most spoken at home : English');
   cy.get(`[data-testid=result-table]`).find('th').eq(2).should('have.text', 'Employment status : Unemployed');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(0).should('have.text', 'Eastern Cape');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(1).should('have.text', '301,909');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(0).find('td').eq(2).should('have.text', '952,709');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(0).should('have.text', 'Western Cape');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(1).should('have.text', '928,895');
   cy.get(`[data-testid=result-table]`).find('tbody tr').eq(1).find('td').eq(2).should('have.text', '967,681');
})
