import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "../map_download/all_details.json";
import profile from "../map_download/profile.json";
import profiles from "../map_download/profiles.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, null, null);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa');
})

When('I click on map download', () => {
    cy.get('.map-download').click({force: true});
})

Then('I check if an image of the map is downloaded', () => {
    cy.verifyDownload('map.png');
})

Then('I open Point Mapper', () => {
    cy.get('.panel-toggles .point-mapper-panel__open').click();
})

Then('Point Mapper should be open', () => {
    cy.get('.point-mapper').should('be.visible');
})

Then('Point Mapper should be closed', () => {
    cy.get('.point-mapper').should('not.be.visible');
})

Then('I open Data Mapper', () => {
    cy.get('.panel-toggles .data-mapper-panel__open').click();
})

Then('Data Mapper should be open', () => {
    cy.get('.data-mapper').should('be.visible');
})

Then('Data Mapper should be closed', () => {
    cy.get('.data-mapper').should('not.be.visible');
})

Then('I open Rich Data Panel', () => {
    cy.get('.panel-toggles .rich-data-panel__open').click();
})

Then('Rich Data Panel should be open', () => {
    cy.get('.rich-data').should('be.visible');
})

Then('Rich Data Panel should be closed', () => {
    cy.get('.rich-data').should('not.be.visible');
})

Then('Map download button should have title attribute', () => {
    cy.get('.map-download').then($el => {
        expect($el.attr('title')).equal('The panes on the left will be closed to download the full-screen map');
    })
})

Then('Map download button should not have title attribute', () => {
    cy.get('.map-download').should('not.have.attr', 'title');
})