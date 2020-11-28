import { When } from "cypress-cucumber-preprocessor/steps";

when("I click on {word}", (link) => {
  cy.findByText(link).click()
})

then("{string} should be displayed", (text) => {
  cy.findByText(text).should('exist')
})
