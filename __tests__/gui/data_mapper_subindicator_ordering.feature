Feature: Subindictaor order in Data Mapper

  Scenario: Verify the data mapper is working correctly
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed

    And I click on "Demographics" in Data Mapper
    And I select an indicator
    And I check order of subindicators
    And I select another indicator
    And I check order of subindicators for Population group 2
    And I am on the Wazimap Homepage with updated data
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed
    And I click on "Demographics" in Data Mapper
    And I select an indicator
    And I recheck order of subindicators for Population group
    And I select another indicator
    And I recheck order of subindicators for Population group 2
