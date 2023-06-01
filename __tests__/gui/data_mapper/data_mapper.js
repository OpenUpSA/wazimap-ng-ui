import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint,
    checkDataMapperCategoryCount,
    checkIfChoroplethFilterDialogIsCollapsed,
    checkIfChoroplethFilterDialogIsExpanded,
    checkIfPointFilterDialogIsCollapsed,
    checkIfPointFilterDialogIsExpanded,
    clickOnText,
    collapseChoroplethFilterDialog,
    expandChoroplethFilterDialog,
    expandDataMapper,
    expandPointFilterDialog,
    expandPointMapper,
    expandRichDataPanel,
    gotoHomepage,
    mapBottomItems, selectChoroplethDropdownOption,
    setupInterceptions, visitToGeo,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import all_details_FS from "./all_details_FS.json";
import profiles from "./profiles.json";
import profile from './profile.json';
import themes from "./themes.json";
import points from "./points.json";
import profile_indicator_summary from './profile_indicator_summary.json';
import profile_indicator_data from './profile_indicator_data.json'
import profile_indicator_summary_FS from './profile_indicator_summary_FS.json'

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, themes, points, [], profile_indicator_summary, profile_indicator_data);
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

When(/^I click on "([^"]*)" in Data Mapper$/, function (word) {
    cy.get('.data-mapper').findByText(word).click({force: true});
});

Then('I select an indicator', () => {
    cy.get('.indicator-subcategory').contains('Population (2016 Community Survey)').click();
    cy.get('.indicator-item').contains('Population group').click();
    cy.get('.subIndicator-item').contains('Black african').click();
    cy.get('.indicator-subcategory').contains('Population (2016 Community Survey)').click();
    cy.get(`${mapBottomItems} .map-options .map-options__legend`).should('be.visible');
})

When('I select another indicator', () => {
    cy.get('.indicator-subcategory').contains('Population (2011 Census)').click();
    cy.get('.indicator-item').contains('Population group 2').click();
    cy.get('.subIndicator-item').contains('Indian or Asian').click();
})

Then('I check if the choropleth filter dialog is collapsed', () => {
    checkIfChoroplethFilterDialogIsCollapsed();
})

Then('I check if choropleth legend is displayed', () => {
    cy.get(`${mapBottomItems} .map-options .map-options__legend`).should('be.visible');
})

Then('I expand filter dialog', () => {
    expandChoroplethFilterDialog();
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

    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/EC/?version=test&skip-children=true&format=json`, (request) => {
        let tempObj = JSON.parse(JSON.stringify(all_details));
        tempObj.boundary.properties.code = 'EC';
        tempObj.profile.geography.code = 'EC';

        return trigger.then(() => {
            request.reply({
                statusCode: 200,
                body: tempObj,
                forceNetworkError: false // default
            })
        });
    });

    cy.intercept(`/api/v1/profile/8/geography/EC/profile_indicator_summary/?version=test&format=json`, (request) => {
        return trigger.then(() => {
            request.reply({
                statusCode: 200,
                body: profile_indicator_summary,
                forceNetworkError: false // default
            })
        });
    });

    cy.intercept('api/v1/profile/8/geography/EC/themes_count/?version=test&format=json', (req) => {
        req.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    })

    visitToGeo('EC');

    cy.get('.data-mapper-content__loading').should('be.visible').then(() => {
        //loading = true
        cy.get('.data-mapper-content__list').should('not.be.visible');
        cy.get(`${mapBottomItems} .map-options  .map-options__filters .map-options__filters_header .filters__header_name .truncate`).should('contain.text', 'Loading');
        cy.get(`${mapBottomItems} .map-options  .map-options__loading`).should('be.visible');
        cy.get(`${mapBottomItems} .map-options  .map-options__legend_loading`).should('be.visible');

        sendResponse();

        //loading = false
        cy.get('.data-mapper-content__loading').should('not.be.visible');
        cy.get('.data-mapper-content__list').should('be.visible');
        cy.get(`${mapBottomItems} .map-options  .map-options__filters .map-options__filters_header .filters__header_name .truncate`).should('not.contain.text', 'Loading');
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
    cy.get('li[data-test-class="tree-view-category-item"]:contains("TVET colleges")').click();
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

When('I navigate to WC', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/WC/?version=test&skip-children=true&format=json`, (request) => {
        let tempObj = JSON.parse(JSON.stringify(all_details));
        tempObj.boundary.properties.code = 'WC';
        tempObj.profile.geography.code = 'WC';

        request.reply({
            statusCode: 200,
            body: tempObj,
            forceNetworkError: false // default
        })
    });

    cy.intercept(`/api/v1/profile/8/geography/WC/profile_indicator_summary/?version=test&format=json`, (request) => {
        let tempObj = JSON.parse(JSON.stringify(profile_indicator_summary));
        delete tempObj['Demographics'];

        request.reply({
            statusCode: 200,
            body: tempObj,
            forceNetworkError: false // default
        })
    });

    cy.intercept('api/v1/profile/8/geography/WC/themes_count/?version=test&format=json', (req) => {
        req.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    })

    visitToGeo('WC');
})

