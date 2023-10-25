import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";
import {
    clickOnText,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import profile from "./profile.json";
import profiles from "../tutorial/profiles.json";
import all_details from "../tutorial/all_details.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, [], null);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa Test');
})

When("I check if the slide {word} is displayed correctly", (index) => {
    const slideDataArr = [
      {
        "title": "Introduction:",
        "body": "This website was developed to enable you to easily find spatial information related to geographic areas. By clicking on the map or using the search bar, you can navigate to an area of interest and find relevant information about it."
      },
      {
        "title": "Location Search:",
        "body": "To get started, first select a location on the map or use the search box to find the location you would like to analyse."
      },
      {
        "title": "Location Panel:",
        "body": "Basic information for your selected location can be found in the Location Panel. Use the buttons to navigate to parent locations."
      },
      {
        "title": "Rich Data:",
        "body": "To view rich data specific to the location you selected, open the Rich Data panel in the left toolbar."
      },
      {
        "title": "Point Mapper:",
        "body": "To add point data to the map, use the Point Mapper to show different facilities in that area."
      },
      {
        "title": "Data Mapper:",
        "body": "To overlay compatible datasets onto your location, open the Data Mapper and choose from the available indicators."
      },
      {
        "title": "Data Filtering:",
        "body": "Data Filtering: Once you've mapped a data-set (eg. gender), use the Data Filter to select a sub-indicator for that data-set (eg. male)"
      },
      {
        "title": "Learn more:",
        "body": "For more information on how to use specific features, look out for tutorial icons. For an in-depth guide on using this site, please see our user manual."
      },
    ];

    const slideData = slideDataArr[index - 1];

    cy.get('.tutorial__slide-content:not([aria-hidden="true"])')
        .should('be.visible');

    cy.get('.tutorial__slide-content:not([aria-hidden="true"]) .tutorial__slide-info')
        .should('be.visible');

    cy.get('.tutorial__slide-content:not([aria-hidden="true"]) .tutorial__slide-number div')
        .should('be.visible')
        .should('have.text', `${index}/8`);

    cy.get('.tutorial__slide-content:not([aria-hidden="true"]) .tutorial__slide-info .slide-info__title')
        .should('be.visible')
        .should('have.text', slideData.title);

    cy.get('.tutorial__slide-content:not([aria-hidden="true"]) .tutorial__slide-info .slide-info__introduction')
        .should('be.visible')
        .should('have.text', slideData.body);
})

When("I click on {word}", (link) => {
    clickOnText(link)
})
