import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    collapseMyViewPanel,
    confirmNoChartFilterSelected,
    confirmNoChoroplethFilterSelected,
    expandChoroplethFilterDialog,
    expandDataMapper,
    expandMyViewPanel,
    expandRichDataPanel,
    gotoHomepage,
    mapBottomItems,
    selectChoroplethDropdownOption,
    selectChartDropdownOption,
    setupInterceptions,
    waitUntilGeographyIsLoaded, confirmChoroplethIsFiltered
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import profile from "./profile.json";
import profiles from "./profiles.json";
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

When('I expand Data Mapper', () => {
    expandDataMapper();
})

When(/^I click on "([^"]*)" in Data Mapper$/, function (word) {
    cy.get('.data-mapper').findByText(word).click();
})

When('I expand the filter dialog', () => {
    expandChoroplethFilterDialog();
})

When('I confirm that there are no filters in filter dialog', () => {
    confirmNoChoroplethFilterSelected();
})

When(/^I select "([^"]*)" from indicator dropdown in filter dialog$/, function (word) {
    selectChoroplethDropdownOption(word, 0);
});

When(/^I select "([^"]*)" from subIndicator dropdown in filter dialog$/, function (word) {
    selectChoroplethDropdownOption(word, 1);
});

When(/^I select "([^"]*)" from indicator dropdown in chart filter/, function (word) {
    // selectChartDropdownOption(word, 0);
    cy.get(".rich-data-content .filter-container:visible:eq(0) .profile-indicator__filter").eq(0).find('.MuiSelect-select').then($button => {
      $button.css('border', '4px solid magenta');
    // console.log($button);
      $button.click();
    })
    // cy.wait(2000);
    // cy.get(".rich-data-content .filter-container:visible:eq(0) .profile-indicator__filter").eq(0).click()
});

When(/^I select "([^"]*)" from subIndicator dropdown in chart filter/, function (word) {
    selectChartDropdownOption(word, 1);
});

Then(/^I confirm that the choropleth is filtered by "([^"]*)"$/, function (filter) {
    const filters = filter.split(':');
    confirmChoroplethIsFiltered(filters[0], filters[1], 0);
});

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

Then(/^I confirm that there is an indicator filter for "([^"]*)" at index (\d+)$/, function (filter, index) {
    const filters = filter.split(':');
    cy.get('div[data-test-id="filtered-indicator-card"]')
        .each(($el, i) => {
            if (i === index) {
                cy.wrap($el)
                    .should('contain.text', filters[0])
                    .should('contain.text', filters[1])
                    .should('contain.text', filters[2])
                    .should('contain.text', filters[3])
            }
        })
});

Then(/^I remove the indicator filter at index (\d+)$/, function (index) {
    cy.get('div[data-test-id="filtered-indicator-card"]')
        .eq(index)
        .find('button[data-test-id="filtered-indicator-remove-button"]')
        .click();
});

When('I expand Rich Data Panel', () => {
    expandRichDataPanel();
});

Then(/^I confirm that the chart is not filtered$/, function () {
    confirmNoChartFilterSelected();
});

When('I collapse Rich Data Panel', () => {
    cy.get('.rich-data-toggles .rich-data-panel__close').click();
})
