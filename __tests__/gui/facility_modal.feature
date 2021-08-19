
Feature: Facility Modal

  Scenario: Verify the print view is correct
    Given I am on the Wazimap Homepage
      Then I wait until map is ready
    And I click on a theme
      Then categories should be displayed
    And I click on a category
      Then I click on a marker
    And I click on the More info button
      Then Facility modal should be visible
    And I switch to print view
      Then I check if the print view is as expected