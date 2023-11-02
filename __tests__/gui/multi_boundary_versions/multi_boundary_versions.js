import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint, checkDataMapperCategoryCount,
    expandDataMapper,
    expandPointMapper,
    expandRichDataPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded,
    visitToGeo
} from "../common_cy_functions/general";

import all_details_2011 from "../multi_boundary_versions/2011/all_details.json";
import all_details_2016 from "../multi_boundary_versions/2016/all_details.json";
import profile_indicator_summary_2011 from "../multi_boundary_versions/2011/profile_indicator_summary.json";
import profile_indicator_summary_2016 from "../multi_boundary_versions/2016/profile_indicator_summary.json";

import all_details_2011_NC from "../multi_boundary_versions/2011/all_details_NC.json";
import all_details_2016_NC from "../multi_boundary_versions/2016/all_details_NC.json";

import all_details_2011_DC8 from "../multi_boundary_versions/2011/all_details_DC8.json";
import all_details_2016_DC8 from "../multi_boundary_versions/2016/all_details_DC8.json";

import all_details_2011_NC085 from "../multi_boundary_versions/2011/all_details_NC085.json";

import profiles from "../multi_boundary_versions/profiles.json";
import profile from "../multi_boundary_versions/profile.json";
import profile_indicator_data from './profile_indicator_data.json'


Given('I am on the Wazimap Homepage', () => {
    cy.intercept(`api/v1/${allDetailsEndpoint}/profile/8/geography/ZA/?version=2011%20Boundaries&skip-children=true&format=json`, (req) => {
        req.reply({
            statusCode: 201,
            body: all_details_2011,
            delay: 200, // let the non-default version to be replied first
            forceNetworkError: false // default
        })
    })

    cy.intercept(`api/v1/profile/8/geography/ZA/profile_indicator_summary/?version=2011%20Boundaries&format=json`, (req) => {
        req.reply({
            statusCode: 201,
            body: profile_indicator_summary_2011,
            delay: 200, // let the non-default version to be replied first
            forceNetworkError: false // default
        })
    })

    cy.intercept(`api/v1/${allDetailsEndpoint}/profile/8/geography/ZA/?version=2016%20Boundaries%20(ye)&skip-children=true&format=json`, (req) => {
        req.reply({
            statusCode: 201,
            body: all_details_2016,
            forceNetworkError: false // default
        })
    }).as('all_details')

    cy.intercept(`api/v1/profile/8/geography/ZA/profile_indicator_summary/?version=2016%20Boundaries%20(ye)&format=json`, (req) => {
        req.reply({
            statusCode: 201,
            body: profile_indicator_summary_2016,
            delay: 200, // let the non-default version to be replied first
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/ZA/themes_count/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    }).as('themes_count')

    cy.intercept('api/v1/profile/8/geography/ZA/themes_count/?version=2016%20Boundaries%20(ye)&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    setupInterceptions(profiles, null, profile, [], null, [], {}, profile_indicator_data);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

Then(/^I wait until "([^"]*)" is loaded/, (geoName) => {
    waitUntilGeographyIsLoaded(geoName);
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
    cy.get('.indicator-category').contains('Elections').click();
    cy.get('.indicator-subcategory').contains('2011 Municipal elections').click();
    cy.get('.indicator-item').contains('2011 Voter turnout').click();
    cy.get('.subIndicator-item').contains('2011 Voted').click();
})

Then('I navigate to a Northern Cape', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/NC/?version=2011%20Boundaries&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2011_NC,
            forceNetworkError: false // default
        });
    });

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/NC/?version=2016%20Boundaries%20(ye)&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2016_NC,
            forceNetworkError: false // default
        });
    });

    cy.intercept('api/v1/profile/8/geography/NC/themes_count/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/NC/themes_count/?version=2016%20Boundaries%20(ye)&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/NC/profile_indicator_summary/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: {},
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/NC/profile_indicator_summary/?version=2016%20Boundaries%20(ye)&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: {},
            forceNetworkError: false // default
        })
    })

    visitToGeo("NC")
})


Then('I navigate to a geography with no children', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/DC8/?version=2011%20Boundaries&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2011_DC8,
            forceNetworkError: false // default
        });
    });

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/DC8/?version=2016%20Boundaries%20(ye)&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2016_DC8,
            forceNetworkError: false // default
        });
    });

    cy.intercept('api/v1/profile/8/geography/DC8/themes_count/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/DC8/themes_count/?version=2016%20Boundaries%20(ye)&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/DC8/profile_indicator_summary/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: {},
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/DC8/profile_indicator_summary/?version=2016%20Boundaries%20(ye)&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: {},
            forceNetworkError: false // default
        })
    })

    visitToGeo('DC8', false, true);
})

When('I navigate to a geography with multiple child type', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/NC085/?version=2016%20Boundaries%20(ye)&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 404,
            forceNetworkError: false // default
        });
    });

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/NC085/?version=2011%20Boundaries&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2011_NC085,
            forceNetworkError: false // default
        });
    });

    cy.intercept('api/v1/profile/8/geography/NC085/profile_indicator_summary/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: {},
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/NC085/profile_indicator_summary/?version=2016%20Boundaries%20(ye)&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: {},
            forceNetworkError: false // default
        })
    })

    visitToGeo('NC085', false, true);
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
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__title').should('contain.text', 'test-key-metrics');
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__description').should('be.visible');
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__description div').should('contain.text', '(2016 Boundaries (ye))');
})

Then('I check if the key metric is shown without the version notification', () => {
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__title').should('contain.text', 'test-key-metrics');
    cy.get('.rich-data .sub-category-header__key-metrics .key-metric .key-metric__description').should('not.be.visible');
})

Then('I expand Point Mapper', () => {
    expandPointMapper();
})

When('I navigate to NC', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/NC/?version=2016%20Boundaries%20(ye)&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_2016_NC,
            forceNetworkError: false // default
        });
    });

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/NC/?version=2011%20Boundaries&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 404,
            forceNetworkError: false // default
        });
    });

    cy.intercept('api/v1/profile/8/geography/NC/profile_indicator_summary/?version=2011%20Boundaries&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: {},
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/NC/profile_indicator_summary/?version=2016%20Boundaries%20(ye)&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: {},
            forceNetworkError: false // default
        })
    })

    cy.intercept('api/v1/profile/8/geography/NC/themes_count/?version=2016%20Boundaries%20(ye)&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: [],
            forceNetworkError: false // default
        })
    })

    visitToGeo('NC', true);
})

Then('I confirm that the data mapper is not stuck in the loading state', () => {
    cy.get('.data-mapper .data-mapper-content__loading').should('not.be.visible');
})
