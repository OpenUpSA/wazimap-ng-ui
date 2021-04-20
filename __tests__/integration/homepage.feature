Feature: Home (?)
  This feature allow the users to navigate the homepage features

  Scenario: Verify the homepage information is displayed
    # Enter steps here
    Given I am on the Wazimap Homepage
    Then Tutorial button should be visible
    And "Tutorial" should be displayed
    Then Panel Toggles should be visible
    And I click on Rich Data panel
    Then "Summary" should be displayed
