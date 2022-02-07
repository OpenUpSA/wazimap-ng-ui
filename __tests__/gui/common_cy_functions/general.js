export const mapBottomItems = '.map-bottom-items--v2';
export const allDetailsEndpoint = 'all_details';

export function setupInterceptions(profiles, all_details, profile, themes, points, themes_count = [], children_indicators = {}) {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/ZA/?version=test&skip-children=true&format=json`, (req) => {
        req.reply({
            statusCode: 200,
            body: all_details,
            forceNetworkError: false // default
        })
    }).as('all_details')

    cy.intercept('/api/v1/profiles', (req) => {
        req.reply({
            statusCode: 200,
            body: profiles,
            forceNetworkError: false // default
        })
    }).as('profiles')

    cy.intercept('/api/v1/profile_by_url?format=json', (req) => {
        req.reply({
            statusCode: 200,
            body: profile,
            forceNetworkError: false // default
        })
    }).as('profile_by_url')

    cy.intercept('/api/v1/profile/8/points/themes/?format=json', (req) => {
        req.reply({
            statusCode: 200,
            body: themes,
            forceNetworkError: false // default
        })
    }).as('themes')

    cy.intercept('/api/v1/profile/8/points/category/379/points/?format=json', (req) => {
        req.reply({
            statusCode: 200,
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

    cy.intercept('/api/v1/children-indicators/profile/8/geography/ZA/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: children_indicators,
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
    expandPanel('.rich-data');
}

export function expandPointMapper() {
    expandPanel('.point-mapper');
}

export function expandDataMapper() {
    expandPanel('.data-mapper');
}

function expandPanel(panel) {
    const allPanels = [
        {
            panel: '.data-mapper',
            wrapper: '.data-mapper-toggles',
            button: '.data-mapper-panel__open'
        }, {
            panel: '.point-mapper',
            wrapper: '.point-mapper-toggles',
            button: '.point-mapper-panel__open'
        }, {
            panel: '.rich-data',
            wrapper: '.rich-data-toggles',
            button: '.rich-data-panel__open'
        }
    ];

    const panelToBeExpanded = allPanels.filter((p) => {
        return p.panel === panel
    })[0];
    const nonSelectedPanels = allPanels.splice(allPanels.indexOf(panelToBeExpanded.panel), 1);

    let closedNoPanels = true;
    nonSelectedPanels.forEach(nsp => {
            if (closedNoPanels) {
                cy.get(nsp.panel).then($p => {
                    if ($p.is(':visible')) {
                        cy.get(`${nsp.wrapper} ${panelToBeExpanded.button}`).click({force: true});
                        closedNoPanels = false;
                    }
                })
            }
        }
    )

    if (closedNoPanels) {
        //nothing was expanded
        cy.get(`.panel-toggles ${panelToBeExpanded.button}`).click({force: true});
    }

    cy.get(panel, {timeout: 20000}).should('be.visible');
}

export function collapsePointFilterDialog() {
    collapseFilterDialog('.point-filters');
}

export function checkIfPointFilterDialogIsCollapsed() {
    checkIfFilterDialogIsCollapsed('.point-filters', '.point-filters_content');
}

export function expandPointFilterDialog() {
    expandFilterDialog('.point-filters');
}

export function checkIfPointFilterDialogIsExpanded() {
    checkIfFilterDialogIsExpanded('.point-filters', '.point-filters_content');
}

export function collapseChoroplethFilterDialog() {
    collapseFilterDialog('.map-options');
}

export function checkIfChoroplethFilterDialogIsCollapsed() {
    checkIfFilterDialogIsCollapsed('.map-options', '.map-options__filters_content');
}

export function expandChoroplethFilterDialog() {
    expandFilterDialog('.map-options');
}

export function checkIfChoroplethFilterDialogIsExpanded() {
    checkIfFilterDialogIsExpanded('.map-options', '.map-options__filters_content');
}

function expandFilterDialog(parentDiv) {
    cy.get(`${mapBottomItems} ${parentDiv} .toggle-icon-v--last`).click();
}

function collapseFilterDialog(parentDiv) {
    cy.get(`${mapBottomItems} ${parentDiv} .toggle-icon-v--first`).click();
}

function checkIfFilterDialogIsExpanded(parentDiv, contentDiv) {
    cy.get(`${mapBottomItems} ${parentDiv}`).should('be.visible');
    cy.get(`${mapBottomItems} ${parentDiv} .toggle-icon-v--first`).should('be.visible');    //down arrow
    cy.get(`${mapBottomItems} ${parentDiv} .toggle-icon-v--last`).should('not.be.visible');    //up arrow
    cy.get(`${mapBottomItems} ${parentDiv} ${contentDiv}`).should('be.visible');
}

function checkIfFilterDialogIsCollapsed(parentDiv, contentDiv) {
    cy.get(`${mapBottomItems} ${parentDiv}`).should('be.visible');
    cy.get(`${mapBottomItems} ${parentDiv} .toggle-icon-v--first`).should('not.be.visible');    //down arrow
    cy.get(`${mapBottomItems} ${parentDiv} .toggle-icon-v--last`).should('be.visible');    //up arrow
    cy.get(`${mapBottomItems} ${parentDiv} ${contentDiv}`).should('not.be.visible');
}

export function checkDataMapperCategoryCount(count){
    cy.get('.data-mapper-content__list .data-category--v2').should('have.length', count);
}
