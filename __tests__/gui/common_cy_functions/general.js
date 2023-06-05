import pixelmatch from "pixelmatch";
import profile_indicator_summary from "../data_mapper/profile_indicator_summary.json";

export const mapBottomItems = '.map-bottom-items--v2';
export const allDetailsEndpoint = 'all_details';
const recursiveResult = {PANEL_ALREADY_EXPANDED: false, ALL_PANELS_CLOSED: true};

const geoCoordinates = {
    "EC": {
        lat: -32.033241,
        lng: 26.838765,
        name: "Eastern Cape"
    },
    "WC": {
        lat: -33.571055,
        lng: 19.868258,
        name: "Western Cape"
    },
    "FS": {
        lat: -28.886856,
        lng: 26.202557,
        name: "Free State"
    },
    "NC": {
        lat: -29.719176,
        lng: 21.283331,
        name: "Northern Cape"
    },
    "CPT": {
        lat: -33.978895,
        lng: 18.529666,
        name: "City of Cape Town"
    },
    "DC3": {
        lat: -34.433911,
        lng: 19.857072,
        name: "Overberg"
    },
    "ZA-Test": {
        name: "South Africa Test"
    },
    "DC8": {
        lat: -28.039903,
        lng: 20.962051,
        name: "Siyanda"
    },
    "NC085": {
      lat: -28.371381,
      lng: 23.079396,
      name: "Tsantsabane"
    }
}
const allPanels = [
    {
        panel: '.data-mapper',
        wrapper: '.data-mapper-toggles',
        button: '.data-mapper-panel__open',
        closeButton: '.data-mapper-panel__close'
    }, {
        panel: '.point-mapper',
        wrapper: '.point-mapper-toggles',
        button: '.point-mapper-panel__open',
        closeButton: '.point-mapper-panel__close'
    }, {
        panel: '.rich-data',
        wrapper: '.rich-data-toggles',
        button: '.rich-data-panel__open',
        closeButton: '.rich-data-panel__close'
    }
];


export function setupInterceptions(profiles, all_details, profile, themes, points, themes_count = [],
                                   profile_indicator_summary = {}, indicator_data = {}, categories_data = []) {

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

    cy.intercept('/api/v1/profile/8/geography/ZA/profile_indicator_summary/?version=test&format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: profile_indicator_summary,
            forceNetworkError: false // default
        });
    }).as('profile_indicator_summary');

    cy.intercept('/api/v1/profile/8/geography/**/indicator/**/child_data/', (request) => {
        request.reply({
            statusCode: 200,
            body: extractRequestedIndicatorData(request.url, indicator_data),
            forceNetworkError: false // default
        });
    }).as('indicator_data');

    cy.intercept('/api/v1/profiles/8/categories/?format=json', (request) => {
        request.reply({
            statusCode: 200,
            body: categories_data,
            forceNetworkError: false // default
        });
    }).as('categories_data');
}

export function setupInterceptionsForSpecificGeo(geoCode, all_details) {
    cy.intercept(`/api/v1/${allDetailsEndpoint}/profile/8/geography/${geoCode}/?skip-children=true&format=json`, (req) => {
        req.reply({
            statusCode: 200,
            body: all_details,
            forceNetworkError: false // default
        })
    }).as('all_details')
}

export function visitToGeo(geoCode, isParent = false, forceClick = false) {
    if (isParent) {
        const geoName = geoCoordinates[geoCode].name;
        cy.get(`.map-location .location-tag .location-tag__name .truncate:contains('${geoName}')`, {timeout: 20000}).click();
    } else {
        const coords = geoCoordinates[geoCode];
        let L;
        cy.window().then((win) => {
            L = win.L;
            let map = win.map;
            const latlng = L.latLng(coords.lat, coords.lng);

            map.flyTo(latlng, 14);
            const waitMs = forceClick ? 4000 : 0;
            hoverOverTheMapCenter('.leaflet-overlay-pane .leaflet-zoom-animated')
                .then(() => {
                    cy.wait(waitMs).then(() => {
                        cy.get('.leaflet-overlay-pane .leaflet-zoom-animated').click({force: forceClick});
                    })
                })
        });
    }
}

export function extractRequestedIndicatorData(url, indicatorData) {
    let domain = url.match(/^https:\/\/[^/]+/);
    let geo = url.replace(`${domain}/api/v1/profile/8/geography/`, '');
    geo = geo.replace(geo.substring(geo.indexOf('/')), '');

    let indicatorId = url.replace(`${domain}/api/v1/profile/8/geography/${geo}/indicator/`, '');
    indicatorId = indicatorId.replace('/child_data/', '');
    indicatorId = parseInt(indicatorId);

    let result = indicatorData.filter(x => {
        return x.id === indicatorId
    });

    if (result[0] !== undefined) {
        return result[0].data[geo];
    } else {
        return {};
    }
}

export function gotoHomepage() {
    cy.visit("/");
}

export function gotoProfileViewHomepage(view_name) {
    cy.visit(`/?view=${view_name}`);
}

export function gotoTabularComparison() {
    cy.visit("/tabular-comparison.html");
}

