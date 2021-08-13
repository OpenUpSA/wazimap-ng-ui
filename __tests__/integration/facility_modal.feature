
Feature: Facility Modal

  Scenario: Verify the print view is correct
    Given I am on the Wazimap Homepage
      Then I wait until map is ready
    And I click on a theme
      Then categories should be displayed
    And I click on a category
      Then I wait for 2s
    And I click on a marker