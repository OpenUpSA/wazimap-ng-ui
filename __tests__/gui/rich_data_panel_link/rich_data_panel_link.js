import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    allDetailsEndpoint, checkDataMapperCategoryCount,
    expandChoroplethFilterDialog,
    expandDataMapper,
    expandRichDataPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded,
    visitToGeo,
} from "../common_cy_functions/general";


import profiles from "./profiles.json";
import profile from './profile.json';

import all_details_ZA from "./ZA/all_details.json";
import themes_count_ZA from "./ZA/themes_count.json";
import profile_indicator_summary_ZA from './ZA/profile_indicator_summary.json';

import all_details_WC from "./WC/all_details.json";
import profile_indicator_summary_WC from './WC/profile_indicator_summary.json';

import all_details_CPT from "./CPT/all_details.json";
import themes_count_CPT from "./CPT/themes_count.json";

import all_details_DC3 from "./DC3/all_details.json";

Given('I am on the Wazimap Homepage', () => {
  setupInterceptions(profiles, all_details_ZA, profile, [], {}, themes_count_ZA, profile_indicator_summary_ZA, {});
  gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

Then('I expand Data Mapper', () => {
    expandDataMapper();
})

Then(/^I check if there are (\d+) categories$/, function (count) {
    checkDataMapperCategoryCount(count);
});

Then('I check if rich data panel link is present', () => {
  cy.get('.data-mapper-content__rich-data-panel-link').should('be.visible');
})

Then('I click on rich data panel link', () => {
  cy.get('.data-mapper-content__rich-data-panel-link a').click();
})

Then('I check if rich data panel is open', () => {
  cy.get('.rich-data-nav__list').should('be.visible');
})

Then('I check if the location facilities is visible', () => {
    cy.get('.location__facilities').should('be.visible');
})

Then('I check if rich data panel has data', () => {
    cy.get('.rich-data-content .section').should('be.visible');
})

When('I visit Western Cape', () => {
  cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/WC/?version=test&skip-children=true&format=json`, (request) => {
      return request.reply({
          statusCode: 200,
          body: all_details_WC,
          forceNetworkError: false // default
      });
  });

  cy.intercept('/api/v1/profile/8/geography/WC/themes_count/?version=test&format=json', (request) => {
      return request.reply({
          statusCode: 200,
          body: [],
          forceNetworkError: false // default
      });
  });

  cy.intercept(`/api/v1/profile/8/geography/WC/profile_indicator_summary/?version=test&format=json`, (request) => {
      return request.reply({
          statusCode: 200,
          body: profile_indicator_summary_WC,
          forceNetworkError: false // default
      });
  });

  visitToGeo('WC');
})

Then('I wait until map is ready for Western Cape', () => {
    waitUntilGeographyIsLoaded('Western Cape');
})

When('I visit City of Cape Town', () => {
  cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/CPT/?version=test&skip-children=true&format=json`, (request) => {
      return request.reply({
          statusCode: 200,
          body: all_details_CPT,
          forceNetworkError: false // default
      });
  });

  cy.intercept('/api/v1/profile/8/geography/CPT/themes_count/?version=test&format=json', (request) => {
      return request.reply({
          statusCode: 200,
          body: themes_count_CPT,
          forceNetworkError: false // default
      });
  });

  cy.intercept(`/api/v1/profile/8/geography/CPT/profile_indicator_summary/?version=test&format=json`, (request) => {
      return request.reply({
          statusCode: 200,
          body: {},
          forceNetworkError: false // default
      });
  });

  visitToGeo('CPT');
})

Then('I check if the location facilities is hidden', () => {
    cy.get('.location__facilities').should('not.be.visible');
})

Then('I wait until map is ready for City of Cape Town', () => {
    waitUntilGeographyIsLoaded('City of Cape Town');
})

When('I visit Overberg', () => {

  cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/DC3/?version=test&skip-children=true&format=json`, (request) => {
      return request.reply({
          statusCode: 200,
          body: all_details_DC3,
          forceNetworkError: false // default
      });
  });

  cy.intercept('/api/v1/profile/8/geography/DC3/themes_count/?version=test&format=json', (request) => {
      return request.reply({
          statusCode: 200,
          body: [],
          forceNetworkError: false // default
      });
  });

  cy.intercept(`/api/v1/profile/8/geography/DC3/profile_indicator_summary/?version=test&format=json`, (request) => {
      return request.reply({
          statusCode: 200,
          body: {},
          forceNetworkError: false // default
      });
  });

  visitToGeo('DC3');
})

Then('I wait until map is ready for Overberg', () => {
    waitUntilGeographyIsLoaded('Overberg');
})

Then('I open rich data panel', () => {
  expandRichDataPanel();
})

Then('I check if rich data panel link is hidden', () => {
  cy.get('.data-mapper-content__rich-data-panel-link').should('not.be.visible');
})

Then('I check if rich data panel is empty', () => {
  cy.get('.rich-data-content div.section').first().should('not.be.visible');
})

When('I revisit Western Cape', () => {
  visitToGeo('WC', true);
})