export function waitUntilGeographyIsLoaded(geoName) {
    cy.get('.map-location .location-tag .location-tag__name .truncate', {timeout: 20000}).should('contain', geoName);
}

export function clickOnText(text) {
    cy.findByText(text).click()
}

export function clickOnTheFirstTheme() {
    cy.get('.point-mapper li[data-test-class="tree-view-theme-item"]').first().click();
}

export function checkIfCategoriesAreDisplayed() {
    cy.get('.point-mapper li[data-test-class="tree-view-category-item"]').should('be.visible');
}

export function clickOnTheFirstCategory() {
    cy.get('.point-mapper li[data-test-class="tree-view-category-item"]').first().click();
}

export const hoverOverTheMapCenter = (elementSelectorToFind = null, retryCount = 5) => new Cypress.Promise(function (resolve) {
    const coordinates = getMapCenter();
    cy.get('body')
        .trigger('mousemove', {clientX: 0, clientY: 0})
        .trigger('mousemove', {clientX: coordinates.x, clientY: coordinates.y});

    if (elementSelectorToFind !== null) {
        cy.get("body").then(($body) => {
            if (!$body.find(elementSelectorToFind).length && retryCount > 1) {
                cy.log('hover failed - try again');
                hoverOverTheMapCenter(elementSelectorToFind, retryCount - 1).then(() => {
                    resolve();
                });
            } else {
                resolve();
            }
        })
    }
})

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

export function collapseRichDataPanel() {
    collapsePanel('.rich-data');
}

function collapsePanel(panel) {
    const panelToBeCollapsed = allPanels.filter((p) => {
        return p.panel === panel
    })[0];

    cy.get(panelToBeCollapsed.panel).then($p => {
        if ($p.is(':visible')) {
            cy.get(`${panelToBeCollapsed.wrapper} ${panelToBeCollapsed.closeButton}`).click();
        } else {
            // the panelToBeExpanded is already collapsed
        }
    })
}

function expandPanel(panel) {
    cy.wait(1000);
    // cy.wait is necessary because closing a panel and opening another takes some time.
    // if a test is too quickly closing and opening panels, it creates problems

    const panelToBeExpanded = allPanels.filter((p) => {
        return p.panel === panel
    })[0];

    const nonSelectedPanels = allPanels.filter((p) => {
        return p.panel !== panel
    });

    recTogglePanel(panelToBeExpanded, nonSelectedPanels, 0).then(function (result) {
        if (result) {
            //nothing was expanded
            cy.get(`.panel-toggles ${panelToBeExpanded.button}`).click().then(() => {
                cy.get(panel, {timeout: 20000}).should('be.visible');
            });
        } else {
            cy.get(panel, {timeout: 20000}).should('be.visible');
        }
    })
}

const recTogglePanel = (panelToBeExpanded, nonSelectedPanels, index) => new Cypress.Promise(function (resolve) {
    cy.get(panelToBeExpanded.panel).then($p => {
        if ($p.is(':visible')) {
            // the panelToBeExpanded is already expanded
            resolve(recursiveResult.PANEL_ALREADY_EXPANDED);
        } else {
            // the panelToBeExpanded is not expanded
            // check the other panels to see which toggle class needs to be used
            const nsp = nonSelectedPanels[index];
            cy.get(nsp.panel).then($p => {
                if ($p.is(':visible')) {
                    cy.get(`${nsp.wrapper} ${panelToBeExpanded.button}`).click();
                    resolve(recursiveResult.PANEL_ALREADY_EXPANDED);
                } else {
                    let newIndex = ++index;
                    if (nonSelectedPanels.length <= newIndex) {
                        // none of the panels are visible
                        resolve(recursiveResult.ALL_PANELS_CLOSED);
                    } else {
                        recTogglePanel(panelToBeExpanded, nonSelectedPanels, newIndex).then(function (recursiveResult) {
                            resolve(recursiveResult);
                        });
                    }
                }
            })
        }
    })
})

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
    const descriptionArea = '.map-options__context--v2';
    const legendArea = '.map-options__legend';
    checkIfFilterDialogIsCollapsed('.map-options', '.map-options__filters_content');
    cy.get(`${mapBottomItems} .map-options ${descriptionArea}`).should('not.be.visible');
    cy.get(`${mapBottomItems} .map-options ${legendArea}`).should('be.visible');
}

export function expandChoroplethFilterDialog() {
    expandFilterDialog('.map-options');
}

export function closeChoroplethFilterDialog() {
    closeFilterDialog('.map-options');
}

export function checkIfChoroplethFilterDialogIsExpanded() {
    const descriptionArea = '.map-options__context--v2';
    const legendArea = '.map-options__legend';
    checkIfFilterDialogIsExpanded('.map-options', '.map-options__filters_content');
    cy.get(`${mapBottomItems} .map-options ${descriptionArea}`).should('be.visible');
    cy.get(`${mapBottomItems} .map-options ${legendArea}`).should('be.visible');
}

