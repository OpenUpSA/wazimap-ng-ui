import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    expandRichDataPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "../facilities/all_details.json";
import all_details_EC from "../facilities/all_details_EC.json";
import profile from "../facilities/profile.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(all_details, profile, null, null);
    //todo: intercept async point count endpoint here when the BE is ready
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When('I expand Rich Data Panel', () => {
    expandRichDataPanel();
})

Then('I click on Show Locations button', () => {
    cy.wait(500);
    cy.get('.rich-data .location__facilities_trigger .location__facilities_expand').click();
})

When('I check if the location count is correct', () => {
    cy.get('.rich-data .location__facilities_categories-value strong').should('have.text', '4');
})

Then('I check if the facilities are created correctly', () => {
    const themeCount = all_details.themes.length;
    cy.get('.rich-data .location__facilities_content-wrapper .location-facility').should('have.length', themeCount);
    cy.get('.rich-data .location__facilities_content-wrapper .location-facility').each(($div, index) => {
        const themeTitle = all_details.themes[index].name
        const categoryCount = all_details.themes[index].subthemes.length;
        expect($div.find('.location-facility__name div').text()).equal(themeTitle);
        expect($div.find('.location-facility__list_item').length).equal(categoryCount);
    })

    const firstCategory = all_details.themes[0].subthemes[0].label;
    cy.get('.rich-data .location__facilities_content-wrapper .location-facility .location-facility__item_name div').first().should('have.text', firstCategory);
})

When('I navigate to EC and check if the loading state is displayed correctly', () => {
    let sendResponse;
    const trigger = new Promise((resolve) => {
        sendResponse = resolve;
    });

    cy.intercept('/api/v1/all_details/profile/8/geography/EC/?format=json', (request) => {
        return trigger.then(() => {
            request.reply({
                statusCode: 201,
                body: all_details_EC,
                forceNetworkError: false // default
            })
        });
    });

    cy.visit('/#geo:EC');

    cy.get('.location-facilities__trigger--loading').should('be.visible').then(() => {
        sendResponse();
        cy.get('.location-facilities__trigger--loading').should('not.be.visible');
    });
})