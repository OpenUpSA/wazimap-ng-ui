import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    collapseMyViewPanel,
    expandChoroplethFilterDialog,
    expandDataMapper,
    expandMyViewPanel,
    expandRichDataPanel,
    gotoHomepage,
    mapBottomItems,
    selectChoroplethDropdownOption,
    selectChartDropdownOption,
    setupInterceptions,
    waitUntilGeographyIsLoaded,
    collapseChoroplethFilterDialog,
    confirmChoroplethIsFiltered,
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import profile from "./profile.json";
import profiles from "./profiles.json";
import categories from "./categories.json";
import profile_indicator_summary from "./profile_indicator_summary.json";
import profile_indicator_data from "./profile_indicator_data.json";
import themes from "./themes.json";


Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(
        profiles, all_details, profile, themes, {}, [],
        profile_indicator_summary, profile_indicator_data, categories
    );
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

When(/^I select "([^"]*)" from indicator dropdown in filter dialog on row "([^"]*)"$/, function (word, index) {
    selectChoroplethDropdownOption(word, 0, index);
});

When(/^I select "([^"]*)" from subIndicator dropdown in filter dialog on row "([^"]*)"$/, function (word, index) {
    selectChoroplethDropdownOption(word, 1, index);
});

When(/^I select "([^"]*)" from indicator dropdown in chart filter/, function (word) {
    selectChartDropdownOption(word, 0);
});

When(/^I select "([^"]*)" from subIndicator dropdown in chart filter/, function (word) {
    selectChartDropdownOption(word, 1);
});

Then(/^I confirm that the choropleth is filtered by "([^"]*)" at index (\d+)$/, function (filter, index) {
    const filters = filter.split(':');
    confirmChoroplethIsFiltered(filters[0], filters[1], index);
});

When('I expand My View Window', () => {
    expandMyViewPanel();
})

When('I collapse My View Window', () => {
    collapseMyViewPanel();
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

Then("I confirm that there are no filters in my view panel", function () {
    cy.get('div[data-test-id="filtered-indicator-card"]').should("have.length", 0)
});

When('I expand Rich Data Panel', () => {
    expandRichDataPanel();
});

Then(/^I confirm that the chart is not filtered$/, function () {
    // cy.get('.rich-data-content .profile-indicator__filter-row:visible:eq(0)').should('have.length', 1);
    cy.get('.rich-data-content .profile-indicator__filter-row:visible:eq(0) .profile-indicator__filter')
        .eq(0)
        .find('div.MuiSelect-select em')
        .should('have.text', 'Select an attribute');
    cy.get('.rich-data-content .profile-indicator__filter-row:visible:eq(0) .profile-indicator__filter').eq(1).should('have.class', 'disabled');
});

Then(/^I confirm that the chart is filtered by "([^"]*)" at index (\d+)$/, function (filter, index) {
    const filters = filter.split(':');
    // cy.get(`.rich-data-content .profile-indicator:visible:eq(0) .profile-indicator__filter-row:visible:eq(${index})`).find(input).value().should('have.length', 1);
    cy.get(`.rich-data-content .profile-indicator:visible:eq(0) .profile-indicator__filter-row:visible:eq(${index}) .profile-indicator__filter`)
        .eq(0)
        .find('input')
        .should('have.value', filters[0]);
    cy.get(`.rich-data-content .profile-indicator:visible:eq(0) .profile-indicator__filter-row:visible:eq(${index}) .profile-indicator__filter`)
        .eq(1)
        .find('input')
        .should('have.value', filters[1]);
    cy.get(`.rich-data-content .profile-indicator:visible:eq(0) .profile-indicator__filter-row:visible:eq(${index}) .profile-indicator__filter`)
        .eq(1)
        .should('not.have.class', 'disabled');
});

When('I collapse Rich Data Panel', () => {
    cy.get('.rich-data-toggles .rich-data-panel__close').click();
})

When("I go back in browser history", () => {
    cy.go("back");
});

When("I go forward in browser history", () => {
    cy.go("forward");
});

When('I collapse Data Mapper', () => {
    collapseChoroplethFilterDialog();
})

Then('I add new filter', () => {
    cy.get(`${mapBottomItems} .map-options .mapping-options__add-filter`).click();
})

Then(/^I click on "([^"]*)" in hidden indicator tree$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).click();
})

Then(/^I click on eye icon on "([^"]*)" indicator$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span[data-test-id="eyeIcon"]').click();
})

Then(/^I check if "([^"]*)" on Data Mapper is hidden$/, function (word) {
    cy.get('.data-mapper').findByText(word).should('not.exist')
})

Then(/^I check if "([^"]*)" on Data Mapper is visible/, function (word) {
    cy.get('.data-mapper').findByText(word).should('be.visible')
})

Then(/^I check hidden values text on "([^"]*)" is "([^"]*)"$/, function (word, text) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span').each(($div, idx) => {
        expect($div.text()).equal(text);
    });
})

Then(/^I click on eye icon on "([^"]*)" indicator$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span[data-test-id="eyeIcon"]').click();
})

Then(/^I confirm category "([^"]*)" at position (\d+) is "([^"]*)"$/, function (word, idx, type) {
    cy.get(`.category-header__title:${type}:eq(${idx}) .cc-clear`).should("have.text", word);
});

Then(/^I confirm subcategory "([^"]*)" at position (\d+) is "([^"]*)"$/, function (word, idx, type) {
    cy.get(`.sub-category-header__title:${type}:eq(${idx}) .cc-clear`).should("have.text", word);
});

Then(/^I confirm indicator "([^"]*)" at position (\d+) is "([^"]*)"$/, function (word, idx, type) {
    cy.get(`.profile-indicator__title:${type}:eq(${idx}) h4`).should("have.text", word);
});