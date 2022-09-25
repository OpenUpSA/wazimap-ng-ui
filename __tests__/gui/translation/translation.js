import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    expandPointFilterDialog,
    expandPointMapper,
    gotoHomepage, hoverOverTheMapCenter, mapBottomItems,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import profiles from "./profiles.json";
import all_details from "./all_details.json";
import profile from "./profile.json";
import themes from "./themes.json";
import points from "./points.json";
import profile_indicator_summary from "./profile_indicator_summary.json";
import profile_indicator_data from "./profile_indicator_data.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, themes, points, [], profile_indicator_summary, profile_indicator_data);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When('I expand Point Mapper', () => {
    expandPointMapper();
})

Then('I check if the Point Mapper is translated correctly', () => {
    cy.get('.point-mapper .point-data__header_title').should('have.text', 'Translated | Mapper');
    cy.get('.point-mapper .point-mapper-content .point-mapper-content__description div').should('have.text', 'Translated | Select the category, or specific type of point data you would like to overlay onto the map.');
})

When(/^I click on "([^"]*)" in Point Mapper$/, function (word) {
    cy.get('.point-mapper').findByText(word).click({force: true});
});

When('I expand the filter dialog', () => {
    expandPointFilterDialog();
})

Then('I check if the filter dialog is translated correctly', () => {
    cy.get(`${mapBottomItems} .point-filters .point-filters__title .filters__header_name .truncate div`).should('have.text', 'Translated | Point Filters');
    cy.get(`${mapBottomItems} p.point-filters__no-data`).should('have.text', 'Translated | No filters available for the selected data.');
})

When('I click on a marker', () => {
    //click on the center of the window
    hoverOverTheMapCenter();
    cy.get('.leaflet-marker-pane .leaflet-zoom-animated').click({force: true});
})

When('I click on the More info button', () => {
    cy.get('.leaflet-popup-content-wrapper .facility-tooltip__open-modal').click({force: true, multiple: true});
})

Then('I check if the facility dialog is translated correctly', () => {
    cy.get(`.facility-info .facility-info__google-map-text`).should('have.text', 'Translated | View location in Google Maps');
})