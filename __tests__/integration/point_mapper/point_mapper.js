import { Given, Then } from "cypress-cucumber-preprocessor/steps";

var mapOriginalView = null;

Given('I am on the Wazimap Homepage', () => {
  cy.visit("/")
  cy.wait(6000);
});

Then('I click labour dropdown label', async () => {
  cy.wait(2000);
  cy.screenshot('labour-dropdown-label');
  var imageUrl = `../../cypress/screenshots/point_mapper.feature/labour-dropdown-label.png`
  cy.fixture(imageUrl, 'base64').then(async (base64) => {
    mapOriginalView = base64;
    await cy.get('.point-mapper-content__list > :nth-child(1) > .point-mapper__h1_trigger').click({ force: true });
    await cy.get('[data-id="394"]').click();
  });
});

when("User must see the labours highlights on the map", () => {
  cy.screenshot('labour-dropdown-label-data');
  var imageUrl = `../../cypress/screenshots/point_mapper.feature/labour-dropdown-label-data.png`
  cy.fixture(imageUrl, 'base64').then(base64 => {
    expect(base64).to.not.equal(mapOriginalView);
  });
})

Then('I click labour dropdown label again', async () => {
  cy.get('.point-legend__remove').click()
  cy.screenshot("labour-dropdown-label-no-data")
});

when("User must not see the labours highlights on the map", () => {
  cy.screenshot("labour-dropdown-label-no-data");
  var imageUrl = `../../cypress/screenshots/point_mapper.feature/labour-dropdown-label-no-data.png`
  cy.fixture(imageUrl, 'base64').then(base64 => {
    expect(base64).to.equal(mapOriginalView);
  });
})
