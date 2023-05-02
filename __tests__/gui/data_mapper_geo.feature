Feature: Data Mapper

  Scenario: Verify the data mapper is working correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed

    When I click on "Demographics" in Data Mapper
    And I click on "Language" in Data Mapper
    And I click on "Language most spoken at home" in Data Mapper
    And I click on "15-19" in Data Mapper
    Then I check if the choropleth filter dialog is collapsed
    Then I check if mapchip header text contains "15-19"

    And I click on "20-24" in Data Mapper
    Then I check if mapchip header text contains "20-24"

    When I navigate to WC
    Then I wait until map is ready for Western Cape
    Then Data Mapper should be displayed
    Then I check if mapchip header text contains "20-24"

    And I click on "15-19" in Data Mapper
    Then I check if mapchip header text contains "15-19"
