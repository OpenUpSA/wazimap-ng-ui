# Created by siddharththakur at 22/08/20
Feature: Tutorial (?)
  This feature allow the users to provide the help guides on how to use the website

  Scenario: Verify the sandbox information is displayed
    # Enter steps here
    Given I am on the Wazimap Homepage
    When I click on tutorial
    Then Tutorial dialog box and Introduction should be displayed
    And I click on next
    Then Location Search details should be displayed
    And I click on next
    Then Location Panel details should be displayed
    And I click on next
    Then Rich data details should be displayed
    And I click on next
    Then Point mapper details should be displayed
    And I click on next
    Then Data mapper details should be displayed
    And I click on next
    Then Data Filtering should be displayed
    And I click on next
    Then Learn More should be displayed
    And I click on back arrow
    Then Data Filtering should be displayed
    And I click on close arrow
    But Tutorial dialog box and Introduction should not be displayed