Feature: Facilities

  Scenario: Verify that facilities are created correctly
    Given I am on the Wazimap Homepage
      Then I wait until map is ready
    And I expand Rich Data Panel
      Then I click on Show Locations button
    And I check if the location count is correct
      Then I check if the facilities are created correctly
    And I navigate to EC and check if the loading state is displayed correctly