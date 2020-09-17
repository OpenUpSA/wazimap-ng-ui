# Created by siddharththakur at 22/08/20
Feature: Tutorial (?)
  This feature allow the users to provide the help guides on how to use the website

  Scenario: Verify the sandbox information is displayed
    # Enter steps here
    Given I am on the Wazimap Homepage
    When I click on Tutorial
		Then "Introduction:" should be displayed
    And I click on Next
		Then "Location Search:" should be displayed
    And I click on Next
		Then "Location Panel:" should be displayed
    And I click on Next
		Then "Rich data:" should be displayed
    And I click on Next
		Then "Point mapper:" should be displayed
    And I click on Next
    Then Data mapper details should be displayed
    And I click on Next
    Then Data Filtering should be displayed
    And I click on Next
    Then Learn More should be displayed
    And I click on back arrow
    Then Data Filtering should be displayed
    And I click on close arrow
    But Tutorial dialog box and Introduction should not be displayed
