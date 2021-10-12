import {Given, Then} from "cypress-cucumber-preprocessor/steps";
import {gotoHomepage, setupInterceptions, waitUntilGeographyIsLoaded} from "../common_cy_functions/general";
import profiles from "../multi_boundary_versions/profiles.json";
import all_details_2011 from "../multi_boundary_versions/all_details_2011.json";
import all_details_2016 from "../multi_boundary_versions/all_details_2016.json";
import profile from "../multi_boundary_versions/profile.json";

Given('I am on the Wazimap Homepage', () => {
    cy.intercept('api/v1/all_details/profile/8/geography/VT/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: all_details_2011,
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/all_details/profile/8/geography/VT/?version=2016%20with%20wards&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: all_details_2016,
            forceNetworkError: false // default
        })
    })

    setupInterceptions(profiles, null, profile, null, null);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('Version Test');
})