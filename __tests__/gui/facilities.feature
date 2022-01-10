Feature: Facilities

  Scenario: Verify that facilities are created correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    When I expand Rich Data Panel
    And I click on Show Locations button
    Then I check if the location count is correct
    Then I check if the facilities are created correctly
    Then I navigate to EC and check if the loading state is displayed correctly

    When I navigate to a geography with no points
    And I wait until "City of Cape Town" is ready
    Then Facilities should not be visible

    When I navigate back to ZA
    And I wait until "South Africa Test" is ready
    Then Facilities should be visible