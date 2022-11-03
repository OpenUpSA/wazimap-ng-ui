import {When, Given, Then} from "cypress-cucumber-preprocessor/steps";
import all_details from "../rich_data/all_details.json";
import {
    expandRichDataPanel,
    gotoHomepage,
    setupInterceptions,
    waitUntilGeographyIsLoaded
} from "../common_cy_functions/general";
import profiles from "../rich_data/profiles.json";
import profile from "../rich_data/profile.json";

Given('I am on the Wazimap Homepage', () => {
    setupInterceptions(profiles, all_details, profile, null, null);
    gotoHomepage();
})

Then('I wait until map is ready', () => {
    waitUntilGeographyIsLoaded('South Africa');
})

When('I expand Rich Data', () => {
    expandRichDataPanel();
})

Then('Rich Data should be displayed', () => {
    cy.get('.rich-data-nav__list').should('be.visible');
})

When('I mouseover the hamburger menu', () => {
    cy.get('.hover-menu').first().trigger('mouseover');
})

Then('the hamburger menu should show', () => {
    cy.get('.hover-menu__content').should('be.visible');
})

When('I click on Save As Image in Rich Data', () => {
    cy.get('.hover-menu__content_item').first().click({force: true});
    cy.verifyDownload('Youth status.png');
})

When('I scroll to bottom of the page', () => {
    cy.scrollTo('bottom')
})

Then(/^I check if "([^"]*)" is active$/, function (word) {
    cy.get(`.rich-data-nav__item.w-inline-block[title="${word}"]`).should('have.class', 'w--current');
});

Then('None of the menu items should be active', () => {
    cy.get('.rich-data-nav__item.w--current').should('have.length', 0);
})

When('I close the Rich Data', () => {
    cy.get('.rich-data-toggles .rich-data-panel__close').click();
})

Then('I check if the indicator with only zero counts is hidden', () => {
    cy.get('.profile-indicator__title:contains("Indicator with only zero counts")').should('not.exist');
})

Then(/^I confirm that the category "([^"]*)" is invisible$/, function (categoryName) {
    cy.get(`.category-header h2:contains(${categoryName})`).should('not.be.visible');
    cy.get(`.rich-data-nav__item:contains(${categoryName})`).should('not.exist');
});

Then(/^I confirm that the subcategory "([^"]*)" is invisible$/, function (categoryName) {
    cy.get(`.sub-category-header h3:contains(${categoryName})`).should('not.be.visible');
});

Then(/^I confirm that the subcategory "([^"]*)" is visible$/, function (categoryName) {
    cy.get(`.sub-category-header h3:contains(${categoryName})`).should('be.visible');
});

Then('I confirm that the categories are in correct order', () => {
    const correctOrder = ['Summary', 'Test Category 4', 'Test Category 2', 'Test Category 3', 'Test Category 1'];

    cy.get('.rich-data-nav__list a.rich-data-nav__item .rich-data-nav__item-text .truncate').each(($el, index) => {
        cy.wrap(correctOrder[index]).should('eq', $el.text());
    })
})

Then('I confirm that the subcategories are in correct order', () => {
    const correctOrder = ['South African Citizenship', 'Population'];

    cy.get('#category-4')
        .closest('.section')
        .find('.sub-category-header .sub-category-header__title .indicator__title_wrapper h3')
        .each(($el, index) => {
            cy.wrap(correctOrder[index]).should('eq', $el.text());
        })
})

Then('I confirm that the indicators are in correct order', () => {
    const correctOrder = ['Citizenship', 'Youth status 2', 'Youth status'];

    cy.get('#category-4')
        .closest('.section')
        .find('.profile-indicator .profile-indicator__header .profile-indicator__title h4')
        .each(($el, index) => {
            cy.wrap(correctOrder[index]).should('eq', $el.text());
        })
})