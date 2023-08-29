Feature: Mapchip Filter Row

  Scenario: Verify the filter rows are populated correctly even when the non-aggregatable column is the primary group
    Given I am on the Wazimap Homepage
    Then I wait until map is ready

    And I expand Data Mapper
    Then Data Mapper should be displayed

    # Select an indicator which is configured to have the primary group as non-aggregatable
    And I click on "Elections" in Data Mapper
    And I click on "2016 Municipal elections" in Data Mapper
    And I click on "Voter turnout" in Data Mapper
    And I click on "Didn't vote" in Data Mapper
    And I expand filter dialog

    # Select another indicator
    And I click on "Number of registered voters by age" in Data Mapper
    And I click on "18-19" in Data Mapper
    And I filter by "gender:Female"
    Then I confirm that the choropleth is filtered by "gender:Female"

    # Confirm the primary group is not filterable
    And I click on "Elections" in Data Mapper
    And I click on "Demographics" in Data Mapper
    And I click on "Population (2016 Community Survey)" in Data Mapper
    And I click on "Population group" in Data Mapper
    And I click on "Indian/asian" in Data Mapper
    And I click on the first filter dropdown
    Then I check if the filter options are "All values, age, sex"

    # If all the groups are non-aggregatable
    And I click on "Demographics" in Data Mapper
    And I click on "Economic Opportunities" in Data Mapper
    And I click on "NEET Status" in Data Mapper
    And I click on "Not in Employment" in Data Mapper
    And I click on "School/post-school" in Data Mapper
    Then I confirm that the choropleth is filtered by "age group:15-35 (ZA)"