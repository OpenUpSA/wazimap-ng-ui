import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";

Given('I am on the Wazimap Homepage', () => {
  cy.visit("/");
  cy.wait(6000);
})

Then('I click on search bar', () => {
  var element = cy.get("input[class='location__search_input w-input ui-autocomplete-input'")
  element.clear(); // clear the search bar for the next test input
  element.should('be.visible');
  element.click();
  cy.wait(3000);
});

And('I enter cape town in the search field', () => {
  cy.typeInSearchField('cape town');
});

Then('I select the city of cape town as mainplace', () => {
  cy.selectNItemInSearch(1);
});

Then('I must see country as south africa and other location types', () => {
  cy.findByText("country").should('exist');
  cy.findByText("province").should('exist');
  cy.findByText("district").should('exist');
  cy.findAllByText("mainplace").should('exist');
});

var mapOriginalView = null;

When('I click on map zoom', () => {
  cy.screenshot('test-zoom-in');
  var imageUrl = `../../cypress/screenshots/map.feature/test-zoom-in.png`
  cy.fixture(imageUrl, 'base64').then(base64 => {
    mapOriginalView = base64;
    cy.get(".leaflet-control-zoom-in").click({ force: true });
  });
})

Then('map should be zoomed in', () => {
  cy.screenshot('test-zoom-in2');
  var imageUrl = `../../cypress/screenshots/map.feature/test-zoom-in2.png`
  cy.fixture(imageUrl, 'base64').then(base64 => {
    expect(base64).to.not.equal(mapOriginalView);
  });
});

When('I click on map zoom out', () => {
  cy.screenshot('test-zoom-out');
  var imageUrl = `../../cypress/screenshots/map.feature/test-zoom-out.png`
  cy.fixture(imageUrl, 'base64').then(base64 => {
    mapOriginalView = base64;
    cy.get(".leaflet-control-zoom-out").click({ force: true })
  });
})

Then('map should be zoomed out', () => {
  cy.screenshot('test-zoom-out2');
  var imageUrl = `../../cypress/screenshots/map.feature/test-zoom-out2.png`
  cy.fixture(imageUrl, 'base64').then(base64 => {
    expect(base64).to.not.equal(mapOriginalView);
  });
});

And('I enter free state in the search field', () => {
  cy.typeInSearchField('free state');
});

And('I enter thabo mofutsanyane in the search field', () => {
  cy.typeInSearchField('thabo mofutsanyane');
});

And('I enter dihlabeng in the search field', () => {
  cy.typeInSearchField('dihlabeng');
});

And('I enter dihlabeng nu in the search field', () => {
  cy.typeInSearchField('dihlabeng nu');
});
