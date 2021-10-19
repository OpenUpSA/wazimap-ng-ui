import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {gotoHomepage, setupInterceptions, waitUntilGeographyIsLoaded} from "../common_cy_functions/general";
import profiles from "../multi_boundary_versions/profiles.json";
import all_details_2011 from "../multi_boundary_versions/all_details_2011.json";
import all_details_2016 from "../multi_boundary_versions/all_details_2016.json";
import all_details_2011_41804004 from "../multi_boundary_versions/all_details_2011_41804004.json";
import all_details_2016_41804004 from "../multi_boundary_versions/all_details_2016_41804004.json";
import profile from "../multi_boundary_versions/profile.json";
import themes_count from "../facilities/themes_count.json";

Given('I am on the Wazimap Homepage', () => {
    cy.intercept('api/v1/all_details/profile/8/geography/VT/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: all_details_2011,
            delay: 200, // let the non-default version to be replied first
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

    cy.intercept('api/v1/profile/8/geography/VT/themes_count/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/VT/themes_count/?version=2016%20with%20wards&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    setupInterceptions(profiles, null, profile, null, null);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('Version Test');
})

Then(/^I check if "([^"]*)" is the selected version$/, (versionName) => {
    cy.get('.map-geo-select').should('be.visible');
    cy.get('.map-geo-select .dropdown-menu .dropdown-menu__selected-item .truncate').should('contain.text', versionName);
});

Then(/^I switch to "([^"]*)" version$/, (versionName) => {
    cy.get('.dropdown-menu').click();
    cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible:contains("${versionName}")`).click();
});

Then('I click on the Proceed button in confirmation modal', () => {
    cy.get('.warning-modal').should('be.visible');
    cy.get('#warning-proceed').click();
})

When('I expand Data Mapper', () => {
    cy.get('.point-mapper-toggles .data-mapper-panel__open').click();
})

Then('I check if there are 2 categories', () => {
    cy.get('.data-mapper-content__list .data-category').should('have.length', 2);
})

When('I select an indicator from Elections category', () => {
    cy.get('.data-category__h1_title').contains('Elections').click();
    cy.get('.data-category__h1_content').contains('2011 Municipal elections').click();
    cy.get('.data-category__h2_content').contains('2011 Voter turnout').click();
    cy.get('.data-category__h3_content').contains('2011 Voted').click();
})

Given('I navigate to a geography with no children', () => {
    cy.intercept('/api/v1/all_details/profile/8/geography/41804004/?version=2011%20Boundaries&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2011_41804004,
            forceNetworkError: false // default
        });
    });

    cy.intercept('/api/v1/all_details/profile/8/geography/41804004/?version=2016%20with%20wards&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2016_41804004,
            forceNetworkError: false // default
        });
    });

    cy.intercept('api/v1/profile/8/geography/41804004/themes_count/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/41804004/themes_count/?version=2016%20with%20wards&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    cy.visit('/#geo:41804004');
})