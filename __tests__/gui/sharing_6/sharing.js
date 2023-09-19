import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint,
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

Then('I wait until map is ready for South Africa Test', () => {
    waitUntilGeographyIsLoaded("South Africa Test");
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

When('I navigate to WC using hashcode', () => {
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


When('I navigate to WC using hashcode and filters', () => {
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

    cy.visit('/?profileView=%7B"filters"%3A%5B%7B"indicatorId"%3A1125%2C"filters"%3A%5B%7B"group"%3A"race"%2C"value"%3A"White"%2C"isDefault"%3Afalse%2C"appliesTo"%3A%5B"data_explorer"%5D%2C"isSiteWideFilter"%3Afalse%2C"isFilterAvailable"%3Atrue%7D%2C%7B"group"%3A"race"%2C"value"%3A"Coloured"%2C"isDefault"%3Afalse%2C"appliesTo"%3A%5B"rich_data"%5D%2C"isSiteWideFilter"%3Afalse%7D%5D%7D%5D%2C"hiddenIndicators"%3A%5B%5D%7D#geo:WC');
})

Then('I confirm hash code is changed to querysting', () => {
  cy.location().should((location) => {
    expect(location.hash).to.be.empty
    let params = new URLSearchParams(location.search);
    expect(params.get("geo")).to.eq('WC')
  })

})

Then('I wait until map is ready for Western Cape', () => {
    waitUntilGeographyIsLoaded('Western Cape');
})

When("I go back in browser history", () => {
    cy.go("back");
});

When("I go forward in browser history", () => {
    cy.go("forward");
});