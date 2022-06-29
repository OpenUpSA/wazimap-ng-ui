import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint,
    expandRichDataPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "../facilities/all_details.json";
import all_details_CPT from "../facilities/all_details_CPT.json";
import themes_count from "./themes_count.json";
import themes_count_EC from "./themes_count_EC.json";
import all_details_WC from "./all_details_WC.json";
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
    }).as('themes_count');

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

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/EC/?version=test&skip-children=true&format=json`, (request) => {
        return trigger.then(() => {
            request.reply({
                statusCode: 201,
                body: all_details,
                forceNetworkError: false // default
            })
        });
    });

    cy.intercept('/api/v1/profile/8/geography/EC/themes_count/?version=test&format=json', (request) => {
        return trigger.then(() => {
            request.reply({
                statusCode: 201,
                body: themes_count_EC,
                forceNetworkError: false // default
            })
        });
    });

    cy.intercept(`/api/v1/children-indicators/profile/8/geography/EC/?version=test&format=json`, (request) => {
        return trigger.then(() => {
            request.reply({
                statusCode: 201,
                body: {},
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

When('I navigate to a geography with no points', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/CPT/?version=test&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_CPT,
            forceNetworkError: false // default
        });
    });

    cy.intercept('/api/v1/profile/8/geography/CPT/themes_count/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        });
    });

    cy.intercept('/api/v1/children-indicators/profile/8/geography/CPT/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: {},
            forceNetworkError: false // default
        });
    });

    cy.visit('/#geo:CPT');
})

Then('Facilities should not be visible', () => {
    cy.get('.location__facilities').should('not.be.visible')
})

When('I navigate back to ZA', () => {
    cy.visit('/#geo:ZA');
})

Then('Facilities should be visible', () => {
    cy.get('.location__facilities').should('be.visible')
})

When(/^I wait until "([^"]*)" is ready$/, function (word) {
    cy.wait(1000);  //creating the point summary is async
    cy.get('.location__title h1').should('have.text', word);
});

When('I navigate to a geography where themes-count endpoint fails', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/WC/?version=test&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 201,
            body: all_details_WC,
            forceNetworkError: false // default
        })
    });

    cy.intercept('/api/v1/profile/8/geography/WC/themes_count/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 201,
            body: null,
            forceNetworkError: false // default
        })
    });

    cy.intercept('/api/v1/children-indicators/profile/8/geography/WC/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 201,
            body: {},
            forceNetworkError: false // default
        })
    });

    cy.visit('/#geo:WC');
})

Then('I check if error message is displayed on the theme count section', () => {
    cy.get('.location__facilities_error').should('be.visible');
})