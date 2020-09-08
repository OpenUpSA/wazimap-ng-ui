# Created by siddharththakur at 26/08/20
Feature:  Rich Data
  Summary
  Demographics
  Population
  Education
  Family & Living Env.
  Poverty


  Scenario: Verify the rich data items are displayed
    Given I am on the Wazimap Homepage
    And I click on Rich data item
    Then User must see summary
    And I click on Demographic item on navigation list
    Then User must see Demographics details
    And I click on Population item on navigation list
    Then User must see the Population details
    And I click on Education item on navigation list
    Then User must see the Education details
    And I click on Family & Living Environment item on navigation list
    Then User must see Family & Living Environment
    And I click on Poverty on navigation list
    Then User must see Poverty details

