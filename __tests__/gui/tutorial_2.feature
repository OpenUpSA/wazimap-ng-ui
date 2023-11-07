Feature: Tutorial 2
  This tests the default tutorial if custom tutorial config does not exists

  Scenario: Verify the sandbox information is displayed
    Given I am on the Wazimap Homepage
    Then I wait until map is ready
    When I click on Tutorial
    Then I check if the slide 1 is displayed correctly
    And I click on Next
    Then I check if the slide 2 is displayed correctly
    And I click on Next
    Then I check if the slide 3 is displayed correctly
    And I click on Next
    Then I check if the slide 4 is displayed correctly
    And I click on Next
    Then I check if the slide 5 is displayed correctly
    And I click on Next
    Then I check if the slide 6 is displayed correctly
    And I click on Next
    Then I check if the slide 7 is displayed correctly
    And I click on Next
    Then I check if the slide 8 is displayed correctly
