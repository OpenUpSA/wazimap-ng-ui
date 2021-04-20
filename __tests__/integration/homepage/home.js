import { When, Given, Then } from "cypress-cucumber-preprocessor/steps";

Given('I am on the Wazimap Homepage', () => {
  cy.visit("/");
});

Then('Tutorial button should be visible', () => {
  cy.get("div[class=nav__link-wrap]");
  cy.get("a[class='nav__link tutorial__open w-inline-block']");
});

Then('Panel Toggles should be visible', () => {
  cy.get("div[class=point-mapper-toggles]").then(panel => {
    panel.get("div[class='panel-toggle rich-data-panel__open']");
    panel.get("div[class='panel-toggle point-mapper-panel__close cc-active']");
  });
});

When("I click on Rich Data panel", () => {
  cy.get("div[class=point-mapper-toggles]").then(panel => {
  panel.find("div[class='panel-toggle rich-data-panel__open']").click();
  });
})
