import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    clickOnText,
    gotoHomepage,
    hoverOverTheMapCenter,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "../point_data/all_details.json";
import profile from "../point_data/profile.json";
import themes from "../point_data/themes.json";
import points from "../point_data/points.json";
import points_2 from "../point_data/points_2.json";

Given('I am on the Wazimap Homepage', () => {
    cy.intercept('/api/v1/profile/8/points/category/394/points/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: points_2,
            forceNetworkError: false // default
        })
    })

    setupInterceptions(all_details, profile, themes, points);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa');
})

When('I expand Higher Education theme', () => {
    cy.wait(1000);
    clickOnText('Higher Education');
})

Then('I click on TVET colleges category', () => {
    clickOnText('TVET colleges');
})

When(/^I check if the marker color is rgb\((\d+), (\d+), (\d+)\)$/, (color1, color2, color3) => {
    cy.get('.leaflet-marker-pane .leaflet-zoom-animated svg circle').then(($el) => {
        const fill = $el.attr('fill');
        cy.wrap(fill).should('equal', `rgb(${color1}, ${color2}, ${color3})`);
    })
})

Then('I remove TVET colleges from map', () => {
    cy.get('.point-legend[data-id=379] .point-legend__remove').click();
})

When('I expand Labour theme', () => {
    clickOnText('Labour');
})

Then('I click on Additional DEL facilities category', () => {
    clickOnText('Additional DEL facilities (unverified)');
})

When('I check if the cluster is created correctly', () => {
    cy.wait(100);
    const categories = [{
        name: 'TVET colleges',
        color: 'rgb(58, 112, 255)',
        circleVal: '100 100'
    }, {
        name: 'Additional DEL facilities (unverified)',
        color: 'rgb(153, 58, 255)',
        circleVal: '50 100'
    }]

    cy.get('.leaflet-marker-pane .leaflet-zoom-animated svg circle').each(($el, index) => {
        cy.wrap($el.attr('stroke')).should('contain', categories[index].color);
        cy.wrap($el.attr('stroke-dasharray')).should('equal', categories[index].circleVal);
    })

    cy.get('.leaflet-marker-pane .leaflet-zoom-animated svg text').should('have.text', 2);

    cy.wait(100);
    hoverOverTheMapCenter();

    cy.get("body").then(($body) => {
        if (!$body.find(".leaflet-popup-content").length) {
            cy.log('hover failed - try again');
            hoverOverTheMapCenter();
        }
    })

    cy.get('.leaflet-popup-pane .facility-tooltip__cluster a.tooltip__cluster-item', {timeout: 20000}).get(($el) => {
        cy.wrap($el.length).should('equal', 2);
    })

    cy.get('.leaflet-popup-pane .facility-tooltip__cluster a.tooltip__cluster-item').each(($el, index) => {
        cy.wrap($el.find('.tooltip__cluster-icon').attr('style')).should('contain', `background-color: ${categories[index].color};`);
        cy.wrap($el.find('.tooltip__cluster-title')).should('have.text', categories[index].name);
        cy.wrap($el.find('.tootlip__cluster-facet')).should('have.text', 1);
    })
})