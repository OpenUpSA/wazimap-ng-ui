import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint,
    checkIfChoroplethFilterDialogIsCollapsed,
    checkIfChoroplethFilterDialogIsExpanded,
    checkIfPointFilterDialogIsCollapsed, checkIfPointFilterDialogIsExpanded,
    clickOnText,
    collapseChoroplethFilterDialog,
    expandChoroplethFilterDialog,
    expandDataMapper, expandPointFilterDialog,
    expandPointMapper,
    gotoHomepage, mapBottomItems,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import profiles from "./profiles.json";
import profile from './profile.json';
import themes from "./themes.json";
import points from "./points.json";
import children_indicators from './children_indicators.json';

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, themes, points, [], children_indicators);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When('I expand Data Mapper', () => {
    expandDataMapper();
})

Then('Data Mapper should be displayed', () => {
    cy.get('.data-mapper-content__list').should('be.visible');
})

When('I click on {word} in Data Mapper', () => {
    cy.get('.data-category__h1_title').contains('Demographics').click();
})

Then('I select an indicator', () => {
    cy.get('.data-category__h1_content--v2').contains('Population (2016 Community Survey)').click();
    cy.get('.data-category__h2_content--v2').contains('Population group').click();
    cy.get('.data-category__h3_content--v2').contains('Black african').click();
})

When('I select another indicator', () => {
    cy.get('.data-category__h1_content--v2').contains('Population (2011 Census)').click();
    cy.get('.data-category__h2_content--v2').contains('Population group 2').click();
    cy.get('.data-category__h3_content--v2').contains('Indian or Asian').click();
})

Then('I check if choropleth legend is displayed', () => {
    cy.get(`${mapBottomItems} .map-options .map-options__legend`).should('be.visible');
})

Then('I check if everything is zero', () => {
    cy.get('.map-options__legend_wrap .map_legend-block .truncate').each(($div) => {
        expect($div.text()).not.equal('0.0%');
    })
})

When('I navigate to EC and check if the loading state is displayed correctly', () => {
    //intercepting the request and testing the loading state
    //for more info : https://blog.dai.codes/cypress-loading-state-tests/
    let sendResponse;
    const trigger = new Promise((resolve) => {
        sendResponse = resolve;
    });

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/EC/?version=test&format=json`, (request) => {
        return trigger.then(() => {
            request.reply({
                statusCode: 201,
                body: all_details,
                forceNetworkError: false // default
            })
        });
    });

    cy.intercept(`/api/v1/children-indicators/profile/8/geography/EC/?version=test&format=json`, (request) => {
        return trigger.then(() => {
            request.reply({
                statusCode: 201,
                body: children_indicators,
                forceNetworkError: false // default
            })
        });
    });

    cy.visit('/#geo:EC');

    cy.get('.data-mapper-content__loading').should('be.visible').then(() => {
        //loading = true
        cy.get('.data-mapper-content__list').should('not.be.visible');
        cy.get(`${mapBottomItems} .map-options  .map-options__filters .map-options__filters_header .filters__header_name .truncate`).should('contain.text','Loading');
        cy.get(`${mapBottomItems} .map-options  .map-options__loading`).should('be.visible');
        cy.get(`${mapBottomItems} .map-options  .map-options__legend_loading`).should('be.visible');

        sendResponse();

        //loading = false
        cy.get('.data-mapper-content__loading').should('not.be.visible');
        cy.get('.data-mapper-content__list').should('be.visible');
        cy.get(`${mapBottomItems} .map-options  .map-options__filters .map-options__filters_header .filters__header_name .truncate`).should('not.contain.text','Loading');
        cy.get(`${mapBottomItems} .map-options  .map-options__loading`).should('not.be.visible');
        cy.get(`${mapBottomItems} .map-options  .map-options__legend_loading`).should('not.be.visible');
    });
})

When('I collapse the choropleth filter dialog', () => {
    collapseChoroplethFilterDialog();
})

Then('I check if the choropleth filter dialog is collapsed', () => {
    checkIfChoroplethFilterDialogIsCollapsed();
})

When('I expand the choropleth filter dialog', () => {
    expandChoroplethFilterDialog();
})

Then('I check if the choropleth filter dialog is expanded', () => {
    checkIfChoroplethFilterDialogIsExpanded();
})

When('I expand Point Mapper', () => {
    expandPointMapper();
})

When('I expand Higher Education theme', () => {
    clickOnText('Higher Education');
})

Then('I click on TVET colleges category', () => {
    cy.get('.point-mapper__h2:contains("TVET colleges")').click();
})

Then('I check if the point filter dialog is collapsed', () => {
    checkIfPointFilterDialogIsCollapsed();
})

When('I expand the point filter dialog', () => {
    expandPointFilterDialog();
})

Then('I check if the point filter dialog is expanded', () => {
    checkIfPointFilterDialogIsExpanded();
})