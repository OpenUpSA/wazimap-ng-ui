import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";
import profile from "../facility_modal/profile.json";

When("I check if the slide {word} is displayed correctly", (index) => {
    const slideData = profile.configuration.tutorial[index - 1];

    cy.get('.tutorial__slide-content:not([aria-hidden="true"])')
        .should('be.visible');

    cy.get('.tutorial__slide-content:not([aria-hidden="true"]) .tutorial__slide-info')
        .should('be.visible');

    cy.get('.tutorial__slide-content:not([aria-hidden="true"]) .tutorial__slide-info .slide-info__title')
        .should('be.visible')
        .should('have.text', slideData.title);

    cy.get('.tutorial__slide-content:not([aria-hidden="true"]) .tutorial__slide-info .slide-info__introduction')
        .should('be.visible')
        .should('have.text', slideData.body);

    cy.get('.tutorial__slide-content:not([aria-hidden="true"]) .tutorial__slide-image')
        .should('be.visible')
        .should('have.css', 'background-image')
        .and('include', slideData.image);
})