import { When } from "cypress-cucumber-preprocessor/steps";

when("I click on {word}", (link) => {
  cy.findByText(link).click()
})

then("{string} should be displayed", (text) => {
  cy.findByText(text).should('exist')
})

And('I enter {string} in the search field', (str) => {
  cy.wait(3000)
  var element = cy.get("input[class='location__search_input w-input ui-autocomplete-input'")
  element.type(str);
  cy.wait(3000)
});
