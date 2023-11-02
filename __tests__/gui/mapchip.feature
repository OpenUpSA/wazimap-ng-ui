Feature: Mapchip

  Scenario: Verify the mapchip is working correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed

    And I click on "Demographics" in Data Mapper
    And I select an indicator
    Then I check if the choropleth filter dialog is collapsed
    Then I check if choropleth legend is displayed
    Then I check if description icon is visible
    Then I check if tooltip is displayed on hover over description icon
    Then I check filters applied label is visible
    Then I check if tooltip is displayed on hover over applied filters label
    Then I check applied filter label text
    Then I check applied filters does not have notification badge

    And I expand the choropleth filter dialog
    Then I check filters applied label is hidden
    Then I check if there is description
    Then I select a filter
    Then I add new filter
    Then I check if the add new filter button is disabled

    And I collapse the choropleth filter dialog
    Then I recheck filters applied label is visible
    Then I recheck applied filter label text


    And I click on "Demographics" in Data Mapper
    And I click on Economic Opportunities in Data Mapper
    Then I select another indicator
    Then I check if snackbar is visible
    Then I wait for snackbar to disappear
    Then I check if snackbar is not visible
    Then I recheck if the choropleth filter dialog is collapsed
    Then I recheck filters applied label is visible
    Then I recheck again applied filter label text
    Then I check applied filters show notification badge

    And I click on the choropleth filter dialog
    Then I check filters applied label is hidden
    Then I check if there is no description

    And I collapse the choropleth filter dialog
    Then I recheck filters applied label is visible
    Then I check applied filters does not have notification badge
