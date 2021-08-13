import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";
import profile from "../facility_modal/profile.json";
import themes from "../facility_modal/themes.json";
import points from "../facility_modal/points.json";
import all_details from "../facility_modal/all_details.json";

Given('I am on the Wazimap Homepage', () => {
    cy.visit("/")

    cy.intercept('/api/v1/profile_by_url/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: profile,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile/8/points/themes/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: themes,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile/8/points/category/379/points/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: points,
            forceNetworkError: false // default
        })
    })
})