Feature: Facility Modal

  Scenario: Verify the print view is correct
    Given I am on the Wazimap Homepage
      Then I wait until map is ready
    And I expand Data Mapper
      Then Data Mapper should be displayed
    And I click on Demographics in Data Mapper
      Then I select an indicator
    And I select another indicator
      Then I check if everything is zero
    And I navigate to EC and check if the loading state is displayed correctly