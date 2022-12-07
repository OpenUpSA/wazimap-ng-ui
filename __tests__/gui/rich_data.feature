Feature: Rich data menu
  This feature allow the users to view indicators in rich data as charts and tables

  Scenario: Verify that the rich data menu works correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Rich Data
    Then Rich Data should be displayed
    Then None of the menu items should be active
    Then I confirm that the categories are in correct order

    And I mouseover the hamburger menu
    Then the hamburger menu should show

    And I click on Save As Image in Rich Data
    Then I check if "Test Category 4" is active

    And I scroll to bottom of the page
    Then I check if "Test Category 1" is active
    Then I confirm that the subcategories are in correct order
    Then I confirm that the indicators are in correct order

    And I close the Rich Data
    And I expand Rich Data
    Then Rich Data should be displayed
    Then None of the menu items should be active
    Then I check if the indicator with only zero counts is visible

    # confirm the visibility of the categories & subcategories
    Then I confirm that the category "Category with no subcategories" is invisible
    Then I confirm that the category "Category with no indicators" is invisible
    Then I confirm that the subcategory "Subcategory with no indicators" is invisible
    Then I confirm that the subcategory "Subcategory with indicators" is visible