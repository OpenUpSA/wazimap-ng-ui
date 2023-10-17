import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    checkIfPointFilterDialogIsCollapsed, checkIfPointFilterDialogIsExpanded,
    clickOnText, collapsePointFilterDialog, confirmDropdownOptions, expandPointFilterDialog, expandPointMapper,
    gotoHomepage,
    hoverOverTheMapCenter,
    setupInterceptions,
    waitUntilGeographyIsLoaded,
    assertMarkerCountOnMap
} from "../common_cy_functions/general";
import all_details from "../points_by_keyword/all_details.json";
import profile from "../points_by_keyword/profile.json";
import profiles from "./profiles.json";
import themes from "../points_by_keyword/themes.json";
import points from "../points_by_keyword/points.json";
import points_2 from "../points_by_keyword/points_2.json";
import points_3 from "../points_by_keyword/points_3.json";

Given('I am on the Wazimap Homepage', () => {
    cy.intercept('/api/v1/profile/8/points/category/394/points/?format=json', (req) => {
        req.reply({
            statusCode: 201,
            body: points_2,
            forceNetworkError: false // default
        })
    })

    cy.intercept('/api/v1/profile/8/points/category/379/points/?format=json&q=Nongoma', (req) => {
        req.reply({
            statusCode: 200,
            body: points_3,
            forceNetworkError: false // default
        })
    }).as('points')

    cy.intercept('/api/v1/profile/8/points/category/394/points/?format=json&q=Nongoma', (req) => {
        req.reply({
            statusCode: 201,
            body: points_2,
            forceNetworkError: false // default
        })
    })

    setupInterceptions(profiles, all_details, profile, themes, points);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa');
})

When('I expand Higher Education theme', () => {
    cy.wait(1000);
    clickOnText('Higher Education');
})

Then('I select TVET colleges category', () => {
    cy.get('li[data-test-class="tree-view-category-item"]:contains("TVET colleges")')
        .closest('li[data-test-class="tree-view-theme-item"]')
        .find('i.material-icons')
        .should('have.css', 'color')
        .and('eq', 'rgb(34, 166, 179)');
    cy.get('li[data-test-class="tree-view-category-item"]:contains("TVET colleges")').click();
    cy.get('li[data-test-class="tree-view-category-item"]:contains("TVET colleges") i.fa-check').should('be.visible');
    cy.get('li[data-test-class="tree-view-category-item"]:contains("TVET colleges") .MuiTreeItem-content')
        .should('have.css', 'background-color')
        .and('eq', 'rgba(34, 166, 179, 0.2)');
})

When('I expand Labour theme', () => {
    clickOnText('Labour');
})

Then('I select Additional DEL facilities category', () => {
    cy.get('li[data-test-class="tree-view-category-item"]:contains("Additional DEL facilities (unverified)")')
        .closest('li[data-test-class="tree-view-theme-item"]')
        .find('i.material-icons')
        .should('have.css', 'color')
        .and('eq', 'rgb(235, 77, 75)');
    cy.get('li[data-test-class="tree-view-category-item"]:contains("Additional DEL facilities (unverified)")').click();
    cy.get('li[data-test-class="tree-view-category-item"]:contains("Additional DEL facilities (unverified)") i.fa-check').should('be.visible');
    cy.get('li[data-test-class="tree-view-category-item"]:contains("Additional DEL facilities (unverified)") .MuiTreeItem-content')
        .should('have.css', 'background-color')
        .and('eq', 'rgba(235, 77, 75, 0.2)');
})

When('I check if the cluster is created correctly', () => {
    const categories = [{
        name: 'Additional DEL facilities (unverified)',
        color: 'rgb(235, 77, 75)',
        circleVal: '100 100',
        hex: "#eb4d4b"
    }, {
        name: 'TVET colleges',
        color: 'rgb(34, 166, 179)',
        circleVal: '50 100',
        hex: "#22a6b3"
    }]

    cy.get('.leaflet-clusters-pane .leaflet-zoom-animated svg text', {timeout: 20000}).should('have.text', 2);

    cy.get('.leaflet-clusters-pane .leaflet-zoom-animated svg circle[fill=none]').each(($el, index) => {
        expect($el.attr('stroke')).to.contain(categories[index].hex);
        expect($el.attr('stroke-dasharray')).equal(categories[index].circleVal);
    })

    hoverOverTheMapCenter().then(() => {
        cy.get('.leaflet-popup-pane .facility-tooltip__cluster a.tooltip__cluster-item', {timeout: 20000}).get(($el) => {
            expect($el.length).equal(2);
        })

        cy.get('.leaflet-popup-pane .facility-tooltip__cluster a.tooltip__cluster-item').each(($el, index) => {
            expect($el.find('.tooltip__cluster-icon').attr('style')).to.contain(`background-color: ${categories[index].color};`);
            expect($el.find('.tooltip__cluster-title')).to.have.text(categories[index].name);
            expect($el.find('.tootlip__cluster-facet')).to.have.text('1');
        })

        cy.get('body').trigger('click', {clientX: 0, clientY: 0})
    })
})

Then('I check if the filter dialog is displayed', () => {
    let mapBottomItems = '.map-bottom-items--v2';
    cy.get(`${mapBottomItems} .point-filters`).should('be.visible')
    cy.get(`${mapBottomItems} .point-filters .point-filters__title .filters__header_name div div`).should('have.text', 'Point Filters')
})

Then('I check if the point category legend is hidden', () => {
    cy.get('.map-point-legend').should('not.be.visible');
    cy.get('.map-point-legend').should('have.class', 'visible-in-download');
})

When('I click on the first filter dropdown', () => {
    cy.get(`.point-filters_content .filter-container:visible:eq(0) .point-filters__filter`)
      .eq(0).find("div").eq(0).click()
})

Then(/^I check if the filter options are "([^"]*)"$/, (arr) => {
    confirmDropdownOptions(arr);
});

When(/^I filter by "([^"]*)"$/, (filter) => {
    let orderedList = 'Alice,Hiddingh Campus,Nongoma,TestCampus';
    const filters = filter.split(':');
    cy.get(`.point-filters_content .filter-container:visible:eq(0) .point-filters__filter`)
      .eq(0).click().get(`ul > li[data-value="${filters[0]}"]`).click();

    cy.get(`.point-filters_content .filter-container:visible:eq(0) .point-filters__filter`)
      .eq(1).click().type(filters[1]).type('{enter}')
});

Then('I check if the filter dialog is collapsed', () => {
    checkIfPointFilterDialogIsCollapsed();
})

When('I expand the filter dialog', () => {
    expandPointFilterDialog();
})

Then('I check if the filter dialog is expanded', () => {
    checkIfPointFilterDialogIsExpanded();
})

When('I collapse the filter dialog', () => {
    collapsePointFilterDialog();
})

When('I expand Point Mapper', () => {
    expandPointMapper();
})

Then(`I assert that {int} markers are displayed on map`, (count) => {
    assertMarkerCountOnMap(count);
})
