export function setupInterceptions(profiles, all_details, profile, themes, points) {
    cy.intercept('/api/v1/all_details/profile/8/geography/ZA/?version=test&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: all_details,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profiles', (req) => {
        req.reply({
            statusCode: 201,
            body: profiles,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile_by_url?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: profile,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile/8/points/themes/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: themes,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile/8/points/category/379/points/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: points,
            forceNetworkError: false // default
        })
    })
}

export function gotoHomepage() {
    cy.visit("/");
}

export function waitUntilGeographyIsLoaded(geoName) {
    cy.get('.map-location .location-tag .location-tag__name .truncate', {timeout: 20000}).should('contain', geoName);
}

export function clickOnText(text) {
    cy.findByText(text).click()
}

export function clickOnTheFirstTheme() {
    cy.get('.point-mapper .point-mapper-content__list .point-mapper__h1').first().click();
}

export function checkIfCategoriesAreDisplayed() {
    cy.get('.point-mapper .point-mapper-content__list .point-mapper__h1 .point-mapper__h1_content').should('be.visible');
}

export function clickOnTheFirstCategory() {
    cy.get('.point-mapper .point-mapper-content__list .point-mapper__h1 .point-mapper__h1_content .point-mapper__h2_wrapper .point-mapper__h2').first().click();
}

export function hoverOverTheMapCenter() {
    const coordinates = getMapCenter();
    cy.get('body')
        .trigger('mousemove', {clientX: 0, clientY: 0})
        .trigger('mousemove', {clientX: coordinates.x, clientY: coordinates.y});
}

export function getMapCenter() {
    let navHeight = 56;
    let width = Cypress.config("viewportWidth");
    let height = Cypress.config("viewportHeight");
    let x = (width / 2);
    let y = (height / 2) + (navHeight / 2);

    return {x, y};
}

export function expandRichDataPanel() {
    cy.get('.point-mapper-toggles .rich-data-panel__open').click();
}