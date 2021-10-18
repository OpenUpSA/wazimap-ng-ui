import {Given, Then} from "cypress-cucumber-preprocessor/steps";
import {gotoHomepage, setupInterceptions} from "../common_cy_functions/general";
import profiles from "./profiles.json";
import profile from "./profile.json";

Given('I intercept the requests and respond null', () => {
    setupInterceptions(profiles, null, profile, null, null);
    gotoHomepage();
})

Then('An alert message should be shown', () => {
    cy.on('window:alert', (str) => {
        expect(str).to.equal(`An unexpected error occurred. Please reload the page and try again. If the problem persists, please contact support@wazimap.co.za`)
    })
})