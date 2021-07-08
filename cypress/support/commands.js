import '@testing-library/cypress/add-commands';


Cypress.Commands.add('typeInSearchField', (str) => {
  cy.wait(3000);
  var element = cy.get("input[class='location__search_input w-input ui-autocomplete-input'");
  element.type(str);
  cy.wait(3000);
});

Cypress.Commands.add('selectNItemInSearch', (n) => {
  cy.get(`.search__dropdown_list > :nth-child(${parseInt(n)})`).click();
});
