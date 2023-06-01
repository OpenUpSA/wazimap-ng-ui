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
    And I wait until "Northern Cape" is ready
    Then Facilities should not be visible

    When I collapse Rich Data Panel
    And I navigate back to ZA
    And I expand Rich Data Panel
    And I wait until "South Africa Test" is ready
    Then Facilities should be visible

    # test the failed state
    When I navigate to a geography where themes-count endpoint fails
    And I wait until "Western Cape" is ready
    Then I check if error message is displayed on the theme count section

    # confirm that after navigating back to ZA everything works correctly
    When I collapse Rich Data Panel
    And I navigate back to ZA
    And I expand Rich Data Panel
    And I click on Show Locations button
    Then I check if the location count is correct
    Then I check if the facilities are created correctly
    Then I navigate to EC and check if the loading state is displayed correctly