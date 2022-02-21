import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    checkIfPointFilterDialogIsCollapsed, checkIfPointFilterDialogIsExpanded,
    clickOnText, collapsePointFilterDialog, expandPointFilterDialog, expandPointMapper,
    gotoHomepage,
    hoverOverTheMapCenter,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import all_details from "../point_data/all_details.json";
import profile from "../point_data/profile.json";
import profiles from "./profiles.json";
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
    cy.get('.point-mapper__h2:contains("TVET colleges")').click();
    cy.get('.point-mapper__h2:contains("TVET colleges") .point-mapper__h2_load-complete').should('be.visible');
})

Then('I deselect TVET colleges category', () => {
    cy.get('.point-mapper__h2:contains("TVET colleges")').click();
})

When(/^I check if the marker color is rgb\((\d+), (\d+), (\d+)\)$/, (color1, color2, color3) => {
    cy.get('.leaflet-clusters-pane .leaflet-zoom-animated svg circle').then(($el) => {
        const fill = $el.attr('fill');
        expect(fill).equal(`rgb(${color1}, ${color2}, ${color3})`);
    })
})

Then('I remove TVET colleges from map', () => {
    cy.get('.point-legend[data-id=379] .point-legend__remove').click();
})

When('I expand Labour theme', () => {
    clickOnText('Labour');
})

Then('I select Additional DEL facilities category', () => {
    cy.get('.point-mapper__h2:contains("Additional DEL facilities (unverified)")').click();
    cy.get('.point-mapper__h2:contains("Additional DEL facilities (unverified)") .point-mapper__h2_load-complete').should('be.visible');
})

Then('I deselect Additional DEL facilities category', () => {
    cy.get('.point-mapper__h2:contains("Additional DEL facilities (unverified)")').click();
})

When('I check if the cluster is created correctly', () => {
    const categories = [{
        name: 'Additional DEL facilities (unverified)',
        color: 'rgb(153, 58, 255)',
        circleVal: '100 100'
    }, {
        name: 'TVET colleges',
        color: 'rgb(58, 112, 255)',
        circleVal: '50 100'
    }]

    cy.get('.leaflet-clusters-pane .leaflet-zoom-animated svg text', {timeout: 20000}).should('have.text', 2);

    cy.get('.leaflet-clusters-pane .leaflet-zoom-animated svg circle[fill=none]').each(($el, index) => {
        expect($el.attr('stroke')).to.contain(categories[index].color);
        expect($el.attr('stroke-dasharray')).equal(categories[index].circleVal);
    })

    hoverOverTheMapCenter();

    cy.get("body").then(($body) => {
        if (!$body.find(".leaflet-popup-content").length) {
            cy.log('hover failed - try again');
            hoverOverTheMapCenter();
        }
    })

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
    cy.get('.point-filters__filter-menu:visible').first().click();
})

Then(/^I check if the filter options are "([^"]*)"$/, (arr) => {
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
        cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible:contains("All values")`).click();
    });
});

When(/^I filter by "([^"]*)"$/, (filter) => {
    let orderedList = {
        0: 'Alice',
        1: 'Hiddingh Campus',
        2: 'Nongoma',
        3: 'TestCampus'
    }
    const filters = filter.split(':');
    cy.get('.point-filters__filter-menu:visible').first().click();
    cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible:contains("${filters[0]}")`).click({force: true});

    cy.get('.point-filters__filter-menu:visible').last().click();

    //check if the options are ordered alphabetically
    cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible`).each(($el, index) => {
        const text = $el.text().trim();
        expect(text).to.equal(orderedList[index]);
    })
    cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible:contains("${filters[1]}")`).click({force: true});
});

Then('I hide Point Mapper', () => {
    cy.get('.point-mapper-toggles .point-mapper-panel__close', {timeout: 20000}).click();
})

Then('I filter by a numerical value', () => {
    cy.get('.point-filters__filter-menu:visible').first().click();
    cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible:contains("numerical")`).click();

    cy.get('.point-filters__filter-menu:visible').last().click();
    cy.get(`.dropdown-menu__content:visible .dropdown__list_item:visible:contains("14")`).click();
})

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