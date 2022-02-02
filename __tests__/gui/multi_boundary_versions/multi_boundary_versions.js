import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint, checkDataMapperCategoryCount,
    expandDataMapper,
    expandPointMapper,
    expandRichDataPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import profiles from "../multi_boundary_versions/profiles.json";
import all_details_2011 from "../multi_boundary_versions/all_details_2011.json";
import all_details_2016 from "../multi_boundary_versions/all_details_2016.json";
import all_details_2011_41804004 from "../multi_boundary_versions/all_details_2011_41804004.json";
import all_details_2016_41804004 from "../multi_boundary_versions/all_details_2016_41804004.json";
import all_details_2011_NC085 from "./all_details_2011_NC085.json";
import profile from "../multi_boundary_versions/profile.json";
import children_indicators_2011 from "./children_indicators_2011.json";
import children_indicators_2016 from "./children_indicators_2016.json";

Given('I am on the Wazimap Homepage', () => {
    cy.intercept(`api/v1/${allDetailsEndpoint}/profile/8/geography/VT/?version=2011%20Boundaries&format=json`, (req) => {
        req.reply({
            statusCode: 201,
            body: all_details_2011,
            delay: 200, // let the non-default version to be replied first
            forceNetworkError: false // default
        })
    })

    cy.intercept(`api/v1/children-indicators/profile/8/geography/VT/?version=2011%20Boundaries&format=json`, (req) => {
        req.reply({
            statusCode: 201,
            body: children_indicators_2011,
            delay: 200, // let the non-default version to be replied first
            forceNetworkError: false // default
        })
    })

    cy.intercept(`api/v1/${allDetailsEndpoint}/profile/8/geography/VT/?version=2016%20with%20wards&format=json`, (req) => {
        req.reply({
            statusCode: 201,
            body: all_details_2016,
            forceNetworkError: false // default
        })
    }).as('all_details')

    cy.intercept(`api/v1/children-indicators/profile/8/geography/VT/?version=2016%20with%20wards&format=json`, (req) => {
        req.reply({
            statusCode: 201,
            body: children_indicators_2016,
            delay: 200, // let the non-default version to be replied first
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/VT/themes_count/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    }).as('themes_count')

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
    cy.wait(2000);
    cy.get('.dropdown-menu').click();
    cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible:contains("${versionName}")`).click();
});

Then('I click on the Proceed button in confirmation modal', () => {
    cy.get('.warning-modal').should('be.visible');
    cy.get('#warning-proceed').click();
})

When('I expand Data Mapper', () => {
    expandDataMapper();
})

Then('I check if there are 2 categories', () => {
    checkDataMapperCategoryCount(2);
})

When('I select an indicator from Elections category', () => {
    cy.get('.data-category__h1_title').contains('Elections').click();
    cy.get('.data-category__h1_content--v2').contains('2011 Municipal elections').click();
    cy.get('.data-category__h2_content--v2').contains('2011 Voter turnout').click();
    cy.get('.data-category__h3_content--v2').contains('2011 Voted').click();
})

Then('I navigate to a geography with no children', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/41804004/?version=2011%20Boundaries&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2011_41804004,
            forceNetworkError: false // default
        });
    });

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/41804004/?version=2016%20with%20wards&format=json`, (request) => {
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

When('I navigate to a geography with multiple child type', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/NC085/?version=2016%20with%20wards&format=json`, (request) => {
        request.reply({
            statusCode: 404,
            forceNetworkError: false // default
        });
    });

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/NC085/?version=2011%20Boundaries&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2011_NC085,
            forceNetworkError: false // default
        });
    });

    cy.visit('/#geo:NC085');
})

Then('I check if the choropleth is removed', () => {
    cy.get('.map-options').should('not.be.visible');
})

Then('I check if the profile highlight is hidden', () => {
    cy.get('.map-location__info').should('be.empty');
})

Then('I check if the profile highlight is displayed correctly', () => {
    cy.get('.map-location__info .location-highlight .location-highlight__title').should('have.text', 'Youth');
    cy.get('.map-location__info .location-highlight .location-highlight__value').should('have.text', '34.9%');
})

When('I expand Rich Data Panel', () => {
    expandRichDataPanel();
})

Then('I check if the key metric is shown with the version notification', () => {
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__title').should('have.text', 'test-key-metrics');
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__description').should('be.visible');
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__description div').should('have.text', '(2016 with wards)');
})

Then('I check if the key metric is shown without the version notification', () => {
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__title').should('have.text', 'test-key-metrics');
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__description').should('not.be.visible');
})

Then('I expand Point Mapper', () => {
    expandPointMapper();
})