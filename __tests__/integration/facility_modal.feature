#
Feature: Facility Modal

  Scenario: Verify the print view is correct
    Given I am on the Wazimap Homepage
      Then I wait for 5s
    When I click on Higher Education
      Then "TVET colleges" should be displayed
