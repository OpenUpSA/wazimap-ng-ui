import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    expandRichDataPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "../facilities/all_details.json";
import themes_count from "./themes_count.json";
import themes_count_EC from "./themes_count_EC.json";
import profile from "../facilities/profile.json";
import profiles from "./profiles.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, null, null);

    cy.intercept('/api/v1/profile/8/geography/ZA/themes_count/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: themes_count,
            forceNetworkError: false // default
        });
    });

    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When('I expand Rich Data Panel', () => {
    expandRichDataPanel();
})

Then('I click on Show Locations button', () => {
    cy.get('.rich-data .location__facilities_trigger .location__facilities_expand', {timeout: 20000}).click();
})

When('I check if the location count is correct', () => {
    cy.get('.rich-data .location__facilities_categories-value strong').should('have.text', '4');
})

Then('I check if the facilities are created correctly', () => {
    const themeCount = themes_count.length;
    cy.get('.rich-data .location__facilities_content-wrapper .location-facility').should('have.length', themeCount);
    cy.get('.rich-data .location__facilities_content-wrapper .location-facility').each(($div, index) => {
        const themeTitle = themes_count[index].name
        const categoryCount = themes_count[index].subthemes.length;
        expect($div.find('.location-facility__name div').text()).equal(themeTitle);
        expect($div.find('.location-facility__list_item').length).equal(categoryCount);
    })

    const firstCategory = themes_count[0].subthemes[0].label;
    cy.get('.rich-data .location__facilities_content-wrapper .location-facility .location-facility__item_name div').first().should('have.text', firstCategory);
})

When('I navigate to EC and check if the loading state is displayed correctly', () => {
    //intercepting the request and testing the loading state
    //for more info : https://blog.dai.codes/cypress-loading-state-tests/
    let sendResponse;
    const trigger = new Promise((resolve) => {
        sendResponse = resolve;
    });

    cy.intercept('/api/v1/all_details/profile/8/geography/EC/?version=test&format=json', (request) => {
        return trigger.then(() => {
            request.reply({
                statusCode: 201,
                body: all_details,
                forceNetworkError: false // default
            })
        });
    });

    cy.intercept('/api/v1/profile/8/geography/EC/themes_count/?format=json', (request) => {
        return trigger.then(() => {
            request.reply({
                statusCode: 201,
                body: themes_count_EC,
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
