import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    expandDataMapper,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "./all_details.json";
import profiles from "./profiles.json";
import profile from './profile.json';
import profile_indicator_summary from './profile_indicator_summary.json';
import profile_indicator_data from './profile_indicator_data.json';
import profile_indicator_summary_changed_order from './profile_indicator_summary_changed_order.json';

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, [], {}, [], profile_indicator_summary, profile_indicator_data);
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
})

Then('I check order of subindicators', () => {
    let subindictaors = [
      "Indian/asian",
      "Coloured",
      "Black african",
      "White"
    ]
    cy.get('.subIndicator-item').first().find('.truncate').each(($div, idx) => {
        expect($div.text()).equal(subindictaors[idx]);
    });
    cy.get('.indicator-subcategory').contains('Population (2016 Community Survey)').click();
})

Then('I select another indicator', () => {
  cy.get('.indicator-subcategory').contains('Population (2011 Census)').click();
  cy.get('.indicator-item').contains('Population group 2').click();
  cy.get('.subIndicator-item').contains('Indian or Asian').click();
})

Then('I check order of subindicators for Population group 2', () => {
    let subindictaors = [
      "Black African",
      "Indian or Asian",
      "Unspecified",
      "Other",
      "Coloured",
      "White"
    ]
    cy.get('.subIndicator-item').children().find('.truncate').each(($div, idx) => {
        expect($div.text()).equal(subindictaors[idx]);
    })
})

Then('I am on the Wazimap Homepage with updated data', () => {
  setupInterceptions(profiles, all_details, profile, [], {}, [], profile_indicator_summary_changed_order, profile_indicator_data);
  gotoHomepage();
})

Then('I recheck order of subindicators for Population group', () => {
    let subindictaors = [
      "White",
      "Indian/asian",
      "Black african",
      "Coloured"
    ]
    cy.get('.subIndicator-item').first().find('.truncate').each(($div, idx) => {
        expect($div.text()).equal(subindictaors[idx]);
    });
    cy.get('.indicator-subcategory').contains('Population (2016 Community Survey)').click();
})

Then('I recheck order of subindicators for Population group 2', () => {
    let subindictaors = [
      "Coloured",
      "Black African",
      "Unspecified",
      "Indian or Asian",
      "White",
      "Other"
    ]
    cy.get('.subIndicator-item').children().find('.truncate').each(($div, idx) => {
        expect($div.text()).equal(subindictaors[idx]);
    })
})
