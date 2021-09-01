import all_details from "../toggling_indicators/all_details.json";
import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";

Given('I am on the SANEF Homepage', () => {
    cy.intercept('/api/v1/all_details/profile/8/geography/ZA/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: all_details,
            forceNetworkError: false // default
        })
    })

    cy.visit("/")
})

When('I expand Data Mapper', () => {
    cy.wait(100);
    cy.get('.point-mapper-toggles .data-mapper-panel__open').click();
})

Then('Data Mapper should be displayed', () => {
    cy.get('.data-mapper-content__list').should('be.visible');
})

When('I click on {word} in Data Mapper', () => {
    cy.get('.data-category__h1_title').contains('Demographics').click();
})

Then('I select an indicator', () => {
    cy.get('.data-category__h1_content').contains('Population (2016 Community Survey)').click();
    cy.get('.data-category__h2_content').contains('Population group').click();
    cy.get('.data-category__h3_content').contains('Black african').click();
})

When('I select another indicator', () => {
    cy.get('.data-category__h1_content').contains('Population (2011 Census)').click();
    cy.get('.data-category__h2_content').contains('Population group 2').click();
    cy.get('.data-category__h3_content').contains('Indian or Asian').click();
})

Then('I check if everything is zero', () => {
    cy.get('.map-options__legend_wrap .map_legend-block .truncate').each(($div) => {
        expect($div.text()).not.equal('0.0%');
    })
})