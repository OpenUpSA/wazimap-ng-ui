Feature: Rich data menu
  This feature allow the users to view indicators in rich data as charts and tables

  Scenario: Verify that the rich data menu works correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Rich Data
    Then Rich Data should be displayed
    Then None of the menu items should be active

    And I mouseover the hamburger menu
    Then the hamburger menu should show
    Then I click on Save As Image in Rich Data
    Then I check if "Test Category 1" is active

    And I scroll to bottom of the page
    Then I check if "Test Category 3" is active

    And I close the Rich Data
    Then I expand Rich Data
    Then Rich Data should be displayed
    Then None of the menu items should be active
    Then I check if the indicator with only zero counts is hidden