When('I navigate to FS', () => {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/FS/?version=test&skip-children=true&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: all_details_FS,
            forceNetworkError: false // default
        })
    });

    cy.intercept(`/api/v1/profile/8/geography/FS/profile_indicator_summary/?version=test&format=json`, (request) => {
        request.reply({
            statusCode: 200,
            body: profile_indicator_summary_FS,
            forceNetworkError: false // default
        })
    });

    cy.intercept('api/v1/profile/8/geography/FS/themes_count/?version=test&format=json', (req) => {
        req.reply({
            statusCode: 200,
            body: [],
            forceNetworkError: false // default
        })
    });

    visitToGeo('FS');
})

Then(/^I check if there are (\d+) categories$/, function (count) {
    checkDataMapperCategoryCount(count);
});

Then('I navigate to ZA', () => {
    visitToGeo('ZA');
})

Then(/^I navigate to WC and back to ZA in (\d+) ms$/, function (ms) {
    visitToGeo('WC');
    cy.wait(ms);   //without this controller ignores the first request  - to be able to navigate between 2 geographies we need a small delay
    visitToGeo('ZA');

    cy.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        if (err.name === "AbortError") {
            return false
        }
    })
});

Then('I expand filter dialog', () => {
    expandChoroplethFilterDialog();
})

Then('I check if the message is displayed correctly', () => {
    cy.get(`${mapBottomItems} .map-options .map-options__loading`).should('not.be.visible');
    cy.get(`${mapBottomItems} .map-options .map-options__no-data`).should('be.visible');
    cy.get(`${mapBottomItems} .map-options .map-options__no-data`).should('contain.text', 'No filters available for the selected data.');
})

Then('I check if the non\-aggregatable group filter is applied', () => {
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible .mapping-options__filter`).eq(0).should('have.class', 'disabled');
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible .mapping-options__filter`)
        .eq(0)
        .should('contain.text', 'age group');

    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible .mapping-options__filter`).eq(1).should('not.have.class', 'disabled');
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible .mapping-options__filter`)
        .eq(1)
        .should('contain.text', '15-35 (ZA)');
})

When(/^I filter by "([^"]*)"$/, function (filter) {
    selectChoroplethDropdownOption(filter, 1);
});

Then('I check if the legend values are correct', () => {
    let values = ['43%', '47%', '51%', '55%', '59%'];
    cy.get('.map-options__legend_wrap .map_legend-block .truncate').each(($div, index) => {
        expect($div.text()).equal(values[index]);
    })
})

Then('I expand Rich Data Panel', () => {
    expandRichDataPanel();
})

Then(/^I check if the geography name is "([^"]*)"$/, function (name) {
    cy.get('.location__title h1').should('have.text', name);
});
