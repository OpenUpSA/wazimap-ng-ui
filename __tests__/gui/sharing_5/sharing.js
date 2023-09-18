import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    expandMyViewPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
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

Given('I am on the Wazimap Homepage with a missing filter selected in default', () => {
    setupInterceptions(
        profiles, all_details, profile, themes, {}, [],
        profile_indicator_summary, profile_indicator_data, categories
    );
    cy.visit('/?profileView=%7B"filters"%3A%5B%7B"indicatorId"%3A1125%2C"filters"%3A%5B%7B"group"%3A"race"%2C"value"%3A"Race%20A"%2C"isDefault"%3Afalse%2C"appliesTo"%3A%5B"data_explorer"%5D%2C"isSiteWideFilter"%3Afalse%7D%5D%7D%5D%2C"hiddenIndicators"%3A%5B%5D%7D');
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When('I expand My View Window', () => {
    expandMyViewPanel();
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

Then('I wait for 1s for the API data to be processed', () => {
    cy.wait(1000);
})

Then('I confirm that the toggle button shows a warning indicator', () => {
    cy.get(`div[data-test-id="my-view-toggle"] div`).then($els => {
        // get Window reference from element
        const win = $els[0].ownerDocument.defaultView
        // use getComputedStyle to read the pseudo selector
        const after = win.getComputedStyle($els[0], 'after')
        // read the value of the `background-color` CSS property
        const bgColor = after.getPropertyValue('background-color')

        expect(bgColor).to.eq('rgb(255, 91, 57)')
    })
})

Then('I confirm that the indicator options shows a warning indicator', () => {
    cy.get('#indicatorOptions-header div div').then($els => {
        // get Window reference from element
        const win = $els[0].ownerDocument.defaultView
        // use getComputedStyle to read the pseudo selector
        const after = win.getComputedStyle($els[0], 'after')
        // read the value of the `background-color` CSS property
        const bgColor = after.getPropertyValue('background-color')

        expect(bgColor).to.eq('rgb(255, 91, 57)')
    })
})

Then('I confirm that there is a help text indicating the indicator has been changed', () => {
    cy.get('p[data-test-id="filter-not-available-help-text"]').should('have.text', 'This indicator or filter has either been changed or deleted since the view you requested was shared. It is currently unavailable.')
})

Then('I confirm that there is a help text indicating that there are filters which cannot be applied', () => {
    cy.get('p[data-test-id="filter-not-available-help-text"]').should('have.text', 'Some filters cannot be applied because the field or value is not available in the relevant data. This might be because the indicator data has been modified since the link was shared, or because the shared link was modified and is not compatible with the data.')
})
