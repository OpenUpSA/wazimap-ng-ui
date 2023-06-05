import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    confirmChoroplethIsFiltered,
    expandChoroplethFilterDialog,
    expandDataMapper,
    gotoHomepage, selectChoroplethDropdownOption,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import profiles from "./profiles.json";
import all_details from "./all_details.json";
import profile from "./profile.json";
import profile_indicator_summary from "./profile_indicator_summary.json";
import profile_indicator_data from "./profile_indicator_data.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, [], {}, [], profile_indicator_summary, profile_indicator_data);
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
    cy.get('.data-mapper').findByText(word).click({force: true});
});

Then('I expand filter dialog', () => {
    expandChoroplethFilterDialog();
})

When(/^I filter by "([^"]*)"$/, function (filter) {
    const filters = filter.split(':');
    selectChoroplethDropdownOption(filters[0], 0);
    selectChoroplethDropdownOption(filters[1], 1);
});

Then(/^I confirm that the choropleth is filtered by "([^"]*)"$/, function (filter) {
    const filters = filter.split(':');
    confirmChoroplethIsFiltered(filters[0], filters[1], 0);
});