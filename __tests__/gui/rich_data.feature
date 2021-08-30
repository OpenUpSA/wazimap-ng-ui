Feature: Rich data menu
  This feature allow the users to view indicators in rich data as charts and tables 

  Scenario: Verify that an indicator is correct in the rich data menu
    Given I am on the Wazimap Homepage
      Then I wait until map is ready
    And I expand Rich Data
      Then Rich Data should be displayed
    And I mouseover the hamburger menu
      Then the hamburger menu should show
    And I click on Save As Image in Rich Data
