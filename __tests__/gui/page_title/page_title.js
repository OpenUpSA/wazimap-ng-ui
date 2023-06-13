import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint,
    gotoHomepage,
    setupInterceptions,
    visitToGeo,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import all_details_FS from "./all_details_FS.json";
import profiles from "./profiles.json";
import profile from './profile.json';
import themes from "./themes.json";
import points from "./points.json";
import profile_indicator_summary from './profile_indicator_summary.json';
import profile_indicator_data from './profile_indicator_data.json'
import profile_indicator_summary_FS from './profile_indicator_summary_FS.json'
import all_details_EC from './all_details_EC.json'
import all_details_WC from './all_details_WC.json'

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, themes, points, [], profile_indicator_summary, profile_indicator_data);
    gotoHomepage();
})

Then(/^I check if current title of the page is "([^"]*)"$/,  (title) => {
  cy.title().should('eq', title)
});

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When('I navigate to EC', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/EC/?version=test&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_EC,
            forceNetworkError: false // default
        })
    });

    cy.intercept(`/api/v1/profile/8/geography/EC/profile_indicator_summary/?version=test&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: profile_indicator_summary,
            forceNetworkError: false // default
        })
    });

    cy.intercept('api/v1/profile/8/geography/EC/themes_count/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/WC/themes_count/?version=test&format=json', (request) => {
        req.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    })

    visitToGeo('EC', false, true);
})

Then('I wait until map is ready for Eastern Cape', () => {
    waitUntilGeographyIsLoaded('Eastern Cape');
})

Then('I navigate to ZA', () => {
    visitToGeo('ZA-Test', true);
    cy.wait(2000);  //wait until zoom out is completed
})

When('I navigate to FS', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/FS/?version=test&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_FS,
            forceNetworkError: false // default
        })
    });

    cy.intercept(`/api/v1/profile/8/geography/FS/profile_indicator_summary/?version=test&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: profile_indicator_summary_FS,
            forceNetworkError: false // default
        })
    });

    cy.intercept('api/v1/profile/8/geography/FS/themes_count/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    });

    cy.intercept('api/v1/profile/8/geography/FS/themes_count/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    })

    visitToGeo('FS', false, true);
})

Then('I wait until map is ready for Free State', () => {
    waitUntilGeographyIsLoaded('Free State');
})

When('I navigate to WC', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/WC/?version=test&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_WC,
            forceNetworkError: false // default
        })
    });

    cy.intercept(`/api/v1/profile/8/geography/WC/profile_indicator_summary/?version=test&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: profile_indicator_summary,
            forceNetworkError: false // default
        })
    });

    cy.intercept('api/v1/profile/8/geography/WC/themes_count/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    });

    cy.intercept('api/v1/profile/8/geography/WC/themes_count/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    })

    visitToGeo('WC', false, true);
})

Then('I wait until map is ready for Western Cape', () => {
    waitUntilGeographyIsLoaded('Western Cape');
})
