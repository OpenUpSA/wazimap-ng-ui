Feature: LinearScrubber

  Scenario: Verify the linear scrubber is working correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed

    And I click on "Demographics" in Data Mapper
    And I select an indicator
    Then I check if scrubber is visible
    Then I check number of marks on scrubber
    Then I check if Black African is selected on scrubber

    And I click on next mark
    Then I check if White is selected on scrubber
    Then I check if mapchip title name is changed

    And I select next indicator
    Then I check if scrubber is not visible

    And I select Population indicator and White subindicator
    Then I check if White is selected on scrubber
    Then I select Black african subindicator
    Then I check if Black African is selected on scrubber
    Then I expand choropleth filter dialog
    Then I apply filters
    Then I click on next mark
    Then I check if White is selected on scrubber
    Then I check if filters are still applied
