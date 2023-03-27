import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint,
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
    waitUntilGeographyIsLoaded,
    collapseChoroplethFilterDialog,
    setupInterceptionsForSpecificGeo,
    closeChoroplethFilterDialog
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import profile from "./profile.json";
import profiles from "./profiles.json";
import categories from "./categories.json";
import profile_indicator_summary from "./profile_indicator_summary.json";
import profile_indicator_data from "./profile_indicator_data.json";
import themes from "./themes.json";
import all_details_WC from "./WC/all_details.json";
import profile_indicator_summary_WC from './WC/profile_indicator_summary.json';
import profile_indicator_data_WC from './WC/profile_indicator_data.json';


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

When('I close the filter dialog', () => {
    closeChoroplethFilterDialog();
})

When('I confirm that there are no filters in filter dialog', () => {
    confirmNoChoroplethFilterSelected();
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

When("I remove filter from mapchip", function () {
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(1)`).should('have.length', 1);
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(1) .mapping-options__remove-filter:visible`).click();
});

Then(/^I confirm that the choropleth is filtered by "([^"]*)" at index (\d+)$/, function (filter, index) {
    const filters = filter.split(':');
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${index})`).should('have.length', 1);
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${index}) .mapping-options__filter`)
        .eq(0)
        .find(' .dropdown-menu__selected-item .truncate')
        .should('have.text', filters[0]);
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${index}) .mapping-options__filter`)
        .eq(1)
        .find(' .dropdown-menu__selected-item .truncate')
        .should('have.text', filters[1]);
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${index}) .mapping-options__filter`)
        .eq(1)
        .should('not.have.class', 'disabled');
});

Then("I visit current url", () => {
    cy.url().then(($url) => {
        cy.visit($url);
    });
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

Then("I confirm that there are no filters in my view panel", function () {
    cy.get('div[data-test-id="filtered-indicator-card"]').should("have.length", 0)
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
    cy.get('.rich-data-content .profile-indicator__filter-row:visible:eq(0)').should('have.length', 1);
    cy.get('.rich-data-content .profile-indicator__filter-row:visible:eq(0) .profile-indicator__filter')
        .eq(0)
        .find(' .dropdown-menu__selected-item .truncate')
        .should('have.text', 'Select an attribute');
    cy.get('.rich-data-content .profile-indicator__filter-row:visible:eq(0) .profile-indicator__filter').eq(1).should('have.class', 'disabled');
});

Then(/^I confirm that the chart is filtered by "([^"]*)" at index (\d+)$/, function (filter, index) {
    const filters = filter.split(':');
    cy.get(`.rich-data-content .profile-indicator:visible:eq(0) .profile-indicator__filter-row:visible:eq(${index})`).should('have.length', 1);
    cy.get(`.rich-data-content .profile-indicator:visible:eq(0) .profile-indicator__filter-row:visible:eq(${index}) .profile-indicator__filter`)
        .eq(0)
        .find(' .dropdown-menu__selected-item .truncate')
        .should('have.text', filters[0]);
    cy.get(`.rich-data-content .profile-indicator:visible:eq(0) .profile-indicator__filter-row:visible:eq(${index}) .profile-indicator__filter`)
        .eq(1)
        .find(' .dropdown-menu__selected-item .truncate')
        .should('have.text', filters[1]);
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

When('I navigate to WC', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/WC/?version=test&skip-children=true&format=json`, (request) => {
        let tempObj = JSON.parse(JSON.stringify(all_details_WC));
        tempObj.boundary.properties.code = 'WC';
        tempObj.profile.geography.code = 'WC';

        request.reply({
            statusCode: 200,
            body: tempObj,
            forceNetworkError: false // default
        })
    });

    cy.intercept(`/api/v1/profile/8/geography/WC/profile_indicator_summary/?version=test&format=json`, (request) => {
        let tempObj = JSON.parse(JSON.stringify(profile_indicator_summary_WC));

        request.reply({
            statusCode: 200,
            body: tempObj,
            forceNetworkError: false // default
        })
    });

    cy.intercept('api/v1/profile/8/geography/WC/themes_count/?version=test&format=json', (req) => {
        req.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile/8/geography/WC/indicator/**/child_data/', (request) => {
        let tempObj = JSON.parse(JSON.stringify(profile_indicator_data_WC));
        request.reply({
            statusCode: 200,
            body: tempObj,
            forceNetworkError: false // default
        });
    })

    cy.visit('/#geo:WC');
})

Then('I wait until map is ready for Western Cape', () => {
    waitUntilGeographyIsLoaded('Western Cape');
})

When('I go back to root geography', () => {
    cy.get('.map-location .location-tag .location-tag__name:contains("South Africa Test")', {timeout: 20000}).click({force: true});
})

Then('I add new filter', () => {
    cy.get(`${mapBottomItems} .map-options .mapping-options__add-filter`).click();
})

Then('I confirm that the add new filter button exists', () => {
    cy.get(`${mapBottomItems} .map-options .mapping-options__add-filter`).should('be.visible');
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

Then(/^I click on eye close icon on "([^"]*)" indicator$/, function (word) {
    cy.get(`li[data-test-id="${word}"]`).find('.MuiTreeItem-label:first span[data-test-id="eyeCloseIcon"]').click();
})
