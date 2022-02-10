import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    compareImages,
    expandDataMapper,
    expandPointMapper, expandRichDataPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "../map_download/all_details.json";
import profile from "../map_download/profile.json";
import profiles from "../map_download/profiles.json";
import children_indicators from './children_indicators.json';
import points from './points.json';
import themes from './themes.json';

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, themes, points, [], children_indicators);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa');
})

When('I click on map download', () => {
    cy.get('.map-download').click({force: true});
})

Then('I check if an image of the map is downloaded', () => {
    cy.verifyDownload('map.png');
})

Then('I expand Point Mapper', () => {
    expandPointMapper();
})

Then('Point Mapper should be open', () => {
    cy.get('.point-mapper').should('be.visible');
})

Then('Point Mapper should be closed', () => {
    cy.get('.point-mapper').should('not.be.visible');
})

Then('I expand Data Mapper', () => {
    expandDataMapper();
})

Then('Data Mapper should be open', () => {
    cy.get('.data-mapper').should('be.visible');
})

Then('Data Mapper should be closed', () => {
    cy.get('.data-mapper').should('not.be.visible');
})

Then('I expand Rich Data Panel', () => {
    expandRichDataPanel();
})

Then('Rich Data Panel should be open', () => {
    cy.get('.rich-data').should('be.visible');
})

Then('Rich Data Panel should be closed', () => {
    cy.get('.rich-data').should('not.be.visible');
})

Then('Map download button should have title attribute', () => {
    cy.get('.map-download').then($el => {
        expect($el.attr('title')).equal('The panes on the left will be closed to download the full-screen map');
    })
})

Then('Map download button should not have title attribute', () => {
    cy.get('.map-download').should('not.have.attr', 'title');
})

When(/^I click on "([^"]*)" in Data Mapper$/, function (word) {
    cy.get('.data-mapper').findByText(word).click();
});

When('I select a theme in Point Mapper', () => {
    cy.get('.point-mapper .point-mapper__h1_checkbox').first().click();
    cy.get('.point-filters').should('be.visible');
})

Then('I wait until the image of the map is downloaded', () => {
    cy.get('.location-tag__loading-icon').should('not.be.visible');
})

Then('I compare the downloaded image with the reference', () => {
    let downloadUrl = './cypress/downloads/map.png';
    let referenceUrl = './__tests__/gui/map_download/reference.png';

    cy.readFile(downloadUrl, 'base64').then((img1Base) => {
        cy.readFile(referenceUrl, 'base64').then((img2Base) => {
            let prefix = 'data:image/png;base64,';
            let image1Loaded = false;
            let image2Loaded = false;

            let image1 = new Image();
            let image2 = new Image();
            image1.onload = function () {
                image1Loaded = true;
                if (image2Loaded) {
                    compareImages(image1, image2);
                }
            }
            image2.onload = function () {
                image2Loaded = true;
                if (image1Loaded) {
                    compareImages(image1, image2);
                }
            }
            image1.src = prefix + img1Base;
            image2.src = prefix + img2Base;

            console.log({'1': prefix + img1Base, '2': prefix + img2Base})
        })
    })
})