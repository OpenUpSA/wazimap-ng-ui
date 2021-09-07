import {Given, Then} from "cypress-cucumber-preprocessor/steps";
import {gotoHomepage, setupInterceptions, waitUntilGeographyIsLoaded} from "../common_cy_functions/general";

Given('I intercept the requests and respond null', () => {
    setupInterceptions(null, null, null, null);
    gotoHomepage();
})

Then('An alert message should be shown', () => {
    cy.on('window:alert', (str) => {
        expect(str).to.equal(`An unexpected error occurred. Please reload the page and try again. If the problem persists, please contact wazimap-support@openup.org.za`)
    })
})