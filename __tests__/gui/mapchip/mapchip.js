import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    checkIfChoroplethFilterDialogIsCollapsed,
    collapseChoroplethFilterDialog,
    expandChoroplethFilterDialog,
    expandDataMapper,
    gotoHomepage, mapBottomItems,
    setupInterceptions,
    waitUntilGeographyIsLoaded
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
  cy.get('.indicator-subcategory').contains('Population (2016 Community Survey)').click();
  cy.get('.indicator-item').contains('Population group').click();
  cy.get('.subIndicator-item').contains('Black african').click();
})

Then('I check if the choropleth filter dialog is collapsed', () => {
    checkIfChoroplethFilterDialogIsCollapsed();
})

Then('I check if choropleth legend is displayed', () => {
    cy.get(`${mapBottomItems} .map-options .map-options__legend`).should('be.visible');
})

Then('I check if description icon is visible', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_info`).should('be.visible');
})

Then('I check if tooltip is displayed on hover over description icon', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_info`).trigger('mouseover');
    cy.get('.ui-tooltip').should('be.visible');
    cy.get('.ui-tooltip-content').should('have.text', 'Show Description');
    cy.get(`${mapBottomItems} .map-options .filters__header_info`).trigger('mouseout');
})

Then('I check filters applied label is visible', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('be.visible');
})

Then('I check if tooltip is displayed on hover over applied filters label', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).trigger('mouseover');
    cy.get('.ui-tooltip').should('be.visible');
    cy.get('.ui-tooltip-content').should('have.text', 'Show Applied Filters');
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).trigger('mouseout');
})

Then('I check applied filter label text', () => {
    cy.get(`${mapBottomItems} #selected_filter_count`).should('have.text', '0');
    cy.get(`${mapBottomItems} #total_filter_count`).should('have.text', '2');
})

Then('I check applied filters does not have notification badge', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('not.have.class', 'notification-badges');
})

When('I expand the choropleth filter dialog', () => {
    expandChoroplethFilterDialog();
})

Then('I check filters applied label is hidden', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('not.be.visible');
})

Then('I check if there is description', () => {
    cy.get(`${mapBottomItems} .map-options .map-option__context_text div`).invoke('text').then((text) => {
        expect(text.length).to.be.at.least(1)
    })
})

Then('I select a filter', () => {
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:last .mapping-options__filter:first`).click();
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:last .mapping-options__filter:first .dropdown__list_item:last`).click();
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:last .mapping-options__filter:last`).click();
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:last .mapping-options__filter:last .dropdown__list_item:last`).click();

})


When('I collapse the choropleth filter dialog', () => {
    collapseChoroplethFilterDialog();
})

Then('I recheck filters applied label is visible', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('be.visible');
})

Then('I recheck applied filter label text', () => {
    cy.get(`${mapBottomItems} #selected_filter_count`).should('have.text', '1');
    cy.get(`${mapBottomItems} #total_filter_count`).should('have.text', '2');
})

When('I click on Economic Opportunities in Data Mapper', function () {
    cy.get('.data-mapper').findByText("Economic Opportunities").click();
});

Then('I select another indicator', () => {
    cy.get('.indicator-subcategory').contains('NEET Status').click();
    cy.get('.indicator-item').contains('Not in Employment').click();
    cy.get('.subIndicator-item').contains('Employed').click();
})

Then('I check if snackbar is visible', () => {
    cy.get(`.SnackbarContainer-root`).should('be.visible');
})

Then('I wait for snackbar to disappear', () => {
    cy.wait(10000);
})

Then('I check if snackbar is not visible', () => {
    cy.get(`.SnackbarContainer-root`).should('not.exist');
})

Then('I recheck if the choropleth filter dialog is collapsed', () => {
    checkIfChoroplethFilterDialogIsCollapsed();
})

Then('I recheck filters applied label is visible', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('be.visible');
})

Then('I recheck again applied filter label text', () => {
    cy.get(`${mapBottomItems} #selected_filter_count`).should('have.text', '1');
    cy.get(`${mapBottomItems} #total_filter_count`).should('have.text', '3');
})

Then('I check applied filters show notification badge', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('have.class', 'notification-badges');
})

When('I click on the choropleth filter dialog', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).click()
})

Then('I check filters applied label is hidden', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('not.be.visible');
})

Then('I check if there is no description', () => {
    cy.get(`${mapBottomItems} .map-options .map-option__context_text div`).invoke('text').then((text) => {
        expect(text.length).to.be.equal(0)
    })
})


When('I collapse the choropleth filter dialog', () => {
    collapseChoroplethFilterDialog();
})

Then('I recheck filters applied label is visible', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('be.visible');
})

Then('I check applied filters does not have notification badge', () => {
    cy.get(`${mapBottomItems} .map-options .filters__header_label`).should('not.have.class', 'notification-badges');
})