function expandFilterDialog(parentDiv) {
    cy.get(`${mapBottomItems} ${parentDiv} .toggle-icon-v--last`).click();
}

function closeFilterDialog(parentDiv) {
    cy.get(`${mapBottomItems} ${parentDiv} .filters__header_close`).click();
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

export function checkDataMapperCategoryCount(count) {
    cy.get('.data-mapper-content__list .indicator-category').should('have.length', count);
}

export function compareImages(image1, image2) {
    let width = image1.width;
    let height = image1.height;

    let canvas1 = document.createElement('canvas');
    canvas1.getContext("2d").drawImage(image1, 0, 0);

    let canvas2 = document.createElement('canvas');
    canvas2.getContext("2d").drawImage(image2, 0, 0);

    let context1 = canvas1.getContext("2d");
    let context2 = canvas2.getContext("2d");

    const img1 = context1.getImageData(0, 0, width, height);
    const img2 = context2.getImageData(0, 0, width, height);

    let pixelDiff = pixelmatch(img1.data, img2.data, null, width, height, {threshold: 0.1});

    expect(pixelDiff).to.equal(0);
}

export function confirmNoChoroplethFilterSelected() {
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible`).should('have.length', 1);
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible .mapping-options__filter`)
        .eq(0)
        .find(' .dropdown-menu__selected-item .truncate')
        .should('have.text', 'Select an attribute');
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible .mapping-options__filter`).eq(1).should('have.class', 'disabled');
}

export function confirmNoChartFilterSelected() {
    cy.get('.rich-data-content .profile-indicator__filter-row:visible').should('have.length', 1);
    cy.get('.rich-data-content .profile-indicator__filter-row:visible .profile-indicator__filter')
        .eq(0)
        .find(' .dropdown-menu__selected-item .truncate')
        .should('have.text', 'Select an attribute');
    cy.get('.rich-data-content .profile-indicator__filter-row:visible .profile-indicator__filter').eq(1).should('have.class', 'disabled');
}

export function selectChoroplethDropdownOption(option, dropdownIndex, filterRowIndex = 0) {
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${filterRowIndex}) .mapping-options__filter`)
        .eq(dropdownIndex)
        .should('not.have.class', 'disabled');
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${filterRowIndex}) .mapping-options__filter`)
        .eq(dropdownIndex)
        .click();

    cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible:contains("${option}")`, {timeout: 20000}).click({force: true})
}

export function selectChartDropdownOption(option, dropdownIndex) {
    cy.get(`.rich-data-content .profile-indicator__filter-row:visible .profile-indicator__filter`)
        .eq(dropdownIndex)
        .should('not.have.class', 'disabled');
    cy.get(`.rich-data-content .profile-indicator__filter-row:visible .profile-indicator__filter`)
        .eq(dropdownIndex)
        .click();

    cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible:contains("${option}")`, {timeout: 20000}).click({force: true})
}

export function confirmChoroplethIsFiltered(group, value, index) {
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${index})`).should('have.length', 1);
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${index}) .mapping-options__filter`)
        .eq(0)
        .find(' .dropdown-menu__selected-item .truncate')
        .should('have.text', group);
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${index}) .mapping-options__filter:eq(1) .dropdown-menu__selected-item .truncate`, {timeout: 5000})
        .should('have.text', value);
    cy.get(`${mapBottomItems} .map-options .map-options__filter-row:visible:eq(${index}) .mapping-options__filter`, {timeout: 5000})
        .eq(1)
        .should('not.have.class', 'disabled');
}

export function confirmDropdownOptions(arr) {
    let filters = [];
    cy.get('.dropdown-menu__content:visible .dropdown__list_item:visible').each(($el) => {
        const text = $el.text().trim();
        filters.push(text);
    }).then(() => {
        let params = [];
        arr.split(',').forEach((a) => {
            params.push(a.trim());
        })

        expect(params).to.have.members(filters);
        cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible`).first().click();
    });
}

export function expandMyViewPanel() {
    cy.get('div[data-test-id="my-view-panel"]').then($panel => {
        if ($panel.is(':hidden')) {
            cy.get('div[data-test-id="my-view-toggle"]').click();
        }
    })
}

export function collapseMyViewPanel() {
    cy.get('div[data-test-id="my-view-panel"]').then($panel => {
        if ($panel.is(':visible')) {
            cy.get('div[data-test-id="my-view-close-button"]').click({force: true});
        }
    })
}

export function confirmChartIsFiltered(group, value, chartTitle) {
    let matches = false;

    cy.get(`.profile-indicator__title h4:contains("${chartTitle}")`)
        .closest('.profile-indicator')
        .find('.profile-indicator__filter-row')
        .each(($el) => {
            matches = $el.find('.profile-indicator__filter')
                    .eq(0)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger .dropdown-menu__selected-item .truncate')
                    .text() === group &&
                $el.find('.profile-indicator__filter')
                    .eq(1)
                    .find('.profile-indicator__filter_menu .dropdown-menu__trigger .dropdown-menu__selected-item .truncate')
                    .text() === value
        }).then(() => {
        expect(matches).equal(true);
    })
}
