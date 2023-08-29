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
    waitUntilGeographyIsLoaded
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

When('I expand My View Window', () => {
    expandMyViewPanel();
})

When('I confirm that there are no site-wide filters', () => {
    cy.get(`div[data-test-id="my-view-panel"] div[data-test-id="site-wide-filter-card"]`).should('have.length', 0);
})

When(/^I click on "([^"]*)" in My View$/, function (word) {
    cy.get('div[data-test-id="my-view-panel"]').findByText(word).click();
})

When('I collapse My View Window', () => {
    collapseMyViewPanel();
})

When(/^I select "([^"]*)" from indicator dropdown in filter dialog$/, function (word) {
    selectChoroplethDropdownOption(word, 0);
});

When(/^I select "([^"]*)" from subIndicator dropdown in filter dialog$/, function (word) {
    selectChoroplethDropdownOption(word, 1);
});

Then('I confirm that the lock button is hidden', () => {
    const filterRowIndex = 0;
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${filterRowIndex}) .lock-filter-button-wrapper button[data-test-id="lock-button"]`)
        .should('have.class', 'hidden');
})

Then('I confirm that the lock button is visible', () => {
    const filterRowIndex = 0;
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${filterRowIndex}) .lock-filter-button-wrapper button[data-test-id="lock-button"]`)
        .should('not.have.class', 'hidden');
})

When('I click on the lock button', () => {
    const filterRowIndex = 0;
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${filterRowIndex}) .lock-filter-button-wrapper button[data-test-id="lock-button"]`)
        .click();
})

Then(/^I confirm that "([^"]*)" is a site\-wide filter$/, function (filter) {
    const filters = filter.split(':');
    let matches = false;

    cy.get(`div[data-test-id="my-view-panel"] div[data-test-id="site-wide-filter-card"]`).each(($el, index) => {
        matches = $el.find('div[data-test-id="site-wide-filter-indicator"]').text() === filters[0] &&
            $el.find('div[data-test-id="site-wide-filter-subIndicator"]').text() === filters[1];
    }).then(() => {
        expect(matches).equal(true);
    })
});

When('I expand Rich Data Panel', () => {
    expandRichDataPanel();
})

Then(/^I confirm that "([^"]*)" is applied to "([^"]*)" as a site\-wide filter$/, function (filter, chartTitle) {
    const filters = filter.split(':');
    let matches = false;

    cy.get(`.profile-indicator__title h4:contains("${chartTitle}")`)
        .closest('.profile-indicator')
        .find('.profile-indicator__filter-row')
        .each(($el) => {
            matches = $el.find('.profile-indicator__filter')
                    .eq(0)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger .dropdown-menu__selected-item .truncate')
                    .text() === filters[0] &&
                $el.find('.profile-indicator__filter')
                    .eq(1)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger .dropdown-menu__selected-item .truncate')
                    .text() === filters[1]

            if (matches) {
                // disabled
                cy.wrap($el.find('.profile-indicator__filter')
                    .eq(0))
                    .should('have.class', 'disabled')

                cy.wrap($el.find('.profile-indicator__filter')
                    .eq(1))
                    .should('have.class', 'disabled')

                // not line-through
                cy.wrap($el.find('.profile-indicator__filter')
                    .eq(0)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger'))
                    .should('not.have.css', 'text-decoration', 'line-through solid rgb(51, 51, 51)')

                cy.wrap($el.find('.profile-indicator__filter')
                    .eq(1)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger'))
                    .should('not.have.css', 'text-decoration', 'line-through solid rgb(51, 51, 51)')

            }
        }).then(() => {
    })
});

Then(/^I confirm that "([^"]*)" is applied to "([^"]*)" as an unavailable site\-wide filter$/, function (filter, chartTitle) {
    const filters = filter.split(':');
    let matches = false;

    cy.get(`.profile-indicator__title h4:contains("${chartTitle}")`)
        .closest('.profile-indicator')
        .find('.profile-indicator__filter-row')
        .each(($el) => {
            matches = $el.find('.profile-indicator__filter')
                    .eq(0)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger .dropdown-menu__selected-item .truncate')
                    .text() === filters[0] &&
                $el.find('.profile-indicator__filter')
                    .eq(1)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger .dropdown-menu__selected-item .truncate')
                    .text() === filters[1]

            if (matches) {
                // disabled
                cy.wrap($el.find('.profile-indicator__filter')
                    .eq(0))
                    .should('have.class', 'disabled')

                cy.wrap($el.find('.profile-indicator__filter')
                    .eq(1))
                    .should('have.class', 'disabled')

                // not line-through
                cy.wrap($el.find('.profile-indicator__filter')
                    .eq(0)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger'))
                    .should('have.css', 'text-decoration', 'line-through solid rgb(51, 51, 51)')

                cy.wrap($el.find('.profile-indicator__filter')
                    .eq(1)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger'))
                    .should('have.css', 'text-decoration', 'line-through solid rgb(51, 51, 51)')

            }
        }).then(() => {
    })
});