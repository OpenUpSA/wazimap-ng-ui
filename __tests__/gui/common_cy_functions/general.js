export function setupInterceptions(profiles, all_details, profile, themes, points, themes_count = []) {
    cy.intercept('/api/v1/all_details/profile/8/geography/ZA/?version=test&format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: all_details,
            forceNetworkError: false // default
        })
    }).as('all_details')

    cy.intercept('/api/v1/profiles', (req) => {
        req.reply({
            statusCode: 201,
            body: profiles,
            forceNetworkError: false // default
        })
    }).as('profiles')

    cy.intercept('/api/v1/profile_by_url?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: profile,
            forceNetworkError: false // default
        })
    }).as('profile_by_url')

    cy.intercept('/api/v1/profile/8/points/themes/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: themes,
            forceNetworkError: false // default
        })
    }).as('themes')

    cy.intercept('/api/v1/profile/8/points/category/379/points/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: points,
            forceNetworkError: false // default
        })
    }).as('points')

    cy.intercept('/api/v1/profile/8/geography/ZA/themes_count/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: themes_count,
            forceNetworkError: false // default
        });
    }).as('themes_count');
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
    const richData = '.rich-data';
    cy.get(richData).then($ele => {
        if ($ele.is(':visible')) {
            return;
        } else {
            const dataMapper = '.data-mapper';
            const pointMapper = '.point-mapper';

            cy.get(dataMapper).then($dm => {
                if ($dm.is(':visible')) {
                    //data mapper is expanded
                    cy.get('.data-mapper-toggles .rich-data-panel__open').click({force: true});
                } else {
                    cy.get(pointMapper).then($rd => {
                        if ($rd.is(':visible')) {
                            //rich data is expanded
                            cy.get('.point-mapper-toggles .rich-data-panel__open').click({force: true});
                        } else {
                            //nothing is expanded
                            cy.get('.panel-toggles .rich-data-panel__open').click({force: true});
                        }
                    })
                }
            })
        }
    })

    cy.get(richData, {timeout: 20000}).should('be.visible');
}

export function expandPointMapper() {
    const pointMapper = '.point-mapper';
    cy.get(pointMapper).then($ele => {
        if ($ele.is(':visible')) {
            return;
        } else {
            const dataMapper = '.data-mapper';
            const richData = '.rich-data';

            cy.get(dataMapper).then($dm => {
                if ($dm.is(':visible')) {
                    //data mapper is expanded
                    cy.get('.data-mapper-toggles .point-mapper-panel__open').click({force: true});
                } else {
                    cy.get(richData).then($rd => {
                        if ($rd.is(':visible')) {
                            //rich data is expanded
                            cy.get('.rich-data-toggles .point-mapper-panel__open').click({force: true});
                        } else {
                            //nothing is expanded
                            cy.get('.panel-toggles .point-mapper-panel__open').click({force: true});
                        }
                    })
                }
            })
        }
    })

    cy.get(pointMapper, {timeout: 20000}).should('be.visible');
}

export function expandDataMapper() {
    const dataMapper = '.data-mapper';
    cy.get(dataMapper).then($ele => {
        if ($ele.is(':visible')) {
            return;
        } else {
            const richData = '.rich-data';
            const pointMapper = '.point-mapper';

            cy.get(pointMapper).then($dm => {
                if ($dm.is(':visible')) {
                    //data mapper is expanded
                    cy.get('.point-mapper-toggles .data-mapper-panel__open').click({force: true});
                } else {
                    cy.get(richData).then($rd => {
                        if ($rd.is(':visible')) {
                            //rich data is expanded
                            cy.get('.rich-data-toggles .data-mapper-panel__open').click({force: true});
                        } else {
                            //nothing is expanded
                            cy.get('.panel-toggles .data-mapper-panel__open').click({force: true});
                        }
                    })
                }
            })
        }
    })

    cy.get(dataMapper, {timeout: 20000}).should('be.visible');
}