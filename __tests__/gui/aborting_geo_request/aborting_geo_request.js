import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint,
    expandDataMapper,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded,
    visitToGeo
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import profile from "./profile.json";
import profiles from "./profiles.json";
import profile_indicator_summary from "./profile_indicator_summary.json";
import profile_indicator_data from "./profile_indicator_data.json";
import themes from "./themes.json";
import all_details_WC from "./WC/all_details.json";
import profile_indicator_summary_WC from './WC/profile_indicator_summary.json';
import profile_indicator_data_WC from './WC/profile_indicator_data.json';


Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(
        profiles, all_details, profile, themes, {}, [],
        profile_indicator_summary, profile_indicator_data, []
    );
    gotoHomepage();
})

Then('I wait until map is ready for South Africa Test', () => {
    waitUntilGeographyIsLoaded("South Africa Test");
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


When('I navigate to WC and without waiting for response visit ZA', () => {

    cy.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        if (err.name === "AbortError") {
            return false
        }
    })

    let sendResponse;
    const trigger = new Promise((resolve) => {
        sendResponse = resolve;
    });

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/WC/?version=test&skip-children=true&format=json`, (request) => {
      return trigger.then(() => {
        request.reply({
            statusCode: 200,
            body: all_details_WC,
            forceNetworkError: false // default
        })
      });
    });

    cy.intercept(`/api/v1/profile/8/geography/WC/profile_indicator_summary/?version=test&format=json`, (request) => {
        return trigger.then(() => {
          request.reply({
              statusCode: 200,
              body: profile_indicator_summary_WC,
              forceNetworkError: false // default
          })
        });
    });

    cy.intercept('api/v1/profile/8/geography/WC/themes_count/?version=test&format=json', (req) => {
        return trigger.then(() => {
          req.reply({
              statusCode: 200,
              body: [],
              forceNetworkError: false // default
          })
        });
    })

    cy.intercept('/api/v1/profile/8/geography/WC/indicator/**/child_data/', (request) => {
        return trigger.then(() => {
          request.reply({
              statusCode: 200,
              body: profile_indicator_data_WC,
              forceNetworkError: false // default
          });
        });
    })

    visitToGeo('WC');
    visitToGeo('ZA-Test', true);
    sendResponse();
})
