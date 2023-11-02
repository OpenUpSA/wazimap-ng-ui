Feature: Tabular Comparison
  This feature allow the users to view tabular comparison view

  Scenario: Verify that the tabular comparison results shows 0 if data for specific filter does not exist

    Given I am on the tabular comparison view
    Then I wait until view is ready

    And I click on geography autocomplete
    Then I assert initial click on dropdown
    Then I search for eastern in geography autocomplete
    Then I select Eastern Cape in autocomplete dropdown

    And I click on add indicator
    Then I click on indicator autocomplete
    Then I search for Limited in indicator autocomplete
    Then I select Limited value indicator in autocomplete dropdown
    Then I check if filters for indicator panel 1 is not visible
    Then I click on category autocomplete
    Then I search for English in category autocomplete
    Then I select English in autocomplete dropdown
    Then I check if filters for indicator panel 1 is visible
    Then I check if filter row count for indicator panel 1 is 1
    Then I check "group" selected for filter at index 0 of indicator panel 1 is "age group"
    Then I check "value" selected for filter at index 0 of indicator panel 1 is "15-19"
    Then I assert value for index 1 column is "8,374"
    Then I change "value" dropdown for filter at index 0 of indicator panel 1 to "30-35"
    Then I assert value for index 1 column is "0"
