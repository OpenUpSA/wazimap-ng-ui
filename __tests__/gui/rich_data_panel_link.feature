Feature: Rich Data Panel Link

  Scenario: Verify that rich data panel link is only shown when certain conditions are met
    Given I am on the Wazimap Homepage
    Then I wait until map is ready
    Then I expand Data Mapper
    Then I check if there are 3 categories
    Then I check if rich data panel link is present
    Then I click on rich data panel link
    Then I check if rich data panel is open
    Then I check if the location facilities is visible
    Then I check if rich data panel has data
    Then I expand Data Mapper

    When I visit Western Cape
    Then I wait until map is ready for Western Cape
    Then I check if there are 2 categories
    Then I check if rich data panel link is present
    Then I click on rich data panel link
    Then I check if rich data panel is open
    Then I check if the location facilities is hidden
    Then I check if rich data panel has data
    Then I expand Data Mapper

    When I visit City of Cape Town
    Then I wait until map is ready for City of Cape Town
    Then I check if there are 0 categories
    Then I check if rich data panel link is present
    Then I click on rich data panel link
    Then I check if rich data panel is open
    Then I check if the location facilities is visible
    Then I check if rich data panel is empty
    Then I expand Data Mapper

    When I visit Overberg
    Then I wait until map is ready for Overberg
    Then I check if there are 0 categories
    Then I check if rich data panel link is hidden
    Then I open rich data panel
    Then I check if the location facilities is hidden
    Then I check if rich data panel is empty
    Then I expand Data Mapper

    When I revisit Western Cape
    Then I wait until map is ready for Western Cape
    Then I check if rich data panel link is present
