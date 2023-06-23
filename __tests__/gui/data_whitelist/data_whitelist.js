import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    confirmChartIsFiltered,
    confirmChoroplethIsFiltered,
    confirmDropdownOptions,
    expandChoroplethFilterDialog,
    expandDataMapper,
    expandRichDataPanel,
    gotoHomepage,
    selectChoroplethDropdownOption,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import profiles from "./profiles.json";
import all_details from "./all_details.json";
import profile from "./profile.json";
import themes from "./themes.json";
import profile_indicator_summary from "./profile_indicator_summary.json";
import profile_indicator_data from "./profile_indicator_data.json";

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

Then(/^I confirm that the choropleth is filtered by "([^"]*)" at index (\d+)$/, function (filter, index) {
    const filters = filter.split(':');
    confirmChoroplethIsFiltered(filters[0], filters[1], index);
});

When(/^I filter by "([^"]*)"$/, function (filter) {
    selectChoroplethDropdownOption(filter, 0);
});

When('I click on the second filter dropdown', () => {
    cy.get('.mapping-options__filter_menu:visible').eq(1).click();
})

Then(/^I check if the filter options are "([^"]*)"$/, (arr) => {
    confirmDropdownOptions(arr);
});

When('I expand Rich Data Panel', () => {
    expandRichDataPanel();
})

Then(/^I confirm that "([^"]*)" is applied to "([^"]*)"$/, function (filter, chartTitle) {
    const filters = filter.split(':');
    confirmChartIsFiltered(filters[0], filters[1], chartTitle);
});

Given('I am on the Wazimap Homepage Test View', () => {
    setupInterceptions(profiles, all_details, profile, themes, {}, [], profile_indicator_summary, profile_indicator_data);
    cy.visit("/?view=test");
})

When(/^I confirm that available subindicators are "([^"]*)" in Data Mapper$/, function (options) {
    let optionsArr = options.split(',');
    cy.get('.data-mapper').find('.subIndicator-item').should('have.length', optionsArr.length)
    cy.get('.subIndicator-item').each(($div, index) => {
        expect($div.text()).equal(optionsArr[index]);
    })
});