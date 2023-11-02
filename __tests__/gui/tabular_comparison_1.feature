Feature: Tabular Comparison
  This feature allow the users to view tabular comparison view

  Scenario: Verify that the tabular comparison view works correctly

    Given I am on the tabular comparison view
    Then I wait until view is ready

    And I click on geography autocomplete
    Then I assert initial click on dropdown
    Then I search for test123 in geography autocomplete
    Then I assert no options in dropdown
    Then I search for eastern in geography autocomplete
    Then I select Eastern Cape in autocomplete dropdown

    And I click on add indicator
    Then I click on indicator autocomplete
    Then I search for Language in indicator autocomplete
    Then I select Language most spoken at home in autocomplete dropdown
    Then I click on category autocomplete
    Then I search for English in category autocomplete
    Then I select English in autocomplete dropdown
    Then I check result table

    And I click on add indicator
    Then I click on indicator autocomplete
    Then I search for Employment in indicator autocomplete
    Then I select Employment status in autocomplete dropdown
    Then I click on category autocomplete
    Then I search for Unemployed in category autocomplete
    Then I select Unemployed in autocomplete dropdown
    Then I check result table after adding second indicator

    And I click on geography autocomplete
    Then I clear the geography autocomplete field
    Then I search for western in geography autocomplete
    Then I select Western Cape in autocomplete dropdown
    Then I check result table after adding second geography