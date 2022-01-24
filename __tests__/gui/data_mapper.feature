Feature: Facility Modal

  Scenario: Verify the data mapper is working correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed

    And I click on Demographics in Data Mapper
    And I select an indicator
    And I select another indicator
    Then I check if choropleth legend is displayed
    Then I check if everything is zero

    And I collapse the filter dialog
    Then I check if the filter dialog is collapsed

    And I expand the filter dialog
    Then I check if the filter dialog is expanded

    And I navigate to EC and check if the loading state is displayed correctly