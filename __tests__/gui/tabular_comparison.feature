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

    And I click on add indictor
    Then I click on indicator autocomplete
    Then I search for Language in indicator autocomplete
    Then I select Language most spoken at home in autocomplete dropdown
    Then I click on category autocomplete
    Then I search for English in category autocomplete
    Then I select English in autocomplete dropdown
    Then I check result table

    And I click on add indictor
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

  Scenario: Verify that the tabular comparison indicator filters works correctly

    Given I am on the tabular comparison view
    Then I wait until view is ready

    And I click on geography autocomplete
    Then I assert initial click on dropdown
    Then I search for eastern in geography autocomplete
    Then I select Eastern Cape in autocomplete dropdown

    And I click on add indictor
    Then I click on indicator autocomplete
    Then I search for Language in indicator autocomplete
    Then I select Language most spoken at home in autocomplete dropdown
    Then I check if filters for indictaor panel 1 is not visible
    Then I click on category autocomplete
    Then I search for English in category autocomplete
    Then I select English in autocomplete dropdown
    Then I check if filters for indictaor panel 1 is visible
    Then I check if filter row count for indictaor panel 1 is 1

    ## Testing if non aggregatable groups are automatically added as filters
    ## Testing if default filter value is selected if default is added for aggregatable group
    Then I check "group" selected for filter at index 0 of indicator panel 1 is "age group"
    Then I check "group" dropdown for filter at index 0 of indicator panel 1 is disabled
    Then I check "value" selected for filter at index 0 of indicator panel 1 is "15-35 (ZA)"
    Then I check "value" dropdown for filter at index 0 of indicator panel 1 is enabled

    # Check results table
    Then I assert title on index 1 of result table header is "Language most spoken at home"
    Then I assert category chip value on index 1 of result table header is "English"
    Then I assert filter chip values on index 1 of result tavle header is "15-35 (ZA)"
    Then I assert value for index 1 column is "119,035"

    # Change non aggregatable filter value and see if results page change
    Then I change "value" dropdown for filter at index 0 of indicator panel 1 to "30-35"
    Then I assert filter chip values on index 1 of result tavle header is "30-35"
    Then I assert value for index 1 column is "27,950"

    # Add one custom filter and see if results page change
    Then I click on add filter button for indicator panel 1
    Then I check if filter row count for indictaor panel 1 is 2
    Then I check "group" selected for filter at index 1 of indicator panel 1 is "attribute"
    Then I check "group" dropdown for filter at index 1 of indicator panel 1 is enabled
    Then I check "value" selected for filter at index 1 of indicator panel 1 is "value"
    Then I check "value" dropdown for filter at index 1 of indicator panel 1 is disabled
    Then I change "group" dropdown for filter at index 1 of indicator panel 1 to "gender"
    Then I check "value" dropdown for filter at index 1 of indicator panel 1 is enabled
    Then I change "value" dropdown for filter at index 1 of indicator panel 1 to "Female"
    Then I assert title on index 1 of result table header is "Language most spoken at home"
    Then I assert category chip value on index 1 of result table header is "English"
    Then I assert filter chip values on index 1 of result tavle header is "30-35,Female"
    Then I assert value for index 1 column is "13,971"

    ## Testing if non aggregatable groups are automatically added as filters
    ## Testing if first filter value is selected if default does not exist for aggregatable group
    And I click on add indictor
    Then I click on indicator autocomplete
    Then I search for Employment in indicator autocomplete
    Then I select Employment status in autocomplete dropdown
    Then I check if filters for indictaor panel 2 is not visible
    Then I click on category autocomplete
    Then I search for Unemployed in category autocomplete
    Then I select Unemployed in autocomplete dropdown
    Then I check if filters for indictaor panel 2 is visible
    Then I check if filter row count for indictaor panel 2 is 1

    # Testing selected filters
    Then I check "group" selected for filter at index 0 of indicator panel 2 is "age group"
    Then I check "group" dropdown for filter at index 0 of indicator panel 2 is disabled
    Then I check "value" selected for filter at index 0 of indicator panel 2 is "20-24"
    Then I check "value" dropdown for filter at index 0 of indicator panel 2 is enabled

    # Check results table
    Then I assert title on index 2 of result table header is "Employment status"
    Then I assert category chip value on index 2 of result table header is "Unemployed"
    Then I assert filter chip values on index 2 of result tavle header is "20-24"
    Then I assert value for index 2 column is "22.55%"

    ## Testing if Default filters are automatically added as filters
    And I click on add indictor
    Then I click on indicator autocomplete
    Then I search for Household in indicator autocomplete
    Then I select Household adult employment in autocomplete dropdown
    Then I check if filters for indictaor panel 3 is not visible
    Then I click on category autocomplete
    Then I search for No in category autocomplete
    Then I select No employed adult in autocomplete dropdown
    Then I check if filters for indictaor panel 3 is visible
    Then I check if filter row count for indictaor panel 3 is 1

    # Testing selected filters
    Then I check "group" selected for filter at index 0 of indicator panel 3 is "age group"
    Then I check "group" dropdown for filter at index 0 of indicator panel 3 is enabled
    Then I check "value" selected for filter at index 0 of indicator panel 3 is "15-35 (ZA)"
    Then I check "value" dropdown for filter at index 0 of indicator panel 3 is enabled

    # Check results table
    Then I assert title on index 3 of result table header is "Household adult employment"
    Then I assert category chip value on index 3 of result table header is "No employed adult"
    Then I assert filter chip values on index 3 of result tavle header is "15-35 (ZA)"
    Then I assert value for index 3 column is "54%"

    # Check expanded results table
    And I expand table header row
    Then I assert header on index 1 has untruncate class
    Then I assert title on index 1 of result table header is "Language most spoken at home"
    Then I assert category chip value on index 1 of result table header is "Category: English"
    Then I assert filter chip values on index 1 of result tavle header is "age group: 30-35,gender: Female"
    Then I assert value for index 1 column is "13,971"

    Then I assert header on index 2 has untruncate class
    Then I assert title on index 2 of result table header is "Employment status"
    Then I assert category chip value on index 2 of result table header is "Category: Unemployed"
    Then I assert filter chip values on index 2 of result tavle header is "age group: 20-24"
    Then I assert value for index 2 column is "22.55%"

    Then I assert header on index 3 has untruncate class
    Then I assert title on index 3 of result table header is "Household adult employment"
    Then I assert category chip value on index 3 of result table header is "Category: No employed adult"
    Then I assert filter chip values on index 3 of result tavle header is "age group: 15-35 (ZA)"
    Then I assert value for index 3 column is "54%"

    # Remove category for indicator panel 1 and see changes in result header
    When I clear category autocomplete on indicator panel 1
    Then I check if filters for indictaor panel 1 is not visible
    Then I assert title on index 1 of result table header is "Language most spoken at home"
    Then I assert category chip value on index 1 of result table header is "No category selected"

  Scenario: Verify that the tabular comparison results shows empty col for data does not exist

    Given I am on the tabular comparison view
    Then I wait until view is ready

    And I click on geography autocomplete
    Then I assert initial click on dropdown
    Then I search for eastern in geography autocomplete
    Then I select Eastern Cape in autocomplete dropdown

    And I click on add indictor
    Then I click on indicator autocomplete
    Then I search for Empty in indicator autocomplete
    Then I select Empty indicator in autocomplete dropdown
    Then I check if filters for indictaor panel 1 is not visible
    Then I click on category autocomplete
    Then I search for English in category autocomplete
    Then I select English in autocomplete dropdown
    Then I check if filters for indictaor panel 1 is visible
    Then I check if filter row count for indictaor panel 1 is 1
    Then I assert value for index 1 column is empty

  Scenario: Verify that the tabular comparison results shows 0 if data for specific filter does not exist

    Given I am on the tabular comparison view
    Then I wait until view is ready

    And I click on geography autocomplete
    Then I assert initial click on dropdown
    Then I search for eastern in geography autocomplete
    Then I select Eastern Cape in autocomplete dropdown

    And I click on add indictor
    Then I click on indicator autocomplete
    Then I search for Limited in indicator autocomplete
    Then I select Limited value indicator in autocomplete dropdown
    Then I check if filters for indictaor panel 1 is not visible
    Then I click on category autocomplete
    Then I search for English in category autocomplete
    Then I select English in autocomplete dropdown
    Then I check if filters for indictaor panel 1 is visible
    Then I check if filter row count for indictaor panel 1 is 1
    Then I check "group" selected for filter at index 0 of indicator panel 1 is "age group"
    Then I check "value" selected for filter at index 0 of indicator panel 1 is "15-19"
    Then I assert value for index 1 column is "8,374"
    Then I change "value" dropdown for filter at index 0 of indicator panel 1 to "30-35"
    Then I assert value for index 1 column is "0"
