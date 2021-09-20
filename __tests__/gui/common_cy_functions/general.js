export function setupInterceptions(all_details, profile, themes, points) {
    cy.intercept('/api/v1/all_details/profile/8/geography/ZA/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: all_details,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile_by_url/?format=json', (req) => {
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

export function clickOnText(text){
    cy.findByText(text).click()
}